import React, { useState } from 'react';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا سيتم إضافة منطق إرسال الرسالة
    alert('تم إرسال رسالتك بنجاح، سنقوم بالرد عليك خلال 24 ساعة');
    setFormData({
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="contact-page">
      <div className="page-header">
        <div className="container">
          <h1>اتصل بنا</h1>
          <p>نحن هنا لمساعدتك في أي استفسار</p>
        </div>
      </div>

      <section className="contact-content">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h2>معلومات الاتصال</h2>
              
              <div className="contact-item">
                <div className="contact-icon">📍</div>
                <div className="contact-details">
                  <h4>العنوان</h4>
                  <p>الرياض، المملكة العربية السعودية</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">📞</div>
                <div className="contact-details">
                  <h4>الهاتف</h4>
                  <p>+966 123 456 789</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">✉️</div>
                <div className="contact-details">
                  <h4>البريد الإلكتروني</h4>
                  <p>info@aqarkom.com</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-icon">🕒</div>
                <div className="contact-details">
                  <h4>أوقات العمل</h4>
                  <p>الأحد - الخميس: 8 ص - 5 م</p>
                </div>
              </div>
            </div>

            <div className="contact-form">
              <h2>أرسل رسالة</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="text"
                      name="name"
                      placeholder="الاسم الكامل"
                      value={formData.name}
                      onChange={handleChange}
                      required
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
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <input
                      type="tel"
                      name="phone"
                      placeholder="رقم الهاتف"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      name="subject"
                      placeholder="موضوع الرسالة"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <textarea
                    name="message"
                    placeholder="رسالتك"
                    rows="6"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <button type="submit" className="btn btn-primary btn-large">
                  إرسال الرسالة
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Contact;