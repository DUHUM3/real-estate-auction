// src/components/common/ToastProvider.jsx
import React, { useState, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, AlertCircle } from "lucide-react";

// إنشاء Context
const ToastContext = createContext();

// Hook لاستخدام Toast
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
};

// Toast Provider Component
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (toast) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { ...toast, id }]);

    // إزالة التلقائي بعد 5 ثواني
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // دالة إنشاء Toast
  const toast = {
    success: (message) => addToast({ message, type: "success" }),
    error: (message) => addToast({ message, type: "error" }),
    info: (message) => addToast({ message, type: "info" }),
    loading: (message) => {
      const id = Date.now();
      addToast({ message, type: "loading", id });
      return id; // إرجاع ID لإمكانية إزالته يدوياً
    },
    dismiss: (id) => removeToast(id),
    dismissAll: () => setToasts([]),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      
      {/* Toast Container - نفس التصميم الأصلي */}
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
              {/* Success Icon */}
              {toast.type === "success" && (
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-600" />
                </div>
              )}
              
              {/* Error Icon */}
              {toast.type === "error" && (
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
              )}
              
              {/* Loading Icon */}
              {toast.type === "loading" && (
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
              
              {/* Info Icon */}
              {toast.type === "info" && (
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-gray-600" />
                </div>
              )}

              {/* Message */}
              <p className="flex-1 text-gray-700 font-medium text-right">
                {toast.message}
              </p>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};