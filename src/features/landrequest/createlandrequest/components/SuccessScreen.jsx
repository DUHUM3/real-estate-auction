// Success screen component
import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Icons from "../../../../icons/index";

export function SuccessScreen({ responseData, formData, onCreateNew }) {
  const navigate = useNavigate();

  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] p-8 text-center text-white">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Icons.FaCheck className="text-4xl sm:text-5xl text-[#53a1dd]" />
        </motion.div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">تم إنشاء الطلب بنجاح!</h2>
      </div>

      <div className="p-6 sm:p-8">
        {responseData && (
          <div className="bg-gradient-to-br from-gray-50 to-[#e8f4ff] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">
              تفاصيل الطلب
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-gray-500 text-sm block mb-1">رقم الطلب</span>
                <span className="font-bold text-[#53a1dd] text-lg">
                  #{responseData?.data?.id ?? "--"}
                </span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-gray-500 text-sm block mb-1">العنوان</span>
                <span className="font-semibold text-gray-900">{formData.title}</span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-gray-500 text-sm block mb-1">الموقع</span>
                <span className="font-semibold text-gray-900">
                   {formData.region}, {formData.city}
                </span>
              </div>
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <span className="text-gray-500 text-sm block mb-1">المساحة</span>
                <span className="font-semibold text-gray-900">{formData.area} م²</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={onCreateNew}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
          >
            إنشاء طلب جديد
          </button>
          <button
            onClick={() => navigate("/my-requests")}
            className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
          >
            عرض طلباتي
          </button>
        </div>
      </div>
    </motion.div>
  );
}