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
  
  const statusRef = useRef(null);

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

  const scrollToStatus = () => {
    if (statusRef.current) {
      statusRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
      });
      
      statusRef.current.style.transition = 'all 0.3s ease';
      statusRef.current.style.boxShadow = '0 0 0 3px rgba(83, 161, 221, 0.3)';
      
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
      if (!formData.reason || !allowedReasons.includes(formData.reason)) {
        alert('يرجى اختيار سبب صحيح للتواصل');
        return;
      }

      const submitData = new FormData();
      submitData.append('reason', formData.reason);
      submitData.append('message', formData.message);
      submitData.append('full_name', formData.full_name);
      submitData.append('email', formData.email);
      submitData.append('phone', `+966${formData.phone}`);
      
      if (formData.file) {
        submitData.append('file', formData.file);
      }

      const response = await fetch('https://core-api-x41.shaheenplus.sa/api/contact', {
        method: 'POST',
        body: submitData
      });

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({ type: 'success', message: result.message });
        
        setTimeout(() => {
          scrollToStatus();
        }, 100);
        
        setFormData({
          reason: '',
          message: '',
          full_name: '',
          email: '',
          phone: '',
          file: null
        });
        const fileInput = document.getElementById('file-upload');
        if (fileInput) fileInput.value = '';
      } else {
        setSubmitStatus({ 
          type: 'error', 
          message: result.message || 'حدث خطأ أثناء إرسال الرسالة' 
        });
        
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
      
      setTimeout(() => {
        scrollToStatus();
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-white py-20 relative" id="contact">
      <div className="container mx-auto px-4">
        {/* العنوان في أقصى اليمين */}
        <div className="text-right mb-12">
          <h2 className="text-1xl md:text-4xl font-bold text-[#343838] relative inline-block">
            تواصل معنا
            <div className="absolute inset-0 bg-transparent opacity-20"></div>
          </h2>
        </div>

        <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-6 md:p-8 shadow-lg border border-gray-200">
          {/* عرض حالة الإرسال */}
          {submitStatus && (
            <div 
              ref={statusRef}
              className={`p-4 mb-6 rounded-lg text-center font-bold transition-all duration-300 ${
                submitStatus.type === 'success' 
                  ? 'bg-green-100 text-green-800 border border-green-200' 
                  : 'bg-red-100 text-red-800 border border-red-200'
              }`}
              role="alert"
              aria-live="polite"
            >
              {submitStatus.message}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* حقل سبب التواصل */}
            <div className="space-y-2">
              <label htmlFor="reason" className="block text-right text-gray-700 font-medium">
                سبب التواصل *
              </label>
              <select
                id="reason"
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-transparent text-right bg-white"
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
            <div className="space-y-2">
              <label htmlFor="message" className="block text-right text-gray-700 font-medium">
                كيف يمكننا مساعدتك؟ *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="اشرح لنا احتياجاتك ونوع الاستشارة التي تبحث عنها..."
                rows="5"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-transparent text-right resize-none"
              ></textarea>
            </div>

            {/* حقل رفع الملفات */}
            <div className="space-y-2">
              <label className="block text-right text-gray-700 font-medium">
                ارفق ملف أو صورة (اختياري)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#53a1dd] transition-colors duration-300">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <div className="text-[#53a1dd] mb-3">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="mx-auto">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" />
                      <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" />
                      <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" />
                      <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" />
                      <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-700 font-medium">
                      {formData.file ? formData.file.name : 'انقر لرفع الملفات'}
                    </div>
                    <div className="text-gray-500 text-sm">
                      PDF, Word, JPG, PNG (الحد الأقصى 10MB)
                    </div>
                  </div>
                </label>
              </div>
            </div>

            {/* معلومات الاتصال */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="full_name" className="block text-right text-gray-700 font-medium">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    id="full_name"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-transparent text-right"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-right text-gray-700 font-medium">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-transparent text-right"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="phone" className="block text-right text-gray-700 font-medium">
                  رقم الجوال (سعودي) *
                </label>
                <div className="flex">
                  <div className="flex items-center px-4 bg-gray-100 border border-gray-300 border-l-0 rounded-r-lg text-gray-600">
                    +966
                  </div>
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
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-transparent text-right border-r-0"
                  />
                </div>
                <small className="block text-right text-gray-500 text-sm mt-1">
                  يجب أن يبدأ الرقم بـ 5
                </small>
              </div>
            </div>

            <button 
              type="submit" 
              className={`w-full py-4 px-6 rounded-lg font-bold text-white transition-all duration-300 ${
                isLoading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#53a1dd] hover:bg-[#458bc2] hover:shadow-lg transform hover:-translate-y-1'
              }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>جاري الإرسال...</span>
                </div>
              ) : (
                'إرسال الرسالة'
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;