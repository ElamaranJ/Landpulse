import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RoleType, Project, AuthUser, CriticalAlert } from '../types';
import { MOCK_PROJECTS, MOCK_CRITICAL_ALERTS } from '../data/mockData';

export const DEFAULT_PERSONAS: Record<string, AuthUser> = {
  command_center: {
    id: 'USR-CMD-001',
    name: 'Shri Arun K. Mehta, IAS',
    designation: 'Joint Secretary (Land Resources & GatiShakti)',
    department: 'Department of Land Resources, MoRD',
    role: 'command_center',
    roleTitle: 'National Command Center Director',
    email: 'arun.mehta@nic.in',
    employeeId: 'NIC-GOI-88492',
    badgeLevel: 'Level 14 Apex Security',
    tokenType: 'PARICHAY_SSO',
    loginTime: '28 Aug 2026, 08:30 AM',
  },
  citizen: {
    id: 'USR-CTZ-089',
    name: 'Ramesh Narayan Patel',
    designation: 'Registered Landowner & Award Beneficiary',
    department: 'Survey No. 142/3A, Palghar Taluk',
    role: 'citizen',
    roleTitle: 'Citizen Landowner (Beneficiary)',
    phone: '+91 98201 44521',
    aadhaarMasked: 'XXXX-XXXX-8921',
    badgeLevel: 'Aadhaar e-KYC Verified',
    tokenType: 'AADHAAR_OTP',
    loginTime: '28 Aug 2026, 08:32 AM',
  },
  field_officer: {
    id: 'USR-FLD-014',
    name: 'S. Murugan',
    designation: 'Senior Revenue Inspector & DGPS Cadastral Surveyor',
    department: 'District Survey Office, Field Division 4',
    role: 'field_officer',
    roleTitle: 'Field Cadastral Officer (DGPS/RTK)',
    email: 's.murugan.surv@nic.in',
    employeeId: 'SRV-MH-2041',
    badgeLevel: 'NavIC RTK Certified',
    tokenType: 'DSC_SMARTCARD',
    loginTime: '28 Aug 2026, 08:15 AM',
  },
  district_officer: {
    id: 'USR-DIST-007',
    name: 'Dr. Rajeshwar Verma, IAS',
    designation: 'Special Land Acquisition Officer (SLAO) & CALA',
    department: 'District Collectorate, Palghar, Maharashtra',
    role: 'district_officer',
    roleTitle: 'District CALA & Disbursal Officer',
    email: 'cala.palghar@gov.in',
    employeeId: 'IAS-MH-1998',
    badgeLevel: 'Class 3 DSC Authorized',
    tokenType: 'DSC_SMARTCARD',
    loginTime: '28 Aug 2026, 08:20 AM',
  },
  intelligence_layer: {
    id: 'USR-INTEL-003',
    name: 'Dr. Meera Nambiar',
    designation: 'Chief Risk & Predictive Modeling Officer',
    department: 'PM GatiShakti National Analytics Cell',
    role: 'intelligence_layer',
    roleTitle: 'Risk Engine & Spatial Lead',
    email: 'meera.nambiar@niti.gov.in',
    employeeId: 'ANL-GS-9902',
    badgeLevel: 'National GIS Spatial Clearance',
    tokenType: 'PARICHAY_SSO',
    loginTime: '28 Aug 2026, 08:25 AM',
  },
};

export const ROLE_TO_PATH: Record<RoleType, string> = {
  home: '/',
  login: '/login',
  command_center: '/command-center',
  citizen: '/citizen',
  field_officer: '/field-officer',
  officer_inspections: '/officer/inspections',
  district_officer: '/district-officer',
  intelligence_layer: '/intelligence',
  acts: '/acts',
  rti: '/rti',
  whoswho: '/whoswho',
};

export const PATH_TO_ROLE: Record<string, RoleType> = {
  '/': 'home',
  '/login': 'login',
  '/command-center': 'command_center',
  '/citizen': 'citizen',
  '/field-officer': 'field_officer',
  '/officer/inspections': 'officer_inspections',
  '/field-officer/inspections': 'officer_inspections',
  '/district-officer': 'district_officer',
  '/intelligence': 'intelligence_layer',
  '/acts': 'acts',
  '/rti': 'rti',
  '/whoswho': 'whoswho',
};


