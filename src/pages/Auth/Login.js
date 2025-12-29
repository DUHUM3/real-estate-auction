import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { authApi } from "../../api/authApi";
import { toast } from "react-toastify";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiX,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

function Login({ onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [accountStatusError, setAccountStatusError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: "",
    });
    setGeneralError("");
    setAccountStatusError("");
  };

  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
    setFieldErrors({
      ...fieldErrors,
      email: "",
    });
    setGeneralError("");
    setAccountStatusError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFields = () => {
    let errors = {};
    setGeneralError("");
    setAccountStatusError("");

    if (!formData.email.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password.trim()) {
      errors.password = "الرجاء إدخال كلمة المرور";
    } else if (formData.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotPasswordEmail = () => {
    let errors = {};
    setGeneralError("");
    setAccountStatusError("");

    if (!forgotPasswordEmail.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!isValidEmail(forgotPasswordEmail.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);
    setGeneralError("");
    setAccountStatusError("");
    setFieldErrors({
      email: "",
      password: "",
    });

    try {
      const data = await authApi.login(formData.email, formData.password);

      const userData = {
        id: data.user.id,
        full_name: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone,
        user_type: data.user.user_type,
        status: data.user.status,
        access_token: data.access_token,
        token_type: data.token_type,
        expires_at: data.expires_at,
      };

      login(userData);

      if (onClose) onClose();

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      // حالة 429 - Too Many Requests
      if (error.status === 429 || error.status === 429) {
        setGeneralError(
          error.message ||
            "عدد محاولات تسجيل الدخول تجاوز الحد المسموح. حاول مرة أخرى بعد دقيقة."
        );
        return;
      }

      // حالة 401 - بيانات الدخول غير صحيحة
      if (error.status === 401) {
        setFieldErrors({
          email: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          password: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        });
        return;
      }

      // حالة 403 - حساب غير مفعل أو قيد المراجعة
      if (error.status === 403) {
        const errorMessage = error.message || "";

        // الحساب غير مفعل (البريد غير موثق)
        if (
          errorMessage.includes("يرجى التحقق من بريدك الإلكتروني أولاً") ||
          errorMessage.includes("email") ||
          errorMessage.includes("تحقق") ||
          errorMessage.includes("verify")
        ) {
          setAccountStatusError("unverified");
        }
        // الحساب قيد المراجعة
        else if (
          errorMessage.includes("الحساب قيد المراجعة") ||
          errorMessage.includes("pending") ||
          errorMessage.includes("مراجعة")
        ) {
          setAccountStatusError("pending");
        }
        // حالات 403 أخرى
        else {
          setGeneralError(
            errorMessage || "الحساب غير مفعل. يرجى التواصل مع الدعم الفني."
          );
        }
        return;
      }

      // أخطاء الشبكة أو أخطاء غير متوقعة
      if (
        error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("timeout")
      ) {
        setGeneralError("حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.");
      } else {
        setGeneralError(
          error.message || "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validateForgotPasswordEmail()) return;

    setForgotPasswordLoading(true);
    setGeneralError("");

    try {
      const response = await authApi.forgotPassword(forgotPasswordEmail);

      setForgotPasswordSuccess(true);

      toast.success(
        response.message ||
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.status === 404 || error.status === 401) {
        setFieldErrors({
          email: "البريد الإلكتروني غير مسجل في النظام",
        });
      } else {
        setGeneralError(
          error.message ||
            "حدث خطأ أثناء إرسال رابط استعادة كلمة المرور. يرجى المحاولة مرة أخرى."
        );
      }
    } finally {
      setForgotPasswordLoading(false);
    }
  };

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

  // Render account status error message
  const renderAccountStatusError = () => {
    if (!accountStatusError) return null;

    if (accountStatusError === "unverified") {
      return (
        <div className="mt-3 sm:mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FiAlertCircle
              className="text-yellow-600 mt-0.5 flex-shrink-0"
              size={16}
            />
            <div className="text-xs text-yellow-800">
              <p className="font-medium mb-1">
                يرجى التحقق من بريدك الإلكتروني
              </p>
              <p>
                لم يتم تأكيد حسابك بعد. يرجى التحقق من بريدك الإلكتروني وتفعيل
                الحساب قبل تسجيل الدخول.
              </p>
              <button
                onClick={() => {
                  // هنا يمكنك إضافة دالة لإعادة إرسال رابط التحقق
                  toast.info("سيتم إضافة ميزة إعادة إرسال رابط التحقق قريباً", {
                    position: "top-center",
                  });
                }}
                className="mt-2 text-yellow-700 hover:text-yellow-900 font-medium underline text-xs"
              >
                إعادة إرسال رابط التحقق
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (accountStatusError === "pending") {
      return (
        <div className="mt-3 sm:mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <FiClock className="text-blue-600 mt-0.5 flex-shrink-0" size={16} />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">الحساب قيد المراجعة</p>
              <p>
                حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى يتم
                الموافقة على حسابك. ستتلقى إشعاراً عبر البريد الإلكتروني عند
                الموافقة.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Render general error message
  const renderGeneralError = () => {
    if (!generalError) return null;

    return (
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
    );
  };

  // Render forgot password form
  const renderForgotPasswordForm = () => {
    if (forgotPasswordSuccess) {
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
            <span className="font-medium text-gray-800">
              {forgotPasswordEmail}
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            يرجى التحقق من صندوق الوارد واتباع التعليمات لإعادة تعيين كلمة
            المرور.
          </p>
          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row gap-2 sm:gap-3">
            <button
              onClick={() => {
                setForgotPasswordMode(false);
                setForgotPasswordSuccess(false);
                setForgotPasswordEmail("");
                setGeneralError("");
                setAccountStatusError("");
              }}
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

    return (
      <form
        onSubmit={handleForgotPasswordSubmit}
        className="space-y-3 sm:space-y-4"
      >
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
              value={forgotPasswordEmail}
              onChange={handleForgotPasswordEmailChange}
              placeholder="example@gmail.com"
              disabled={forgotPasswordLoading}
              className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
              } ${
                forgotPasswordLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
              dir="ltr"
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>

        {/* General error for forgot password */}
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
            onClick={() => {
              setForgotPasswordMode(false);
              setForgotPasswordEmail("");
              setFieldErrors({});
              setGeneralError("");
              setAccountStatusError("");
            }}
            disabled={forgotPasswordLoading}
            className="flex-1 flex items-center justify-center gap-1 py-1.5 sm:py-2 px-3 border border-gray-300 text-xs sm:text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            عودة
          </button>

          <button
            type="submit"
            disabled={forgotPasswordLoading}
            className="flex-1 py-1.5 sm:py-2 px-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {forgotPasswordLoading ? (
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
  };

  // Render login form
  const renderLoginForm = () => {
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
                fieldErrors.email
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300"
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
        {renderAccountStatusError()}

        {/* General Errors */}
        {renderGeneralError()}

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
            onClick={() => {
              setForgotPasswordMode(true);
              setGeneralError("");
              setAccountStatusError("");
            }}
            className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors duration-200"
          >
            نسيت كلمة المرور؟
          </button>
        </div>
      </form>
    );
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
          {forgotPasswordMode && !forgotPasswordSuccess && (
            <div className="mb-4 sm:mb-5">
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center mb-2 sm:mb-3">
                استعادة كلمة المرور
              </h3>
            </div>
          )}

          {/* Main Content */}
          {forgotPasswordMode ? renderForgotPasswordForm() : renderLoginForm()}

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
