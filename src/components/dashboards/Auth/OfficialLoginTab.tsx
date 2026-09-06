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

  // Handle Form Submit
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

    onSuccess(
      targetUser,
      'command_center',
      `Welcome, ${targetUser.name}! Authenticated via Jan Parichay SSO.`
    );
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
          onClick={() => onPersonaLogin('command_center')}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 py-2 px-3 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
        >
          <Landmark className="w-3.5 h-3.5 text-[#0B3D66]" />
          <span>Sign in with MeriPehchan / Jan Parichay SSO</span>
        </button>
      </div>
    </form>
  );
};
