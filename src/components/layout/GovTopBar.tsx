import React, { useState, useRef, useEffect } from 'react';
import { useRole, DEFAULT_PERSONAS } from '../../context/RoleContext';
import type { RoleType } from '../../types';
import {
  Volume2,
  Globe,
  Play,
  Pause,
  ChevronDown,
  Search,
  Lock,
  LogOut,
  CheckCircle,
  ShieldCheck,
  User,
} from 'lucide-react';

export const GovTopBar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    setCommandPaletteOpen,
    currentUser,
    logoutUser,
    loginUser,
    selectedLanguage,
    setSelectedLanguage,
  } = useRole();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems: { id: RoleType; label: string; hindi: string; hasDropdown?: boolean }[] = [
    { id: 'home', label: 'Home', hindi: 'मुख्य पृष्ठ' },
    { id: 'command_center', label: 'National Command Center', hindi: 'राष्ट्रीय कमान केंद्र' },
    { id: 'citizen', label: 'Citizen Corner (My Case)', hindi: 'नागरिक कॉर्नर' },
    { id: 'field_officer', label: 'Field Verification (DGPS)', hindi: 'क्षेत्र सत्यापन' },
    { id: 'district_officer', label: 'District & State MIS', hindi: 'जिला एमआईएस' },
    { id: 'intelligence_layer', label: 'Risk & Bottleneck Engine', hindi: 'जोखिम इंजन' },
    { id: 'acts', label: 'Documents', hindi: 'दस्तावेज़', hasDropdown: true },
    { id: 'rti', label: 'Citizen Charter / RTI', hindi: 'नागरिक चार्टर / आरटीआई' },
    { id: 'whoswho', label: "Who's Who", hindi: 'अधिकारी निर्देशिका' },
  ];

  return (
    <header className="w-full bg-white select-none shadow-xs border-b border-slate-200">
      {/* 1. Topmost Utility Accessibility Strip */}
      <div className="w-full bg-[#0B3D66] text-white px-6 sm:px-12 2xl:px-20 py-1.5 font-sans border-b border-[#072742]">
        <div className="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-5 text-slate-200">
            <button
              onClick={() => alert('Screen Reader Accessible Mode Active (WCAG 2.1 AA)')}
              className="flex items-center gap-1.5 hover:underline font-medium"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Screen Reader Access</span>
            </button>
            <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/20 font-bold font-mono text-[11px]">
              W3C GIGW
            </span>
            <button className="hover:underline font-medium hidden sm:inline">
              ♿ Accessibility Options
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 font-medium">
            <div className="flex items-center gap-2 bg-black/25 px-2.5 py-0.5 rounded border border-white/20 text-slate-100">
              <span className="hidden sm:inline">राष्ट्रगान (Anthem)</span>
              <span className="font-mono text-[11px] text-amber-200">0:52</span>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="hover:text-amber-300 p-0.5"
                title="Play National Anthem"
              >
                {isPlayingAudio ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3 fill-current" />}
              </button>
            </div>

            <a href="#main-content" className="hover:underline text-slate-200 hidden md:inline">
              Skip To Main Content
            </a>

            {/* Multi-Language Dropdown */}
            <div className="relative">
              <select
                value={selectedLanguage}
                onChange={(e: any) => setSelectedLanguage(e.target.value)}
                className="bg-black/35 hover:bg-black/50 text-amber-300 font-bold border border-white/20 px-2 py-0.5 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-300"
              >
                <option value="EN" className="bg-[#0B3D66] text-white">English</option>
                <option value="HI" className="bg-[#0B3D66] text-white">हिन्दी (Hindi)</option>
                <option value="MR" className="bg-[#0B3D66] text-white">मराठी (Marathi)</option>
                <option value="TA" className="bg-[#0B3D66] text-white">தமிழ் (Tamil)</option>
                <option value="GU" className="bg-[#0B3D66] text-white">ગુજરાતી (Gujarati)</option>
                <option value="TE" className="bg-[#0B3D66] text-white">తెలుగు (Telugu)</option>
                <option value="BN" className="bg-[#0B3D66] text-white">বাংলা (Bengali)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Title Bar: Logo + Department Info (Left) and Anchored Login CTA (Right) */}
      <div className="w-full px-6 sm:px-12 2xl:px-20 py-4 bg-white">
        <div className="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-6">
          
          {/* Left: Ashoka Emblem + Official Department Hierarchy */}
          <div
            className="flex items-center gap-4 sm:gap-5 cursor-pointer"
            onClick={() => setCurrentRole('home')}
          >
            <div className="w-14 h-18 sm:w-16 sm:h-20 shrink-0 flex items-center justify-center">
              <svg viewBox="0 0 100 120" className="w-full h-full">
                <circle cx="50" cy="20" r="14" fill="#0B3D66" />
                <rect x="42" y="34" width="16" height="30" fill="#0B3D66" />
                <rect x="25" y="40" width="12" height="24" fill="#0B3D66" />
                <rect x="63" y="40" width="12" height="24" fill="#0B3D66" />
                <rect x="15" y="66" width="70" height="10" rx="2" fill="#D97706" />
                <circle cx="50" cy="71" r="4" fill="#0B3D66" stroke="#FFFFFF" strokeWidth="1" />
                <polygon points="10,80 90,80 80,95 20,95" fill="#0B3D66" />
                <text x="50" y="112" fontSize="9" fontFamily="serif" fontWeight="bold" textAnchor="middle" fill="#0B3D66">
                  सत्यमेव जयते
                </text>
              </svg>
            </div>

            <div>
              <div className="text-[11px] sm:text-xs font-serif font-bold text-[#0B3D66] tracking-wider uppercase">
                भारत सरकार &nbsp;|&nbsp; GOVERNMENT OF INDIA
              </div>
              <div className="text-xl sm:text-2xl lg:text-[26px] font-extrabold font-sans text-[#0B3D66] tracking-tight leading-tight mt-0.5">
                LandPulse — <span className="text-[#1D4ED8]">National Land Acquisition Platform</span>
              </div>
              <div className="text-xs font-medium text-slate-600 leading-tight mt-0.5 hidden sm:block">
                भूमि संसाधन विभाग, ग्रामीण विकास मंत्रालय &nbsp;|&nbsp; Department of Land Resources, Ministry of Rural Development
              </div>
            </div>
          </div>

          {/* Right: Primary Login / SSO Button Anchored in Header */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-3.5 py-2 transition-all shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-[#0B3D66] text-white text-xs font-bold flex items-center justify-center shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div className="text-xs font-bold text-[#0B3D66] leading-tight truncate max-w-[150px]">
                      {currentUser.name}
                    </div>
                    <div className="text-[10px] font-medium text-slate-500 leading-tight truncate max-w-[150px]">
                      {currentUser.roleTitle}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {/* User Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 z-50 p-4 space-y-3 font-sans">
                    <div className="border-b border-slate-200 pb-3">
                      <div className="text-xs font-extrabold text-[#0B3D66]">
                        {currentUser.name}
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium">
                        {currentUser.designation}
                      </div>
                      <div className="mt-2 text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-600 font-mono flex items-center justify-between">
                        <span>{currentUser.badgeLevel || 'Level 14 SSO'}</span>
                        <span className="text-emerald-700 font-bold">Active</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Switch Stakeholder Role
                      </div>
                      {Object.entries(DEFAULT_PERSONAS).map(([key, persona]) => (
                        <button
                          key={key}
                          onClick={() => {
                            loginUser(persona, persona.role);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors ${
                            currentUser.id === persona.id
                              ? 'bg-blue-50 text-blue-900 font-bold'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="truncate max-w-[180px]">{persona.roleTitle}</span>
                          {currentUser.id === persona.id && <CheckCircle className="w-3.5 h-3.5 text-blue-700" />}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-2 flex items-center justify-between text-xs">
                      <button
                        onClick={() => {
                          setCurrentRole('login');
                          setUserDropdownOpen(false);
                        }}
                        className="font-bold text-[#0B3D66] hover:underline flex items-center gap-1"
                      >
                        <Lock className="w-3 h-3" /> Login Page
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="font-bold text-red-600 hover:underline flex items-center gap-1"
                      >
                        <LogOut className="w-3 h-3" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentRole('login')}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm ${
                  currentRole === 'login'
                    ? 'bg-[#072742] text-white ring-2 ring-amber-400'
                    : 'bg-[#0B3D66] hover:bg-[#072742] text-white hover:shadow-md'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Login / SSO</span>
              </button>
            )}

            {/* Quick Vedic Inscription (subtle) */}
            <div className="hidden xl:flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold font-serif text-[#C2410C] leading-snug">
                  "माता भूमिः पुत्रोऽहं पृथिव्याः"
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Atharva Veda 12.1.12
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 3. Distinct Secondary Navigation Bar (Page Links Only) */}
      <nav className="w-full bg-[#0B3D66] text-white shadow-sm border-t border-[#1E4E79]">
        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20 flex items-center justify-between overflow-x-auto whitespace-nowrap">
          <div className="flex items-center">
            {navItems.map((item) => {
              const isActive = currentRole === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentRole(item.id)}
                  className={`py-3 px-3.5 sm:px-4 text-xs sm:text-[13px] font-bold font-sans transition-all flex items-center gap-1 shrink-0 border-b-2 ${
                    isActive
                      ? 'bg-[#164E8A] text-white border-amber-400 shadow-xs'
                      : 'text-slate-200 border-transparent hover:bg-[#124275] hover:text-white'
                  }`}
                >
                  <span>{selectedLanguage === 'EN' ? item.label : item.hindi}</span>
                  {item.hasDropdown && <ChevronDown className="w-3.5 h-3.5 text-slate-300" />}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCommandPaletteOpen(true)}
            className="ml-4 px-3 py-1.5 rounded bg-[#124275] hover:bg-[#164E8A] text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shrink-0 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Search Registry</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
