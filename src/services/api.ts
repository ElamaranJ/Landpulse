import { Parcel, ParcelStatus, InspectionCompletionPayload } from '../types/parcel';
import { MOCK_PARCELS } from '../data/parcelsData';

// Local cache for in-browser state persistence across views
let localParcelsCache: Parcel[] = (() => {
  if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('landpulse_parcels_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // ignore
      }
    }
  }
  return JSON.parse(JSON.stringify(MOCK_PARCELS));
})();

const persistLocalCache = (parcels: Parcel[]) => {
  localParcelsCache = parcels;
  try {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('landpulse_parcels_data', JSON.stringify(parcels));
    }
  } catch {
    // ignore
  }
};

/**
 * Fetch all parcels with optional filters
 */
export async function fetchParcels(params?: {
  status?: string;
  project?: string;
  district?: string;
  search?: string;
}): Promise<Parcel[]> {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append('status', params.status);
    if (params?.project) query.append('project', params.project);
    if (params?.district) query.append('district', params.district);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/parcels?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        persistLocalCache(data.data);
        return data.data;
      }
    }
  } catch {
    // Backend offline fallback
  }

  // Fallback to local store
  let filtered = [...localParcelsCache];
  if (params?.status && params.status !== 'all') {
    filtered = filtered.filter(p => p.status === params.status);
  }
  if (params?.district && params.district !== 'all') {
    filtered = filtered.filter(p => p.district.toLowerCase() === params.district?.toLowerCase());
  }
  if (params?.project && params.project !== 'all') {
    filtered = filtered.filter(p => p.project.toLowerCase().includes(params.project?.toLowerCase() || ''));
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      p =>
        p.surveyNo.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }
  return filtered;
}

/**
 * Fetch single parcel details
 */
export async function fetchParcelById(id: string): Promise<Parcel | null> {
  try {
    const res = await fetch(`/api/parcels/${id}`);
    if (res.ok) {
      const data = await res.json();
      return data.data || null;
    }
  } catch {
    // fallback
  }
  return localParcelsCache.find(p => p.id === id || p.surveyNo === id) || null;
}

/**
 * Fetch pending inspections queue, sorted by priority (high -> medium -> low)
 */
