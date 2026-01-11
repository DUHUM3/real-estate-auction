import React from 'react';
import { FaHandshake } from 'react-icons/fa';
import { formatDate } from '../utils/formatters';

/**
 * Sidebar with additional info and offer button
 */
const RequestSidebar = ({ request, onShowOfferForm }) => {
  return (
    <div className="lg:col-span-1">
      {/* Additional Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">معلومات إضافية</h3>
        <div className="space-y-2 sm:space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-100">
            <span className="text-gray-600 text-sm sm:text-base">تاريخ الإنشاء</span>
            <span className="font-semibold text-gray-800 text-sm sm:text-base">
              {formatDate(request.created_at)}
            </span>
          </div>
        </div>
      </div>

      {/* Offer Button */}
      {request.status === 'open' ? (
        <div className="sticky top-4 sm:top-6" id="offer">
          <button
            className="w-full py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] text-white font-bold rounded-xl hover:from-[#53a1dd] hover:to-[#53a1dd] transition-all text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            onClick={onShowOfferForm}
          >
            <FaHandshake className="text-lg sm:text-xl" />
            تقديم عرض
          </button>
          <p className="text-center text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
            هذا الطلب مفتوح لتلقي العروض حتى تاريخ الإغلاق
          </p>
        </div>
      ) : (
        <div className="text-center py-4 sm:py-6 border border-gray-200 rounded-xl bg-gray-50">
          <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔒</div>
          <h4 className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
            هذا الطلب {request.status === 'closed' ? 'مغلق' : 'مكتمل'}
          </h4>
          <p className="text-gray-600 text-xs sm:text-sm">لا يمكن تقديم عروض جديدة على هذا الطلب</p>
        </div>
      )}
    </div>
  );
};

export default RequestSidebar;