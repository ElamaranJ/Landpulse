import React, { createContext, useContext, useState } from 'react';
import { RoleType, Project, AuthUser } from '../types';
import { MOCK_PROJECTS } from '../data/mockData';

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

interface RoleContextType {
  currentRole: RoleType;
  setCurrentRole: (role: RoleType) => void;
  selectedState: string | null;
  setSelectedState: (stateId: string | null) => void;
  selectedProject: Project | null;
  setSelectedProject: (project: Project | null) => void;
  commandPaletteOpen: boolean;
  setCommandPaletteOpen: (open: boolean) => void;
  exportModalOpen: boolean;
  setExportModalOpen: (open: boolean) => void;
  unreadAlertsCount: number;
  setUnreadAlertsCount: React.Dispatch<React.SetStateAction<number>>;
  notificationsOpen: boolean;
  setNotificationsOpen: (open: boolean) => void;
  currentUser: AuthUser | null;
  loginUser: (user: AuthUser, redirectRole?: RoleType) => void;
  logoutUser: () => void;
  
  // Interactive Modals
  calcModalOpen: boolean;
  setCalcModalOpen: (open: boolean) => void;
  caseTrackerOpen: boolean;
  setCaseTrackerOpen: (open: boolean) => void;
  grievanceModalOpen: boolean;
  setGrievanceModalOpen: (open: boolean) => void;
  notificationSearchOpen: boolean;
  setNotificationSearchOpen: (open: boolean) => void;
  dgpsViewerOpen: boolean;
  setDgpsViewerOpen: (open: boolean) => void;
  digitalAwardOpen: boolean;
  setDigitalAwardOpen: (open: boolean) => void;
  bulkUploadOpen: boolean;
  setBulkUploadOpen: (open: boolean) => void;
  openDataOpen: boolean;
  setOpenDataOpen: (open: boolean) => void;
  siteMapOpen: boolean;
  setSiteMapOpen: (open: boolean) => void;
  privacyPolicyOpen: boolean;
  setPrivacyPolicyOpen: (open: boolean) => void;
  
  // Language
  selectedLanguage: 'EN' | 'HI' | 'MR' | 'TA' | 'GU' | 'TE' | 'BN';
  setSelectedLanguage: (lang: 'EN' | 'HI' | 'MR' | 'TA' | 'GU' | 'TE' | 'BN') => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<RoleType>('command_center');
  const [selectedState, setSelectedState] = useState<string | null>('ST-MH');
  const [selectedProject, setSelectedProject] = useState<Project | null>(MOCK_PROJECTS[0]);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [unreadAlertsCount, setUnreadAlertsCount] = useState(4);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(DEFAULT_PERSONAS.command_center);

  // New Modals State
  const [calcModalOpen, setCalcModalOpen] = useState(false);
  const [caseTrackerOpen, setCaseTrackerOpen] = useState(false);
  const [grievanceModalOpen, setGrievanceModalOpen] = useState(false);
  const [notificationSearchOpen, setNotificationSearchOpen] = useState(false);
  const [dgpsViewerOpen, setDgpsViewerOpen] = useState(false);
  const [digitalAwardOpen, setDigitalAwardOpen] = useState(false);
  const [bulkUploadOpen, setBulkUploadOpen] = useState(false);
  const [openDataOpen, setOpenDataOpen] = useState(false);
  const [siteMapOpen, setSiteMapOpen] = useState(false);
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false);

  // Language
  const [selectedLanguage, setSelectedLanguage] = useState<'EN' | 'HI' | 'MR' | 'TA' | 'GU' | 'TE' | 'BN'>('EN');

  const loginUser = (user: AuthUser, redirectRole?: RoleType) => {
    setCurrentUser(user);
    if (redirectRole) {
      setCurrentRole(redirectRole);
    } else if (user.role) {
      setCurrentRole(user.role);
    }
  };

  const logoutUser = () => {
    setCurrentUser(null);
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
        commandPaletteOpen,
        setCommandPaletteOpen,
        exportModalOpen,
        setExportModalOpen,
        unreadAlertsCount,
        setUnreadAlertsCount,
        notificationsOpen,
        setNotificationsOpen,
        currentUser,
        loginUser,
        logoutUser,
        calcModalOpen,
        setCalcModalOpen,
        caseTrackerOpen,
        setCaseTrackerOpen,
        grievanceModalOpen,
        setGrievanceModalOpen,
        notificationSearchOpen,
        setNotificationSearchOpen,
        dgpsViewerOpen,
        setDgpsViewerOpen,
        digitalAwardOpen,
        setDigitalAwardOpen,
        bulkUploadOpen,
        setBulkUploadOpen,
        openDataOpen,
        setOpenDataOpen,
        siteMapOpen,
        setSiteMapOpen,
        privacyPolicyOpen,
        setPrivacyPolicyOpen,
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
