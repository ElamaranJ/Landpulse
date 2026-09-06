import React, { useState } from 'react';
import { MOCK_CRITICAL_ALERTS } from '../../../data/mockData';
import { CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { useRole } from '../../../context/RoleContext';

interface CriticalAlertsFeedProps {
  searchTerm?: string;
  statusFilter?: string;
}

export const CriticalAlertsFeed: React.FC<CriticalAlertsFeedProps> = ({
  searchTerm = '',
  statusFilter = 'ALL',
}) => {
  const { setCurrentRole } = useRole();
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  const handleResolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds((prev) => [...prev, id]);
  };

  const filteredAlerts = MOCK_CRITICAL_ALERTS.filter((a) => {
    if (activeTab !== 'ALL' && a.severity !== activeTab) return false;

    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !q ||
      a.code.toLowerCase().includes(q) ||
      a.project.toLowerCase().includes(q) ||
      a.district.toLowerCase().includes(q) ||
      a.state.toLowerCase().includes(q) ||
      a.message.toLowerCase().includes(q) ||
      a.suggestedAction.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'ALL' ||
      a.severity === statusFilter ||
      (statusFilter === 'CRITICAL' && a.severity === 'CRITICAL') ||
      (statusFilter === 'HIGH' && a.severity === 'HIGH') ||
      (statusFilter === 'WARNING' && a.severity === 'WARNING');

    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Section Divider */}
      <div className="gov-section-divider" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <span className="section-label">
          CRITICAL LAND ACQUISITION BOTTLENECKS &amp; DISRUPTIONS — CABINET ESCALATION
        </span>
        {/* Severity Filter Tabs */}
        <div style={{ display: 'flex', gap: '2px', border: '1px solid #CBD5E1', borderRadius: '2px', overflow: 'hidden' }}>
          {(['ALL', 'CRITICAL', 'HIGH'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '4px 14px', fontSize: '13px', fontWeight: 700, cursor: 'pointer',
                border: 'none', borderRadius: 0,
                backgroundColor: activeTab === tab ? '#DC2626' : '#FFFFFF',
                color: activeTab === tab ? '#FFFFFF' : '#475569',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Register Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%', minWidth: '980px' }}>
          <colgroup>
            <col style={{ width: '85px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '105px' }} />
            <col style={{ width: '145px' }} />
            <col style={{ width: '85px' }} />
            <col style={{ width: '105px' }} />
            <col style={{ width: '250px' }} />
            <col style={{ width: '95px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '85px' }}>Code</th>
              <th>Project</th>
              <th style={{ width: '105px' }}>Severity</th>
              <th style={{ width: '145px' }}>District / State</th>
              <th style={{ width: '85px' }}>Delay</th>
              <th style={{ width: '105px' }}>Impact (₹ Cr)</th>
              <th style={{ width: '250px' }}>Suggested Action</th>
              <th style={{ width: '95px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredAlerts.length > 0 ? (
              filteredAlerts.map((alert) => {
                const isResolved = resolvedIds.includes(alert.id);
                const severityClass = alert.severity === 'CRITICAL' ? 'gov-status-critical' : 'gov-status-high';

                return (
                  <tr key={alert.id} style={isResolved ? { backgroundColor: '#F0FDF4' } : undefined}>
                    <td style={{ fontSize: '14px', fontWeight: 700, verticalAlign: 'middle' }}>{alert.code}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <strong style={{ color: '#0B3D66', fontSize: '14.5px' }}>{alert.project}</strong>
                      <div style={{ fontSize: '13px', color: '#64748B', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '320px' }}>
                        {alert.message}
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <span className={severityClass}>{alert.severity}</span>
                    </td>
                    <td style={{ fontSize: '14px', verticalAlign: 'middle' }}>{alert.district}, {alert.state}</td>
                    <td style={{ fontSize: '14px', fontWeight: 700, verticalAlign: 'middle' }}>+{alert.delayDays}d</td>
                    <td style={{ fontSize: '14px', fontWeight: 700, verticalAlign: 'middle' }}>₹{alert.impactValuationCr}</td>
                    <td style={{ fontSize: '13px', color: '#475569', verticalAlign: 'middle' }}>
                      <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '240px' }} title={alert.suggestedAction}>
                        {alert.suggestedAction}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {isResolved ? (
                        <span className="gov-status-completed" style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'center' }}>
                          <CheckCircle2 style={{ width: '14px', height: '14px' }} /> Dispatched
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => handleResolve(alert.id, e)}
                          className="gov-flat-btn gov-flat-btn-primary"
                          style={{ fontSize: '12px', padding: '4px 8px', width: '84px', height: '26px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                        >
                          Escalate <ArrowRight style={{ width: '12px', height: '12px' }} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: '#94A3B8' }}>
                  <AlertCircle style={{ width: '20px', height: '20px', margin: '0 auto 6px', display: 'block', color: '#CBD5E1' }} />
                  No alerts match search criteria
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
