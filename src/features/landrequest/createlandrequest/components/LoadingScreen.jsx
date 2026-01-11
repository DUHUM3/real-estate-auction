// Loading screen component
import React from "react";
import { motion } from "framer-motion";

export function LoadingScreen({ title = "جاري التحقق من الصلاحيات", subtitle = "الرجاء الانتظار..." }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center"
    >
      <div className="relative w-20 h-20 mx-auto mb-6">
        <div className="absolute inset-0 border-4 border-[#a6d4fa] rounded-full animate-ping"></div>
        <div className="relative w-20 h-20 border-4 border-[#53a1dd] border-t-transparent rounded-full animate-spin"></div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{subtitle}</p>
    </motion.div>
  );
}