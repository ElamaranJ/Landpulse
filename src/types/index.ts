export type RoleType = 
  | 'home'
  | 'login'
  | 'command_center' 
  | 'citizen' 
  | 'field_officer' 
  | 'officer_inspections'
  | 'district_officer' 
  | 'intelligence_layer'
  | 'acts'
  | 'rti'
  | 'whoswho';


export interface AuthUser {
  id: string;
  name: string;
  designation: string;
  department: string;
  role: RoleType;
  roleTitle: string;
  email?: string;
  phone?: string;
  aadhaarMasked?: string;
  employeeId?: string;
  badgeLevel?: string;
  avatar?: string;
  tokenType?: 'PARICHAY_SSO' | 'AADHAAR_OTP' | 'DSC_SMARTCARD' | 'DEMO';
  loginTime: string;
}

export type ProjectStatus = 'on_track' | 'in_progress' | 'delayed' | 'critical' | 'completed';

export interface Project {
  id: string;
  code: string;
  name: string;
  corridor: string;
  ministry: string;
  category: 'Highways' | 'Railways' | 'Energy' | 'Water' | 'Industrial' | 'Aviation';
  state: string;
  districts: string[];
  totalAcres: number;
  acquiredAcres: number;
  targetYear: string;
  budgetCr: number;
  disbursedCr: number;
  affectedFamilies: number;
  rehabilitatedFamilies: number;
  status: ProjectStatus;
  riskScore: number;
  riskFactors: string[];
  bottlenecks: string[];
}

export interface StateData {
  id: string;
  name: string;
  shortCode: string;
  projectsCount: number;
  acquiredPercent: number;
  disbursedCr: number;
  familiesCount: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  coordinates: { x: number; y: number };
  topProject: string;
}

export type StageStatusCode = 'completed' | 'current' | 'pending' | 'delayed';

export interface StageMilestone {
  step: number;
  name: string;
  description: string;
  status: StageStatusCode;
  completedDate?: string;
  authorizedBy?: string;
  gazetteRef?: string;
  amount?: string;
  notes?: string;
}

export interface CaseDocument {
  id: string;
  title: string;
  type: 'Gazette' | 'Survey' | 'Valuation' | 'Consent' | 'Award' | 'Bank Transfer';
  size: string;
  uploadDate: string;
  version: string;
  verified: boolean;
  sealNumber: string;
}

export interface CaseObjection {
  id: string;
  date: string;
  subject: string;
  status: 'Under Review' | 'Hearing Scheduled' | 'Resolved' | 'Dismissed';
  hearingDate?: string;
  officerRemarks?: string;
}

export interface CitizenCase {
  caseId?: string;
  id?: string;
  surveyNumber?: string;
  surveyNo?: string;
  khataNumber?: string;
  landownerName?: string;
  owner?: string;
  aadhaarMasked?: string;
  village?: string;
  taluk?: string;
  district?: string;
  state?: string;
  landAreaAcre?: number;
  area?: string;
  landType?: 'Agricultural' | 'Commercial' | 'Residential' | 'Wetland' | string;
  category?: string;
  projectName?: string;
  projectCode?: string;
  currentStageIndex?: number;
  stage?: string;
  status?: string;
  estimatedValuationCr?: number;
  awardedCompensationCr?: number;
  disbursedCompensationCr?: number;
  amountCr?: string;
  actionRequired?: string;
  priority?: string;
  stages?: StageMilestone[];
  documents?: CaseDocument[];
  objections?: CaseObjection[];
}

export interface PhotoEvidence {
  id: string;
  url: string;
  timestamp: string;
  coordinates: string;
  category: 'Boundary' | 'Crops' | 'Structure' | 'Neighboring';
  notes: string;
}

export interface FieldParcel {
  id: string;
  surveyNumber: string;
  village: string;
  district: string;
  ownerName: string;
  phone: string;
  areaAcre: number;
  category: string;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  verificationStatus: 'PENDING_SURVEY' | 'GPS_CAPTURED' | 'OBJECTION_FLAGGED' | 'VERIFIED';
  assignedDate: string;
  dueHours: number;
  gpsCoords?: { lat: number; lng: number; accuracyMeters: number };
  boundaryPointsCount: number;
  photos: PhotoEvidence[];
  fieldOfficerNotes?: string;
}

export interface DistrictKPIs {
  totalParcels: number;
  verifiedParcels: number;
  pendingObjections: number;
  delayedCases: number;
  totalCompensationCr: number;
  disbursedCompensationCr: number;
}

export interface CriticalAlert {
  id: string;
  code: string;
  severity: 'CRITICAL' | 'HIGH' | 'WARNING';
  project: string;
  state: string;
  district: string;
  message: string;
  delayDays: number;
  impactValuationCr: number;
  suggestedAction: string;
  timestamp: string;
  isRead?: boolean;
}

export interface RiskEngineItem {
  id: string;
  projectId: string;
  projectName: string;
  state: string;
  compositeRisk: number;
  factors: {
    litigationRisk: number;
    forestClearanceRisk: number;
    budgetOverrunRisk: number;
    rehabilitationLag: number;
  };
  predictedDelayMonths: number;
  financialImpactCr: number;
  recommendedIntervention: string;
  actionStatus: 'PENDING' | 'INTERVENED' | 'ESCALATED';
}

export * from './parcel';

