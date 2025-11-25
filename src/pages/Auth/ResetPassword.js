import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import '../../styles/AuthModal.css';

import toast from 'react-hot-toast';

import { FiLock, FiArrowRight, FiHome, FiLogIn, FiEye, FiEyeOff, FiCheck } from 'react-icons/fi';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: 'ضعيفة',
    class: 'weak'
  });

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const checkPasswordStrength = (password) => {
    let score = 0;
    const requirements = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    score = Object.values(requirements).filter(Boolean).length;

    let text = 'ضعيفة';
    let strengthClass = 'weak';

    if (score >= 4) {
      text = 'قوية';
      strengthClass = 'strong';
    } else if (score >= 3) {
      text = 'متوسطة';
      strengthClass = 'medium';
    }

    return { score, text, class: strengthClass, requirements };
  };

  const validateFields = () => {
    let errors = {};
    const strength = checkPasswordStrength(formData.password);

    if (!formData.password) {
      errors.password = "كلمة المرور الجديدة مطلوبة";
    } else if (formData.password.length < 8) {
      errors.password = "كلمة المرور يجب أن تكون 8 أحرف على الأقل";
    } else if (strength.score < 3) {
      errors.password = "كلمة المرور ضعيفة جداً";
    }

    if (!formData.confirmPassword) {
      errors.confirmPassword = "تأكيد كلمة المرور مطلوب";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "كلمتا المرور غير متطابقتين";
    }

    if (!token) {
      errors.submit = "رابط إعادة التعيين غير صالح";
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setFormData(prev => ({ ...prev, password: newPassword }));
    
    const strength = checkPasswordStrength(newPassword);
    setPasswordStrength(strength);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFields()) return;

    setLoading(true);
    
    try {
      // محاكاة إرسال الطلب إلى API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // في الواقع، هنا ستقوم بالاتصال بالـ API الحقيقي
      // const data = await authApi.resetPassword({
      //   token,
      //   email,
      //   password: formData.password,
      //   password_confirmation: formData.confirmPassword
      // });
      
      setSuccess(true);
      toast.success('تم إعادة تعيين كلمة المرور بنجاح');
      
    } catch (error) {
      if (error.message?.includes("token") || error.message?.includes("expired")) {
        setFieldErrors({ submit: "رابط إعادة التعيين غير صالح أو منتهي الصلاحية" });
      } else {
        toast.error(error.message || "حدث خطأ في الاتصال بالخادم");
      }
    } finally {
      setLoading(false);
    }
  };

  const getRequirementIcon = (isValid) => (
    <span className={`requirement-icon ${isValid ? 'valid' : 'invalid'}`}>
      {isValid ? <FiCheck /> : '•'}
    </span>
  );

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
              <p className="auth-subtitle">تمت العملية بنجاح</p>
              <div className="auth-divider"></div>
            </div>

            <div className="success-state">
              <div className="success-icon-large">
                <FiCheck />
              </div>
              <h3 className="success-title">تم إعادة التعيين!</h3>
              <p className="success-description">
                تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.
              </p>
            </div>

            {/* <div className="auth-page-actions">
              <Link to="/login" className="btn-auth-primary">
                تسجيل الدخول
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
            <p className="auth-subtitle">تعيين كلمة مرور جديدة</p>
            <div className="auth-divider"></div>
          </div>

          {/* <div className="auth-tabs">
            <Link to="/login" className="auth-tab">
              تسجيل الدخول
            </Link>
            <button className="auth-tab active">
              إعادة التعيين
            </button>
          </div> */}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group password-group">
              <label className="form-label">كلمة المرور الجديدة</label>
              <div className="password-input-container">
                <FiLock className="input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`form-input password-input ${fieldErrors.password ? "input-error" : ""}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {formData.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div className={`strength-fill ${passwordStrength.class}`}></div>
                  </div>
                  <div className="strength-text">
                    قوة كلمة المرور: <span className={passwordStrength.class}>{passwordStrength.text}</span>
                  </div>
                </div>
              )}

              {formData.password && (
                <ul className="requirements-list">
                  <li className={`requirement-item ${formData.password.length >= 8 ? 'valid' : 'invalid'}`}>
                    {getRequirementIcon(formData.password.length >= 8)}
                    8 أحرف على الأقل
                  </li>
                  <li className={`requirement-item ${/[A-Z]/.test(formData.password) ? 'valid' : 'invalid'}`}>
                    {getRequirementIcon(/[A-Z]/.test(formData.password))}
                    حرف كبير (A-Z)
                  </li>
                  <li className={`requirement-item ${/[a-z]/.test(formData.password) ? 'valid' : 'invalid'}`}>
                    {getRequirementIcon(/[a-z]/.test(formData.password))}
                    حرف صغير (a-z)
                  </li>
                  <li className={`requirement-item ${/\d/.test(formData.password) ? 'valid' : 'invalid'}`}>
                    {getRequirementIcon(/\d/.test(formData.password))}
                    رقم واحد على الأقل
                  </li>
                </ul>
              )}

              {fieldErrors.password && (
                <p className="field-error-text">{fieldErrors.password}</p>
              )}
            </div>

            <div className="form-group password-group">
              <label className="form-label">تأكيد كلمة المرور</label>
              <div className="password-input-container">
                <FiLock className="input-icon" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`form-input password-input ${fieldErrors.confirmPassword ? "input-error" : ""}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <p className="field-error-text">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {fieldErrors.submit && (
              <div className="error-message">
                {fieldErrors.submit}
              </div>
            )}

            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
            >
              {loading ? "جاري إعادة التعيين..." : "إعادة تعيين كلمة المرور"}
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

export default ResetPassword;