// src/pages/MarketingRequest.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaCity,
  FaStickyNote,
  FaIdCard,
  FaImage,
  FaBullhorn,
  FaCheckCircle,
  FaTimes,
  FaPaperPlane,
  FaExclamationCircle,
  FaFileAlt,
  FaUpload,
  FaTrash
} from 'react-icons/fa';

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
    
    // التحقق من عدد الصور
    if (images.length + files.length > 5) {
      setError('يمكنك رفع最多 5 صور فقط');
      return;
    }

    // التحقق من نوع الملفات
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        setError('يجب أن تكون الملفات صور فقط');
        return false;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setError('حجم الصورة يجب أن يكون أقل من 5MB');
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    e.target.value = ''; // Reset file input
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // التحقق من البيانات المطلوبة
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

      // إنشاء FormData لإرسال الملفات
      const submitData = new FormData();
      submitData.append('region', formData.region);
      submitData.append('city', formData.city);
      submitData.append('description', formData.description);
      submitData.append('document_number', formData.document_number);
      submitData.append('terms_accepted', 'true'); // إرسال كـ string

      // إضافة الصور
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
    <div className="shahinLoading_container">
      <div className="shahinLoader"></div>
      <p className="shahinLoading_text">جاري إنشاء طلب التسويق...</p>
    </div>
  );

  return (
    <div className="shahinProperties_container">

      {/* Main Content */}
      <div className="shahinContent_area">
        <div className="shahinCreate_container">
          {/* بطاقة طلب التسويق */}
          <div className="shahinProperty_card">
            <div className="shahinCard_header">
              <div className="shahinHeader_title">
                <span className="shahinHeader_icon">
                  <FaBullhorn />
                </span>
                <h2>طلب تسويق أرض</h2>
              </div>
            </div>

            {success ? (
              <div className="shahinSuccess_message">
                <div className="shahinSuccess_icon">
                  <FaCheckCircle />
                </div>
                <div className="shahinSuccess_content">
                  <h3 className="shahinSuccess_title">تم إنشاء طلب التسويق بنجاح!</h3>
                  <p className="shahinSuccess_text">
                    {responseData?.message || 'سيتم مراجعة طلبك من قبل الإدارة'}
                  </p>
                  
                  {responseData?.auction_request && (
                    <div className="shahinRequest_summary">
                      <h4>تفاصيل الطلب:</h4>
                      <div className="shahinSummary_grid">
                        <div className="shahinSummary_item">
                          <strong>رقم الطلب:</strong>
                          <span>#{responseData.auction_request.id}</span>
                        </div>
                        <div className="shahinSummary_item">
                          <strong>المنطقة:</strong>
                          <span>{responseData.auction_request.region}</span>
                        </div>
                        <div className="shahinSummary_item">
                          <strong>المدينة:</strong>
                          <span>{responseData.auction_request.city}</span>
                        </div>
                        <div className="shahinSummary_item">
                          <strong>رقم الوثيقة:</strong>
                          <span>{responseData.auction_request.document_number}</span>
                        </div>
                        <div className="shahinSummary_item">
                          <strong>الحالة:</strong>
                          <span className={`shahinStatus_badge ${responseData.auction_request.status === 'under_review' ? 'shahinStatus_review' : ''}`}>
                            {responseData.auction_request.status_ar}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="shahinSuccess_actions">
                  <button 
                    onClick={() => navigate('/land-requests')} 
                    className="shahinAction_btn shahinDetails_btn"
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
                    className="shahinAction_btn shahinOffer_btn"
                  >
                    إنشاء طلب جديد
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="shahinCreate_form">
                {/* شبكة الحقول */}
                <div className="shahinDetails_grid">
                  {/* المنطقة والمدينة */}
                  <div className="shahinDetail_item shahinForm_group">
                    <div className="shahinDetail_header">
                      <span className="shahinDetail_icon">
                        <FaMapMarkerAlt />
                      </span>
                      <label className="shahinDetail_label">المنطقة</label>
                    </div>
                    <select 
                      name="region" 
                      value={formData.region} 
                      onChange={handleChange} 
                      className="shahinForm_select"
                      required
                    >
                      <option value="">اختر المنطقة</option>
                      {regions.map(region => (
                        <option key={region} value={region}>{region}</option>
                      ))}
                    </select>
                  </div>

                  <div className="shahinDetail_item shahinForm_group">
                    <div className="shahinDetail_header">
                      <span className="shahinDetail_icon">
                        <FaCity />
                      </span>
                      <label className="shahinDetail_label">المدينة</label>
                    </div>
                    <select 
                      name="city" 
                      value={formData.city} 
                      onChange={handleChange} 
                      className="shahinForm_select"
                      required 
                      disabled={!formData.region}
                    >
                      <option value="">اختر المدينة</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* رقم الوثيقة */}
                  <div className="shahinDetail_item shahinForm_group">
                    <div className="shahinDetail_header">
                      <span className="shahinDetail_icon">
                        <FaIdCard />
                      </span>
                      <label className="shahinDetail_label">رقم الوثيقة</label>
                    </div>
                    <input
                      type="text"
                      name="document_number"
                      value={formData.document_number}
                      onChange={handleChange}
                      className="shahinForm_input"
                      placeholder="أدخل رقم وثيقة الأرض"
                      required
                    />
                  </div>
                </div>

                {/* الوصف */}
                <div className="shahinForm_group">
                  <div className="shahinDetail_header">
                    <span className="shahinDetail_icon">
                      <FaStickyNote />
                    </span>
                    <label className="shahinDetail_label">وصف الأرض</label>
                  </div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="shahinForm_textarea"
                    placeholder="أدخل وصف مفصل للأرض... (الموقع، المساحة، الخدمات المتاحة، إلخ)"
                    rows="5"
                    required
                  />
                </div>

                {/* رفع الصور */}
                <div className="shahinForm_group">
                  <div className="shahinDetail_header">
                    <span className="shahinDetail_icon">
                      <FaImage />
                    </span>
                    <label className="shahinDetail_label">صور الأرض</label>
                  </div>
                  
                  <div className="shahinUpload_section">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      className="shahinFile_input"
                      id="imageUpload"
                    />
                    <label htmlFor="imageUpload" className="shahinUpload_btn">
                      <FaUpload />
                      <span>اختر الصور</span>
                    </label>
                    <span className="shahinUpload_hint">(يمكن رفع حتى 5 صور، الحجم الأقصى 5MB لكل صورة)</span>
                  </div>

                  {/* معاينة الصور */}
                  {images.length > 0 && (
                    <div className="shahinImages_preview">
                      <h4>الصور المرفوعة ({images.length}/5):</h4>
                      <div className="shahinPreview_grid">
                        {images.map((image, index) => (
                          <div key={index} className="shahinPreview_item">
                            <img 
                              src={URL.createObjectURL(image)} 
                              alt={`Preview ${index + 1}`}
                              className="shahinPreview_image"
                            />
                            <button
                              type="button"
                              className="shahinRemove_image"
                              onClick={() => removeImage(index)}
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* الموافقة على الشروط */}
                <div className="shahinForm_group">
                  <label className="shahinCheckbox_label">
                    <input
                      type="checkbox"
                      name="terms_accepted"
                      checked={formData.terms_accepted}
                      onChange={handleChange}
                      className="shahinCheckbox"
                    />
                    <span className="shahinCheckbox_custom"></span>
                    أوافق على الشروط والأحكام وسياسة الخصوصية
                  </label>
                </div>

                {/* رسالة الخطأ */}
                {error && (
                  <div className="shahinError_message">
                    <FaExclamationCircle className="shahinError_icon" />
                    <span className="shahinError_text">{error}</span>
                  </div>
                )}

                {/* أزرار الإرسال */}
                <div className="shahinForm_actions">
                  <button 
                    type="button" 
                    className="shahinAction_btn shahinCancel_btn"
                    onClick={() => navigate('/land-requests')}
                    disabled={loading}
                  >
                    إلغاء
                  </button>
                  <button 
                    type="submit" 
                    className="shahinAction_btn shahinSubmit_btn"
                    disabled={loading}
                  >
                    <FaPaperPlane className="shahinSubmit_icon" />
                    {loading ? 'جاري الإرسال...' : 'إنشاء طلب التسويق'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* معلومات مساعدة */}
          {!success && (
            <div className="shahinHelp_section">
              <div className="shahinHelp_card">
                <h3>💡 معلومات مهمة عن طلبات التسويق</h3>
                <div className="shahinHelp_list">
                  <div className="shahinHelp_item">
                    <strong>شروط القبول:</strong>
                    <p>يجب أن تكون الأرض مسجلة رسمياً وتملك وثيقة صحيحة</p>
                  </div>
                  <div className="shahinHelp_item">
                    <strong>مدة المعالجة:</strong>
                    <p>سيتم مراجعة طلبك خلال ٢٤-٤٨ ساعة عمل</p>
                  </div>
                  <div className="shahinHelp_item">
                    <strong>المستندات المطلوبة:</strong>
                    <p>صور واضحة للأرض + رقم الوثيقة الرسمي</p>
                  </div>
                  <div className="shahinHelp_item">
                    <strong>الاتصال:</strong>
                    <p>للاستفسارات: 920000000 - support@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketingRequest;