// src/pages/LandRequestDetails.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  FaArrowRight,
  FaShareAlt,
  FaStar,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaCity,
  FaHandshake,
  FaBuilding,
  FaRuler,
  FaStickyNote,
  FaEdit,
  FaPaperPlane,
  FaExclamationCircle,
  FaCheckCircle,
  FaFileAlt,
  FaSearch
} from 'react-icons/fa';

function LandRequestDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerSuccess, setOfferSuccess] = useState(false);
  const [offerError, setOfferError] = useState(null);

  useEffect(() => {
    fetchRequestDetails();
    
    if (window.location.hash === '#offer') {
      setTimeout(() => {
        const offerSection = document.getElementById('offer');
        if (offerSection) offerSection.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('يجب تسجيل الدخول أولاً');
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `https://shahin-tqay.onrender.com/api/land-requests/${id}`,
        {
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      setRequest(response.data.data);
      setLoading(false);
    } catch (err) {
      console.error('❌ خطأ في تحميل التفاصيل:', err);
      
      if (err.response?.status === 401) {
        setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response?.status === 404) {
        setError('لم يتم العثور على الطلب');
      } else {
        setError('حدث خطأ أثناء تحميل تفاصيل الطلب');
      }
      setLoading(false);
    }
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();
    
    if (!offerMessage.trim()) {
      setOfferError('يرجى إدخال تفاصيل العرض');
      return;
    }

    try {
      setOfferLoading(true);
      setOfferError(null);
      
      const token = localStorage.getItem('token');
      
      if (!token) {
        setOfferError('يجب تسجيل الدخول أولاً');
        setOfferLoading(false);
        navigate('/login');
        return;
      }

      const response = await axios.post(
        `https://shahin-tqay.onrender.com/api/land-requests/${id}/offers`,
        { 
          message: offerMessage.trim()
        },
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );

      console.log('✅ تم تقديم العرض بنجاح:', response.data);
      setOfferSuccess(true);
      setOfferMessage('');
      setOfferLoading(false);
      
    } catch (err) {
      console.error('❌ خطأ في تقديم العرض:', err);
      setOfferLoading(false);
      
      if (err.response) {
        if (err.response.status === 401) {
          setOfferError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.status === 422) {
          setOfferError('بيانات غير صالحة: ' + (err.response.data.message || 'يرجى التحقق من البيانات المدخلة'));
        } else if (err.response.status === 404) {
          setOfferError('لم يتم العثور على الطلب');
        } else {
          setOfferError(err.response.data.message || 'حدث خطأ في الخادم');
        }
      } else if (err.request) {
        setOfferError('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت');
      } else {
        setOfferError('حدث خطأ غير متوقع');
      }
    }
  };

  const getPurposeLabel = (purpose) => purpose === 'sale' ? 'بيع' : 'إيجار';
  
  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential': return 'سكني';
      case 'commercial': return 'تجاري';
      case 'agricultural': return 'زراعي';
      default: return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'مفتوح';
      case 'closed': return 'مغلق';
      case 'completed': return 'مكتمل';
      default: return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'open': return 'status-open';
      case 'closed': return 'status-closed';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  if (loading) return (
    <div className="elegantLoading_container">
      <div className="elegantLoader"></div>
      <p className="elegantLoading_text">جاري تحميل تفاصيل الطلب...</p>
    </div>
  );
  
  if (error) return (
    <div className="elegantError_container">
      <div className="elegantError_icon">⚠️</div>
      <p className="elegantError_text">{error}</p>
      <div className="elegantError_actions">
        <button onClick={fetchRequestDetails} className="elegantRetry_btn">
          إعادة المحاولة
        </button>
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          العودة
        </button>
      </div>
    </div>
  );
  
  if (!request) return (
    <div className="elegantNotFound_container">
      <div className="elegantNotFound_icon">
        <FaSearch />
      </div>
      <p className="elegantNotFound_text">لم يتم العثور على الطلب</p>
      <button onClick={() => navigate('/land-requests')} className="elegantBack_btn">
        العودة للقائمة
      </button>
    </div>
  );

  return (
    <div className="elegantDetails_container">
      {/* الهيدر */}
      <header className="elegantDetails_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          <FaArrowRight /> العودة
        </button>
        
        <div className="elegantHeader_title">
          <span className="elegantHeader_icon">
            <FaFileAlt />
          </span>
          <span>تفاصيل الطلب</span>
        </div>
        
        <div className="elegantHeader_actions">
          <button className="elegantShare_btn" title="مشاركة">
            <FaShareAlt />
          </button>
          <button className="elegantFavorite_btn" title="إضافة للمفضلة">
            <FaStar />
          </button>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="elegantDetails_content">
        {/* بطاقة تفاصيل الطلب */}
        <div className="elegantRequest_card">
          <div className="elegantCard_header">
            <div className="elegantRequest_info">
              <h1 className="elegantRequest_title">
                طلب أرض رقم #{request.id}
              </h1>
              <div className="elegantDate_info">
                <FaCalendarAlt className="elegantDate_icon" />
                <span>تاريخ الإنشاء: {request.created_at}</span>
              </div>
            </div>
            
            <div className="elegantStatus_section">
              <span className={`elegantStatus_badge ${getStatusClass(request.status)}`}>
                {getStatusLabel(request.status)}
              </span>
            </div>
          </div>

          {/* شبكة التفاصيل */}
          <div className="elegantDetails_grid">
            <div className="elegantDetail_item">
              <div className="elegantDetail_header">
                <span className="elegantDetail_icon">
                  <FaMapMarkerAlt />
                </span>
                <span className="elegantDetail_label">المنطقة</span>
              </div>
              <div className="elegantDetail_value">{request.region}</div>
            </div>
            
            <div className="elegantDetail_item">
              <div className="elegantDetail_header">
                <span className="elegantDetail_icon">
                  <FaCity />
                </span>
                <span className="elegantDetail_label">المدينة</span>
              </div>
              <div className="elegantDetail_value">{request.city}</div>
            </div>
            
            <div className="elegantDetail_item">
              <div className="elegantDetail_header">
                <span className="elegantDetail_icon">
                  <FaHandshake />
                </span>
                <span className="elegantDetail_label">الغرض</span>
              </div>
              <div className="elegantDetail_value">{getPurposeLabel(request.purpose)}</div>
            </div>
            
            <div className="elegantDetail_item">
              <div className="elegantDetail_header">
                <span className="elegantDetail_icon">
                  <FaBuilding />
                </span>
                <span className="elegantDetail_label">النوع</span>
              </div>
              <div className="elegantDetail_value">{getTypeLabel(request.type)}</div>
            </div>
            
            <div className="elegantDetail_item">
              <div className="elegantDetail_header">
                <span className="elegantDetail_icon">
                  <FaRuler />
                </span>
                <span className="elegantDetail_label">المساحة</span>
              </div>
              <div className="elegantDetail_value">{request.area.toLocaleString()} م²</div>
            </div>
          </div>
        </div>

        {/* قسم الوصف */}
        <div className="elegantDescription_section">
          <div className="elegantSection_header">
            <span className="elegantSection_icon">
              <FaStickyNote />
            </span>
            <h3 className="elegantSection_title">الوصف</h3>
          </div>
          <div className="elegantDescription_content">
            <p className="elegantDescription_text">{request.description}</p>
          </div>
        </div>

        {/* قسم تقديم العرض */}
        {request.status === 'open' && (
          <div className="elegantOffer_section" id="offer">
            <div className="elegantSection_header">
              <span className="elegantSection_icon">
                <FaPaperPlane />
              </span>
              <h3 className="elegantSection_title">تقديم عرض</h3>
            </div>
            
            {offerSuccess ? (
              <div className="elegantSuccess_message">
                <div className="elegantSuccess_icon">
                  <FaCheckCircle />
                </div>
                <div className="elegantSuccess_content">
                  <p className="elegantSuccess_text">تم تقديم العرض بنجاح!</p>
                  <p className="elegantSuccess_subtext">سيتم مراجعة عرضك من قبل صاحب الطلب</p>
                </div>
                <button 
                  onClick={() => setOfferSuccess(false)} 
                  className="elegantNewOffer_btn"
                >
                  تقديم عرض آخر
                </button>
              </div>
            ) : (
              <form onSubmit={handleOfferSubmit} className="elegantOffer_form">
                <div className="elegantForm_group">
                  <label htmlFor="offerMessage" className="elegantForm_label">
                    <FaEdit className="elegantForm_label_icon" />
                    تفاصيل العرض:
                  </label>
                  <textarea
                    id="offerMessage"
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="أدخل تفاصيل العرض هنا... مثلاً: لدي أرض تناسب متطلباتك في الموقع المطلوب مع توفر جميع الخدمات..."
                    rows="5"
                    className="elegantForm_textarea"
                    required
                  />
                  <div className="elegantForm_hint">
                    اكتب وصفاً واضحاً ومفصلاً لعرضك
                  </div>
                </div>
                
                {offerError && (
                  <div className="elegantError_message">
                    <FaExclamationCircle className="elegantError_icon" />
                    <span className="elegantError_text">{offerError}</span>
                  </div>
                )}
                
                <div className="elegantForm_actions">
                  <button 
                    type="submit" 
                    className="elegantSubmit_btn"
                    disabled={offerLoading}
                  >
                    <FaPaperPlane className="elegantSubmit_icon" />
                    {offerLoading ? 'جاري الإرسال...' : 'إرسال العرض'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* رسالة إذا كان الطلب مغلقاً */}
        {request.status !== 'open' && (
          <div className="elegantClosed_message">
            <div className="elegantClosed_icon">🔒</div>
            <p className="elegantClosed_text">
              هذا الطلب {request.status === 'closed' ? 'مغلق' : 'مكتمل'} ولا يمكن تقديم عروض جديدة
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default LandRequestDetails;