import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  Search,
  X,
  CheckCircle2,
  MapPin,
  Download,
} from 'lucide-react';

export const CaseTrackerModal: React.FC = () => {
  const { isModalOpen, closeModal, openModal } = useModals();

  const [searchQuery, setSearchQuery] = useState('MH-PAL-2024-8821');
  const [hasSearched, setHasSearched] = useState(true);

  if (!isModalOpen('caseTracker')) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3">
          <div>
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
              Track Land Acquisition Case Status
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              National Unified Registry • DoLR Central MIS • Direct PFMS DBT Sync
            </p>
          </div>
          <button
            onClick={() => closeModal('caseTracker')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6 mt-4">
          
          {/* Section 1: Search */}
          <div>
            <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <span className="font-bold text-sm text-[#1E293B]">Case Search &amp; Identification</span>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter Case ID (e.g. MH-PAL-2024-8821), Survey No (142/3A), or Khata No"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] font-mono text-slate-900"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="px-7 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Search Case
              </button>
            </form>
          </div>

          {hasSearched && (
            <div className="space-y-6">
              
              {/* Section 2: Case Dossier & Valuation */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Case Dossier &amp; Valuation Details</span>
                </div>

                {/* Disbursal Green Box */}
                <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-5 sm:p-6 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-[#1E436C] text-white text-[11px] font-mono font-bold px-2.5 py-0.5 rounded">
                        CASE #{caseData.caseId}
                      </span>
                      <span className="bg-emerald-100 text-[#0D6832] text-xs font-bold px-2.5 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Award Disbursed (PFMS DBT)
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-[#1E293B] mt-1">
                      {caseData.landowner}
                    </h3>
                    <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {caseData.village}, {caseData.district}
                    </p>
                  </div>

                  <div className="sm:text-right">
                    <div className="text-xs text-slate-500 font-medium">Total Statutory Award</div>
                    <div className="text-3xl font-extrabold text-[#0D6832] font-sans">
                      ₹{caseData.valuationCr} Cr
                    </div>
                    <div className="text-xs text-[#0D6832] font-semibold mt-0.5">100% PFMS DBT Disbursed</div>
                  </div>
                </div>

                {/* Attributes Table Card */}
                <div className="bg-white border border-slate-200/90 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs shadow-2xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Survey / Plot No:</span>
                    <strong className="text-slate-900 font-mono text-sm">{caseData.surveyNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Khata Account:</span>
                    <strong className="text-slate-900 font-mono text-sm">{caseData.khataNumber}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Acquired Land Area:</span>
                    <strong className="text-slate-900">{caseData.landAreaAcres} Acres ({caseData.landType})</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Competent Authority (CALA):</span>
                    <strong className="text-slate-900">{caseData.calaOfficer}</strong>
                  </div>
                </div>
              </div>

              {/* Section 3: Statutory Stages */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">RFCTLARR Statutory Progress Lifecycle</span>
                </div>

                <div className="space-y-3">
                  {caseData.stages.map((stg) => (
                    <div key={stg.step} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h5 className="text-sm font-bold text-[#1E293B]">{stg.title}</h5>
                          <span className="text-xs font-mono text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded">
                            {stg.date}
                          </span>
                        </div>
                        {stg.gazetteRef && (
                          <p className="text-xs text-[#1E4D79] font-mono mt-1">{stg.gazetteRef}</p>
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

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
          <div className="flex items-center gap-3 text-xs">
            <button
              onClick={() => {
                closeModal('caseTracker');
                openModal('grievance');
              }}
              className="text-[#1E4D79] font-bold hover:underline cursor-pointer"
            >
              Lodge Section 15 Objection
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => {
                closeModal('caseTracker');
                openModal('calc');
              }}
              className="text-[#1E4D79] font-bold hover:underline cursor-pointer"
            >
              Recalculate Compensation
            </button>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => alert('Downloading Official Case Status Receipt (PDF)')}
              className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold text-sm rounded-lg hover:bg-slate-50 shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-4 h-4" /> Download Receipt
            </button>
            <button
              type="button"
              onClick={() => closeModal('caseTracker')}
              className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
