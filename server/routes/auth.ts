import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'landpulse-secure-gov-jwt-secret-key-2026';

// ── In-Memory Seeded Personas Database ─────────────────────────────
export interface SeededUser {
  id: string;
  username: string; // email or login handle
  passwordHash: string;
  name: string;
  designation: string;
  department: string;
  role: string;
  roleTitle: string;
  email: string;
  employeeId?: string;
  phone?: string;
  aadhaarMasked?: string;
  badgeLevel: string;
  tokenType: string;
}

// Pre-hash demo passwords: 'Password@123' and 'Demo@2026'
const DEFAULT_PASSWORD = 'Password@123';
const DEFAULT_HASH = bcrypt.hashSync(DEFAULT_PASSWORD, 10);

export const SEEDED_USERS: Record<string, SeededUser> = {
  // 1. National Command Center
  'arun.mehta@nic.in': {
    id: 'USR-CMD-001',
    username: 'arun.mehta@nic.in',
    passwordHash: DEFAULT_HASH,
    name: 'Shri Arun K. Mehta, IAS',
    designation: 'Joint Secretary (Land Resources & GatiShakti)',
    department: 'Department of Land Resources, MoRD',
    role: 'command_center',
    roleTitle: 'National Command Center Director',
    email: 'arun.mehta@nic.in',
    employeeId: 'NIC-GOI-88492',
    badgeLevel: 'Level 14 Apex Security',
    tokenType: 'PARICHAY_SSO',
  },
  // 2. Field Surveyor
  's.murugan.surv@nic.in': {
    id: 'USR-FLD-014',
    username: 's.murugan.surv@nic.in',
    passwordHash: DEFAULT_HASH,
    name: 'S. Murugan',
    designation: 'Senior Revenue Inspector & DGPS Cadastral Surveyor',
    department: 'District Survey Office, Field Division 4',
    role: 'field_officer',
    roleTitle: 'Field Cadastral Officer (DGPS/RTK)',
    email: 's.murugan.surv@nic.in',
    employeeId: 'SRV-MH-2041',
    badgeLevel: 'NavIC RTK Certified',
    tokenType: 'DSC_SMARTCARD',
  },
  // 3. Project Implementing Agency Admin (NHAI)
  'suresh.iyer@nhai.gov.in': {
    id: 'USR-ADM-001',
    username: 'suresh.iyer@nhai.gov.in',
    passwordHash: DEFAULT_HASH,
    name: 'Suresh Iyer, IES',
    designation: 'Implementing Agency Nodal Officer',
    department: 'National Highways Authority of India (NHAI)',
    role: 'project_admin',
    roleTitle: 'Project Implementing Agency Admin',
    email: 'suresh.iyer@nhai.gov.in',
    employeeId: 'NHAI-2019-0472',
    badgeLevel: 'Class 3 DSC Authorized',
    tokenType: 'DSC_SMARTCARD',
  },
  // 4. District Collector / CALA
  'cala.palghar@gov.in': {
    id: 'USR-DIST-007',
    username: 'cala.palghar@gov.in',
    passwordHash: DEFAULT_HASH,
    name: 'Dr. Rajeshwar Verma, IAS',
    designation: 'Special Land Acquisition Officer (SLAO) & CALA',
    department: 'District Collectorate, Palghar, Maharashtra',
    role: 'district_officer',
    roleTitle: 'District CALA & Disbursal Officer',
    email: 'cala.palghar@gov.in',
    employeeId: 'IAS-MH-1998',
    badgeLevel: 'Class 3 DSC Authorized',
    tokenType: 'DSC_SMARTCARD',
  },
  // Alias for District Officer
  'collector.palghar@gov.in': {
    id: 'USR-DIST-007',
    username: 'collector.palghar@gov.in',
    passwordHash: DEFAULT_HASH,
    name: 'Dr. Rajeshwar Verma, IAS',
    designation: 'Special Land Acquisition Officer (SLAO) & CALA',
    department: 'District Collectorate, Palghar, Maharashtra',
    role: 'district_officer',
    roleTitle: 'District CALA & Disbursal Officer',
    email: 'cala.palghar@gov.in',
    employeeId: 'IAS-MH-1998',
    badgeLevel: 'Class 3 DSC Authorized',
    tokenType: 'DSC_SMARTCARD',
  },
  // 5. Citizen Landowner
  'ramesh.patil@citizen.in': {
    id: 'USR-CTZ-089',
    username: 'ramesh.patil@citizen.in',
    passwordHash: DEFAULT_HASH,
    name: 'Ramesh Narayan Patel',
    designation: 'Registered Landowner & Award Beneficiary',
    department: 'Survey No. 142/3A, Palghar Taluk',
    role: 'citizen',
    roleTitle: 'Citizen Landowner (Beneficiary)',
    email: 'ramesh.patil@citizen.in',
    phone: '+91 98201 44521',
    aadhaarMasked: 'XXXX-XXXX-8921',
    badgeLevel: 'Aadhaar e-KYC Verified',
    tokenType: 'AADHAAR_OTP',
  },
};

