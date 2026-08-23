import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`py-12 px-6 text-center border border-dashed border-stone-200 rounded-xl bg-white/50 ${className}`}>
      <div className="w-9 h-9 rounded-lg bg-stone-100 border border-stone-200/80 flex items-center justify-center text-stone-400 mx-auto mb-3">
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto leading-relaxed">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
};
