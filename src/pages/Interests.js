import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiEye,
  FiFileText,
  FiMapPin,
  FiCalendar
} from 'react-icons/fi';
// import '../styles/Interests.css';

function Interests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // جلب بيانات الاهتمامات
  useEffect(() => {
    const fetchInterests = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('https://shahin-tqay.onrender.com/api/user/interests/my', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          console.log('بيانات الاهتمامات:', data); // للتصحيح
          setInterests(data.data || []);
        } else {
          throw new Error('فشل في جلب البيانات');
        }
      } catch (error) {
        console.error('Error fetching interests:', error);
        setError('حدث خطأ في جلب البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchInterests();
  }, []);

  // دالة للحصول على لون الحالة
  const getStatusColor = (status) => {
    switch (status) {
      case 'قيد المراجعة':
        return 'status-pending';
      case 'مقبول':
        return 'status-approved';
      case 'مرفوض':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  // دالة للحصول على أيقونة الحالة
  const getStatusIcon = (status) => {
    switch (status) {
      case 'قيد المراجعة':
        return <FiClock />;
      case 'مقبول':
        return <FiCheckCircle />;
      case 'مرفوض':
        return <FiXCircle />;
      default:
        return <FiClock />;
    }
  };

  // دالة للانتقال إلى صفحة تفاصيل الأرض
  const handleViewProperty = (propertyId) => {
    navigate(`/property/${propertyId}/land`);
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

  if (loading) {
    return (
      <div className="interests-container">
        <div className="interests-loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الاهتمامات...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="interests-container">
        <div className="interests-error">
          <FiXCircle className="error-icon" />
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
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
          اهتماماتي
        </h1>
        <p className="page-subtitle">عقارات قمت بالتعبير عن اهتمامك بها</p>
      </div> */}

      {/* قائمة الاهتمامات */}
      <div className="interests-list">
        {interests.length === 0 ? (
          <div className="empty-state">
            <FiHeart className="empty-icon" />
            <h3>لا توجد اهتمامات</h3>
            <p>لم تقم بالتعبير عن اهتمامك بأي عقار حتى الآن</p>
            <Link to="/properties" className="browse-btn">
              تصفح الاراضي
            </Link>
          </div>
        ) : (
          interests.map((interest) => (
            <div 
              key={interest.id} 
              className="interest-card"
              onClick={() => handleViewProperty(interest.property_id)}
              style={{ cursor: 'pointer' }}
            >
              <div className="interest-header">
                <div className="interest-title-section">
                  <h3 className="interest-title">
                    الأرض رقم #{interest.property_id}
                  </h3>
                  <span className={`status-badge ${getStatusColor(interest.status)}`}>
                    {getStatusIcon(interest.status)}
                    {interest.status}
                  </span>
                </div>
                <div className="interest-reference">
                  <FiFileText className="reference-icon" />
                  <span>رقم الطلب: {interest.id}</span>
                </div>
              </div>

              <div className="interest-details">
                <div className="detail-item">
                  <FiCalendar className="detail-icon" />
                  <span className="detail-label">تاريخ التقديم:</span>
                  <span className="detail-value">{formatDate(interest.created_at)}</span>
                </div>
                
                <div className="detail-item">
                  <FiHeart className="detail-icon" />
                  <span className="detail-label">الرسالة:</span>
                  <span className="detail-value message-preview">
                    {interest.message || 'لا توجد رسالة'}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">المعلومات الشخصية:</span>
                  <span className="detail-value">
                    {interest.full_name} - {interest.phone} - {interest.email}
                  </span>
                </div>
              </div>

              <div className="interest-actions">
                <button 
                  className="view-property-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewProperty(interest.property_id);
                  }}
                >
                  <FiEye />
                  <span>عرض تفاصيل الأرض</span>
                </button>
                
                <div className="property-indicator">
                  <FiMapPin />
                  <span>انقر على البطاقة لعرض الأرض</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Interests;