import React from 'react';
import { CheckCircle2, X } from 'lucide-react';

export default function ToastNotification({ toast, onClose }) {
  if (!toast || !toast.show) return null;

  return (
    <div className="fixed bottom-14 right-4 z-50 animate-in fade-in slide-in-from-bottom-5 duration-200">
      <div className="flex items-center gap-3 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl border border-gray-800 text-sm max-w-md">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-white text-xs sm:text-sm">
            {toast.title || 'Saved Successfully'}
          </p>
          {toast.message && (
            <p className="text-gray-300 text-xs mt-0.5 truncate">
              {toast.message}
            </p>
          )}
        </div>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1 rounded-md transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
