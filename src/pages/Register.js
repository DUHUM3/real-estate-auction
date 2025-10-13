import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

function Register({ onClose, onSwitchToLogin }) {
  const [userType, setUserType] = useState('individual');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    idNumber: '',
    legalAgentNumber: '',
    establishmentName: '',
    commercialRecord: '',
    representativeName: '',
    establishmentIdNumber: '',
    realEstateLicense: '',
    auctionLicense: '',
    legalAgentFile: null,
    commercialRecordFile: null,
    realEstateLicenseFile: null,
    auctionLicenseFile: null
  });

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

  const handleUserTypeChange = (type) => {
    setUserType(type);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      phone: '',
      idNumber: '',
      legalAgentNumber: '',
      establishmentName: '',
      commercialRecord: '',
      representativeName: '',
      establishmentIdNumber: '',
      realEstateLicense: '',
      auctionLicense: '',
      legalAgentFile: null,
      commercialRecordFile: null,
      realEstateLicenseFile: null,
      auctionLicenseFile: null
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    const userData = {
      id: 1,
      name: formData.name,
      email: formData.email,
      userType: userType,
      ...formData
    };
    
    login(userData);
    navigate('/dashboard');
    if (onClose) onClose();
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

  const renderIndividualFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="name" placeholder="الاسم الثلاثي" value={formData.name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" placeholder="........." value={formData.confirmPassword} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderOwnerFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="name" placeholder="الاسم الثلاثي" value={formData.name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="idNumber" placeholder="رقم الهوية" value={formData.idNumber} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" placeholder="........." value={formData.confirmPassword} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderLegalAgentFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="name" placeholder="الاسم الثلاثي" value={formData.name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="idNumber" placeholder="رقم الهوية" value={formData.idNumber} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" placeholder="........." value={formData.confirmPassword} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الوكالة الشرعية</label><input type="text" name="legalAgentNumber" placeholder="رقم الوكالة الشرعية" value={formData.legalAgentNumber} onChange={handleChange} required className="form-input" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderCompanyFields = () => {
    const fields = [
      <><label className="form-label">اسم المنشأة</label><input type="text" name="establishmentName" placeholder="اسم المنشأة" value={formData.establishmentName} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم السجل التجاري</label><input type="text" name="commercialRecord" placeholder="رقم السجل التجاري" value={formData.commercialRecord} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">اسم ممثل المنشأة</label><input type="text" name="representativeName" placeholder="اسم الممثل" value={formData.representativeName} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم هوية الممثل</label><input type="text" name="establishmentIdNumber" placeholder="رقم هوية الممثل" value={formData.establishmentIdNumber} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" placeholder="........." value={formData.confirmPassword} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رفع صورة السجل التجاري</label><input type="file" name="commercialRecordFile" onChange={handleChange} required className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderRealEstateAgentFields = () => {
    const fields = [
      <><label className="form-label">الاسم الثلاثي</label><input type="text" name="name" placeholder="الاسم الثلاثي" value={formData.name} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الهوية</label><input type="text" name="idNumber" placeholder="رقم الهوية" value={formData.idNumber} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" placeholder="........." value={formData.confirmPassword} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الترخيص العقاري</label><input type="text" name="realEstateLicense" placeholder="رقم الترخيص العقاري" value={formData.realEstateLicense} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رفع صورة الترخيص</label><input type="file" name="realEstateLicenseFile" onChange={handleChange} required className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderAuctionCompanyFields = () => {
    const fields = [
      <><label className="form-label">اسم المنشأة</label><input type="text" name="establishmentName" placeholder="اسم المنشأة" value={formData.establishmentName} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم السجل التجاري</label><input type="text" name="commercialRecord" placeholder="رقم السجل التجاري" value={formData.commercialRecord} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">اسم ممثل المنشأة</label><input type="text" name="representativeName" placeholder="اسم الممثل" value={formData.representativeName} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم الجوال</label><input type="tel" name="phone" placeholder="05xxxxxxxx" value={formData.phone} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رقم هوية الممثل</label><input type="text" name="establishmentIdNumber" placeholder="رقم هوية الممثل" value={formData.establishmentIdNumber} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">البريد الإلكتروني</label><input type="email" name="email" placeholder="example@email.com" value={formData.email} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">كلمة المرور</label><input type="password" name="password" placeholder="........." value={formData.password} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">تأكيد كلمة المرور</label><input type="password" name="confirmPassword" placeholder="........." value={formData.confirmPassword} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رفع صورة السجل التجاري</label><input type="file" name="commercialRecordFile" onChange={handleChange} required className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" /></>,
      <><label className="form-label">رقم ترخيص المزادات</label><input type="text" name="auctionLicense" placeholder="رقم ترخيص المزادات" value={formData.auctionLicense} onChange={handleChange} required className="form-input" /></>,
      <><label className="form-label">رفع صورة ترخيص المزادات</label><input type="file" name="auctionLicenseFile" onChange={handleChange} required className="form-input-file" accept=".pdf,.jpg,.jpeg,.png" /></>
    ];
    
    return renderFieldRow(fields);
  };

  const renderFormFields = () => {
    switch (userType) {
      case 'individual':
        return renderIndividualFields();
      case 'owner':
        return renderOwnerFields();
      case 'legalAgent':
        return renderLegalAgentFields();
      case 'company':
        return renderCompanyFields();
      case 'realEstateAgent':
        return renderRealEstateAgentFields();
      case 'auctionCompany':
        return renderAuctionCompanyFields();
      default:
        return renderIndividualFields();
    }
  };

  const getUserTypeLabel = () => {
    const labels = {
      individual: 'مستخدم عادي',
      owner: 'مالك أرض',
      legalAgent: 'وكيل شرعي',
      company: 'منشأة تجارية',
      realEstateAgent: 'وسيط عقاري',
      auctionCompany: 'شركة مزادات عقارية'
    };
    return labels[userType];
  };

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal register-modal">
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

          {/* رسالة الترحيب */}
          {/* <div className="auth-welcome-section">
            <h2 className="auth-welcome-title">أنشئ حسابك</h2>
            <p className="auth-welcome-text">اختر نوع حسابك واملأ المعلومات المطلوبة</p>
          </div> */}

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
              value={userType} 
              onChange={(e) => handleUserTypeChange(e.target.value)}
              className="form-input user-type-select"
            >
              <option value="individual">مستخدم عادي</option>
              <option value="owner">مالك أرض</option>
              <option value="legalAgent">وكيل شرعي</option>
              <option value="company">منشأة تجارية</option>
              <option value="realEstateAgent">وسيط عقاري</option>
              <option value="auctionCompany">شركة مزادات عقارية</option>
            </select>
            {/* <div className="user-type-info">
              <span>نوع الحساب المحدد: {getUserTypeLabel()}</span>
            </div> */}
          </div>

          {/* نموذج التسجيل مع إمكانية التمرير */}
          <div className="form-scroll-container">
            <form onSubmit={handleSubmit} className="auth-form register-form">
              {renderFormFields()}
              
              <button type="submit" className="btn-register-submit">
                إنشاء حساب
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;