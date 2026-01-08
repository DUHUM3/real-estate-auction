import React from 'react';
import Icons from '../../../icons';

/**
 * Request details section of the form
 */
function RequestDetailsSection({ description, onInputChange }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
          <Icons.FaMapMarkerAlt className="text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            تفاصيل الطلب
          </h3>
          <p className="text-gray-500 text-sm">
            أدخل وصفاً تفصيلياً للمنتج العقاري
          </p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          الوصف <span className="text-red-500">*</span>
        </label>
        <textarea
          name="description"
          value={description}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
          placeholder="أدخل وصف مفصل للعقار... (الموقع، المساحة، المميزات، الخدمات المتاحة، إلخ)"
          rows="5"
          required
        />
        <p className="text-gray-500 text-sm mt-2">
          أدخل وصفاً تفصيلياً للعقار لزيادة فرص التسويق الناجح.
        </p>
      </div>
    </div>
  );
}

export default RequestDetailsSection;