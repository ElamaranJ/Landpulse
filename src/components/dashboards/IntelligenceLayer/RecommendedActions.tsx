import React, { useState } from 'react';
import { MOCK_RISK_ITEMS } from '../../../data/mockData';
import { CheckCircle2, ChevronRight, Zap, ArrowRight } from 'lucide-react';

export const RecommendedActions: React.FC = () => {
  const [intervenedIds, setIntervenedIds] = useState<string[]>(['RSK-003']);

  const handleIntervene = (id: string) => {
    setIntervenedIds((prev) => [...prev, id]);
  };

  return (
    <div className="gov-card p-6 sm:p-7 mb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h4 className="font-bold text-lg text-[#0B3D66] font-sans tracking-tight">
              Prescriptive Administrative Interventions &amp; Fast-Track Directives
            </h4>
            <span className="gov-badge gov-badge-warning">
              CABINET DIRECTIVES
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            High-leverage statutory directives dispatched to State Chief Secretaries &amp; District Collectors
          </p>
        </div>

        <span className="text-xs text-slate-600 font-mono self-start sm:self-auto">
          Estimated Capital at Risk: <strong className="text-red-700 font-bold">₹4,560 Cr</strong>
        </span>
      </div>

      {/* Recommended Action Directives with Generous Spacing */}
      <div className="space-y-4 font-sans text-xs">
        {MOCK_RISK_ITEMS.map((item) => {
          const isDone = intervenedIds.includes(item.id);

          return (
            <div
              key={item.id}
              className={`p-5 rounded-xl border transition-all ${
                isDone
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-2 font-mono">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`gov-badge ${
                        item.compositeRisk > 75 ? 'gov-badge-critical' : item.compositeRisk > 50 ? 'gov-badge-warning' : 'gov-badge-info'
                      }`}
                    >
                      RISK {item.compositeRisk}/100
                    </span>
                    <span className="text-xs font-bold text-slate-500">{item.state}</span>
                  </div>
                  <h5 className="font-bold text-base text-[#0B3D66] font-sans">{item.projectName}</h5>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs text-red-700 font-bold block">
                    Predicted Delay: +{item.predictedDelayMonths}m
                  </span>
                  <span className="text-xs text-slate-500">
                    Impact: ₹{item.financialImpactCr} Cr
                  </span>
                </div>
              </div>

              {/* Action Text */}
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-800 mb-3 leading-relaxed">
                <span className="font-mono text-[#EA580C] font-bold uppercase mr-1.5">
                  RECOMMENDED INTERVENTION:
                </span>
                {item.recommendedIntervention}
              </div>

              {/* Action Trigger */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
                <span className="text-xs text-slate-500 font-mono">
                  Dispatched to: <strong className="text-slate-800">State Chief Secretary &amp; EGoS</strong>
                </span>

                {isDone ? (
                  <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5 font-mono">
                    <CheckCircle2 className="w-4 h-4" /> Directive Dispatched
                  </span>
                ) : (
                  <button
                    onClick={() => handleIntervene(item.id)}
                    className="h-9 px-4 rounded-lg bg-[#0B3D66] hover:bg-[#072742] text-white text-xs font-bold uppercase flex items-center gap-1.5 transition-colors shadow-2xs self-end sm:self-auto"
                  >
                    <span>Issue Cabinet Directive</span>
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
