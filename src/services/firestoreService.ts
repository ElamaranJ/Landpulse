import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
  DocumentData,
} from 'firebase/firestore';
import { db } from './firebase';
import { Project, StateData, CitizenCase, FieldParcel, CriticalAlert, RiskEngineItem } from '../types';
import { Parcel } from '../types/parcel';
import {
  NATIONAL_STATS,
  MOCK_PROJECTS,
  MOCK_STATES,
  MOCK_CITIZEN_CASE,
  MOCK_FIELD_PARCELS,
  MOCK_DISTRICT_CASES,
  MOCK_CRITICAL_ALERTS,
  MOCK_RISK_ITEMS,
} from '../data/mockData';
import { MOCK_PARCELS } from '../data/parcelsData';

// ── 1. Projects ───────────────────────────────────────────────────
export async function getProjects(): Promise<Project[]> {
  if (!db) return MOCK_PROJECTS;
  try {
    const snap = await getDocs(collection(db, 'projects'));
    if (snap.empty) return MOCK_PROJECTS;
    return snap.docs.map((d) => d.data() as Project);
  } catch (err) {
    console.warn('[Firestore] Error getting projects, using fallback:', err);
    return MOCK_PROJECTS;
  }
}

export function subscribeProjects(callback: (projects: Project[]) => void): () => void {
  if (!db) {
    callback(MOCK_PROJECTS);
    return () => {};
  }
  return onSnapshot(
    collection(db, 'projects'),
    (snap) => {
      if (snap.empty) {
        callback(MOCK_PROJECTS);
      } else {
        callback(snap.docs.map((d) => d.data() as Project));
      }
    },
    (err) => {
      console.warn('[Firestore] subscribeProjects error:', err);
      callback(MOCK_PROJECTS);
    }
  );
}

// ── 2. Citizen Cases ──────────────────────────────────────────────
export async function getCitizenCase(caseId: string = 'MH-PAL-2024-8821'): Promise<CitizenCase> {
  if (!db) return MOCK_CITIZEN_CASE;
  try {
    const docRef = doc(db, 'citizenCases', caseId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return snap.data() as CitizenCase;
    }
    // Try alias LP-CASE-2024-MH-4921
    const fallbackRef = doc(db, 'citizenCases', 'LP-CASE-2024-MH-4921');
    const fbSnap = await getDoc(fallbackRef);
    if (fbSnap.exists()) return fbSnap.data() as CitizenCase;
    return MOCK_CITIZEN_CASE;
  } catch (err) {
    console.warn('[Firestore] Error getting citizen case:', err);
    return MOCK_CITIZEN_CASE;
  }
}

export function subscribeCitizenCase(
  caseId: string,
  callback: (data: CitizenCase) => void
): () => void {
  if (!db) {
    callback(MOCK_CITIZEN_CASE);
    return () => {};
  }
  return onSnapshot(
    doc(db, 'citizenCases', caseId),
    (snap) => {
      if (snap.exists()) {
        callback(snap.data() as CitizenCase);
      } else {
        callback(MOCK_CITIZEN_CASE);
      }
    },
    () => callback(MOCK_CITIZEN_CASE)
  );
}

export async function updateCitizenCase(caseId: string, updates: Partial<CitizenCase>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'citizenCases', caseId);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
}

// ── 3. Field Parcels ──────────────────────────────────────────────
export async function getFieldParcels(): Promise<FieldParcel[]> {
  if (!db) return MOCK_FIELD_PARCELS;
  try {
    const snap = await getDocs(collection(db, 'fieldParcels'));
    if (snap.empty) return MOCK_FIELD_PARCELS;
    return snap.docs.map((d) => d.data() as FieldParcel);
  } catch {
    return MOCK_FIELD_PARCELS;
  }
}

export function subscribeFieldParcels(callback: (parcels: FieldParcel[]) => void): () => void {
  if (!db) {
    callback(MOCK_FIELD_PARCELS);
    return () => {};
  }
  return onSnapshot(
    collection(db, 'fieldParcels'),
    (snap) => {
      if (!snap.empty) {
        callback(snap.docs.map((d) => d.data() as FieldParcel));
      } else {
        callback(MOCK_FIELD_PARCELS);
      }
    },
    () => callback(MOCK_FIELD_PARCELS)
  );
}

export async function updateFieldParcel(id: string, updates: Partial<FieldParcel>): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'fieldParcels', id);
  await updateDoc(docRef, { ...updates, updatedAt: new Date().toISOString() });
}

