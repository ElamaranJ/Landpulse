import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
  Auth,
  UserCredential,
} from 'firebase/auth';
import { getFirestore, Firestore, doc, getDoc, setDoc } from 'firebase/firestore';

// Read Firebase config from Vite environment variables with project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAWj4vBAVwl8QRfksVN8tfUfNtIFMjtYRk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'landpulse-4ca8b.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'landpulse-4ca8b',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'landpulse-4ca8b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '766785165216',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:766785165216:web:515d32d2c19f7e12e636c5',
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim() !== '' &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId.trim() !== ''
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { auth, db, googleProvider };

// ── Email/Password Sign-In (Officer Roles) ─────────────────────────
export async function loginWithEmail(email: string, pass: string) {
  if (!auth) throw new Error('Firebase Auth is not initialized.');
  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
  const idToken = await userCredential.user.getIdToken();
  return { user: userCredential.user, idToken };
}

// ── Phone OTP Authentication (Citizen Beneficiary) ────────────────
export function initRecaptcha(containerId: string): RecaptchaVerifier {
  if (!auth) throw new Error('Firebase Auth is not initialized.');
  
  // Clean up any previous recaptcha instances attached to window
  if ((window as unknown as { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier) {
    try {
      (window as unknown as { recaptchaVerifier?: RecaptchaVerifier }).recaptchaVerifier?.clear();
    } catch {
      // ignore
    }
  }

  const verifier = new RecaptchaVerifier(auth, containerId, {
    size: 'invisible',
    callback: () => {
      // reCAPTCHA solved
    },
    'expired-callback': () => {
      console.warn('[Firebase] Recaptcha expired');
    },
  });

  (window as unknown as { recaptchaVerifier: RecaptchaVerifier }).recaptchaVerifier = verifier;
  return verifier;
}

export async function sendFirebasePhoneOtp(
  phoneNumber: string,
  verifier: RecaptchaVerifier
): Promise<ConfirmationResult> {
  if (!auth) throw new Error('Firebase Auth is not initialized.');
  
  // Format to standard E.164 (e.g. +919820144521)
  let cleanPhone = phoneNumber.replace(/[\s-]/g, '');
  if (!cleanPhone.startsWith('+')) {
    cleanPhone = '+91' + cleanPhone.replace(/^0+/, '');
  }

  return await signInWithPhoneNumber(auth, cleanPhone, verifier);
}

// ── Google Sign-In ────────────────────────────────────────────────
export interface GoogleAuthResult {
  success: boolean;
  user?: {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
  };
  idToken?: string;
  error?: string;
}

export async function signInWithGoogle(preferredRole?: string): Promise<GoogleAuthResult> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      // Ensure a profile document exists in Firestore 'users' collection
      if (db) {
        const userDocRef = doc(db, 'users', user.uid);
        const existingDoc = await getDoc(userDocRef);
        if (!existingDoc.exists()) {
          const userEmail = (user.email || '').toLowerCase();
          let assignedRole = preferredRole || 'citizen';
          if (userEmail.endsWith('@nic.in') || userEmail.endsWith('@gov.in')) {
            assignedRole = 'command_center';
          }
          await setDoc(userDocRef, {
            id: `USR-GGL-${user.uid.slice(-6).toUpperCase()}`,
            uid: user.uid,
            email: user.email,
            name: user.displayName || userEmail.split('@')[0],
            role: assignedRole,
            roleTitle: assignedRole === 'command_center' ? 'Command Center Director' : 'Citizen Landowner (Beneficiary)',
            department: assignedRole === 'command_center' ? 'Ministry of Rural Development' : 'Registered Landowner',
            designation: assignedRole === 'command_center' ? 'Government Officer' : 'Citizen Beneficiary',
            badgeLevel: 'Google e-KYC Verified',
            tokenType: 'FIREBASE_GOOGLE_AUTH',
            updatedAt: new Date().toISOString(),
          });
        }
      }

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        idToken,
      };
    } catch (err: unknown) {
      const firebaseError = err as { code?: string; message?: string };
      console.error('[Firebase] Google sign-in failed:', firebaseError);

      if (firebaseError.code === 'auth/popup-closed-by-user') {
        return { success: false, error: 'Google sign-in popup was closed.' };
      }
      if (firebaseError.code === 'auth/operation-not-allowed') {
        return {
          success: false,
          error: 'Google Sign-In is not enabled in Firebase Console.',
        };
      }
      return {
        success: false,
        error: firebaseError.message || 'Failed to sign in with Google.',
      };
    }
  }

  return {
    success: false,
    error: 'Firebase Auth is not configured.',
  };
}

export async function signOutFirebase(): Promise<void> {
  if (auth) {
    try {
      await firebaseSignOut(auth);
    } catch (err) {
      console.error('[Firebase] Sign out error:', err);
    }
  }
}
