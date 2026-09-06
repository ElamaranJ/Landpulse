import React, { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
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
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4" style={{ marginBottom: '12px' }}>
      {/* Left: Chart */}
      <div className="lg:col-span-8">
        <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF' }}>
          <div style={{ padding: '10px 14px', borderBottom: '1px solid #CBD5E1', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: '14px', color: '#0B3D66' }}>
                Inter-District Acquisition &amp; Disbursement Benchmarking
              </div>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Maharashtra Western Division Cadastral Ledger</div>
            </div>
            <div style={{ display: 'flex', gap: '2px', border: '1px solid #CBD5E1', borderRadius: '2px', overflow: 'hidden' }}>
              <button
                onClick={() => setChartView('acres')}
                style={{
                  padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  border: 'none', borderRadius: 0,
                  backgroundColor: chartView === 'acres' ? '#0B3D66' : '#FFFFFF',
                  color: chartView === 'acres' ? '#FFFFFF' : '#475569',
                }}
              >
                Land Acres
              </button>
              <button
                onClick={() => setChartView('budget')}
                style={{
                  padding: '3px 10px', fontSize: '11px', fontWeight: 700, cursor: 'pointer',
                  border: 'none', borderRadius: 0,
                  backgroundColor: chartView === 'budget' ? '#0B3D66' : '#FFFFFF',
                  color: chartView === 'budget' ? '#FFFFFF' : '#475569',
                }}
              >
                ₹ Disbursement
              </button>
            </div>
          </div>

          <div style={{ padding: '8px', width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DISTRICT_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                <XAxis dataKey="district" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#FFFFFF', borderColor: '#CBD5E1',
                    borderRadius: '2px', color: '#0F172A', fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {chartView === 'acres' ? (
                  <>
                    <Bar dataKey="targetAcres" name="Target (Acres)" fill="#94A3B8" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="acquiredAcres" name="Acquired (Acres)" fill="#0B3D66" radius={[2, 2, 0, 0]} />
                  </>
                ) : (
                  <>
                    <Bar dataKey="budgetCr" name="Sanction (₹ Cr)" fill="#94A3B8" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="disbursedCr" name="PFMS Disbursed (₹ Cr)" fill="#0B3D66" radius={[2, 2, 0, 0]} />
                  </>
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Right: PFMS & R&R Single Continuous Facts Table */}
      <div className="lg:col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div>
          <div className="gov-section-divider">
            <span className="section-label">PFMS DISBURSEMENT &amp; R&amp;R ENTITLEMENT DELIVERY</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="gov-facts-table gov-facts-table-striped" style={{ tableLayout: 'fixed', width: '100%' }}>
              <colgroup>
                <col style={{ width: '38%' }} />
                <col style={{ width: '62%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th style={{ width: '38%' }}>FIELD</th>
                  <th style={{ width: '62%' }}>VALUE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="fact-label">PFMS Disbursed</td>
                  <td className="fact-value">₹ 6,100 Cr (82.4% of ₹7,400 Cr)</td>
                </tr>
                <tr>
                  <td className="fact-label">PFMS Direct Beneficiaries</td>
                  <td className="fact-value">14,200 Aadhaar accounts via SBI</td>
                </tr>
                <tr>
                  <td className="fact-label">R&amp;R Families Resettled</td>
                  <td className="fact-value">11,928 Families (84.0% of 14,200)</td>
                </tr>
                <tr>
                  <td className="fact-label">R&amp;R Resettlement Zone</td>
                  <td className="fact-value">Model township plots, Palghar West</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
