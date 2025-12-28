import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ModalContext } from '../../App'; 
import { useAuth } from '../../context/AuthContext';
import { toast, ToastContainer } from 'react-toastify';
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
  FaFileContract,
  FaDollarSign,
  FaChartLine,
  FaCalendarDay,
  FaInfoCircle,
  FaTag,
  FaIdCard
} from 'react-icons/fa';

// مسار أيقونة الريال السعودي
const riyalIconUrl = '/images/rail.svg';

// مكون أيقونة الريال السعودي
const SaudiRiyalIcon = ({ className = "w-4 h-4" }) => {
  return (
    <img 
      src={riyalIconUrl}
      alt="ريال سعودي"
      className={`inline-block ${className}`}
      style={{ 
        verticalAlign: "middle"
      }}
      onError={(e) => {
        console.error('فشل تحميل أيقونة الريال');
        e.target.style.display = 'none';
      }}
    />
  );
};

// دالة لعرض السعر مع أيقونة الريال
const formatPriceWithIcon = (price) => {
  if (!price) return (
    <span className="inline-flex items-center gap-1">
      <span>0</span>
      <SaudiRiyalIcon className="w-4 h-4" />
    </span>
  );
  
  const formattedPrice = parseFloat(price).toLocaleString('ar-SA');
  return (
    <span className="inline-flex items-center gap-1">
      <span>{formattedPrice}</span>
      <SaudiRiyalIcon className="w-4 h-4" />
    </span>
  );
};

// دالة لعرض السعر بدون أيقونة (للمساحة)
const formatPrice = (price) => {
  if (!price) return '0';
  return parseFloat(price).toLocaleString('ar-SA');
};

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

// مكون بطاقة المعلومة
const InfoCard = ({ icon: Icon, title, value, color = "blue", unit = "", className = "" }) => (
  <div className={`flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:shadow-sm transition-shadow ${className}`}>
    <div className={`p-2 rounded-lg ${color === 'blue' ? 'bg-blue-50 text-blue-500' : 
                        color === 'green' ? 'bg-green-50 text-green-500' :
                        color === 'amber' ? 'bg-amber-50 text-amber-500' :
                        'bg-gray-50 text-gray-500'}`}>
      <Icon className="text-lg" />
    </div>
    <div className="flex-1">
      <span className="block text-sm text-gray-500 mb-1">{title}</span>
      <span className="block font-semibold text-gray-800 text-lg">
        {value} {unit && <span className="text-sm text-gray-500">{unit}</span>}
      </span>
    </div>
  </div>
);

// مكون بطاقة الأبعاد
const DimensionCard = ({ title, value, unit = "م" }) => (
  <div className="p-3 bg-gray-50 rounded-lg text-center">
    <span className="block text-sm text-gray-500 mb-1">{title}</span>
    <span className="block font-bold text-gray-700">
      {formatPrice(value)} {unit}
    </span>
  </div>
);

const PropertyDetailsPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { openLogin } = useContext(ModalContext); 
  const { currentUser } = useAuth();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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
  setFormData({
    full_name: '',
    phone: '',
    email: '',
    message: ''
  });
  setSubmitting(false);
  // لا نحتاج لـ submitResult بعد الآن
};
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
const validateForm = () => {
  const trimmedMessage = formData.message.trim();
  
  if (trimmedMessage.length < 10) {
    showToast('error', "الرسالة يجب أن تكون أكثر من 10 أحرف", 5000);
    return false; // الفورم يبقى مفتوحاً
  }
  
  if (trimmedMessage.length > 2000) {
    showToast('error', "الرسالة يجب أن تكون أقل من 2000 حرف", 5000);
    return false; // الفورم يبقى مفتوحاً
  }
  
  return true;
};

