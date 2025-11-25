import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaArrowLeft,
  FaArrowRight,
  FaTimes,
  FaCheck,
  FaHome
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import './Auction/MarketingRequestModal.css';
import { locationService } from '../utils/LocationForFiltters';

function CreateAd() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [adFormData, setAdFormData] = useState({
    announcement_number: '',
    region: '',
    city: '',
    title: '',
    land_type: 'سكني',
    purpose: 'بيع',
    geo_location_text: '',
    total_area: '',
    length_north: '',
    length_south: '',
    length_east: '',
    length_west: '',
    description: '',
    deed_number: '',
    price_per_sqm: '',
    investment_duration: '',
    estimated_investment_value: '',
    agency_number: '',
    legal_declaration: false,
    cover_image: null,
    images: []
  });

  // الحصول على الروابط بناءً على نوع المستخدم
  const getApiUrls = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      return {
        base: 'https://shahin-tqay.onrender.com/api/user/auctions',
        create: 'https://shahin-tqay.onrender.com/api/user/auctions'
      };
    } else {
      return {
        base: 'https://shahin-tqay.onrender.com/api/user/properties',
        create: 'https://shahin-tqay.onrender.com/api/user/properties'
      };
    }
  };

  useEffect(() => {
    const allRegions = locationService.getRegions();
    setRegions(allRegions);
  }, []);

  useEffect(() => {
    if (adFormData.region) {
      const citiesObject = locationService.getCitiesByRegion();
      const regionCities = citiesObject[adFormData.region] || [];
      
      setCities(regionCities);
      
      if (!regionCities.includes(adFormData.city)) {
        setAdFormData(prev => ({
          ...prev,
          city: ''
        }));
      }
    } else {
      setCities([]);
    }
  }, [adFormData.region, adFormData.city]);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setAdFormData(prev => ({
      ...prev,
      region: region,
      city: ''
    }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setAdFormData(prev => ({
      ...prev,
      city: city
    }));
  };

  // التحقق من اكتمال البيانات الضرورية للخطوة الحالية
  const validateCurrentStep = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      if (currentStep === 1) {
        return Boolean(adFormData.title && adFormData.description);
      } else if (currentStep === 2) {
        return Boolean(adFormData.start_time && adFormData.auction_date && adFormData.address);
      } else if (currentStep === 3) {
        return Boolean(adFormData.cover_image);
      }
    } else {
      if (currentStep === 1) {
        return Boolean(
          adFormData.announcement_number && 
          adFormData.region && 
          adFormData.city && 
          adFormData.title
        );
      } else if (currentStep === 2) {
        return Boolean(
          adFormData.total_area && 
          adFormData.geo_location_text && 
          adFormData.deed_number
        );
      } else if (currentStep === 3) {
        if (adFormData.purpose === 'بيع') {
          return Boolean(adFormData.price_per_sqm);
        } else if (adFormData.purpose === 'استثمار') {
          // التحقق من الحقول المطلوبة للاستثمار
          const investmentFieldsValid = Boolean(
            adFormData.investment_duration && 
            adFormData.estimated_investment_value
          );
          
          // إذا كان وكيل شرعي، نتحقق من agency_number
          if (currentUser?.user_type === 'وكيل شرعي') {
            return investmentFieldsValid && Boolean(adFormData.agency_number);
          }
          
          return investmentFieldsValid;
        }
        return true;
      } else if (currentStep === 4) {
        return Boolean(adFormData.cover_image && adFormData.legal_declaration);
      }
    }
    return true;
  };

  // الانتقال للخطوة التالية
  const handleNextStep = () => {
    if (validateCurrentStep()) {
      const maxSteps = currentUser?.user_type === 'شركة مزادات' ? 3 : 4;
      if (currentStep < maxSteps) {
        setCurrentStep(currentStep + 1);
        toast.success(`تم الانتقال إلى الخطوة ${currentStep + 1}`);
      } else {
        setFormComplete(true);
        toast.success('تم استكمال جميع البيانات بنجاح!');
      }
    } else {
      toast.error('يرجى إكمال جميع الحقول المطلوبة قبل الانتقال للخطوة التالية');
    }
  };

  // العودة للخطوة السابقة
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      toast.success(`تم الرجوع إلى الخطوة ${currentStep - 1}`);
    }
  };

  // إضافة إعلان جديد
  const handleAddAd = async () => {
    setFormLoading(true);
    
    // عرض رسالة تحميل
    const loadingToast = toast.loading('جاري إضافة الإعلان...');

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('يرجى تسجيل الدخول أولاً');
        navigate('/login');
        return;
      }

      const urls = getApiUrls();
      const formData = new FormData();

      if (currentUser?.user_type === 'شركة مزادات') {
        // حقول المزادات
        const auctionFields = [
          'title', 'description', 'intro_link', 'start_time', 
          'auction_date', 'address', 'latitude', 'longitude'
        ];

        auctionFields.forEach(field => {
          if (adFormData[field]) {
            formData.append(field, adFormData[field]);
          }
        });

        if (adFormData.cover_image) {
          formData.append('cover_image', adFormData.cover_image);
        }

        if (adFormData.images && adFormData.images.length > 0) {
          adFormData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }

        if (adFormData.videos && adFormData.videos.length > 0) {
          adFormData.videos.forEach((video, index) => {
            formData.append(`videos[${index}]`, video);
          });
        }
      } else {
        // حقول الأراضي المشتركة
        const commonFields = [
          'announcement_number', 'region', 'city', 'title', 'land_type', 'purpose',
          'geo_location_text', 'total_area', 'length_north', 'length_south', 
          'length_east', 'length_west', 'description', 'deed_number', 'legal_declaration'
        ];

        commonFields.forEach(field => {
          if (typeof adFormData[field] === 'boolean') {
            formData.append(field, adFormData[field] ? 'true' : 'false');
          } else if (adFormData[field] !== null && adFormData[field] !== undefined) {
            formData.append(field, adFormData[field]);
          }
        });

        // إضافة الحقول المشروطة حسب purpose
        if (adFormData.purpose === 'بيع') {
          formData.append('price_per_sqm', adFormData.price_per_sqm);
        } else if (adFormData.purpose === 'استثمار') {
          formData.append('investment_duration', adFormData.investment_duration);
          formData.append('estimated_investment_value', adFormData.estimated_investment_value);
          
          // إضافة agency_number إذا كان المستخدم وكيل شرعي
          if (currentUser?.user_type === 'وكيل شرعي' && adFormData.agency_number) {
            formData.append('agency_number', adFormData.agency_number);
          }
        }

        // إضافة الصور
        if (adFormData.cover_image) {
          formData.append('cover_image', adFormData.cover_image);
        }

        if (adFormData.images && adFormData.images.length > 0) {
          adFormData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }
      }

      console.log('إرسال البيانات إلى:', urls.create);
      
      const response = await fetch(urls.create, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const result = await response.json();
      
      console.log('نتيجة الاستجابة:', result);
      
      if (response.ok && result.status) {
        toast.dismiss(loadingToast);
        toast.success('تم إضافة الإعلان بنجاح');
        resetForm();
        setTimeout(() => {
          navigate('/my-ads');
        }, 1500);
      } else {
        toast.dismiss(loadingToast);
        const errorMessage = result.message || 'فشل في إضافة الإعلان';
        toast.error(errorMessage);
        console.error('خطأ في الإضافة:', errorMessage);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('خطأ في الإتصال:', error);
      toast.error('حدث خطأ في الإتصال بالخادم. يرجى المحاولة مرة أخرى.');
    } finally {
      setFormLoading(false);
      setFormComplete(false);
    }
  };

  const resetForm = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      setAdFormData({
        title: '',
        description: '',
        intro_link: '',
        start_time: '',
        auction_date: '',
        address: '',
        latitude: '',
        longitude: '',
        cover_image: null,
        images: [],
        videos: []
      });
    } else {
      setAdFormData({
        announcement_number: '',
        region: '',
        city: '',
        title: '',
        land_type: 'سكني',
        purpose: 'بيع',
        geo_location_text: '',
        total_area: '',
        length_north: '',
        length_south: '',
        length_east: '',
        length_west: '',
        description: '',
        deed_number: '',
        price_per_sqm: '',
        investment_duration: '',
        estimated_investment_value: '',
        agency_number: '',
        legal_declaration: false,
        cover_image: null,
        images: []
      });
    }
    setCurrentStep(1);
    setFormComplete(false);
  };

  const handleAdChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (name === 'cover_image') {
        setAdFormData({
          ...adFormData,
          cover_image: files[0]
        });
        toast.success('تم رفع الصورة الرئيسية بنجاح');
      } else if (name === 'images') {
        setAdFormData({
          ...adFormData,
          images: Array.from(files)
        });
        toast.success(`تم رفع ${files.length} صورة إضافية`);
      } else if (name === 'videos') {
        setAdFormData({
          ...adFormData,
          videos: Array.from(files)
        });
        toast.success(`تم رفع ${files.length} فيديو`);
      }
    } else if (type === 'checkbox') {
      setAdFormData({
        ...adFormData,
        [name]: checked
      });
      if (name === 'legal_declaration' && checked) {
        toast.success('تم الموافقة على الإقرار القانوني');
      }
    } else {
      setAdFormData({
        ...adFormData,
        [name]: value
      });
    }
  };

  // العودة إلى صفحة الإعلانات
  const handleBackToAds = () => {
    navigate('/my-ads');
    toast('تم العودة إلى قائمة الإعلانات', { icon: '🏠' });
  };

  // إلغاء العملية
  const handleCancel = () => {
    toast.error('تم إلغاء عملية الإضافة');
    navigate('/my-ads');
  };

  // عرض النموذج المناسب حسب نوع المستخدم والخطوة الحالية
  const renderAdForm = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      return renderAuctionForm();
    } else {
      return renderPropertyForm();
    }
  };

  // نموذج خطوات المزادات
  const renderAuctionForm = () => {
    const renderAuctionProgress = () => (
      <div className="request-progress-container">
        <div className="request-progress-wrapper">
          <div className="request-progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-text">المعلومات الأساسية</div>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-text">الموقع والتاريخ</div>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-text">الصور والملفات</div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="auction-request-container">
        <header className="request-header">
          <div className="request-header-content">
            <div className="header-left">
              <button 
                className="back-button"
                onClick={handleBackToAds}
                disabled={formLoading}
              >
                <FaArrowRight className="back-icon" />
                <span className="back-text">العودة للإعلانات</span>
              </button>
            </div>
            
            <h1 className="header-title">إضافة مزاد جديد</h1>
            
            <div className="header-right">
              <button 
                className="header-btn outline"
                onClick={handleCancel}
                disabled={formLoading}
              >
                إلغاء
              </button>
            </div>
          </div>
        </header>
        
        {renderAuctionProgress()}
        
        <main className="request-main-content">
          <div className="request-container">
            {formComplete ? (
              <div className="request-success">
                <div className="success-icon">
                  <FaCheck />
                </div>
                <h2 className="success-title">تم إدخال جميع البيانات المطلوبة</h2>
                <p className="success-description">يمكنك الآن إضافة المزاد الجديد أو العودة لتعديل البيانات</p>
                <div className="success-actions">
                  <button 
                    type="button" 
                    className="btn outline"
                    onClick={handlePrevStep}
                    disabled={formLoading}
                  >
                    <FaArrowRight /> العودة للتعديل
                  </button>
                  <button 
                    type="button" 
                    className="btn primary"
                    onClick={handleAddAd}
                    disabled={formLoading}
                  >
                    {formLoading ? 'جاري الإضافة...' : 'إضافة المزاد'} {!formLoading && <FaCheck />}
                  </button>
                </div>
              </div>
            ) : (
              <form className="request-form">
                <div className="form-card">
                  {currentStep === 1 && (
                    <div className="form-section">
                      <h3 className="section-title">المعلومات الأساسية</h3>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label>عنوان المزاد *</label>
                          <input
                            type="text"
                            name="title"
                            value={adFormData.title}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل عنوان المزاد"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>وصف المزاد *</label>
                          <textarea
                            name="description"
                            value={adFormData.description}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            rows="4"
                            placeholder="أدخل وصفاً مفصلاً عن المزاد"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>رابط التعريف</label>
                          <input
                            type="url"
                            name="intro_link"
                            value={adFormData.intro_link}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="https://example.com/auction-intro"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="form-section">
                      <h3 className="section-title">الموقع والتاريخ</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>وقت البدء *</label>
                          <input
                            type="time"
                            name="start_time"
                            value={adFormData.start_time}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>تاريخ المزاد *</label>
                          <input
                            type="date"
                            name="auction_date"
                            value={adFormData.auction_date}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>العنوان *</label>
                          <input
                            type="text"
                            name="address"
                            value={adFormData.address}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل عنوان المزاد"
                          />
                        </div>

                        <div className="form-group">
                          <label>خط العرض</label>
                          <input
                            type="text"
                            name="latitude"
                            value={adFormData.latitude}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="30.0444"
                          />
                        </div>

                        <div className="form-group">
                          <label>خط الطول</label>
                          <input
                            type="text"
                            name="longitude"
                            value={adFormData.longitude}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="31.2357"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="form-section">
                      <h3 className="section-title">الصور والملفات</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>الصورة الرئيسية *</label>
                          <input
                            type="file"
                            name="cover_image"
                            onChange={handleAdChange}
                            required
                            accept="image/*"
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>الصور الإضافية</label>
                          <input
                            type="file"
                            name="images"
                            onChange={handleAdChange}
                            multiple
                            accept="image/*"
                            className="form-control"
                          />
                          <small className="input-hint">يمكنك رفع أكثر من صورة</small>
                        </div>

                        <div className="form-group">
                          <label>الفيديوهات</label>
                          <input
                            type="file"
                            name="videos"
                            onChange={handleAdChange}
                            multiple
                            accept="video/*"
                            className="form-control"
                          />
                          <small className="input-hint">يمكنك رفع فيديوهات عن المزاد</small>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    {currentStep > 1 && (
                      <button 
                        type="button" 
                        className="btn outline"
                        onClick={handlePrevStep}
                      >
                        <FaArrowRight /> السابق
                      </button>
                    )}
                    
                    <button 
                      type="button" 
                      className="btn primary large"
                      onClick={handleNextStep}
                    >
                      {currentStep === 3 ? 'استكمال' : 'التالي'} <FaArrowLeft />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  };

  // نموذج خطوات الأراضي
  const renderPropertyForm = () => {
    const renderPropertyProgress = () => (
      <div className="request-progress-container">
        <div className="request-progress-wrapper">
          <div className="request-progress-steps">
            <div className={`progress-step ${currentStep >= 1 ? 'active' : ''}`}>
              <div className="step-number">1</div>
              <div className="step-text">معلومات أساسية</div>
            </div>
            <div className={`progress-step ${currentStep >= 2 ? 'active' : ''}`}>
              <div className="step-number">2</div>
              <div className="step-text">المساحة والموقع</div>
            </div>
            <div className={`progress-step ${currentStep >= 3 ? 'active' : ''}`}>
              <div className="step-number">3</div>
              <div className="step-text">التفاصيل المالية</div>
            </div>
            <div className={`progress-step ${currentStep >= 4 ? 'active' : ''}`}>
              <div className="step-number">4</div>
              <div className="step-text">الصور والإقرارات</div>
            </div>
          </div>
        </div>
      </div>
    );

    return (
      <div className="auction-request-container">
        <header className="request-header">
          <div className="request-header-content">
            <div className="header-left">
              <button 
                className="back-button"
                onClick={handleBackToAds}
                disabled={formLoading}
              >
                <FaArrowRight className="back-icon" />
                <span className="back-text">العودة للإعلانات</span>
              </button>
            </div>
            
            <h1 className="header-title">إضافة أرض جديدة</h1>
            
            <div className="header-right">
              <button 
                className="header-btn outline"
                onClick={handleCancel}
                disabled={formLoading}
              >
                إلغاء
              </button>
            </div>
          </div>
        </header>

        {renderPropertyProgress()}
        
        <main className="request-main-content">
          <div className="request-container">
            {formComplete ? (
              <div className="request-success">
                <div className="success-icon">
                  <FaCheck />
                </div>
                <h2 className="success-title">تم إدخال جميع البيانات المطلوبة</h2>
                <p className="success-description">يمكنك الآن إضافة الإعلان الجديد أو العودة لتعديل البيانات</p>
                <div className="success-actions">
                  <button 
                    type="button" 
                    className="btn outline"
                    onClick={handlePrevStep}
                    disabled={formLoading}
                  >
                    <FaArrowRight /> العودة للتعديل
                  </button>
                  <button 
                    type="button" 
                    className="btn primary"
                    onClick={handleAddAd}
                    disabled={formLoading}
                  >
                    {formLoading ? 'جاري الإضافة...' : 'إضافة الإعلان'} {!formLoading && <FaCheck />}
                  </button>
                </div>
              </div>
            ) : (
              <form className="request-form">
                <div className="form-card">
                  {currentStep === 1 && (
                    <div className="form-section">
                      <h3 className="section-title">المعلومات الأساسية</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>رقم الإعلان *</label>
                          <input
                            type="text"
                            name="announcement_number"
                            value={adFormData.announcement_number}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل رقم الإعلان"
                          />
                        </div>

                        <div className="form-group">
                          <label>المنطقة *</label>
                          <select
                            name="region"
                            value={adFormData.region}
                            onChange={handleRegionChange}
                            required
                            className="form-control"
                          >
                            <option value="">اختر المنطقة</option>
                            {regions.map(region => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>المدينة *</label>
                          <select
                            name="city"
                            value={adFormData.city}
                            onChange={handleCityChange}
                            required
                            className="form-control"
                            disabled={!adFormData.region}
                          >
                            <option value="">اختر المدينة</option>
                            {cities.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>

                        <div className="form-group">
                          <label>عنوان الإعلان *</label>
                          <input
                            type="text"
                            name="title"
                            value={adFormData.title}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل عنوان الإعلان"
                          />
                        </div>

                        <div className="form-group">
                          <label>نوع الأرض *</label>
                          <select
                            name="land_type"
                            value={adFormData.land_type}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                          >
                            <option value="سكني">سكني</option>
                            <option value="تجاري">تجاري</option>
                            <option value="زراعي">زراعي</option>
                            <option value="صناعي">صناعي</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>الغرض *</label>
                          <select
                            name="purpose"
                            value={adFormData.purpose}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                          >
                            <option value="بيع">بيع</option>
                            <option value="استثمار">استثمار</option>
                          </select>
                        </div>

                        <div className="form-group full-width">
                          <label>الوصف</label>
                          <textarea
                            name="description"
                            value={adFormData.description}
                            onChange={handleAdChange}
                            className="form-control"
                            rows="3"
                            placeholder="أدخل وصفاً مفصلاً عن الأرض"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 2 && (
                    <div className="form-section">
                      <h3 className="section-title">المساحة والموقع</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>المساحة الإجمالية (م²) *</label>
                          <input
                            type="number"
                            name="total_area"
                            value={adFormData.total_area}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل المساحة الإجمالية"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label>الطول شمال (م)</label>
                          <input
                            type="number"
                            name="length_north"
                            value={adFormData.length_north}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="الطول شمال"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label>الطول جنوب (م)</label>
                          <input
                            type="number"
                            name="length_south"
                            value={adFormData.length_south}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="الطول جنوب"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label>الطول شرق (م)</label>
                          <input
                            type="number"
                            name="length_east"
                            value={adFormData.length_east}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="الطول شرق"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label>الطول غرب (م)</label>
                          <input
                            type="number"
                            name="length_west"
                            value={adFormData.length_west}
                            onChange={handleAdChange}
                            className="form-control"
                            placeholder="الطول غرب"
                            step="0.01"
                          />
                        </div>

                        <div className="form-group">
                          <label>رقم الصك *</label>
                          <input
                            type="text"
                            name="deed_number"
                            value={adFormData.deed_number}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل رقم الصك"
                          />
                        </div>

                        <div className="form-group full-width">
                          <label>الموقع الجغرافي (وصف) *</label>
                          <input
                            type="text"
                            name="geo_location_text"
                            value={adFormData.geo_location_text}
                            onChange={handleAdChange}
                            required
                            className="form-control"
                            placeholder="أدخل وصف الموقع الجغرافي"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {currentStep === 3 && (
                    <div className="form-section">
                      <h3 className="section-title">التفاصيل المالية</h3>
                      <div className="form-grid">
                        {adFormData.purpose === 'بيع' ? (
                          <div className="form-group full-width">
                            <label>سعر المتر المربع (ريال) *</label>
                            <input
                              type="number"
                              name="price_per_sqm"
                              value={adFormData.price_per_sqm}
                              onChange={handleAdChange}
                              required
                              className="form-control"
                              placeholder="أدخل سعر المتر المربع"
                            />
                            {adFormData.price_per_sqm && adFormData.total_area && (
                              <div className="price-summary">
                                <small>
                                  السعر الإجمالي: {parseFloat(adFormData.price_per_sqm) * parseFloat(adFormData.total_area)} ريال
                                </small>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="form-group">
                              <label>مدة الاستثمار (شهر) *</label>
                              <input
                                type="number"
                                name="investment_duration"
                                value={adFormData.investment_duration}
                                onChange={handleAdChange}
                                required
                                className="form-control"
                                placeholder="أدخل مدة الاستثمار بالأشهر"
                              />
                            </div>
                            <div className="form-group">
                              <label>القيمة الاستثمارية المتوقعة (ريال) *</label>
                              <input
                                type="number"
                                name="estimated_investment_value"
                                value={adFormData.estimated_investment_value}
                                onChange={handleAdChange}
                                required
                                className="form-control"
                                placeholder="أدخل القيمة الاستثمارية المتوقعة"
                              />
                            </div>
                            {currentUser?.user_type === 'وكيل شرعي' && (
                              <div className="form-group full-width">
                                <label>رقم الوكالة *</label>
                                <input
                                  type="text"
                                  name="agency_number"
                                  value={adFormData.agency_number}
                                  onChange={handleAdChange}
                                  required
                                  className="form-control"
                                  placeholder="أدخل رقم الوكالة"
                                />
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  )}

                  {currentStep === 4 && (
                    <div className="form-section">
                      <h3 className="section-title">الصور والإقرارات</h3>
                      <div className="form-grid">
                        <div className="form-group">
                          <label>الصورة الرئيسية *</label>
                          <input
                            type="file"
                            name="cover_image"
                            onChange={handleAdChange}
                            required
                            accept="image/*"
                            className="form-control"
                          />
                        </div>

                        <div className="form-group">
                          <label>الصور الإضافية</label>
                          <input
                            type="file"
                            name="images"
                            onChange={handleAdChange}
                            multiple
                            accept="image/*"
                            className="form-control"
                          />
                          <small className="input-hint">يمكنك رفع أكثر من صورة</small>
                        </div>

                        <div className="form-group full-width">
                          <div className="checkbox-wrapper">
                            <label className="checkbox-container">
                              <input
                                type="checkbox"
                                name="legal_declaration"
                                checked={adFormData.legal_declaration}
                                onChange={handleAdChange}
                                required
                              />
                              <span className="checkmark"></span>
                              <span className="checkbox-text">
                                أقر بأن جميع المعلومات المقدمة صحيحة وأتحمل المسؤولية القانونية
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    {currentStep > 1 && (
                      <button 
                        type="button" 
                        className="btn outline"
                        onClick={handlePrevStep}
                      >
                        <FaArrowRight /> السابق
                      </button>
                    )}
                    
                    <button 
                      type="button" 
                      className="btn primary large"
                      onClick={handleNextStep}
                    >
                      {currentStep === 4 ? 'استكمال' : 'التالي'} <FaArrowLeft />
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    );
  };

  return renderAdForm();
}

export default CreateAd;