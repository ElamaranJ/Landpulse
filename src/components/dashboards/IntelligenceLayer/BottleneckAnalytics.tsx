import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
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
    <div style={{ marginBottom: '12px' }}>
      <div className="gov-section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="section-label">ROOT-CAUSE BOTTLENECK DECOMPOSITION</span>
        <span className="gov-status-critical" style={{ fontSize: '11px' }}>MACHINE ROOT-CAUSE</span>
      </div>

      <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', padding: '8px' }}>
        <div style={{ width: '100%', height: '260px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              layout="vertical"
              data={BOTTLENECK_DATA}
              margin={{ top: 5, right: 30, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis type="number" stroke="#64748B" fontSize={11} tickLine={false} />
              <YAxis
                type="category" dataKey="reason" stroke="#0F172A"
                fontSize={12} tickLine={false} width={200} fontWeight={600}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF', borderColor: '#CBD5E1',
                  borderRadius: '2px', color: '#0F172A', fontSize: '12px',
                }}
              />
              <Bar dataKey="projectsAffected" name="Projects Impacted" fill="#DC2626" radius={[0, 2, 2, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
