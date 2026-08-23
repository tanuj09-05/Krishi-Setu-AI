'use client';

import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
            toast.type === 'success'
              ? 'bg-brand-900/90 text-white border-brand-500/40'
              : toast.type === 'warning'
              ? 'bg-amber-900/90 text-white border-amber-500/40'
              : toast.type === 'error'
              ? 'bg-rose-900/90 text-white border-rose-500/40'
              : 'bg-slate-900/90 text-white border-slate-700'
          }`}
        >
          {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-brand-300 shrink-0 mt-0.5" />}
          {toast.type === 'warning' && <AlertCircle className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />}
          {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />}
          {toast.type === 'info' && <Info className="w-5 h-5 text-sky-300 shrink-0 mt-0.5" />}

          <div className="flex-1">
            <h4 className="font-semibold text-sm leading-snug">{toast.title}</h4>
            <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{toast.message}</p>
          </div>

          <button
            onClick={() => dismissToast(toast.id)}
            className="text-slate-300 hover:text-white p-1 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
