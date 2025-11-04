import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  FaSearch,
  FaShare,
  FaFilter,
  FaHeart,
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
  FaClock,
  FaCalendarAlt,
  FaBuilding,
  FaCalendarDay,
  FaImage,
  FaHome
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import '../styles/PropertyList.css';

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);

  // State variables
  const [properties, setProperties] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [activeTab, setActiveTab] = useState('lands');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState({
    properties: [],
    auctions: []
  });
  const [hideFilterBar, setHideFilterBar] = useState(false);

  // Filter states for lands
  const [landFilters, setLandFilters] = useState({
    search: '',
    region: '',
    city: '',
    land_type: '',
    purpose: '',
    min_area: '',
    max_area: '',
    min_price: '',
    max_price: '',
    min_investment: '',
    max_investment: ''
  });

  // Filter states for auctions
  const [auctionFilters, setAuctionFilters] = useState({
    search: '',
    status: '',
    date_from: '',
    date_to: '',
    company: '',
    address: ''
  });

  // Options for filters
  const regions = ['الرياض', 'مكة', 'المدينة', 'الشرقية', 'القصيم', 'حائل', 'تبوك', 'عسير', 'جازان'];
  const landTypes = ['سكني', 'تجاري', 'صناعي', 'زراعي'];
  const purposes = ['بيع', 'استثمار'];
  const auctionStatuses = ['مفتوح', 'مغلق', 'معلق'];

  // Handle scroll to hide/show filter bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        // Scrolling down
        setHideFilterBar(true);
      } else {
        // Scrolling up
        setHideFilterBar(false);
      }
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Fetch data based on active tab
  useEffect(() => {
    if (location.state?.searchFromHome && location.state?.searchQuery) {
      const searchQuery = location.state.searchQuery;
      
      // تطبيق البحث على الفلاتر المناسبة
      if (activeTab === 'lands') {
        setLandFilters(prev => ({
          ...prev,
          search: searchQuery
        }));
      } else {
        setAuctionFilters(prev => ({
          ...prev,
          search: searchQuery
        }));
      }
      
      // تنظيف state لمنع إعادة التطبيق عند التحديث
      window.history.replaceState({}, document.title);
    }
  }, [location.state, activeTab]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedPropertyFavorites = localStorage.getItem('propertyFavorites');
    const savedAuctionFavorites = localStorage.getItem('auctionFavorites');

    if (savedPropertyFavorites) {
      setFavorites(prev => ({
        ...prev,
        properties: JSON.parse(savedPropertyFavorites)
      }));
    }

    if (savedAuctionFavorites) {
      setFavorites(prev => ({
        ...prev,
        auctions: JSON.parse(savedAuctionFavorites)
      }));
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    if (favorites.properties) {
      localStorage.setItem('propertyFavorites', JSON.stringify(favorites.properties));
    }
    if (favorites.auctions) {
      localStorage.setItem('auctionFavorites', JSON.stringify(favorites.auctions));
    }
  }, [favorites]);

  // Fetch data when filters, tab, or page changes
  useEffect(() => {
    if (activeTab === 'lands') {
      fetchProperties();
    } else {
      fetchAuctions();
    }
  }, [activeTab, currentPage, landFilters, auctionFilters]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      
      // تنظيف state لمنع إعادة التطبيق عند التحديث
      window.history.replaceState({}, document.title);
    }
    
    // أيضًا معالجة البحث من الصفحة الرئيسية
    if (location.state?.searchFromHome && location.state?.searchQuery) {
      const searchQuery = location.state.searchQuery;
      
      if (activeTab === 'lands') {
        setLandFilters(prev => ({
          ...prev,
          search: searchQuery
        }));
      } else {
        setAuctionFilters(prev => ({
          ...prev,
          search: searchQuery
        }));
      }
      
      window.history.replaceState({}, document.title);
    }
  }, [location.state, activeTab]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      
      // إضافة الفلاتر بشكل صحيح
      if (landFilters.region) queryParams.append('region', landFilters.region);
      if (landFilters.purpose) queryParams.append('purpose', landFilters.purpose);
      if (landFilters.search) queryParams.append('search', landFilters.search);
      if (landFilters.city) queryParams.append('city', landFilters.city);
      if (landFilters.land_type) queryParams.append('land_type', landFilters.land_type);
      
      // إضافة الباجينيشن
      queryParams.append('page', currentPage);

      const url = `https://shahin-tqay.onrender.com/api/properties?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }

      const data = await response.json();

      if (data.status && data.data) {
        setProperties(data.data.data || []);
        setTotalPages(data.data.pagination?.last_page || 1);
      } else {
        setProperties([]);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  const fetchAuctions = async () => {
    try {
      setLoading(true);
      
      const queryParams = new URLSearchParams();
      
      // إضافة فلاتر المزادات بشكل صحيح
      if (auctionFilters.search) queryParams.append('keyword', auctionFilters.search);
      if (auctionFilters.status) queryParams.append('status', auctionFilters.status);
      
      // إضافة الباجينيشن
      queryParams.append('page', currentPage);

      const url = `https://shahin-tqay.onrender.com/api/auctions?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المزادات');
      }

      const data = await response.json();

      if (data.success && data.data) {
        setAuctions(data.data.data || []);
        setTotalPages(data.data.last_page || 1);
      } else {
        setAuctions([]);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Handle filter changes for lands
  const handleLandFilterChange = (e) => {
    const { name, value } = e.target;
    setLandFilters({
      ...landFilters,
      [name]: value
    });
  };

  // Handle filter changes for auctions
  const handleAuctionFilterChange = (e) => {
    const { name, value } = e.target;
    setAuctionFilters({
      ...auctionFilters,
      [name]: value
    });
  };

  // Reset filters based on active tab
  const resetFilters = () => {
    if (activeTab === 'lands') {
      setLandFilters({
        search: '',
        region: '',
        city: '',
        land_type: '',
        purpose: '',
        min_area: '',
        max_area: '',
        min_price: '',
        max_price: '',
        min_investment: '',
        max_investment: ''
      });
    } else {
      setAuctionFilters({
        search: '',
        status: '',
        date_from: '',
        date_to: '',
        company: '',
        address: ''
      });
    }
    setCurrentPage(1);
  };

  // Apply filters (for mobile)
  const applyFilters = () => {
    setShowMobileFilters(false);
    setCurrentPage(1);
  };

  // Toggle favorite status for properties
  const togglePropertyFavorite = (propertyId, e) => {
    e?.stopPropagation();
    const propertyFavorites = favorites.properties || [];

    if (propertyFavorites.includes(propertyId)) {
      setFavorites({
        ...favorites,
        properties: propertyFavorites.filter(id => id !== propertyId)
      });
    } else {
      setFavorites({
        ...favorites,
        properties: [...propertyFavorites, propertyId]
      });
    }
  };

  // Toggle favorite status for auctions
  const toggleAuctionFavorite = (auctionId, e) => {
    e?.stopPropagation();
    const auctionFavorites = favorites.auctions || [];

    if (auctionFavorites.includes(auctionId)) {
      setFavorites({
        ...favorites,
        auctions: auctionFavorites.filter(id => id !== auctionId)
      });
    } else {
      setFavorites({
        ...favorites,
        auctions: [...auctionFavorites, auctionId]
      });
    }
  };

  // Share property
  const shareProperty = (property, e) => {
    e?.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `أرض ${property.land_type} في ${property.region} - ${property.city}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      const shareText = `${property.title} - أرض ${property.land_type} في ${property.region} - ${property.city}`;
      const textArea = document.createElement("textarea");
      textArea.value = shareText + " " + window.location.href;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert("تم نسخ الرابط للمشاركة!");
      } catch (err) {
        console.error('فشل نسخ النص: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Share auction
  const shareAuction = (auction, e) => {
    e?.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: auction.title.replace(/"/g, ''),
        text: `مزاد: ${auction.title.replace(/"/g, '')} - ${auction.description.replace(/"/g, '')}`,
        url: window.location.href,
      })
      .catch((error) => console.log('Error sharing', error));
    } else {
      const shareText = `${auction.title.replace(/"/g, '')} - ${auction.description.replace(/"/g, '')}`;
      const textArea = document.createElement("textarea");
      textArea.value = shareText + " " + window.location.href;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        alert("تم نسخ الرابط للمشاركة!");
      } catch (err) {
        console.error('فشل نسخ النص: ', err);
      }
      document.body.removeChild(textArea);
    }
  };

  // Open property details in new page
  const openPropertyDetails = (property) => {
    navigate(`/property/${property.id}/land`);
  };

  // Open auction details in new page
  const openAuctionDetails = (auction) => {
    navigate(`/property/${auction.id}/auction`);
  };

  // Get property image URL
  const getPropertyImageUrl = (property) => {
    if (property.cover_image) {
      return `https://shahin-tqay.onrender.com/storage/${property.cover_image}`;
    }
    return null;
  };

  // Get auction image URL
  const getAuctionImageUrl = (auction) => {
    if (auction.cover_image) {
      return `https://shahin-tqay.onrender.com/storage/${auction.cover_image}`;
    }
    return null;
  };

  // Calculate total price
  const calculateTotalPrice = (property) => {
    if (property.price_per_sqm && property.total_area) {
      return (parseFloat(property.price_per_sqm) * parseFloat(property.total_area)).toFixed(2);
    }
    return '0';
  };

  // Handle pagination
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  // Format date
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Format time
  const formatTime = (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (e) {
      return timeString;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'مفتوح': return 'shahinStatus_open';
      case 'تم البيع': return 'shahinStatus_sold';
      case 'محجوز': return 'shahinStatus_reserved';
      case 'مغلق': return 'shahinStatus_closed';
      case 'معلق': return 'shahinStatus_pending';
      default: return 'shahinStatus_unknown';
    }
  };

  // Land Filters Component
  const LandFiltersContent = () => (
    <div className="shahinFilters_content">
      <div className="shahinFilters_row">
        <div className="shahinFilter_group">
          <label>المنطقة</label>
          <select name="region" value={landFilters.region} onChange={handleLandFilterChange}>
            <option value="">كل المناطق</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>المدينة</label>
          <input
            type="text"
            name="city"
            placeholder="أدخل المدينة"
            value={landFilters.city}
            onChange={handleLandFilterChange}
          />
        </div>

        <div className="shahinFilter_group">
          <label>نوع الأرض</label>
          <select name="land_type" value={landFilters.land_type} onChange={handleLandFilterChange}>
            <option value="">كل الأنواع</option>
            {landTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>الغرض</label>
          <select name="purpose" value={landFilters.purpose} onChange={handleLandFilterChange}>
            <option value="">جميع الأغراض</option>
            {purposes.map((purpose) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </div>

        {window.innerWidth >= 768 && (
          <>
            <div className="shahinFilter_group">
              <label>المساحة من (م²)</label>
              <input
                type="number"
                name="min_area"
                placeholder="الحد الأدنى"
                value={landFilters.min_area}
                onChange={handleLandFilterChange}
              />
            </div>

            <div className="shahinFilter_group">
              <label>المساحة إلى (م²)</label>
              <input
                type="number"
                name="max_area"
                placeholder="الحد الأقصى"
                value={landFilters.max_area}
                onChange={handleLandFilterChange}
              />
            </div>
          </>
        )}
      </div>

      {window.innerWidth < 768 && (
        <div className="shahinFilters_row">
          <div className="shahinFilter_group">
            <label>المساحة من (م²)</label>
            <input
              type="number"
              name="min_area"
              placeholder="الحد الأدنى"
              value={landFilters.min_area}
              onChange={handleLandFilterChange}
            />
          </div>

          <div className="shahinFilter_group">
            <label>المساحة إلى (م²)</label>
            <input
              type="number"
              name="max_area"
              placeholder="الحد الأقصى"
              value={landFilters.max_area}
              onChange={handleLandFilterChange}
            />
          </div>

          {landFilters.purpose !== 'استثمار' && (
            <>
              <div className="shahinFilter_group">
                <label>السعر من (ريال/م²)</label>
                <input
                  type="number"
                  name="min_price"
                  placeholder="الحد الأدنى"
                  value={landFilters.min_price}
                  onChange={handleLandFilterChange}
                />
              </div>

              <div className="shahinFilter_group">
                <label>السعر إلى (ريال/م²)</label>
                <input
                  type="number"
                  name="max_price"
                  placeholder="الحد الأقصى"
                  value={landFilters.max_price}
                  onChange={handleLandFilterChange}
                />
              </div>
            </>
          )}
        </div>
      )}

      <div className="shahinFilter_actions">
        <button className="shahinReset_btn" onClick={resetFilters}>إعادة تعيين</button>
        <button className="shahinApply_btn" onClick={applyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // Auction Filters Component
  const AuctionFiltersContent = () => (
    <div className="shahinFilters_content">
      <div className="shahinFilters_row">
        <div className="shahinFilter_group">
          <label>البحث في المزادات</label>
          <input
            type="text"
            name="search"
            placeholder="ابحث في عنوان أو وصف المزاد"
            value={auctionFilters.search}
            onChange={handleAuctionFilterChange}
          />
        </div>

        <div className="shahinFilter_group">
          <label>حالة المزاد</label>
          <select name="status" value={auctionFilters.status} onChange={handleAuctionFilterChange}>
            <option value="">جميع الحالات</option>
            {auctionStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>اسم الشركة</label>
          <input
            type="text"
            name="company"
            placeholder="اسم شركة المزاد"
            value={auctionFilters.company}
            onChange={handleAuctionFilterChange}
          />
        </div>

        {window.innerWidth >= 768 && (
          <>
            <div className="shahinFilter_group">
              <label>العنوان</label>
              <input
                type="text"
                name="address"
                placeholder="موقع المزاد"
                value={auctionFilters.address}
                onChange={handleAuctionFilterChange}
              />
            </div>

            <div className="shahinFilter_group">
              <label>من تاريخ</label>
              <input
                type="date"
                name="date_from"
                value={auctionFilters.date_from}
                onChange={handleAuctionFilterChange}
              />
            </div>

            <div className="shahinFilter_group">
              <label>إلى تاريخ</label>
              <input
                type="date"
                name="date_to"
                value={auctionFilters.date_to}
                onChange={handleAuctionFilterChange}
              />
            </div>
          </>
        )}
      </div>

      {window.innerWidth < 768 && (
        <div className="shahinFilters_row">
          <div className="shahinFilter_group">
            <label>العنوان</label>
            <input
              type="text"
              name="address"
              placeholder="موقع المزاد"
              value={auctionFilters.address}
              onChange={handleAuctionFilterChange}
            />
          </div>

          <div className="shahinFilter_group">
            <label>من تاريخ</label>
            <input
              type="date"
              name="date_from"
              value={auctionFilters.date_from}
              onChange={handleAuctionFilterChange}
            />
          </div>

          <div className="shahinFilter_group">
            <label>إلى تاريخ</label>
            <input
              type="date"
              name="date_to"
              value={auctionFilters.date_to}
              onChange={handleAuctionFilterChange}
            />
          </div>
        </div>
      )}

      <div className="shahinFilter_actions">
        <button className="shahinReset_btn" onClick={resetFilters}>إعادة تعيين</button>
        <button className="shahinApply_btn" onClick={applyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="shahinPagination">
        <button onClick={prevPage} disabled={currentPage === 1} className="shahinPage_arrow">
          <FaArrowRight />
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            pageNum === currentPage ||
            pageNum === currentPage - 1 ||
            pageNum === currentPage + 1
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={currentPage === pageNum ? 'shahinActive' : ''}
              >
                {pageNum}
              </button>
            );
          } else if (
            pageNum === currentPage - 2 ||
            pageNum === currentPage + 2
          ) {
            return <span key={pageNum} className="shahinEllipsis">...</span>;
          }
          return null;
        })}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="shahinPage_arrow"
        >
          <FaArrowLeft />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="shahinProperties_container">
        <div className={`shahinSearch_filter ${hideFilterBar ? 'shahinHideFilter' : ''}`} ref={filterBarRef}>
          <div className="shahinSearch_bar">
            <div className="shahinSearch_input">
              <FaSearch className="shahinSearch_icon" />
              <input
                type="text"
                placeholder={activeTab === 'lands' ? "البحث عن أراضي..." : "البحث عن مزادات..."}
                name="search"
                value={activeTab === 'lands' ? landFilters.search : auctionFilters.search}
                onChange={activeTab === 'lands' ? handleLandFilterChange : handleAuctionFilterChange}
              />
            </div>
            <button
              className="shahinFilter_toggle"
              onClick={() => window.innerWidth < 768 ? setShowMobileFilters(true) : setShowFilters(!showFilters)}
            >
              {showFilters ? <MdClose /> : <FaFilter />}
              <span>{showFilters ? 'إغلاق' : 'فلترة'}</span>
            </button>
          </div>

          <div className="shahinTabs">
            <button
              className={activeTab === 'lands' ? 'shahinActive' : ''}
              onClick={() => {
                setActiveTab('lands');
                setCurrentPage(1);
              }}
            >
              الأراضي
            </button>
            <button
              className={activeTab === 'auctions' ? 'shahinActive' : ''}
              onClick={() => {
                setActiveTab('auctions');
                setCurrentPage(1);
              }}
            >
              المزادات
            </button>
          </div>
        </div>

        {/* Desktop Filters */}
        {showFilters && window.innerWidth >= 768 && (
          <div className="shahinFilters_container shahinDesktop">
            {activeTab === 'lands' ? <LandFiltersContent /> : <AuctionFiltersContent />}
          </div>
        )}

        {/* Mobile Filter Sidebar */}
        <>
          <div className={`shahinOverlay ${showMobileFilters ? 'shahinActive' : ''}`} onClick={() => setShowMobileFilters(false)}></div>
          <div className={`shahinMobileFilter_sidebar ${showMobileFilters ? 'shahinActive' : ''}`}>
            <div className="shahinSidebar_header">
              <h3>🔍 فلاتر البحث</h3>
              <button className="shahinClose_sidebar" onClick={() => setShowMobileFilters(false)}>
                <FaTimes />
              </button>
            </div>
            {activeTab === 'lands' ? <LandFiltersContent /> : <AuctionFiltersContent />}
          </div>
        </>

        {/* Main Content */}
        <div className="shahinContent_area">
          {activeTab === 'lands' ? (
            <>
              {loading ? (
                <div className="shahinLoading_container">
                  <div className="shahinLoader"></div>
                  <p>جاري تحميل الأراضي...</p>
                </div>
              ) : error ? (
                <div className="shahinError_container">
                  <p>حدث خطأ: {error}</p>
                  <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
                </div>
              ) : properties.length === 0 ? (
                <div className="shahinEmpty_state">
                  <p>لم يتم العثور على أي أراضٍ تطابق معايير البحث</p>
                  <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
                </div>
              ) : (
                <div className="shahinProperties_grid">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="shahinProperty_card"
                      onClick={() => openPropertyDetails(property)}
                    >
                      <div className="shahinProperty_image">
                        {getPropertyImageUrl(property) ? (
                          <img src={getPropertyImageUrl(property)} alt={property.title} />
                        ) : (
                          <div className="shahinPlaceholder_image">
                            <FaHome />
                          </div>
                        )}
                        <div className={`shahinStatus_badge ${getStatusBadgeClass(property.status)}`}>
                          {property.status}
                        </div>
                        <button
                          className={`shahinFavorite_btn ${favorites.properties?.includes(property.id) ? 'shahinActive' : ''}`}
                          onClick={(e) => togglePropertyFavorite(property.id, e)}
                        >
                          <FaHeart />
                        </button>
                      </div>

                      <div className="shahinProperty_details">
                        <h3>{property.title}</h3>

                        <div className="shahinProperty_location">
                          <FaMapMarkerAlt />
                          <span>{property.region} - {property.city}</span>
                          {property.geo_location_text && (
                            <span className="shahinLocation_detail">({property.geo_location_text})</span>
                          )}
                        </div>

                        <div className="shahinProperty_specs">
                          <div className="shahinSpec">
                            <FaRulerCombined />
                            <span>{formatPrice(property.total_area)} م²</span>
                          </div>
                          <div className="shahinSpec">
                            <FaMoneyBillWave />
                            <span>
                              {property.purpose === 'بيع'
                                ? `${formatPrice(property.price_per_sqm)} ر.س/م²`
                                : `${formatPrice(property.estimated_investment_value)} ر.س`}
                            </span>
                          </div>
                        </div>

                        {property.purpose === 'بيع' && property.price_per_sqm && property.total_area && (
                          <div className="shahinTotal_price">
                            <strong>السعر الإجمالي: {formatPrice(calculateTotalPrice(property))} ر.س</strong>
                          </div>
                        )}

                        <div className="shahinProperty_type">
                          <span className={`shahinTag ${property.land_type?.toLowerCase()}`}>
                            {property.land_type}
                          </span>
                          <span className={`shahinTag shahinPurpose ${property.purpose?.toLowerCase()}`}>
                            {property.purpose}
                          </span>
                        </div>

                        <div className="shahinProperty_actions">
                          <button className="shahinAction_btn shahinDetails_btn">تفاصيل</button>
                          <button
                            className="shahinAction_btn shahinShare_btn"
                            onClick={(e) => shareProperty(property, e)}
                          >
                            <FaShare /> مشاركة
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Auctions Tab Content */
            <>
              {loading ? (
                <div className="shahinLoading_container">
                  <div className="shahinLoader"></div>
                  <p>جاري تحميل المزادات...</p>
                </div>
              ) : error ? (
                <div className="shahinError_container">
                  <p>حدث خطأ: {error}</p>
                  <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
                </div>
              ) : auctions.length === 0 ? (
                <div className="shahinEmpty_state">
                  <p>لا توجد مزادات متاحة حالياً</p>
                  <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
                </div>
              ) : (
                <div className="shahinAuctions_grid">
                  {auctions.map((auction) => (
                    <div
                      key={auction.id}
                      className="shahinAuction_card"
                      onClick={() => openAuctionDetails(auction)}
                    >
                      <div className="shahinAuction_image">
                        {getAuctionImageUrl(auction) ? (
                          <img src={getAuctionImageUrl(auction)} alt={auction.title.replace(/"/g, '')} />
                        ) : (
                          <div className="shahinPlaceholder_image">
                            <FaImage />
                          </div>
                        )}
                        <div className={`shahinStatus_badge ${getStatusBadgeClass(auction.status)}`}>
                          {auction.status}
                        </div>
                        <button
                          className={`shahinFavorite_btn ${favorites.auctions?.includes(auction.id) ? 'shahinActive' : ''}`}
                          onClick={(e) => toggleAuctionFavorite(auction.id, e)}
                        >
                          <FaHeart />
                        </button>
                      </div>

                      <div className="shahinAuction_details">
                        <h3>{auction.title.replace(/"/g, '')}</h3>

                        {auction.company && (
                          <div className="shahinAuction_company">
                            <FaBuilding />
                            <span>{auction.company.auction_name}</span>
                          </div>
                        )}

                        <div className="shahinAuction_location">
                          <FaMapMarkerAlt />
                          <span>{auction.address.replace(/"/g, '')}</span>
                        </div>

                        <div className="shahinAuction_schedule">
                          <div className="shahinSchedule_item">
                            <FaCalendarDay />
                            <span>{formatDate(auction.auction_date)}</span>
                          </div>
                          <div className="shahinSchedule_item">
                            <FaClock />
                            <span>{formatTime(auction.start_time)}</span>
                          </div>
                        </div>

                        <p className="shahinAuction_description">
                          {auction.description.replace(/"/g, '')}
                        </p>

                        <div className="shahinAuction_actions">
                          <button className="shahinAction_btn shahinDetails_btn">تفاصيل</button>
                          <button
                            className="shahinAction_btn shahinShare_btn"
                            onClick={(e) => shareAuction(auction, e)}
                          >
                            <FaShare /> مشاركة
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {/* Pagination - Works for both tabs */}
          {renderPagination()}
        </div>
      </div>
    </>
  );
};

export default PropertiesPage;