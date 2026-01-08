import React from "react";
import { motion } from "framer-motion";
import { FileText, AlertCircle } from "lucide-react";

const Step1BasicInfo = ({ formData, apiErrors, handleFormChange }) => {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#3a83f2] text-white rounded-xl flex items-center justify-center shadow-lg">
          <FileText className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            المعلومات الأساسية
          </h3>
          <p className="text-gray-500 text-sm">
            أدخل المعلومات الأساسية للمزاد
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            عنوان المزاد <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleFormChange}
            required
            maxLength={255}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 ${
              apiErrors.title ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="أدخل عنوان المزاد"
          />
          {apiErrors.title && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {apiErrors.title[0]}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            وصف المزاد
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleFormChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 resize-none ${
              apiErrors.description ? "border-red-500" : "border-gray-200"
            }`}
            rows="5"
            placeholder="أدخل وصفاً مفصلاً عن المزاد (اختياري)"
          />
          {apiErrors.description && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {apiErrors.description[0]}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            رابط التعريف (اختياري)
          </label>
          <input
            type="url"
            name="intro_link"
            value={formData.intro_link}
            onChange={handleFormChange}
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 ${
              apiErrors.intro_link ? "border-red-500" : "border-gray-200"
            }`}
            placeholder="https://example.com/auction-intro"
          />
          {apiErrors.intro_link && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> {apiErrors.intro_link[0]}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step1BasicInfo;
