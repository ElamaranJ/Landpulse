import React, { useState } from 'react';
import { DEFAULT_PERSONAS } from '../../../context/RoleContext';
import { AuthUser, RoleType } from '../../../types';
import {
  Lock,
  RefreshCw,
  Volume2,
  Eye,
  EyeOff,
  AlertTriangle,
  Landmark,
} from 'lucide-react';
import { signInWithGoogle, loginWithEmail } from '../../../services/firebase';

interface OfficialLoginTabProps {
  isLoading: boolean;
  onSuccess: (user: AuthUser, destinationRole: RoleType, message: string) => void;
  onPersonaLogin: (key: keyof typeof DEFAULT_PERSONAS) => void;
}

export const OfficialLoginTab: React.FC<OfficialLoginTabProps> = ({
  isLoading,
  onSuccess,
  onPersonaLogin,
}) => {
  const [officialUsername, setOfficialUsername] = useState('arun.mehta@nic.in');
  const [officialPassword, setOfficialPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [captchaCode, setCaptchaCode] = useState('8N3PK');
  const [captchaError, setCaptchaError] = useState('');
  const [isSpeakingCaptcha, setIsSpeakingCaptcha] = useState(false);

  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setServerError('');
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

  // Handle Form Submit
  const handleOfficialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    if (captchaInput.trim().toUpperCase() !== captchaCode) {
      setCaptchaError('Incorrect Security Code. Please try again.');
      return;
    }
    setCaptchaError('');

    setIsSubmitting(true);
    const passToSend = officialPassword === '••••••••••••' ? 'Password@123' : officialPassword;

    try {
      // 1. Try Firebase Authentication
      try {
        await loginWithEmail(officialUsername.trim(), passToSend);
      } catch (fbErr) {
        console.warn('[OfficialLogin] Firebase direct login fallback to server auth:', fbErr);
      }

      // 2. Validate with backend session
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: officialUsername.trim(),
          password: passToSend,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setServerError(data.error || 'Authentication failed. Please verify credentials.');
        return;
      }

      if (data.token) {
        localStorage.setItem('landpulse_auth_token', data.token);
      }

      onSuccess(
        data.user,
        data.user.role as RoleType,
        data.message || `Welcome, ${data.user.name}! Authenticated via Official Portal.`
      );
    } catch (err) {
      setServerError('Unable to reach authentication server. Please check network connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsSubmitting(true);
    setServerError('');
    try {
      const res = await signInWithGoogle('command_center');
      if (!res.success || !res.user) {
        if (res.error) setServerError(res.error);
        return;
      }

      const apiRes = await fetch('/api/auth/firebase-google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: res.user.email,
          displayName: res.user.displayName,
          photoURL: res.user.photoURL,
          uid: res.user.uid,
          preferredRole: 'command_center',
        }),
      });

      const data = await apiRes.json();
      if (data.success && data.user) {
        if (data.token) {
          localStorage.setItem('landpulse_auth_token', data.token);
        }
        onSuccess(
          data.user,
          (data.user.role as RoleType) || 'command_center',
          data.message || `Welcome, ${data.user.name}! Authenticated via Google.`
        );
      } else {
        setServerError(data.error || 'Google authentication failed.');
      }
    } catch {
      setServerError('Error during Google authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

        {serverError && (
          <div className="p-2.5 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
      </div>

      {/* Primary Action Button */}
      <div className="pt-2 space-y-3">
        <button
          type="submit"
          disabled={isLoading || isSubmitting}
          className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded-[2px] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
        >
          <Lock className="w-4 h-4 text-amber-300" />
          <span>{isLoading || isSubmitting ? 'Verifying Credentials...' : 'Sign In as Officer'}</span>
        </button>

        <div className="flex items-center gap-3 pt-1">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-[11px] font-semibold text-slate-400 uppercase">Or</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        {/* Sign In with Google */}
        <button
          type="button"
          disabled={isLoading || isSubmitting}
          onClick={handleGoogleLogin}
          className="w-full bg-[#4285F4] hover:bg-[#3367D6] active:bg-[#2A56C6] text-white p-1 pr-4 rounded-lg font-medium text-xs flex items-center shadow-[0_2px_8px_rgba(66,133,244,0.35)] transition-all cursor-pointer disabled:opacity-50"
        >
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24">
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
          <span className="flex-1 text-center font-bold text-sm tracking-wide text-white">Sign in with Google</span>
        </button>
      </div>
    </form>
  );
};
