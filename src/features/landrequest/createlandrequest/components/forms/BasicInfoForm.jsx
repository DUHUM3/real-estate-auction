// Step 1: Basic information form component
import React from "react";
import { motion } from "framer-motion";

export function BasicInfoForm({ formData, regions, availableCities, onInputChange }) {
  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">المعلومات الأساسية</h2>
        <p className="text-gray-600">ابدأ بإدخال المعلومات الأساسية عن الأرض</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          عنوان الطلب <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={onInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base"
          placeholder="مثال: أرض سكنية في الرياض"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            المنطقة <span className="text-red-500">*</span>
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={onInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base bg-white"
            required
          >
            <option value="" disabled>اختر المنطقة</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            المدينة <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={onInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={!formData.region}
            required
          >
            <option value="" disabled>اختر المدينة</option>
            {availableCities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>
      </div>
    </motion.div>
  );
}