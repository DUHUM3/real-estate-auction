import React from 'react';
import { FaTimes, FaEdit, FaPaperPlane } from 'react-icons/fa';

/**
 * Modal for submitting an offer
 */
const OfferFormModal = ({
  show,
  offerMessage,
  setOfferMessage,
  offerLoading,
  onClose,
  onSubmit,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              تقديم عرض على الطلب
            </h3>
            <button
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
              title="إغلاق"
            >
              <FaTimes className="text-base sm:text-lg" />
            </button>
          </div>

          <form onSubmit={onSubmit}>
            <div className="mb-4 sm:mb-6">
              <div className="flex justify-between items-center mb-2 sm:mb-3">
                <label className="flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base">
                  <FaEdit className="text-blue-500 text-sm sm:text-base" />
                  <span>تفاصيل العرض</span>
                </label>
                <div
                  className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                    offerMessage.trim().length === 0
                      ? 'bg-gray-100 text-gray-500'
                      : offerMessage.trim().length < 10
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {offerMessage.trim().length} حرف
                </div>
              </div>
              <textarea
                name="offerMessage"
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                placeholder="أدخل تفاصيل العرض هنا... مثلاً: لدي أرض تناسب متطلباتك في الموقع المطلوب مع توفر جميع الخدمات..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all text-sm sm:text-base"
                required
                maxLength={2000}
              />
              <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-2 sm:mt-3 gap-1 sm:gap-0">
                <div className="text-xs text-gray-500">اكتب وصفاً واضحاً ومفصلاً لعرضك</div>
                <div
                  className={`text-xs font-medium ${
                    offerMessage.trim().length >= 10 ? 'text-green-500' : 'text-amber-500'
                  }`}
                >
                  {offerMessage.trim().length >= 10 ? '✓ جاهز للإرسال' : 'اكتب 10 أحرف على الأقل'}
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] text-white font-bold rounded-xl hover:from-[#53a1dd] hover:to-[#53a1dd] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
              disabled={offerLoading}
            >
              <FaPaperPlane className="text-sm sm:text-base" />
              {offerLoading ? 'جاري الإرسال...' : 'إرسال العرض'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OfferFormModal;