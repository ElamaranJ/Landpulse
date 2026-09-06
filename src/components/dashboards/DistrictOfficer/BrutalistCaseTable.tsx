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

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'AWARDED':
        return <span className="gov-badge gov-badge-warning">AWARD PUBLISHED</span>;
      case 'COMPLETED':
        return <span className="gov-badge gov-badge-success">POSSESSION TAKEN</span>;
      case 'OBJECTION_PENDING':
        return <span className="gov-badge gov-badge-critical">SEC-15 OBJECTION</span>;
      case 'PENDING_SURVEY':
        return <span className="gov-badge gov-badge-info">SURVEY PENDING</span>;
      case 'IN_PROGRESS':
        return <span className="gov-badge gov-badge-info">IN PROGRESS (SIA)</span>;
      case 'DELAYED':
        return <span className="gov-badge gov-badge-critical">COURT STAY</span>;
      default:
        return <span className="gov-badge gov-badge-neutral">{status || 'PENDING'}</span>;
    }
  };

  return (
    <div className="gov-card p-6 sm:p-7 mb-8">
      {/* Table Title & Metadata Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-lg sm:text-xl font-bold text-[#0B3D66] font-sans tracking-tight">
              Palghar Division — Cadastral Land Acquisition Ledger
            </h3>
            <span className="gov-badge gov-badge-success">NIC REVENUE SYNC</span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Statutory records under Section 4(1), 15, 19, &amp; 23 of RFCTLARR Act 2013
          </p>
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
        <table className="gov-table">
          <thead>
            <tr>
              <th>Survey / UID</th>
              <th>Landowner &amp; Village</th>
              <th>Area / Classification</th>
              <th>Statutory Section</th>
              <th>Status Stamp</th>
              <th>SLAO Signoff</th>
              <th className="text-right">Award Valuation</th>
              <th className="text-right">Action Protocol</th>
            </tr>
          </thead>
          <tbody>
            {displayCases.length > 0 ? (
              displayCases.map((row) => (
                <tr key={row.id}>
                  {/* Survey No */}
                  <td className="font-mono">
                    <div className="font-bold text-[#0B3D66] text-sm">
                      #{row.surveyNo}
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">{row.id}</span>
                  </td>

                  {/* Owner & Village */}
                  <td>
                    <div className="font-bold text-slate-900 text-sm font-sans">{row.owner}</div>
                    <span className="text-xs text-slate-500 font-mono block mt-0.5">
                      {row.village} • Aadhaar Seeded
                    </span>
                  </td>

                  {/* Area & Type */}
                  <td className="font-mono">
                    <span className="text-emerald-700 font-bold">{row.area}</span>
                    <span className="text-slate-500 block text-xs mt-0.5">({row.category})</span>
                  </td>

                  {/* Statutory Section */}
                  <td className="font-mono text-slate-700">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-xs font-bold">
                      {row.stage}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td>{getStatusBadge(row.status)}</td>

                  {/* SLAO Authority */}
                  <td className="font-mono text-xs text-slate-600">
                    <span className="text-slate-800 block font-semibold">Dy. Collector (LA)</span>
                    <span className="text-emerald-700 font-bold">DSC Verified ✓</span>
                  </td>

                  {/* Valuation */}
                  <td className="text-right font-mono font-bold text-[#EA580C] text-sm">
                    {row.amountCr}
                  </td>

                  {/* Action Trigger */}
                  <td className="text-right font-mono">
                    {row.status === 'AWARDED' ? (
                      <button
                        onClick={() => onOpenDisbursementModal(row)}
                        className="h-9 px-3.5 rounded-lg bg-[#EA580C] hover:bg-[#C2410C] text-white text-xs font-bold uppercase inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Landmark className="w-3.5 h-3.5" />
                        <span>{row.actionRequired}</span>
                      </button>
                    ) : (
                      <button
                        onClick={onViewCitizenView}
                        className="h-9 px-3.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-[#0B3D66] text-xs font-bold uppercase inline-flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
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
      <div className="pt-4 mt-4 flex flex-wrap items-center justify-between text-xs text-slate-600 font-mono gap-3 border-t border-slate-100">
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
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 rounded-lg bg-[#0B3D66] text-white font-bold text-xs">
            1
          </span>
          <span className="px-1 text-slate-400">/ 1</span>
          <button
            disabled={true}
            className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-600 disabled:opacity-40 hover:bg-slate-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
