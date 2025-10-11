import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/AuthModal.css';

function Register({ onClose, onSwitchToLogin }) {
  const [userType, setUserType] = useState('individual'); // individual, owner, legalAgent, company, realEstateAgent, auctionCompany
  const [formData, setFormData] = useState({
    // الحقول الأساسية المشتركة
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    
    // حقول إضافية
    idNumber: '',
    legalAgentNumber: '',
    establishmentName: '',
    commercialRecord: '',
    representativeName: '',
    establishmentIdNumber: '',
    realEstateLicense: '',
    auctionLicense: '',
    
    // ملفات
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
    // إعادة تعيين الحقول عند تغيير نوع المستخدم
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
    
    // التحقق من تطابق كلمات المرور
    if (formData.password !== formData.confirmPassword) {
      alert('كلمات المرور غير متطابقة');
      return;
    }

    // هنا سيتم إضافة منطق التسجيل مع الخادم
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

  const renderIndividualFields = () => (
    <>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="الاسم الثلاثي"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
    </>
  );

  const renderOwnerFields = () => (
    <>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="الاسم الثلاثي"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="idNumber"
          placeholder="رقم الهوية"
          value={formData.idNumber}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
    </>
  );

  const renderLegalAgentFields = () => (
    <>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="الاسم الثلاثي"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="idNumber"
          placeholder="رقم الهوية"
          value={formData.idNumber}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="legalAgentNumber"
          placeholder="رقم الوكالة الشرعية"
          value={formData.legalAgentNumber}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
    </>
  );

  const renderCompanyFields = () => (
    <>
      <div className="form-group">
        <input
          type="text"
          name="establishmentName"
          placeholder="اسم المنشأة"
          value={formData.establishmentName}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="commercialRecord"
          placeholder="رقم السجل التجاري"
          value={formData.commercialRecord}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="representativeName"
          placeholder="اسم ممثل المنشأة"
          value={formData.representativeName}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="establishmentIdNumber"
          placeholder="رقم هوية الممثل"
          value={formData.establishmentIdNumber}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>رفع صورة السجل التجاري</label>
        <input
          type="file"
          name="commercialRecordFile"
          onChange={handleChange}
          required
          className="form-input"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
    </>
  );

  const renderRealEstateAgentFields = () => (
    <>
      <div className="form-group">
        <input
          type="text"
          name="name"
          placeholder="الاسم الثلاثي"
          value={formData.name}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="idNumber"
          placeholder="رقم الهوية"
          value={formData.idNumber}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="realEstateLicense"
          placeholder="رقم الترخيص الصادر من الهيئة العامة للعقار"
          value={formData.realEstateLicense}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>رفع صورة الترخيص</label>
        <input
          type="file"
          name="realEstateLicenseFile"
          onChange={handleChange}
          required
          className="form-input"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
    </>
  );

  const renderAuctionCompanyFields = () => (
    <>
      <div className="form-group">
        <input
          type="text"
          name="establishmentName"
          placeholder="اسم المنشأة"
          value={formData.establishmentName}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="commercialRecord"
          placeholder="رقم السجل التجاري"
          value={formData.commercialRecord}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="representativeName"
          placeholder="اسم ممثل المنشأة"
          value={formData.representativeName}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="tel"
          name="phone"
          placeholder="رقم الجوال"
          value={formData.phone}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="establishmentIdNumber"
          placeholder="رقم هوية الممثل"
          value={formData.establishmentIdNumber}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
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
      <div className="form-group">
        <input
          type="password"
          name="confirmPassword"
          placeholder="تأكيد كلمة المرور"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <input
          type="text"
          name="auctionLicense"
          placeholder="رقم الترخيص الصادر من الهيئة العامة للعقار للمزادات العقارية"
          value={formData.auctionLicense}
          onChange={handleChange}
          required
          className="form-input"
        />
      </div>
      <div className="form-group">
        <label>رفع صورة ترخيص المزادات العقارية</label>
        <input
          type="file"
          name="auctionLicenseFile"
          onChange={handleChange}
          required
          className="form-input"
          accept=".pdf,.jpg,.jpeg,.png"
        />
      </div>
    </>
  );

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

  return (
    <div className="auth-modal-overlay" onClick={handleOverlayClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>انشاء حساب جديد</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="user-type-selector">
          <label>نوع المستخدم:</label>
          <select 
            value={userType} 
            onChange={(e) => handleUserTypeChange(e.target.value)}
            className="form-input"
          >
            <option value="individual">مستخدم عادي</option>
            <option value="owner">مالك أرض</option>
            <option value="legalAgent">وكيل شرعي</option>
            <option value="company">منشأة تجارية</option>
            <option value="realEstateAgent">وسيط عقاري</option>
            <option value="auctionCompany">شركة مزادات عقارية</option>
          </select>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          {renderFormFields()}
          <button type="submit" className="btn btn-primary btn-full">انشاء حساب</button>
        </form>
        
        <div className="auth-modal-footer">
          <p>
            لديك حساب بالفعل؟ 
            <span className="auth-link" onClick={onSwitchToLogin}> سجل الدخول</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;