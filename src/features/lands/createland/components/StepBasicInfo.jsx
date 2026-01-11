// Step 1: Basic Information Form

import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { LAND_TYPES, PURPOSE_TYPES } from "../constants/formConfig";

function StepBasicInfo({ formData, onChange, regions, cities, onRegionChange, onCityChange }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
          <FaFileAlt className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">المعلومات الأساسية</h3>
          <p className="text-gray-600 text-xs mt-1">أدخل البيانات الأساسية للعقار</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            رقم الإعلان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="announcement_number"
            value={formData.announcement_number}
            onChange={onChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: AD-2024-001"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            المنطقة <span className="text-red-500">*</span>
          </label>
          <select
            name="region"
            value={formData.region}
            onChange={onRegionChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 bg-white cursor-pointer text-sm"
          >
            <option value="">اختر المنطقة</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            المدينة <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city}
            onChange={onCityChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white cursor-pointer text-sm"
            disabled={!formData.region}
          >
            <option value="">اختر المدينة</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            عنوان الإعلان <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={onChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
            placeholder="مثال: أرض سكنية في موقع مميز"
          />
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            نوع الأرض <span className="text-red-500">*</span>
          </label>
          <select
            name="land_type"
            value={formData.land_type}
            onChange={onChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 bg-white cursor-pointer text-sm"
          >
            {LAND_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="group">
          <label className="block text-sm font-bold text-gray-800 mb-2">
            الغرض <span className="text-red-500">*</span>
          </label>
          <select
            name="purpose"
            value={formData.purpose}
            onChange={onChange}
            required
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 bg-white cursor-pointer text-sm"
          >
            {PURPOSE_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2 group">
          <label className="block text-sm font-bold text-gray-800 mb-2">الوصف</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={onChange}
            className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 resize-none text-sm"
            rows="4"
            placeholder="اكتب وصفاً تفصيلياً يجذب المهتمين..."
          />
        </div>
      </div>
    </div>
  );
}

export default StepBasicInfo;