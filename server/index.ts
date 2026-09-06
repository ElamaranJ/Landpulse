import express from 'express';
import cors from 'cors';
import { parcelsRouter } from './routes/parcels';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'online',
    service: 'LandPulse GIS & Inspection API',
    timestamp: new Date().toISOString()
  });
});

// Register parcels and inspections routes
app.use('/api', parcelsRouter);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 LandPulse Backend API server running on http://localhost:${PORT}`);
  console.log(`📍 Endpoints:`);
  console.log(`   - GET  /api/parcels`);
  console.log(`   - GET  /api/parcels/:id`);
  console.log(`   - GET  /api/inspections/pending`);
  console.log(`   - POST /api/inspections/:parcelId/complete`);
});

export default app;
