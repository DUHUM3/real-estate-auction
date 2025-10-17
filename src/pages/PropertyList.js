import React, { useState, useEffect } from 'react';
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
  FaTimes
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import PropertyDetailsModal from './PropertyDetailsModal';
import '../styles/PropertyList.css';
// CSS الجديد (يمكن وضعه في ملف PropertyList.css)


const PropertiesPage = () => {
  // State variables
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [activeTab, setActiveTab] = useState('lands');
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
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

  // Options for filters
  const regions = ['الرياض', 'مكة', 'المدينة', 'الشرقية', 'القصيم', 'حائل', 'تبوك', 'عسير', 'جازان'];
  const landTypes = ['سكني', 'تجاري', 'صناعي', 'زراعي'];
  const purposes = ['بيع', 'استثمار'];

  // Fetch properties data
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);
        
        const queryParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
          if (value) queryParams.append(key, value);
        });
        
        const url = `https://shahin-tqay.onrender.com/api/properties?${queryParams}`;
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('فشل في جلب البيانات');
        }
        
        const data = await response.json();
        
        if (data.status && data.data) {
          setProperties(data.data);
        } else {
          setProperties([]);
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProperties();
  }, [filters]);

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem('propertyFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when updated
  useEffect(() => {
    localStorage.setItem('propertyFavorites', JSON.stringify(favorites));
  }, [favorites]);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
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
  };

  // Apply filters (for mobile)
  const applyFilters = () => {
    setShowMobileFilters(false);
    setCurrentPage(1);
  };

  // Toggle favorite status
  const toggleFavorite = (propertyId, e) => {
    e?.stopPropagation();
    if (favorites.includes(propertyId)) {
      setFavorites(favorites.filter(id => id !== propertyId));
    } else {
      setFavorites([...favorites, propertyId]);
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

  // Get image URL
  const getImageUrl = (property) => {
    if (property.cover_image) {
      return `https://shahin-tqay.onrender.com/storage/${property.cover_image}`;
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = properties.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const nextPage = () => {
    if (currentPage < Math.ceil(properties.length / itemsPerPage)) {
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

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'مفتوح': return 'status-open';
      case 'تم البيع': return 'status-sold';
      case 'محجوز': return 'status-reserved';
      default: return 'status-unknown';
    }
  };

  // Filter component
  const FiltersContent = () => (
    <div className="filters-content">
      {/* <h3>🔍 فلاتر البحث</h3> */}
      <div className="filters-grid">
        <div className="filter-group">
          <label>المنطقة</label>
          <select name="region" value={filters.region} onChange={handleFilterChange}>
            <option value="">كل المناطق</option>
            {regions.map((region) => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>المدينة</label>
          <input 
            type="text" 
            name="city" 
            placeholder="أدخل المدينة" 
            value={filters.city} 
            onChange={handleFilterChange} 
          />
        </div>
        
        <div className="filter-group">
          <label>نوع الأرض</label>
          <select name="land_type" value={filters.land_type} onChange={handleFilterChange}>
            <option value="">كل الأنواع</option>
            {landTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>الغرض</label>
          <select name="purpose" value={filters.purpose} onChange={handleFilterChange}>
            <option value="">جميع الأغراض</option>
            {purposes.map((purpose) => (
              <option key={purpose} value={purpose}>{purpose}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>المساحة من (م²)</label>
          <input 
            type="number" 
            name="min_area" 
            placeholder="الحد الأدنى" 
            value={filters.min_area} 
            onChange={handleFilterChange} 
          />
        </div>
        
        <div className="filter-group">
          <label>المساحة إلى (م²)</label>
          <input 
            type="number" 
            name="max_area" 
            placeholder="الحد الأقصى" 
            value={filters.max_area} 
            onChange={handleFilterChange} 
          />
        </div>
        
        {filters.purpose !== 'استثمار' && (
          <>
            <div className="filter-group">
              <label>السعر من (ريال/م²)</label>
              <input 
                type="number" 
                name="min_price" 
                placeholder="الحد الأدنى" 
                value={filters.min_price} 
                onChange={handleFilterChange} 
              />
            </div>
            
            <div className="filter-group">
              <label>السعر إلى (ريال/م²)</label>
              <input 
                type="number" 
                name="max_price" 
                placeholder="الحد الأقصى" 
                value={filters.max_price} 
                onChange={handleFilterChange} 
              />
            </div>
          </>
        )}
      </div>
      
      <div className="filter-actions">
        <button className="reset-btn" onClick={resetFilters}>إعادة تعيين</button>
        <button className="apply-btn" onClick={applyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  return (
    <>
      <div className="properties-container">
        {/* Header - سيتم تغيير هيكله وإزالة العنوان كما طلبت */}
        <div className="header">
          {/* عنوان تم إزالته كما طلبت في المتطلبات */}
        </div>

        {/* Search and Filter Bar */}
        <div className="search-and-filter">
          <div className="search-bar">
            <div className="search-input">
              <FaSearch className="search-icon" />
              <input
                type="text"
                placeholder="البحث عن أراضي..."
                name="search"
                value={filters.search}
                onChange={handleFilterChange}
              />
            </div>
            <button 
              className="filter-toggle" 
              onClick={() => window.innerWidth < 768 ? setShowMobileFilters(true) : setShowFilters(!showFilters)}
            >
              {showFilters ? <MdClose /> : <FaFilter />}
              <span>{showFilters ? 'إغلاق الفلتر' : 'فلترة'}</span>
            </button>
          </div>
          
          {/* Tabs - تم نقلها تحت البحث والفلتر كما طلبت */}
          <div className="tabs">
            <button 
              className={activeTab === 'lands' ? 'active' : ''}
              onClick={() => setActiveTab('lands')}
            >
              الأراضي
            </button>
            <button 
              className={activeTab === 'auctions' ? 'active' : ''}
              onClick={() => setActiveTab('auctions')}
            >
              المزادات
            </button>
          </div>
        </div>

        {/* Desktop Filters */}
        {showFilters && window.innerWidth >= 768 && (
          <div className="filters-container desktop">
            <FiltersContent />
          </div>
        )}

        {/* Mobile Filter Sidebar */}
        <div className={`overlay ${showMobileFilters ? 'active' : ''}`} onClick={() => setShowMobileFilters(false)}></div>
        <div className={`mobile-filter-sidebar ${showMobileFilters ? 'active' : ''}`}>
          <div className="sidebar-header">
            <h3>🔍 فلاتر البحث</h3>
            <button className="close-sidebar" onClick={() => setShowMobileFilters(false)}>
              <FaTimes />
            </button>
          </div>
          <FiltersContent />
        </div>

        {/* Main Content */}
        <div className="content-area">
          {activeTab === 'lands' ? (
            <>
              {loading ? (
                <div className="loading-container">
                  <div className="loader"></div>
                  <p>جاري تحميل الأراضي...</p>
                </div>
              ) : error ? (
                <div className="error-container">
                  <p>حدث خطأ: {error}</p>
                  <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
                </div>
              ) : properties.length === 0 ? (
                <div className="empty-state">
                  <p>لم يتم العثور على أي أراضٍ تطابق معايير البحث</p>
                  <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
                </div>
              ) : (
                <div className="properties-grid">
                  {currentItems.map((property) => (
                    <div 
                      key={property.id} 
                      className="property-card"
                      onClick={() => openPropertyDetails(property)}
                    >
                      <div className="property-image">
                        {getImageUrl(property) ? (
                          <img src={getImageUrl(property)} alt={property.title} />
                        ) : (
                          <div className="placeholder-image">
                            <FaMapMarkerAlt />
                          </div>
                        )}
                        <div className={`status-badge ${getStatusBadgeClass(property.status)}`}>
                          {property.status}
                        </div>
                        <button 
                          className={`favorite-btn ${favorites.includes(property.id) ? 'active' : ''}`}
                          onClick={(e) => toggleFavorite(property.id, e)}
                        >
                          <FaHeart />
                        </button>
                      </div>
                      
                      <div className="property-details">
                        <h3>{property.title}</h3>
                        
                        <div className="property-location">
                          <FaMapMarkerAlt />
                          <span>{property.region} - {property.city}</span>
                          {property.geo_location_text && (
                            <span className="location-detail">({property.geo_location_text})</span>
                          )}
                        </div>
                        
                        <div className="property-specs">
                          <div className="spec">
                            <FaRulerCombined />
                            <span>{formatPrice(property.total_area)} م²</span>
                          </div>
                          <div className="spec">
                            <FaMoneyBillWave />
                            <span>
                              {property.purpose === 'بيع' 
                                ? `${formatPrice(property.price_per_sqm)} ر.س/م²` 
                                : `${formatPrice(property.estimated_investment_value)} ر.س`}
                            </span>
                          </div>
                        </div>

                        {property.purpose === 'بيع' && property.price_per_sqm && property.total_area && (
                          <div className="total-price">
                            <strong>السعر الإجمالي: {formatPrice(calculateTotalPrice(property))} ر.س</strong>
                          </div>
                        )}
                        
                        <div className="property-type">
                          <span className={`tag ${property.land_type?.toLowerCase()}`}>
                            {property.land_type}
                          </span>
                          <span className={`tag purpose ${property.purpose?.toLowerCase()}`}>
                            {property.purpose}
                          </span>
                        </div>

                        <div className="property-actions">
                          <button className="action-btn details-btn">تفاصيل</button>
                          <button 
                            className="action-btn share-btn" 
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
              
              {properties.length > itemsPerPage && (
                <div className="pagination">
                  <button onClick={prevPage} disabled={currentPage === 1} className="page-arrow">
                    <FaArrowRight />
                  </button>
                  
                  {Array.from({ length: Math.ceil(properties.length / itemsPerPage) }, (_, i) => (
                    <button 
                      key={i + 1}
                      onClick={() => paginate(i + 1)}
                      className={currentPage === i + 1 ? 'active' : ''}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button 
                    onClick={nextPage} 
                    disabled={currentPage === Math.ceil(properties.length / itemsPerPage)}
                    className="page-arrow"
                  >
                    <FaArrowLeft />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="auctions-coming-soon">
              <h2>المزادات قادمة قريباً</h2>
              <p>نعمل حالياً على توفير خدمة المزادات، ترقبوا الإطلاق قريباً!</p>
            </div>
          )}
        </div>

        {/* Property Details Modal */}
        {showPropertyModal && selectedProperty && (
          <PropertyDetailsModal 
            property={selectedProperty}
            onClose={closePropertyDetails}
            isFavorite={favorites.includes(selectedProperty.id)}
            onToggleFavorite={toggleFavorite}
            onShare={shareProperty}
          />
        )}
      </div>
    </>
  );
};

export default PropertiesPage;