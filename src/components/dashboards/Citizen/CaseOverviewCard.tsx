import React from 'react';
import { MOCK_CITIZEN_CASE } from '../../../data/mockData';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

interface CaseOverviewCardProps {
  onOpenObjectionModal: () => void;
}

export const CaseOverviewCard: React.FC<CaseOverviewCardProps> = ({ onOpenObjectionModal }) => {
  const c = MOCK_CITIZEN_CASE;

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Register Header Block */}
      <div className="gov-register-header">
        <div className="reg-meta">
          CITIZEN CADASTRE DOSSIER &bull; STAGE 7 OF 9: COMPENSATION DISBURSAL &bull; RFCTLARR ACT 2013
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div className="reg-title">{c.landownerName}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenObjectionModal}
              className="gov-flat-btn gov-flat-btn-danger"
            >
              <AlertTriangle style={{ width: '14px', height: '14px' }} />
              File Section 15 Objection / Claim
            </button>
            <span className="gov-verified-tag">
              <ShieldCheck style={{ width: '14px', height: '14px' }} />
              Aadhaar Verified ({c.aadhaarMasked})
            </span>
          </div>
        </div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Case UID: <strong style={{ color: '#1E293B' }}>{c.caseId}</strong> &bull; Registered under RFCTLARR Act 2013
        </div>
      </div>

      {/* Key Facts as Single Continuous Bordered Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-facts-table gov-facts-table-striped" style={{ tableLayout: 'fixed', width: '100%', minWidth: '820px' }}>
          <colgroup>
            <col style={{ width: '22%' }} />
            <col style={{ width: '28%' }} />
            <col style={{ width: '22%' }} />
            <col style={{ width: '28%' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '22%' }}>FIELD</th>
              <th style={{ width: '28%' }}>VALUE</th>
              <th style={{ width: '22%' }}>FIELD</th>
              <th style={{ width: '28%' }}>VALUE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="fact-label">Survey &amp; Khata UID</td>
              <td className="fact-value">#{c.surveyNumber} &bull; Khata: {c.khataNumber}</td>
              <td className="fact-label">Land Area / Category</td>
              <td className="fact-value">{c.landAreaAcre} Acres &bull; {c.landType} (Perennial)</td>
            </tr>
            <tr>
              <td className="fact-label">Award Valuation (Sec 23)</td>
              <td className="fact-value">₹ {c.awardedCompensationCr} Cr &bull; 2.0x Multiplier + 100% Solatium</td>
              <td className="fact-label">PFMS Disbursed (Direct DBT)</td>
              <td className="fact-value">₹ {c.disbursedCompensationCr} Cr &bull; Tranche 1 (50%) Credited</td>
            </tr>
            <tr>
              <td className="fact-label">Location</td>
              <td className="fact-value">{c.village}, Taluk &bull; {c.district}</td>
              <td className="fact-label">Bank Account</td>
              <td className="fact-value">SBI A/c ending ...4820 (Tranche 2 Queued)</td>
            </tr>
            <tr>
              <td className="fact-label">JMV Status</td>
              <td className="fact-value">Joint Measurement Survey (JMV) Sealed</td>
              <td className="fact-label">Final Award</td>
              <td className="fact-value">Final statutory award published</td>
            </tr>
            <tr>
              <td className="fact-label">Target National Infrastructure Project</td>
              <td className="fact-value" colSpan={3}>{c.projectName} ({c.projectCode})</td>
            </tr>
            <tr>
              <td className="fact-label">Competent Authority</td>
              <td className="fact-value">SLAO Palghar Circle</td>
              <td className="fact-label">Last Inspection Audit</td>
              <td className="fact-value">27 Aug 2026</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
