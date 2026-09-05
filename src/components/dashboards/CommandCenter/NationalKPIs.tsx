import React from 'react';
import { NATIONAL_STATS } from '../../../data/mockData';
import { Building, Award, Landmark, Users, TrendingUp, ArrowUpRight } from 'lucide-react';

export const NationalKPIs: React.FC = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* 1. Active Projects */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Active Mega Projects
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D4ED8] flex items-center justify-center border border-blue-100">
              <Building className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D66] font-mono tracking-tight">
              {NATIONAL_STATS.totalProjects.toLocaleString()}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +18 Net New
              </span>
              <span className="text-slate-500 font-sans font-medium">Q2 Fiscal Lock</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium">
          Monitored across 28 States &amp; 8 UTs under PM GatiShakti
        </div>
      </div>

      {/* 2. Land Acquired % */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              Land Acquired (Physical)
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
              <Award className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-700 font-mono tracking-tight">
              {NATIONAL_STATS.landAcquiredPercent}%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> +4.2% MoM
              </span>
              <span className="text-slate-500 font-sans font-medium">Survey Pace</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-700 font-bold font-mono">
          {NATIONAL_STATS.totalAcresAcquired} / {NATIONAL_STATS.totalAcresTarget} Acres
        </div>
      </div>

      {/* 3. Compensation Disbursed */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              PFMS Direct DBT Disbursed
            </span>
            <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#EA580C] flex items-center justify-center border border-orange-100">
              <Landmark className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#EA580C] font-mono tracking-tight">
              ₹ 1.54L <span className="text-xl sm:text-2xl font-bold text-slate-600">Cr</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-orange-50 text-orange-800 border border-orange-200">
                73.3% Sanctioned
              </span>
              <span className="text-slate-500 font-sans font-medium">₹2.10L Cr Target</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-700 font-bold font-mono">
          ₹8,420 Cr Disbursed this month
        </div>
      </div>

      {/* 4. Affected Families Resettled */}
      <div className="gov-card p-6 sm:p-7 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
              R&amp;R Families Resettled
            </span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center border border-purple-100">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#0B3D66] font-mono tracking-tight">
              21.90 <span className="text-xl sm:text-2xl font-bold text-slate-600">Lakh</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-700 font-mono">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                77.1% Cleared
              </span>
              <span className="text-slate-500 font-sans font-medium">Model Townships</span>
            </div>
          </div>
        </div>
        <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 font-medium font-mono">
          Out of 28.4L Affected Families (PAPs)
        </div>
      </div>
    </div>
  );
};
