import React, { useState } from 'react';
import { IndiaMap } from '../../common/IndiaMap';
import { MOCK_PROJECTS, MOCK_STATES } from '../../../data/mockData';
import { useRole } from '../../../context/RoleContext';
import type { Project } from '../../../types';
import { Layers, ChevronRight, ExternalLink, ArrowUpRight } from 'lucide-react';

export const GeographicIntelligence: React.FC = () => {
  const { selectedState, setSelectedProject, setCurrentRole } = useRole();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const categories = ['ALL', 'Highways', 'Railways', 'Energy', 'Water', 'Industrial', 'Aviation'];

  const filteredProjects = MOCK_PROJECTS.filter((p) => {
    const matchesCat = selectedCategory === 'ALL' || p.category === selectedCategory;
    return matchesCat;
  });

  const activeStateObj = MOCK_STATES.find((s) => s.id === selectedState) || MOCK_STATES[0];

  const handleDrilldownProject = (proj: Project) => {
    setSelectedProject(proj);
    setCurrentRole('district_officer');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 mb-8">
      {/* Left 7 Columns: Interactive Dominant India GIS Matrix */}
      <div className="lg:col-span-7">
        <IndiaMap />
      </div>

      {/* Right 5 Columns: State Cadastral Summary & Mega Projects Ledger */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        {/* Focused State Summary Card */}
        <div className="gov-card p-6 sm:p-7">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <div>
              <span className="text-xs font-mono text-orange-600 uppercase font-bold tracking-wider block">
                STATE CADASTRE FOCUS
              </span>
              <h3 className="text-xl font-extrabold text-[#0B3D66] font-sans flex items-center gap-2 mt-0.5">
                {activeStateObj.name}
                <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold">
                  {activeStateObj.shortCode}
                </span>
              </h3>
            </div>

            <span
              className={`gov-badge ${
                activeStateObj.riskLevel === 'CRITICAL'
                  ? 'gov-badge-critical'
                  : activeStateObj.riskLevel === 'LOW'
                  ? 'gov-badge-success'
                  : 'gov-badge-warning'
              }`}
            >
              {activeStateObj.riskLevel} RISK
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-4 text-center font-mono">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase block font-sans">Acquired</span>
              <span className="text-lg sm:text-xl font-extrabold text-emerald-700 mt-1 block">
                {activeStateObj.acquiredPercent}%
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase block font-sans">Disbursed</span>
              <span className="text-lg sm:text-xl font-extrabold text-[#EA580C] mt-1 block">
                ₹{(activeStateObj.disbursedCr / 1000).toFixed(1)}k Cr
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-xs text-slate-500 font-bold uppercase block font-sans">Families</span>
              <span className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 block">
                {(activeStateObj.familiesCount / 1000).toFixed(0)}k
              </span>
            </div>
          </div>

          <div className="text-xs text-slate-800 bg-[#EFF6FF] p-4 rounded-xl border border-blue-200 flex items-center justify-between font-mono">
            <div>
              <span className="text-[11px] text-blue-700 font-bold block font-sans uppercase">Flagship National Corridor:</span>
              <span className="font-bold text-[#0B3D66] text-sm mt-0.5 block">{activeStateObj.topProject}</span>
            </div>

            <button
              onClick={() => setCurrentRole('district_officer')}
              className="text-xs bg-[#1D4ED8] hover:bg-[#1E40AF] text-white px-3.5 py-2 rounded-lg font-bold flex items-center gap-1.5 shrink-0 transition-colors shadow-2xs"
            >
              <span>District Ledger</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Priority Mega Projects Table Ledger */}
        <div className="gov-card p-6 sm:p-7 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-[#0B3D66] font-mono">
                National Priority Corridors ({filteredProjects.length})
              </span>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1 overflow-x-auto max-w-full">
                {categories.slice(0, 4).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-xs px-2.5 py-1 rounded-md font-mono font-bold transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[#EA580C] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Project List */}
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredProjects.map((proj) => (
                <div
                  key={proj.id}
                  onClick={() => handleDrilldownProject(proj)}
                  className="p-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 hover:border-[#1D4ED8] transition-all cursor-pointer flex items-center justify-between gap-3 font-mono text-xs shadow-2xs"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-orange-700 bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                        {proj.code}
                      </span>
                      <h5 className="font-bold text-sm text-[#0B3D66] truncate font-sans">
                        {proj.name}
                      </h5>
                    </div>
                    <p className="text-xs text-slate-600 font-sans truncate font-medium">
                      {proj.state} • {proj.acquiredAcres.toLocaleString()} / {proj.totalAcres.toLocaleString()} Acres ({((proj.acquiredAcres / proj.totalAcres) * 100).toFixed(0)}%)
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`gov-badge ${
                        proj.status === 'critical'
                          ? 'gov-badge-critical'
                          : proj.status === 'on_track'
                          ? 'gov-badge-success'
                          : proj.status === 'delayed'
                          ? 'gov-badge-warning'
                          : 'gov-badge-info'
                      }`}
                    >
                      {proj.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-slate-800 font-bold block mt-1">
                      ₹{(proj.disbursedCr / 1000).toFixed(1)}k Cr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
