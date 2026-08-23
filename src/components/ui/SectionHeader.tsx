import React from 'react';
import Link from 'next/link';
import { LucideIcon, ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  icon?: LucideIcon;
  iconAccent?: 'green' | 'amber' | 'blue' | 'purple' | 'indigo';
  title: string;
  viewAllHref?: string;
  viewAllLabel?: string;
  className?: string;
}

const iconAccentMap = {
  green:  'bg-brand-100 text-brand-700',
  amber:  'bg-amber-100 text-amber-700',
  blue:   'bg-sky-100 text-sky-700',
  purple: 'bg-purple-100 text-purple-700',
  indigo: 'bg-indigo-100 text-indigo-700',
};

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon: Icon,
  iconAccent = 'green',
  title,
  viewAllHref,
  viewAllLabel = 'View all',
  className = '',
}) => {
  return (
    <div className={`flex items-center justify-between mb-4 ${className}`}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <span className={`p-1.5 rounded-lg ${iconAccentMap[iconAccent]}`}>
            <Icon className="w-3.5 h-3.5" />
          </span>
        )}
        <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      </div>
      {viewAllHref && (
        <Link
          href={viewAllHref}
          className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:text-brand-800 transition-colors"
        >
          <span>{viewAllLabel}</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      )}
    </div>
  );
};
