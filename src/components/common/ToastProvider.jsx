import React, { useState, createContext, useContext, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";
import { useMemo } from "react";

const ToastContext = createContext();

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((toast) => {
    const id = toast.id || Date.now();

    setToasts((prev) => {
      // منع التكرار → إذا toast موجود بالفعل
      if (prev.some((t) => t.id === id)) return prev;
      return [...prev, { ...toast, id }];
    });

    // إزالة تلقائية بعد 5 ثواني
    setTimeout(() => removeToast(id), 5000);

    return id;
  }, [removeToast]);

  const toast = useMemo(() => ({
    success: (message) => addToast({ message, type: "success" }),
    error: (message) => addToast({ message, type: "error" }),
    info: (message) => addToast({ message, type: "info" }),
    loading: (message) => {
      const id = Date.now();
      addToast({ message, type: "loading", id });
      return id;
    },
    dismiss: (id) => removeToast(id),
    dismissAll: () => setToasts([]),
  }), [addToast, removeToast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}

      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] space-y-2 max-w-sm w-full px-4">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              className={`rounded-lg shadow-lg p-4 flex items-center gap-3 ${
                toast.type === "success"
                  ? "bg-green-50 border border-green-200"
                  : toast.type === "error"
                  ? "bg-red-50 border border-red-200"
                  : toast.type === "loading"
                  ? "bg-blue-50 border border-blue-200"
                  : "bg-gray-50 border border-gray-200"
              }`}
            >
              {toast.type === "success" && <Check className="w-5 h-5 text-green-600" />}
              {toast.type === "error" && <X className="w-5 h-5 text-red-600" />}
              {toast.type === "loading" && <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>}
              {toast.type === "info" && <AlertCircle className="w-5 h-5 text-gray-600" />}

              <p className="flex-1 text-gray-700 font-medium text-right">{toast.message}</p>

              <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
