import { Router, Request, Response } from 'express';
import { MOCK_PARCELS } from '../../src/data/parcelsData';
import { Parcel, ParcelStatus, InspectionPriority } from '../../src/types/parcel';

export const parcelsRouter = Router();

// In-memory runtime store initialized with seed dataset
let parcelsStore: Parcel[] = JSON.parse(JSON.stringify(MOCK_PARCELS));

/**
 * Priority sort order weight
 */
const PRIORITY_WEIGHTS: Record<InspectionPriority, number> = {
  high: 3,
  medium: 2,
  low: 1
};

/**
 * GET /api/parcels
 * Optional query parameters:
 *  - status: 'completed' | 'in_progress' | 'dispute' | 'not_started'
 *  - project: string
 *  - district: string
 *  - search: string
 */
parcelsRouter.get('/parcels', (req: Request, res: Response) => {
  const { status, project, district, search } = req.query;

  let results = [...parcelsStore];

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
    data: results
  });
});

/**
 * GET /api/parcels/:id
 * Retrieve single parcel details
 */
parcelsRouter.get('/parcels/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const parcel = parcelsStore.find(p => p.id.toLowerCase() === id.toLowerCase() || p.surveyNo.toLowerCase() === id.toLowerCase());

  if (!parcel) {
    return res.status(404).json({
      success: false,
      error: `Parcel '${id}' not found`
    });
  }

  res.json({
    success: true,
    data: parcel
  });
});

/**
 * GET /api/inspections/pending
 * Retrieve all parcels requiring field inspection, sorted by priority (high -> medium -> low) then due date
 */
parcelsRouter.get('/inspections/pending', (req: Request, res: Response) => {
  const { district, project, priority, search } = req.query;

  let pending = parcelsStore.filter(p => p.inspection && p.inspection.required);

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

  // Sort by priority (high -> medium -> low), then due date ascending
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
    data: pending
  });
});

/**
 * POST /api/inspections/:parcelId/complete
 * Mark an inspection done, updating status, date, notes and clearing required flag
 */
parcelsRouter.post('/inspections/:parcelId/complete', (req: Request, res: Response) => {
  const { parcelId } = req.params;
  const { notes, date, newStatus, photoUrl } = req.body;

  const parcelIndex = parcelsStore.findIndex(
    p => p.id.toLowerCase() === parcelId.toLowerCase() || p.surveyNo.toLowerCase() === parcelId.toLowerCase()
  );

  if (parcelIndex === -1) {
    return res.status(404).json({
      success: false,
      error: `Parcel '${parcelId}' not found`
    });
  }

  const target = parcelsStore[parcelIndex];

  // Update inspection fields
  target.inspection = {
    ...target.inspection,
    required: false,
    lastInspectedOn: date || new Date().toISOString().split('T')[0],
    notes: notes || target.inspection.notes,
    photoUrl: photoUrl || target.inspection.photoUrl
  };

  // Update parcel status if provided
  if (newStatus && ['completed', 'in_progress', 'dispute', 'not_started'].includes(newStatus)) {
    target.status = newStatus as ParcelStatus;
  }

  parcelsStore[parcelIndex] = target;

  res.json({
    success: true,
    message: `Inspection completed for Parcel ${target.surveyNo}`,
    data: target
  });
});

/**
 * POST /api/reset
 * Helper to reset in-memory data back to default mock dataset
 */
parcelsRouter.post('/reset', (_req: Request, res: Response) => {
  parcelsStore = JSON.parse(JSON.stringify(MOCK_PARCELS));
  res.json({
    success: true,
    message: 'Parcels store reset to initial mock dataset',
    count: parcelsStore.length
  });
});
