import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
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
    navigate('/dashboard');
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>تسجيل الدخول</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="البريد الإلكتروني"
              value={formData.email}
              onChange={handleChange}
              required
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
            />
          </div>
          <button type="submit" className="btn btn-primary">تسجيل الدخول</button>
        </form>
        <p>
          ليس لديك حساب؟ <Link to="/register">انشاء حساب</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;