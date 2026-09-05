import React, { useState, useEffect } from 'react';
import { useRole, DEFAULT_PERSONAS } from '../../../context/RoleContext';
import { RoleType, AuthUser } from '../../../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Lock,
  RefreshCw,
  Volume2,
  KeyRound,
  FileCheck2,
  Smartphone,
  CreditCard,
  Building2,
  Fingerprint,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Download,
  PhoneCall,
  Eye,
  EyeOff,
  Cpu,
  Landmark,
  Shield,
  FileText,
} from 'lucide-react';

export const GovLoginView: React.FC = () => {
  const { loginUser } = useRole();

  // Active Login Tab
  const [activeTab, setActiveTab] = useState<'official' | 'citizen' | 'dsc'>('official');

  // Official Login Form State
  const [officialUsername, setOfficialUsername] = useState('arun.mehta@nic.in');
  const [officialPassword, setOfficialPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('8N3PK');
  const [captchaError, setCaptchaError] = useState('');
  const [isSpeakingCaptcha, setIsSpeakingCaptcha] = useState(false);

  // Citizen Login Form State
  const [citizenMethod, setCitizenMethod] = useState<'aadhaar' | 'mobile' | 'caseId'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('4829 1048 8921');
  const [mobileNumber, setMobileNumber] = useState('98201 44521');
  const [caseIdInput, setCaseIdInput] = useState('MH-PAL-2024-8821');
  const [otpSent, setOtpSent] = useState(false);
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [consentChecked, setConsentChecked] = useState(true);

  // DSC Form State
  const [selectedToken, setSelectedToken] = useState('emudhra-1');
  const [dscPin, setDscPin] = useState('••••••');

  // General Loading & Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Generate random captcha code
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

  // Audio Captcha Text-To-Speech
  const speakCaptcha = () => {
    if ('speechSynthesis' in window) {
      setIsSpeakingCaptcha(true);
      const text = captchaCode.split('').join(' ');
      const utterance = new SpeechSynthesisUtterance(`Security code is ${text}`);
      utterance.rate = 0.8;
      utterance.onend = () => setIsSpeakingCaptcha(false);
      window.speechSynthesis.speak(utterance);
    } else {
      alert(`Security Code: ${captchaCode}`);
    }
  };

  // OTP Timer Countdown
  useEffect(() => {
    let interval: any = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const triggerLoginSuccess = (user: AuthUser, destinationRole: RoleType, message: string) => {
    setIsLoading(true);
    setSuccessMessage(message);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0B3D66', '#1E3A8A', '#059669'],
      });
    } catch {
      // Ignore confetti errors
    }

    setTimeout(() => {
      loginUser(user, destinationRole);
    }, 1000);
  };

  // Handle Official Form Submit
  const handleOfficialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError('Incorrect Security Code. Please try again.');
      return;
    }
    setCaptchaError('');

    const targetUser: AuthUser = {
      ...DEFAULT_PERSONAS.command_center,
      email: officialUsername || 'officer@gov.in',
      loginTime: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    triggerLoginSuccess(
      targetUser,
      'command_center',
      `Welcome, ${targetUser.name}! Authenticated via Jan Parichay SSO.`
    );
  };

  // Handle Citizen OTP Generation
  const handleSendOtp = () => {
    if (!consentChecked) {
      alert('Please agree to Aadhaar e-KYC consent declaration.');
      return;
    }
    setOtpSent(true);
    setOtpTimer(60);
  };

  // Handle Citizen Login
  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const targetUser: AuthUser = {
      ...DEFAULT_PERSONAS.citizen,
      loginTime: new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    triggerLoginSuccess(
      targetUser,
      'citizen',
      `Welcome, ${targetUser.name}! Land parcel records loaded.`
    );
  };

  // Handle DSC Login
  const handleDscSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDistrict = selectedToken === 'emudhra-1';
    const targetUser = isDistrict ? DEFAULT_PERSONAS.district_officer : DEFAULT_PERSONAS.field_officer;

    triggerLoginSuccess(
      targetUser,
      targetUser.role,
      `Class-3 DSC Token Authenticated. Welcome, ${targetUser.name}!`
    );
  };

  // Handle Subtle Quick Access Role Login
  const handlePersonaLogin = (key: keyof typeof DEFAULT_PERSONAS) => {
    const persona = DEFAULT_PERSONAS[key];
    triggerLoginSuccess(
      persona,
      persona.role,
      `Logged in as ${persona.name} (${persona.roleTitle})`
    );
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-[calc(100vh-160px)] py-8 px-4 sm:px-8 2xl:px-20 font-sans">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">

        {/* Feedback Alert if logging in */}
        {successMessage && (
          <div className="bg-[#0B3D66] text-white px-5 py-3.5 rounded-lg shadow-md flex items-center gap-3 border-l-4 border-amber-400 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-300" />
            <div className="font-semibold text-sm">{successMessage}</div>
          </div>
        )}

        {/* 2-Column Main Layout: Left Form + Right Quick Access Roles & Helpdesk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================================= */}
          {/* LEFT 7 COLS: Government Standard Authentication Form Box                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
            
            {/* Header / Portal Title Banner */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#0B3D66]">
                  Portal Authentication Gateway
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  National Single Sign-On (NSSO) • PM GatiShakti • RFCTLARR MIS
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-[11px] font-semibold">256-Bit SSL</span>
              </div>
            </div>

            {/* Standard Understated Tabs (like eGramSwaraj / DigiLocker / UMANG) */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('official')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'official'
                    ? 'bg-white text-[#0B3D66] border-[#0B3D66] font-bold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#0B3D66]" />
                <span>Official SSO (Parichay)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('citizen')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'citizen'
                    ? 'bg-white text-[#0B3D66] border-[#0B3D66] font-bold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-slate-700" />
                <span>Citizen / Landowner</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dsc')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'dsc'
                    ? 'bg-white text-[#0B3D66] border-[#0B3D66] font-bold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span>DSC Token (Class 3)</span>
              </button>
            </div>

            {/* TAB 1: OFFICIAL SSO FORM */}
            {activeTab === 'official' && (
              <form onSubmit={handleOfficialSubmit} className="p-6 sm:p-8 space-y-5">
                {/* Username / Employee ID */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Official Email / Employee ID / Parichay ID <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={officialUsername}
                      onChange={(e) => setOfficialUsername(e.target.value)}
                      placeholder="e.g. arun.mehta@nic.in or IAS-MH-1998"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] focus:border-[#0B3D66] text-slate-900"
                    />
                    <span className="absolute right-3 top-2 text-xs text-slate-400 font-mono">@gov.in / @nic.in</span>
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Password reset instructions sent to registered NIC email/mobile.');
                      }}
                      className="text-xs text-[#0B3D66] hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={officialPassword}
                      onChange={(e) => setOfficialPassword(e.target.value)}
                      placeholder="Enter your account password"
                      className="w-full px-3.5 py-2 pr-10 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] focus:border-[#0B3D66] text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 text-slate-400 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Real Government Styled Compact CAPTCHA */}
                <div className="bg-slate-50 p-4 rounded border border-slate-200 space-y-2.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Security Code (CAPTCHA) <span className="text-red-500">*</span>
                  </label>
                  
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Captcha Box with distortion pattern */}
                    <div className="px-4 py-1.5 bg-slate-200 border border-slate-300 rounded font-mono text-lg font-black tracking-[0.3em] text-[#0B3D66] select-none shadow-inner relative overflow-hidden">
                      <div className="absolute inset-0 opacity-15 pointer-events-none bg-[repeating-linear-gradient(45deg,#000_0,#000_2px,transparent_0,transparent_6px)]" />
                      <span className="relative z-10 italic inline-block">{captchaCode}</span>
                    </div>

                    <button
                      type="button"
                      onClick={refreshCaptcha}
                      className="p-2 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors"
                      title="Refresh Captcha Code"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={speakCaptcha}
                      className={`p-2 rounded bg-white border border-slate-300 hover:bg-slate-100 text-slate-600 transition-colors ${
                        isSpeakingCaptcha ? 'text-amber-600 animate-pulse' : ''
                      }`}
                      title="Listen to Captcha"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex-1 min-w-[130px]">
                      <input
                        type="text"
                        required
                        value={captchaInput}
                        onChange={(e) => setCaptchaInput(e.target.value)}
                        placeholder="Enter code"
                        className="w-full px-3 py-1.5 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono font-bold uppercase text-slate-900"
                      />
                    </div>
                  </div>

                  {captchaError && (
                    <p className="text-xs text-red-600 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" /> {captchaError}
                    </p>
                  )}
                </div>

                {/* Primary Action Button */}
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
                  >
                    <Lock className="w-4 h-4 text-amber-300" />
                    <span>{isLoading ? 'Verifying Credentials...' : 'Sign In as Officer'}</span>
                  </button>

                  <div className="flex items-center gap-3 pt-1">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-[11px] font-semibold text-slate-400 uppercase">Or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  {/* MeriPehchan National SSO Option */}
                  <button
                    type="button"
                    onClick={() => handlePersonaLogin('command_center')}
                    className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Landmark className="w-3.5 h-3.5 text-[#0B3D66]" />
                    <span>Sign in with MeriPehchan / Jan Parichay SSO</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: CITIZEN / LANDOWNER FORM */}
            {activeTab === 'citizen' && (
              <form onSubmit={handleCitizenSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="flex gap-4 border-b border-slate-200 pb-3 text-xs font-semibold text-slate-700">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizenMethod"
                      checked={citizenMethod === 'aadhaar'}
                      onChange={() => setCitizenMethod('aadhaar')}
                      className="text-[#0B3D66] focus:ring-[#0B3D66]"
                    />
                    <span>Aadhaar OTP</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizenMethod"
                      checked={citizenMethod === 'mobile'}
                      onChange={() => setCitizenMethod('mobile')}
                      className="text-[#0B3D66] focus:ring-[#0B3D66]"
                    />
                    <span>Mobile OTP</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="citizenMethod"
                      checked={citizenMethod === 'caseId'}
                      onChange={() => setCitizenMethod('caseId')}
                      className="text-[#0B3D66] focus:ring-[#0B3D66]"
                    />
                    <span>Case / Khata ID</span>
                  </label>
                </div>

                {citizenMethod === 'aadhaar' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        12-Digit Aadhaar Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={aadhaarNumber}
                          onChange={(e) => setAadhaarNumber(e.target.value)}
                          placeholder="XXXX XXXX XXXX"
                          className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
                        />
                        <Fingerprint className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                      </div>
                      <p className="text-[11px] text-slate-500">
                        OTP will be dispatched to UIDAI registered mobile number.
                      </p>
                    </div>

                    <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs text-slate-600">
                      <label className="flex items-start gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={consentChecked}
                          onChange={(e) => setConsentChecked(e.target.checked)}
                          className="mt-0.5 text-[#0B3D66] rounded"
                        />
                        <span>
                          I consent to identity verification via Aadhaar OTP for accessing land valuation awards and DBT compensation records under RFCTLARR Act 2013.
                        </span>
                      </label>
                    </div>

                    {!otpSent ? (
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                      >
                        <Smartphone className="w-4 h-4 text-amber-300" />
                        <span>Send 6-Digit OTP</span>
                      </button>
                    ) : (
                      <div className="space-y-3 bg-slate-50 p-3.5 rounded border border-slate-200">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-slate-700">Enter OTP sent to XXXX-8921:</span>
                          <span className="font-mono text-slate-500">
                            {otpTimer > 0 ? `Resend in ${otpTimer}s` : 'Expired'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between gap-1.5 max-w-xs mx-auto">
                          {otpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              type="text"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => {
                                const newDigits = [...otpDigits];
                                newDigits[idx] = e.target.value;
                                setOtpDigits(newDigits);
                              }}
                              className="w-9 h-10 text-center font-mono font-bold bg-white border border-slate-300 rounded focus:ring-2 focus:ring-[#0B3D66] text-slate-900"
                            />
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1">
                          <button
                            type="button"
                            onClick={() => setOtpDigits(['1', '2', '3', '4', '5', '6'])}
                            className="text-[#0B3D66] hover:underline"
                          >
                            Auto-fill Demo (123456)
                          </button>
                          <button
                            type="button"
                            disabled={otpTimer > 0}
                            onClick={handleSendOtp}
                            className={`${
                              otpTimer > 0 ? 'text-slate-400' : 'text-[#0B3D66] hover:underline'
                            }`}
                          >
                            Resend OTP
                          </button>
                        </div>

                        <button
                          type="submit"
                          disabled={isLoading}
                          className="w-full mt-2 bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                        >
                          <CheckCircle2 className="w-4 h-4 text-amber-300" />
                          <span>{isLoading ? 'Verifying...' : 'Verify OTP & View Case Records'}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {citizenMethod === 'mobile' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        10-Digit Registered Mobile Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-xs font-bold text-slate-500">+91</span>
                        <input
                          type="tel"
                          required
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          placeholder="98201 44521"
                          className="w-full pl-12 pr-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePersonaLogin('citizen')}
                      className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Smartphone className="w-4 h-4 text-amber-300" />
                      <span>Send Mobile OTP</span>
                    </button>
                  </div>
                )}

                {citizenMethod === 'caseId' && (
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                        Case Reference Number / Khata No. <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={caseIdInput}
                        onChange={(e) => setCaseIdInput(e.target.value)}
                        placeholder="e.g. MH-PAL-2024-8821"
                        className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handlePersonaLogin('citizen')}
                      className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <FileCheck2 className="w-4 h-4 text-amber-300" />
                      <span>Search Case &amp; Title Records</span>
                    </button>
                  </div>
                )}
              </form>
            )}

            {/* TAB 3: DSC TOKEN */}
            {activeTab === 'dsc' && (
              <form onSubmit={handleDscSubmit} className="p-6 sm:p-8 space-y-5">
                <div className="bg-slate-50 p-3 rounded border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>USB Hardware Token: <strong className="text-slate-900">NIC-CRYPTO-PKI-2026</strong></span>
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Ready
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Digital Certificate <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedToken}
                    onChange={(e) => setSelectedToken(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] text-slate-900"
                  >
                    <option value="emudhra-1">
                      eMudhra Class 3 (Signing &amp; Encryption) — Dr. Rajeshwar Verma, IAS (CALA Palghar)
                    </option>
                    <option value="emudhra-2">
                      Capricorn Class 3 — S. Murugan (Senior Revenue Surveyor, Div 4)
                    </option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide">
                    Smart Token User PIN <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      required
                      value={dscPin}
                      onChange={(e) => setDscPin(e.target.value)}
                      placeholder="Enter 6-8 digit PIN"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
                    />
                    <KeyRound className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-amber-300" />
                  <span>{isLoading ? 'Validating Token...' : 'Authenticate Certificate'}</span>
                </button>
              </form>
            )}

            {/* Subtle Footer Trust Badges (NIC / CERT-In / SHA-256) */}
            <div className="bg-[#F8FAFC] px-6 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-400" /> NIC Certified &amp; STQC Compliant
              </span>
              <span>TLS 1.3 Encryption Active</span>
            </div>
          </div>


          {/* ========================================================================= */}
          {/* RIGHT 5 COLS: Quick Access Stakeholder Portals & Helpdesk (Subtle Tone)  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">

            {/* Quick Access Roles Container */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-3">
              <div className="border-b border-slate-200 pb-2.5">
                <h2 className="text-sm font-bold text-[#0B3D66]">
                  Stakeholder Role Directory
                </h2>
                <p className="text-xs text-slate-500">
                  Select a predefined officer profile to inspect dedicated operational modules:
                </p>
              </div>

              <div className="space-y-2">
                {/* 1. Command Center */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('command_center')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#0B3D66] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      JS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Shri Arun K. Mehta, IAS
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        National Command Center Director (MoRD)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 2. Citizen Landowner */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('citizen')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      RP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Ramesh Narayan Patel (Citizen)
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        Landowner Beneficiary (Survey No. 142/3A)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 3. Field Officer */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('field_officer')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      SM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        S. Murugan (Surveyor)
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        Senior Revenue Inspector &amp; NavIC RTK DGPS
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 4. District CALA */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('district_officer')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      RV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Dr. Rajeshwar Verma, IAS
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        Special Land Acquisition Officer (CALA)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 5. Intelligence Layer */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('intelligence_layer')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      MN
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Dr. Meera Nambiar
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        PM GatiShakti Spatial &amp; Risk Analytics Lead
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>
              </div>
            </div>

            {/* Official Directives & Helpdesk */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-3">
              <div className="text-xs font-bold text-[#0B3D66] uppercase tracking-wide">
                Statutory Guidelines &amp; Helpdesk
              </div>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  <strong>PFMS Direct Benefit Transfer:</strong> Beneficiaries are advised to ensure their bank accounts are Aadhaar-seeded for expedited compensation disbursements.
                </p>
                <p className="text-[11px] text-slate-500">
                  Authentication is governed under the Information Technology Act, 2000 and Aadhaar Act, 2016.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#0B3D66]" /> Citizen Helpdesk:
                  </span>
                  <span className="font-mono font-bold text-slate-800">1800-11-LAND (5263)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#0B3D66]" /> Technical Support:
                  </span>
                  <span className="text-[#0B3D66] font-medium">support-landpulse@nic.in</span>
                </div>
              </div>
            </div>

            {/* Download Manual (Subtle) */}
            <div className="bg-white rounded-lg border border-slate-300 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#0B3D66]" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Officer User Manual</div>
                  <div className="text-[10px] text-slate-500">PDF • 4.2 MB • Aug 2026</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Downloading LandPulse_User_Manual.pdf')}
                className="p-1.5 text-slate-600 hover:text-[#0B3D66] transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
