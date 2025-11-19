import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import '../../styles/AuthModal.css';

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

  // دالة التحقق من الإيميل
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateFields = () => {
    let errors = {};

    // فحص الإيميل
    if (!formData.email.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة يجب ان يكون @gmail.com";
    }

    // فحص كلمة المرور
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
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal login-modal">
        <div className="auth-modal-header">
          <button className="close-btn" onClick={onClose}>
            <FiX size={22} />
          </button>
        </div>

        <div className="auth-content">

          <div className="auth-hero-section">
            <div className="logo-container">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="auth-logo"
              />
            </div>
            <p className="auth-subtitle">إبدأ رحلتك العقارية معنا</p>
            <div className="auth-divider"></div>
          </div>

          <div className="auth-options">
            <button className="auth-option-btn active">تسجيل الدخول</button>
            <button className="auth-option-btn" onClick={onSwitchToRegister}>
              حساب جديد
            </button>
          </div>

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="auth-form">

            {/* البريد الإلكتروني */}
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-with-icon">
                <input
                  type="text"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`form-input ${fieldErrors.email ? "input-error" : ""}`}
                  disabled={loading}
                />
              </div>

              {fieldErrors.email && (
                <p className="field-error-text">{fieldErrors.email}</p>
              )}
            </div>

            {/* كلمة المرور */}
            <div className="form-group password-group">
              <label className="form-label">كلمة المرور</label>

              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="........."
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-input password-input ${fieldErrors.password ? "input-error" : ""}`}
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {fieldErrors.password && (
                <p className="field-error-text">{fieldErrors.password}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={loading}
            >
              {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
