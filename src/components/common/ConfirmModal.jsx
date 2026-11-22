import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

export default function ConfirmModal({
  isOpen,
  title = 'Confirmation',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger', // 'danger' | 'warning' | 'primary'
  onConfirm,
  onCancel
}) {
  if (!isOpen) return null;

  const buttonStyle =
    confirmVariant === 'danger'
      ? 'bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500'
      : confirmVariant === 'warning'
      ? 'bg-amber-600 hover:bg-amber-700 text-white focus:ring-amber-500'
      : 'bg-emerald-600 hover:bg-emerald-700 text-white focus:ring-emerald-500';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-sm w-full border border-gray-200 dark:border-slate-700 shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-150 transition-colors">
        
        {/* Modal Top */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white font-sans">
                {title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Please confirm this action</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Message */}
        <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-slate-700/50 rounded-lg p-3 border border-gray-100 dark:border-slate-700 leading-relaxed">
          {message}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-2.5 mt-5">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors border border-gray-200 dark:border-slate-600"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg shadow-sm focus:ring-2 focus:ring-offset-1 transition-colors ${buttonStyle}`}
          >
            {confirmText}
          </button>
        </div>

      </div>
    </div>
  );
}
