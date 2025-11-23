import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FiMapPin,
  FiDollarSign,
  FiCalendar,
  FiEye,
  FiHome,
  FiClock,
  FiFileText,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiClock as FiClockIcon
} from 'react-icons/fi';

function MyRequests() {
  const [activeTab, setActiveTab] = useState('lands');
  const [landRequests, setLandRequests] = useState([]);
  const [auctionRequests, setAuctionRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // جلب طلبات الأراضي
  const fetchLandRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://shahin-tqay.onrender.com/api/land-requests/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLandRequests(data.data || []);
      } else {
        throw new Error('فشل في جلب طلبات الأراضي');
      }
    } catch (error) {
      console.error('Error fetching land requests:', error);
      setError('حدث خطأ في جلب طلبات الأراضي');
    }
  };

  // جلب طلبات المزادات
  const fetchAuctionRequests = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://shahin-tqay.onrender.com/api/user/auction-request', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setAuctionRequests(data.requests || []);
      } else {
        throw new Error('فشل في جلب طلبات المزادات');
      }
    } catch (error) {
      console.error('Error fetching auction requests:', error);
      setError('حدث خطأ في جلب طلبات المزادات');
    }
  };

  useEffect(() => {
    fetchAllRequests();
  }, []);

  const fetchAllRequests = async () => {
    setLoading(true);
    setError(null);
    
    try {
      await Promise.all([
        fetchLandRequests(),
        fetchAuctionRequests()
      ]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      setError('حدث خطأ في جلب البيانات');
    } finally {
      setLoading(false);
    }
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

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
      case 'under_review':
        return <FiClockIcon className="status-icon status-pending" />;
      case 'approved':
        return <FiCheckCircle className="status-icon status-approved" />;
      case 'rejected':
        return <FiXCircle className="status-icon status-rejected" />;
      default:
        return <FiClockIcon className="status-icon status-pending" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status, statusAr = '') => {
    if (statusAr) return statusAr;
    
    switch (status) {
      case 'open':
        return 'مفتوح';
      case 'under_review':
        return 'قيد المراجعة';
      case 'approved':
        return 'مقبول';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  // الحصول على كلاس الحالة
  const getStatusClass = (status) => {
    switch (status) {
      case 'open':
      case 'under_review':
        return 'status-pending';
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      default:
        return 'status-pending';
    }
  };

  // الحصول على نوع الأرض
  const getLandType = (type) => {
    const types = {
      'residential': 'سكني',
      'commercial': 'تجاري',
      'agricultural': 'زراعي',
      'industrial': 'صناعي'
    };
    return types[type] || type;
  };

  // الحصول على الغرض
  const getPurpose = (purpose) => {
    const purposes = {
      'sale': 'بيع',
      'rent': 'إيجار',
      'investment': 'استثمار'
    };
    return purposes[purpose] || purpose;
  };

  if (loading) {
    return (
      <div className="interests-container">
        <div className="interests-loading">
          <div className="loading-spinner"></div>
          <p>جاري تحميل الطلبات...</p>
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
          <button className="retry-btn" onClick={fetchAllRequests}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const currentRequests = activeTab === 'lands' ? landRequests : auctionRequests;

  return (
    <div className="interests-container">
      {/* عنوان الصفحة */}
      {/* <div className="interests-header">
        <h1 className="page-title">
          <FiFileText className="title-icon" />
          طلباتي
        </h1>
        <p className="page-subtitle">
          قائمة بجميع طلبات الأراضي والمزادات المقدمة منك
        </p>
      </div> */}

      {/* تبويبات */}
      <div className="requests-tabs">
        <button 
          className={`tab-btn ${activeTab === 'lands' ? 'active' : ''}`}
          onClick={() => setActiveTab('lands')}
        >
          <FiHome className="tab-icon" />
          طلبات الأراضي
          {landRequests.length > 0 && (
            <span className="tab-badge">{landRequests.length}</span>
          )}
        </button>
        
        <button 
          className={`tab-btn ${activeTab === 'auctions' ? 'active' : ''}`}
          onClick={() => setActiveTab('auctions')}
        >
          <FiClock className="tab-icon" />
          طلبات المزادات
          {auctionRequests.length > 0 && (
            <span className="tab-badge">{auctionRequests.length}</span>
          )}
        </button>
      </div>

      {/* قائمة الطلبات */}
      <div className="interests-list">
        {currentRequests.length === 0 ? (
          <div className="empty-state">
            <FiFileText className="empty-icon" />
            <h3>لا توجد طلبات</h3>
            <p>
              {activeTab === 'lands' 
                ? 'لم تقم بتقديم أي طلبات أراضي حتى الآن' 
                : 'لم تقم بتقديم أي طلبات مزادات حتى الآن'
              }
            </p>
            <Link 
              to={activeTab === 'lands' ? "/add-land-request" : "/add-auction-request"} 
              className="browse-btn"
            >
              {activeTab === 'lands' ? 'تقديم طلب أرض' : 'تقديم طلب مزاد'}
            </Link>
          </div>
        ) : (
          currentRequests.map((request) => (
            <div key={request.id} className="interest-card">
              <div className="interest-header">
                <div className="interest-title-section">
                  <div className="item-type-badge">
                    {activeTab === 'lands' ? <FiHome /> : <FiClock />}
                    {activeTab === 'lands' ? 'طلب أرض' : 'طلب مزاد'}
                  </div>
                  
                  <div className="request-status">
                    {getStatusIcon(request.status)}
                    <span className={`status-badge ${getStatusClass(request.status)}`}>
                      {getStatusText(request.status, request.status_ar)}
                    </span>
                  </div>
                </div>
                
                <div className="interest-reference">
                  <FiCalendar className="reference-icon" />
                  <span>تاريخ الطلب: {formatDate(request.created_at || request.createdAt)}</span>
                </div>
              </div>

              <div className="interest-details">
                {/* تفاصيل طلبات الأراضي */}
                {activeTab === 'lands' && (
                  <>
                    <div className="detail-item">
                      <FiMapPin className="detail-icon" />
                      <span className="detail-label">الموقع:</span>
                      <span className="detail-value">
                        {request.region} - {request.city}
                      </span>
                    </div>
                    
                    <div className="detail-item">
                      <FiHome className="detail-icon" />
                      <span className="detail-label">نوع الأرض:</span>
                      <span className="detail-value">
                        {getLandType(request.type)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">الغرض:</span>
                      <span className="detail-value">
                        {getPurpose(request.purpose)}
                      </span>
                    </div>

                    <div className="detail-item">
                      <span className="detail-label">المساحة:</span>
                      <span className="detail-value">
                        {request.area ? `${request.area.toLocaleString('ar-SA')} م²` : 'غير محددة'}
                      </span>
                    </div>

                    {request.description && request.description !== 'لا وصف' && (
                      <div className="detail-item">
                        <span className="detail-label">الوصف:</span>
                        <span className="detail-value description-text">
                          {request.description}
                        </span>
                      </div>
                    )}
                  </>
                )}

                {/* تفاصيل طلبات المزادات */}
                {activeTab === 'auctions' && (
                  <>
                    <div className="detail-item">
                      <FiMapPin className="detail-icon" />
                      <span className="detail-label">الموقع:</span>
                      <span className="detail-value">
                        {request.region} - {request.city}
                      </span>
                    </div>

                    {request.document_number && (
                      <div className="detail-item">
                        <FiFileText className="detail-icon" />
                        <span className="detail-label">رقم المستند:</span>
                        <span className="detail-value">
                          {request.document_number}
                        </span>
                      </div>
                    )}

                    {request.description && (
                      <div className="detail-item">
                        <span className="detail-label">الوصف:</span>
                        <span className="detail-value description-text">
                          {request.description}
                        </span>
                      </div>
                    )}

                    {request.images && request.images.length > 0 && (
                      <div className="detail-item">
                        <FiImage className="detail-icon" />
                        <span className="detail-label">المرفقات:</span>
                        <span className="detail-value">
                          {request.images.length} صورة
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="interest-actions">
                <div className="request-info">
                  <span className="request-id">
                    رقم الطلب: #{request.id}
                  </span>
                </div>
                
                {/* <button 
                  className="view-property-btn"
                  onClick={() => {
                    // يمكن إضافة تفاصيل إضافية هنا
                    console.log('عرض تفاصيل الطلب:', request);
                  }}
                >
                  <FiEye />
                  <span>عرض التفاصيل</span>
                </button> */}
              </div>
            </div>
          ))
        )}
      </div>

      {/* إحصائيات */}
      {(landRequests.length > 0 || auctionRequests.length > 0) && (
        <div className="requests-stats">
          <div className="stat-card">
            <div className="stat-icon land-stat">
              <FiHome />
            </div>
            <div className="stat-info">
              <span className="stat-number">{landRequests.length}</span>
              <span className="stat-label">طلب أرض</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon auction-stat">
              <FiClock />
            </div>
            <div className="stat-info">
              <span className="stat-number">{auctionRequests.length}</span>
              <span className="stat-label">طلب مزاد</span>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon total-stat">
              <FiFileText />
            </div>
            <div className="stat-info">
              <span className="stat-number">{landRequests.length + auctionRequests.length}</span>
              <span className="stat-label">إجمالي الطلبات</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyRequests;