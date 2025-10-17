import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

function Login({ onClose, onSwitchToRegister }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // مسح الخطأ عند تغيير المدخلات
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        // تخزين البيانات المستلمة من API
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
        
        // استدعاء دالة login من AuthContext لتخزين البيانات
        login(userData);
        navigate('/');
        if (onClose) onClose();
      } else {
        setError(data.message || 'حدث خطأ أثناء تسجيل الدخول');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
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
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="auth-content">
          {/* العنوان الرئيسي */}
          <div className="auth-hero-section">
            <h1 className="auth-main-title">منصة العقارات السعودية</h1>
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
                disabled={loading}
              />
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