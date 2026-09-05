import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { BrutalistBadge } from './BrutalistBadge';
import { Download, FileText, CheckCircle2, ShieldCheck, X, Sparkles, Printer } from 'lucide-react';

export const ExportReportModal: React.FC = () => {
  const { exportModalOpen, setExportModalOpen, currentRole } = useRole();
  const [reportType, setReportType] = useState('executive_briefing');
  const [generating, setGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!exportModalOpen) return null;

  const handleDownload = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        setExportModalOpen(false);
      }, 2000);
    }, 1500);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl glass-panel p-6 rounded-super border border-white/20 shadow-2xl bg-slate-900/90 text-slate-100"
        >
          {/* Close button */}
          <button
            onClick={() => setExportModalOpen(false)}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-pulse-saffron/20 border border-pulse-saffron/40 flex items-center justify-center text-pulse-saffron">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold font-grotesk tracking-tight text-white">
                  Export Intelligence Dossier
                </h3>
                <BrutalistBadge label="OFFICIAL GOI" variant="saffron" size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Digitally authenticated PDF with cryptographic government watermarks
              </p>
            </div>
          </div>

          {/* Report Type Selector */}
          <div className="space-y-3 mb-6">
            <label className="text-xs font-semibold uppercase text-slate-300 font-mono tracking-wider">
              Select Dossier Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: 'executive_briefing',
                  title: 'National PMO Executive Briefing',
                  desc: 'Comprehensive cross-ministry progress & bottleneck analytics',
                },
                {
                  id: 'district_audit',
                  title: 'District Compliance & Audit Dossier',
                  desc: 'PFMS disbursement reconciliations & SLAO court orders',
                },
                {
                  id: 'citizen_award',
                  title: 'Citizen Award & Entitlement Slip',
                  desc: 'Section 23 valuation computation with Solatium breakdown',
                },
                {
                  id: 'cadastral_gis',
                  title: 'Cadastral GIS GeoJSON & DGPS Log',
                  desc: 'Raw boundary coordinates for survey department handoff',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setReportType(item.id)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                    reportType === item.id
                      ? 'bg-pulse-saffron/15 border-pulse-saffron shadow-sm'
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs font-bold text-white font-grotesk">{item.title}</h4>
                    {reportType === item.id && <CheckCircle2 className="w-4 h-4 text-pulse-saffron" />}
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-2">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Metadata preview info */}
          <div className="bg-black/40 border border-white/10 p-4 rounded-2xl mb-6 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Security Classification:</span>
              <span className="font-mono text-emerald-400 font-bold">UNRESTRICTED / PUBLIC ACCESS</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Timestamp Hash:</span>
              <span className="font-mono text-slate-300">0x8F4E...91A2 (SHA-256)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Signing Authority:</span>
              <span className="text-slate-200 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                LandPulse Automated DSC Engine
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleDownload}
            disabled={generating || downloaded}
            className={`w-full py-3.5 px-6 rounded-2xl font-grotesk font-bold text-sm tracking-wide flex items-center justify-center gap-2 btn-liquid uppercase transition-all shadow-lg ${
              downloaded
                ? 'bg-emerald-500 text-black border-2 border-black'
                : 'bg-pulse-saffron text-black border-2 border-black hover:bg-orange-400 shadow-brutalist-black'
            }`}
          >
            {generating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating Secure PDF Dossier...
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Dossier Downloaded Successfully!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Generate & Export PDF Dossier
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
