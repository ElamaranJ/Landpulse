import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const DISTRICT_DATA = [
  { district: 'Thane', targetAcres: 4200, acquiredAcres: 3850, budgetCr: 6200, disbursedCr: 5800, rnrPercent: 92, cases: 540 },
  { district: 'Palghar', targetAcres: 5600, acquiredAcres: 4720, budgetCr: 7400, disbursedCr: 6100, rnrPercent: 84, cases: 780 },
  { district: 'Raigad', targetAcres: 4400, acquiredAcres: 3480, budgetCr: 4850, disbursedCr: 3700, rnrPercent: 78, cases: 460 },
  { district: 'Pune', targetAcres: 3800, acquiredAcres: 3450, budgetCr: 5200, disbursedCr: 4900, rnrPercent: 89, cases: 510 },
  { district: 'Nashik', targetAcres: 2900, acquiredAcres: 2100, budgetCr: 3100, disbursedCr: 2150, rnrPercent: 71, cases: 390 },
];

export const DistrictComparisonChart: React.FC = () => {
  const [chartView, setChartView] = useState<'acres' | 'budget'>('acres');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 mb-8">
      {/* Left 8 cols: Inter-District Comparative Bar Chart */}
      <div className="lg:col-span-8">
        <div className="gov-card p-6 sm:p-7 h-full flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-4">
            <div>
              <h4 className="font-bold text-lg text-[#0B3D66] font-sans tracking-tight">
                Inter-District Acquisition &amp; Disbursement Benchmarking
              </h4>
              <p className="text-xs text-slate-500 font-mono mt-0.5">Maharashtra Western Division Cadastral Ledger</p>
            </div>

            {/* Toggle metric */}
            <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1 font-mono">
              <button
                onClick={() => setChartView('acres')}
                className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${
                  chartView === 'acres'
                    ? 'bg-white text-[#EA580C] shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Land Acres
              </button>
              <button
                onClick={() => setChartView('budget')}
                className={`text-xs px-3 py-1.5 rounded-md font-bold transition-all ${
                  chartView === 'budget'
                    ? 'bg-white text-emerald-700 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ₹ Disbursement
              </button>
            </div>
          </div>

          {/* Recharts Canvas */}
          <div className="p-2 w-full h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={DISTRICT_DATA}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis
                  dataKey="district"
                  stroke="#64748B"
                  fontSize={12}
                  tickLine={false}
                  fontFamily="'Roboto Mono', monospace"
                />
                <YAxis
                  stroke="#64748B"
                  fontSize={11}
                  tickLine={false}
                  fontFamily="'Roboto Mono', monospace"
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF',
                    borderColor: '#CBD5E1',
                    borderRadius: '8px',
                    color: '#0F172A',
                    fontSize: '12px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  }}
                />
                <Legend
                  wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }}
                />
                {chartView === 'acres' ? (
                  <>
                    <Bar dataKey="targetAcres" name="Target (Acres)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="acquiredAcres" name="Acquired (Acres)" fill="#EA580C" radius={[4, 4, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="budgetCr" name="Sanction (₹ Cr)" fill="#94A3B8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="disbursedCr" name="PFMS Disbursed (₹ Cr)" fill="#059669" radius={[4, 4, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right 4 cols: PFMS & R&R Status Cards */}
      <div className="lg:col-span-4 flex flex-col justify-between gap-6">
        {/* PFMS Card */}
        <div className="gov-card p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 font-mono">
              <span className="text-xs text-emerald-800 font-bold uppercase tracking-wider">
                PFMS TREASURY DISBURSEMENT
              </span>
              <span className="gov-badge gov-badge-success">82.4% DISBURSED</span>
            </div>

            <div className="my-2 font-mono">
              <span className="text-2xl font-extrabold text-[#0B3D66]">₹ 6,100 Cr</span>
              <span className="text-xs text-slate-500 font-sans"> / ₹ 7,400 Cr Sanctioned</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 my-3">
              <div className="bg-emerald-600 h-full rounded-full" style={{ width: '82.4%' }} />
            </div>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            14,200 verified Aadhaar beneficiary accounts credited via State Bank of India gateway.
          </p>
        </div>

        {/* R&R Card */}
        <div className="gov-card p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2 font-mono">
              <span className="text-xs text-orange-800 font-bold uppercase tracking-wider">
                R&amp;R ENTITLEMENT DELIVERY
              </span>
              <span className="gov-badge gov-badge-warning">84.0% SETTLED</span>
            </div>

            <div className="my-2 font-mono">
              <span className="text-2xl font-extrabold text-[#0B3D66]">11,928 Families</span>
              <span className="text-xs text-slate-500 font-sans"> / 14,200 Total PAPs</span>
            </div>

            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 my-3">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: '84%' }} />
            </div>
          </div>

          <p className="text-xs text-slate-600 font-sans leading-relaxed">
            Model resettlement township plots allocated in Palghar West zone with grid electricity &amp; potable water.
          </p>
        </div>
      </div>
    </div>
  );
};
