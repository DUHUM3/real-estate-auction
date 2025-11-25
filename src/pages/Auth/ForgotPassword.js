import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import '../../styles/AuthModal.css';

import toast from 'react-hot-toast';

import { FiMail, FiArrowRight, FiHome, FiLogIn } from 'react-icons/fi';

function ForgotPassword() {
  const [formData, setFormData] = useState({
    email: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

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
      // محاكاة إرسال الطلب إلى API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // في الواقع، هنا ستقوم بالاتصال بالـ API الحقيقي
      // const data = await authApi.forgotPassword(formData.email);
      
      setSuccess(true);
      toast.success('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');

    } catch (error) {
      if (error.message?.includes("email") || error.message?.includes("not found")) {
        setFieldErrors({
          email: "البريد الإلكتروني غير مسجل في النظام"
        });
      } else {
        toast.error(error.message || "حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="auth-page-container">
        <div className="auth-page-background">
          <div className="background-pattern"></div>
        </div>

        <div className="auth-page-content">
          <div className="auth-page-card">
            {/* <div className="auth-page-header">
              <Link to="/" className="back-home-btn">
                <FiHome />
                العودة للرئيسية
              </Link>
              <Link to="/login" className="auth-nav-btn">
                <FiLogIn />
                تسجيل الدخول
              </Link>
            </div> */}

            <div className="auth-hero-section">
              <div className="logo-container">
                <img
                  src="/images/logo2.webp"
                  alt="منصة الاراضي السعودية"
                  className="auth-logo"
                />
              </div>
              <p className="auth-subtitle">إعادة تعيين كلمة المرور</p>
              <div className="auth-divider"></div>
            </div>

            <div className="success-state">
              <div className="success-icon-large">
                <FiMail />
              </div>
              <h3 className="success-title">تم إرسال رابط التعيين!</h3>
              <p className="success-description">
                تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.
                يرجى التحقق من صندوق الوارد واتباع التعليمات.
              </p>
            </div>

            {/* <div className="auth-page-actions">
              <Link to="/login" className="btn-auth-primary">
                العودة إلى تسجيل الدخول
                <FiArrowRight className="btn-icon" />
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-container">
      <div className="auth-page-background">
        <div className="background-pattern"></div>
      </div>

      <div className="auth-page-content">
        <div className="auth-page-card">
          {/* <div className="auth-page-header">
            <Link to="/" className="back-home-btn">
              <FiHome />
              العودة للرئيسية
            </Link>
            <Link to="/login" className="auth-nav-btn">
              <FiLogIn />
              تسجيل الدخول
            </Link>
          </div> */}

          <div className="auth-hero-section">
            <div className="logo-container">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="auth-logo"
              />
            </div>
            <p className="auth-subtitle">استعادة كلمة المرور</p>
            <div className="auth-divider"></div>
          </div>

          {/* <div className="auth-tabs">
            <Link to="/login" className="auth-tab">
              تسجيل الدخول
            </Link>
            <button className="auth-tab active">
              نسيت كلمة المرور
            </button>
          </div> */}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">البريد الإلكتروني</label>
              <div className="input-with-icon">
                <FiMail className="input-icon" />
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

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
            >
              {loading ? "جاري الإرسال..." : "إرسال رابط التعيين"}
            </button>
          </form>

          {/* <div className="auth-page-footer">
            <p className="footer-text">
              تذكرت كلمة المرور؟{' '}
              <Link to="/login" className="footer-link">
                تسجيل الدخول
              </Link>
            </p>
            <p className="footer-text">
              ليس لديك حساب؟{' '}
              <Link to="/register" className="footer-link">
                إنشاء حساب جديد
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;