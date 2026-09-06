import React, { useState } from 'react';
import { DEFAULT_PERSONAS } from '../../../context/RoleContext';
import { AuthUser, RoleType } from '../../../types';
import { KeyRound, Cpu } from 'lucide-react';

interface DSCLoginTabProps {
  isLoading: boolean;
  onSuccess: (user: AuthUser, destinationRole: RoleType, message: string) => void;
}

export const DSCLoginTab: React.FC<DSCLoginTabProps> = ({
  isLoading,
  onSuccess,
}) => {
  const [selectedToken, setSelectedToken] = useState('emudhra-1');
  const [dscPin, setDscPin] = useState('••••••');

  const handleDscSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isDistrict = selectedToken === 'emudhra-1';
    const targetUser = isDistrict ? DEFAULT_PERSONAS.district_officer : DEFAULT_PERSONAS.field_officer;

    onSuccess(
      targetUser,
      targetUser.role,
      `Class-3 DSC Token Authenticated. Welcome, ${targetUser.name}!`
    );
  };

  return (
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
  );
};
