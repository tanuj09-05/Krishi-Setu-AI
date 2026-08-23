'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto bg-stone-900 text-white rounded-lg px-4 py-3 shadow-menu border border-stone-800 flex items-start gap-3 animate-slide-up"
            role="alert"
          >
            <div className="shrink-0 mt-0.5">
              {isSuccess && <CheckCircle2 className="w-4 h-4 text-brand-400" />}
              {isError && <AlertCircle className="w-4 h-4 text-accent-rose" />}
              {!isSuccess && !isError && <Info className="w-4 h-4 text-accent-sky" />}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white leading-snug">{toast.title}</p>
              {toast.message && (
                <p className="text-[11px] text-stone-300 mt-0.5 leading-relaxed">{toast.message}</p>
              )}
            </div>

            <button
              onClick={() => dismissToast(toast.id)}
              className="text-stone-400 hover:text-white p-0.5 rounded transition-colors shrink-0 -mr-1"
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
