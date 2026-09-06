import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { parcelsRouter } from './routes/parcels';
import { riskEngineRouter } from './routes/riskEngine';
import { alignmentEngineRouter } from './routes/alignmentEngine';
import { authRouter } from './routes/auth';
import { uploadRouter } from './routes/upload';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Serve static uploads for zero-cost local file storage
app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// API health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'LandPulse GIS & Inspection API',
    timestamp: new Date().toISOString()
  });
});

// Register parcels, inspections, risk prediction, alignment, auth and upload routes
app.use('/api', parcelsRouter);
app.use('/api', riskEngineRouter);
app.use('/api', alignmentEngineRouter);
app.use('/api', authRouter);
app.use('/api', uploadRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LandPulse Backend API server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   - GET  /api/parcels`);
  console.log(`   - GET  /api/parcels/:id`);
  console.log(`   - GET  /api/inspections/pending`);
  console.log(`   - POST /api/inspections/:parcelId/complete`);
  console.log(`   - GET  /api/risk/health`);
  console.log(`   - GET  /api/risk/model-info`);
  console.log(`   - POST /api/risk/predict`);
  console.log(`   - POST /api/risk/anomaly`);
  console.log(`   - POST /api/alignment/suggest`);
});

export default app;
