import React, { useState } from 'react';
import { useModals } from '../../context/ModalContext';
import {
  Info,
  Phone,
  HelpCircle,
  Network,
  X,
  CheckCircle2,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Building2,
  ShieldAlert,
  Award,
  BookOpen,
  FileCheck
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 font-sans">
            <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Info className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">About LandPulse &amp; Vision</h2>
                  <p className="text-xs text-blue-200">
                    Smart India Hackathon SIH26016 • Ministry of Rural Development &amp; DoLR
                  </p>
                </div>
              </div>
              <button
                onClick={() => closeModal('about')}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
              {/* Mission Statement Box */}
              <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200">
                <span className="text-[10px] uppercase font-bold text-blue-900 tracking-wider block mb-1">
                  National Vision &amp; Mandate
                </span>
                <p className="text-sm font-semibold text-[#0B3D66]">
                  &quot;To transform India's land acquisition lifecycle from opaque, delayed paperwork into a transparent, geospatial, and AI-assisted single-source-of-truth for citizens and administrators.&quot;
                </p>
              </div>

              {/* SIH26016 Problem Statement */}
              <div>
                <h3 className="text-sm font-bold text-[#0B3D66] flex items-center gap-1.5 mb-2">
                  <Award className="w-4 h-4 text-amber-500" />
                  <span>SIH26016 Problem Statement Scope</span>
                </h3>
                <p>
                  Infrastructure bottlenecks in mega highway corridors, freight expressways, and industrial corridors often suffer 18–36 month delays due to fragmented cadastral titling, disputes in compensation awards, and lack of real-time spatial ground verification. LandPulse solves this via:
                </p>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 font-medium">
                  <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>GIS Satellite Map Layer:</strong> High-resolution Esri imagery with cadastral polygon boundaries.</span>
                  </li>
                  <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Field Officer Module:</strong> Prioritized queue, GPS navigation, and on-ground inspection submissions.</span>
                  </li>
                  <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>RFCTLARR 2013 Engine:</strong> Automated market rate multiplication, 100% Solatium, and DBT reconciliation.</span>
                  </li>
                  <li className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span><strong>Predictive Risk AI:</strong> Multi-factor bottleneck prediction with early litigation flagging.</span>
                  </li>
                </ul>
              </div>

              {/* Department Info */}
              <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
                <span>Department of Land Resources (DoLR) • Ministry of Rural Development</span>
                <span className="font-mono font-bold text-slate-700">LandPulse v2.4 (GIGW 3.0 Certified)</span>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => closeModal('about')}
                className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 2. Helpline & Support Directory Modal ── */}
      {helplineOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 font-sans">
            <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Phone className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Helpline &amp; Citizen Support</h2>
                  <p className="text-xs text-blue-200">
                    24x7 Land Acquisition Assistance &amp; Helpdesk Directory
                  </p>
                </div>
              </div>
              <button
                onClick={() => closeModal('helpline')}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* National Toll-Free Banner */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-emerald-800">National Land Acquisition Helpline</span>
                  <div className="text-xl font-black text-emerald-900 font-mono mt-0.5">1800-11-LAND (1800-11-5263)</div>
                  <span className="text-[11px] text-emerald-700">Toll-free • Available in 12 Indian Regional Languages • 24x7</span>
                </div>
                <Phone className="w-8 h-8 text-emerald-600 hidden sm:block" />
              </div>

              {/* Direct Help Desks */}
              <div className="space-y-2.5">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider text-slate-500">
                  Regional &amp; Departmental Nodal Desks
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-[#0B3D66] block">Central PM GatiShakti Helpdesk</span>
                    <p className="text-slate-600 text-[11px]">Nirman Bhawan, New Delhi</p>
                    <p className="text-slate-700 font-mono text-[11px]">📞 011-2306-1248 | ✉️ support-gatishakti@gov.in</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-[#0B3D66] block">PFMS DBT Disbursal Cell</span>
                    <p className="text-slate-600 text-[11px]">Ministry of Finance, New Delhi</p>
                    <p className="text-slate-700 font-mono text-[11px]">📞 011-2334-9021 | ✉️ dbt-support@nic.in</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-[#0B3D66] block">CPGRAMS Grievance Cell</span>
                    <p className="text-slate-600 text-[11px]">Department of Administrative Reforms</p>
                    <p className="text-slate-700 font-mono text-[11px]">📞 011-2374-1000 | ✉️ pgportal@gov.in</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="font-bold text-[#0B3D66] block">DGPS / Spatial Survey Cell</span>
                    <p className="text-slate-600 text-[11px]">Survey of India &amp; ISRO Bhuvan</p>
                    <p className="text-slate-700 font-mono text-[11px]">📞 0135-2747051 | ✉️ survey-help@soi.gov.in</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => {
                  closeModal('helpline');
                  openModal('grievance');
                }}
                className="text-xs font-bold text-blue-700 hover:underline cursor-pointer"
              >
                Need to lodge an official objection? Click here
              </button>
              <button
                onClick={() => closeModal('helpline')}
                className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 3. Interactive FAQs Modal ── */}
      {faqsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 font-sans">
            <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <HelpCircle className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Frequently Asked Questions (FAQs)</h2>
                  <p className="text-xs text-blue-200">
                    RFCTLARR 2013 Compensation, Valuation &amp; GIS Land Acquisition Guidance
                  </p>
                </div>
              </div>
              <button
                onClick={() => closeModal('faqs')}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              {/* Search bar inside FAQs */}
              <input
                type="text"
                value={faqSearch}
                onChange={e => setFaqSearch(e.target.value)}
                placeholder="Search FAQs by question or topic (e.g. compensation, objection, DGPS)..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              />

              {/* Accordion FAQ list */}
              <div className="space-y-2">
                {filteredFaqs.map((faq, idx) => {
                  const isExpanded = expandedFaqIndex === idx;
                  return (
                    <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setExpandedFaqIndex(isExpanded ? null : idx)}
                        className="w-full text-left p-3 bg-slate-50 hover:bg-slate-100 flex items-center justify-between font-bold text-[#0B3D66] transition-colors cursor-pointer"
                      >
                        <span className="pr-4">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>
                      {isExpanded && (
                        <div className="p-3.5 bg-white text-slate-700 leading-relaxed border-t border-slate-200 text-xs">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => closeModal('faqs')}
                className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded-lg cursor-pointer"
              >
                Close FAQs
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 4. Ministry Structure & Org Chart Modal ── */}
      {orgChartOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] text-slate-800 font-sans">
            <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                  <Network className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Ministry Structure &amp; Institutional Framework</h2>
                  <p className="text-xs text-blue-200">
                    Department of Land Resources (DoLR) • RFCTLARR 2013 Competent Authority Flow
                  </p>
                </div>
              </div>
              <button
                onClick={() => closeModal('orgChart')}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* Hierarchy Tree */}
              <div className="space-y-4">
                {/* Level 1: Union Cabinet & Ministry */}
                <div className="p-3 bg-blue-900 text-white rounded-xl text-center max-w-md mx-auto shadow-md">
                  <span className="text-[10px] uppercase tracking-wider text-amber-300 font-bold">Apex National Authority</span>
                  <h4 className="font-extrabold text-sm">Hon'ble Union Minister for Rural Development &amp; DoLR</h4>
                  <p className="text-[11px] text-blue-200 mt-0.5">Krishi Bhawan, New Delhi</p>
                </div>

                <div className="w-0.5 h-4 bg-slate-300 mx-auto"></div>

                {/* Level 2: Secretariat Leadership */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-blue-800">DoLR Secretariat</span>
                    <h5 className="font-bold text-slate-900 text-xs">Secretary (Land Resources)</h5>
                    <p className="text-[10.5px] text-slate-500">Policy, Rules &amp; RFCTLARR Oversight</p>
                  </div>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-center shadow-xs">
                    <span className="text-[10px] uppercase font-bold text-blue-800">PM GatiShakti Integration</span>
                    <h5 className="font-bold text-slate-900 text-xs">Special Nodal Advisor</h5>
                    <p className="text-[10.5px] text-slate-500">Multi-modal Corridor Land Clearance</p>
                  </div>
                </div>

                <div className="w-0.5 h-4 bg-slate-300 mx-auto"></div>

                {/* Level 3: State & District Authorities */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-orange-600">State Revenue Level</span>
                    <h5 className="font-bold text-slate-900 text-xs">Principal Secretary (Revenue)</h5>
                    <p className="text-[10.5px] text-slate-500">State Gazette Notifications</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-emerald-600">District Competent Authority</span>
                    <h5 className="font-bold text-slate-900 text-xs">District Collector / CALA</h5>
                    <p className="text-[10.5px] text-slate-500">Award Declaration &amp; Section 15 Hearings</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                    <span className="text-[10px] uppercase font-bold text-purple-600">Field Operational Cadre</span>
                    <h5 className="font-bold text-slate-900 text-xs">SLAO &amp; DGPS Revenue Inspector</h5>
                    <p className="text-[10.5px] text-slate-500">Ground Cadastral Demarcation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => closeModal('orgChart')}
                className="px-4 py-1.5 bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold rounded-lg cursor-pointer"
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