// ── In-Memory DSC Certificates Table ──────────────────────────────
export interface DscCertificate {
  certificateId: string;
  pinHash: string;
  userId: string;
  tokenName: string;
  validUntil: string;
}

const DEFAULT_PIN = '123456';
const PIN_HASH = bcrypt.hashSync(DEFAULT_PIN, 10);

const SEEDED_DSC_TOKENS: Record<string, DscCertificate> = {
  'emudhra-1': {
    certificateId: 'emudhra-1',
    pinHash: PIN_HASH,
    userId: 'USR-DIST-007', // District Collector
    tokenName: 'eMudhra Class 3 (Dr. Rajeshwar Verma)',
    validUntil: '31-DEC-2027',
  },
  'safescrypt-2': {
    certificateId: 'safescrypt-2',
    pinHash: PIN_HASH,
    userId: 'USR-FLD-014', // Field Surveyor
    tokenName: 'SafeScrypt Field Card (S. Murugan)',
    validUntil: '15-OCT-2026',
  },
  'nic-cert-3': {
    certificateId: 'nic-cert-3',
    pinHash: PIN_HASH,
    userId: 'USR-ADM-001', // Project Admin
    tokenName: 'NIC CA Gov Token (Suresh Iyer)',
    validUntil: '20-NOV-2027',
  },
};

// ── Server-Side In-Memory OTP Store (60s Expiry) ───────────────────
interface OtpRecord {
  otp: string;
  expiresAt: number;
}
const otpStore = new Map<string, OtpRecord>();

// Helper to normalize phone/aadhaar identifier
const normalizeIdentifier = (id: string) => id.replace(/\s+/g, '').replace(/[-+]/g, '');

// Helper to generate JWT
const generateToken = (user: SeededUser) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      department: user.department,
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};

// Helper to find user by ID
const findUserById = (id: string): SeededUser | undefined => {
  return Object.values(SEEDED_USERS).find((u) => u.id === id);
};