const handleSubmitInterest = async (e) => {
  e.preventDefault();
  
  // التحقق من طول الحروف - هنا يجب أن يبقى الفورم مفتوحاً
  const trimmedMessage = formData.message.trim();
  
  if (trimmedMessage.length < 10) {
    showToast('error', "الرسالة يجب أن تكون أكثر من 10 أحرف", 5000);
    return; // لا تغلق الفورم هنا
  }
  
  if (trimmedMessage.length > 2000) {
    showToast('error', "الرسالة يجب أن تكون أقل من 2000 حرف", 5000);
    return; // لا تغلق الفورم هنا
  }

  const userType = getCurrentUserType();
  if (userType === 'شركة مزادات') {
    showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات', 5000);
    setShowInterestForm(false); // إغلاق فوري
    return;
  }

  setSubmitting(true);
  setSubmitResult(null);
  
  try {
    const requestData = {
      message: trimmedMessage
    };
    
    const headers = {
      'Content-Type': 'application/json',
    };

    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`https://core-api-x41.shaheenplus.sa/api/properties/${id}/interest`, {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestData),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      const successMessage = result.message || 'تم إرسال طلب الاهتمام بنجاح';
      showToast('success', successMessage);
      
      // إغلاق الفورم فوراً عند النجاح
      setShowInterestForm(false);
      setFormData({
        full_name: '',
        phone: '',
        email: '',
        message: ''
      });
      
    } else {
      const errorMessage = result.message || result.error || 'حدث خطأ أثناء إرسال الطلب';
      showToast('error', errorMessage, 5000);
      // إغلاق الفورم فوراً عند فشل API
      setShowInterestForm(false);
    }
  } catch (error) {
    console.error('خطأ في الاتصال:', error);
    const errorMessage = 'حدث خطأ في الاتصال بالخادم';
    showToast('error', errorMessage, 5000);
    // إغلاق الفورم فوراً عند خطأ الاتصال
    setShowInterestForm(false);
  } finally {
    setSubmitting(false);
  }
};

  // دالة لحساب السعر الإجمالي للأراضي المعروضة للبيع
  const calculateTotalPrice = () => {
    if (!data || data.purpose !== 'بيع') return null;
    if (!data.total_area || !data.price_per_sqm) return null;
    
    const totalArea = parseFloat(data.total_area);
    const pricePerSqm = parseFloat(data.price_per_sqm);
    
    if (isNaN(totalArea) || isNaN(pricePerSqm)) return null;
    
    return totalArea * pricePerSqm;
  };

  // دالة للتحقق من وجود بيانات الأبعاد
  const hasDimensions = () => {
    return data && (
      data.length_north || 
      data.length_south || 
      data.length_east || 
      data.length_west
    );
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
  const totalPrice = calculateTotalPrice();
  const isForSale = data.purpose === 'بيع';
  const isForInvestment = data.purpose === 'استثمار';

  return (
    <div className="max-w-6xl mx-auto px-4 pb-6 pt-[80px]" dir="rtl">
      {/* Toast Container للمكون الحالي */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        draggable
        rtl
        pauseOnHover
        theme="light"
        style={{
          top: window.innerWidth < 768 ? "80px" : "80px",
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
      />

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
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        {/* العنوان أولاً */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {data.title}
            </h1>
            <div className="flex items-center gap-3 text-gray-600 mb-4">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-amber-500" />
                <span>{data.region} - {data.city}</span>
              </div>
              {data.geo_location_text && (
                <div className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {data.geo_location_text}
                </div>
              )}
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 items-start">
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              data.status === 'مفتوح' || data.status === 'معروض' ? 'bg-green-100 text-green-800 border border-green-200' :
              data.status === 'مباع' || data.status === 'مغلق' ? 'bg-red-100 text-red-800 border border-red-200' :
              data.status === 'محجوز' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
              'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {data.status}
            </div>
            
            <div className={`px-4 py-2 rounded-full text-sm font-bold ${
              isForSale ? 'bg-blue-100 text-blue-800 border border-blue-200' :
              isForInvestment ? 'bg-purple-100 text-purple-800 border border-purple-200' :
              'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {data.purpose}
            </div>
          </div>
        </div>

        {/* الوصف */}
        <div className="mb-8 p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <FaInfoCircle className="text-blue-500" />
            <h3 className="font-bold text-gray-700">الوصف</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-right">
            {data.description || 'لا يوجد وصف'}
          </p>
        </div>

        {/* معلومات العقار الرئيسية */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            معلومات العقار الأساسية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <InfoCard
              icon={FaTag}
              title="نوع العقار"
              value={data.land_type}
              color="blue"
            />
            
            <InfoCard
              icon={FaCalendarAlt}
              title="رقم الإعلان"
              value={data.announcement_number || 'غير محدد'}
              color="amber"
            />
            
            {data.legal_declaration && (
              <InfoCard
                icon={FaCheckCircle}
                title="الإقرار القانوني"
                value={data.legal_declaration}
                color={data.legal_declaration === 'نعم' ? 'green' : 'amber'}
              />
            )}
          </div>
        </div>

        {/* تفاصيل حسب الغرض */}
        {isForSale ? (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
              تفاصيل البيع
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <InfoCard
                icon={FaRulerCombined}
                title="المساحة الكلية"
                value={formatPrice(data.total_area)}
                unit="م²"
                color="blue"
              />
              
              <InfoCard
                icon={FaMoneyBillWave}
                title="سعر المتر المربع"
                value={formatPriceWithIcon(data.price_per_sqm)}
                color="green"
              />
              
              {totalPrice && (
                <InfoCard
                  icon={FaDollarSign}
                  title="السعر الإجمالي"
                  value={formatPriceWithIcon(totalPrice)}
                  color="green"
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                />
              )}
            </div>
          </div>
        ) : isForInvestment ? (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
              تفاصيل الاستثمار
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              <InfoCard
                icon={FaRulerCombined}
                title="المساحة الكلية"
                value={formatPrice(data.total_area)}
                unit="م²"
                color="blue"
              />
              
              <InfoCard
                icon={FaChartLine}
                title="القيمة الاستثمارية المقدرة"
                value={formatPriceWithIcon(data.estimated_investment_value)}
                color="purple"
              />
              
              <InfoCard
                icon={FaCalendarDay}
                title="مدة الاستثمار"
                value={data.investment_duration}
                unit="سنة"
                color="amber"
              />
            </div>
          </div>
        ) : null}

        {/* الأبعاد */}
        {hasDimensions() && (
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
              أبعاد الأرض
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {data.length_north && (
                <DimensionCard title="الطول شمالاً" value={data.length_north} />
              )}
              {data.length_south && (
                <DimensionCard title="الطول جنوباً" value={data.length_south} />
              )}
              {data.length_east && (
                <DimensionCard title="الطول شرقاً" value={data.length_east} />
              )}
              {data.length_west && (
                <DimensionCard title="الطول غرباً" value={data.length_west} />
              )}
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            معلومات إضافية
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-gray-700 font-medium">تاريخ الإنشاء</span>
              </div>
              <p className="text-gray-800 font-semibold">{formatDate(data.created_at)}</p>
            </div>
            
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-gray-700 font-medium">تاريخ التحديث الأخير</span>
              </div>
              <p className="text-gray-800 font-semibold">{formatDate(data.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* زر تقديم الاهتمام */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button 
            className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all text-lg shadow-md hover:shadow-lg"
            onClick={handleShowInterestForm}
          >
            {isForSale ? 'تقديم عرض للشراء' : isForInvestment ? 'تقديم طلب للاستثمار' : 'تقديم اهتمام'}
          </button>
          
          <p className="text-center text-gray-500 mt-3 text-sm">
            {isForSale 
              ? 'للتقديم على شراء هذا العقار، يرجى تعبئة النموذج'
              : isForInvestment
              ? 'للتقديم على الاستثمار في هذا العقار، يرجى تعبئة النموذج'
              : 'لتقديم اهتمامك بهذا العقار، يرجى تعبئة النموذج'}
          </p>
        </div>
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
                <h3 className="text-xl font-bold text-gray-800">
                  {isForSale ? 'تقديم عرض للشراء' : isForInvestment ? 'تقديم طلب للاستثمار' : 'تقديم اهتمام'}
                </h3>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100"
                  onClick={handleCloseInterestForm}
                  disabled={submitting}
                >
                  <FaTimes />
                </button>
              </div>
              
              {/* نعرض الفورم مباشرة بدون حالة submitResult */}
              <form onSubmit={handleSubmitInterest}>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-gray-700 font-medium">
                      <span>رسالتك</span>
                    </label>
                    <div className={`text-xs font-medium ${
                      formData.message.trim().length === 0 ? 'text-gray-500' :
                      formData.message.trim().length < 10 ? 'text-red-500' : 
                      'text-green-500'
                    }`}>
                      {formData.message.trim().length}/10 حرف
                    </div>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={(e) => {
                      handleInputChange(e);
                      e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
                    }}
                    placeholder={
                      isForSale 
                        ? "أدخل رسالتك وعرضك للشراء هنا (يجب أن يكون أكثر من 10 أحرف)"
                        : isForInvestment
                        ? "أدخل رسالتك وخطة الاستثمار المقترحة هنا (يجب أن يكون أكثر من 10 أحرف)"
                        : "أدخل رسالتك أو استفسارك هنا (يجب أن يكون أكثر من 10 أحرف)"
                    }
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none"
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      {isForSale 
                        ? "اكتب تفاصيل عرض الشراء والسعر المقترح"
                        : isForInvestment
                        ? "اكتب خطة الاستثمار والمدة المقترحة"
                        : "اكتب رسالة مفصلة عن اهتمامك"}
                    </div>
                    <div className="text-xs text-blue-500">
                      {formData.message.trim().length >= 10 ? '✓ جاهز للإرسال' : 'اكتب 10 أحرف على الأقل'}
                    </div>
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-3.5 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={submitting}
                >
                  {submitting ? 'جاري الإرسال...' : 'إرسال الطلب'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;