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

  // الحصول على الروابط بناءً على نوع المستخدم
  const getApiUrls = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      return {
        base: 'https://shahin-tqay.onrender.com/api/user/auctions',
        status: 'https://shahin-tqay.onrender.com/api/user/auctions',
        single: (id) => `https://shahin-tqay.onrender.com/api/user/auctions/${id}`
      };
    } else {
      return {
        base: 'https://shahin-tqay.onrender.com/api/user/properties/my',
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
      
      let url = urls.base;
      
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
      
      if (result.status || result.success) {
        setAds(result.data || []);
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
      
      if (result.status || result.success) {
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
      const urls = getApiUrls();
      const formData = new FormData();

      if (currentUser?.user_type === 'شركة مزادات') {
        // حقول المزادات
        const auctionFields = [
          'title', 'description', 'intro_link', 'start_time', 
          'auction_date', 'address', 'latitude', 'longitude'
        ];

        auctionFields.forEach(field => {
          if (adFormData[field]) {
            formData.append(field, adFormData[field]);
          }
        });

        // إضافة الصور والفيديوهات للمزادات
        if (adFormData.cover_image) {
          formData.append('cover_image', adFormData.cover_image);
        }

        if (adFormData.images && adFormData.images.length > 0) {
          adFormData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }

        if (adFormData.videos && adFormData.videos.length > 0) {
          adFormData.videos.forEach((video, index) => {
            formData.append(`videos[${index}]`, video);
          });
        }
      } else {
        // حقول الأراضي (الكود الأصلي)
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
      }

      const response = await fetch(urls.base, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const result = await response.json();
      
      if (result.status || result.success) {
        alert('تم إضافة الإعلان بنجاح');
        setShowAdForm(false);
        resetForm();
        fetchAds(activeStatus);
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
    if (currentUser?.user_type === 'شركة مزادات') {
      setAdFormData({
        title: '',
        description: '',
        intro_link: '',
        start_time: '',
        auction_date: '',
        address: '',
        latitude: '',
        longitude: '',
        cover_image: null,
        images: [],
        videos: []
      });
    } else {
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
    }
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
      } else if (name === 'videos') {
        setAdFormData({
          ...adFormData,
          videos: Array.from(files)
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

  // عرض النموذج المناسب حسب نوع المستخدم
  const renderAdForm = () => {
    if (currentUser?.user_type === 'شركة مزادات') {
      return renderAuctionForm();
    } else {
      return renderPropertyForm();
    }
  };

  // نموذج المزادات
  const renderAuctionForm = () => (
    <div className="myads-form-overlay">
      <div className="myads-form-modal">
        <div className="myads-form-header">
          <h3>إضافة مزاد جديد</h3>
          <button className="myads-close-btn" onClick={() => setShowAdForm(false)}>&times;</button>
        </div>
        <form onSubmit={handleAddAd} className="myads-form">
          <div className="myads-form-grid">
            <div className="myads-form-group full-width">
              <label>عنوان المزاد *</label>
              <input
                type="text"
                name="title"
                value={adFormData.title}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل عنوان المزاد"
              />
            </div>

            <div className="myads-form-group full-width">
              <label>وصف المزاد *</label>
              <textarea
                name="description"
                value={adFormData.description}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                rows="4"
                placeholder="أدخل وصفاً مفصلاً عن المزاد"
              />
            </div>

            <div className="myads-form-group">
              <label>رابط التعريف</label>
              <input
                type="url"
                name="intro_link"
                value={adFormData.intro_link}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="https://example.com/auction-intro"
              />
            </div>

            <div className="myads-form-group">
              <label>وقت البدء *</label>
              <input
                type="time"
                name="start_time"
                value={adFormData.start_time}
                onChange={handleAdChange}
                required
                className="myads-form-control"
              />
            </div>

            <div className="myads-form-group">
              <label>تاريخ المزاد *</label>
              <input
                type="date"
                name="auction_date"
                value={adFormData.auction_date}
                onChange={handleAdChange}
                required
                className="myads-form-control"
              />
            </div>

            <div className="myads-form-group full-width">
              <label>العنوان *</label>
              <input
                type="text"
                name="address"
                value={adFormData.address}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل عنوان المزاد"
              />
            </div>

            <div className="myads-form-group">
              <label>خط العرض</label>
              <input
                type="text"
                name="latitude"
                value={adFormData.latitude}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="30.0444"
              />
            </div>

            <div className="myads-form-group">
              <label>خط الطول</label>
              <input
                type="text"
                name="longitude"
                value={adFormData.longitude}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="31.2357"
              />
            </div>

            <div className="myads-form-group">
              <label>الصورة الرئيسية *</label>
              <div className="myads-file-input-wrapper">
                <input
                  type="file"
                  name="cover_image"
                  onChange={handleAdChange}
                  required
                  accept="image/*"
                  className="myads-form-control"
                />
              </div>
            </div>

            <div className="myads-form-group">
              <label>الصور الإضافية</label>
              <div className="myads-file-input-wrapper">
                <input
                  type="file"
                  name="images"
                  onChange={handleAdChange}
                  multiple
                  accept="image/*"
                  className="myads-form-control"
                />
                <small>يمكنك رفع أكثر من صورة</small>
              </div>
            </div>

            <div className="myads-form-group">
              <label>الفيديوهات</label>
              <div className="myads-file-input-wrapper">
                <input
                  type="file"
                  name="videos"
                  onChange={handleAdChange}
                  multiple
                  accept="video/*"
                  className="myads-form-control"
                />
                <small>يمكنك رفع فيديوهات عن المزاد</small>
              </div>
            </div>
          </div>

          <div className="myads-form-actions">
            <button 
              type="button" 
              className="myads-btn myads-btn-outline"
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
              className="myads-btn myads-btn-primary"
              disabled={formLoading}
            >
              {formLoading ? 'جاري الإضافة...' : 'إضافة المزاد'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // نموذج الأراضي (النموذج الأصلي)
  const renderPropertyForm = () => (
    <div className="myads-form-overlay">
      <div className="myads-form-modal">
        <div className="myads-form-header">
          <h3>إضافة أرض جديدة</h3>
          <button className="myads-close-btn" onClick={() => setShowAdForm(false)}>&times;</button>
        </div>
        <form onSubmit={handleAddAd} className="myads-form">
          <div className="myads-form-grid">
            {/* المعلومات الأساسية */}
            <div className="myads-form-group">
              <label>رقم الإعلان</label>
              <input
                type="text"
                name="announcement_number"
                value={adFormData.announcement_number}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل رقم الإعلان"
              />
            </div>

            <div className="myads-form-group">
              <label>المنطقة</label>
              <input
                type="text"
                name="region"
                value={adFormData.region}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل المنطقة"
              />
            </div>

            <div className="myads-form-group">
              <label>المدينة</label>
              <input
                type="text"
                name="city"
                value={adFormData.city}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل المدينة"
              />
            </div>

            <div className="myads-form-group">
              <label>عنوان الإعلان</label>
              <input
                type="text"
                name="title"
                value={adFormData.title}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل عنوان الإعلان"
              />
            </div>

            <div className="myads-form-group">
              <label>نوع الأرض</label>
              <select
                name="land_type"
                value={adFormData.land_type}
                onChange={handleAdChange}
                required
                className="myads-form-control"
              >
                <option value="سكني">سكني</option>
                <option value="تجاري">تجاري</option>
                <option value="زراعي">زراعي</option>
                <option value="صناعي">صناعي</option>
              </select>
            </div>

            <div className="myads-form-group">
              <label>الغرض</label>
              <select
                name="purpose"
                value={adFormData.purpose}
                onChange={handleAdChange}
                required
                className="myads-form-control"
              >
                <option value="بيع">بيع</option>
                <option value="استثمار">استثمار</option>
              </select>
            </div>

            {/* الحقول المشروطة حسب purpose */}
            {adFormData.purpose === 'بيع' && (
              <div className="myads-form-group">
                <label>سعر المتر المربع (ريال)</label>
                <input
                  type="number"
                  name="price_per_sqm"
                  value={adFormData.price_per_sqm}
                  onChange={handleAdChange}
                  required
                  className="myads-form-control"
                  placeholder="أدخل سعر المتر المربع"
                />
              </div>
            )}

            {adFormData.purpose === 'استثمار' && (
              <>
                <div className="myads-form-group">
                  <label>مدة الاستثمار (شهر)</label>
                  <input
                    type="number"
                    name="investment_duration"
                    value={adFormData.investment_duration}
                    onChange={handleAdChange}
                    required
                    className="myads-form-control"
                    placeholder="أدخل مدة الاستثمار بالأشهر"
                  />
                </div>
                <div className="myads-form-group">
                  <label>القيمة الاستثمارية المتوقعة (ريال)</label>
                  <input
                    type="number"
                    name="estimated_investment_value"
                    value={adFormData.estimated_investment_value}
                    onChange={handleAdChange}
                    required
                    className="myads-form-control"
                    placeholder="أدخل القيمة الاستثمارية المتوقعة"
                  />
                </div>
              </>
            )}

            {/* حقل agency_number للمستخدمين الوكلاء الشرعيين */}
            {currentUser?.user_type === 'وكيل شرعي' && (
              <div className="myads-form-group">
                <label>رقم الوكالة</label>
                <input
                  type="text"
                  name="agency_number"
                  value={adFormData.agency_number}
                  onChange={handleAdChange}
                  required
                  className="myads-form-control"
                  placeholder="أدخل رقم الوكالة"
                />
              </div>
            )}

            {/* المعلومات الهندسية */}
            <div className="myads-form-group">
              <label>المساحة الإجمالية (م²)</label>
              <input
                type="number"
                name="total_area"
                value={adFormData.total_area}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل المساحة الإجمالية"
                step="0.01"
              />
            </div>

            <div className="myads-form-group">
              <label>الطول شمال (م)</label>
              <input
                type="number"
                name="length_north"
                value={adFormData.length_north}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="الطول شمال"
                step="0.01"
              />
            </div>

            <div className="myads-form-group">
              <label>الطول جنوب (م)</label>
              <input
                type="number"
                name="length_south"
                value={adFormData.length_south}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="الطول جنوب"
                step="0.01"
              />
            </div>

            <div className="myads-form-group">
              <label>الطول شرق (م)</label>
              <input
                type="number"
                name="length_east"
                value={adFormData.length_east}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="الطول شرق"
                step="0.01"
              />
            </div>

            <div className="myads-form-group">
              <label>الطول غرب (م)</label>
              <input
                type="number"
                name="length_west"
                value={adFormData.length_west}
                onChange={handleAdChange}
                className="myads-form-control"
                placeholder="الطول غرب"
                step="0.01"
              />
            </div>

            <div className="myads-form-group">
              <label>رقم الصك</label>
              <input
                type="text"
                name="deed_number"
                value={adFormData.deed_number}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل رقم الصك"
              />
            </div>

            <div className="myads-form-group full-width">
              <label>الموقع الجغرافي (وصف)</label>
              <input
                type="text"
                name="geo_location_text"
                value={adFormData.geo_location_text}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                placeholder="أدخل وصف الموقع الجغرافي"
              />
            </div>

            <div className="myads-form-group full-width">
              <label>الوصف</label>
              <textarea
                name="description"
                value={adFormData.description}
                onChange={handleAdChange}
                required
                className="myads-form-control"
                rows="4"
                placeholder="أدخل وصفاً مفصلاً عن الأرض"
              />
            </div>

            {/* رفع الملفات */}
            <div className="myads-form-group">
              <label>الصورة الرئيسية</label>
              <div className="myads-file-input-wrapper">
                <input
                  type="file"
                  name="cover_image"
                  onChange={handleAdChange}
                  required
                  accept="image/*"
                  className="myads-form-control"
                />
              </div>
            </div>

            <div className="myads-form-group">
              <label>الصور الإضافية</label>
              <div className="myads-file-input-wrapper">
                <input
                  type="file"
                  name="images"
                  onChange={handleAdChange}
                  multiple
                  accept="image/*"
                  className="myads-form-control"
                />
                <small>يمكنك رفع أكثر من صورة</small>
              </div>
            </div>

            <div className="myads-form-group full-width">
              <label className="myads-checkbox-container">
                <input
                  type="checkbox"
                  name="legal_declaration"
                  checked={adFormData.legal_declaration}
                  onChange={handleAdChange}
                  required
                />
                <span className="myads-checkmark"></span>
                <span>أقر بأن جميع المعلومات المقدمة صحيحة وأتحمل المسؤولية القانونية</span>
              </label>
            </div>
          </div>

          <div className="myads-form-actions">
            <button 
              type="button" 
              className="myads-btn myads-btn-outline"
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
              className="myads-btn myads-btn-primary"
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
      <div className="myads-page-container">
        <div className="myads-header-row">
          <h1 className="myads-page-title">
            {currentUser?.user_type === 'شركة مزادات' ? 'مزاداتي' : 'إعلاناتي'}
          </h1>
          <div className="myads-header-controls">
            <button className="myads-add-btn" onClick={() => setShowAdForm(true)}>
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
          <button 
            className={`myads-status-btn ${activeStatus === 'مفتوح' ? 'active' : ''}`}
            onClick={() => handleStatusChange('مفتوح')}
          >
            مفتوح
          </button>
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
            <div className="myads-error-icon">!</div>
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
                    src={
                      ad.cover_image_url || 
                      (ad.cover_image ? `https://shahin-tqay.onrender.com/storage/${ad.cover_image}` : 'https://via.placeholder.com/300x150?text=لا+توجد+صورة')
                    } 
                    alt={ad.title} 
                  />
                  {getStatusBadge(ad.status)}
                </div>
                <div className="myads-content">
                  <h3 className="myads-title">{ad.title}</h3>
                  <div className="myads-info">
                    {currentUser?.user_type === 'شركة مزادات' ? (
                      <>
                        <div className="myads-info-item">
                          <span className="myads-info-label">العنوان:</span>
                          <span className="myads-info-value">{ad.address}</span>
                        </div>
                        <div className="myads-info-item">
                          <span className="myads-info-label">التاريخ:</span>
                          <span className="myads-info-value">
                            {new Date(ad.auction_date).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="myads-info-item">
                          <span className="myads-info-label">الوقت:</span>
                          <span className="myads-info-value">{ad.start_time}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="myads-info-item">
                          <span className="myads-info-label">المدينة:</span>
                          <span className="myads-info-value">{ad.city}</span>
                        </div>
                        <div className="myads-info-item">
                          <span className="myads-info-label">المساحة:</span>
                          <span className="myads-info-value">{ad.total_area} م²</span>
                        </div>
                        {ad.purpose === 'بيع' ? (
                          <div className="myads-info-item">
                            <span className="myads-info-label">السعر:</span>
                            <span className="myads-info-value">
                              {ad.price_per_sqm * ad.total_area} ريال
                            </span>
                          </div>
                        ) : (
                          <div className="myads-info-item">
                            <span className="myads-info-label">قيمة الاستثمار:</span>
                            <span className="myads-info-value">
                              {ad.estimated_investment_value} ريال
                            </span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <p className="myads-desc">
                    {ad.description?.substring(0, 100)}...
                  </p>
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
              {currentUser?.user_type === 'شركة مزادات' ? '🏷️' : '📝'}
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
            <button className="myads-btn myads-btn-primary" onClick={() => setShowAdForm(true)}>
              {currentUser?.user_type === 'شركة مزادات' ? 'إضافة مزاد جديد' : 'إضافة إعلان جديد'}
            </button>
          </div>
        )}
      </div>
      {showAdForm && renderAdForm()}
    </div>
  );
}

export default MyAds;