// CreateAuctionRequest.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App'; // استيراد Context للنافذة المنبثقة
import { toast, Toaster } from 'react-hot-toast'; // استيراد Toaster
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
  FaBan // أيقونة جديدة للتحذير
} from 'react-icons/fa';
import { marketingApi, validationService } from '../../api/auctionRequestApi';
import { formHelpers, successHandler } from '../../utils/formHelpers';
import { locationService } from '../../utils/LocationForFiltters';
import './MarketingRequestModal.css';

function CreateAuctionRequest() {
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext); // استخدام Context
  
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
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [formTouched, setFormTouched] = useState(false);
  const [dragging, setDragging] = useState(false);

  // حالة جديدة للتحقق من نوع المستخدم
  const [userType, setUserType] = useState(null);
  const [checkingUserType, setCheckingUserType] = useState(true);

  // دالة لعرض رسائل الخطأ من API
  const showApiError = (errorObj) => {
    if (typeof errorObj === 'string') {
      toast.error(errorObj);
    } else if (errorObj.message) {
      toast.error(errorObj.message);
    } else if (errorObj.details) {
      toast.error(errorObj.details);
    } else if (errorObj.error) {
      toast.error(errorObj.error);
    } else {
      toast.error('حدث خطأ غير متوقع');
    }
  };

  // دالة لعرض رسائل النجاح
  const showApiSuccess = (message) => {
    toast.success(message);
  };

  // التحقق من نوع المستخدم عند تحميل المكون
  useEffect(() => {
    checkUserType();
  }, []);

  // دالة للتحقق من نوع المستخدم
  const checkUserType = () => {
    try {
      setCheckingUserType(true);
      
      // 1. التحقق من localStorage أولاً
      const storedUserType = localStorage.getItem('user_type');
      const token = localStorage.getItem('token');
      
      console.log('🔍 التحقق من نوع المستخدم:', {
        storedUserType,
        hasToken: !!token
      });

      if (!token) {
        // إذا لم يكن هناك token، اعتبار المستخدم غير مسجل
        setUserType(null);
        setCheckingUserType(false);
        return;
      }

      if (storedUserType === 'شركة مزادات') {
        console.log('🚫 المستخدم هو شركة مزادات - غير مسموح بإنشاء طلبات');
        setUserType('شركة مزادات');
        showApiError('عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية');
      } else {
        console.log('✅ المستخدم مسموح له بإنشاء طلبات - نوع المستخدم:', storedUserType);
        setUserType(storedUserType);
      }
      
      setCheckingUserType(false);
    } catch (err) {
      console.error('❌ خطأ في التحقق من نوع المستخدم:', err);
      setCheckingUserType(false);
      showApiError('حدث خطأ في التحقق من الصلاحيات');
    }
  };

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
      showApiError('يمكن رفع حتى 5 صور فقط');
      return;
    }

    const validFiles = files.filter(file => {
      const isValidType = /^image\/(jpeg|jpg|png|gif|webp)$/i.test(file.type);
      if (!isValidType) {
        showApiError('يجب أن تكون الملفات صوراً من نوع JPEG، PNG، أو WebP فقط');
        return false;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        showApiError('حجم الصورة يجب أن لا يتجاوز 5MB');
        return false;
      }
      return true;
    });

    if (validFiles.length > 0) {
      setImages(prev => [...prev, ...validFiles]);
      setError(null);
      setFormTouched(true);
      showApiSuccess(`تم إضافة ${validFiles.length} صورة بنجاح`);
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
    showApiSuccess('تم حذف الصورة بنجاح');
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // التحقق النهائي من نوع المستخدم قبل الإرسال
    if (userType === 'شركة مزادات') {
      showApiError('عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية');
      return;
    }

    // Validate form
    if (!formData.region || !formData.city || !formData.document_number || !formData.description) {
      showApiError('جميع الحقول مطلوبة');
      return;
    }

    if (images.length === 0) {
      showApiError('يجب رفع صورة واحدة على الأقل');
      return;
    }

    if (!formData.terms_accepted) {
      showApiError('يجب الموافقة على الشروط والأحكام');
      return;
    }

    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      showApiError('يجب تسجيل الدخول أولاً');
      openLogin(); // فتح نافذة تسجيل الدخول
      return;
    }

    try {
      setLoading(true);
      showApiSuccess('جاري إنشاء طلب التسويق...');

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
      
      showApiSuccess('تم إنشاء طلب التسويق بنجاح!');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
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
        const errorMsg = 'انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى';
        showApiError(errorMsg);
        setError(errorMsg);
        localStorage.removeItem('token');
        localStorage.removeItem('user_type');
        openLogin();
      } else if (err.response.status === 422) {
        const errorMsg = 'بيانات غير صالحة: ' + (err.response.data.message || 'يرجى التحقق من البيانات المدخلة');
        showApiError(errorMsg);
        setError(errorMsg);
      } else if (err.response.status === 403) {
        const errorMsg = 'عذراً، ليس لديك صلاحية لإنشاء طلبات تسويق منتجات عقارية';
        showApiError(errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = err.response.data.message || 'حدث خطأ في الخادم';
        showApiError(errorMsg);
        setError(errorMsg);
      }
    } else if (err.request) {
      const errorMsg = 'تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت';
      showApiError(errorMsg);
      setError(errorMsg);
    } else {
      const errorMsg = 'حدث خطأ غير متوقع';
      showApiError(errorMsg);
      setError(errorMsg);
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
    // showApiSuccess('تم إعادة تعيين النموذج لإنشاء طلب جديد');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // التحقق من صلاحية المستخدم لإنشاء الطلب
  const isUserAllowed = () => {
    return userType !== 'شركة مزادات';
  };
  
  // تحديد حالة الزر بناء على البيانات المدخلة والصلاحية
  const isFormValid = isUserAllowed() && formData.region && formData.city && formData.document_number && 
                      formData.description && images.length > 0 && formData.terms_accepted;

  // إذا كان المستخدم شركة مزادات، اعرض رسالة المنع
  if (checkingUserType) {
    return (
      <div className="auction-request-container">
        {/* Toaster للإشعارات */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        
        <div className="request-loading">
          <div className="loading-spinner"></div>
          <p className="loading-text">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isUserAllowed()) {
    return (
      <div className="auction-request-container">
        {/* Toaster للإشعارات */}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#fff',
              color: '#000',
              direction: 'rtl',
              fontFamily: 'Arial, sans-serif',
              border: '1px solid #e0e0e0',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#22c55e',
                secondary: '#fff',
              },
            },
            error: {
              duration: 5000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />

        {/* Header */}
        <header className="request-header">
          <div className="request-header-content">
            <div className="header-left">
              <button 
                className="back-button"
                onClick={() => navigate(-1)}
                aria-label="رجوع"
              >
                <FaArrowRight className="back-icon" />
                <span className="back-text">رجوع</span>
              </button>
            </div>
            
            <h1 className="header-title">طلب تسويق منتج عقاري</h1>
            
            <div className="header-right">
              <button 
                className="header-btn outline"
                onClick={() => navigate(-1)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </header>

        {/* محتوى رسالة المنع */}
        <main className="request-main-content">
          <div className="request-container">
            <div className="access-denied-container">
              <div className="access-denied-icon">
                <FaBan />
              </div>
              <h2 className="access-denied-title">غير مسموح</h2>
              <p className="access-denied-message">
                عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية.
                <br />
                يمكنك فقط تقديم عروض على الطلبات الموجودة.
              </p>
              <div className="access-denied-actions">
                <button 
                  onClick={() => navigate('/auction-requests')}
                  className="btn primary"
                >
                  تصفح الطلبات المتاحة
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="btn outline"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="auction-request-container">
      {/* Toaster للإشعارات */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
            direction: 'rtl',
            fontFamily: 'Arial, sans-serif',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

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
          
          <h1 className="header-title">طلب تسويق منتج عقاري</h1>
          
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
              <p className="loading-text">جاري إنشاء طلب التسويق...</p>
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
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="request-form">
              <div className="form-card">
                <div className="form-section">
                  <h3 className="section-title">
                    المعلومات الأساسية
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
                        placeholder="أدخل رقم وثيقة العقار"
                        required
                        dir="ltr"
                      />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    تفاصيل الطلب
                  </h3>
                  <div className="form-group">
                    <label htmlFor="description">الوصف <span className="required">*</span></label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="أدخل وصف مفصل للعقار... (الموقع، المساحة، المميزات، الخدمات المتاحة، إلخ)"
                      rows="5"
                      required
                    />
                    <small className="input-hint">أدخل وصفاً تفصيلياً للعقار لزيادة فرص التسويق الناجح.</small>
                  </div>
                </div>

                <div className="form-section">
                  <h3 className="section-title">
                    المرفقات
                  </h3>
                  <div className="form-group">
                    <label>
                      صور العقار <span className="required">*</span>
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
                        aria-label="اختيار صور العقار"
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
                          أوافق على <a href="#" className="terms-link">الشروط والأحكام</a> الخاصة بتسويق المنتجات العقارية
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
                      {loading ? 'جاري الإرسال...' : 'إنشاء طلب التسويق'}
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

export default CreateAuctionRequest;