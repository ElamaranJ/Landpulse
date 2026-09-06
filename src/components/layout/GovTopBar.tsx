import React, { useState, useRef, useEffect } from 'react';
import { useRole, DEFAULT_PERSONAS } from '../../context/RoleContext';
import { useLocale } from '../../context/LocaleContext';
import { useModals, ModalName } from '../../context/ModalContext';
import type { RoleType } from '../../types';
import {
  Volume2,
  ChevronDown,
  ChevronRight,
  Search,
  Lock,
  LogOut,
  CheckCircle,
  Menu,
  X,
  Bell,
  Play,
  Pause
} from 'lucide-react';

interface NavSubItem {
  id: string;
  label: string;
  hindi: string;
  badge?: string;
  roleId?: RoleType;
  modalName?: ModalName;
}

interface NavGroup {
  id: string;
  label: string;
  hindi: string;
  singleRole?: RoleType;
  items?: NavSubItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'home',
    label: 'Home',
    hindi: 'मुख्य पृष्ठ',
    singleRole: 'home',
  },
  {
    id: 'departments',
    label: 'Departments / Officials',
    hindi: 'विभाग एवं अधिकारी',
    items: [
      { id: 'whoswho_main', label: "Who's Who (Ministry Leadership)", hindi: 'केंद्रीय नेतृत्व निर्देशिका', roleId: 'whoswho' },
      { id: 'slao_dir', label: 'Land Acquisition Officers (SLAO)', hindi: 'भूमि अर्जन अधिकारी (SLAO)', roleId: 'whoswho' },
      { id: 'district_coll', label: 'District Collectors & CALA', hindi: 'जिला कलेक्टर व CALA', roleId: 'whoswho' },
      { id: 'org_chart', label: 'Ministry Structure / Org Chart', hindi: 'मंत्रालय संगठनात्मक ढांचा', modalName: 'orgChart' },
    ],
  },
  {
    id: 'schemes',
    label: 'Schemes & Policies',
    hindi: 'योजनाएं एवं नीतियां',
    items: [
      { id: 'rfctlarr_act', label: 'Compensation Policy / RFCTLARR Act', hindi: 'मुआवजा नीति व अधिनियम २०१३', roleId: 'acts' },
      { id: 'rr_schemes', label: 'Rehabilitation & Resettlement Schemes', hindi: 'पुनर्वास व पुनर्स्थापन योजनाएं', roleId: 'acts' },
      { id: 'circulars_notif', label: 'Circulars & Notifications', hindi: 'परिपत्र एवं अधिसूचनाएं', roleId: 'acts' },
      { id: 'gazette_pub', label: 'Gazette Publications', hindi: 'राजपत्र प्रकाशन खोज', modalName: 'notificationSearch' },
    ],
  },
  {
    id: 'field_ops',
    label: 'Field Operations',
    hindi: 'क्षेत्रीय संचालन',
    items: [
      { id: 'gis_insp', label: 'GIS Satellite Inspections', hindi: 'उपग्रह निरीक्षण', roleId: 'officer_inspections', badge: 'NEW' },
      { id: 'field_dgps', label: 'Field Verification (DGPS)', hindi: 'क्षेत्र सत्यापन (DGPS)', roleId: 'field_officer' },
      { id: 'risk_eng', label: 'Risk & Bottleneck Engine', hindi: 'जोखिम व बाधा इंजन', roleId: 'intelligence_layer' },
    ],
  },
  {
    id: 'landowner_services',
    label: 'Landowner Services',
    hindi: 'भूमि स्वामी सेवाएं',
    items: [
      { id: 'citizen_corner', label: 'Citizen Corner (My Case)', hindi: 'नागरिक कॉर्नर (मेरा मामला)', roleId: 'citizen' },
      { id: 'track_case', label: 'Track Land Case Status', hindi: 'भूमि मामला स्थिति ट्रैक करें', modalName: 'caseTracker' },
      { id: 'calc_comp', label: 'RFCTLARR Compensation Calculator', hindi: 'मुआवजा गणना कैलकुलेटर', modalName: 'calc' },
      { id: 'rti_charter', label: 'Citizen Charter / RTI', hindi: 'नागरिक चार्टर / आरटीआई', roleId: 'rti' },
    ],
  },
  {
    id: 'reports_analytics',
    label: 'Reports & Analytics',
    hindi: 'रिपोर्ट एवं विश्लेषण',
    items: [
      { id: 'cmd_center', label: 'National Command Center', hindi: 'राष्ट्रीय कमान केंद्र', roleId: 'command_center' },
      { id: 'district_mis', label: 'District & State Progress MIS', hindi: 'राज्य व जिला प्रगति एमआईएस', roleId: 'district_officer' },
      { id: 'export_mis', label: 'Downloadable MIS Reports', hindi: 'डाउनलोड करने योग्य एमआईएस रिपोर्ट', modalName: 'exportModal' },
      { id: 'open_data_view', label: 'Public Dashboard (Open Data View)', hindi: 'सार्वजनिक ओपन डेटा डैशबोर्ड', modalName: 'openData' },
    ],
  },
  {
    id: 'grievance_support',
    label: 'Grievance / Support',
    hindi: 'शिकायत व सहायता',
    items: [
      { id: 'raise_grievance', label: 'Raise a Grievance (Section 15)', hindi: 'धारा १५ आपत्ति / शिकायत दर्ज करें', modalName: 'grievance' },
      { id: 'track_complaint', label: 'Track Complaint Status', hindi: 'शिकायत स्थिति ट्रैक करें', modalName: 'caseTracker' },
      { id: 'helpline_dir', label: 'Helpline / Contact Directory', hindi: 'हेल्पलाइन व संपर्क निर्देशिका', modalName: 'helpline' },
      { id: 'faqs_guide', label: 'Frequently Asked Questions (FAQs)', hindi: 'अक्सर पूछे जाने वाले प्रश्न', modalName: 'faqs' },
    ],
  },
  {
    id: 'about_group',
    label: 'About',
    hindi: 'के बारे में',
    items: [
      { id: 'about_portal', label: 'About LandPulse / Vision', hindi: 'लैंडपल्स विजन व उद्देश्य', modalName: 'about' },
      { id: 'sih_problem', label: 'SIH26016 Problem Statement', hindi: 'SIH26016 समस्या विवरण', modalName: 'about' },
      { id: 'site_map_link', label: 'Portal Site Map', hindi: 'पोर्टल साइट मैप', modalName: 'siteMap' },
      { id: 'privacy_link', label: 'Privacy Policy & Terms', hindi: 'गोपनीयता नीति व शर्तें', modalName: 'privacyPolicy' },
    ],
  },
];

