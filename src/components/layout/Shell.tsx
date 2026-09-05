import React from 'react';
import { Topbar } from './Topbar';
import { CommandPalette } from './CommandPalette';
import { ExportReportModal } from '../common/ExportReportModal';
import { useRole } from '../../context/RoleContext';
import {
  Compass,
  User,
  MapPin,
  Building2,
  Cpu,
  ChevronRight,
  Shield,
  Layers,
  Database,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import type { RoleType } from '../../types';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { currentRole, setCurrentRole } = useRole();

  const navItems: { id: RoleType; label: string; icon: React.ComponentType<{ className?: string }>; code: string }[] = [
    { id: 'command_center', label: 'National Command Center', icon: Compass, code: 'N-CMD' },
    { id: 'citizen', label: 'Citizen Case Tracker', icon: User, code: 'C-LARR' },
    { id: 'field_officer', label: 'Field Cadastral Inspection', icon: MapPin, code: 'F-DGPS' },
    { id: 'district_officer', label: 'District Administration', icon: Building2, code: 'D-SLAO' },
    { id: 'intelligence_layer', label: 'AI Health & Risk Engine', icon: Cpu, code: 'R-AI' },
  ];

  const getBreadcrumbContext = () => {
    switch (currentRole) {
      case 'citizen':
        return 'Maharashtra > Palghar District > Vadavali Khurd > Survey #142/3B';
      case 'field_officer':
        return 'Western Region > Palghar Circle > DGPS Field Unit 04';
      case 'district_officer':
        return 'State of Maharashtra > District Palghar > SLAO Division Office';
      case 'intelligence_layer':
        return 'National Master Grid > AI Risk & Bottleneck Telemetry';
      default:
        return 'Union of India > National Master Plan > Cross-Corridor View';
    }
  };

  return (
    <div className="min-h-screen bg-[#070C18] text-slate-100 flex flex-col font-sans">
      {/* Top Header Bar */}
      <Topbar />

      {/* Persistent Jurisdictional Hierarchy Breadcrumb Bar */}
      <div className="bg-[#0A1122] border-b border-white/5 px-4 lg:px-8 py-1.5 text-xs text-slate-400 font-mono flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-[11px]">
          <span className="text-slate-500 uppercase font-semibold">Hierarchy:</span>
          <span className="text-orange-500 font-bold">GOI</span>
          <ChevronRight className="w-3 h-3 text-slate-600" />
          <span className="text-slate-300">{getBreadcrumbContext()}</span>
        </div>

        <div className="flex items-center gap-4 text-[10px] text-slate-500 hidden sm:flex">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-slate-400" />
            Last Reconciled: <strong>27 Aug 2026, 14:30:12 IST</strong>
          </span>
          <span>•</span>
          <span className="text-emerald-400 font-bold">SHA-256 DSC VALIDATED</span>
        </div>
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 gap-5">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:flex flex-col justify-between w-60 gov-card p-3 shrink-0 sticky top-24 h-[calc(100vh-8.5rem)] rounded-md">
          <div className="space-y-4">
            {/* Operational Mode Header */}
            <div className="p-2.5 rounded bg-black/40 border border-white/5 text-xs font-mono">
              <span className="text-[10px] text-slate-400 uppercase font-bold block mb-0.5">
                OPERATIONAL SESSION
              </span>
              <div className="flex items-center justify-between">
                <span className="text-white font-bold">SEC-23 PRODUCTION</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                  ACTIVE
                </span>
              </div>
            </div>

            {/* Nav list */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase font-bold px-2 block mb-1">
                System Consoles
              </span>

              {navItems.map((item) => {
                const isActive = currentRole === item.id;
                const Icon = item.icon;

                return (
                  <button
                    key={item.id}
                    onClick={() => setCurrentRole(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded text-xs font-mono font-medium transition-colors ${
                      isActive
                        ? 'bg-orange-600 text-white font-bold shadow-xs'
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      <span className="font-sans text-xs">{item.label}</span>
                    </div>

                    <span
                      className={`text-[9px] font-mono px-1 rounded ${
                        isActive ? 'bg-black/30 text-white' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      {item.code}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="pt-3 border-t border-white/10 text-[10px] font-mono text-slate-400 space-y-1.5">
            <div className="flex items-center justify-between">
              <span>Security Level:</span>
              <span className="text-slate-200 font-bold">RESTRICTED</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Cadastre Sync:</span>
              <span className="text-emerald-400">100% Locked</span>
            </div>
          </div>
        </aside>

        {/* Main Content View Container */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* Enterprise Government Footer & Regulatory Attributions */}
      <footer className="w-full bg-[#050914] border-t border-white/10 px-4 lg:px-8 py-3 mt-8 text-[11px] font-mono text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>Designed & Developed by <strong>National Informatics Centre (NIC)</strong></span>
            <span className="text-slate-600">|</span>
            <span>Department of Land Resources (DoLR), MoRD</span>
            <span className="text-slate-600">|</span>
            <span>PFMS Integration Protocol v3.8</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>LandPulse Enterprise v4.2.1-prod</span>
            <span className="text-emerald-400">● Server Uptime: 99.98%</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <CommandPalette />
      <ExportReportModal />
    </div>
  );
};
