import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  iconAccent?: 'green' | 'amber' | 'blue' | 'neutral' | 'indigo';
  title: string;
  count?: number;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  title,
  count,
  viewAllHref,
  viewAllLabel = 'View all',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between gap-4 mb-3.5 ${className}`}>
      <div className="flex items-center gap-2 min-w-0">
        {Icon && (
          <Icon className="w-4 h-4 text-stone-500 shrink-0" />
        )}
        <h2 className="text-sm sm:text-base font-semibold text-stone-900 tracking-tight">
          {title}
        </h2>
        {count !== undefined && (
          <span className="text-2xs font-semibold text-stone-500 bg-stone-100 border border-stone-200 px-1.5 py-0.5 rounded">
            {count}
          </span>
        )}
      </div>

      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800 transition-colors shrink-0"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
};
