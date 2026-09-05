import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrutalistBadge } from '../../common/BrutalistBadge';
import { X, Send, AlertTriangle, CheckCircle2, Upload, FileText } from 'lucide-react';

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
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl glass-panel p-6 rounded-super border border-white/20 shadow-2xl bg-slate-900/95 text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={handleResetAndClose}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          {submittedId ? (
            /* Success confirmation screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto text-emerald-400">
                <CheckCircle2 className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-2xl font-black font-grotesk text-white">
                  Objection Formally Registered
                </h3>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto font-sans">
                  Your Section 15 claim has been lodged with the Competent Authority Land Acquisition (CALA) officer.
                </p>
              </div>

              <div className="bg-black/40 border border-emerald-500/30 p-4 rounded-2xl max-w-sm mx-auto text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Grievance Ticket ID:</span>
                  <span className="text-emerald-400 font-bold">{submittedId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mandated Hearing SLA:</span>
                  <span className="text-slate-200">Within 21 Calendar Days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Assigned SLAO:</span>
                  <span className="text-slate-200">Palghar Division Office</span>
                </div>
              </div>

              <button
                onClick={handleResetAndClose}
                className="px-6 py-2.5 rounded-xl bg-pulse-saffron text-black font-grotesk font-bold text-xs btn-liquid border-2 border-black uppercase"
              >
                Return to My Case
              </button>
            </div>
          ) : (
            /* Form input screen */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold font-grotesk text-white">File Section 15 Statutory Objection</h3>
                    <BrutalistBadge label="RFCTLARR 2013" variant="saffron" size="sm" />
                  </div>
                  <p className="text-xs text-slate-400">
                    Formal legal petition for boundary, tree/crop asset, or compensation adjustment
                  </p>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Objection Classification
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-xs text-slate-100 focus:outline-none focus:border-pulse-saffron"
                >
                  <option value="Tree / Crop Count Discrepancy">Tree / Crop Count Discrepancy</option>
                  <option value="Building / Well / Structure Valuation">Building / Well / Structure Valuation</option>
                  <option value="Cadastral Boundary Overlap / Area Inconsistency">Cadastral Boundary Overlap / Area Inconsistency</option>
                  <option value="Title Co-Owner Succession Clarification">Title Co-Owner Succession Clarification</option>
                  <option value="Bank Account / IFSC Verification Delay">Bank Account / IFSC Verification Delay</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Detailed Grievance Remarks & Survey Evidence
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="State the exact discrepancies, e.g. 4 Alphonso Mango trees were omitted from Form 7; or 0.15 acres boundary overlaps with Survey #142/3A..."
                  className="w-full bg-slate-800 border border-white/15 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-pulse-saffron"
                />
              </div>

              {/* Evidence Upload Simulation */}
              <div className="p-3.5 rounded-2xl bg-black/30 border border-dashed border-white/20 text-center text-xs">
                <Upload className="w-5 h-5 text-slate-400 mx-auto mb-1" />
                <span className="text-slate-300 font-semibold block">Attach Photo Evidence / 7/12 Extract (PDF/JPEG)</span>
                <span className="text-[10px] text-slate-500">Max size 10MB per file</span>
              </div>

              {/* Submit CTA */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-grotesk font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting || !description.trim()}
                  className="px-6 py-2.5 rounded-xl bg-pulse-saffron text-black font-grotesk font-extrabold text-xs btn-liquid border-2 border-black shadow-brutalist-black uppercase flex items-center gap-1.5"
                >
                  {submitting ? (
                    <span>Registering with CALA Gateway...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Statutory Petition</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
