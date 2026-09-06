import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  X,
  CheckCircle2,
  Clock,
  Upload,
  Send,
  Phone,
} from 'lucide-react';

interface TrackingResult {
  ticket: string;
  filedDate: string;
  status: string;
  hearingDate: string;
  bench: string;
  assignedOfficer: string;
  remarks: string;
}

export const GrievanceModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();

  const [activeTab, setActiveTab] = useState<'lodge' | 'track'>('lodge');
  const [caseId, setCaseId] = useState('MH-PAL-2024-8821');
  const [surveyNo, setSurveyNo] = useState('142/3A');
  const [claimantName, setClaimantName] = useState('Ramesh Narayan Patel');
  const [phone, setPhone] = useState('98201 44521');
  const [category, setCategory] = useState('undervaluation_trees');
  const [grievanceText, setGrievanceText] = useState(
    '14 mature Alfonso Mango trees and 1 commercial borewell were omitted from the initial Joint Measurement Survey (JMS) Form 7 award sheet.'
  );
  const [submittedTicket, setSubmittedTicket] = useState<string | null>(null);

  // Tracking tab state
  const [trackTicketNumber, setTrackTicketNumber] = useState('CPGRAMS-DoLR-2026-88219');
  const [trackingResult] = useState<TrackingResult>({
    ticket: 'CPGRAMS-DoLR-2026-88219',
    filedDate: '12 Aug 2026',
    status: 'HEARING_SCHEDULED',
    hearingDate: '04 Sep 2026, 11:30 AM',
    bench: 'Lok Adalat & CALA Grievance Redressal Bench, Collectorate Palghar',
    assignedOfficer: 'Dr. Rajeshwar Verma, IAS (SLAO)',
    remarks: 'Field Re-inspection order issued to Revenue Inspector S. Murugan with NavIC DGPS RTK kit.',
  });

  if (!isModalOpen('grievance')) return null;

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `CPGRAMS-DoLR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(token);
  };

  const handleReset = () => {
    setCaseId('');
    setSurveyNo('');
    setClaimantName('');
    setPhone('');
    setGrievanceText('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
        
        {/* Header */}
        <div className="flex items-start justify-between pb-3">
          <div>
            <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
              Lodge Objection &amp; CPGRAMS Grievance
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Statutory Section 15 Inquiries &amp; Direct CALA Redressal Gateway
            </p>
          </div>
          <button
            onClick={() => closeModal('grievance')}
            className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch bar */}
        <div className="flex bg-[#EEF3F8] p-1 rounded-xl gap-1 mt-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveTab('lodge')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'lodge'
                ? 'bg-white text-[#1E3A5F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lodge Section 15 Objection / Grievance
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer ${
              activeTab === 'track'
                ? 'bg-white text-[#1E3A5F] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Track Existing Grievance Status
          </button>
        </div>

        {/* Content Body */}
        <div className="space-y-6">
          {activeTab === 'lodge' ? (
            submittedTicket ? (
              <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-2xl p-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#1E293B]">
                    Statutory Objection Registered Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your Section 15 objection has been scheduled for CALA hearing under RFCTLARR Act 2013.
                  </p>
                </div>

                <div className="bg-white px-6 py-3 rounded-xl border border-emerald-200 inline-block font-mono text-xl font-extrabold text-[#0D6832] shadow-xs">
                  {submittedTicket}
                </div>

                <p className="text-xs text-slate-500">
                  SMS confirmation with hearing notice link dispatched to <strong>+91 {phone}</strong>.
                </p>

                <div className="pt-2 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setActiveTab('track');
                    }}
                    className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    View Hearing Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitGrievance} className="space-y-6">
                
                {/* Section 1 */}
                <div>
                  <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      1
                    </div>
                    <span className="font-bold text-sm text-[#1E293B]">Landowner &amp; Parcel Details</span>
                  </div>

                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Case Reference Number <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={caseId}
                          onChange={(e) => setCaseId(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] font-mono text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Survey / Cadastral Plot No. <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={surveyNo}
                          onChange={(e) => setSurveyNo(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] font-mono text-slate-900"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Claimant / Landowner Name <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={claimantName}
                          onChange={(e) => setClaimantName(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                          Mobile Number for SMS Notices <span className="text-rose-500 font-bold">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] font-mono text-slate-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section 2 */}
                <div>
                  <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                    <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      2
                    </div>
                    <span className="font-bold text-sm text-[#1E293B]">Objection Category &amp; Evidence</span>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Grievance / Objection Category <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] text-slate-900 cursor-pointer"
                      >
                        <option value="undervaluation_trees">Section 15: Omission / Undervaluation of Trees, Crops or Structures</option>
                        <option value="boundary_dispute">Section 15: Discrepancy in Survey Boundary / Area Calculation</option>
                        <option value="title_claim">Section 15: Title Dispute / Co-Sharer Apportionment Claim</option>
                        <option value="solatium_delay">Section 77: Delay in Direct Benefit Transfer (PFMS DBT) Compensation</option>
                        <option value="rr_housing">Section 31: R&amp;R Model Colony Housing Allotment Issue</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Detailed Grounds of Objection / Statement <span className="text-rose-500 font-bold">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={grievanceText}
                        onChange={(e) => setGrievanceText(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79] text-slate-900"
                      />
                    </div>

                    {/* Upload */}
                    <div className="p-4 bg-slate-50 border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Upload className="w-5 h-5 text-slate-500" />
                        <div>
                          <div className="text-xs font-semibold text-slate-700">Attach Evidentiary Documents (7/12 Extract, Photo Proof)</div>
                          <div className="text-[11px] text-slate-400">PDF, JPG up to 10 MB</div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => alert('7_12_Extract_Survey142_3A.pdf attached')}
                        className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 rounded-lg shadow-2xs cursor-pointer"
                      >
                        Attach File
                      </button>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-8 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4 text-amber-300" />
                    <span>Submit Statutory Objection</span>
                  </button>
                </div>

              </form>
            )
          ) : (
            <div className="space-y-6">
              
              {/* Section 1: Track */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Grievance Tracking Token</span>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    value={trackTicketNumber}
                    onChange={(e) => setTrackTicketNumber(e.target.value)}
                    placeholder="Enter Grievance / CPGRAMS Token"
                    className="flex-1 px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm font-mono font-bold text-slate-800 focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
                  />
                  <button
                    onClick={() => alert('Refreshing status for ' + trackTicketNumber)}
                    className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
                  >
                    Track Status
                  </button>
                </div>
              </div>

              {/* Status Card */}
              <div className="bg-white border border-slate-200/90 rounded-2xl p-6 space-y-4 shadow-xs">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="text-xs text-slate-500 font-mono">TICKET #{trackingResult.ticket}</div>
                    <h4 className="text-base font-bold text-[#1E293B] mt-0.5">
                      Omission of 14 Alfonso Mango Trees &amp; Borewell
                    </h4>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-3 py-1 rounded-full border border-amber-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Hearing Scheduled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block mb-0.5">Hearing Date &amp; Time:</span>
                    <strong className="text-[#1E4D79] text-sm">{trackingResult.hearingDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Hearing Authority / Bench:</span>
                    <strong className="text-slate-900">{trackingResult.bench}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Assigned Officer:</span>
                    <strong className="text-slate-900">{trackingResult.assignedOfficer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block mb-0.5">Filed On:</span>
                    <strong className="text-slate-900">{trackingResult.filedDate}</strong>
                  </div>
                </div>

                <div className="bg-[#F0F6FB] border border-[#D3E4F2] rounded-xl p-4 text-xs">
                  <span className="font-bold text-[#1E3A5F] block mb-1">Competent Authority Remarks:</span>
                  <p className="text-slate-700 leading-relaxed">{trackingResult.remarks}</p>
                </div>
              </div>

              {/* Bottom Close */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-[#1E4D79]" /> Grievance Helpline: <strong>1800-11-2026</strong>
                </div>
                <button
                  type="button"
                  onClick={() => closeModal('grievance')}
                  className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
