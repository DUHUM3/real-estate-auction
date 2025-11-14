import React from 'react';
import Icons from '../../icons/index';

const ContactSection = () => {
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
          <form className="contact-form">
            {/* حقل سبب التواصل */}
            <div className="form-group">
              <label htmlFor="contact-reason">سبب التواصل *</label>
              <select
                id="contact-reason"
                required
                className="contact-select"
              >
                <option value="">اختر سبب التواصل</option>
                <option value="استشارة عقارية">استشارة عقارية</option>
                <option value="استفسار عن خدمة">استفسار عن خدمة</option>
                <option value="شكوى أو اقتراح">شكوى أو اقتراح</option>
                <option value="طلب شراء">طلب شراء</option>
                <option value="طلب بيع">طلب بيع</option>
                <option value="تعاون تجاري">تعاون تجاري</option>
                <option value="أخرى">أخرى</option>
              </select>
            </div>

            {/* حقل كيف يمكننا مساعدتك */}
            <div className="form-group">
              <label htmlFor="help">كيف يمكننا مساعدتك؟ *</label>
              <textarea
                id="help"
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
                  multiple
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
                    <span className="upload-title">انقر لرفع الملفات</span>
                    <span className="upload-subtitle">PDF, Word, JPG, PNG (الحد الأقصى 10MB)</span>
                  </div>
                </label>
                <div className="file-preview" id="file-preview"></div>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="contact-fields">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">الاسم الكامل *</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="أدخل اسمك الكامل"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">البريد الإلكتروني *</label>
                  <input
                    type="email"
                    id="email"
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

            <button type="submit" className="submit-contact-btn">
              إرسال الرسالة
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;