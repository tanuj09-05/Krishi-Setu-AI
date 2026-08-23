import React from 'react';
import { clsx } from 'clsx';

type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral' | 'danger' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  pulse?: boolean;
  className?: string;
}

const variantMap: Record<BadgeVariant, string> = {
  success: 'bg-brand-50 text-brand-800 border-brand-200/80',
  warning: 'bg-accent-amberBg text-accent-amber border-amber-200/80',
  info:    'bg-accent-skyBg text-accent-sky border-sky-200/80',
  neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  danger:  'bg-accent-roseBg text-accent-rose border-rose-200/80',
  purple:  'bg-purple-50 text-purple-800 border-purple-200',
};

const dotMap: Record<BadgeVariant, string> = {
  success: 'bg-brand-600',
  warning: 'bg-accent-amber',
  info:    'bg-accent-sky',
  neutral: 'bg-stone-400',
  danger:  'bg-accent-rose',
  purple:  'bg-purple-500',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  dot = false,
  pulse = false,
  className,
}) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 font-medium border rounded-md',
        size === 'sm' ? 'text-2xs px-2 py-0.5' : 'text-xs px-2.5 py-0.5',
        variantMap[variant],
        className
      )}
    >
      {dot && (
        <span
          className={clsx(
            'shrink-0 rounded-full',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotMap[variant],
            pulse && 'animate-pulse'
          )}
        />
      )}
      {children}
    </span>
  );
};
