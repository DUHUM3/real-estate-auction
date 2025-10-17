import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaPlus, FaEdit, FaTrash, FaFilter, FaSearch } from 'react-icons/fa';
import '../styles/MyAds.css';

function MyAds() {
  const { currentUser } = useAuth();
  const [showAdForm, setShowAdForm] = useState(false);
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [activeStatus, setActiveStatus] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [adFormData, setAdFormData] = useState({
    announcement_number: '',
    region: '',
    city: '',
    title: '',
    land_type: 'سكني',
    purpose: 'بيع',
    geo_location_text: '',
    total_area: '',
    length_north: '',
    length_south: '',
    length_east: '',
    length_west: '',
    description: '',
    deed_number: '',
    price_per_sqm: '',
    investment_duration: '',
    estimated_investment_value: '',
    agency_number: '',
    legal_declaration: false,
    cover_image: null,
    images: []
  });

  // جلب الإعلانات من API
  const fetchAds = async (status = 'الكل') => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      let url = 'https://shahin-tqay.onrender.com/api/user/properties/my';
      
      // إذا كان هناك تصفية بالحالة، استخدم API الحالة
      if (status !== 'الكل') {
        url = `https://shahin-tqay.onrender.com/api/user/properties/status/${status}`;
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
        setAds(result.data);
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
      
      const response = await fetch(`https://shahin-tqay.onrender.com/api/user/properties/${adId}`, {
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

  // إضافة إعلان جديد
  const handleAddAd = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // إضافة الحقول الأساسية
      const fields = [
        'announcement_number', 'region', 'city', 'title', 'land_type', 'purpose',
        'geo_location_text', 'total_area', 'length_north', 'length_south', 
        'length_east', 'length_west', 'description', 'deed_number', 'legal_declaration'
      ];

      fields.forEach(field => {
        formData.append(field, adFormData[field]);
      });

      // إضافة الحقول المشروطة حسب purpose
      if (adFormData.purpose === 'بيع') {
        formData.append('price_per_sqm', adFormData.price_per_sqm);
      } else if (adFormData.purpose === 'استثمار') {
        formData.append('investment_duration', adFormData.investment_duration);
        formData.append('estimated_investment_value', adFormData.estimated_investment_value);
      }

      // إضافة agency_number إذا كان المستخدم وكيل شرعي
      if (currentUser?.user_type === 'وكيل شرعي') {
        formData.append('agency_number', adFormData.agency_number);
      }

      // إضافة الصور
      if (adFormData.cover_image) {
        formData.append('cover_image', adFormData.cover_image);
      }

      if (adFormData.images && adFormData.images.length > 0) {
        adFormData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await fetch('https://shahin-tqay.onrender.com/api/user/properties', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.status) {
        alert('تم إضافة الإعلان بنجاح');
        setShowAdForm(false);
        resetForm();
        fetchAds(activeStatus); // إعادة تحميل الإعلانات
      } else {
        alert(result.message || 'فشل في إضافة الإعلان');
      }
    } catch (error) {
      alert('حدث خطأ أثناء إضافة الإعلان');
      console.error('Error adding ad:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setAdFormData({
      announcement_number: '',
      region: '',
      city: '',
      title: '',
      land_type: 'سكني',
      purpose: 'بيع',
      geo_location_text: '',
      total_area: '',
      length_north: '',
      length_south: '',
      length_east: '',
      length_west: '',
      description: '',
      deed_number: '',
      price_per_sqm: '',
      investment_duration: '',
      estimated_investment_value: '',
      agency_number: '',
      legal_declaration: false,
      cover_image: null,
      images: []
    });
  };

  const handleAdChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file') {
      if (name === 'cover_image') {
        setAdFormData({
          ...adFormData,
          cover_image: files[0]
        });
      } else if (name === 'images') {
        setAdFormData({
          ...adFormData,
          images: Array.from(files)
        });
      }
    } else if (type === 'checkbox') {
      setAdFormData({
        ...adFormData,
        [name]: checked
      });
    } else {
      setAdFormData({
        ...adFormData,
        [name]: value
      });
    }
  };

  // تحميل البيانات الأولية
  useEffect(() => {
    fetchAds();
  }, []);

  // بحث في الإعلانات
  const filteredAds = ads.filter(ad => 
    ad.title.includes(searchTerm) || 
    ad.description.includes(searchTerm) || 
    ad.city.includes(searchTerm)
  );

  // تنسيق الحالة
  const getStatusBadge = (status) => {
    const statusConfig = {
      'مقبول': { text: 'مقبول', class: 'status-approved' },
      'قيد المراجعة': { text: 'قيد المراجعة', class: 'status-pending' },
      'مرفوض': { text: 'مرفوض', class: 'status-rejected' },
      'تم البيع': { text: 'تم البيع', class: 'status-sold' },
      'مفتوح': { text: 'مفتوح', class: 'status-open' }
    };
    const config = statusConfig[status] || { text: status, class: 'status-pending' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const renderAdForm = () => (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>إضافة أرض جديدة</h3>
          <button className="close-btn" onClick={() => setShowAdForm(false)}>&times;</button>
        </div>
        <form onSubmit={handleAddAd} className="ad-form">
          <div className="form-grid">
            {/* المعلومات الأساسية */}
            <div className="form-group">
              <label>رقم الإعلان</label>
              <input
                type="text"
                name="announcement_number"
                value={adFormData.announcement_number}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل رقم الإعلان"
              />
            </div>

            <div className="form-group">
              <label>المنطقة</label>
              <input
                type="text"
                name="region"
                value={adFormData.region}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل المنطقة"
              />
            </div>

            <div className="form-group">
              <label>المدينة</label>
              <input
                type="text"
                name="city"
                value={adFormData.city}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل المدينة"
              />
            </div>

            <div className="form-group">
              <label>عنوان الإعلان</label>
              <input
                type="text"
                name="title"
                value={adFormData.title}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل عنوان الإعلان"
              />
            </div>

            <div className="form-group">
              <label>نوع الأرض</label>
              <select
                name="land_type"
                value={adFormData.land_type}
                onChange={handleAdChange}
                required
                className="form-control"
              >
                <option value="سكني">سكني</option>
                <option value="تجاري">تجاري</option>
                <option value="زراعي">زراعي</option>
                <option value="صناعي">صناعي</option>
              </select>
            </div>

            <div className="form-group">
              <label>الغرض</label>
              <select
                name="purpose"
                value={adFormData.purpose}
                onChange={handleAdChange}
                required
                className="form-control"
              >
                <option value="بيع">بيع</option>
                <option value="استثمار">استثمار</option>
              </select>
            </div>

            {/* الحقول المشروطة حسب purpose */}
            {adFormData.purpose === 'بيع' && (
              <div className="form-group">
                <label>سعر المتر المربع (ريال)</label>
                <input
                  type="number"
                  name="price_per_sqm"
                  value={adFormData.price_per_sqm}
                  onChange={handleAdChange}
                  required
                  className="form-control"
                  placeholder="أدخل سعر المتر المربع"
                />
              </div>
            )}

            {adFormData.purpose === 'استثمار' && (
              <>
                <div className="form-group">
                  <label>مدة الاستثمار (شهر)</label>
                  <input
                    type="number"
                    name="investment_duration"
                    value={adFormData.investment_duration}
                    onChange={handleAdChange}
                    required
                    className="form-control"
                    placeholder="أدخل مدة الاستثمار بالأشهر"
                  />
                </div>
                <div className="form-group">
                  <label>القيمة الاستثمارية المتوقعة (ريال)</label>
                  <input
                    type="number"
                    name="estimated_investment_value"
                    value={adFormData.estimated_investment_value}
                    onChange={handleAdChange}
                    required
                    className="form-control"
                    placeholder="أدخل القيمة الاستثمارية المتوقعة"
                  />
                </div>
              </>
            )}

            {/* حقل agency_number للمستخدمين الوكلاء الشرعيين */}
            {currentUser?.user_type === 'وكيل شرعي' && (
              <div className="form-group">
                <label>رقم الوكالة</label>
                <input
                  type="text"
                  name="agency_number"
                  value={adFormData.agency_number}
                  onChange={handleAdChange}
                  required
                  className="form-control"
                  placeholder="أدخل رقم الوكالة"
                />
              </div>
            )}

            {/* المعلومات الهندسية */}
            <div className="form-group">
              <label>المساحة الإجمالية (م²)</label>
              <input
                type="number"
                name="total_area"
                value={adFormData.total_area}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل المساحة الإجمالية"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>الطول شمال (م)</label>
              <input
                type="number"
                name="length_north"
                value={adFormData.length_north}
                onChange={handleAdChange}
                className="form-control"
                placeholder="الطول شمال"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>الطول جنوب (م)</label>
              <input
                type="number"
                name="length_south"
                value={adFormData.length_south}
                onChange={handleAdChange}
                className="form-control"
                placeholder="الطول جنوب"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>الطول شرق (م)</label>
              <input
                type="number"
                name="length_east"
                value={adFormData.length_east}
                onChange={handleAdChange}
                className="form-control"
                placeholder="الطول شرق"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>الطول غرب (م)</label>
              <input
                type="number"
                name="length_west"
                value={adFormData.length_west}
                onChange={handleAdChange}
                className="form-control"
                placeholder="الطول غرب"
                step="0.01"
              />
            </div>

            <div className="form-group">
              <label>رقم الصك</label>
              <input
                type="text"
                name="deed_number"
                value={adFormData.deed_number}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل رقم الصك"
              />
            </div>

            <div className="form-group full-width">
              <label>الموقع الجغرافي (وصف)</label>
              <input
                type="text"
                name="geo_location_text"
                value={adFormData.geo_location_text}
                onChange={handleAdChange}
                required
                className="form-control"
                placeholder="أدخل وصف الموقع الجغرافي"
              />
            </div>

            <div className="form-group full-width">
              <label>الوصف</label>
              <textarea
                name="description"
                value={adFormData.description}
                onChange={handleAdChange}
                required
                className="form-control"
                rows="4"
                placeholder="أدخل وصفاً مفصلاً عن الأرض"
              />
            </div>

            {/* رفع الملفات */}
            <div className="form-group">
              <label>الصورة الرئيسية</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="cover_image"
                  onChange={handleAdChange}
                  required
                  accept="image/*"
                  className="form-control"
                />
              </div>
            </div>

            <div className="form-group">
              <label>الصور الإضافية</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  name="images"
                  onChange={handleAdChange}
                  multiple
                  accept="image/*"
                  className="form-control"
                />
                <small>يمكنك رفع أكثر من صورة</small>
              </div>
            </div>

            <div className="form-group full-width">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  name="legal_declaration"
                  checked={adFormData.legal_declaration}
                  onChange={handleAdChange}
                  required
                />
                <span className="checkmark"></span>
                <span>أقر بأن جميع المعلومات المقدمة صحيحة وأتحمل المسؤولية القانونية</span>
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={() => {
                setShowAdForm(false);
                resetForm();
              }}
              disabled={formLoading}
            >
              إلغاء
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={formLoading}
            >
              {formLoading ? 'جاري الإضافة...' : 'إضافة الأرض'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return (
    <div className="my-ads-page">
      <div className="page-container">
        <div className="header-row">
          <h1 className="page-title">إعلاناتي</h1>
          <button className="add-btn" onClick={() => setShowAdForm(true)}>
            <FaPlus /> إضافة إعلان
          </button>
        </div>

        <div className="search-bar">
          <div className="search-input">
            <FaSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="ابحث في إعلاناتك..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="status-filter">
          <button 
            className={`status-btn ${activeStatus === 'الكل' ? 'active' : ''}`}
            onClick={() => handleStatusChange('الكل')}
          >
            الكل
          </button>
          <button 
            className={`status-btn ${activeStatus === 'مقبول' ? 'active' : ''}`}
            onClick={() => handleStatusChange('مقبول')}
          >
            مقبول
          </button>
          <button 
            className={`status-btn ${activeStatus === 'قيد المراجعة' ? 'active' : ''}`}
            onClick={() => handleStatusChange('قيد المراجعة')}
          >
            قيد المراجعة
          </button>
          <button 
            className={`status-btn ${activeStatus === 'مرفوض' ? 'active' : ''}`}
            onClick={() => handleStatusChange('مرفوض')}
          >
            مرفوض
          </button>
          <button 
            className={`status-btn ${activeStatus === 'تم البيع' ? 'active' : ''}`}
            onClick={() => handleStatusChange('تم البيع')}
          >
            تم البيع
          </button>
          <button 
            className={`status-btn ${activeStatus === 'مفتوح' ? 'active' : ''}`}
            onClick={() => handleStatusChange('مفتوح')}
          >
            مفتوح
          </button>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>جاري تحميل الإعلانات...</p>
          </div>
        ) : error ? (
          <div className="error-state">
            <div className="error-icon">!</div>
            <p>{error}</p>
            <button className="btn btn-primary" onClick={() => fetchAds(activeStatus)}>
              إعادة المحاولة
            </button>
          </div>
        ) : filteredAds.length > 0 ? (
          <div className="ads-grid">
            {filteredAds.map(ad => (
              <div key={ad.id} className="ad-card">
                <div className="ad-img">
                  <img src={ad.cover_image_url || 'https://via.placeholder.com/300x150?text=لا+توجد+صورة'} alt={ad.title} />
                  {getStatusBadge(ad.status)}
                </div>
                <div className="ad-content">
                  <h3 className="ad-title">{ad.title}</h3>
                  <div className="ad-info">
                    <div className="info-item">
                      <span className="info-label">المدينة:</span>
                      <span className="info-value">{ad.city}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">المساحة:</span>
                      <span className="info-value">{ad.total_area} م²</span>
                    </div>
                    {ad.purpose === 'بيع' ? (
                      <div className="info-item">
                        <span className="info-label">السعر:</span>
                        <span className="info-value">{ad.price_per_sqm * ad.total_area} ريال</span>
                      </div>
                    ) : (
                      <div className="info-item">
                        <span className="info-label">قيمة الاستثمار:</span>
                        <span className="info-value">{ad.estimated_investment_value} ريال</span>
                      </div>
                    )}
                  </div>
                  <p className="ad-desc">{ad.description.substring(0, 100)}...</p>
                  <div className="ad-footer">
                    <span className="ad-date">{new Date(ad.created_at).toLocaleDateString('ar-SA')}</span>
                    <div className="ad-actions">
                      <button className="action-btn edit-btn">
                        <FaEdit />
                      </button>
                      <button 
                        className="action-btn delete-btn"
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
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>لا توجد إعلانات</h3>
            <p>لم تقم بإضافة أي إعلانات بعد أو لا توجد إعلانات تطابق البحث</p>
            <button className="btn btn-primary" onClick={() => setShowAdForm(true)}>
              إضافة إعلان جديد
            </button>
          </div>
        )}
      </div>
      {showAdForm && renderAdForm()}
    </div>
  );
}

export default MyAds;