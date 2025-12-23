// CreateAuctionRequest.js
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Icons from '../../icons';

import { marketingApi, validationService } from '../../api/auctionRequestApi';
import { formHelpers, successHandler } from '../../utils/formHelpers';
import { locationService } from '../../utils/LocationForFiltters';

function CreateAuctionRequest() {
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);
  
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
  const [userType, setUserType] = useState(null);
  const [checkingUserType, setCheckingUserType] = useState(true);

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

  const showApiSuccess = (message) => {
    toast.success(message);
  };

  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = () => {
    try {
      setCheckingUserType(true);
      const storedUserType = localStorage.getItem('user_type');
      const token = localStorage.getItem('token');

      if (!token) {
        setUserType(null);
        setCheckingUserType(false);
        return;
      }

      if (storedUserType === 'شركة مزادات') {
        setUserType('شركة مزادات');
        showApiError('عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية');
      } else {
        setUserType(storedUserType);
      }
      
      setCheckingUserType(false);
    } catch (err) {
      console.error('❌ خطأ في التحقق من نوع المستخدم:', err);
      setCheckingUserType(false);
      showApiError('حدث خطأ في التحقق من الصلاحيات');
    }
  };

  useEffect(() => {
    setRegions(locationService.getRegions());
    setCities(locationService.getCitiesByRegion());
  }, []);

  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);
      
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (userType === 'شركة مزادات') {
      showApiError('عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية');
      return;
    }

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

    const token = localStorage.getItem('token');
    if (!token) {
      showApiError('يجب تسجيل الدخول أولاً');
      openLogin();
      return;
    }

    try {
      setLoading(true);
      showApiSuccess('جاري إنشاء طلب التسويق...');

      const submitData = new FormData();
      submitData.append('region', formData.region);
      submitData.append('city', formData.city);
      submitData.append('description', formData.description);
      submitData.append('document_number', formData.document_number);
      submitData.append('terms_accepted', 'true');

      images.forEach((image) => {
        submitData.append('images[]', image);
      });

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isUserAllowed = () => {
    return userType !== 'شركة مزادات';
  };
  
  const isFormValid = isUserAllowed() && formData.region && formData.city && formData.document_number && 
                      formData.description && images.length > 0 && formData.terms_accepted;

  if (checkingUserType) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          draggable
          rtl
          pauseOnHover
          theme="light"
          // إعدادات مخصصة للتحكم في الموقع - زيادة القيمة لتنزيل الرسائل
          style={{
            top: window.innerWidth < 768 ? "80px" : "80px", // زدناها من 60/20 إلى 80/80
            right: "10px",
            left: "auto",
            width: "auto",
            maxWidth: window.innerWidth < 768 ? "90%" : "400px",
            fontFamily: "'Segoe UI', 'Cairo', sans-serif",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
            zIndex: 999999
          }}
          toastStyle={{
            borderRadius: "8px",
            padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
            marginBottom: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: window.innerWidth < 768 ? "40px" : "50px",
            direction: "rtl",
            textAlign: "right",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
          }}
          className={window.innerWidth < 768 ? "mobile-toast" : "desktop-toast"}
        />
        
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 text-lg">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  if (!isUserAllowed()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          draggable
          rtl
          pauseOnHover
          theme="light"
          // إعدادات مخصصة للتحكم في الموقع - زيادة القيمة لتنزيل الرسائل
          style={{
            top: window.innerWidth < 768 ? "80px" : "80px", // زدناها من 60/20 إلى 80/80
            right: "10px",
            left: "auto",
            width: "auto",
            maxWidth: window.innerWidth < 768 ? "90%" : "400px",
            fontFamily: "'Segoe UI', 'Cairo', sans-serif",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
            zIndex: 999999
          }}
          toastStyle={{
            borderRadius: "8px",
            padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
            marginBottom: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: window.innerWidth < 768 ? "40px" : "50px",
            direction: "rtl",
            textAlign: "right",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
          }}
          className={window.innerWidth < 768 ? "mobile-toast" : "desktop-toast"}
        />

        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button 
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 text-gray-600 hover:text-[#53a1dd] p-2 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  <Icons.FaArrowRight className="text-lg" />
                  <span className="hidden sm:inline">رجوع</span>
                </button>
              </div>
              
              <h1 className="text-xl font-bold text-gray-800 text-center">طلب تسويق منتج عقاري</h1>
              
              <div>
                <button 
                  onClick={() => navigate(-1)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.FaBan className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">غير مسموح</h2>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية.
                <br />
                يمكنك فقط تقديم عروض على الطلبات الموجودة.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/auction-requests')}
                  className="px-6 py-3 bg-[#53a1dd] text-white rounded-lg hover:bg-[#478bc5] transition-colors font-medium"
                >
                  تصفح الطلبات المتاحة
                </button>
                <button 
                  onClick={() => navigate('/')}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
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
    <div className="min-h-screen bg-gray-50">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        draggable
        rtl
        pauseOnHover
        theme="light"
        // إعدادات مخصصة للتحكم في الموقع - زيادة القيمة لتنزيل الرسائل
        style={{
          top: window.innerWidth < 768 ? "80px" : "80px", // زدناها من 60/20 إلى 80/80
          right: "10px",
          left: "auto",
          width: "auto",
          maxWidth: window.innerWidth < 768 ? "90%" : "400px",
          fontFamily: "'Segoe UI', 'Cairo', sans-serif",
          fontSize: window.innerWidth < 768 ? "12px" : "14px",
          zIndex: 999999
        }}
        toastStyle={{
          borderRadius: "8px",
          padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
          marginBottom: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          minHeight: window.innerWidth < 768 ? "40px" : "50px",
          direction: "rtl",
          textAlign: "right",
          fontSize: window.innerWidth < 768 ? "12px" : "14px",
        }}
        className={window.innerWidth < 768 ? "mobile-toast" : "desktop-toast"}
      />

      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button 
                onClick={handleBack}
                disabled={loading}
                className="flex items-center gap-2 text-gray-600 hover:text-[#53a1dd] p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Icons.FaArrowRight className="text-lg" />
                <span className="hidden sm:inline">رجوع</span>
              </button>
            </div>
            
            <h1 className="text-xl font-bold text-gray-800 text-center">طلب تسويق منتج عقاري</h1>
            
            <div>
              <button 
                onClick={handleBack}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg">جاري إنشاء طلب التسويق...</p>
            </div>
          ) : success ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icons.FaCheck className="text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">تم إنشاء الطلب بنجاح</h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                سيتم مراجعة طلبك من قبل فريق العمل المختص وسيتم إشعارك بنتيجة المراجعة قريباً
              </p>
              
              {responseData && (
                <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto text-right">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-200">تفاصيل الطلب:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <strong className="text-gray-500 text-sm block mb-1">رقم الطلب:</strong>
                      <span className="text-gray-800 font-medium">#{responseData.id || '--'}</span>
                    </div>
                    <div>
                      <strong className="text-gray-500 text-sm block mb-1">المنطقة:</strong>
                      <span className="text-gray-800 font-medium">{formData.region}</span>
                    </div>
                    <div>
                      <strong className="text-gray-500 text-sm block mb-1">المدينة:</strong>
                      <span className="text-gray-800 font-medium">{formData.city}</span>
                    </div>
                    <div>
                      <strong className="text-gray-500 text-sm block mb-1">رقم الوثيقة:</strong>
                      <span className="text-gray-800 font-medium" dir="ltr">{formData.document_number}</span>
                    </div>
                    <div className="md:col-span-2">
                      <strong className="text-gray-500 text-sm block mb-1">الوصف:</strong>
                      <span className="text-gray-800">{formData.description}</span>
                    </div>
                    <div className="md:col-span-2">
                      <strong className="text-gray-500 text-sm block mb-1">المرفقات:</strong>
                      <span className="text-gray-800">{images.length} صورة</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-center">
                <button 
                  onClick={handleCreateNew} 
                  className="px-6 py-3 bg-[#53a1dd] text-white rounded-lg hover:bg-[#478bc5] transition-colors font-medium flex items-center gap-2"
                >
                  <Icons.FaPlus />
                  إنشاء طلب جديد
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">طلب تسويق منتج عقاري</h1>
                  <p className="text-gray-600">املأ النموذج أدناه لإنشاء طلب تسويق جديد</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-8">
                    {/* المعلومات الأساسية */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                          <Icons.FaFileAlt className="text-lg" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h3>
                          <p className="text-gray-500 text-sm">أدخل المعلومات الأساسية للمنتج العقاري</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            المنطقة <span className="text-red-500">*</span>
                          </label>
                          <select 
                            name="region"
                            value={formData.region}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                            required
                          >
                            <option value="" disabled>اختر المنطقة</option>
                            {regions.map(region => (
                              <option key={region} value={region}>{region}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            المدينة <span className="text-red-500">*</span>
                          </label>
                          <select 
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition disabled:bg-gray-50"
                            disabled={!formData.region}
                            required
                          >
                            <option value="" disabled>اختر المدينة</option>
                            {availableCities.map(city => (
                              <option key={city} value={city}>{city}</option>
                            ))}
                          </select>
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            رقم الوثيقة <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="document_number"
                            value={formData.document_number}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                            placeholder="أدخل رقم وثيقة العقار"
                            required
                            dir="ltr"
                          />
                        </div>
                      </div>
                    </div>

                    {/* تفاصيل الطلب */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                          <Icons.FaMapMarkerAlt className="text-lg" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">تفاصيل الطلب</h3>
                          <p className="text-gray-500 text-sm">أدخل وصفاً تفصيلياً للمنتج العقاري</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          الوصف <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                          placeholder="أدخل وصف مفصل للعقار... (الموقع، المساحة، المميزات، الخدمات المتاحة، إلخ)"
                          rows="5"
                          required
                        />
                        <p className="text-gray-500 text-sm mt-2">
                          أدخل وصفاً تفصيلياً للعقار لزيادة فرص التسويق الناجح.
                        </p>
                      </div>
                    </div>

                    {/* المرفقات */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                            <Icons.FaImage className="text-lg" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">المرفقات</h3>
                            <p className="text-gray-500 text-sm">قم برفع صور للمنتج العقاري</p>
                          </div>
                        </div>
                        <span className="px-3 py-1 bg-[#53a1dd] text-white rounded-full text-sm font-medium">
                          {images.length}/5
                        </span>
                      </div>
                      
                      <div 
                        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
                          ${dragging ? 'border-[#53a1dd] bg-blue-50' : 'border-gray-300 hover:border-[#53a1dd] hover:bg-blue-50'}`}
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
                          className="hidden"
                        />
                        
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-20 h-20 bg-blue-100 text-[#53a1dd] rounded-full flex items-center justify-center">
                            <Icons.FaUpload className="text-3xl" />
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium mb-2">
                              اسحب الصور وأفلتها هنا، أو انقر للاختيار
                            </p>
                            <p className="text-gray-500 text-sm">
                              الحد الأقصى: 5 صور، حجم كل صورة لا يتجاوز 5MB
                            </p>
                          </div>
                        </div>
                      </div>

                      {imagesPreviews.length > 0 && (
                        <div className="mt-8">
                          <h4 className="text-lg font-bold text-gray-800 mb-4">الصور المرفوعة</h4>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {imagesPreviews.map((image, index) => (
                              <div key={index} className="relative group">
                                <div className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200">
                                  <img 
                                    src={image.preview} 
                                    alt={`صورة ${index + 1}`}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity"></div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                                >
                                  <Icons.FaTimes />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                                  <div className="truncate">
                                    {image.file.name.length > 15 ? 
                                      image.file.name.substring(0, 12) + '...' + image.file.name.substring(image.file.name.lastIndexOf('.')) : 
                                      image.file.name
                                    }
                                  </div>
                                  <div className="text-gray-300">
                                    {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* الشروط والأحكام */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <div className="flex items-start gap-4">
                        <input
                          type="checkbox"
                          name="terms_accepted"
                          checked={formData.terms_accepted}
                          onChange={handleInputChange}
                          className="mt-1 w-5 h-5 text-[#53a1dd] rounded focus:ring-[#53a1dd]"
                          required
                        />
                        <div>
                          <label className="text-gray-700 block mb-2">
                            أوافق على <a href="#" className="text-[#53a1dd] hover:text-[#478bc5] font-medium underline">الشروط والأحكام</a> الخاصة بتسويق المنتجات العقارية
                          </label>
                          <p className="text-gray-500 text-sm">
                            قرأت وفهمت الشروط والأحكام وأوافق عليها بالكامل، وأقر بصحة جميع المعلومات المقدمة.
                          </p>
                        </div>
                      </div>
                    </div>

                    {error && (
                      <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icons.FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                          <span className="text-red-700">{error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <button 
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إلغاء
                      </button>
                      
                      <button 
                        type="submit" 
                        className={`px-8 py-3 bg-[#53a1dd] text-white rounded-lg font-medium text-lg transition-colors w-full sm:w-auto
                          ${!isFormValid || loading 
                            ? 'opacity-60 cursor-not-allowed' 
                            : 'hover:bg-[#478bc5] shadow-md hover:shadow-lg'}`}
                        disabled={loading || !isFormValid}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            جاري الإرسال...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Icons.FaCheck />
                            إنشاء طلب التسويق
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
              
              {/* خطوات التقدم */}
              <div className="mt-12 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">خطوات إنشاء الطلب</h3>
                <div className="flex flex-col md:flex-row items-center justify-between relative">
                  {/* خطوط الاتصال */}
                  <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>
                  
                  <div className="relative z-10 flex flex-col items-center mb-8 md:mb-0 bg-white px-4">
                    <div className="w-12 h-12 rounded-full bg-[#53a1dd] text-white flex items-center justify-center mb-3 shadow-md">
                      <Icons.FaRegFileAlt className="text-lg" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">تعبئة النموذج</span>
                    <span className="text-xs text-gray-500 mt-1">الخطوة الأولى</span>
                  </div>
                  
                  <div className="hidden md:block">
                    <Icons.FaChevronRight className="text-gray-400" />
                  </div>
                  <div className="block md:hidden my-4">
                    <Icons.FaChevronRight className="text-gray-400 rotate-90" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center mb-8 md:mb-0 bg-white px-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-3">
                      <Icons.FaRegClock className="text-lg" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">المراجعة</span>
                    <span className="text-xs text-gray-400 mt-1">الخطوة الثانية</span>
                  </div>
                  
                  <div className="hidden md:block">
                    <Icons.FaChevronRight className="text-gray-400" />
                  </div>
                  <div className="block md:hidden my-4">
                    <Icons.FaChevronRight className="text-gray-400 rotate-90" />
                  </div>
                  
                  <div className="relative z-10 flex flex-col items-center bg-white px-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center mb-3">
                      <Icons.FaCheck className="text-lg" />
                    </div>
                    <span className="text-sm font-medium text-gray-400">الإكمال</span>
                    <span className="text-xs text-gray-400 mt-1">الخطوة الثالثة</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* معلومات إضافية */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#53a1dd] rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.FaRegClock />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">وقت المراجعة</h4>
                <p className="text-gray-600 text-sm">يتم مراجعة الطلبات خلال ٢٤-٤٨ ساعة عمل</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#53a1dd] rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.FaExclamationTriangle />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">نقاط مهمة</h4>
                <p className="text-gray-600 text-sm">تأكد من صحة جميع المعلومات قبل الإرسال</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#53a1dd] rounded-lg flex items-center justify-center flex-shrink-0">
                <Icons.FaCheck />
              </div>
              <div>
                <h4 className="font-bold text-gray-800 mb-1">ضمان الجودة</h4>
                <p className="text-gray-600 text-sm">جميع الطلبات تخضع لمراجعة الجودة</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default CreateAuctionRequest;