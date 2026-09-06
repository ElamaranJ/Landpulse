import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRole } from '../../../context/RoleContext';
import { useModals, ModalName } from '../../../context/ModalContext';
import { SafeImage } from '../../common/SafeImage';

export const GovColoredCardGrid: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentRole } = useRole();
  const { openModal } = useModals();

  const handleProtectedModalClick = (modalName: ModalName) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    openModal(modalName);
  };

  // Priority Corridors Carousel state
  const [corridorIndex, setCorridorIndex] = useState(0);
  const corridorItems = [
    {
      title: "Delhi–Mumbai Expressway (Vadodara–Mumbai Spur)",
      url: "/images/hero-expressway.jpg",
      fallback: "/images/hero-expressway.jpg",
      caption: "1,386 km 8-Lane Access Controlled Greenfield Corridor",
    },
    {
      title: "PM GatiShakti Multi-Modal Freight Logistic Terminal",
      url: "/images/hero-gatishakti.jpg",
      fallback: "/images/hero-gatishakti.jpg",
      caption: "Integrated Rail, Port & Air Freight Connectivity Network",
    },
    {
      title: "Western Dedicated Freight Corridor (Cadastral Cadre)",
      url: "/images/hero-cadastral-parcels.jpg",
      fallback: "/images/hero-cadastral-parcels.jpg",
      caption: "1,504 km Heavy Haul Multi-Modal Freight Backbone & Land Bank",
    },
  ];

  // Press Releases Carousel state
  const [pressIndex, setPressIndex] = useState(0);
  const pressItems = [
    {
      title: "NavIC DGPS High-Precision Cadastral Survey Deployment",
      url: "/images/hero-dgps-survey.jpg",
      fallback: "/images/hero-dgps-survey.jpg",
      caption: "Sub-meter RTK boundary verification with Gram Sabha & Landowners",
    },
    {
      title: "Greenfield Expressway Land Clearance & Award Ceremony",
      url: "/images/hero-expressway.jpg",
      fallback: "/images/hero-expressway.jpg",
      caption: "Fast-track RoW handover and Direct Benefit Transfer (DBT) disbursals",
    },
    {
      title: "Drone Cadastral Mapping & Record Settlement",
      url: "/images/hero-cadastral-parcels.jpg",
      fallback: "/images/hero-cadastral-parcels.jpg",
      caption: "High-resolution orthomosaic imagery for dispute-free parcel demarcations",
    },
  ];

  // Social feed subtab state
  const [socialTab, setSocialTab] = useState<'DoLR' | 'GatiShakti' | 'MoRD'>('DoLR');

  const socialChannels = {
    DoLR: {
      name: 'Dept of Land Resources',
      handle: '@DoLR_India',
      avatarBg: 'bg-[#0B3D66]',
      avatarText: 'DoL',
      url: 'https://twitter.com/DoLR_India',
      posts: [
        {
          id: 'dolr-1',
          time: '2h ago',
          text: 'Over ₹1.54 Lakh Cr direct PFMS payments disbursed under RFCTLARR Act 2013 across 1,248 national infrastructure projects with end-to-end digital awards.',
          tags: ['#RFCTLARR', '#PFMS', '#DigitalGovernance'],
          reposts: '142',
          likes: '896',
        },
        {
          id: 'dolr-2',
          time: '6h ago',
          text: 'High-precision NavIC DGPS CORS network now operational across 18 states for real-time cadastral boundary demarcation with sub-meter RTK accuracy.',
          tags: ['#NavIC', '#DILRMP', '#LandAdministration'],
          reposts: '98',
          likes: '614',
        },
      ],
    },
    GatiShakti: {
      name: 'PM GatiShakti NMP',
      handle: '@PMGatiShakti',
      avatarBg: 'bg-[#C2410C]',
      avatarText: 'PM',
      url: 'https://twitter.com/PMGatiShakti',
      posts: [
        {
          id: 'gs-1',
          time: '1h ago',
          text: 'PM GatiShakti National Master Plan synchronizes 1,450+ GIS data layers across 14 ministries to compress RoW sanction cycles from 18 months to 45 days.',
          tags: ['#PMGatiShakti', '#MultiModal', '#Logistics'],
          reposts: '215',
          likes: '1.2K',
        },
        {
          id: 'gs-2',
          time: '4h ago',
          text: 'Greenfield expressway & Western DFC intersection alignment optimized through least-cost pathfinding, saving 420 hectares of irrigated agricultural land.',
          tags: ['#GreenInfrastructure', '#LogisticsEfficiency'],
          reposts: '164',
          likes: '940',
        },
      ],
    },
    MoRD: {
      name: 'Ministry of Rural Dev',
      handle: '@MoRD_India',
      avatarBg: 'bg-[#15803D]',
      avatarText: 'MoR',
      url: 'https://twitter.com/MoRD_India',
      posts: [
        {
          id: 'mord-1',
          time: '3h ago',
          text: 'Special Lok Adalat & CALA conciliatory benches notified with State Revenue Authorities for fast-track settlement of Section 15 inquiries.',
          tags: ['#RuralDevelopment', '#FairCompensation'],
          reposts: '118',
          likes: '742',
        },
        {
          id: 'mord-2',
          time: '7h ago',
          text: 'Direct Benefit Transfer (DBT) ensures 100% statutory solatium and R&R allowances reach beneficiary bank accounts within 48 hours of award declaration.',
          tags: ['#DBT', '#FinancialInclusion', '#LandRights'],
          reposts: '189',
          likes: '1.1K',
        },
      ],
    },
  };

  const activeChannel = socialChannels[socialTab];

  return (
    <div className="w-full bg-[#F0F1F3] py-8 select-none">
      <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20">
        {/* 8-Card Grid: 4 columns on desktop, 2 on tablet, 1 on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-8">

          {/* ========================================================================= */}
          {/* CARD 1: Priority National Corridors — Carousel + Caption                  */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#558B2F] text-base sm:text-[17px] font-bold tracking-wide">Priority National Corridors</div>
            <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col justify-between" style={{ minHeight: '300px' }}>
              <div 
                className="relative flex-1 min-h-[250px] overflow-hidden cursor-pointer"
                onClick={() => setCurrentRole('command_center')}
                title="View in National Command Center"
              >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setCorridorIndex((p) => (p === 0 ? corridorItems.length - 1 : p - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors z-20 shadow-md"
                  title="Previous Corridor"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCorridorIndex((p) => (p === corridorItems.length - 1 ? 0 : p + 1));
                  }}
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
            <div className="tn-card-header bg-[#8C2D38] text-base sm:text-[17px] font-bold tracking-wide">Documents</div>
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
            <div className="tn-card-header bg-[#A89047] text-base sm:text-[17px] font-bold tracking-wide">Contact Directory</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  {
                    label: 'Council of Land Acquisition Officers (CALA)',
                    onClick: () => setCurrentRole('whoswho'),
                  },
                  {
                    label: 'State Revenue & Nodal Departments',
                    onClick: () => setCurrentRole('whoswho'),
                  },
                  {
                    label: 'Head of Department (DoLR HQ)',
                    onClick: () => setCurrentRole('whoswho'),
                  },
                  {
                    label: 'District Collectors & SLAO Offices',
                    onClick: () => setCurrentRole('district_officer'),
                    tag: 'SLAO Portal',
                  },
                  {
                    label: 'Citizen Grievance Officers',
                    onClick: () => openModal('grievance'),
                    tag: 'CPGRAMS Cell',
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    onClick={item.onClick}
                    className="py-3.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 group"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <span className="text-[#1D4ED8] font-bold text-lg leading-none shrink-0">➤</span>
                      <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug truncate">
                        {item.label}
                      </span>
                    </div>
                    {item.tag && (
                      <span className="text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-300 px-2 py-0.5 rounded shrink-0">
                        {item.tag}
                      </span>
                    )}
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
            <div className="tn-card-header bg-[#2B6CB0] text-base sm:text-[17px] font-bold tracking-wide">Press Releases</div>
            <div className="relative flex-1 bg-slate-100 overflow-hidden flex flex-col justify-between" style={{ minHeight: '300px' }}>
              <div 
                className="relative flex-1 min-h-[250px] overflow-hidden cursor-pointer"
                onClick={() => openModal('notifications')}
                title="View Official Press Notifications"
              >
                <SafeImage
                  src={pressItems[pressIndex].url}
                  fallbackSrc={pressItems[pressItems.length - 1].fallback}
                  alt={pressItems[pressIndex].title}
                  fallbackText="Press Release Media"
                  containerClassName="w-full h-full"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPressIndex((p) => (p === 0 ? pressItems.length - 1 : p - 1));
                  }}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded bg-black/60 hover:bg-black/85 text-white flex items-center justify-center transition-colors z-20 shadow-md"
                  title="Previous Press Release"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setPressIndex((p) => (p === pressItems.length - 1 ? 0 : p + 1));
                  }}
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
              <button onClick={() => openModal('notifications')} className="tn-more-btn">More</button>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* CARD 5: Forms — List (Consistent Form 15, 7, 9, 11 + Direct Linkages)      */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#0099E5] text-base sm:text-[17px] font-bold tracking-wide">Forms</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  {
                    label: 'Form 15: Statutory Section 15 Objection & Title Claim',
                    onClick: () => openModal('grievance'),
                    actionLabel: 'Lodge Online',
                  },
                  {
                    label: 'Form 7: Land Valuation & Solatium Determination Slip',
                    onClick: () => openModal('calc'),
                    actionLabel: 'Calculate',
                  },
                  {
                    label: 'Form 9: PFMS Bank Mandate & Aadhaar Direct DBT Form',
                    onClick: () => handleProtectedModalClick('digitalAward'),
                    actionLabel: 'Award Sheet',
                  },
                  {
                    label: 'Form 11: R&R Alternative Model Housing Allotment',
                    onClick: () => setCurrentRole('citizen'),
                    actionLabel: 'Dossier',
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    onClick={item.onClick}
                    className="py-3.5 flex items-center justify-between gap-2 cursor-pointer hover:bg-slate-50 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <span className="w-4 h-4 rounded-full border-2 border-emerald-600 flex items-center justify-center shrink-0 mt-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-600" />
                      </span>
                      <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug">
                        {item.label}
                      </span>
                    </div>
                    <span className="text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded shrink-0 whitespace-nowrap">
                      {item.actionLabel}
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
            <div className="tn-card-header bg-[#8E2486] text-base sm:text-[17px] font-bold tracking-wide">Schemes &amp; Packages</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  {
                    label: 'PM GatiShakti Multi-Modal Infrastructure Matrix',
                    onClick: () => setCurrentRole('project_admin'),
                  },
                  {
                    label: 'Tribal & Forest Land Rights Special Rehabilitation Package',
                    onClick: () => setCurrentRole('district_officer'),
                  },
                  {
                    label: 'Digital India Land Records Modernization (DILRMP)',
                    onClick: () => handleProtectedModalClick('dgpsViewer'),
                  },
                  {
                    label: 'RFCTLARR Solatium & Rural Multiplier 2.0 Scheme',
                    onClick: () => openModal('calc'),
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    onClick={item.onClick}
                    className="py-3.5 flex items-start gap-3.5 cursor-pointer hover:bg-slate-50 group"
                  >
                    <span className="text-[#EA580C] font-bold text-lg leading-none shrink-0 mt-0.5">►</span>
                    <span className="text-[#1E3A8A] font-bold group-hover:underline text-[15px] leading-snug">
                      {item.label}
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
          {/* CARD 7: What's New — Dated List                                           */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#009E4F] text-base sm:text-[17px] font-bold tracking-wide">What's New</div>
            <div className="p-6 flex-1 flex flex-col justify-between">
              <ul className="space-y-0 divide-y divide-slate-200">
                {[
                  {
                    date: '27 Aug 2026',
                    text: 'Policy Note of Land Administration & R&R Department - 2026-27',
                    onClick: () => setCurrentRole('acts'),
                  },
                  {
                    date: '27 Aug 2026',
                    text: 'Cabinet Circular on 100% Solatium & Rural Multiplier Norms',
                    onClick: () => openModal('calc'),
                  },
                  {
                    date: '26 Aug 2026',
                    text: 'Direct PFMS Compensation Disbursal for 12 Districts Complete',
                    onClick: () => handleProtectedModalClick('digitalAward'),
                  },
                  {
                    date: '24 Aug 2026',
                    text: 'NavIC DGPS Base Stations Deployed in 14 Priority States',
                    onClick: () => handleProtectedModalClick('dgpsViewer'),
                  },
                ].map((item, i) => (
                  <li
                    key={i}
                    onClick={item.onClick}
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
          {/* CARD 8: X.com Social Feed — Tabbed (All 3 Agencies Fully Populated)       */}
          {/* ========================================================================= */}
          <div className="tn-card">
            <div className="tn-card-header bg-[#1E293B] text-base sm:text-[17px] font-bold tracking-wide flex items-center justify-between">
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
                    className={`flex-1 py-2 rounded text-center transition-colors font-bold ${
                      socialTab === tab ? 'bg-[#3B1C54] text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {tab === 'GatiShakti' ? 'GatiShakti' : tab}
                  </button>
                ))}
              </div>

              {/* Tab Feed Content */}
              <div className="p-4 flex-1 flex flex-col justify-between gap-3">
                {/* Agency Profile Header */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-10 h-10 rounded-full ${activeChannel.avatarBg} text-white font-bold flex items-center justify-center text-xs shrink-0 shadow-xs`}>
                      {activeChannel.avatarText}
                    </div>
                    <div>
                      <div className="flex items-center gap-1 font-bold text-slate-900 text-sm">
                        <span>{activeChannel.name}</span>
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white text-[8px] flex items-center justify-center font-bold">✓</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {activeChannel.handle}
                      </span>
                    </div>
                  </div>
                  <a
                    href={activeChannel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-1 rounded transition-colors"
                  >
                    Follow
                  </a>
                </div>

                {/* Posts Feed for Active Channel */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[220px]">
                  {activeChannel.posts.map((post) => (
                    <div key={post.id} className="text-xs text-slate-700 bg-slate-50 border border-slate-200 rounded p-2.5 hover:bg-white transition-colors">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium mb-1">
                        <span className="font-semibold text-slate-600">Official Bulletin</span>
                        <span className="font-mono">{post.time}</span>
                      </div>
                      <p className="text-slate-800 leading-snug font-normal mb-1.5">
                        {post.text}
                      </p>
                      <div className="flex items-center justify-between text-[10px]">
                        <div className="flex gap-1.5 flex-wrap">
                          {post.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-blue-600 font-medium">{tag}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 font-mono">
                          <span>🔁 {post.reposts}</span>
                          <span>❤️ {post.likes}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Dynamic Footer Link for Active Channel */}
                <div className="text-right pt-2 border-t border-slate-200">
                  <a
                    href={activeChannel.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-[#1D4ED8] font-bold hover:underline"
                  >
                    View {activeChannel.handle} on 𝕏 →
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
