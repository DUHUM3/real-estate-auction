/**
 * Email verification form component
 * Handles verification code input and submission
 */

import React from "react";
import { FiMail, FiCheckCircle, FiArrowRight } from "react-icons/fi";

const EmailVerificationForm = ({
  verificationSuccess,
  verificationCode,
  setVerificationCode,
  verificationError,
  setVerificationError,
  verifyLoading,
  userEmail,
  onVerify,
  onResendCode,
  onBack,
  onClose,
}) => {
  if (verificationSuccess) {
    return (
      <div className="space-y-3 sm:space-y-4 text-center">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
            <FiCheckCircle className="text-green-600 text-lg sm:text-2xl" />
          </div>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900">تم التحقق بنجاح!</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          تم التحقق من بريدك الإلكتروني بنجاح
          <br />
          <span className="font-medium text-gray-800">{userEmail}</span>
        </p>
        <p className="text-xs text-gray-500 mt-2">
          يمكنك الآن إغلاق هذه النافذة والبدء في استخدام حسابك. شكراً لانضمامك إلينا!
        </p>
        <div className="mt-4 sm:mt-6">
          <button
            onClick={onClose}
            className="w-full py-1.5 sm:py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white shadow hover:shadow-md transition-all duration-200"
          >
            إغلاق
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={onVerify} className="space-y-3 sm:space-y-4">
      <div className="text-center mb-2 sm:mb-3">
        <div className="flex items-center justify-center mb-2 sm:mb-3">
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
            <FiMail className="text-green-600 text-base sm:text-xl" />
          </div>
        </div>
        <h3 className="text-sm sm:text-base font-semibold text-gray-900">تم إرسال رمز التحقق</h3>
        <p className="text-xs sm:text-sm text-gray-600 mt-1">
          يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني
          <br />
          <span className="font-medium text-gray-800">{userEmail}</span>
        </p>
        <button
          type="button"
          onClick={onResendCode}
          disabled={verifyLoading}
          className="text-xs text-blue-600 hover:text-blue-800 mt-1 hover:underline disabled:opacity-50"
        >
          لم تستلم الرمز؟ إعادة إرسال
        </button>
      </div>

      <div className="mb-3 sm:mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">رمز التحقق</label>
        <input
          type="text"
          value={verificationCode}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "").slice(0, 6);
            setVerificationCode(value);
            setVerificationError("");
          }}
          placeholder="000000"
          className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center ${
            verificationError ? "border-red-500 bg-red-50" : "border-gray-300"
          } ${verifyLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          maxLength={6}
          disabled={verifyLoading}
          dir="ltr"
        />
        {verificationError && (
          <p className="mt-1 text-xs text-red-600 text-center">{verificationError}</p>
        )}
        <p className="text-xs text-gray-500 mt-1 text-center">أدخل الرمز المكون من 6 أرقام</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
        <button
          type="button"
          onClick={onBack}
          disabled={verifyLoading}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-3 border border-gray-300 text-xs sm:text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FiArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
          العودة
        </button>

        <button
          type="submit"
          disabled={verifyLoading || verificationCode.length !== 6}
          className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {verifyLoading ? (
            <span className="flex items-center justify-center gap-1">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري التحقق...
            </span>
          ) : (
            "تحقق"
          )}
        </button>
      </div>
    </form>
  );
};

export default EmailVerificationForm;