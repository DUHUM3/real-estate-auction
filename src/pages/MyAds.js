import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/MyAds.css';

function MyAds() {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('ads');
  const [showAdForm, setShowAdForm] = useState(false);
  const [showAuctionForm, setShowAuctionForm] = useState(false);
  const [ads, setAds] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [adFormData, setAdFormData] = useState({
    title: '',
    description: '',
    price: '',
    area: '',
    location: '',
    landType: 'residential',
    images: []
  });
  const [auctionFormData, setAuctionFormData] = useState({
    title: '',
    description: '',
    startPrice: '',
    minBid: '',
    endDate: '',
    area: '',
    location: '',
    landType: 'residential',
    documents: []
  });

  // تحميل البيانات الأولية
  useEffect(() => {
    // محاكاة بيانات الإعلانات
    const sampleAds = [
      {
        id: 1,
        title: 'أرض سكنية في حي الربيع',
        description: 'أرض سكنية ممتازة بمساحة 600 متر',
        price: '500,000',
        area: '600',
        location: 'حي الربيع، الرياض',
        status: 'active',
        date: '2024-01-15',
        views: 150
      },
      {
        id: 2,
        title: 'مزرعة للبيع في الخرج',
        description: 'مزرعة بها بئر وأشجار مثمرة',
        price: '1,200,000',
        area: '5000',
        location: 'الخرج',
        status: 'pending',
        date: '2024-01-10',
        views: 80
      }
    ];

    const sampleAuctions = [
      {
        id: 1,
        title: 'مزاد أرض تجارية',
        description: 'أرض تجارية بموقع مميز',
        startPrice: '300,000',
        currentBid: '450,000',
        minBid: '10,000',
        endDate: '2024-02-01',
        status: 'active',
        bidders: 12,
        date: '2024-01-12'
      }
    ];

    setAds(sampleAds);
    setAuctions(sampleAuctions);
  }, []);

  const handleAdChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'images') {
      setAdFormData({
        ...adFormData,
        images: Array.from(files)
      });
    } else {
      setAdFormData({
        ...adFormData,
        [name]: value
      });
    }
  };

  const handleAuctionChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'documents') {
      setAuctionFormData({
        ...auctionFormData,
        documents: Array.from(files)
      });
    } else {
      setAuctionFormData({
        ...auctionFormData,
        [name]: value
      });
    }
  };

  const handleAdSubmit = (e) => {
    e.preventDefault();
    const newAd = {
      id: ads.length + 1,
      ...adFormData,
      status: 'pending',
      date: new Date().toISOString().split('T')[0],
      views: 0
    };
    setAds([newAd, ...ads]);
    setShowAdForm(false);
    setAdFormData({
      title: '',
      description: '',
      price: '',
      area: '',
      location: '',
      landType: 'residential',
      images: []
    });
    alert('تم إنشاء الإعلان بنجاح وسيتم مراجعته من قبل الإدارة');
  };

  const handleAuctionSubmit = (e) => {
    e.preventDefault();
    const newAuction = {
      id: auctions.length + 1,
      ...auctionFormData,
      status: 'pending',
      currentBid: auctionFormData.startPrice,
      bidders: 0,
      date: new Date().toISOString().split('T')[0]
    };
    setAuctions([newAuction, ...auctions]);
    setShowAuctionForm(false);
    setAuctionFormData({
      title: '',
      description: '',
      startPrice: '',
      minBid: '',
      endDate: '',
      area: '',
      location: '',
      landType: 'residential',
      documents: []
    });
    alert('تم تقديم طلب المزاد بنجاح وسيتم مراجعته من قبل الإدارة');
  };

  const deleteAd = (adId) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الإعلان؟')) {
      setAds(ads.filter(ad => ad.id !== adId));
    }
  };

  const deleteAuction = (auctionId) => {
    if (window.confirm('هل أنت متأكد من حذف طلب المزاد هذا؟')) {
      setAuctions(auctions.filter(auction => auction.id !== auctionId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { text: 'نشط', class: 'status-active' },
      pending: { text: 'قيد المراجعة', class: 'status-pending' },
      rejected: { text: 'مرفوض', class: 'status-rejected' },
      sold: { text: 'تم البيع', class: 'status-sold' },
      expired: { text: 'منتهي', class: 'status-expired' }
    };
    const config = statusConfig[status] || { text: status, class: 'status-pending' };
    return <span className={`status-badge ${config.class}`}>{config.text}</span>;
  };

  const renderAdForm = () => (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>إنشاء إعلان جديد</h3>
          <button className="close-btn" onClick={() => setShowAdForm(false)}>×</button>
        </div>
        <form onSubmit={handleAdSubmit} className="ad-form">
          <div className="form-grid">
            <div className="form-group">
              <label>عنوان الإعلان *</label>
              <input
                type="text"
                name="title"
                value={adFormData.title}
                onChange={handleAdChange}
                required
                className="form-input"
                placeholder="أدخل عنوان الإعلان"
              />
            </div>

            <div className="form-group">
              <label>وصف الإعلان *</label>
              <textarea
                name="description"
                value={adFormData.description}
                onChange={handleAdChange}
                required
                className="form-input"
                rows="4"
                placeholder="أدخل وصفاً مفصلاً عن الأرض"
              />
            </div>

            <div className="form-group">
              <label>السعر (ريال سعودي) *</label>
              <input
                type="number"
                name="price"
                value={adFormData.price}
                onChange={handleAdChange}
                required
                className="form-input"
                placeholder="أدخل السعر"
              />
            </div>

            <div className="form-group">
              <label>المساحة (م²) *</label>
              <input
                type="number"
                name="area"
                value={adFormData.area}
                onChange={handleAdChange}
                required
                className="form-input"
                placeholder="أدخل المساحة بالمتر المربع"
              />
            </div>

            <div className="form-group">
              <label>الموقع *</label>
              <input
                type="text"
                name="location"
                value={adFormData.location}
                onChange={handleAdChange}
                required
                className="form-input"
                placeholder="أدخل الموقع"
              />
            </div>

            <div className="form-group">
              <label>نوع الأرض *</label>
              <select
                name="landType"
                value={adFormData.landType}
                onChange={handleAdChange}
                required
                className="form-input"
              >
                <option value="residential">سكنية</option>
                <option value="commercial">تجارية</option>
                <option value="agricultural">زراعية</option>
                <option value="industrial">صناعية</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>صور الأرض</label>
              <input
                type="file"
                name="images"
                onChange={handleAdChange}
                multiple
                accept="image/*"
                className="form-input"
              />
              <small>يمكنك رفع أكثر من صورة</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAdForm(false)}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              نشر الإعلان
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAuctionForm = () => (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h3>طلب مزاد جديد</h3>
          <button className="close-btn" onClick={() => setShowAuctionForm(false)}>×</button>
        </div>
        <form onSubmit={handleAuctionSubmit} className="auction-form">
          <div className="form-grid">
            <div className="form-group">
              <label>عنوان المزاد *</label>
              <input
                type="text"
                name="title"
                value={auctionFormData.title}
                onChange={handleAuctionChange}
                required
                className="form-input"
                placeholder="أدخل عنوان المزاد"
              />
            </div>

            <div className="form-group">
              <label>وصف المزاد *</label>
              <textarea
                name="description"
                value={auctionFormData.description}
                onChange={handleAuctionChange}
                required
                className="form-input"
                rows="4"
                placeholder="أدخل وصفاً مفصلاً عن الأرض المعروضة للمزاد"
              />
            </div>

            <div className="form-group">
              <label>سعر البدء (ريال سعودي) *</label>
              <input
                type="number"
                name="startPrice"
                value={auctionFormData.startPrice}
                onChange={handleAuctionChange}
                required
                className="form-input"
                placeholder="أدخل سعر البدء"
              />
            </div>

            <div className="form-group">
              <label>أقل مزايدة (ريال سعودي) *</label>
              <input
                type="number"
                name="minBid"
                value={auctionFormData.minBid}
                onChange={handleAuctionChange}
                required
                className="form-input"
                placeholder="أدخل أقل مبلغ للمزايدة"
              />
            </div>

            <div className="form-group">
              <label>تاريخ انتهاء المزاد *</label>
              <input
                type="date"
                name="endDate"
                value={auctionFormData.endDate}
                onChange={handleAuctionChange}
                required
                className="form-input"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div className="form-group">
              <label>المساحة (م²) *</label>
              <input
                type="number"
                name="area"
                value={auctionFormData.area}
                onChange={handleAuctionChange}
                required
                className="form-input"
                placeholder="أدخل المساحة بالمتر المربع"
              />
            </div>

            <div className="form-group">
              <label>الموقع *</label>
              <input
                type="text"
                name="location"
                value={auctionFormData.location}
                onChange={handleAuctionChange}
                required
                className="form-input"
                placeholder="أدخل الموقع"
              />
            </div>

            <div className="form-group">
              <label>نوع الأرض *</label>
              <select
                name="landType"
                value={auctionFormData.landType}
                onChange={handleAuctionChange}
                required
                className="form-input"
              >
                <option value="residential">سكنية</option>
                <option value="commercial">تجارية</option>
                <option value="agricultural">زراعية</option>
                <option value="industrial">صناعية</option>
              </select>
            </div>

            <div className="form-group full-width">
              <label>الوثائق المطلوبة</label>
              <input
                type="file"
                name="documents"
                onChange={handleAuctionChange}
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
                className="form-input"
              />
              <small>صك الملكية، الهوية، وغيرها من الوثائق</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={() => setShowAuctionForm(false)}>
              إلغاء
            </button>
            <button type="submit" className="btn btn-primary">
              تقديم طلب المزاد
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderAdsList = () => (
    <div className="ads-section">
      <div className="section-header">
        <h2>إعلاناتي</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAdForm(true)}
        >
          + إنشاء إعلان جديد
        </button>
      </div>

      {ads.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد إعلانات</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAdForm(true)}
          >
            إنشاء أول إعلان
          </button>
        </div>
      ) : (
        <div className="ads-grid">
          {ads.map(ad => (
            <div key={ad.id} className="ad-card">
              <div className="ad-header">
                <h3>{ad.title}</h3>
                {getStatusBadge(ad.status)}
              </div>
              <div className="ad-body">
                <p className="ad-description">{ad.description}</p>
                <div className="ad-details">
                  <div className="detail-item">
                    <span className="label">السعر:</span>
                    <span className="value">{ad.price} ريال</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">المساحة:</span>
                    <span className="value">{ad.area} م²</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">الموقع:</span>
                    <span className="value">{ad.location}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">المشاهدات:</span>
                    <span className="value">{ad.views}</span>
                  </div>
                </div>
              </div>
              <div className="ad-footer">
                <span className="ad-date">{ad.date}</span>
                <div className="ad-actions">
                  <button className="btn btn-outline">تعديل</button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteAd(ad.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderAuctionsList = () => (
    <div className="auctions-section">
      <div className="section-header">
        <h2>مزاداتي</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowAuctionForm(true)}
        >
          + طلب مزاد جديد
        </button>
      </div>

      {auctions.length === 0 ? (
        <div className="empty-state">
          <p>لا توجد طلبات مزاد</p>
          <button 
            className="btn btn-primary"
            onClick={() => setShowAuctionForm(true)}
          >
            تقديم أول طلب مزاد
          </button>
        </div>
      ) : (
        <div className="auctions-grid">
          {auctions.map(auction => (
            <div key={auction.id} className="auction-card">
              <div className="auction-header">
                <h3>{auction.title}</h3>
                {getStatusBadge(auction.status)}
              </div>
              <div className="auction-body">
                <p className="auction-description">{auction.description}</p>
                <div className="auction-details">
                  <div className="detail-item">
                    <span className="label">سعر البدء:</span>
                    <span className="value">{auction.startPrice} ريال</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">السعر الحالي:</span>
                    <span className="value highlight">{auction.currentBid} ريال</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">أقل مزايدة:</span>
                    <span className="value">{auction.minBid} ريال</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">ينتهي في:</span>
                    <span className="value">{auction.endDate}</span>
                  </div>
                  <div className="detail-item">
                    <span className="label">عدد المزايدين:</span>
                    <span className="value">{auction.bidders}</span>
                  </div>
                </div>
              </div>
              <div className="auction-footer">
                <span className="auction-date">{auction.date}</span>
                <div className="auction-actions">
                  <button className="btn btn-outline">تفاصيل</button>
                  <button 
                    className="btn btn-danger"
                    onClick={() => deleteAuction(auction.id)}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="my-ads-container">
      <div className="page-header">
        <h1>إعلاناتي وطلبات المزاد</h1>
        <p>إدارة إعلانات الأراضي وطلبات المزادات</p>
      </div>

      <div className="tabs-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'ads' ? 'active' : ''}`}
            onClick={() => setActiveTab('ads')}
          >
            الإعلانات ({ads.length})
          </button>
          <button 
            className={`tab ${activeTab === 'auctions' ? 'active' : ''}`}
            onClick={() => setActiveTab('auctions')}
          >
            طلبات المزاد ({auctions.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'ads' && renderAdsList()}
          {activeTab === 'auctions' && renderAuctionsList()}
        </div>
      </div>

      {showAdForm && renderAdForm()}
      {showAuctionForm && renderAuctionForm()}
    </div>
  );
}

export default MyAds;