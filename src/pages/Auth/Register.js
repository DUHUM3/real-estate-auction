import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import '../../styles/AuthModal.css';

import toast from 'react-hot-toast';

import { FiEye, FiEyeOff, FiX, FiUser, FiPhone, FiFile, FiArrowLeft, FiArrowRight } from 'react-icons/fi';

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
      
      // حفظ معلومات الملف المرفوع
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
    // إعادة تعيين البيانات والأخطاء عند تغيير نوع المستخدم
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

  // دالة التحقق من الإيميل
  const isValidEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // دالة التحقق من رقم الجوال السعودي
  const isValidPhone = (phone) => {
    const regex = /^(05)([0-9]{8})$/;
    return regex.test(phone);
  };

  // دالة التحقق من رقم الهوية
  const isValidNationalId = (nationalId) => {
    const regex = /^[0-9]{10}$/;
    return regex.test(nationalId);
  };

  const validateCurrentStep = () => {
    let errors = {};
    let isValid = true;

    if (currentStep === 1) {
      // التحقق من البيانات الشخصية
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

      // التحقق من الحقول الإضافية بناءً على نوع المستخدم
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
      // التحقق من بيانات المنشأة والتراخيص
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
      // التحقق من بيانات تسجيل الدخول
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

    // فحص الاسم الكامل
    if (!formData.full_name.trim()) {
      errors.full_name = "الرجاء إدخال الاسم الثلاثي";
    } else if (formData.full_name.trim().split(' ').length < 2) {
      errors.full_name = "الرجاء إدخال الاسم الثلاثي كاملاً";
    }

    // فحص الإيميل
    if (!formData.email.trim()) {
      errors.email = "الرجاء إدخال البريد الإلكتروني";
    } else if (!isValidEmail(formData.email.trim())) {
      errors.email = "صيغة البريد الإلكتروني غير صحيحة";
    }

    // فحص كلمة المرور
    if (!formData.password.trim()) {
      errors.password = "الرجاء إدخال كلمة المرور";
    } else if (formData.password.length < 6) {
      errors.password = "كلمة المرور يجب أن تكون 6 أحرف على الأقل";
    }

    // فحص تأكيد كلمة المرور
    if (!formData.password_confirmation.trim()) {
      errors.password_confirmation = "الرجاء تأكيد كلمة المرور";
    } else if (formData.password !== formData.password_confirmation) {
      errors.password_confirmation = "كلمات المرور غير متطابقة";
    }

    // فحص رقم الجوال
    if (!formData.phone.trim()) {
      errors.phone = "الرجاء إدخال رقم الجوال";
    } else if (!isValidPhone(formData.phone.trim())) {
      errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام";
    }

    // التحقق من الحقول الإضافية بناءً على نوع المستخدم
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
    
    // إذا كانت هناك خطوات أخرى، انتقل إليها بدلاً من إرسال النموذج
    const maxSteps = getMaxSteps();
    if (currentStep < maxSteps) {
      nextStep();
      return;
    }

    // التحقق من جميع الحقول قبل الإرسال
    if (!validateAllFields()) return;

    setLoading(true);

    try {
      // إعداد البيانات بناءً على نوع المستخدم
      const userData = {
        full_name: formData.full_name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.password_confirmation,
        phone: formData.phone,
        user_type_id: userTypeId
      };

      // إضافة الحقول الإضافية بناءً على نوع المستخدم
      if (userTypeId === 2) { // مالك أرض
        userData.national_id = formData.national_id;
      } else if (userTypeId === 3) { // وكيل شرعي
        userData.national_id = formData.national_id;
        userData.agency_number = formData.agency_number;
      } else if (userTypeId === 4) { // منشأة تجارية
        userData.entity_name = formData.entity_name;
        userData.commercial_register = formData.commercial_register;
        userData.national_id = formData.national_id;
      } else if (userTypeId === 5) { // وسيط عقاري
        userData.national_id = formData.national_id;
        userData.license_number = formData.license_number;
      } else if (userTypeId === 6) { // شركة مزادات
        userData.national_id = formData.national_id;
        userData.entity_name = formData.entity_name;
        userData.commercial_register = formData.commercial_register;
        userData.license_number = formData.license_number;
        userData.commercial_register_file = formData.commercial_register_file;
        userData.license_file = formData.license_file;
      }

      // استخدام الـ API المنفصل
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
      
      // معالجة أخطاء التسجيل المختلفة
      if (error.message?.includes("email") || error.message?.includes("البريد الإلكتروني")) {
        setFieldErrors({
          ...fieldErrors,
          email: "البريد الإلكتروني مستخدم بالفعل"
        });
        // الرجوع إلى الخطوة التي تحتوي على حقل البريد الإلكتروني
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

  // تحديد عدد الخطوات بناءً على نوع المستخدم
  const getMaxSteps = () => {
    if (userTypeId === 1) {
      return 2; // المستخدم العادي: بيانات شخصية + بيانات الدخول
    } else if (userTypeId === 2 || userTypeId === 3) {
      return 2; // مالك الأرض والوكيل الشرعي: بيانات شخصية + بيانات الدخول
    } else if (userTypeId === 4 || userTypeId === 5 || userTypeId === 6) {
      return 3; // المنشأة التجارية والوسيط العقاري وشركة المزادات: بيانات شخصية + بيانات منشأة + بيانات دخول
    }
    return 2;
  };

  // دالة لعرض عنوان الخطوة الحالية
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

  // دالة لعرض التقدم في الخطوات
  const renderProgress = () => {
    const maxSteps = getMaxSteps();
    return (
      <div className="registration-progress">
        <div className="progress-title">{getStepTitle()}</div>
        <div className="progress-steps">
          <div className="step-dots">
            {[...Array(maxSteps)].map((_, index) => (
              <div 
                key={index} 
                className={`step-dot ${currentStep > index ? 'completed' : ''} ${currentStep === index + 1 ? 'active' : ''}`}
              ></div>
            ))}
          </div>
          <div className="step-counter">
            الخطوة {currentStep} من {maxSteps}
          </div>
        </div>
      </div>
    );
  };

  // دالة لتنظيم الحقول في صفوف كل حقلين
  const renderFieldRow = (fields) => {
    const rows = [];
    for (let i = 0; i < fields.length; i += 2) {
      const field1 = fields[i];
      const field2 = fields[i + 1];
      
      rows.push(
        <div key={i} className="form-row">
          <div className="form-group">
            {field1}
          </div>
          {field2 && (
            <div className="form-group">
              {field2}
            </div>
          )}
        </div>
      );
    }
    return rows;
  };

  // عرض حقل رفع الملفات بتصميم محسن
  const renderFileUploadField = (name, label, errorMsg) => {
    const uploadedFile = uploadedFiles[name];
    
    return (
      <div className="file-upload-field">
        <label className="form-label">{label}</label>
        <div className={`file-upload-container ${fieldErrors[name] ? "input-error" : ""} ${uploadedFile ? "has-file" : ""}`}>
          <input 
            type="file" 
            name={name} 
            id={name}
            onChange={handleChange} 
            className="file-input" 
            disabled={loading}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <label htmlFor={name} className="file-upload-label">
            {uploadedFile ? (
              <div className="file-info">
                <FiFile className="file-icon" />
                <div className="file-details">
                  <div className="file-name">{uploadedFile.name}</div>
                  <div className="file-size">{uploadedFile.size}</div>
                </div>
              </div>
            ) : (
              <div className="upload-placeholder">
                <FiFile className="file-icon" />
                <span>اختر ملفًا أو اسحبه هنا</span>
                <small>PDF, JPG, PNG (الحد الأقصى 5MB)</small>
              </div>
            )}
          </label>
        </div>
        {fieldErrors[name] && <p className="field-error-text">{errorMsg || fieldErrors[name]}</p>}
      </div>
    );
  };

  // الخطوة الأولى: البيانات الشخصية
  const renderPersonalInfoFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><div className="input-with-icon"><FiUser className="input-icon" /><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} className={`form-input ${fieldErrors.full_name ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.full_name && <p className="field-error-text">{fieldErrors.full_name}</p>}</>,
      <><label className="form-label">رقم الجوال</label><div className="input-with-icon"><FiPhone className="input-icon" /><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} className={`form-input ${fieldErrors.phone ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.phone && <p className="field-error-text">{fieldErrors.phone}</p>}</>
    ];
    
    // إضافة حقول إضافية بناءً على نوع المستخدم
    if (userTypeId === 2 || userTypeId === 3 || userTypeId === 5 || userTypeId === 6) {
      fields.push(
        <><label className="form-label">رقم الهوية</label><div className="input-with-icon"><input type="text" name="national_id" placeholder="رقم الهوية" value={formData.national_id} onChange={handleChange} className={`form-input ${fieldErrors.national_id ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.national_id && <p className="field-error-text">{fieldErrors.national_id}</p>}</>
      );
    }
    
    if (userTypeId === 3) {
      fields.push(
        <><label className="form-label">رقم الوكالة الشرعية</label><div className="input-with-icon"><input type="text" name="agency_number" placeholder="رقم الوكالة الشرعية" value={formData.agency_number} onChange={handleChange} className={`form-input ${fieldErrors.agency_number ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.agency_number && <p className="field-error-text">{fieldErrors.agency_number}</p>}</>
      );
    }
    
    return renderFieldRow(fields);
  };

  // الخطوة الثانية: بيانات المنشأة والتراخيص
  const renderEntityFields = () => {
    const fields = [];
    
    if (userTypeId === 4 || userTypeId === 6) {
      fields.push(
        <><label className="form-label">اسم المنشأة</label><div className="input-with-icon"><input type="text" name="entity_name" placeholder="اسم المنشأة" value={formData.entity_name} onChange={handleChange} className={`form-input ${fieldErrors.entity_name ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.entity_name && <p className="field-error-text">{fieldErrors.entity_name}</p>}</>,
        <><label className="form-label">رقم السجل التجاري</label><div className="input-with-icon"><input type="text" name="commercial_register" placeholder="رقم السجل التجاري" value={formData.commercial_register} onChange={handleChange} className={`form-input ${fieldErrors.commercial_register ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.commercial_register && <p className="field-error-text">{fieldErrors.commercial_register}</p>}</>
      );
    }
    
    if (userTypeId === 5 || userTypeId === 6) {
      fields.push(
        <><label className="form-label">{userTypeId === 5 ? "رقم الترخيص العقاري" : "رقم ترخيص المزادات"}</label><div className="input-with-icon"><input type="text" name="license_number" placeholder={userTypeId === 5 ? "رقم الترخيص العقاري" : "رقم ترخيص المزادات"} value={formData.license_number} onChange={handleChange} className={`form-input ${fieldErrors.license_number ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.license_number && <p className="field-error-text">{fieldErrors.license_number}</p>}</>
      );
    }
    
    // إضافة حقول رفع الملفات لشركات المزادات
    if (userTypeId === 6) {
      return (
        <>
          {renderFieldRow(fields)}
          <div className="form-row full-width">
            <div className="form-group">
              {renderFileUploadField("commercial_register_file", "ملف السجل التجاري", "الرجاء رفع ملف السجل التجاري")}
            </div>
            <div className="form-group">
              {renderFileUploadField("license_file", "ملف ترخيص المزادات", "الرجاء رفع ملف الترخيص")}
            </div>
          </div>
        </>
      );
    }
    
    return renderFieldRow(fields);
  };

  // الخطوة الثالثة (أو الثانية للمستخدمين العاديين): بيانات الدخول
  const renderLoginInfoFields = () => {
    const fields = [
      <><label className="form-label">البريد الإلكتروني</label><div className="input-with-icon"><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} className={`form-input ${fieldErrors.email ? "input-error" : ""}`} disabled={loading} /></div>{fieldErrors.email && <p className="field-error-text">{fieldErrors.email}</p>}</>,
      <><label className="form-label">كلمة المرور</label><div className="password-input-container"><input type={showPassword ? "text" : "password"} name="password" placeholder="........." value={formData.password} onChange={handleChange} className={`form-input password-input ${fieldErrors.password ? "input-error" : ""}`} disabled={loading} /><button type="button" className="password-toggle-btn" onClick={togglePasswordVisibility} disabled={loading}>{showPassword ? <FiEyeOff /> : <FiEye />}</button></div>{fieldErrors.password && <p className="field-error-text">{fieldErrors.password}</p>}</>,
      <><label className="form-label">تأكيد كلمة المرور</label><div className="password-input-container"><input type={showConfirmPassword ? "text" : "password"} name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} className={`form-input password-input ${fieldErrors.password_confirmation ? "input-error" : ""}`} disabled={loading} /><button type="button" className="password-toggle-btn" onClick={toggleConfirmPasswordVisibility} disabled={loading}>{showConfirmPassword ? <FiEyeOff /> : <FiEye />}</button></div>{fieldErrors.password_confirmation && <p className="field-error-text">{fieldErrors.password_confirmation}</p>}</>
    ];
    
    return renderFieldRow(fields);
  };

  // عرض الحقول بناءً على الخطوة الحالية
  const renderCurrentStepFields = () => {
    if (currentStep === 1) {
      return renderPersonalInfoFields();
    } else if (currentStep === 2) {
      if (userTypeId === 4 || userTypeId === 5 || userTypeId === 6) {
        return renderEntityFields();
      } else {
        return renderLoginInfoFields();
      }
    } else if (currentStep === 3) {
      return renderLoginInfoFields();
    }
    return null;
  };

  // أزرار التنقل بين الخطوات
  const renderNavigationButtons = () => {
    const maxSteps = getMaxSteps();
    return (
      <div className="form-navigation-buttons">
        {currentStep > 1 && (
          <button 
            type="button" 
            className="btn-navigation btn-prev" 
            onClick={prevStep}
            disabled={loading}
          >
            <FiArrowRight className="btn-icon" /> السابق
          </button>
        )}
        
        <button 
          type="submit" 
          className={`btn-navigation ${currentStep === maxSteps ? "btn-register-submit" : "btn-next"}`}
          disabled={loading}
        >
          {loading ? 'جاري التحميل...' : (currentStep === maxSteps ? 'إنشاء الحساب' : 'التالي')} {currentStep !== maxSteps && <FiArrowLeft className="btn-icon" />}
        </button>
      </div>
    );
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal register-modal">
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
                src="/images/logo2.webp" 
                alt="منصة الاراضي السعودية" 
                className="auth-logo"
              />
            </div>
            <p className="auth-subtitle">إبدأ رحلتك العقارية معنا</p>
            <div className="auth-divider"></div>
          </div>

          {/* خيارات التسجيل */}
          <div className="auth-options">
            <button 
              className="auth-option-btn" 
              onClick={onSwitchToLogin}
            >
              تسجيل الدخول
            </button>
            <button className="auth-option-btn active">
              حساب جديد
            </button>
          </div>

          {/* اختيار نوع المستخدم */}
          <div className="user-type-section">
            <label className="form-label">نوع الحساب</label>
            <select 
              value={userTypeId} 
              onChange={(e) => handleUserTypeChange(e.target.value)}
              className="form-input user-type-select"
              disabled={loading}
            >
              <option value={1}>مستخدم عادي</option>
              <option value={2}>مالك أرض</option>
              <option value={3}>وكيل شرعي</option>
              <option value={4}>منشأة تجارية</option>
              <option value={5}>وسيط عقاري</option>
              <option value={6}>شركة مزادات عقارية</option>
            </select>
          </div>
          
          {/* عرض مؤشر التقدم */}
          {renderProgress()}

          {/* نموذج التسجيل مع إمكانية التمرير */}
          <div className="form-scroll-container">
            <form onSubmit={handleSubmit} className="auth-form register-form">
              {renderCurrentStepFields()}
              {renderNavigationButtons()}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;