import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'lg',
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
  };

  const modalNode = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-2.5 sm:p-5 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-xs transition-opacity animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card - Bound to 80vh to guarantee it is fully visible above taskbar */}
      <div
        className={`relative z-10 w-full ${maxWidthClasses[maxWidth]} max-h-[82vh] flex flex-col rounded-xl sm:rounded-2xl bg-white dark:bg-[#1a120e] text-left shadow-2xl border border-slate-200 dark:border-[#38261f] overflow-hidden animate-scaleIn`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {/* Header - Fixed/Pinned at the top */}
        <div className="shrink-0 flex items-center justify-between border-b border-slate-100 dark:border-[#2e1f18] px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-[#1a120e]">
          <div className="pr-2">
            <h3 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-[#fbf5f2] leading-tight">
              {title}
            </h3>
            {description && (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-[#9e8c83] mt-0.5 leading-snug">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#2c1d17] transition-colors shrink-0"
            title="Close dialog (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body - min-h-0 and flex-1 allows smooth internal scrolling within the 80vh box */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-3 sm:py-4 overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );

  if (typeof document !== 'undefined' && mounted) {
    return createPortal(modalNode, document.body);
  }

  return modalNode;
};
