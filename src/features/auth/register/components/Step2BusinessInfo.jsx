/**
 * Step 2: Business information form fields
 * Different fields based on user type (4, 5, or 6)
 */

import React from "react";
import { FiBriefcase, FiFile, FiHome } from "react-icons/fi";
import FileUploadField from "./FileUploadField";

const Step2BusinessInfo = ({
  formData,
  fieldErrors,
  userTypeId,
  uploadedFiles,
  onChange,
  disabled,
}) => {
  if (userTypeId === 4) {
    // Commercial establishment
    return (
      <>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            اسم المنشأة التجارية
          </label>
          <div className="relative">
            <FiBriefcase className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="business_name"
              placeholder="اسم المنشأة التجارية"
              value={formData.business_name}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.business_name ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.business_name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.business_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">رقم السجل التجاري</label>
          <input
            type="text"
            name="commercial_register"
            placeholder="رقم السجل التجاري"
            value={formData.commercial_register}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.commercial_register ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {fieldErrors.commercial_register && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.commercial_register}</p>
          )}
        </div>

        <FileUploadField
          name="commercial_file"
          label="ملف السجل التجاري"
          uploadedFile={uploadedFiles.commercial_file}
          error={fieldErrors.commercial_file}
          onChange={onChange}
          disabled={disabled}
        />
      </>
    );
  }

  if (userTypeId === 5) {
    // Real estate broker
    return (
      <>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            رقم الترخيص العقاري
          </label>
          <div className="relative">
            <FiFile className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="license_number"
              placeholder="رقم الترخيص العقاري"
              value={formData.license_number}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.license_number ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.license_number && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.license_number}</p>
          )}
        </div>

        <FileUploadField
          name="license_file"
          label="ملف الترخيص العقاري"
          uploadedFile={uploadedFiles.license_file}
          error={fieldErrors.license_file}
          onChange={onChange}
          disabled={disabled}
        />
      </>
    );
  }

  if (userTypeId === 6) {
    // Auction company
    return (
      <>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">اسم شركة المزادات</label>
          <div className="relative">
            <FiHome className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="auction_name"
              placeholder="اسم شركة المزادات"
              value={formData.auction_name}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.auction_name ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.auction_name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.auction_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">اسم الكيان</label>
          <div className="relative">
            <FiBriefcase className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="entity_name"
              placeholder="اسم الكيان القانوني"
              value={formData.entity_name}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.entity_name ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.entity_name && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.entity_name}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">رقم السجل التجاري</label>
          <input
            type="text"
            name="commercial_register"
            placeholder="رقم السجل التجاري"
            value={formData.commercial_register}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.commercial_register ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          />
          {fieldErrors.commercial_register && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.commercial_register}</p>
          )}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">رقم الترخيص</label>
          <div className="relative">
            <FiFile className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
            <input
              type="text"
              name="license_number"
              placeholder="رقم الترخيص"
              value={formData.license_number}
              onChange={onChange}
              disabled={disabled}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.license_number ? "border-red-500 bg-red-50" : "border-gray-300"
              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            />
          </div>
          {fieldErrors.license_number && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.license_number}</p>
          )}
        </div>

        <FileUploadField
          name="commercial_file"
          label="ملف السجل التجاري"
          uploadedFile={uploadedFiles.commercial_file}
          error={fieldErrors.commercial_file}
          onChange={onChange}
          disabled={disabled}
        />
        <FileUploadField
          name="license_file"
          label="ملف الترخيص"
          uploadedFile={uploadedFiles.license_file}
          error={fieldErrors.license_file}
          onChange={onChange}
          disabled={disabled}
        />
      </>
    );
  }

  return null;
};

export default Step2BusinessInfo;