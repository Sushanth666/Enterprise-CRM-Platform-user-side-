import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { removeToast, ToastMessage } from '@/store/uiSlice';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastItem: React.FC<{ toast: ToastMessage }> = ({ toast }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeToast(toast.id));
    }, 4500);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-500 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-white/95',
    error: 'border-rose-200 bg-white/95',
    info: 'border-indigo-200 bg-white/95',
    warning: 'border-amber-200 bg-white/95',
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl backdrop-blur-sm max-w-sm w-full transition-all duration-300 animate-slideDown card-hover-lift ${borders[toast.type]}`}
    >
      {icons[toast.type]}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900">{toast.title}</p>
        {toast.message && <p className="text-xs text-slate-500 mt-0.5">{toast.message}</p>}
      </div>
      <button
        onClick={() => dispatch(removeToast(toast.id))}
        className="text-slate-400 hover:text-slate-600 transition-colors p-1"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const toasts = useAppSelector((state) => state.ui.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-auto">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
};
