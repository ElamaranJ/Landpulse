import React from 'react';

export const WhosWhoView: React.FC = () => {
  const officers = [
    {
      name: 'Shri Shivraj Singh Chouhan',
      designation: "Hon'ble Union Minister of Rural Development and Land Resources",
      office: 'Krishi Bhawan, New Delhi',
      email: 'minister.rd@gov.in',
      phone: '011-23383370',
      category: 'Union Minister',
    },
    {
      name: 'Dr. Chandra Sekhar Pemmasani',
      designation: "Hon'ble Minister of State for Rural Development",
      office: 'Krishi Bhawan, New Delhi',
      email: 'mos-rd@gov.in',
      phone: '011-23382348',
      category: 'Minister of State',
    },
    {
      name: 'Dr. S. K. Verma, IAS',
      designation: 'Secretary, Department of Land Resources (DoLR)',
      office: 'NBO Building, Nirman Bhawan, New Delhi',
      email: 'sec-dolr@nic.in',
      phone: '011-23061248',
      category: 'Secretariat Leadership',
    },
    {
      name: 'Shri Amitabh Kant, IAS (Retd.)',
      designation: 'Special Nodal Advisor — PM GatiShakti Land Integration',
      office: 'Cabinet Secretariat / NITI Aayog',
      email: 'advisor-gatishakti@gov.in',
      phone: '011-23096500',
      category: 'National Advisory',
    },
    {
      name: 'Smt. Ananya Deshmukh, IAS',
      designation: 'Joint Secretary (Land Acquisition & RFCTLARR Implementation)',
      office: 'DoLR, Nirman Bhawan, New Delhi',
      email: 'js-larr@nic.in',
      phone: '011-23063412',
      category: 'Secretariat Leadership',
    },
    {
      name: 'Shri Pravin R. Patil, IAS',
      designation: 'Special Land Acquisition Officer (SLAO) & Dy. Collector, Palghar Circle',
      office: 'District Collectorate, Palghar, Maharashtra',
      email: 'slao.palghar@maharashtra.gov.in',
      phone: '02525-252102',
      category: 'State Competent Authority',
    },
  ];

  return (
    <div style={{ marginBottom: '14px' }}>
      {/* Header Block */}
      <div className="gov-register-header">
        <div className="reg-meta">
          MINISTRY DIRECTORY &bull; COMPETENT AUTHORITIES &bull; STATUTORY APPOINTMENTS
        </div>
        <div className="reg-title">Who&apos;s Who — Ministry Leadership &amp; Competent Authorities</div>
        <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
          Official directory of key statutory authorities, central leadership, and nodal land acquisition officers across India.
        </div>
      </div>

      {/* Register Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%' }}>
          <colgroup>
            <col style={{ width: '54px' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '220px' }} />
            <col style={{ width: '190px' }} />
            <col style={{ width: '125px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '54px', textAlign: 'center' }}>S.No.</th>
              <th style={{ width: '220px' }}>Name</th>
              <th>Designation</th>
              <th style={{ width: '220px' }}>Office</th>
              <th style={{ width: '190px' }}>Email</th>
              <th style={{ width: '125px' }}>Phone</th>
            </tr>
          </thead>
          <tbody>
            {officers.map((off, idx) => (
              <tr key={idx}>
                <td style={{ textAlign: 'center', fontWeight: 700, verticalAlign: 'middle' }}>{idx + 1}</td>
                <td style={{ verticalAlign: 'middle' }}>
                  <div style={{ fontWeight: 700, color: '#0B3D66', fontSize: '13px' }}>{off.name}</div>
                  <span style={{ fontSize: '11px', color: '#EA580C', fontWeight: 600 }}>{off.category}</span>
                </td>
                <td style={{ fontSize: '12px', color: '#1E293B', verticalAlign: 'middle' }}>{off.designation}</td>
                <td style={{ fontSize: '12px', color: '#475569', verticalAlign: 'middle' }}>{off.office}</td>
                <td style={{ fontSize: '12px', color: '#0B3D66', fontWeight: 600, verticalAlign: 'middle' }}>
                  <a href={`mailto:${off.email}`} style={{ color: '#0B3D66', textDecoration: 'none' }}>
                    {off.email}
                  </a>
                </td>
                <td style={{ fontSize: '12px', color: '#475569', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{off.phone}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
