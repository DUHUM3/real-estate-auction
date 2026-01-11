// Login form component - handles the UI for login

import React from "react";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from "react-icons/fi";
import AccountStatusError from "./AccountStatusError";

function LoginForm({
  formData,
  fieldErrors,
  generalError,
  accountStatusError,
  loading,
  showPassword,
  handleChange,
  togglePasswordVisibility,
  handleSubmit,
  onForgotPassword,
}) {
  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      {/* Email Field */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          البريد الإلكتروني
        </label>
        <div className="relative">
          <FiMail className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
          <input
            type="text"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={handleChange}
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

      {/* Password Field */}
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">
          كلمة المرور
        </label>
        <div className="relative">
          <FiLock className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={handleChange}
            disabled={loading}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.password
                ? "border-red-500 bg-red-50"
                : "border-gray-300"
            } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            dir="ltr"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            disabled={loading}
            className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? (
              <FiEyeOff size={14} className="sm:size-4" />
            ) : (
              <FiEye size={14} className="sm:size-4" />
            )}
          </button>
        </div>
        {fieldErrors.password && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
        )}
      </div>

      {/* Account Status Errors */}
      <AccountStatusError status={accountStatusError} />

      {/* General Errors */}
      {generalError && (
        <div className="mt-3 sm:mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertCircle
              className="text-red-600 mt-0.5 flex-shrink-0"
              size={16}
            />
            <div className="text-xs text-red-800">
              <p className="font-medium">{generalError}</p>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading || accountStatusError}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-1.5 sm:py-2 px-3 rounded-lg text-xs sm:text-sm font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 mt-3 sm:mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-1">
            <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            جاري تسجيل الدخول...
          </span>
        ) : (
          "تسجيل الدخول"
        )}
      </button>

      {/* Forgot password link */}
      <div className="text-center mt-2 sm:mt-3">
        <button
          type="button"
          onClick={onForgotPassword}
          className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
        >
          نسيت كلمة المرور؟
        </button>
      </div>
    </form>
  );
}

export default FormLogin;