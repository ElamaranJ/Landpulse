import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dense' | 'critical' | 'highlight';
  noPadding?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  noPadding = false,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dense':
        return 'gov-card rounded-md';
      case 'critical':
        return 'gov-card rounded-md border-red-500/40 bg-red-950/10';
      case 'highlight':
        return 'gov-card rounded-md border-orange-500/40 bg-orange-950/10';
      default:
        return 'gov-card rounded-lg';
    }
  };

  return (
    <div
      className={`${getVariantStyles()} ${noPadding ? '' : 'p-4'} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
