// src/pages/LandRequestsList.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { MdClose } from 'react-icons/md';
import Icons from '../../icons/index';
import FiltersComponent from '../../utils/FiltersComponent';
import { propertiesApi, propertiesUtils } from '../../api/propertiesApi';

function LandRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [perPage, setPerPage] = useState(12);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [hideFilterBar, setHideFilterBar] = useState(false);
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);

  const [filters, setFilters] = useState({
    search: '',
    region: '',
    city: '',
    purpose: '',
    type: '',
    area_min: '',
    area_max: '',
  });

  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState({});

  // Handle scroll to hide/show filter bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (scrollTop > lastScrollTop.current && scrollTop > 100) {
        setHideFilterBar(true);
      } else {
        setHideFilterBar(false);
      }
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchRegionsAndCities();
    loadFavorites();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [filters, currentPage]);

  const fetchRegionsAndCities = () => {
    const regionsData = [
      'منطقة الرياض', 'منطقة مكة المكرمة', 'منطقة المدينة المنورة', 
      'منطقة القصيم', 'المنطقة الشرقية', 'منطقة عسير', 'منطقة تبوك',
      'منطقة حائل', 'منطقة الحدود الشمالية', 'منطقة جازان', 
      'منطقة نجران', 'منطقة الباحة', 'منطقة الجوف'
    ];
    
    const citiesData = {
      'منطقة الرياض': ['الرياض', 'الخرج', 'الدرعية', 'المزاحمية', 'القويعية'],
      'منطقة مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'القنفذة', 'رابغ'],
      'منطقة المدينة المنورة': ['المدينة المنورة', 'ينبع', 'العلا', 'المهد'],
    };
    
    setRegions(regionsData);
    setCities(citiesData);
  };

  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('landRequestFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('landRequestFavorites', JSON.stringify(newFavorites));
  };

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      console.log('Fetching requests with params:', { ...filters, page: currentPage });

      const response = await propertiesApi.getLandRequests(filters, currentPage, token);
      
      console.log('API Response:', response);

      if (response && response.data) {
        setRequests(response.data);
        
        // تحديث معلومات الـ pagination من الـ API
        if (response.pagination) {
          setCurrentPage(response.pagination.current_page || 1);
          setTotalPages(response.pagination.last_page || 1);
          setPerPage(response.pagination.per_page || 12);
          setTotalItems(response.pagination.total || 0);
        } else if (response.meta) {
          // دعم لـ Laravel pagination format
          setCurrentPage(response.meta.current_page || 1);
          setTotalPages(response.meta.last_page || 1);
          setPerPage(response.meta.per_page || 12);
          setTotalItems(response.meta.total || 0);
        } else {
          // Fallback في حالة عدم وجود pagination
          setTotalPages(1);
          setTotalItems(response.data.length);
        }
      } else {
        setRequests([]);
        setTotalPages(1);
        setTotalItems(0);
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching requests:', err);
      setError('حدث خطأ أثناء تحميل البيانات');
      setLoading(false);
      
      // Reset data on error
      setRequests([]);
      setTotalPages(1);
      setTotalItems(0);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'region' && { city: '' }) // Reset city when region changes
    }));
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    setShowFilters(false);
    setCurrentPage(1); // العودة للصفحة الأولى عند تطبيق الفلتر
    fetchRequests();
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      region: '',
      city: '',
      purpose: '',
      type: '',
      area_min: '',
      area_max: '',
    });
    setCurrentPage(1);
  };

  const toggleFavorite = (requestId, e) => {
    e?.stopPropagation();
    const newFavorites = favorites.includes(requestId) 
      ? favorites.filter(id => id !== requestId)
      : [...favorites, requestId];
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
  };

  const shareRequest = async (request, e) => {
    e?.stopPropagation();
    const shareText = `طلب أرض ${propertiesUtils.getPurposeLabel(request.purpose)} - ${request.region} - ${request.city}`;
    
    if (navigator.share) {
      navigator.share({
        title: `طلب أرض رقم ${request.id}`,
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      navigator.clipboard.writeText(shareText + " " + window.location.href)
        .then(() => alert("تم نسخ الرابط للمشاركة!"))
        .catch(err => console.error('فشل نسخ النص: ', err));
    }
  };

  const getStatusLabel = (status) => propertiesUtils.getStatusLabel(status);
  const getPurposeLabel = (purpose) => propertiesUtils.getPurposeLabel(purpose);
  const getTypeLabel = (type) => propertiesUtils.getTypeLabel(type);

  const getStatusBadgeClass = (status) => {
    return status === 'open' ? 'shahinStatus_open' : 'shahinStatus_closed';
  };

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

  // Render pagination with improved UI
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`shahinPage_btn ${currentPage === i ? 'shahinActive' : ''}`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="shahinPagination_container">
        <div className="shahinPagination_info">
          <span>
            {/* عرض {requests.length} من أصل {totalItems} طلب */}
          </span>
          <span>
            {/* الصفحة {currentPage} من {totalPages} */}.
          </span>
        </div>
        
        <div className="shahinPagination">
          <button 
            onClick={prevPage} 
            disabled={currentPage === 1} 
            className="shahinPage_arrow"
          >
            <Icons.FaArrowRight />
          </button>

          {startPage > 1 && (
            <>
              <button
                onClick={() => paginate(1)}
                className="shahinPage_btn"
              >
                1
              </button>
              {startPage > 2 && <span className="shahinEllipsis">...</span>}
            </>
          )}

          {pages}

          {endPage < totalPages && (
            <>
              {endPage < totalPages - 1 && <span className="shahinEllipsis">...</span>}
              <button
                onClick={() => paginate(totalPages)}
                className="shahinPage_btn"
              >
                {totalPages}
              </button>
            </>
          )}

          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="shahinPage_arrow"
          >
            <Icons.FaArrowLeft />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="shahinProperties_container">
      {/* Search and Filter Bar */}
      <div className={`shahinSearch_filter ${hideFilterBar ? 'shahinHideFilter' : ''}`} ref={filterBarRef}>
        <div className="shahinSearch_bar">
          <div className="shahinSearch_input">
            <Icons.FaSearch className="shahinSearch_icon" />
            <input
              type="text"
              placeholder="البحث في طلبات الأراضي..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
            />
          </div>
          <button
            className="shahinFilter_toggle"
            onClick={() => window.innerWidth < 768 ? setShowMobileFilters(true) : setShowFilters(!showFilters)}
          >
            {showFilters ? <MdClose /> : <Icons.FaFilter />}
            <span>{showFilters ? 'إغلاق' : 'فلترة'}</span>
          </button>
        </div>

        <div className="shahinPage_header">
          <div className="form-buttons">
            <Link to="/create-request" className="shahinMarketing_btn">
              <Icons.FaPlus /> إنشاء طلب جديد
            </Link>
            <Link to="/create-auction-request" className="shahinMarketing_btn">
              <Icons.FaBullhorn /> طلب تسويق
            </Link>
          </div>
        </div>
      </div>

      {/* Desktop Filters */}
      {showFilters && window.innerWidth >= 768 && (
        <div className="shahinFilters_container shahinDesktop">
          <FiltersComponent
            activeTab="requests"
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
            regions={regions}
            cities={cities}
            showSearch={false}
          />
        </div>
      )}

      {/* Mobile Filter Sidebar */}
      <>
        <div className={`shahinOverlay ${showMobileFilters ? 'shahinActive' : ''}`} onClick={() => setShowMobileFilters(false)}></div>
        <div className={`shahinMobileFilter_sidebar ${showMobileFilters ? 'shahinActive' : ''}`}>
          <div className="shahinSidebar_header">
            <button className="shahinClose_sidebar" onClick={() => setShowMobileFilters(false)}>
              <Icons.FaTimes />
            </button>
          </div>
          <FiltersComponent
            activeTab="requests"
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
            regions={regions}
            cities={cities}
            showSearch={false}
          />
        </div>
      </>

      {/* Main Content */}
      <div className="shahinContent_area">
        {loading ? (
          <div className="shahinLoading_container">
            <div className="shahinLoader"></div>
            <p>جاري تحميل الطلبات...</p>
          </div>
        ) : error ? (
          <div className="shahinError_container">
            <p>حدث خطأ: {error}</p>
            <button onClick={fetchRequests}>إعادة المحاولة</button>
          </div>
        ) : requests.length === 0 ? (
          <div className="shahinEmpty_state">
            <div className="shahinEmpty_icon">
              <Icons.FaBuilding />
            </div>
            <h3>لا توجد طلبات</h3>
            <p>لم يتم العثور على أي طلبات تطابق معايير البحث</p>
            <div className="shahinEmpty_actions">
              <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
            </div>
          </div>
        ) : (
          <>
            <div className="shahinResults_info">
              <p>عرض {requests.length} من أصل {totalItems} طلب</p>
            </div>

            <div className="shahinProperties_grid">
              {requests.map((request) => (
                <div
                  key={request.id}
                  className="shahinProperty_card"
                >
                  {/* تم إزالة قسم الصورة والأيقونة بالكامل */}
                  
                  <div className="shahinProperty_details">
                    <div className="shahinRequest_header">
                      <h3>طلب أرض #{request.id}</h3>
                      <span className="shahinRequest_id">#{request.id}</span>
                    </div>

                    <div className="shahinProperty_location">
                      <Icons.FaMapMarkerAlt />
                      <span>{request.region} - {request.city}</span>
                    </div>

                    <div className="shahinProperty_specs">
                      <div className="shahinSpec">
                        <Icons.FaRulerCombined />
                        <span>{propertiesUtils.formatPrice(request.area)} م²</span>
                      </div>
                      <div className="shahinSpec">
                        <Icons.FaHandshake />
                        <span>{getPurposeLabel(request.purpose)}</span>
                      </div>
                      <div className="shahinSpec">
                        <Icons.FaBuilding />
                        <span>{getTypeLabel(request.type)}</span>
                      </div>
                    </div>

                    <div className="shahinProperty_type">
                      <span className={`shahinTag ${request.type}`}>
                        {getTypeLabel(request.type)}
                      </span>
                      <span className={`shahinTag shahinPurpose ${request.purpose}`}>
                        {getPurposeLabel(request.purpose)}
                      </span>
                    </div>

                    <div className="shahinRequest_description">
                      <p>{request.description || 'لا يوجد وصف'}</p>
                    </div>

                    <div className="shahinRequest_date">
                      <Icons.FaCalendarAlt />
                      <span>أنشئ في: {propertiesUtils.formatDate(request.created_at)}</span>
                    </div>

                    <div className="shahinProperty_actions">
                      <Link 
                        to={`/requests/${request.id}`} 
                        className="shahinAction_btn shahinDetails_btn"
                      >
                        <Icons.FaEye /> تفاصيل
                      </Link>
                      <button
                        className="shahinAction_btn shahinShare_btn"
                        onClick={(e) => shareRequest(request, e)}
                      >
                        <Icons.FaShare /> مشاركة
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {renderPagination()}
          </>
        )}
      </div>
    </div>
  );
}

export default LandRequestsList;