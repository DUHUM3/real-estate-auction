import React from "react";
import { FaTimes, FaPaperPlane, FaSpinner } from "react-icons/fa";

// Interest Form Component with same design as original
const InterestForm = ({
  onSubmit,
  onClose,
  formData,
  onChange,
  submitting,
  isForSale,
  isForInvestment,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {isForSale
                ? "تقديم عرض للشراء"
                : isForInvestment
                ? "تقديم طلب للاستثمار"
                : "تقديم اهتمام"}
            </h3>
            <button
              className="p-2 rounded-lg hover:bg-gray-100"
              onClick={onClose}
              disabled={submitting}
            >
              <FaTimes />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            {/* Message Field */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-medium text-sm sm:text-base">
                  <span>رسالتك</span>
                </label>
                <div
                  className={`text-xs font-medium ${
                    formData.message.trim().length === 0
                      ? "text-gray-500"
                      : formData.message.trim().length < 10
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {formData.message.trim().length}/10 حرف
                </div>
              </div>
              <textarea
                name="message"
                value={formData.message}
                onChange={(e) => {
                  onChange(e);
                  e.target.classList.remove(
                    "border-red-500",
                    "ring-2",
                    "ring-red-200"
                  );
                }}
                placeholder={
                  isForSale
                    ? "أدخل رسالتك وعرضك للشراء هنا (يجب أن يكون أكثر من 10 أحرف)"
                    : isForInvestment
                    ? "أدخل رسالتك وخطة الاستثمار المقترحة هنا (يجب أن يكون أكثر من 10 أحرف)"
                    : "أدخل رسالتك أو استفسارك هنا (يجب أن يكون أكثر من 10 أحرف)"
                }
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none text-sm sm:text-base"
                required
                disabled={submitting}
              />
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-2 gap-1 sm:gap-0">
                <div className="text-xs text-gray-500">
                  {isForSale
                    ? "اكتب تفاصيل عرض الشراء والسعر المقترح"
                    : isForInvestment
                    ? "اكتب خطة الاستثمار والمدة المقترحة"
                    : "اكتب رسالة مفصلة عن اهتمامك"}
                </div>
                <div className="text-xs text-blue-500">
                  {formData.message.trim().length >= 10
                    ? "✓ جاهز للإرسال"
                    : "اكتب 10 أحرف على الأقل"}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3 px-4 font-bold rounded-lg transition-all text-sm sm:text-base flex items-center justify-center gap-2 ${
                submitting
                  ? "bg-gray-400 text-white"
                  : "bg-gradient-to-r from-[#53a1dd] to-[#4285c7] text-white hover:opacity-90"
              }`}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <FaPaperPlane />
                  إرسال الطلب
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterestForm;