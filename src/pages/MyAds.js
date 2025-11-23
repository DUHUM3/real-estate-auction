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
  FaExclamationTriangle
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
        // تعديل هنا للتعامل مع هيكل البيانات الجديد
        if (currentUser?.user_type === 'شركة مزادات') {
          setAds(result.data?.data || []);
        } else {
          setAds(result.data?.data || []);
        }
      } else {
        setError('فشل في جلب الإعلانات');
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
        alert('فشل في حذف الإعلان');
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

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchAds();
  }, []);

  // بحث في الإعلانات
  const filteredAds = ads.filter(ad => {
    const searchText = searchTerm.toLowerCase();
    return (
      ad.title?.toLowerCase().includes(searchText) || 
      ad.description?.toLowerCase().includes(searchText) || 
      ad.city?.toLowerCase().includes(searchText) ||
      ad.address?.toLowerCase().includes(searchText)
    );
  });

  // تنسيق الحالة
  const getStatusBadge = (status) => {
    const statusConfig = {
      'قيد المراجعة': { text: 'قيد المراجعة', class: 'myads-status-pending' },
      'مرفوض': { text: 'مرفوض', class: 'myads-status-rejected' },
      'تم البيع': { text: 'تم البيع', class: 'myads-status-sold' },
      'مفتوح': { text: 'مفتوح', class: 'myads-status-open' },
      'مغلق': { text: 'مغلق', class: 'myads-status-closed' }
    };
    const config = statusConfig[status] || { text: status, class: 'myads-status-pending' };
    return <span className={`myads-status-badge ${config.class}`}>{config.text}</span>;
  };

  // تصحيح مسار الصورة
  const getImageUrl = (item) => {
    if (!item || !item.cover_image) return 'https://via.placeholder.com/300x150?text=لا+توجد+صورة';
    
    // للمزادات
    if (currentUser?.user_type === 'شركة مزادات') {
      return `https://shahin-tqay.onrender.com/storage/${item.cover_image}`;
    } 
    // للأراضي
    else {
      return `https://shahin-tqay.onrender.com/storage/${item.cover_image}`;
    }
  };

  return (
    <div className="my-ads-page">
      <div className="myads-page-container">
        <div className="myads-header-row">
          <div className="myads-header-controls">
            <button className="myads-add-btn" onClick={navigateToCreateAd}>
              <FaPlus /> 
              {currentUser?.user_type === 'شركة مزادات' ? 'إضافة مزاد' : 'إضافة إعلان'}
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

        <div className="myads-status-filter">
          {/* <button 
            className={`myads-status-btn ${activeStatus === 'الكل' ? 'active' : ''}`}
            onClick={() => handleStatusChange('الكل')}
          >
            الكل
          </button> */}
          {/* <button 
            className={`myads-status-btn ${activeStatus === 'قيد المراجعة' ? 'active' : ''}`}
            onClick={() => handleStatusChange('قيد المراجعة')}
          >
            قيد المراجعة
          </button> */}
          {/* <button 
            className={`myads-status-btn ${activeStatus === 'مرفوض' ? 'active' : ''}`}
            onClick={() => handleStatusChange('مرفوض')}
          >
            مرفوض
          </button> */}
          {/* <button 
            className={`myads-status-btn ${activeStatus === 'تم البيع' ? 'active' : ''}`}
            onClick={() => handleStatusChange('تم البيع')}
          >
            تم البيع
          </button> */}
          {/* <button 
            className={`myads-status-btn ${activeStatus === 'مفتوح' ? 'active' : ''}`}
            onClick={() => handleStatusChange('مفتوح')}
          >
            مفتوح
          </button> */}
        </div>

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
                  />
                  {getStatusBadge(ad.status)}
                </div>
                <div className="myads-content">
                  <h3 className="myads-title">{ad.title}</h3>
                  <div className="myads-info">
                    {currentUser?.user_type === 'شركة مزادات' ? (
                      <>
                        {/* عرض معلومات المزاد */}
                        <div className="myads-info-item">
                          <span className="myads-info-label">الحالة:</span>
                          <span className="myads-info-value">{ad.status}</span>
                        </div>
                        <div className="myads-info-item">
                          <span className="myads-info-label">تاريخ الإضافة:</span>
                          <span className="myads-info-value">
                            {new Date(ad.created_at).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        {/* عرض معلومات الأرض */}
                        <div className="myads-info-item">
                          <span className="myads-info-label">الحالة:</span>
                          <span className="myads-info-value">{ad.status}</span>
                        </div>
                        <div className="myads-info-item">
                          <span className="myads-info-label">سعر المتر:</span>
                          <span className="myads-info-value">
                            {ad.price_per_sqm ? `${ad.price_per_sqm} ريال` : 'غير محدد'}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="myads-footer">
                    <span className="myads-date">
                      {new Date(ad.created_at).toLocaleDateString('ar-SA')}
                    </span>
                    <div className="myads-actions">
                      <button className="myads-action-btn myads-edit-btn">
                        <FaEdit />
                      </button>
                      <button 
                        className="myads-action-btn myads-delete-btn"
                        onClick={() => deleteAd(ad.id)}
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
              {currentUser?.user_type === 'شركة مزادات' 
                ? 'لم تقم بإضافة أي مزادات بعد أو لا توجد مزادات تطابق البحث'
                : 'لم تقم بإضافة أي إعلانات بعد أو لا توجد إعلانات تطابق البحث'
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