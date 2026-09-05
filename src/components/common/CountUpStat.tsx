import React from 'react';

interface CountUpStatProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  label: string;
  meta?: string;
  delta?: { value: string; positive: boolean; period: string };
  statusIndicator?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
}

export const CountUpStat: React.FC<CountUpStatProps> = ({
  value,
  prefix = '',
  suffix = '',
  label,
  meta,
  delta,
  statusIndicator,
}) => {
  return (
    <div className="flex flex-col justify-between h-full">
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-1.5">
          {statusIndicator && (
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                statusIndicator === 'success'
                  ? 'bg-emerald-500'
                  : statusIndicator === 'warning'
                  ? 'bg-amber-500'
                  : statusIndicator === 'danger'
                  ? 'bg-red-500'
                  : statusIndicator === 'info'
                  ? 'bg-sky-500'
                  : 'bg-slate-500'
              }`}
            />
          )}
          {label}
        </span>

        {delta && (
          <span
            className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded border ${
              delta.positive
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'bg-red-500/10 text-red-400 border-red-500/20'
            }`}
          >
            {delta.positive ? '+' : ''}{delta.value}
          </span>
        )}
      </div>

      <div className="my-1">
        <div className="text-xl sm:text-2xl font-bold font-mono tracking-tight text-white tabular-nums">
          {prefix}{typeof value === 'number' ? value.toLocaleString('en-IN') : value}{suffix}
        </div>
      </div>

      {meta && (
        <div className="text-[11px] text-slate-400 font-mono mt-1 pt-1.5 border-t border-white/5 flex items-center justify-between">
          <span>{meta}</span>
          {delta && <span className="text-[10px] text-slate-500">{delta.period}</span>}
        </div>
      )}
    </div>
  );
};
