// src/pages/CreateLandRequest.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// 👇 أهم إضافة — استدعاء خدمة المناطق والمدن
import { locationService } from '../../utils/LocationForFiltters';

function CreateLandRequest() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    region: '',
    city: '',
    purpose: 'sale',
    type: 'residential',
    area: '',
    description: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [regions, setRegions] = useState([]);
  const [citiesByRegion, setCitiesByRegion] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  // 🚀 جلب المناطق والمدن من locationService عند التحميل
  useEffect(() => {
    const regionsList = locationService.getRegions();
    const citiesList = locationService.getCitiesByRegion();

    setRegions(regionsList);
    setCitiesByRegion(citiesList);
  }, []);

  // ⚙️ تحديث قائمة المدن عند اختيار المنطقة
  useEffect(() => {
    if (formData.region && citiesByRegion[formData.region]) {
      setAvailableCities(citiesByRegion[formData.region]);
    } else {
      setAvailableCities([]);
    }
  }, [formData.region, citiesByRegion]);

  // ⚙️ تغيير الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'region' && { city: '' }),
    }));
  };

  // 🚀 إرسال الطلب
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

      if (!token) {
        setError('يجب تسجيل الدخول أولاً');
        navigate('/login');
        return;
      }

      const response = await axios.post(
        'https://shahin-tqay.onrender.com/api/land-requests',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('تم إنشاء الطلب:', response.data);
      navigate('/land-requests');
    } catch (err) {
      console.error('خطأ:', err);

      if (err.response) {
        if (err.response.status === 401) {
          setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
          localStorage.removeItem('token');
          navigate('/login');
        } else {
          setError(err.response.data.message || 'حدث خطأ في الخادم');
        }
      } else {
        setError('تعذر الاتصال بالخادم');
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="elegantLoading_container">
        <div className="elegantLoader"></div>
        <p className="elegantLoading_text">جاري إنشاء الطلب...</p>
      </div>
    );

  return (
    <div className="elegantCreate_container">
      <header className="elegantCreate_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          العودة
        </button>
        <div className="elegantHeader_title">
          <span>📄</span>
          <span>إنشاء طلب جديد</span>
        </div>
      </header>

      <main className="elegantCreate_content">
        <div className="elegantCreate_card">
          <div className="elegantCard_title">
            <h2>إضافة طلب جديد</h2>
          </div>

          <form onSubmit={handleSubmit} className="elegantCreate_form">
            <div className="elegantForm_rows">

              {/* المنطقة */}
              <div className="elegantForm_row">
                <div className="elegantForm_group">
                  <label className="elegantForm_label">المنطقة:</label>
                  <select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="elegantForm_select"
                    required
                  >
                    <option value="">اختر المنطقة</option>
                    {regions.map((region) => (
                      <option key={region} value={region}>
                        {region}
                      </option>
                    ))}
                  </select>
                </div>

                {/* المدينة */}
                <div className="elegantForm_group">
                  <label className="elegantForm_label">المدينة:</label>
                  <select
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="elegantForm_select"
                    required
                    disabled={!formData.region}
                  >
                    <option value="">اختر المدينة</option>
                    {availableCities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>

                {/* الغرض */}
                <div className="elegantForm_group">
                  <label className="elegantForm_label">الغرض:</label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleChange}
                    className="elegantForm_select"
                    required
                  >
                    <option value="sale">بيع</option>
                    <option value="investment">استثمار</option>
                  </select>
                </div>
              </div>

              {/* النوع والمساحة */}
              <div className="elegantForm_row">
                <div className="elegantForm_group">
                  <label className="elegantForm_label">النوع:</label>
                  <select
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

                <div className="elegantForm_group">
                  <label className="elegantForm_label">المساحة:</label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    className="elegantForm_input"
                    placeholder="أدخل المساحة"
                    min="1"
                    required
                  />
                </div>
              </div>

              {/* الوصف */}
              <div className="elegantForm_row">
                <div className="elegantForm_group elegantForm_fullRow">
                  <label className="elegantForm_label">الوصف:</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="elegantForm_textarea"
                    required
                    rows="4"
                  />
                </div>
              </div>

              {error && <div className="elegantError_message">⚠️ {error}</div>}

              <div className="elegantForm_actions">
                <button type="submit" className="elegantSubmit_btn">
                  إنشاء الطلب
                </button>
                <button
                  type="button"
                  className="elegantCancel_btn"
                  onClick={() => navigate('/land-requests')}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateLandRequest;
