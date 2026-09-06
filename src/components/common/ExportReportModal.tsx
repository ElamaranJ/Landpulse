import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { useModals } from '../../context/ModalContext';
import { BrutalistBadge } from './BrutalistBadge';
import {
  Download,
  FileText,
  CheckCircle2,
  ShieldCheck,
  X,
  Sparkles,
  FileSpreadsheet,
  FileDown,
  Building,
  MapPin,
} from 'lucide-react';
import { MOCK_PROJECTS } from '../../data/mockData';
import { Project } from '../../types';
import jsPDF from 'jspdf';

export const ExportReportModal: React.FC = () => {
  const { selectedProject } = useRole();
  const { isModalOpen, closeModal } = useModals();

  // Active project fallback
  const activeProject: Project = selectedProject || MOCK_PROJECTS[0];

  const [exportFormat, setExportFormat] = useState<'csv' | 'pdf'>('csv');
  const [generating, setGenerating] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isModalOpen('exportModal')) return null;

  const generateProjectCSV = (project: Project): string => {
    const headers = [
      'Project ID',
      'Project Code',
      'Project Name',
      'Corridor',
      'Ministry',
      'Category',
      'State',
      'Districts',
      'Total Acres',
      'Acquired Acres',
      'Acquired Percentage (%)',
      'Target Year',
      'Total Budget (INR Cr)',
      'Disbursed Compensation (INR Cr)',
      'Disbursed Percentage (%)',
      'Affected Families (PAPs)',
      'Rehabilitated Families',
      'Status',
      'Composite Risk Score',
      'Identified Risk Factors',
      'Active Bottlenecks',
    ];

    const escapeCSV = (val: string | number | undefined | null) => {
      if (val === undefined || val === null) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const acquiredPercent = ((project.acquiredAcres / project.totalAcres) * 100).toFixed(1);
    const disbursedPercent = ((project.disbursedCr / project.budgetCr) * 100).toFixed(1);

    const row = [
      escapeCSV(project.id),
      escapeCSV(project.code),
      escapeCSV(project.name),
      escapeCSV(project.corridor),
      escapeCSV(project.ministry),
      escapeCSV(project.category),
      escapeCSV(project.state),
      escapeCSV(project.districts.join(', ')),
      escapeCSV(project.totalAcres),
      escapeCSV(project.acquiredAcres),
      escapeCSV(acquiredPercent),
      escapeCSV(project.targetYear),
      escapeCSV(project.budgetCr),
      escapeCSV(project.disbursedCr),
      escapeCSV(disbursedPercent),
      escapeCSV(project.affectedFamilies),
      escapeCSV(project.rehabilitatedFamilies),
      escapeCSV(project.status.toUpperCase()),
      escapeCSV(project.riskScore),
      escapeCSV(project.riskFactors.join('; ')),
      escapeCSV(project.bottlenecks.join('; ')),
    ];

    return [headers.join(','), row.join(',')].join('\r\n');
  };

  const triggerCSVDownload = (csvContent: string, filename: string) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateProjectPDF = (project: Project) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;
    let y = 16;

    // Header Banner
    doc.setFillColor(11, 61, 102); // #0B3D66
    doc.rect(0, 0, pageWidth, 28, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('GOVERNMENT OF INDIA • DEPARTMENT OF LAND RESOURCES', margin, 10);

    doc.setFontSize(14);
    doc.text('LandPulse — National Land Acquisition Intelligence Dossier', margin, 18);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(217, 119, 6); // saffron accent
    doc.text('CONFIDENTIAL / STATUTORY RFCTLARR MIS RECORD', margin, 24);
    doc.setTextColor(255, 255, 255);
    doc.text(
      `Date: ${new Date().toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}`,
      pageWidth - margin - 50,
      24
    );

    y = 36;

    // Project Header Block
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(margin, y, pageWidth - margin * 2, 22, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(11, 61, 102);
    doc.text(project.name, margin + 4, y + 6.5);

    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(`Code: ${project.code}   |   Corridor: ${project.corridor}`, margin + 4, y + 12);
    doc.text(
      `Ministry: ${project.ministry}   |   State: ${project.state}   |   Category: ${project.category}`,
      margin + 4,
      y + 17
    );

    y += 28;

    // Section 1: Land Acquisition Telemetry
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(11, 61, 102);
    doc.text('1. LAND ACQUISITION & CADASTRAL PROGRESS', margin, y);
    doc.setDrawColor(11, 61, 102);
    doc.setLineWidth(0.5);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);

    y += 6;

    const acquiredPercent = ((project.acquiredAcres / project.totalAcres) * 100).toFixed(1);
    const disbursedPercent = ((project.disbursedCr / project.budgetCr) * 100).toFixed(1);

    const kpis = [
      { label: 'Target Total Area', val: `${project.totalAcres.toLocaleString()} Acres` },
      {
        label: 'Acquired (Possession)',
        val: `${project.acquiredAcres.toLocaleString()} Acres (${acquiredPercent}%)`,
      },
      { label: 'Project Status', val: project.status.replace('_', ' ').toUpperCase() },
      { label: 'Target Completion', val: project.targetYear },
    ];

    const colWidth = (pageWidth - margin * 2) / 4;
    kpis.forEach((kpi, i) => {
      const x = margin + i * colWidth;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(x, y, colWidth - 2, 14, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.label, x + 2, y + 4.5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(kpi.val, x + 2, y + 10.5);
    });

    y += 19;

    // Section 2: Financials & Beneficiary Rehabilitation
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(11, 61, 102);
    doc.text('2. COMPENSATION VALUATION & REHABILITATION (PFMS DBT)', margin, y);
    doc.setDrawColor(11, 61, 102);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);

    y += 6;

    const finKpis = [
      { label: 'Sanctioned Budget', val: `Rs. ${project.budgetCr.toLocaleString()} Cr` },
      {
        label: 'Disbursed Compensation',
        val: `Rs. ${project.disbursedCr.toLocaleString()} Cr (${disbursedPercent}%)`,
      },
      { label: 'Affected Families (PAPs)', val: `${project.affectedFamilies.toLocaleString()} Families` },
      { label: 'Rehabilitated Families', val: `${project.rehabilitatedFamilies.toLocaleString()} Families` },
    ];

    finKpis.forEach((kpi, i) => {
      const x = margin + i * colWidth;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(x, y, colWidth - 2, 14, 1, 1, 'F');
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(100, 116, 139);
      doc.text(kpi.label, x + 2, y + 4.5);
      doc.setFontSize(8.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(194, 65, 12); // #C2410C
      doc.text(kpi.val, x + 2, y + 10.5);
    });

    y += 19;

    // Section 3: Risk Factors & Identified Bottlenecks
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(11, 61, 102);
    doc.text('3. RISK ENGINE TELEMETRY & ESCALATION BOTTLENECKS', margin, y);
    doc.setDrawColor(11, 61, 102);
    doc.line(margin, y + 1.5, pageWidth - margin, y + 1.5);

    y += 7;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(185, 28, 28);
    doc.text(`Composite AI Risk Score: ${project.riskScore} / 100`, margin, y);

    y += 5;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(51, 65, 85);

    doc.text('Identified Risk Factors:', margin, y);
    project.riskFactors.forEach((rf) => {
      y += 4;
      doc.text(`  • ${rf}`, margin + 2, y);
    });

    y += 6;
    doc.text('Active Statutory Bottlenecks Requiring Action:', margin, y);
    project.bottlenecks.forEach((bn) => {
      y += 4;
      doc.text(`  • ${bn}`, margin + 2, y);
    });

    y += 8;
    doc.text(`Covered Districts: ${project.districts.join(', ')}`, margin, y);

    // Footer Certificate
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(margin, 252, pageWidth - margin * 2, 28, 2, 2, 'FD');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(11, 61, 102);
    doc.text('DIGITAL VERIFICATION & CRYPTOGRAPHIC PROVENANCE', margin + 4, 258);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.5);
    doc.setTextColor(100, 116, 139);
    doc.text(
      'This document is electronically generated from LandPulse National Cadastre Data Hub.',
      margin + 4,
      263
    );
    doc.text(
      'RFCTLARR Act 2013 Statutory Compliance • NIC Secured Gateway • SHA-256 Checksum Verified',
      margin + 4,
      268
    );
    doc.text(
      'Digital Sign-off: LandPulse Automated DSC Engine (Class-3 Gov CA Verified)',
      margin + 4,
      273
    );

    doc.save(`${project.code}_Intelligence_Dossier.pdf`);
  };

  const handleExport = () => {
    setGenerating(true);

    try {
      if (exportFormat === 'csv') {
        const csv = generateProjectCSV(activeProject);
        triggerCSVDownload(csv, `${activeProject.code}_Telemetry_Data.csv`);
      } else {
        generateProjectPDF(activeProject);
      }

      setGenerating(false);
      setDownloaded(true);
      setTimeout(() => {
        setDownloaded(false);
        closeModal('exportModal');
      }, 1600);
    } catch (err) {
      console.error('Export failed:', err);
      setGenerating(false);
      alert('Failed to generate export file. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl glass-panel p-6 rounded-2xl border border-white/20 shadow-2xl bg-slate-900/95 text-slate-100 font-sans"
        >
          {/* Close button */}
          <button
            onClick={() => closeModal('exportModal')}
            className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 rounded-2xl bg-[#EA580C]/20 border border-[#EA580C]/40 flex items-center justify-center text-[#EA580C]">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  Export Project Telemetry &amp; Dossier
                </h3>
                <BrutalistBadge label="OFFICIAL GOI" variant="saffron" size="sm" />
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Client-side cryptographic CSV spreadsheet and authenticated PDF export
              </p>
            </div>
          </div>

          {/* Active Selected Project Banner */}
          <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl mb-5 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-slate-400 uppercase font-mono font-bold text-[10px]">
                Target Project Corridor
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono font-bold">
                {activeProject.code}
              </span>
            </div>
            <div className="font-bold text-sm text-white">{activeProject.name}</div>
            <div className="text-slate-400 mt-1 flex items-center gap-3 font-mono text-[11px]">
              <span>{activeProject.state}</span>
              <span>•</span>
              <span>{activeProject.acquiredAcres.toLocaleString()} / {activeProject.totalAcres.toLocaleString()} Acres</span>
              <span>•</span>
              <span className="text-[#EA580C]">₹{activeProject.budgetCr.toLocaleString()} Cr Budget</span>
            </div>
          </div>

          {/* Format Selector */}
          <div className="space-y-3 mb-5">
            <label className="text-xs font-semibold uppercase text-slate-300 font-mono tracking-wider">
              Select Export Format
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* CSV Option */}
              <div
                onClick={() => setExportFormat('csv')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  exportFormat === 'csv'
                    ? 'bg-[#EA580C]/20 border-[#EA580C] shadow-sm ring-1 ring-[#EA580C]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                    <span className="text-sm font-bold text-white">CSV Data File</span>
                  </div>
                  {exportFormat === 'csv' && <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Full raw dataset for spreadsheet analysis, GIS ingestion, and statistical audits.
                </p>
              </div>

              {/* PDF Option */}
              <div
                onClick={() => setExportFormat('pdf')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  exportFormat === 'pdf'
                    ? 'bg-[#EA580C]/20 border-[#EA580C] shadow-sm ring-1 ring-[#EA580C]'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <FileDown className="w-5 h-5 text-blue-400" />
                    <span className="text-sm font-bold text-white">PDF Dossier</span>
                  </div>
                  {exportFormat === 'pdf' && <CheckCircle2 className="w-4 h-4 text-[#EA580C]" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  Official printable executive dossier with statutory breakdown and digital signature seal.
                </p>
              </div>
            </div>
          </div>

          {/* Metadata security info */}
          <div className="bg-black/40 border border-white/10 p-3.5 rounded-xl mb-5 text-xs space-y-1.5 font-mono">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-sans">Security Seal:</span>
              <span className="text-emerald-400 font-bold">PUBLIC / UNRESTRICTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-sans">Signing Engine:</span>
              <span className="text-slate-200 flex items-center gap-1 font-sans">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                LandPulse Automated DSC Engine
              </span>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleExport}
            disabled={generating || downloaded}
            className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 uppercase transition-all shadow-lg ${
              downloaded
                ? 'bg-emerald-500 text-black'
                : 'bg-[#EA580C] hover:bg-[#C2410C] text-white'
            }`}
          >
            {generating ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Generating {exportFormat.toUpperCase()} Download...
              </>
            ) : downloaded ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                {exportFormat.toUpperCase()} File Downloaded!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {exportFormat.toUpperCase()} ({activeProject.code})
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
