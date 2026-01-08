import React from 'react';
import Icons from '../../../icons';

/**
 * Success state component shown after successful form submission
 */
function SuccessState({ responseData, formData, images, onCreateNew }) {
  return (
    <div className="p-8 md:p-12 text-center">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <Icons.FaCheck className="text-3xl" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        تم إنشاء الطلب بنجاح
      </h2>
      <p className="text-gray-600 mb-8 max-w-lg mx-auto">
        سيتم مراجعة طلبك من قبل فريق العمل المختص وسيتم إشعارك بنتيجة
        المراجعة قريباً
      </p>
      <div className="flex justify-center gap-4">
        <button
          onClick={onCreateNew}
          className="px-6 py-3 bg-[#53a1dd] text-white rounded-lg hover:bg-[#478bc5] transition-colors font-medium flex items-center gap-2"
        >
          <Icons.FaPlus />
          إضافة طلب جديد
        </button>

        <button
          onClick={() => (window.location.href = '/')}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium"
        >
          العودة إلى الرئيسية
        </button>
      </div>
    </div>
  );
}

export default SuccessState;