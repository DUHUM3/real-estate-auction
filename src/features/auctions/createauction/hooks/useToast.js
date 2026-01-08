// src/hooks/useToast.js
import { useContext } from "react";
import { ToastContext } from "../createauction/components/common/ToastProvider";

export const useToast = () => {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  
  return context;
};