import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  X,
  CheckCircle2,
  ChevronDown,
  Phone,
  HelpCircle,
  Network,
  Info,
  Award,
  Layers,
  FileCheck,
  ShieldAlert,
  Cpu
} from 'lucide-react';

export const GovInformationModals: React.FC = () => {
  const { isModalOpen, closeModal, openModal } = useModals();

  const aboutOpen = isModalOpen('about');
  const helplineOpen = isModalOpen('helpline');
  const faqsOpen = isModalOpen('faqs');
  const orgChartOpen = isModalOpen('orgChart');

  const [faqSearch, setFaqSearch] = useState('');
  const [expandedFaqIndex, setExpandedFaqIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is LandPulse and which Ministry operates it?',
      a: 'LandPulse is the official National Land Acquisition Intelligence & Transparency Platform developed under the Department of Land Resources (DoLR), Ministry of Rural Development, Government of India, in integration with PM GatiShakti National Master Plan (NMP).',
    },
    {
      q: 'How is compensation calculated under RFCTLARR Act, 2013?',
      a: 'Compensation is determined based on the higher of registered market value or average circle rate, multiplied by a rural factor (1.0x to 2.0x), plus 100% Solatium (mandatory statutory bonus) and 12% additional interest per annum from Section 4/11 notification date.',
    },
    {
      q: 'How can a landowner track payment disbursal?',
      a: 'Landowners can visit the "Citizen Corner" or use the "Track Land Case" tool by entering their Survey Number, Aadhaar OTP, or Khata Number to view their DBT status via PFMS in real time.',
    },
    {
      q: 'How does the Field Officer DGPS and GIS Satellite verification work?',
      a: 'Field Officers use high-precision NavIC/DGPS RTK equipment synchronized with Esri World Satellite Imagery and OpenStreetMap cadastral layers to pinpoint parcel boundary pegs and record geo-tagged photo evidence.',
    },
    {
      q: 'Where do I lodge an objection if my boundary or valuation is incorrect?',
      a: 'Objections under Section 15 of RFCTLARR Act can be submitted directly through the "Grievance / Section 15 Objection" modal on this portal or at the District Collector / CALA office within 60 days of the gazette notice.',
    },
  ];

  const filteredFaqs = faqs.filter(
    f =>
      f.q.toLowerCase().includes(faqSearch.toLowerCase()) ||
      f.a.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <>
      {/* ── 1. About LandPulse & SIH26016 Problem Statement Modal ── */}
      {aboutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3">
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                  About LandPulse &amp; Vision
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Smart India Hackathon SIH26016 • Ministry of Rural Development &amp; DoLR
                </p>
              </div>
              <button
                onClick={() => closeModal('about')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-4">
              
              {/* Section 1: National Vision & Mandate */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Problem Statement: SIH26016 Scope</span>
                </div>

                {/* Vision Box */}
                <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-5 mb-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-[#0D6832] mb-1">
                    National Vision &amp; Mandate
                  </div>
                  <p className="text-base sm:text-lg font-bold text-[#1E293B] leading-snug">
                    &quot;To transform India&apos;s land acquisition lifecycle from opaque, delayed paperwork into a transparent, geospatial, and AI-assisted single-source-of-truth for citizens and administrators.&quot;
                  </p>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    Mega infrastructure corridors across highways, freight lines, and industrial nodes frequently suffer 18–36 month delays due to fragmented cadastral titling, valuation disputes, and ground verification discrepancies. LandPulse unifies these systems end-to-end.
                  </p>
                </div>
              </div>

              {/* Section 2: Key Technical Innovations */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Core Innovations &amp; Architecture</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1E4D79] font-bold text-sm">
                      <Layers className="w-4 h-4 text-[#1E4D79]" />
                      <span>GIS Satellite Cadastral Sync</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Sub-meter accuracy overlaying Esri high-resolution satellite imagery with revenue survey numbers and OpenStreetMap infrastructure alignment corridors.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1E4D79] font-bold text-sm">
                      <FileCheck className="w-4 h-4 text-[#1E4D79]" />
                      <span>Automated RFCTLARR Valuation</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Statutory algorithm adhering to Sections 26–30: applying 1.0–2.0× rural multipliers, 100% Solatium, and 12% p.a. interest direct into PFMS DBT accounts.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1E4D79] font-bold text-sm">
                      <Cpu className="w-4 h-4 text-[#1E4D79]" />
                      <span>Predictive Risk AI &amp; Bottlenecks</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Machine learning risk models identifying high-litigation parcels, title contestation hazards, and scheduling bottlenecks before award deadlines expire.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 text-[#1E4D79] font-bold text-sm">
                      <ShieldAlert className="w-4 h-4 text-[#1E4D79]" />
                      <span>Section 15 Citizen Transparency</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Citizen self-service portal for real-time tracking, Aadhaar e-KYC award validation, and 60-day statutory objection submissions with CPGRAMS sync.
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 3: Statutory Standards Note */}
              <div className="bg-[#F0F6FB] border border-[#D3E4F2] rounded-xl p-4 flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1E4D79] text-white flex items-center justify-center text-xs font-serif font-bold shrink-0 mt-0.5">
                  i
                </div>
                <div className="text-xs leading-relaxed text-slate-700">
                  <span className="font-bold text-[#1E3A5F]">Statutory Entitlement &amp; Compliance Standards:</span>{' '}
                  Compliant with Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR), Guidelines for Indian Government Websites (GIGW 3.0), and PM GatiShakti National Master Plan guidelines.
                </div>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('about')}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 2. Helpline & Support Directory Modal ── */}
      {helplineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3">
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                  Helpline &amp; Citizen Support
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  24x7 Land Acquisition Assistance &amp; Helpdesk Directory
                </p>
              </div>
              <button
                onClick={() => closeModal('helpline')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-4">
              {/* Section 1: National Toll-Free */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">National Toll-Free Land Assistance</span>
                </div>

                <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-[#0D6832]">
                      Direct Citizen Support Line
                    </div>
                    <div className="text-2xl sm:text-3xl font-black text-[#0D6832] font-mono mt-1">
                      1800-11-LAND (1800-11-5263)
                    </div>
                    <div className="text-xs text-[#526477] mt-1">
                      Toll-free • Available in 12 Indian Languages • 24x7 Coverage
                    </div>
                  </div>
                  <div className="p-3 bg-emerald-100/60 rounded-full w-12 h-12 flex items-center justify-center shrink-0">
                    <Phone className="w-6 h-6 text-emerald-700" />
                  </div>
                </div>
              </div>

              {/* Section 2: Regional & Nodal Desks */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Regional &amp; Departmental Nodal Desks</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-sm text-[#1E4D79] block">Central PM GatiShakti Helpdesk</span>
                    <p className="text-xs text-slate-600">Nirman Bhawan, New Delhi</p>
                    <p className="text-xs font-mono font-medium text-slate-800">📞 011-2306-1248 | ✉️ support-gatishakti@gov.in</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-sm text-[#1E4D79] block">PFMS DBT Disbursal Cell</span>
                    <p className="text-xs text-slate-600">Ministry of Finance, New Delhi</p>
                    <p className="text-xs font-mono font-medium text-slate-800">📞 011-2334-9021 | ✉️ dbt-support@nic.in</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-sm text-[#1E4D79] block">CPGRAMS Grievance Cell</span>
                    <p className="text-xs text-slate-600">Department of Administrative Reforms</p>
                    <p className="text-xs font-mono font-medium text-slate-800">📞 011-2374-1000 | ✉️ pgportal@gov.in</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-sm text-[#1E4D79] block">DGPS / Spatial Survey Cell</span>
                    <p className="text-xs text-slate-600">Survey of India &amp; ISRO Bhuvan</p>
                    <p className="text-xs font-mono font-medium text-slate-800">📞 0135-2747051 | ✉️ survey-help@soi.gov.in</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-between pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  closeModal('helpline');
                  openModal('grievance');
                }}
                className="text-xs font-bold text-[#1E4D79] hover:underline cursor-pointer"
              >
                Need to lodge an official objection? Click here
              </button>
              <button
                type="button"
                onClick={() => closeModal('helpline')}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Close Support
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 3. Interactive FAQs Modal ── */}
      {faqsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3">
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                  Frequently Asked Questions (FAQs)
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  RFCTLARR 2013 Compensation, Valuation &amp; GIS Guidance
                </p>
              </div>
              <button
                onClick={() => closeModal('faqs')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {/* Search bar inside FAQs */}
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Search FAQs by question or keyword (e.g. compensation, objection, DGPS)..."
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-[#1E4D79] focus:ring-1 focus:ring-[#1E4D79]"
              />

              <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                  1
                </div>
                <span className="font-bold text-sm text-[#1E293B]">Frequently Asked Questions ({filteredFaqs.length})</span>
              </div>

              {/* Accordion FAQ list */}
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full text-left p-3.5 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-sm text-[#1E293B] transition-colors cursor-pointer"
                      >
                        <span className="pr-4">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="p-4 bg-white text-slate-700 leading-relaxed border-t border-slate-200 text-xs">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('faqs')}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Close FAQs
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ── 4. Ministry Structure & Org Chart Modal ── */}
      {orgChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3">
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                  Ministry Structure &amp; Framework
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Department of Land Resources (DoLR) • RFCTLARR 2013 Competent Authority Flow
                </p>
              </div>
              <button
                onClick={() => closeModal('orgChart')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 mt-4">
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Statutory Hierarchy &amp; Reporting Channels</span>
                </div>

                {/* Level 1: Union Cabinet */}
                <div className="p-4 bg-[#1E3A5F] text-white rounded-xl text-center max-w-md mx-auto shadow-sm">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Apex National Authority</span>
                  <h4 className="font-bold text-sm mt-0.5">Hon&apos;ble Union Minister for Rural Development &amp; DoLR</h4>
                  <p className="text-xs text-blue-200 mt-0.5">Krishi Bhawan, New Delhi</p>
                </div>

                <div className="w-0.5 h-4 bg-slate-300 mx-auto my-2"></div>

                {/* Level 2: Secretariat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-4 bg-[#F0F6FB] border border-[#D3E4F2] rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-[#1E4D79]">DoLR Secretariat</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">Secretary (Land Resources)</h5>
                    <p className="text-[11px] text-slate-600">Policy, Rules &amp; RFCTLARR Oversight</p>
                  </div>
                  <div className="p-4 bg-[#F0F6FB] border border-[#D3E4F2] rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-[#1E4D79]">PM GatiShakti Integration</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">Special Nodal Advisor</h5>
                    <p className="text-[11px] text-slate-600">Multi-modal Corridor Land Clearance</p>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-slate-300 mx-auto my-2"></div>

                {/* Level 3: State & District */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-amber-700">State Revenue Level</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">Principal Secretary (Revenue)</h5>
                    <p className="text-[11px] text-slate-600">State Gazette Notifications</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-700">District Authority</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">District Collector / CALA</h5>
                    <p className="text-[11px] text-slate-600">Award Declaration &amp; Sec 15 Hearings</p>
                  </div>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-blue-700">Field Cadre</span>
                    <h5 className="font-bold text-slate-900 text-xs mt-0.5">SLAO &amp; DGPS Revenue Inspector</h5>
                    <p className="text-[11px] text-slate-600">Ground Cadastral Demarcation</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end pt-6 mt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('orgChart')}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Close Structure
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
