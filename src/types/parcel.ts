export type ParcelStatus = 'completed' | 'in_progress' | 'dispute' | 'not_started';
export type InspectionPriority = 'high' | 'medium' | 'low';

export interface ParcelInspection {
  required: boolean;
  reason?: string;
  priority: InspectionPriority;
  lastInspectedOn: string | null;
  assignedOfficer: string | null;
  dueDate: string;
  notes?: string;
  photoUrl?: string;
}

export interface Parcel {
  id: string;
  surveyNo: string;
  owner: string;
  area: string;
  project: string;
  district: string;
  status: ParcelStatus;
  coordinates: [number, number][]; // polygon points [lat, lng]
  centroid: [number, number]; // [lat, lng]
  inspection: ParcelInspection;
}

export interface InspectionCompletionPayload {
  notes: string;
  date: string;
  newStatus: ParcelStatus;
  photoUrl?: string;
}

export interface InspectionFilterOptions {
  district?: string;
  project?: string;
  priority?: string;
  status?: string;
  searchQuery?: string;
  maxDistanceKm?: number;
}
