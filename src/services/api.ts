import { Parcel, ParcelStatus, InspectionCompletionPayload } from '../types/parcel';
import { MOCK_PARCELS } from '../data/parcelsData';

// Local cache for in-browser state persistence across views
let localParcelsCache: Parcel[] = (() => {
  const saved = localStorage.getItem('landpulse_parcels_data');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return JSON.parse(JSON.stringify(MOCK_PARCELS));
})();

const persistLocalCache = (parcels: Parcel[]) => {
  localParcelsCache = parcels;
  try {
    localStorage.setItem('landpulse_parcels_data', JSON.stringify(parcels));
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
