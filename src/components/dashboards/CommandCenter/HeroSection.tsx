import React, { useState } from 'react';
import { useRole } from '../../../context/RoleContext';
import { useModals } from '../../../context/ModalContext';
import { RefreshCw, Download } from 'lucide-react';
import { MOCK_STATES } from '../../../data/mockData';

export const HeroSection: React.FC = () => {
  const { selectedState, setSelectedState } = useRole();
  const { openModal } = useModals();
  const [selectedMinistry, setSelectedMinistry] = useState('ALL');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Register Header */}
      <div className="gov-register-header">
        <div className="reg-meta">
          MONITORING &amp; COMMAND CENTER &bull; REAL-TIME DGPS CADASTRAL GRID &bull; 28 STATES &amp; 8 UTs &bull; RFCTLARR 2013
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div className="reg-title">
            National Land Acquisition Telemetry &amp; MIS Console
            <span className="gov-verified-tag" style={{ marginLeft: '10px', fontSize: '10px', color: '#059669' }}>● LIVE TELEMETRY</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="gov-flat-btn gov-flat-btn-secondary"
            >
              <RefreshCw style={{ width: '14px', height: '14px', animation: isRefreshing ? 'spin 1s linear infinite' : 'none' }} />
              {isRefreshing ? 'Syncing...' : 'Sync Telemetry'}
            </button>
            <button
              onClick={() => openModal('exportModal')}
              className="gov-flat-btn gov-flat-btn-orange"
            >
              <Download style={{ width: '14px', height: '14px' }} />
              Export Executive Dossier
            </button>
          </div>
        </div>
      </div>

      {/* Filter Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3" style={{ marginTop: '10px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
            Jurisdiction (State / UT)
          </label>
          <select
            value={selectedState || 'ALL'}
            onChange={(e) => setSelectedState(e.target.value === 'ALL' ? null : e.target.value)}
            className="gov-select w-full"
          >
            <option value="ALL">All States &amp; Union Territories (National)</option>
            {MOCK_STATES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.shortCode}) — {s.acquiredPercent}% Acquired
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
            Executing Central Ministry
          </label>
          <select value={selectedMinistry} onChange={(e) => setSelectedMinistry(e.target.value)} className="gov-select w-full">
            <option value="ALL">All Ministries (Cross-Sectoral)</option>
            <option value="MoRTH">MoRTH (Highways &amp; Expressways)</option>
            <option value="Railways">Ministry of Railways (DFC &amp; HSR)</option>
            <option value="MNRE">Ministry of New &amp; Renewable Energy</option>
            <option value="JalShakti">Ministry of Jal Shakti (River Interlinks)</option>
            <option value="DPIIT">DPIIT (Industrial Smart Cities)</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
            Statutory Stage Filter
          </label>
          <select className="gov-select w-full">
            <option value="ALL">All Statutory Stages (Sec 4 to Sec 23)</option>
            <option value="SEC4">Sec 4(1) Preliminary Notification</option>
            <option value="JMV">Joint Measurement Survey (JMV)</option>
            <option value="SEC15">Sec 15 Objection / Hearing</option>
            <option value="SEC19">Sec 19 Final Declaration</option>
            <option value="SEC23">Sec 23 Award &amp; Compensation</option>
            <option value="PFMS">PFMS Direct Benefit Transfer</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '3px' }}>
            Fiscal Lock &amp; Audit Year
          </label>
          <select className="gov-select w-full">
            <option value="FY2627">FY 2026-27 (Current Fiscal)</option>
            <option value="FY2526">FY 2025-26</option>
            <option value="FY2425">FY 2024-25</option>
            <option value="ALL">Cumulative (All Years)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
