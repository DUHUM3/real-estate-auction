// src/pages/LandRequestDetails.js
import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ModalContext } from '../../App';
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
  FaFileAlt,
  FaPaperPlane,
  FaEdit,
  FaExclamationCircle,
  FaCheckCircle,
  FaSearch,
  FaHandshake,
  FaCity,
  FaStickyNote
} from 'react-icons/fa';
import '../../styles/PropertyDetailsModal.css';

const LandRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState(null);
  const [showOfferForm, setShowOfferForm] = useState(false);

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
      
      if (!token) {
        setError('يجب تسجيل الدخول أولاً');
        setLoading(false);
        navigate('/login');
        return;
      }

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
        throw new Error('فشل في جلب البيانات');
      }

      const result = await response.json();
      setRequest(result.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ خطأ في تحميل التفاصيل:', err);
      
      if (err.response?.status === 401) {
        setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 404) {
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
      } else {
        newFavorites = [...favorites, parseInt(id)];
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
        
        const favorites = JSON.parse(localStorage.getItem('requestFavorites') || '[]');
        let newFavorites;

        if (isFavorite) {
          newFavorites = favorites.filter(favId => favId !== parseInt(id));
        } else {
          newFavorites = [...favorites, parseInt(id)];
        }

        localStorage.setItem('requestFavorites', JSON.stringify(newFavorites));
      } else {
        throw new Error('فشل في تحديث المفضلة');
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
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
      alert('تم نسخ الرابط للمشاركة!');
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!offerMessage.trim()) {
      setOfferError('يرجى إدخال تفاصيل العرض');
      return;
    }

    try {
      setOfferLoading(true);
      setOfferError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setOfferError('يجب تسجيل الدخول أولاً');
        setOfferLoading(false);
        navigate('/login');
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
        setOfferSuccess(true);
        setOfferMessage('');
        setOfferLoading(false);
      } else {
        throw new Error(result.message || 'حدث خطأ في تقديم العرض');
      }
      
    } catch (err) {
      console.error('❌ خطأ في تقديم العرض:', err);
      setOfferLoading(false);
      
      if (err.response) {
        if (err.response.status === 401) {
          setOfferError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.status === 422) {
          setOfferError('بيانات غير صالحة: ' + (err.response.data.message || 'يرجى التحقق من البيانات المدخلة'));
        } else if (err.response.status === 404) {
          setOfferError('لم يتم العثور على الطلب');
        } else {
          setOfferError(err.response.data.message || 'حدث خطأ في الخادم');
        }
      } else if (err.request) {
        setOfferError('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت');
      } else {
        setOfferError(err.message || 'حدث خطأ غير متوقع');
      }
    }
  };

  const handleShowOfferForm = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      openLogin(() => {
        setShowOfferForm(true);
      });
      return;
    }
    
    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
    setOfferError(null);
    setOfferMessage('');
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
      {/* Header */}
      <div className="elegantDetails_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          <FaArrowLeft />
          العودة
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
        {/* Title and Basic Info */}
        <div className="elegantTitle_section">
          <h1>طلب أرض #{request.id}</h1>
          <div className={`elegantStatus_badge ${getStatusClass(request.status)}`}>
            {getStatusLabel(request.status)}
          </div>
        </div>

        {/* Creation Date */}
        <div className="elegantDate_section">
          <FaCalendarAlt className="elegantSection_icon" />
          <span>تاريخ الإنشاء: {request.created_at}</span>
        </div>

        {/* Location */}
        <div className="elegantLocation_section">
          <FaMapMarkerAlt className="elegantSection_icon" />
          <div className="elegantLocation_info">
            <h3>الموقع</h3>
            <p>{request.region} - {request.city}</p>
          </div>
        </div>

        {/* Specifications */}
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

        {/* Description */}
        <div className="elegantDescription_section">
          <h3>الوصف</h3>
          <p>{request.description}</p>
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
            
            {offerSuccess ? (
              <div className="elegantSubmit_result success">
                <div className="elegantSuccess_icon">
                  <FaCheckCircle />
                </div>
                <p>تم تقديم العرض بنجاح!</p>
                <p className="elegantSuccess_subtext">سيتم مراجعة عرضك من قبل صاحب الطلب</p>
                <button 
                  onClick={handleCloseOfferForm} 
                  className="elegantCloseResult_btn"
                >
                  إغلاق
                </button>
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
                    اكتب وصفاً واضحاً ومفصلاً لعرضك
                  </div>
                </div>
                
                {offerError && (
                  <div className="elegantError_message">
                    <FaExclamationCircle className="elegantError_icon" />
                    <span className="elegantError_text">{offerError}</span>
                  </div>
                )}
                
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