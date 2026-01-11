// Main login page component - orchestrates login and forgot password flows

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiX } from "react-icons/fi";
import { useLoginForm } from "../../features/auth/login/hooks/useLoginForm";
import { useForgotPassword } from "../../features/auth/login/hooks/useForgotPassword";
import LoginForm from "../../features/auth/login/components/LoginForm";
import ForgotPasswordForm from "../../features/auth/login/components/ForgotPasswordForm";

function Login({ onClose, onSwitchToRegister }) {
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const navigate = useNavigate();

  // Login form hook
  const loginForm = useLoginForm(onClose);

  // Forgot password hook
  const forgotPassword = useForgotPassword();

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const navigateToPrivacyPolicy = () => {
    if (onClose) onClose();
    navigate("/privacy-policy");
  };

  const navigateToTermsOfService = () => {
    if (onClose) onClose();
    navigate("/terms-of-service");
  };

  const handleSwitchToForgotPassword = () => {
    setForgotPasswordMode(true);
  };

  const handleBackToLogin = () => {
    setForgotPasswordMode(false);
    forgotPassword.reset();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-1 sm:p-2 md:p-3"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        {/* Header */}
        <div className="flex justify-end p-1.5 sm:p-2 sticky top-0 bg-white border-b border-gray-100">
          <button
            onClick={onClose}
            className="p-1 sm:p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX size={16} className="sm:size-[18px] text-gray-600" />
          </button>
        </div>

        <div className="px-3 sm:px-4 pb-3 sm:pb-4">
          {/* Logo */}
          <div className="text-center mb-3 sm:mb-4">
            <div className="flex justify-center mb-2 sm:mb-4">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="h-12 sm:h-14 md:h-16 w-auto"
              />
            </div>
            <p className="text-gray-600 text-xs sm:text-sm">
              إبدأ رحلتك العقارية معنا
            </p>
          </div>

          {/* Tabs - Only show if not in forgot password mode */}
          {!forgotPasswordMode && (
            <div className="flex bg-gray-100 rounded-lg p-0.5 sm:p-1 mb-3 sm:mb-4 text-xs sm:text-sm">
              <button className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 bg-white text-gray-900 font-medium rounded-md shadow-sm transition-all duration-200">
                تسجيل الدخول
              </button>
              <button
                onClick={onSwitchToRegister}
                className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-gray-600 font-medium rounded-md hover:text-gray-900 transition-all duration-200"
              >
                حساب جديد
              </button>
            </div>
          )}

          {/* Show title for forgot password mode */}
          {forgotPasswordMode && !forgotPassword.success && (
            <div className="mb-4 sm:mb-5">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center mb-2 sm:mb-3">
                استعادة كلمة المرور
              </h3>
            </div>
          )}

          {/* Main Content */}
          {forgotPasswordMode ? (
            <ForgotPasswordForm
              email={forgotPassword.email}
              fieldErrors={forgotPassword.fieldErrors}
              generalError={forgotPassword.generalError}
              loading={forgotPassword.loading}
              success={forgotPassword.success}
              handleEmailChange={forgotPassword.handleEmailChange}
              handleSubmit={forgotPassword.handleSubmit}
              onBack={handleBackToLogin}
              onClose={onClose}
            />
          ) : (
            <LoginForm
              formData={loginForm.formData}
              fieldErrors={loginForm.fieldErrors}
              generalError={loginForm.generalError}
              accountStatusError={loginForm.accountStatusError}
              loading={loginForm.loading}
              showPassword={loginForm.showPassword}
              handleChange={loginForm.handleChange}
              togglePasswordVisibility={loginForm.togglePasswordVisibility}
              handleSubmit={loginForm.handleSubmit}
              onForgotPassword={handleSwitchToForgotPassword}
            />
          )}

          {/* Terms and conditions - Only show in login mode */}
          {!forgotPasswordMode && (
            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs text-gray-500">
                بمتابعتك فأنت توافق على{" "}
                <button
                  onClick={navigateToTermsOfService}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  الشروط والأحكام
                </button>{" "}
                و{" "}
                <button
                  onClick={navigateToPrivacyPolicy}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  سياسة الخصوصية
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;