// ── 4. District Cases ─────────────────────────────────────────────
export async function getDistrictCases() {
  if (!db) return MOCK_DISTRICT_CASES;
  try {
    const snap = await getDocs(collection(db, 'districtCases'));
    if (snap.empty) return MOCK_DISTRICT_CASES;
    return snap.docs.map((d) => d.data());
  } catch {
    return MOCK_DISTRICT_CASES;
  }
}

// ── 5. Critical Alerts ────────────────────────────────────────────
export async function getCriticalAlerts(): Promise<CriticalAlert[]> {
  if (!db) return MOCK_CRITICAL_ALERTS;
  try {
    const snap = await getDocs(collection(db, 'criticalAlerts'));
    if (snap.empty) return MOCK_CRITICAL_ALERTS;
    return snap.docs.map((d) => d.data() as CriticalAlert);
  } catch {
    return MOCK_CRITICAL_ALERTS;
  }
}

// ── 6. Risk Engine Items ──────────────────────────────────────────
export async function getRiskItems(): Promise<RiskEngineItem[]> {
  if (!db) return MOCK_RISK_ITEMS;
  try {
    const snap = await getDocs(collection(db, 'riskItems'));
    if (snap.empty) return MOCK_RISK_ITEMS;
    return snap.docs.map((d) => d.data() as RiskEngineItem);
  } catch {
    return MOCK_RISK_ITEMS;
  }
}

// ── 7. National Stats Singleton ───────────────────────────────────
export async function getNationalStats() {
  if (!db) return NATIONAL_STATS;
  try {
    const snap = await getDoc(doc(db, 'nationalStats', 'overview'));
    if (snap.exists()) return snap.data();
    return NATIONAL_STATS;
  } catch {
    return NATIONAL_STATS;
  }
}

// ── 8. Spatial Parcels ────────────────────────────────────────────
export async function getParcels(): Promise<Parcel[]> {
  if (!db) return MOCK_PARCELS;
  try {
    const snap = await getDocs(collection(db, 'parcels'));
    if (snap.empty) return MOCK_PARCELS;
    return snap.docs.map((d) => {
      const data = d.data();
      // Handle coordinates format (coordinatesJson string or array of {lat, lng})
      let coords: [number, number][] = [];
      if (data.coordinatesJson) {
        try {
          coords = JSON.parse(data.coordinatesJson);
        } catch {
          coords = [];
        }
      } else if (Array.isArray(data.coordinates)) {
        coords = data.coordinates.map((c: { lat: number; lng: number } | [number, number]) =>
          Array.isArray(c) ? c : [c.lat, c.lng]
        );
      }
      return {
        ...data,
        coordinates: coords,
      } as Parcel;
    });
  } catch {
    return MOCK_PARCELS;
  }
}

export function subscribeParcels(callback: (parcels: Parcel[]) => void): () => void {
  if (!db) {
    callback(MOCK_PARCELS);
    return () => {};
  }
  return onSnapshot(
    collection(db, 'parcels'),
    (snap) => {
      if (snap.empty) {
        callback(MOCK_PARCELS);
      } else {
        const list = snap.docs.map((d) => {
          const data = d.data();
          let coords: [number, number][] = [];
          if (data.coordinatesJson) {
            try {
              coords = JSON.parse(data.coordinatesJson);
            } catch {
              coords = [];
            }
          } else if (Array.isArray(data.coordinates)) {
            coords = data.coordinates.map((c: { lat: number; lng: number } | [number, number]) =>
              Array.isArray(c) ? c : [c.lat, c.lng]
            );
          }
          return { ...data, coordinates: coords } as Parcel;
        });
        callback(list);
      }
    },
    () => callback(MOCK_PARCELS)
  );
}

export async function updateParcelInspection(
  id: string,
  inspection: Partial<Parcel['inspection']>,
  newStatus?: Parcel['status']
): Promise<void> {
  if (!db) return;
  const docRef = doc(db, 'parcels', id);
  const updates: DocumentData = {
    'inspection.lastInspectedOn': new Date().toISOString().split('T')[0],
    ...Object.entries(inspection).reduce((acc, [k, v]) => ({ ...acc, [`inspection.${k}`]: v }), {}),
    updatedAt: new Date().toISOString(),
  };
  if (newStatus) {
    updates.status = newStatus;
  }
  await updateDoc(docRef, updates);
}

// ── 9. Users / RBAC Profile ───────────────────────────────────────
export async function getUserProfile(uid: string) {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) return snap.data();
    return null;
  } catch {
    return null;
  }
}
