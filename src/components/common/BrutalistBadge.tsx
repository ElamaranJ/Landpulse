import React from 'react';

export type BadgeVariant = 
  | 'critical' 
  | 'delayed' 
  | 'on_track' 
  | 'in_progress' 
  | 'completed' 
  | 'saffron' 
  | 'neutral' 
  | 'action';

interface BrutalistBadgeProps {
  label: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  className?: string;
}

export const BrutalistBadge: React.FC<BrutalistBadgeProps> = ({
  label,
  variant = 'neutral',
  size = 'md',
  className = '',
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'critical':
      case 'delayed':
        return 'status-stamp-critical';
      case 'on_track':
      case 'completed':
        return 'status-stamp-success';
      case 'in_progress':
        return 'status-stamp-warning';
      case 'saffron':
      case 'action':
        return 'bg-orange-500/15 text-orange-400 border-orange-500/40 dark:bg-orange-950/30 dark:text-orange-300 dark:border-orange-500/40';
      default:
        return 'status-stamp-neutral';
    }
  };

  const sizeStyles = size === 'sm' ? 'text-[9px] px-1.5 py-0.5' : 'text-[10px] px-2 py-0.5';

  return (
    <span
      className={`status-stamp uppercase select-none font-mono ${getVariantStyles()} ${sizeStyles} ${className}`}
    >
      {label}
    </span>
  );
};
