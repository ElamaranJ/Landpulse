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
    <div className={`bg-white border border-slate-300 border-l-4 border-l-[#0B3D66] p-3 sm:p-4 shadow-xs rounded-xs ${className}`}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left: Optional Section Title & Record Counter */}
        {(title || subtitle || typeof totalCount === 'number') && (
          <div className="shrink-0">
            {title && (
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-[#0B3D66] uppercase tracking-wide">
                  {title}
                </h3>
                {typeof totalCount === 'number' && (
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0B3D66] border border-blue-200">
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
        <div className="flex flex-wrap items-center gap-2.5 flex-1 lg:justify-end">
          {/* Debounced Search Box */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={placeholder}
              className="gov-input pl-9 pr-8 text-xs placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Dropdown */}
          {statusOptions.length > 0 && onStatusFilterChange && (
            <div className="relative min-w-[150px] sm:min-w-[170px]">
              <select
                value={statusFilter || 'ALL'}
                onChange={(e) => onStatusFilterChange(e.target.value)}
                className="gov-select text-xs font-semibold"
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
              className="gov-btn-secondary text-xs py-1.5 cursor-pointer"
              title="Reset all filters"
            >
              <X className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

