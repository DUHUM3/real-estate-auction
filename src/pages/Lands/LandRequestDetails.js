// src/pages/LandRequestDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App';
import { useAuth } from '../../context/AuthContext'; // استيراد useAuth
import { toast, Toaster } from 'react-hot-toast';
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
  FaExclamationCircle,
  FaCheckCircle,
  FaHandshake,
  FaCity
} from 'react-icons/fa';
import '../../styles/PropertyDetailsModal.css';

const LandRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth(); // استخدام useAuth

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

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
        `https://shahin-tqay.onrender.com/api/land-requests/${id}`,
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

      const response = await fetch(`https://shahin-tqay.onrender.com/api/user/favorites/request/${id}`, {
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

      const response = await fetch(`https://shahin-tqay.onrender.com/api/user/favorites/request/${id}`, {
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
    // استخدام currentUser من AuthContext أولاً، ثم localStorage كبديل
    return currentUser?.user_type || localStorage.getItem('user_type');
  };

  /**
   * دالة التحقق من صلاحية المستخدم لتقديم العروض
   */
  const isUserAllowedToOffer = () => {
    const userType = getCurrentUserType();
    console.log('نوع المستخدم الحالي:', userType);
    
    // الأنواع المسموح لها بتقديم العروض (جميع الأنواع عدا شركة مزادات)
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
  const getOfferErrorMessage = () => {
    const userType = getCurrentUserType();
    
    if (userType === 'شركة مزادات') {
      return 'عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات';
    }
    
    return 'عذراً، ليس لديك صلاحية لتقديم العروض';
  };

  const handleShowOfferForm = () => {
    const token = localStorage.getItem('token');
    console.log('التحقق من token في handleShowOfferForm:', token);
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
          console.log('شركة مزادات - غير مسموح بتقديم العروض');
          toast.error('عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات');
          return;
        }
        
        console.log('المستخدم مسجل الدخول ومسموح له - فتح فورم العرض');
        setShowOfferForm(true);
      });
      return;
    }
    
    // التحقق من نوع المستخدم للمستخدمين المسجلين
    const userType = getCurrentUserType();
    console.log('نوع المستخدم الحالي للمستخدم المسجل:', userType);
    
    // إذا كان المستخدم شركة مزادات، منع تقديم العرض
    if (userType === 'شركة مزادات') {
      console.log('شركة مزادات - غير مسموح بتقديم العروض');
      toast.error('عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات');
      return;
    }
    
    // إذا كان مسجل الدخول وليس شركة مزادات، اعرض فورم العرض مباشرة
    console.log('المستخدم مسجل الدخول ومسموح له - عرض فورم العرض مباشرة');
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setOfferMessage('');
    setSubmitResult(null);
  };

  const validateForm = () => {
    if (offerMessage.trim().length < 10) {
      showApiError("تفاصيل العرض يجب أن تكون أكثر من 10 أحرف");
      return false;
    }
    return true;
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!offerMessage.trim()) {
      showApiError('يرجى إدخال تفاصيل العرض');
      return;
    }

    // التحقق من صحة النموذج
    if (!validateForm()) {
      return;
    }

    try {
      setOfferLoading(true);
      setSubmitResult(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        showApiError('يجب تسجيل الدخول أولاً');
        setOfferLoading(false);
        navigate('/login');
        return;
      }

      // التحقق النهائي من صلاحية المستخدم قبل الإرسال
      const userType = getCurrentUserType();
      if (userType === 'شركة مزادات') {
        showApiError('عذراً، شركات المزادات غير مسموح لها بتقديم عروض على الطلبات');
        setOfferLoading(false);
        return;
      }

      const response = await fetch(
        `https://shahin-tqay.onrender.com/api/land-requests/${id}/offers`,
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
        // نجاح - إغلاق الفورم فوراً وإظهار رسالة النجاح
        setOfferMessage('');
        setOfferLoading(false);
        
        const successMessage = result.message || 'تم تقديم العرض بنجاح!';
        setSubmitResult({
          success: true,
          message: successMessage
        });
        showApiSuccess(successMessage);
        
        // إغلاق الفورم بعد نجاح الإرسال مباشرة
        setTimeout(() => {
          setShowOfferForm(false);
          setSubmitResult(null);
        }, 3000);
        
      } else {
        throw new Error(result.message || 'حدث خطأ في تقديم العرض');
      }
      
    } catch (err) {
      console.error('❌ خطأ في تقديم العرض:', err);
      setOfferLoading(false);
      const errorMessage = err.message || 'حدث خطأ في تقديم العرض';
      setSubmitResult({
        success: false,
        message: errorMessage
      });
      showApiError(err);
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
      <div className="elegantLoading_container">
        <div className="elegantLoader"></div>
        <p>جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="elegantError_container">
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>العودة</button>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="elegantError_container">
        <p>البيانات غير متوفرة</p>
        <button onClick={() => navigate(-1)}>العودة</button>
      </div>
    );
  }

  const images = getAllImages();

  return (
    <div className="elegantDetails_container">
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
      <div className="elegantDetails_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          <FaArrowLeft />
          <span>العودة</span>
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
      {images.length > 0 && (
        <div className="elegantImage_gallery">
          <div className="elegantMain_image">
            <img 
              src={`https://shahin-tqay.onrender.com/storage/${images[selectedImage]}`} 
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
                  <img src={`https://shahin-tqay.onrender.com/storage/${image}`} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      <div className="elegantDetails_content">
        {/* العنوان أولاً */}
        <div className="elegantTitle_section">
          <h1>طلب أرض #{request.id}</h1>
          <div className={`elegantStatus_badge ${getStatusClass(request.status)}`}>
            {getStatusLabel(request.status)}
          </div>
        </div>

        {/* الوصف مباشرة تحت العنوان بدون عنوان */}
        <div className="elegantDescription_section">
          <p>{request.description}</p>
        </div>

        {/* التاريخ */}
        <div className="elegantDate_section">
          <span>تاريخ الإنشاء: {request.created_at}</span>
        </div>

        {/* الموقع */}
        <div className="elegantLocation_section">
          <FaMapMarkerAlt className="elegantSection_icon" />
          <div className="elegantLocation_info">
            <h3>الموقع</h3>
            <p>{request.region} - {request.city}</p>
          </div>
        </div>

        {/* تفاصيل الطلب */}
        <div className="elegantSpecs_section">
          <h3>تفاصيل الطلب</h3>
          <div className="elegantSpecs_grid">
            <div className="elegantSpec_item">
              <FaHandshake />
              <div>
                <span className="elegantSpec_label">الغرض</span>
                <span className="elegantSpec_value">{getPurposeLabel(request.purpose)}</span>
              </div>
            </div>
            <div className="elegantSpec_item">
              <FaBuilding />
              <div>
                <span className="elegantSpec_label">النوع</span>
                <span className="elegantSpec_value">{getTypeLabel(request.type)}</span>
              </div>
            </div>
            <div className="elegantSpec_item">
              <FaRulerCombined />
              <div>
                <span className="elegantSpec_label">المساحة المطلوبة</span>
                <span className="elegantSpec_value">{formatPrice(request.area)} م²</span>
              </div>
            </div>
            <div className="elegantSpec_item">
              <FaCity />
              <div>
                <span className="elegantSpec_label">المدينة</span>
                <span className="elegantSpec_value">{request.city}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Offer Button */}
        {request.status === 'open' && (
          <div className="elegantInterest_section" id="offer">
            <button 
              className="elegantInterest_btn" 
              onClick={handleShowOfferForm}
            >
              تقديم عرض
            </button>
          </div>
        )}

        {/* Closed Message */}
        {request.status !== 'open' && (
          <div className="elegantClosed_message">
            <div className="elegantClosed_icon">🔒</div>
            <p className="elegantClosed_text">
              هذا الطلب {request.status === 'closed' ? 'مغلق' : 'مكتمل'} ولا يمكن تقديم عروض جديدة
            </p>
          </div>
        )}
      </div>

      {/* Offer Form Modal */}
      {showOfferForm && (
        <div className="elegantForm_modal">
          <div className="elegantForm_content">
            <button 
              className="elegantModal_close" 
              onClick={handleCloseOfferForm}
            >
              <FaTimes />
            </button>
            <h3>تقديم عرض على الطلب</h3>
            
            {submitResult ? (
              <div className={`elegantSubmit_result ${submitResult.success ? 'success' : 'error'}`}>
                <p>{submitResult.message}</p>
                {submitResult.success ? (
                  <button onClick={handleCloseOfferForm} className="elegantCloseResult_btn">
                    إغلاق
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                    <button onClick={() => setSubmitResult(null)} className="elegantTryAgain_btn">
                      حاول مرة أخرى
                    </button>
                    <button onClick={handleCloseOfferForm} className="elegantCloseResult_btn">
                      إلغاء
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit}>
                <div className="elegantForm_group">
                  <label>
                    <FaEdit />
                    <span>تفاصيل العرض</span>
                  </label>
                  <textarea
                    name="offerMessage"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="أدخل تفاصيل العرض هنا... مثلاً: لدي أرض تناسب متطلباتك في الموقع المطلوب مع توفر جميع الخدمات..."
                    rows={5}
                    required
                  />
                  <div className="elegantForm_hint">
                    اكتب وصفاً واضحاً ومفصلاً لعرضك (يجب أن يكون أكثر من 10 أحرف)
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="elegantSubmit_btn"
                  disabled={offerLoading}
                >
                  <FaPaperPlane className="elegantSubmit_icon" />
                  {offerLoading ? 'جاري الإرسال...' : 'إرسال العرض'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <div className="elegantImage_modal">
          <div className="elegantModal_content">
            <button 
              className="elegantModal_close" 
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes />
            </button>
            <img 
              src={`https://shahin-tqay.onrender.com/storage/${images[selectedImage]}`} 
              alt="Enlarged view" 
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default LandRequestDetails;