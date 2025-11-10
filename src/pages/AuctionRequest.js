// src/pages/MarketingRequest.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
// import {
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   ,
//   
// } from 'react-icons/fa';

function MarketingRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region: '',
    city: '',
    description: '',
    document_number: '',
    terms_accepted: false
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const fileInputRef = useRef(null);

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    fetchRegionsAndCities();
  }, []);

  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);
    } else {
      setAvailableCities([]);
    }
  }, [formData.region, cities]);

  const fetchRegionsAndCities = () => {
    const regionsData = [
      'منطقة الرياض', 'منطقة مكة المكرمة', 'منطقة المدينة المنورة', 
      'منطقة القصيم', 'المنطقة الشرقية', 'منطقة عسير', 'منطقة تبوك',
      'منطقة حائل', 'منطقة الحدود الشمالية', 'منطقة جازان', 
      'منطقة نجران', 'منطقة الباحة', 'منطقة الجوف'
    ];
    
    const citiesData = {
      'منطقة الرياض': ['الرياض', 'الخرج', 'الدرعية', 'المزاحمية', 'القويعية'],
      'منطقة مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'القنفذة', 'رابغ'],
      'منطقة المدينة المنورة': ['المدينة المنورة', 'ينبع', 'العلا', 'المهد'],
    };
    
    setRegions(regionsData);
    setCities(citiesData);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'region' && { city: '' })
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    if (images.length + files.length > 5) {
      setError('يمكنك رفع最多 5 صور فقط');
      return;
    }

    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('يجب أن تكون الملفات صور فقط');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن يكون أقل من 5MB');
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    e.target.value = '';
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.region || !formData.city || !formData.description || !formData.document_number) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    if (!formData.terms_accepted) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    if (images.length === 0) {
      setError('يرجى رفع صورة واحدة على الأقل');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('يجب تسجيل الدخول أولاً');
        setLoading(false);
        navigate('/login');
        return;
      }

      const submitData = new FormData();
      submitData.append('region', formData.region);
      submitData.append('city', formData.city);
      submitData.append('description', formData.description);
      submitData.append('document_number', formData.document_number);
      submitData.append('terms_accepted', 'true');

      images.forEach((image, index) => {
        submitData.append('images[]', image);
      });

      const response = await axios.post(
        'https://shahin-tqay.onrender.com/api/user/auction-request',
        submitData,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      console.log('✅ تم إنشاء طلب التسويق:', response.data);
      setResponseData(response.data);
      setSuccess(true);
      setLoading(false);
      
    } catch (err) {
      console.error('❌ خطأ في إنشاء طلب التسويق:', err);
      setLoading(false);
      
      if (err.response) {
        if (err.response.status === 401) {
          setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.status === 422) {
          setError('بيانات غير صالحة: ' + (err.response.data.message || 'يرجى التحقق من البيانات المدخلة'));
        } else {
          setError(err.response.data.message || 'حدث خطأ في الخادم');
        }
      } else if (err.request) {
        setError('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت');
      } else {
        setError('حدث خطأ غير متوقع');
      }
    }
  };

  if (loading) return (
    <div className="elegantLoading_container">
      <div className="elegantLoader"></div>
      <p className="elegantLoading_text">جاري إنشاء طلب التسويق...</p>
    </div>
  );

  return (
    <div className="elegantCreate_container">
      {/* الهيدر */}
      <header className="elegantCreate_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
        العودة
        </button>
        
        <div className="elegantHeader_title">
          {/* <span>📢</span> */}
          <span>طلب تسويق أرض</span>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="elegantCreate_content">
        <div className="elegantCreate_card">
          {/* عنوان البطاقة */}
          <div className="elegantCard_title">
            <span className="elegantCard_icon"></span>
            <h2>إنشاء طلب تسويق جديد</h2>
          </div>

          {success ? (
            <div className="elegantSuccess_message">
              <div className="elegantSuccess_icon">
              </div>
              <div className="elegantSuccess_content">
                <h3 className="elegantSuccess_title">تم إنشاء طلب التسويق بنجاح!</h3>
                <p className="elegantSuccess_text">
                  {responseData?.message || 'سيتم مراجعة طلبك من قبل الإدارة'}
                </p>
                
                {responseData?.auction_request && (
                  <div className="elegantRequest_summary">
                    <h4>تفاصيل الطلب:</h4>
                    <div className="elegantSummary_grid">
                      <div className="elegantSummary_item">
                        <strong>رقم الطلب:</strong>
                        <span>#{responseData.auction_request.id}</span>
                      </div>
                      <div className="elegantSummary_item">
                        <strong>المنطقة:</strong>
                        <span>{responseData.auction_request.region}</span>
                      </div>
                      <div className="elegantSummary_item">
                        <strong>المدينة:</strong>
                        <span>{responseData.auction_request.city}</span>
                      </div>
                      <div className="elegantSummary_item">
                        <strong>رقم الوثيقة:</strong>
                        <span>{responseData.auction_request.document_number}</span>
                      </div>
                      <div className="elegantSummary_item">
                        <strong>الحالة:</strong>
                        <span className={`elegantStatus_badge ${responseData.auction_request.status === 'under_review' ? 'elegantStatus_review' : ''}`}>
                          {responseData.auction_request.status_ar}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="elegantSuccess_actions">
                <button 
                  onClick={() => navigate('/land-requests')} 
                  className="elegantCancel_btn"
                >
                  العودة للقائمة الرئيسية
                </button>
                <button 
                  onClick={() => {
                    setSuccess(false);
                    setFormData({
                      region: '',
                      city: '',
                      description: '',
                      document_number: '',
                      terms_accepted: false
                    });
                    setImages([]);
                  }} 
                  className="elegantSubmit_btn"
                >
                  إنشاء طلب جديد
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="elegantCreate_form">
              <div className="elegantForm_rows">
                {/* الصف الأول: المنطقة والمدينة ورقم الوثيقة */}
                <div className="elegantForm_row">
                  <div className="elegantForm_group">
                    <label htmlFor="region" className="elegantForm_label">
                      <span className="elegantForm_label_icon"></span>
                      المنطقة:
                    </label>
                    <select 
                      id="region" 
                      name="region" 
                      value={formData.region} 
                      onChange={handleChange} 
                      className="elegantForm_select"
                      required
                    >
                      <option value="">اختر المنطقة</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="elegantForm_group">
                    <label htmlFor="city" className="elegantForm_label">
                      <span className="elegantForm_label_icon"></span>
                      المدينة:
                    </label>
                    <select 
                      id="city" 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="elegantForm_select"
                      required 
                      disabled={!formData.region}
                    >
                      <option value="">اختر المدينة</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="elegantForm_group">
                    <label htmlFor="document_number" className="elegantForm_label">
                      <span className="elegantForm_label_icon"></span>
                      رقم الوثيقة:
                    </label>
                    <input
                      type="text"
                      id="document_number"
                      name="document_number"
                      value={formData.document_number}
                      onChange={handleChange}
                      className="elegantForm_input"
                      placeholder="أدخل رقم وثيقة الأرض"
                      required
                    />
                  </div>
                </div>

                {/* الصف الثاني: الوصف */}
                <div className="elegantForm_row">
                  <div className="elegantForm_group elegantForm_fullRow">
                    <label htmlFor="description" className="elegantForm_label">
                      <span className="elegantForm_label_icon"></span>
                      الوصف:
                    </label>
                    <textarea
                      id="description" 
                      name="description" 
                      value={formData.description} 
                      onChange={handleChange}
                      className="elegantForm_textarea"
                      placeholder="أدخل وصف مفصل للأرض... (الموقع، المساحة، الخدمات المتاحة، إلخ)" 
                      rows="5" 
                      required
                    />
                  </div>
                </div>

                {/* الصف الثالث: رفع الصور */}
                <div className="elegantForm_row">
                  <div className="elegantForm_group elegantForm_fullRow">
                    <label className="elegantForm_label">
                      <span className="elegantForm_label_icon"></span>
                  الصور :
                    </label>
                    
                    <div className="elegantUpload_section">
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/*"
                        className="elegantFile_input"
                        id="imageUpload"
                      />
                      <label htmlFor="imageUpload" className="elegantUpload_btn">
                        <span>اختر الصور</span>
                      </label>
                      <span className="elegantUpload_hint">(يمكن رفع حتى 5 صور، الحجم الأقصى 5MB لكل صورة)</span>
                    </div>

                    {/* معاينة الصور */}
                    {images.length > 0 && (
                      <div className="elegantImages_preview">
                        <h4>الصور المرفوعة ({images.length}/5):</h4>
                        <div className="elegantPreview_grid">
                          {images.map((image, index) => (
                            <div key={index} className="elegantPreview_item">
                              <img 
                                src={URL.createObjectURL(image)} 
                                alt={`Preview ${index + 1}`}
                                className="elegantPreview_image"
                              />
                              <button
                                type="button"
                                className="elegantRemove_image"
                                onClick={() => removeImage(index)}
                              >
                                
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* الموافقة على الشروط */}
                {/* <div className="elegantForm_row">
                  <div className="elegantForm_group elegantForm_fullRow">
                    <label className="elegantCheckbox_label">
                      <input
                        type="checkbox"
                        name="terms_accepted"
                        checked={formData.terms_accepted}
                        onChange={handleChange}
                        className="elegantCheckbox"
                      />
                      <span className="elegantCheckbox_custom"></span>
                      أوافق على الشروط والأحكام وسياسة الخصوصية
                    </label>
                  </div>
                </div> */}
              </div>

              {/* رسالة الخطأ */}
              {error && (
                <div className="elegantError_message">
                  <span className="elegantError_icon">⚠️</span>
                  {error}
                </div>
              )}

              {/* أزرار النموذج */}
              <div className="elegantForm_actions">
                <button 
                  type="submit" 
                  className="elegantSubmit_btn" 
                  disabled={loading}
                >
                  {loading ? 'جاري الإرسال...' : 'إنشاء طلب التسويق'}
                </button>
                <button 
                  type="button" 
                  className="elegantCancel_btn" 
                  onClick={() => navigate('/land-requests')}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>

        {/* معلومات مساعدة */}
        {/* {!success && (
          <div className="elegantHelp_section">
            <div className="elegantHelp_card">
              <h3>💡 معلومات مهمة عن طلبات التسويق</h3>
              <div className="elegantHelp_list">
                <div className="elegantHelp_item">
                  <strong>شروط القبول:</strong>
                  <p>يجب أن تكون الأرض مسجلة رسمياً وتملك وثيقة صحيحة</p>
                </div>
                <div className="elegantHelp_item">
                  <strong>مدة المعالجة:</strong>
                  <p>سيتم مراجعة طلبك خلال ٢٤-٤٨ ساعة عمل</p>
                </div>
                <div className="elegantHelp_item">
                  <strong>المستندات المطلوبة:</strong>
                  <p>صور واضحة للأرض + رقم الوثيقة الرسمي</p>
                </div>
                <div className="elegantHelp_item">
                  <strong>الاتصال:</strong>
                  <p>للاستفسارات: 920000000 - support@example.com</p>
                </div>
              </div>
            </div>
          </div>
        )} */}
      </main>
    </div>
  );
}

export default MarketingRequest;