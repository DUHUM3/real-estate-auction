import React, { useState } from 'react';
import '../styles/PropertyDetailsModal.css';
import Icons from '../../icons';
import { imageUtils, textUtils } from '../../api/auctionApi';

const AuctionDetailsModal = ({ auction, onClose, isFavorite, onToggleFavorite, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = imageUtils.getGalleryImages(auction);

  // دوال التنقل بين الصور
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  // التعامل مع إضافة/إزالة من المفضلة مع تكامل API
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await onToggleFavorite(auction.id, e);
      // اختياري: إضافة استدعاء API هنا إذا لزم الأمر
      // await auctionApi.toggleFavorite(auction.id);
    } catch (error) {
      console.error('خطأ عند التبديل إلى المفضلة:', error);
    }
  };

  // التعامل مع المشاركة مع تكامل API
  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      await onShare(auction, e);
      // اختياري: إضافة استدعاء API هنا إذا لزم الأمر
      // await auctionApi.shareAuction(auction.id);
    } catch (error) {
      console.error('خطأ عند مشاركة المزاد:', error);
    }
  };

  return (
    <div className="elegantModal_overlay" onClick={onClose}>
      <div className="elegantModal_content elegantAuction_modal" onClick={(e) => e.stopPropagation()}>
        <button className="elegantModal_close" onClick={onClose}>
          <Icons.FaTimes />
        </button>

        {/* قسم الرأس */}
        <div className="elegantModal_header">
          <h2>{textUtils.cleanText(auction.title)}</h2>
          
          <div className="elegantModal_actions">
            <button 
              className={`elegantFavorite_action ${isFavorite ? 'elegantActive' : ''}`}
              onClick={handleToggleFavorite}
            >
              <Icons.FaHeart />
              <span>{isFavorite ? 'مضاف للمفضلة' : 'أضف للمفضلة'}</span>
            </button>
            <button className="elegantShare_action" onClick={handleShare}>
              <Icons.FaShare />
              <span>مشاركة</span>
            </button>
          </div>
        </div>

        {/* قسم المعرض */}
        {images.length > 0 ? (
          <div className="elegantModal_gallery">
            <div className="elegantGallery_main">
              <img src={images[currentImageIndex]} alt={`صورة ${currentImageIndex + 1}`} />
              
              {images.length > 1 && (
                <>
                  <button className="elegantGallery_nav elegantPrev" onClick={prevImage}>
                    <Icons.FaArrowRight />
                  </button>
                  <button className="elegantGallery_nav elegantNext" onClick={nextImage}>
                    <Icons.FaArrowLeft />
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
            <Icons.FaBuilding />
            <p>لا توجد صور متاحة</p>
          </div>
        )}

        {/* قسم المحتوى */}
        <div className="elegantModal_body">
          <div className="elegantAuction_detailsGrid">
            {/* معلومات المزاد */}
            <div className="elegantDetail_section">
              <h3>معلومات المزاد</h3>
              
              {auction.company && (
                <div className="elegantDetail_item">
                  <div className="elegantDetail_label">
                    <Icons.FaBuilding />
                    <span>الشركة المنظمة</span>
                  </div>
                  <div className="elegantDetail_value">{auction.company.auction_name}</div>
                </div>
              )}
              
              <div className="elegantDetail_item">
                <div className="elegantDetail_label">
                  <Icons.FaMapMarkerAlt />
                  <span>العنوان</span>
                </div>
                <div className="elegantDetail_value">{textUtils.cleanText(auction.address)}</div>
              </div>
              
              <div className="elegantDetail_item">
                <div className="elegantDetail_label">
                  <Icons.FaCalendarAlt />
                  <span>تاريخ المزاد</span>
                </div>
                <div className="elegantDetail_value">{textUtils.formatDate(auction.auction_date)}</div>
              </div>
              
              <div className="elegantDetail_item">
                <div className="elegantDetail_label">
                  <Icons.FaClock />
                  <span>وقت البدء</span>
                </div>
                <div className="elegantDetail_value">{auction.start_time}</div>
              </div>
              
              {auction.intro_link && (
                <div className="elegantDetail_item">
                  <div className="elegantDetail_label">
                    <Icons.FaGlobe />
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

            {/* وصف المزاد */}
            <div className="elegantDetail_section">
              <h3>وصف المزاد</h3>
              <p className="elegantDescription">{textUtils.cleanText(auction.description)}</p>
            </div>
          </div>

          {/* قسم الخريطة */}
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

        {/* قسم الفوتر */}
        <div className="elegantModal_footer">
          <button className="elegantClose_modal" onClick={onClose}>إغلاق</button>
        </div>
      </div>
    </div>
  );
};

export default AuctionDetailsModal;
