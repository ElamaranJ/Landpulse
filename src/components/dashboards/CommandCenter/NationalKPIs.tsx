import React from 'react';
import { NATIONAL_STATS } from '../../../data/mockData';

export const NationalKPIs: React.FC = () => {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div className="gov-section-divider">
        <span className="section-label">
          NATIONAL KEY PERFORMANCE INDICATORS — PM GATISHAKTI MONITORED
        </span>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="gov-facts-table gov-facts-table-striped" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '18%' }} />
            <col style={{ width: '32%' }} />
            <col style={{ width: '18%' }} />
            <col style={{ width: '32%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '18%' }}>FIELD</th>
              <th style={{ width: '32%' }}>VALUE</th>
              <th style={{ width: '18%' }}>FIELD</th>
              <th style={{ width: '32%' }}>VALUE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fact-label">Active Mega Projects</td>
              <td className="fact-value">{NATIONAL_STATS.totalProjects.toLocaleString()} &bull; +18 Net New (Q2 Fiscal Lock)</td>
              <td className="fact-label">Land Acquired (Physical)</td>
              <td className="fact-value">{NATIONAL_STATS.landAcquiredPercent}% &bull; {NATIONAL_STATS.totalAcresAcquired} / {NATIONAL_STATS.totalAcresTarget} Acres</td>
            </tr>
            <tr>
              <td className="fact-label">PFMS Direct DBT Disbursed</td>
              <td className="fact-value">₹ 1.54L Cr &bull; 73.3% of ₹2.10L Cr Target</td>
              <td className="fact-label">R&amp;R Families Resettled</td>
              <td className="fact-value">21.90 Lakh &bull; 77.1% of 28.4L Affected Families</td>
            </tr>
            <tr>
              <td className="fact-label">Monthly Disbursement</td>
              <td className="fact-value">₹8,420 Cr Disbursed this month</td>
              <td className="fact-label">Survey Pace (MoM)</td>
              <td className="fact-value">+4.2% Month-on-Month</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