export const GovTopBar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    currentUser,
    logoutUser,
    loginUser,
    unreadAlertsCount,
  } = useRole();
  const { selectedLanguage, setSelectedLanguage } = useLocale();
  const { openModal } = useModals();

  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedGroups, setMobileExpandedGroups] = useState<Record<string, boolean>>({
    departments: true,
    schemes: true,
    field_ops: true,
    landowner_services: true,
    reports_analytics: true,
    grievance_support: true,
    about_group: true,
  });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setOpenDropdownId(null);
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Hover handlers with debounce for desktop dropdowns
  const handleMouseEnter = (groupId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdownId(groupId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdownId(null);
    }, 180);
  };

  // Toggle dropdown on click
  const handleGroupClick = (group: NavGroup) => {
    if (group.singleRole) {
      setCurrentRole(group.singleRole);
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
    } else {
      setOpenDropdownId(prev => (prev === group.id ? null : group.id));
    }
  };

  // Select sub-item (navigates or opens modal)
  const handleSelectSubItem = (subItem: NavSubItem) => {
    if (subItem.roleId) {
      setCurrentRole(subItem.roleId);
    } else if (subItem.modalName) {
      openModal(subItem.modalName);
    }
    setOpenDropdownId(null);
    setMobileMenuOpen(false);
  };

  // Check if group is currently active
  const isGroupActive = (group: NavGroup): boolean => {
    if (group.singleRole) {
      return currentRole === group.singleRole;
    }
    return group.items?.some(item => item.roleId && item.roleId === currentRole) ?? false;
  };

  // Toggle mobile accordion
  const toggleMobileAccordion = (groupId: string) => {
    setMobileExpandedGroups(prev => ({
      ...prev,
      [groupId]: !prev[groupId],
    }));
  };

  return (
    <header className="w-full bg-white select-none shadow-xs border-b border-slate-200 font-sans">
      {/* 1. Topmost Utility Accessibility Strip */}
      <div className="w-full bg-[#0B3D66] text-white px-6 sm:px-12 2xl:px-20 py-1.5 font-sans border-b border-[#072742]">
        <div className="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-5 text-slate-200">
            <button
              onClick={() => alert('Screen Reader Accessible Mode Active (WCAG 2.1 AA)')}
              className="flex items-center gap-1.5 hover:underline font-medium cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Screen Reader Access</span>
            </button>
            <span className="px-1.5 py-0.5 rounded bg-black/25 border border-white/20 font-bold font-mono text-[11px]">
              W3C GIGW
            </span>
            <button
              onClick={() => openModal('siteMap')}
              className="hover:underline font-medium hidden sm:inline cursor-pointer"
            >
              ♿ Accessibility &amp; Site Map
            </button>
          </div>

          <div className="flex items-center gap-4 sm:gap-6 font-medium">
            <div className="flex items-center gap-2 bg-black/25 px-2.5 py-0.5 rounded border border-white/20 text-slate-100">
              <span className="hidden sm:inline">राष्ट्रगान (Anthem)</span>
              <span className="font-mono text-[11px] text-amber-200">0:52</span>
              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="hover:text-amber-300 p-0.5 cursor-pointer"
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
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setSelectedLanguage(e.target.value as 'EN' | 'HI' | 'MR' | 'TA' | 'GU' | 'TE' | 'BN')
                }
                className="bg-black/35 hover:bg-black/50 text-amber-300 font-bold border border-white/20 px-2 py-0.5 rounded text-xs focus:outline-none focus:ring-1 focus:ring-amber-300 cursor-pointer"
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
                  className="flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded-lg px-3.5 py-2 transition-all shadow-xs cursor-pointer"
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
                  <div className="absolute right-0 mt-2 w-72 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 z-50 p-4 space-y-3 font-sans animate-fadeIn">
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
                          className={`w-full text-left px-2 py-1.5 rounded text-xs flex items-center justify-between transition-colors cursor-pointer ${
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
                        className="font-bold text-[#0B3D66] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Lock className="w-3 h-3" /> Login Page
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="font-bold text-red-600 hover:underline flex items-center gap-1 cursor-pointer"
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
                className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all shadow-sm cursor-pointer ${
                  currentRole === 'login'
                    ? 'bg-[#072742] text-white ring-2 ring-amber-400'
                    : 'bg-[#0B3D66] hover:bg-[#072742] text-white hover:shadow-md'
                }`}
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Login / SSO</span>
              </button>
            )}

            {/* Quick Vedic Inscription */}
            <div className="hidden xl:flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="text-right">
                <p className="text-xs font-bold font-serif text-[#C2410C] leading-snug">
                  &quot;माता भूमिः पुत्रोऽहं पृथिव्याः&quot;
                </p>
                <span className="text-[10px] text-slate-500 font-mono block">
                  Atharva Veda 12.1.12
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Comprehensive Grouped Dropdown Navigation Bar */}
      <nav className="w-full bg-[#0B3D66] text-white shadow-sm border-t border-[#1E4E79] relative z-40">
        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20 flex items-center justify-between overflow-x-visible">
          
          {/* Desktop Grouped Dropdown Menu Items */}
          <div className="hidden lg:flex items-center flex-wrap" ref={navContainerRef}>
            {NAV_GROUPS.map(group => {
              const active = isGroupActive(group);
              const isOpen = openDropdownId === group.id;

              return (
                <div
                  key={group.id}
                  className="relative"
                  onMouseEnter={() => !group.singleRole && handleMouseEnter(group.id)}
                  onMouseLeave={() => !group.singleRole && handleMouseLeave()}
                >
                  <button
                    type="button"
                    onClick={() => handleGroupClick(group)}
                    aria-haspopup={group.items ? 'true' : undefined}
                    aria-expanded={group.items ? isOpen : undefined}
                    className={`py-3 px-3.5 xl:px-4 text-xs xl:text-[13px] font-bold font-sans transition-all flex items-center gap-1.5 shrink-0 border-b-2 cursor-pointer ${
                      active
                        ? 'bg-[#164E8A] text-white border-amber-400 shadow-xs'
                        : 'text-slate-200 border-transparent hover:bg-[#124275] hover:text-white'
                    }`}
                  >
                    <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                    {group.items && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 text-slate-300 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </button>

                  {/* Clean Government Portal Dropdown Box */}
                  {group.items && isOpen && (
                    <div
                      role="menu"
                      className="absolute top-full left-0 w-72 bg-white text-slate-800 rounded-b-xl shadow-2xl border border-slate-200/90 py-1.5 z-50 animate-fadeIn"
                    >
                      <div className="px-3.5 py-1.5 border-b border-slate-100 bg-slate-50/80 text-[10px] font-bold text-[#0B3D66] uppercase tracking-wider flex items-center justify-between">
                        <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                      </div>
                      <div className="py-1">
                        {group.items.map(subItem => {
                          const isSubActive = subItem.roleId && currentRole === subItem.roleId;
                          return (
                            <button
                              key={subItem.id}
                              role="menuitem"
                              type="button"
                              onClick={() => handleSelectSubItem(subItem)}
                              className={`w-full text-left px-4 py-2.5 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                                isSubActive
                                  ? 'bg-blue-50 text-[#0B3D66] font-bold border-l-4 border-[#1D4ED8]'
                                  : 'text-slate-700 hover:text-[#0B3D66] hover:bg-slate-50 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{selectedLanguage === 'EN' ? subItem.label : subItem.hindi}</span>
                                {subItem.badge && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 uppercase">
                                    {subItem.badge}
                                  </span>
                                )}
                              </div>
                              {isSubActive && <CheckCircle className="w-3.5 h-3.5 text-[#1D4ED8]" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Mobile/Tablet Hamburger Toggle Button */}
          <div className="flex lg:hidden items-center py-2.5">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3 py-1.5 rounded-lg bg-[#124275] hover:bg-[#164E8A] text-white text-xs font-bold flex items-center gap-2 border border-white/20 cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              <span>Portal Menu</span>
            </button>
          </div>

          {/* Right Action Buttons (Alerts & Search Registry) */}
          <div className="flex items-center gap-2 ml-4 py-2">
            <button
              onClick={() => openModal('notificationSearch')}
              className="relative px-3 py-1.5 rounded bg-[#124275] hover:bg-[#164E8A] text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shrink-0 transition-colors cursor-pointer"
              title="View Notifications & Alerts"
            >
              <Bell className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-600 text-white text-[10px] font-mono font-bold animate-pulse">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => openModal('commandPalette')}
              className="px-3 py-1.5 rounded bg-[#124275] hover:bg-[#164E8A] text-white text-xs font-bold flex items-center gap-1.5 border border-white/20 shrink-0 transition-colors cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">Search Registry</span>
            </button>
          </div>
        </div>

        {/* Mobile Accordion Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800 px-4 py-3 space-y-2 animate-fadeIn max-h-[80vh] overflow-y-auto">
            {NAV_GROUPS.map(group => {
              if (group.singleRole) {
                const active = currentRole === group.singleRole;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => {
                      setCurrentRole(group.singleRole!);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center justify-between cursor-pointer ${
                      active ? 'bg-blue-600 text-white' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                    {active && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                  </button>
                );
              }

              const isExpanded = mobileExpandedGroups[group.id] ?? false;
              const groupActive = isGroupActive(group);

              return (
                <div key={group.id} className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/60">
                  <button
                    type="button"
                    onClick={() => toggleMobileAccordion(group.id)}
                    className={`w-full text-left px-3 py-2.5 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer ${
                      groupActive ? 'text-amber-400 bg-slate-900' : 'text-slate-200 hover:bg-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                      {groupActive && (
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      )}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isExpanded && group.items && (
                    <div className="bg-slate-900/90 py-1 px-2 space-y-1 border-t border-slate-800">
                      {group.items.map(subItem => {
                        const isSubActive = subItem.roleId && currentRole === subItem.roleId;
                        return (
                          <button
                            key={subItem.id}
                            type="button"
                            onClick={() => handleSelectSubItem(subItem)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              isSubActive
                                ? 'bg-blue-600 text-white font-bold'
                                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <ChevronRight className="w-3 h-3 text-slate-500" />
                              <span>{selectedLanguage === 'EN' ? subItem.label : subItem.hindi}</span>
                              {subItem.badge && (
                                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40">
                                  {subItem.badge}
                                </span>
                              )}
                            </div>
                            {isSubActive && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </nav>
    </header>
  );
};
