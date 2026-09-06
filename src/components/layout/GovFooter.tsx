import React from 'react';
import { useRole } from '../../context/RoleContext';
import { useModals } from '../../context/ModalContext';
import {
  Landmark,
  FileText,
  Users,
  Share2,
  Headphones,
  ChevronRight,
  ExternalLink,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  ChevronUp,
} from 'lucide-react';

export const GovFooter: React.FC = () => {
  const { setCurrentRole } = useRole();
  const { openModal } = useModals();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full select-none font-sans mt-auto">
      {/* ─────────────────────────────────────────────────────────────
          1. UPPER SECTION: Pale Sage Rural Background + Commitment & 5 White Cards
      ───────────────────────────────────────────────────────────── */}
      <div className="relative w-full bg-[#EFF3EE] border-t border-[#DDE5DC] overflow-hidden pt-10 pb-8 sm:pt-12 sm:pb-10">
        {/* Background Rural Hills Landscape Banner along bottom */}
        <div 
          className="absolute inset-x-0 bottom-0 h-24 sm:h-28 md:h-32 pointer-events-none opacity-90 mix-blend-multiply bg-repeat-x bg-bottom"
          style={{
            backgroundImage: "url('/images/footer-hills-strip.png')",
            backgroundSize: '1024px auto',
          }}
        />

        {/* Left House & Trees Artwork Silhouette */}
        <img
          src="/images/footer-scenery-left.png"
          alt=""
          aria-hidden="true"
          className="absolute left-0 bottom-0 h-24 sm:h-28 md:h-32 object-contain object-bottom pointer-events-none opacity-85 z-0"
        />

        {/* Right Corner Leafy Foliage Artwork */}
        <img
          src="/images/footer-foliage-right.png"
          alt=""
          aria-hidden="true"
          className="absolute right-0 top-0 h-32 sm:h-44 md:h-52 object-contain object-top pointer-events-none opacity-75 z-0"
        />

        {/* Content Container */}
        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-8 lg:px-12 2xl:px-16 flex flex-col xl:flex-row items-start gap-8 xl:gap-8">
          
          {/* ── Left Block: OUR COMMITMENT / Land for Secure Futures ── */}
          <div className="w-full xl:w-64 2xl:w-72 shrink-0 pt-1">
            <span className="text-[11px] uppercase tracking-[0.18em] text-[#607567] font-bold block mb-1.5">
              OUR COMMITMENT
            </span>
            <h2 className="font-serif text-[32px] sm:text-[36px] font-bold text-[#143021] leading-[1.12] tracking-tight">
              Land for<br />Secure Futures
            </h2>
            <div className="w-9 h-[2px] bg-[#C19853] my-3.5" />
            <p className="text-[13px] text-[#4F6456] font-medium tracking-wide">
              People · Land · Development
            </p>
          </div>

          {/* ── Right Block: 5 Floating White Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 flex-1 w-full">
            
            {/* Card 1: About Department */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2EAE3] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#D6EFE5] text-[#136F4E] flex items-center justify-center mb-3">
                  <Landmark className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-bold text-[14px] text-[#162F22] mb-3.5">
                  About Department
                </h3>
                <ul className="space-y-2.5 text-[12.5px] text-[#2C3E33]">
                  <li>
                    <button
                      onClick={() => openModal('about')}
                      className="w-full flex items-center justify-between text-left hover:text-[#136F4E] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Vision, Mission &amp; Mandate</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#136F4E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentRole('whoswho')}
                      className="w-full flex items-center justify-between text-left hover:text-[#136F4E] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Who's Who in Ministry</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#136F4E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentRole('command_center')}
                      className="w-full flex items-center justify-between text-left hover:text-[#136F4E] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>National Command Center MIS</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#136F4E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openModal('openData')}
                      className="w-full flex items-center justify-between text-left hover:text-[#136F4E] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Open Data Portal &amp; REST API</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#136F4E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openModal('siteMap')}
                      className="w-full flex items-center justify-between text-left hover:text-[#136F4E] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Portal Site Map (GIGW)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#136F4E] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 2: Acts, Rules & Orders */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2EAE3] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FCEBD8] text-[#B86F24] flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-bold text-[14px] text-[#162F22] mb-3.5">
                  Acts, Rules &amp; Orders
                </h3>
                <ul className="space-y-2.5 text-[12.5px] text-[#2C3E33]">
                  <li>
                    <button
                      onClick={() => setCurrentRole('acts')}
                      className="w-full flex items-center justify-between text-left hover:text-[#B86F24] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>RFCTLARR Act 2013 (Act 30)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B86F24] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openModal('notificationSearch')}
                      className="w-full flex items-center justify-between text-left hover:text-[#B86F24] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Gazette Extra-Ordinary Search</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B86F24] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openModal('calc')}
                      className="w-full flex items-center justify-between text-left hover:text-[#B86F24] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Solatium &amp; Multiplier Guidelines</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B86F24] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentRole('acts')}
                      className="w-full flex items-center justify-between text-left hover:text-[#B86F24] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Social Impact Assessment (SIA)</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentRole('acts')}
                      className="w-full flex items-center justify-between text-left hover:text-[#B86F24] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Model R&amp;R Policy 2026</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#B86F24] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 3: Citizen Services */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2EAE3] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#DBEAFE] text-[#1D4ED8] flex items-center justify-center mb-3">
                  <Users className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-bold text-[14px] text-[#162F22] mb-3.5">
                  Citizen Services
                </h3>
                <ul className="space-y-2.5 text-[12.5px] text-[#2C3E33]">
                  <li>
                    <button
                      onClick={() => openModal('caseTracker')}
                      className="w-full flex items-center justify-between text-left hover:text-[#1D4ED8] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Track Land Case Status</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openModal('calc')}
                      className="w-full flex items-center justify-between text-left hover:text-[#1D4ED8] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Statutory Compensation Calculator</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => openModal('grievance')}
                      className="w-full flex items-center justify-between text-left hover:text-[#1D4ED8] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Lodge Section 15 Objection (CPGRAMS)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentRole('citizen')}
                      className="w-full flex items-center justify-between text-left hover:text-[#1D4ED8] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Citizen Corner &amp; Document Vault</span>
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setCurrentRole('rti')}
                      className="w-full flex items-center justify-between text-left hover:text-[#1D4ED8] hover:font-medium transition-colors group cursor-pointer"
                    >
                      <span>Citizen Charter &amp; RTI Online</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1D4ED8] group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                    </button>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 4: National Portals */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2EAE3] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#ECE5FA] text-[#6D28D9] flex items-center justify-center mb-3">
                  <Share2 className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-bold text-[14px] text-[#162F22] mb-3.5">
                  National Portals
                </h3>
                <ul className="space-y-2.5 text-[12.5px] text-[#2C3E33]">
                  <li>
                    <a
                      href="https://pmgatishakti.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between text-left hover:text-[#6D28D9] hover:font-medium transition-colors group"
                    >
                      <span className="flex items-center gap-1">
                        PM GatiShakti NMP
                        <ExternalLink className="w-2.5 h-2.5 text-slate-400 inline" />
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6D28D9] shrink-0 ml-1" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://pfms.nic.in"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between text-left hover:text-[#6D28D9] hover:font-medium transition-colors group"
                    >
                      <span>PFMS Treasury Gateway</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6D28D9] shrink-0 ml-1" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://bhuvan.nrsc.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between text-left hover:text-[#6D28D9] hover:font-medium transition-colors group"
                    >
                      <span>Bhuvan ISRO GIS Portal</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6D28D9] shrink-0 ml-1" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://dilrmp.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between text-left hover:text-[#6D28D9] hover:font-medium transition-colors group"
                    >
                      <span>Digital India Land Records</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6D28D9] shrink-0 ml-1" />
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://data.gov.in"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-between text-left hover:text-[#6D28D9] hover:font-medium transition-colors group"
                    >
                      <span>Open Government Data (data.gov.in)</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#6D28D9] shrink-0 ml-1" />
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Card 5: National Helpdesk */}
            <div className="bg-white rounded-2xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-[#E2EAE3] flex flex-col justify-between hover:shadow-md transition-shadow">
              <div>
                <div className="w-10 h-10 rounded-full bg-[#FDE2E2] text-[#DC2626] flex items-center justify-center mb-3">
                  <Headphones className="w-5 h-5 stroke-[2]" />
                </div>
                <h3 className="font-bold text-[14px] text-[#162F22] mb-3.5">
                  National Helpdesk
                </h3>
                <div className="space-y-3 text-[12px] text-[#2C3E33]">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">
                      NBO Building,<br />Nirman Bhawan, New Delhi - 110011
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-600 shrink-0" />
                    <span>
                      Toll Free: <strong className="text-slate-900 font-bold">1800-11-LAND (5263)</strong>
                    </span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-slate-600 shrink-0" />
                    <a
                      href="mailto:helpdesk-landpulse@nic.in"
                      className="hover:underline hover:text-[#136F4E] truncate"
                    >
                      helpdesk-landpulse@nic.in
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-600 shrink-0" />
                    <span className="leading-snug">
                      Mon – Sat, 9:00 AM – 6:00 PM IST
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. LOWER SECTION: Deep Dark Forest Green Bar
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#163326] text-slate-300 py-3 px-4 sm:px-8 lg:px-12 2xl:px-16 border-t border-[#204533]">
        <div className="w-full max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Left: Ashok Stambh Emblem & Ministry Hierarchy */}
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-11 shrink-0 flex items-center justify-center">
              <img
                src="/images/ashok-stambh-white.png"
                alt="Emblem of India"
                className="h-full w-auto object-contain brightness-110 drop-shadow-sm"
              />
            </div>
            <div className="h-8 w-[1px] bg-white/20 hidden sm:block" />
            <div className="text-left">
              <h4 className="text-white font-bold text-[13px] leading-snug tracking-tight">
                Ministry of Rural Development
              </h4>
              <p className="text-slate-300 text-[11px] leading-snug">
                Department of Land Resources
              </p>
              <p className="text-slate-400 text-[10px] leading-snug">
                Government of India
              </p>
            </div>
          </div>

          {/* Center: Legal Links & NIC Ownership Statement */}
          <div className="text-center md:text-left flex flex-col items-center md:items-start">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 sm:gap-2.5 text-[11px] text-slate-300">
              <button
                onClick={() => openModal('privacyPolicy')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Privacy Policy
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => openModal('privacyPolicy')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Terms of Use
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => openModal('privacyPolicy')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Accessibility Statement
              </button>
              <span className="text-white/30">|</span>
              <button
                onClick={() => openModal('siteMap')}
                className="hover:text-white hover:underline cursor-pointer"
              >
                Site Map
              </button>
            </div>
            <p className="text-[10.5px] text-slate-400 mt-1 leading-tight">
              Website Content Owned, Maintained &amp; Updated by Department of Land Resources (DoLR)
            </p>
            <p className="text-[10.5px] text-slate-400 leading-tight">
              Designed, Developed and Hosted by National Informatics Centre (NIC)
            </p>
          </div>

          {/* Right: Social Media, Last Updated & Scroll-to-Top Button */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Social Icons with Circular Borders */}
            <div className="flex items-center gap-2">
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 hover:border-white text-white flex items-center justify-center transition-colors hover:bg-white/10"
                aria-label="X (formerly Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 hover:border-white text-white flex items-center justify-center transition-colors hover:bg-white/10"
                aria-label="Facebook"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>

              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 hover:border-white text-white flex items-center justify-center transition-colors hover:bg-white/10"
                aria-label="YouTube"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>

              {/* LinkedIn */}
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-7 h-7 rounded-full border border-white/40 hover:border-white text-white flex items-center justify-center transition-colors hover:bg-white/10"
                aria-label="LinkedIn"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45c-.89 0-1.61.72-1.61 1.61a1.61 1.61 0 0 0 3.22 0c0-.89-.72-1.61-1.61-1.61z" />
                </svg>
              </a>
            </div>

            {/* Divider */}
            <div className="h-8 w-[1px] bg-white/20 hidden sm:block mx-1" />

            {/* Last Updated */}
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-slate-300 stroke-[1.5]" />
              <div className="text-left">
                <span className="text-[9.5px] text-slate-400 block uppercase tracking-wider leading-none">
                  Last Updated
                </span>
                <span className="text-[12px] font-bold text-white block leading-tight mt-0.5">
                  28 Aug 2026
                </span>
              </div>
            </div>

            {/* Scroll-to-Top Amber Button */}
            <button
              onClick={scrollToTop}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#B28B49] hover:bg-[#C29853] text-white flex items-center justify-center shadow-md transition-all hover:scale-105 active:scale-95 ml-1 cursor-pointer"
              aria-label="Scroll to top"
              title="Scroll to top"
            >
              <ChevronUp className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

        </div>
      </div>
    </footer>
  );
};
