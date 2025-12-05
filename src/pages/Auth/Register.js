import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff, FiX, FiUser, FiPhone, FiFile, FiArrowLeft, FiArrowRight, FiMail, FiLock, FiCheckCircle, FiBriefcase, FiBook, FiHome } from 'react-icons/fi';

function Register({ onClose, onSwitchToLogin }) {
  const [userTypeId, setUserTypeId] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState('');
  const [verificationError, setVerificationError] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    national_id: '',
    user_type_id: 1,
    // Type 3 fields
    agency_number: '',
    // Type 4 fields
    business_name: '', 
    commercial_register: '',
    commercial_file: null,
    // Type 5 fields
    license_number: '',
    license_file: null,
    // Type 6 fields
    auction_name: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  const { login } = useAuth();
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData({ ...formData, [name]: file });
      
      if (file) {
        setUploadedFiles({
          ...uploadedFiles,
          [name]: {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + ' كيلوبايت',
            type: file.type
          }
        });
      } else {
        setUploadedFiles({ ...uploadedFiles, [name]: null });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }

    setFieldErrors({ ...fieldErrors, [name]: '' });
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

  // Handle user type change
  const handleUserTypeChange = (typeId) => {
    typeId = parseInt(typeId);
    setUserTypeId(typeId);
    setCurrentStep(1);
    setFormData({
      full_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      national_id: '',
      user_type_id: typeId,
      agency_number: '',
      business_name: '',
      commercial_register: '',
      commercial_file: null,
      license_number: '',
      license_file: null,
      auction_name: '',
    });
    setFieldErrors({});
    setUploadedFiles({});
    setVerificationStep(false);
    setVerificationCode('');
    setUserId(null);
    setUserEmail('');
    setVerificationError('');
    setVerificationSuccess(false);
  };

  // Validation helpers
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isValidPhone = (phone) => /^(05)([0-9]{8})$/.test(phone);
  const isValidNationalId = (id) => /^[0-9]{10}$/.test(id);

  // Validate current step inputs
  const validateCurrentStep = () => {
    let errors = {};
    let isValid = true;

    if (currentStep === 1) {
      // Validate personal info
      if (!formData.full_name.trim()) {
        errors.full_name = "الرجاء إدخال الاسم الكامل";
        isValid = false;
      } else if (formData.full_name.trim().split(' ').length < 2) {
        errors.full_name = "الرجاء إدخال الاسم الكامل (الاسم الأول والاسم الأخير على الأقل)";
        isValid = false;
      }

      if (!formData.phone.trim()) {
        errors.phone = "الرجاء إدخال رقم الجوال";
        isValid = false;
      } else if (!isValidPhone(formData.phone.trim())) {
        errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام";
        isValid = false;
      }

      // National ID is required for types 2, 3, 4, 5, 6
      if ([2, 3, 4, 5, 6].includes(userTypeId)) {
        if (!formData.national_id.trim()) {
          errors.national_id = "الرجاء إدخال رقم الهوية";
          isValid = false;
        } else if (!isValidNationalId(formData.national_id.trim())) {
          errors.national_id = "رقم الهوية يجب أن يحتوي على 10 أرقام";
          isValid = false;
        }
      }

      // Agency number for type 3
      if (userTypeId === 3) {
        if (!formData.agency_number.trim()) {
          errors.agency_number = "الرجاء إدخال رقم الوكالة";
          isValid = false;
        }
      }
    } 
    else if (currentStep === 2) {
      // Validate business/license info based on user type
      if (userTypeId === 4) {
        if (!formData.business_name.trim()) {
          errors.business_name = "الرجاء إدخال اسم المنشأة";
          isValid = false;
        }
        if (!formData.commercial_register.trim()) {
          errors.commercial_register = "الرجاء إدخال رقم السجل التجاري";
          isValid = false;
        }
        if (!formData.commercial_file) {
          errors.commercial_file = "الرجاء رفع ملف السجل التجاري";
          isValid = false;
        }
      }
      else if (userTypeId === 5) {
        if (!formData.license_number.trim()) {
          errors.license_number = "الرجاء إدخال رقم الترخيص العقاري";
          isValid = false;
        }
        if (!formData.license_file) {
          errors.license_file = "الرجاء رفع ملف الترخيص العقاري";
          isValid = false;
        }
      }
      else if (userTypeId === 6) {
        if (!formData.auction_name.trim()) {
          errors.auction_name = "الرجاء إدخال اسم شركة المزادات";
          isValid = false;
        }
        if (!formData.commercial_register.trim()) {
          errors.commercial_register = "الرجاء إدخال رقم السجل التجاري";
          isValid = false;
        }
        if (!formData.commercial_file) {
          errors.commercial_file = "الرجاء رفع ملف السجل التجاري";
          isValid = false;
        }
        if (!formData.license_number.trim()) {
          errors.license_number = "الرجاء إدخال رقم الترخيص";
          isValid = false;
        }
        if (!formData.license_file) {
          errors.license_file = "الرجاء رفع ملف الترخيص";
          isValid = false;
        }
      }
    } 
    else if (currentStep === 3 || (currentStep === 2 && ![4, 5, 6].includes(userTypeId))) {
      // Validate login credentials
      if (!formData.email.trim()) {
        errors.email = "الرجاء إدخال البريد الإلكتروني";
        isValid = false;
      } else if (!isValidEmail(formData.email.trim())) {
        errors.email = "صيغة البريد الإلكتروني غير صحيحة";
        isValid = false;
      }

      if (!formData.password.trim()) {
        errors.password = "الرجاء إدخال كلمة المرور";
        isValid = false;
      } else if (formData.password.length < 6) {
        errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
        isValid = false;
      }

      if (!formData.password_confirmation.trim()) {
        errors.password_confirmation = "الرجاء تأكيد كلمة المرور";
        isValid = false;
      } else if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = "كلمات المرور غير متطابقة";
        isValid = false;
      }
    }

    setFieldErrors({...fieldErrors, ...errors});
    return isValid;
  };

  // Navigation functions
  const nextStep = () => validateCurrentStep() && setCurrentStep(currentStep + 1);
  const prevStep = () => setCurrentStep(currentStep - 1);
  const getMaxSteps = () => [4, 5, 6].includes(userTypeId) ? 3 : 2;

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (verificationStep) return;
    if (!validateCurrentStep()) return;
    
    const maxSteps = getMaxSteps();
    if (currentStep < maxSteps) {
      nextStep();
      return;
    }

    setLoading(true);

    try {
      // Prepare FormData
      const formDataToSend = new FormData();
      
      // Add common fields
      formDataToSend.append('full_name', formData.full_name.trim());
      formDataToSend.append('email', formData.email.trim());
      formDataToSend.append('password', formData.password);
      formDataToSend.append('password_confirmation', formData.password_confirmation);
      formDataToSend.append('phone', formData.phone.trim());
      formDataToSend.append('user_type_id', userTypeId.toString());
      
      // Add conditional fields
      if (formData.national_id && formData.national_id.trim()) {
        formDataToSend.append('national_id', formData.national_id.trim());
      }
      
      // Add type-specific fields
      if (userTypeId === 3 && formData.agency_number && formData.agency_number.trim()) {
        formDataToSend.append('agency_number', formData.agency_number.trim());
      }
      
      if (userTypeId === 4) {
        if (formData.business_name && formData.business_name.trim()) {
          formDataToSend.append('business_name', formData.business_name.trim());
        }
        if (formData.commercial_register && formData.commercial_register.trim()) {
          formDataToSend.append('commercial_register', formData.commercial_register.trim());
        }
        if (formData.commercial_file) {
          formDataToSend.append('commercial_file', formData.commercial_file);
        }
      }
      
      if (userTypeId === 5) {
        if (formData.license_number && formData.license_number.trim()) {
          formDataToSend.append('license_number', formData.license_number.trim());
        }
        if (formData.license_file) {
          formDataToSend.append('license_file', formData.license_file);
        }
      }
      
      if (userTypeId === 6) {
        if (formData.auction_name && formData.auction_name.trim()) {
          formDataToSend.append('auction_name', formData.auction_name.trim());
        }
        if (formData.commercial_register && formData.commercial_register.trim()) {
          formDataToSend.append('commercial_register', formData.commercial_register.trim());
        }
        if (formData.license_number && formData.license_number.trim()) {
          formDataToSend.append('license_number', formData.license_number.trim());
        }
        if (formData.commercial_file) {
          formDataToSend.append('commercial_file', formData.commercial_file);
        }
        if (formData.license_file) {
          formDataToSend.append('license_file', formData.license_file);
        }
      }

      // Debug: عرض البيانات المرسلة
      console.log('Sending FormData:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }

      const response = await authApi.register(formDataToSend);
      
      // Save verification info
      setUserId(response.user.id);
      setUserEmail(response.user.email);
      setVerificationStep(true);
      
      toast.success(response.message || 'تم إنشاء الحساب بنجاح! يرجى التحقق من البريد الإلكتروني.', {
        position: "top-center",
        autoClose: 5000
      });
      
    } catch (error) {
      console.error('Registration error:', error);
      
      // Handle specific errors
      const errorMsg = error.message.toLowerCase();
      if (errorMsg.includes('email') || errorMsg.includes('بريد')) {
        setFieldErrors({ ...fieldErrors, email: "البريد الإلكتروني مستخدم بالفعل" });
        setCurrentStep(getMaxSteps());
        toast.error("البريد الإلكتروني مستخدم بالفعل", { position: "top-center" });
      } else if (errorMsg.includes('phone') || errorMsg.includes('جوال')) {
        setFieldErrors({ ...fieldErrors, phone: "رقم الجوال مستخدم بالفعل" });
        setCurrentStep(1);
        toast.error("رقم الجوال مستخدم بالفعل", { position: "top-center" });
      } else if (errorMsg.includes('national_id') || errorMsg.includes('هوية')) {
        setFieldErrors({ ...fieldErrors, national_id: "رقم الهوية مستخدم بالفعل" });
        setCurrentStep(1);
        toast.error("رقم الهوية مستخدم بالفعل", { position: "top-center" });
      } else if (errorMsg.includes('agency_number') || errorMsg.includes('وكالة')) {
        setFieldErrors({ ...fieldErrors, agency_number: "رقم الوكالة مستخدم بالفعل" });
        setCurrentStep(1);
        toast.error("رقم الوكالة مستخدم بالفعل", { position: "top-center" });
      } else if (errorMsg.includes('commercial_register') || errorMsg.includes('سجل')) {
        setFieldErrors({ ...fieldErrors, commercial_register: "رقم السجل التجاري مستخدم بالفعل" });
        setCurrentStep(2);
        toast.error("رقم السجل التجاري مستخدم بالفعل", { position: "top-center" });
      } else if (errorMsg.includes('license_number') || errorMsg.includes('ترخيص')) {
        setFieldErrors({ ...fieldErrors, license_number: "رقم الترخيص مستخدم بالفعل" });
        setCurrentStep(2);
        toast.error("رقم الترخيص مستخدم بالفعل", { position: "top-center" });
      } else if (errorMsg.includes('full_name') || errorMsg.includes('اسم')) {
        setFieldErrors({ ...fieldErrors, full_name: "الرجاء إدخال الاسم الكامل" });
        setCurrentStep(1);
        toast.error("الرجاء إدخال الاسم الكامل", { position: "top-center" });
      } else {
        toast.error(error.message || "حدث خطأ في الاتصال بالخادم", { position: "top-center" });
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Email verification
  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!verificationCode.trim()) {
      setVerificationError('الرجاء إدخال رمز التحقق');
      return;
    }
    
    if (!/^\d{6}$/.test(verificationCode)) {
      setVerificationError('الرجاء إدخال رمز مكون من 6 أرقام');
      return;
    }
    
    setVerifyLoading(true);
    setVerificationError('');
    
    try {
      const response = await authApi.verifyEmail(userEmail, verificationCode);
      
      if (response.success) {
        setVerificationSuccess(true);
        toast.success('تم التحقق من البريد الإلكتروني بنجاح!', { position: "top-center" });
        
        try {
          const loginResponse = await authApi.login(userEmail, formData.password);
          if (loginResponse.token) {
            login(loginResponse);
            setTimeout(() => {
              toast.success('تم تسجيل الدخول بنجاح!', { position: "top-center" });
              onClose();
              navigate('/dashboard');
            }, 2000);
          }
        } catch (loginError) {
          toast.success('تم التحقق بنجاح! يمكنك الآن تسجيل الدخول', { position: "top-center" });
          setTimeout(() => onSwitchToLogin(), 3000);
        }
      } else {
        setVerificationError('رمز التحقق غير صحيح');
        toast.error(response.message || 'رمز التحقق غير صحيح', { position: "top-center" });
      }
    } catch (error) {
      setVerificationError(error.message || 'حدث خطأ أثناء التحقق');
      toast.error(error.message || 'حدث خطأ أثناء التحقق من البريد الإلكتروني', { position: "top-center" });
    } finally {
      setVerifyLoading(false);
    }
  };

  // UI Helpers
  const getStepTitle = () => {
    if (verificationStep) return verificationSuccess ? "تم التحقق بنجاح" : "التحقق من البريد الإلكتروني";
    if (currentStep === 1) return "البيانات الشخصية";
    if (currentStep === 2) {
      if (userTypeId === 4) return "بيانات المنشأة التجارية";
      if (userTypeId === 5) return "بيانات الترخيص العقاري";
      if (userTypeId === 6) return "بيانات شركة المزادات";
      return "بيانات الدخول";
    }
    return "بيانات الدخول";
  };

  const renderFileUploadField = (name, label, errorMsg) => {
    const uploadedFile = uploadedFiles[name];
    
    return (
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label}
        </label>
        <div className={`border-2 border-dashed rounded-xl p-3 text-center transition-all duration-200 ${
          fieldErrors[name] 
            ? 'border-red-300 bg-red-50' 
            : uploadedFile 
            ? 'border-green-300 bg-green-50' 
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}>
          <input 
            type="file" 
            name={name} 
            id={name}
            onChange={handleChange} 
            className="hidden" 
            disabled={loading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor={name} className="cursor-pointer">
            {uploadedFile ? (
              <div className="flex items-center justify-center gap-2">
                <FiFile className="w-6 h-6 text-green-600" />
                <div className="text-right">
                  <div className="font-medium text-sm text-green-800 truncate max-w-[150px]">{uploadedFile.name}</div>
                  <div className="text-xs text-green-600">{uploadedFile.size}</div>
                </div>
              </div>
            ) : (
              <div>
                <FiFile className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                <div className="text-sm text-gray-600">اختر ملفًا أو اسحبه هنا</div>
                <div className="text-xs text-gray-500 mt-1">الصيغ المسموح بها: jpg, jpeg, png, pdf</div>
              </div>
            )}
          </label>
        </div>
        {fieldErrors[name] && (
          <p className="mt-1 text-xs text-red-600">{errorMsg || fieldErrors[name]}</p>
        )}
      </div>
    );
  };
  
  // Render verification form
  const renderVerificationForm = () => {
    if (verificationSuccess) {
      return (
        <div className="space-y-4 text-center">
          <div className="flex items-center justify-center mb-3">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <FiCheckCircle className="text-green-600 text-2xl" />
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">تم التحقق بنجاح!</h3>
          <p className="text-sm text-gray-600 mt-1">
            تم التحقق من بريدك الإلكتروني بنجاح
            <br />
            <span className="font-medium text-gray-800">{userEmail}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            سيتم تسجيل دخولك تلقائياً...
          </p>
          <div className="mt-6">
            <button 
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-gradient-to-r from-green-600 to-green-700 text-white shadow hover:shadow-md transition-all duration-200"
            >
              إغلاق   
            </button>
          </div>
        </div>
      );
    }
    
    return (
      <form onSubmit={handleVerifyEmail} className="space-y-4">
        <div className="text-center mb-2">
          <div className="flex items-center justify-center mb-3">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <FiMail className="text-green-600 text-xl" />
            </div>
          </div>
          <h3 className="text-base font-semibold text-gray-900">تم إرسال رمز التحقق</h3>
          <p className="text-sm text-gray-600 mt-1">
            يرجى إدخال رمز التحقق المرسل إلى بريدك الإلكتروني
            <br />
            <span className="font-medium text-gray-800">{userEmail}</span>
          </p>
          <button 
            type="button"
            onClick={() => {
              setVerifyLoading(true);
              setTimeout(() => {
                toast.success('تم إرسال رمز تحقق جديد إلى بريدك الإلكتروني', { position: "top-center" });
                setVerificationCode('');
                setVerificationError('');
                setVerifyLoading(false);
              }, 1000);
            }}
            disabled={verifyLoading}
            className="text-xs text-blue-600 hover:text-blue-800 mt-1 hover:underline disabled:opacity-50"
          >
            لم تستلم الرمز؟ إعادة إرسال
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-xs font-medium text-gray-700 mb-1">
            رمز التحقق
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '').slice(0, 6);
              setVerificationCode(value);
              setVerificationError('');
            }}
            placeholder="000000"
            className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-center ${
              verificationError ? 'border-red-500 bg-red-50' : 'border-gray-300'
            } ${verifyLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            maxLength={6}
            disabled={verifyLoading}
            dir="ltr"
          />
          {verificationError && (
            <p className="mt-1 text-xs text-red-600 text-center">{verificationError}</p>
          )}
          <p className="text-xs text-gray-500 mt-1 text-center">
            أدخل الرمز المكون من 6 أرقام
          </p>
        </div>
        
        <div className="flex gap-3 mt-5">
          <button 
            type="button" 
            onClick={() => {
              setVerificationStep(false);
              setVerificationCode('');
              setVerificationError('');
            }}
            disabled={verifyLoading}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowRight className="w-3.5 h-3.5" />
            العودة
          </button>
          
          <button 
            type="submit"
            disabled={verifyLoading || verificationCode.length !== 6}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {verifyLoading ? (
              <span className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                جاري التحقق...
              </span>
            ) : (
              'تحقق'
            )}
          </button>
        </div>
      </form>
    );
  };

  // Progress indicator
  const renderProgress = () => {
    if (verificationStep) {
      return (
        <div className="mb-5">
          <h3 className="text-base font-semibold text-gray-900 text-center mb-3">{getStepTitle()}</h3>
        </div>
      );
    }
    
    const maxSteps = getMaxSteps();
    return (
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 text-center mb-3">{getStepTitle()}</h3>
        <div className="flex items-center justify-between mb-1">
          <div className="flex space-x-1 ml-1">
            {[...Array(maxSteps)].map((_, index) => (
              <div 
                key={index} 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  currentStep > index + 1 
                    ? 'bg-green-500' 
                    : currentStep === index + 1 
                    ? 'bg-blue-600' 
                    : 'bg-gray-300'
                }`}
              ></div>
            ))}
          </div>
          <span className="text-xs text-gray-600">الخطوة {currentStep} من {maxSteps}</span>
        </div>
      </div>
    );
  };

  // Render current step fields
  const renderCurrentStepFields = () => {
    if (verificationStep) return renderVerificationForm();
    
    return (
      <div className="space-y-4">
        {currentStep === 1 && (
          <>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">الاسم الكامل</label>
                <div className="relative">
                  <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="الاسم الكامل"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {fieldErrors.full_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">رقم الجوال</label>
                <div className="relative">
                  <FiPhone className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="05xxxxxxxx"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.phone ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>}
              </div>
            </div>

            {/* National ID for types 2, 3, 4, 5, 6 */}
            {[2, 3, 4, 5, 6].includes(userTypeId) && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">رقم الهوية</label>
                <div className="relative">
                  <FiBook className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="national_id"
                    placeholder="رقم الهوية (10 أرقام)"
                    value={formData.national_id}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.national_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    maxLength="10"
                  />
                </div>
                {fieldErrors.national_id && <p className="mt-1 text-xs text-red-600">{fieldErrors.national_id}</p>}
              </div>
            )}

            {/* Agency number for type 3 */}
            {userTypeId === 3 && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">رقم الوكالة</label>
                <div className="relative">
                  <FiBriefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="agency_number"
                    placeholder="رقم الوكالة الشرعية"
                    value={formData.agency_number}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.agency_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {fieldErrors.agency_number && <p className="mt-1 text-xs text-red-600">{fieldErrors.agency_number}</p>}
              </div>
            )}
          </>
        )}

        {currentStep === 2 && userTypeId === 4 && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">اسم المنشأة التجارية</label>
              <div className="relative">
                <FiBriefcase className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="business_name"
                  placeholder="اسم المنشأة التجارية"
                  value={formData.business_name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.business_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {fieldErrors.business_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.business_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">رقم السجل التجاري</label>
              <input
                type="text"
                name="commercial_register"
                placeholder="رقم السجل التجاري"
                value={formData.commercial_register}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.commercial_register ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {fieldErrors.commercial_register && <p className="mt-1 text-xs text-red-600">{fieldErrors.commercial_register}</p>}
            </div>

            {renderFileUploadField("commercial_file", "ملف السجل التجاري", "الرجاء رفع ملف السجل التجاري")}
          </>
        )}

        {currentStep === 2 && userTypeId === 5 && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">رقم الترخيص العقاري</label>
              <div className="relative">
                <FiFile className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="license_number"
                  placeholder="رقم الترخيص العقاري"
                  value={formData.license_number}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.license_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {fieldErrors.license_number && <p className="mt-1 text-xs text-red-600">{fieldErrors.license_number}</p>}
            </div>

            {renderFileUploadField("license_file", "ملف الترخيص العقاري", "الرجاء رفع ملف الترخيص العقاري")}
          </>
        )}

        {currentStep === 2 && userTypeId === 6 && (
          <>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">اسم شركة المزادات</label>
              <div className="relative">
                <FiHome className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="auction_name"
                  placeholder="اسم شركة المزادات"
                  value={formData.auction_name}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.auction_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {fieldErrors.auction_name && <p className="mt-1 text-xs text-red-600">{fieldErrors.auction_name}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">رقم السجل التجاري</label>
              <input
                type="text"
                name="commercial_register"
                placeholder="رقم السجل التجاري"
                value={formData.commercial_register}
                onChange={handleChange}
                disabled={loading}
                className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  fieldErrors.commercial_register ? 'border-red-500 bg-red-50' : 'border-gray-300'
                } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {fieldErrors.commercial_register && <p className="mt-1 text-xs text-red-600">{fieldErrors.commercial_register}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">رقم الترخيص</label>
              <div className="relative">
                <FiFile className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="text"
                  name="license_number"
                  placeholder="رقم الترخيص"
                  value={formData.license_number}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.license_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
              {fieldErrors.license_number && <p className="mt-1 text-xs text-red-600">{fieldErrors.license_number}</p>}
            </div>

            {renderFileUploadField("commercial_file", "ملف السجل التجاري", "الرجاء رفع ملف السجل التجاري")}
            {renderFileUploadField("license_file", "ملف الترخيص", "الرجاء رفع ملف الترخيص")}
          </>
        )}

        {(currentStep === 3 || (currentStep === 2 && ![4, 5, 6].includes(userTypeId))) && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
              <div className="relative">
                <FiMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="email"
                  name="email"
                  placeholder="example@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dir="ltr"
                />
              </div>
              {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={loading}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <FiLock className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="password_confirmation"
                  placeholder="••••••••"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.password_confirmation ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={toggleConfirmPasswordVisibility}
                  disabled={loading}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showConfirmPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {fieldErrors.password_confirmation && <p className="mt-1 text-xs text-red-600">{fieldErrors.password_confirmation}</p>}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Navigation buttons
  const renderNavigationButtons = () => {
    if (verificationStep) return null;
    
    const maxSteps = getMaxSteps();
    return (
      <div className="flex gap-3 mt-5">
        {currentStep > 1 && (
          <button 
            type="button" 
            onClick={prevStep}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-1 py-2 px-3 border border-gray-300 text-sm text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiArrowRight className="w-3.5 h-3.5" />
            السابق
          </button>
        )}
        
        <button 
          type="submit"
          disabled={loading}
          className={`flex-1 flex items-center justify-center gap-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
            currentStep === maxSteps 
              ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow hover:shadow-md transform hover:-translate-y-0.5'
              : 'bg-gray-800 text-white hover:bg-gray-900'
          } disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
        >
          {loading ? (
            <span className="flex items-center gap-1">
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              جاري التحميل...
            </span>
          ) : (
            <>
              {currentStep === maxSteps ? 'إنشاء الحساب' : 'التالي'}
              {currentStep !== maxSteps && <FiArrowLeft className="w-3.5 h-3.5" />}
            </>
          )}
        </button>
      </div>
    );
  };

  // Main component
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-3"
      onClick={e => e.target === e.currentTarget && onClose && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-end p-2 sticky top-0 bg-white border-b border-gray-100">
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <FiX size={18} className="text-gray-600" />
          </button>
        </div>

        <div className="px-4 pb-4">
          {/* Logo */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">إبدأ رحلتك العقارية معنا</p>
          </div>

          {/* Tabs */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4 text-sm">
            <button 
              onClick={onSwitchToLogin}
              className="flex-1 py-2 px-3 text-gray-600 font-medium rounded-md hover:text-gray-900 transition-all duration-200"
            >
              تسجيل الدخول
            </button>
            <button className="flex-1 py-2 px-3 bg-white text-gray-900 font-medium rounded-md shadow-sm transition-all duration-200">
              حساب جديد
            </button>
          </div>

          {/* User Type Selection */}
          {!verificationStep && !verificationSuccess && (
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-700 mb-1">نوع الحساب</label>
              <select 
                value={userTypeId} 
                onChange={(e) => handleUserTypeChange(e.target.value)}
                disabled={loading || verificationSuccess}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value={1}>مستخدم عادي</option>
                <option value={2}>مالك أرض</option>
                <option value={3}>وكيل شرعي</option>
                <option value={4}>منشأة تجارية</option>
                <option value={5}>وسيط عقاري</option>
                <option value={6}>شركة مزادات</option>
              </select>
            </div>
          )}
          
          {/* Progress Indicator */}
          {renderProgress()}

          {/* Form */}
          {verificationStep ? renderVerificationForm() : (
            <form onSubmit={handleSubmit}>
              {renderCurrentStepFields()}
              {renderNavigationButtons()}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;