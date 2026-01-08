import React from "react";
import Icons from "../../../icons";

/**
 * Basic information section of the form
 */
function BasicInfoSection({
  formData,
  regions,
  availableCities,
  onInputChange,
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
          <Icons.FaFileAlt className="text-lg" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            المعلومات الأساسية
          </h3>
          <p className="text-gray-500 text-sm">
            أدخل المعلومات الأساسية للمنتج العقاري
          </p>
        </div>
      </div>

      {/* الحقول الأولى: الاسم ورقم الهوية */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            الاسم <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name || ""}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
            placeholder="أدخل الاسم بالكامل"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            رقم الهوية <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="id_number"
            value={formData.id_number || ""}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
            placeholder="أدخل رقم الهوية (10 أرقام، يبدأ بـ1 أو 2)"
            required
            dir="ltr"
            maxLength={10} // يمنع إدخال أكثر من 10 أرقام
            pattern="[12][0-9]{9}" // يبدأ بـ1 أو 2 ويليه 9 أرقام
            title="رقم الهوية يجب أن يكون 10 أرقام ويبدأ بـ1 أو 2"
          />
        </div>
      </div>

      {/* قسم "ما هي صفتك بهذا العقار" */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
            <Icons.FaUser className="text-base" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-800">
              ما هي صفتك بهذا العقار؟
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* خيار المالك */}
          <label className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#53a1dd] transition-colors has-[:checked]:border-[#53a1dd] has-[:checked]:bg-blue-50">
            <input
              type="radio"
              name="property_role"
              value="owner"
              checked={formData.property_role === "owner"}
              onChange={onInputChange}
              className="sr-only peer"
              required
            />
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0 peer-checked:border-[#53a1dd] peer-checked:bg-[#53a1dd] relative">
              <div className="absolute inset-1 bg-white rounded-full peer-checked:bg-[#53a1dd]"></div>
            </div>
            <div>
              <span className="font-medium text-gray-800">مالك</span>
              <p className="text-sm text-gray-500 mt-1">
                أنت المالك الأصلي للعقار
              </p>
            </div>
          </label>

          {/* خيار الوكيل الشرعي */}
          <label className="relative flex items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-[#53a1dd] transition-colors has-[:checked]:border-[#53a1dd] has-[:checked]:bg-blue-50">
            <input
              type="radio"
              name="property_role"
              value="legal_agent"
              checked={formData.property_role === "legal_agent"}
              onChange={onInputChange}
              className="sr-only peer"
              required
            />
            <div className="w-5 h-5 border-2 border-gray-300 rounded-full mr-3 flex-shrink-0 peer-checked:border-[#53a1dd] peer-checked:bg-[#53a1dd] relative">
              <div className="absolute inset-1 bg-white rounded-full peer-checked:bg-[#53a1dd]"></div>
            </div>
            <div>
              <span className="font-medium text-gray-800">وكيل شرعي</span>
              <p className="text-sm text-gray-500 mt-1">
                أنت وكيل شرعي عن المالك
              </p>
            </div>
          </label>
        </div>

        {/* الحقول المشروطة بناءً على الاختيار */}
        <div className="mt-6 space-y-4">
          {/* رقم الصك - يظهر للجميع */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              رقم الصك <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="document_number"
              value={formData.document_number || ""}
              onChange={onInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
              placeholder="أدخل رقم الصك"
              required
              dir="ltr"
            />
          </div>

          {/* رقم الوكالة - يظهر فقط للوكيل الشرعي */}
          {formData.property_role === "legal_agent" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                رقم الوكالة <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="agency_number"
                value={formData.agency_number || ""}
                onChange={onInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                placeholder="أدخل رقم الوكالة الشرعية"
                required
                dir="ltr"
              />
            </div>
          )}
        </div>
      </div>

      {/* باقي الحقول: المنطقة والمدينة */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المنطقة <span className="text-red-500">*</span>
          </label>
          <select
            name="region"
            value={formData.region || ""}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
            required
          >
            <option value="" disabled>
              اختر المنطقة
            </option>
            {regions.map((region) => {
              const regionName = region.name || region;
              const regionValue = region.id || regionName;

              return (
                <option key={regionValue} value={regionName}>
                  {regionName}
                </option>
              );
            })}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            المدينة <span className="text-red-500">*</span>
          </label>
          <select
            name="city"
            value={formData.city || ""}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition disabled:bg-gray-50"
            disabled={!formData.region}
            required
          >
            <option value="" disabled>
              اختر المدينة
            </option>
            {availableCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default BasicInfoSection;
