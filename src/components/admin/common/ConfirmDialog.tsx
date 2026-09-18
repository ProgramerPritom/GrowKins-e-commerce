import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
  isLoading = false,
  onConfirm,
  onClose
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#24221F]/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="relative bg-white border border-[#E8E0D2] rounded-2xl shadow-xl max-w-md w-full p-6 z-10 overflow-hidden"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-[#8C8478] hover:text-[#24221F] p-1 rounded-full transition-colors cursor-pointer"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div
                className={`p-3 rounded-xl shrink-0 ${
                  variant === 'danger'
                    ? 'bg-[#FBE8E5] text-[#B83A28]'
                    : variant === 'warning'
                    ? 'bg-[#FCF4DB] text-[#9A7316]'
                    : 'bg-[#E7EDFB] text-[#1C4CB8]'
                }`}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-[#24221F]">{title}</h3>
                <p className="mt-1.5 text-xs text-[#635E55] leading-relaxed">{message}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isLoading}
                className="px-4 py-2 rounded-xl border border-[#E8E0D2] text-xs font-semibold text-[#635E55] hover:bg-[#FAF7F1] transition-colors cursor-pointer disabled:opacity-50"
              >
                {cancelLabel}
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
                className={`px-4 py-2 rounded-xl text-xs font-semibold text-white transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-1.5 ${
                  variant === 'danger'
                    ? 'bg-[#B83A28] hover:bg-[#9B2F20]'
                    : variant === 'warning'
                    ? 'bg-[#9A7316] hover:bg-[#826010]'
                    : 'bg-[#1C4CB8] hover:bg-[#15398B]'
                }`}
              >
                {isLoading && (
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                <span>{confirmLabel}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
