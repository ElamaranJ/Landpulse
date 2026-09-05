import React from 'react';
import { ShieldAlert, Cpu, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface GaugeProps {
  score: number;
  label: string;
  category: string;
  color: string;
  badge: string;
  badgeClass: string;
}

const SimpleGauge: React.FC<GaugeProps> = ({ score, label, category, color, badge, badgeClass }) => {
  return (
    <div className="gov-card p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3 font-mono">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{category}</span>
          <span className={`gov-badge ${badgeClass}`}>{badge}</span>
        </div>

        <div className="my-3">
          <div className="text-3xl sm:text-4xl font-extrabold font-mono tracking-tight" style={{ color }}>
            {score} <span className="text-base text-slate-400 font-sans font-normal">/ 100</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden border border-slate-200 mt-3">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${score}%`, backgroundColor: color }}
            />
          </div>
        </div>
      </div>

      <h5 className="font-bold text-sm text-[#0B3D66] font-sans mt-2 line-clamp-2 leading-snug">
        {label}
      </h5>
    </div>
  );
};

export const RiskGauges: React.FC = () => {
  return (
    <div className="gov-card p-6 sm:p-8 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-orange-50 text-orange-700 flex items-center justify-center border border-orange-200">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#0B3D66] font-sans tracking-tight">
              AI Composite Risk Engine &amp; Predictive Telemetry
            </h3>
            <span className="gov-badge gov-badge-warning">
              MACHINE TELEMETRY
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Cross-ministry predictive model across 1,248 projects, High Court dockets, and revenue records
          </p>
        </div>

        <span className="gov-badge gov-badge-success text-xs py-1 px-3 self-start sm:self-auto">
          Model Confidence: 94.8% (NIC Core AI)
        </span>
      </div>

      {/* 4 Hero-Sized Risk Gauge Cards — 24px gap */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <SimpleGauge
          score={84}
          label="High Court &amp; Tribunal Stay Orders on Title"
          category="Litigation Risk"
          color="#DC2626"
          badge="CRITICAL"
          badgeClass="gov-badge-critical"
        />
        <SimpleGauge
          score={68}
          label="MoEFCC Stage-II &amp; Wildlife Sanctuary Clearance"
          category="Forest Clearance"
          color="#EA580C"
          badge="HIGH"
          badgeClass="gov-badge-warning"
        />
        <SimpleGauge
          score={42}
          label="Circle Rate Escalation &amp; Solatium Budget"
          category="Budget Liquidity"
          color="#D97706"
          badge="MODERATE"
          badgeClass="gov-badge-warning"
        />
        <SimpleGauge
          score={28}
          label="Township &amp; Resettlement Model Infrastructure"
          category="Rehabilitation Sync"
          color="#059669"
          badge="ON TRACK"
          badgeClass="gov-badge-success"
        />
      </div>
    </div>
  );
};
