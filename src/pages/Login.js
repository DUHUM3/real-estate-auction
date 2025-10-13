import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

function Login({ onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userData = {
      id: 1,
      name: 'مستخدم تجريبي',
      email: formData.email
    };
    login(userData);
    navigate('/');
    if (onClose) onClose();
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
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="auth-content">
          {/* العنوان الرئيسي */}
          <div className="auth-hero-section">
            <h1 className="auth-main-title">منصة العقارات السعودية</h1>
            <p className="auth-subtitle">إبدأ رحلتك العقارية معنا</p>
            <div className="auth-divider"></div>
          </div>

          {/* رسالة الترحيب */}
          {/* <div className="auth-welcome-section">
            <h2 className="auth-welcome-title">مرحباً بك</h2>
            <p className="auth-welcome-text">سجل دخولك أو أنشئ حساب جديد</p>
          </div> */}

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

          {/* نموذج تسجيل الدخول */}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">كلمة المرور</label>
              <input
                type="password"
                name="password"
                placeholder="........."
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
              />
            </div>

            <button type="submit" className="btn-login-submit">
              تسجيل الدخول
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;