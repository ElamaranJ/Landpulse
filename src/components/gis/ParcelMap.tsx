import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Polyline,
  useMap,
  useMapEvents
} from 'react-leaflet';
import L from 'leaflet';
import { Parcel, ParcelStatus } from '../../types/parcel';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Compass,
  Navigation,
  CheckCircle2,
  Eye
} from 'lucide-react';

export interface ParcelMapProps {
  parcels: Parcel[];
  selectedParcelId?: string | null;
  highlightParcelId?: string | null;
  onParcelSelect?: (parcel: Parcel) => void;
  defaultLayer?: 'satellite' | 'street';
  officerLocation?: [number, number] | null;
  showRouteToSelected?: boolean;
  className?: string;
  height?: string;
  showLegend?: boolean;
  showControls?: boolean;
  straightPath?: [number, number][];
  optimizedPath?: [number, number][];
  alignmentOrigin?: [number, number];
  alignmentDestination?: [number, number];
  onMapClickForCoords?: (lat: number, lng: number) => void;
}

// Status styling configuration
const STATUS_COLORS: Record<ParcelStatus, { fill: string; stroke: string; label: string }> = {
  completed: {
    fill: '#22c55e',
    stroke: '#16a34a',
    label: 'Completed / Acquired'
  },
  in_progress: {
    fill: '#eab308',
    stroke: '#ca8a04',
    label: 'In Progress / Valuation'
  },
  dispute: {
    fill: '#ef4444',
    stroke: '#dc2626',
    label: 'Dispute / Litigated'
  },
  not_started: {
    fill: '#94a3b8',
    stroke: '#64748b',
    label: 'Not Started / Pending'
  }
};

