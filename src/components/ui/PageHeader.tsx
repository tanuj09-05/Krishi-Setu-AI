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
    <div className={`flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-stone-200/80 ${className}`}>
      <div>
        {eyebrow && (
          <div className="flex items-center gap-1.5 mb-1 text-[11px] font-semibold text-brand-700 uppercase tracking-wider">
            {EyebrowIcon && <EyebrowIcon className="w-3.5 h-3.5 text-brand-600" />}
            <span>{eyebrow}</span>
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight leading-snug">
          {title}
        </h1>
        {description && (
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5 max-w-2xl leading-relaxed">
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
