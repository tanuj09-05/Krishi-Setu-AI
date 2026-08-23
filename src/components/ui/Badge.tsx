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
  success: 'bg-brand-50 text-brand-800 border-brand-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  info:    'bg-sky-50 text-sky-800 border-sky-200',
  neutral: 'bg-stone-100 text-stone-700 border-stone-200',
  danger:  'bg-rose-50 text-rose-700 border-rose-200',
  purple:  'bg-purple-50 text-purple-800 border-purple-200',
};

const dotMap: Record<BadgeVariant, string> = {
  success: 'bg-brand-500',
  warning: 'bg-amber-500',
  info:    'bg-sky-500',
  neutral: 'bg-stone-400',
  danger:  'bg-rose-500',
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
        'inline-flex items-center gap-1.5 font-semibold border rounded-full',
        size === 'sm' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1',
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
