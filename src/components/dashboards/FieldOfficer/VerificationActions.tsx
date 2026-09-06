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
    <div style={{ border: '1px solid #CBD5E1', borderRadius: '2px', backgroundColor: '#FFFFFF', padding: '14px 16px', marginBottom: '12px' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px', paddingBottom: '8px', marginBottom: '10px', borderBottom: '2px solid #0B3D66' }}>
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
            DSC CRYPTOGRAPHIC DGPS PACKAGE CERTIFICATION
          </div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#0B3D66', display: 'flex', alignItems: 'center', gap: '8px' }}>
            Officer Digital Signoff &amp; Cadastral Verification
            <span className="gov-verified-tag" style={{ fontSize: '10px' }}>DSC SIGNED</span>
          </div>
        </div>

        <button
          onClick={() => setIsOffline(!isOffline)}
          className={`gov-flat-btn ${isOffline ? 'gov-flat-btn-secondary' : 'gov-flat-btn-success'}`}
          style={{ fontSize: '11px' }}
        >
          {isOffline ? <WifiOff style={{ width: '14px', height: '14px' }} /> : <Wifi style={{ width: '14px', height: '14px' }} />}
          {isOffline ? 'OFFLINE BUFFER (READY)' : 'NIC GATEWAY LIVE'}
        </button>
      </div>

      {/* Officer Notes Form */}
      <div style={{ marginBottom: '12px' }}>
        <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
          Field Inspection Summary &amp; Joint Measurement (JMV) Observations:
        </label>
        <textarea
          rows={3}
          value={officerNotes}
          onChange={(e) => setOfficerNotes(e.target.value)}
          placeholder="DGPS boundary survey executed in presence of landowner and Village Patwari. Boundary corner stones verified with sub-meter NavIC RTK lock..."
          className="gov-input"
          style={{ width: '100%', resize: 'vertical', fontSize: '13px' }}
        />
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={onFlagObjection}
          className="gov-flat-btn gov-flat-btn-danger"
          style={{ justifyContent: 'center', padding: '10px 16px', fontSize: '12px' }}
        >
          <AlertTriangle style={{ width: '16px', height: '16px' }} />
          Flag Section 15 Boundary Dispute
        </button>

        <button
          onClick={handleVerify}
          disabled={verifying || verifiedSuccess}
          className={`gov-flat-btn ${verifiedSuccess ? 'gov-flat-btn-success' : verifying ? 'gov-flat-btn-secondary' : 'gov-flat-btn-success'}`}
          style={{ justifyContent: 'center', padding: '10px 16px', fontSize: '12px', opacity: verifying ? 0.7 : 1 }}
        >
          {verifying ? (
            <>
              <RefreshCw style={{ width: '16px', height: '16px', animation: 'spin 1s linear infinite' }} />
              Signing Digital Certificate...
            </>
          ) : verifiedSuccess ? (
            <>
              <CheckCircle2 style={{ width: '16px', height: '16px' }} />
              Parcel Verified &amp; JMV Sealed
            </>
          ) : (
            <>
              <ShieldCheck style={{ width: '16px', height: '16px' }} />
              Sign &amp; Verify Parcel (JMV Ready)
            </>
          )}
        </button>
      </div>
    </div>
  );
};
