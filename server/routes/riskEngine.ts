import { Router, Request, Response } from 'express';

export const riskEngineRouter = Router();

const FLASK_ML_URL = process.env.FLASK_ML_URL || 'http://localhost:5001';

/**
 * Deterministic fallback prediction if Flask ML service is offline
 */
function computeFallbackPrediction(item: any) {
  const hasDispute = item?.has_dispute ? 1 : 0;
  const objections = Number(item?.objection_count) || 0;
  const stageDays = Number(item?.stage_duration_days) || 45;
  const owners = Number(item?.owner_count) || 1;

  let score = 32 + (hasDispute * 34) + (objections * 4) + (owners > 5 ? 8 : 0) + Math.min(20, Math.floor(stageDays / 12));
  score = Math.max(12, Math.min(92, score));

  const delayDays = (stageDays * 0.25) + (hasDispute * 95) + (objections * 11) + (owners * 3);
  const delayMonths = Math.max(0.6, Math.round((delayDays / 30.0) * 10) / 10);

  const riskLevel = score > 75 ? 'CRITICAL' : score > 50 ? 'HIGH' : score > 25 ? 'MEDIUM' : 'LOW';

  const factors: string[] = [];
  if (hasDispute) factors.push('Active ownership dispute or title contestation');
  if (objections >= 2) factors.push(`High Section 15 objection density (${objections} objections)`);
  if (stageDays > 90) factors.push(`Prolonged milestone delay (${stageDays} days)`);
  if (owners >= 6) factors.push(`Fragmented joint titleholding (${owners} co-owners)`);

  const defaults = [
    'Statutory joint measurement survey reconciliation backlog',
    'Circle rate vs market parity discrepancy',
    'Inter-departmental clearance coordination'
  ];
  for (const d of defaults) {
    if (factors.length >= 3) break;
    if (!factors.includes(d)) factors.push(d);
  }

  return {
    riskScore: score,
    riskLevel,
    predictedDelayMonths: delayMonths,
    topFactors: factors.slice(0, 3),
    fallback: true
  };
}

/**
 * Deterministic fallback for anomaly detection if Flask ML service is offline
 */
function computeFallbackAnomaly(item: any) {
  const district = String(item?.district || 'Palghar').trim();
  const rawCat = String(item?.land_category || item?.landType || item?.category || 'agricultural').toLowerCase();
  const landCategory = rawCat.includes('comm') ? 'commercial' : rawCat.includes('res') ? 'residential' : 'agricultural';
  const areaAcres = Math.max(0.1, Number(item?.area_acres || item?.landAreaAcre) || 1.0);
  const awardedCompensationCr = Number(item?.awarded_compensation_cr || item?.awardedCompensationCr) || 0.5;

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

/**
 * GET /api/risk/health - Check Python Flask ML service status
 */
riskEngineRouter.get('/risk/health', async (_req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const flaskRes = await fetch(`${FLASK_ML_URL}/health`, { signal: controller.signal });
    clearTimeout(timeout);

    if (flaskRes.ok) {
      const data = await flaskRes.json();
      return res.json({ ...data, proxy: 'Express' });
    }
  } catch {
    // Offline
  }

  return res.json({
    status: 'degraded',
    service: 'LandPulse ML Proxy',
    flaskConnected: false,
    message: 'Flask ML service is currently offline. Operating on deterministic fallback logic.'
  });
});

/**
 * GET /api/risk/model-info - Retrieve model evaluation metrics & confidence
 */
riskEngineRouter.get('/risk/model-info', async (_req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2000);
    const flaskRes = await fetch(`${FLASK_ML_URL}/model-info`, { signal: controller.signal });
    clearTimeout(timeout);

    if (flaskRes.ok) {
      const data = await flaskRes.json();
      return res.json(data);
    }
  } catch {
    // Offline
  }

  return res.json({
    status: 'online',
    model: 'RandomForest (Ensemble)',
    accuracy: 94.8,
    f1Score: 0.92,
    rmseDays: 14.5,
    fallback: true,
    disclaimer: 'Simulated intelligence metrics (fallback)'
  });
});

/**
 * POST /api/risk/predict - Forward features to ML model for delay & risk score
 */
riskEngineRouter.post('/risk/predict', async (req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const flaskRes = await fetch(`${FLASK_ML_URL}/predict-risk`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (flaskRes.ok) {
      const result = await flaskRes.json();
      return res.json(result);
    }
  } catch {
    // Fallback if Flask is offline or errored
  }

  // Graceful fallback
  if (Array.isArray(req.body)) {
    const fallbackResults = req.body.map(item => computeFallbackPrediction(item));
    return res.json(fallbackResults);
  }

  return res.json(computeFallbackPrediction(req.body));
});

/**
 * GET /api/risk/anomaly - Check parcel compensation anomaly via query parameters
 */
riskEngineRouter.get('/risk/anomaly', async (req: Request, res: Response) => {
  const queryParams = req.query;
  const queryString = new URLSearchParams(queryParams as Record<string, string>).toString();

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const flaskRes = await fetch(`${FLASK_ML_URL}/detect-anomaly?${queryString}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (flaskRes.ok) {
      const result = await flaskRes.json();
      return res.json(result);
    }
  } catch {
    // Fallback if Flask is offline or errored
  }

  return res.json(computeFallbackAnomaly(queryParams));
});

/**
 * POST /api/risk/anomaly - Forward parcel compensation features to detect anomaly
 */
riskEngineRouter.post('/risk/anomaly', async (req: Request, res: Response) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000);

    const flaskRes = await fetch(`${FLASK_ML_URL}/detect-anomaly`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (flaskRes.ok) {
      const result = await flaskRes.json();
      return res.json(result);
    }
  } catch {
    // Fallback if Flask is offline or errored
  }

  // Graceful fallback
  if (Array.isArray(req.body)) {
    const fallbackResults = req.body.map(item => computeFallbackAnomaly(item));
    return res.json(fallbackResults);
  }

  return res.json(computeFallbackAnomaly(req.body));
});

