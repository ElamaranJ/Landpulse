import { adminDb, adminAuth, isFirebaseAdminInitialized } from '../server/config/firebaseAdmin';

async function main() {
  console.log('Testing Firebase Admin Connection...');
  console.log('Initialized:', isFirebaseAdminInitialized);

  if (!adminDb) {
    console.error('adminDb is null');
    process.exit(1);
  }

  try {
    const collections = await adminDb.listCollections();
    console.log('✅ Connected to Firestore successfully!');
    console.log('Found collections:', collections.map(c => c.id));
    process.exit(0);
  } catch (err) {
    console.error('❌ Connection error:', err);
    process.exit(1);
  }
}

main();
