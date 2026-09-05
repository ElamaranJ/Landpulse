import React, { useState } from 'react';
import type { StageMilestone } from '../../../types';
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Calendar,
  Building,
  FileCheck,
  Award,
} from 'lucide-react';

interface TimelineStepperProps {
  stages: StageMilestone[];
  currentStageIndex: number;
}

export const TimelineStepper: React.FC<TimelineStepperProps> = ({ stages }) => {
  const [expandedStep, setExpandedStep] = useState<number | null>(7);

  const toggleExpand = (step: number) => {
    setExpandedStep(expandedStep === step ? null : step);
  };

  return (
    <div className="gov-card p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B3D66] font-sans tracking-tight">
              9-Stage Statutory Acquisition &amp; Compensation Lifecycle
            </h3>
            <span className="gov-badge gov-badge-info">
              RFCTLARR ACT 2013
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time status tracking from preliminary survey through direct PFMS bank transfer and R&amp;R completion
          </p>
        </div>

        <span className="gov-badge gov-badge-success text-xs self-start sm:self-auto py-1 px-3">
          6 of 9 Milestones Completed (67%)
        </span>
      </div>

      {/* Vertical Stepper with Generous Spacing Scale */}
      <div className="relative pl-10 sm:pl-12 space-y-6 before:absolute before:left-4 sm:before:left-5 before:top-4 before:bottom-4 before:w-1 before:bg-slate-200">
        {stages.map((stage) => {
          const isCompleted = stage.status === 'completed';
          const isCurrent = stage.status === 'current';
          const isExpanded = expandedStep === stage.step;

          return (
            <div key={stage.step} className="relative">
              {/* Stepper Node — Larger, High-Contrast */}
              <div
                onClick={() => toggleExpand(stage.step)}
                className={`absolute -left-10 sm:-left-12 top-3 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center cursor-pointer transition-all shadow-xs ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-[#EA580C] text-white ring-4 ring-orange-100'
                    : 'bg-white text-slate-500 border-2 border-slate-300'
                }`}
              >
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-xs font-bold font-mono">{stage.step}</span>
                )}
              </div>

              {/* Stage Card Box — Generous 20-24px Padding */}
              <div
                onClick={() => toggleExpand(stage.step)}
                className={`p-6 rounded-xl border transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-orange-50/30 border-orange-300 shadow-sm'
                    : isCompleted
                    ? 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-1 rounded-md border border-slate-200">
                      Stage {stage.step}
                    </span>
                    <h4 className="font-bold text-base sm:text-lg text-[#0B3D66] font-sans">
                      {stage.name}
                    </h4>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`gov-badge ${
                        isCompleted
                          ? 'gov-badge-success'
                          : isCurrent
                          ? 'gov-badge-warning'
                          : 'gov-badge-neutral'
                      }`}
                    >
                      {isCompleted ? 'COMPLETED' : isCurrent ? 'CURRENT ACTIVE STAGE' : 'PENDING'}
                    </span>

                    {stage.completedDate && (
                      <span className="text-xs font-mono font-bold text-slate-600 hidden sm:flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {stage.completedDate}
                      </span>
                    )}

                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-600 mt-2.5 leading-relaxed font-sans">
                  {stage.description}
                </p>

                {/* Expandable Statutory Details Panel */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5 text-xs font-mono">
                    {stage.authorizedBy && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500 font-bold uppercase font-sans">Authorizing Competent Authority:</span>
                        <span className="font-bold text-[#0B3D66]">{stage.authorizedBy}</span>
                      </div>
                    )}

                    {stage.gazetteRef && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500 font-bold uppercase font-sans">Gazette Notification Reference:</span>
                        <span className="text-orange-700 font-bold">{stage.gazetteRef}</span>
                      </div>
                    )}

                    {stage.amount && (
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="text-slate-500 font-bold uppercase font-sans">Statutory Financial Determination:</span>
                        <span className="text-emerald-700 font-bold text-sm">{stage.amount}</span>
                      </div>
                    )}

                    {stage.notes && (
                      <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 mt-2 font-sans">
                        <span className="text-orange-800 font-bold font-mono">Officer Remarks: </span>
                        {stage.notes}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
