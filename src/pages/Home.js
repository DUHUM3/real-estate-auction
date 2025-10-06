import React, { useState, useEffect } from 'react';
import { 
  FaSearch, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaRulerCombined,
  FaHeart,
  FaBuilding,
  FaHome,
  FaLandmark,
  FaCity,
  FaMoneyBillWave,
  FaChartLine,
  FaUsers,
  FaShieldAlt,
  FaAward,
  FaHandshake,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaCalendarAlt,
  FaGavel,
  FaTag,
  FaStar,
  FaShareAlt,
  FaBookmark,
  FaReact
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
      <img src={img || "https://via.placeholder.com/300x200?text=أرض+للبيع"} alt={title} />
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
      <img src={img || "https://via.placeholder.com/300x200?text=مزاد+عقاري"} alt={title} />
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

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [lands, setLands] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
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
          
          {/* العنوان مع المربع الشفاف */}
          <div className="hero-title-container">
            <h1 className="title-with-decoration">
              استثمر في أفضل <span className="land-word">الأراضي</span>
              <div className="transparent-box"></div>
            </h1>
          </div>
          
          <p>منصة متكاملة لشراء وبيع الأراضي والعقارات عبر مزادات إلكترونية آمنة وموثوقة</p>
          
          {/* فلتر البحث المختصر */}
          <div className="search-filter">
            <form onSubmit={handleSearch} className="filter-form">
              <div className="filter-group">
                <input
                  type="text"
                  placeholder="ابحث عن منطقة أو عقار..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="search-icon" />
              </div>
              
              <button type="submit" className="search-submit">
                بحث
              </button>
            </form>
          </div>
          
        </div>
      </section>

      {/* قسم استكشفوا خدماتنا المحدث */}
      <section className="services-section">
        <div className="container">
          <h2 className="section-title">
            استكشفوا خدماتنا
            <div className="transparent-box"></div>
          </h2>
          <div className="services-content">
            <div className="services-list">
              <ul>
                <li 
                  className={activeService === 'large-lands' ? 'active' : ''}
                  onClick={() => setActiveService('large-lands')}
                >
                  الأراضي الكبيرة
                </li>
                <li 
                  className={activeService === 'auction-partnership' ? 'active' : ''}
                  onClick={() => setActiveService('auction-partnership')}
                >
                  شراكة مميزة مع شركات المزادات
                </li>
              </ul>
            </div>

            <div className="service-details">
              <h3>{servicesData[activeService].title}</h3>
              <p>{servicesData[activeService].description}</p>
              <ul className="sub-services">
                {servicesData[activeService].features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <a href="#" className="learn-more">
                <span className="arrow">←</span>
                {activeService === 'large-lands' ? 'اعرض أرضك الكبيرة' : 'اعرض عقارك للمزاد'}
              </a>
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
            <p>استكشف أحدث العقارات المتاحة في مختلف المناطق</p>
          </div>

          {/* شريط التبويب */}
          <div className="properties-tabs">
            <button 
              className={`tab-button ${filterType === 'lands' ? 'active' : ''}`}
              onClick={() => setFilterType('lands')}
            >
              الأراضي
            </button>
            <button 
              className={`tab-button ${filterType === 'auctions' ? 'active' : ''}`}
              onClick={() => setFilterType('auctions')}
            >
              المزادات
            </button>
          </div>

          {/* الفلتر المتقدم للأراضي */}
          {filterType === 'lands' && (
            <div className="advanced-filter">
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
              
              <div className="filter-actions">
                <button className="filter-btn">تطبيق الفلتر</button>
                <button 
                  className="reset-btn"
                  onClick={() => setLandFilter({
                    propertyType: '',
                    city: '',
                    purpose: '',
                    priceRange: '',
                    area: ''
                  })}
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          )}

          {/* الفلتر المتقدم للمزادات */}
          {filterType === 'auctions' && (
            <div className="advanced-filter">
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
              
              <div className="filter-actions">
                <button className="filter-btn">تطبيق الفلتر</button>
                <button 
                  className="reset-btn"
                  onClick={() => setAuctionFilter({
                    city: '',
                    startDate: '',
                    endDate: '',
                    maxDaysLeft: ''
                  })}
                >
                  إعادة تعيين
                </button>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              جاري تحميل العقارات...
            </div>
          ) : (
            <div className="properties-grid">
              {filterType === 'lands' && lands.map(land => (
                <LandCard
                  key={land.id}
                  img={land.img}
                  title={land.title}
                  location={land.location}
                  price={land.price}
                  area={land.area}
                  landType={land.landType}
                  purpose={land.purpose}
                />
              ))}
              
              {filterType === 'auctions' && auctions.map(auction => (
                <AuctionCard
                  key={auction.id}
                  img={auction.img}
                  title={auction.title}
                  location={auction.location}
                  startPrice={auction.startPrice}
                  currentBid={auction.currentBid}
                  area={auction.area}
                  endDate={auction.endDate}
                  auctionCompany={auction.auctionCompany}
                  bidders={auction.bidders}
                  daysLeft={auction.daysLeft}
                />
              ))}
            </div>
          )}
          
          <div className="view-all">
            <button className="view-all-btn">عرض المزيد</button>
          </div>
        </div>
      </section>

      {/* قسم لماذا تختارنا - تصميم أجمل */}
      <section className="why-us-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              لماذا تختارنا؟
              <div className="transparent-box"></div>
            </h2>
            <p>أسباب تجعلنا الخيار الأمثل لاستثمارك العقاري</p>
          </div>
          
          <div className="why-us-grid">
            <div className="why-us-card">
              <div className="card-icon">
                <FaAward />
              </div>
              <h3>الريادة في السوق</h3>
              <p>نحن رواد في مجال التسويق العقاري مع أكثر من 15 عاماً من الخبرة والتميز</p>
            </div>
            
            <div className="why-us-card">
              <div className="card-icon">
                <FaStar />
              </div>
              <h3>جودة لا تضاهى</h3>
              <p>نقدم خدمات عالية الجودة تلبي توقعات عملائنا وتتجاوزها</p>
            </div>
            
            <div className="why-us-card">
              <div className="card-icon">
                <FaChartLine />
              </div>
              <h3>سرعة في الأداء</h3>
              <p>نتعامل بسرعة وكفاءة لتحقيق أفضل النتائج في أقصر وقت ممكن</p>
            </div>
            
            <div className="why-us-card">
              <div className="card-icon">
                <FaHandshake />
              </div>
              <h3>ثقة العملاء</h3>
              <p>ثقة آلاف العملاء شهادة على نجاحنا وتميزنا في تقديم الخدمات</p>
            </div>
            
            <div className="why-us-card">
              <div className="card-icon">
                <FaLandmark />
              </div>
              <h3>حلول مبتكرة</h3>
              <p>نطور حلولاً مبتكرة تلبي احتياجات السوق المتغيرة</p>
            </div>
            
            <div className="why-us-card">
              <div className="card-icon">
                <FaShieldAlt />
              </div>
              <h3>أمان وموثوقية</h3>
              <p>جميع تعاملاتنا تتم ضمن أعلى معايير الأمان والموثوقية</p>
            </div>
          </div>
        </div>
      </section>

      {/* قسم اتصل بنا */}
      <section className="contact-section" id="contact">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              اتصل بنا
              <div className="transparent-box"></div>
            </h2>
            <p>نحن هنا للإجابة على استفساراتك ومساعدتك في العثور على ما تبحث عنه</p>
          </div>
          
          <div className="contact-grid">
            <div className="contact-form">
              <form>
                <div className="form-group">
                  <label htmlFor="name">الاسم</label>
                  <input type="text" id="name" placeholder="أدخل اسمك الكامل" />
                </div>
                <div className="form-group">
                  <label htmlFor="email">البريد الإلكتروني</label>
                  <input type="email" id="email" placeholder="أدخل بريدك الإلكتروني" />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">رقم الجوال</label>
                  <input type="tel" id="phone" placeholder="أدخل رقم جوالك" />
                </div>
                <div className="form-group">
                  <label htmlFor="subject">الموضوع</label>
                  <select id="subject">
                    <option value="" disabled selected>اختر الموضوع</option>
                    <option value="buy">شراء عقار</option>
                    <option value="sell">بيع عقار</option>
                    <option value="invest">استثمار عقاري</option>
                    <option value="consult">استشارة عقارية</option>
                    <option value="other">أخرى</option>
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="message">الرسالة</label>
                  <textarea id="message" placeholder="اكتب رسالتك هنا..." rows="5"></textarea>
                </div>
                <button type="submit" className="submit-btn">إرسال الرسالة</button>
              </form>
            </div>
            
            <div className="contact-info">
              <div className="info-item">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-text">
                  <h4>العنوان</h4>
                  <p>الرياض، طريق الملك فهد، برج المملكة، الدور 20</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-text">
                  <h4>اتصل بنا</h4>
                  <p>966512345678+</p>
                  <p>966598765432+</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-text">
                  <h4>البريد الإلكتروني</h4>
                  <p>info@realestate.com</p>
                  <p>sales@realestate.com</p>
                </div>
              </div>
              
              <div className="info-item">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div className="info-text">
                  <h4>ساعات العمل</h4>
                  <p>الأحد - الخميس: 8:00 صباحاً - 5:00 مساءً</p>
                  <p>السبت: 10:00 صباحاً - 2:00 مساءً</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* قسم الاشتراك في النشرة البريدية */}
      <section className="newsletter-section">
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
      </section>
    </div>
  );
};

export default Home;