export async function fetchPendingInspections(params?: {
  district?: string;
  project?: string;
  priority?: string;
  search?: string;
}): Promise<Parcel[]> {
  try {
    const query = new URLSearchParams();
    if (params?.district && params.district !== 'all') query.append('district', params.district);
    if (params?.project && params.project !== 'all') query.append('project', params.project);
    if (params?.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params?.search) query.append('search', params.search);

    const res = await fetch(`/api/inspections/pending?${query.toString()}`);
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        return data.data;
      }
    }
  } catch {
    // fallback
  }

  let pending = localParcelsCache.filter(p => p.inspection?.required);

  if (params?.district && params.district !== 'all') {
    pending = pending.filter(p => p.district.toLowerCase() === params.district?.toLowerCase());
  }
  if (params?.project && params.project !== 'all') {
    pending = pending.filter(p => p.project.toLowerCase().includes(params.project?.toLowerCase() || ''));
  }
  if (params?.priority && params.priority !== 'all') {
    pending = pending.filter(p => p.inspection.priority === params.priority);
  }
  if (params?.search) {
    const q = params.search.toLowerCase();
    pending = pending.filter(
      p =>
        p.surveyNo.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  const PRIORITY_ORDER: Record<string, number> = { high: 3, medium: 2, low: 1 };
  pending.sort((a, b) => {
    const pA = PRIORITY_ORDER[a.inspection.priority] || 0;
    const pB = PRIORITY_ORDER[b.inspection.priority] || 0;
    if (pB !== pA) return pB - pA;
    return new Date(a.inspection.dueDate).getTime() - new Date(b.inspection.dueDate).getTime();
  });

  return pending;
}

/**
 * Complete inspection
 */
export async function completeInspection(
  parcelId: string,
  payload: InspectionCompletionPayload
): Promise<Parcel> {
  try {
    const res = await fetch(`/api/inspections/${parcelId}/complete`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      const data = await res.json();
      if (data.data) {
        const updatedList = localParcelsCache.map(p => (p.id === parcelId ? data.data : p));
        persistLocalCache(updatedList);
        return data.data;
      }
    }
  } catch {
    // fallback
  }

  // Update in local cache
  const index = localParcelsCache.findIndex(p => p.id === parcelId || p.surveyNo === parcelId);
  if (index === -1) {
    throw new Error(`Parcel not found: ${parcelId}`);
  }

  const updated: Parcel = {
    ...localParcelsCache[index],
    status: (payload.newStatus as ParcelStatus) || localParcelsCache[index].status,
    inspection: {
      ...localParcelsCache[index].inspection,
      required: false,
      lastInspectedOn: payload.date || new Date().toISOString().split('T')[0],
      notes: payload.notes,
      photoUrl: payload.photoUrl
    }
  };

  const updatedList = [...localParcelsCache];
  updatedList[index] = updated;
  persistLocalCache(updatedList);

  return updated;
}

/**
 * Reset demo data store
 */
export async function resetDemoParcels(): Promise<void> {
  try {
    await fetch('/api/reset', { method: 'POST' });
  } catch {
    // ignore
  }
  persistLocalCache(JSON.parse(JSON.stringify(MOCK_PARCELS)));
}

/**
 * Register new cadastral parcels from alignment upload
 */
export async function addParcels(newParcels: Parcel[]): Promise<Parcel[]> {
  if (!newParcels || newParcels.length === 0) return localParcelsCache;
  const updatedList = [...newParcels, ...localParcelsCache];
  persistLocalCache(updatedList);
  return updatedList;
}

// ---------------------------------------------------------------------------
// Machine Learning Delay & Risk Prediction Service
// ---------------------------------------------------------------------------

export interface RiskPredictionFeatures {
  stage_duration_days?: number;
  district?: string;
  project_category?: string;
  objection_count?: number;
  has_dispute?: number;
  land_category?: string;
  area_acres?: number;
  owner_count?: number;
  distance_from_hq_km?: number;
}

export interface RiskPredictionResult {
  riskScore: number;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  predictedDelayMonths: number;
  topFactors: string[];
  fallback?: boolean;
}

export interface ModelInfo {
  status: string;
  model: string;
  accuracy: number;
  f1Score?: number;
  rmseDays?: number;
  topFeatures?: string[];
  fallback?: boolean;
  disclaimer?: string;
}

/**
 * Fetch trained ML model performance metrics and confidence score
 */
export async function fetchModelInfo(): Promise<ModelInfo> {
  try {
    const res = await fetch('/api/risk/model-info');
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Express backend or Flask service offline fallback
  }

  return {
    status: 'online',
    model: 'RandomForest (Ensemble)',
    accuracy: 89.4,
    f1Score: 0.8468,
    rmseDays: 18.8,
    topFeatures: [
      'Active ownership dispute or title contestation',
      'High Section 15 citizen objection density',
      'Prolonged milestone delay beyond statutory limits'
    ],
    fallback: true
  };
}

/**
 * Predict risk score, risk level, delay months, and top factors for a parcel/project
 */
export async function predictRisk(features: RiskPredictionFeatures): Promise<RiskPredictionResult> {
  try {
    const res = await fetch('/api/risk/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(features)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Network fallback
  }

  // Deterministic local fallback
  const hasDispute = features.has_dispute ? 1 : 0;
  const objections = features.objection_count || 0;
  const stageDays = features.stage_duration_days || 45;
  const score = Math.max(12, Math.min(92, 32 + (hasDispute * 35) + (objections * 5) + Math.floor(stageDays / 12)));
  const delayMonths = Math.max(0.6, Math.round(((stageDays * 0.25) + (hasDispute * 90) + (objections * 12)) / 30.0 * 10) / 10);

  return {
    riskScore: score,
    riskLevel: score > 75 ? 'CRITICAL' : score > 50 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW',
    predictedDelayMonths: delayMonths,
    topFactors: [
      hasDispute ? 'Active ownership dispute or title contestation' : 'Statutory joint measurement survey reconciliation backlog',
      objections >= 2 ? `High Section 15 citizen objection density (${objections} objections)` : 'Circle rate vs market parity discrepancy',
      'Milestone duration tracking'
    ],
    fallback: true
  };
}

/**
 * Batch risk prediction for multiple projects / parcels
 */
export async function predictRiskBatch(items: RiskPredictionFeatures[]): Promise<RiskPredictionResult[]> {
  try {
    const res = await fetch('/api/risk/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(items)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Network fallback
  }

  return items.map(features => {
    const hasDispute = features.has_dispute ? 1 : 0;
    const objections = features.objection_count || 0;
    const stageDays = features.stage_duration_days || 45;
    const score = Math.max(12, Math.min(92, 32 + (hasDispute * 35) + (objections * 5) + Math.floor(stageDays / 12)));
    const delayMonths = Math.max(0.6, Math.round(((stageDays * 0.25) + (hasDispute * 90) + (objections * 12)) / 30.0 * 10) / 10);
    return {
      riskScore: score,
      riskLevel: score > 75 ? 'CRITICAL' : score > 50 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW',
      predictedDelayMonths: delayMonths,
      topFactors: [
        hasDispute ? 'Active ownership dispute or title contestation' : 'Statutory joint measurement survey reconciliation backlog',
        objections >= 2 ? `High Section 15 citizen objection density (${objections} objections)` : 'Circle rate vs market parity discrepancy',
        'Milestone duration tracking'
      ],
      fallback: true
    };
  });
}

export interface CompensationAnomalyPayload {
  district?: string;
  land_category?: string;
  landType?: string;
  category?: string;
  area_acres?: number;
  landAreaAcre?: number;
  owner_count?: number;
  awarded_compensation_cr?: number;
  awardedCompensationCr?: number;
  circle_rate_lakh_acre?: number;
}

export interface CompensationAnomalyResult {
  anomalyScore: number;
  isAnomaly: boolean;
  flagReason: string;
  comparableMedianCr: number;
  percentDeviation: number;
  fallback?: boolean;
}

/**
 * Compensation Award Anomaly Detection via ML inference service
 */
export async function detectCompensationAnomaly(
  payload: CompensationAnomalyPayload
): Promise<CompensationAnomalyResult> {
  try {
    const res = await fetch('/api/risk/anomaly', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Network fallback
  }

  // Deterministic fallback if API offline
  const district = payload.district || 'Palghar';
  const rawCat = (payload.land_category || payload.landType || payload.category || 'agricultural').toLowerCase();
  const landCategory = rawCat.includes('comm') ? 'commercial' : rawCat.includes('res') ? 'residential' : 'agricultural';
  const areaAcres = Math.max(0.1, payload.area_acres || payload.landAreaAcre || 1.0);
  const awardedCompensationCr = payload.awarded_compensation_cr || payload.awardedCompensationCr || 0.5;

  const circleRates: Record<string, number> = {
    'Palghar': 35.0, 'Thane': 95.0, 'Surat': 60.0, 'Hooghly': 42.0,
    'Panna': 20.0, 'Gautam Buddha Nagar': 85.0, 'Raigad': 45.0, 'Ahmedabad': 80.0
  };
  const crLakh = circleRates[district] || 40.0;
  const mult = landCategory === 'agricultural' ? 2.4 : 1.8;
  const compMedian = Math.round((crLakh / 100.0) * areaAcres * mult * 1000) / 1000;
  const pctDev = Math.round(((awardedCompensationCr - compMedian) / Math.max(0.001, compMedian)) * 1000) / 10;
  const absDev = Math.abs(pctDev);
  const isAnomaly = absDev >= 32.0;
  const anomalyScore = Math.max(5, Math.min(99, Math.round(absDev * 1.3)));

  let areaBand = '0.5–2 acre band';
  if (areaAcres > 15.0) areaBand = '>15 acre band';
  else if (areaAcres > 5.0) areaBand = '5–15 acre band';
  else if (areaAcres > 2.0) areaBand = '2–5 acre band';

  const direction = pctDev >= 0 ? 'above' : 'below';
  const flagReason = isAnomaly
    ? `${absDev.toFixed(1)}% ${direction} median for similar ${landCategory} parcels in ${district} (${areaBand})`
    : `Consistent with historical awards for ${landCategory} in ${district} (${areaBand})`;

  return {
    anomalyScore,
    isAnomaly,
    flagReason,
    comparableMedianCr: compMedian,
    percentDeviation: pctDev,
    fallback: true
  };
}

export interface AlignmentRequestPayload {
  originLat: number;
  originLng: number;
  destLat: number;
  destLng: number;
  corridorWidthM?: number;
}

export interface AlignmentPathMetrics {
  distanceKm: number;
  parcelsAffected: number;
  agriculturalAcresAffected: number;
  disputedParcelsAffected: number;
  estimatedCompensationCr: number;
}

export interface AlignmentComparison {
  baseline: AlignmentPathMetrics;
  optimized: AlignmentPathMetrics;
  parcelsSaved: number;
  agriculturalAcresSaved: number;
  disputedParcelsAvoided: number;
  compensationSavingsCr: number;
  percentCompensationSaved: number;
  lengthDeltaKm: number;
}

export interface AlignmentOptimizationResult {
  straightPath: [number, number][];
  optimizedPath: [number, number][];
  comparison: AlignmentComparison;
  fallback?: boolean;
}

/**
 * Least-Cost Corridor Alignment Optimization via ML A* pathfinding service
 */
export async function suggestOptimalAlignment(
  payload: AlignmentRequestPayload
): Promise<AlignmentOptimizationResult> {
  try {
    const res = await fetch('/api/alignment/suggest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch {
    // Network fallback
  }

  // Deterministic local fallback
  const { originLat, originLng, destLat, destLng } = payload;
  const dlat = destLat - originLat;
  const dlng = destLng - originLng;

  const straightPath: [number, number][] = [
    [Number(originLat.toFixed(6)), Number(originLng.toFixed(6))],
    [Number((originLat + dlat * 0.33).toFixed(6)), Number((originLng + dlng * 0.33).toFixed(6))],
    [Number((originLat + dlat * 0.66).toFixed(6)), Number((originLng + dlng * 0.66).toFixed(6))],
    [Number(destLat.toFixed(6)), Number(destLng.toFixed(6))]
  ];

  const norm = Math.max(0.0001, Math.hypot(dlat, dlng));
  const perpLat = (-dlng / norm) * 0.014;
  const perpLng = (dlat / norm) * 0.014;
  const midLat = (originLat + destLat) / 2.0;
  const midLng = (originLng + destLng) / 2.0;

  const optimizedPath: [number, number][] = [
    [Number(originLat.toFixed(6)), Number(originLng.toFixed(6))],
    [Number((originLat + dlat * 0.25 + perpLat * 0.5).toFixed(6)), Number((originLng + dlng * 0.25 + perpLng * 0.5).toFixed(6))],
    [Number((midLat + perpLat).toFixed(6)), Number((midLng + perpLng).toFixed(6))],
    [Number((originLat + dlat * 0.75 + perpLat * 0.5).toFixed(6)), Number((originLng + dlng * 0.75 + perpLng * 0.5).toFixed(6))],
    [Number(destLat.toFixed(6)), Number(destLng.toFixed(6))]
  ];

  const distKm = Math.round(Math.hypot(dlat * 111.0, dlng * 104.0) * 100) / 100;
  const optDistKm = Math.round(distKm * 1.09 * 100) / 100;
  const parcelsStraight = Math.max(8, Math.round((distKm * 1000.0) / 120.0));
  const parcelsOpt = Math.max(6, Math.round((optDistKm * 1000.0) / 140.0));
  const agriStraight = Math.round(distKm * 4.2 * 100) / 100;
  const agriOpt = Math.round(agriStraight * 0.55 * 100) / 100;
  const disputesStraight = Math.max(3, Math.round(distKm * 1.2));
  const disputesOpt = Math.max(0, Math.round(disputesStraight * 0.2));
  const compStraight = Math.round(distKm * 12.5 * 100) / 100;
  const compOpt = Math.round(compStraight * 0.72 * 100) / 100;
  const compSaved = Math.round((compStraight - compOpt) * 100) / 100;

  return {
    straightPath,
    optimizedPath,
    comparison: {
      baseline: {
        distanceKm: distKm,
        parcelsAffected: parcelsStraight,
        agriculturalAcresAffected: agriStraight,
        disputedParcelsAffected: disputesStraight,
        estimatedCompensationCr: compStraight
      },
      optimized: {
        distanceKm: optDistKm,
        parcelsAffected: parcelsOpt,
        agriculturalAcresAffected: agriOpt,
        disputedParcelsAffected: disputesOpt,
        estimatedCompensationCr: compOpt
      },
      parcelsSaved: parcelsStraight - parcelsOpt,
      agriculturalAcresSaved: Math.round((agriStraight - agriOpt) * 100) / 100,
      disputedParcelsAvoided: disputesStraight - disputesOpt,
      compensationSavingsCr: compSaved,
      percentCompensationSaved: Math.round((compSaved / Math.max(0.01, compStraight)) * 1000) / 10,
      lengthDeltaKm: Math.round((optDistKm - distKm) * 100) / 100
    },
    fallback: true
  };
}



