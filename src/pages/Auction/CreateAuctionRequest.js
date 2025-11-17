// components/MarketingRequestModal.js
import React, { useState, useEffect, useRef } from 'react';
import { marketingApi, validationService } from '../../api/auctionRequestApi';
import { formHelpers, successHandler } from '../../utils/formHelpers';
import { locationService } from '../../utils/LocationForFiltters';
import './MarketingRequestModal.css';

function MarketingRequestModal({ isOpen, onClose, onSuccess }) {
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
  const modalRef = useRef(null);

  // Initialize regions and cities
  useEffect(() => {
    setRegions(locationService.getRegions());
    setCities(locationService.getCitiesByRegion());
  }, []);

  // Update available cities when region changes
  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);
    } else {
      setAvailableCities([]);
    }
  }, [formData.region, cities]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      region: '',
      city: '',
      description: '',
      document_number: '',
      terms_accepted: false
    });
    setImages([]);
    setError(null);
    setResponseData(null);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = images.length + files.length;
    
    if (totalImages > 5) {
      setError('يمكن رفع حتى 5 صور فقط');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        setError('حجم الصورة يجب أن لا يتجاوز 5MB');
        return false;
      }
      return true;
    });

    setImages(prev => [...prev, ...validFiles]);
    setError(null);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    if (!formData.region || !formData.city || !formData.document_number || !formData.description) {
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
      submitData.append('description', formData.description);
      submitData.append('document_number', formData.document_number);
      submitData.append('terms_accepted', 'true');

      images.forEach((image) => {
        submitData.append('images[]', image);
      });

      // Submit to API
      const response = await marketingApi.submitMarketingRequest(submitData);
      
      console.log('✅ تم إنشاء طلب التسويق:', response);
      setResponseData(response);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(response);
      }
      
    } catch (err) {
      console.error('❌ خطأ في إنشاء طلب التسويق:', err);
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

  if (!isOpen) return null;

  return (
    <div className="myads-form-overlay">
      <div className="myads-form-modal myads-form-stepper" ref={modalRef}>
        <div className="myads-form-header">
          <h3>طلب تسويق منتج عقاري</h3>
          <button 
            className="myads-close-btn" 
            onClick={handleClose}
            disabled={loading}
          >
            ✕
          </button>
        </div>

        <div className="form-progress-container">
          <div className="form-progress-steps">
            <div className="form-progress-step active">
              <div className="step-number">1</div>
              <div className="step-text">بيانات الطلب</div>
            </div>
            <div className="form-progress-step">
              <div className="step-number">2</div>
              <div className="step-text">المراجعة</div>
            </div>
            <div className="form-progress-step">
              <div className="step-number">3</div>
              <div className="step-text">الإكمال</div>
            </div>
          </div>
        </div>

        <div className="myads-form-step">
          {loading ? (
            <div className="elegantLoading_container">
              <div className="elegantLoader"></div>
              <p>جاري إنشاء طلب التسويق...</p>
            </div>
          ) : success ? (
            <div className="form-completion">
              <div className="form-completion-icon">✓</div>
              <h3>تم إنشاء الطلب بنجاح</h3>
              <p>سيتم مراجعة طلبك من قبل الإدارة وسيتم إشعارك بنتيجة المراجعة</p>
              {responseData && (
                <div className="request-summary">
                  <h4>تفاصيل الطلب:</h4>
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
                      <strong>رقم الوثيقة:</strong>
                      <span>{formData.document_number}</span>
                    </div>
                  </div>
                </div>
              )}
              <div className="myads-form-actions">
                <button 
                  onClick={resetForm} 
                  className="myads-btn-primary"
                >
                  إنشاء طلب جديد
                </button>
                <button 
                  onClick={handleClose} 
                  className="myads-btn-outline"
                >
                  إغلاق
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="myads-form myads-compact-form">
              <div className="myads-form-grid myads-mobile-grid">
                {/* المنطقة */}
                <div className="myads-form-group">
                  <label htmlFor="region">المنطقة *</label>
                  <select 
                    id="region"
                    name="region"
                    value={formData.region}
                    onChange={handleInputChange}
                    className="myads-form-control"
                    required
                  >
                    <option value="">اختر المنطقة</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* المدينة */}
                <div className="myads-form-group">
                  <label htmlFor="city">المدينة *</label>
                  <select 
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className="myads-form-control"
                    disabled={!formData.region}
                    required
                  >
                    <option value="">اختر المدينة</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* رقم الوثيقة */}
                <div className="myads-form-group">
                  <label htmlFor="document_number">رقم الوثيقة *</label>
                  <input
                    type="text"
                    id="document_number"
                    name="document_number"
                    value={formData.document_number}
                    onChange={handleInputChange}
                    className="myads-form-control"
                    placeholder="أدخل رقم وثيقة الأرض"
                    required
                  />
                </div>

                {/* الوصف */}
                <div className="myads-form-group full-width">
                  <label htmlFor="description">الوصف *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="myads-form-control"
                    placeholder="أدخل وصف مفصل للأرض... (الموقع، المساحة، الخدمات المتاحة، إلخ)"
                    rows="4"
                    required
                  />
                </div>

                {/* رفع الصور */}
                <div className="myads-form-group full-width">
                  <label>الصور *</label>
                  <div className="myads-file-input-wrapper">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      multiple
                      accept="image/*"
                      className="myads-form-control"
                    />
                    <small>يمكن رفع حتى 5 صور، الحجم الأقصى 5MB لكل صورة</small>
                  </div>

                  {images.length > 0 && (
                    <div className="files-list">
                      <h4>الصور المرفوعة ({images.length}/5):</h4>
                      {images.map((image, index) => (
                        <div key={index} className="file-item">
                          <div className="file-info">
                            <span className="file-icon">🖼️</span>
                            <span className="file-name">{image.name}</span>
                          </div>
                          <button
                            type="button"
                            className="remove-file"
                            onClick={() => removeImage(index)}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* الشروط والأحكام */}
                <div className="myads-form-group full-width">
                  <label className="myads-checkbox-container">
                    أوافق على الشروط والأحكام
                    <input
                      type="checkbox"
                      name="terms_accepted"
                      checked={formData.terms_accepted}
                      onChange={handleInputChange}
                      required
                    />
                    <span className="myads-checkmark"></span>
                  </label>
                </div>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  {error}
                </div>
              )}

              <div className="myads-form-actions">
                <button 
                  type="submit" 
                  className="myads-btn-primary" 
                  disabled={loading}
                >
                  {loading ? 'جاري الإرسال...' : 'إنشاء طلب التسويق'}
                </button>
                <button 
                  type="button" 
                  className="myads-btn-outline" 
                  onClick={handleClose}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default MarketingRequestModal;