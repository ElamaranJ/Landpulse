import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  Auth,
  UserCredential,
} from 'firebase/auth';

// Read Firebase config from Vite environment variables with project defaults
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAWj4vBAVwl8QRfksVN8tfUfNtIFMjtYRk',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'landpulse-4ca8b.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'landpulse-4ca8b',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'landpulse-4ca8b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '766785165216',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:766785165216:web:515d32d2c19f7e12e636c5',
};

// Check if valid Firebase configuration is provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
    firebaseConfig.apiKey.trim() !== '' &&
    firebaseConfig.apiKey !== 'your_firebase_api_key_here' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId.trim() !== '' &&
    firebaseConfig.projectId !== 'your-project-id'
);

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let googleProvider: GoogleAuthProvider | undefined;

if (isFirebaseConfigured) {
  try {
    app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    googleProvider = new GoogleAuthProvider();
    googleProvider.setCustomParameters({
      prompt: 'select_account',
    });
  } catch (err) {
    console.warn('[Firebase] Initialization error:', err);
  }
}

export { auth, googleProvider };

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
  isMock?: boolean;
}

/**
 * Sign in with Google Popup.
 * If Firebase is configured with real credentials, triggers Google OAuth popup.
 * If credentials are not yet configured in .env, returns a simulated demo officer/citizen account
 * and flags isMock: true so the user can test the app immediately.
 */
export async function signInWithGoogle(preferredRole?: string): Promise<GoogleAuthResult> {
  if (isFirebaseConfigured && auth && googleProvider) {
    try {
      const result: UserCredential = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      return {
        success: true,
        user: {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        },
        idToken,
        isMock: false,
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
          error:
            'Google Sign-In is not enabled in your Firebase Console. Go to Firebase Console -> Build -> Authentication -> Sign-in method -> Google -> Toggle "Enable" and Save.',
        };
      }
      if (firebaseError.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error:
            'This domain is not authorized in Firebase Console. Add "localhost" under Authentication -> Settings -> Authorized domains.',
        };
      }
      if (firebaseError.code === 'auth/configuration-not-found') {
        return {
          success: false,
          error:
            'Firebase Authentication not set up yet. Go to Firebase Console -> Authentication and click "Get Started".',
        };
      }
      return {
        success: false,
        error: firebaseError.message || 'Failed to sign in with Google.',
      };
    }
  }

  // Fallback / Demo mode when .env keys haven't been pasted yet
  return {
    success: true,
    user: {
      uid: 'google-demo-' + Date.now(),
      email: preferredRole === 'citizen' ? 'ramesh.patil@citizen.in' : 'arun.mehta@nic.in',
      displayName: preferredRole === 'citizen' ? 'Ramesh Patil (Google Verified)' : 'Shri Arun K. Mehta (Google Verified)',
      photoURL: 'https://lh3.googleusercontent.com/a/default-user',
    },
    idToken: 'demo-google-token',
    isMock: true,
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
