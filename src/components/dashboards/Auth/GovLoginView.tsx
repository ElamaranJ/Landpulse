import React, { useState, useEffect } from 'react';
import { useRole, DEFAULT_PERSONAS } from '../../../context/RoleContext';
import { useModals } from '../../../context/ModalContext';
import { useLocale } from '../../../context/LocaleContext';
import { RoleType, AuthUser } from '../../../types';
import confetti from 'canvas-confetti';
import { signInWithGoogle, loginWithEmail } from '../../../services/firebase';
import {
  CheckCircle2,
  ChevronDown,
  Lock,
  Eye,
  EyeOff,
  RefreshCw,
  Volume2,
  Landmark,
  Shield,
  ArrowRight,
  User,
  Mail,
  Headphones,
  FileText,
  Scale,
  HelpCircle,
} from 'lucide-react';

export const GovLoginView: React.FC = () => {
  const { loginUser } = useRole();
  const { openModal } = useModals();
  const { selectedLanguage, setSelectedLanguage } = useLocale();

  // Role selection: default is officer / command center
  type LoginRoleKey = 'officer' | 'field_officer' | 'project_admin' | 'district_officer' | 'citizen';
  const [selectedRole, setSelectedRole] = useState<LoginRoleKey>('officer');

  // Form fields
  const [emailInput, setEmailInput] = useState('arun.mehta@nic.in');
  const [passwordInput, setPasswordInput] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('8N3PK');
  const [captchaError, setCaptchaError] = useState('');

  // Loading & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sync default email based on selected role
  useEffect(() => {
    if (selectedRole === 'officer') {
      setEmailInput('arun.mehta@nic.in');
    } else if (selectedRole === 'field_officer') {
      setEmailInput('s.murugan.surv@nic.in');
    } else if (selectedRole === 'project_admin') {
      setEmailInput('suresh.iyer@nhai.gov.in');
    } else if (selectedRole === 'district_officer') {
      setEmailInput('collector.palghar@gov.in');
    } else if (selectedRole === 'citizen') {
      setEmailInput('ramesh.patil@citizen.in');
    }
  }, [selectedRole]);

  // Refresh Captcha
  const refreshCaptcha = () => {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaCode(code);
    setCaptchaInput('');
    setCaptchaError('');
  };

  // Audio Captcha
  const speakCaptcha = () => {
    if ('speechSynthesis' in window) {
      const text = captchaCode.split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(`Security code is ${text}`);
      utterance.rate = 0.8;
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Security Code: ${captchaCode}`);
    }
  };

  // Login handler with real token persistence
  const triggerLoginSuccess = (
    user: AuthUser,
    destinationRole: RoleType,
    message: string,
    token?: string
  ) => {
    setIsLoading(true);
    setSuccessMessage(message);

    if (token) {
      localStorage.setItem('landpulse_auth_token', token);
    }

    try {
      confetti({
        particleCount: 50,
        spread: 50,
        origin: { y: 0.6 },
        colors: ['#0B3D66', '#1E3A8A', '#059669'],
      });
    } catch {
      // Ignore confetti errors
    }

    setTimeout(() => {
      loginUser(user, destinationRole, token);
    }, 750);
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.trim() && captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError('Incorrect Security Code.');
      return;
    }
    setCaptchaError('');
    setIsLoading(true);

    const passwordToSend = passwordInput === '••••••••••••' ? 'Password@123' : passwordInput;

    try {
      // 1. Try Firebase Authentication
      try {
        await loginWithEmail(emailInput.trim(), passwordToSend);
      } catch (fbErr) {
        console.warn('[GovLoginView] Firebase direct login fallback to server auth:', fbErr);
      }

      // 2. Validate with backend session
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: emailInput.trim(),
          password: passwordToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setCaptchaError(data.error || 'Authentication failed. Please verify credentials.');
        setIsLoading(false);
        return;
      }

      triggerLoginSuccess(
        data.user,
        data.user.role as RoleType,
        data.message || `Welcome, ${data.user.name}! Authenticated successfully.`,
        data.token
      );
    } catch (err) {
      setCaptchaError('Unable to reach authentication gateway server.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setCaptchaError('');
    try {
      const roleKey = selectedRole === 'officer' ? 'command_center' : selectedRole;
      const res = await signInWithGoogle(roleKey);

      if (!res.success || !res.user) {
        if (res.error) setCaptchaError(res.error);
        setIsGoogleLoading(false);
        return;
      }

      // Send to server to exchange for LandPulse JWT
      const apiRes = await fetch('/api/auth/firebase-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          uid: res.user.uid,
          preferredRole: roleKey,
        }),
      });

      const data = await apiRes.json();
      if (data.success && data.user) {
        triggerLoginSuccess(
          data.user,
          (data.user.role as RoleType) || 'citizen',
          data.message || `Welcome, ${data.user.name}! Authenticated with Google.`,
          data.token
        );
      } else {
        setCaptchaError(data.error || 'Google authentication failed on server.');
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Google sign-in encountered an error.';
      setCaptchaError(errorMsg);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Role title for button label
  const getRoleButtonLabel = () => {
    switch (selectedRole) {
      case 'officer':
        return 'Sign In as Government Officer';
      case 'field_officer':
        return 'Sign In as Field Officer';
      case 'project_admin':
        return 'Sign In as Project Admin';
      case 'district_officer':
        return 'Sign In as District Collector';
      case 'citizen':
        return 'Sign In as Citizen Landowner';
      default:
        return 'Sign In to Gateway';
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F0F5FA] flex flex-col justify-between font-sans relative overflow-x-hidden select-none">
      
      {/* ─────────────────────────────────────────────────────────────
          1. TOP UTILITY: Language Switcher
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto px-6 pt-5 pb-3 flex justify-end items-center z-10">
        <div className="flex items-center gap-2 text-xs sm:text-[13px] text-[#1E3A5F] font-medium">
          <button
            onClick={() => setSelectedLanguage('EN')}
            className={`cursor-pointer hover:underline ${
              selectedLanguage === 'EN' ? 'font-bold text-[#0F2942]' : 'text-slate-600'
            }`}
          >
            English
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={() => setSelectedLanguage('HI')}
            className={`cursor-pointer hover:underline font-hindi ${
              selectedLanguage === 'HI' ? 'font-bold text-[#0F2942]' : 'text-slate-600'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MAIN CENTER: 2-Column Authentication Card
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 my-auto z-10">
        
        {/* Success Alert Toast */}
        {successMessage && (
          <div className="max-w-md mx-auto mb-4 bg-[#163D66] text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 text-xs font-semibold animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="w-full bg-white rounded-3xl shadow-[0_12px_45px_rgba(20,65,105,0.08)] border border-[#D5E3EE] overflow-hidden flex flex-col md:flex-row">
          
          {/* ── Left Column: Identity & Branding with Rural Scenery ── */}
          <div className="w-full md:w-[41%] bg-[#F2F7FB] p-7 sm:p-9 flex flex-col justify-between relative overflow-hidden border-b md:border-b-0 md:border-r border-[#E2ECF5]">
            
            {/* Top Identity Block */}
            <div className="relative z-10">
              {/* National Emblem in Dark Navy */}
              <div className="flex justify-center mb-1">
                <img
                  src="/images/login-emblem-navy.png"
                  alt="Emblem of India"
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Hierarchy Text */}
              <div className="text-center font-sans">
                <span className="text-[11px] font-semibold text-slate-700 block">
                  Government of India
                </span>
                <h2 className="text-[15px] font-bold text-[#0F2942] leading-snug">
                  Ministry of Rural Development
                </h2>
                <span className="text-[12px] text-slate-600 font-medium block">
                  Department of Land Resources
                </span>
              </div>

              {/* Tri-color Accent Bar */}
              <div className="flex items-center justify-center gap-0.5 my-3.5">
                <div className="h-[3px] w-9 bg-[#FF9933] rounded-l-full" />
                <div className="h-[3px] w-9 bg-slate-300" />
                <div className="h-[3px] w-9 bg-[#138808] rounded-r-full" />
              </div>

              {/* Gateway Heading */}
              <div className="text-left mt-2">
                <h1 className="text-[26px] sm:text-[28px] font-bold text-[#144169] leading-[1.18] tracking-tight font-sans">
                  LandPulse<br />Authentication<br />Gateway
                </h1>
                <p className="text-[13px] text-slate-600 font-medium leading-snug mt-2 mb-6">
                  Secure Access for a<br />Transparent Tomorrow
                </p>
              </div>

              {/* 3 Pillars / Feature Rows */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DCEBF8] text-[#1E5A8F] flex items-center justify-center shrink-0">
                    <Shield className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                      Secure &amp; Trusted
                    </h4>
                    <p className="text-[11.5px] text-slate-500 leading-tight">
                      NIC certified platform
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DCEBF8] text-[#1E5A8F] flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                      Single Sign-On
                    </h4>
                    <p className="text-[11.5px] text-slate-500 leading-tight">
                      Access multiple government applications
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#DCEBF8] text-[#1E5A8F] flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-900 leading-tight">
                      For a Digitally Empowered Rural India
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Scenery Artwork with "People Land Progress" script */}
            <div className="mt-6 -mx-7 sm:-mx-9 -mb-7 sm:-mb-9 relative z-0 overflow-hidden">
              <img
                src="/images/login-scenery-left.png"
                alt=""
                aria-hidden="true"
                className="w-full h-auto object-contain object-bottom pointer-events-none"
              />
            </div>
          </div>

          {/* ── Right Column: Sign In Form ── */}
          <div className="w-full md:w-[59%] bg-white p-7 sm:p-10 flex flex-col justify-between">
            <div>
              {/* Form Title */}
              <h2 className="text-[24px] sm:text-[26px] font-bold text-[#0F2942]">
                Portal Sign In
              </h2>
              <p className="text-[12px] text-slate-500 mt-1 mb-6">
                National Single Sign-On (NSSO) • PM GatiShakti • RFCTLARR MIS
              </p>

              <form onSubmit={handleSignIn} className="space-y-4">
                
                {/* 1. Role Selector */}
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                    I am logging in as <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <User className="w-4 h-4" />
                    </div>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as LoginRoleKey)}
                      className="w-full pl-9 pr-8 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-[#163D66]/20 focus:border-[#163D66] transition-colors cursor-pointer"
                    >
                      <option value="officer">Government Officer / Command Center (MoRD / CALA)</option>
                      <option value="field_officer">Field Officer / Surveyor (DGPS &amp; Drone)</option>
                      <option value="project_admin">Project Implementing Agency Admin (NHAI / DFC / Metro)</option>
                      <option value="district_officer">District Collector / CALA Authority</option>
                      <option value="citizen">Citizen Landowner (Aadhaar / Mobile OTP)</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-500">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* 2. Official Email / Parichay ID */}
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                    Official Email / Parichay ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      required
                      value={emailInput}
                      onChange={(e) => setEmailInput(e.target.value)}
                      placeholder="username@nic.in"
                      className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-normal focus:outline-none focus:ring-2 focus:ring-[#163D66]/20 focus:border-[#163D66] transition-colors"
                    />
                  </div>
                </div>

                {/* 3. Password */}
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={passwordInput}
                      onChange={(e) => setPasswordInput(e.target.value)}
                      className="w-full pl-9 pr-16 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-normal tracking-wider focus:outline-none focus:ring-2 focus:ring-[#163D66]/20 focus:border-[#163D66] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1 text-[12px] font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      <span>{showPassword ? 'Hide' : 'Show'}</span>
                    </button>
                  </div>
                </div>

                {/* 4. Security Code (Captcha) */}
                <div>
                  <label className="block text-[12px] font-medium text-slate-700 mb-1.5">
                    Security Code (Captcha) <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-2">
                    {/* Captcha Display Block */}
                    <div className="bg-[#E8EFF7] rounded-lg px-4 py-2 border border-[#CBDCEE] text-[#1E3A5F] font-mono text-[17px] font-bold tracking-[0.25em] select-none text-center min-w-[120px]">
                      {captchaCode}
                    </div>

                    {/* Refresh Button */}
                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-2.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Refresh Captcha"
                      aria-label="Refresh Captcha"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>

                    {/* Audio Speaker Button */}
                    <button
                      type="button"
                      onClick={speakCaptcha}
                      className="p-2.5 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
                      title="Listen to Captcha"
                      aria-label="Listen to Captcha"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>

                    {/* Captcha Input */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Shield className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={captchaInput}
                        onChange={(e) => {
                          setCaptchaInput(e.target.value);
                          setCaptchaError('');
                        }}
                        placeholder="Enter code"
                        className="w-full pl-9 pr-3 py-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-[13px] font-normal uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-[#163D66]/20 focus:border-[#163D66] transition-colors"
                      />
                    </div>
                  </div>
                  {captchaError && (
                    <p className="text-red-500 text-[11px] mt-1 font-medium">{captchaError}</p>
                  )}
                </div>

                {/* 5. Primary Sign In Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#163D66] hover:bg-[#102F4F] text-white py-3 px-6 rounded-lg font-semibold text-[13.5px] flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer mt-5 active:scale-[0.99] disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating...' : getRoleButtonLabel()}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* OR Divider */}
              <div className="relative my-4 text-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <span className="relative bg-white px-3 text-[11px] uppercase font-semibold text-slate-400">
                  OR
                </span>
              </div>

              {/* Sign in with Google (Firebase) */}
              <div className="pt-1">
                <button
                  type="button"
                  disabled={isLoading || isGoogleLoading}
                  onClick={handleGoogleSignIn}
                  className="w-full bg-[#4285F4] hover:bg-[#3367D6] active:bg-[#2A56C6] text-white p-1.5 pr-6 rounded-xl font-medium text-[15.5px] flex items-center shadow-[0_4px_12px_rgba(66,133,244,0.35)] hover:shadow-[0_6px_18px_rgba(66,133,244,0.45)] transition-all cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {/* Circular white container for Google "G" logo */}
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.29 21.36 7.37 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.97 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.29 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                  </div>
                  <span className="flex-1 text-center font-bold text-[15.5px] tracking-wide text-white">
                    {isGoogleLoading ? 'Connecting to Google...' : 'Sign in with Google'}
                  </span>
                </button>
              </div>
            </div>

            {/* 6. Security Assurance Pill */}
            <div className="mt-5 bg-[#EAF6ED] border border-[#CDE9D4] rounded-lg py-2.5 px-3 flex items-center justify-center gap-2 text-[12px] text-[#20633B] font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0" />
              <span>NIC Certified • 256-Bit SSL • TLS 1.3 Active</span>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          3. 4 QUICK ACTION LINKS BELOW THE CARD
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl mx-auto px-4 my-8 z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-300/60 text-slate-700">
          
          {/* Col 1: Citizen Helpdesk */}
          <div className="flex items-center gap-3 px-3">
            <Headphones className="w-5 h-5 text-[#0F2942] shrink-0" />
            <div className="text-left">
              <span className="text-[12px] block text-slate-600">Citizen Helpdesk</span>
              <strong className="text-[13px] font-bold text-slate-900 block">
                1800-11-LAND (5263)
              </strong>
            </div>
          </div>

          {/* Col 2: Officer User Manual */}
          <div className="flex items-center gap-3 px-3 pt-3 md:pt-0">
            <FileText className="w-5 h-5 text-[#0F2942] shrink-0" />
            <div className="text-left">
              <span className="text-[12px] block text-slate-600">Officer User Manual</span>
              <a
                href="/docs/landpulse-officer-manual.pdf"
                target="_blank"
                rel="noreferrer"
                className="text-[12px] font-semibold text-[#163D66] hover:underline block"
              >
                (PDF)
              </a>
            </div>
          </div>

          {/* Col 3: Statutory Terms */}
          <div className="flex items-center gap-3 px-3 pt-3 md:pt-0">
            <Scale className="w-5 h-5 text-[#0F2942] shrink-0" />
            <div className="text-left">
              <button
                onClick={() => openModal('privacyPolicy')}
                className="text-[12px] block text-slate-600 hover:text-slate-900 text-left cursor-pointer"
              >
                Statutory Terms
              </button>
              <span className="text-[12px] text-slate-500 block">(IT Act 2000)</span>
            </div>
          </div>

          {/* Col 4: Need Help? */}
          <div className="flex items-center gap-3 px-3 pt-3 md:pt-0">
            <HelpCircle className="w-5 h-5 text-[#0F2942] shrink-0" />
            <div className="text-left">
              <span className="text-[12px] block text-slate-600">Need Help?</span>
              <button
                onClick={() => openModal('about')}
                className="text-[12px] font-semibold text-[#163D66] hover:underline block cursor-pointer"
              >
                Contact Support
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────────
          4. BOTTOM DARK NAVY BAR
      ───────────────────────────────────────────────────────────── */}
      <div className="w-full bg-[#0F2A44] text-slate-300 py-3.5 px-6 sm:px-12 text-xs border-t border-[#1E4366] z-10">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="text-center md:text-left text-slate-300 text-[11px] sm:text-xs">
            © 2026 Government of India &nbsp;|&nbsp; Ministry of Rural Development &nbsp;|&nbsp; Department of Land Resources
          </div>
          <div className="flex items-center gap-3 text-[11px] sm:text-xs text-slate-300">
            <button
              onClick={() => openModal('privacyPolicy')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Privacy Policy
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => openModal('privacyPolicy')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Terms of Use
            </button>
            <span className="text-slate-500">|</span>
            <button
              onClick={() => openModal('siteMap')}
              className="hover:text-white hover:underline cursor-pointer"
            >
              Site Map
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
