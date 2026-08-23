import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
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
    <div className={`bg-white rounded-xl border border-stone-200 py-16 px-8 text-center shadow-card ${className}`}>
      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-stone-100 mb-4">
        <Icon className="w-6 h-6 text-stone-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-5">
          {action}
        </div>
      )}
    </div>
  );
};
