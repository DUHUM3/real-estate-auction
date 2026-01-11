// Step 4: Images and Legal Declaration

import React from "react";
import {
  FaImage,
  FaCloudUploadAlt,
  FaTrashAlt,
  FaCheckCircle,
  FaPlus,
  FaTimes,
} from "react-icons/fa";

function StepImagesDeclaration({
  formData,
  onChange,
  coverImagePreview,
  additionalImagesPreview,
  isDragging,
  onCoverImageChange,
  onRemoveCoverImage,
  onAdditionalImagesChange,
  onRemoveAdditionalImage,
  onDragOver,
  onDragLeave,
  onDrop,
}) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
          <FaImage className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">الصور والإقرارات</h3>
          <p className="text-gray-600 text-xs mt-1">أضف صوراً عالية الجودة للعقار</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Cover Image Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            الصورة الرئيسية <span className="text-red-500">*</span>
          </label>

          {!coverImagePreview ? (
            <div
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              className={`relative border-2 border-dashed rounded-2xl p-6 md:p-10 text-center cursor-pointer transition-all duration-300 ${
                isDragging
                  ? "border-[#53a1dd] bg-blue-50"
                  : "border-gray-300 bg-white hover:border-[#53a1dd] hover:bg-blue-50"
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onCoverImageChange(e.target.files?.[0])}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                id="cover-image-input"
              />
              <label htmlFor="cover-image-input" className="flex flex-col items-center cursor-pointer">
                <div className="w-16 h-16 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                  <FaCloudUploadAlt className="text-3xl" />
                </div>
                <h4 className="text-lg font-bold text-gray-800 mb-2">
                  اسحب الصورة هنا أو انقر للاختيار
                </h4>
                <p className="text-gray-500 text-xs mb-3">
                  الحد الأقصى: 5 ميجابايت • الصيغ المدعومة: JPG, PNG, WEBP
                </p>
                <div className="px-5 py-2.5 bg-gradient-to-r from-[#53a1dd] to-[#478bc5] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                  اختر الصورة
                </div>
              </label>
            </div>
          ) : (
            <div className="relative rounded-2xl overflow-hidden shadow-xl group">
              <img src={coverImagePreview} alt="Cover Preview" className="w-full h-64 object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                <button
                  type="button"
                  onClick={onRemoveCoverImage}
                  className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 px-5 py-2.5 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 flex items-center gap-2"
                >
                  <FaTrashAlt /> حذف الصورة
                </button>
              </div>
              <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold shadow-md flex items-center gap-2 text-sm">
                <FaCheckCircle /> تم الرفع
              </div>
            </div>
          )}
        </div>

        {/* Additional Images Upload */}
        <div>
          <label className="block text-sm font-bold text-gray-800 mb-3">
            الصور الإضافية <span className="text-gray-500 font-normal">(اختياري - حتى 10 صور)</span>
          </label>

          <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-white hover:border-[#53a1dd] hover:bg-blue-50 transition-all duration-300 cursor-pointer">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onAdditionalImagesChange(e.target.files)}
              className="hidden"
              id="additional-images"
            />
            <label htmlFor="additional-images" className="flex flex-col items-center cursor-pointer">
              <div className="w-14 h-14 bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center mb-3">
                <FaPlus className="text-xl" />
              </div>
              <h4 className="text-base font-bold text-gray-800 mb-1">إضافة صور إضافية</h4>
              <p className="text-gray-500 text-xs">اختر صوراً متعددة لإضافتها</p>
            </label>
          </div>

          {/* Additional Images Preview Grid */}
          {additionalImagesPreview.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-5">
              {additionalImagesPreview.map((img) => (
                <div key={img.id} className="relative rounded-xl overflow-hidden shadow-lg group aspect-square">
                  <img src={img.preview} alt="Additional" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => onRemoveAdditionalImage(img.id)}
                      className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 w-9 h-9 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 flex items-center justify-center"
                    >
                      <FaTimes className="text-base" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {additionalImagesPreview.length > 0 && (
            <p className="text-gray-600 text-xs mt-3 text-center">
              تم رفع <span className="font-bold text-[#53a1dd]">{additionalImagesPreview.length}</span> صورة إضافية
            </p>
          )}
        </div>

        {/* Legal Declaration */}
        <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-300 shadow-md">
          <div className="flex items-start gap-4">
            <input
              type="checkbox"
              name="legal_declaration"
              checked={formData.legal_declaration}
              onChange={onChange}
              required
              className="mt-1 w-5 h-5 text-[#53a1dd] rounded-lg focus:ring-4 focus:ring-[#53a1dd]/20 cursor-pointer border-2 border-gray-400"
              id="legal_declaration"
            />
            <label htmlFor="legal_declaration" className="cursor-pointer flex-1">
              <div className="text-gray-900 font-bold text-base mb-2 flex items-center gap-2">
                <FaCheckCircle className="text-[#53a1dd]" />
                الإقرار القانوني
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                أقر بأن جميع المعلومات والبيانات المقدمة في هذا النموذج صحيحة ودقيقة، وأنني أتحمل كامل
                المسؤولية القانونية عن أي معلومات خاطئة أو مضللة. كما أوافق على الشروط والأحكام الخاصة
                بالمنصة.
              </p>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StepImagesDeclaration;