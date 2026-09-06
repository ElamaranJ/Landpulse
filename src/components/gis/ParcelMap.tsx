import React, { useState, useEffect, useRef } from 'react';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Marker,
  Popup,
  Polyline,
  useMap
} from 'react-leaflet';
import L from 'leaflet';
import { Parcel, ParcelStatus } from '../../types/parcel';
import {
  Layers,
  MapPin,
  AlertTriangle,
  Compass,
  Navigation,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  Clock,
  Eye,
  Maximize2
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
}

// Status styling configuration
const STATUS_COLORS: Record<ParcelStatus, { fill: string; stroke: string; label: string; bgClass: string }> = {
  completed: {
    fill: '#22c55e',
    stroke: '#16a34a',
    label: 'Completed / Acquired',
    bgClass: 'bg-emerald-500'
  },
  in_progress: {
    fill: '#eab308',
    stroke: '#ca8a04',
    label: 'In Progress / Valuation',
    bgClass: 'bg-amber-500'
  },
  dispute: {
    fill: '#ef4444',
    stroke: '#dc2626',
    label: 'Dispute / Litigated',
    bgClass: 'bg-rose-500'
  },
  not_started: {
    fill: '#9ca3af',
    stroke: '#6b7280',
    label: 'Not Started / Pending',
    bgClass: 'bg-slate-400'
  }
};

