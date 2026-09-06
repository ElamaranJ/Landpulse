import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { adminDb } from '../config/firebaseAdmin';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const uploadRouter = Router();

// Ensure upload directory exists
const uploadDir = path.resolve(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const cleanOriginalName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}-${cleanOriginalName}`);
  },
});

// Max 50 MB
const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

/**
 * POST /api/upload
 * Accepts multipart/form-data with 'file' field and optional metadata:
 * - category (e.g. 'Boundary', 'Crops', 'RoR', 'Valuation')
 * - entityId (e.g. parcel ID or case ID)
 * - entityType ('parcel' | 'citizenCase' | 'project')
 */
uploadRouter.post('/upload', upload.single('file'), async (req: Request, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded.' });
    }

    const { category, entityId, entityType, title } = req.body;
    const fileUrl = `/uploads/${req.file.filename}`;
    const docMeta = {
      id: `DOC-${Date.now()}`,
      title: title || req.file.originalname,
      originalName: req.file.originalname,
      filename: req.file.filename,
      url: fileUrl,
      size: `${(req.file.size / (1024 * 1024)).toFixed(2)} MB`,
      sizeBytes: req.file.size,
      mimeType: req.file.mimetype,
      category: category || 'General',
      entityId: entityId || null,
      entityType: entityType || null,
      sealNumber: `DSC-IN-${Date.now().toString().slice(-6)}`,
      uploadedAt: new Date().toISOString(),
    };

    // Save metadata in Firestore if adminDb is available
    if (adminDb) {
      try {
        await adminDb.collection('uploadedDocuments').doc(docMeta.id).set(docMeta);

        // If uploaded for a citizenCase, also append to citizenCases doc
        if (entityType === 'citizenCase' && entityId) {
          const caseRef = adminDb.collection('citizenCases').doc(entityId);
          const caseSnap = await caseRef.get();
          if (caseSnap.exists) {
            const caseData = caseSnap.data();
            const docs = caseData?.documents || [];
            docs.push({
              id: docMeta.id,
              title: docMeta.title,
              type: req.file.mimetype.includes('pdf') ? 'PDF' : 'Image',
              uploadDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
              size: docMeta.size,
              sealNumber: docMeta.sealNumber,
              url: docMeta.url,
            });
            await caseRef.update({ documents: docs, updatedAt: new Date().toISOString() });
          }
        }
      } catch (dbErr) {
        console.warn('[Upload] Failed to persist doc metadata to Firestore:', dbErr);
      }
    }

    return res.json({
      success: true,
      message: 'File uploaded successfully (Zero-Cost Local Express Storage)',
      document: docMeta,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    return res.status(500).json({ success: false, error: message });
  }
});

/**
 * GET /api/uploads
 * List recently uploaded documents
 */
uploadRouter.get('/uploads', async (_req: Request, res: Response) => {
  if (adminDb) {
    try {
      const snap = await adminDb.collection('uploadedDocuments').orderBy('uploadedAt', 'desc').limit(50).get();
      const docs = snap.docs.map(d => d.data());
      return res.json({ success: true, count: docs.length, data: docs });
    } catch {
      // fallback
    }
  }

  // Fallback: list files in uploadDir
  try {
    const files = fs.readdirSync(uploadDir);
    return res.json({
      success: true,
      count: files.length,
      data: files.map(f => ({ filename: f, url: `/uploads/${f}` })),
    });
  } catch {
    return res.json({ success: true, count: 0, data: [] });
  }
});
