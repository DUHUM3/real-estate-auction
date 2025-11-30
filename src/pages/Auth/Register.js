import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff, FiX, FiUser, FiPhone, FiFile, FiArrowLeft, FiArrowRight, FiMail, FiLock } from 'react-icons/fi';

function Register({ onClose, onSwitchToLogin }) {
  const [userTypeId, setUserTypeId] = useState(1);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    national_id: '',
    agency_number: '',
    entity_name: '',
    commercial_register: '',
    license_number: '',
    commercial_register_file: null,
    license_file: null
  });

  const [fieldErrors, setFieldErrors] = useState({
    full_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    phone: '',
    national_id: '',
    agency_number: '',
    entity_name: '',
    commercial_register: '',
    license_number: '',
    commercial_register_file: '',
    license_file: ''
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({
    commercial_register_file: null,
    license_file: null
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      const file = files[0];
      setFormData({
        ...formData,
        [name]: file
      });
      
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
        setUploadedFiles({
          ...uploadedFiles,
          [name]: null
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }

    setFieldErrors({
      ...fieldErrors,
      [name]: ''
    });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleUserTypeChange = (typeId) => {
    setUserTypeId(parseInt(typeId));
    setCurrentStep(1);
    setFormData({
      full_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      national_id: '',
      agency_number: '',
      entity_name: '',
      commercial_register: '',
      license_number: '',
      commercial_register_file: null,
      license_file: null
    });

    setFieldErrors({
      full_name: '',
      email: '',
      password: '',
      password_confirmation: '',
      phone: '',
      national_id: '',
      agency_number: '',
      entity_name: '',
      commercial_register: '',
      license_number: '',
      commercial_register_file: '',
      license_file: ''
    });
    
    setUploadedFiles({
      commercial_register_file: null,
      license_file: null
    });
  };

  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const isValidPhone = (phone) => {
    const regex = /^(05)([0-9]{8})$/;
    return regex.test(phone);
  };

  const isValidNationalId = (nationalId) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(nationalId);
  };

  const validateCurrentStep = () => {
    let errors = {};
    let isValid = true;

    if (currentStep === 1) {
      if (!formData.full_name.trim()) {
        errors.full_name = "الرجاء إدخال الاسم الثلاثي";
        isValid = false;
      } else if (formData.full_name.trim().split(' ').length < 2) {
        errors.full_name = "الرجاء إدخال الاسم الثلاثي كاملاً";
        isValid = false;
      }

      if (!formData.phone.trim()) {
        errors.phone = "الرجاء إدخال رقم الجوال";
        isValid = false;
      } else if (!isValidPhone(formData.phone.trim())) {
        errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام";
        isValid = false;
      }

      if (userTypeId === 2 || userTypeId === 3 || userTypeId === 5 || userTypeId === 6) {
        if (!formData.national_id.trim()) {
          errors.national_id = "الرجاء إدخال رقم الهوية";
          isValid = false;
        } else if (!isValidNationalId(formData.national_id.trim())) {
          errors.national_id = "رقم الهوية يجب أن يحتوي على 10 أرقام";
          isValid = false;
        }
      }

      if (userTypeId === 3) {
        if (!formData.agency_number.trim()) {
          errors.agency_number = "الرجاء إدخال رقم الوكالة الشرعية";
          isValid = false;
        }
      }
    } 
    else if (currentStep === 2) {
      if (userTypeId === 4 || userTypeId === 6) {
        if (!formData.entity_name.trim()) {
          errors.entity_name = "الرجاء إدخال اسم المنشأة";
          isValid = false;
        }
        if (!formData.commercial_register.trim()) {
          errors.commercial_register = "الرجاء إدخال رقم السجل التجاري";
          isValid = false;
        }
      }

      if (userTypeId === 5) {
        if (!formData.license_number.trim()) {
          errors.license_number = "الرجاء إدخال رقم الترخيص العقاري";
          isValid = false;
        }
      }

      if (userTypeId === 6) {
        if (!formData.license_number.trim()) {
          errors.license_number = "الرجاء إدخال رقم ترخيص المزادات";
          isValid = false;
        }
        if (!formData.commercial_register_file) {
          errors.commercial_register_file = "الرجاء رفع ملف السجل التجاري";
          isValid = false;
        }
        if (!formData.license_file) {
          errors.license_file = "الرجاء رفع ملف الترخيص";
          isValid = false;
        }
      }
    } 
    else if (currentStep === 3 || (currentStep === 2 && ![4, 5, 6].includes(userTypeId))) {
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

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const validateAllFields = () => {
    let errors = {};

    if (!formData.full_name.trim()) {
      errors.full_name = "الرجاء إدخال الاسم الثلاثي";
    } else if (formData.full_name.trim().split(' ').length < 2) {
      errors.full_name = "الرجاء إدخال الاسم الثلاثي كاملاً";
    }

    if (!formData.email.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    if (!formData.password.trim()) {
      errors.password = "الرجاء إدخال كلمة المرور";
    } else if (formData.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    if (!formData.password_confirmation.trim()) {
      errors.password_confirmation = "الرجاء تأكيد كلمة المرور";
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "كلمات المرور غير متطابقة";
    }

    if (!formData.phone.trim()) {
      errors.phone = "الرجاء إدخال رقم الجوال";
    } else if (!isValidPhone(formData.phone.trim())) {
      errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام";
    }

    if (userTypeId === 2 || userTypeId === 3 || userTypeId === 5 || userTypeId === 6) {
      if (!formData.national_id.trim()) {
        errors.national_id = "الرجاء إدخال رقم الهوية";
      } else if (!isValidNationalId(formData.national_id.trim())) {
        errors.national_id = "رقم الهوية يجب أن يحتوي على 10 أرقام";
      }
    }

    if (userTypeId === 3) {
      if (!formData.agency_number.trim()) {
        errors.agency_number = "الرجاء إدخال رقم الوكالة الشرعية";
      }
    }

    if (userTypeId === 4 || userTypeId === 6) {
      if (!formData.entity_name.trim()) {
        errors.entity_name = "الرجاء إدخال اسم المنشأة";
      }
      if (!formData.commercial_register.trim()) {
        errors.commercial_register = "الرجاء إدخال رقم السجل التجاري";
      }
    }

    if (userTypeId === 5) {
      if (!formData.license_number.trim()) {
        errors.license_number = "الرجاء إدخال رقم الترخيص العقاري";
      }
    }

    if (userTypeId === 6) {
      if (!formData.license_number.trim()) {
        errors.license_number = "الرجاء إدخال رقم ترخيص المزادات";
      }
      if (!formData.commercial_register_file) {
        errors.commercial_register_file = "الرجاء رفع ملف السجل التجاري";
      }
      if (!formData.license_file) {
        errors.license_file = "الرجاء رفع ملف الترخيص";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateCurrentStep()) return;
    
    const maxSteps = getMaxSteps();
    if (currentStep < maxSteps) {
      nextStep();
      return;
    }

    if (!validateAllFields()) return;

    setLoading(true);

    try {
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone,
        user_type_id: userTypeId
      };

      if (userTypeId === 2) {
        userData.national_id = formData.national_id;
      } else if (userTypeId === 3) {
        userData.national_id = formData.national_id;
        userData.agency_number = formData.agency_number;
      } else if (userTypeId === 4) {
        userData.entity_name = formData.entity_name;
        userData.commercial_register = formData.commercial_register;
        userData.national_id = formData.national_id;
      } else if (userTypeId === 5) {
        userData.national_id = formData.national_id;
        userData.license_number = formData.license_number;
      } else if (userTypeId === 6) {
        userData.national_id = formData.national_id;
        userData.entity_name = formData.entity_name;
        userData.commercial_register = formData.commercial_register;
        userData.license_number = formData.license_number;
        userData.commercial_register_file = formData.commercial_register_file;
        userData.license_file = formData.license_file;
      }

      const response = await authApi.register(userData, userTypeId);

      const userDataResponse = {
        id: response.user.id,
        full_name: response.user.full_name,
        email: response.user.email,
        phone: response.user.phone,
        user_type: response.user.user_type,
        status: response.user.status,
        access_token: response.access_token,
        token_type: response.token_type,
        expires_at: response.expires_at
      };

      login(userDataResponse);
      toast.success('تم إنشاء الحساب بنجاح!');
      
      if (onClose) onClose();
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.message?.includes("email") || error.message?.includes("البريد الإلكتروني")) {
        setFieldErrors({
          ...fieldErrors,
          email: "البريد الإلكتروني مستخدم بالفعل"
        });
        setCurrentStep(getMaxSteps());
      } else if (error.message?.includes("phone") || error.message?.includes("الجوال")) {
        setFieldErrors({
          ...fieldErrors,
          phone: "رقم الجوال مستخدم بالفعل"
        });
        setCurrentStep(1);
      } else if (error.message?.includes("national_id") || error.message?.includes("الهوية")) {
        setFieldErrors({
          ...fieldErrors,
          national_id: "رقم الهوية مستخدم بالفعل"
        });
        setCurrentStep(1);
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

  const getMaxSteps = () => {
    if (userTypeId === 1) {
      return 2;
    } else if (userTypeId === 2 || userTypeId === 3) {
      return 2;
    } else if (userTypeId === 4 || userTypeId === 5 || userTypeId === 6) {
      return 3;
    }
    return 2;
  };

  const getStepTitle = () => {
    if (currentStep === 1) {
      return "البيانات الشخصية";
    } else if (currentStep === 2) {
      if (userTypeId === 4) return "بيانات المنشأة التجارية";
      else if (userTypeId === 5) return "بيانات الترخيص العقاري";
      else if (userTypeId === 6) return "بيانات الشركة والترخيص";
      else return "بيانات الدخول";
    } else if (currentStep === 3) {
      return "بيانات الدخول";
    }
    return "";
  };

  const renderProgress = () => {
    const maxSteps = getMaxSteps();
    return (
      <div className="mb-5">
        <h3 className="text-base font-semibold text-gray-900 text-center mb-3">
          {getStepTitle()}
        </h3>
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
          <span className="text-xs text-gray-600">
            الخطوة {currentStep} من {maxSteps}
          </span>
        </div>
      </div>
    );
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
                <div className="text-xs text-gray-500 mt-1">PDF, JPG, PNG (الحد الأقصى 5MB)</div>
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

  const renderCurrentStepFields = () => {
    const maxSteps = getMaxSteps();
    
    return (
      <div className="space-y-4">
        {/* Step 1: Personal Info */}
        {currentStep === 1 && (
          <>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  الاسم الثلاثي
                </label>
                <div className="relative">
                  <FiUser className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                  <input
                    type="text"
                    name="full_name"
                    placeholder="الاسم الثلاثي"
                    value={formData.full_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 pr-8 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.full_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                </div>
                {fieldErrors.full_name && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.full_name}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  رقم الجوال
                </label>
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
                {fieldErrors.phone && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.phone}</p>
                )}
              </div>
            </div>

            {(userTypeId === 2 || userTypeId === 3 || userTypeId === 5 || userTypeId === 6) && (
              <div className={userTypeId === 3 ? "grid grid-cols-1 gap-4" : ""}>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    رقم الهوية
                  </label>
                  <input
                    type="text"
                    name="national_id"
                    placeholder="رقم الهوية"
                    value={formData.national_id}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.national_id ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {fieldErrors.national_id && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.national_id}</p>
                  )}
                </div>

                {userTypeId === 3 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      رقم الوكالة الشرعية
                    </label>
                    <input
                      type="text"
                      name="agency_number"
                      placeholder="رقم الوكالة الشرعية"
                      value={formData.agency_number}
                      onChange={handleChange}
                      disabled={loading}
                      className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                        fieldErrors.agency_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                      } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {fieldErrors.agency_number && (
                      <p className="mt-1 text-xs text-red-600">{fieldErrors.agency_number}</p>
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Step 2: Entity/License Info */}
        {currentStep === 2 && (userTypeId === 4 || userTypeId === 5 || userTypeId === 6) && (
          <>
            {(userTypeId === 4 || userTypeId === 6) && (
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    اسم المنشأة
                  </label>
                  <input
                    type="text"
                    name="entity_name"
                    placeholder="اسم المنشأة"
                    value={formData.entity_name}
                    onChange={handleChange}
                    disabled={loading}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      fieldErrors.entity_name ? 'border-red-500 bg-red-50' : 'border-gray-300'
                    } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  />
                  {fieldErrors.entity_name && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.entity_name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    رقم السجل التجاري
                  </label>
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
                  {fieldErrors.commercial_register && (
                    <p className="mt-1 text-xs text-red-600">{fieldErrors.commercial_register}</p>
                  )}
                </div>
              </div>
            )}

            {(userTypeId === 5 || userTypeId === 6) && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  {userTypeId === 5 ? "رقم الترخيص العقاري" : "رقم ترخيص المزادات"}
                </label>
                <input
                  type="text"
                  name="license_number"
                  placeholder={userTypeId === 5 ? "رقم الترخيص العقاري" : "رقم ترخيص المزادات"}
                  value={formData.license_number}
                  onChange={handleChange}
                  disabled={loading}
                  className={`w-full px-3 py-2 text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    fieldErrors.license_number ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
                {fieldErrors.license_number && (
                  <p className="mt-1 text-xs text-red-600">{fieldErrors.license_number}</p>
                )}
              </div>
            )}

            {userTypeId === 6 && (
              <div className="grid grid-cols-1 gap-3">
                {renderFileUploadField("commercial_register_file", "ملف السجل التجاري", "الرجاء رفع ملف السجل التجاري")}
                {renderFileUploadField("license_file", "ملف ترخيص المزادات", "الرجاء رفع ملف الترخيص")}
              </div>
            )}
          </>
        )}

        {/* Step 3 or Step 2 for regular users: Login Info */}
        {(currentStep === 3 || (currentStep === 2 && ![4, 5, 6].includes(userTypeId))) && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                البريد الإلكتروني
              </label>
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
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                كلمة المرور
              </label>
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
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                تأكيد كلمة المرور
              </label>
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
              {fieldErrors.password_confirmation && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.password_confirmation}</p>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderNavigationButtons = () => {
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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center p-3"
      onClick={handleOverlayClick}
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
          
          {/* Hero Section */}
          <div className="text-center mb-4">
            <div className="flex justify-center mb-4">
              <img
                src="/images/logo2.webp"
                alt="منصة الاراضي السعودية"
                className="h-16 w-auto"
              />
            </div>
            <p className="text-gray-600 text-sm">
              إبدأ رحلتك العقارية معنا
            </p>
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
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              نوع الحساب
            </label>
            <select 
              value={userTypeId} 
              onChange={(e) => handleUserTypeChange(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            >
              <option value={1}>مستخدم عادي</option>
              <option value={2}>مالك أرض</option>
              <option value={3}>وكيل شرعي</option>
              <option value={4}>منشأة تجارية</option>
              <option value={5}>وسيط عقاري</option>
              <option value={6}>شركة مزادات عقارية</option>
            </select>
          </div>
          
          {/* Progress Indicator */}
          {renderProgress()}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            {renderCurrentStepFields()}
            {renderNavigationButtons()}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;