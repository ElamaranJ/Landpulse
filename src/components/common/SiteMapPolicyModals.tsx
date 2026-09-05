import React from 'react';
import { useRole } from '../../context/RoleContext';
import {
  Map,
  X,
  Shield,
  FileText,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

export const SiteMapPolicyModals: React.FC = () => {
  const {
    siteMapOpen,
    setSiteMapOpen,
    privacyPolicyOpen,
    setPrivacyPolicyOpen,
    setCurrentRole,
    setCalcModalOpen,
    setCaseTrackerOpen,
    setGrievanceModalOpen,
    setNotificationSearchOpen,
    setDgpsViewerOpen,
    setDigitalAwardOpen,
    setBulkUploadOpen,
    setOpenDataOpen,
  } = useRole();

  if (!siteMapOpen && !privacyPolicyOpen) return null;

  return (
    <>
      {/* 1. Site Map Modal */}
      {siteMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-4xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Map className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">LandPulse Portal Site Map</h2>
                  <p className="text-xs text-blue-200">
                    Comprehensive hierarchy of public and restricted portal modules (GIGW 3.0 Standard)
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSiteMapOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-xs">
              
              {/* Col 1 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#0B3D66] border-b border-slate-200 pb-1">
                  1. Public &amp; Portal Home
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>
                    <button onClick={() => { setCurrentRole('home'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Government Portal Home
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('acts'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Acts, Rules &amp; Policies (RFCTLARR)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('whoswho'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Who's Who (Officer Directory)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('rti'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Citizen Charter &amp; RTI Online
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('login'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline font-bold text-blue-800">
                      • Single Sign-On Gateway (Parichay/SSO)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 2 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#0B3D66] border-b border-slate-200 pb-1">
                  2. Citizen Services
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>
                    <button onClick={() => { setCaseTrackerOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline font-semibold">
                      • Track Land Case Status
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCalcModalOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline font-semibold">
                      • RFCTLARR Compensation Calculator
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setGrievanceModalOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline font-semibold">
                      • Lodge Section 15 Objection (CPGRAMS)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setNotificationSearchOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Gazette Notifications Search
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('citizen'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Citizen Corner &amp; Document Vault
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div className="space-y-2">
                <h3 className="font-bold text-sm text-[#0B3D66] border-b border-slate-200 pb-1">
                  3. Field, Officer &amp; Open Data
                </h3>
                <ul className="space-y-1.5 text-slate-700">
                  <li>
                    <button onClick={() => { setCurrentRole('command_center'); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • National Command Center (MoRD)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setDgpsViewerOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • NavIC DGPS Cadastral Viewer
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setDigitalAwardOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Digital Form 7 Award Sheet &amp; DSC
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setBulkUploadOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline">
                      • Patwari Bulk Data Ingestion
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setOpenDataOpen(true); setSiteMapOpen(false); }} className="hover:text-blue-700 hover:underline font-bold text-blue-800">
                      • Open Data API &amp; Datasets
                    </button>
                  </li>
                </ul>
              </div>

            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setSiteMapOpen(false)}
                className="px-4 py-1.5 bg-[#0B3D66] text-white text-xs font-bold rounded"
              >
                Close Site Map
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Privacy Policy & Terms Modal */}
      {privacyPolicyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white w-full max-w-3xl rounded-xl shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="bg-[#0B3D66] text-white px-6 py-4 flex items-center justify-between border-b-2 border-amber-400">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <Shield className="w-6 h-6 text-amber-300" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Privacy Policy &amp; Terms of Use</h2>
                  <p className="text-xs text-blue-200">
                    Department of Land Resources (DoLR), Government of India
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPrivacyPolicyOpen(false)}
                className="p-1.5 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
              <h3 className="text-sm font-bold text-[#0B3D66]">1. Data Ownership &amp; Statutory Compliance</h3>
              <p>
                All land records, survey coordinates, valuation models, and compensation data displayed on LandPulse are owned by the Department of Land Resources (DoLR), Ministry of Rural Development, and respective State Revenue Authorities under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR).
              </p>

              <h3 className="text-sm font-bold text-[#0B3D66]">2. Aadhaar &amp; Personal Data Protection</h3>
              <p>
                Aadhaar numbers are masked in compliance with the Aadhaar Act, 2016 and UIDAI guidelines. Authentication tokens generated for Direct Benefit Transfer (DBT) via PFMS are encrypted with 256-bit TLS 1.3 encryption and are never stored in plain text.
              </p>

              <h3 className="text-sm font-bold text-[#0B3D66]">3. Hyperlinking Policy</h3>
              <p>
                Links to external portals (such as PM GatiShakti, PFMS, Bhuvan ISRO, data.gov.in) are provided for convenience. DoLR is not responsible for the contents or reliability of linked external websites.
              </p>

              <h3 className="text-sm font-bold text-[#0B3D66]">4. Copyright &amp; Attribution</h3>
              <p>
                Content on this portal may be reproduced without prior permission subject to the condition that the material is reproduced accurately and not used in a misleading context, with due attribution to LandPulse / DoLR.
              </p>
            </div>

            <div className="bg-slate-100 px-6 py-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setPrivacyPolicyOpen(false)}
                className="px-4 py-1.5 bg-[#0B3D66] text-white text-xs font-bold rounded"
              >
                Accept &amp; Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
