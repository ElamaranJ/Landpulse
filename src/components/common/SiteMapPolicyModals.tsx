import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import { useModals } from '../../context/ModalContext';
import { X } from 'lucide-react';

export const SiteMapPolicyModals: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, setCurrentRole } = useRole();
  const { isModalOpen, closeModal, openModal } = useModals();

  const siteMapOpen = isModalOpen('siteMap');
  const privacyPolicyOpen = isModalOpen('privacyPolicy');

  const handleOpenProtectedModal = (modalName: 'dgpsViewer' | 'digitalAward' | 'bulkUpload') => {
    closeModal('siteMap');
    if (!currentUser) {
      navigate('/login');
      return;
    }
    openModal(modalName);
  };

  if (!siteMapOpen && !privacyPolicyOpen) return null;

  return (
    <>
      {/* 1. Site Map Modal */}
      {siteMapOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3">
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                  LandPulse Portal Site Map
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Comprehensive hierarchy of public and restricted portal modules (GIGW 3.0 Standard)
                </p>
              </div>
              <button
                onClick={() => closeModal('siteMap')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-4">
              
              {/* Col 1 */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Public &amp; Portal Home</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li>
                    <button onClick={() => { setCurrentRole('home'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Government Portal Home
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('acts'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Acts, Rules &amp; Policies (RFCTLARR)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('whoswho'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Who&apos;s Who (Officer Directory)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('rti'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Citizen Charter &amp; RTI Online
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('login'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline font-bold text-[#1E4D79] cursor-pointer text-left">
                      • Single Sign-On Gateway (Parichay/SSO)
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 2 */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Citizen Services</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li>
                    <button onClick={() => { closeModal('siteMap'); openModal('caseTracker'); }} className="hover:text-[#1E4D79] hover:underline font-semibold cursor-pointer text-left">
                      • Track Land Case Status
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { closeModal('siteMap'); openModal('calc'); }} className="hover:text-[#1E4D79] hover:underline font-semibold cursor-pointer text-left">
                      • RFCTLARR Compensation Calculator
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { closeModal('siteMap'); openModal('grievance'); }} className="hover:text-[#1E4D79] hover:underline font-semibold cursor-pointer text-left">
                      • Lodge Section 15 Objection (CPGRAMS)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { closeModal('siteMap'); openModal('notificationSearch'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Gazette Notifications Search
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { setCurrentRole('citizen'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Citizen Corner &amp; Document Vault
                    </button>
                  </li>
                </ul>
              </div>

              {/* Col 3 */}
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Field &amp; Administration</span>
                </div>
                <ul className="space-y-2 text-xs text-slate-700 font-medium">
                  <li>
                    <button onClick={() => { setCurrentRole('command_center'); closeModal('siteMap'); }} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • National Command Center (MoRD)
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOpenProtectedModal('dgpsViewer')} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • NavIC DGPS Cadastral Viewer
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOpenProtectedModal('digitalAward')} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Digital Form 7 Award Sheet &amp; DSC
                    </button>
                  </li>
                  <li>
                    <button onClick={() => handleOpenProtectedModal('bulkUpload')} className="hover:text-[#1E4D79] hover:underline cursor-pointer text-left">
                      • Patwari Bulk Data Ingestion
                    </button>
                  </li>
                  <li>
                    <button onClick={() => { closeModal('siteMap'); openModal('openData'); }} className="hover:text-[#1E4D79] hover:underline font-bold text-[#1E4D79] cursor-pointer text-left">
                      • Open Data API &amp; Datasets
                    </button>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('siteMap')}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Close Site Map
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 2. Privacy Policy & Terms Modal */}
      {privacyPolicyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/50 backdrop-blur-xs animate-fadeIn overflow-y-auto">
          <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden p-6 sm:p-8 relative my-auto">
            
            {/* Header */}
            <div className="flex items-start justify-between pb-3">
              <div>
                <h2 className="text-2xl sm:text-[26px] font-bold text-[#0F172A] tracking-tight">
                  Privacy Policy &amp; Terms of Use
                </h2>
                <p className="text-sm text-slate-500 mt-0.5">
                  Department of Land Resources (DoLR), Government of India
                </p>
              </div>
              <button
                onClick={() => closeModal('privacyPolicy')}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5 mt-4 text-xs text-slate-700 leading-relaxed">
              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Data Ownership &amp; Statutory Compliance</span>
                </div>
                <p className="pl-9 text-slate-600">
                  All land records, survey coordinates, valuation models, and compensation data displayed on LandPulse are owned by the Department of Land Resources (DoLR), Ministry of Rural Development, and respective State Revenue Authorities under the Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 (RFCTLARR).
                </p>
              </div>

              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Aadhaar &amp; Personal Data Protection</span>
                </div>
                <p className="pl-9 text-slate-600">
                  Aadhaar numbers are masked in compliance with the Aadhaar Act, 2016 and UIDAI guidelines. Authentication tokens generated for Direct Benefit Transfer (DBT) via PFMS are encrypted with 256-bit TLS 1.3 encryption and are never stored in plain text.
                </p>
              </div>

              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Hyperlinking &amp; Terms of Use</span>
                </div>
                <p className="pl-9 text-slate-600">
                  Links to external portals (such as PM GatiShakti, PFMS, Bhuvan ISRO, data.gov.in) are provided for convenience. Content on this portal may be reproduced with due attribution to LandPulse / DoLR in accordance with GIGW 3.0 norms.
                </p>
              </div>

              <div>
                <div className="bg-[#EEF3F8] rounded-lg px-4 py-2 flex items-center gap-3 mb-2">
                  <div className="w-6 h-6 rounded-full bg-[#1E436C] text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <span className="font-bold text-sm text-[#1E293B]">Accessibility Statement (GIGW 3.0 &amp; WCAG 2.1 AA)</span>
                </div>
                <p className="pl-9 text-slate-600">
                  LandPulse is committed to ensuring portal accessibility for all citizens, including people with visual, motor, or auditory impairments. The portal complies with World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards and Guidelines for Indian Government Websites (GIGW 3.0).
                </p>
              </div>
            </div>

            {/* Bottom Form Actions */}
            <div className="flex items-center justify-end pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={() => closeModal('privacyPolicy')}
                className="px-8 py-2.5 bg-[#1E4D79] hover:bg-[#163B5F] text-white font-semibold text-sm rounded-lg shadow-sm transition-colors cursor-pointer"
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
