import React, { useState } from 'react';
import type { FieldParcel } from '../../../types';
import { Radio, RefreshCw, Crosshair, MapPin, CheckCircle2, ShieldCheck } from 'lucide-react';

interface GPSCaptureSimulatorProps {
  parcel: FieldParcel;
  onUpdateCoordinates: (coords: { lat: number; lng: number; accuracyMeters: number }) => void;
}

export const GPSCaptureSimulator: React.FC<GPSCaptureSimulatorProps> = ({
  parcel,
  onUpdateCoordinates,
}) => {
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedWaypoints, setCapturedWaypoints] = useState<
    { id: number; lat: number; lng: number; time: string }[]
  >([
    { id: 1, lat: 19.6967, lng: 72.7654, time: '11:20 AM' },
    { id: 2, lat: 19.6971, lng: 72.7658, time: '11:23 AM' },
    { id: 3, lat: 19.6968, lng: 72.7663, time: '11:27 AM' },
  ]);

  const handleCapturePoint = () => {
    setIsCapturing(true);
    setTimeout(() => {
      const nextId = capturedWaypoints.length + 1;
      const baseLat = 19.6967 + (Math.random() - 0.5) * 0.001;
      const baseLng = 72.7654 + (Math.random() - 0.5) * 0.001;
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      setCapturedWaypoints((prev) => [
        ...prev,
        { id: nextId, lat: parseFloat(baseLat.toFixed(4)), lng: parseFloat(baseLng.toFixed(4)), time: timeStr },
      ]);
      onUpdateCoordinates({ lat: baseLat, lng: baseLng, accuracyMeters: 0.48 });
      setIsCapturing(false);
    }, 600);
  };

  const currentLat = capturedWaypoints[capturedWaypoints.length - 1]?.lat || 19.6968;
  const currentLng = capturedWaypoints[capturedWaypoints.length - 1]?.lng || 72.7663;

  return (
    <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', padding: '14px 16px', marginBottom: '12px' }}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ paddingBottom: '8px', marginBottom: '10px', borderBottom: '2px solid #0B3D66' }}>
        <div>
          <div className="flex items-center gap-2.5">
            <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#0B3D66' }}>
              NavIC DGPS Cadastral Boundary Logger
            </h3>
            <span className="gov-badge gov-badge-info">RTK SUB-METER</span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Joint Measurement Survey Mode • Dual Constellation Lock</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="gov-badge gov-badge-success text-xs py-1.5 px-3">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-600 mr-1" />
            14 SATS LOCKED (±0.48m RTK)
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {/* Main High-Contrast GPS Coordinate Display Box */}
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '2px', padding: '14px' }}>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-facts-table gov-facts-table-striped" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '18%' }} />
                <col style={{ width: '32%' }} />
                <col style={{ width: '18%' }} />
                <col style={{ width: '32%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '18%' }}>FIELD</th>
                  <th style={{ width: '32%' }}>VALUE</th>
                  <th style={{ width: '18%' }}>FIELD</th>
                  <th style={{ width: '32%' }}>VALUE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fact-label">Target Parcel</td>
                  <td className="fact-value">Survey #{parcel.surveyNumber} ({parcel.village})</td>
                  <td className="fact-label">Cadastral Area</td>
                  <td className="fact-value">{parcel.areaAcre} Acres</td>
                </tr>
                <tr>
                  <td className="fact-label">Latitude Coordinate</td>
                  <td className="fact-value" style={{ fontSize: '15px' }}>{currentLat.toFixed(4)}° N</td>
                  <td className="fact-label">Longitude Coordinate</td>
                  <td className="fact-value" style={{ fontSize: '15px' }}>{currentLng.toFixed(4)}° E</td>
                </tr>
                <tr>
                  <td className="fact-label">Datum</td>
                  <td className="fact-value">WGS84 High Precision Fix</td>
                  <td className="fact-label">Carrier Phase</td>
                  <td className="fact-value">NavIC IRNSS Fixed</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Capture Button */}
          <div style={{ marginTop: '14px' }}>
            <button
              onClick={handleCapturePoint}
              disabled={isCapturing}
              className={`w-full gov-flat-btn ${isCapturing ? 'gov-flat-btn-secondary' : 'gov-flat-btn-orange'}`}
              style={{ justifyContent: 'center', padding: '10px 16px', fontSize: '13px' }}
            >
              {isCapturing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Pinging NavIC Satellites &amp; Averaging Carrier Phase...</span>
                </>
              ) : (
                <>
                  <Crosshair className="w-5 h-5" />
                  <span>LOG WAYPOINT #{capturedWaypoints.length + 1} (PEG BOUNDARY CORNER)</span>
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-500 font-medium mt-2">
              Stand at physical boundary corner monument before logging waypoint.
            </p>
          </div>
        </div>

        {/* Recorded Polygon Perimeter Peg Table */}
        <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          <div className="gov-section-divider" style={{ padding: '8px 12px', margin: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span className="section-label">
              RECORDED PERIMETER PEGS ({capturedWaypoints.length} NODES CAPTURED)
            </span>
            <span className="gov-status-completed" style={{ fontSize: '11px' }}>
              Closure Error: 0.02m (Pass)
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="gov-stage-register" style={{ fontSize: '12px', tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '80px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '100px' }} />
                <col style={{ width: '120px' }} />
                <col style={{ width: '90px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '80px' }}>Peg #</th>
                  <th style={{ width: '120px' }}>Latitude</th>
                  <th style={{ width: '120px' }}>Longitude</th>
                  <th style={{ width: '100px' }}>Timestamp</th>
                  <th style={{ width: '120px' }}>RTK Fix</th>
                  <th style={{ width: '90px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {capturedWaypoints.map((wp) => (
                  <tr key={wp.id}>
                    <td style={{ fontWeight: 700, color: '#0B3D66', verticalAlign: 'middle' }}>Peg #{wp.id}</td>
                    <td style={{ fontWeight: 600, color: '#0F172A', verticalAlign: 'middle' }}>{wp.lat}° N</td>
                    <td style={{ fontWeight: 600, color: '#0F172A', verticalAlign: 'middle' }}>{wp.lng}° E</td>
                    <td style={{ fontSize: '11.5px', color: '#64748B', verticalAlign: 'middle' }}>{wp.time}</td>
                    <td style={{ fontSize: '11.5px', verticalAlign: 'middle' }}>
                      <span className="gov-status-completed">Fixed (0.48m)</span>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                      <span className="gov-status-completed" style={{ fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Recorded
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
