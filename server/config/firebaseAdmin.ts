import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let app: App | undefined;
let db: Firestore | null = null;
let auth: Auth | null = null;
let initialized = false;

// Resolve service account key path
const keyPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  ? path.resolve(process.cwd(), process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
  : path.resolve(__dirname, 'serviceAccountKey.json');

try {
  if (!getApps().length) {
    if (fs.existsSync(keyPath)) {
      const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
      app = initializeApp({
        credential: cert(serviceAccount),
        projectId: serviceAccount.project_id || 'landpulse-4ca8b',
      });
      db = getFirestore(app);
      auth = getAuth(app);
      initialized = true;
      console.log('🔥 [Firebase Admin] Initialized successfully with project:', serviceAccount.project_id);
    } else {
      console.warn(`⚠️ [Firebase Admin] serviceAccountKey.json not found at: ${keyPath}`);
    }
  } else {
    app = getApps()[0];
    db = getFirestore(app);
    auth = getAuth(app);
    initialized = true;
  }
} catch (err) {
  console.error('❌ [Firebase Admin] Initialization error:', err);
}

export const adminApp = app;
export const adminDb = db;
export const adminAuth = auth;
export const isFirebaseAdminInitialized = initialized;