const USER_STORAGE_KEY = 'landpulse_current_user';
const ROLE_STORAGE_KEY = 'landpulse_current_role';
const LANG_STORAGE_KEY = 'landpulse_selected_language';
const ALERTS_STORAGE_KEY = 'landpulse_alerts';

const getInitialUser = (): AuthUser | null => {
  try {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
        return parsed as AuthUser;
      }
    }
  } catch (err) {
    console.warn('Failed to load user from localStorage:', err);
  }
  return DEFAULT_PERSONAS.command_center;
};

const getInitialRole = (): RoleType => {
  try {
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved && Object.prototype.hasOwnProperty.call(ROLE_TO_PATH, saved)) {
      return saved as RoleType;
    }
  } catch (err) {
    console.warn('Failed to load role from localStorage:', err);
  }
  return 'command_center';
};

const getInitialLanguage = (): string => {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved) {
      return saved;
    }
  } catch (err) {
    console.warn('Failed to load language from localStorage:', err);
  }
  return 'EN';
};

const getInitialAlerts = (): CriticalAlert[] => {
  try {
    const saved = localStorage.getItem(ALERTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed as CriticalAlert[];
      }
    }
  } catch (err) {
    console.warn('Failed to load alerts from localStorage:', err);
  }
  return MOCK_CRITICAL_ALERTS.map((a) => ({ ...a, isRead: false }));
};

export interface RoleContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  selectedState: string | null;
  setSelectedState: (stateId: string | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  currentUser: AuthUser | null;
  loginUser: (user: AuthUser, redirectRole?: RoleType) => void;
  logoutUser: () => void;
  alerts: CriticalAlert[];
  unreadAlertsCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const currentRole = PATH_TO_ROLE[location.pathname] || getInitialRole();
  const [selectedState, setSelectedState] = useState<string | null>('ST-MH');
  const [selectedProject, setSelectedProject] = useState<Project | null>(MOCK_PROJECTS[0]);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getInitialUser);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(getInitialLanguage);
  const [alerts, setAlerts] = useState<CriticalAlert[]>(getInitialAlerts);

  // Derive unread alerts count dynamically from the shared alert list
  const unreadAlertsCount = useMemo(() => {
    return alerts.filter((a) => !a.isRead).length;
  }, [alerts]);

  const markAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) => (alert.id === id ? { ...alert, isRead: true } : alert))
    );
  };

  const markAllAsRead = () => {
    setAlerts((prev) => prev.map((alert) => ({ ...alert, isRead: true })));
  };

  // Persist alerts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ALERTS_STORAGE_KEY, JSON.stringify(alerts));
    } catch (err) {
      console.warn('Failed to save alerts to localStorage:', err);
    }
  }, [alerts]);

  // Persist user changes to localStorage
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(USER_STORAGE_KEY);
      }
    } catch (err) {
      console.warn('Failed to save user to localStorage:', err);
    }
  }, [currentUser]);

  // Persist role changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, currentRole);
    } catch (err) {
      console.warn('Failed to save role to localStorage:', err);
    }
  }, [currentRole]);

  // Persist language changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LANG_STORAGE_KEY, selectedLanguage);
    } catch (err) {
      console.warn('Failed to save language to localStorage:', err);
    }
  }, [selectedLanguage]);

  const setCurrentRole = (role: RoleType) => {
    const targetPath = ROLE_TO_PATH[role] || '/';
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch (err) {
      console.warn('Failed to save role to localStorage:', err);
    }
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  const loginUser = (user: AuthUser, redirectRole?: RoleType) => {
    setCurrentUser(user);
    const targetRole = redirectRole || user.role || 'command_center';
    setCurrentRole(targetRole);
  };

  const logoutUser = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to remove user from localStorage:', err);
    }
    setCurrentRole('login');
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        selectedState,
        setSelectedState,
        selectedProject,
        setSelectedProject,
        currentUser,
        loginUser,
        logoutUser,
        alerts,
        unreadAlertsCount,
        markAsRead,
        markAllAsRead,
        selectedLanguage,
        setSelectedLanguage,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) throw new Error('useRole must be used within RoleProvider');
  return context;
};
