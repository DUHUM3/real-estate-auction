import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../api/authApi';
import '../../styles/AuthModal.css';
import { FiX } from 'react-icons/fi';

function Register({ onClose, onSwitchToLogin }) {
  const [userTypeId, setUserTypeId] = useState(1);
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleUserTypeChange = (typeId) => {
    setUserTypeId(parseInt(typeId));
    // Reset form when user type changes
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    // Check if passwords match
    if (formData.password !== formData.password_confirmation) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    // Prepare data based on user type
    const userData = {
      full_name: formData.full_name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      phone: formData.phone,
      user_type_id: userTypeId
    };

    // Add additional fields based on user type
    if (userTypeId === 2) { // Land owner
      userData.national_id = formData.national_id;
    } else if (userTypeId === 3) { // Legal agent
      userData.national_id = formData.national_id;
      userData.agency_number = formData.agency_number;
    } else if (userTypeId === 4) { // Commercial entity
      userData.entity_name = formData.entity_name;
      userData.commercial_register = formData.commercial_register;
      userData.national_id = formData.national_id;
    } else if (userTypeId === 5) { // Real estate broker
      userData.national_id = formData.national_id;
      userData.license_number = formData.license_number;
    } else if (userTypeId === 6) { // Auction company
      userData.national_id = formData.national_id;
      userData.entity_name = formData.entity_name;
      userData.commercial_register = formData.commercial_register;
      userData.license_number = formData.license_number;
      userData.commercial_register_file = formData.commercial_register_file;
      userData.license_file = formData.license_file;
    }

    try {
      // استخدام الـ API المنفصل
      const response = await authApi.register(userData, userTypeId);

      setSuccess('تم إنشاء الحساب بنجاح!');
      login(response.data); // Store user data in context
      navigate('/dashboard');
      if (onClose) onClose();
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'حدث خطأ أثناء التسجيل، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
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

  // المستخدم العادي - User Type 1
  const renderRegularUserFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  // مالك الأرض - User Type 2
  const renderLandOwnerFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="national_id" placeholder="رقم الهوية" value={formData.national_id} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  // الوكيل الشرعي - User Type 3
  const renderLegalAgentFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="national_id" placeholder="رقم الهوية" value={formData.national_id} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الوكالة الشرعية</label><input type="text" name="agency_number" placeholder="رقم الوكالة الشرعية" value={formData.agency_number} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  // المنشأة التجارية - User Type 4
  const renderCommercialEntityFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">اسم المنشأة</label><input type="text" name="entity_name" placeholder="اسم المنشأة" value={formData.entity_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم السجل التجاري</label><input type="text" name="commercial_register" placeholder="رقم السجل التجاري" value={formData.commercial_register} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="national_id" placeholder="رقم الهوية الوطنية" value={formData.national_id} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  // الوسيط العقاري - User Type 5
  const renderRealEstateBrokerFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="national_id" placeholder="رقم الهوية" value={formData.national_id} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الترخيص العقاري</label><input type="text" name="license_number" placeholder="رقم الترخيص العقاري" value={formData.license_number} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  // شركة المزادات - User Type 6
  const renderAuctionCompanyFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="full_name" placeholder="الاسم الثلاثي" value={formData.full_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="national_id" placeholder="رقم الهوية" value={formData.national_id} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">اسم المنشأة</label><input type="text" name="entity_name" placeholder="اسم المنشأة" value={formData.entity_name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم السجل التجاري</label><input type="text" name="commercial_register" placeholder="رقم السجل التجاري" value={formData.commercial_register} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">ملف السجل التجاري</label><input type="file" name="commercial_register_file" onChange={handleChange} required className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" /></>,
      <><label className="form-label">رقم ترخيص المزادات</label><input type="text" name="license_number" placeholder="رقم ترخيص المزادات" value={formData.license_number} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">ملف الترخيص</label><input type="file" name="license_file" onChange={handleChange} required className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="password_confirmation" placeholder="........." value={formData.password_confirmation} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderFormFields = () => {
    switch (userTypeId) {
      case 1:
        return renderRegularUserFields();
      case 2:
        return renderLandOwnerFields();
      case 3:
        return renderLegalAgentFields();
      case 4:
        return renderCommercialEntityFields();
      case 5:
        return renderRealEstateBrokerFields();
      case 6:
        return renderAuctionCompanyFields();
      default:
        return renderRegularUserFields();
    }
  };

  const getUserTypeLabel = (typeId) => {
    const labels = {
      1: 'مستخدم عادي',
      2: 'مالك أرض',
      3: 'وكيل شرعي',
      4: 'منشأة تجارية',
      5: 'وسيط عقاري',
      6: 'شركة مزادات عقارية'
    };
    return labels[typeId] || 'مستخدم عادي';
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
                src="/images/logo2.png" 
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
            >
              <option value={1}>مستخدم عادي</option>
              <option value={2}>مالك أرض</option>
              <option value={3}>وكيل شرعي</option>
              <option value={4}>منشأة تجارية</option>
              <option value={5}>وسيط عقاري</option>
              <option value={6}>شركة مزادات عقارية</option>
            </select>
          </div>

          {/* رسائل الخطأ والنجاح */}
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          {/* نموذج التسجيل مع إمكانية التمرير */}
          <div className="form-scroll-container">
            <form onSubmit={handleSubmit} className="auth-form register-form">
              {renderFormFields()}
              
              <button type="submit" className="btn-register-submit" disabled={loading}>
                {loading ? 'جاري التسجيل...' : 'إنشاء حساب'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;