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
  const [otpDigits, setOtpDigits] = useState(['1', '2', '3', '4', '5', '6']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [consentChecked, setConsentChecked] = useState(true);

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

  // Handle Citizen OTP Generation
  const handleSendOtp = () => {
    if (!consentChecked) {
      alert('Please agree to Aadhaar e-KYC consent declaration.');
      return;
    }
    setOtpSent(true);
    setOtpTimer(60);
  };

  // Handle Citizen Login Submit
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

    onSuccess(
      targetUser,
      'citizen',
      `Welcome, ${targetUser.name}! Land parcel records loaded.`
    );
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
            onClick={() => onPersonaLogin('citizen')}
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
            onClick={() => onPersonaLogin('citizen')}
            className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors"
          >
            <FileCheck2 className="w-4 h-4 text-amber-300" />
            <span>Search Case &amp; Title Records</span>
          </button>
        </div>
      )}
    </form>
  );
};
