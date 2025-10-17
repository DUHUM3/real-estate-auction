import React from 'react';
import { 
  FaHeart, 
  FaShare, 
  FaChevronLeft, 
  FaMapMarkerAlt, 
  FaRulerCombined, 
  FaRulerHorizontal,
  FaIdCard,
  FaCalendarAlt,
  FaPhone,
  FaWhatsapp,
  FaEnvelope
} from 'react-icons/fa';
import '../styles/PropertyDetailsModal.css';

const PropertyDetailsModal = ({ property, onClose, isFavorite, onToggleFavorite, onShare }) => {
  // Get image URL
  const getImageUrl = (imgPath) => {
    if (imgPath) {
      return `https://shahin-tqay.onrender.com/storage/${imgPath}`;
    }
    return null;
  };

  // Calculate total price
  const calculateTotalPrice = () => {
    if (property.price_per_sqm && property.total_area) {
      return (parseFloat(property.price_per_sqm) * parseFloat(property.total_area)).toFixed(2);
    }
    return '0';
  };

  // Format price with commas
  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  // Handle contact actions
  const handleContact = (type) => {
    // هنا يمكنك إضافة منطق الاتصال المناسب
    switch(type) {
      case 'phone':
        // منطق الاتصال الهاتفي
        break;
      case 'whatsapp':
        // منطق واتساب
        break;
      case 'email':
        // منطق البريد الإلكتروني
        break;
      default:
        break;
    }
  };

  return (
    <div className="property-modal-overlay" onClick={onClose}>
      <div className="property-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <button className="modal-close-btn" onClick={onClose}>
            <FaChevronLeft />
            رجوع
          </button>
          <div className="modal-actions">
            <button 
              className={`favorite-btn ${isFavorite ? 'active' : ''}`}
              onClick={() => onToggleFavorite(property.id)}
            >
              <FaHeart />
            </button>
            <button 
              className="share-btn"
              onClick={() => onShare(property)}
            >
              <FaShare />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Gallery */}
          <div className="property-gallery">
            {getImageUrl(property.cover_image) ? (
              <img src={getImageUrl(property.cover_image)} alt={property.title} />
            ) : (
              <div className="placeholder-image">
                <FaMapMarkerAlt />
                <p>لا توجد صورة</p>
              </div>
            )}
          </div>

          {/* Property Info */}
          <div className="property-info">
            {/* Title */}
            <h1 className="property-title">{property.title}</h1>
            
            {/* Location */}
            <div className="property-meta">
              <div className="meta-item">
                <FaMapMarkerAlt className="meta-icon" />
                <span>{property.region} - {property.city}</span>
              </div>
              {property.geo_location_text && (
                <div className="meta-item">
                  <span className="location-text">{property.geo_location_text}</span>
                </div>
              )}
            </div>

            {/* Price Section */}
            <div className="price-section">
              {property.purpose === 'بيع' ? (
                <>
                  <div className="price-per-sqm">
                    <span className="price">{formatPrice(property.price_per_sqm)} ر.س/م²</span>
                    <span className="label">سعر المتر</span>
                  </div>
                  <div className="total-price">
                    <span className="price">{formatPrice(calculateTotalPrice())} ر.س</span>
                    <span className="label">السعر الإجمالي</span>
                  </div>
                </>
              ) : (
                <div className="investment-price">
                  <span className="price">{formatPrice(property.estimated_investment_value)} ر.س</span>
                  <span className="label">قيمة الاستثمار</span>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="details-grid">
              <div className="detail-item">
                <FaRulerCombined className="detail-icon" />
                <div className="detail-content">
                  <span className="label">المساحة الكلية</span>
                  <span className="value">{formatPrice(property.total_area)} م²</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaRulerHorizontal className="detail-icon" />
                <div className="detail-content">
                  <span className="label">نوع الأرض</span>
                  <span className="value">{property.land_type}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaIdCard className="detail-icon" />
                <div className="detail-content">
                  <span className="label">رقم الصك</span>
                  <span className="value">{property.deed_number || 'غير متوفر'}</span>
                </div>
              </div>
              
              <div className="detail-item">
                <FaCalendarAlt className="detail-icon" />
                <div className="detail-content">
                  <span className="label">تاريخ الإضافة</span>
                  <span className="value">
                    {property.created_at ? new Date(property.created_at).toLocaleDateString('ar-SA') : 'غير متوفر'}
                  </span>
                </div>
              </div>
            </div>

            {/* Description */}
            {property.description && (
              <div className="description-section">
                <h3 className="section-title">وصف العقار</h3>
                <p className="description-text">{property.description}</p>
              </div>
            )}

            {/* Dimensions */}
            <div className="dimensions-section">
              <h3 className="section-title">أبعاد الأرض</h3>
              <div className="dimensions-grid">
                <div className="dimension-item">
                  <span className="direction">الشمال</span>
                  <span className="length">{property.length_north || '0'} م</span>
                </div>
                <div className="dimension-item">
                  <span className="direction">الجنوب</span>
                  <span className="length">{property.length_south || '0'} م</span>
                </div>
                <div className="dimension-item">
                  <span className="direction">الشرق</span>
                  <span className="length">{property.length_east || '0'} م</span>
                </div>
                <div className="dimension-item">
                  <span className="direction">الغرب</span>
                  <span className="length">{property.length_west || '0'} م</span>
                </div>
              </div>
            </div>

            {/* Contact Section */}
            <div className="contact-section">
              <h3 className="section-title">الاتصال بالبائع</h3>
              <div className="contact-buttons">
                <button 
                  className="contact-btn phone"
                  onClick={() => handleContact('phone')}
                >
                  <FaPhone />
                  اتصل
                </button>
                <button 
                  className="contact-btn whatsapp"
                  onClick={() => handleContact('whatsapp')}
                >
                  <FaWhatsapp />
                  واتساب
                </button>
                <button 
                  className="contact-btn email"
                  onClick={() => handleContact('email')}
                >
                  <FaEnvelope />
                  إيميل
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailsModal;