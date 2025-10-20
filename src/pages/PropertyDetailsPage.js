import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
  FaArrowLeft as FaLeft
} from 'react-icons/fa';
import '../styles/PropertyDetailsModal.css';

const PropertyDetailsPage = () => {
  const { id, type } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchData();
    checkFavoriteStatus();
  }, [id, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const url = type === 'land' 
        ? `https://shahin-tqay.onrender.com/api/properties/${id}`
        : `https://shahin-tqay.onrender.com/api/auctions/${id}`;

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }

      const result = await response.json();
      
      if ((type === 'land' && result.status) || (type === 'auction' && result.success)) {
        setData(type === 'land' ? result.data : result.data);
      } else {
        throw new Error('البيانات غير متوفرة');
      }
      
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const checkFavoriteStatus = () => {
    const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
    setIsFavorite(favorites.includes(parseInt(id)));
  };

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem(`${type}Favorites`) || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter(favId => favId !== parseInt(id));
    } else {
      newFavorites = [...favorites, parseInt(id)];
    }

    localStorage.setItem(`${type}Favorites`, JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const shareItem = () => {
    const shareData = {
      title: type === 'land' ? data.title : cleanText(data.title),
      text: type === 'land' 
        ? `أرض ${data.land_type} في ${data.region} - ${data.city}`
        : `مزاد: ${cleanText(data.title)}`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط للمشاركة!');
    }
  };

  // Clean up quotes from JSON strings - نفس الدالة في AuctionDetailsModal
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
        <button onClick={() => navigate(-1)}>العودة</button>
      </div>
    );
  }

  if (!data) {
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
        <button className="elegantBack_btn" onClick={() => navigate(-1)}>
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
        {/* Title and Basic Info */}
        <div className="elegantTitle_section">
          <h1>{type === 'land' ? data.title : cleanText(data.title)}</h1>
          <div className={`elegantStatus_badge ${data.status?.toLowerCase()}`}>
            {data.status}
          </div>
        </div>

        {/* Location */}
        <div className="elegantLocation_section">
          <FaMapMarkerAlt className="elegantSection_icon" />
          <div className="elegantLocation_info">
            <h3>الموقع</h3>
            <p>
              {type === 'land' 
                ? `${data.region} - ${data.city}`
                : cleanText(data.address)}
            </p>
            {type === 'land' && data.geo_location_text && (
              <span className="elegantLocation_detail">{data.geo_location_text}</span>
            )}
          </div>
        </div>

        {/* Specifications */}
        <div className="elegantSpecs_section">
          <h3>المواصفات</h3>
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
                  <FaCalendarAlt />
                  <div>
                    <span className="elegantSpec_label">تاريخ المزاد</span>
                    <span className="elegantSpec_value">{formatDate(data.auction_date)}</span>
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

        {/* Description */}
        <div className="elegantDescription_section">
          <h3>الوصف</h3>
          <p>{type === 'land' ? data.description : cleanText(data.description)}</p>
        </div>

        {/* Map Section - باستخدام نفس طريقة AuctionDetailsModal بدون API Key */}
        {(type === 'land' && data.geo_location_map) || (type === 'auction' && data.latitude && data.longitude) ? (
          <div className="elegantMap_section">
            <h3>الموقع على الخريطة</h3>
            <div className="elegantMap_container">
              {type === 'land' && data.geo_location_map ? (
                <iframe
                  title="موقع الأرض"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(data.geo_location_map)}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
              ) : type === 'auction' && data.latitude && data.longitude ? (
                <iframe
                  title="موقع المزاد"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${data.latitude},${data.longitude}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
              ) : null}
            </div>
          </div>
        ) : null}

        {/* Additional Details */}
        {type === 'land' && (
          <div className="elegantAdditional_section">
            <h3>تفاصيل إضافية</h3>
            <div className="elegantAdditional_grid">
              <div className="elegantDetail_item">
                <span className="elegantDetail_label">رقم الصك</span>
                <span className="elegantDetail_value">{data.deed_number}</span>
              </div>
              <div className="elegantDetail_item">
                <span className="elegantDetail_label">رقم الإعلان</span>
                <span className="elegantDetail_value">{data.announcement_number}</span>
              </div>
              <div className="elegantDetail_item">
                <span className="elegantDetail_label">رقم الوكالة</span>
                <span className="elegantDetail_value">{data.agency_number}</span>
              </div>
              <div className="elegantDetail_item">
                <span className="elegantDetail_label">الإقرار القانوني</span>
                <span className="elegantDetail_value">{data.legal_declaration}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && images.length > 0 && (
        <div className="elegantImage_modal">
          <div className="elegantModal_content">
            <button 
              className="elegantModal_close"
              onClick={() => setShowImageModal(false)}
            >
              ✕
            </button>
            <img src={getImageUrl(images[selectedImage])} alt="Modal" />
            {images.length > 1 && (
              <>
                <button 
                  className="elegantModal_nav elegantModal_prev"
                  onClick={() => setSelectedImage(prev => prev === 0 ? images.length - 1 : prev - 1)}
                >
                  ‹
                </button>
                <button 
                  className="elegantModal_nav elegantModal_next"
                  onClick={() => setSelectedImage(prev => (prev + 1) % images.length)}
                >
                  ›
                </button>
                <div className="elegantGallery_count">
                  {selectedImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetailsPage;