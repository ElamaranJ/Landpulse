import React from 'react';
import { MOCK_CITIZEN_CASE } from '../../../data/mockData';
import { ShieldCheck, FileText, AlertTriangle, CheckCircle2, Landmark, MapPin, UserCheck, ArrowRight } from 'lucide-react';

interface CaseOverviewCardProps {
  onOpenObjectionModal: () => void;
}

export const CaseOverviewCard: React.FC<CaseOverviewCardProps> = ({ onOpenObjectionModal }) => {
  const c = MOCK_CITIZEN_CASE;

  return (
    <div className="gov-card p-6 sm:p-8 mb-8">
      {/* Top Header Strip */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2.5 mb-2">
            <span className="gov-badge gov-badge-info">
              CITIZEN CADASTRE DOSSIER
            </span>
            <span className="gov-badge gov-badge-warning">
              STAGE 7 OF 9: COMPENSATION DISBURSAL
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B3D66] font-sans tracking-tight">
            {c.landownerName}
          </h2>
          <p className="text-sm text-slate-500 mt-1 font-medium">
            Case UID: <strong className="text-slate-800 font-mono">{c.caseId}</strong> • Registered under RFCTLARR Act 2013
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onOpenObjectionModal}
            className="h-11 px-5 rounded-lg bg-[#DC2626] hover:bg-[#B91C1C] text-white text-sm font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>File Section 15 Objection / Claim</span>
          </button>

          <div className="h-11 flex items-center gap-2 px-4 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Aadhaar Verified ({c.aadhaarMasked})</span>
          </div>
        </div>
      </div>

      {/* 4 Hero-Sized Key Metric Tiles — 24px gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 my-6">
        {/* 1. Survey & Khata */}
        <div className="gov-card p-6 flex flex-col justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block mb-2">
              Survey &amp; Khata UID
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#0B3D66] font-mono tracking-tight">
              #{c.surveyNumber}
            </div>
            <span className="text-xs font-semibold text-slate-500 font-mono block mt-1">
              Khata: {c.khataNumber}
            </span>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-200/80 text-xs text-slate-600 font-medium">
            {c.village}, Taluk • {c.district}
          </div>
        </div>

        {/* 2. Land Area / Class */}
        <div className="gov-card p-6 flex flex-col justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block mb-2">
              Land Area / Category
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {c.landAreaAcre} <span className="text-lg font-bold text-slate-600 font-sans">Acres</span>
            </div>
            <span className="text-xs font-bold text-emerald-800 block mt-1">
              {c.landType} (Perennial)
            </span>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-200/80 text-xs text-slate-600 font-medium">
            Joint Measurement Survey (JMV) Sealed
          </div>
        </div>

        {/* 3. Award Valuation */}
        <div className="gov-card p-6 flex flex-col justify-between bg-slate-50/50">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block mb-2">
              Award Valuation (Sec 23)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#EA580C] font-mono tracking-tight">
              ₹ {c.awardedCompensationCr} <span className="text-lg font-bold text-slate-600 font-sans">Cr</span>
            </div>
            <span className="text-xs font-bold text-orange-800 block mt-1">
              2.0x Multiplier + 100% Solatium
            </span>
          </div>
          <div className="pt-4 mt-4 border-t border-slate-200/80 text-xs text-slate-600 font-medium">
            Final statutory award published
          </div>
        </div>

        {/* 4. PFMS Disbursed */}
        <div className="gov-card p-6 flex flex-col justify-between bg-emerald-50/40 border-emerald-200">
          <div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-mono block mb-2">
              PFMS Disbursed (Direct DBT)
            </span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-mono tracking-tight">
              ₹ {c.disbursedCompensationCr} <span className="text-lg font-bold text-emerald-800 font-sans">Cr</span>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold font-mono mt-1 border border-emerald-300">
              Tranche 1 (50%) Credited
            </span>
          </div>
          <div className="pt-4 mt-4 border-t border-emerald-200 text-xs text-slate-600 font-medium">
            SBI A/c ending ...4820 (Tranche 2 Queued)
          </div>
        </div>
      </div>

      {/* Corridor & Officer Allocation Strip */}
      <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-sans">
        <div>
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono block">
            Target National Infrastructure Project:
          </span>
          <span className="text-base font-bold text-[#0B3D66] mt-0.5 block">
            {c.projectName} ({c.projectCode})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-xs text-slate-600 font-mono">
          <span>Competent Authority: <strong className="text-slate-800">SLAO Palghar Circle</strong></span>
          <span>Last Inspection Audit: <strong className="text-emerald-700">27 Aug 2026</strong></span>
        </div>
      </div>
    </div>
  );
};
