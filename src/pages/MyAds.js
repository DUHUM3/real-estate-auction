import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaFilter, 
  FaSearch, 
  FaTag,          
  FaClipboardList, 
  FaExclamationTriangle,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaMoneyBillWave
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../styles/MyAds.css';

function MyAds() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeStatus, setActiveStatus] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');

  // الحصول على الروابط بناءً على نوع المستخدم
  const getApiUrls = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      return {
        base: 'https://shahin-tqay.onrender.com/api/user/auctions',
        myAuctions: 'https://shahin-tqay.onrender.com/api/user/auctions',
        single: (id) => `https://shahin-tqay.onrender.com/api/user/auctions/${id}`
      };
    } else {
      return {
        base: 'https://shahin-tqay.onrender.com/api/user/properties',
        create: 'https://shahin-tqay.onrender.com/api/user/properties',
        list: 'https://shahin-tqay.onrender.com/api/user/properties/my',
        status: (status) => `https://shahin-tqay.onrender.com/api/user/properties/status/${status}`,
        single: (id) => `https://shahin-tqay.onrender.com/api/user/properties/${id}`
      };
    }
  };

  // جلب الإعلانات من API
  const fetchAds = async (status = 'الكل') => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');
      const urls = getApiUrls();
      
      let url = currentUser?.user_type === 'شركة مزادات' ? urls.myAuctions : urls.list;
      
      // إذا كان هناك تصفية بالحالة ولم يكن المستخدم شركة مزادات
      if (status !== 'الكل' && currentUser?.user_type !== 'شركة مزادات') {
        url = urls.status(status);
      }
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.status) {
        // التعامل مع هيكل البيانات المختلف للمزادات والأراضي
        if (currentUser?.user_type === 'شركة مزادات') {
          // المزادات: result.data.data (مصفوفة داخل data)
          setAds(result.data?.data || []);
        } else {
          // الأراضي: result.data (مصفوفة مباشرة)
          setAds(result.data || []);
        }
      } else {
        setError(result.message || 'فشل في جلب الإعلانات');
      }
    } catch (error) {
      setError('حدث خطأ في الاتصال بالخادم');
      console.error('Error fetching ads:', error);
    } finally {
      setLoading(false);
    }
  };

  // تغيير تصفية الحالة
  const handleStatusChange = (status) => {
    setActiveStatus(status);
    fetchAds(status);
  };

  // حذف إعلان
  const deleteAd = async (adId) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) return;

    try {
      const token = localStorage.getItem('token');
      const urls = getApiUrls();
      
      const response = await fetch(urls.single(adId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      const result = await response.json();
      
      if (result.status) {
        setAds(ads.filter(ad => ad.id !== adId));
        alert('تم حذف الإعلان بنجاح');
      } else {
        alert(result.message || 'فشل في حذف الإعلان');
      }
    } catch (error) {
      alert('حدث خطأ أثناء حذف الإعلان');
      console.error('Error deleting ad:', error);
    }
  };

  // الانتقال إلى صفحة إنشاء الإعلان
  const navigateToCreateAd = () => {
    navigate('/create-ad');
  };

  // الانتقال إلى صفحة تعديل الإعلان
  const navigateToEditAd = (adId) => {
    navigate(`/edit-ad/${adId}`);
  };

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchAds();
  }, [currentUser]);

  // بحث في الإعلانات
  const filteredAds = ads.filter(ad => {
    const searchText = searchTerm.toLowerCase();
    return (
      ad.title?.toLowerCase().includes(searchText) || 
      ad.description?.toLowerCase().includes(searchText) || 
      ad.region?.toLowerCase().includes(searchText) ||
      ad.city?.toLowerCase().includes(searchText) ||
      ad.land_type?.toLowerCase().includes(searchText)
    );
  });

  // تنسيق الحالة
  const getStatusBadge = (status) => {
    const statusConfig = {
      'قيد المراجعة': { text: 'قيد المراجعة', class: 'myads-status-pending' },
      'مرفوض': { text: 'مرفوض', class: 'myads-status-rejected' },
      'تم البيع': { text: 'تم البيع', class: 'myads-status-sold' },
      'مفتوح': { text: 'مفتوح', class: 'myads-status-open' },
      'مغلق': { text: 'مغلق', class: 'myads-status-closed' },
      'مقبول': { text: 'مقبول', class: 'myads-status-accepted' },
      'منتهي': { text: 'منتهي', class: 'myads-status-ended' }
    };
    const config = statusConfig[status] || { text: status, class: 'myads-status-pending' };
    return <span className={`myads-status-badge ${config.class}`}>{config.text}</span>;
  };

  // تصحيح مسار الصورة
  const getImageUrl = (item) => {
    if (!item || !item.cover_image) {
      return 'https://via.placeholder.com/300x150/f8f9fa/6c757d?text=لا+توجد+صورة';
    }
    
    // إذا كان الرابط يحتوي على http فهو رابط كامل
    if (item.cover_image.includes('http')) {
      return item.cover_image;
    }
    
    // إذا كان مساراً نسبياً
    return `https://shahin-tqay.onrender.com/storage/${item.cover_image}`;
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    if (!price) return 'غير محدد';
    return `${parseFloat(price).toLocaleString('ar-SA')} ريال`;
  };

  return (
    <div className="my-ads-page">
      <div className="myads-page-container">
        <div className="myads-header-row">
          <div className="myads-header-controls">
            <button className="myads-add-btn" onClick={navigateToCreateAd}>
              <FaPlus /> 
              {currentUser?.user_type === 'شركة مزادات' ? 'إضافة مزاد جديد' : 'إضافة إعلان جديد'}
            </button>
            <div className="myads-search-bar">
              <div className="myads-search-input">
                <FaSearch className="myads-search-icon" />
                <input 
                  type="text" 
                  placeholder={
                    currentUser?.user_type === 'شركة مزادات' 
                      ? 'ابحث في مزاداتك...' 
                      : 'ابحث في إعلاناتك...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* تصفية الحالة - للأراضي فقط */}
        {currentUser?.user_type !== 'شركة مزادات' && (
          <div className="myads-status-filter">
            <button 
              className={`myads-status-btn ${activeStatus === 'الكل' ? 'active' : ''}`}
              onClick={() => handleStatusChange('الكل')}
            >
              الكل
            </button>
            <button 
              className={`myads-status-btn ${activeStatus === 'قيد المراجعة' ? 'active' : ''}`}
              onClick={() => handleStatusChange('قيد المراجعة')}
            >
              قيد المراجعة
            </button>
            <button 
              className={`myads-status-btn ${activeStatus === 'مقبول' ? 'active' : ''}`}
              onClick={() => handleStatusChange('مقبول')}
            >
              مقبول
            </button>
            <button 
              className={`myads-status-btn ${activeStatus === 'مرفوض' ? 'active' : ''}`}
              onClick={() => handleStatusChange('مرفوض')}
            >
              مرفوض
            </button>
            <button 
              className={`myads-status-btn ${activeStatus === 'تم البيع' ? 'active' : ''}`}
              onClick={() => handleStatusChange('تم البيع')}
            >
              تم البيع
            </button>
          </div>
        )}

        {loading ? (
          <div className="elegantLoading_container">
            <div className="elegantLoader"></div>
            <p>
              {currentUser?.user_type === 'شركة مزادات' 
                ? 'جاري تحميل المزادات...' 
                : 'جاري تحميل الإعلانات...'
              }
            </p>
          </div>
        ) : error ? (
          <div className="myads-error-state">
            <div className="myads-error-icon">
              <FaExclamationTriangle />
            </div>
            <p>{error}</p>
            <button className="myads-btn myads-btn-primary" onClick={() => fetchAds(activeStatus)}>
              إعادة المحاولة
            </button>
          </div>
        ) : filteredAds.length > 0 ? (
          <div className="myads-grid">
            {filteredAds.map(ad => (
              <div key={ad.id} className="myads-card">
                <div className="myads-img">
                  <img 
                    src={getImageUrl(ad)}
                    alt={ad.title} 
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x150/f8f9fa/6c757d?text=لا+توجد+صورة';
                    }}
                  />
                  {getStatusBadge(ad.status)}
                </div>
                <div className="myads-content">
                  <h3 className="myads-title">{ad.title}</h3>
                  
                  <div className="myads-info">
                    {currentUser?.user_type === 'شركة مزادات' ? (
                      <>
                        {/* معلومات المزاد */}
                        <div className="myads-info-item">
                          <FaCalendarAlt className="myads-info-icon" />
                          <span className="myads-info-value">
                            {formatDate(ad.created_at)}
                          </span>
                        </div>
                        <div className="myads-info-item">
                          <FaMapMarkerAlt className="myads-info-icon" />
                          <span className="myads-info-value">
                            {ad.address || 'لا يوجد عنوان'}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* معلومات الأرض */}
                        <div className="myads-info-item">
                          <FaMapMarkerAlt className="myads-info-icon" />
                          <span className="myads-info-value">
                            {ad.region} {ad.city ? `- ${ad.city}` : ''}
                          </span>
                        </div>
                        <div className="myads-info-item">
                          <FaTag className="myads-info-icon" />
                          <span className="myads-info-value">
                            {ad.land_type} - {ad.purpose}
                          </span>
                        </div>
                        {ad.price_per_sqm && (
                          <div className="myads-info-item">
                            <FaMoneyBillWave className="myads-info-icon" />
                            <span className="myads-info-value">
                              سعر المتر: {formatPrice(ad.price_per_sqm)}
                            </span>
                          </div>
                        )}
                        {ad.total_area && (
                          <div className="myads-info-item">
                            <span className="myads-info-label">المساحة:</span>
                            <span className="myads-info-value">
                              {parseFloat(ad.total_area).toLocaleString('ar-SA')} م²
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="myads-footer">
                    <span className="myads-date">
                      {formatDate(ad.created_at)}
                    </span>
                    <div className="myads-actions">
                      <button 
                        className="myads-action-btn myads-edit-btn"
                        onClick={() => navigateToEditAd(ad.id)}
                        title="تعديل"
                      >
                        <FaEdit />
                      </button>
                      <button 
                        className="myads-action-btn myads-delete-btn"
                        onClick={() => deleteAd(ad.id)}
                        title="حذف"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="myads-empty-state">
            <div className="myads-empty-icon">
              {currentUser?.user_type === 'شركة مزادات' ? (
                <FaTag size={48} />
              ) : (
                <FaClipboardList size={48} />
              )}
            </div>
            <h3>
              {currentUser?.user_type === 'شركة مزادات' ? 'لا توجد مزادات' : 'لا توجد إعلانات'}
            </h3>
            <p>
              {searchTerm 
                ? 'لا توجد نتائج تطابق بحثك'
                : currentUser?.user_type === 'شركة مزادات' 
                  ? 'لم تقم بإضافة أي مزادات بعد'
                  : 'لم تقم بإضافة أي إعلانات بعد'
              }
            </p>
            <button className="myads-btn myads-btn-primary" onClick={navigateToCreateAd}>
              {currentUser?.user_type === 'شركة مزادات' ? 'إضافة مزاد جديد' : 'إضافة إعلان جديد'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAds;