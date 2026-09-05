import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRole } from '../../../context/RoleContext';
import { SafeImage } from '../../common/SafeImage';

export const GovColoredCardGrid: React.FC = () => {
  const { setCurrentRole } = useRole();

  // Priority Corridors Carousel state
  const [corridorIndex, setCorridorIndex] = useState(0);
  const corridorItems = [
    {
      title: "Delhi–Mumbai Expressway (Vadodara–Mumbai Spur)",
      url: "https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&auto=format&fit=crop&q=80",
      fallback: "https://picsum.photos/seed/expressway-corridor/800/600",
      caption: "1,386 km 8-Lane Access Controlled Greenfield Corridor",
    },
    {
      title: "Mumbai–Ahmedabad High Speed Rail (Bullet Train)",
      url: "https://images.unsplash.com/photo-1541888946425-d0fbb186c5f7?w=800&auto=format&fit=crop&q=80",
      fallback: "https://picsum.photos/seed/bullet-train-corridor/800/600",
      caption: "508 km High Speed Corridor — 98.7% Land Acquired",
    },
    {
      title: "Western Dedicated Freight Corridor (Dadri–JNPT)",
      url: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop&q=80",
      fallback: "https://picsum.photos/seed/freight-corridor-grid/800/600",
      caption: "1,504 km Heavy Haul Multi-Modal Freight Backbone",
    },
  ];

  // Press Releases Carousel state
  const [pressIndex, setPressIndex] = useState(0);
  const pressItems = [
    {
      title: "Direct Benefit Transfer (DBT) Ceremony in Palghar",
      url: "https://images.unsplash.com/photo-1589923188900-85dae523342b?w=800&auto=format&fit=crop&q=80",
      fallback: "https://picsum.photos/seed/press-dbt-event/800/600",
      caption: "Over ₹91.2 Cr disbursed directly to 1,240 beneficiary accounts",
    },
    {
      title: "Model R&R Township Housing Allotment Inspection",
      url: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80",
      fallback: "https://picsum.photos/seed/resettlement-handover/800/600",
      caption: "Allotment of 250 developed housing units with solar grid",
    },
    {
      title: "NavIC DGPS High-Precision Boundary Cadastral Walk",
      url: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
      fallback: "https://picsum.photos/seed/field-verification-survey/800/600",
      caption: "Sub-meter RTK boundary verification with Gram Sabha elders",
    },
  ];

  // Social feed subtab state
  const [socialTab, setSocialTab] = useState<'DoLR' | 'GatiShakti' | 'MoRD'>('DoLR');

  const socialPosts: Record<string, string> = {
    DoLR: 'Over ₹1.54 Lakh Cr direct PFMS payments disbursed under RFCTLARR Act 2013 across 1,248 national infrastructure projects with full transparency.',
    GatiShakti: 'Integrated GIS cadastral alignment synchronized across 14 central ministries for rapid RoW land clearance under PM GatiShakti National Master Plan.',
    MoRD: 'Fast-track Lok Adalat dispute settlement benches notified in coordination with State Revenue Authorities for pending Section 15 inquiries.',
  };

  return (
    <div className="w-full bg-[#F0F1F3] py-8 select-none">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20">
        {/* 8-Card Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">

          {/* ========================================================================= */}
          {/* CARD 1: Priority National Corridors — Carousel + Caption                  */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#558B2F]">Priority National Corridors</div>
            <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col justify-between" style={{ minHeight: '300px' }}>
              <div className="relative flex-1 min-h-[250px] overflow-hidden">
                <SafeImage
                  src={corridorItems[corridorIndex].url}
                  fallbackSrc={corridorItems[corridorIndex].fallback}
                  alt={corridorItems[corridorIndex].title}
                  fallbackText="Corridor Survey Record"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
                {/* Overlay Nav buttons */}
                <button
                  onClick={() => setCorridorIndex((p) => (p === 0 ? corridorItems.length - 1 : p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors z-20 shadow-md"
                  title="Previous Corridor"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCorridorIndex((p) => (p === corridorItems.length - 1 ? 0 : p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors z-20 shadow-md"
                  title="Next Corridor"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                {/* Bottom Caption Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3.5 z-10">
                  <p className="text-sm font-bold text-white truncate">{corridorItems[corridorIndex].title}</p>
                  <p className="text-xs text-slate-200 truncate mt-0.5">{corridorItems[corridorIndex].caption}</p>
                </div>
              </div>
            </div>
            <div className="p-3.5 text-center bg-white border-t border-slate-200">
              <button onClick={() => setCurrentRole('command_center')} className="tn-more-btn">More</button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 2: Documents — List                                                  */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#8C2D38]">Documents</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  { label: 'Government Orders (G.O.)', bullet: 'bullet-3d-blue' },
                  { label: 'Policy Notes & Guidelines', bullet: 'bullet-3d-green' },
                  { label: 'Gazette Extra-Ordinary Notifications', bullet: 'bullet-3d-purple' },
                  { label: 'Rules & Regulations (RFCTLARR)', bullet: 'bullet-3d-red' },
                  { label: 'Statutory Central Acts', bullet: 'bullet-3d-orange' },
                ].map((item, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentRole('acts')}
                    className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-slate-50 group"
                  >
                    <span className={item.bullet} />
                    <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-5 text-center">
                <button onClick={() => setCurrentRole('acts')} className="tn-more-btn">More</button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 3: Contact Directory — List                                          */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#A89047]">Contact Directory</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  'Council of Land Acquisition Officers (CALA)',
                  'State Revenue & Nodal Departments',
                  'Head of Department (DoLR HQ)',
                  'District Collectors & SLAO Offices',
                  'Citizen Grievance Officers',
                ].map((label, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentRole('whoswho')}
                    className="py-3.5 flex items-center gap-3.5 cursor-pointer hover:bg-slate-50 group"
                  >
                    <span className="text-[#1D4ED8] font-bold text-lg leading-none">➤</span>
                    <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-5 text-center">
                <button onClick={() => setCurrentRole('whoswho')} className="tn-more-btn">More</button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 4: Press Releases — Carousel                                         */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#2B6CB0]">Press Releases</div>
            <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col justify-between" style={{ minHeight: '300px' }}>
              <div className="relative flex-1 min-h-[250px] overflow-hidden">
                <SafeImage
                  src={pressItems[pressIndex].url}
                  fallbackSrc={pressItems[pressItems.length - 1].fallback}
                  alt={pressItems[pressIndex].title}
                  fallbackText="Press Release Media"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setPressIndex((p) => (p === 0 ? pressItems.length - 1 : p - 1))}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors z-20 shadow-md"
                  title="Previous Press Release"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setPressIndex((p) => (p === pressItems.length - 1 ? 0 : p + 1))}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors z-20 shadow-md"
                  title="Next Press Release"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent p-3.5 z-10">
                  <p className="text-sm font-bold text-white truncate">{pressItems[pressIndex].title}</p>
                  <p className="text-xs text-slate-200 truncate mt-0.5">{pressItems[pressIndex].caption}</p>
                </div>
              </div>
            </div>
            <div className="p-3.5 text-center bg-white border-t border-slate-200">
              <button onClick={() => setCurrentRole('home')} className="tn-more-btn">More</button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 5: Forms — List                                                      */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#0099E5]">Forms</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  'Form 15: Statutory Section 15 Objection & Title Claim',
                  'Form 7: Land Valuation & Solatium Determination Slip',
                  'PFMS Bank Mandate & Aadhaar Direct DBT Form',
                  'Form 11: R&R Alternative Model Housing Allotment',
                ].map((label, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentRole('citizen')}
                    className="py-3.5 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50 group"
                  >
                    <span className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    </span>
                    <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-5 text-center">
                <button onClick={() => setCurrentRole('citizen')} className="tn-more-btn">More</button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 6: Schemes & Packages — List                                         */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#8E2486]">Schemes &amp; Packages</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  'PM GatiShakti Multi-Modal Infrastructure Matrix',
                  'Tribal & Forest Land Rights Special Rehabilitation Package',
                  'Digital India Land Records Modernization (DILRMP)',
                  'RFCTLARR Solatium & Rural Multiplier 2.0 Scheme',
                ].map((label, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentRole('district_officer')}
                    className="py-3.5 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50 group"
                  >
                    <span className="text-[#EA580C] font-bold text-lg leading-none shrink-0 mt-0.5">►</span>
                    <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug">
                      {label}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-5 text-center">
                <button onClick={() => setCurrentRole('district_officer')} className="tn-more-btn">More</button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 7: What's New — Dated List                                           */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#009E4F]">What's New</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  { date: '27 Aug 2026', text: 'Policy Note of Land Administration & R&R Department - 2026-27' },
                  { date: '27 Aug 2026', text: 'Cabinet Circular on 100% Solatium & Rural Multiplier Norms' },
                  { date: '26 Aug 2026', text: 'Direct PFMS Compensation Disbursal for 12 Districts Complete' },
                  { date: '24 Aug 2026', text: 'NavIC DGPS Base Stations Deployed in 14 Priority States' },
                ].map((item, i) => (
                  <li
                    key={i}
                    onClick={() => setCurrentRole('command_center')}
                    className="py-3.5 cursor-pointer hover:bg-slate-50 group"
                  >
                    <span className="text-xs text-slate-500 font-mono block font-bold">{item.date}</span>
                    <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug block mt-0.5">
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="pt-5 text-center">
                <button onClick={() => setCurrentRole('command_center')} className="tn-more-btn">More</button>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 8: X.com Social Feed — Tabbed                                        */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#1E293B] flex items-center justify-between">
              <span>𝕏.com</span>
              <span className="text-xs font-semibold text-slate-300">Live Official Feed</span>
            </div>
            <div className="flex-1 flex flex-col">
              {/* Sub-tabs */}
              <div className="flex bg-slate-100 border-b border-slate-300 text-[15px] font-bold p-2 gap-1.5">
                {(['DoLR', 'GatiShakti', 'MoRD'] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSocialTab(tab)}
                    className={`flex-1 py-2 rounded text-center transition-colors ${
                      socialTab === tab ? 'bg-[#3B1C54] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'GatiShakti' ? 'GatiShakti' : tab}
                  </button>
                ))}
              </div>

              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-[#0B3D66] text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                    {socialTab === 'DoLR' ? 'DoL' : socialTab === 'GatiShakti' ? 'PM' : 'MoR'}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 font-bold text-slate-900 text-[15px]">
                      <span>{socialTab === 'DoLR' ? 'Dept of Land Resources' : socialTab === 'GatiShakti' ? 'PM GatiShakti' : 'MoRD India'}</span>
                      <span className="w-4 h-4 rounded-full bg-blue-500 text-white text-[9px] flex items-center justify-center font-bold">✓</span>
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      @{socialTab === 'DoLR' ? 'DoLR_India' : socialTab === 'GatiShakti' ? 'PMGatiShakti' : 'MoRD_India'} • Follow
                    </span>
                  </div>
                </div>

                <p className="text-[15px] text-slate-700 leading-relaxed flex-1">
                  {socialPosts[socialTab]}
                </p>

                <div className="text-right pt-2">
                  <a
                    href="https://twitter.com/DoLR_India"
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-[#1D4ED8] font-bold hover:underline"
                  >
                    View on 𝕏 →
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
