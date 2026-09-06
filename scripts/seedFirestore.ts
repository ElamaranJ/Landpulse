import { adminDb, adminAuth } from '../server/config/firebaseAdmin';
import {
  NATIONAL_STATS,
  MOCK_PROJECTS,
  MOCK_STATES,
  MOCK_CITIZEN_CASE,
  MOCK_FIELD_PARCELS,
  MOCK_DISTRICT_CASES,
  MOCK_CRITICAL_ALERTS,
  MOCK_RISK_ITEMS,
} from '../src/data/mockData';
import { MOCK_PARCELS } from '../src/data/parcelsData';
import { DEFAULT_PERSONAS } from '../src/context/RoleContext';

async function seedFirestore() {
  console.log('🚀 Starting LandPulse Firestore Database Seed...');

  if (!adminDb) {
    console.error('❌ Firestore Admin DB not initialized. Ensure server/config/serviceAccountKey.json is valid.');
    process.exit(1);
  }

  try {
    // 1. Seed nationalStats (singleton document)
    console.log('📦 Seeding nationalStats/overview...');
    await adminDb.collection('nationalStats').doc('overview').set({
      ...NATIONAL_STATS,
      updatedAt: new Date().toISOString(),
    });

    // 2. Seed projects
    console.log(`📦 Seeding projects (${MOCK_PROJECTS.length} documents)...`);
    const projectBatch = adminDb.batch();
    for (const project of MOCK_PROJECTS) {
      const docRef = adminDb.collection('projects').doc(project.id);
      projectBatch.set(docRef, { ...project, updatedAt: new Date().toISOString() });
    }
    await projectBatch.commit();

    // 3. Seed states
    console.log(`📦 Seeding states (${MOCK_STATES.length} documents)...`);
    const stateBatch = adminDb.batch();
    for (const state of MOCK_STATES) {
      const docRef = adminDb.collection('states').doc(state.id);
      stateBatch.set(docRef, { ...state, updatedAt: new Date().toISOString() });
    }
    await stateBatch.commit();

    // 4. Seed citizenCases
    console.log('📦 Seeding citizenCases...');
    const citizenCases = [
      MOCK_CITIZEN_CASE,
      {
        ...MOCK_CITIZEN_CASE,
        caseId: 'MH-PAL-2024-8821', // Primary alias used in UI search
        landownerName: 'Ramesh Tukaram Patil',
        phone: '+91 98201 44521',
      },
      {
        ...MOCK_CITIZEN_CASE,
        caseId: 'CAS-PLG-002',
        surveyNumber: '143/1A',
        khataNumber: 'KT-88903',
        landownerName: 'Sunita Devendra Raut',
        phone: '+91 94220 18492',
        landAreaAcre: 1.4,
        landType: 'Residential + Commercial Shed',
        currentStageIndex: 2,
        estimatedValuationCr: 2.1,
        awardedCompensationCr: 2.4,
        disbursedCompensationCr: 0,
      },
    ];
    for (const cCase of citizenCases) {
      await adminDb.collection('citizenCases').doc(cCase.caseId).set({
        ...cCase,
        updatedAt: new Date().toISOString(),
      });
    }

    // 5. Seed fieldParcels
    console.log(`📦 Seeding fieldParcels (${MOCK_FIELD_PARCELS.length} documents)...`);
    const fieldBatch = adminDb.batch();
    for (const fp of MOCK_FIELD_PARCELS) {
      const docRef = adminDb.collection('fieldParcels').doc(fp.id);
      fieldBatch.set(docRef, { ...fp, updatedAt: new Date().toISOString() });
    }
    await fieldBatch.commit();

    // 6. Seed districtCases
    console.log(`📦 Seeding districtCases (${MOCK_DISTRICT_CASES.length} documents)...`);
    const distBatch = adminDb.batch();
    for (const dc of MOCK_DISTRICT_CASES) {
      const docRef = adminDb.collection('districtCases').doc(dc.id);
      distBatch.set(docRef, { ...dc, updatedAt: new Date().toISOString() });
    }
    await distBatch.commit();

    // 7. Seed criticalAlerts
    console.log(`📦 Seeding criticalAlerts (${MOCK_CRITICAL_ALERTS.length} documents)...`);
    const alertBatch = adminDb.batch();
    for (const alert of MOCK_CRITICAL_ALERTS) {
      const docRef = adminDb.collection('criticalAlerts').doc(alert.id);
      alertBatch.set(docRef, { ...alert, updatedAt: new Date().toISOString() });
    }
    await alertBatch.commit();

    // 8. Seed riskItems
    console.log(`📦 Seeding riskItems (${MOCK_RISK_ITEMS.length} documents)...`);
    const riskBatch = adminDb.batch();
    for (const rsk of MOCK_RISK_ITEMS) {
      const docRef = adminDb.collection('riskItems').doc(rsk.id);
      riskBatch.set(docRef, { ...rsk, updatedAt: new Date().toISOString() });
    }
    await riskBatch.commit();

    // 9. Seed parcels (GIS Cadastral Parcels)
    console.log(`📦 Seeding parcels (${MOCK_PARCELS.length} documents)...`);
    // Firestore does not allow nested arrays [[lat, lng], [lat, lng]]
    // Convert to [{ lat, lng }] and store coordinatesJson for lossless roundtrip
    const chunkSize = 400;
    for (let i = 0; i < MOCK_PARCELS.length; i += chunkSize) {
      const chunk = MOCK_PARCELS.slice(i, i + chunkSize);
      const parcelBatch = adminDb.batch();
      for (const p of chunk) {
        const docRef = adminDb.collection('parcels').doc(p.id);
        const firestoreParcel = {
          ...p,
          coordinates: p.coordinates.map(([lat, lng]) => ({ lat, lng })),
          coordinatesJson: JSON.stringify(p.coordinates),
          centroid: p.centroid,
          updatedAt: new Date().toISOString(),
        };
        parcelBatch.set(docRef, firestoreParcel);
      }
      await parcelBatch.commit();
    }

    // 10. Seed Users & Demo Auth Personas in Firebase Auth & Firestore 'users' collection
    console.log('👤 Seeding Demo Users & Firebase Authentication accounts...');
    const demoAccounts = [
      {
        email: 'arun.mehta@nic.in',
        password: 'Password@123',
        displayName: 'Shri Arun K. Mehta, IAS',
        persona: DEFAULT_PERSONAS.command_center,
      },
      {
        email: 'suresh.iyer@nhai.gov.in',
        password: 'Password@123',
        displayName: 'Suresh Iyer, IES',
        persona: DEFAULT_PERSONAS.project_admin,
      },
      {
        email: 'cala.palghar@gov.in',
        password: 'Password@123',
        displayName: 'Dr. Rajeshwar Verma, IAS',
        persona: DEFAULT_PERSONAS.district_officer,
      },
      {
        email: 's.murugan.surv@nic.in',
        password: 'Password@123',
        displayName: 'S. Murugan',
        persona: DEFAULT_PERSONAS.field_officer,
      },
      {
        email: 'ramesh.patil@citizen.in',
        password: 'Password@123',
        displayName: 'Ramesh Narayan Patel',
        phone: '+919820144521',
        persona: DEFAULT_PERSONAS.citizen,
      },
    ];

    for (const acc of demoAccounts) {
      let uid: string;
      if (adminAuth) {
        try {
          // Check if auth user exists
          const existing = await adminAuth.getUserByEmail(acc.email);
          uid = existing.uid;
          await adminAuth.updateUser(uid, {
            password: acc.password,
            displayName: acc.displayName,
          });
        } catch {
          // Create new user in Firebase Auth
          const created = await adminAuth.createUser({
            email: acc.email,
            password: acc.password,
            displayName: acc.displayName,
          });
          uid = created.uid;
        }

        // Set custom claims for role
        await adminAuth.setCustomUserClaims(uid, {
          role: acc.persona.role,
        });

        // Write profile document into Firestore 'users' collection
        await adminDb.collection('users').doc(uid).set({
          ...acc.persona,
          uid,
          email: acc.email,
          updatedAt: new Date().toISOString(),
        });

        // Also save indexed by email for easy lookup
        await adminDb.collection('usersByEmail').doc(acc.email.toLowerCase()).set({
          uid,
          role: acc.persona.role,
          name: acc.persona.name,
        });
      }
    }

    console.log('🎉 [Seed Complete] All 10 collections seeded successfully into Cloud Firestore!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error seeding Firestore:', err);
    process.exit(1);
  }
}

seedFirestore();
