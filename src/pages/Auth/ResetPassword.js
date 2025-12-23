import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';
import Icons from '../../icons/index';

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
    <span className={`text-sm ${isValid ? 'text-green-600' : 'text-red-600'}`}>
      {isValid ? <Icons.FiCheck
 /> : '•'}
    </span>
  );

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50 relative overflow-hidden rtl">
        <div className="absolute inset-0 z-1">
          <div className="absolute inset-0 bg-gradient-radial from-blue-100/30 via-transparent to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-radial from-yellow-100/30 via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-slide-up">
            <div className="text-center mb-6">
              <div className="mb-4">
                <img
                  src="/images/logo2.webp"
                  alt="منصة الاراضي السعودية"
                  className="max-w-40 h-auto max-h-16 mx-auto object-contain"
                />
              </div>
              <p className="text-gray-600 font-light mb-3">تمت العملية بنجاح</p>
              <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto"></div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-center mb-6">
              <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-4 animate-bounce-in">
                <Icons.FiCheck
 />
              </div>
              <h3 className="text-blue-600 text-xl font-bold mb-3">تم إعادة التعيين!</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                تم إعادة تعيين كلمة المرور بنجاح. يمكنك الآن استخدام كلمة المرور الجديدة لتسجيل الدخول.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const getStrengthBarWidth = () => {
    switch(passwordStrength.class) {
      case 'weak': return '33%';
      case 'medium': return '66%';
      case 'strong': return '100%';
      default: return '0%';
    }
  };

  const getStrengthColor = () => {
    switch(passwordStrength.class) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  const getTextColor = () => {
    switch(passwordStrength.class) {
      case 'weak': return 'text-red-600';
      case 'medium': return 'text-yellow-600';
      case 'strong': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-gray-50 relative overflow-hidden rtl">
      <div className="absolute inset-0 z-1">
        <div className="absolute inset-0 bg-gradient-radial from-blue-100/30 via-transparent to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-radial from-yellow-100/30 via-transparent to-transparent"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 animate-slide-up">
          <div className="text-center mb-6">
            <div className="mb-4">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="max-w-40 h-auto max-h-16 mx-auto object-contain"
              />
            </div>
            <p className="text-gray-600 font-light mb-3">تعيين كلمة مرور جديدة</p>
            <div className="w-12 h-1 bg-yellow-500 rounded-full mx-auto"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-blue-600 font-semibold text-sm mb-2">
                كلمة المرور الجديدة
              </label>
              <div className="relative">
                <Icons.FiLock
 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="أدخل كلمة المرور الجديدة"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 ${
                    fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? <Icons.FiEyeOff
 className="text-lg" /> : <Icons.FiEye
 className="text-lg" />}
                </button>
              </div>

              {formData.password && (
                <div className="mt-3">
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                      style={{ width: getStrengthBarWidth() }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600 mt-1 text-right">
                    قوة كلمة المرور: <span className={`font-semibold ${getTextColor()}`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                </div>
              )}

              {formData.password && (
                <ul className="mt-3 space-y-1">
                  {[
                    { text: '8 أحرف على الأقل', isValid: formData.password.length >= 8 },
                    { text: 'حرف كبير (A-Z)', isValid: /[A-Z]/.test(formData.password) },
                    { text: 'حرف صغير (a-z)', isValid: /[a-z]/.test(formData.password) },
                    { text: 'رقم واحد على الأقل', isValid: /\d/.test(formData.password) }
                  ].map((req, index) => (
                    <li 
                      key={index}
                      className={`flex items-center gap-2 text-xs ${
                        req.isValid ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {getRequirementIcon(req.isValid)}
                      {req.text}
                    </li>
                  ))}
                </ul>
              )}

              {fieldErrors.password && (
                <p className="text-red-600 text-xs mt-1 mr-1">{fieldErrors.password}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-blue-600 font-semibold text-sm mb-2">
                تأكيد كلمة المرور
              </label>
              <div className="relative">
                <Icons.FiLock
 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className={`w-full px-4 py-3 pl-12 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 ${
                    fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-blue-600 p-1 rounded transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? <Icons.FiEyeOff
 className="text-lg" /> : <Icons.FiEye
 className="text-lg" />}
                </button>
              </div>

              {fieldErrors.confirmPassword && (
                <p className="text-red-600 text-xs mt-1 mr-1">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {fieldErrors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm text-center">
                {fieldErrors.submit}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جاري إعادة التعيين...
                </>
              ) : (
                'إعادة تعيين كلمة المرور'
              )}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes bounce-in {
          0% {
            opacity: 0;
            transform: scale(0.3);
          }
          50% {
            opacity: 1;
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }
        
        .animate-bounce-in {
          animation: bounce-in 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}

export default ResetPassword;