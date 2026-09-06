import React from 'react';
import { useRole } from '../../context/RoleContext';
import { useModals } from '../../context/ModalContext';
import { useTheme } from '../../context/ThemeContext';
import type { RoleType } from '../../types';
import { BrutalistBadge } from '../common/BrutalistBadge';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Download,
  FileSpreadsheet,
  RefreshCw,
  Shield,
  Layers,
} from 'lucide-react';

export const Topbar: React.FC = () => {
  const {
    currentRole,
    setCurrentRole,
    unreadAlertsCount,
  } = useRole();
  const { openModal, toggleModal } = useModals();
  const { theme, toggleTheme } = useTheme();

  const roleConfigs: { id: RoleType; label: string; code: string }[] = [
    { id: 'command_center', label: 'National Command', code: 'CMD' },
    { id: 'citizen', label: 'Citizen MyCase', code: 'CIT' },
    { id: 'field_officer', label: 'Field Cadastre', code: 'FLD' },
    { id: 'district_officer', label: 'District Admin', code: 'DST' },
    { id: 'intelligence_layer', label: 'Risk Telemetry', code: 'RISK' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090F1E] border-b border-white/10 text-slate-200">
      {/* Topmost Official Government Identity Strip */}
      <div className="w-full bg-[#050914] px-4 lg:px-8 py-1 border-b border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-3">
          <span className="text-orange-500 font-bold">भारत सरकार | Government of India</span>
          <span className="hidden md:inline text-slate-600">|</span>
          <span className="hidden md:inline">Department of Land Resources (DoLR)</span>
          <span className="hidden lg:inline text-slate-600">|</span>
          <span className="hidden lg:inline text-emerald-400">PM GatiShakti NMP Master Grid v4.2</span>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden sm:flex items-center gap-1.5 text-emerald-400 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            PFMS Core Gateway: LIVE
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="text-slate-300 font-bold">
            USER: <span className="text-white">S. K. Verma, IAS (Joint Secy)</span>
          </span>
        </div>
      </div>

      {/* Main Operational Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Left: System Branding */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded bg-orange-600 text-white font-mono font-black text-sm flex items-center justify-center border border-orange-500 shadow-sm">
            LP
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-grotesk font-black text-base tracking-tight text-white">
                LAND<span className="text-orange-500">PULSE</span>
              </h1>
              <span className="px-1.5 py-0.2 rounded bg-white/10 text-slate-300 font-mono text-[9px] font-bold border border-white/10">
                PROD 4.2
              </span>
            </div>
            <p className="text-[10px] text-slate-400 font-mono hidden md:block">
              National Land Acquisition Operations & Transparency System
            </p>
          </div>
        </div>

        {/* Center: Restrained Government Segmented Role Switcher */}
        <div className="hidden lg:flex items-center bg-black/50 border border-white/10 p-0.5 rounded-md">
          {roleConfigs.map((role) => {
            const isActive = currentRole === role.id;

            return (
              <button
                key={role.id}
                onClick={() => setCurrentRole(role.id)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-colors ${
                  isActive
                    ? 'bg-orange-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {role.label}
              </button>
            );
          })}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Quick Search */}
          <button
            onClick={() => openModal('commandPalette')}
            className="flex items-center gap-2 px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-xs transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline font-mono text-[11px]">Query Registry</span>
            <kbd className="hidden md:inline px-1 text-[9px] font-mono text-slate-400 bg-black/40 rounded border border-white/10">
              ⌘K
            </kbd>
          </button>

          {/* Notifications */}
          <button
            onClick={() => toggleModal('notifications')}
            className="relative p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title="Critical Escalation Alerts"
          >
            <Bell className="w-4 h-4 text-slate-300" />
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-red-600 text-white font-mono text-[8px] font-bold flex items-center justify-center">
                {unreadAlertsCount}
              </span>
            )}
          </button>

          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 transition-colors"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Export Briefing Action */}
          <button
            onClick={() => openModal('exportModal')}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded bg-white/10 hover:bg-white/15 text-slate-100 font-mono text-xs font-semibold border border-white/20 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-orange-400" />
            <span>Export Dossier</span>
          </button>
        </div>
      </div>

      {/* Mobile Role Switcher */}
      <div className="lg:hidden flex items-center gap-1 px-4 py-1.5 bg-black/40 border-t border-white/10 overflow-x-auto">
        {roleConfigs.map((role) => {
          const isActive = currentRole === role.id;

          return (
            <button
              key={role.id}
              onClick={() => setCurrentRole(role.id)}
              className={`shrink-0 px-2.5 py-1 text-[11px] font-mono rounded ${
                isActive
                  ? 'bg-orange-600 text-white font-bold'
                  : 'text-slate-400 bg-white/5 hover:text-white'
              }`}
            >
              {role.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