// Create custom pulsing Leaflet DivIcon for inspection badges
const createInspectionIcon = (priority: 'high' | 'medium' | 'low', surveyNo: string) => {
  const badgeColor =
    priority === 'high'
      ? 'background-color: #dc2626; color: #ffffff;'
      : priority === 'medium'
      ? 'background-color: #d97706; color: #ffffff;'
      : 'background-color: #2563eb; color: #ffffff;';

  const pulseClass =
    priority === 'high'
      ? 'map-inspection-pulse-high'
      : priority === 'medium'
      ? 'map-inspection-pulse-medium'
      : 'map-inspection-pulse-low';

  return L.divIcon({
    className: 'custom-inspection-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
        <div class="${pulseClass}" style="${badgeColor} padding: 2px 6px; border: 1.5px solid #ffffff; border-radius: 3px; font-weight: bold; font-size: 10px; font-family: Arial, sans-serif; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; gap: 3px; white-space: nowrap;">
          <span>⚠️</span>
          <span>${surveyNo}</span>
        </div>
      </div>
    `,
    iconSize: [75, 24],
    iconAnchor: [37, 12]
  });
};

// Create officer GPS location pin
const createOfficerIcon = () => {
  return L.divIcon({
    className: 'custom-officer-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
        <div class="map-officer-radar" style="width: 22px; height: 22px; border-radius: 50%; background-color: #0B3D66; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center;">
          <div style="width: 6px; height: 6px; background-color: #ffffff; border-radius: 50%;"></div>
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

// Create endpoint marker pin (A for Origin, B for Destination)
const createEndpointIcon = (label: string, color: string) => {
  return L.divIcon({
    className: 'custom-endpoint-pin',
    html: `
      <div style="background-color: ${color}; color: #ffffff; width: 22px; height: 22px; border-radius: 2px; border: 2px solid #ffffff; font-weight: bold; font-size: 11px; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 4px rgba(0,0,0,0.4); font-family: Arial, sans-serif;">
        ${label}
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

function MapClickHandler({ onClick }: { onClick?: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      if (onClick) {
        onClick(e.latlng.lat, e.latlng.lng);
      }
    }
  });
  return null;
}

const MapFocusController: React.FC<{
  targetCentroid?: [number, number] | null;
  targetBounds?: [number, number][] | null;
  forceZoom?: number;
}> = ({ targetCentroid, targetBounds, forceZoom = 17 }) => {
  const map = useMap();

  useEffect(() => {
    if (targetBounds && targetBounds.length > 0) {
      const bounds = L.latLngBounds(targetBounds.map(pt => L.latLng(pt[0], pt[1])));
      map.flyToBounds(bounds, {
        padding: [50, 50],
        duration: 1.0,
        easeLinearity: 0.25,
        maxZoom: 18
      });
    } else if (targetCentroid) {
      map.flyTo(targetCentroid, forceZoom, {
        duration: 1.0,
        easeLinearity: 0.25
      });
    }
  }, [targetCentroid, targetBounds, forceZoom, map]);

  return null;
};

export const ParcelMap: React.FC<ParcelMapProps> = ({
  parcels,
  selectedParcelId,
  highlightParcelId,
  onParcelSelect,
  defaultLayer = 'satellite',
  officerLocation,
  showRouteToSelected = true,
  className = '',
  height = '100%',
  showLegend = true,
  showControls = true,
  straightPath,
  optimizedPath,
  alignmentOrigin,
  alignmentDestination,
  onMapClickForCoords
}) => {
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'street'>(defaultLayer);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [activeParcel, setActiveParcel] = useState<Parcel | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  const effectiveSelectedId = highlightParcelId || selectedParcelId || activeParcel?.id;
  const currentParcel = parcels.find(p => p.id === effectiveSelectedId) || null;

  const defaultCenter: [number, number] =
    currentParcel?.centroid ||
    alignmentOrigin ||
    (parcels.length > 0 ? parcels[0].centroid : [19.7120, 72.8250]);

  const handlePolygonClick = (parcel: Parcel) => {
    setActiveParcel(parcel);
    if (onParcelSelect) {
      onParcelSelect(parcel);
    }
  };

  const handleViewSatellite = (parcel: Parcel) => {
    setActiveLayer('satellite');
    setActiveParcel(parcel);
    if (onParcelSelect) {
      onParcelSelect(parcel);
    }
  };

  const getGoogleMapsNavUrl = (centroid: [number, number]) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${centroid[0]},${centroid[1]}`;
  };

  return (
    <div className={`relative w-full overflow-hidden border border-slate-300 bg-white font-sans ${className}`} style={{ height }}>
      {/* ── Top Layer Switcher ── */}
      {showControls && (
        <div className="absolute top-3 right-3 z-[1000] flex items-center bg-white border border-slate-300 rounded shadow-sm text-xs font-bold p-0.5">
          <button
            type="button"
            onClick={() => setActiveLayer('street')}
            className={`px-3 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'street'
                ? 'bg-[#0B3D66] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Street View</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`px-3 py-1 rounded-xs transition-all cursor-pointer flex items-center gap-1.5 ${
              activeLayer === 'satellite'
                ? 'bg-[#0B3D66] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Satellite View</span>
          </button>
        </div>
      )}

      {/* ── Active Layer Indicator ── */}
      <div className="absolute top-3 left-3 z-[1000] hidden sm:flex items-center gap-2 px-2.5 py-1 bg-white border border-slate-300 text-xs shadow-sm rounded text-slate-700 font-bold">
        <Compass className="w-3.5 h-3.5 text-[#0B3D66]" />
        <span>
          Basemap: <strong className="text-[#0B3D66]">{activeLayer === 'satellite' ? 'Esri Satellite Imagery' : 'OpenStreetMap'}</strong>
        </span>
        <span className="text-slate-400">|</span>
        <span className="text-slate-600 font-mono text-[11px]">{parcels.length} Polygons</span>
      </div>

      {/* ── Map Container ── */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#F1F5F9' }}
        attributionControl={false}
      >
        {activeLayer === 'street' && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            attribution='&copy; OpenStreetMap'
          />
        )}

        {activeLayer === 'satellite' && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
            attribution='Tiles &copy; Esri'
          />
        )}

        {currentParcel && (
          <MapFocusController
            targetCentroid={currentParcel.centroid}
            targetBounds={currentParcel.coordinates}
          />
        )}

        {parcels.map(parcel => {
          const isSelected = parcel.id === effectiveSelectedId;
          const isHovered = parcel.id === hoveredParcelId;
          const statusStyle = STATUS_COLORS[parcel.status] || STATUS_COLORS.not_started;

          return (
            <Polygon
              key={parcel.id}
              positions={parcel.coordinates}
              pathOptions={{
                color: isSelected ? '#0284c7' : statusStyle.stroke,
                fillColor: statusStyle.fill,
                fillOpacity: isSelected ? 0.7 : isHovered ? 0.6 : 0.45,
                weight: isSelected ? 3.5 : isHovered ? 2.5 : 1.5,
                dashArray: parcel.status === 'not_started' ? '4, 4' : undefined
              }}
              eventHandlers={{
                click: () => handlePolygonClick(parcel),
                mouseover: () => setHoveredParcelId(parcel.id),
                mouseout: () => setHoveredParcelId(null)
              }}
            >
              <Popup
                ref={popupRef}
                minWidth={260}
              >
                <div className="p-3 bg-white text-slate-800 rounded font-sans text-xs">
                  <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-1.5 mb-2">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-500">Cadastral Parcel</span>
                      <div className="text-sm font-bold text-[#0B3D66] font-mono">
                        Survey No: {parcel.surveyNo}
                      </div>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded-xs text-[10px] font-bold text-white uppercase"
                      style={{ backgroundColor: statusStyle.stroke }}
                    >
                      {parcel.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="space-y-1 text-slate-700 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Landowner:</span>
                      <strong className="text-slate-900">{parcel.owner}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Area:</span>
                      <strong className="text-slate-900 font-mono">{parcel.area}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">District:</span>
                      <span>{parcel.district}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Project:</span>
                      <span className="truncate max-w-[130px]">{parcel.project}</span>
                    </div>

                    {parcel.inspection?.required && (
                      <div className="mt-2 p-1.5 bg-red-50 border border-red-200 rounded text-[11px] text-red-900">
                        <strong>Inspection Required ({parcel.inspection.priority}):</strong>
                        <p className="mt-0.5">{parcel.inspection.reason}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewSatellite(parcel)}
                      className="gov-btn-secondary text-[11px] py-1 cursor-pointer justify-center"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Satellite</span>
                    </button>
                    <a
                      href={getGoogleMapsNavUrl(parcel.centroid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="gov-btn-primary text-[11px] py-1 cursor-pointer justify-center"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Navigate</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {parcels
          .filter(p => p.inspection?.required)
          .map(parcel => (
            <Marker
              key={`insp-${parcel.id}`}
              position={parcel.centroid}
              icon={createInspectionIcon(parcel.inspection.priority, parcel.surveyNo)}
              eventHandlers={{
                click: () => handlePolygonClick(parcel)
              }}
            />
          ))}

        {officerLocation && (
          <Marker
            position={officerLocation}
            icon={createOfficerIcon()}
          >
            <Popup>
              <div className="p-1 text-center font-bold text-xs text-[#0B3D66]">
                📍 Field Officer Current Location
              </div>
            </Popup>
          </Marker>
        )}

        {showRouteToSelected && officerLocation && currentParcel && (
          <Polyline
            positions={[officerLocation, currentParcel.centroid]}
            pathOptions={{
              color: '#0B3D66',
              weight: 2.5,
              dashArray: '5, 5',
              opacity: 0.8
            }}
          />
        )}

        {/* ── Least-Cost Corridor Alignment Polylines ── */}
        {onMapClickForCoords && (
          <MapClickHandler onClick={onMapClickForCoords} />
        )}

        {straightPath && straightPath.length >= 2 && (
          <Polyline
            positions={straightPath}
            pathOptions={{
              color: '#64748B',
              weight: 2.5,
              dashArray: '6, 6',
              opacity: 0.85
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong>Straight-Line Baseline Corridor</strong>
                <div className="text-slate-500">Unconstrained path</div>
              </div>
            </Popup>
          </Polyline>
        )}

        {optimizedPath && optimizedPath.length >= 2 && (
          <Polyline
            positions={optimizedPath}
            pathOptions={{
              color: '#0284C7',
              weight: 4,
              opacity: 0.95
            }}
          >
            <Popup>
              <div className="p-1 font-sans text-xs">
                <strong className="text-[#0B3D66]">Least-Cost Optimized Alignment (A*)</strong>
                <div className="text-emerald-700 font-semibold">Minimizes agricultural land &amp; dispute zones</div>
              </div>
            </Popup>
          </Polyline>
        )}

        {alignmentOrigin && (
          <Marker
            position={alignmentOrigin}
            icon={createEndpointIcon('A', '#16A34A')}
          >
            <Popup>
              <div className="p-1 text-xs">
                <strong>Corridor Origin (A)</strong>: [{alignmentOrigin[0].toFixed(4)}, {alignmentOrigin[1].toFixed(4)}]
              </div>
            </Popup>
          </Marker>
        )}

        {alignmentDestination && (
          <Marker
            position={alignmentDestination}
            icon={createEndpointIcon('B', '#DC2626')}
          >
            <Popup>
              <div className="p-1 text-xs">
                <strong>Corridor Destination (B)</strong>: [{alignmentDestination[0].toFixed(4)}, {alignmentDestination[1].toFixed(4)}]
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>

      {/* ── Official Government Legend Overlay ── */}
      {showLegend && (
        <div className="absolute bottom-3 left-3 z-[1000] p-2.5 bg-white border border-slate-300 shadow-md text-xs max-w-xs rounded-xs">
          <div className="font-bold text-[#0B3D66] mb-1.5 pb-1 border-b border-slate-200">
            Cadastral Status Legend
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#22c55e] border border-emerald-600 inline-block"></span>
              <span>Completed</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#eab308] border border-amber-600 inline-block"></span>
              <span>In Progress</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#ef4444] border border-red-600 inline-block"></span>
              <span>Dispute</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-[#94a3b8] border border-slate-500 inline-block"></span>
              <span>Not Started</span>
            </div>
          </div>
          <div className="mt-1.5 pt-1 border-t border-slate-200 text-[10px] text-red-700 font-bold flex items-center gap-1">
            <span>⚠️ Badge: Action / Inspection Required</span>
          </div>

          {(straightPath || optimizedPath) && (
            <div className="mt-1.5 pt-1 border-t border-slate-200 text-[10px] space-y-1">
              <div className="flex items-center gap-1.5">
                <span style={{ width: '16px', height: '0px', borderTop: '2px dashed #64748B', display: 'inline-block' }}></span>
                <span className="text-slate-600 font-medium">Baseline (Straight)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span style={{ width: '16px', height: '0px', borderTop: '3px solid #0284C7', display: 'inline-block' }}></span>
                <span className="text-[#0B3D66] font-bold">Optimized Alignment (A*)</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ParcelMap;

