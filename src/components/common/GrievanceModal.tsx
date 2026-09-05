import React, { useState } from 'react';
import { useRole } from '../../context/RoleContext';
import {
  AlertCircle,
  X,
  FileCheck2,
  Send,
  Upload,
  CheckCircle2,
  Clock,
  HelpCircle,
  Phone,
  FileText,
} from 'lucide-react';

export const GrievanceModal: React.FC = () => {
  const { grievanceModalOpen, setGrievanceModalOpen } = useRole();

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
  const [trackingResult, setTrackingResult] = useState<any>({
    ticket: 'CPGRAMS-DoLR-2026-88219',
    filedDate: '12 Aug 2026',
    status: 'HEARING_SCHEDULED',
    hearingDate: '04 Sep 2026, 11:30 AM',
    bench: 'Lok Adalat & CALA Grievance Redressal Bench, Collectorate Palghar',
    assignedOfficer: 'Dr. Rajeshwar Verma, IAS (SLAO)',
    remarks: 'Field Re-inspection order issued to Revenue Inspector S. Murugan with NavIC DGPS RTK kit.',
  });

  if (!grievanceModalOpen) return null;

  const handleSubmitGrievance = (e: React.FormEvent) => {
    e.preventDefault();
    const token = `CPGRAMS-DoLR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
    setSubmittedTicket(token);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <AlertCircle className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">CPGRAMS &amp; Section 15 Statutory Objection Portal</h2>
              <p className="text-xs text-blue-200">
                Department of Administrative Reforms &amp; Public Grievances (DARPG) • DoLR
              </p>
            </div>
          </div>
          <button
            onClick={() => setGrievanceModalOpen(false)}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 font-bold text-xs">
          <button
            onClick={() => setActiveTab('lodge')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'lodge'
                ? 'bg-white text-[#0B3D66] border-[#0B3D66]'
                : 'text-slate-600 border-transparent hover:bg-slate-100'
            }`}
          >
            Lodge Section 15 Objection / CPGRAMS Grievance
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`flex-1 py-3 text-center border-b-2 transition-colors ${
              activeTab === 'track'
                ? 'bg-white text-[#0B3D66] border-[#0B3D66]'
                : 'text-slate-600 border-transparent hover:bg-slate-100'
            }`}
          >
            Track Existing Grievance Status
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'lodge' ? (
            submittedTicket ? (
              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-4">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <div>
                  <h3 className="text-base font-bold text-emerald-900">
                    Statutory Objection Registered Successfully!
                  </h3>
                  <p className="text-xs text-slate-600 mt-1">
                    Your Section 15 objection has been scheduled for CALA hearing under RFCTLARR Act 2013.
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200 inline-block font-mono text-lg font-extrabold text-[#0B3D66]">
                  {submittedTicket}
                </div>

                <p className="text-xs text-slate-500">
                  SMS confirmation with hearing notice link dispatched to <strong>+91 {phone}</strong>.
                </p>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSubmittedTicket(null);
                      setActiveTab('track');
                    }}
                    className="px-5 py-2 bg-[#0B3D66] text-white text-xs font-bold rounded-lg"
                  >
                    View Hearing Details
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitGrievance} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Case Reference Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={caseId}
                      onChange={(e) => setCaseId(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Survey / Cadastral Plot No. <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={surveyNo}
                      onChange={(e) => setSurveyNo(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900 font-semibold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Claimant / Landowner Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={claimantName}
                      onChange={(e) => setClaimantName(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number for SMS Notices <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Grievance / Objection Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] text-slate-900"
                  >
                    <option value="undervaluation_trees">Section 15: Omission / Undervaluation of Trees, Crops or Structures</option>
                    <option value="boundary_dispute">Section 15: Discrepancy in Survey Boundary / Area Calculation</option>
                    <option value="title_claim">Section 15: Title Dispute / Co-Sharer Apportionment Claim</option>
                    <option value="solatium_delay">Section 77: Delay in Direct Benefit Transfer (PFMS DBT) Compensation</option>
                    <option value="rr_housing">Section 31: R&amp;R Model Colony Housing Allotment Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Detailed Grounds of Objection / Grievance Statement <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={grievanceText}
                    onChange={(e) => setGrievanceText(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] text-slate-900"
                  />
                </div>

                {/* Upload supporting documents */}
                <div className="p-3 bg-slate-50 border border-dashed border-slate-300 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4 text-slate-500" />
                    <div>
                      <div className="text-xs font-semibold text-slate-700">Attach Evidentiary Documents (7/12 Extract, Photo Proof)</div>
                      <div className="text-[10px] text-slate-400">PDF, JPG up to 10 MB</div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert('7_12_Extract_Survey142_3A.pdf attached')}
                    className="px-3 py-1 bg-white hover:bg-slate-100 border border-slate-300 text-xs font-bold text-slate-700 rounded shadow-xs"
                  >
                    Attach File
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>Submit Statutory Objection (DARPG/CPGRAMS)</span>
                </button>
              </form>
            )
          ) : (
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={trackTicketNumber}
                  onChange={(e) => setTrackTicketNumber(e.target.value)}
                  placeholder="Enter Grievance / CPGRAMS Token"
                  className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded font-mono font-bold"
                />
                <button
                  onClick={() => alert('Refreshing status for ' + trackTicketNumber)}
                  className="px-4 py-2 bg-[#0B3D66] text-white text-xs font-bold rounded"
                >
                  Track
                </button>
              </div>

              {/* Grievance Status Card */}
              <div className="bg-[#F8FAFC] border border-slate-300 rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                  <div>
                    <div className="text-xs text-slate-500 font-mono">TICKET #{trackingResult.ticket}</div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Omission of 14 Alfonso Mango Trees &amp; Borewell
                    </h4>
                  </div>
                  <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-1 rounded border border-amber-300 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" /> Hearing Scheduled
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-500 block">Hearing Date &amp; Time:</span>
                    <strong className="text-[#0B3D66] text-sm">{trackingResult.hearingDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Hearing Authority / Bench:</span>
                    <strong className="text-slate-900">{trackingResult.bench}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Assigned Officer:</span>
                    <strong className="text-slate-900">{trackingResult.assignedOfficer}</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Filed On:</span>
                    <strong className="text-slate-900">{trackingResult.filedDate}</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded border border-slate-200 text-xs">
                  <span className="font-bold text-slate-700 block mb-1">Competent Authority Remarks:</span>
                  <p className="text-slate-600">{trackingResult.remarks}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-[#0B3D66]" /> Grievance Helpline: <strong>1800-11-2026</strong>
          </div>
          <button
            onClick={() => setGrievanceModalOpen(false)}
            className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
