import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  Info,
  Trash2,
  X,
  Sparkles
} from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'delete' | 'alert';

export interface ToastOptions {
  title?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  title?: string;
  duration: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface AdminToastContextType {
  showToast: (message: string, type?: ToastType, options?: ToastOptions) => void;
  toast: {
    success: (message: string, title?: string, options?: Omit<ToastOptions, 'title'>) => void;
    error: (message: string, title?: string, options?: Omit<ToastOptions, 'title'>) => void;
    warning: (message: string, title?: string, options?: Omit<ToastOptions, 'title'>) => void;
    info: (message: string, title?: string, options?: Omit<ToastOptions, 'title'>) => void;
    delete: (message: string, title?: string, options?: Omit<ToastOptions, 'title'>) => void;
    alert: (message: string, title?: string, options?: Omit<ToastOptions, 'title'>) => void;
  };
}

const AdminToastContext = createContext<AdminToastContextType | null>(null);

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', options?: ToastOptions) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const duration = options?.duration || (type === 'error' ? 5000 : 3800);

      const newToast: ToastItem = {
        id,
        message,
        type,
        title: options?.title,
        duration,
        action: options?.action
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        removeToast(id);
      }, duration);
    },
    [removeToast]
  );

  const toastHelpers = {
    success: (message: string, title = 'Success', options?: Omit<ToastOptions, 'title'>) =>
      showToast(message, 'success', { title, ...options }),
    error: (message: string, title = 'Operation Failed', options?: Omit<ToastOptions, 'title'>) =>
      showToast(message, 'error', { title, ...options }),
    warning: (message: string, title = 'Warning', options?: Omit<ToastOptions, 'title'>) =>
      showToast(message, 'warning', { title, ...options }),
    info: (message: string, title = 'Information', options?: Omit<ToastOptions, 'title'>) =>
      showToast(message, 'info', { title, ...options }),
    delete: (message: string, title = 'Item Deleted', options?: Omit<ToastOptions, 'title'>) =>
      showToast(message, 'delete', { title, ...options }),
    alert: (message: string, title = 'Attention Required', options?: Omit<ToastOptions, 'title'>) =>
      showToast(message, 'alert', { title, ...options })
  };

  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />,
          border: 'border-[#A3C1AD] bg-white',
          accent: 'bg-[#2D6A4F]',
          badge: 'bg-[#E6EFE9] text-[#2D6A4F]'
        };
      case 'error':
        return {
          icon: <AlertOctagon className="w-4 h-4 text-[#B83A28]" />,
          border: 'border-[#F28F79] bg-white',
          accent: 'bg-[#B83A28]',
          badge: 'bg-[#FBE8E5] text-[#B83A28]'
        };
      case 'delete':
        return {
          icon: <Trash2 className="w-4 h-4 text-[#C85A32]" />,
          border: 'border-[#F2B39E] bg-white',
          accent: 'bg-[#C85A32]',
          badge: 'bg-[#FCEEEA] text-[#C85A32]'
        };
      case 'warning':
      case 'alert':
        return {
          icon: <AlertTriangle className="w-4 h-4 text-[#B88728]" />,
          border: 'border-[#F7E198] bg-white',
          accent: 'bg-[#B88728]',
          badge: 'bg-[#FCF4DB] text-[#856404]'
        };
      case 'info':
      default:
        return {
          icon: <Info className="w-4 h-4 text-[#1C4CB8]" />,
          border: 'border-[#BBD0F7] bg-white',
          accent: 'bg-[#1C4CB8]',
          badge: 'bg-[#E7EDFB] text-[#1C4CB8]'
        };
    }
  };

  return (
    <AdminToastContext.Provider value={{ showToast, toast: toastHelpers }}>
      {children}

      {/* Floating Toast Notification Stack */}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 pointer-events-none max-w-sm sm:max-w-md w-full px-3 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const styles = getToastStyles(toast.type);

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 15, scale: 0.94 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] as const }}
                className={`pointer-events-auto p-4 rounded-2xl shadow-xl border ${styles.border} flex flex-col gap-2 relative overflow-hidden backdrop-blur-md`}
              >
                <div className="flex items-start gap-3">
                  <div className="shrink-0 mt-0.5 p-1 rounded-xl bg-[#FAF7F1] border border-[#E8E0D2]">
                    {styles.icon}
                  </div>

                  <div className="flex-1 min-w-0">
                    {toast.title && (
                      <h4 className="text-xs font-bold text-[#24221F] flex items-center gap-1.5 mb-0.5">
                        <span>{toast.title}</span>
                      </h4>
                    )}
                    <p className="text-xs text-[#524E48] leading-relaxed break-words font-medium">
                      {toast.message}
                    </p>

                    {toast.action && (
                      <button
                        onClick={() => {
                          toast.action?.onClick();
                          removeToast(toast.id);
                        }}
                        className="mt-2 text-[11px] font-bold text-[#1C4CB8] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>{toast.action.label}</span>
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => removeToast(toast.id)}
                    className="text-[#8C8478] hover:text-[#24221F] p-1 rounded-lg hover:bg-[#FAF7F1] transition-colors cursor-pointer shrink-0"
                    aria-label="Close notification"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Shimmering Progress Bar Timer */}
                <motion.div
                  initial={{ width: '100%' }}
                  animate={{ width: '0%' }}
                  transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                  className={`h-0.5 rounded-full ${styles.accent} opacity-40`}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </AdminToastContext.Provider>
  );
};

export const useAdminToast = () => {
  const ctx = useContext(AdminToastContext);
  if (!ctx) {
    throw new Error('useAdminToast must be used within an AdminToastProvider');
  }
  return ctx;
};
