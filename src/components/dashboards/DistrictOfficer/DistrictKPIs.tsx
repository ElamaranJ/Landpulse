import React from 'react';

const DISTRICT_STATS = {
  totalCases: 1842,
  awardsDeclared: 1432,
  disbursedCr: 1440,
  objectionsPending: 68,
};

export const DistrictKPIs: React.FC = () => {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div className="gov-section-divider">
        <span className="section-label">
          PALGHAR DIVISION — DISTRICT KEY PERFORMANCE INDICATORS
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
              <td className="fact-label">Total District Parcels</td>
              <td className="fact-value">{DISTRICT_STATS.totalCases.toLocaleString()} &bull; 88.5% Notified under Sec 4</td>
              <td className="fact-label">Awards Declared (Sec 23)</td>
              <td className="fact-value">{DISTRICT_STATS.awardsDeclared.toLocaleString()} &bull; +142 This Month (77.7% of caseload)</td>
            </tr>
            <tr>
              <td className="fact-label">PFMS Direct Disbursed</td>
              <td className="fact-value">₹ {DISTRICT_STATS.disbursedCr.toLocaleString()} Cr &bull; 83.7% of ₹1,720 Cr Sanction</td>
              <td className="fact-label">Sec 15 Objections / Claims</td>
              <td className="fact-value">{DISTRICT_STATS.objectionsPending} &bull; 64 Fast-Track Hearings Pending SLAO (3.7%)</td>
            </tr>
            <tr>
              <td className="fact-label">Division</td>
              <td className="fact-value">Palghar &bull; Western Corridor</td>
              <td className="fact-label">DBT Credits</td>
              <td className="fact-value">Direct DBT to 1,432 Bank A/cs</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
