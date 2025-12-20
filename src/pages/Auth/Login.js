import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiX, FiArrowLeft } from 'react-icons/fi';

function Login({ onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: '',
    password: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [forgotPasswordMode, setForgotPasswordMode] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordLoading, setForgotPasswordLoading] = useState(false);
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: ''
    });
  };

  const handleForgotPasswordEmailChange = (e) => {
    setForgotPasswordEmail(e.target.value);
    setFieldErrors({
      ...fieldErrors,
      email: ''
    });
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

    if (!formData.email.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password.trim()) {
      errors.password = "الرجاء إدخال كلمة المرور";
    } else if (formData.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateForgotPasswordEmail = () => {
    let errors = {};

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
        expires_at: data.expires_at
      };

      login(userData);
      
      // toast.success('تم تسجيل الدخول بنجاح!', {
      //   position: "top-center",
      //   autoClose: 3000
      // });
      
      if (onClose) onClose();
      
      setTimeout(() => {
        navigate('/');
      }, 1000);

    } catch (error) {
      console.error('Login error:', error);
      
      const errorMsg = error.message?.toLowerCase() || '';
      
      if (errorMsg.includes("incorrect") || errorMsg.includes("invalid") || 
          errorMsg.includes("password") || errorMsg.includes("email") ||
          errorMsg.includes("خطأ") || errorMsg.includes("غير صحيح")) {
        
        setFieldErrors({
          email: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          password: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        });
        
        toast.error("البريد الإلكتروني أو كلمة المرور غير صحيحة", { 
          position: "top-center" 
        });
      } else {
        toast.error(error.message || "حدث خطأ في الاتصال بالخادم", { 
          position: "top-center" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();

    if (!validateForgotPasswordEmail()) return;

    setForgotPasswordLoading(true);

    try {
      const response = await authApi.forgotPassword(forgotPasswordEmail);
      
      setForgotPasswordSuccess(true);
      
      toast.success(response.message || 'تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.', {
        position: "top-center",
        autoClose: 5000
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      
      const errorMsg = error.message?.toLowerCase() || '';
      
      if (errorMsg.includes("email") || errorMsg.includes("بريد") || errorMsg.includes("غير موجود")) {
        setFieldErrors({
          email: "البريد الإلكتروني غير مسجل في النظام"
        });
        toast.error("البريد الإلكتروني غير مسجل في النظام", { 
          position: "top-center" 
        });
      } else {
        toast.error(error.message || "حدث خطأ أثناء إرسال رابط إعادة التعيين", { 
          position: "top-center" 
        });
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
    navigate('/privacy-policy');
  };

  const navigateToTermsOfService = () => {
    if (onClose) onClose();
    navigate('/terms-of-service');
  };

  // Render forgot password form
  const renderForgotPasswordForm = () => {
    if (forgotPasswordSuccess) {
      return (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiMail className="text-green-600 text-2xl" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">تم إرسال رابط إعادة التعيين</h3>
          <p className="text-sm text-gray-600 mt-1">
            تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
            <br />
            <span className="font-medium text-gray-800">{forgotPasswordEmail}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            يرجى التحقق من صندوق الوارد واتباع التعليمات لإعادة تعيين كلمة المرور.
          </p>
          <div className="mt-6 flex gap-3">
            <button 
              onClick={() => {
                setForgotPasswordMode(false);
                setForgotPasswordSuccess(false);
                setForgotPasswordEmail('');
              }}
              className="flex-1 flex items-center justify-center gap-1 py-2 px-3 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              العودة لتسجيل الدخول
            </button>
            <button 
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow hover:shadow-md transition-all duration-200"
            >
              إغلاق
            </button>
          </div>
        </div>
      );
    }

    return (
      <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <FiMail className="text-blue-600 text-xl" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-gray-900">نسيت كلمة المرور</h3>
          <p className="text-sm text-gray-600 mt-1">
            أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={forgotPasswordEmail}
              onChange={handleForgotPasswordEmailChange}
              placeholder="example@gmail.com"
              disabled={forgotPasswordLoading}
              className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } ${forgotPasswordLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              dir="ltr"
            />
          </div>
          {fieldErrors.email && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
          )}
        </div>
        
        <div className="flex gap-3 mt-5">
          <button 
            type="button"
            onClick={() => {
              setForgotPasswordMode(false);
              setForgotPasswordEmail('');
              setFieldErrors({});
            }}
            disabled={forgotPasswordLoading}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowLeft className="w-3.5 h-3.5" />
            عودة
          </button>
          
          <button 
            type="submit"
            disabled={forgotPasswordLoading}
            className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {forgotPasswordLoading ? (
              <span className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري الإرسال...
              </span>
            ) : (
              'إرسال رابط إعادة التعيين'
            )}
          </button>
        </div>
      </form>
    );
  };

  // Render login form
  const renderLoginForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">
            البريد الإلكتروني
          </label>
          <div className="relative">
            <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              name="email"
              placeholder="example@gmail.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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
            <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
              } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              dir="ltr"
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              disabled={loading}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-3 rounded-lg text-sm font-medium shadow hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-1">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري تسجيل الدخول...
            </span>
          ) : (
            'تسجيل الدخول'
          )}
        </button>

        {/* Forgot password link */}
        <div className="text-center mt-3">
          <button 
            type="button"
            onClick={() => setForgotPasswordMode(true)}
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
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-3"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex justify-end p-2 sticky top-0 bg-white border-b border-gray-100">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="px-4 pb-4">
          
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">إبدأ رحلتك العقارية معنا</p>
          </div>

          {/* Tabs - Only show if not in forgot password mode */}
          {!forgotPasswordMode && (
            <div className="flex bg-gray-100 rounded-lg p-1 mb-4 text-sm">
              <button className="flex-1 py-2 px-3 bg-white text-gray-900 font-medium rounded-md shadow-sm transition-all duration-200">
                تسجيل الدخول
              </button>
              <button 
                onClick={onSwitchToRegister}
                className="flex-1 py-2 px-3 text-gray-600 font-medium rounded-md hover:text-gray-900 transition-all duration-200"
              >
                حساب جديد
              </button>
            </div>
          )}

          {/* Show title for forgot password mode */}
          {forgotPasswordMode && !forgotPasswordSuccess && (
            <div className="mb-5">
              <h3 className="text-base font-semibold text-gray-900 text-center mb-3">استعادة كلمة المرور</h3>
            </div>
          )}

          {/* Main Content */}
          {forgotPasswordMode ? renderForgotPasswordForm() : renderLoginForm()}

          {/* Terms and conditions - Only show in login mode */}
          {!forgotPasswordMode && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500">
                بمتابعتك فأنت توافق على{' '}
                <button 
                  onClick={navigateToTermsOfService}
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  الشروط والأحكام
                </button>{' '}
                و{' '}
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