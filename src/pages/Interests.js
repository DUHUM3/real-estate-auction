import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiHeart, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle,
  FiEye,
  FiFileText
} from 'react-icons/fi';
// import '../styles/Interests.css';

function Interests() {
  const [interests, setInterests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      <div className="interests-header">
        <h1 className="page-title">
          <FiHeart className="title-icon" />
          اهتماماتي
        </h1>
        <p className="page-subtitle">عقارات قمت بالتعبير عن اهتمامك بها</p>
      </div>

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
            <div key={interest.id} className="interest-card">
              <div className="interest-header">
                <div className="interest-title-section">
                  <h3 className="interest-title">{interest.property_title}</h3>
                  <span className={`status-badge ${getStatusColor(interest.status)}`}>
                    {getStatusIcon(interest.status)}
                    {interest.status}
                  </span>
                </div>
                <div className="interest-reference">
                  <FiFileText className="reference-icon" />
                  <span>{interest.reference_number}</span>
                </div>
              </div>

              <div className="interest-details">
                <div className="detail-item">
                  <span className="detail-label">تاريخ التقديم:</span>
                  <span className="detail-value">{interest.submitted_at}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">رقم المرجع:</span>
                  <span className="detail-value">{interest.reference_number}</span>
                </div>
              </div>

              {/* <div className="interest-actions">
                <button className="view-details-btn">
                  <FiEye />
                  <span>عرض التفاصيل</span>
                </button>
                <button className="track-status-btn">
                  <FiClock />
                  <span>متابعة الحالة</span>
                </button>
              </div> */}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Interests;