import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiEye, FiEyeOff, FiX } from 'react-icons/fi';

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
      errors.email = "صيغة البريد الإلكتروني غير صحيحة يجب ان يكون @gmail.com";
    }

    if (!formData.password.trim()) {
      errors.password = "الرجاء إدخال كلمة المرور";
    } else if (formData.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
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
      if (onClose) onClose();

    } catch (error) {
      if (
        error.message?.includes("incorrect") ||
        error.message?.includes("invalid") ||
        error.message?.includes("password") ||
        error.message?.includes("email")
      ) {
        setFieldErrors({
          email: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
          password: "البريد الإلكتروني أو كلمة المرور غير صحيحة"
        });
      } else {
        toast.error(error.message || "حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-end p-4">
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX size={22} className="text-gray-600" />
          </button>
        </div>

        <div className="px-8 pb-8">
          
          {/* Hero Section */}
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="h-16 w-auto"
              />
            </div>
            {/* <h2 className="text-2xl font-bold text-gray-900 mb-2">
              مرحباً بعودتك
            </h2> */}
            <p className="text-gray-600">
              إبدأ رحلتك العقارية معنا
            </p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
            <button className="flex-1 py-3 px-4 bg-white text-gray-900 font-semibold rounded-xl shadow-sm transition-all duration-200">
              تسجيل الدخول
            </button>
            <button 
              onClick={onSwitchToRegister}
              className="flex-1 py-3 px-4 text-gray-600 font-semibold rounded-xl hover:text-gray-900 transition-all duration-200"
            >
              حساب جديد
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.email 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
              {fieldErrors.email && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-4 py-3 pr-12 border rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.password 
                      ? 'border-red-500 bg-red-50' 
                      : 'border-gray-300 bg-white'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  جاري تسجيل الدخول...
                </span>
              ) : (
                'تسجيل الدخول'
              )}
            </button>
          </form>

          {/* Additional Links */}
          <div className="mt-6 text-center">
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors duration-200">
              نسيت كلمة المرور؟
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;