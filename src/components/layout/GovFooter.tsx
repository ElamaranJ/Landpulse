import React from 'react';
import { useRole } from '../../context/RoleContext';
import { ExternalLink, Phone, Mail, MapPin, Map } from 'lucide-react';

export const GovFooter: React.FC = () => {
  const {
    setCurrentRole,
    setCalcModalOpen,
    setCaseTrackerOpen,
    setGrievanceModalOpen,
    setNotificationSearchOpen,
    setOpenDataOpen,
    setSiteMapOpen,
    setPrivacyPolicyOpen,
  } = useRole();

  return (
    <footer className="w-full bg-[#0B3D66] text-white border-t-4 border-[#D97706] mt-12 select-none font-sans">
      {/* 5-Column Link Directory (Full Width Container) */}
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 text-xs">
          
          {/* Col 1: About Department */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wide border-b border-white/20 pb-2 mb-3">
              About Department
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setCurrentRole('home')} className="hover:text-white hover:underline text-left">
                  Vision, Mission &amp; Mandate
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRole('whoswho')} className="hover:text-white hover:underline text-left">
                  Who's Who in Ministry
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRole('command_center')} className="hover:text-white hover:underline text-left">
                  National Command Center MIS
                </button>
              </li>
              <li>
                <button onClick={() => setOpenDataOpen(true)} className="hover:text-white hover:underline text-left font-bold text-amber-300">
                  Open Data Portal &amp; REST API
                </button>
              </li>
              <li>
                <button onClick={() => setSiteMapOpen(true)} className="hover:text-white hover:underline text-left flex items-center gap-1">
                  <Map className="w-3 h-3 text-amber-300" /> Portal Site Map (GIGW)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 2: Acts, Rules & Policies */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wide border-b border-white/20 pb-2 mb-3">
              Acts, Rules &amp; Orders
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setCurrentRole('acts')} className="hover:text-white hover:underline text-left">
                  RFCTLARR Act 2013 (Act 30)
                </button>
              </li>
              <li>
                <button onClick={() => setNotificationSearchOpen(true)} className="hover:text-white hover:underline text-left">
                  Gazette Extra-Ordinary Search
                </button>
              </li>
              <li>
                <button onClick={() => setCalcModalOpen(true)} className="hover:text-white hover:underline text-left font-semibold text-white">
                  Solatium &amp; Multiplier Guidelines
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRole('acts')} className="hover:text-white hover:underline text-left">
                  Social Impact Assessment (SIA)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRole('acts')} className="hover:text-white hover:underline text-left">
                  Model R&amp;R Policy 2026
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Citizen Services */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wide border-b border-white/20 pb-2 mb-3">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <button onClick={() => setCaseTrackerOpen(true)} className="hover:text-white hover:underline text-left font-bold text-amber-300">
                  Track Land Case Status
                </button>
              </li>
              <li>
                <button onClick={() => setCalcModalOpen(true)} className="hover:text-white hover:underline text-left font-bold text-amber-300">
                  Statutory Compensation Calculator
                </button>
              </li>
              <li>
                <button onClick={() => setGrievanceModalOpen(true)} className="hover:text-white hover:underline text-left font-semibold text-white">
                  Lodge Section 15 Objection (CPGRAMS)
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRole('citizen')} className="hover:text-white hover:underline text-left">
                  Citizen Corner &amp; Document Vault
                </button>
              </li>
              <li>
                <button onClick={() => setCurrentRole('rti')} className="hover:text-white hover:underline text-left">
                  Citizen Charter &amp; RTI Online
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Related Government Portals */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wide border-b border-white/20 pb-2 mb-3">
              National Portals
            </h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="https://pmgatishakti.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1.5">
                  PM GatiShakti NMP <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://pfms.nic.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1.5">
                  PFMS Treasury Gateway <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://bhuvan.nrsc.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1.5">
                  Bhuvan ISRO GIS Portal <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://dilrmp.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1.5">
                  Digital India Land Records <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
              <li>
                <a href="https://data.gov.in" target="_blank" rel="noreferrer" className="hover:text-white hover:underline flex items-center gap-1.5">
                  Open Government Data (data.gov.in) <ExternalLink className="w-3 h-3 text-slate-400" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Helpdesk */}
          <div>
            <h4 className="font-bold text-sm text-amber-400 uppercase tracking-wide border-b border-white/20 pb-2 mb-3">
              National Helpdesk
            </h4>
            <div className="space-y-2 text-slate-300 text-xs">
              <p className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>NBO Building, Nirman Bhawan, New Delhi - 110011</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Toll Free: <strong className="text-white font-mono">1800-11-LAND (5263)</strong></span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>helpdesk-landpulse@nic.in</span>
              </p>
              <div className="pt-1">
                <span className="text-[11px] text-emerald-400 font-bold block">
                  Support Hours: Mon–Sat, 9:00 AM – 6:00 PM IST
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Official Government Emblem & Content Ownership Strip */}
      <div className="bg-[#072742] text-slate-300 text-xs px-6 sm:px-12 2xl:px-20 py-4 border-t border-white/10">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Department Certification */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-10 shrink-0 hidden sm:block">
              <svg viewBox="0 0 100 120" className="w-full h-full fill-white/80">
                <circle cx="50" cy="20" r="14" />
                <rect x="42" y="34" width="16" height="30" />
                <rect x="25" y="40" width="12" height="24" />
                <rect x="63" y="40" width="12" height="24" />
                <polygon points="10,80 90,80 80,95 20,95" />
              </svg>
            </div>
            <div>
              <p className="text-slate-200">
                Website Content Owned, Maintained &amp; Updated by <strong>Department of Land Resources (DoLR), Ministry of Rural Development, Government of India</strong>.
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Designed, Developed and Hosted by <strong>National Informatics Centre (NIC)</strong>.
              </p>
            </div>
          </div>

          {/* Right: GIGW Metadata, Visitor Counter, Resolution Note */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 text-[11px] font-medium text-slate-300">
            <button onClick={() => setPrivacyPolicyOpen(true)} className="hover:underline hover:text-white">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => setPrivacyPolicyOpen(true)} className="hover:underline hover:text-white">
              Terms of Use
            </button>
            <span>•</span>
            <button onClick={() => setSiteMapOpen(true)} className="hover:underline hover:text-white">
              Site Map
            </button>
            <span>|</span>
            <span>Last Updated: <strong>28 Aug 2026</strong></span>
            <span>|</span>
            <div className="flex items-center gap-1.5 bg-black/30 px-2.5 py-1 rounded border border-white/20">
              <span className="text-slate-400">Visitors:</span>
              <span className="font-mono text-amber-300 font-bold">04,892,140</span>
            </div>
          </div>

        </div>

        {/* GIGW Resolution & Compliance Note */}
        <div className="w-full max-w-[1920px] mx-auto mt-3 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] text-slate-400">
          <span>Best viewed in 1024×768 resolution and above in modern web browsers.</span>
          <span className="font-mono">Certified GIGW 3.0 &amp; W3C WCAG 2.1 Level AA Compliant</span>
        </div>
      </div>
    </footer>
  );
};
