/**
 * Step 1: Personal information form fields
 */

import React from "react";
import { FiUser, FiPhone, FiBook, FiBriefcase } from "react-icons/fi";

const Step1PersonalInfo = ({ formData, fieldErrors, userTypeId, onChange, disabled }) => {
  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-1 gap-3 sm:gap-4">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">الاسم الكامل</label>
          <div className="relative">
            <FiUser className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="full_name"
              placeholder="الاسم الكامل"
              value={formData.full_name}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.full_name ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.full_name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">رقم الجوال</label>
          <div className="relative">
            <FiPhone className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="tel"
              name="phone"
              placeholder="05xxxxxxxx"
              value={formData.phone}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                if (value.length <= 10) {
                  onChange({ target: { name: "phone", value } });
                }
              }}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.phone ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
        </div>
      </div>

      {/* National ID for types 2, 3, 4, 5, 6 */}
      {[2, 3, 4, 5, 6].includes(userTypeId) && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">رقم الهوية</label>
          <div className="relative">
            <FiBook className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="national_id"
              placeholder="رقم الهوية (10 أرقام)"
              value={formData.national_id}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.national_id ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              maxLength="10"
            />
          </div>
          {fieldErrors.national_id && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.national_id}</p>
          )}
        </div>
      )}

      {/* Agency number for type 3 */}
      {userTypeId === 3 && (
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">رقم الوكالة</label>
          <div className="relative">
            <FiBriefcase className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="agency_number"
              placeholder="رقم الوكالة الشرعية"
              value={formData.agency_number}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.agency_number ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.agency_number && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.agency_number}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Step1PersonalInfo;