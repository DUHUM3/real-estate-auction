import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FaSearch,
  FaBullhorn, FaSearchDollar,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaArrowLeft,
  FaChartLine,
  FaGavel,
  FaCheck,
  FaUsers,
  FaShieldAlt,
  FaAward,
  FaHandshake,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaCalendarAlt,
  FaTag,
  FaStar,
  FaBookmark,
  FaReact,
  FaFilter,
  FaChevronRight,
  FaChevronLeft,
  FaLandmark
} from 'react-icons/fa';
import Login from './Login.js'; // تأكد من المسار الصحيح

// مكون الإشعارات
const Notification = ({ message, type = 'success', onClose }) => (
  <div className={`notification ${type}`}>
    <div className="notification-content">
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  </div>
);

// مكون بطاقة الأرض مع المفضلة
const LandCard = ({
  id,
  img,
  title,
  location,
  price,
  area,
  landType,
  purpose,
  auctionTitle,
  status,
  onClick,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  // دالة واحدة فقط - الإصدار المصحح
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await onToggleFavorite(id, !favorite, 'property');
      // تحديث الحالة بناءً على الاستجابة من السيرفر
      if (result && result.success) {
        setFavorite(result.is_favorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // في حالة الخطأ، نعيد الحالة إلى ما كانت عليه
      setFavorite(favorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="land-card" onClick={() => onClick && onClick(id, 'land')}>
      <div className="land-image">
        <img 
          src={img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"} 
          alt={title || "أرض عقارية"} 
        />
        <div className="land-tag">{landType}</div>
        {status === "تم البيع" && <div className="sold-badge">تم البيع</div>}
        {auctionTitle && <div className="auction-badge">مزاد</div>}
        <div className="card-actions">
          <button 
            className={`action-btn favorite-btn ${favorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            <FaBookmark />
          </button>
        </div>
      </div>
      <div className="land-content">
        <h3>{title}</h3>
        <p className="location">
          <FaMapMarkerAlt className="location-icon" />
          {location}
        </p>
        <div className="land-details">
          <span><FaRulerCombined className="details-icon" /> {area} متر²</span>
          <span><FaTag className="details-icon" /> {purpose}</span>
        </div>
        {auctionTitle && (
          <div className="auction-info">
            <span className="auction-title">{auctionTitle}</span>
          </div>
        )}
        <div className="land-price">
          <FaMoneyBillWave className="price-icon" /> {price} ريال
        </div>
       // في مكون LandCard، قم بتعديل الزر
<button 
  className="view-btn"
  onClick={(e) => {
    e.stopPropagation(); // منع تنفيذ النقر على البطاقة
    onClick && onClick(id, 'land');
  }}
>
  {auctionTitle ? 'المشاركة في المزاد' : 'عرض التفاصيل'}
</button>
      </div>
    </div>
  );
};

// بطاقة المزاد مع المفضلة
// بطاقة المزاد مع المفضلة - الإصدار المصحح
const AuctionCard = ({
  id,
  img,
  title,
  location,
  startPrice,
  currentBid,
  area,
  endDate,
  auctionCompany,
  bidders,
  daysLeft,
  onClick,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await onToggleFavorite(id, !favorite, 'auction');
      // تحديث الحالة بناءً على الاستجابة من السيرفر
      if (result && result.success) {
        setFavorite(result.is_favorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // في حالة الخطأ، نعيد الحالة إلى ما كانت عليه
      setFavorite(favorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auction-card" onClick={() => onClick && onClick(id, 'auction')}>
      <div className="auction-header">
        <span className="auction-company">{auctionCompany}</span>
      </div>
      <div className="auction-image">
        <img 
          src={img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"} 
          alt={title || "أرض عقارية"} 
        />
        <div className="auction-timer">
          <FaCalendarAlt className="timer-icon" /> {daysLeft} يوم متبقي
        </div>
        <div className="card-actions">
          <button 
            className={`action-btn favorite-btn ${favorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            <FaBookmark />
          </button>
        </div>
      </div>
      <div className="auction-content">
        <h3>{title}</h3>
        <p className="location">
          <FaMapMarkerAlt className="location-icon" />
          {location}
        </p>
        <div className="auction-details">
          <span><FaRulerCombined className="details-icon" /> {area} متر²</span>
          <span><FaUsers className="details-icon" /> {bidders} مزايد</span>
        </div>
        <div className="auction-actions">
<button 
  className="details-btn"
  onClick={(e) => {
    e.stopPropagation(); // منع تنفيذ النقر على البطاقة
    onClick && onClick(id, 'auction');
  }}
>
  تفاصيل المزاد
</button>        </div>
      </div>
    </div>
  );
};

// مكون شريط العملاء المتحرك المعدل
const ClientsSlider = ({ clients, onClientClick }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const maxVisibleLogos = 3;

  const nextClient = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % clients.length);
  };

  const prevClient = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + clients.length) % clients.length);
  };

  useEffect(() => {
    if (clients.length > 0) {
      const interval = setInterval(nextClient, 3000);
      return () => clearInterval(interval);
    }
  }, [clients]);

  const getVisibleLogos = () => {
    if (clients.length === 0) return [];
    
    let visibleLogos = [];
    
    for (let i = 0; i < maxVisibleLogos; i++) {
      const index = (activeIndex + i) % clients.length;
      visibleLogos.push({
        ...clients[index],
        isActive: i === 1
      });
    }
    
    return visibleLogos;
  };

  return (
    <section className="clients-section">
      <div className="container">
        <div className="clients-box">
          <h3 className="clients-title">عملاؤنا المميزون</h3>

          {clients.length > 0 ? (
            <div className="clients-slider-container">
              <button className="client-nav-btn prev-btn" onClick={prevClient}>
                <FaChevronRight />
              </button>
              
              <div className="clients-slider">
                <div className="clients-track">
                  {getVisibleLogos().map((client) => (
                    <div 
                      key={client.id} 
                      className={`client-logo ${client.isActive ? 'active' : 'inactive'}`}
                      onClick={() => onClientClick && onClientClick(client)}
                    >
                      <img src={client.logo} alt={client.name} />
                    </div>
                  ))}
                </div>
              </div>
              
              <button className="client-nav-btn next-btn" onClick={nextClient}>
                <FaChevronLeft />
              </button>
            </div>
          ) : (
            <div className="no-clients">
              <p>لا توجد بيانات للعملاء في الوقت الحالي</p>
            </div>
          )}

          <p className="clients-subtitle">
            نفتخر بشراكتنا مع أكبر الشركات العقارية في المملكة
          </p>
        </div>
      </div>
    </section>
  );
};


function Home({ onLoginClick }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notification, setNotification] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [lands, setLands] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState({
    lands: false,
    auctions: false,
    clients: false
  });
  const [showFilter, setShowFilter] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);
  const [activeTab, setActiveTab] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeService, setActiveService] = useState('large-lands');
  const [filterType, setFilterType] = useState('lands');
  
  const [landFilter, setLandFilter] = useState({
    propertyType: '',
    city: '',
    purpose: '',
    priceRange: '',
    area: ''
  });
  const [auctionFilter, setAuctionFilter] = useState({
    city: '',
    startDate: '',
    endDate: '',
    maxDaysLeft: ''
  });
  const [filtersApplied, setFiltersApplied] = useState([]);

  // دالة لعرض الإشعارات
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

