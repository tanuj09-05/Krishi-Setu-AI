import React from 'react';
import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6 ${className}`}>
      <div className="min-w-0">
        {eyebrow && (
          <div className="flex items-center gap-1.5 mb-1.5">
            {EyebrowIcon && (
              <EyebrowIcon className="w-3.5 h-3.5 text-brand-600 shrink-0" />
            )}
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-widest">
              {eyebrow}
            </span>
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight leading-snug">
          {title}
        </h1>
        {description && (
          <p className="text-sm text-stone-500 mt-1 leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>
      {action && (
        <div className="shrink-0 flex items-center gap-2">
          {action}
        </div>
      )}
    </div>
  );
};
