import React, { useState, useEffect } from 'react';
import { Landmark, ShieldCheck, X, CheckCircle2, RefreshCw, AlertTriangle } from 'lucide-react';
import { CitizenCase } from '../../../types';
import { detectCompensationAnomaly, CompensationAnomalyResult } from '../../../services/api';

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
  const [trancheAmount, setTrancheAmount] = useState('91,20,000');
  const [anomalyResult, setAnomalyResult] = useState<CompensationAnomalyResult | null>(null);
  const [checkingAnomaly, setCheckingAnomaly] = useState(false);

  useEffect(() => {
    if (!isOpen || !caseItem) {
      setAnomalyResult(null);
      return;
    }

    let isMounted = true;
    setCheckingAnomaly(true);

    const awardedCr = caseItem.awardedCompensationCr ?? caseItem.estimatedValuationCr ?? 1.2;
    const area = caseItem.landAreaAcre ?? (caseItem.area ? parseFloat(caseItem.area) : 2.5);

    detectCompensationAnomaly({
      district: caseItem.district || 'Palghar',
      land_category: caseItem.category || caseItem.landType || 'agricultural',
      area_acres: isNaN(area) ? 2.0 : area,
      awarded_compensation_cr: awardedCr,
      owner_count: 1
    })
      .then((res) => {
        if (isMounted) setAnomalyResult(res);
      })
      .catch(() => {
        if (isMounted) setAnomalyResult(null);
      })
      .finally(() => {
        if (isMounted) setCheckingAnomaly(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, caseItem]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div style={{
        position: 'relative', width: '100%', maxWidth: '540px',
        backgroundColor: '#FFFFFF', border: '1px solid #CBD5E1', borderRadius: '2px',
      }}>
        {/* Close */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px', cursor: 'pointer', color: '#64748B', background: 'none', border: 'none' }}
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {/* Header */}
        <div className="gov-register-header" style={{ margin: '20px 24px 0', paddingBottom: '8px' }}>
          <div className="reg-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Landmark style={{ width: '14px', height: '14px', color: '#EA580C' }} />
            RFCTLARR 2013 &bull; PFMS DIRECT BENEFIT TRANSFER
          </div>
          <div className="reg-title">Authorize Statutory Compensation Tranche</div>
        </div>

        {/* Content */}
        <div style={{ padding: '16px 24px 20px' }}>
          {/* Anomaly Detection Audit Banner */}
          {checkingAnomaly && (
            <div style={{
              margin: '0 0 12px 0',
              padding: '6px 10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #CBD5E1',
              fontSize: '11px',
              color: '#64748B',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <RefreshCw style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
              Verifying award valuation against district comparable parcel benchmarks...
            </div>
          )}

          {anomalyResult && anomalyResult.isAnomaly && (
            <div style={{
              margin: '0 0 14px 0',
              padding: '10px 12px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #DC2626',
              borderRadius: '2px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '6px',
                marginBottom: '8px',
                borderBottom: '1px solid #FCA5A5',
                color: '#991B1B',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.04em',
                textTransform: 'uppercase'
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <AlertTriangle style={{ width: '14px', height: '14px', color: '#DC2626' }} />
                  RFCTLARR STATUTORY AUDIT EXCEPTION: VALUATION ANOMALY FLAGGED
                </span>
                <span className="gov-status-critical" style={{ fontSize: '10px', padding: '1px 6px' }}>
                  SCORE: {anomalyResult.anomalyScore}/100
                </span>
              </div>
              <table className="gov-facts-table" style={{ width: '100%', margin: 0 }}>
                <tbody>
                  <tr>
                    <td className="fact-label" style={{ color: '#991B1B', width: '140px', verticalAlign: 'top' }}>FLAG REASON</td>
                    <td className="fact-value" style={{ color: '#7F1D1D', fontWeight: 600 }}>{anomalyResult.flagReason}</td>
                  </tr>
                  <tr>
                    <td className="fact-label" style={{ color: '#991B1B' }}>COMPARABLE MEDIAN</td>
                    <td className="fact-value" style={{ color: '#7F1D1D', fontWeight: 700 }}>₹ {anomalyResult.comparableMedianCr} Cr</td>
                  </tr>
                  <tr>
                    <td className="fact-label" style={{ color: '#991B1B' }}>VARIANCE VS BENCHMARK</td>
                    <td className="fact-value" style={{ color: '#7F1D1D', fontWeight: 700 }}>
                      {anomalyResult.percentDeviation > 0 ? `+${anomalyResult.percentDeviation}%` : `${anomalyResult.percentDeviation}%`}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Case Facts */}
          <table className="gov-facts-table" style={{ marginBottom: '14px' }}>
            <tbody>
              <tr>
                <td className="fact-label">Survey / Khata</td>
                <td className="fact-value">#{caseItem.surveyNumber} &bull; {caseItem.khataNumber}</td>
              </tr>
              <tr>
                <td className="fact-label">Landowner</td>
                <td className="fact-value">{caseItem.landownerName}</td>
              </tr>
              <tr>
                <td className="fact-label">Award Valuation</td>
                <td className="fact-value">₹ {caseItem.awardedCompensationCr} Cr</td>
              </tr>
              <tr>
                <td className="fact-label">Already Disbursed</td>
                <td className="fact-value">₹ {caseItem.disbursedCompensationCr} Cr</td>
              </tr>
            </tbody>
          </table>

          {/* Tranche Amount */}
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
              Tranche 2 Sanction Amount (₹)
            </label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0B3D66' }}>₹</span>
              <input
                type="text"
                value={trancheAmount}
                onChange={(e) => setTrancheAmount(e.target.value)}
                className="gov-input"
                style={{ flex: 1, fontSize: '14px', fontWeight: 700, color: '#0B3D66' }}
              />
            </div>
          </div>

          {/* Aadhaar Verification */}
          <table className="gov-facts-table" style={{ marginBottom: '14px' }}>
            <tbody>
              <tr>
                <td className="fact-label">Aadhaar Status</td>
                <td className="fact-value">
                  <span className="gov-verified-tag">
                    <ShieldCheck style={{ width: '12px', height: '12px' }} />
                    Aadhaar NPCI Bridge Verified ({caseItem.aadhaarMasked})
                  </span>
                </td>
              </tr>
              <tr>
                <td className="fact-label">PFMS Routing</td>
                <td className="fact-value">SBI PFMS Direct Credit to Beneficiary A/c</td>
              </tr>
            </tbody>
          </table>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '12px', borderTop: '1px solid #E2E8F0' }}>
            <button onClick={onClose} className="gov-flat-btn gov-flat-btn-secondary">
              Cancel
            </button>
            <button
              onClick={handleAuthorizePayment}
              disabled={authorizing || success}
              className="gov-flat-btn gov-flat-btn-success"
              style={{ opacity: authorizing ? 0.7 : 1 }}
            >
              {authorizing ? (
                <><RefreshCw style={{ width: '13px', height: '13px', animation: 'spin 1s linear infinite' }} /> Authorizing via PFMS...</>
              ) : success ? (
                <><CheckCircle2 style={{ width: '13px', height: '13px' }} /> ₹{trancheAmount} Credited Successfully</>
              ) : (
                <><Landmark style={{ width: '13px', height: '13px' }} /> Authorize PFMS DBT — ₹{trancheAmount}</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