// دالة إضافة/إزالة من المفضلة
// دالة إضافة/إزالة من المفضلة - الإصدار المصحح
// دالة إضافة/إزالة من المفضلة - الإصدار النهائي
const handleToggleFavorite = async (id, isFavorite, type) => {
  if (!currentUser) {
    setShowLoginModal(true);
    return;
  }

  try {
    const endpoint = type === 'property' 
      ? `/api/favorites/property/${id}`
      : `/api/favorites/auction/${id}`;

    console.log('🔄 Sending favorite request:', {
      endpoint,
      id,
      type,
      isFavorite,
      token: currentUser.token ? 'exists' : 'missing'
    });

    const response = await fetch(`https://shahin-tqay.onrender.com${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${currentUser.token}`,
        'Content-Type': 'application/json',
      },
    });

    console.log('📡 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server error:', errorText);
      throw new Error(`فشل في تحديث المفضلة: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Success response:', result);
    
    if (result.success) {
      showNotification(result.message, 'success');
      
      // تحديث الحالة مباشرة
      if (type === 'property') {
        setLands(prevLands => 
          prevLands.map(land => 
            land.id === id 
              ? { ...land, is_favorite: result.is_favorite }
              : land
          )
        );
      } else {
        setAuctions(prevAuctions => 
          prevAuctions.map(auction => 
            auction.id === id 
              ? { ...auction, is_favorite: result.is_favorite }
              : auction
          )
        );
      }
      
      // إرجاع النتيجة للمكون الفرعي
      return result;
    } else {
      throw new Error(result.message || 'حدث خطأ ما');
    }
  } catch (error) {
    console.error('❌ Error updating favorite:', error);
    showNotification(error.message || 'فشل في تحديث المفضلة', 'error');
    throw error;
  }
};
  // دوال جلب البيانات من الـ APIs
  const fetchLands = async () => {
    setIsLoading(prev => ({ ...prev, lands: true }));
    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/properties/properties/latest');
      const data = await response.json();
      
      if (data.status && data.data) {
        const formattedLands = data.data.data.map(land => ({
          id: land.id,
          img: land.cover_image && land.cover_image !== 'default_cover.jpg' 
            ? `https://shahin-tqay.onrender.com/storage/${land.cover_image}` 
            : null,
          title: land.title,
          location: `${land.region}، ${land.city}`,
          price: land.price_per_sqm 
            ? `${parseFloat(land.price_per_sqm).toLocaleString('ar-SA')}` 
            : land.estimated_investment_value 
            ? `${parseFloat(land.estimated_investment_value).toLocaleString('ar-SA')}` 
            : 'غير محدد',
          area: parseFloat(land.total_area).toLocaleString('ar-SA'),
          landType: land.land_type,
          purpose: land.purpose,
          status: land.status,
          isFavorite: land.is_favorite || false
        }));
        setLands(formattedLands);
        setFiltersApplied(data.filters_applied || []);
      }
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, lands: false }));
    }
  };

  const fetchAuctions = async () => {
    setIsLoading(prev => ({ ...prev, auctions: true }));
    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/properties/auctions/latest');
      const data = await response.json();
      
      if (data.success && data.data) {
        const formattedAuctions = data.data.map(auction => {
          const auctionDate = new Date(auction.auction_date);
          const today = new Date();
          const daysLeft = Math.ceil((auctionDate - today) / (1000 * 60 * 60 * 24));
          
          return {
            id: auction.id,
            img: auction.cover_image && auction.cover_image !== 'default_cover.jpg'
              ? `https://shahin-tqay.onrender.com/storage/${auction.cover_image}`
              : null,
            title: auction.title,
            location: auction.address,
            area: "غير محدد",
            endDate: auction.auction_date,
            auctionCompany: auction.company?.auction_name || 'شركة المزاد',
            daysLeft: daysLeft > 0 ? daysLeft : 0,
            startTime: auction.start_time,
            auctionDate: auction.auction_date,
            isFavorite: auction.is_favorite || false
          };
        });
        setAuctions(formattedAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, auctions: false }));
    }
  };

  const fetchClients = async () => {
    setIsLoading(prev => ({ ...prev, clients: true }));
    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/clients/Featured');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        const formattedClients = data.map(client => ({
          id: client.id,
          name: client.name,
          logo: client.logo,
          website: client.website
        }));
        setClients(formattedClients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, clients: false }));
    }
  };

  // جلب البيانات عند تحميل المكون
  useEffect(() => {
    fetchLands();
    fetchAuctions();
    fetchClients();
  }, []);

  // تطبيق الفلاتر
  const applyFilters = () => {
    if (filterType === 'lands') {
      fetchLands();
    } else {
      fetchAuctions();
    }
    setShowFilter(false);
  };

  // دوال التنقل بين الصفحات
  const nextCard = () => {
    setActiveTab((prev) => (prev === cardsData.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setActiveTab((prev) => (prev === 0 ? cardsData.length - 1 : prev - 1));
  };

  // العناصر الحالية للعرض
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedItems = filterType === 'lands' ? lands : auctions;
  const currentItems = displayedItems.slice(startIndex, endIndex);

  // معالجة النقر على العميل
  const handleClientClick = (client) => {
    if (client.website) {
      window.open(client.website, '_blank');
    }
  };

  // معالجة النقر على الأرض أو المزاد
// في مكون Home، قم بتحديث دالة handlePropertyClick
const handlePropertyClick = (id, type = null) => {
  // إذا لم يتم تحديد النوع، استخدم filterType الحالي
  const itemType = type || filterType;
  
  console.log('التنقل إلى التفاصيل:', { id, type: itemType });
  
  if (itemType === 'lands' || itemType === 'land') {
    navigate(`/property/${id}/land`);
  } else {
    navigate(`/property/${id}/auction`);
  }
};

  const minSwipeDistance = 50;

  // دوال معالجة السحب للهاتف
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;
    
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      nextCard();
    } else if (isRightSwipe) {
      prevCard();
    }
    
    // إعادة تعيين القيم
    setTouchStart(null);
    setTouchEnd(null);
  };

  const cardsData = [
    {
      id: 1,
      title: "الريادة في السوق",
      description: "نحن رواد في مجال التسويق العقاري مع أكثر من 15 عاماً من الخبرة والتميز",
      icon: <FaAward />,
      details: [
        "أكثر من 15 عاماً من الخبرة في السوق العقاري",
        "شبكة واسعة من الشركاء والعملاء",
        "معدل نجاح يتجاوز 95% في صفقاتنا"
      ]
    },
    {
      id: 2,
      title: "جودة لا تضاهى",
      description: "نقدم خدمات عالية الجودة تلبي توقعات عملائنا وتتجاوزها",
      icon: <FaStar />,
      details: [
        "فريق محترف من الخبراء والمستشارين",
        "مراجعة جودة مستمرة لجميع خدماتنا",
        "تقييمات إيجابية من أكثر من 5000 عميل"
      ]
    },
    {
      id: 3,
      title: "سرعة في الأداء",
      description: "نتعامل بسرعة وكفاءة لتحقيق أفضل النتائج في أقصر وقت ممكن",
      icon: <FaChartLine />,
      details: [
        "استجابة فورية لاستفسارات العملاء",
        "إتمام الصفقات في وقت قياسي",
        "نظام متابعة وتحديث مستمر"
      ]
    },
    {
      id: 4,
      title: "ثقة العملاء",
      description: "ثقة آلاف العملاء شهادة على نجاحنا وتميزنا في تقديم الخدمات",
      icon: <FaHandshake />,
      details: [
        "أكثر من 10,000 عميل راضٍ عن خدماتنا",
        "نسبة تجديد عقود تصل إلى 80%",
        "توصيات مباشرة من عملائنا السابقين"
      ]
    },
    {
      id: 5,
      title: "حلول مبتكرة",
      description: "نطور حلولاً مبتكرة تلبي احتياجات السوق المتغيرة",
      icon: <FaLandmark />,
      details: [
        "منصات رقمية متطورة لتسهيل التعامل",
        "حلول تمويلية مبتكرة تناسب الجميع",
        "استراتيجيات تسويقية حديثة وفعالة"
      ]
    },
    {
      id: 6,
      title: "أمان وموثوقية",
      description: "جميع تعاملاتنا تتم ضمن أعلى معايير الأمان والموثوقية",
      icon: <FaShieldAlt />,
      details: [
        "أنظمة حماية متطورة للبيانات",
        "شهادات أمان معترف بها عالمياً",
        "ضمانات قانونية كاملة لجميع الصفقات"
      ]
    }
  ];

  // تغيير الشرائح للصور الخلفية
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 2);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("البحث عن:", searchTerm);
    
    navigate('/properties', { 
      state: { 
        searchQuery: searchTerm,
        searchFromHome: true
      }
    });
  };

  const handleLandFilterChange = (field, value) => {
    setLandFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuctionFilterChange = (field, value) => {
    setAuctionFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const servicesData = {
    'large-lands': {
      title: 'الأراضي الكبيرة',
      description: 'لملاك الأراضي الكبيرة والوكلاء المعتمدين فقط. نسوق أراضيكم السكنية والتجارية والزراعية لمجموعة مختارة من المستثمرين الجادين والمطورين المعتمدين.',
      features: [
        'أراضي سكنية وتجارية وزراعية',
        'تسويق لمجموعة مختارة من المستثمرين',
        'خدمة حصرية للملاك والوكلاء المعتمدين',
        'تقييم مهني ودراسة جدوى شاملة'
      ]
    },
    'auction-partnership': {
      title: 'شراكة مميزة مع شركات المزادات',
      description: 'بفضل علاقتنا القوية مع شركات المزادات المتخصصة، نسوق عقاراتكم (فلل، أراضي، مصانع، مزارع) بعروض احترافية تضمن أفضل العوائد والنتائج.',
      features: [
        'فلل ومنازل وعمائر',
        'أراضي ومزارع ومصانع',
        'جميع أنواع الاراضي والمشاريع',
        'علاقة قوية مع شركات المزادات المعتمدة'
      ]
    }
  };

  const handleSellLandClick = () => {
    if (currentUser) {
      navigate('/my-ads');
    } else {
      setShowLoginModal(true);
    }
  };

  // دالة لإغلاق نموذج تسجيل الدخول
  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  // دالة للتبديل إلى التسجيل
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    navigate('/register');
  };

  return (
    <div className="home-page">
      {/* إشعارات */}
      {notification && (
        <Notification 
          message={notification.message} 
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* قسم الهيرو */}
      <section className="hero-section" id="home">
        <div className="client-ticker">
          <div className="ticker-content">
            <div className="ticker-item">
              <FaReact className="react-icon" />
              <span>عملاؤنا مستمرون في الثقة بخدماتنا منذ أكثر من 15 عاماً</span>
            </div>
            <div className="ticker-item">
              <FaReact className="react-icon" />
              <span>أكثر من 5000 عميل راضٍ عن خدماتنا العقارية المتميزة</span>
            </div>
            <div className="ticker-item">
              <FaReact className="react-icon" />
              <span>شركاء النجاح مع أكبر شركات التطوير العقاري في المملكة</span>
            </div>
            <div className="ticker-item">
              <FaReact className="react-icon" />
              <span>نفخر بتقديم خدمات عقارية متكاملة بمعايير عالمية</span>
            </div>
          </div>
        </div>

        <div className={`hero-background slide-${currentSlide}`}></div>

        <div className="hero-content container">
          <div className="hero-title-container">
            <div className="title-with-decoration7">
              استثمر في أفضل <span className="land-word">الأراضي</span>
              <div className="transparent-box"></div>
            </div>
          </div>

          <p>منصة متكاملة لشراء وبيع الأراضي والاراضي عبر مزادات إلكترونية آمنة وموثوقة</p>

          <div className="search-filter">
            <form onSubmit={handleSearch} className="filter-form">
              <div className="filter-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder=""
                />
                <div className="typing-placeholder"></div>
              </div>
              <button type="submit" className="search-submit">بحث</button>
            </form>
          </div>
          
          <div className="hero-buttons">
            <button 
              className="hero-btn primary-btn"
              onClick={handleSellLandClick}
            >
              <FaBullhorn className="btn-icon" />
              <span className="btn-text">اعرض أرضك للبيع</span>
            </button>

            <button 
              className="hero-btn secondary-btn"
              onClick={() => navigate('/Properties')}
            >
              <FaSearchDollar className="btn-icon" />
              <span className="btn-text">ابحث عن استثمار</span>
            </button>
          </div>
        </div>
      </section>

      {/* قسم العملاء */}
      <ClientsSlider clients={clients} onClientClick={handleClientClick} />
    
      {/* قسم الخدمات */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">
            استكشفوا خدماتنا
            <div className="transparent-box"></div>
          </h2>
          
          <div className="mobile-service-indicator">
            <div className="indicator-dots">
              <span className={activeService === 'large-lands' ? 'active' : ''}></span>
              <span className={activeService === 'auction-partnership' ? 'active' : ''}></span>
            </div>
          </div>

          <div className="services-content">
            <div className="services-list">
              <ul>
                <li
                  className={activeService === 'large-lands' ? 'active' : ''}
                  onClick={() => setActiveService('large-lands')}
                >
                  <FaLandmark className="service-icon" />
                  الأراضي الكبيرة
                </li>
                <li
                  className={activeService === 'auction-partnership' ? 'active' : ''}
                  onClick={() => setActiveService('auction-partnership')}
                >
                  <FaGavel className="service-icon" />
                  شراكة مميزة مع شركات المزادات
                </li>
              </ul>
            </div>

            <div className="service-details">
              <div className="service-header">
                <div className="service-icon-container">
                  {activeService === 'large-lands' ? 
                    <FaLandmark className="main-service-icon" /> : 
                    <FaGavel className="main-service-icon" />
                  }
                </div>
                <h3>{servicesData[activeService].title}</h3>
              </div>

              <p>{servicesData[activeService].description}</p>
              
              <ul className="sub-services">
                {servicesData[activeService].features.map((feature, index) => (
                  <li key={index}>
                    <FaCheck className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <div className="service-actions">
                <div className="mobile-nav">
                  <button 
                    className="mobile-nav-btn prev" 
                    onClick={() => setActiveService('large-lands')}
                    disabled={activeService === 'large-lands'}
                  >
                    <FaChevronRight />
                  </button>
                  <button 
                    className="mobile-nav-btn next" 
                    onClick={() => setActiveService('auction-partnership')}
                    disabled={activeService === 'auction-partnership'}
                  >
                    <FaChevronLeft />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الاراضي والمزادات المحدث */}
      <section className="properties-section" id="properties">
        <div className="container">
          <div className="section-header">
            {filtersApplied.length > 0 && (
              <div className="filters-applied">
                <span>الفلاتر المطبقة: {filtersApplied.join('، ')}</span>
              </div>
            )}
          </div>

          <div className="properties-header">
            <div className="properties-tabs">
              <button
                className={`tab-button ${filterType === 'lands' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('lands');
                  setCurrentPage(0);
                  setShowFilter(false);
                }}
              >
                الأراضي
              </button>
              <button
                className={`tab-button ${filterType === 'auctions' ? 'active' : ''}`}
                onClick={() => {
                  setFilterType('auctions');
                  setCurrentPage(0);
                  setShowFilter(false);
                }}
              >
                المزادات
              </button>
            </div>

            <button
              className="filter-toggle-btn"
              onClick={() => setShowFilter(!showFilter)}
            >
              <FaFilter />
              {showFilter ? 'إخفاء الفلتر' : 'عرض الفلتر'}
            </button>
          </div>

          <div className={`advanced-filter ${showFilter ? 'show' : ''}`}>
            <div className="filter-content">
              {filterType === 'lands' && (
                <div className="filter-section">
                  <div className="filter-row">
                    <div className="filter-group">
                      <select
                        value={landFilter.propertyType}
                        onChange={(e) => handleLandFilterChange('propertyType', e.target.value)}
                      >
                        <option value="">نوع العقار</option>
                        <option value="سكني">سكني</option>
                        <option value="تجاري">تجاري</option>
                        <option value="زراعي">زراعي</option>
                        <option value="صناعي">صناعي</option>
                        <option value="مختلط">مختلط</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={landFilter.city}
                        onChange={(e) => handleLandFilterChange('city', e.target.value)}
                      >
                        <option value="">المدينة</option>
                        <option value="الرياض">الرياض</option>
                        <option value="جدة">جدة</option>
                        <option value="الدمام">الدمام</option>
                        <option value="مكة">مكة المكرمة</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={landFilter.purpose}
                        onChange={(e) => handleLandFilterChange('purpose', e.target.value)}
                      >
                        <option value="">الغرض من العقار</option>
                        <option value="بيع">بيع</option>
                        <option value="استثمار">استثمار</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={landFilter.priceRange}
                        onChange={(e) => handleLandFilterChange('priceRange', e.target.value)}
                      >
                        <option value="">نطاق السعر</option>
                        <option value="0-1000000">حتى 1,000,000 ريال</option>
                        <option value="1000000-3000000">1,000,000 - 3,000,000 ريال</option>
                        <option value="3000000-5000000">3,000,000 - 5,000,000 ريال</option>
                        <option value="5000000+">أكثر من 5,000,000 ريال</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <select
                        value={landFilter.area}
                        onChange={(e) => handleLandFilterChange('area', e.target.value)}
                      >
                        <option value="">المساحة</option>
                        <option value="0-500">حتى 500 م²</option>
                        <option value="500-1000">500 - 1,000 م²</option>
                        <option value="1000-5000">1,000 - 5,000 م²</option>
                        <option value="5000+">أكثر من 5,000 م²</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {filterType === 'auctions' && (
                <div className="filter-section">
                  <div className="filter-row">
                    <div className="filter-group">
                      <select
                        value={auctionFilter.city}
                        onChange={(e) => handleAuctionFilterChange('city', e.target.value)}
                      >
                        <option value="">المدينة</option>
                        <option value="الرياض">الرياض</option>
                        <option value="جدة">جدة</option>
                        <option value="الدمام">الدمام</option>
                        <option value="مكة">مكة المكرمة</option>
                      </select>
                    </div>

                    <div className="filter-group">
                      <input
                        type="date"
                        value={auctionFilter.startDate}
                        onChange={(e) => handleAuctionFilterChange('startDate', e.target.value)}
                        placeholder="من تاريخ"
                      />
                    </div>

                    <div className="filter-group">
                      <input
                        type="date"
                        value={auctionFilter.endDate}
                        onChange={(e) => handleAuctionFilterChange('endDate', e.target.value)}
                        placeholder="إلى تاريخ"
                      />
                    </div>

                    <div className="filter-group">
                      <select
                        value={auctionFilter.maxDaysLeft}
                        onChange={(e) => handleAuctionFilterChange('maxDaysLeft', e.target.value)}
                      >
                        <option value="">الأيام المتبقية</option>
                        <option value="7">أقل من أسبوع</option>
                        <option value="15">أقل من أسبوعين</option>
                        <option value="30">أقل من شهر</option>
                        <option value="60">أقل من شهرين</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              <div className="filter-actions">
                <button className="filter-btn" onClick={applyFilters}>تطبيق الفلتر</button>
                <button
                  className="reset-btn"
                  onClick={() => {
                    if (filterType === 'lands') {
                      setLandFilter({
                        propertyType: '',
                        city: '',
                        purpose: '',
                        priceRange: '',
                        area: ''
                      });
                    } else {
                      setAuctionFilter({
                        city: '',
                        startDate: '',
                        endDate: '',
                        maxDaysLeft: ''
                      });
                    }
                  }}
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          </div>

          <div className="properties-container">
            {isLoading.lands || isLoading.auctions ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                {filterType === 'lands' ? 'جاري تحميل الأراضي...' : 'جاري تحميل المزادات...'}
              </div>
            ) : (
              <>
// في جزء العرض في مكون Home، قم بتحديث الـ onClick
<div className="properties-grid">
  {currentItems.length > 0 ? (
    currentItems.map(item => (
      filterType === 'lands' ? (
        <LandCard 
          key={item.id} 
          {...item} 
          onClick={handlePropertyClick}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={item.is_favorite || false}
        />
      ) : (
        <AuctionCard 
          key={item.id} 
          {...item} 
          onClick={handlePropertyClick}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={item.is_favorite || false}
        />
      )
    ))
  ) : (
    <div className="no-data">
      <p>لا توجد {filterType === 'lands' ? 'أراضي' : 'مزادات'} متاحة في الوقت الحالي</p>
    </div>
  )}
</div>
              </>
            )}

            <div className="view-all">
              <button 
                className="view-all-btn"
                onClick={() => {
                  if (filterType === 'lands') {
                    navigate('/properties');
                  } else {
                    navigate('/properties', { 
                      state: { 
                        activeTab: 'auctions'
                      }
                    });
                  }
                }}
              >
                عرض الكل
              </button>
            </div>
          </div>
        </div>
      </section>

      
{/* قسم لماذا تختارنا - الحل النهائي */}
<section className="why-us-section">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">
        لماذا تختارنا؟
        <div className="transparent-box"></div>
      </h2>
    </div>

    {/* تصميم الكمبيوتر */}
    <div className="desktop-why-us">
      <div className="full-screen-card">
        <div className="card-content">
          <div className="card-icon">
            {cardsData[activeTab].icon}
          </div>
          <div className="card-main-content">
            <h3>{cardsData[activeTab].title}</h3>
            <p className="card-description">{cardsData[activeTab].description}</p>
            <div className="card-details">
              <h4>تفاصيل إضافية:</h4>
              <ul>
                {cardsData[activeTab].details.map((detail, index) => (
                  <li key={index}>
                    <FaCheck className="check-icon" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        <div className="card-navigation">
          <div className="nav-arrows">
            <button className="nav-arrow prev" onClick={prevCard}>
              <FaChevronRight />
            </button>
            <button className="nav-arrow next" onClick={nextCard}>
              <FaChevronLeft />
            </button>
          </div>
          
          <div className="nav-indicators">
            {cardsData.map((card, index) => (
              <button
                key={card.id}
                className={`nav-indicator ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              >
                {card.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* تصميم الهاتف - الحل الجديد */}
    <div className="mobile-why-us">
      <div className="mobile-cards-wrapper">
        {cardsData.map((card, index) => (
          <div 
            key={card.id} 
            className={`mobile-why-card ${activeTab === index ? 'active' : ''}`}
            style={{
              display: activeTab === index ? 'block' : 'none'
            }}
          >
            <div className="card-icon">
              {card.icon}
            </div>
            <h3>{card.title}</h3>
            <p className="card-description">{card.description}</p>
            <div className="card-details">
              <h4>تفاصيل إضافية:</h4>
              <ul>
                {card.details.map((detail, idx) => (
                  <li key={idx}>
                    <FaCheck className="check-icon" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        
        {/* التنقل */}
        <div className="mobile-navigation">
          <button className="mobile-nav-arrow prev" onClick={prevCard}>
            <FaChevronRight />
          </button>
          
          <div className="mobile-indicators">
            {cardsData.map((_, index) => (
              <button
                key={index}
                className={`mobile-indicator ${activeTab === index ? 'active' : ''}`}
                onClick={() => setActiveTab(index)}
              ></button>
            ))}
          </div>
          
          <button className="mobile-nav-arrow next" onClick={nextCard}>
            <FaChevronLeft />
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
 
      {/* قسم اتصل بنا */}
<section className="contact-section" id="contact">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">
        تواصل معنا
        <div className="transparent-box"></div>
      </h2>
    </div>

    <div className="contact-form-container">
      <form className="contact-form">
        {/* حقل سبب التواصل - تمت إضافته */}
        <div className="form-group">
          <label htmlFor="contact-reason">سبب التواصل *</label>
          <select 
            id="contact-reason" 
            required
            className="contact-select"
          >
            <option value="">اختر سبب التواصل</option>
            <option value="استشارة عقارية">استشارة عقارية</option>
            <option value="استفسار عن خدمة">استفسار عن خدمة</option>
            <option value="شكوى أو اقتراح">شكوى أو اقتراح</option>
            <option value="طلب شراء">طلب شراء</option>
            <option value="طلب بيع">طلب بيع</option>
            <option value="تعاون تجاري">تعاون تجاري</option>
            <option value="أخرى">أخرى</option>
          </select>
        </div>

        {/* حقل كيف يمكننا مساعدتك */}
        <div className="form-group">
          <label htmlFor="help">كيف يمكننا مساعدتك؟ *</label>
          <textarea 
            id="help" 
            placeholder="اشرح لنا احتياجاتك ونوع الاستشارة التي تبحث عنها..." 
            rows="5"
            required
          ></textarea>
        </div>

        {/* حقل رفع الملفات */}
        <div className="form-group">
          <label>ارفق ملف أو صورة (اختياري)</label>
          <div className="file-upload-container">
            <input 
              type="file" 
              id="file-upload" 
              className="file-input" 
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              multiple
            />
            <label htmlFor="file-upload" className="file-upload-label">
              <div className="upload-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <div className="upload-text">
                <span className="upload-title">انقر لرفع الملفات</span>
                <span className="upload-subtitle">PDF, Word, JPG, PNG (الحد الأقصى 10MB)</span>
              </div>
            </label>
            <div className="file-preview" id="file-preview"></div>
          </div>
        </div>

        {/* معلومات الاتصال */}
        <div className="contact-fields">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">الاسم الكامل *</label>
              <input 
                type="text" 
                id="name" 
                placeholder="أدخل اسمك الكامل" 
                required 
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">البريد الإلكتروني *</label>
              <input 
                type="email" 
                id="email" 
                placeholder="example@email.com" 
                required 
              />
            </div>
          </div>

          <div className="form-group phone-group">
            <label htmlFor="phone">رقم الجوال (سعودي) *</label>
            <div className="phone-input-container">
              <div className="country-code">+966</div>
              <input 
                type="tel" 
                id="phone" 
                placeholder="5X XXX XXXX" 
                pattern="[0-9]{9}"
                maxLength="9"
                required
                className="phone-input"
              />
            </div>
            <small className="phone-hint">يجب أن يبدأ الرقم بـ 5</small>
          </div>
        </div>

        <button type="submit" className="submit-contact-btn">
          إرسال الرسالة
        </button>
      </form>
    </div>
  </div>
</section>

      {showLoginModal && (
        <Login 
          onClose={handleCloseLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
    </div>
  );
};

export default Home;