import React from 'react';
import { Download } from 'lucide-react';

export const ActsRulesView: React.FC = () => {
  const actsList = [
    {
      title: 'The Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (Act No. 30 of 2013)',
      date: '27 Sep 2013',
      category: 'Central Statutory Act',
      fileSize: '4.8 MB',
      sections: 'Sections 1 to 114 (10 Chapters, 4 Schedules)',
    },
    {
      title: 'RFCTLARR (Compensation, Rehabilitation and Resettlement and Development Plan) Rules, 2015',
      date: '08 Aug 2015',
      category: 'Statutory Central Rules',
      fileSize: '1.9 MB',
      sections: 'Procedural guidelines for Social Impact Assessment (SIA) & Solatium computation',
    },
    {
      title: 'State RFCTLARR Compliance & Direct Land Purchase Notifications (Maharashtra, Gujarat, UP, Karnataka)',
      date: 'July 2026',
      category: 'State Circulars',
      fileSize: '6.2 MB',
      sections: 'State-specific multiplier matrices and consent award formats under Section 46',
    },
    {
      title: 'Solatium 100% Determination & Interest Multiplier Guidelines (Section 30 & 80 RFCTLARR)',
      date: 'Circular 2026/04',
      category: 'Administrative Circular',
      fileSize: '850 KB',
      sections: 'Mandatory 100% solatium calculation on market value plus asset evaluation',
    },
    {
      title: 'PM GatiShakti National Master Plan Land Acquisition Fast-Track Inter-Ministerial Protocol',
      date: '14 Feb 2026',
      category: 'Inter-Ministerial Protocol',
      fileSize: '2.1 MB',
      sections: 'Integrated GIS RoW alignment clearance for Multi-Modal Connectivity Projects',
    },
  ];

  return (
    <div style={{ marginBottom: '14px' }}>
      {/* Header Block */}
      <div className="gov-register-header">
        <div className="reg-meta">
          LEGAL REPOSITORY &bull; RFCTLARR 2013 &amp; REVENUE RULES &bull; MINISTRY OF RURAL DEVELOPMENT
        </div>
        <div className="reg-title">Statutory Acts, Rules &amp; Government Gazette Orders</div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Official legal repository governing land acquisition, compensation determination, and rehabilitation &amp; resettlement across India.
        </div>
      </div>

      {/* Register Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '54px' }} />
            <col style={{ width: '150px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: '240px' }} />
            <col style={{ width: '115px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '54px', textAlign: 'center' }}>S.No.</th>
              <th style={{ width: '150px' }}>Category</th>
              <th>Title</th>
              <th style={{ width: '110px' }}>Date</th>
              <th style={{ width: '240px' }}>Sections / Scope</th>
              <th style={{ width: '115px', textAlign: 'center' }}>Download</th>
            </tr>
          </thead>
          <tbody>
            {actsList.map((item, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'center', fontWeight: 700, verticalAlign: 'middle' }}>{idx + 1}</td>
                <td style={{ verticalAlign: 'middle' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#0B3D66' }}>{item.category}</span>
                </td>
                <td style={{ verticalAlign: 'middle' }}>
                  <strong style={{ color: '#0B3D66', fontSize: '12.5px' }}>{item.title}</strong>
                </td>
                <td style={{ fontSize: '12px', color: '#64748B', verticalAlign: 'middle' }}>{item.date}</td>
                <td style={{ fontSize: '11.5px', color: '#475569', verticalAlign: 'middle' }}>{item.sections}</td>
                <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                  <button
                    type="button"
                    onClick={() => alert(`Downloading ${item.title} (${item.fileSize})`)}
                    className="gov-flat-btn gov-flat-btn-secondary"
                    style={{ fontSize: '11px', padding: '3px 8px', height: '24px', display: 'inline-flex', alignItems: 'center', gap: '3px' }}
                  >
                    <Download style={{ width: '12px', height: '12px' }} />
                    <span>PDF ({item.fileSize})</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
