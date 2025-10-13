import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import '../styles/Favorites.css';

function Favorites() {
  const { currentUser } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [activeTab, setActiveTab] = useState('lands'); // lands, auctions
  const [loading, setLoading] = useState(true);

  // محاكاة بيانات المفضلة
  useEffect(() => {
    const loadFavorites = () => {
      const sampleFavorites = {
        lands: [
          {
            id: 1,
            title: 'أرض سكنية في حي الربيع',
            description: 'أرض سكنية ممتازة بمساحة 600 متر، موقع استراتيجي قريب من الخدمات',
            price: '500,000',
            area: '600',
            location: 'حي الربيع، الرياض',
            type: 'سكنية',
            image: '/api/placeholder/300/200',
            dateAdded: '2024-01-15',
            seller: 'أحمد محمد',
            contact: '0551234567'
          },
          {
            id: 2,
            title: 'مزرعة للبيع في الخرج',
            description: 'مزرعة بها بئر وأشجار مثمرة، مساحة كبيرة مناسبة للاستثمار الزراعي',
            price: '1,200,000',
            area: '5000',
            location: 'الخرج',
            type: 'زراعية',
            image: '/api/placeholder/300/200',
            dateAdded: '2024-01-10',
            seller: 'شركة الأراضي الزراعية',
            contact: '0509876543'
          },
          {
            id: 3,
            title: 'أرض تجارية على شارع الملك فهد',
            description: 'أرض تجارية بموقع مميز على الشارع الرئيسي، مناسبة للمشاريع التجارية',
            price: '2,500,000',
            area: '800',
            location: 'شارع الملك فهد، الرياض',
            type: 'تجارية',
            image: '/api/placeholder/300/200',
            dateAdded: '2024-01-08',
            seller: 'مؤسسة العقار المتميز',
            contact: '0545554444'
          }
        ],
        auctions: [
          {
            id: 101,
            title: 'مزاد أرض تجارية بموقع مميز',
            description: 'أرض تجارية في موقع استراتيجي، مزاد علني لمدة 7 أيام',
            startPrice: '300,000',
            currentBid: '450,000',
            minBid: '10,000',
            endDate: '2024-02-01',
            timeLeft: '15 يوم',
            bidders: 12,
            area: '700',
            location: 'حي النخيل، جدة',
            type: 'تجارية',
            image: '/api/placeholder/300/200',
            dateAdded: '2024-01-12'
          },
          {
            id: 102,
            title: 'مزاد مزرعة نموذجية',
            description: 'مزرعة نموذجية مجهزة بكامل الخدمات، مزاد إلكتروني',
            startPrice: '800,000',
            currentBid: '950,000',
            minBid: '25,000',
            endDate: '2024-01-28',
            timeLeft: '3 أيام',
            bidders: 8,
            area: '3000',
            location: 'الدمام',
            type: 'زراعية',
            image: '/api/placeholder/300/200',
            dateAdded: '2024-01-14'
          }
        ]
      };
      
      setFavorites(sampleFavorites);
      setLoading(false);
    };

    loadFavorites();
  }, []);

  const removeFromFavorites = (id, type) => {
    if (window.confirm('هل أنت متأكد من إزالة هذا العنصر من المفضلة؟')) {
      setFavorites(prev => ({
        ...prev,
        [type]: prev[type].filter(item => item.id !== id)
      }));
    }
  };

  const clearAllFavorites = () => {
    if (window.confirm('هل أنت متأكد من حذف جميع العناصر من المفضلة؟')) {
      setFavorites({
        lands: [],
        auctions: []
      });
    }
  };

  const contactSeller = (contactInfo) => {
    alert(`رقم التواصل: ${contactInfo}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('ar-SA').format(price);
  };

  const renderLandCard = (land) => (
    <div key={land.id} className="favorite-card">
      <div className="card-image">
        <img src={land.image} alt={land.title} />
        <button 
          className="remove-btn"
          onClick={() => removeFromFavorites(land.id, 'lands')}
          title="إزالة من المفضلة"
        >
          ♥
        </button>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{land.title}</h3>
          <span className="property-type">{land.type}</span>
        </div>
        
        <p className="card-description">{land.description}</p>
        
        <div className="card-details">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">السعر:</span>
              <span className="detail-value price">{formatPrice(land.price)} ريال</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">المساحة:</span>
              <span className="detail-value">{land.area} م²</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">الموقع:</span>
              <span className="detail-value location">{land.location}</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">البائع:</span>
              <span className="detail-value">{land.seller}</span>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <span className="added-date">أضيف في: {land.dateAdded}</span>
          <div className="card-actions">
            <button 
              className="btn btn-outline"
              onClick={() => contactSeller(land.contact)}
            >
              تواصل مع البائع
            </button>
            <button className="btn btn-primary">
              عرض التفاصيل
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAuctionCard = (auction) => (
    <div key={auction.id} className="favorite-card auction-card">
      <div className="card-image">
        <img src={auction.image} alt={auction.title} />
        <div className="auction-badge">مزاد</div>
        <button 
          className="remove-btn"
          onClick={() => removeFromFavorites(auction.id, 'auctions')}
          title="إزالة من المفضلة"
        >
          ♥
        </button>
      </div>
      
      <div className="card-content">
        <div className="card-header">
          <h3 className="card-title">{auction.title}</h3>
          <span className="property-type">{auction.type}</span>
        </div>
        
        <p className="card-description">{auction.description}</p>
        
        <div className="card-details">
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">سعر البدء:</span>
              <span className="detail-value">{formatPrice(auction.startPrice)} ريال</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">السعر الحالي:</span>
              <span className="detail-value price">{formatPrice(auction.currentBid)} ريال</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">أقل مزايدة:</span>
              <span className="detail-value">{formatPrice(auction.minBid)} ريال</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">المساحة:</span>
              <span className="detail-value">{auction.area} م²</span>
            </div>
          </div>
          
          <div className="detail-row">
            <div className="detail-item">
              <span className="detail-label">الموقع:</span>
              <span className="detail-value location">{auction.location}</span>
            </div>
          </div>
          
          <div className="auction-info">
            <div className="auction-stats">
              <div className="stat">
                <span className="stat-label">المزايدين:</span>
                <span className="stat-value">{auction.bidders}</span>
              </div>
              <div className="stat">
                <span className="stat-label">متبقي:</span>
                <span className="stat-value time-left">{auction.timeLeft}</span>
              </div>
              <div className="stat">
                <span className="stat-label">ينتهي:</span>
                <span className="stat-value">{auction.endDate}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-footer">
          <span className="added-date">أضيف في: {auction.dateAdded}</span>
          <div className="card-actions">
            <button className="btn btn-outline">
              مشاهدة المزاد
            </button>
            <button className="btn btn-primary">
              المشاركة بالمزايدة
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const currentFavorites = favorites[activeTab] || [];

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="loading">جاري تحميل المفضلة...</div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="page-header">
        <div className="header-content">
          <h1>المفضلة</h1>
          <p>الأراضي والمزادات التي قمت بإضافتها إلى المفضلة</p>
        </div>
        {currentFavorites.length > 0 && (
          <button 
            className="btn btn-danger"
            onClick={clearAllFavorites}
          >
            حذف الكل
          </button>
        )}
      </div>

      <div className="favorites-tabs">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'lands' ? 'active' : ''}`}
            onClick={() => setActiveTab('lands')}
          >
            <span className="tab-icon">🏠</span>
            الأراضي
            <span className="tab-count">({favorites.lands?.length || 0})</span>
          </button>
          <button 
            className={`tab ${activeTab === 'auctions' ? 'active' : ''}`}
            onClick={() => setActiveTab('auctions')}
          >
            <span className="tab-icon">🔨</span>
            المزادات
            <span className="tab-count">({favorites.auctions?.length || 0})</span>
          </button>
        </div>
      </div>

      <div className="favorites-content">
        {currentFavorites.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">♥</div>
            <h3>لا توجد عناصر في المفضلة</h3>
            <p>
              {activeTab === 'lands' 
                ? 'قم بإضافة الأراضي التي تعجبك إلى المفضلة لتسهيل الوصول إليها لاحقاً'
                : 'قم بإضافة المزادات التي تهمك إلى المفضلة لمتابعتها'
              }
            </p>
            <button className="btn btn-primary">
              {activeTab === 'lands' ? 'تصفح الأراضي' : 'تصفح المزادات'}
            </button>
          </div>
        ) : (
          <div className="favorites-grid">
            {activeTab === 'lands' 
              ? favorites.lands?.map(renderLandCard)
              : favorites.auctions?.map(renderAuctionCard)
            }
          </div>
        )}
      </div>

      {currentFavorites.length > 0 && (
        <div className="favorites-summary">
          <div className="summary-card">
            <h4>ملخص المفضلة</h4>
            <div className="summary-stats">
              <div className="summary-stat">
                <span className="stat-label">إجمالي الأراضي:</span>
                <span className="stat-value">{favorites.lands?.length || 0}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">إجمالي المزادات:</span>
                <span className="stat-value">{favorites.auctions?.length || 0}</span>
              </div>
              <div className="summary-stat">
                <span className="stat-label">المجموع الكلي:</span>
                <span className="stat-value total">
                  {(favorites.lands?.length || 0) + (favorites.auctions?.length || 0)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Favorites;