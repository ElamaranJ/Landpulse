import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RoleType, Project, AuthUser, CriticalAlert } from '../types';
import { Parcel } from '../types/parcel';
import { MOCK_PROJECTS, MOCK_CRITICAL_ALERTS } from '../data/mockData';
import { addParcels } from '../services/api';
import { auth, db, signOutFirebase } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { subscribeProjects } from '../services/firestoreService';

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
  project_admin: {
    id: 'USR-ADM-001',
    name: 'Suresh Iyer, IES',
    designation: 'Implementing Agency Nodal Officer',
    department: 'National Highways Authority of India (NHAI)',
    role: 'project_admin',
    roleTitle: 'Project Implementing Agency Admin',
    email: 'suresh.iyer@nhai.gov.in',
    employeeId: 'NHAI-2019-0472',
    badgeLevel: 'Class 3 DSC Authorized',
    tokenType: 'DSC_SMARTCARD',
    loginTime: '28 Aug 2026, 08:35 AM',
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
  project_admin: '/project-admin',
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
  '/project-admin': 'project_admin',
  '/intelligence': 'intelligence_layer',
  '/acts': 'acts',
  '/rti': 'rti',
  '/whoswho': 'whoswho',
};


const USER_STORAGE_KEY = 'landpulse_current_user';
const ROLE_STORAGE_KEY = 'landpulse_current_role';
export const TOKEN_STORAGE_KEY = 'landpulse_auth_token';
const LANG_STORAGE_KEY = 'landpulse_selected_language';
const ALERTS_STORAGE_KEY = 'landpulse_alerts';
const PROJECTS_STORAGE_KEY = 'landpulse_projects';

const getInitialProjects = (): Project[] => {
  try {
    const saved = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Sync into MOCK_PROJECTS in-memory reference
        parsed.forEach((p: Project) => {
          if (!MOCK_PROJECTS.some(mp => mp.id === p.id)) {
            MOCK_PROJECTS.unshift(p);
          }
        });
        return parsed as Project[];
      }
    }
  } catch (err) {
    console.warn('Failed to load projects from localStorage:', err);
  }
  return MOCK_PROJECTS;
};

const getInitialUser = (): AuthUser | null => {
  try {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (!token) {
      // Unauthenticated visitor: do not trust unauthenticated session
      return null;
    }

    // Decode and verify JWT token payload
    const parts = token.split('.');
    if (parts.length === 3) {
      const payload = JSON.parse(atob(parts[1]));
      if (payload.exp && Date.now() >= payload.exp * 1000) {
        // Token has expired
        localStorage.removeItem(TOKEN_STORAGE_KEY);
        localStorage.removeItem(USER_STORAGE_KEY);
        return null;
      }

      // Check saved user object
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === 'object' && parsed.id && parsed.name) {
          return parsed as AuthUser;
        }
      }

      // If saved user was missing, recover from known personas
      const persona = Object.values(DEFAULT_PERSONAS).find(
        (p) => p.id === payload.id || p.role === payload.role
      );
      if (persona) return persona;
    }
  } catch (err) {
    console.warn('Failed to validate auth token from localStorage:', err);
  }
  return null;
};

const getInitialRole = (): RoleType => {
  try {
    const savedUser = localStorage.getItem(USER_STORAGE_KEY);
    if (!savedUser) {
      return 'home';
    }
    const saved = localStorage.getItem(ROLE_STORAGE_KEY);
    if (saved && (saved in ROLE_TO_PATH)) {
      return saved as RoleType;
    }
  } catch (err) {
    console.warn('Failed to load role from localStorage:', err);
  }
  return 'home';
};

