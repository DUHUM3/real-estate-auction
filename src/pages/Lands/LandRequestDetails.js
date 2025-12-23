// src/pages/LandRequestDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App';
import { useAuth } from '../../context/AuthContext';
// استبدال react-hot-toast بـ react-toastify
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaCalendarAlt,
  FaBuilding,
  FaExpand,
  FaArrowRight,
  FaArrowLeft as FaLeft,
  FaTimes,
  FaPaperPlane,
  FaEdit,
  FaHandshake,
  FaCity
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

const LandRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

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

  useEffect(() => {
    fetchRequestDetails();
    
    if (window.location.hash === '#offer') {
      setTimeout(() => {
        const offerSection = document.getElementById('offer');
        if (offerSection) offerSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(
        `https://core-api-x41.shaheenplus.sa/api/land-requests/${id}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();
      setRequest(result.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ خطأ في تحميل التفاصيل:', err);
      showApiError(err);
      
      if (err.response?.status === 404) {
        setError('لم يتم العثور على الطلب');
      } else {
        setError('حدث خطأ أثناء تحميل تفاصيل الطلب');
      }
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
        return;
      }

      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`https://core-api-x41.shaheenplus.sa/api/user/favorites/request/${id}`, {
        method: 'GET',
        headers: headers
      });

      if (response.ok) {
        const result = await response.json();
        setIsFavorite(result.isFavorite || false);
      } else {
        const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
        setIsFavorite(favorites.includes(parseInt(id)));
      }
    } catch (error) {
      console.error('خطأ في التحقق من المفضلة:', error);
      const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
      setIsFavorite(favorites.includes(parseInt(id)));
    }
  };

  const toggleFavorite = async () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(favId => favId !== parseInt(id));
        showApiSuccess('تم إزالة الطلب من المفضلة');
      } else {
        newFavorites = [...favorites, parseInt(id)];
        showApiSuccess('تم إضافة الطلب إلى المفضلة');
      }

      localStorage.setItem('requestFavorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
      return;
    }

    try {
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const response = await fetch(`https://core-api-x41.shaheenplus.sa/api/user/favorites/request/${id}`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: headers
      });

      if (response.ok) {
        setIsFavorite(!isFavorite);
        
        if (isFavorite) {
          showApiSuccess('تم إزالة الطلب من المفضلة');
        } else {
          showApiSuccess('تم إضافة الطلب إلى المفضلة');
        }
        
        const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
        let newFavorites;

        if (isFavorite) {
          newFavorites = favorites.filter(favId => favId !== parseInt(id));
        } else {
          newFavorites = [...favorites, parseInt(id)];
        }

        localStorage.setItem('requestFavorites', JSON.stringify(newFavorites));
      } else {
        const errorData = await response.json();
        throw errorData;
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
      showApiError(error);
      
      const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
      let newFavorites;

      if (isFavorite) {
        newFavorites = favorites.filter(favId => favId !== parseInt(id));
      } else {
        newFavorites = [...favorites, parseInt(id)];
      }

      localStorage.setItem('requestFavorites', JSON.stringify(newFavorites));
      setIsFavorite(!isFavorite);
    }
  };

  const shareItem = () => {
    const shareData = {
      title: `طلب أرض - ${request.region} - ${request.city}`,
      text: `طلب أرض ${getTypeLabel(request.type)} في ${request.region} - ${request.city}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showApiSuccess('تم نسخ الرابط للمشاركة!');
    }
  };

  /**
   * دالة الحصول على نوع المستخدم الحالي
   */
  const getCurrentUserType = () => {
    return currentUser?.user_type || localStorage.getItem('user_type');
  };

  /**
   * دالة التحقق من صلاحية المستخدم لتقديم العروض
   */
  const isUserAllowedToOffer = () => {
    const userType = getCurrentUserType();
    console.log('نوع المستخدم الحالي:', userType);
    
    const allowedTypes = ['مالك أرض', 'وكيل عقارات', 'مستثمر', 'فرد', 'مالك ارض', 'وكيل عقاري'];
    
    if (!userType) {
      return true;
    }
    
    return allowedTypes.includes(userType);
  };

  const handleShowOfferForm = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      openLogin(() => {
        const userType = getCurrentUserType();
        
        if (userType === 'شركة مزادات') {
          showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات', 5000);
          return;
        }
        
        setShowOfferForm(true);
      });
      return;
    }
    
    const userType = getCurrentUserType();
    
    if (userType === 'شركة مزادات') {
      showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات', 5000);
      return;
    }
    
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setOfferMessage('');
  };

const validateForm = () => {
  const trimmedMessage = offerMessage.trim();
  
  if (trimmedMessage.length < 10) {
    showToast('error', "تفاصيل العرض يجب أن تكون أكثر من 10 أحرف", 5000);
    
    // إضافة تأثير مرئي لحقل الإدخال
    const textarea = document.querySelector('textarea[name="offerMessage"]');
    if (textarea) {
      textarea.classList.add('border-red-500', 'ring-2', 'ring-red-200');
      setTimeout(() => {
        textarea.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
      }, 3000);
    }
    
    return false; // الفورم يبقى مفتوحاً
  }
  
  if (trimmedMessage.length > 2000) {
    showToast('error', "تفاصيل العرض يجب أن تكون أقل من 2000 حرف", 5000);
    return false; // الفورم يبقى مفتوحاً
  }
  
  return true;
};

 const handleOfferSubmit = async (e) => {
  e.preventDefault();
  
  if (!offerMessage.trim()) {
    showToast('error', 'يرجى إدخال تفاصيل العرض', 3000);
    return;
  }

  // التحقق من طول الحروف - هنا يجب أن يبقى الفورم مفتوحاً
  if (offerMessage.trim().length < 10) {
    showToast('error', "تفاصيل العرض يجب أن تكون أكثر من 10 أحرف", 5000);
    
    // إضافة تأثير مرئي لحقل الإدخال
    const textarea = document.querySelector('textarea[name="offerMessage"]');
    if (textarea) {
      textarea.classList.add('border-red-500', 'ring-2', 'ring-red-200');
      setTimeout(() => {
        textarea.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
      }, 3000);
    }
    
    return; // لا تغلق الفورم هنا
  }
  
  // التحقق من الحد الأقصى للحروف
  if (offerMessage.trim().length > 2000) {
    showToast('error', "تفاصيل العرض يجب أن تكون أقل من 2000 حرف", 5000);
    return; // لا تغلق الفورم هنا أيضاً
  }

  try {
    setOfferLoading(true);
    
    const token = localStorage.getItem('token');
    
    if (!token) {
      showToast('error', 'يجب تسجيل الدخول أولاً', 3000);
      setOfferLoading(false);
      setShowOfferForm(false); // هنا نغلق الفورم
      navigate('/login');
      return;
    }

    const userType = getCurrentUserType();
    if (userType === 'شركة مزادات') {
      showToast('error', 'عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات', 5000);
      setOfferLoading(false);
      setShowOfferForm(false); // هنا نغلق الفورم
      return;
    }

    const response = await fetch(
      `https://core-api-x41.shaheenplus.sa/api/land-requests/${id}/offers`,
      {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          message: offerMessage.trim()
        })
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      const successMessage = result.message || 'تم تقديم العرض بنجاح!';
      showToast('success', successMessage);
      
      // إغلاق الفورم عند النجاح
      setShowOfferForm(false);
      setOfferMessage('');
      setOfferLoading(false);
      
    } else {
      // في حالة فشل الـ API، نغلق الفورم أيضاً
      const errorMessage = result.message || 'حدث خطأ في تقديم العرض';
      showToast('error', errorMessage);
      setShowOfferForm(false); // هنا نغلق الفورم
      setOfferLoading(false);
    }
    
  } catch (err) {
    console.error('❌ خطأ في تقديم العرض:', err);
    setOfferLoading(false);
    showApiError(err);
    setShowOfferForm(false); // هنا نغلق الفورم بعد خطأ الـ API
  }
};
  const getPurposeLabel = (purpose) => purpose === 'sale' ? 'بيع' : 'إيجار';
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential': return 'سكني';
      case 'commercial': return 'تجاري';
      case 'agricultural': return 'زراعي';
      default: return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'closed': return 'مغلق';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'open';
      case 'closed': return 'closed';
      case 'completed': return 'completed';
      default: return 'default';
    }
  };

  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  const getAllImages = () => {
    if (!request || !request.images) return [];
    return request.images.map(img => img.image_path);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-700 text-lg mb-4">البيانات غير متوفرة</p>
          <button 
            onClick={() => navigate(-1)} 
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
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          <FaArrowLeft />
          <span>العودة</span>
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
      {images.length > 0 && (
        <div className="mb-8">
          <div className="relative rounded-xl overflow-hidden mb-4">
            <img 
              src={`https://core-api-x41.shaheenplus.sa/storage/${images[selectedImage]}`} 
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
                    src={`https://core-api-x41.shaheenplus.sa/storage/${image}`} 
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {/* العنوان أولاً */}
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-800">طلب أرض #{request.id}</h1>
          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
            request.status === 'open' ? 'bg-green-100 text-green-800' :
            request.status === 'closed' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {getStatusLabel(request.status)}
          </div>
        </div>

        {/* الوصف */}
        <div className="mb-6">
          <p className="text-gray-600 leading-relaxed">{request.description}</p>
        </div>

        {/* التاريخ */}
        <div className="text-sm text-gray-500 mb-6">
          <span>تاريخ الإنشاء: {request.created_at}</span>
        </div>

        {/* الموقع */}
        <div className="flex items-start gap-3 mb-6 p-4 bg-gray-50 rounded-lg">
          <FaMapMarkerAlt className="text-amber-500 mt-1" />
          <div>
            <h3 className="font-bold text-gray-700 mb-1">الموقع</h3>
            <p className="text-gray-600">{request.region} - {request.city}</p>
          </div>
        </div>

        {/* تفاصيل الطلب */}
        <div className="mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">تفاصيل الطلب</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaHandshake className="text-blue-500" />
              <div>
                <span className="block text-sm text-gray-500">الغرض</span>
                <span className="font-semibold text-gray-700">{getPurposeLabel(request.purpose)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaBuilding className="text-blue-500" />
              <div>
                <span className="block text-sm text-gray-500">النوع</span>
                <span className="font-semibold text-gray-700">{getTypeLabel(request.type)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaRulerCombined className="text-blue-500" />
              <div>
                <span className="block text-sm text-gray-500">المساحة المطلوبة</span>
                <span className="font-semibold text-gray-700">{formatPrice(request.area)} م²</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <FaCity className="text-blue-500" />
              <div>
                <span className="block text-sm text-gray-500">المدينة</span>
                <span className="font-semibold text-gray-700">{request.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Button */}
        {request.status === 'open' && (
          <div className="mb-6" id="offer">
            <button 
              className="w-full py-3.5 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all text-lg"
              onClick={handleShowOfferForm}
            >
              تقديم عرض
            </button>
          </div>
        )}

        {/* Closed Message */}
        {request.status !== 'open' && (
          <div className="text-center py-6 border-t border-gray-200 mt-6">
            <div className="text-3xl mb-3">🔒</div>
            <p className="text-gray-600">
              هذا الطلب {request.status === 'closed' ? 'مغلق' : 'مكتمل'} ولا يمكن تقديم عروض جديدة
            </p>
          </div>
        )}
      </div>

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">تقديم عرض على الطلب</h3>
                <button 
                  className="p-2 rounded-lg hover:bg-gray-100"
                  onClick={handleCloseOfferForm}
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleOfferSubmit}>
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <label className="flex items-center gap-2 text-gray-700 font-medium">
                      <FaEdit />
                      <span>تفاصيل العرض</span>
                    </label>
                    <div className={`text-xs font-medium ${
                      offerMessage.trim().length === 0 ? 'text-gray-500' :
                      offerMessage.trim().length < 10 ? 'text-red-500' : 
                      'text-green-500'
                    }`}>
                      {offerMessage.trim().length}/10 حرف
                    </div>
                  </div>
                  <textarea
                    name="offerMessage"
                    value={offerMessage}
                    onChange={(e) => {
                      setOfferMessage(e.target.value);
                      // إزالة تأثير الخطأ عند البدء في الكتابة
                      e.target.classList.remove('border-red-500', 'ring-2', 'ring-red-200');
                    }}
                    placeholder="أدخل تفاصيل العرض هنا... مثلاً: لدي أرض تناسب متطلباتك في الموقع المطلوب مع توفر جميع الخدمات..."
                    rows={5}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all"
                    required
                  />
                  <div className="flex justify-between items-center mt-2">
                    <div className="text-xs text-gray-500">
                      اكتب وصفاً واضحاً ومفصلاً لعرضك
                    </div>
                    <div className="text-xs text-blue-500">
                      {offerMessage.trim().length >= 10 ? '✓ جاهز للإرسال' : 'اكتب 10 أحرف على الأقل'}
                    </div>
                  </div>
                </div>  
                <button 
                  type="submit" 
                  className="w-full py-3.5 px-4 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={offerLoading}
                >
                  <FaPaperPlane />
                  {offerLoading ? 'جاري الإرسال...' : 'إرسال العرض'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-4xl">
            <button 
              className="absolute top-4 left-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100 z-10"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes className="text-xl" />
            </button>
            <img 
              src={`https://core-api-x41.shaheenplus.sa/storage/${images[selectedImage]}`} 
              alt="Enlarged view" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandRequestDetails;