import React, { useState } from 'react';
import { MOCK_CRITICAL_ALERTS } from '../../../data/mockData';
import { AlertOctagon, CheckCircle2, ChevronRight, Clock, AlertTriangle, ArrowRight } from 'lucide-react';
import { useRole } from '../../../context/RoleContext';

export const CriticalAlertsFeed: React.FC = () => {
  const { setCurrentRole } = useRole();
  const [resolvedIds, setResolvedIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'ALL' | 'CRITICAL' | 'HIGH'>('ALL');

  const handleResolve = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setResolvedIds((prev) => [...prev, id]);
  };

  const filteredAlerts = MOCK_CRITICAL_ALERTS.filter((a) => {
    if (activeTab === 'ALL') return true;
    return a.severity === activeTab;
  });

  return (
    <div className="gov-card p-6 sm:p-7">
      {/* Alert Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-[#0B3D66] font-sans tracking-tight">
              Critical Land Acquisition Bottlenecks &amp; Disruptions
            </h3>
            <span className="gov-badge gov-badge-critical">
              CABINET ESCALATION
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            High Court stays, environmental clearances, and circle rate litigation requiring fast-track intervention
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 gap-1 self-start sm:self-auto">
          {(['ALL', 'CRITICAL', 'HIGH'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-3.5 py-1.5 rounded-md font-mono font-bold transition-all ${
                activeTab === tab
                  ? 'bg-red-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Alert Feed Grid — 24px gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredAlerts.map((alert) => {
          const isResolved = resolvedIds.includes(alert.id);

          return (
            <div
              key={alert.id}
              className={`p-5 rounded-xl border transition-all ${
                isResolved
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : alert.severity === 'CRITICAL'
                  ? 'bg-red-50/30 border-red-200 hover:border-red-300 shadow-2xs'
                  : 'bg-amber-50/30 border-amber-200 hover:border-amber-300 shadow-2xs'
              }`}
            >
              {/* Alert Title Bar */}
              <div className="flex items-start justify-between gap-3 mb-3 font-mono text-xs">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`gov-badge ${
                        alert.severity === 'CRITICAL' ? 'gov-badge-critical' : 'gov-badge-warning'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-xs font-bold text-slate-500">{alert.code}</span>
                  </div>
                  <h4 className="font-bold text-base text-[#0B3D66] font-sans">{alert.project}</h4>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-slate-500 block font-sans">{alert.timestamp}</span>
                  <span className="text-xs font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded border border-red-200 inline-block mt-1">
                    +{alert.delayDays}d Delay
                  </span>
                </div>
              </div>

              {/* Location & Impact */}
              <div className="flex items-center gap-2 text-xs text-slate-700 font-mono mb-3 font-medium">
                <span>{alert.district}, {alert.state}</span>
                <span className="text-slate-300">•</span>
                <span className="text-red-700 font-bold">At-Risk Capital: ₹{alert.impactValuationCr} Cr</span>
              </div>

              {/* Message */}
              <p className="text-sm text-slate-700 mb-4 bg-white p-3 rounded-lg border border-slate-200/80 font-sans leading-relaxed">
                {alert.message}
              </p>

              {/* Suggested Action Bar */}
              <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-200/80 text-xs">
                <span className="text-xs text-slate-600 truncate max-w-[70%] font-sans">
                  Action: <strong className="text-slate-900 font-semibold">{alert.suggestedAction}</strong>
                </span>

                {isResolved ? (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Dispatched
                  </span>
                ) : (
                  <button
                    onClick={(e) => handleResolve(alert.id, e)}
                    className="h-9 px-3.5 rounded-lg bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors shadow-2xs shrink-0"
                  >
                    <span>Escalate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
