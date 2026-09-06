import React, { useState } from 'react';
import type { CaseDocument } from '../../../types';
import { Download, RefreshCw } from 'lucide-react';

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
    <div style={{ marginBottom: '12px' }}>
      {/* Section Divider */}
      <div className="gov-section-divider">
        <span className="section-label">
          DIGITAL DOCUMENT VAULT &amp; GAZETTE RECORDS — DSC AUTHENTICATED &bull; {documents.length} Documents &bull; 16.8 MB
        </span>
      </div>

      {/* Document Register Table */}
      <div style={{ overflowX: 'auto' }}>
        <table className="gov-stage-register">
          <thead>
            <tr>
              <th style={{ width: '45px' }}>S.No.</th>
              <th>Document Title</th>
              <th style={{ width: '100px' }}>Type</th>
              <th style={{ width: '100px' }}>Upload Date</th>
              <th style={{ width: '140px' }}>Digital Seal No.</th>
              <th style={{ width: '65px' }}>Size</th>
              <th style={{ width: '130px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc, idx) => {
              const isDownloading = downloadingId === doc.id;
              return (
                <tr key={doc.id}>
                  <td style={{ textAlign: 'center', fontWeight: 700 }}>{idx + 1}</td>
                  <td>
                    <strong style={{ color: '#0B3D66' }}>{doc.title}</strong>
                  </td>
                  <td style={{ fontSize: '12px' }}>{doc.type}</td>
                  <td style={{ fontSize: '12px' }}>{doc.uploadDate}</td>
                  <td style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>{doc.sealNumber}</td>
                  <td style={{ fontSize: '12px' }}>{doc.size}</td>
                  <td style={{ textAlign: 'center' }}>
                    <button
                      onClick={() => handleDownload(doc.id)}
                      disabled={isDownloading}
                      className="gov-flat-btn gov-flat-btn-secondary"
                      style={{ fontSize: '11px', padding: '4px 10px' }}
                    >
                      {isDownloading ? (
                        <>
                          <RefreshCw style={{ width: '12px', height: '12px', animation: 'spin 1s linear infinite' }} />
                          Verifying…
                        </>
                      ) : (
                        <>
                          <Download style={{ width: '12px', height: '12px' }} />
                          Download PDF
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
