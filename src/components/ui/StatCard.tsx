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
  className,
}) => {
  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-brand-700' : trend === 'down' ? 'text-accent-rose' : 'text-stone-400';

  return (
    <div className={clsx(
      'bg-white rounded-lg border border-stone-200/80 p-4 transition-all duration-150',
      className
    )}>
      <div className="flex items-start justify-between gap-2">
        <p className="text-[11px] font-medium text-stone-500 uppercase tracking-wider truncate">
          {label}
        </p>
        {Icon && (
          <Icon className="w-3.5 h-3.5 text-stone-400 shrink-0" />
        )}
      </div>

      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight tabular-nums">
          {value}
        </span>
        {unit && <span className="text-xs font-normal text-stone-400">{unit}</span>}
      </div>

      {trendLabel && (
        <div className={clsx('flex items-center gap-1 mt-1 text-xs font-medium', trendColor)}>
          <TrendIcon className="w-3 h-3" />
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
};
