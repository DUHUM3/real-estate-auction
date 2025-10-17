import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit2, 
  FiSave, 
  FiX,
  FiFileText,
  FiHome,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiDollarSign,
  FiBriefcase,
  FiMapPin
} from 'react-icons/fi';
import { 
  MdBusiness, 
  MdAssignment, 
  MdBadge,
  MdPerson 
} from 'react-icons/md';
import '../styles/Profile.css';

function Profile() {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [apiData, setApiData] = useState(null);
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // جلب البيانات من API الملف الشخصي
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('https://shahin-tqay.onrender.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setApiData(data);
          
          // تعبئة formData بالبيانات من API مع التحقق من وجود details
          const initialFormData = {
            full_name: data.user.full_name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            user_type: data.user.user_type || 'individual',
          };

          // إضافة بيانات details فقط إذا كانت موجودة
          if (data.user.details) {
            initialFormData.business_name = data.user.details.business_name || '';
            initialFormData.commercial_register = data.user.details.commercial_register || '';
            initialFormData.national_id = data.user.details.national_id || '';
          }

          setFormData(initialFormData);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  // جلب إحصائيات المستخدم
  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        setStatsLoading(true);
        const token = localStorage.getItem('token');
        const response = await fetch('https://shahin-tqay.onrender.com/api/user/properties/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const statsData = await response.json();
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Error fetching user stats:', error);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchUserStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      // إعداد البيانات للإرسال
      const submitData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        user_type: formData.user_type
      };

      // إضافة بيانات details إذا كانت موجودة
      if (formData.business_name || formData.commercial_register || formData.national_id) {
        submitData.details = {
          business_name: formData.business_name,
          commercial_register: formData.commercial_register,
          national_id: formData.national_id
        };
      }

      const response = await fetch('https://shahin-tqay.onrender.com/api/profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        updateUser(formData);
        setIsEditing(false);
        // تحديث البيانات المعروضة
        const updatedResponse = await fetch('https://shahin-tqay.onrender.com/api/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setApiData(updatedData);
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    // إعادة تعيين البيانات من API مع التحقق من وجود details
    if (apiData) {
      const resetFormData = {
        full_name: apiData.user.full_name || '',
        email: apiData.user.email || '',
        phone: apiData.user.phone || '',
        user_type: apiData.user.user_type || 'individual',
      };

      if (apiData.user.details) {
        resetFormData.business_name = apiData.user.details.business_name || '';
        resetFormData.commercial_register = apiData.user.details.commercial_register || '';
        resetFormData.national_id = apiData.user.details.national_id || '';
      }

      setFormData(resetFormData);
    }
    setIsEditing(false);
  };

  // دالة للتحقق إذا كان المستخدم لديه بيانات details
  const hasDetails = () => {
    return apiData?.user?.details !== null && apiData?.user?.details !== undefined;
  };

  // دالة للتحقق إذا كان المستخدم من نوع "جهة تجارية"
  const isCommercialEntity = () => {
    return apiData?.user?.user_type === 'جهة تجارية' || formData.user_type === 'company' || formData.user_type === 'جهة تجارية';
  };

  const renderUserTypeText = () => {
    const userType = apiData?.user?.user_type;
    
    if (userType === 'individual') {
      return 'فرد';
    } else if (userType === 'company') {
      return 'شركة';
    } else if (userType === 'جهة تجارية') {
      return 'جهة تجارية';
    } else {
      return userType || 'مستخدم';
    }
  };

  const getUserTypeIcon = () => {
    const userType = apiData?.user?.user_type;
    if (userType === 'company' || userType === 'جهة تجارية') {
      return <MdBusiness className="user-type-icon" />;
    }
    return <MdPerson className="user-type-icon" />;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="profile-container">
        <div className="error-message">
          <FiXCircle className="error-icon" />
          <p>حدث خطأ في جلب البيانات، يرجى المحاولة مرة أخرى</p>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="modern-profile-container">
      {/* بطاقة المعلومات الرئيسية */}
      <div className="profile-card main-info-card">
        <div className="profile-header">
          <div className="avatar-section">
            <div className="avatar-container">
              <div className="avatar">
                <FiUser className="avatar-icon" />
              </div>
              <div className={`status-indicator ${apiData?.user?.status}`} 
                   title={apiData?.user?.status === 'approved' ? 'مفعل' : 
                          apiData?.user?.status === 'pending' ? 'قيد المراجعة' : 'غير مفعل'}>
              </div>
            </div>
            <div className="user-main-info">
              <h2 className="user-name">{apiData.user.full_name || 'المستخدم'}</h2>
              <div className="user-type-badge">
                {getUserTypeIcon()}
                <span>{renderUserTypeText()}</span>
              </div>
              <p className="user-email">
                <FiMail className="info-icon" />
                {apiData.user.email}
              </p>
              <div className="user-status">
                <span className={`status-badge ${apiData?.user?.status}`}>
                  {apiData?.user?.status === 'approved' ? 'مفعل' : 
                   apiData?.user?.status === 'pending' ? 'قيد المراجعة' : 'غير مفعل'}
                </span>
              </div>
            </div>
          </div>
          <div className="profile-actions">
            {!isEditing ? (
              <button className="btn edit-btn" onClick={() => setIsEditing(true)}>
                <FiEdit2 className="btn-icon" />
                <span className="btn-text">تعديل الملف الشخصي</span>
              </button>
            ) : (
              <div className="edit-actions">
                <button className="btn save-btn" onClick={handleSubmit}>
                  <FiSave className="btn-icon" />
                  <span className="btn-text">حفظ</span>
                </button>
                <button className="btn cancel-btn" onClick={handleCancel}>
                  <FiX className="btn-icon" />
                  <span className="btn-text">إلغاء</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* بطاقة الإحصائيات */}
      <div className="profile-card stats-card">
        <h3 className="card-title">
          <FiHome className="title-icon" />
          إحصائيات العقارات
        </h3>
        {statsLoading ? (
          <div className="stats-loading">
            <div className="loading-spinner-small"></div>
            جاري تحميل الإحصائيات...
          </div>
        ) : stats ? (
          <div className="stats-container">
            <div className="stat-item">
              <div className="stat-icon total">
                <FiHome />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.total}</span>
                <span className="stat-label">إجمالي العقارات</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon pending">
                <FiClock />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.under_review}</span>
                <span className="stat-label">قيد المراجعة</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon approved">
                <FiCheckCircle />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.approved}</span>
                <span className="stat-label">معتمدة</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon rejected">
                <FiXCircle />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.rejected}</span>
                <span className="stat-label">مرفوضة</span>
              </div>
            </div>
            <div className="stat-item">
              <div className="stat-icon sold">
                <FiDollarSign />
              </div>
              <div className="stat-details">
                <span className="stat-value">{stats.sold}</span>
                <span className="stat-label">تم بيعها</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="stats-error">
            <FiXCircle className="error-icon-small" />
            تعذر تحميل الإحصائيات
          </div>
        )}
      </div>

      {/* المعلومات الشخصية */}
      <div className="profile-card">
        <h3 className="card-title">
          <FiUser className="title-icon" />
          المعلومات الشخصية
        </h3>
        <div className="info-list">
          <div className="info-item">
            <div className="info-label">
              <FiUser className="info-icon" />
              <span>الاسم الثلاثي</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                className="edit-input"
                placeholder="أدخل اسمك الثلاثي"
              />
            ) : (
              <span className="info-value">{apiData?.user?.full_name || 'غير محدد'}</span>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <FiMail className="info-icon" />
              <span>البريد الإلكتروني</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="edit-input"
                placeholder="أدخل بريدك الإلكتروني"
              />
            ) : (
              <span className="info-value">{apiData?.user?.email || 'غير محدد'}</span>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <FiPhone className="info-icon" />
              <span>رقم الجوال</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="edit-input"
                placeholder="أدخل رقم جوالك"
              />
            ) : (
              <span className="info-value">{apiData?.user?.phone || 'غير محدد'}</span>
            )}
          </div>

          {isEditing && (
            <div className="info-item">
              <div className="info-label">
                <MdAssignment className="info-icon" />
                <span>نوع الحساب</span>
              </div>
              <select 
                name="user_type"
                value={formData.user_type || 'individual'}
                onChange={handleChange}
                className="edit-input select-input"
              >
                <option value="individual">فرد</option>
                <option value="company">شركة</option>
                <option value="جهة تجارية">جهة تجارية</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* معلومات إضافية - تظهر فقط إذا كان لديه details أو في وضع التعديل وكان نوعه شركة */}
      {(hasDetails() || (isEditing && isCommercialEntity())) && (
        <div className="profile-card">
          <h3 className="card-title">
            <MdBusiness className="title-icon" />
            معلومات المنشأة
          </h3>
          <div className="info-list">
            <div className="info-item">
              <div className="info-label">
                <FiBriefcase className="info-icon" />
                <span>اسم المنشأة</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name || ''}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="أدخل اسم المنشأة"
                />
              ) : (
                <span className="info-value">
                  {apiData?.user?.details?.business_name || 'غير محدد'}
                </span>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <FiFileText className="info-icon" />
                <span>السجل التجاري</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="commercial_register"
                  value={formData.commercial_register || ''}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="أدخل رقم السجل التجاري"
                />
              ) : (
                <span className="info-value">
                  {apiData?.user?.details?.commercial_register || 'غير محدد'}
                </span>
              )}
            </div>

            <div className="info-item">
              <div className="info-label">
                <MdBadge className="info-icon" />
                <span>رقم الهوية الوطنية</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id || ''}
                  onChange={handleChange}
                  className="edit-input"
                  placeholder="أدخل رقم الهوية الوطنية"
                />
              ) : (
                <span className="info-value">
                  {apiData?.user?.details?.national_id || 'غير محدد'}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* الوثائق والمستندات - تظهر فقط إذا كان هناك ملف تجاري */}
      {hasDetails() && apiData?.user?.details?.commercial_file && (
        <div className="profile-card">
          <h3 className="card-title">
            <FiFileText className="title-icon" />
            الوثائق والمستندات
          </h3>
          <div className="documents-list">
            <div className="document-item">
              <div className="document-info">
                <FiFileText className="document-icon" />
                <span className="document-name">السجل التجاري</span>
              </div>
              <button
                className="btn document-btn"
                onClick={() => window.open(apiData.user.details.commercial_file, '_blank')}
              >
                <FiFileText className="btn-icon" />
                <span className="btn-text">عرض المستند</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;