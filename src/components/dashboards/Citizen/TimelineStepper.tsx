import React, { useState } from 'react';
import type { StageMilestone } from '../../../types';

interface TimelineStepperProps {
  stages: StageMilestone[];
  currentStageIndex: number;
}

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ stages }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(7);
  const completedCount = stages.filter(s => s.status === 'completed').length;

  return (
    <div style={{ marginBottom: '12px' }}>
      {/* Section Divider */}
      <div className="gov-section-divider">
        <span className="section-label">
          ACQUISITION AND COMPENSATION LIFECYCLE — {completedCount} OF {stages.length} STAGES COMPLETED (RFCTLARR ACT 2013)
        </span>
      </div>

      {/* Stage Register Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%', minWidth: '880px' }}>
          <colgroup>
            <col style={{ width: '60px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '165px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '280px' }} />
            <col style={{ width: '96px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '60px', textAlign: 'center' }}>Stage</th>
              <th>Description</th>
              <th style={{ width: '165px' }}>Status</th>
              <th style={{ width: '120px' }}>Date</th>
              <th style={{ width: '280px' }}>Remarks</th>
              <th style={{ width: '96px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {stages.map((stage) => {
              const isCompleted = stage.status === 'completed';
              const isCurrent = stage.status === 'current';
              const isExpanded = expandedStep === stage.step;
              const statusClass = isCompleted
                ? 'gov-status-completed'
                : isCurrent
                ? 'gov-status-current'
                : 'gov-status-pending';
              const statusLabel = isCompleted
                ? 'Completed'
                : isCurrent
                ? 'Current Active Stage'
                : 'Pending';
              const hasDetails = Boolean(stage.authorizedBy || stage.gazetteRef || stage.amount || stage.notes);

              return (
                <React.Fragment key={stage.step}>
                  <tr
                    onClick={() => setExpandedStep(isExpanded ? null : stage.step)}
                    style={{ cursor: 'pointer' }}
                  >
                    <td style={{ fontWeight: 700, textAlign: 'center', verticalAlign: 'middle' }}>{stage.step}</td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 700, color: '#0B3D66', fontSize: '15px' }}>{stage.name}</div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#64748B',
                          marginTop: '2px',
                          lineHeight: '1.35',
                          overflow: 'hidden',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '34px',
                        }}
                      >
                        {stage.description}
                      </div>
                    </td>
                    <td style={{ verticalAlign: 'middle' }}>
                      <span className={statusClass}>{statusLabel}</span>
                    </td>
                    <td style={{ fontSize: '14px', color: '#475569', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {stage.completedDate || '—'}
                    </td>
                    <td style={{ fontSize: '14px', color: '#475569', verticalAlign: 'middle' }}>
                      <div
                        style={{
                          maxWidth: '260px',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                        title={stage.notes || undefined}
                      >
                        {stage.notes || '—'}
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      {hasDetails ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedStep(isExpanded ? null : stage.step);
                          }}
                          className="gov-flat-btn"
                          style={{
                            fontSize: '12px',
                            padding: '4px 8px',
                            fontWeight: 600,
                            backgroundColor: isExpanded ? '#0B3D66' : '#FFFFFF',
                            border: '1px solid #CBD5E1',
                            color: isExpanded ? '#FFFFFF' : '#0B3D66',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '84px',
                            height: '26px',
                          }}
                          title={isExpanded ? 'Collapse stage details' : 'View statutory details'}
                        >
                          {isExpanded ? 'Hide' : 'View details'}
                        </button>
                      ) : (
                        <span style={{ color: '#94A3B8', fontSize: '14px' }}>—</span>
                      )}
                    </td>
                  </tr>

                  {/* Expanded Detail Sub-Row */}
                  {isExpanded && hasDetails && (
                    <tr style={{ backgroundColor: '#F8FAFC' }}>
                      <td></td>
                      <td colSpan={5} style={{ padding: '8px 12px' }}>
                        <table className="gov-facts-table" style={{ fontSize: '12px', tableLayout: 'fixed', width: '100%' }}>
                          <colgroup>
                            <col style={{ width: '22%' }} />
                            <col style={{ width: '28%' }} />
                            <col style={{ width: '22%' }} />
                            <col style={{ width: '28%' }} />
                          </colgroup>
                          <tbody>
                            {(stage.authorizedBy || stage.gazetteRef) && (
                              <tr>
                                {stage.authorizedBy && stage.gazetteRef ? (
                                  <>
                                    <td className="fact-label">Authorizing Competent Authority</td>
                                    <td className="fact-value">{stage.authorizedBy}</td>
                                    <td className="fact-label">Gazette Notification Reference</td>
                                    <td className="fact-value">{stage.gazetteRef}</td>
                                  </>
                                ) : stage.authorizedBy ? (
                                  <>
                                    <td className="fact-label">Authorizing Competent Authority</td>
                                    <td className="fact-value" colSpan={3}>{stage.authorizedBy}</td>
                                  </>
                                ) : (
                                  <>
                                    <td className="fact-label">Gazette Notification Reference</td>
                                    <td className="fact-value" colSpan={3}>{stage.gazetteRef}</td>
                                  </>
                                )}
                              </tr>
                            )}
                            {(stage.amount || stage.notes) && (
                              <tr>
                                {stage.amount && stage.notes ? (
                                  <>
                                    <td className="fact-label">Statutory Determination</td>
                                    <td className="fact-value">{stage.amount}</td>
                                    <td className="fact-label">Officer Remarks</td>
                                    <td className="fact-value" style={{ color: '#475569', fontWeight: 500 }}>{stage.notes}</td>
                                  </>
                                ) : stage.amount ? (
                                  <>
                                    <td className="fact-label">Statutory Determination</td>
                                    <td className="fact-value" colSpan={3}>{stage.amount}</td>
                                  </>
                                ) : (
                                  <>
                                    <td className="fact-label">Officer Remarks</td>
                                    <td className="fact-value" colSpan={3} style={{ color: '#475569', fontWeight: 500 }}>{stage.notes}</td>
                                  </>
                                )}
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
