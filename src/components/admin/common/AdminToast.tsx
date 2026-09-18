import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface AdminToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const AdminToastContext = createContext<AdminToastContextType | null>(null);

export const AdminToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <AdminToastContext.Provider value={{ showToast }}>
      {children}

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`pointer-events-auto p-3.5 rounded-xl shadow-lg border flex items-start gap-3 text-xs font-semibold ${
                toast.type === 'success'
                  ? 'bg-white border-[#A3C1AD] text-[#24221F]'
                  : toast.type === 'error'
                  ? 'bg-white border-[#F28F79] text-[#24221F]'
                  : 'bg-white border-[#E8E0D2] text-[#24221F]'
              }`}
            >
              <div className="shrink-0 mt-0.5">
                {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />}
                {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-[#B83A28]" />}
                {toast.type === 'info' && <Info className="w-4 h-4 text-[#1C4CB8]" />}
              </div>

              <div className="flex-1 text-xs text-[#24221F]">{toast.message}</div>

              <button
                onClick={() => removeToast(toast.id)}
                className="text-[#8C8478] hover:text-[#24221F] p-0.5 rounded cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
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