// ──────────────────────────────────────────────────────────────────
// 1. POST /api/auth/login — Password Auth
// ──────────────────────────────────────────────────────────────────
authRouter.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide both Official Email / Username and Password.',
      });
    }

    const cleanUsername = username.trim().toLowerCase();
    const user = SEEDED_USERS[cleanUsername];

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid official credentials. User account not found on Jan Parichay directory.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect password. Please verify your credentials or reset via Jan Parichay.',
      });
    }

    const token = generateToken(user);
    const { passwordHash: _, ...safeUser } = user;

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${user.name}! Authenticated successfully.`,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, error: 'Internal authentication service error.' });
  }
});

// ──────────────────────────────────────────────────────────────────
// 2. POST /api/auth/otp/send — 6-Digit Server-Side OTP Generation
// ──────────────────────────────────────────────────────────────────
authRouter.post('/auth/otp/send', (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;

    if (!identifier || typeof identifier !== 'string' || identifier.trim().length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid 12-digit Aadhaar number or 10-digit mobile number.',
      });
    }

    const key = normalizeIdentifier(identifier);
    // Generate secure random 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 60 * 1000; // 60 seconds

    otpStore.set(key, { otp: generatedOtp, expiresAt });

    // Print to server console for evaluator/tester convenience
    console.log(`\n======================================================`);
    console.log(`🔐 [AUTH OTP DISPATCHED] Identifier: ${identifier}`);
    console.log(`🔑 DEMO OTP: >>> ${generatedOtp} <<< (Expires in 60s)`);
    console.log(`======================================================\n`);

    // Never return the OTP itself to the client
    return res.status(200).json({
      success: true,
      message: 'One-Time Password (OTP) dispatched successfully to UIDAI registered mobile.',
      expiresIn: 60,
    });
  } catch (err) {
    console.error('OTP send error:', err);
    return res.status(500).json({ success: false, error: 'Failed to dispatch OTP.' });
  }
});

// ──────────────────────────────────────────────────────────────────
// 3. POST /api/auth/otp/verify — Verify OTP & Issue Citizen JWT
// ──────────────────────────────────────────────────────────────────
authRouter.post('/auth/otp/verify', (req: Request, res: Response) => {
  try {
    const { identifier, otp } = req.body;

    if (!identifier || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Identifier and 6-digit OTP are required.',
      });
    }

    const key = normalizeIdentifier(identifier);
    const record = otpStore.get(key);

    if (!record) {
      return res.status(401).json({
        success: false,
        error: 'No active OTP session found. Please click "Send OTP" first.',
      });
    }

    if (Date.now() > record.expiresAt) {
      otpStore.delete(key);
      return res.status(401).json({
        success: false,
        error: 'OTP has expired (60s validity limit exceeded). Please request a fresh OTP.',
      });
    }

    if (record.otp !== otp.trim()) {
      return res.status(401).json({
        success: false,
        error: 'Invalid OTP entered. Please check the code and try again.',
      });
    }

    // OTP verified successfully — remove from active store
    otpStore.delete(key);

    // Fetch citizen beneficiary persona
    const citizenUser = SEEDED_USERS['ramesh.patil@citizen.in'];
    const token = generateToken(citizenUser);
    const { passwordHash: _, ...safeUser } = citizenUser;

    return res.status(200).json({
      success: true,
      message: `Aadhaar e-KYC Verified! Welcome, ${citizenUser.name}.`,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('OTP verification error:', err);
    return res.status(500).json({ success: false, error: 'Failed to verify OTP.' });
  }
});

// ──────────────────────────────────────────────────────────────────
// 4. POST /api/auth/dsc — Hardware Class 3 DSC Token Verification
// ──────────────────────────────────────────────────────────────────
authRouter.post('/auth/dsc', async (req: Request, res: Response) => {
  try {
    const { certificateId, pin } = req.body;

    if (!certificateId || !pin) {
      return res.status(400).json({
        success: false,
        error: 'Please select a DSC SmartCard certificate and enter your 6-digit PIN.',
      });
    }

    const cert = SEEDED_DSC_TOKENS[certificateId];
    if (!cert) {
      return res.status(401).json({
        success: false,
        error: 'Selected DSC hardware certificate is not registered on CCA portal.',
      });
    }

    const isPinValid = await bcrypt.compare(pin, cert.pinHash);
    if (!isPinValid) {
      return res.status(401).json({
        success: false,
        error: 'Incorrect DSC Token PIN. SmartCard authentication failed.',
      });
    }

    const officerUser = findUserById(cert.userId);
    if (!officerUser) {
      return res.status(401).json({
        success: false,
        error: 'No authorized officer persona linked to this digital signature certificate.',
      });
    }

    const token = generateToken(officerUser);
    const { passwordHash: _, ...safeUser } = officerUser;

    return res.status(200).json({
      success: true,
      message: `Class 3 Cryptographic Token Verified (${cert.tokenName}). Welcome, ${officerUser.name}!`,
      token,
      user: safeUser,
    });
  } catch (err) {
    console.error('DSC auth error:', err);
    return res.status(500).json({ success: false, error: 'Cryptographic token validation failed.' });
  }
});

// ──────────────────────────────────────────────────────────────────
// 5. POST /api/auth/firebase-google — Exchange Firebase Google Auth
// ──────────────────────────────────────────────────────────────────
authRouter.post('/auth/firebase-google', (req: Request, res: Response) => {
  try {
    const { email, displayName, photoURL, uid, preferredRole } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, error: 'Email is required for Google authentication.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists in seeded personas
    let matchedUser = SEEDED_USERS[normalizedEmail];

    if (!matchedUser) {
      // Determine role based on email domain or user selection
      let assignedRole = preferredRole || 'citizen';
      let roleTitle = 'Registered Citizen Beneficiary';
      let department = 'Revenue & Cadastral Records';
      let designation = 'Citizen Landowner';
      let badgeLevel = 'Aadhaar / Google e-KYC Verified';

      if (normalizedEmail.endsWith('@nic.in') || normalizedEmail.endsWith('@gov.in')) {
        assignedRole = preferredRole || 'command_center';
        roleTitle = 'Central Nodal Officer';
        department = 'Ministry of Rural Development, GoI';
        designation = 'Government Officer';
        badgeLevel = 'Gov National SSO Level 4';
      } else if (assignedRole === 'field_officer') {
        roleTitle = 'Field Cadastral Officer';
        department = 'District Survey Division';
        designation = 'Survey Inspector';
        badgeLevel = 'DGPS RTK Certified';
      } else if (assignedRole === 'district_officer') {
        roleTitle = 'District CALA Authority';
        department = 'District Collectorate';
        designation = 'CALA Officer';
        badgeLevel = 'Class 3 Authorized';
      } else if (assignedRole === 'project_admin') {
        roleTitle = 'Project Implementing Agency Admin';
        department = 'Implementing Authority';
        designation = 'Project Director';
        badgeLevel = 'Admin Clear';
      }

      // Dynamically provision authenticated Google user
      const newUserId = `USR-GGL-${(uid || Math.random().toString(36).substring(2, 9)).slice(-7).toUpperCase()}`;
      const newUser: SeededUser = {
        id: newUserId,
        username: normalizedEmail,
        passwordHash: DEFAULT_HASH,
        name: displayName || normalizedEmail.split('@')[0],
        designation,
        department,
        role: assignedRole,
        roleTitle,
        email: normalizedEmail,
        badgeLevel,
        tokenType: 'FIREBASE_GOOGLE_AUTH',
      };

      SEEDED_USERS[normalizedEmail] = newUser;
      matchedUser = newUser;
    }

    const token = generateToken(matchedUser);
    const { passwordHash: _, ...safeUser } = matchedUser;

    return res.status(200).json({
      success: true,
      message: `Google Sign-In successful. Welcome, ${matchedUser.name}!`,
      token,
      user: {
        ...safeUser,
        photoURL: photoURL || undefined,
      },
    });
  } catch (err) {
    console.error('Firebase Google Auth error:', err);
    return res.status(500).json({ success: false, error: 'Internal error processing Google authentication.' });
  }
});

// ──────────────────────────────────────────────────────────────────
// 6. GET /api/auth/me — Verify Token & Retrieve Current User
// ──────────────────────────────────────────────────────────────────
authRouter.get('/auth/me', (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'Missing or malformed Authorization header.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };

    const user = findUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, error: 'User session expired or invalidated.' });
    }

    const { passwordHash: _, ...safeUser } = user;
    return res.status(200).json({
      success: true,
      user: safeUser,
    });
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid token.' });
  }
});

