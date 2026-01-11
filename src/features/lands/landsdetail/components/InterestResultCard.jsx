import React from "react";
import { FaTimes, FaCheck, FaExclamationTriangle } from "react-icons/fa";

// Interest Result Card Component with same size and design as original form
const InterestResultCard = ({
  type,
  message,
  details,
  onClose,
  isForSale,
  isForInvestment,
}) => {
  const isSuccess = type === "success";
  const title = isForSale
    ? "تقديم عرض للشراء"
    : isForInvestment
    ? "تقديم طلب للاستثمار"
    : "تقديم اهتمام";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 sm:p-6">
          {/* Header - same design as original form */}
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
              {title}
            </h3>
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              onClick={onClose}
            >
              <FaTimes className="text-gray-500" />
            </button>
          </div>

          {/* Content */}
          <div className="text-center">
            {/* Result Icon */}
            <div
              className={`mb-4 sm:mb-6 mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center ${
                isSuccess
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-600"
              }`}
            >
              {isSuccess ? (
                <FaCheck className="text-2xl sm:text-3xl" />
              ) : (
                <FaExclamationTriangle className="text-2xl sm:text-3xl" />
              )}
            </div>

            {/* Main Message */}
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">
              {message}
            </h4>

            {/* Details */}
            {details && (
              <div
                className={`p-3 sm:p-4 rounded-lg mb-4 text-right ${
                  isSuccess
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`text-sm sm:text-base ${
                    isSuccess ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {details}
                </p>
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              {isSuccess ? (
                <>
                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#53a1dd] to-[#4285c7] text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm sm:text-base"
                    onClick={onClose}
                  >
                    حسناً، فهمت ✓
                  </button>
                  <button
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base"
                    onClick={() => {
                      onClose();
                      window.location.reload();
                    }}
                  >
                    عرض المزيد من الأراضي
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#53a1dd] to-[#4285c7] text-white font-bold rounded-lg hover:opacity-90 transition-all text-sm sm:text-base"
                    onClick={onClose}
                  >
                    إعادة المحاولة
                  </button>
                  <button
                    className="w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base"
                    onClick={onClose}
                  >
                    العودة
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterestResultCard;