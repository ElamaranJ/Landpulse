import React from 'react';
import { useModals } from '../../../context/ModalContext';
import {
  FileText,
  ShieldCheck,
  Clock,
  ExternalLink,
  Users,
  Layers,
  Scale,
  Send,
  Building2,
  Info
} from 'lucide-react';

export const RTIView: React.FC = () => {
  const { openModal } = useModals();

  const citizenCharter = [
    {
      step: 1,
      process: 'Preliminary Notification Publication',
      section: 'Section 4(1)',
      officer: 'District Collector / CALA',
      sla: 'Within 30 Days of Corridor Lock',
      status: 'completed',
    },
    {
      step: 2,
      process: 'Filing & Hearing of Section 15 Objections',
      section: 'Section 15(1) & (2)',
      officer: 'Competent Authority Land Acquisition',
      sla: '60 Days Window + 21 Days Hearing',
      status: 'completed',
    },
    {
      step: 3,
      process: 'Final Acquisition & R&R Declaration',
      section: 'Section 19(1)',
      officer: 'Appropriate Government (State/Centre)',
      sla: 'Within 12 Months of Section 4(1)',
      status: 'completed',
    },
    {
      step: 4,
      process: 'Compensation Award & Solatium Determination',
      section: 'Section 23 & 30',
      officer: 'Special Land Acquisition Officer (SLAO)',
      sla: 'Within 12 Months of Section 19',
      status: 'current',
    },
    {
      step: 5,
      process: 'Direct Bank Transfer (PFMS DBT) Payout',
      section: 'Section 77 Protocol',
      officer: 'Treasury / State Bank of India Gateway',
      sla: 'Within 14 Days of Award Seal',
      status: 'pending',
    },
  ];

  const pioDirectory = [
    {
      cadre: 'Central Public Information Officer (CPIO)',
      name: 'Shri Manoj Kumar Sharma, IRTS',
      designation: 'Director (Land Acquisition & Cadastre), DoLR',
      contact: '011-2306-1842 | cpio-dolr@gov.in',
      address: 'Room 312, Krishi Bhawan, New Delhi - 110001',
    },
    {
      cadre: 'First Appellate Authority (FAA)',
      name: 'Dr. Ananya Sengupta, IAS',
      designation: 'Joint Secretary (Public Policy & Transparency), MoRD',
      contact: '011-2338-9012 | faa-landpulse@gov.in',
      address: 'Room 204, Krishi Bhawan, New Delhi - 110001',
    },
    {
      cadre: 'State Nodal Officer (Maharashtra)',
      name: 'Shri Vikramaditya Kadam, IAS',
      designation: 'Principal Secretary (Revenue & Forest Dept)',
      contact: '022-2202-5511 | psec-revenue@maharashtra.gov.in',
      address: 'Mantralaya, Mumbai - 400032',
    },
  ];

  return (
    <div className="w-full max-w-[1920px] mx-auto space-y-6 pb-8 animate-fadeIn">
      {/* Outer Cadastre Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8 overflow-hidden relative">
        
        {/* Header with rural landscape watermark */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4 overflow-hidden">
          <div 
            className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 pointer-events-none opacity-30 sm:opacity-40 bg-no-repeat bg-right bg-contain"
            style={{ backgroundImage: `url('/images/header-rural-faded.png')` }}
          />

          <div className="relative z-10">
            <h1 className="text-3xl sm:text-[34px] font-bold text-[#1a2e3b] font-serif tracking-tight leading-tight">
              Citizen&apos;s Charter &amp; Service Guarantees
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Time-Bound Service Delivery Commitments &nbsp;|&nbsp; Right to Information (RTI) Act, 2005 &amp; RFCTLARR 2013
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1.5">
              Charter Mandate : <span className="font-bold text-slate-800">DoLR-CC-2026-SLA</span> &nbsp;|&nbsp; Enacted : <span className="font-bold text-slate-800">2013</span> &nbsp;|&nbsp; Last Audited : <span className="font-bold text-slate-800">27 Aug 2026</span>
            </p>
          </div>

          <div className="relative z-10 pr-2 select-none self-end md:self-auto text-right">
            <div className="font-slogan-script text-2xl sm:text-3xl text-[#5C4A3A]/85 font-normal italic transform -rotate-2 leading-snug">
              Accountable for a <br />
              <span className="text-xl sm:text-2xl ml-3">Better Tomorrow</span>
            </div>
          </div>
        </div>

        {/* Sticky Section Anchor Navigation */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-y border-slate-200 py-2.5 my-4 -mx-6 sm:-mx-8 px-6 sm:px-8 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Jump to:</span>
          <a
            href="#sla-commitments"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            SLA Commitments
          </a>
          <a
            href="#pio-directory"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Designated PIOs &amp; Hierarchy
          </a>
          <a
            href="#citizen-rights"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Citizen Rights (RTI Act)
          </a>
          <a
            href="#charter-lifecycle"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Delivery Lifecycle
          </a>
          <a
            href="#proactive-disclosures"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Proactive Section 4(1)(b) Disclosures
          </a>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          
          {/* Column 1: Statutory SLA Commitments (5 cols) */}
          <div id="sla-commitments" className="lg:col-span-5 flex flex-col scroll-mt-16">
            <div className="bg-[#EEF3F8] rounded-t-xl px-4 py-3 flex items-center gap-2.5 border border-slate-200 border-b-0">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#1E293B]">Service Delivery Commitments (SLAs)</h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden divide-y divide-slate-100 text-xs shadow-2xs flex-1">
              {citizenCharter.map((item) => (
                <div key={item.step} className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1E4D79] text-xs">
                      {item.step}. {item.process}
                    </span>
                    <span className="font-mono text-[10px] font-bold bg-[#EEF3F8] text-[#1E436C] px-2 py-0.5 rounded">
                      {item.section}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 text-[11px] pt-0.5">
                    <span>Authority: <strong className="text-slate-800">{item.officer}</strong></span>
                    <span className="font-semibold text-emerald-700 font-mono">{item.sla}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: CPIOs & Authority Matrix (4 cols) */}
          <div id="pio-directory" className="lg:col-span-4 flex flex-col space-y-4 scroll-mt-16">
            
            {/* Public Information Officers */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-[#1E293B]">
                  <Users className="w-4 h-4 text-[#1E4D79]" />
                  <span>Designated PIOs &amp; Appellate Authorities</span>
                </div>
              </div>

              <div className="p-3 space-y-2.5 text-xs divide-y divide-slate-100">
                {pioDirectory.map((pio, idx) => (
                  <div key={idx} className={idx > 0 ? 'pt-2.5 space-y-0.5' : 'space-y-0.5'}>
                    <div className="text-[10.5px] font-bold text-[#1E4D79] uppercase">{pio.cadre}</div>
                    <div className="font-bold text-slate-900 text-xs">{pio.name}</div>
                    <div className="text-[11px] text-slate-600">{pio.designation}</div>
                    <div className="text-[10.5px] font-mono text-slate-500 pt-0.5">{pio.contact}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RTI Hierarchy Box */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-2 bg-[#F8FAFC] border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-[#1E293B]">
                <div className="p-0.5 bg-emerald-100 rounded text-emerald-700">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>Statutory Appeal Hierarchy</span>
              </div>
              <div className="grid grid-cols-3 divide-x divide-slate-100 p-3 text-center text-xs">
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Stage 1</div>
                  <div className="font-bold text-slate-800 text-[11px]">CPIO (DoLR)</div>
                  <div className="text-[9.5px] text-slate-500">30 Days</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Stage 2</div>
                  <div className="font-bold text-slate-800 text-[11px]">First Appeal</div>
                  <div className="text-[9.5px] text-slate-500">30 Days</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-medium">Stage 3</div>
                  <div className="font-bold text-slate-800 text-[11px]">CIC Apex</div>
                  <div className="text-[9.5px] text-slate-500">Binding</div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: Citizen Rights & Next Actions (3 cols) */}
          <div id="citizen-rights" className="lg:col-span-3 bg-[#FFFDF9] border border-[#EBE3D5] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs scroll-mt-16">
            <div>
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EBE3D5]">
                <div className="w-7 h-7 rounded-full bg-[#8D6E42]/20 text-[#6D532B] flex items-center justify-center font-bold text-sm shrink-0 font-serif">
                  §
                </div>
                <h4 className="font-serif font-bold text-[#4A3B2C] text-sm leading-tight">
                  Citizen Statutory Rights <br />
                  <span className="text-xs font-normal text-slate-500">(RTI Act 2005)</span>
                </h4>
              </div>

              <div className="divide-y divide-[#F2EADB] text-xs mt-1">
                <div className="py-2">
                  <div className="text-[11px] text-slate-500">Inspection of Land Records</div>
                  <div className="font-bold text-[#1E293B]">Free of Charge (Sec 2(j))</div>
                  <div className="text-[10px] text-slate-500">Cadastral Maps &amp; Survey Pegs</div>
                </div>

                <div className="py-2">
                  <div className="text-[11px] text-slate-500">Certified Copies of Award</div>
                  <div className="font-bold text-[#1E293B]">₹2 / Page (Standard Norm)</div>
                  <div className="text-[10px] text-slate-500">Digital Copies via Vault Free</div>
                </div>

                <div className="py-2">
                  <div className="text-[11px] text-slate-500">Statutory Hearing Rights</div>
                  <div className="font-bold text-[#1E293B]">Section 15 Mandatory Hearing</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">21 Calendar Days Notice</div>
                </div>
              </div>
            </div>

            <div>
              <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-3.5 mt-2">
                <div className="text-[11px] font-bold text-slate-700">PFMS DBT Disbursal Norm</div>
                <div className="text-2xl font-extrabold text-[#0D6832] font-serif mt-0.5">
                  Within 14 Days
                </div>
                <div className="text-[10.5px] text-[#0D6832] mt-0.5">100% Tax Free under Sec 96</div>
              </div>

              <div className="bg-[#FFF8EB] border border-[#FEE6B8] rounded-xl p-2.5 flex items-start gap-2 mt-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-[#7C4A03] text-[11px]">Need to file an inquiry?</div>
                  <button
                    onClick={() => openModal('grievance')}
                    className="text-[#1E4D79] font-bold text-[10.5px] hover:underline block mt-0.5 cursor-pointer"
                  >
                    Lodge Section 15 Objection ↗
                  </button>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Key Updates: 5-Stage SLA Lifecycle Stepper */}
        <div id="charter-lifecycle" className="bg-[#F7FAF8] border border-[#DDE8E0] rounded-xl p-5 sm:p-6 mt-6 shadow-2xs scroll-mt-16">
          <h3 className="font-serif font-bold text-slate-800 text-base mb-6">Charter Service Delivery Lifecycle</h3>

          <div className="relative">
            <div className="hidden lg:block absolute top-[18px] left-[50px] right-[50px] h-[3px] bg-slate-200 z-0">
              <div className="h-full bg-[#2D6A4F]" style={{ width: '75%' }}></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
              {citizenCharter.map((stg) => {
                const isCompleted = stg.status === 'completed';
                const isCurrent = stg.status === 'current';
                const isPending = stg.status === 'pending';

                return (
                  <div key={stg.step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs mb-2 ${
                        isCompleted
                          ? 'bg-[#2D6A4F] text-white'
                          : isCurrent
                          ? 'bg-[#8C531B] text-white ring-4 ring-[#FFF3E0]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {stg.step}
                    </div>

                    <h5 className="text-[12px] font-bold text-slate-900 leading-snug min-h-[34px] flex items-center justify-center px-2">
                      {stg.process}
                    </h5>

                    <span className="text-[10.5px] text-slate-500 font-mono mt-1">
                      {stg.sla}
                    </span>

                    <div className="mt-2">
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2D6A4F] text-[10px] font-bold border border-[#C8E6C9]">
                          Active Standard
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3E0] text-[#8C531B] text-[10px] font-bold border border-[#FFE0B2]">
                          Statutory Audit
                        </span>
                      )}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium border border-slate-200">
                              Upcoming Phase
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Online RTI Filing & Section 4(1)(b) Proactive Disclosures */}
        <div id="proactive-disclosures" className="mt-8 space-y-4 scroll-mt-16">
          <div className="bg-[#EEF3F8] rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E436C] text-white flex items-center justify-center font-bold text-sm">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1E293B]">
                  Online RTI Portal Gateway &amp; Proactive Disclosures
                </h3>
                <p className="text-xs text-slate-500">
                  Mandatory transparency disclosures under Section 4(1)(b) of the Right to Information Act, 2005
                </p>
              </div>
            </div>
            <a
              href="https://rtionline.gov.in"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <span>National RTI Online Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#1E4D79]">Proactive Section 4(1)(b) Disclosures</h4>
              <p className="text-slate-600 leading-relaxed">
                All corridor alignment gazettes, social impact assessments (SIA), Gram Sabha resolutions, and compensation award sheets are published in open digital format.
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => openModal('openData')}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-[#1E4D79] hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  Open Data Datasets
                </button>
                <button
                  type="button"
                  onClick={() => openModal('notificationSearch')}
                  className="px-3.5 py-1.5 bg-white border border-slate-300 rounded-lg font-bold text-[#1E4D79] hover:bg-slate-50 cursor-pointer shadow-2xs"
                >
                  Gazette Archive
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h4 className="font-bold text-sm text-[#1E4D79]">Filing Fee &amp; Mode of Payment</h4>
              <p className="text-slate-600 leading-relaxed">
                Standard application fee of <strong>₹10</strong> payable via Bharatkosh, Net Banking, UPI, or Demand Draft. Citizens below poverty line (BPL) are exempt from all fees upon producing valid ration card.
              </p>
              <div className="text-[11px] font-mono text-emerald-700 font-bold pt-1">
                Response SLA: Strictly within 30 days of receipt by CPIO.
              </div>
            </div>
          </div>
        </div>

        {/* Footer Legal Notice (No Pagination Controls) */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 mt-8 border-t border-slate-100 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-600 text-white flex items-center justify-center font-serif text-[11px] font-bold shrink-0">
              i
            </div>
            <span>
              This charter represents statutory commitments under Section 4(1)(b) of RTI Act 2005 and is legally enforceable.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#sla-commitments"
              className="text-xs text-[#1E4D79] font-bold hover:underline"
            >
              ↑ Back to top
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
