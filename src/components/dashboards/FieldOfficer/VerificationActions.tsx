import React, { useState } from 'react';
import type { FieldParcel } from '../../../types';
import { CheckCircle2, ShieldCheck, AlertTriangle, Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface VerificationActionsProps {
  parcel: FieldParcel;
  onCompleteVerification: () => void;
  onFlagObjection: () => void;
}

export const VerificationActions: React.FC<VerificationActionsProps> = ({
  parcel,
  onCompleteVerification,
  onFlagObjection,
}) => {
  const [officerNotes, setOfficerNotes] = useState(parcel.fieldOfficerNotes || '');
  const [isOffline, setIsOffline] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verifiedSuccess, setVerifiedSuccess] = useState(false);

  const handleVerify = () => {
    setVerifying(true);
    setTimeout(() => {
      setVerifying(false);
      setVerifiedSuccess(true);
      onCompleteVerification();
      setTimeout(() => setVerifiedSuccess(false), 2500);
    }, 800);
  };

  return (
    <div className="gov-card p-6 sm:p-7 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h4 className="font-bold text-lg sm:text-xl text-[#0B3D66] font-sans tracking-tight">
              Officer Digital Signoff &amp; Cadastral Verification
            </h4>
            <span className="gov-badge gov-badge-info">DSC SIGNED</span>
          </div>
          <p className="text-xs text-slate-500 font-mono mt-0.5">DSC Cryptographic DGPS Package Certification</p>
        </div>

        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`h-9 px-3.5 rounded-lg text-xs font-bold font-mono flex items-center gap-1.5 transition-colors border ${
            isOffline
              ? 'bg-amber-50 text-amber-800 border-amber-300'
              : 'bg-emerald-50 text-emerald-800 border-emerald-300'
          }`}
        >
          {isOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5 text-emerald-600" />}
          <span>{isOffline ? 'OFFLINE BUFFER (READY)' : 'NIC GATEWAY LIVE'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Officer Notes Form */}
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase font-mono mb-2">
            Field Inspection Summary &amp; Joint Measurement (JMV) Observations:
          </label>
          <textarea
            rows={3}
            value={officerNotes}
            onChange={(e) => setOfficerNotes(e.target.value)}
            placeholder="DGPS boundary survey executed in presence of landowner and Village Patwari. Boundary corner stones verified with sub-meter NavIC RTK lock..."
            className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#1D4ED8] focus:ring-3 focus:ring-blue-100 font-sans"
          />
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={onFlagObjection}
            className="h-12 px-5 rounded-lg font-bold text-xs uppercase bg-white border-2 border-red-500 text-red-700 hover:bg-red-50 flex items-center justify-center gap-2 transition-all shadow-2xs"
          >
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span>Flag Section 15 Boundary Dispute</span>
          </button>

          <button
            onClick={handleVerify}
            disabled={verifying || verifiedSuccess}
            className={`h-12 px-5 rounded-lg font-bold text-xs uppercase flex items-center justify-center gap-2 transition-all shadow-xs ${
              verifiedSuccess
                ? 'bg-emerald-700 text-white'
                : verifying
                ? 'bg-amber-600 text-white cursor-wait'
                : 'bg-[#059669] hover:bg-[#047857] text-white'
            }`}
          >
            {verifying ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Signing Digital Certificate...</span>
              </>
            ) : verifiedSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Parcel Verified &amp; JMV Sealed</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Sign &amp; Verify Parcel (JMV Ready)</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
