/**
 * Main registration page component
 * Orchestrates the multi-step registration flow
 */

import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext.js";
import { authApi } from "../../api/authApi.js";
import { toast } from "react-toastify";
import { FiX, FiArrowLeft, FiArrowRight } from "react-icons/fi";

// Import hooks
import { useRegisterForm } from "../../features/auth/hooks/useRegisterForm";
import { useEmailVerification } from "../../features/auth/hooks/useEmailVerification";

// Import components
import UserTypeSelector from "../../features/auth/components/UserTypeSelector.jsx";
import ProgressIndicator from "../../features/auth/components/ProgressIndicator.jsx";
import EmailVerificationForm from "../../features/auth/components/EmailVerificationForm.jsx";
import Step1PersonalInfo from "../../features/auth/components/Step1PersonalInfo";
import Step2BusinessInfo from "../../features/auth/components/Step2BusinessInfo";
import Step3LoginCredentials from "../../features/auth/components/Step3LoginCredentials";

function Register({ onClose, onSwitchToLogin }) {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  // Use custom hooks
  const {
    userTypeId,
    currentStep,
    formData,
    fieldErrors,
    uploadedFiles,
    passwordStrength,
    handleChange,
    handleUserTypeChange,
    validateCurrentStep,
    nextStep,
    prevStep,
    getMaxSteps,
    setFieldErrors,
    setCurrentStep,
  } = useRegisterForm(1);

  const {
    verificationStep,
    verificationCode,
    setVerificationCode,
    verifyLoading,
    userEmail,
    verificationError,
    setVerificationError,
    verificationSuccess,
    handleResendCode,
    handleVerifyEmail,
    startVerification,
    resetVerification,
  } = useEmailVerification();

  // Get step title
  const getStepTitle = () => {
    if (verificationStep)
      return verificationSuccess ? "تم التحقق بنجاح" : "التحقق من البريد الإلكتروني";
    if (currentStep === 1) return "البيانات الشخصية";
    if (currentStep === 2) {
      if (userTypeId === 4) return "بيانات المنشأة التجارية";
      if (userTypeId === 5) return "بيانات الترخيص العقاري";
      if (userTypeId === 6) return "بيانات شركة المزادات";
      return "بيانات الدخول";
    }
    return "بيانات الدخول";
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (verificationStep) return;

    const maxSteps = getMaxSteps();

    if (currentStep < maxSteps) {
      nextStep();
      return;
    }

    if (!validateCurrentStep()) return;

    if (passwordStrength.score < 3) {
      toast.error("كلمة المرور ضعيفة جداً، الرجاء اختيار كلمة مرور أقوى");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Add common fields
      formDataToSend.append("full_name", formData.full_name.trim());
      formDataToSend.append("email", formData.email.trim());
      formDataToSend.append("password", formData.password);
      formDataToSend.append("password_confirmation", formData.password_confirmation);
      formDataToSend.append("phone", formData.phone.trim());
      formDataToSend.append("user_type_id", userTypeId.toString());

      // Add conditional fields
      if (formData.national_id && formData.national_id.trim()) {
        formDataToSend.append("national_id", formData.national_id.trim());
      }

      // Add type-specific fields
      if (userTypeId === 3 && formData.agency_number && formData.agency_number.trim()) {
        formDataToSend.append("agency_number", formData.agency_number.trim());
      }

      if (userTypeId === 4) {
        if (formData.business_name && formData.business_name.trim()) {
          formDataToSend.append("business_name", formData.business_name.trim());
        }
        if (formData.commercial_register && formData.commercial_register.trim()) {
          formDataToSend.append("commercial_register", formData.commercial_register.trim());
        }
        if (formData.commercial_file) {
          formDataToSend.append("commercial_file", formData.commercial_file);
        }
      }

      if (userTypeId === 5) {
        if (formData.license_number && formData.license_number.trim()) {
          formDataToSend.append("license_number", formData.license_number.trim());
        }
        if (formData.license_file) {
          formDataToSend.append("license_file", formData.license_file);
        }
      }

      if (userTypeId === 6) {
        if (formData.auction_name && formData.auction_name.trim()) {
          formDataToSend.append("auction_name", formData.auction_name.trim());
        }
        if (formData.business_name && formData.business_name.trim()) {
          formDataToSend.append("business_name", formData.business_name.trim());
        }
        if (formData.commercial_register && formData.commercial_register.trim()) {
          formDataToSend.append("commercial_register", formData.commercial_register.trim());
        }
        if (formData.license_number && formData.license_number.trim()) {
          formDataToSend.append("license_number", formData.license_number.trim());
        }
        if (formData.commercial_file) {
          formDataToSend.append("commercial_file", formData.commercial_file);
        }
        if (formData.license_file) {
          formDataToSend.append("license_file", formData.license_file);
        }
      }

      const response = await authApi.register(formDataToSend);

      startVerification(response.user.id, response.user.email);
    } catch (error) {
      console.error("Registration error:", error);

      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes("email") || errorMsg.includes("بريد")) {
        setFieldErrors({ email: "البريد الإلكتروني مستخدم بالفعل" });
        setCurrentStep(getMaxSteps());
      } else if (errorMsg.includes("phone") || errorMsg.includes("جوال")) {
        setFieldErrors({ phone: "رقم الجوال مستخدم بالفعل" });
        setCurrentStep(1);
      } else if (errorMsg.includes("national_id") || errorMsg.includes("هوية")) {
        setFieldErrors({ national_id: "رقم الهوية مستخدم بالفعل" });
        setCurrentStep(1);
      } else if (errorMsg.includes("commercial_register") || errorMsg.includes("سجل")) {
        setFieldErrors({ commercial_register: "رقم السجل التجاري مستخدم بالفعل" });
        setCurrentStep(2);
      } else if (errorMsg.includes("license_number") || errorMsg.includes("ترخيص")) {
        setFieldErrors({ license_number: "رقم الترخيص مستخدم بالفعل" });
        setCurrentStep(2);
      } else if (errorMsg.includes("full_name") || errorMsg.includes("اسم")) {
        setFieldErrors({ full_name: "الرجاء إدخال الاسم الكامل" });
        setCurrentStep(1);
      } else {
        toast.error(error.message || "حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  // Render current step fields
  const renderCurrentStepFields = () => {
    if (currentStep === 1) {
      return (
        <Step1PersonalInfo
          formData={formData}
          fieldErrors={fieldErrors}
          userTypeId={userTypeId}
          onChange={handleChange}
          disabled={loading}
        />
      );
    }

    if (currentStep === 2 && [4, 5, 6].includes(userTypeId)) {
      return (
        <Step2BusinessInfo
          formData={formData}
          fieldErrors={fieldErrors}
          userTypeId={userTypeId}
          uploadedFiles={uploadedFiles}
          onChange={handleChange}
          disabled={loading}
        />
      );
    }

    if (currentStep === 3 || (currentStep === 2 && ![4, 5, 6].includes(userTypeId))) {
      return (
        <Step3LoginCredentials
          formData={formData}
          fieldErrors={fieldErrors}
          passwordStrength={passwordStrength}
          onChange={handleChange}
          disabled={loading}
        />
      );
    }

    return null;
  };

  // Render navigation buttons
  const renderNavigationButtons = () => {
    if (verificationStep) return null;

    const maxSteps = getMaxSteps();
    return (
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-5">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={prevStep}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-3 border border-gray-300 text-xs sm:text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            السابق
          </button>
        )}

        <button
          type="submit"
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
            currentStep === maxSteps
              ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5"
              : "bg-gray-800 text-white hover:bg-gray-900"
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <div className="w-3 h-3 sm:w-3.5 sm:h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري التحميل...
            </span>
          ) : (
            <>
              {currentStep === maxSteps ? "إنشاء الحساب" : "التالي"}
              {currentStep !== maxSteps && <FiArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            </>
          )}
        </button>
      </div>
    );
  };

  return (
    <div
  className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center pt-16 px-1 sm:px-2 md:px-3"
  onClick={(e) => e.target === e.currentTarget && onClose && onClose()}
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
            <p className="text-gray-600 text-xs sm:text-sm">إبدأ رحلتك العقارية معنا</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-0.5 sm:p-1 mb-3 sm:mb-4 text-xs sm:text-sm">
            <button
              onClick={onSwitchToLogin}
              className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 text-gray-600 font-medium rounded-md hover:text-gray-900 transition-all duration-200"
            >
              تسجيل الدخول
            </button>
            <button className="flex-1 py-1.5 sm:py-2 px-2 sm:px-3 bg-white text-gray-900 font-medium rounded-md shadow-sm transition-all duration-200">
              حساب جديد
            </button>
          </div>

          {/* User Type Selection */}
          {!verificationStep && !verificationSuccess && (
            <UserTypeSelector
              value={userTypeId}
              onChange={handleUserTypeChange}
              disabled={loading || verificationSuccess}
            />
          )}

          {/* Progress Indicator or Verification Title */}
          {verificationStep ? (
            <div className="mb-4 sm:mb-5">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center mb-2 sm:mb-3">
                {getStepTitle()}
              </h3>
            </div>
          ) : (
            <ProgressIndicator
              currentStep={currentStep}
              maxSteps={getMaxSteps()}
              title={getStepTitle()}
            />
          )}

          {/* Form Content */}
          {verificationStep ? (
            <EmailVerificationForm
              verificationSuccess={verificationSuccess}
              verificationCode={verificationCode}
              setVerificationCode={setVerificationCode}
              verificationError={verificationError}
              setVerificationError={setVerificationError}
              verifyLoading={verifyLoading}
              userEmail={userEmail}
              onVerify={(e) => {
                e.preventDefault();
                handleVerifyEmail(formData.password, login, onClose, onSwitchToLogin);
              }}
              onResendCode={handleResendCode}
              onBack={resetVerification}
              onClose={onClose}
            />
          ) : (
            <form onSubmit={handleSubmit}>
              {renderCurrentStepFields()}
              {renderNavigationButtons()}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;