// Create custom pulsing Leaflet DivIcon for inspection badges
const createInspectionIcon = (priority: 'high' | 'medium' | 'low', surveyNo: string) => {
  const pulseClass =
    priority === 'high'
      ? 'map-inspection-pulse-high bg-rose-600 border-white text-white ring-4 ring-rose-400/40'
      : priority === 'medium'
      ? 'map-inspection-pulse-medium bg-amber-500 border-white text-white ring-4 ring-amber-400/40'
      : 'map-inspection-pulse-low bg-blue-600 border-white text-white ring-4 ring-blue-400/40';

  const badgeText = priority === 'high' ? '🔴' : priority === 'medium' ? '🟡' : '🔵';

  return L.divIcon({
    className: 'custom-inspection-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
        <div class="flex items-center gap-1 px-2 py-1 rounded-full shadow-2xl border-2 font-bold text-xs tracking-tight ${pulseClass}" style="backdrop-filter: blur(4px);">
          <span style="font-size: 11px;">${badgeText}</span>
          <span style="font-size: 10px; font-weight: 800; font-family: 'JetBrains Mono', monospace;">${surveyNo}</span>
        </div>
      </div>
    `,
    iconSize: [80, 30],
    iconAnchor: [40, 15]
  });
};

// Create officer GPS location pin
const createOfficerIcon = () => {
  return L.divIcon({
    className: 'custom-officer-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; transform: translate(-50%, -50%);">
        <div class="w-7 h-7 rounded-full bg-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white map-officer-radar">
          <div class="w-2.5 h-2.5 bg-white rounded-full"></div>
        </div>
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Map controller component for smooth programmatic panning and zooming
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
        padding: [60, 60],
        duration: 1.2,
        easeLinearity: 0.25,
        maxZoom: 18
      });
    } else if (targetCentroid) {
      map.flyTo(targetCentroid, forceZoom, {
        duration: 1.2,
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
  showControls = true
}) => {
  const [activeLayer, setActiveLayer] = useState<'satellite' | 'street'>(defaultLayer);
  const [hoveredParcelId, setHoveredParcelId] = useState<string | null>(null);
  const [activeParcel, setActiveParcel] = useState<Parcel | null>(null);
  const popupRef = useRef<L.Popup | null>(null);

  // Sync active parcel with props
  const effectiveSelectedId = highlightParcelId || selectedParcelId || activeParcel?.id;
  const currentParcel = parcels.find(p => p.id === effectiveSelectedId) || null;

  // Initial centroid fallback: first parcel or Vellore/Ranipet corridor default
  const defaultCenter: [number, number] =
    currentParcel?.centroid ||
    (parcels.length > 0 ? parcels[0].centroid : [12.9290, 79.1444]);

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

  // Google Maps navigation direction URL
  const getGoogleMapsNavUrl = (centroid: [number, number]) => {
    return `https://www.google.com/maps/dir/?api=1&destination=${centroid[0]},${centroid[1]}`;
  };

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-slate-700/60 shadow-2xl bg-slate-900 ${className}`} style={{ height }}>
      {/* ── Top Layer & Basemap Switcher Control ── */}
      {showControls && (
        <div className="absolute top-4 right-4 z-[1000] flex items-center gap-1.5 p-1 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-700/80 shadow-2xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveLayer('street')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'street'
                ? 'bg-blue-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Switch to OpenStreetMap Street View"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Street View</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveLayer('satellite')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeLayer === 'satellite'
                ? 'bg-emerald-600 text-white shadow-md font-bold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title="Switch to Esri High-Resolution Satellite Imagery"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Satellite View</span>
          </button>
        </div>
      )}

      {/* ── Active Layer Indicator Badge ── */}
      <div className="absolute top-4 left-4 z-[1000] hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/70 text-slate-200 text-xs shadow-lg">
        <Compass className="w-3.5 h-3.5 text-blue-400 animate-spin-slow" />
        <span className="font-medium text-slate-300">
          Layer: <strong className="text-white capitalize">{activeLayer === 'satellite' ? 'Esri Satellite Imagery' : 'OpenStreetMap'}</strong>
        </span>
        <span className="text-slate-500">|</span>
        <span className="text-slate-400 font-mono text-[11px]">{parcels.length} GIS Polygons</span>
      </div>

      {/* ── React Leaflet Map Container ── */}
      <MapContainer
        center={defaultCenter}
        zoom={14}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%', background: '#0f172a' }}
        attributionControl={false}
      >
        {/* Layer 1: Street View (OpenStreetMap) */}
        {activeLayer === 'street' && (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}

        {/* Layer 2: Satellite View (Esri World Imagery) */}
        {activeLayer === 'satellite' && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
            attribution='Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
          />
        )}

        {/* Auto Focus / Pan Controller */}
        {currentParcel && (
          <MapFocusController
            targetCentroid={currentParcel.centroid}
            targetBounds={currentParcel.coordinates}
          />
        )}

        {/* ── Parcel Polygons ── */}
        {parcels.map(parcel => {
          const isSelected = parcel.id === effectiveSelectedId;
          const isHovered = parcel.id === hoveredParcelId;
          const statusStyle = STATUS_COLORS[parcel.status] || STATUS_COLORS.not_started;

          return (
            <Polygon
              key={parcel.id}
              positions={parcel.coordinates}
              pathOptions={{
                color: isSelected ? '#38bdf8' : statusStyle.stroke,
                fillColor: statusStyle.fill,
                fillOpacity: isSelected ? 0.75 : isHovered ? 0.65 : 0.45,
                weight: isSelected ? 4 : isHovered ? 3 : 2,
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
                className="custom-leaflet-popup"
                minWidth={280}
              >
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl">
                  {/* Header with Survey No & Status */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2.5 mb-3">
                    <div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Survey Number
                      </div>
                      <div className="text-lg font-black text-white font-mono flex items-center gap-1.5">
                        <MapPin className="w-4 h-4 text-blue-400" />
                        {parcel.surveyNo}
                      </div>
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-md text-[11px] font-bold text-white shadow-sm capitalize"
                      style={{ backgroundColor: statusStyle.stroke }}
                    >
                      {parcel.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Parcel Details Grid */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between py-0.5 text-slate-300">
                      <span className="text-slate-400 font-medium">Landowner:</span>
                      <span className="font-semibold text-white">{parcel.owner}</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-slate-300">
                      <span className="text-slate-400 font-medium">Area / Extent:</span>
                      <span className="font-bold text-emerald-400 font-mono">{parcel.area}</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-slate-300">
                      <span className="text-slate-400 font-medium">District:</span>
                      <span className="font-medium text-slate-200">{parcel.district}</span>
                    </div>
                    <div className="flex justify-between py-0.5 text-slate-300">
                      <span className="text-slate-400 font-medium">Project:</span>
                      <span className="font-medium text-slate-200 text-right truncate max-w-[140px]" title={parcel.project}>
                        {parcel.project}
                      </span>
                    </div>

                    {/* Inspection Notification Banner */}
                    {parcel.inspection?.required && (
                      <div className="mt-3 p-2.5 rounded-lg bg-rose-950/80 border border-rose-600/50 text-rose-200">
                        <div className="flex items-center gap-1.5 text-[11px] font-bold text-rose-400 uppercase tracking-wide">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          Inspection Flag ({parcel.inspection.priority} Priority)
                        </div>
                        <p className="mt-1 text-[11px] leading-relaxed text-rose-100 line-clamp-2">
                          {parcel.inspection.reason}
                        </p>
                        <div className="mt-1.5 text-[10px] text-rose-300 font-mono">
                          Due: {parcel.inspection.dueDate}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleViewSatellite(parcel)}
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Satellite</span>
                    </button>
                    <a
                      href={getGoogleMapsNavUrl(parcel.centroid)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md transition-colors cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>Navigate</span>
                    </a>
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* ── Pulsing Inspection Badges on Centroids ── */}
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

        {/* ── Officer Live GPS Location Pin ── */}
        {officerLocation && (
          <Marker
            position={officerLocation}
            icon={createOfficerIcon()}
          >
            <Popup>
              <div className="p-2 text-center text-slate-900 font-semibold text-xs">
                📍 Field Officer Current Live GPS Position
              </div>
            </Popup>
          </Marker>
        )}

        {/* ── Live Route Polyline connecting Officer to Target Parcel ── */}
        {showRouteToSelected && officerLocation && currentParcel && (
          <Polyline
            positions={[officerLocation, currentParcel.centroid]}
            pathOptions={{
              color: '#38bdf8',
              weight: 3,
              dashArray: '6, 8',
              opacity: 0.9
            }}
          />
        )}
      </MapContainer>

      {/* ── Interactive Legend & Summary Overlay ── */}
      {showLegend && (
        <div className="absolute bottom-4 left-4 z-[1000] p-3 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-2xl text-xs max-w-xs">
          <div className="font-bold text-slate-200 text-xs mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              GIS Parcel Status Legend
            </span>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#22c55e] border border-emerald-400"></span>
              <span className="text-slate-300">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#eab308] border border-amber-400"></span>
              <span className="text-slate-300">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#ef4444] border border-rose-400"></span>
              <span className="text-slate-300">Dispute</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-sm bg-[#9ca3af] border border-slate-400"></span>
              <span className="text-slate-300">Not Started</span>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-between text-[10.5px]">
            <div className="flex items-center gap-1 text-rose-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span>Pulsing Pin: Inspection Needed</span>
            </div>
            {officerLocation && (
              <div className="flex items-center gap-1 text-sky-400 font-mono">
                <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                <span>GPS Live</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ParcelMap;
