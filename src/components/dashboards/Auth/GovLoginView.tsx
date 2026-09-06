import React, { useState } from 'react';
import { useRole, DEFAULT_PERSONAS } from '../../../context/RoleContext';
import { RoleType, AuthUser } from '../../../types';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Building2,
  Fingerprint,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  HelpCircle,
  Download,
  PhoneCall,
  Shield,
  FileText,
} from 'lucide-react';
import { OfficialLoginTab } from './OfficialLoginTab';
import { CitizenLoginTab } from './CitizenLoginTab';
import { DSCLoginTab } from './DSCLoginTab';

export const GovLoginView: React.FC = () => {
  const { loginUser } = useRole();

  // Active Login Tab
  const [activeTab, setActiveTab] = useState<'official' | 'citizen' | 'dsc'>('official');

  // General Loading & Feedback State
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const triggerLoginSuccess = (user: AuthUser, destinationRole: RoleType, message: string) => {
    setIsLoading(true);
    setSuccessMessage(message);

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0B3D66', '#1E3A8A', '#059669'],
      });
    } catch {
      // Ignore confetti errors
    }

    setTimeout(() => {
      loginUser(user, destinationRole);
    }, 1000);
  };

  // Handle Quick Access Role Login
  const handlePersonaLogin = (key: keyof typeof DEFAULT_PERSONAS) => {
    const persona = DEFAULT_PERSONAS[key];
    triggerLoginSuccess(
      persona,
      persona.role,
      `Logged in as ${persona.name} (${persona.roleTitle})`
    );
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-[calc(100vh-160px)] py-8 px-4 sm:px-8 2xl:px-20 font-sans">
      <div className="w-full max-w-[1400px] mx-auto space-y-6">

        {/* Feedback Alert if logging in */}
        {successMessage && (
          <div className="bg-[#0B3D66] text-white px-5 py-3.5 rounded-lg shadow-md flex items-center gap-3 border-l-4 border-amber-400 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0 text-amber-300" />
            <div className="font-semibold text-sm">{successMessage}</div>
          </div>
        )}

        {/* 2-Column Main Layout: Left Form + Right Quick Access Roles & Helpdesk */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ========================================================================= */}
          {/* LEFT 7 COLS: Government Standard Authentication Form Box                 */}
          {/* ========================================================================= */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-slate-300 shadow-sm overflow-hidden">
            
            {/* Header / Portal Title Banner */}
            <div className="px-6 py-4 bg-[#F8FAFC] border-b border-slate-200 flex items-center justify-between">
              <div>
                <h1 className="text-base sm:text-lg font-bold text-[#0B3D66]">
                  Portal Authentication Gateway
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  National Single Sign-On (NSSO) • PM GatiShakti • RFCTLARR MIS
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-white px-2.5 py-1 rounded border border-slate-200">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-mono text-[11px] font-semibold">256-Bit SSL</span>
              </div>
            </div>

            {/* Standard Understated Tabs (like eGramSwaraj / DigiLocker / UMANG) */}
            <div className="flex border-b border-slate-200 bg-slate-50 text-xs sm:text-sm font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('official')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'official'
                    ? 'bg-white text-[#0B3D66] border-[#0B3D66] font-bold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Building2 className="w-4 h-4 text-[#0B3D66]" />
                <span>Official SSO (Parichay)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('citizen')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'citizen'
                    ? 'bg-white text-[#0B3D66] border-[#0B3D66] font-bold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Fingerprint className="w-4 h-4 text-slate-700" />
                <span>Citizen / Landowner</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('dsc')}
                className={`flex-1 py-3 px-4 flex items-center justify-center gap-2 border-b-2 transition-colors ${
                  activeTab === 'dsc'
                    ? 'bg-white text-[#0B3D66] border-[#0B3D66] font-bold'
                    : 'text-slate-600 border-transparent hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CreditCard className="w-4 h-4 text-slate-700" />
                <span>DSC Token (Class 3)</span>
              </button>
            </div>

            {/* TAB CONTENT: Delegated to Child Components */}
            {activeTab === 'official' && (
              <OfficialLoginTab
                isLoading={isLoading}
                onSuccess={triggerLoginSuccess}
                onPersonaLogin={handlePersonaLogin}
              />
            )}

            {activeTab === 'citizen' && (
              <CitizenLoginTab
                isLoading={isLoading}
                onSuccess={triggerLoginSuccess}
                onPersonaLogin={handlePersonaLogin}
              />
            )}

            {activeTab === 'dsc' && (
              <DSCLoginTab
                isLoading={isLoading}
                onSuccess={triggerLoginSuccess}
              />
            )}

            {/* Subtle Footer Trust Badges (NIC / CERT-In / SHA-256) */}
            <div className="bg-[#F8FAFC] px-6 py-2.5 border-t border-slate-200 flex flex-wrap items-center justify-between text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-slate-400" /> NIC Certified &amp; STQC Compliant
              </span>
              <span>TLS 1.3 Encryption Active</span>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* RIGHT 5 COLS: Quick Access Stakeholder Portals & Helpdesk (Subtle Tone)  */}
          {/* ========================================================================= */}
          <div className="lg:col-span-5 space-y-6">

            {/* Quick Access Roles Container */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-3">
              <div className="border-b border-slate-200 pb-2.5">
                <h2 className="text-sm font-bold text-[#0B3D66]">
                  Stakeholder Role Directory
                </h2>
                <p className="text-xs text-slate-500">
                  Select a predefined officer profile to inspect dedicated operational modules:
                </p>
              </div>

              <div className="space-y-2">
                {/* 1. Command Center */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('command_center')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-[#0B3D66] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      JS
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Shri Arun K. Mehta, IAS
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        National Command Center Director (MoRD)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 2. Citizen Landowner */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('citizen')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      RP
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Ramesh Narayan Patel (Citizen)
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        Landowner Beneficiary (Survey No. 142/3A)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 3. Field Officer */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('field_officer')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      SM
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        S. Murugan (Surveyor)
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        Senior Revenue Inspector &amp; NavIC RTK DGPS
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 4. District CALA */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('district_officer')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      RV
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Dr. Rajeshwar Verma, IAS
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        Special Land Acquisition Officer (CALA)
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>

                {/* 5. Intelligence Layer */}
                <button
                  type="button"
                  onClick={() => handlePersonaLogin('intelligence_layer')}
                  className="w-full text-left p-2.5 rounded border border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-slate-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                      MN
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-900 group-hover:text-[#0B3D66]">
                        Dr. Meera Nambiar
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[220px]">
                        PM GatiShakti Spatial &amp; Risk Analytics Lead
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0B3D66]" />
                </button>
              </div>
            </div>

            {/* Official Directives & Helpdesk */}
            <div className="bg-white rounded-lg border border-slate-300 shadow-sm p-5 space-y-3">
              <div className="text-xs font-bold text-[#0B3D66] uppercase tracking-wide">
                Statutory Guidelines &amp; Helpdesk
              </div>

              <div className="text-xs text-slate-600 space-y-2 leading-relaxed">
                <p>
                  <strong>PFMS Direct Benefit Transfer:</strong> Beneficiaries are advised to ensure their bank accounts are Aadhaar-seeded for expedited compensation disbursements.
                </p>
                <p className="text-[11px] text-slate-500">
                  Authentication is governed under the Information Technology Act, 2000 and Aadhaar Act, 2016.
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    <PhoneCall className="w-3.5 h-3.5 text-[#0B3D66]" /> Citizen Helpdesk:
                  </span>
                  <span className="font-mono font-bold text-slate-800">1800-11-LAND (5263)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-[#0B3D66]" /> Technical Support:
                  </span>
                  <span className="text-[#0B3D66] font-medium">support-landpulse@nic.in</span>
                </div>
              </div>
            </div>

            {/* Download Manual (Subtle) */}
            <div className="bg-white rounded-lg border border-slate-300 p-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4 text-[#0B3D66]" />
                <div>
                  <div className="text-xs font-semibold text-slate-800">Officer User Manual</div>
                  <div className="text-[10px] text-slate-500">PDF • 4.2 MB • Aug 2026</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => alert('Downloading LandPulse_User_Manual.pdf')}
                className="p-1.5 text-slate-600 hover:text-[#0B3D66] transition-colors"
                title="Download PDF"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
