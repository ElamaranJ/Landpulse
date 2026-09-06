import React, { useState, useRef, useEffect, useMemo } from 'react';
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
  Home,
  Landmark,
  FileText,
  MapPin,
  BarChart3,
  Headphones,
  Info,
  ArrowRight,
  Globe,
  HelpCircle,
  User,
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
  icon: React.ComponentType<{ className?: string }>;
  singleRole?: RoleType;
  items?: NavSubItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'home',
    label: 'Home',
    hindi: 'मुख्य पृष्ठ',
    icon: Home,
    singleRole: 'home',
  },
  {
    id: 'departments',
    label: 'Departments',
    hindi: 'विभाग एवं अधिकारी',
    icon: Landmark,
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
    icon: FileText,
    items: [
      { id: 'rfctlarr_act', label: 'Compensation Policy / RFCTLARR Act', hindi: 'मुआवजा नीति व अधिनियम २०१३', roleId: 'acts' },
      { id: 'rr_schemes', label: 'Rehabilitation & Resettlement Schemes', hindi: 'पुनर्वास व पुनर्स्थापन योजनाएं', roleId: 'acts' },
      { id: 'circulars_notif', label: 'Circulars & Notifications', hindi: 'परिपत्र एवं अधिसूचनाएं', roleId: 'acts' },
      { id: 'gazette_pub', label: 'Gazette Publications', hindi: 'राजपत्र प्रकाशन खोज', modalName: 'notificationSearch' },
    ],
  },
  {
    id: 'land_services',
    label: 'Land Services',
    hindi: 'भूमि सेवाएं',
    icon: MapPin,
    items: [
      { id: 'citizen_corner', label: 'Citizen Corner (My Case)', hindi: 'नागरिक कॉर्नर (मेरा मामला)', roleId: 'citizen' },
      { id: 'track_case', label: 'Track Land Case Status', hindi: 'भूमि मामला स्थिति ट्रैक करें', modalName: 'caseTracker' },
      { id: 'calc_comp', label: 'RFCTLARR Compensation Calculator', hindi: 'मुआवजा गणना कैलकुलेटर', modalName: 'calc' },
      { id: 'gis_insp', label: 'GIS Satellite Inspections', hindi: 'उपग्रह निरीक्षण', roleId: 'officer_inspections', badge: 'NEW' },
      { id: 'field_dgps', label: 'Field Verification (DGPS/RTK)', hindi: 'क्षेत्र सत्यापन (DGPS)', roleId: 'field_officer' },
      { id: 'rti_charter', label: 'Citizen Charter / RTI', hindi: 'नागरिक चार्टर / आरटीआई', roleId: 'rti' },
    ],
  },
  {
    id: 'reports_analytics',
    label: 'Reports & Analytics',
    hindi: 'रिपोर्ट एवं विश्लेषण',
    icon: BarChart3,
    items: [
      { id: 'cmd_center', label: 'National Command Center', hindi: 'राष्ट्रीय कमान केंद्र', roleId: 'command_center' },
      { id: 'district_mis', label: 'District & State Progress MIS', hindi: 'राज्य व जिला प्रगति एमआईएस', roleId: 'district_officer' },
      { id: 'proj_admin', label: 'Least-Cost Alignment Optimizer', hindi: 'संरेखण अनुकूलक', roleId: 'project_admin' },
      { id: 'risk_eng', label: 'Risk & Bottleneck Analytics', hindi: 'जोखिम व बाधा इंजन', roleId: 'intelligence_layer' },
      { id: 'export_mis', label: 'Downloadable MIS Reports', hindi: 'डाउनलोड करने योग्य एमआईएस रिपोर्ट', modalName: 'exportModal' },
      { id: 'open_data_view', label: 'Public Dashboard (Open Data View)', hindi: 'सार्वजनिक ओपन डेटा डैशबोर्ड', modalName: 'openData' },
    ],
  },
  {
    id: 'grievance_support',
    label: 'Grievance / Support',
    hindi: 'शिकायत व सहायता',
    icon: Headphones,
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
    icon: Info,
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
  } = useRole();
  const { selectedLanguage, setSelectedLanguage } = useLocale();
  const { openModal } = useModals();

  // Always-public roles accessible without authentication
  const PUBLIC_ROLES: RoleType[] = ['home', 'acts', 'rti', 'whoswho'];

  // Filter NAV_GROUPS: only display items permitted for the current user's role + always-public items
  const visibleNavGroups = useMemo(() => {
    return NAV_GROUPS.map(group => {
      if (group.singleRole) {
        if (PUBLIC_ROLES.includes(group.singleRole)) return group;
        if (currentUser && currentUser.role === group.singleRole) return group;
        return null;
      }

      if (group.items) {
        const filteredItems = group.items.filter(item => {
          if (!item.roleId) return true;
          if (PUBLIC_ROLES.includes(item.roleId)) return true;
          if (currentUser) {
            if (currentUser.role === item.roleId) return true;
            if (currentUser.role === 'field_officer' && item.roleId === 'officer_inspections') return true;
          }
          return false;
        });

        if (filteredItems.length > 0) {
          return {
            ...group,
            items: filteredItems,
          };
        }
      }

      return null;
    }).filter((g): g is NavGroup => g !== null);
  }, [currentUser]);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [fontSizeLevel, setFontSizeLevel] = useState<'A-' | 'A' | 'A+'>('A');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const navContainerRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Close dropdowns on outside click or Escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
      if (navContainerRef.current && !navContainerRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setUserDropdownOpen(false);
        setLangDropdownOpen(false);
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

  // Hover handlers for desktop dropdowns
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

  const handleGroupClick = (group: NavGroup) => {
    if (group.singleRole) {
      setCurrentRole(group.singleRole);
      setOpenDropdownId(null);
      setMobileMenuOpen(false);
    } else {
      setOpenDropdownId(prev => (prev === group.id ? null : group.id));
    }
  };

  const handleSelectSubItem = (subItem: NavSubItem) => {
    if (subItem.roleId) {
      setCurrentRole(subItem.roleId);
    } else if (subItem.modalName) {
      openModal(subItem.modalName);
    }
    setOpenDropdownId(null);
    setMobileMenuOpen(false);
  };

  const isGroupActive = (group: NavGroup): boolean => {
    if (group.singleRole) {
      return currentRole === group.singleRole;
    }
    return group.items?.some(item => item.roleId && item.roleId === currentRole) ?? false;
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    openModal('commandPalette');
  };

  return (
    <header className="w-full bg-white select-none shadow-xs font-sans relative z-50">
      {/* ========================================================================= */}
      {/* 1. TOPMOST UTILITY ACCESSIBILITY STRIP (Dark Slate #24383F)                */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#24383F] text-slate-200 px-6 sm:px-12 2xl:px-20 py-2 text-sm font-medium border-b border-[#1A2A30]">
        <div className="w-full max-w-[1920px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Left: Emblem & Official Ministry Hierarchy */}
          <div className="flex items-center gap-2.5 text-slate-200">
            {/* Ashoka Emblem SVG Icon */}
            <svg viewBox="0 0 100 120" className="w-4 h-5 fill-slate-200 shrink-0">
              <circle cx="50" cy="20" r="14" />
              <rect x="42" y="34" width="16" height="30" />
              <rect x="25" y="40" width="12" height="24" />
              <rect x="63" y="40" width="12" height="24" />
              <rect x="15" y="66" width="70" height="10" rx="2" />
              <circle cx="50" cy="71" r="4" fill="#24383F" stroke="#FFFFFF" strokeWidth="1" />
              <polygon points="10,80 90,80 80,95 20,95" />
            </svg>
            <span className="font-semibold text-white text-sm">Government of India</span>
            <span className="text-slate-500">|</span>
            <span className="hidden sm:inline text-slate-300 text-sm">Ministry of Rural Development</span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-300 text-sm">Department of Land Resources</span>
          </div>

          {/* Right: Accessibility Controls, Language, Help & Login CTAs */}
          <div className="flex items-center gap-3 sm:gap-4 text-sm font-medium">
            {/* Font Resizing Controls */}
            <div className="flex items-center gap-1.5 text-xs font-bold">
              <button
                onClick={() => setFontSizeLevel('A-')}
                className={`hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded ${fontSizeLevel === 'A-' ? 'text-amber-400 bg-black/20' : 'text-slate-300'}`}
                title="Decrease Font Size"
              >
                A-
              </button>
              <button
                onClick={() => setFontSizeLevel('A')}
                className={`hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded ${fontSizeLevel === 'A' ? 'text-amber-400 bg-black/20' : 'text-slate-300'}`}
                title="Normal Font Size"
              >
                A
              </button>
              <button
                onClick={() => setFontSizeLevel('A+')}
                className={`hover:text-white transition-colors cursor-pointer px-1.5 py-0.5 rounded ${fontSizeLevel === 'A+' ? 'text-amber-400 bg-black/20' : 'text-slate-300'}`}
                title="Increase Font Size"
              >
                A+
              </button>
            </div>

            <span className="text-slate-500">|</span>

            {/* Screen Reader Access */}
            <button
              onClick={() => alert('Screen Reader Accessible Mode Active (WCAG 2.1 AA)')}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer"
              title="Screen Reader Access"
            >
              <Volume2 className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">Screen Reader</span>
            </button>

            <span className="text-slate-500">|</span>

            {/* Language Selector */}
            <div className="relative" ref={langRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer font-semibold"
              >
                <Globe className="w-4 h-4 text-slate-300" />
                <span>{selectedLanguage === 'HI' ? 'हिन्दी' : 'English'}</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-40 bg-[#1A2A30] text-white rounded shadow-lg border border-slate-700 z-50 py-1 text-sm">
                  <button
                    onClick={() => { setSelectedLanguage('EN'); setLangDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#24383F] flex items-center justify-between"
                  >
                    <span>English</span>
                    {selectedLanguage === 'EN' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                  <button
                    onClick={() => { setSelectedLanguage('HI'); setLangDropdownOpen(false); }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#24383F] flex items-center justify-between"
                  >
                    <span>हिन्दी (Hindi)</span>
                    {selectedLanguage === 'HI' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </button>
                </div>
              )}
            </div>

            <span className="text-slate-500">|</span>

            {/* Help */}
            <button
              onClick={() => openModal('faqs')}
              className="flex items-center gap-1.5 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-slate-300" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* User Session Status / Login Button */}
            {currentUser ? (
              <div className="flex items-center gap-2">
                <span className="text-slate-300 text-sm hidden sm:inline">
                  Officer: <strong className="text-white">{currentUser.name}</strong>
                </span>
                <button
                  onClick={logoutUser}
                  className="flex items-center gap-1.5 text-rose-300 hover:text-rose-100 transition-colors cursor-pointer text-sm font-bold ml-1"
                  title="Sign Out of Session"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentRole('login')}
                className="flex items-center gap-1.5 text-amber-400 font-bold hover:text-amber-300 transition-colors cursor-pointer ml-1 text-sm"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MAIN BRAND HEADER (Warm Ivory #FCFBF7 with Rural Landscape Backdrop)   */}
      {/* ========================================================================= */}
      <div className="w-full bg-[#FCFBF7] relative z-50 border-b border-slate-200/80 min-h-[96px] flex items-center">
        {/* Isolated background container with overflow-hidden so background never overflows */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute right-0 top-0 bottom-0 w-[55%] lg:w-[48%] xl:w-[42%] hidden md:block"
            style={{
              backgroundImage: 'url(/images/header-rural-faded.png)',
              backgroundPosition: 'right center',
              backgroundRepeat: 'no-repeat',
              backgroundSize: 'cover',
            }}
          />
        </div>

        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20 py-3 flex items-center justify-between gap-6 relative z-10">
          {/* Left: Official Emblem & Ministry Typography */}
          <div
            className="flex items-center gap-4 cursor-pointer shrink-0"
            onClick={() => setCurrentRole('home')}
          >
            <img
              src="/images/gov-logo-emblem.png"
              alt="Government of India Emblem"
              className="h-16 sm:h-20 w-auto object-contain shrink-0 drop-shadow-xs"
            />
            <div>
              <div className="text-[11px] font-serif font-bold text-slate-800 tracking-wider uppercase">
                भारत सरकार &nbsp;|&nbsp; GOVERNMENT OF INDIA
              </div>
              <div className="text-xl sm:text-2xl lg:text-[25px] font-extrabold font-sans text-[#15418C] tracking-tight leading-tight mt-0.5">
                LandPulse — <span className="text-[#1D4ED8]">National Land Acquisition Platform</span>
              </div>
              <div className="text-[11px] sm:text-xs font-semibold text-slate-600 leading-tight mt-0.5 hidden sm:block">
                भूमि संसाधन विभाग, ग्रामीण विकास मंत्रालय &nbsp;|&nbsp; Department of Land Resources, Ministry of Rural Development
              </div>
            </div>
          </div>

          {/* Center: Stylized Slogan matching reference exactly */}
          <div className="hidden xl:flex flex-col items-center justify-center text-center px-4 select-none">
            <div
              className="font-slogan-script text-[24px] lg:text-[26px] font-semibold text-[#3D5A50] tracking-wide flex items-center leading-none"
              style={{ fontFamily: "'Dancing Script', 'Satisfy', 'Caveat', cursive, sans-serif" }}
            >
              <span className="relative pb-0.5 inline-block">
                People
                <span className="absolute -bottom-1 left-0 right-0 h-[2.5px] bg-[#F98F08] rounded-xs"></span>
              </span>
              <span className="text-[#B0BEC5] font-sans font-normal text-sm mx-4 not-italic select-none">|</span>
              <span>Land</span>
              <span className="text-[#B0BEC5] font-sans font-normal text-sm mx-4 not-italic select-none">|</span>
              <span>Progress</span>
            </div>
            <div className="text-[13.5px] font-medium text-[#5B7078] tracking-normal mt-2 font-sans">
              For a Stronger Rural India
            </div>
          </div>

          {/* Right: Floating Persona User Pill Card OR Login Prompt */}
          <div className="flex items-center gap-4 relative z-50 shrink-0">
            {currentUser ? (
              <div className="relative z-50" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="bg-white/95 hover:bg-white border border-slate-200/90 rounded-xl px-4 py-2.5 shadow-xs transition-all flex items-center gap-3.5 cursor-pointer group backdrop-blur-xs"
                  title={`${currentUser.name} (${currentUser.roleTitle})`}
                >
                  {/* Forest Green Circle with Initial */}
                  <div className="w-10 h-10 rounded-full bg-[#1D3F2E] text-white font-bold flex items-center justify-center text-base shrink-0 shadow-xs">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div className="text-left hidden sm:block">
                    <div
                      className="text-sm font-extrabold text-slate-900 leading-tight truncate max-w-[210px]"
                      title={currentUser.name}
                    >
                      {currentUser.name}
                    </div>
                    <div
                      className="text-xs font-semibold text-slate-600 leading-tight truncate max-w-[210px]"
                      title={currentUser.roleTitle}
                    >
                      {currentUser.roleTitle}
                    </div>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 group-hover:text-slate-800 transition-transform duration-150 ${
                      userDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* Persona Switcher Dropdown */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 z-[100] p-3.5 space-y-3 font-sans animate-fadeIn">
                    <div className="border-b border-slate-200 pb-2.5">
                      <div className="text-sm font-extrabold text-[#1D3F2E]">
                        {currentUser.name}
                      </div>
                      <div className="text-xs text-slate-600 font-medium mt-0.5">
                        {currentUser.designation}
                      </div>
                      <div className="mt-2 text-xs bg-slate-50 px-2.5 py-1.5 rounded text-slate-600 font-mono flex items-center justify-between border border-slate-200">
                        <span>{currentUser.badgeLevel || 'Class 3 DSC'}</span>
                        <span className="text-emerald-700 font-bold">Active</span>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Switch Stakeholder Persona
                      </div>
                      {Object.entries(DEFAULT_PERSONAS).map(([key, persona]) => (
                        <button
                          key={key}
                          onClick={() => {
                            loginUser(persona, persona.role);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded text-sm flex items-center justify-between transition-colors cursor-pointer ${
                            currentUser.id === persona.id
                              ? 'bg-emerald-50 text-emerald-900 font-bold border-l-3 border-emerald-700'
                              : 'hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className="truncate max-w-[210px]" title={persona.roleTitle}>
                            {persona.roleTitle}
                          </span>
                          {currentUser.id === persona.id && <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />}
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-200 pt-2.5 flex items-center justify-between text-sm">
                      <button
                        onClick={() => {
                          setCurrentRole('login');
                          setUserDropdownOpen(false);
                        }}
                        className="font-bold text-[#15418C] hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <Lock className="w-3.5 h-3.5" /> Login Page
                      </button>
                      <button
                        onClick={() => {
                          logoutUser();
                          setUserDropdownOpen(false);
                        }}
                        className="font-bold text-red-600 hover:underline flex items-center gap-1.5 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setCurrentRole('login')}
                className="bg-[#1D3F2E] hover:bg-[#153022] text-white font-bold px-4 py-2.5 rounded-xl text-sm flex items-center gap-2 shadow-xs transition-all cursor-pointer hover:shadow-md"
              >
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Officer / Citizen Login</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. PILL NAVIGATION BAR (Pale Sage / Off-White #EEF2F5 with Rounded Tabs)   */}
      {/* ========================================================================= */}
      <nav className="w-full bg-[#F2F4EC] border-b border-[#D8DCD0] relative z-30 select-none">
        <div className="w-full max-w-[1920px] mx-auto px-6 sm:px-12 2xl:px-20 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          
          {/* Left: Pill Navigation Tabs */}
          <div className="hidden lg:flex items-center gap-2.5 flex-wrap" ref={navContainerRef}>
            {visibleNavGroups.map(group => {
              const active = isGroupActive(group);
              const isOpen = openDropdownId === group.id;
              const IconComponent = group.icon;
              const isHome = group.id === 'home';

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
                    className={`px-4 py-2 rounded-xl font-bold font-sans text-sm transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                      isHome
                        ? 'bg-[#1D3F2E] text-white shadow-xs relative'
                        : active
                        ? 'bg-[#1D3F2E] text-white shadow-xs'
                        : 'bg-[#EAEDE3] hover:bg-[#DEE2D6] text-[#1D3F2E]'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 shrink-0 ${isHome || active ? 'text-white' : 'text-[#1D3F2E]'}`} />
                    <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                    {group.items && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-200 ${
                          isHome || active ? 'text-white' : 'text-slate-600'
                        } ${isOpen ? 'rotate-180' : ''}`}
                      />
                    )}
                  </button>

                  {/* Home Active Orange Accent Bar right beneath pill */}
                  {isHome && currentRole === 'home' && (
                    <div className="absolute -bottom-1 left-2.5 right-2.5 h-[3px] bg-[#E88E2E] rounded-full" />
                  )}

                  {/* Dropdown Menu */}
                  {group.items && isOpen && (
                    <div
                      role="menu"
                      className="absolute top-full left-0 mt-1.5 w-76 bg-white text-slate-800 rounded-xl shadow-xl border border-slate-200 py-2 z-[100] animate-fadeIn"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 bg-slate-50/80 text-xs font-bold text-[#1D3F2E] uppercase tracking-wider flex items-center justify-between rounded-t-xl">
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
                              className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between cursor-pointer ${
                                isSubActive
                                  ? 'bg-emerald-50 text-[#1D3F2E] font-bold border-l-4 border-emerald-700'
                                  : 'text-slate-700 hover:text-[#1D3F2E] hover:bg-slate-50 font-medium'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span>{selectedLanguage === 'EN' ? subItem.label : subItem.hindi}</span>
                                {subItem.badge && (
                                  <span className="px-1.5 py-0.2 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200 uppercase">
                                    {subItem.badge}
                                  </span>
                                )}
                              </div>
                              {isSubActive && <CheckCircle className="w-4 h-4 text-emerald-700" />}
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

          {/* Mobile Menu Hamburger */}
          <div className="flex lg:hidden items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3.5 py-2 rounded-xl bg-[#1D3F2E] text-white text-sm font-bold flex items-center gap-2 cursor-pointer shadow-xs"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              <span>Menu</span>
            </button>
          </div>

          {/* Right Action Widgets: Search Pill, Bell with '4' badge, + New Project Button */}
          <div className="flex items-center gap-2.5 ml-auto shrink-0">
            {/* White Pill Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="bg-white border border-slate-300/80 shadow-xs rounded-full px-4 py-2 flex items-center gap-2 text-sm transition-all focus-within:ring-2 focus-within:ring-emerald-600/30 focus-within:border-emerald-600">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="text-slate-800 placeholder-slate-400 bg-transparent outline-none w-32 sm:w-44 lg:w-56 text-sm font-normal"
                />
                <button
                  type="submit"
                  className="p-0.5 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Search"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>

            {/* Notification Bell with Badge '4' */}
            <button
              onClick={() => openModal('notificationSearch')}
              className="w-9 h-9 rounded-full bg-[#EAEDE3] hover:bg-[#DEE2D6] flex items-center justify-center relative text-slate-700 transition-colors cursor-pointer shrink-0"
              title="Notifications"
            >
              <Bell className="w-5 h-5 text-slate-700" />
              <span className="w-4.5 h-4.5 rounded-full bg-[#F31B1A] text-white text-[10px] font-bold flex items-center justify-center absolute -top-1 -right-1 shadow-xs font-mono">
                4
              </span>
            </button>

            {/* + New Project Golden Button — only for Project Admin */}
            {currentUser?.role === 'project_admin' && (
              <button
                onClick={() => setCurrentRole('project_admin')}
                className="bg-[#FFC026] hover:bg-[#F5B020] text-slate-950 font-bold px-4.5 py-2 rounded-xl text-sm flex items-center gap-2 shadow-xs transition-all hover:scale-102 cursor-pointer shrink-0"
                title="Create New Project"
              >
                <span>+ New Project</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Accordion Drawer Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200 px-4 py-3 space-y-2.5 animate-fadeIn max-h-[80vh] overflow-y-auto shadow-lg">
            {visibleNavGroups.map(group => {
              const IconComponent = group.icon;
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
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-sm font-bold flex items-center justify-between cursor-pointer ${
                      active ? 'bg-[#1D3F2E] text-white' : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <IconComponent className="w-5 h-5" />
                      <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                    </span>
                    {active && <CheckCircle className="w-4 h-4 text-white" />}
                  </button>
                );
              }

              return (
                <div key={group.id} className="border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                  <div className="px-3.5 py-2.5 text-sm font-bold text-[#1D3F2E] bg-slate-100/80 flex items-center gap-2.5">
                    <IconComponent className="w-5 h-5" />
                    <span>{selectedLanguage === 'EN' ? group.label : group.hindi}</span>
                  </div>
                  {group.items && (
                    <div className="py-1 px-2 space-y-1">
                      {group.items.map(subItem => {
                        const isSubActive = subItem.roleId && currentRole === subItem.roleId;
                        return (
                          <button
                            key={subItem.id}
                            type="button"
                            onClick={() => handleSelectSubItem(subItem)}
                            className={`w-full text-left px-3.5 py-2 rounded-lg text-sm font-medium flex items-center justify-between transition-colors cursor-pointer ${
                              isSubActive
                                ? 'bg-emerald-50 text-emerald-900 font-bold border-l-3 border-emerald-700'
                                : 'text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            <span>{selectedLanguage === 'EN' ? subItem.label : subItem.hindi}</span>
                            {isSubActive && <CheckCircle className="w-4 h-4 text-emerald-700" />}
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
