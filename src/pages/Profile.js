import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

function Profile() {
  const { currentUser, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [activeTab, setActiveTab] = useState('personal');

  useEffect(() => {
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        idNumber: currentUser.idNumber || '',
        legalAgentNumber: currentUser.legalAgentNumber || '',
        establishmentName: currentUser.establishmentName || '',
        commercialRecord: currentUser.commercialRecord || '',
        representativeName: currentUser.representativeName || '',
        establishmentIdNumber: currentUser.establishmentIdNumber || '',
        realEstateLicense: currentUser.realEstateLicense || '',
        auctionLicense: currentUser.auctionLicense || '',
        userType: currentUser.userType || 'individual'
      });
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUser(formData);
    setIsEditing(false);
    // هنا يمكن إضافة استدعاء API لتحديث البيانات في الخادم
  };

  const handleCancel = () => {
    setFormData(currentUser);
    setIsEditing(false);
  };

  const renderUserTypeText = () => {
    const types = {
      individual: 'مستخدم عادي',
      owner: 'مالك أرض',
      legalAgent: 'وكيل شرعي',
      company: 'منشأة تجارية',
      realEstateAgent: 'وسيط عقاري',
      auctionCompany: 'شركة مزادات عقارية'
    };
    return types[currentUser?.userType] || 'مستخدم';
  };

  const renderPersonalInfo = () => (
    <div className="profile-section">
      <h3>المعلومات الشخصية</h3>
      <div className="info-grid">
        <div className="info-item">
          <label>الاسم الثلاثي</label>
          {isEditing ? (
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="edit-input"
            />
          ) : (
            <p>{currentUser?.name || 'غير محدد'}</p>
          )}
        </div>

        <div className="info-item">
          <label>البريد الإلكتروني</label>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="edit-input"
            />
          ) : (
            <p>{currentUser?.email || 'غير محدد'}</p>
          )}
        </div>

        <div className="info-item">
          <label>رقم الجوال</label>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="edit-input"
            />
          ) : (
            <p>{currentUser?.phone || 'غير محدد'}</p>
          )}
        </div>

        {(currentUser?.userType === 'owner' || currentUser?.userType === 'legalAgent' || currentUser?.userType === 'realEstateAgent') && (
          <div className="info-item">
            <label>رقم الهوية</label>
            {isEditing ? (
              <input
                type="text"
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p>{currentUser?.idNumber || 'غير محدد'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderAdditionalInfo = () => (
    <div className="profile-section">
      <h3>معلومات إضافية</h3>
      <div className="info-grid">
        {currentUser?.userType === 'legalAgent' && (
          <div className="info-item">
            <label>رقم الوكالة الشرعية</label>
            {isEditing ? (
              <input
                type="text"
                name="legalAgentNumber"
                value={formData.legalAgentNumber}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p>{currentUser?.legalAgentNumber || 'غير محدد'}</p>
            )}
          </div>
        )}

        {(currentUser?.userType === 'company' || currentUser?.userType === 'auctionCompany') && (
          <>
            <div className="info-item">
              <label>اسم المنشأة</label>
              {isEditing ? (
                <input
                  type="text"
                  name="establishmentName"
                  value={formData.establishmentName}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{currentUser?.establishmentName || 'غير محدد'}</p>
              )}
            </div>

            <div className="info-item">
              <label>رقم السجل التجاري</label>
              {isEditing ? (
                <input
                  type="text"
                  name="commercialRecord"
                  value={formData.commercialRecord}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{currentUser?.commercialRecord || 'غير محدد'}</p>
              )}
            </div>

            <div className="info-item">
              <label>اسم الممثل</label>
              {isEditing ? (
                <input
                  type="text"
                  name="representativeName"
                  value={formData.representativeName}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{currentUser?.representativeName || 'غير محدد'}</p>
              )}
            </div>

            <div className="info-item">
              <label>رقم هوية الممثل</label>
              {isEditing ? (
                <input
                  type="text"
                  name="establishmentIdNumber"
                  value={formData.establishmentIdNumber}
                  onChange={handleChange}
                  className="edit-input"
                />
              ) : (
                <p>{currentUser?.establishmentIdNumber || 'غير محدد'}</p>
              )}
            </div>
          </>
        )}

        {currentUser?.userType === 'realEstateAgent' && (
          <div className="info-item">
            <label>رقم الترخيص العقاري</label>
            {isEditing ? (
              <input
                type="text"
                name="realEstateLicense"
                value={formData.realEstateLicense}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p>{currentUser?.realEstateLicense || 'غير محدد'}</p>
            )}
          </div>
        )}

        {currentUser?.userType === 'auctionCompany' && (
          <div className="info-item">
            <label>رقم ترخيص المزادات</label>
            {isEditing ? (
              <input
                type="text"
                name="auctionLicense"
                value={formData.auctionLicense}
                onChange={handleChange}
                className="edit-input"
              />
            ) : (
              <p>{currentUser?.auctionLicense || 'غير محدد'}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="profile-section">
      <h3>الوثائق والمستندات</h3>
      <div className="documents-grid">
        {currentUser?.userType === 'legalAgent' && (
          <div className="document-item">
            <span>الوكالة الشرعية</span>
            <button className="btn btn-secondary">عرض الوثيقة</button>
          </div>
        )}

        {(currentUser?.userType === 'company' || currentUser?.userType === 'auctionCompany') && (
          <div className="document-item">
            <span>السجل التجاري</span>
            <button className="btn btn-secondary">عرض الوثيقة</button>
          </div>
        )}

        {currentUser?.userType === 'realEstateAgent' && (
          <div className="document-item">
            <span>الترخيص العقاري</span>
            <button className="btn btn-secondary">عرض الوثيقة</button>
          </div>
        )}

        {currentUser?.userType === 'auctionCompany' && (
          <div className="document-item">
            <span>ترخيص المزادات</span>
            <button className="btn btn-secondary">عرض الوثيقة</button>
          </div>
        )}
      </div>
    </div>
  );

  if (!currentUser) {
    return (
      <div className="profile-container">
        <div className="loading">جاري تحميل البيانات...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <div className="avatar-circle">
            {currentUser.name ? currentUser.name.charAt(0) : 'U'}
          </div>
        </div>
        <div className="profile-info">
          <h1>{currentUser.name}</h1>
          <p className="user-type">{renderUserTypeText()}</p>
          <p className="user-email">{currentUser.email}</p>
        </div>
        <div className="profile-actions">
          {!isEditing ? (
            <button 
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
            >
              تعديل الملف الشخصي
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn btn-primary" onClick={handleSubmit}>
                حفظ التغييرات
              </button>
              <button className="btn btn-secondary" onClick={handleCancel}>
                إلغاء
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-button ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          المعلومات الشخصية
        </button>
        <button 
          className={`tab-button ${activeTab === 'additional' ? 'active' : ''}`}
          onClick={() => setActiveTab('additional')}
        >
          معلومات إضافية
        </button>
        <button 
          className={`tab-button ${activeTab === 'documents' ? 'active' : ''}`}
          onClick={() => setActiveTab('documents')}
        >
          الوثائق
        </button>
      </div>

      <div className="profile-content">
        {activeTab === 'personal' && renderPersonalInfo()}
        {activeTab === 'additional' && renderAdditionalInfo()}
        {activeTab === 'documents' && renderDocuments()}
      </div>
    </div>
  );
}

export default Profile;