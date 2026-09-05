import React from 'react';
import type { FieldParcel } from '../../../types';
import { MapPin, Clock, Camera, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface AssignedParcelsListProps {
  parcels: FieldParcel[];
  selectedParcelId: string;
  onSelectParcel: (parcel: FieldParcel) => void;
}

export const AssignedParcelsList: React.FC<AssignedParcelsListProps> = ({
  parcels,
  selectedParcelId,
  onSelectParcel,
}) => {
  return (
    <div className="gov-card p-6 flex flex-col justify-between h-full">
      {/* Panel Header */}
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider block">
              Today's Field Roster
            </span>
            <h3 className="text-lg font-bold text-[#0B3D66] font-sans mt-0.5">
              Assigned Cadastral Parcels
            </h3>
          </div>
          <span className="gov-badge gov-badge-success">
            DGPS ACTIVE
          </span>
        </div>

        {/* Parcel Roster List */}
        <div className="space-y-3 max-h-[760px] overflow-y-auto pr-1">
          {parcels.map((parcel) => {
            const isSelected = parcel.id === selectedParcelId;

            const getStatusBadge = () => {
              switch (parcel.verificationStatus) {
                case 'VERIFIED':
                  return <span className="gov-badge gov-badge-success">VERIFIED</span>;
                case 'GPS_CAPTURED':
                  return <span className="gov-badge gov-badge-info">GPS CAPTURED</span>;
                case 'OBJECTION_FLAGGED':
                  return <span className="gov-badge gov-badge-critical">OBJECTION FLAGGED</span>;
                default:
                  return <span className="gov-badge gov-badge-warning">PENDING SURVEY</span>;
              }
            };

            const getPriorityBadge = () => {
              switch (parcel.urgency) {
                case 'HIGH':
                  return <span className="gov-badge gov-badge-critical text-[10px]">HIGH</span>;
                case 'MEDIUM':
                  return <span className="gov-badge gov-badge-warning text-[10px]">MEDIUM</span>;
                default:
                  return <span className="gov-badge gov-badge-neutral text-[10px]">LOW</span>;
              }
            };

            return (
              <button
                key={parcel.id}
                onClick={() => onSelectParcel(parcel)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  isSelected
                    ? 'border-2 border-[#1D4ED8] bg-[#EFF6FF] shadow-xs'
                    : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                {/* Row 1: Survey Number + Priority + Due Hours */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono font-bold text-sm text-[#0B3D66]">
                    Survey #{parcel.surveyNumber}
                  </span>

                  <div className="flex items-center gap-2">
                    {getPriorityBadge()}
                    <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {parcel.dueHours}h SLA
                    </span>
                  </div>
                </div>

                {/* Row 2: Landowner & Village Details */}
                <div className="mb-3">
                  <div className="text-sm font-bold text-slate-900 leading-snug">
                    {parcel.ownerName}
                  </div>
                  <div className="text-xs text-slate-600 mt-1">
                    {parcel.village} • <strong className="text-slate-800 font-mono">{parcel.areaAcre} Acres</strong> ({parcel.category})
                  </div>
                </div>

                {/* Row 3: Status Chip & Attached Evidence Count */}
                <div className="flex items-center justify-between pt-2.5 border-t border-slate-200/80 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <Camera className="w-3.5 h-3.5 text-[#1D4ED8]" />
                    <span>{parcel.photos.length} Photos</span>
                  </div>

                  {getStatusBadge()}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
