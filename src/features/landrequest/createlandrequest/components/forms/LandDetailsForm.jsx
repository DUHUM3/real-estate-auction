// Step 2: Land details form component
import React from "react";
import { motion } from "framer-motion";
import { PURPOSE_OPTIONS, TYPE_OPTIONS } from "../../constants/formSteps";

export function LandDetailsForm({ formData, onInputChange }) {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">تفاصيل الأرض</h2>
        <p className="text-gray-600">أضف معلومات تفصيلية عن نوع الأرض ومساحتها</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            الغرض من التسويق
          </label>
          <div className="grid grid-cols-2 gap-3">
            {PURPOSE_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onInputChange({ target: { name: "purpose", value: option.value } })}
                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                  formData.purpose === option.value
                    ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">نوع الأرض</label>
          <select
            name="type"
            value={formData.type}
            onChange={onInputChange}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base bg-white"
          >
            {TYPE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          المساحة (متر مربع) <span className="text-red-500">*</span>
        </label>
        <input
          type="number"
          name="area"
          value={formData.area}
          onChange={onInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base"
          placeholder="أدخل المساحة بالمتر المربع"
          min="1"
          required
          dir="ltr"
          style={{ textAlign: "left" }}
        />
        <p className="text-xs text-gray-500 mt-1 text-left">أدخل الرقم فقط (مثال: 500)</p>
      </div>
    </motion.div>
  );
}