import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ModalContext } from '../../App'; 
import { useAuth } from '../../context/AuthContext';
// استبدال react-hot-toast بـ react-toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
  FaTimes,
  FaCheckCircle,
  FaFileContract
} from 'react-icons/fa';

// دالة مساعدة لعرض الرسائل
const showToast = (type, message, duration = 3000) => {
  const isMobile = window.innerWidth < 768;
  
  const options = {
    position: "top-right",
    autoClose: duration,
    rtl: true,
    theme: "light",
    style: {
      fontSize: isMobile ? "12px" : "14px",
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      borderRadius: isMobile ? "6px" : "8px",
      minHeight: isMobile ? "40px" : "50px",
      padding: isMobile ? "8px 10px" : "12px 14px",
      marginTop: isMobile ? "10px" : "0",
    },
    bodyStyle: {
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      fontSize: isMobile ? "12px" : "14px",
      textAlign: "right",
      direction: "rtl",
    },
  };

  switch(type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};

const PropertyDetailsPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin } = useContext(ModalContext); 
  const { currentUser } = useAuth();

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
      showToast('error', errorObj);
    } else if (errorObj.message) {
      showToast('error', errorObj.message);
    } else if (errorObj.details) {
      showToast('error', errorObj.details);
    } else if (errorObj.error) {
      showToast('error', errorObj.error);
    } else {
      showToast('error', 'حدث خطأ غير متوقع');
    }
  };

  // دالة لعرض رسائل النجاح
  const showApiSuccess = (message) => {
    showToast('success', message);
  };

  /**
   * دالة الحصول على نوع المستخدم الحالي
   */
  const getCurrentUserType = () => {
    return currentUser?.user_type || localStorage.getItem('user_type');
  };

  /**
   * دالة التحقق من صلاحية المستخدم لتقديم الاهتمام
   */
  const isUserAllowedToShowInterest = () => {
    const userType = getCurrentUserType();
    console.log('نوع المستخدم الحالي:', userType);
    
    const allowedTypes = ['مالك أرض', 'وكيل عقارات', 'مستثمر', 'فرد', 'مالك ارض', 'وكيل عقاري'];
    
    if (!userType) {
      return true;
    }
    
    return allowedTypes.includes(userType);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = type === 'land' 
        ? `https://core-api-x41.shaheenplus.sa/api/properties/${id}`
        : `https://core-api-x41.shaheenplus.sa/api/auctions/${id}`;

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
        const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`https://core-api-x41.shaheenplus.sa/api/user/favorites/${type}/${id}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result.isFavorite || false);
      } else {
        const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
      }
    } catch (error) {
      console.error('خطأ في التحقق من المفضلة:', error);
      const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
      setIsFavorite(favorites.includes(parseInt(id)));
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
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
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`https://core-api-x41.shaheenplus.sa/api/user/favorites/${type}/${id}`, {
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

  // Share Function
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

  // Back Function
  const handleBack = () => {
    const lastActiveTab = localStorage.getItem('lastActiveTab') || location.state?.fromTab;
    
    if (lastActiveTab) {
      navigate('/lands', { state: { activeTab: lastActiveTab } });
    } else {
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
    return imagePath ? `https://core-api-x41.shaheenplus.sa/storage/${imagePath}` : null;
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
    
    if (!token) {
      openLogin(() => {
        const userType = getCurrentUserType();
        
        if (userType === 'شركة مزادات') {
          showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات', 5000);
          return;
        }
        
        setShowInterestForm(true);
      });
      return;
    }
    
    const userType = getCurrentUserType();
    
    if (userType === 'شركة مزادات') {
      showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات', 5000);
      return;
    }
    
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
      showToast('error', "الرسالة يجب أن تكون أكثر من 10 أحرف", 5000);
      return false;
    }
    return true;
  };

  const handleSubmitInterest = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userType = getCurrentUserType();
    if (userType === 'شركة مزادات') {
      showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات', 5000);
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

      const token = localStorage.getItem('token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('إرسال البيانات:', requestData);
      console.log('الـ Token المستخدم:', token ? 'موجود' : 'غير موجود');

      const response = await fetch(`https://core-api-x41.shaheenplus.sa/api/properties/${id}/interest`, {
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
        showToast('success', successMessage);
        
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
      showToast('error', errorMessage, 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل التفاصيل...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={handleBack} 
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-700 text-lg mb-4">البيانات غير متوفرة</p>
          <button 
            onClick={handleBack} 
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const images = getAllImages();

  return (
    <div className="max-w-4xl mx-auto px-4 pb-6 pt-4" dir="rtl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button 
          onClick={handleBack} 
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          <FaArrowLeft />
          <span>رجوع</span>
        </button>
        <div className="flex gap-2">
          <button 
            className={`p-2.5 rounded-lg border ${isFavorite ? 'border-red-300 bg-red-50 text-red-500' : 'border-gray-300 hover:bg-gray-50'}`}
            onClick={toggleFavorite}
          >
            <FaHeart />
          </button>
          <button 
            className="p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={shareItem}
          >
            <FaShare />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        {images.length > 0 ? (
          <>
            <div className="relative rounded-xl overflow-hidden mb-4">
              <img 
                src={getImageUrl(images[selectedImage])} 
                alt="Main" 
                className="w-full h-80 object-cover cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              <button 
                className="absolute top-3 left-3 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
                onClick={() => setShowImageModal(true)}
              >
                <FaExpand />
              </button>

              {images.length > 1 && (
                <>
                  <button 
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
                    onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                  >
                    <FaArrowRight />
                  </button>
                  <button 
                    className="absolute top-1/2 left-3 transform -translate-y-1/2 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
                    onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                  >
                    <FaLeft />
                  </button>
                  
                  <div className="absolute bottom-3 left-3 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>
            
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${selectedImage === index ? 'border-blue-500' : 'border-transparent'}`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img 
                      src={getImageUrl(image)} 
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-60 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
            <FaBuilding className="text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500">لا توجد صور متاحة</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* العنوان أولاً */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">
            {type === 'land' ? data.title : cleanText(data.title)}
          </h1>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-bold ${
              data.status === 'معروض' ? 'bg-green-100 text-green-800' :
              data.status === 'مباع' || data.status === 'مغلق' ? 'bg-red-100 text-red-800' :
              data.status === 'محجوز' ? 'bg-amber-100 text-amber-800' :
              'bg-gray-100 text-gray-800'
            }`}>
              {data.status}
            </div>
            {/* إشارة التوثيق - تظهر فقط إذا كان هناك deed_number */}
            {type === 'land' && data.deed_number && (
              <div className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 rounded-full text-xs" title="موثق برقم صك">
                <FaCheckCircle className="text-xs" />
                <span>موثق</span>
              </div>
            )}
          </div>
        </div>

        {/* الوصف */}
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed">
            {type === 'land' ? data.description : cleanText(data.description)}
          </p>
        </div>

        {/* التاريخ */}
        <div className="text-sm text-gray-500 mb-6">
          <span>
            {type === 'land' 
              ? `تاريخ الإنشاء: ${formatDate(data.created_at)}`
              : `تاريخ المزاد: ${formatDate(data.auction_date)}`}
          </span>
        </div>

        {/* الموقع */}
        <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <FaMapMarkerAlt className="text-amber-500 mt-1" />
          <div>
            <h3 className="font-bold text-gray-700 mb-1">الموقع</h3>
            <p className="text-gray-600">
              {type === 'land' 
                ? `${data.region} - ${data.city}`
                : cleanText(data.address)}
            </p>
          </div>
        </div>

        {/* المواصفات */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            {type === 'land' ? 'تفاصيل العقار' : 'تفاصيل المزاد'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {type === 'land' ? (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaRulerCombined className="text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">المساحة الكلية</span>
                    <span className="font-semibold text-gray-700">{formatPrice(data.total_area)} م²</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaMoneyBillWave className="text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">سعر المتر</span>
                    <span className="font-semibold text-gray-700">{formatPrice(data.price_per_sqm)} ر.س</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaBuilding className="text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">نوع الأرض</span>
                    <span className="font-semibold text-gray-700">{data.land_type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaCalendarAlt className="text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">الغرض</span>
                    <span className="font-semibold text-gray-700">{data.purpose}</span>
                  </div>
                </div>
                {data.total_area && data.price_per_sqm && (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg col-span-1 sm:col-span-2">
                    <FaMoneyBillWave className="text-blue-600" />
                    <div>
                      <span className="block text-sm text-gray-700">السعر الإجمالي</span>
                      <span className="font-bold text-blue-600 text-lg">
                        {formatPrice(parseFloat(data.total_area) * parseFloat(data.price_per_sqm))} ر.س
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaBuilding className="text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">شركة المزاد</span>
                    <span className="font-semibold text-gray-700">{data.company?.auction_name}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <FaClock className="text-blue-500" />
                  <div>
                    <span className="block text-sm text-gray-500">وقت البدء</span>
                    <span className="font-semibold text-gray-700">{data.start_time}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* تفاصيل إضافية للأراضي فقط */}
        {type === 'land' && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل إضافية</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <span className="block text-sm text-gray-500 mb-1">رقم الإعلان</span>
                <span className="font-semibold text-gray-700">{data.announcement_number || 'غير محدد'}</span>
              </div>
              {/* {data.deed_number && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <span className="block text-sm text-blue-600 mb-1">رقم الصك</span>
                  <span className="font-semibold text-blue-700">{data.deed_number}</span>
                </div>
              )} */}
            </div>
          </div>
        )}
        
        {/* زر تقديم الاهتمام للأراضي فقط */}
        {type === 'land' && (
          <div className="mb-6">
            <button 
              className="w-full py-3.5 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all text-lg"
              onClick={handleShowInterestForm}
            >
              تقديم اهتمام
            </button>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div 
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={getImageUrl(images[selectedImage])} 
              alt="Modal" 
              className="w-full h-auto rounded-lg"
            />
            <button 
              className="absolute top-4 right-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
            >
              <FaArrowRight />
            </button>
            <button 
              className="absolute top-4 left-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
            >
              <FaLeft />
            </button>
            <button 
              className="absolute top-4 right-16 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
      )}

      {/* Interest Form Modal */}
      {showInterestForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">تقديم اهتمام بالعقار</h3>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100"
                  onClick={handleCloseInterestForm}
                >
                  <FaTimes />
                </button>
              </div>
              
              {submitResult ? (
                <div className={`p-6 rounded-lg text-center ${submitResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                  <p className={`mb-4 ${submitResult.success ? 'text-green-700' : 'text-red-700'}`}>
                    {submitResult.message}
                  </p>
                  {submitResult.success ? (
                    <button 
                      onClick={handleCloseInterestForm} 
                      className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                    >
                      إغلاق
                    </button>
                  ) : (
                    <div className="flex gap-3 justify-center">
                      {/* <button 
                        onClick={() => setSubmitResult(null)} 
                        className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                      >
                        حاول مرة أخرى
                      </button> */}
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleSubmitInterest}>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                      <span>رسالة</span>
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      placeholder="أدخل رسالتك أو استفسارك هنا (يجب أن يكون أكثر من 10 أحرف)"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                      required
                    />
                  </div>
                  
                  <button 
                    type="submit" 
                    className="w-full py-3.5 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={submitting}
                  >
                    {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;