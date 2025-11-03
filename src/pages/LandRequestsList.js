import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
// import './App.css';

// كومبوننت الصفحة الرئيسية


// كومبوننت قائمة الطلبات
function LandRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    region: '',
    city: '',
    purpose: '',
    type: '',
    area_min: '',
    area_max: '',
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token'); // استخراج التوكن المخزن
      const response = await axios.get('https://shahin-tqay.onrender.com/api/land-requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: filters
      });
      setRequests(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات');
      setLoading(false);
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchRequests();
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="requests-container">
      <h2>🌍 جميع الطلبات المتاحة</h2>
      
      <div className="filters-section">
        <h3>تصفية النتائج</h3>
        <form onSubmit={applyFilters} className="filters-form">
          <div className="form-group">
            <label>المنطقة:</label>
            <input 
              type="text" 
              name="region" 
              value={filters.region} 
              onChange={handleFilterChange}
              placeholder="أدخل المنطقة" 
            />
          </div>
          
          <div className="form-group">
            <label>المدينة:</label>
            <input 
              type="text" 
              name="city" 
              value={filters.city} 
              onChange={handleFilterChange}
              placeholder="أدخل المدينة" 
            />
          </div>
          
          <div className="form-group">
            <label>الغرض:</label>
            <select name="purpose" value={filters.purpose} onChange={handleFilterChange}>
              <option value="">الكل</option>
              <option value="sale">بيع</option>
              <option value="rent">إيجار</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>النوع:</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">الكل</option>
              <option value="residential">سكني</option>
              <option value="commercial">تجاري</option>
              <option value="agricultural">زراعي</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>المساحة (من):</label>
            <input 
              type="number" 
              name="area_min" 
              value={filters.area_min} 
              onChange={handleFilterChange}
              placeholder="أدنى مساحة" 
            />
          </div>
          
          <div className="form-group">
            <label>المساحة (إلى):</label>
            <input 
              type="number" 
              name="area_max" 
              value={filters.area_max} 
              onChange={handleFilterChange}
              placeholder="أقصى مساحة" 
            />
          </div>
          
          <button type="submit" className="filter-button">تطبيق الفلترة</button>
        </form>
      </div>

      <div className="requests-list">
        {requests.length === 0 ? (
          <p className="no-data">لا توجد طلبات متاحة</p>
        ) : (
          requests.map(request => (
            <div key={request.id} className={`request-card ${request.status === 'open' ? 'open' : 'completed'}`}>
              <div className="request-header">
                <h3>طلب رقم: {request.id}</h3>
                <span className={`status-badge ${request.status}`}>
                  {request.status === 'open' ? 'مفتوح' : 'مكتمل'}
                </span>
              </div>
              
              <div className="request-info">
                <p><strong>المنطقة:</strong> {request.region}</p>
                <p><strong>المدينة:</strong> {request.city}</p>
                <p><strong>الغرض:</strong> {request.purpose === 'sale' ? 'بيع' : 'إيجار'}</p>
                <p><strong>النوع:</strong> {request.type === 'residential' ? 'سكني' : 
                                        request.type === 'commercial' ? 'تجاري' : 'زراعي'}</p>
                <p><strong>المساحة:</strong> {request.area} م²</p>
                <p><strong>تاريخ الإنشاء:</strong> {request.created_at}</p>
              </div>
              
              <div className="request-description">
                <p>{request.description}</p>
              </div>
              
              <div className="request-actions">
                <Link to={`/requests/${request.id}`} className="view-details-button">
                  عرض التفاصيل
                </Link>
                {request.status === 'open' && (
                  <Link to={`/requests/${request.id}#offer`} className="make-offer-button">
                    تقديم عرض
                  </Link>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// كومبوننت تفاصيل الطلب
function LandRequestDetails() {
  const { id } = useParams();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(`https://shahin-tqay.onrender.com/api/land-requests/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setRequest(response.data.data);
      setLoading(false);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل تفاصيل الطلب');
      setLoading(false);
      console.error(err);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    if (!offerMessage.trim()) {
      setOfferError('يرجى إدخال تفاصيل العرض');
      return;
    }

    try {
      setOfferError(null);
      const token = localStorage.getItem('token');
      await axios.post(`https://shahin-tqay.onrender.com/api/land-requests/${id}/offers`, 
        { message: offerMessage },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setOfferSuccess(true);
      setOfferMessage('');
    } catch (err) {
      setOfferError('حدث خطأ أثناء تقديم العرض');
      console.error(err);
    }
  };

  if (loading) return <div className="loading">جاري التحميل...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!request) return <div className="not-found">لم يتم العثور على الطلب</div>;

  return (
    <div className="request-details-container">
      <h2>📄 تفاصيل الطلب رقم {request.id}</h2>
      
      <div className="request-details-card">
        <div className="details-header">
          <span className={`status-badge ${request.status}`}>
            {request.status === 'open' ? 'مفتوح' : 'مكتمل'}
          </span>
          <p className="created-date">تاريخ الإنشاء: {request.created_at}</p>
        </div>
        
        <div className="details-grid">
          <div className="detail-item">
            <h3>المنطقة</h3>
            <p>{request.region}</p>
          </div>
          
          <div className="detail-item">
            <h3>المدينة</h3>
            <p>{request.city}</p>
          </div>
          
          <div className="detail-item">
            <h3>الغرض</h3>
            <p>{request.purpose === 'sale' ? 'بيع' : 'إيجار'}</p>
          </div>
          
          <div className="detail-item">
            <h3>النوع</h3>
            <p>{request.type === 'residential' ? 'سكني' : 
                request.type === 'commercial' ? 'تجاري' : 'زراعي'}</p>
          </div>
          
          <div className="detail-item">
            <h3>المساحة</h3>
            <p>{request.area} م²</p>
          </div>
        </div>
        
        <div className="description-section">
          <h3>الوصف</h3>
          <p>{request.description}</p>
        </div>
      </div>
      
      {request.status === 'open' && (
        <div className="offer-section" id="offer">
          <h3>تقديم عرض</h3>
          {offerSuccess ? (
            <div className="success-message">
              تم تقديم العرض بنجاح!
            </div>
          ) : (
            <form onSubmit={handleOfferSubmit} className="offer-form">
              <div className="form-group">
                <label htmlFor="offerMessage">تفاصيل العرض:</label>
                <textarea
                  id="offerMessage"
                  value={offerMessage}
                  onChange={(e) => setOfferMessage(e.target.value)}
                  placeholder="أدخل تفاصيل العرض هنا..."
                  rows="4"
                  required
                />
              </div>
              
              {offerError && <div className="error-message">{offerError}</div>}
              
              <button type="submit" className="submit-offer-button">
                إرسال العرض
              </button>
            </form>
          )}
        </div>
      )}
      
      <div className="back-link">
        <Link to="/">العودة للقائمة الرئيسية</Link>
      </div>
    </div>
  );
}

// كومبوننت إنشاء طلب جديد
function CreateLandRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region: '',
    city: '',
    purpose: 'sale',
    type: 'residential',
    area: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // التحقق من البيانات المدخلة
    if (!formData.region || !formData.city || !formData.area || !formData.description) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.post('https://shahin-tqay.onrender.com/api/land-requests', 
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      setLoading(false);
      // التوجيه للصفحة الرئيسية بعد الإضافة بنجاح
      navigate('/');
    } catch (err) {
      setError('حدث خطأ أثناء إنشاء الطلب');
      setLoading(false);
      console.error(err);
    }
  };

  return (
    <div className="create-request-container">
      <h2>إضافة طلب جديد</h2>
      
      <form onSubmit={handleSubmit} className="create-request-form">
        <div className="form-group">
          <label htmlFor="region">المنطقة:</label>
          <input
            type="text"
            id="region"
            name="region"
            value={formData.region}
            onChange={handleChange}
            placeholder="أدخل المنطقة"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="city">المدينة:</label>
          <input
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="أدخل المدينة"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="purpose">الغرض:</label>
          <select
            id="purpose"
            name="purpose"
            value={formData.purpose}
            onChange={handleChange}
            required
          >
            <option value="sale">بيع</option>
            <option value="rent">إيجار</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="type">النوع:</label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
          >
            <option value="residential">سكني</option>
            <option value="commercial">تجاري</option>
            <option value="agricultural">زراعي</option>
          </select>
        </div>
        
        <div className="form-group">
          <label htmlFor="area">المساحة (م²):</label>
          <input
            type="number"
            id="area"
            name="area"
            value={formData.area}
            onChange={handleChange}
            placeholder="أدخل المساحة"
            min="1"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">الوصف:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="أدخل وصف للطلب"
            rows="4"
            required
          />
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-actions">
          <button type="submit" className="create-button" disabled={loading}>
            {loading ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
          </button>
          <button type="button" className="cancel-button" onClick={() => navigate('/')}>
            إلغاء
          </button>
        </div>
      </form>
    </div>
  );
}

export default LandRequestsList;