import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useModals } from '../../context/ModalContext';
import {
  UploadCloud,
  X,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Download,
  Database,
  ArrowRight,
  ShieldAlert,
  Lock,
} from 'lucide-react';

export const BulkLandIngestionModal: React.FC = () => {
  const { isModalOpen, closeModal } = useModals();
  const { currentUser } = useRole();
  const navigate = useNavigate();

  const [fileName, setFileName] = useState<string | null>('Palghar_Vevoor_Survey_Batches_Aug2026.xlsx');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  if (!isModalOpen('bulkUpload')) return null;

  const isAuthorized = currentUser && currentUser.role === 'project_admin';

  const handleUpload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setUploadSuccess(true);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <UploadCloud className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Patwari &amp; Revenue Inspector Bulk Data Ingestion</h2>
              <p className="text-xs text-blue-200">
                Bulk Land Records (RoR), Cadastral Coordinates &amp; Crop Valuation Ingestion
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('bulkUpload')}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {!isAuthorized ? (
          <div className="p-6 space-y-5 bg-slate-50 overflow-y-auto">
            <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg flex items-start gap-3 shadow-xs">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                  Access Restricted — Statutory Admin Authorization Required
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Direct database ingestion of RoR cadastral records and valuation parameters requires Project Implementing Agency Admin privileges with Class 3 DSC tokens.
                </p>
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="bg-[#0B3D66] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Security Clearance Audit Register</span>
                <span className="text-[11px] font-mono text-amber-300 font-semibold">FORM SEC-403</span>
              </div>
              <table className="gov-stage-register">
                <tbody>
                  <tr>
                    <th className="w-1/3">Required Officer Role</th>
                    <td className="font-bold text-[#0B3D66]">
                      Project Implementing Agency Admin (<span className="font-mono text-xs">project_admin</span>)
                    </td>
                  </tr>
                  <tr>
                    <th>Current Session Status</th>
                    <td>
                      {currentUser ? (
                        <span className="text-rose-700 font-bold">
                          {currentUser.name} ({currentUser.roleTitle}) — <span className="underline">Unauthorized Role</span>
                        </span>
                      ) : (
                        <span className="text-slate-600 font-bold italic">
                          Unauthenticated Visitor (Session Inactive / Public Mode)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Statutory Governance Rule</th>
                    <td className="text-xs text-slate-700">
                      Direct database batch upload of RoR records and cadastral geometry is restricted to Project Implementing Agency Admins with Class 3 DSC tokens under DILRMP governance guidelines.
                    </td>
                  </tr>
                  <tr>
                    <th>Remedial Action</th>
                    <td className="flex items-center gap-3 py-3">
                      <button
                        onClick={() => {
                          closeModal('bulkUpload');
                          navigate('/login');
                        }}
                        className="bg-[#0B3D66] hover:bg-[#072742] text-white font-bold px-4 py-1.5 rounded text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Log In as Authorized Admin</span>
                      </button>
                      <button
                        onClick={() => closeModal('bulkUpload')}
                        className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                      >
                        Cancel &amp; Return
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="p-6 overflow-y-auto space-y-6">
          
          {uploadSuccess ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-6 text-center space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <div>
                <h3 className="text-base font-bold text-emerald-900">
                  48 Land Parcels Ingested &amp; Validated Successfully!
                </h3>
                <p className="text-xs text-slate-600 mt-1">
                  All 48 survey polygons synchronized with DILRMP &amp; PM GatiShakti Spatial Datastore.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-xs max-w-md mx-auto">
                <div className="bg-white p-2.5 rounded border border-emerald-200">
                  <div className="text-slate-500">Parcels</div>
                  <strong className="font-mono text-sm text-slate-900">48 Records</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-emerald-200">
                  <div className="text-slate-500">Acquired Extent</div>
                  <strong className="font-mono text-sm text-blue-700">114.2 Acres</strong>
                </div>
                <div className="bg-white p-2.5 rounded border border-emerald-200">
                  <div className="text-slate-500">Est. Solatium</div>
                  <strong className="font-mono text-sm text-emerald-700">₹84.6 Cr</strong>
                </div>
              </div>

              <button
                onClick={() => {
                  setUploadSuccess(false);
                  closeModal('bulkUpload');
                }}
                className="px-5 py-2 bg-[#0B3D66] text-white text-xs font-bold rounded-lg"
              >
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpload} className="space-y-5">
              <div className="p-6 bg-slate-50 border-2 border-dashed border-slate-300 rounded-xl text-center space-y-3">
                <FileSpreadsheet className="w-10 h-10 text-[#0B3D66] mx-auto" />
                <div>
                  <div className="text-sm font-bold text-slate-800">
                    Drop CSV / Excel Spreadsheet File Here
                  </div>
                  <div className="text-xs text-slate-500">
                    Supports .xlsx, .csv, .geojson files up to 25 MB
                  </div>
                </div>

                {fileName && (
                  <div className="bg-white inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold text-[#0B3D66]">
                    <span>{fileName}</span>
                    <span className="text-[10px] text-emerald-600 font-sans font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Ready to Ingest</span>
                  </div>
                )}
              </div>

              {/* Ingestion Schema Mapping preview */}
              <div className="bg-white rounded-lg border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                  <span>Standard Ingestion Schema Fields</span>
                  <button
                    type="button"
                    onClick={() => alert('Downloading LandPulse_Patwari_Template.xlsx')}
                    className="text-xs text-blue-700 font-semibold hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Standard Template
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-600 pt-1">
                  <div>1. Survey No / Khata No</div>
                  <div>2. Landowner Aadhaar</div>
                  <div>3. Land Area (Acres)</div>
                  <div>4. Crop / Tree Counts</div>
                  <div>5. GPS Polygon Coords</div>
                  <div>6. Bank IFSC &amp; A/c</div>
                  <div>7. Gram Sabha Status</div>
                  <div>8. Encumbrance Cert</div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full bg-[#0B3D66] hover:bg-[#072742] text-white py-2.5 px-4 rounded font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-xs"
              >
                <Database className="w-4 h-4 text-amber-300" />
                <span>{isProcessing ? 'Validating Land Schema & Coordinates...' : 'Start Ingestion & Schema Validation'}</span>
              </button>
            </form>
          )}

        </div>
        )}

        {/* Footer */}
        <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Digital India Land Records Modernisation Programme (DILRMP) Gateway</span>
          <button
            onClick={() => closeModal('bulkUpload')}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold rounded"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};
