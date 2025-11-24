import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ModalContext } from '../../App'; 
import { useAuth } from '../../context/AuthContext'; // استيراد useAuth
import { toast, Toaster } from 'react-hot-toast';

import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaCalendarAlt,
  FaBuilding,
  FaClock,
  FaExpand,
  FaArrowRight,
  FaArrowLeft as FaLeft,
  FaPhone,
  FaEnvelope,
  FaUser,
  FaTimes,
  FaCheckCircle, // إضافة هذه الأيقونة
  FaFileContract // إضافة هذه الأيقونة
} from 'react-icons/fa';
import '../../styles/PropertyDetailsModal.css';

const PropertyDetailsPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin } = useContext(ModalContext); 
  const { currentUser } = useAuth(); // استخدام useAuth

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showInterestForm, setShowInterestForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchData();
    checkFavoriteStatus();
    
    const token = localStorage.getItem('token');
    if (token) {
      console.log('تم العثور على token:', token.substring(0, 20) + '...');
    } else {
      console.log('لا يوجد token - المستخدم غير مسجل الدخول');
    }
  }, [id, type]);

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

  /**
   * دالة الحصول على نوع المستخدم الحالي
   */
  const getCurrentUserType = () => {
    // استخدام currentUser من AuthContext أولاً، ثم localStorage كبديل
    return currentUser?.user_type || localStorage.getItem('user_type');
  };

  /**
   * دالة التحقق من صلاحية المستخدم لتقديم الاهتمام
   */
  const isUserAllowedToShowInterest = () => {
    const userType = getCurrentUserType();
    console.log('نوع المستخدم الحالي:', userType);
    
    // الأنواع المسموح لها بتقديم الاهتمام (جميع الأنواع عدا شركة مزادات)
    const allowedTypes = ['مالك أرض', 'وكيل عقارات', 'مستثمر', 'فرد', 'مالك ارض', 'وكيل عقاري'];
    
    // إذا لم يكن هناك نوع مستخدم (مستخدم غير مسجل)، نسمح له بتسجيل الدخول أولاً
    if (!userType) {
      return true;
    }
    
    return allowedTypes.includes(userType);
  };

  /**
   * دالة الحصول على رسالة الخطأ
   */
  const getInterestErrorMessage = () => {
    const userType = getCurrentUserType();
    
    if (userType === 'شركة مزادات') {
      return 'عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات';
    }
    
    return 'عذراً، ليس لديك صلاحية لتقديم الاهتمام';
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = type === 'land' 
        ? `https://shahin-tqay.onrender.com/api/properties/${id}`
        : `https://shahin-tqay.onrender.com/api/auctions/${id}`;

      const headers = {
        'Content-Type': 'application/json',
      };

      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();
      
      if ((type === 'land' && result.status) || (type === 'auction' && result.success)) {
        setData(type === 'land' ? result.data : result.data);
      } else {
        throw new Error('البيانات غير متوفرة');
      }
      
      setLoading(false);
    } catch (error) {
      setError(error.message || 'فشل في جلب البيانات');
      showApiError(error);
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // إذا لم يكن هناك token، استخدم localStorage فقط
        const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
        return;
      }

      // إذا كان هناك token، تحقق من السيرفر
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`https://shahin-tqay.onrender.com/api/user/favorites/${type}/${id}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result.isFavorite || false);
      } else {
        // Fallback إلى localStorage إذا فشل الطلب
        const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
      }
    } catch (error) {
      console.error('خطأ في التحقق من المفضلة:', error);
      // Fallback إلى localStorage
      const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
      setIsFavorite(favorites.includes(parseInt(id)));
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // إذا لم يكن هناك token، استخدم localStorage فقط
      const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(favId => favId !== parseInt(id));
        showApiSuccess('تم إزالة العقار من المفضلة');
      } else {
        newFavorites = [...favorites, parseInt(id)];
        showApiSuccess('تم إضافة العقار إلى المفضلة');
      }

      localStorage.setItem(`${type}Favorites`, JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
      return;
    }

    try {
      // إذا كان هناك token، استخدم الـ API
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`https://shahin-tqay.onrender.com/api/user/favorites/${type}/${id}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: headers
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        
        if (isFavorite) {
          showApiSuccess('تم إزالة العقار من المفضلة');
        } else {
          showApiSuccess('تم إضافة العقار إلى المفضلة');
        }
        
        // تحديث localStorage أيضاً للحفاظ على التزامن
        const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
        let newFavorites;

        if (isFavorite) {
          newFavorites = favorites.filter(favId => favId !== parseInt(id));
        } else {
          newFavorites = [...favorites, parseInt(id)];
        }

        localStorage.setItem(`${type}Favorites`, JSON.stringify(newFavorites));
      } else {
        const errorData = await response.json();
        throw errorData;
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
      showApiError(error);
      // Fallback إلى localStorage
      const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(favId => favId !== parseInt(id));
      } else {
        newFavorites = [...favorites, parseInt(id)];
      }

      localStorage.setItem(`${type}Favorites`, JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    }
  };

  // Share Function - تم التعديل هنا
  const shareItem = () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: type === 'land' ? data.title : cleanText(data.title),
      text: type === 'land' 
        ? `أرض ${data.land_type} في ${data.region} - ${data.city}`
        : `مزاد: ${cleanText(data.title)}`,
      url: currentUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(currentUrl);
      showApiSuccess('تم نسخ الرابط للمشاركة!');
    }
  };

  // Back Function - تم التعديل هنا
  const handleBack = () => {
    // التحقق مما إذا كان هناك تبويب سابق محفوظ
    const lastActiveTab = localStorage.getItem('lastActiveTab') || location.state?.fromTab;
    
    if (lastActiveTab) {
      // العودة إلى قائمة التبويب المحدد
      navigate('/lands', { state: { activeTab: lastActiveTab } });
    } else {
      // العودة إلى الصفحة السابقة أو الصفحة الرئيسية
      navigate(-1);
    }
  };

  const cleanText = (text) => {
    if (typeof text === 'string') {
      return text.replace(/"/g, '');
    }
    return text || '';
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  const getImageUrl = (imagePath) => {
    return imagePath ? `https://shahin-tqay.onrender.com/storage/${imagePath}` : null;
  };

  const getAllImages = () => {
    if (!data) return [];
    
    const images = [];
    if (type === 'land') {
      if (data.cover_image) images.push(data.cover_image);
      if (data.images && data.images.length > 0) {
        images.push(...data.images.map(img => img.image_path));
      }
    } else {
      if (data.cover_image) images.push(data.cover_image);
      if (data.images && data.images.length > 0) {
        images.push(...data.images.map(img => img.image_path));
      }
    }
    return images;
  };

  const handleShowInterestForm = () => {
    const token = localStorage.getItem('token');
    console.log('التحقق من token في handleShowInterestForm:', token);
    console.log('بيانات المستخدم الحالي:', currentUser);
    
    if (!token) {
      // إذا لم يكن المستخدم مسجل الدخول، افتح نافذة تسجيل الدخول
      console.log('المستخدم غير مسجل الدخول - فتح نافذة تسجيل الدخول');
      openLogin(() => {
        // هذه الدالة ستنفذ بعد تسجيل الدخول بنجاح
        console.log('تم تسجيل الدخول بنجاح - التحقق من نوع المستخدم');
        
        // بعد تسجيل الدخول، currentUser سيكون محدثاً
        const userType = getCurrentUserType();
        console.log('نوع المستخدم بعد التسجيل:', userType);
        
        if (userType === 'شركة مزادات') {
          console.log('شركة مزادات - غير مسموح بتقديم الاهتمام');
          toast.error('عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات');
          return;
        }
        
        console.log('المستخدم مسجل الدخول ومسموح له - فتح فورم الاهتمام');
        setShowInterestForm(true);
      });
      return;
    }
    
    // التحقق من نوع المستخدم للمستخدمين المسجلين
    const userType = getCurrentUserType();
    console.log('نوع المستخدم الحالي للمستخدم المسجل:', userType);
    
    // إذا كان المستخدم شركة مزادات، منع تقديم الاهتمام
    if (userType === 'شركة مزادات') {
      console.log('شركة مزادات - غير مسموح بتقديم الاهتمام');
      toast.error('عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات');
      return;
    }
    
    // إذا كان مسجل الدخول وليس شركة مزادات، اعرض فورم الاهتمام مباشرة
    console.log('المستخدم مسجل الدخول ومسموح له - عرض فورم الاهتمام مباشرة');
    setShowInterestForm(true);
  };
  
  const handleCloseInterestForm = () => {
    setShowInterestForm(false);
    setSubmitResult(null);
    setFormData({
      full_name: '',
      phone: '',
      email: '',
      message: ''
    });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const validateForm = () => {
    if (formData.message.trim().length < 10) {
      showApiError("الرسالة يجب أن تكون أكثر من 10 أحرف");
      return false;
    }
    return true;
  };

  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    
    // التحقق من صحة النموذج
    if (!validateForm()) {
      return;
    }

    // التحقق النهائي من صلاحية المستخدم قبل الإرسال
    const userType = getCurrentUserType();
    if (userType === 'شركة مزادات') {
      showApiError('عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات');
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);
    
    try {
      const requestData = {
        message: formData.message
      };
      
      const headers = {
        'Content-Type': 'application/json',
      };

      // الحصول على الـ token وإضافته في كل عملية
      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('إرسال البيانات:', requestData);
      console.log('الـ Token المستخدم:', token ? 'موجود' : 'غير موجود');

      // استخدام الرابط الجديد
      const response = await fetch(`https://shahin-tqay.onrender.com/api/properties/${id}/interest`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestData),
      });
      
      const result = await response.json();
      console.log('استجابة السيرفر:', result);
      
      if (response.ok && result.success) {
        const successMessage = result.message || 'تم إرسال طلب الاهتمام بنجاح';
        setSubmitResult({
          success: true,
          message: successMessage
        });
        showApiSuccess(successMessage);
        
        setFormData({
          full_name: '',
          phone: '',
          email: '',
          message: ''
        });
        
        setTimeout(() => {
          setShowInterestForm(false);
        }, 3000);
      } else {
        // عرض رسالة الخطأ من الـ backend بشكل مباشر
        const errorMessage = result.message || result.error || 'حدث خطأ أثناء إرسال الطلب';
        setSubmitResult({
          success: false,
          message: errorMessage
        });
        showApiError(result);
      }
    } catch (error) {
      console.error('خطأ في الاتصال:', error);
      const errorMessage = 'حدث خطأ في الاتصال بالخادم';
      setSubmitResult({
        success: false,
        message: errorMessage
      });
      showApiError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="elegantLoading_container">
        <div className="elegantLoader"></div>
        <p>جاري تحميل التفاصيل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="elegantError_container">
        <p>{error}</p>
        <button onClick={handleBack}>العودة</button>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="elegantError_container">
        <p>البيانات غير متوفرة</p>
        <button onClick={handleBack}>العودة</button>
      </div>
    );
  }

  const images = getAllImages();

  return (
    <div className="elegantDetails_container">
      {/* إضافة Toaster هنا */}
    <Toaster
  position="top-center"
  reverseOrder={false}
  toastOptions={{
    duration: 4000,
    style: {
      background: '#fff', // تغيير الخلفية إلى الأبيض
      color: '#000', // تغيير لون النص إلى الأسود
      direction: 'rtl',
      fontFamily: 'Arial, sans-serif',
      border: '1px solid #e0e0e0', // إضافة حدود فاتحة
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', // إضافة ظل
    },
    success: {
      duration: 3000,
      iconTheme: {
        primary: '#22c55e', // لون أيقونة النجاح
        secondary: '#fff', // لون أيقونة النجاح
      },
    },
    error: {
      duration: 5000,
      iconTheme: {
        primary: '#ef4444', // لون أيقونة الخطأ
        secondary: '#fff', // لون أيقونة الخطأ
      },
    },
  }}
/>

      {/* Header - تم التعديل هنا */}
      <div className="elegantDetails_header">
        <button className="elegantBack_btn" onClick={handleBack}>
          <FaArrowLeft />
          <span>رجوع</span>
        </button>
        <div className="elegantHeader_actions">
          <button 
            className={`elegantFavorite_btn ${isFavorite ? 'elegantActive' : ''}`}
            onClick={toggleFavorite}
          >
            <FaHeart />
          </button>
          <button className="elegantShare_btn" onClick={shareItem}>
            <FaShare />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="elegantImage_gallery">
        {images.length > 0 ? (
          <>
            <div className="elegantMain_image">
              <img 
                src={getImageUrl(images[selectedImage])} 
                alt="Main" 
                onClick={() => setShowImageModal(true)}
              />
              <button 
                className="elegantExpand_btn"
                onClick={() => setShowImageModal(true)}
              >
                <FaExpand />
              </button>

              {images.length > 1 && (
                <>
                  <button 
                    className="elegantGallery_nav elegantPrev"
                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  >
                    <FaArrowRight />
                  </button>
                  <button 
                    className="elegantGallery_nav elegantNext"
                    onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                  >
                    <FaLeft />
                  </button>
                  
                  <div className="elegantGallery_count">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="elegantThumbnails">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`elegantThumbnail ${selectedImage === index ? 'elegantActive' : ''}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={getImageUrl(image)} alt={`Thumbnail ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="elegantNo_image">
            <FaBuilding />
            <p>لا توجد صور متاحة</p>
          </div>
        )}
      </div>

      {/* Main Content */}
   <div className="elegantDetails_content">
  {/* العنوان أولاً */}
  <div className="elegantTitle_section">
    <h1>{type === 'land' ? data.title : cleanText(data.title)}</h1>
    <div className="elegantStatus_container">
      <div className={`elegantStatus_badge ${data.status?.toLowerCase()}`}>
        {data.status}
      </div>
      {/* إشارة التوثيق - تظهر فقط إذا كان هناك deed_number */}
      {type === 'land' && data.deed_number && (
        <div className="elegantVerification_indicator" title="موثق برقم صك">
          <FaCheckCircle />
          <span>موثق</span>
        </div>
      )}
    </div>
  </div>

        {/* الوصف مباشرة تحت العنوان بدون عنوان */}
        <div className="elegantDescription_section">
          <p>{type === 'land' ? data.description : cleanText(data.description)}</p>
        </div>

        {/* التاريخ */}
        <div className="elegantDate_section">
          <span>
            {type === 'land' 
              ? `تاريخ الإنشاء: ${formatDate(data.created_at)}`
              : `تاريخ المزاد: ${formatDate(data.auction_date)}`}
          </span>
        </div>

        {/* الموقع */}
        <div className="elegantLocation_section">
          <FaMapMarkerAlt className="elegantSection_icon" />
          <div className="elegantLocation_info">
            <h3>الموقع</h3>
            <p>
              {type === 'land' 
                ? `${data.region} - ${data.city}`
                : cleanText(data.address)}
            </p>
            {/* {type === 'land' && data.geo_location_text && (
              <span className="elegantLocation_detail">{data.geo_location_text}</span>
            )} */}
          </div>
        </div>

        {/* المواصفات */}
        <div className="elegantSpecs_section">
          <h3>{type === 'land' ? 'تفاصيل العقار' : 'تفاصيل المزاد'}</h3>
          <div className="elegantSpecs_grid">
            {type === 'land' ? (
              <>
                <div className="elegantSpec_item">
                  <FaRulerCombined />
                  <div>
                    <span className="elegantSpec_label">المساحة الكلية</span>
                    <span className="elegantSpec_value">{formatPrice(data.total_area)} م²</span>
                  </div>
                </div>
                <div className="elegantSpec_item">
                  <FaMoneyBillWave />
                  <div>
                    <span className="elegantSpec_label">سعر المتر</span>
                    <span className="elegantSpec_value">{formatPrice(data.price_per_sqm)} ر.س</span>
                  </div>
                </div>
                <div className="elegantSpec_item">
                  <FaBuilding />
                  <div>
                    <span className="elegantSpec_label">نوع الأرض</span>
                    <span className="elegantSpec_value">{data.land_type}</span>
                  </div>
                </div>
                <div className="elegantSpec_item">
                  <FaCalendarAlt />
                  <div>
                    <span className="elegantSpec_label">الغرض</span>
                    <span className="elegantSpec_value">{data.purpose}</span>
                  </div>
                </div>
                {data.total_area && data.price_per_sqm && (
                  <div className="elegantSpec_item elegantTotal_price">
                    <FaMoneyBillWave />
                    <div>
                      <span className="elegantSpec_label">السعر الإجمالي</span>
                      <span className="elegantSpec_value">
                        {formatPrice(parseFloat(data.total_area) * parseFloat(data.price_per_sqm))} ر.س
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="elegantSpec_item">
                  <FaBuilding />
                  <div>
                    <span className="elegantSpec_label">شركة المزاد</span>
                    <span className="elegantSpec_value">{data.company?.auction_name}</span>
                  </div>
                </div>
                <div className="elegantSpec_item">
                  <FaClock />
                  <div>
                    <span className="elegantSpec_label">وقت البدء</span>
                    <span className="elegantSpec_value">{data.start_time}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* تفاصيل إضافية للأراضي فقط */}
        {type === 'land' && (
          <div className="elegantAdditional_section">
            <h3>تفاصيل إضافية</h3>
            <div className="elegantAdditional_grid">
              <div className="elegantDetail_item">
                <span className="elegantDetail_label">رقم الإعلان</span>
                <span className="elegantDetail_value">{data.announcement_number}</span>
              </div>
            </div>
          </div>
        )}
        
        {/* زر تقديم الاهتمام للأراضي فقط */}
        {type === 'land' && (
          <div className="elegantInterest_section">
            <button 
              className="elegantInterest_btn" 
              onClick={handleShowInterestForm}
            >
              تقديم اهتمام
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="elegantImage_modal" onClick={() => setShowImageModal(false)}>
          <div className="elegantModal_content" onClick={(e) => e.stopPropagation()}>
            <img src={getImageUrl(images[selectedImage])} alt="Modal" />
            <button 
              className="elegantModal_nav elegantModal_prev"
              onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
            >
              <FaArrowRight />
            </button>
            <button 
              className="elegantModal_nav elegantModal_next"
              onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
            >
              <FaLeft />
            </button>
            <button 
              className="elegantModal_close"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Interest Form Modal */}
      {showInterestForm && (
        <div className="elegantForm_modal">
          <div className="elegantForm_content">
            <button 
              className="elegantModal_close" 
              onClick={handleCloseInterestForm}
            >
              <FaTimes />
            </button>
            <h3>تقديم اهتمام بالعقار</h3>
            
            {submitResult ? (
              <div className={`elegantSubmit_result ${submitResult.success ? 'success' : 'error'}`}>
                <p>{submitResult.message}</p>
                {submitResult.success ? (
                  <button onClick={handleCloseInterestForm} className="elegantCloseResult_btn">
                    إغلاق
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => setSubmitResult(null)} className="elegantTryAgain_btn">
                      حاول مرة أخرى
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitInterest}>
                <div className="elegantForm_group">
                  <label>
                    <span>رسالة</span>
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="أدخل رسالتك أو استفسارك هنا (يجب أن يكون أكثر من 10 أحرف)"
                    rows={4}
                    required
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="elegantSubmit_btn"
                  disabled={submitting}
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;