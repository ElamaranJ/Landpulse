import React, { useState } from 'react';
import { BrutalistBadge } from '../../common/BrutalistBadge';
import { Landmark, ShieldCheck, X, CheckCircle2, RefreshCw } from 'lucide-react';
import { CitizenCase } from '../../../types';

interface CompensationDisbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseItem: CitizenCase | null;
}

export const CompensationDisbursementModal: React.FC<CompensationDisbursementModalProps> = ({
  isOpen,
  onClose,
  caseItem,
}) => {
  const [authorizing, setAuthorizing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [trancheAmount, setTrancheAmount] = useState('91,20,000'); // ₹91.2 Lakh (Tranche 2)

  if (!isOpen || !caseItem) return null;

  const handleAuthorizePayment = () => {
    setAuthorizing(true);
    setTimeout(() => {
      setAuthorizing(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 2000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-xl gov-card p-5 rounded-md border border-white/20 shadow-xl bg-[#090F1E] text-slate-100 font-sans">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-white/10">
          <div className="w-9 h-9 rounded bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold font-grotesk tracking-tight text-white">
                PFMS Treasury Direct Benefit Transfer (DBT) Authorization
              </h3>
              <BrutalistBadge label="SECTION 23 (RFCTLARR)" variant="saffron" size="sm" />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Direct State Bank PFMS Gateway Settlement • Tranche 2 Disbursal
            </p>
          </div>
        </div>

        {/* Landowner Record Info */}
        <div className="bg-black/40 border border-white/10 p-3 rounded mb-3 text-xs font-mono space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Cadastral Survey Parcel:</span>
            <span className="text-white font-bold">
              Survey #{caseItem.surveyNo} ({caseItem.village})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Beneficiary Landowner:</span>
            <span className="text-slate-200 font-sans font-bold">{caseItem.owner}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Aadhaar PFMS Validation:</span>
            <span className="text-emerald-400 font-bold">XXXX-XXXX-8924 (VERIFIED)</span>
          </div>
        </div>

        {/* Statutory Solatium Calculation Breakdown */}
        <div className="space-y-1.5 text-xs mb-4 bg-white/5 p-3 rounded border border-white/10 font-mono">
          <span className="text-[10px] uppercase text-slate-400 block font-bold">
            Statutory Solatium & Multiplier Audit Breakdown
          </span>
          <div className="flex justify-between text-slate-300">
            <span>Base Market Valuation (2.85 Acres):</span>
            <span>₹ 42,00,000</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Rural Area Multiplier (2.0x):</span>
            <span>₹ 84,00,000</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>100% Solatium (Sec 30(1)):</span>
            <span>₹ 84,00,000</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Horticulture / Structure Assets (Form 7):</span>
            <span>₹ 14,40,000</span>
          </div>
          <div className="flex justify-between text-emerald-400 font-bold pt-1.5 border-t border-white/10 text-xs">
            <span>Tranche 2 Disbursal Due (50% Balance):</span>
            <span>₹ {trancheAmount}</span>
          </div>
        </div>

        {/* DSC Token & Gateway Status */}
        <div className="flex items-center gap-2 text-xs text-emerald-400 mb-4 bg-emerald-950/20 border border-emerald-500/30 p-2.5 rounded font-mono">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>SLAO Digital Signature Token (Palghar Circle 04) Active & Seeded.</span>
        </div>

        {/* Authorize Button */}
        <button
          onClick={handleAuthorizePayment}
          disabled={authorizing || success}
          className={`w-full py-2.5 px-4 rounded font-mono font-bold text-xs uppercase flex items-center justify-center gap-2 border transition-all ${
            success
              ? 'bg-emerald-600 text-white border-emerald-500'
              : 'btn-gov btn-gov-primary w-full'
          }`}
        >
          {authorizing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Signing DSC & Transmitting to PFMS Treasury Gateway...</span>
            </>
          ) : success ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>UTR Generated: SBIN24289012498 (₹ 91.2 Lakh Transferred)</span>
            </>
          ) : (
            <>
              <Landmark className="w-3.5 h-3.5" />
              <span>Sign DSC & Authorize Tranche 2 Disbursal</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
