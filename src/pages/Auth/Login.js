import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import '../../styles/AuthModal.css';

// ✅ استيراد الأيقونات الاحترافية
import { FiMail, FiLock, FiEye, FiEyeOff, FiX } from 'react-icons/fi';
import { AiOutlineLogin } from 'react-icons/ai';

function Login({ onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // استخدام الـ API المنفصل
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
      setError(error.message || 'حدث خطأ في الاتصال بالخادم');
      console.error('Login error:', error);
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
          {/* قسم الشعار */}
          <div className="auth-hero-section">
            <div className="logo-container">
              <img
                src="/images/logo2.png"
                alt="منصة الاراضي السعودية"
                className="auth-logo"
              />
            </div>
            <p className="auth-subtitle">إبدأ رحلتك العقارية معنا</p>
            <div className="auth-divider"></div>
          </div>

          {/* خيارات التسجيل */}
          <div className="auth-options">
            <button className="auth-option-btn active">
              تسجيل الدخول
            </button>
            <button
              className="auth-option-btn"
              onClick={onSwitchToRegister}
            >
              حساب جديد
            </button>
          </div>

          {/* عرض رسالة الخطأ */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-with-icon">
                <input
                  type="email"
                  name="email"
                  placeholder="example@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="form-input"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-group password-group">
              <label className="form-label">كلمة المرور</label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="........."
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="form-input password-input"
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
            </div>

            <button
              type="submit"
              className="btn-login-submit"
              disabled={loading}
            >
              {loading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;