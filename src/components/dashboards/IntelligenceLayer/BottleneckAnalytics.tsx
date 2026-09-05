import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const BOTTLENECK_DATA = [
  { reason: 'Title & Succession Records', projectsAffected: 342, delayDaysAvg: 164 },
  { reason: 'Forest/Eco Stage II Approvals', projectsAffected: 218, delayDaysAvg: 198 },
  { reason: 'Solatium / Circle Rate Disputes', projectsAffected: 184, delayDaysAvg: 112 },
  { reason: 'High-Tension Utility RoW Shift', projectsAffected: 146, delayDaysAvg: 95 },
  { reason: 'Gram Sabha Resettlement Consent', projectsAffected: 112, delayDaysAvg: 130 },
];

export const BottleneckAnalytics: React.FC = () => {
  return (
    <div className="gov-card p-6 sm:p-7 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-4">
        <div>
          <h4 className="font-bold text-lg text-[#0B3D66] font-sans tracking-tight">
            Root-Cause Bottleneck Decomposition
          </h4>
          <p className="text-xs text-slate-500 font-mono mt-0.5">Aggregated cross-ministry structural delay factors</p>
        </div>

        <span className="gov-badge gov-badge-critical">
          MACHINE ROOT-CAUSE
        </span>
      </div>

      <div className="p-2 w-full h-[260px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            layout="vertical"
            data={BOTTLENECK_DATA}
            margin={{ top: 5, right: 30, left: 40, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              type="number"
              stroke="#64748B"
              fontSize={11}
              tickLine={false}
              fontFamily="'Roboto Mono', monospace"
            />
            <YAxis
              type="category"
              dataKey="reason"
              stroke="#0F172A"
              fontSize={12}
              tickLine={false}
              fontFamily="'Noto Sans', sans-serif"
              width={200}
              fontWeight="600"
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
            <Bar
              dataKey="projectsAffected"
              name="Projects Impacted"
              fill="#DC2626"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
