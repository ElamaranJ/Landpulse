import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import {
  Search,
  X,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Download,
  Building,
  MapPin,
  Calendar,
  Share2,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const CaseTrackerModal: React.FC = () => {
  const { caseTrackerOpen, setCaseTrackerOpen, setGrievanceModalOpen, setCalcModalOpen } = useRole();

  const [searchQuery, setSearchQuery] = useState('MH-PAL-2024-8821');
  const [hasSearched, setHasSearched] = useState(true);

  if (!caseTrackerOpen) return null;

  // Mock Case Record
  const caseData = {
    caseId: 'MH-PAL-2024-8821',
    surveyNumber: '142/3A',
    khataNumber: 'KH-9021',
    landowner: 'Ramesh Narayan Patel & 2 Co-Sharers',
    aadhaarMasked: 'XXXX-XXXX-8921',
    village: 'Vevoor, Taluka Palghar',
    district: 'Palghar, Maharashtra',
    projectName: 'Delhi–Mumbai Expressway (Phase IV - Vadodara-Mumbai Spur)',
    projectCode: 'DME-EXP-08',
    landAreaAcres: 2.45,
    landType: 'Agricultural (Irrigated)',
    valuationCr: 1.84,
    disbursedCr: 1.84,
    currentStatus: 'COMPENSATION_DISBURSED',
    calaOfficer: 'Dr. Rajeshwar Verma, IAS (SLAO Palghar)',
    stages: [
      {
        step: 1,
        code: 'SEC_4_1',
        title: 'Section 4(1) Preliminary Notification',
        date: '14 Jan 2025',
        status: 'COMPLETED',
        gazetteRef: 'Extra-Ordinary Gazette No. 412/MH/2025',
      },
      {
        step: 2,
        code: 'SEC_11_SIA',
        title: 'Section 11 Social Impact Assessment (SIA) & Public Hearing',
        date: '28 Apr 2025',
        status: 'COMPLETED',
        notes: 'Gram Sabha approval passed unanimously at Vevoor Panchayat.',
      },
      {
        step: 3,
        code: 'SEC_19_1',
        title: 'Section 19(1) Declaration of Acquisition & R&R Scheme',
        date: '18 Aug 2025',
        status: 'COMPLETED',
        gazetteRef: 'Gazette S.O. 1928(E) dated 18.08.2025',
      },
      {
        step: 4,
        code: 'SEC_23_AWARD',
        title: 'Section 23 Award & Solatium Determination',
        date: '10 Feb 2026',
        status: 'COMPLETED',
        notes: '100% Solatium (₹92 Lakh) + 12% Interest approved by CALA.',
      },
      {
        step: 5,
        code: 'SEC_77_PFMS',
        title: 'Section 77 Direct Benefit Transfer (PFMS RTGS)',
        date: '14 Jun 2026',
        status: 'COMPLETED',
        notes: 'Disbursed directly to SBI A/c XXXX4819 via PFMS DBT Batch #9921.',
      },
    ],
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <Search className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Track Land Acquisition Case Status</h2>
              <p className="text-xs text-blue-200">
                National Unified Registry • DoLR Central MIS • Direct PFMS DBT Sync
              </p>
            </div>
          </div>
          <button
            onClick={() => setCaseTrackerOpen(false)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Search Input Bar */}
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter Acquisition Case ID (e.g. MH-PAL-2024-8821), Survey No (142/3A), or Khata No"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0B3D66] focus:bg-white font-mono font-bold text-slate-800"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              Search Case
            </button>
          </form>

          {hasSearched && (
            <div className="space-y-6">
              {/* Summary Card */}
              <div className="bg-[#F8FAFC] border border-slate-300 rounded-xl p-5 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs font-mono font-bold px-2 py-0.5 rounded">
                        CASE: {caseData.caseId}
                      </span>
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Award Disbursed (PFMS DBT)
                      </span>
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">
                      {caseData.landowner}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {caseData.village}, {caseData.district}
                    </p>
                  </div>

                  <div className="text-right">
                    <div className="text-xs text-slate-500">Total Statutory Award</div>
                    <div className="text-2xl font-extrabold text-[#0B3D66] font-mono">
                      ₹{caseData.valuationCr} Cr
                    </div>
                    <div className="text-[11px] text-emerald-700 font-bold">100% PFMS DBT Disbursed</div>
                  </div>
                </div>

                {/* Key Attributes Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Survey / Plot No:</span>
                    <strong className="text-slate-900 font-mono text-sm">{caseData.surveyNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Khata Account:</span>
                    <strong className="text-slate-900 font-mono">{caseData.khataNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Acquired Land Area:</span>
                    <strong className="text-slate-900">{caseData.landAreaAcres} Acres ({caseData.landType})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Competent Authority (CALA):</span>
                    <strong className="text-slate-900">{caseData.calaOfficer}</strong>
                  </div>
                </div>
              </div>

              {/* 5-Stage Statutory Progress Flow */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  RFCTLARR Statutory Progress Lifecycle
                </h4>

                <div className="relative pl-6 border-l-2 border-emerald-500 space-y-5">
                  {caseData.stages.map((stg) => (
                    <div key={stg.step} className="relative group">
                      {/* Step node icon */}
                      <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                        ✓
                      </div>

                      <div className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs hover:border-blue-400 transition-colors">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-xs font-bold text-slate-900">{stg.title}</h5>
                          <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                            {stg.date}
                          </span>
                        </div>
                        {stg.gazetteRef && (
                          <p className="text-xs text-blue-700 font-mono mt-1">{stg.gazetteRef}</p>
                        )}
                        {stg.notes && (
                          <p className="text-xs text-slate-600 mt-1">{stg.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setCaseTrackerOpen(false);
                setGrievanceModalOpen(true);
              }}
              className="text-xs text-[#0B3D66] font-bold hover:underline"
            >
              Lodge Section 15 Objection
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                setCaseTrackerOpen(false);
                setCalcModalOpen(true);
              }}
              className="text-xs text-[#0B3D66] font-bold hover:underline"
            >
              Re-calculate Solatium
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Downloading Official Case Status Receipt (PDF)')}
              className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5" /> Download Case Receipt
            </button>
            <button
              onClick={() => setCaseTrackerOpen(false)}
              className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
