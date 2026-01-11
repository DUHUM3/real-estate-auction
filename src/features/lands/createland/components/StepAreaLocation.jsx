// Step 2: Area and Location Form

import React from "react";
import { FaRulerCombined, FaExclamationTriangle } from "react-icons/fa";
import { VALIDATION_RULES } from "../constants/formConfig";

function StepAreaLocation({ formData, onChange }) {
  const totalArea = parseFloat(formData.total_area) || 0;
  const isAreaInvalid = formData.total_area && totalArea < VALIDATION_RULES.MIN_AREA;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
          <FaRulerCombined className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">المساحة والموقع</h3>
          <p className="text-gray-600 text-xs mt-1">حدد مساحة العقار وموقعه بدقة</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            المساحة الإجمالية (م²) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="total_area"
            value={formData.total_area}
            onChange={onChange}
            required
            min="5000"
            step="0.01"
            className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium text-sm ${
              isAreaInvalid
                ? "border-red-500 bg-red-50 focus:ring-red-200"
                : "border-gray-300 group-hover:border-gray-400"
            }`}
            placeholder="مثال: 10000"
          />
          {isAreaInvalid ? (
            <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg mt-2 border border-red-200">
              <FaExclamationTriangle className="flex-shrink-0 text-base" />
              <span className="font-semibold">
                يجب أن تكون المساحة 5000 م² على الأقل
              </span>
            </div>
          ) : (
            <p className="text-gray-500 text-xs mt-2 flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
              الحد الأدنى للمساحة: 5000 م²
            </p>
          )}
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            رقم الصك <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="deed_number"
            value={formData.deed_number}
            onChange={onChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: 123456789"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">الطول شمال (م)</label>
          <input
            type="number"
            name="length_north"
            value={formData.length_north}
            onChange={onChange}
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: 100"
            step="0.01"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">الطول جنوب (م)</label>
          <input
            type="number"
            name="length_south"
            value={formData.length_south}
            onChange={onChange}
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: 100"
            step="0.01"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">الطول شرق (م)</label>
          <input
            type="number"
            name="length_east"
            value={formData.length_east}
            onChange={onChange}
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: 50"
            step="0.01"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">الطول غرب (م)</label>
          <input
            type="number"
            name="length_west"
            value={formData.length_west}
            onChange={onChange}
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: 50"
            step="0.01"
          />
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            الموقع الجغرافي (وصف) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="geo_location_text"
            value={formData.geo_location_text}
            onChange={onChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: شمال الرياض، حي النرجس، بالقرب من شارع الملك فهد"
          />
        </div>
      </div>
    </div>
  );
}

export default StepAreaLocation;