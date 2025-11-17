import React, { useState, useRef } from 'react';
import Icons from '../../icons/index';

const ContactSection = () => {
  const [formData, setFormData] = useState({
    reason: '',
    message: '',
    full_name: '',
    email: '',
    phone: '',
    file: null
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // استخدام useRef للوصول إلى عنصر الرسالة
  const statusRef = useRef(null);

  // قائمة الأسباب المسموحة
  const allowedReasons = [
    'استشارة عقارية',
    'استفسار عن خدمة',
    'شكوى أو اقتراح',
    'طلب شراء',
    'طلب بيع',
    'تعاون تجاري',
    'أخرى'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // التحقق من حجم الملف (10MB كحد أقصى)
      if (file.size > 10 * 1024 * 1024) {
        alert('حجم الملف يجب أن لا يتجاوز 10MB');
        return;
      }
      setFormData(prev => ({
        ...prev,
        file: file
      }));
    }
  };

  // دالة للتمرير إلى الرسالة
  const scrollToStatus = () => {
    if (statusRef.current) {
      statusRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      // إضافة تأثير تركيز مرئي
      statusRef.current.style.transition = 'all 0.3s ease';
      statusRef.current.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.3)';
      
      setTimeout(() => {
        if (statusRef.current) {
          statusRef.current.style.boxShadow = 'none';
        }
      }, 2000);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus(null);

    try {
      // التحقق من صحة البيانات
      if (!formData.reason || !allowedReasons.includes(formData.reason)) {
        alert('يرجى اختيار سبب صحيح للتواصل');
        return;
      }

      // إنشاء FormData لإرسال الملف
      const submitData = new FormData();
      submitData.append('reason', formData.reason);
      submitData.append('message', formData.message);
      submitData.append('full_name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('phone', `+966${formData.phone}`);
      
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      // إرسال البيانات إلى API
      const response = await fetch('https://shahin-tqay.onrender.com/api/contact', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        
        // الانتظار قليلاً ثم التمرير إلى الرسالة
        setTimeout(() => {
          scrollToStatus();
        }, 100);
        
        // إعادة تعيين النموذج
        setFormData({
          reason: '',
          message: '',
          full_name: '',
          email: '',
          phone: '',
          file: null
        });
        // إعادة تعيين حقل الملف
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.message || 'حدث خطأ أثناء إرسال الرسالة' 
        });
        
        // التمرير إلى رسالة الخطأ
        setTimeout(() => {
          scrollToStatus();
        }, 100);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus({ 
        type: 'error', 
        message: 'حدث خطأ في الاتصال بالخادم' 
      });
      
      // التمرير إلى رسالة الخطأ
      setTimeout(() => {
        scrollToStatus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="contact-section" id="contact">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            تواصل معنا
            <div className="transparent-box"></div>
          </h2>
        </div>

        <div className="contact-form-container">
          {/* عرض حالة الإرسال مع ref للوصول السهل */}
          {submitStatus && (
            <div 
              ref={statusRef}
              className={`submit-status ${submitStatus.type}`}
              role="alert"
              aria-live="polite"
            >
              {submitStatus.message}
            </div>
          )}

          <form className="contact-form" onSubmit={handleSubmit}>
            {/* حقل سبب التواصل */}
            <div className="form-group">
              <label htmlFor="reason">سبب التواصل *</label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                className="contact-select"
              >
                <option value="">اختر سبب التواصل</option>
                {allowedReasons.map((reason, index) => (
                  <option key={index} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            {/* حقل الرسالة */}
            <div className="form-group">
              <label htmlFor="message">كيف يمكننا مساعدتك؟ *</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="اشرح لنا احتياجاتك ونوع الاستشارة التي تبحث عنها..."
                rows="5"
                required
              ></textarea>
            </div>

            {/* حقل رفع الملفات */}
            <div className="form-group">
              <label>ارفق ملف أو صورة (اختياري)</label>
              <div className="file-upload-container">
                <input
                  type="file"
                  id="file-upload"
                  className="file-input"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="file-upload-label">
                  <div className="upload-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="upload-text">
                    <span className="upload-title">
                      {formData.file ? formData.file.name : 'انقر لرفع الملفات'}
                    </span>
                    <span className="upload-subtitle">PDF, Word, JPG, PNG (الحد الأقصى 10MB)</span>
                  </div>
                </label>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="contact-fields">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="full_name">الاسم الكامل *</label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                  />
                </div>
              </div>

              <div className="form-group phone-group">
                <label htmlFor="phone">رقم الجوال (سعودي) *</label>
                <div className="phone-input-container">
                  <div className="country-code">+966</div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="5X XXX XXXX"
                    pattern="[0-9]{9}"
                    maxLength="9"
                    required
                    className="phone-input"
                  />
                </div>
                <small className="phone-hint">يجب أن يبدأ الرقم بـ 5</small>
              </div>
            </div>

            <button 
              type="submit" 
              className="submit-contact-btn"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الإرسال...' : 'إرسال الرسالة'}
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .submit-status {
          padding: 12px;
          margin-bottom: 20px;
          border-radius: 8px;
          text-align: center;
          font-weight: bold;
          transition: all 0.3s ease;
        }
        
        .submit-status.success {
          background-color: #d4edda;
          color: #155724;
          border: 1px solid #c3e6cb;
        }
        
        .submit-status.error {
          background-color: #f8d7da;
          color: #721c24;
          border: 1px solid #f5c6cb;
        }
        
        .submit-contact-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      `}</style>
    </section>
  );
};

export default ContactSection;