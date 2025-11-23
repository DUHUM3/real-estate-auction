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
  FiBriefcase
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
          
          const initialFormData = {
            full_name: data.user.full_name || '',
            email: data.user.email || '',
            phone: data.user.phone || '',
            user_type: data.user.user_type || 'individual',
          };

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

  /**
   * التحقق مما إذا كان يجب عرض الإحصائيات
   * إخفاء الإحصائيات عن المستخدم العام وشركة المزادات
   */
  const shouldShowStats = () => {
    if (!apiData) return false;
    
    const userType = apiData.user.user_type;
    // إخفاء الإحصائيات عن المستخدم العام وشركة المزادات
    return userType !== 'مستخدم عام' && userType !== 'شركة مزادات';
  };

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
      
      const submitData = {
        full_name: formData.full_name,
        email: formData.email,
        phone: formData.phone,
        user_type: formData.user_type
      };

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

  const hasDetails = () => {
    return apiData?.user?.details !== null && apiData?.user?.details !== undefined;
  };

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
      return <MdBusiness className="profile-type-icon" />;
    }
    return <MdPerson className="profile-type-icon" />;
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="profile-loading">
          <div className="profile-spinner"></div>
          <p>جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  if (!apiData) {
    return (
      <div className="profile-container">
        <div className="profile-error">
          <FiXCircle className="error-icon" />
          <p>حدث خطأ في جلب البيانات</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      {/* بطاقة المعلومات الرئيسية */}
      <div className="profile-header">
        <div className="profile-avatar-section">
          <div className="avatar-circle">
            <FiUser className="avatar-icon2" />
          </div>
          <div className={`status-dot ${apiData?.user?.status}`}></div>
        </div>
        
        <div className="profile-info">
          <h2 className="profile-name">{apiData.user.full_name || 'المستخدم'}</h2>
          <div className="profile-type">
            {getUserTypeIcon()}
            <span>{renderUserTypeText()}</span>
          </div>
          <div className="profile-contact">
            <FiMail className="contact-icon" />
            <span>{apiData.user.email}</span>
          </div>
          <div className="profile-contact">
            <FiPhone className="contact-icon" />
            <span>{apiData.user.phone || 'لم يتم إضافة رقم الجوال'}</span>
          </div>
        </div>

        {/* <div className="profile-actions">
          {!isEditing ? (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              <FiEdit2 />
              <span>تعديل</span>
            </button>
          ) : (
            <div className="action-buttons">
              <button className="save-btn" onClick={handleSubmit}>
                <FiSave />
                <span>حفظ</span>
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                <FiX />
                <span>إلغاء</span>
              </button>
            </div>
          )}
        </div> */}
      </div>

      {/* بطاقة الإحصائيات - تظهر فقط للمستخدمين المسموح لهم */}
      {shouldShowStats() && (
        <div className="stats-section">
          <h3 className="section-title">
            <FiHome className="title-icon" />
            إحصائيات الاراضي
          </h3>
          {statsLoading ? (
            <div className="stats-loading">
              <div className="loading-spinner"></div>
              <span>جاري التحميل...</span>
            </div>
          ) : stats ? (
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-icon total">
                  <FiHome />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.total}</span>
                  <span className="stat-label">الإجمالي</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon pending">
                  <FiClock />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.under_review}</span>
                  <span className="stat-label">قيد المراجعة</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon approved">
                  <FiCheckCircle />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.approved}</span>
                  <span className="stat-label">معتمدة</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon rejected">
                  <FiXCircle />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.rejected}</span>
                  <span className="stat-label">مرفوضة</span>
                </div>
              </div>
              <div className="stat-item">
                <div className="stat-icon sold">
                  <FiDollarSign />
                </div>
                <div className="stat-content">
                  <span className="stat-number">{stats.sold}</span>
                  <span className="stat-label">تم بيعها</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="stats-error">
              <FiXCircle />
              <span>تعذر تحميل الإحصائيات</span>
            </div>
          )}
        </div>
      )}

      {/* المعلومات الشخصية */}
      <div className="info-section">
        <h3 className="section-title">
          <FiUser className="title-icon" />
          المعلومات الشخصية
        </h3>
        <div className="info-list">
          <div className="info-item">
            <div className="info-label">
              <FiUser className="label-icon" />
              <span>الاسم الثلاثي</span>
            </div>
            {isEditing ? (
              <input
                type="text"
                name="full_name"
                value={formData.full_name || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="أدخل اسمك الثلاثي"
              />
            ) : (
              <span className="info-value">{apiData?.user?.full_name || 'غير محدد'}</span>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <FiMail className="label-icon" />
              <span>البريد الإلكتروني</span>
            </div>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="أدخل بريدك الإلكتروني"
              />
            ) : (
              <span className="info-value">{apiData?.user?.email || 'غير محدد'}</span>
            )}
          </div>

          <div className="info-item">
            <div className="info-label">
              <FiPhone className="label-icon" />
              <span>رقم الجوال</span>
            </div>
            {isEditing ? (
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="input-field"
                placeholder="أدخل رقم جوالك"
              />
            ) : (
              <span className="info-value">{apiData?.user?.phone || 'غير محدد'}</span>
            )}
          </div>

          {isEditing && (
            <div className="info-item">
              <div className="info-label">
                <MdAssignment className="label-icon" />
                <span>نوع الحساب</span>
              </div>
              <select 
                name="user_type"
                value={formData.user_type || 'individual'}
                onChange={handleChange}
                className="select-field"
              >
                <option value="individual">فرد</option>
                <option value="company">شركة</option>
                <option value="جهة تجارية">جهة تجارية</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* معلومات إضافية */}
      {(hasDetails() || (isEditing && isCommercialEntity())) && (
        <div className="info-section">
          <h3 className="section-title">
            <MdBusiness className="title-icon" />
            معلومات المنشأة
          </h3>
          <div className="info-list">
            <div className="info-item">
              <div className="info-label">
                <FiBriefcase className="label-icon" />
                <span>اسم المنشأة</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="business_name"
                  value={formData.business_name || ''}
                  onChange={handleChange}
                  className="input-field"
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
                <FiFileText className="label-icon" />
                <span>السجل التجاري</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="commercial_register"
                  value={formData.commercial_register || ''}
                  onChange={handleChange}
                  className="input-field"
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
                <MdBadge className="label-icon" />
                <span>رقم الهوية الوطنية</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="national_id"
                  value={formData.national_id || ''}
                  onChange={handleChange}
                  className="input-field"
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

      {/* الوثائق والمستندات */}
      {hasDetails() && apiData?.user?.details?.commercial_file && (
        <div className="docs-section">
          <h3 className="section-title">
            <FiFileText className="title-icon" />
            الوثائق والمستندات
          </h3>
          <div className="docs-list">
            <div className="doc-item">
              <div className="doc-info">
                <FiFileText className="doc-icon" />
                <span className="doc-name">السجل التجاري</span>
              </div>
              <button
                className="doc-btn"
                onClick={() => window.open(apiData.user.details.commercial_file, '_blank')}
              >
                <FiFileText />
                <span>عرض المستند</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;