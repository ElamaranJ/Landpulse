import React, { useState } from 'react';
import { MOCK_STATES } from '../../data/mockData';
import type { StateData } from '../../types';
import { useRole } from '../../context/RoleContext';
import { Layers, ZoomIn, ZoomOut, Maximize2, MapPin, Compass } from 'lucide-react';

export const IndiaMap: React.FC = () => {
  const { selectedState, setSelectedState } = useRole();
  const [hoveredState, setHoveredState] = useState<StateData | null>(null);
  const [activeMetric, setActiveMetric] = useState<'acquisition' | 'budget' | 'risk'>('acquisition');
  const [showCorridors, setShowCorridors] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);

  const getStateColor = (state: StateData) => {
    if (activeMetric === 'risk') {
      switch (state.riskLevel) {
        case 'CRITICAL': return '#DC2626';
        case 'HIGH': return '#EA580C';
        case 'MEDIUM': return '#D97706';
        default: return '#059669';
      }
    }
    if (activeMetric === 'budget') {
      return state.disbursedCr > 25000 ? '#059669' : state.disbursedCr > 15000 ? '#D97706' : '#2563EB';
    }
    // Acquisition %
    return state.acquiredPercent >= 85 ? '#059669' : state.acquiredPercent >= 70 ? '#D97706' : '#DC2626';
  };

  const activeStateObj = MOCK_STATES.find(s => s.id === selectedState) || MOCK_STATES[0];

  return (
    <div className="gov-card p-6 sm:p-7 flex flex-col justify-between h-full min-h-[560px]">
      {/* Map Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B3D66] font-sans tracking-tight flex items-center gap-2">
              <span>National GIS Corridor &amp; Cadastral Matrix</span>
            </h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">
            ISRO Bhuvan GIS Synchronized • 489 NavIC High-Precision DGPS Base Stations Active
          </p>
        </div>

        {/* Metric Selector Buttons */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="bg-slate-100 p-1 rounded-lg flex items-center gap-1 border border-slate-200">
            <button
              onClick={() => setActiveMetric('acquisition')}
              className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${
                activeMetric === 'acquisition'
                  ? 'bg-white text-[#0B3D66] shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Acquisition %
            </button>
            <button
              onClick={() => setActiveMetric('risk')}
              className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${
                activeMetric === 'risk'
                  ? 'bg-white text-red-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Risk Heatmap
            </button>
            <button
              onClick={() => setActiveMetric('budget')}
              className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${
                activeMetric === 'budget'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              PFMS Disbursed
            </button>
          </div>

          <button
            onClick={() => setShowCorridors(!showCorridors)}
            className={`text-xs px-3 py-2 rounded-lg font-bold flex items-center gap-1.5 border transition-all ${
              showCorridors
                ? 'bg-[#0B3D66] text-white border-[#072742] shadow-2xs'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Corridors</span>
          </button>
        </div>
      </div>

      {/* Main SVG Canvas — Prominent & Tall (420px+) */}
      <div className="relative flex-1 w-full flex items-center justify-center my-4 select-none min-h-[420px] bg-slate-50/70 border border-slate-200/80 rounded-xl overflow-hidden p-4">
        {/* Zoom Controls */}
        <div className="absolute top-4 right-4 z-10 flex flex-col gap-1 bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
          <button
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.8))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-100 text-slate-700"
            title="Reset View"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        <svg
          viewBox="0 0 100 100"
          className="w-full h-full max-h-[440px] transition-transform duration-300"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <defs>
            <pattern id="lightGridWide" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="#E2E8F0" strokeWidth="0.4" />
            </pattern>
          </defs>

          <rect width="100" height="100" fill="url(#lightGridWide)" />

          {/* India Boundary Stylized Contour */}
          <path
            d="M 36,12 C 40,10 44,14 46,18 C 50,22 60,26 64,28 C 72,30 82,36 86,44 C 88,50 82,56 76,58 C 70,62 66,66 60,74 C 54,82 48,94 44,95 C 40,94 36,82 32,70 C 26,62 20,54 22,46 C 24,38 28,30 32,22 Z"
            fill="#FFFFFF"
            stroke="#0B3D66"
            strokeWidth="1.2"
            className="drop-shadow-xs"
          />

          {/* Mega Corridor Lines */}
          {showCorridors && (
            <g className="corridors">
              {/* Western DFC & Bullet Train Route */}
              <path
                d="M 36,20 Q 30,34 26,48 Q 32,54 38,58"
                fill="none"
                stroke="#EA580C"
                strokeWidth="1.8"
                strokeDasharray="2,2"
              />
              {/* Eastern DFC Route */}
              <path
                d="M 36,20 Q 50,35 74,48"
                fill="none"
                stroke="#0284C7"
                strokeWidth="1.6"
                strokeDasharray="2,2"
              />
              {/* Golden Quadrilateral South Link */}
              <path
                d="M 38,58 Q 40,74 44,84 Q 50,68 74,48"
                fill="none"
                stroke="#7C3AED"
                strokeWidth="1.4"
                strokeDasharray="2,2"
              />
            </g>
          )}

          {/* State Nodes & Markers */}
          {MOCK_STATES.map((state) => {
            const isSelected = selectedState === state.id;
            const isHovered = hoveredState?.id === state.id;
            const color = getStateColor(state);

            return (
              <g
                key={state.id}
                className="cursor-pointer transition-transform"
                onClick={() => setSelectedState(state.id)}
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
              >
                {/* Selection Ripple */}
                {(isSelected || isHovered) && (
                  <circle
                    cx={state.coordinates.x}
                    cy={state.coordinates.y}
                    r="6"
                    fill="none"
                    stroke={color}
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                  />
                )}

                {/* Main Node */}
                <circle
                  cx={state.coordinates.x}
                  cy={state.coordinates.y}
                  r={isSelected ? "4.5" : "3.2"}
                  fill={color}
                  stroke="#0B3D66"
                  strokeWidth="1"
                />

                {/* State Tag */}
                <text
                  x={state.coordinates.x}
                  y={state.coordinates.y - 5}
                  fontSize="3.2"
                  fontWeight="bold"
                  fontFamily="'Roboto Mono', monospace"
                  fill="#0B3D66"
                  textAnchor="middle"
                >
                  {state.shortCode}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected State Floating Tooltip Card */}
        {(hoveredState || activeStateObj) && (
          <div className="absolute right-4 bottom-4 w-64 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-md text-xs font-sans pointer-events-none">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
              <span className="font-bold text-sm text-[#0B3D66]">
                {(hoveredState || activeStateObj).name}
              </span>
              <span
                className={`text-[10px] font-bold font-mono px-2 py-0.5 rounded ${
                  (hoveredState || activeStateObj).riskLevel === 'CRITICAL'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : (hoveredState || activeStateObj).riskLevel === 'LOW'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {(hoveredState || activeStateObj).riskLevel} RISK
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase block font-sans">Acquired</span>
                <span className="font-bold text-base text-emerald-700">{(hoveredState || activeStateObj).acquiredPercent}%</span>
              </div>
              <div className="bg-slate-50 p-2 border border-slate-200 rounded-lg">
                <span className="text-[10px] text-slate-500 uppercase font-sans">Disbursed</span>
                <span className="font-bold text-base text-[#EA580C]">₹{((hoveredState || activeStateObj).disbursedCr / 1000).toFixed(1)}k Cr</span>
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-600 flex items-center justify-between font-mono">
              <span>Projects: <strong>{(hoveredState || activeStateObj).projectsCount}</strong></span>
              <span>Families: <strong>{((hoveredState || activeStateObj).familiesCount / 1000).toFixed(0)}k</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="flex flex-wrap items-center justify-between text-xs text-slate-600 pt-3 border-t border-slate-100 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-600 inline-block" /> &gt;80% Healthy</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> 65-80% Moderate</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-600 inline-block" /> &lt;65% Critical Delay</span>
        </div>
        <span className="text-xs font-mono text-slate-500">DGPS Base Stations: 489 / 489 Active</span>
      </div>
    </div>
  );
};
