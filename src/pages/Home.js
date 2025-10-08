import React, { useState, useEffect, useRef } from 'react';
import {
  FaSearch,
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
  FaShareAlt,
  FaBookmark,
  FaReact,
  FaFilter,
  FaChevronRight,
  FaChevronLeft,
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
  FaLandmark
} from 'react-icons/fa';

// مكون بطاقة الأرض
const LandCard = ({
  img,
  title,
  location,
  price,
  area,
  landType,
  purpose,
  auctionTitle
}) => (
  <div className="land-card">
    <div className="land-image">
      <img src={img || ""} alt={title} />
      <div className="land-tag">{landType}</div>
      {auctionTitle && <div className="auction-badge">مزاد</div>}
      <div className="card-actions">
        <button className="action-btn save-btn">
          <FaBookmark />
        </button>
        <button className="action-btn share-btn">
          <FaShareAlt />
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
      <button className="view-btn">
        {auctionTitle ? 'المشاركة في المزاد' : 'عرض التفاصيل'}
      </button>
    </div>
  </div>
);

// بطاقة المزاد
const AuctionCard = ({
  img,
  title,
  location,
  startPrice,
  currentBid,
  area,
  endDate,
  auctionCompany,
  bidders,
  daysLeft
}) => (
  <div className="auction-card">
    <div className="auction-header">
      <span className="auction-company">{auctionCompany}</span>
    </div>
    <div className="auction-image">
      <img src={img || ""} alt={title} />
      <div className="auction-timer">
        <FaCalendarAlt className="timer-icon" /> {daysLeft} يوم متبقي
      </div>
      <div className="card-actions">
        <button className="action-btn save-btn">
          <FaBookmark />
        </button>
        <button className="action-btn share-btn">
          <FaShareAlt />
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
      <div className="price-info">
        <div className="price-row">
          <span className="price-label">السعر الحالي:</span>
          <span className="current-price">{currentBid} ريال</span>
        </div>
        <div className="price-row">
          <span className="price-label">السعر الابتدائي:</span>
          <span className="start-price">{startPrice} ريال</span>
        </div>
      </div>
      <div className="auction-actions">
        <button className="bid-btn">تقديم عرض</button>
        <button className="details-btn">تفاصيل المزاد</button>
      </div>
    </div>
  </div>
);

// مكون شريط العملاء المتحرك المعدل
const ClientsSlider = () => {
  const clientLogos = [
    { id: 1, src: "/images/human.jpg", alt: "شعار عميل" },
    { id: 2, src: "/images/client1.jpg", alt: "شعار عميل" },
    { id: 3, src: "/images/client2.jpg", alt: "شعار عميل" },
    { id: 4, src: "/images/client3.jpeg", alt: "شعار عميل" },
    // { id: 5, src: "/images/client3.jpeg", alt: "شعار عميل" }
  ];

  const [activeIndex, setActiveIndex] = useState(1);
  const maxVisibleLogos = 3; // عدد العملاء المعروضين

  const nextClient = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % clientLogos.length);
  };

  const prevClient = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + clientLogos.length) % clientLogos.length);
  };

  // التهيئة الأولية والتحديث التلقائي
  useEffect(() => {
    const interval = setInterval(nextClient, 3000);
    return () => clearInterval(interval);
  }, []);

  // إنشاء مصفوفة معدلة للعرض مع تطبيق النمط الدائري
  const getVisibleLogos = () => {
    let visibleLogos = [];
    
    for (let i = 0; i < maxVisibleLogos; i++) {
      const index = (activeIndex + i) % clientLogos.length;
      visibleLogos.push({
        ...clientLogos[index],
        isActive: i === 1 // العنصر الأوسط هو النشط
      });
    }
    
    return visibleLogos;
  };

  return (
    <section className="clients-section">
      <div className="container">
        <div className="clients-box">
          <h3 className="clients-title">عملاؤنا المميزون</h3>

          <div className="clients-slider-container">
            <button className="client-nav-btn prev-btn" onClick={prevClient}>
              <FaChevronRight />
            </button>
            
            <div className="clients-slider">
              <div className="clients-track">
                {getVisibleLogos().map((logo) => (
                  <div 
                    key={logo.id} 
                    className={`client-logo ${logo.isActive ? 'active' : 'inactive'}`}
                  >
                    <img src={logo.src} alt={logo.alt} />
                  </div>
                ))}
              </div>
            </div>
            
            <button className="client-nav-btn next-btn" onClick={nextClient}>
              <FaChevronLeft />
            </button>
          </div>

          <p className="clients-subtitle">
            نفتخر بشراكتنا مع أكبر الشركات العقارية في المملكة
          </p>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lands, setLands] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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

  // حساب العناصر المعروضة
  const displayedItems = filterType === 'lands' ? lands : auctions;

  const minSwipeDistance = 50;

