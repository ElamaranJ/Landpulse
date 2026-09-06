import React, { useState, useEffect } from 'react';
import { useModals } from '../../../context/ModalContext';
import { ObjectionModal } from './ObjectionModal';
import {
  Users,
  MapPin,
  ExternalLink,
  Layers,
  Clock,
  Info,
  FileText,
  FileCheck2,
  Download,
  AlertTriangle,
  CreditCard,
  Landmark,
  CheckCircle2
} from 'lucide-react';
import { MOCK_CITIZEN_CASE } from '../../../data/mockData';
import { subscribeCitizenCase } from '../../../services/firestoreService';
import type { CitizenCase } from '../../../types';

export const CitizenDashboard: React.FC = () => {
  const { openModal } = useModals();
  const [isObjectionModalOpen, setIsObjectionModalOpen] = useState(false);
  const [c, setC] = useState<CitizenCase>(MOCK_CITIZEN_CASE);

  useEffect(() => {
    const unsubscribe = subscribeCitizenCase('MH-PAL-2024-8821', (data) => {
      setC(data);
    });
    return () => unsubscribe();
  }, []);

  const stages = [
    {
      step: 1,
      title: 'Identified & Preliminary Survey',
      date: '12 Jan 2024',
      status: 'completed',
      icon: FileText,
    },
    {
      step: 2,
      title: 'Section 4(1) Notification',
      date: '28 Feb 2024',
      status: 'completed',
      icon: FileText,
    },
    {
      step: 3,
      title: 'Field Survey & Joint Inspection',
      date: '15 Apr 2024',
      status: 'completed',
      icon: Layers,
    },
    {
      step: 4,
      title: 'Objection & Hearing (Sec 15)',
      date: '20 Jun 2024',
      status: 'completed',
      icon: Users,
    },
    {
      step: 5,
      title: 'Section 19 Declaration',
      date: '02 Aug 2024',
      status: 'completed',
      icon: FileCheck2,
    },
    {
      step: 6,
      title: 'Compensation Determination (Sec 23)',
      date: '24 Sep 2024',
      status: 'completed',
      icon: CreditCard,
    },
    {
      step: 7,
      title: 'Direct Benefit Transfer (DBT)',
      date: 'Pending 2nd Tranche',
      status: 'current',
      icon: Landmark,
    },
    {
      step: 8,
      title: 'Possession & Mutation in RoR',
      date: 'Pending',
      status: 'pending',
      icon: FileText,
    },
    {
      step: 9,
      title: 'Case Closure',
      date: 'Pending',
      status: 'pending',
      icon: CheckCircle2,
    },
  ];

  return (
    <div className="w-full max-w-[1920px] mx-auto space-y-6 pb-8 animate-fadeIn">
      {/* Outer Cadastre Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-6 sm:p-8 overflow-hidden relative">
        
        {/* Top Header Row with Rural Landscape & Cursive Slogan */}
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between pb-6 border-b border-slate-100 gap-4 overflow-hidden">
          {/* Subtle background landscape */}
          <div 
            className="absolute right-0 top-0 bottom-0 w-full md:w-2/3 pointer-events-none opacity-30 sm:opacity-40 bg-no-repeat bg-right bg-contain"
            style={{ backgroundImage: `url('/images/header-rural-faded.png')` }}
          />

          {/* Left: Titles */}
          <div className="relative z-10">
            <h1 className="text-3xl sm:text-[34px] font-bold text-[#1a2e3b] font-serif tracking-tight leading-tight">
              Citizen Cadastre Dossier
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-600 mt-1">
              Stage 7 of 9 : Compensation Disbursal &nbsp;|&nbsp; RFCTLARR Act, 2013
            </p>
            <p className="text-xs text-slate-500 font-mono mt-1.5">
              Case UID : <span className="font-bold text-slate-800">LP-CASE-2024-MH-4921</span> &nbsp;|&nbsp; Registered : <span className="font-bold text-slate-800">2024</span> &nbsp;|&nbsp; Last Updated : <span className="font-bold text-slate-800">27 Aug 2026</span>
            </p>
          </div>

          {/* Right: Slogan in script font */}
          <div className="relative z-10 pr-2 select-none self-end md:self-auto text-right">
            <div className="font-slogan-script text-2xl sm:text-3xl text-[#5C4A3A]/85 font-normal italic transform -rotate-2 leading-snug">
              Land for a <br />
              <span className="text-xl sm:text-2xl ml-3">Better Tomorrow</span>
            </div>
          </div>
        </div>

        {/* Sticky Section Anchor Navigation */}
        <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-y border-slate-200 py-2.5 my-4 -mx-6 sm:-mx-8 px-6 sm:px-8 flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">Jump to:</span>
          <a
            href="#property-details"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Landowner &amp; Property Details
          </a>
          <a
            href="#location-map"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Location Map &amp; Hierarchy
          </a>
          <a
            href="#compensation-summary"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Compensation Summary
          </a>
          <a
            href="#key-updates"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Key Updates (Timeline)
          </a>
          <a
            href="#document-vault"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Digital Document Vault
          </a>
          <a
            href="#disbursal-tranches"
            className="px-3 py-1 bg-slate-100 hover:bg-[#EEF3F8] hover:text-[#1E436C] text-slate-700 rounded-lg font-semibold whitespace-nowrap transition-colors"
          >
            Disbursal Tranches (DBT)
          </a>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-4">
          
          {/* Column 1: Landowner & Property Details (5 cols) */}
          <div id="property-details" className="lg:col-span-5 flex flex-col scroll-mt-16">
            <div className="bg-[#EEF3F8] rounded-t-xl px-4 py-3 flex items-center gap-2.5 border border-slate-200 border-b-0">
              <div className="w-6 h-6 rounded-md bg-emerald-100 flex items-center justify-center text-emerald-800 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-sm text-[#1E293B]">Landowner &amp; Property Details</h3>
            </div>

            <div className="bg-white border border-slate-200 rounded-b-xl overflow-hidden divide-y divide-slate-100 text-xs shadow-2xs flex-1">
              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Name of Landowner</span>
                <strong className="col-span-7 text-slate-900 font-bold">{c.landownerName}</strong>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Survey &amp; Khata UID</span>
                <span className="col-span-7 text-slate-800 font-semibold font-mono">
                  #{c.surveyNumber} &nbsp;&bull;&nbsp; Khata: {c.khataNumber}
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Location</span>
                <span className="col-span-7 text-slate-800">{c.village}, Taluk - Palghar</span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">District</span>
                <span className="col-span-7 text-slate-800">{c.district}</span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">State</span>
                <span className="col-span-7 text-slate-800">Maharashtra</span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Land Area / Category</span>
                <span className="col-span-7 text-slate-800 font-medium">
                  {c.landAreaAcre} Acres &nbsp;&bull;&nbsp; Agricultural (Perennial)
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Target National Infrastructure Project</span>
                <span className="col-span-7 text-slate-800 leading-snug font-medium">
                  {c.projectName} ({c.projectCode})
                </span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Competent Authority</span>
                <span className="col-span-7 text-slate-800">SLAO Palghar Circle</span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">JMV Status</span>
                <span className="col-span-7 text-slate-800 font-medium">Joint Measurement Survey (JMV) Sealed</span>
              </div>

              <div className="grid grid-cols-12 gap-2 px-4 py-2.5">
                <span className="col-span-5 text-slate-500 font-medium">Last Inspection Audit</span>
                <span className="col-span-7 text-slate-800 font-mono">27 Aug 2026</span>
              </div>
            </div>
          </div>

          {/* Column 2: Location Map & Location Hierarchy (4 cols) */}
          <div id="location-map" className="lg:col-span-4 flex flex-col space-y-4 scroll-mt-16">
            
            {/* Top Box: Location Map */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-sm text-[#1E293B]">
                  <MapPin className="w-4 h-4 text-[#1E4D79]" />
                  <span>Location Map</span>
                </div>
                <button
                  type="button"
                  onClick={() => openModal('dgpsViewer')}
                  className="text-[11px] font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-300 rounded px-2.5 py-0.5 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>View in Map</span>
                  <ExternalLink className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              {/* Map Visual with polygon overlay */}
              <div className="relative h-[200px] bg-slate-900 overflow-hidden select-none">
                <img
                  src="/images/hero-cadastral-parcels.jpg"
                  alt="Cadastral Map"
                  className="w-full h-full object-cover opacity-90"
                />

                {/* Polygon Overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 300 200">
                  <polygon
                    points="50,40 250,30 270,160 40,150"
                    fill="none"
                    stroke="#94A3B8"
                    strokeWidth="1.5"
                    strokeDasharray="4 3"
                    opacity="0.6"
                  />
                  <polygon
                    points="140,55 195,65 185,135 130,120 115,80"
                    fill="rgba(220, 38, 38, 0.2)"
                    stroke="#DC2626"
                    strokeWidth="2.5"
                  />
                </svg>

                {/* Compass Rose */}
                <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold flex flex-col items-center justify-center border border-white/20">
                  <span className="text-[9px] leading-none text-rose-400">▲</span>
                  <span className="text-[9px] leading-none">N</span>
                </div>

                {/* Bottom Left Legend */}
                <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-xs text-white px-2 py-1.5 rounded text-[9.5px] space-y-0.5 border border-white/10">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 border-2 border-red-500 bg-red-500/30 inline-block"></span>
                    <span>Selected Survey Plot</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 border border-dashed border-slate-300 inline-block"></span>
                    <span>Surrounding Plots</span>
                  </div>
                </div>

                {/* Bottom Right Scale Notice */}
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-xs text-slate-200 text-[9.5px] px-2 py-0.5 rounded font-mono">
                  (Indicative Location – Not to Scale)
                </div>
              </div>
            </div>

            {/* Bottom Box: Location Hierarchy */}
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
              <div className="px-4 py-2 bg-[#F8FAFC] border-b border-slate-200 flex items-center gap-2 font-bold text-xs text-[#1E293B]">
                <div className="p-0.5 bg-emerald-100 rounded text-emerald-700">
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <span>Location Hierarchy</span>
              </div>
              <div className="grid grid-cols-4 divide-x divide-slate-100 p-3 text-center text-xs">
                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium mb-0.5">Village</div>
                  <div className="font-bold text-slate-800 text-[11.5px] truncate px-1">Vadavali Khurd</div>
                </div>
                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium mb-0.5">Taluk</div>
                  <div className="font-bold text-slate-800 text-[11.5px] truncate px-1">Palghar</div>
                </div>
                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium mb-0.5">District</div>
                  <div className="font-bold text-slate-800 text-[11.5px] truncate px-1">Palghar</div>
                </div>
                <div>
                  <div className="text-[10.5px] text-slate-400 font-medium mb-0.5">State</div>
                  <div className="font-bold text-slate-800 text-[11.5px] truncate px-1">Maharashtra</div>
                </div>
              </div>
            </div>

          </div>

          {/* Column 3: Compensation Summary (Sec 23) (3 cols) */}
          <div id="compensation-summary" className="lg:col-span-3 bg-[#FFFDF9] border border-[#EBE3D5] rounded-xl p-4 sm:p-5 flex flex-col justify-between shadow-2xs scroll-mt-16">
            <div>
              {/* Card Title */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-[#EBE3D5]">
                <div className="w-7 h-7 rounded-full bg-[#8D6E42]/20 text-[#6D532B] flex items-center justify-center font-bold text-sm shrink-0 font-serif">
                  ₹
                </div>
                <h4 className="font-serif font-bold text-[#4A3B2C] text-sm leading-tight">
                  Compensation Summary <br />
                  <span className="text-xs font-normal text-slate-500">(Sec 23)</span>
                </h4>
              </div>

              {/* Details List */}
              <div className="divide-y divide-[#F2EADB] text-xs mt-1">
                <div className="py-2.5">
                  <div className="text-[11px] text-slate-500">Award Valuation</div>
                  <div className="text-sm font-bold text-[#1E293B]">₹ 1.82 Cr</div>
                  <div className="text-[10.5px] text-slate-500">2.0× Multiplier + 100% Solatium</div>
                </div>

                <div className="py-2.5">
                  <div className="text-[11px] text-slate-500">PFMS Disbursed (Direct DBT)</div>
                  <div className="text-sm font-bold text-[#1E293B]">₹ 0.91 Cr</div>
                  <div className="text-[10.5px] text-emerald-700 font-medium">Tranche 1 (50%) Credited</div>
                </div>

                <div className="py-2.5">
                  <div className="text-[11px] text-slate-500">Bank Account</div>
                  <div className="text-xs font-bold text-[#1E293B]">SBI A/c ending ...4820</div>
                  <div className="text-[10.5px] text-amber-700">(Tranche 2 Queued)</div>
                </div>

                <div className="py-2.5">
                  <div className="text-[11px] text-slate-500">Final Award</div>
                  <div className="text-xs font-medium text-slate-800">Final statutory award published</div>
                </div>
              </div>
            </div>

            <div>
              {/* Total Award Box */}
              <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-3.5 mt-2">
                <div className="text-[11px] font-bold text-slate-700">Total Award Amount (as per Sec 23)</div>
                <div className="text-2xl sm:text-3xl font-extrabold text-[#0D6832] font-serif mt-0.5">
                  ₹ 1.82 Cr
                </div>
              </div>

              {/* Next Action Box */}
              <div className="bg-[#FFF8EB] border border-[#FEE6B8] rounded-xl p-2.5 flex items-start gap-2 mt-3">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 shrink-0 mt-0.5">
                  <Clock className="w-3 h-3" />
                </div>
                <div>
                  <div className="font-bold text-[#7C4A03] text-[11px]">Next Action</div>
                  <div className="text-slate-600 text-[10.5px] leading-tight mt-0.5">
                    Tranche 2 scheduled within 14 days.
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Key Updates Section (9-Step Horizontal Progress Stepper) */}
        <div id="key-updates" className="bg-[#F7FAF8] border border-[#DDE8E0] rounded-xl p-5 sm:p-6 mt-6 shadow-2xs scroll-mt-16">
          <h3 className="font-serif font-bold text-slate-800 text-base mb-6">Key Updates</h3>

          {/* Horizontal Stepper Flow */}
          <div className="relative">
            {/* Connecting Line */}
            <div className="hidden lg:block absolute top-[18px] left-[40px] right-[40px] h-[3px] bg-slate-200 z-0">
              <div className="h-full bg-[#2D6A4F]" style={{ width: '66.6%' }}></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-9 gap-4 relative z-10">
              {stages.map((stg) => {
                const isCompleted = stg.status === 'completed';
                const isCurrent = stg.status === 'current';
                const isPending = stg.status === 'pending';

                return (
                  <div key={stg.step} className="flex flex-col items-center text-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow-xs mb-2 transition-transform hover:scale-105 ${
                        isCompleted
                          ? 'bg-[#2D6A4F] text-white'
                          : isCurrent
                          ? 'bg-[#8C531B] text-white ring-4 ring-[#FFF3E0]'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {stg.step}
                    </div>

                    <h5 className="text-[11.5px] font-bold text-slate-900 leading-snug min-h-[32px] flex items-center justify-center px-1">
                      {stg.title}
                    </h5>

                    <span className="text-[10px] text-slate-500 font-mono mt-1">
                      {stg.date}
                    </span>

                    <div className="mt-2">
                      {isCompleted && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E8F5E9] text-[#2D6A4F] text-[10px] font-bold border border-[#C8E6C9]">
                          Completed
                        </span>
                      )}
                      {isCurrent && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#FFF3E0] text-[#8C531B] text-[10px] font-bold border border-[#FFE0B2]">
                          Current Stage
                        </span>
                      )}
                      {isPending && (
                        <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium border border-slate-200">
                          Pending
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section: Digital Document Vault & Statutory Records */}
        <div id="document-vault" className="mt-8 space-y-4 scroll-mt-16">
          <div className="bg-[#EEF3F8] rounded-xl px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1E436C] text-white flex items-center justify-center font-bold text-sm">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-base text-[#1E293B]">
                  Digital Document Vault &amp; Statutory Records
                </h3>
                <p className="text-xs text-slate-500">
                  Official DSC signed gazette extracts, Section 77 PFMS disbursement receipts &amp; Form 7 award sheet
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsObjectionModalOpen(true)}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>File Section 15 Objection</span>
            </button>
          </div>

          {/* Document Table */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#F8FAFC] border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-3 px-4 w-12 text-center">#</th>
                    <th className="py-3 px-4">Document Title</th>
                    <th className="py-3 px-4">Statutory Type</th>
                    <th className="py-3 px-4">Upload Date</th>
                    <th className="py-3 px-4">Digital Seal No.</th>
                    <th className="py-3 px-4">Size</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {c.documents?.map((doc, idx) => (
                    <tr key={doc.id} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 text-center text-slate-500 font-bold">{idx + 1}</td>
                      <td className="py-3 px-4">
                        <strong className="text-[#1E4D79] font-bold block">{doc.title}</strong>
                      </td>
                      <td className="py-3 px-4 text-slate-600 font-medium">{doc.type}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{doc.uploadDate}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">{doc.sealNumber}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{doc.size}</td>
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => alert(`Downloading DSC verified document: ${doc.title}`)}
                          className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg text-[11px] font-bold text-[#1E4D79] flex items-center gap-1.5 mx-auto cursor-pointer shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Section: Disbursal Tranches (DBT) */}
        <div id="disbursal-tranches" className="mt-8 space-y-4 scroll-mt-16">
          <h3 className="font-serif font-bold text-slate-800 text-base">
            PFMS Direct Benefit Transfer (DBT) Disbursal Breakdown
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#F0F9F2] border border-[#CDEEDB] rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0D6832]">Tranche 1 (50% Disbursal)</span>
                <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full font-bold text-[10px]">CREDITED</span>
              </div>
              <div className="text-2xl font-bold text-[#0D6832] font-serif">₹ 91,00,000</div>
              <p className="text-xs text-slate-600">
                Transferred via PFMS UTR #PFMS-2026-992144 to State Bank of India A/c ending <strong>...4820</strong> on 24 Sep 2024.
              </p>
            </div>

            <div className="bg-[#FFF8EB] border border-[#FEE6B8] rounded-xl p-5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#7C4A03]">Tranche 2 (50% Balance)</span>
                <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full font-bold text-[10px]">SCHEDULED</span>
              </div>
              <div className="text-2xl font-bold text-[#7C4A03] font-serif">₹ 91,00,000</div>
              <p className="text-xs text-slate-600">
                Scheduled for direct treasury release following completion of mutation in Record of Rights (RoR) within 14 calendar days.
              </p>
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
              This information is system generated from the land acquisition management system and is for citizen reference only.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#property-details"
              className="text-xs text-[#1E4D79] font-bold hover:underline"
            >
              ↑ Back to top
            </a>
          </div>
        </div>

      </div>

      {/* Objection Modal */}
      <ObjectionModal isOpen={isObjectionModalOpen} onClose={() => setIsObjectionModalOpen(false)} />
    </div>
  );
};
