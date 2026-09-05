import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRole } from '../../context/RoleContext';
import { MOCK_PROJECTS, MOCK_STATES, MOCK_DISTRICT_CASES } from '../../data/mockData';
import { Search, Compass, MapPin, FileText, ArrowRight, X, Shield, Users, Layers, AlertCircle } from 'lucide-react';
import { RoleType } from '../../types';

export const CommandPalette: React.FC = () => {
  const { commandPaletteOpen, setCommandPaletteOpen, setCurrentRole, setSelectedProject } = useRole();
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd/Ctrl + K or Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  if (!commandPaletteOpen) return null;

  const filteredProjects = MOCK_PROJECTS.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.code.toLowerCase().includes(query.toLowerCase()) ||
      p.state.toLowerCase().includes(query.toLowerCase())
  );

  const filteredCases = MOCK_DISTRICT_CASES.filter(
    (c) =>
      c.surveyNo.toLowerCase().includes(query.toLowerCase()) ||
      c.owner.toLowerCase().includes(query.toLowerCase()) ||
      c.village.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectRole = (role: RoleType) => {
    setCurrentRole(role);
    setCommandPaletteOpen(false);
  };

  const handleSelectProject = (proj: (typeof MOCK_PROJECTS)[0]) => {
    setSelectedProject(proj);
    setCurrentRole('command_center');
    setCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -20 }}
          className="w-full max-w-2xl glass-panel rounded-super border border-white/20 shadow-2xl overflow-hidden bg-slate-900/95"
        >
          {/* Input Header */}
          <div className="flex items-center px-4 py-3.5 border-b border-white/10 gap-3">
            <Search className="w-5 h-5 text-pulse-saffron shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parcels (e.g. 142/3B), mega projects, states, or type a command..."
              className="w-full bg-transparent text-slate-100 placeholder-slate-400 text-sm focus:outline-none font-sans"
              autoFocus
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white/10 rounded border border-white/15">
              ESC
            </kbd>
          </div>

          {/* Quick Filter Body */}
          <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
            {/* Quick Navigation Roles */}
            {!query && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  Switch Dashboard Context
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'command_center', label: 'National Command Center', icon: Compass },
                    { id: 'citizen', label: 'Citizen My Case', icon: Users },
                    { id: 'field_officer', label: 'Field Officer DGPS', icon: MapPin },
                    { id: 'district_officer', label: 'District Admin View', icon: FileText },
                    { id: 'intelligence_layer', label: 'AI Risk & Health Engine', icon: Shield },
                  ].map((r) => (
                    <button
                      key={r.id}
                      onClick={() => handleSelectRole(r.id as RoleType)}
                      className="flex items-center gap-2 p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-pulse-saffron/15 hover:border-pulse-saffron/40 text-left transition-all group"
                    >
                      <r.icon className="w-4 h-4 text-pulse-saffron shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="text-xs font-semibold text-slate-200 font-grotesk">{r.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Mega Projects Matches */}
            {filteredProjects.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  Mega Infrastructure Projects ({filteredProjects.length})
                </span>
                <div className="space-y-1.5">
                  {filteredProjects.slice(0, 4).map((proj) => (
                    <div
                      key={proj.id}
                      onClick={() => handleSelectProject(proj)}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-pulse-saffron/20 text-pulse-saffron text-[10px] font-mono font-bold">
                          {proj.code}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{proj.name}</h4>
                          <p className="text-[11px] text-slate-400">{proj.state} • {proj.ministry}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-400" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Citizen / District Parcel Cases Matches */}
            {filteredCases.length > 0 && (
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono block mb-2">
                  Cadastral Survey Parcels & Owners ({filteredCases.length})
                </span>
                <div className="space-y-1.5">
                  {filteredCases.slice(0, 4).map((c) => (
                    <div
                      key={c.id}
                      onClick={() => {
                        setCurrentRole('citizen');
                        setCommandPaletteOpen(false);
                      }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                          Survey #{c.surveyNo}
                        </span>
                        <div>
                          <h4 className="text-xs font-bold text-white">{c.owner} ({c.village})</h4>
                          <p className="text-[11px] text-slate-400">{c.category} • {c.area} • {c.amountCr}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-pulse-saffron font-bold">{c.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {query && filteredProjects.length === 0 && filteredCases.length === 0 && (
              <div className="py-8 text-center text-slate-400">
                <AlertCircle className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                <p className="text-sm">No parcels or projects matching "{query}"</p>
                <p className="text-xs text-slate-500 mt-1">Try searching by Survey # (e.g. 142/3B) or State name</p>
              </div>
            )}
          </div>

          {/* Footer Shortcuts */}
          <div className="px-4 py-2.5 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
            <span>Use ↑↓ to navigate • ↵ to select</span>
            <span className="font-mono text-pulse-saffron">LandPulse Instant Registry v2.6</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
