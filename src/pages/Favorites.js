import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiHome,
  FiX,
  FiTrash2,
  
  FiClock
} from 'react-icons/fi';
// import '../styles/Interests.css'; // نفس الـ CSS المستخدم في الاهتمامات

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const navigate = useNavigate();

  // جلب بيانات المفضلة
  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('https://shahin-tqay.onrender.com/api/favorites', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        console.log('بيانات المفضلة:', data); // للتصحيح
        setFavorites(data.favorites || []);
      } else {
        throw new Error('فشل في جلب البيانات');
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
  };

  // دالة لإزالة من المفضلة بناءً على النوع
  const removeFavorite = async (favorite, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    try {
      setRemovingId(favorite.id);
      const token = localStorage.getItem('token');
      
      let url = '';
      if (favorite.favoritable_type === 'App\\Models\\Property') {
        url = `https://shahin-tqay.onrender.com/api/favorites/property/${favorite.favoritable_id}`;
      } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
        url = `https://shahin-tqay.onrender.com/api/favorites/auction/${favorite.favoritable_id}`;
      } else {
        throw new Error('نوع العنصر غير معروف');
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        // إزالة العنصر من القائمة محلياً
        setFavorites(prev => prev.filter(fav => fav.id !== favorite.id));
      } else {
        throw new Error('فشل في إزالة العنصر');
      }
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('حدث خطأ أثناء إزالة العنصر من المفضلة');
    } finally {
      setRemovingId(null);
    }
  };

  // دالة للانتقال إلى صفحة تفاصيل العنصر بناءً على النوع
  const handleViewItem = (id, type = null) => {
    // تحديد النوع بناءً على favoritable_type
    let itemType = type;
    if (!itemType) {
      // البحث عن العنصر في المفضلة لتحديد نوعه
      const favoriteItem = favorites.find(fav => fav.favoritable_id === id);
      if (favoriteItem) {
        if (favoriteItem.favoritable_type === 'App\\Models\\Property') {
          itemType = 'land';
        } else if (favoriteItem.favoritable_type === 'App\\Models\\Auction') {
          itemType = 'auction';
        }
      }
    }
    
    console.log('التنقل إلى التفاصيل:', { id, type: itemType });
    
    if (itemType === 'lands' || itemType === 'land') {
      navigate(`/lands/${id}/land`);
    } else {
      navigate(`/lands/${id}/auction`);
    }
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  // تنسيق التاريخ
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

  // تنسيق الوقت
  const formatTime = (timeString) => {
    if (!timeString) return '';
    return timeString.substring(0, 5); // إرجاع فقط الساعات والدقائق
  };

  // حساب السعر الإجمالي للأرض
  const calculateTotalPrice = (property) => {
    if (property.total_area && property.price_per_sqm) {
      return parseFloat(property.total_area) * parseFloat(property.price_per_sqm);
    }
    return 0;
  };

  // الحصول على عنوان العنصر بناءً على النوع
  const getItemTitle = (favorite) => {
    if (favorite.favoritable_type === 'App\\Models\\Property') {
      return favorite.favoritable.title || `أرض ${favorite.favoritable.land_type}`;
    } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
      return favorite.favoritable.title || 'مزاد';
    }
    return 'عنصر';
  };

  // الحصول على أيقونة العنصر بناءً على النوع
  const getItemIcon = (favorite) => {
    if (favorite.favoritable_type === 'App\\Models\\Property') {
      return <FiHome className="detail-icon" />;
    } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
      return <FiClock className="detail-icon" />;
    }
    return <FiHeart className="detail-icon" />;
  };

  // الحصول على نوع العنصر كنص
  const getItemType = (favorite) => {
    if (favorite.favoritable_type === 'App\\Models\\Property') {
      return 'أرض';
    } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
      return 'مزاد';
    }
    return 'عنصر';
  };

  // الحصول على نوع العنصر لاستخدامه في handleViewItem
  const getItemTypeForNavigation = (favorite) => {
    if (favorite.favoritable_type === 'App\\Models\\Property') {
      return 'land';
    } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
      return 'auction';
    }
    return null;
  };

  if (loading) {
    return (
      <div className="interests-container">
        <div className="interests-loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل المفضلة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interests-container">
        <div className="interests-error">
          <FiX className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={fetchFavorites}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="interests-container">
      {/* عنوان الصفحة */}
      {/* <div className="interests-header">
        <h1 className="page-title">
          <FiHeart className="title-icon" />
          المفضلة
        </h1>
        <p className="page-subtitle">
          العناصر التي قمت بإضافتها إلى المفضلة
          {favorites.length > 0 && ` (${favorites.length} عنصر)`}
        </p>
      </div> */}

      {/* قائمة المفضلة */}
      <div className="interests-list">
        {favorites.length === 0 ? (
          <div className="empty-state">
            <FiHeart className="empty-icon" />
            <h3>لا توجد عناصر في المفضلة</h3>
            <p>لم تقم بإضافة أي عناصر إلى المفضلة حتى الآن</p>
            <Link to="/lands-and-auctions-list" className="browse-btn">
              تصفح الاراضي
            </Link>
          </div>
        ) : (
          favorites.map((favorite) => (
            <div 
              key={favorite.id} 
              className="interest-card"
              onClick={() => handleViewItem(favorite.favoritable_id, getItemTypeForNavigation(favorite))}
              style={{ cursor: 'pointer' }}
            >
              <div className="interest-header">
                <div className="interest-title-section">
                  <div className="item-type-badge">
                    {getItemIcon(favorite)}
                    {getItemType(favorite)}
                  </div>
                  <h3 className="interest-title">
                    {getItemTitle(favorite)}
                  </h3>
                  <span className={`status-badge ${favorite.favoritable.status === 'مفتوح' ? 'status-approved' : 'status-pending'}`}>
                    <FiHeart />
                    {favorite.favoritable.status}
                  </span>
                </div>
                <div className="interest-reference">
                  <FiCalendar className="reference-icon" />
                  <span>أضيف في: {formatDate(favorite.created_at)}</span>
                </div>
              </div>

              <div className="interest-details">
                {/* تفاصيل الأرض */}
                {favorite.favoritable_type === 'App\\Models\\Property' && (
                  <>
                    <div className="detail-item">
                      <FiMapPin className="detail-icon" />
                      <span className="detail-label">الموقع:</span>
                      <span className="detail-value">
                        {favorite.favoritable.region} - {favorite.favoritable.city}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <FiX className="detail-icon" />
                      <span className="detail-label">المساحة:</span>
                      <span className="detail-value">
                        {formatPrice(favorite.favoritable.total_area)} م²
                      </span>
                    </div>

                    {favorite.favoritable.price_per_sqm && (
                      <div className="detail-item">
                        <FiDollarSign className="detail-icon" />
                        <span className="detail-label">سعر المتر:</span>
                        <span className="detail-value">
                          {formatPrice(favorite.favoritable.price_per_sqm)} ر.س
                        </span>
                      </div>
                    )}

                    {favorite.favoritable.total_area && favorite.favoritable.price_per_sqm && (
                      <div className="detail-item">
                        <FiHome className="detail-icon" />
                        <span className="detail-label">السعر الإجمالي:</span>
                        <span className="detail-value elegantTotal_price">
                          {formatPrice(calculateTotalPrice(favorite.favoritable))} ر.س
                        </span>
                      </div>
                    )}

                    <div className="detail-item">
                      <span className="detail-label">نوع الأرض:</span>
                      <span className="detail-value">{favorite.favoritable.land_type}</span>
                    </div>

                    {favorite.favoritable.deed_number && (
                      <div className="detail-item">
                        <span className="detail-label">رقم الصك:</span>
                        <span className="detail-value">{favorite.favoritable.deed_number}</span>
                      </div>
                    )}
                  </>
                )}

                {/* تفاصيل المزاد */}
                {favorite.favoritable_type === 'App\\Models\\Auction' && (
                  <>
                    <div className="detail-item">
                      <FiMapPin className="detail-icon" />
                      <span className="detail-label">العنوان:</span>
                      <span className="detail-value">
                        {favorite.favoritable.address}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <FiCalendar className="detail-icon" />
                      <span className="detail-label">تاريخ المزاد:</span>
                      <span className="detail-value">
                        {formatDate(favorite.favoritable.auction_date)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <FiClock className="detail-icon" />
                      <span className="detail-label">وقت البدء:</span>
                      <span className="detail-value">
                        {formatTime(favorite.favoritable.start_time)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">الوصف:</span>
                      <span className="detail-value description-text">
                        {favorite.favoritable.description}
                      </span>
                    </div>

                    {favorite.favoritable.intro_link && (
                      <div className="detail-item">
                        <span className="detail-label">رابط التعريف:</span>
                        <a 
                          href={favorite.favoritable.intro_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="detail-value link"
                          onClick={(e) => e.stopPropagation()}
                        >
                          اضغط هنا للمشاهدة
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="interest-actions">
                <button 
                  className="view-property-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewItem(favorite.favoritable_id, getItemTypeForNavigation(favorite));
                  }}
                >
                  <FiEye />
                  <span>
                    {favorite.favoritable_type === 'App\\Models\\Property' 
                      ? 'عرض تفاصيل الأرض' 
                      : 'عرض تفاصيل المزاد'
                    }
                  </span>
                </button>
                
                <button 
                  className="remove-favorite-btn"
                  onClick={(e) => removeFavorite(favorite, e)}
                  disabled={removingId === favorite.id}
                >
                  {removingId === favorite.id ? (
                    <div className="loading-spinner-small"></div>
                  ) : (
                    <FiTrash2 />
                  )}
                  <span>
                    {removingId === favorite.id ? 'جاري الإزالة...' : 'إزالة من المفضلة'}
                  </span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;