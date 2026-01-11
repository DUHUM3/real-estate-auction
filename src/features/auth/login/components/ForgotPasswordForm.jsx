// Forgot password form component - handles password reset flow

import React from "react";
import { FiMail, FiArrowLeft, FiAlertCircle } from "react-icons/fi";

function ForgotPasswordForm({
  email,
  fieldErrors,
  generalError,
  loading,
  success,
  handleEmailChange,
  handleSubmit,
  onBack,
  onClose,
}) {
  // Success state
  if (success) {
    return (
      <div className="space-y-3 sm:space-y-4 text-center">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FiMail className="text-green-600 text-lg sm:text-2xl" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">
          تم إرسال رابط إعادة التعيين
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
          <br />
          <span className="font-medium text-gray-800">{email}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          يرجى التحقق من صندوق الوارد واتباع التعليمات لإعادة تعيين كلمة المرور.
        </p>
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-2 px-3 border border-gray-300 text-xs sm:text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
          >
            العودة لتسجيل الدخول
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow hover:shadow-md transition-all duration-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="text-center mb-2 sm:mb-3">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <FiMail className="text-blue-600 text-base sm:text-xl" />
          </div>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">
          نسيت كلمة المرور
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
        </p>
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <FiMail className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
          <input
            type="text"
            value={email}
            onChange={handleEmailChange}
            placeholder="example@gmail.com"
            disabled={loading}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            dir="ltr"
          />
        </div>
        {fieldErrors.email && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
        )}
      </div>

      {/* General error */}
      {generalError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertCircle
              className="text-red-600 mt-0.5 flex-shrink-0"
              size={14}
            />
            <p className="text-xs text-red-800">{generalError}</p>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-3 border border-gray-300 text-xs sm:text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          عودة
        </button>

        <button
          type="submit"
          disabled={loading}
          className="flex-1 py-1.5 sm:py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري الإرسال...
            </span>
          ) : (
            "إرسال رابط"
          )}
        </button>
      </div>
    </form>
  );
}

export default ForgotPasswordForm;