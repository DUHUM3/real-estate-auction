// CreateLandRequest.js
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowRight, 
  FaCheck, 
  FaExclamationTriangle, 
  FaUpload, 
  FaTimes,
  FaMapMarkerAlt,
  FaFileAlt,
  FaImage,
  FaPlus,
  FaHome,
  FaMap,
  FaRulerHorizontal,
  FaBullseye
} from 'react-icons/fa';
import { landApi } from '../../api/landRequestApi';
import { locationService } from '../../utils/LocationForFiltters';
import '../Auction/MarketingRequestModal.css';

function CreateLandRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region: '',
    city: '',
    purpose: 'sale',
    type: 'residential',
    area: '',
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
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [formTouched, setFormTouched] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Initialize regions and cities
  useEffect(() => {
    setRegions(locationService.getRegions());
    setCities(locationService.getCitiesByRegion());
  }, []);

  // Update available cities when region changes
  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);
      
      // اختيار أول مدينة افتراضيا إذا تم اختيار منطقة جديدة
      if (!formData.city && cities[formData.region].length > 0) {
        setFormData(prev => ({
          ...prev,
          city: cities[formData.region][0]
        }));
      }
    } else {
      setAvailableCities([]);
      setFormData(prev => ({
        ...prev,
        city: ''
      }));
    }
  }, [formData.region, cities]);

  // إنشاء معاينات للصور المختارة
  useEffect(() => {
    const previews = [];
    images.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews.push({
          file: file,
          preview: e.target.result
        });
        if (previews.length === images.length) {
          setImagesPreviews([...previews]);
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (images.length === 0) {
      setImagesPreviews([]);
    }
  }, [images]);

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      region: '',
      city: '',
      purpose: 'sale',
      type: 'residential',
      area: '',
      description: '',
      document_number: '',
      terms_accepted: false
    });
    setImages([]);
    setImagesPreviews([]);
    setError(null);
    setResponseData(null);
    setFormTouched(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setFormTouched(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processSelectedImages(files);
  };

  const processSelectedImages = (files) => {
    const totalImages = images.length + files.length;
    
    if (totalImages > 5) {
      setError('يمكن رفع حتى 5 صور فقط');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.type);
      if (!isValidType) {
        setError('يجب أن تكون الملفات صوراً من نوع JPEG، PNG، أو WebP فقط');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن لا يتجاوز 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setError(null);
      setFormTouched(true);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      processSelectedImages(files);
    }
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagesPreviews(prev => prev.filter((_, i) => i !== index));
    setFormTouched(true);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.region || !formData.city || !formData.area || !formData.description || !formData.document_number) {
      setError('جميع الحقول مطلوبة');
      return;
    }

    if (images.length === 0) {
      setError('يجب رفع صورة واحدة على الأقل');
      return;
    }

    if (!formData.terms_accepted) {
      setError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      return;
    }

    try {
      setLoading(true);

      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append('region', formData.region);
      submitData.append('city', formData.city);
      submitData.append('purpose', formData.purpose);
      submitData.append('type', formData.type);
      submitData.append('area', formData.area);
      submitData.append('description', formData.description);
      submitData.append('document_number', formData.document_number);
      submitData.append('terms_accepted', 'true');

      images.forEach((image) => {
        submitData.append('images[]', image);
      });

      // Submit to API
      const response = await landApi.submitLandRequest(submitData);
      
      console.log('✅ تم إنشاء طلب الأرض:', response);
      setResponseData(response);
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
    } catch (err) {
      console.error('❌ خطأ في إنشاء طلب الأرض:', err);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // API error handler
  const handleApiError = (err) => {
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
  };

  const handleBack = () => {
    if (formTouched && !success) {
      if (window.confirm('هل أنت متأكد من إلغاء الطلب؟ سيتم فقدان جميع البيانات المدخلة.')) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleCreateNew = () => {
    resetForm();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // تحديد حالة الزر بناء على البيانات المدخلة
  const isFormValid = formData.region && formData.city && formData.area && 
                      formData.description && formData.document_number && 
                      images.length > 0 && formData.terms_accepted;
  
  return (
    <div className="auction-request-container">
      {/* Header */}
      <header className="request-header">
        <div className="request-header-content">
          <div className="header-left">
            <button 
              className="back-button"
              onClick={handleBack}
              disabled={loading}
              aria-label="رجوع"
            >
              <FaArrowRight className="back-icon" />
              <span className="back-text">رجوع</span>
            </button>
          </div>
          
          <h1 className="header-title">طلب تسويق أرض</h1>
          
          <div className="header-right">
            <button 
              className="header-btn outline"
              onClick={handleBack}
              disabled={loading}
            >
              إلغاء
            </button>
          </div>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="request-progress-container">
        <div className="request-progress-wrapper">
          <div className="request-progress-steps">
            <div className={`progress-step ${!success ? 'active' : 'completed'}`}>
              <div className="step-number">1</div>
              <div className="step-text">بيانات الطلب</div>
            </div>
            <div className={`progress-step ${success ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-text">الإكمال</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="request-main-content">
        <div className="request-container">
          {loading ? (
            <div className="request-loading">
              <div className="loading-spinner"></div>
              <p className="loading-text">جاري إنشاء طلب الأرض...</p>
            </div>
          ) : success ? (
            <div className="request-success">
              <div className="success-icon">
                <FaCheck />
              </div>
              <h2 className="success-title">تم إنشاء الطلب بنجاح</h2>
              <p className="success-description">سيتم مراجعة طلبك من قبل فريق العمل المختص وسيتم إشعارك بنتيجة المراجعة قريباً</p>
              
              {responseData && (
                <div className="request-summary-card">
                  <h3 className="summary-title">تفاصيل الطلب:</h3>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <strong>رقم الطلب:</strong>
                      <span>#{responseData.id || '--'}</span>
                    </div>
                    <div className="summary-item">
                      <strong>المنطقة:</strong>
                      <span>{formData.region}</span>
                    </div>
                    <div className="summary-item">
                      <strong>المدينة:</strong>
                      <span>{formData.city}</span>
                    </div>
                    <div className="summary-item">
                      <strong>الغرض:</strong>
                      <span>{formData.purpose === 'sale' ? 'بيع' : formData.purpose === 'investment' ? 'استثمار' : formData.purpose}</span>
                    </div>
                    <div className="summary-item">
                      <strong>النوع:</strong>
                      <span>
                        {formData.type === 'residential' ? 'سكني' : 
                         formData.type === 'commercial' ? 'تجاري' : 
                         formData.type === 'agricultural' ? 'زراعي' : formData.type}
                      </span>
                    </div>
                    <div className="summary-item">
                      <strong>المساحة:</strong>
                      <span>{formData.area} م²</span>
                    </div>
                    <div className="summary-item">
                      <strong>رقم الوثيقة:</strong>
                      <span dir="ltr">{formData.document_number}</span>
                    </div>
                    <div className="summary-item full-width">
                      <strong>الوصف:</strong>
                      <span>{formData.description}</span>
                    </div>
                    <div className="summary-item full-width">
                      <strong>المرفقات:</strong>
                      <span>{images.length} صورة</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="success-actions">
                <button 
                  onClick={handleCreateNew} 
                  className="btn primary"
                >
                  <FaPlus className="btn-icon" />
                  إنشاء طلب جديد
                </button>
                {/* <button 
                  onClick={() => navigate('/')} 
                  className="btn outline"
                >
                  <FaHome className="btn-icon" />
                  العودة للرئيسية
                </button> */}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="request-form">
              <div className="form-card">
                <div className="form-section">
                  <h3 className="section-title">
                    {/* <FaMapMarkerAlt className="section-icon" /> */}
                    الموقع والمنطقة
                  </h3>
                  <div className="form-grid">
                    {/* المنطقة */}
                    <div className="form-group">
                      <label htmlFor="region">المنطقة <span className="required">*</span></label>
                      <select 
                        id="region"
                        name="region"
                        value={formData.region}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="" disabled>اختر المنطقة</option>
                        {regions.map(region => (
                          <option key={region} value={region}>{region}</option>
                        ))}
                      </select>
                    </div>

                    {/* المدينة */}
                    <div className="form-group">
                      <label htmlFor="city">المدينة <span className="required">*</span></label>
                      <select 
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="form-control"
                        disabled={!formData.region}
                        required
                      >
                        <option value="" disabled>اختر المدينة</option>
                        {availableCities.map(city => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    {/* <FaBullseye className="section-icon" /> */}
                    تفاصيل الأرض
                  </h3>
                  <div className="form-grid">
                    {/* الغرض */}
                    <div className="form-group">
                      <label htmlFor="purpose">الغرض <span className="required">*</span></label>
                      <select 
                        id="purpose"
                        name="purpose"
                        value={formData.purpose}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="sale">بيع</option>
                        <option value="investment">استثمار</option>
                      </select>
                    </div>

                    {/* النوع */}
                    <div className="form-group">
                      <label htmlFor="type">نوع الأرض <span className="required">*</span></label>
                      <select 
                        id="type"
                        name="type"
                        value={formData.type}
                        onChange={handleInputChange}
                        className="form-control"
                        required
                      >
                        <option value="residential">سكني</option>
                        <option value="commercial">تجاري</option>
                        <option value="agricultural">زراعي</option>
                      </select>
                    </div>

                    {/* المساحة */}
                    <div className="form-group">
                      <label htmlFor="area">المساحة (م²) <span className="required">*</span></label>
                      <input
                        type="number"
                        id="area"
                        name="area"
                        value={formData.area}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="أدخل مساحة الأرض"
                        min="1"
                        required
                      />
                    </div>

                    {/* رقم الوثيقة */}
                    <div className="form-group">
                      <label htmlFor="document_number">رقم الوثيقة <span className="required">*</span></label>
                      <input
                        type="text"
                        id="document_number"
                        name="document_number"
                        value={formData.document_number}
                        onChange={handleInputChange}
                        className="form-control"
                        placeholder="أدخل رقم وثيقة الأرض"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    {/* <FaFileAlt className="section-icon" /> */}
                    الوصف التفصيلي
                  </h3>
                  <div className="form-group">
                    <label htmlFor="description">الوصف <span className="required">*</span></label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="أدخل وصف مفصل للأرض... (الموقع، المميزات، الخدمات المتاحة، إلخ)"
                      rows="5"
                      required
                    />
                    <small className="input-hint">أدخل وصفاً تفصيلياً للأرض لزيادة فرص التسويق الناجح.</small>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    {/* <FaImage className="section-icon" /> */}
                    المرفقات
                  </h3>
                  <div className="form-group">
                    <label>
                      صور الأرض <span className="required">*</span>
                      <span className="count-badge">{images.length}/5</span>
                    </label>
                    
                    {/* منطقة السحب والإفلات */}
                    <div 
                      className={`dropzone ${dragging ? 'dragging' : ''}`} 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    >
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleImageUpload}
                        multiple
                        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        className="file-input"
                        aria-label="اختيار صور الأرض"
                      />
                      
                      <div className="dropzone-content">
                        <div className="upload-icon">
                          <FaUpload />
                        </div>
                        <div className="upload-text">
                          <p>اسحب الصور وأفلتها هنا، أو انقر للاختيار</p>
                          <small>الحد الأقصى: 5 صور، حجم كل صورة لا يتجاوز 5MB</small>
                        </div>
                      </div>
                    </div>

                    {imagesPreviews.length > 0 && (
                      <div className="image-previews">
                        {imagesPreviews.map((image, index) => (
                          <div key={index} className="image-preview-item">
                            <div className="preview-container">
                              <img src={image.preview} alt={`صورة ${index + 1}`} className="preview-image" />
                              <button
                                type="button"
                                className="remove-image"
                                onClick={() => removeImage(index)}
                                aria-label="حذف الصورة"
                              >
                                <FaTimes />
                              </button>
                              <div className="image-details">
                                <span className="image-name">{image.file.name.length > 15 ? 
                                  image.file.name.substring(0, 12) + '...' + image.file.name.substring(image.file.name.lastIndexOf('.')) : 
                                  image.file.name
                                }</span>
                                <span className="image-size">{(image.file.size / (1024 * 1024)).toFixed(2)} MB</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="form-section terms-section">
                  <div className="form-group">
                    <div className="checkbox-wrapper">
                      <label className="checkbox-container">
                        <input
                          type="checkbox"
                          name="terms_accepted"
                          checked={formData.terms_accepted}
                          onChange={handleInputChange}
                          required
                        />
                        <span className="checkmark"></span>
                        <span className="checkbox-text">
                          أوافق على <a href="#" className="terms-link">الشروط والأحكام</a> الخاصة بتسويق الأراضي
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="error-message">
                    <FaExclamationTriangle className="error-icon" />
                    <span className="error-text">{error}</span>
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="submit" 
                    className={`btn primary large ${!isFormValid ? 'disabled' : ''}`}
                    disabled={loading || !isFormValid}
                  >
                    <span className="btn-text">
                      {loading ? 'جاري الإرسال...' : 'إنشاء طلب الأرض'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreateLandRequest;