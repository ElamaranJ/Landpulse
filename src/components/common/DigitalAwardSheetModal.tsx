import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useModals } from '../../context/ModalContext';
import {
  FileCheck2,
  X,
  Printer,
  Download,
  CheckCircle2,
  ShieldCheck,
  Cpu,
  Lock,
  Building,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const DigitalAwardSheetModal: React.FC = () => {
  const { currentUser } = useRole();
  const { isModalOpen, closeModal } = useModals();
  const navigate = useNavigate();

  const [isSigned, setIsSigned] = useState(false);
  const [isSigning, setIsSigning] = useState(false);

  if (!isModalOpen('digitalAward')) return null;

  const isAuthorized = currentUser && (
    currentUser.role === 'district_officer' ||
    currentUser.role === 'citizen'
  );

  const handleSignWithDSC = () => {
    setIsSigning(true);
    setTimeout(() => {
      setIsSigning(false);
      setIsSigned(true);
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {}
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-lg">
              <FileCheck2 className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Statutory Form 7: Digital Award &amp; Solatium Sanction</h2>
              <p className="text-xs text-blue-200">
                Issued under Section 23 &amp; Section 30 of RFCTLARR Act, 2013
              </p>
            </div>
          </div>
          <button
            onClick={() => closeModal('digitalAward')}
            className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Digital Document View Body */}
        {!isAuthorized ? (
          <div className="p-6 space-y-5 bg-slate-50 overflow-y-auto">
            <div className="bg-rose-50 border-l-4 border-rose-600 p-4 rounded-r-lg flex items-start gap-3 shadow-xs">
              <ShieldAlert className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-bold text-rose-950 uppercase tracking-wide">
                  Access Restricted — Confidential Beneficiary Record
                </h3>
                <p className="text-xs text-rose-800 mt-0.5">
                  Statutory Form 7 digital award sheets contain confidential land compensation records, solatium valuations, and Direct Benefit Transfer (DBT) bank credentials. Access is restricted to the specific landowner beneficiary or the Competent Authority for Land Acquisition (CALA).
                </p>
              </div>
            </div>

            <div className="border border-slate-300 rounded-lg overflow-hidden bg-white shadow-xs">
              <div className="bg-[#0B3D66] text-white px-4 py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between">
                <span>Statutory Privacy &amp; Entitlement Register</span>
                <span className="text-[11px] font-mono text-amber-300 font-semibold">FORM SEC-403</span>
              </div>
              <table className="gov-stage-register">
                <tbody>
                  <tr>
                    <th className="w-1/3">Authorized Beneficiary / Officer</th>
                    <td className="font-bold text-[#0B3D66]">
                      Registered Landowner Beneficiary (<span className="font-mono text-xs">citizen</span>) or District CALA Officer (<span className="font-mono text-xs">district_officer</span>)
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
                      Under Section 23/30 of RFCTLARR Act 2013 and Aadhaar Privacy Provisions, compensation award sheets are accessible exclusively to verified awardees and the sanctioning Collector/CALA.
                    </td>
                  </tr>
                  <tr>
                    <th>Remedial Action</th>
                    <td className="flex items-center gap-3 py-3">
                      <button
                        onClick={() => {
                          closeModal('digitalAward');
                          navigate('/login');
                        }}
                        className="bg-[#0B3D66] hover:bg-[#072742] text-white font-bold px-4 py-1.5 rounded text-xs inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-300" />
                        <span>Log In as Citizen / CALA Officer</span>
                      </button>
                      <button
                        onClick={() => closeModal('digitalAward')}
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
          <div className="p-6 overflow-y-auto bg-slate-100 flex justify-center">
          
          {/* Printable Gazette Paper Container */}
          <div className="bg-white w-full max-w-2xl p-8 rounded-lg shadow-md border border-slate-300 relative font-serif text-slate-900 space-y-5">
            
            {/* National Emblem Watermark & Header */}
            <div className="text-center border-b-2 border-slate-900 pb-4 space-y-1">
              <div className="w-12 h-14 mx-auto flex items-center justify-center">
                <svg viewBox="0 0 100 120" className="w-full h-full fill-[#0B3D66]">
                  <circle cx="50" cy="20" r="14" />
                  <rect x="42" y="34" width="16" height="30" />
                  <rect x="25" y="40" width="12" height="24" />
                  <rect x="63" y="40" width="12" height="24" />
                  <polygon points="10,80 90,80 80,95 20,95" />
                </svg>
              </div>
              <div className="text-xs font-bold uppercase tracking-widest text-[#0B3D66]">
                GOVERNMENT OF INDIA • DEPARTMENT OF LAND RESOURCES
              </div>
              <div className="text-sm font-extrabold uppercase">
                OFFICE OF THE SPECIAL LAND ACQUISITION OFFICER &amp; CALA
              </div>
              <div className="text-xs text-slate-600 font-sans">
                District Collectorate Complex, Palghar - 401404, Maharashtra
              </div>
            </div>

            {/* Award Reference Number */}
            <div className="flex justify-between items-center text-xs font-sans border-b border-slate-200 pb-2">
              <div>
                <strong>Award No:</strong> <span className="font-mono font-bold">CALA/PLG/DME/2026/AW-8821</span>
              </div>
              <div>
                <strong>Gazette Date:</strong> 10 Feb 2026
              </div>
            </div>

            {/* Form Title */}
            <div className="text-center py-1">
              <h3 className="text-base font-bold underline uppercase tracking-wide">
                FORM 7: FINAL DETERMINATION OF COMPENSATION AWARD
              </h3>
              <p className="text-xs text-slate-600 italic mt-0.5">
                (Under Sections 23, 26, 27, 28, 29 &amp; 30 of Act No. 30 of 2013)
              </p>
            </div>

            {/* Beneficiary Details Table */}
            <div className="text-xs font-sans space-y-2">
              <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <span className="text-slate-500">Name of Awardee / Landowner:</span><br />
                  <strong>Shri Ramesh Narayan Patel (Son of Late Narayan Patel)</strong>
                </div>
                <div>
                  <span className="text-slate-500">Survey No / Khata No:</span><br />
                  <strong className="font-mono">Survey 142/3A | Khata KH-9021</strong>
                </div>
                <div>
                  <span className="text-slate-500">Acquisition Purpose:</span><br />
                  <strong>Delhi–Mumbai Expressway (Vadodara–Mumbai Spur)</strong>
                </div>
                <div>
                  <span className="text-slate-500">Acquired Extent:</span><br />
                  <strong>2.45 Acres (Agricultural - Irrigated)</strong>
                </div>
              </div>
            </div>

            {/* Financial Solatium Determination Table */}
            <div className="text-xs font-sans">
              <table className="w-full border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-slate-100 font-bold text-left">
                    <th className="border border-slate-300 p-2">Item Head</th>
                    <th className="border border-slate-300 p-2">Statutory Section</th>
                    <th className="border border-slate-300 p-2 text-right">Determined Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-300 p-2">1. Multiplied Market Value of Land (2.45 Acres × 2.00 Multiplier)</td>
                    <td className="border border-slate-300 p-2 font-mono">Sec 26(1)</td>
                    <td className="border border-slate-300 p-2 text-right font-mono font-semibold">₹90,65,000</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-300 p-2">2. Valuation of Assets, Structures &amp; Standing Trees</td>
                    <td className="border border-slate-300 p-2 font-mono">Sec 29(1)</td>
                    <td className="border border-slate-300 p-2 text-right font-mono font-semibold">₹1,35,000</td>
                  </tr>
                  <tr className="bg-amber-50">
                    <td className="border border-slate-300 p-2 font-bold text-amber-950">3. Statutory Solatium (100% of Total Market Value)</td>
                    <td className="border border-slate-300 p-2 font-mono font-bold text-amber-950">Sec 30(1)</td>
                    <td className="border border-slate-300 p-2 text-right font-mono font-bold text-amber-950">₹92,00,000</td>
                  </tr>
                  <tr className="bg-emerald-50 font-bold">
                    <td className="border border-slate-300 p-2 text-emerald-950">Grand Total Award Sanctioned for PFMS DBT</td>
                    <td className="border border-slate-300 p-2 font-mono text-emerald-950">Sec 23</td>
                    <td className="border border-slate-300 p-2 text-right font-mono text-emerald-950 text-sm">₹1,84,00,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Digital Signature Box */}
            <div className="pt-4 border-t border-slate-300 flex justify-between items-end text-xs font-sans">
              <div className="space-y-1">
                <div className="w-16 h-16 bg-slate-100 rounded border border-slate-300 p-1 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-800 rounded flex items-center justify-center text-white text-[8px] font-mono text-center leading-tight">
                    QR-VERIFY<br />#8821-2026
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">CCA India Cert ID: 9948-2819</span>
              </div>

              <div className="text-right space-y-1">
                {isSigned ? (
                  <div className="bg-emerald-50 border-2 border-emerald-500 p-2.5 rounded-lg text-emerald-900 text-left font-mono text-[11px] shadow-xs">
                    <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Digitally Signed with Class-3 DSC
                    </div>
                    <div>Signatory: <strong>Dr. Rajeshwar Verma, IAS</strong></div>
                    <div>CALA &amp; SLAO Palghar, Govt of Maharashtra</div>
                    <div>Timestamp: 28 Aug 2026, 08:45:12 IST</div>
                  </div>
                ) : (
                  <div className="text-slate-500 italic text-[11px]">
                    Pending Class-3 Digital Signature Authentication
                  </div>
                )}
                <div className="font-bold text-slate-800">Special Land Acquisition Officer (CALA)</div>
              </div>
            </div>

          </div>

        </div>
        )}

        {/* Footer Actions */}
        {isAuthorized && (
          <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {!isSigned ? (
              <button
                onClick={handleSignWithDSC}
                disabled={isSigning}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded flex items-center gap-2 shadow-xs transition-colors"
              >
                <Cpu className="w-4 h-4 text-amber-300" />
                <span>{isSigning ? 'Signing with Class-3 DSC...' : 'e-Sign Award Sheet with DSC'}</span>
              </button>
            ) : (
              <span className="text-xs font-bold text-emerald-700 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" /> Cryptographically Signed &amp; Disbursal Authorized
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => alert('Printing Form 7 Digital Award Sheet...')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print Award
            </button>
            <button
              onClick={() => alert('Downloading Gazette Form 7 PDF')}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 text-xs font-bold rounded flex items-center gap-1.5 shadow-xs"
            >
              <Download className="w-3.5 h-3.5 text-[#0B3D66]" /> Download PDF
            </button>
            <button
              onClick={() => closeModal('digitalAward')}
              className="px-4 py-1.5 bg-[#0B3D66] text-white text-xs font-bold rounded"
            >
              Close
            </button>
          </div>
        </div>
        )}

      </div>
    </div>
  );
};
