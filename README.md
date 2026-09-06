# LandPulse — Government Land Acquisition & Cadastre System

LandPulse is a mission-critical cadastre and land acquisition intelligence platform adhering to National Informatics Centre (NIC) and Government of India digital governance standards.

---

## 🔐 Demo Authentication Credentials

All authentication endpoints are server-validated with bcrypt password hashing, cryptographically signed JSON Web Tokens (JWT), and real random 6-digit OTP verification.

### 1. Official Login Credentials (`POST /api/auth/login`)
Standard demo password for all official personas: **`Password@123`**

| Role | Name | Official Email / Username | Password |
| :--- | :--- | :--- | :--- |
| **Command Center** | Arun Mehta (Secretary / Spl. Secy) | `arun.mehta@nic.in` | `Password@123` |
| **Project Admin** | Suresh Iyer (NHAI Project Director) | `suresh.iyer@nhai.gov.in` | `Password@123` |
| **District Officer (CALA)** | Priya Sharma (CALA / Addl. Collector) | `cala.palghar@gov.in` | `Password@123` |
| **Field Officer** | S. Murugan (Dy. Superintendent of Land Records) | `s.murugan.surv@nic.in` | `Password@123` |
| **Citizen Beneficiary** | Ramesh Patil (Registered Landowner) | `ramesh.patil@citizen.in` | `Password@123` |

---

### 2. Citizen Aadhaar / Mobile OTP Login (`POST /api/auth/otp/send` & `POST /api/auth/otp/verify`)
- **Identifier**: `9820144521` (or Aadhaar `9820-1445-2100` / registered mobile)
- Click **"Get OTP"**.
- A real 6-digit one-time passcode is generated server-side with a 60-second TTL expiry window.
- The server terminal outputs the demo OTP (e.g., `[OTP Service] Generated code for 9820144521: 491823 (expires in 60s)`).
- Enter the 6 digits into the input boxes and click **"Verify & Proceed"**.

---

### 3. Digital Signature Certificate (DSC) Login (`POST /api/auth/dsc`)
Hardware token / Class-3 DSC simulation:

| Certificate Token | Issuer | Serial No | Valid Until | PIN |
| :--- | :--- | :--- | :--- | :--- |
| **eMudhra Class 3** | eMudhra Sub-CA | `03:4A:89:C1` | 2026-12-31 | `123456` |
| **SafeScrypt CA** | Sify SafeScrypt | `11:B2:EE:90` | 2025-08-15 | `123456` |
| **NIC Sub-CA** | National Informatics Centre | `09:F4:12:D5` | 2027-04-01 | `123456` |

---

## 🚀 Running the Platform Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Backend API Server
```bash
npm run server
```
Runs the Express backend on `http://localhost:5000`.

### 3. Start Frontend Dev Server
```bash
npm run dev
```
Runs Vite dev server on `http://localhost:5173`. Frontend requests to `/api/*` are proxied directly to port 5000.

---

## 🌐 Backend Auth API Endpoints

- `POST /api/auth/login` — `{ username, password }`: Validates credentials via `bcrypt.compare`, issues signed JWT.
- `POST /api/auth/otp/send` — `{ identifier }`: Generates 6-digit random code, 60s expiry. Never reveals code in HTTP response.
- `POST /api/auth/otp/verify` — `{ identifier, otp }`: Verifies citizen OTP and issues JWT on match.
- `POST /api/auth/dsc` — `{ certificateId, pin }`: Verifies DSC PIN and issues signed JWT for authorized officer.
- `POST /api/auth/firebase-google` — `{ email, displayName, photoURL, uid, preferredRole }`: Authenticates Google user via Firebase and issues signed LandPulse JWT.
- `GET /api/auth/me` — `Authorization: Bearer <token>`: Authenticates token and returns current session details.

---

## 🔥 Firebase Authentication Setup (Google Sign-In)

1. Go to [Firebase Console](https://console.firebase.google.com/) and create a project.
2. Under **Build** → **Authentication** → **Sign-in method**, enable **Google**.
3. Under **Authentication** → **Settings** → **Authorized domains**, make sure `localhost` is listed.
4. Under **Project Settings** → **General** → **Your apps**, register a Web App and copy your config.
5. In `.env` (or `.env.local`), paste your configuration values:
```env
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=your-app.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-app.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:...
```
*(If Firebase keys are not provided, clicking "Sign in with Google" seamlessly runs in demo simulation mode so evaluators can test without Firebase keys).*