const getInitialLanguage = (): string => {
  try {
    const saved = localStorage.getItem(LANG_STORAGE_KEY);
    if (saved) return saved;
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
  isAuthenticated: boolean;
  selectedState: string | null;
  setSelectedState: (stateId: string | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  projects: Project[];
  addProject: (project: Project, newParcels?: Parcel[]) => void;
  currentUser: AuthUser | null;
  loginUser: (user: AuthUser, redirectRole?: RoleType, token?: string) => void;
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

  const [currentUser, setCurrentUser] = useState<AuthUser | null>(getInitialUser);
  const [currentRole, setCurrentRoleState] = useState<RoleType>(() => {
    const user = getInitialUser();
    if (user?.role) return user.role;
    return getInitialRole();
  });
  const isAuthenticated = currentUser !== null;

  const [selectedState, setSelectedState] = useState<string | null>('ST-MH');
  const [projects, setProjects] = useState<Project[]>(getInitialProjects);
  const [selectedProject, setSelectedProject] = useState<Project | null>(() => projects[0] || MOCK_PROJECTS[0]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(getInitialLanguage);
  const [alerts, setAlerts] = useState<CriticalAlert[]>(getInitialAlerts);

  // Sync currentRole with route if user is navigating among allowed/public paths
  useEffect(() => {
    const routeRole = PATH_TO_ROLE[location.pathname];
    if (routeRole) {
      const publicRoles: RoleType[] = ['home', 'login', 'acts', 'rti', 'whoswho'];
      if (publicRoles.includes(routeRole)) {
        setCurrentRoleState(routeRole);
      } else if (currentUser && (currentUser.role === routeRole || (currentUser.role === 'field_officer' && routeRole === 'officer_inspections'))) {
        setCurrentRoleState(routeRole);
      }
    }
  }, [location.pathname, currentUser]);

  const addProject = (newProject: Project, newParcels?: Parcel[]) => {
    setProjects((prev) => {
      const updated = [newProject, ...prev.filter(p => p.id !== newProject.id)];
      try {
        localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(updated));
      } catch (err) {
        console.warn('Failed to save projects to localStorage:', err);
      }
      return updated;
    });

    // Also update in-memory MOCK_PROJECTS reference
    if (!MOCK_PROJECTS.some(p => p.id === newProject.id)) {
      MOCK_PROJECTS.unshift(newProject);
    }

    // Register any parsed alignment parcels
    if (newParcels && newParcels.length > 0) {
      addParcels(newParcels);
    }

    setSelectedProject(newProject);
  };

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

  // Listen to live Firestore projects
  useEffect(() => {
    const unsub = subscribeProjects((liveProjects) => {
      if (liveProjects && liveProjects.length > 0) {
        setProjects(liveProjects);
      }
    });
    return () => unsub();
  }, []);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        if (db) {
          try {
            const userDoc = await getDoc(doc(db, 'users', fbUser.uid));
            if (userDoc.exists()) {
              const profile = userDoc.data() as AuthUser;
              setCurrentUser(profile);
              setCurrentRoleState(profile.role);
              return;
            }
          } catch (e) {
            console.warn('[RoleContext] Firestore user fetch error:', e);
          }
        }
        // Fallback by email
        const userEmail = (fbUser.email || '').toLowerCase();
        const matched = Object.values(DEFAULT_PERSONAS).find(
          (p) => p.email?.toLowerCase() === userEmail
        );
        if (matched) {
          setCurrentUser(matched);
          setCurrentRoleState(matched.role);
        } else {
          const citizenUser: AuthUser = {
            id: fbUser.uid,
            name: fbUser.displayName || 'Registered Citizen Beneficiary',
            role: 'citizen',
            roleTitle: 'Citizen Landowner (Beneficiary)',
            phone: fbUser.phoneNumber || undefined,
            email: fbUser.email || undefined,
            department: 'Revenue & Land Records',
            designation: 'Landowner Beneficiary',
            badgeLevel: 'Aadhaar / Phone e-KYC Verified',
            tokenType: 'AADHAAR_OTP',
            loginTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          };
          setCurrentUser(citizenUser);
          setCurrentRoleState('citizen');
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Verify stored JWT session against /api/auth/me on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            logoutUser();
          }
        })
        .catch((err) => {
          console.warn('Background JWT verification skipped:', err);
        });
    }
  }, []);

  const setCurrentRole = (role: RoleType) => {
    const targetPath = ROLE_TO_PATH[role] || '/';
    setCurrentRoleState(role);
    try {
      if (currentUser) {
        localStorage.setItem(ROLE_STORAGE_KEY, role);
      }
    } catch (err) {
      console.warn('Failed to save role to localStorage:', err);
    }
    if (location.pathname !== targetPath) {
      navigate(targetPath);
    }
  };

  const loginUser = (user: AuthUser, redirectRole?: RoleType, token?: string) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
      if (token) {
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
      }
    } catch (err) {
      console.warn('Failed to save user to localStorage:', err);
    }
    const targetRole = redirectRole || user.role || 'command_center';
    setCurrentRole(targetRole);
  };

  const logoutUser = () => {
    signOutFirebase();
    setCurrentUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
      localStorage.removeItem(ROLE_STORAGE_KEY);
      localStorage.removeItem(TOKEN_STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to remove user from localStorage:', err);
    }
    setCurrentRoleState('home');
    navigate('/login');
  };

  return (
    <RoleContext.Provider
      value={{
        currentRole,
        setCurrentRole,
        isAuthenticated,
        selectedState,
        setSelectedState,
        selectedProject,
        setSelectedProject,
        projects,
        addProject,
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
