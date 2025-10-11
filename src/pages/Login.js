import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
    // هنا سيتم إضافة منطق تسجيل الدخول مع الخادم
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
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>تسجيل الدخول</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="كلمة المرور"
              value={formData.password}
              onChange={handleChange}
              required
              className="form-input"
            />
          </div>
          <button type="submit" className="btn btn-primary btn-full">تسجيل الدخول</button>
        </form>
        
        <div className="auth-modal-footer">
          <p>
            ليس لديك حساب؟ 
            <span className="auth-link" onClick={onSwitchToRegister}> انشاء حساب</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;