import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
  FaCalendarDay
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import PropertyDetailsModal from './PropertyDetailsModal';
import AuctionDetailsModal from './AuctionDetailsModal';
import '../styles/PropertyList.css';


const PropertiesPage = () => {
    const location = useLocation();

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
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showAuctionModal, setShowAuctionModal] = useState(false);

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
      setFavorites({
        ...favorites,
        properties: JSON.parse(savedPropertyFavorites)
      });
    }

    if (savedAuctionFavorites) {
      setFavorites({
        ...favorites,
        auctions: JSON.parse(savedAuctionFavorites)
      });
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
    Object.entries(landFilters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });

    // إضافة البحث إذا كان موجوداً
    if (landFilters.search) {
      queryParams.append('search', landFilters.search);
    }

    // Add pagination
    queryParams.append('page', currentPage);

    const url = `https://shahin-tqay.onrender.com/api/properties?${queryParams}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error('فشل في جلب البيانات');
    }

    const data = await response.json();

    if (data.status && data.data) {
      setProperties(data.data.data || []);
      setTotalPages(data.data.pagination.last_page || 1);
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
      
      // Add auction filters
      Object.entries(auctionFilters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });

      // Add pagination
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

  // Open property details modal
  const openPropertyDetails = (property) => {
    setSelectedProperty(property);
    setShowPropertyModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close property details modal
  const closePropertyDetails = () => {
    setShowPropertyModal(false);
    setSelectedProperty(null);
    document.body.style.overflow = 'auto';
  };

  // Open auction details modal
  const openAuctionDetails = (auction) => {
    setSelectedAuction(auction);
    setShowAuctionModal(true);
    document.body.style.overflow = 'hidden';
  };

  // Close auction details modal
  const closeAuctionDetails = () => {
    setShowAuctionModal(false);
    setSelectedAuction(null);
    document.body.style.overflow = 'auto';
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
      case 'مفتوح': return 'elegantStatus_open';
      case 'تم البيع': return 'elegantStatus_sold';
      case 'محجوز': return 'elegantStatus_reserved';
      case 'مغلق': return 'elegantStatus_closed';
      case 'معلق': return 'elegantStatus_pending';
      default: return 'elegantStatus_unknown';
    }
  };

  // Land Filters Component
  const LandFiltersContent = () => (
    <div className="elegantFilters_content">
      <div className="elegantFilters_grid">
        <div className="elegantFilter_group">
          <label>المنطقة</label>
          <select name="region" value={landFilters.region} onChange={handleLandFilterChange}>
            <option value="">كل المناطق</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="elegantFilter_group">
          <label>المدينة</label>
          <input
            type="text"
            name="city"
            placeholder="أدخل المدينة"
            value={landFilters.city}
            onChange={handleLandFilterChange}
          />
        </div>

        <div className="elegantFilter_group">
          <label>نوع الأرض</label>
          <select name="land_type" value={landFilters.land_type} onChange={handleLandFilterChange}>
            <option value="">كل الأنواع</option>
            {landTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="elegantFilter_group">
          <label>الغرض</label>
          <select name="purpose" value={landFilters.purpose} onChange={handleLandFilterChange}>
            <option value="">جميع الأغراض</option>
            {purposes.map((purpose) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </div>

        <div className="elegantFilter_group">
          <label>المساحة من (م²)</label>
          <input
            type="number"
            name="min_area"
            placeholder="الحد الأدنى"
            value={landFilters.min_area}
            onChange={handleLandFilterChange}
          />
        </div>

        <div className="elegantFilter_group">
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
            <div className="elegantFilter_group">
              <label>السعر من (ريال/م²)</label>
              <input
                type="number"
                name="min_price"
                placeholder="الحد الأدنى"
                value={landFilters.min_price}
                onChange={handleLandFilterChange}
              />
            </div>

            <div className="elegantFilter_group">
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

        {landFilters.purpose === 'استثمار' && (
          <>
            <div className="elegantFilter_group">
              <label>قيمة الاستثمار من (ريال)</label>
              <input
                type="number"
                name="min_investment"
                placeholder="الحد الأدنى"
                value={landFilters.min_investment}
                onChange={handleLandFilterChange}
              />
            </div>

            <div className="elegantFilter_group">
              <label>قيمة الاستثمار إلى (ريال)</label>
              <input
                type="number"
                name="max_investment"
                placeholder="الحد الأقصى"
                value={landFilters.max_investment}
                onChange={handleLandFilterChange}
              />
            </div>
          </>
        )}
      </div>

      <div className="elegantFilter_actions">
        <button className="elegantReset_btn" onClick={resetFilters}>إعادة تعيين</button>
        <button className="elegantApply_btn" onClick={applyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // Auction Filters Component
  const AuctionFiltersContent = () => (
    <div className="elegantFilters_content">
      <div className="elegantFilters_grid">
        <div className="elegantFilter_group">
          <label>البحث في المزادات</label>
          <input
            type="text"
            name="search"
            placeholder="ابحث في عنوان أو وصف المزاد"
            value={auctionFilters.search}
            onChange={handleAuctionFilterChange}
          />
        </div>

        <div className="elegantFilter_group">
          <label>حالة المزاد</label>
          <select name="status" value={auctionFilters.status} onChange={handleAuctionFilterChange}>
            <option value="">جميع الحالات</option>
            {auctionStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="elegantFilter_group">
          <label>اسم الشركة</label>
          <input
            type="text"
            name="company"
            placeholder="اسم شركة المزاد"
            value={auctionFilters.company}
            onChange={handleAuctionFilterChange}
          />
        </div>

        <div className="elegantFilter_group">
          <label>العنوان</label>
          <input
            type="text"
            name="address"
            placeholder="موقع المزاد"
            value={auctionFilters.address}
            onChange={handleAuctionFilterChange}
          />
        </div>

        <div className="elegantFilter_group">
          <label>من تاريخ</label>
          <input
            type="date"
            name="date_from"
            value={auctionFilters.date_from}
            onChange={handleAuctionFilterChange}
          />
        </div>

        <div className="elegantFilter_group">
          <label>إلى تاريخ</label>
          <input
            type="date"
            name="date_to"
            value={auctionFilters.date_to}
            onChange={handleAuctionFilterChange}
          />
        </div>
      </div>

      <div className="elegantFilter_actions">
        <button className="elegantReset_btn" onClick={resetFilters}>إعادة تعيين</button>
        <button className="elegantApply_btn" onClick={applyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // Render pagination
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="elegantPagination">
        <button onClick={prevPage} disabled={currentPage === 1} className="elegantPage_arrow">
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
                className={currentPage === pageNum ? 'elegantActive' : ''}
              >
                {pageNum}
              </button>
            );
          } else if (
            pageNum === currentPage - 2 ||
            pageNum === currentPage + 2
          ) {
            return <span key={pageNum} className="elegantEllipsis">...</span>;
          }
          return null;
        })}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="elegantPage_arrow"
        >
          <FaArrowLeft />
        </button>
      </div>
    );
  };

  return (
    <>
      <div className="elegantProperties_container">
        <div className="elegantSearch_filter">
          <div className="elegantSearch_bar">
            <div className="elegantSearch_input">
              <FaSearch className="elegantSearch_icon" />
              <input
                type="text"
                placeholder={activeTab === 'lands' ? "البحث عن أراضي..." : "البحث عن مزادات..."}
                name="search"
                value={activeTab === 'lands' ? landFilters.search : auctionFilters.search}
                onChange={activeTab === 'lands' ? handleLandFilterChange : handleAuctionFilterChange}
              />
            </div>
            <button
              className="elegantFilter_toggle"
              onClick={() => window.innerWidth < 768 ? setShowMobileFilters(true) : setShowFilters(!showFilters)}
            >
              {showFilters ? <MdClose /> : <FaFilter />}
              <span>{showFilters ? 'إغلاق' : 'فلترة'}</span>
            </button>
          </div>

          <div className="elegantTabs">
            <button
              className={activeTab === 'lands' ? 'elegantActive' : ''}
              onClick={() => {
                setActiveTab('lands');
                setCurrentPage(1);
              }}
            >
              الأراضي
            </button>
            <button
              className={activeTab === 'auctions' ? 'elegantActive' : ''}
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
          <div className="elegantFilters_container elegantDesktop">
            {activeTab === 'lands' ? <LandFiltersContent /> : <AuctionFiltersContent />}
          </div>
        )}

        {/* Mobile Filter Sidebar */}
        <>
          <div className={`elegantOverlay ${showMobileFilters ? 'elegantActive' : ''}`} onClick={() => setShowMobileFilters(false)}></div>
          <div className={`elegantMobileFilter_sidebar ${showMobileFilters ? 'elegantActive' : ''}`}>
            <div className="elegantSidebar_header">
              <h3>🔍 فلاتر البحث</h3>
              <button className="elegantClose_sidebar" onClick={() => setShowMobileFilters(false)}>
                <FaTimes />
              </button>
            </div>
            {activeTab === 'lands' ? <LandFiltersContent /> : <AuctionFiltersContent />}
          </div>
        </>

        {/* Main Content */}
        <div className="elegantContent_area">
          {activeTab === 'lands' ? (
            <>
              {loading ? (
                <div className="elegantLoading_container">
                  <div className="elegantLoader"></div>
                  <p>جاري تحميل الأراضي...</p>
                </div>
              ) : error ? (
                <div className="elegantError_container">
                  <p>حدث خطأ: {error}</p>
                  <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
                </div>
              ) : properties.length === 0 ? (
                <div className="elegantEmpty_state">
                  <p>لم يتم العثور على أي أراضٍ تطابق معايير البحث</p>
                  <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
                </div>
              ) : (
                <div className="elegantProperties_grid">
                  {properties.map((property) => (
                    <div
                      key={property.id}
                      className="elegantProperty_card"
                      onClick={() => openPropertyDetails(property)}
                    >
                      <div className="elegantProperty_image">
                        {getPropertyImageUrl(property) ? (
                          <img src={getPropertyImageUrl(property)} alt={property.title} />
                        ) : (
                          <div className="elegantPlaceholder_image">
                            <FaMapMarkerAlt />
                          </div>
                        )}
                        <div className={`elegantStatus_badge ${getStatusBadgeClass(property.status)}`}>
                          {property.status}
                        </div>
                        <button
                          className={`elegantFavorite_btn ${favorites.properties?.includes(property.id) ? 'elegantActive' : ''}`}
                          onClick={(e) => togglePropertyFavorite(property.id, e)}
                        >
                          <FaHeart />
                        </button>
                      </div>

                      <div className="elegantProperty_details">
                        <h3>{property.title}</h3>

                        <div className="elegantProperty_location">
                          <FaMapMarkerAlt />
                          <span>{property.region} - {property.city}</span>
                          {property.geo_location_text && (
                            <span className="elegantLocation_detail">({property.geo_location_text})</span>
                          )}
                        </div>

                        <div className="elegantProperty_specs">
                          <div className="elegantSpec">
                            <FaRulerCombined />
                            <span>{formatPrice(property.total_area)} م²</span>
                          </div>
                          <div className="elegantSpec">
                            <FaMoneyBillWave />
                            <span>
                              {property.purpose === 'بيع'
                                ? `${formatPrice(property.price_per_sqm)} ر.س/م²`
                                : `${formatPrice(property.estimated_investment_value)} ر.س`}
                            </span>
                          </div>
                        </div>

                        {property.purpose === 'بيع' && property.price_per_sqm && property.total_area && (
                          <div className="elegantTotal_price">
                            <strong>السعر الإجمالي: {formatPrice(calculateTotalPrice(property))} ر.س</strong>
                          </div>
                        )}

                        <div className="elegantProperty_type">
                          <span className={`elegantTag ${property.land_type?.toLowerCase()}`}>
                            {property.land_type}
                          </span>
                          <span className={`elegantTag elegantPurpose ${property.purpose?.toLowerCase()}`}>
                            {property.purpose}
                          </span>
                        </div>

                        <div className="elegantProperty_actions">
                          <button className="elegantAction_btn elegantDetails_btn">تفاصيل</button>
                          <button
                            className="elegantAction_btn elegantShare_btn"
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
                <div className="elegantLoading_container">
                  <div className="elegantLoader"></div>
                  <p>جاري تحميل المزادات...</p>
                </div>
              ) : error ? (
                <div className="elegantError_container">
                  <p>حدث خطأ: {error}</p>
                  <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
                </div>
              ) : auctions.length === 0 ? (
                <div className="elegantEmpty_state">
                  <p>لا توجد مزادات متاحة حالياً</p>
                  <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
                </div>
              ) : (
                <div className="elegantAuctions_grid">
                  {auctions.map((auction) => (
                    <div
                      key={auction.id}
                      className="elegantAuction_card"
                      onClick={() => openAuctionDetails(auction)}
                    >
                      <div className="elegantAuction_image">
                        {getAuctionImageUrl(auction) ? (
                          <img src={getAuctionImageUrl(auction)} alt={auction.title.replace(/"/g, '')} />
                        ) : (
                          <div className="elegantPlaceholder_image">
                            <FaBuilding />
                          </div>
                        )}
                        <div className={`elegantStatus_badge ${getStatusBadgeClass(auction.status)}`}>
                          {auction.status}
                        </div>
                        <button
                          className={`elegantFavorite_btn ${favorites.auctions?.includes(auction.id) ? 'elegantActive' : ''}`}
                          onClick={(e) => toggleAuctionFavorite(auction.id, e)}
                        >
                          <FaHeart />
                        </button>
                      </div>

                      <div className="elegantAuction_details">
                        <h3>{auction.title.replace(/"/g, '')}</h3>

                        {auction.company && (
                          <div className="elegantAuction_company">
                            <FaBuilding />
                            <span>{auction.company.auction_name}</span>
                          </div>
                        )}

                        <div className="elegantAuction_location">
                          <FaMapMarkerAlt />
                          <span>{auction.address.replace(/"/g, '')}</span>
                        </div>

                        <div className="elegantAuction_schedule">
                          <div className="elegantSchedule_item">
                            <FaCalendarDay />
                            <span>{formatDate(auction.auction_date)}</span>
                          </div>
                          <div className="elegantSchedule_item">
                            <FaClock />
                            <span>{formatTime(auction.start_time)}</span>
                          </div>
                        </div>

                        <p className="elegantAuction_description">
                          {auction.description.replace(/"/g, '')}
                        </p>

                        <div className="elegantAuction_actions">
                          <button className="elegantAction_btn elegantDetails_btn">تفاصيل</button>
                          <button
                            className="elegantAction_btn elegantShare_btn"
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

        {/* Property Details Modal */}
        {showPropertyModal && selectedProperty && (
          <PropertyDetailsModal
            property={selectedProperty}
            onClose={closePropertyDetails}
            isFavorite={favorites.properties?.includes(selectedProperty.id)}
            onToggleFavorite={togglePropertyFavorite}
            onShare={shareProperty}
          />
        )}

        {/* Auction Details Modal */}
        {showAuctionModal && selectedAuction && (
          <AuctionDetailsModal
            auction={selectedAuction}
            onClose={closeAuctionDetails}
            isFavorite={favorites.auctions?.includes(selectedAuction.id)}
            onToggleFavorite={toggleAuctionFavorite}
            onShare={shareAuction}
          />
        )}
      </div>
    </>
  );
};

export default PropertiesPage;