import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import { useModals } from '../../../context/ModalContext';
import { RefreshCw, Download, Filter, SlidersHorizontal } from 'lucide-react';
import { MOCK_STATES } from '../../../data/mockData';

export const HeroSection: React.FC = () => {
  const { selectedState, setSelectedState } = useRole();
  const { openModal } = useModals();
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="gov-card p-6 sm:p-7 mb-8">
      {/* Title & Actions Row */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0B3D66] font-sans tracking-tight">
              National Land Acquisition Telemetry &amp; MIS Console
            </h2>
            <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 text-xs font-bold font-mono border border-emerald-200">
              ● LIVE TELEMETRY
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-Time DGPS Cadastral Grid • 28 States &amp; 8 UTs • RFCTLARR 2013 Statutory Compliance
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="h-11 px-4 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700 text-sm font-semibold flex items-center gap-2 transition-all shadow-2xs"
          >
            <RefreshCw className={`w-4 h-4 text-slate-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Syncing...' : 'Sync Telemetry'}</span>
          </button>

          <button
            onClick={() => openModal('exportModal')}
            className="h-11 px-5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Export Executive Dossier</span>
          </button>
        </div>
      </div>

      {/* Query Filter Matrix Bar — 44px height inputs with clear labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-6">
        {/* State Selection */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
            Jurisdiction (State / UT)
          </label>
          <select
            value={selectedState || 'ALL'}
            onChange={(e) => setSelectedState(e.target.value === 'ALL' ? null : e.target.value)}
            className="gov-select w-full"
          >
            <option value="ALL">All States &amp; Union Territories (National)</option>
            {MOCK_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.shortCode}) — {s.acquiredPercent}% Acquired
              </option>
            ))}
          </select>
        </div>

        {/* Ministry Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
            Executing Central Ministry
          </label>
          <select
            value={selectedMinistry}
            onChange={(e) => setSelectedMinistry(e.target.value)}
            className="gov-select w-full"
          >
            <option value="ALL">All Ministries (Cross-Sectoral)</option>
            <option value="MoRTH">MoRTH (Highways &amp; Expressways)</option>
            <option value="Railways">Ministry of Railways (DFC &amp; HSR)</option>
            <option value="MNRE">Ministry of New &amp; Renewable Energy</option>
            <option value="JalShakti">Ministry of Jal Shakti (River Interlinks)</option>
            <option value="DPIIT">DPIIT (Industrial Smart Cities)</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
            Statutory Stage Filter
          </label>
          <select className="gov-select w-full">
            <option value="ALL">All Statutory Stages (Sec 4 to Sec 23)</option>
            <option value="SEC4">Sec 4(1) Preliminary Notification</option>
            <option value="JMV">Joint Measurement Survey (JMV)</option>
            <option value="SEC15">Sec 15 Objection / Hearing</option>
            <option value="SEC19">Sec 19 Final Declaration</option>
            <option value="SEC23">Sec 23 Award &amp; Compensation</option>
            <option value="PFMS">PFMS Direct Benefit Transfer</option>
          </select>
        </div>

        {/* Financial Year Filter */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 font-mono">
            Fiscal Lock &amp; Audit Year
          </label>
          <select className="gov-select w-full">
            <option value="FY2627">FY 2026-27 (Current Fiscal)</option>
            <option value="FY2526">FY 2025-26</option>
            <option value="FY2425">FY 2024-25</option>
            <option value="ALL">Cumulative (All Years)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
