import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  Compass,
  X,
  Satellite,
  Layers,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Camera,
  Maximize2,
  Navigation,
  Sparkles,
  ShieldCheck,
  FileCheck2,
} from 'lucide-react';

export const DGPSCadastralViewerModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();

  const [activeLayer, setActiveLayer] = useState<'cadastral' | 'satellite' | 'hybrid'>('cadastral');
  const [selectedPoint, setSelectedPoint] = useState<number | null>(1);

  if (!isModalOpen('dgpsViewer')) return null;

  // Boundary coordinates & Geo-tagged pins
  const boundaryPoints = [
    { id: 1, lat: 19.697412, lng: 72.768102, elevation: '14.2m', rtkStatus: 'FIXED (±0.02m)', type: 'Boundary Pillar 1 (North-West)' },
    { id: 2, lat: 19.698045, lng: 72.769854, elevation: '14.5m', rtkStatus: 'FIXED (±0.03m)', type: 'Boundary Pillar 2 (North-East - Irrigation Canal)' },
    { id: 3, lat: 19.696120, lng: 72.770210, elevation: '13.8m', rtkStatus: 'FIXED (±0.02m)', type: 'Boundary Pillar 3 (South-East - Orchard)' },
    { id: 4, lat: 19.695540, lng: 72.768400, elevation: '13.9m', rtkStatus: 'FIXED (±0.04m)', type: 'Boundary Pillar 4 (South-West - Village Road)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-5xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Compass className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">NavIC DGPS Cadastral Polygon Viewer</h2>
              <p className="text-xs text-blue-200">
                High-Precision Sub-Meter RTK Boundary Walk • Survey No. 142/3A, Vevoor, Palghar
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('dgpsViewer')}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Top Control Strip */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-bold text-slate-700">NavIC Constellation: 7 Satellites In-View</span>
            </div>
            <span className="text-slate-300">|</span>
            <div className="font-mono text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
              RTK FIX Accuracy: ±0.024 m
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">Layer:</span>
            <div className="flex bg-white border border-slate-300 rounded overflow-hidden">
              <button
                onClick={() => setActiveLayer('cadastral')}
                className={`px-3 py-1 font-bold ${
                  activeLayer === 'cadastral' ? 'bg-[#0B3D66] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Cadastral Vector
              </button>
              <button
                onClick={() => setActiveLayer('satellite')}
                className={`px-3 py-1 font-bold ${
                  activeLayer === 'satellite' ? 'bg-[#0B3D66] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                ISRO Bhuvan Satellite
              </button>
              <button
                onClick={() => setActiveLayer('hybrid')}
                className={`px-3 py-1 font-bold ${
                  activeLayer === 'hybrid' ? 'bg-[#0B3D66] text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                Hybrid
              </button>
            </div>
          </div>
        </div>

        {/* Main Map Simulation View */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Map Canvas (7 cols) */}
          <div className="lg:col-span-7 bg-[#0F172A] rounded-xl overflow-hidden relative shadow-inner min-h-[380px] flex items-center justify-center p-4 border border-slate-700">
            {/* Background Grid Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

            {/* SVG Polygon Representation of the Land Parcel */}
            <svg viewBox="0 0 500 350" className="w-full h-full relative z-10">
              {/* Surrounding Plot outlines */}
              <polygon points="40,30 220,20 180,120 20,100" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <text x="70" y="70" fill="#64748B" fontSize="10" fontFamily="monospace">Survey 142/2 (Govt Land)</text>

              <polygon points="380,50 480,40 460,180 340,160" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="3 3" />
              <text x="360" y="100" fill="#64748B" fontSize="10" fontFamily="monospace">Survey 142/4 (Expressway RoW)</text>

              {/* Acquired Parcel Polygon (Survey 142/3A) */}
              <polygon
                points="120,80 380,70 340,280 90,260"
                fill="#1D4ED8"
                fillOpacity="0.35"
                stroke="#38BDF8"
                strokeWidth="3"
              />

              {/* Center Annotation */}
              <circle cx="230" cy="170" r="4" fill="#F59E0B" />
              <text x="230" y="195" fill="#FFFFFF" fontSize="12" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                Survey No. 142/3A
              </text>
              <text x="230" y="210" fill="#93C5FD" fontSize="10" textAnchor="middle" fontFamily="monospace">
                Area: 2.45 Acres (9,914 sq. m)
              </text>

              {/* 4 Interactive GPS Boundary Point Pins */}
              {[
                { x: 120, y: 80, id: 1, label: 'BP 1' },
                { x: 380, y: 70, id: 2, label: 'BP 2' },
                { x: 340, y: 280, id: 3, label: 'BP 3' },
                { x: 90, y: 260, id: 4, label: 'BP 4' },
              ].map((pt) => (
                <g key={pt.id} onClick={() => setSelectedPoint(pt.id)} className="cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={selectedPoint === pt.id ? 10 : 7}
                    fill={selectedPoint === pt.id ? '#EF4444' : '#10B981'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  <text x={pt.x + 12} y={pt.y + 4} fill="#F8FAFC" fontSize="10" fontWeight="bold">
                    {pt.label}
                  </text>
                </g>
              ))}

              {/* Waterway / Canal indicator */}
              <path d="M 380,70 Q 420,180 340,280" fill="none" stroke="#06B6D4" strokeWidth="2" strokeDasharray="4 2" />
            </svg>

            {/* Floating Map Legend */}
            <div className="absolute bottom-3 left-3 bg-slate-900/90 text-white p-2.5 rounded-lg text-[10px] space-y-1 font-mono border border-slate-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> DGPS Fixed Boundary Pillar
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-0.5 bg-sky-400" /> Proposed Expressway RoW Alignment
              </div>
            </div>
          </div>

          {/* Point Inspector & Verification Details (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-[#0B3D66] uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-red-500" /> Boundary Pillar Inspector
              </h3>

              {selectedPoint && (
                <div className="space-y-2 text-xs">
                  <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">
                        {boundaryPoints[selectedPoint - 1].type}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                        {boundaryPoints[selectedPoint - 1].rtkStatus}
                      </span>
                    </div>

                    <div className="font-mono text-slate-600 text-[11px] pt-1">
                      Lat: <strong>{boundaryPoints[selectedPoint - 1].lat}° N</strong><br />
                      Lng: <strong>{boundaryPoints[selectedPoint - 1].lng}° E</strong><br />
                      Elevation: <strong>{boundaryPoints[selectedPoint - 1].elevation} (WGS84)</strong>
                    </div>
                  </div>

                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded text-[11px] text-emerald-900 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>
                      Gram Sabha Boundary Walk confirmed in presence of Patwari, SLAO Surveyor, and Landowner on <strong>18 Jan 2026</strong>.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Field Photos Evidence */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-[#0B3D66]" /> Geo-Tagged Verification Media (4)
                </span>
                <span className="text-[10px] text-slate-500">EXIF Timestamped</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="bg-slate-100 rounded p-2 text-center text-xs border border-slate-200">
                  <div className="h-16 bg-slate-300 rounded flex items-center justify-center text-slate-500 text-[10px] font-bold">
                    Pillar #1 (North Boundary)
                  </div>
                  <span className="text-[10px] text-slate-600 mt-1 block">19.6974°N, 72.7681°E</span>
                </div>
                <div className="bg-slate-100 rounded p-2 text-center text-xs border border-slate-200">
                  <div className="h-16 bg-slate-300 rounded flex items-center justify-center text-slate-500 text-[10px] font-bold">
                    Alfonso Orchard Trees (14)
                  </div>
                  <span className="text-[10px] text-slate-600 mt-1 block">19.6961°N, 72.7702°E</span>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-mono">Survey of India Datum: EPSG 4326 / WGS84</span>
          <button
            onClick={() => closeModal('dgpsViewer')}
            className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
