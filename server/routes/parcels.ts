import { Router, Request, Response } from 'express';
import { MOCK_PARCELS } from '../../src/data/parcelsData';
import { Parcel, ParcelStatus, InspectionPriority } from '../../src/types/parcel';
import { adminDb } from '../config/firebaseAdmin';

export const parcelsRouter = Router();

// In-memory runtime store fallback
let parcelsStore: Parcel[] = JSON.parse(JSON.stringify(MOCK_PARCELS));

/**
 * Priority sort order weight
 */
const PRIORITY_WEIGHTS: Record<InspectionPriority, number> = {
  high: 3,
  medium: 2,
  low: 1,
};

function parseFirestoreParcel(data: any): Parcel {
  let coords: [number, number][] = [];
  if (data.coordinatesJson) {
    try {
      coords = JSON.parse(data.coordinatesJson);
    } catch {
      coords = [];
    }
  } else if (Array.isArray(data.coordinates)) {
    coords = data.coordinates.map((c: any) => (Array.isArray(c) ? c : [c.lat, c.lng]));
  }
  return {
    ...data,
    coordinates: coords,
  } as Parcel;
}

async function getAllParcels(): Promise<Parcel[]> {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('parcels').get();
      if (!snap.empty) {
        return snap.docs.map(d => parseFirestoreParcel(d.data()));
      }
    } catch (err) {
      console.warn('[ParcelsRoute] Error fetching from Firestore admin, fallback to store:', err);
    }
  }
  return parcelsStore;
}

/**
 * GET /api/parcels
 */
parcelsRouter.get('/parcels', async (req: Request, res: Response) => {
  const { status, project, district, search } = req.query;

  const allParcels = await getAllParcels();
  let results = [...allParcels];

  if (status && typeof status === 'string') {
    results = results.filter(p => p.status.toLowerCase() === status.toLowerCase());
  }

  if (project && typeof project === 'string') {
    results = results.filter(p => p.project.toLowerCase().includes(project.toLowerCase()));
  }

  if (district && typeof district === 'string') {
    results = results.filter(p => p.district.toLowerCase() === district.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    results = results.filter(
      p =>
        p.surveyNo.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  res.json({
    success: true,
    total: results.length,
    data: results,
  });
});

/**
 * GET /api/parcels/:id
 */
parcelsRouter.get('/parcels/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (adminDb) {
    try {
      const docRef = adminDb.collection('parcels').doc(id);
      const snap = await docRef.get();
      if (snap.exists) {
        return res.json({ success: true, data: parseFirestoreParcel(snap.data()) });
      }
      // Query by surveyNo
      const querySnap = await adminDb.collection('parcels').where('surveyNo', '==', id).get();
      if (!querySnap.empty) {
        return res.json({ success: true, data: parseFirestoreParcel(querySnap.docs[0].data()) });
      }
    } catch (err) {
      console.warn('[ParcelsRoute] Firestore get parcel error:', err);
    }
  }

  const parcel = parcelsStore.find(
    p => p.id.toLowerCase() === id.toLowerCase() || p.surveyNo.toLowerCase() === id.toLowerCase()
  );

  if (!parcel) {
    return res.status(404).json({
      success: false,
      error: `Parcel '${id}' not found`,
    });
  }

  res.json({
    success: true,
    data: parcel,
  });
});

/**
 * GET /api/inspections/pending
 */
parcelsRouter.get('/inspections/pending', async (req: Request, res: Response) => {
  const { district, project, priority, search } = req.query;

  const allParcels = await getAllParcels();
  let pending = allParcels.filter(p => p.inspection && p.inspection.required);

  if (district && typeof district === 'string') {
    pending = pending.filter(p => p.district.toLowerCase() === district.toLowerCase());
  }

  if (project && typeof project === 'string') {
    pending = pending.filter(p => p.project.toLowerCase().includes(project.toLowerCase()));
  }

  if (priority && typeof priority === 'string') {
    pending = pending.filter(p => p.inspection.priority.toLowerCase() === priority.toLowerCase());
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    pending = pending.filter(
      p =>
        p.surveyNo.toLowerCase().includes(q) ||
        p.owner.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q)
    );
  }

  pending.sort((a, b) => {
    const pA = PRIORITY_WEIGHTS[a.inspection.priority] || 0;
    const pB = PRIORITY_WEIGHTS[b.inspection.priority] || 0;
    if (pB !== pA) {
      return pB - pA;
    }
    return new Date(a.inspection.dueDate).getTime() - new Date(b.inspection.dueDate).getTime();
  });

  res.json({
    success: true,
    count: pending.length,
    data: pending,
  });
});

/**
 * POST /api/inspections/:parcelId/complete
 */
parcelsRouter.post('/inspections/:parcelId/complete', async (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const { notes, date, newStatus, photoUrl } = req.body;

  const inspectionDate = date || new Date().toISOString().split('T')[0];

  // 1. Update in Firestore if available
  if (adminDb) {
    try {
      const docRef = adminDb.collection('parcels').doc(parcelId);
      const snap = await docRef.get();
      if (snap.exists) {
        const existing = snap.data() as any;
        const updatedInspection = {
          ...existing.inspection,
          required: false,
          lastInspectedOn: inspectionDate,
          notes: notes || existing.inspection?.notes,
          photoUrl: photoUrl || existing.inspection?.photoUrl,
        };
        const updates: any = {
          inspection: updatedInspection,
          updatedAt: new Date().toISOString(),
        };
        if (newStatus && ['completed', 'in_progress', 'dispute', 'not_started'].includes(newStatus)) {
          updates.status = newStatus;
        }
        await docRef.update(updates);

        const updatedDoc = { ...existing, ...updates };
        return res.json({
          success: true,
          message: `Inspection completed for Parcel ${updatedDoc.surveyNo} (saved to Firestore)`,
          data: parseFirestoreParcel(updatedDoc),
        });
      }
    } catch (err) {
      console.warn('[ParcelsRoute] Firestore update error:', err);
    }
  }

  // 2. Fallback to memory store
  const parcelIndex = parcelsStore.findIndex(
    p => p.id.toLowerCase() === parcelId.toLowerCase() || p.surveyNo.toLowerCase() === parcelId.toLowerCase()
  );

  if (parcelIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Parcel '${parcelId}' not found`,
    });
  }

  const target = parcelsStore[parcelIndex];
  target.inspection = {
    ...target.inspection,
    required: false,
    lastInspectedOn: inspectionDate,
    notes: notes || target.inspection.notes,
    photoUrl: photoUrl || target.inspection.photoUrl,
  };

  if (newStatus && ['completed', 'in_progress', 'dispute', 'not_started'].includes(newStatus)) {
    target.status = newStatus as ParcelStatus;
  }

  parcelsStore[parcelIndex] = target;

  res.json({
    success: true,
    message: `Inspection completed for Parcel ${target.surveyNo}`,
    data: target,
  });
});

/**
 * POST /api/reset
 */
parcelsRouter.post('/reset', (_req: Request, res: Response) => {
  parcelsStore = JSON.parse(JSON.stringify(MOCK_PARCELS));
  res.json({
    success: true,
    message: 'Parcels store reset to initial mock dataset',
    count: parcelsStore.length,
  });
});
