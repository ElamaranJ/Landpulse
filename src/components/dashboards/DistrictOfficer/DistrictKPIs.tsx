import React from 'react';
import { FileText, Award, Landmark, AlertCircle, ArrowUpRight } from 'lucide-react';

const DISTRICT_STATS = {
  totalCases: 1842,
  awardsDeclared: 1432,
  disbursedCr: 1440,
  objectionsPending: 68,
};

export const DistrictKPIs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Total Cases */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Total District Parcels
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center border border-blue-100">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D66] font-mono tracking-tight">
              {DISTRICT_STATS.totalCases.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> 88.5%
              </span>
              <span className="text-slate-500 font-sans font-medium">Notified under Sec 4</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          Palghar Division • Western Corridor
        </div>
      </div>

      {/* 2. Awards Published */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Awards Declared (Sec 23)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {DISTRICT_STATS.awardsDeclared.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +142
              </span>
              <span className="text-slate-500 font-sans font-medium">Declared this month</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-700 font-bold font-mono">
          77.7% of total district caseload
        </div>
      </div>

      {/* 3. Disbursed Valuation */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              PFMS Direct Disbursed
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#EA580C] font-mono tracking-tight">
              ₹ {DISTRICT_STATS.disbursedCr.toLocaleString()} <span className="text-xl sm:text-2xl font-bold text-slate-600">Cr</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                83.7% Disbursed
              </span>
              <span className="text-slate-500 font-sans font-medium">₹1,720 Cr Sanction</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-700 font-bold font-mono">
          Direct DBT to 1,432 Bank A/cs
        </div>
      </div>

      {/* 4. Objections Pending */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Sec 15 Objections / Claims
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-700 font-mono tracking-tight">
              {DISTRICT_STATS.objectionsPending}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                64 Fast-Track Hearings
              </span>
              <span className="text-slate-500 font-sans font-medium">Pending SLAO</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium font-mono">
          3.7% of total district caseload
        </div>
      </div>
    </div>
  );
};
