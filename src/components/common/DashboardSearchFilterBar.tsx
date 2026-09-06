import React from 'react';
import { Search, X, Filter, SlidersHorizontal, RefreshCw } from 'lucide-react';

export interface StatusOption {
  label: string;
  value: string;
}

export interface DashboardSearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  placeholder?: string;
  statusFilter?: string;
  onStatusFilterChange?: (status: string) => void;
  statusOptions?: StatusOption[];
  totalCount?: number;
  filteredCount?: number;
  title?: string;
  subtitle?: string;
  onClearFilters?: () => void;
  extraControls?: React.ReactNode;
  className?: string;
}

export const DashboardSearchFilterBar: React.FC<DashboardSearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  placeholder = 'Search by Survey #, Owner Name, Village, Status...',
  statusFilter,
  onStatusFilterChange,
  statusOptions = [],
  totalCount,
  filteredCount,
  title,
  subtitle,
  onClearFilters,
  extraControls,
  className = '',
}) => {
  const hasActiveFilters = Boolean(
    searchTerm.trim() || (statusFilter && statusFilter !== 'ALL' && statusFilter !== '')
  );

  const handleClear = () => {
    onSearchChange('');
    if (onStatusFilterChange) {
      onStatusFilterChange('ALL');
    }
    if (onClearFilters) {
      onClearFilters();
    }
  };

  return (
    <div className={`gov-card p-4 sm:p-5 border-l-4 border-l-[#1D4ED8] ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Optional Section Title & Record Counter */}
        {(title || subtitle || typeof totalCount === 'number') && (
          <div className="shrink-0">
            {title && (
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[#0B3D66] font-sans tracking-tight">
                  {title}
                </h3>
                {typeof totalCount === 'number' && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#1D4ED8] border border-blue-200">
                    {filteredCount !== undefined ? `${filteredCount} / ${totalCount}` : totalCount}{' '}
                    Records
                  </span>
                )}
              </div>
            )}
            {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          </div>
        )}

        {/* Right: Search Input + Status Filter Dropdown + Actions */}
        <div className="flex flex-wrap items-center gap-3 flex-1 lg:justify-end">
          {/* Debounced Search Box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="gov-input pl-10 pr-9 w-full text-xs sm:text-sm font-sans placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          {statusOptions.length > 0 && onStatusFilterChange && (
            <div className="relative min-w-[160px] sm:min-w-[180px]">
              <select
                value={statusFilter || 'ALL'}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="gov-select w-full text-xs sm:text-sm font-sans"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Extra Custom Controls */}
          {extraControls}

          {/* Reset / Clear Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClear}
              className="h-10 px-3 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold font-mono inline-flex items-center gap-1.5 transition-colors border border-slate-200"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