const handleTouchStart = (e) => {
  setTouchEnd(null);
  setTouchStart(e.targetTouches[0].clientX);
};

const handleTouchMove = (e) => {
  setTouchEnd(e.targetTouches[0].clientX);
};

const handleTouchEnd = () => {
  if (!touchStart || !touchEnd) return;
  
  const distance = touchStart - touchEnd;
  const isLeftSwipe = distance > minSwipeDistance;
  const isRightSwipe = distance < -minSwipeDistance;

  if (isLeftSwipe) {
    nextCard();
  } else if (isRightSwipe) {
    prevCard();
  }
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
  const currentItems = displayedItems.slice(startIndex, endIndex);

  // محاكاة جلب البيانات
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      // بيانات الأراضي
      setLands([
        {
          id: 1,
          img: "",
          title: "أرض سكنية مميزة",
          location: "الرياض، حي النرجس",
          price: "1,800,000",
          area: "600",
          landType: "سكني",
          purpose: "بيع",
        },
        {
          id: 2,
          img: "",
          title: "أرض تجارية على طريق الملك فهد",
          location: "الرياض، طريق الملك فهد",
          price: "3,200,000",
          area: "1200",
          landType: "تجاري",
          purpose: "استثمار",
        },
        {
          id: 3,
          img: "",
          title: "مزرعة استثمارية",
          location: "الخرج، طريق المزارع",
          price: "4,500,000",
          area: "5000",
          landType: "زراعي",
          purpose: "استثمار",
        },
        {
          id: 4,
          img: "",
          title: "أرض صناعية",
          location: "الدمام، المدينة الصناعية",
          price: "2,800,000",
          area: "3000",
          landType: "صناعي",
          purpose: "بيع",
        }
      ]);

      // بيانات المزادات
      setAuctions([
        {
          id: 1,
          img: "",
          title: "أرض سكنية بموقع استراتيجي",
          location: "جدة، حي الصفا",
          startPrice: "1,200,000",
          currentBid: "1,550,000",
          area: "800",
          endDate: "2024-12-30",
          auctionCompany: "شركة الرياض للمزادات",
          bidders: 24,
          daysLeft: 15
        },
        {
          id: 2,
          img: "",
          title: "مجمع تجاري متكامل",
          location: "الدمام، حي الفيصلية",
          startPrice: "5,000,000",
          currentBid: "6,200,000",
          area: "2000",
          endDate: "2024-12-28",
          auctionCompany: "شركة الشرقية للمزادات",
          bidders: 32,
          daysLeft: 12
        },
        {
          id: 3,
          img: "",
          title: "أرض زراعية استثمارية",
          location: "الخرج، المزارع",
          startPrice: "3,500,000",
          currentBid: "4,100,000",
          area: "10000",
          endDate: "2024-12-25",
          auctionCompany: "مزاد العقار الإلكتروني",
          bidders: 18,
          daysLeft: 8
        }
      ]);

      setIsLoading(false);
    }, 1000);
  }, []);

  // تغيير الشرائح للصور الخلفية
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("البحث عن:", searchTerm);
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
        'جميع أنواع العقارات والمشاريع',
        'علاقة قوية مع شركات المزادات المعتمدة'
      ]
    }
  };

  return (
    <div className="home-page">
      {/* شريط العملاء المتحرك */}
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

      {/* قسم الهيرو مع خلفية متحركة */}
      <section className="hero-section" id="home">
        <div className={`hero-background slide-${currentSlide}`}></div>

        <div className="hero-content container">
          <div className="hero-title-container">
            <div className="title-with-decoration7">
              استثمر في أفضل <span className="land-word">الأراضي</span>
              <div className="transparent-box"></div>
            </div>
          </div>

          <p>منصة متكاملة لشراء وبيع الأراضي والعقارات عبر مزادات إلكترونية آمنة وموثوقة</p>

          <div className="search-filter">
            <form onSubmit={handleSearch} className="filter-form">
              <div className="filter-group">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <span className="typing-placeholder"></span>
              </div>
              <button type="submit" className="search-submit">بحث</button>
            </form>
          </div>

        </div>
      </section>

      {/* قسم العملاء - المربع الفاصل */}
      <ClientsSlider />

  <section className="services-section">
  <div className="container">
    <h2 className="section-title">
      استكشفوا خدماتنا
      <div className="transparent-box"></div>
    </h2>
    
    {/* مؤشر الخدمات للهاتف */}
    <div className="mobile-service-indicator">
      <div className="indicator-dots">
        <span className={activeService === 'large-lands' ? 'active' : ''}></span>
        <span className={activeService === 'auction-partnership' ? 'active' : ''}></span>
      </div>
    </div>

    <div className="services-content">
      {/* القائمة الجانبية (تظهر في الكمبيوتر فقط) */}
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

      {/* البطاقة الرئيسية */}
      <div className="service-details">
        {/* رأس البطاقة مع الأيقونة */}
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
          <button className={`learn-more ${activeService === 'auction-partnership' ? 'auction-btn' : ''}`}>
            <span className="arrow">←</span>
            {activeService === 'large-lands' ? 'اعرض أرضك الكبيرة' : 'اعرض عقارك للمزاد'}
          </button>
          
          {/* أزرار التنقل للهاتف */}
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

      {/* قسم العقارات المحدث مع الفلاتر */}
      <section className="properties-section" id="properties">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              العقارات المتاحة
              <div className="transparent-box"></div>
            </h2>
          </div>

          {/* شريط التبويب مع زر الفلتر */}
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

          {/* الفلتر المتقدم - مخفي بشكل افتراضي */}
          <div className={`advanced-filter ${showFilter ? 'show' : ''}`}>
            <div className="filter-content">
              {/* الفلتر المتقدم للأراضي */}
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

              {/* الفلتر المتقدم للمزادات */}
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
                <button className="filter-btn">تطبيق الفلتر</button>
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

          {/* عرض البطاقات مع عناصر التحكم */}
          <div className="properties-container">
            {/* <div className="properties-nav-container">
              <button className="property-nav-btn prev-btn" onClick={prevPage}>
                <FaChevronRight />
              </button> */}

              {/* <div className="properties-header-mobile">
                <span className="properties-count">
                  عرض {startIndex + 1}-{Math.min(endIndex, displayedItems.length)} من {displayedItems.length}
                </span>
              </div> */}

              {/* <button className="property-nav-btn next-btn" onClick={nextPage}>
                <FaChevronLeft />
              </button> */}
            {/* </div> */}

            {isLoading ? (
              <div className="loading">
                <div className="loading-spinner"></div>
                جاري تحميل العقارات...
              </div>
            ) : (
              <div className="properties-grid">
                {currentItems.map(item => (
                  filterType === 'lands' ? (
                    <LandCard key={item.id} {...item} />
                  ) : (
                    <AuctionCard key={item.id} {...item} />
                  )
                ))}
              </div>
            )}

            <div className="view-all">
              <button className="view-all-btn">عرض الكل</button>
            </div>
          </div>
        </div>
      </section>

    {/* قسم لماذا تختارنا - تصميم معدل مع إصلاح المشاكل */}
<section className="why-us-section">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">
        لماذا تختارنا؟
        <div className="transparent-box"></div>
      </h2>
    </div>

    {/* تصميم الكمبيوتر - بطاقة ملء الشاشة */}
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
        
        {/* شريط التنقل في الأسفل */}
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

    {/* تصميم الهاتف - عرض بطاقة واحدة مع إمكانية التمرير والسحب */}
    <div className="mobile-why-us">
      <div className="mobile-cards-container">
        <div 
          className="mobile-cards-track" 
          style={{ transform: `translateX(-${activeTab * 100}%)` }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {cardsData.map((card, index) => (
            <div 
              key={card.id} 
              className="mobile-why-card"
            >
              <div className="card-icon">
                {card.icon}
              </div>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
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
        </div>
        
        {/* مؤشرات التمرير */}
        <div className="mobile-indicators">
          {cardsData.map((_, index) => (
            <button
              key={index}
              className={`mobile-indicator ${activeTab === index ? 'active' : ''}`}
              onClick={() => setActiveTab(index)}
            ></button>
          ))}
        </div>
      </div>
    </div>
  </div>
</section>
      {/* قسم اتصل بنا */}
     {/* قسم الاستشارة */}
<section className="consultation-section" id="consultation">
  <div className="container">
    <div className="section-header">
      <h2 className="section-title">
        هل تحتاج إلى استشارة؟
        <div className="transparent-box"></div>
      </h2>
      <p>نحن هنا لمساعدتك في تحقيق أهدافك الاستثمارية</p>
    </div>

    <div className="consultation-form-container">
      <form className="consultation-form">
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

        <button type="submit" className="submit-consultation-btn">
          إرسال طلب الاستشارة
        </button>
      </form>
    </div>
  </div>
</section>

      {/* قسم الاشتراك في النشرة البريدية */}
      {/* <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="section-title">
              اشترك في نشرتنا البريدية
              <div className="transparent-box"></div>
            </h2>
            <p>احصل على آخر الأخبار والعروض الحصرية مباشرة إلى بريدك الإلكتروني</p>
            <form className="newsletter-form">
              <input type="email" placeholder="أدخل بريدك الإلكتروني" />
              <button type="submit">اشتراك</button>
            </form>
          </div>
        </div>
      </section> */}
    </div>
  );
};

export default Home;