import React, { useState } from 'react';
import { X, Send, AlertTriangle, CheckCircle2, Upload } from 'lucide-react';

interface ObjectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ObjectionModal: React.FC<ObjectionModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('Tree / Crop Count Discrepancy');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmittedId('OBJ-MH-2026-' + Math.floor(1000 + Math.random() * 9000));
    }, 1200);
  };

  const handleResetAndClose = () => {
    setSubmittedId(null);
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div
        style={{
          width: '100%',
          maxWidth: '540px',
          backgroundColor: '#FFFFFF',
          border: '1px solid #CBD5E1',
          borderRadius: '2px',
          position: 'relative',
        }}
      >
        {/* Close button */}
        <button
          onClick={handleResetAndClose}
          style={{
            position: 'absolute', top: '12px', right: '12px',
            padding: '4px', cursor: 'pointer', color: '#64748B',
            background: 'none', border: 'none',
          }}
        >
          <X style={{ width: '18px', height: '18px' }} />
        </button>

        {submittedId ? (
          /* Success confirmation */
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '2px',
              border: '2px solid #059669', display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 16px',
            }}>
              <CheckCircle2 style={{ width: '28px', height: '28px', color: '#059669' }} />
            </div>

            <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#0B3D66', marginBottom: '6px' }}>
              Objection Formally Registered
            </h3>
            <p style={{ fontSize: '12px', color: '#64748B', maxWidth: '400px', margin: '0 auto 16px' }}>
              Your Section 15 claim has been lodged with the Competent Authority Land Acquisition (CALA) officer.
            </p>

            <table className="gov-facts-table" style={{ maxWidth: '360px', margin: '0 auto 20px', fontSize: '12px' }}>
              <tbody>
                <tr>
                  <td className="fact-label">Grievance Ticket ID</td>
                  <td className="fact-value" style={{ color: '#059669' }}>{submittedId}</td>
                </tr>
                <tr>
                  <td className="fact-label">Mandated Hearing SLA</td>
                  <td className="fact-value">Within 21 Calendar Days</td>
                </tr>
                <tr>
                  <td className="fact-label">Assigned SLAO</td>
                  <td className="fact-value">Palghar Division Office</td>
                </tr>
              </tbody>
            </table>

            <button onClick={handleResetAndClose} className="gov-flat-btn gov-flat-btn-primary">
              Return to My Case
            </button>
          </div>
        ) : (
          /* Form input */
          <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
            <div className="gov-register-header" style={{ marginBottom: '16px' }}>
              <div className="reg-meta" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <AlertTriangle style={{ width: '14px', height: '14px', color: '#D97706' }} />
                RFCTLARR 2013
              </div>
              <div className="reg-title">File Section 15 Statutory Objection</div>
              <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>
                Formal legal petition for boundary, tree/crop asset, or compensation adjustment
              </div>
            </div>

            {/* Category */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Objection Classification
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="gov-select"
                style={{ width: '100%' }}
              >
                <option value="Tree / Crop Count Discrepancy">Tree / Crop Count Discrepancy</option>
                <option value="Building / Well / Structure Valuation">Building / Well / Structure Valuation</option>
                <option value="Cadastral Boundary Overlap / Area Inconsistency">Cadastral Boundary Overlap / Area Inconsistency</option>
                <option value="Title Co-Owner Succession Clarification">Title Co-Owner Succession Clarification</option>
                <option value="Bank Account / IFSC Verification Delay">Bank Account / IFSC Verification Delay</option>
              </select>
            </div>

            {/* Description */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
                Detailed Grievance Remarks &amp; Survey Evidence
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="State the exact discrepancies, e.g. 4 Alphonso Mango trees were omitted from Form 7; or 0.15 acres boundary overlaps with Survey #142/3A..."
                className="gov-input"
                style={{ width: '100%', resize: 'vertical' }}
              />
            </div>

            {/* Evidence Upload */}
            <div style={{
              padding: '12px', border: '1px dashed #CBD5E1', borderRadius: '2px',
              textAlign: 'center', fontSize: '12px', marginBottom: '16px', backgroundColor: '#F8FAFC',
            }}>
              <Upload style={{ width: '18px', height: '18px', color: '#94A3B8', margin: '0 auto 4px' }} />
              <span style={{ display: 'block', fontWeight: 600, color: '#475569' }}>
                Attach Photo Evidence / 7/12 Extract (PDF/JPEG)
              </span>
              <span style={{ fontSize: '10px', color: '#94A3B8' }}>Max size 10MB per file</span>
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
              <button type="button" onClick={onClose} className="gov-flat-btn gov-flat-btn-secondary">
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || !description.trim()}
                className="gov-flat-btn gov-flat-btn-primary"
                style={{ opacity: submitting || !description.trim() ? 0.6 : 1 }}
              >
                {submitting ? (
                  <span>Registering with CALA Gateway...</span>
                ) : (
                  <>
                    <Send style={{ width: '12px', height: '12px' }} />
                    <span>Submit Statutory Petition</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
