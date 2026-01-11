// Step 3: Description and terms form component
import React from "react";
import { motion } from "framer-motion";

export function DescriptionForm({ formData, onInputChange }) {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">الوصف والموافقة</h2>
        <p className="text-gray-600">أضف وصفاً تفصيلياً للأرض واقرأ الشروط</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          الوصف التفصيلي <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onInputChange}
          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base resize-none"
          placeholder="اكتب وصفاً تفصيلياً عن الأرض، المميزات، الموقع، والخدمات القريبة..."
          rows="5"
          required
        />
      </div>

      <div className="bg-gradient-to-br from-[#e8f4ff] to-[#d4ebff] rounded-xl p-4 border border-[#a6d4fa]">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            name="terms_accepted"
            checked={formData.terms_accepted}
            onChange={onInputChange}
            className="mt-1 w-5 h-5 text-[#53a1dd] rounded focus:ring-[#53a1dd] cursor-pointer"
            required
          />
          <div>
            <label className="text-gray-800 font-medium block cursor-pointer">
              أوافق على{" "}
              <a
                href="https://shaheenplus.sa/terms-of-service"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#53a1dd] underline hover:text-[#2d8bcc]"
              >
                الشروط والأحكام
              </a>
            </label>
            <p className="text-gray-600 text-sm mt-1">
              أقر بصحة جميع المعلومات المقدمة وأتحمل المسؤولية القانونية عنها
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}