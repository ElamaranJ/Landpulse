import React, { useState } from 'react';
import type { CaseDocument } from '../../../types';
import { Download, ShieldCheck, RefreshCw, FileText } from 'lucide-react';

interface DocumentVaultProps {
  documents: CaseDocument[];
}

export const DocumentVault: React.FC<DocumentVaultProps> = ({ documents }) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (docId: string) => {
    setDownloadingId(docId);
    setTimeout(() => {
      setDownloadingId(null);
    }, 800);
  };

  return (
    <div className="gov-card p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B3D66] font-sans tracking-tight">
              Digital Document Vault &amp; Gazette Records
            </h3>
            <span className="gov-badge gov-badge-success">
              DSC AUTHENTICATED
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Cryptographic tamper-evident repository for Section 4, 19, and 23 gazette orders with verifiable digital signatures
          </p>
        </div>

        <span className="text-xs text-slate-500 font-mono">
          Vault Size: <strong>16.8 MB</strong> • 5 Documents
        </span>
      </div>

      {/* Document Grid with Generous 24px Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {documents.map((doc) => {
          const isDownloading = downloadingId === doc.id;

          return (
            <div
              key={doc.id}
              className="p-5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-2xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2 font-mono">
                  <span className="text-xs px-2.5 py-0.5 rounded-md bg-blue-50 text-[#1D4ED8] font-bold border border-blue-200">
                    {doc.type}
                  </span>
                  <span className="text-xs font-bold text-slate-500">{doc.size}</span>
                </div>

                <h4 className="font-bold text-base text-[#0B3D66] line-clamp-2 mb-3 leading-snug">
                  {doc.title}
                </h4>

                <div className="space-y-1.5 text-xs font-mono text-slate-600 mb-4 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase font-sans text-[11px]">Upload Date:</span>
                    <span className="font-bold text-slate-800">{doc.uploadDate}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 font-bold uppercase font-sans text-[11px]">Digital Seal:</span>
                    <span className="text-emerald-700 font-bold">{doc.sealNumber}</span>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <button
                onClick={() => handleDownload(doc.id)}
                disabled={isDownloading}
                className="h-10 px-4 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[#0B3D66] font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
              >
                {isDownloading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-orange-600" />
                    <span>Verifying DSC Token...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5 text-[#0B3D66]" />
                    <span>Download Authenticated PDF</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
