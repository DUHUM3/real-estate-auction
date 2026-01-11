// Success completion screen

import React from "react";
import { FaCheckCircle, FaArrowRight, FaPlus } from "react-icons/fa";

function CompletionScreen({ onBack, onSubmit }) {
  return (
    <div className="p-6 md:p-12 text-center">
      <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
        <FaCheckCircle className="text-4xl" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-3">
        تم استكمال جميع البيانات
      </h2>
      <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
        تم التحقق من جميع المعلومات بنجاح. يمكنك الآن إضافة الإعلان إلى المنصة أو
        العودة لمراجعة البيانات
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          type="button"
          className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
          onClick={onBack}
        >
          <FaArrowRight /> العودة للتعديل
        </button>
        <button
          type="button"
          className="px-8 py-3.5 bg-gradient-to-r from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] text-white rounded-xl hover:from-[#478bc5] hover:via-[#3d7ab0] hover:to-[#326a9a] transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={onSubmit}
        >
          <FaPlus /> إضافة الإعلان
        </button>
      </div>
    </div>
  );
}

export default CompletionScreen;