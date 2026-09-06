import React, { useState, useEffect } from 'react';
import { DEFAULT_PERSONAS } from '../../../context/RoleContext';
import { AuthUser, RoleType } from '../../../types';
import {
  Fingerprint,
  Smartphone,
  CheckCircle2,
  FileCheck2,
} from 'lucide-react';

interface CitizenLoginTabProps {
  isLoading: boolean;
  onSuccess: (user: AuthUser, destinationRole: RoleType, message: string) => void;
  onPersonaLogin: (key: keyof typeof DEFAULT_PERSONAS) => void;
}

export const CitizenLoginTab: React.FC<CitizenLoginTabProps> = ({
  isLoading,
  onSuccess,
  onPersonaLogin,
}) => {
  const [citizenMethod, setCitizenMethod] = useState<'aadhaar' | 'mobile' | 'caseId'>('aadhaar');
  const [aadhaarNumber, setAadhaarNumber] = useState('4829 1048 8921');
  const [mobileNumber, setMobileNumber] = useState('98201 44521');
  const [caseIdInput, setCaseIdInput] = useState('MH-PAL-2024-8821');
  const [otpSent, setOtpSent] = useState(false);
  // OTP digits start empty per security spec
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [consentChecked, setConsentChecked] = useState(true);
  const [serverError, setServerError] = useState('');
  const [serverMessage, setServerMessage] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  // OTP Timer Countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [otpSent, otpTimer]);

  const getIdentifier = () => {
    if (citizenMethod === 'aadhaar') return aadhaarNumber;
    if (citizenMethod === 'mobile') return mobileNumber;
    return caseIdInput;
  };

  // Real Server-Side OTP Dispatch
  const handleSendOtp = async () => {
    if (citizenMethod === 'aadhaar' && !consentChecked) {
      alert('Please agree to Aadhaar e-KYC consent declaration.');
      return;
    }
    setServerError('');
    setServerMessage('');
    setIsSendingOtp(true);

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: getIdentifier() }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error || 'Failed to send OTP.');
        return;
      }

      setOtpSent(true);
      setOtpTimer(data.expiresIn || 60);
      setServerMessage(data.message || 'OTP dispatched to registered mobile.');
    } catch (err) {
      setServerError('Unable to connect to OTP service.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Real Server-Side OTP Verification
  const handleCitizenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError('');

    const enteredOtp = otpDigits.join('');
    if (enteredOtp.length < 6) {
      setServerError('Please enter all 6 digits of the OTP received.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: getIdentifier(),
          otp: enteredOtp,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setServerError(data.error || 'Invalid or expired OTP.');
        return;
      }

      if (data.token) {
        localStorage.setItem('landpulse_auth_token', data.token);
      }

      onSuccess(
        data.user,
        'citizen',
        data.message || `Welcome, ${data.user.name}! Land parcel records loaded.`
      );
    } catch (err) {
      setServerError('Unable to reach OTP verification server.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
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
              className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded-[2px] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-amber-300" />
              <span>Send 6-Digit OTP</span>
            </button>
          ) : (
            <div className="space-y-3 bg-slate-50 p-3.5 rounded-[2px] border border-slate-200">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Enter OTP sent to XXXX-8921:</span>
                <span className="font-mono text-slate-500 font-bold">
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
                    className="w-9 h-10 text-center font-mono font-bold bg-white border border-slate-300 rounded-[2px] focus:ring-2 focus:ring-[#0B3D66] text-slate-900"
                  />
                ))}
              </div>

              {serverMessage && (
                <div className="p-2 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-800 font-medium">
                  ✓ {serverMessage}
                </div>
              )}

              {serverError && (
                <div className="p-2 bg-red-50 border border-red-200 rounded text-xs text-red-700 font-medium">
                  ⚠ {serverError}
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <span className="text-[11px] text-slate-500">Demo Code logged to server console</span>
                <button
                  type="button"
                  disabled={otpTimer > 0 || isSendingOtp}
                  onClick={handleSendOtp}
                  className={`${
                    otpTimer > 0 ? 'text-slate-400 cursor-not-allowed' : 'text-[#0B3D66] hover:underline cursor-pointer'
                  }`}
                >
                  {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading || isVerifying}
                className="w-full mt-2 bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded-[2px] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-amber-300" />
                <span>{isVerifying ? 'Verifying OTP...' : 'Verify OTP & View Case Records'}</span>
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
                className="w-full pl-12 pr-3 py-2 text-sm bg-white border border-slate-300 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
              />
            </div>
          </div>
          <button
            type="button"
            onClick={() => onPersonaLogin('citizen')}
            className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded-[2px] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
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
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-300 rounded-[2px] focus:outline-none focus:ring-2 focus:ring-[#0B3D66] font-mono text-slate-900"
            />
          </div>
          <button
            type="button"
            onClick={() => onPersonaLogin('citizen')}
            className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded-[2px] font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-amber-300" />
            <span>Search Case &amp; Title Records</span>
          </button>
        </div>
      )}
    </form>
  );
};
