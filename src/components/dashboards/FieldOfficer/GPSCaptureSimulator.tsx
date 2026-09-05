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
    <div className="gov-card p-6 sm:p-7 mb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B3D66] font-sans tracking-tight">
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
        <div className="bg-slate-50/70 border border-slate-200 rounded-xl p-6">
          <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-200/80 mb-4 gap-2">
            <span className="text-xs font-bold text-slate-600 uppercase font-mono">
              Target Parcel: <strong className="text-[#0B3D66] text-sm font-bold">Survey #{parcel.surveyNumber} ({parcel.village})</strong>
            </span>
            <span className="gov-badge gov-badge-success">
              Cadastral Area: {parcel.areaAcre} Acres
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Latitude Readout */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Latitude Coordinate</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B3D66] font-mono tracking-tight block my-2">
                {currentLat.toFixed(4)}° N
              </span>
              <span className="text-xs text-slate-500 font-mono">WGS84 Datum • High Precision Fix</span>
            </div>

            {/* Longitude Readout */}
            <div className="bg-white border border-slate-200 rounded-xl p-5 text-center shadow-2xs">
              <span className="text-xs font-bold text-slate-400 uppercase font-mono block">Longitude Coordinate</span>
              <span className="text-3xl sm:text-4xl font-extrabold text-[#0B3D66] font-mono tracking-tight block my-2">
                {currentLng.toFixed(4)}° E
              </span>
              <span className="text-xs text-slate-500 font-mono">NavIC IRNSS Fixed Carrier Phase</span>
            </div>
          </div>

          {/* Big High-Contrast Outdoor Trigger Button */}
          <div className="mt-6">
            <button
              onClick={handleCapturePoint}
              disabled={isCapturing}
              className={`w-full py-4 px-6 rounded-xl font-bold text-base uppercase flex items-center justify-center gap-2.5 transition-all shadow-xs ${
                isCapturing
                  ? 'bg-amber-600 text-white cursor-wait'
                  : 'bg-[#EA580C] hover:bg-[#C2410C] text-white active:scale-[0.99]'
              }`}
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
        <div className="gov-table-wrapper">
          <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase font-mono">
              Recorded Perimeter Pegs ({capturedWaypoints.length} nodes captured)
            </span>
            <span className="gov-badge gov-badge-success text-xs">
              Closure Error: 0.02m (Pass)
            </span>
          </div>

          <table className="gov-table">
            <thead>
              <tr>
                <th>Peg #</th>
                <th>Latitude</th>
                <th>Longitude</th>
                <th>Timestamp</th>
                <th>RTK Fix Quality</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {capturedWaypoints.map((wp) => (
                <tr key={wp.id}>
                  <td className="font-mono font-bold text-[#0B3D66]">Peg #{wp.id}</td>
                  <td className="font-mono font-bold text-slate-900">{wp.lat}° N</td>
                  <td className="font-mono font-bold text-slate-900">{wp.lng}° E</td>
                  <td className="font-mono text-slate-600">{wp.time}</td>
                  <td>
                    <span className="gov-badge gov-badge-success">
                      FIXED (0.48m)
                    </span>
                  </td>
                  <td>
                    <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5 font-mono">
                      <CheckCircle2 className="w-4 h-4" />
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
  );
};
