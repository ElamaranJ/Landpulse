import React, { useState } from 'react';
import { MOCK_DISTRICT_CASES } from '../../../data/mockData';
import { CitizenCase } from '../../../types';
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Landmark,
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BrutalistCaseTableProps {
  cases?: CitizenCase[];
  onOpenDisbursementModal: (caseItem: CitizenCase) => void;
  onViewCitizenView: () => void;
}

export const BrutalistCaseTable: React.FC<BrutalistCaseTableProps> = ({
  cases,
  onOpenDisbursementModal,
  onViewCitizenView,
}) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState('');
  const [internalStatusFilter, setInternalStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);

  // If cases prop is provided from parent with external debounced search/filter, use it; otherwise fallback to internal
  const displayCases = cases ?? MOCK_DISTRICT_CASES.filter((c) => {
    const matchesSearch =
      c.surveyNo.toLowerCase().includes(internalSearchTerm.toLowerCase()) ||
      c.owner.toLowerCase().includes(internalSearchTerm.toLowerCase()) ||
      c.village.toLowerCase().includes(internalSearchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(internalSearchTerm.toLowerCase());
    const matchesStatus = internalStatusFilter === 'ALL' || c.status === internalStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'AWARDED':
        return <span className="gov-status-current">Award Published</span>;
      case 'COMPLETED':
        return <span className="gov-status-completed">Possession Taken</span>;
      case 'OBJECTION_PENDING':
        return <span className="gov-status-critical">Sec-15 Objection</span>;
      case 'PENDING_SURVEY':
        return <span className="gov-status-pending">Survey Pending</span>;
      case 'IN_PROGRESS':
        return <span className="gov-status-current">In Progress (SIA)</span>;
      case 'DELAYED':
        return <span className="gov-status-critical">Court Stay</span>;
      default:
        return <span className="gov-status-pending">{status || 'Pending'}</span>;
    }
  };

  return (
    <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', padding: '14px 16px', marginBottom: '12px' }}>
      {/* Table Title & Metadata Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4" style={{ paddingBottom: '8px', marginBottom: '10px', borderBottom: '2px solid #0B3D66' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>PALGHAR DIVISION &bull; NIC REVENUE SYNC &bull; RFCTLARR ACT 2013</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#0B3D66' }}>Cadastral Land Acquisition Ledger</div>
        </div>

        {/* If no external cases prop is supplied, show fallback toolbar */}
        {cases === undefined && (
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={internalSearchTerm}
                onChange={(e) => setInternalSearchTerm(e.target.value)}
                placeholder="Search Survey #, Owner, Village..."
                className="gov-input pl-10 w-60 sm:w-72 text-sm"
              />
            </div>
            <select
              value={internalStatusFilter}
              onChange={(e) => setInternalStatusFilter(e.target.value)}
              className="gov-select text-sm"
            >
              <option value="ALL">All Statutory Statuses</option>
              <option value="AWARDED">Award Published</option>
              <option value="COMPLETED">Possession Taken</option>
              <option value="OBJECTION_PENDING">Sec 15 Objection</option>
              <option value="PENDING_SURVEY">Pending Survey</option>
              <option value="IN_PROGRESS">In Progress (SIA)</option>
              <option value="DELAYED">Court Stay / Delayed</option>
            </select>
          </div>
        )}
      </div>

      {/* Modern Government Table with High Contrast */}
      <div className="gov-table-wrapper overflow-x-auto">
        <table className="gov-stage-register" style={{ tableLayout: 'fixed', width: '100%', minWidth: '1080px' }}>
          <colgroup>
            <col style={{ width: '115px' }} />
            <col style={{ width: 'auto' }} />
            <col style={{ width: '125px' }} />
            <col style={{ width: '120px' }} />
            <col style={{ width: '140px' }} />
            <col style={{ width: '135px' }} />
            <col style={{ width: '110px' }} />
            <col style={{ width: '140px' }} />
          </colgroup>
          <thead>
            <tr>
              <th style={{ width: '115px' }}>Survey / UID</th>
              <th>Landowner &amp; Village</th>
              <th style={{ width: '125px' }}>Area / Type</th>
              <th style={{ width: '120px' }}>Section</th>
              <th style={{ width: '140px' }}>Status</th>
              <th style={{ width: '135px' }}>Signoff</th>
              <th style={{ width: '110px', textAlign: 'right' }}>Valuation</th>
              <th style={{ width: '140px', textAlign: 'center' }}>Details</th>
            </tr>
          </thead>
          <tbody>
            {displayCases.length > 0 ? (
              displayCases.map((row) => (
                <tr key={row.id}>
                  {/* Survey No */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 700, color: '#0B3D66', fontSize: '14.5px' }}>
                      #{row.surveyNo}
                    </div>
                    <span style={{ fontSize: '12.5px', color: '#94A3B8' }}>{row.id}</span>
                  </td>

                  {/* Owner & Village */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '15px' }}>{row.owner}</div>
                    <span style={{ fontSize: '13px', color: '#64748B' }}>
                      {row.village} • Aadhaar Seeded
                    </span>
                  </td>

                  {/* Area & Type */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <span style={{ color: '#047857', fontWeight: 700, fontSize: '14.5px' }}>{row.area}</span>
                    <span style={{ color: '#64748B', display: 'block', fontSize: '12.5px' }}>({row.category})</span>
                  </td>

                  {/* Statutory Section */}
                  <td style={{ verticalAlign: 'middle' }}>
                    <span style={{ fontSize: '13.5px', color: '#334155', fontWeight: 600 }}>
                      {row.stage}
                    </span>
                  </td>

                  {/* Status Text */}
                  <td style={{ verticalAlign: 'middle' }}>{getStatusText(row.status)}</td>

                  {/* SLAO Authority */}
                  <td style={{ verticalAlign: 'middle', fontSize: '13.5px' }}>
                    <span style={{ color: '#1E293B', display: 'block', fontWeight: 600 }}>Dy. Collector</span>
                    <span style={{ color: '#059669', fontWeight: 700, fontSize: '12.5px' }}>DSC Signed ✓</span>
                  </td>

                  {/* Valuation */}
                  <td style={{ textAlign: 'right', fontWeight: 700, fontSize: '14.5px', color: '#0F172A', verticalAlign: 'middle' }}>
                    {row.amountCr}
                  </td>

                  {/* Action Trigger */}
                  <td style={{ textAlign: 'center', verticalAlign: 'middle', whiteSpace: 'nowrap' }}>
                    {row.status === 'AWARDED' ? (
                      <button
                        type="button"
                        onClick={() => onOpenDisbursementModal(row)}
                        className="gov-flat-btn gov-flat-btn-orange"
                        style={{ fontSize: '12px', padding: '4px 10px', width: '126px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Landmark className="w-4 h-4" />
                        <span>{row.actionRequired}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={onViewCitizenView}
                        className="gov-flat-btn gov-flat-btn-secondary"
                        style={{ fontSize: '12px', padding: '4px 10px', width: '126px', height: '28px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}
                      >
                        <Eye className="w-4 h-4" />
                        <span>Inspect Dossier</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="py-12 text-center text-slate-500">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <AlertCircle className="w-8 h-8 text-slate-400" />
                    <p className="font-semibold text-sm text-slate-700">No cadastral cases match your search or filter.</p>
                    <p className="text-xs text-slate-400">Try adjusting your survey number, owner name, village, or status filter.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination & Ledger Metadata Footer */}
      <div className="pt-3 mt-3 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono gap-3" style={{ borderTop: '1px solid #CBD5E1' }}>
        <div className="flex items-center gap-4">
          <span>
            Showing <strong>1–{displayCases.length}</strong> of{' '}
            <strong>{MOCK_DISTRICT_CASES.length}</strong> Cadastral Parcels
          </span>
          <span className="hidden sm:inline text-slate-300">|</span>
          <span className="hidden sm:inline text-emerald-700 font-bold">
            PFMS Gateway Disbursal Batch: #2026-08-MH-9812
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            disabled={currentPage === 1}
            style={{ width: '28px', height: '28px', borderRadius: '2px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: currentPage === 1 ? 0.4 : 1 }}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span style={{ padding: '2px 10px', borderRadius: '2px', backgroundColor: '#0B3D66', color: '#FFFFFF', fontWeight: 700, fontSize: '12px' }}>
            1
          </span>
          <span className="px-1 text-slate-400">/ 1</span>
          <button
            disabled={true}
            style={{ width: '28px', height: '28px', borderRadius: '2px', border: '1px solid #CBD5E1', backgroundColor: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: 0.4 }}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
