import React, { useState } from 'react';
import { FaTimes, FaHeart, FaShare, FaMapMarkerAlt, FaCalendarAlt, FaClock, FaBuilding, FaGlobe, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import '../styles/PropertyDetailsModal.css';

const AuctionDetailsModal = ({ auction, onClose, isFavorite, onToggleFavorite, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Clean up quotes from JSON strings
  const cleanText = (text) => {
    if (typeof text === 'string') {
      return text.replace(/"/g, '');
    }
    return text || '';
  };

  // Format date
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

  // Get cover image URL
  const getCoverImageUrl = () => {
    if (auction.cover_image) {
      return `https://shahin-tqay.onrender.com/storage/${auction.cover_image}`;
    }
    return null;
  };

  // Get gallery images
  const getGalleryImages = () => {
    const images = [];
    
    // Add cover image if exists
    if (auction.cover_image) {
      images.push(`https://shahin-tqay.onrender.com/storage/${auction.cover_image}`);
    }
    
    // Add additional images if exist
    if (auction.images && auction.images.length > 0) {
      auction.images.forEach(img => {
        if (img.image_path) {
          images.push(`https://shahin-tqay.onrender.com/storage/${img.image_path}`);
        }
      });
    }
    
    return images;
  };

  const images = getGalleryImages();

  // Navigate through images
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="elegantModal_overlay" onClick={onClose}>
      <div className="elegantModal_content elegantAuction_modal" onClick={(e) => e.stopPropagation()}>
        <button className="elegantModal_close" onClick={onClose}>
          <FaTimes />
        </button>

        <div className="elegantModal_header">
          <h2>{cleanText(auction.title)}</h2>
          
          <div className="elegantModal_actions">
            <button 
              className={`elegantFavorite_action ${isFavorite ? 'elegantActive' : ''}`}
              onClick={(e) => onToggleFavorite(auction.id, e)}
            >
              <FaHeart />
              <span>{isFavorite ? 'مضاف للمفضلة' : 'أضف للمفضلة'}</span>
            </button>
            <button className="elegantShare_action" onClick={(e) => onShare(auction, e)}>
              <FaShare />
              <span>مشاركة</span>
            </button>
          </div>
        </div>

        {images.length > 0 ? (
          <div className="elegantModal_gallery">
            <div className="elegantGallery_main">
              <img src={images[currentImageIndex]} alt={`صورة ${currentImageIndex + 1}`} />
              
              {images.length > 1 && (
                <>
                  <button className="elegantGallery_nav elegantPrev" onClick={prevImage}>
                    <FaArrowRight />
                  </button>
                  <button className="elegantGallery_nav elegantNext" onClick={nextImage}>
                    <FaArrowLeft />
                  </button>
                </>
              )}
              
              <div className="elegantGallery_count">
                {currentImageIndex + 1} / {images.length}
              </div>
            </div>
            
            {images.length > 1 && (
              <div className="elegantGallery_thumbnails">
                {images.map((image, index) => (
                  <div 
                    key={index} 
                    className={`elegantThumbnail ${index === currentImageIndex ? 'elegantActive' : ''}`}
                    onClick={() => setCurrentImageIndex(index)}
                  >
                    <img src={image} alt={`صورة مصغرة ${index + 1}`} />
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="elegantModal_noImage">
            <FaBuilding />
            <p>لا توجد صور متاحة</p>
          </div>
        )}

        <div className="elegantModal_body">
          <div className="elegantAuction_detailsGrid">
            <div className="elegantDetail_section">
              <h3>معلومات المزاد</h3>
              
              {auction.company && (
                <div className="elegantDetail_item">
                  <div className="elegantDetail_label">
                    <FaBuilding />
                    <span>الشركة المنظمة</span>
                  </div>
                  <div className="elegantDetail_value">{auction.company.auction_name}</div>
                </div>
              )}
              
              <div className="elegantDetail_item">
                <div className="elegantDetail_label">
                  <FaMapMarkerAlt />
                  <span>العنوان</span>
                </div>
                <div className="elegantDetail_value">{cleanText(auction.address)}</div>
              </div>
              
              <div className="elegantDetail_item">
                <div className="elegantDetail_label">
                  <FaCalendarAlt />
                  <span>تاريخ المزاد</span>
                </div>
                <div className="elegantDetail_value">{formatDate(auction.auction_date)}</div>
              </div>
              
              <div className="elegantDetail_item">
                <div className="elegantDetail_label">
                  <FaClock />
                  <span>وقت البدء</span>
                </div>
                <div className="elegantDetail_value">{auction.start_time}</div>
              </div>
              
              {auction.intro_link && (
                <div className="elegantDetail_item">
                  <div className="elegantDetail_label">
                    <FaGlobe />
                    <span>رابط تعريفي</span>
                  </div>
                  <div className="elegantDetail_value">
                    <a href={auction.intro_link} target="_blank" rel="noopener noreferrer">
                      فتح الرابط
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="elegantDetail_section">
              <h3>وصف المزاد</h3>
              <p className="elegantDescription">{cleanText(auction.description)}</p>
            </div>
          </div>

          {auction.latitude && auction.longitude && (
            <div className="elegantMap_section">
              <h3>الموقع على الخريطة</h3>
              <div className="elegantMap_container">
                <iframe
                  title="موقع المزاد"
                  width="100%"
                  height="300"
                  frameBorder="0"
                  src={`https://maps.google.com/maps?q=${auction.latitude},${auction.longitude}&z=15&output=embed`}
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          )}
        </div>

        <div className="elegantModal_footer">
          <button className="elegantClose_modal" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsModal;