'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-20 lg:bottom-5 right-4 sm:right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => {
        const styles = {
          success: { bg: 'bg-gray-900 border-brand-700/50', icon: <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" /> },
          warning: { bg: 'bg-gray-900 border-amber-700/50', icon: <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" /> },
          error:   { bg: 'bg-gray-900 border-rose-700/50',  icon: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" /> },
          info:    { bg: 'bg-gray-900 border-sky-700/50',   icon: <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" /> },
        }[toast.type] ?? { bg: 'bg-gray-900 border-white/10', icon: <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-sm text-white animate-slide-in-right ${styles.bg}`}
          >
            {styles.icon}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-snug">{toast.title}</p>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-500 hover:text-white p-1 rounded-md transition-colors shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
