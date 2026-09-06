import React from 'react';
import type { FieldParcel } from '../../../types';
import { AlertCircle } from 'lucide-react';

interface AssignedParcelsListProps {
  parcels: FieldParcel[];
  selectedParcelId?: string;
  onSelectParcel: (parcel: FieldParcel) => void;
}

export const AssignedParcelsList: React.FC<AssignedParcelsListProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
}) => {
  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED': return { text: 'VERIFIED', className: 'gov-status-completed' };
      case 'GPS_CAPTURED': return { text: 'GPS CAPTURED', className: 'gov-status-current' };
      case 'OBJECTION_FLAGGED': return { text: 'OBJECTION', className: 'gov-status-critical' };
      default: return { text: 'PENDING', className: 'gov-status-pending' };
    }
  };

  const getPriorityText = (urgency: string) => {
    switch (urgency) {
      case 'HIGH': return { text: 'HIGH', className: 'gov-status-critical' };
      case 'MEDIUM': return { text: 'MEDIUM', className: 'gov-status-current' };
      default: return { text: 'LOW', className: 'gov-status-pending' };
    }
  };

  return (
    <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF' }}>
      {/* Panel Header */}
      <div className="gov-register-header" style={{ margin: '0', padding: '10px 14px 8px' }}>
        <div className="reg-meta">TODAY&apos;S FIELD ROSTER &bull; DGPS ACTIVE</div>
        <div className="reg-title">Assigned Cadastral Parcels</div>
      </div>

      {/* Parcel Register Table */}
      <div style={{ maxHeight: '760px', overflowY: 'auto', overflowX: 'auto' }}>
        {parcels.length > 0 ? (
          <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%', minWidth: '800px' }}>
            <colgroup>
              <col style={{ width: '85px' }} />
              <col style={{ width: '140px' }} />
              <col style={{ width: '160px' }} />
              <col style={{ width: '80px' }} />
              <col style={{ width: '60px' }} />
              <col style={{ width: '60px' }} />
              <col style={{ width: '105px' }} />
              <col style={{ width: '80px' }} />
            </colgroup>
            <thead>
              <tr>
                <th style={{ width: '85px' }}>Survey #</th>
                <th style={{ width: '140px' }}>Owner</th>
                <th style={{ width: '160px' }}>Village / Area</th>
                <th style={{ width: '80px' }}>Priority</th>
                <th style={{ width: '60px' }}>SLA</th>
                <th style={{ width: '60px', textAlign: 'center' }}>Photos</th>
                <th style={{ width: '105px' }}>Status</th>
                <th style={{ width: '80px', textAlign: 'center' }}>Details</th>
              </tr>
            </thead>
            <tbody>
              {parcels.map((parcel) => {
                const isSelected = parcel.id === selectedParcelId;
                const status = getStatusText(parcel.verificationStatus);
                const priority = getPriorityText(parcel.urgency);

                return (
                  <tr
                    key={parcel.id}
                    onClick={() => onSelectParcel(parcel)}
                    style={{
                      cursor: 'pointer',
                      backgroundColor: isSelected ? '#EFF6FF' : undefined,
                      borderLeft: isSelected ? '3px solid #0B3D66' : undefined,
                    }}
                  >
                    <td style={{ fontWeight: 700, color: '#0B3D66', fontSize: '14px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      #{parcel.surveyNumber}
                    </td>
                    <td style={{ verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={parcel.ownerName}>
                      <strong style={{ color: '#1E293B', fontSize: '14.5px' }}>{parcel.ownerName}</strong>
                    </td>
                    <td
                      style={{ fontSize: '13px', verticalAlign: 'middle', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      title={`${parcel.village} • ${parcel.areaAcre} Ac (${parcel.category})`}
                    >
                      {parcel.village} &bull; {parcel.areaAcre} Ac ({parcel.category})
                    </td>
                    <td style={{ verticalAlign: 'middle', whiteSpace: 'nowrap' }}><span className={priority.className}>{priority.text}</span></td>
                    <td style={{ fontSize: '13px', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>{parcel.dueHours}h</td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap', fontSize: '13px' }}>{parcel.photos.length}</td>
                    <td style={{ verticalAlign: 'middle', whiteSpace: 'nowrap' }}><span className={status.className}>{status.text}</span></td>
                    <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectParcel(parcel);
                        }}
                        className="gov-flat-btn gov-flat-btn-secondary"
                        style={{ fontSize: '12px', padding: '3px 10px', height: '26px' }}
                      >
                        {isSelected ? 'Active' : 'Inspect'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        ) : (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#94A3B8' }}>
            <AlertCircle style={{ width: '24px', height: '24px', margin: '0 auto 6px', display: 'block', color: '#CBD5E1' }} />
            <div style={{ fontWeight: 700, fontSize: '13px', color: '#475569' }}>No parcels match filter</div>
            <div style={{ fontSize: '12px', marginTop: '4px' }}>Try a different Survey #, Landowner Name, or Status.</div>
          </div>
        )}
      </div>
    </div>
  );
};
