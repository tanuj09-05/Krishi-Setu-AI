import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { clsx } from 'clsx';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accent?: 'green' | 'amber' | 'blue' | 'rose' | 'neutral';
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  trend,
  trendLabel,
  accent = 'neutral',
  className,
}) => {
  const accentMap = {
    green:   { bg: 'bg-brand-50',  iconBg: 'bg-brand-100',  icon: 'text-brand-700',  value: 'text-brand-800' },
    amber:   { bg: 'bg-amber-50',  iconBg: 'bg-amber-100',  icon: 'text-amber-700',  value: 'text-amber-900' },
    blue:    { bg: 'bg-sky-50',    iconBg: 'bg-sky-100',    icon: 'text-sky-700',    value: 'text-sky-900' },
    rose:    { bg: 'bg-rose-50',   iconBg: 'bg-rose-100',   icon: 'text-rose-700',   value: 'text-rose-900' },
    neutral: { bg: 'bg-white',     iconBg: 'bg-stone-100',  icon: 'text-stone-500',  value: 'text-gray-900' },
  };

  const colors = accentMap[accent];

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-brand-600' : trend === 'down' ? 'text-rose-500' : 'text-stone-400';

  return (
    <div className={clsx(
      'rounded-xl border border-stone-200 p-4 shadow-card transition-shadow hover:shadow-card-md',
      colors.bg,
      className
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-stone-500 uppercase tracking-wider truncate">
            {label}
          </p>
          <p className={clsx('text-2xl font-bold mt-1 tabular-nums tracking-tight', colors.value)}>
            {value}
            {unit && <span className="text-sm font-normal text-stone-400 ml-0.5">{unit}</span>}
          </p>
          {trendLabel && (
            <div className={clsx('flex items-center gap-1 mt-1.5 text-xs font-medium', trendColor)}>
              <TrendIcon className="w-3 h-3" />
              <span>{trendLabel}</span>
            </div>
          )}
        </div>
        {Icon && (
          <div className={clsx('p-2 rounded-lg shrink-0', colors.iconBg)}>
            <Icon className={clsx('w-4 h-4', colors.icon)} />
          </div>
        )}
      </div>
    </div>
  );
};
