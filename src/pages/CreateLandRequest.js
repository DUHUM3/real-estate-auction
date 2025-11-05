// src/pages/CreateLandRequest.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaArrowRight, FaPlusCircle, FaMapMarkerAlt, FaCity, FaHandshake, FaBuilding, FaRuler, FaStickyNote } from 'react-icons/fa';

function CreateLandRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    region: '', city: '', purpose: 'sale', type: 'residential', area: '', description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  useEffect(() => {
    fetchRegionsAndCities();
  }, []);

  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);
    } else {
      setAvailableCities([]);
    }
  }, [formData.region, cities]);

  const fetchRegionsAndCities = () => {
    const regionsData = [
      'منطقة الرياض', 'منطقة مكة المكرمة', 'منطقة المدينة المنورة', 
      'منطقة القصيم', 'المنطقة الشرقية', 'منطقة عسير', 'منطقة تبوك',
      'منطقة حائل', 'منطقة الحدود الشمالية', 'منطقة جازان', 
      'منطقة نجران', 'منطقة الباحة', 'منطقة الجوف'
    ];
    
    const citiesData = {
      'منطقة الرياض': ['الرياض', 'الخرج', 'الدرعية', 'المزاحمية', 'القويعية'],
      'منطقة مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'القنفذة', 'رابغ'],
      'منطقة المدينة المنورة': ['المدينة المنورة', 'ينبع', 'العلا', 'المهد'],
    };
    
    setRegions(regionsData);
    setCities(citiesData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'region' && { city: '' })
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    if (!formData.region || !formData.city || !formData.area || !formData.description) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      // تحقق من وجود التوكن
      if (!token) {
        setError('يجب تسجيل الدخول أولاً');
        setLoading(false);
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'https://shahin-tqay.onrender.com/api/land-requests', 
        formData,
        { 
          headers: { 
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json' 
          } 
        }
      );

      console.log('✅ تم إنشاء الطلب بنجاح:', response.data);
      setLoading(false);
      navigate('/land-requests');
      
    } catch (err) {
      console.error('❌ خطأ في إنشاء الطلب:', err);
      
      if (err.response) {
        // الخطأ من الخادم
        if (err.response.status === 401) {
          setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          navigate('/login');
        } else if (err.response.status === 422) {
          setError('بيانات غير صالحة: ' + (err.response.data.message || 'يرجى التحقق من البيانات المدخلة'));
        } else {
          setError(err.response.data.message || 'حدث خطأ في الخادم');
        }
      } else if (err.request) {
        // لا يوجد اتصال بالخادم
        setError('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت');
      } else {
        // خطأ آخر
        setError('حدث خطأ غير متوقع');
      }
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="elegantLoading_container">
      <div className="elegantLoader"></div>
      <p className="elegantLoading_text">جاري إنشاء الطلب...</p>
    </div>
  );

  return (
    <div className="elegantCreate_container">
      {/* الهيدر */}
      <header className="elegantCreate_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          <FaArrowRight /> العودة
        </button>
        
        <div className="elegantHeader_title">
          <span>📄</span>
          <span>إنشاء طلب جديد</span>
        </div>
      </header>

      {/* المحتوى الرئيسي */}
      <main className="elegantCreate_content">
        <div className="elegantCreate_card">
          {/* عنوان البطاقة */}
          <div className="elegantCard_title">
            <span className="elegantCard_icon"><FaPlusCircle /></span>
            <h2>إضافة طلب جديد</h2>
          </div>

          {/* النموذج */}
          <form onSubmit={handleSubmit} className="elegantCreate_form">
            <div className="elegantForm_rows">
              {/* الصف الأول: المنطقة والمدينة */}
              <div className="elegantForm_row">
                <div className="elegantForm_group">
                  <label htmlFor="region" className="elegantForm_label">
                    <span className="elegantForm_label_icon"><FaMapMarkerAlt /></span>
                    المنطقة:
                  </label>
                  <select 
                    id="region" 
                    name="region" 
                    value={formData.region} 
                    onChange={handleChange} 
                    className="elegantForm_select"
                    required
                  >
                    <option value="">اختر المنطقة</option>
                    {regions.map(region => (
                      <option key={region} value={region}>{region}</option>
                    ))}
                  </select>
                </div>
                
                <div className="elegantForm_group">
                  <label htmlFor="city" className="elegantForm_label">
                    <span className="elegantForm_label_icon"><FaCity /></span>
                    المدينة:
                  </label>
                  <select 
                    id="city" 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    className="elegantForm_select"
                    required 
                    disabled={!formData.region}
                  >
                    <option value="">اختر المدينة</option>
                    {availableCities.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* الصف الثاني: الغرض والنوع */}
              <div className="elegantForm_row">
                <div className="elegantForm_group">
                  <label htmlFor="purpose" className="elegantForm_label">
                    <span className="elegantForm_label_icon"><FaHandshake /></span>
                    الغرض:
                  </label>
                  <select 
                    id="purpose" 
                    name="purpose" 
                    value={formData.purpose} 
                    onChange={handleChange} 
                    className="elegantForm_select"
                    required
                  >
                    <option value="sale">بيع</option>
                    <option value="rent">إيجار</option>
                  </select>
                </div>
                
                <div className="elegantForm_group">
                  <label htmlFor="type" className="elegantForm_label">
                    <span className="elegantForm_label_icon"><FaBuilding /></span>
                    النوع:
                  </label>
                  <select 
                    id="type" 
                    name="type" 
                    value={formData.type} 
                    onChange={handleChange} 
                    className="elegantForm_select"
                    required
                  >
                    <option value="residential">سكني</option>
                    <option value="commercial">تجاري</option>
                    <option value="agricultural">زراعي</option>
                  </select>
                </div>
              </div>

              {/* حقل المساحة */}
              <div className="elegantForm_group">
                <label htmlFor="area" className="elegantForm_label">
                  <span className="elegantForm_label_icon"><FaRuler /></span>
                  المساحة (م²):
                </label>
                <input
                  type="number" 
                  id="area" 
                  name="area" 
                  value={formData.area} 
                  onChange={handleChange}
                  className="elegantForm_input"
                  placeholder="أدخل المساحة بالمتر المربع" 
                  min="1" 
                  required
                />
              </div>

              {/* حقل الوصف */}
              <div className="elegantForm_group">
                <label htmlFor="description" className="elegantForm_label">
                  <span className="elegantForm_label_icon"><FaStickyNote /></span>
                  الوصف:
                </label>
                <textarea
                  id="description" 
                  name="description" 
                  value={formData.description} 
                  onChange={handleChange}
                  className="elegantForm_textarea"
                  placeholder="أدخل وصف مفصل للطلب..." 
                  rows="4" 
                  required
                />
              </div>
            </div>

            {/* رسالة الخطأ */}
            {error && (
              <div className="elegantError_message">
                <span className="elegantError_icon">⚠️</span>
                {error}
              </div>
            )}

            {/* أزرار النموذج */}
            <div className="elegantForm_actions">
              <button 
                type="submit" 
                className="elegantSubmit_btn" 
                disabled={loading}
              >
                <FaPlusCircle />
                {loading ? 'جاري الإنشاء...' : 'إنشاء الطلب'}
              </button>
              <button 
                type="button" 
                className="elegantCancel_btn" 
                onClick={() => navigate('/land-requests')}
              >
                إلغاء
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateLandRequest;