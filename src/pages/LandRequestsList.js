// src/pages/LandRequestsList.js
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
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
  FaHandshake,
  FaEye,
  FaPaperPlane,
  FaPlus
} from 'react-icons/fa';
import { MdClose } from 'react-icons/md';
import { FaBullhorn } from 'react-icons/fa'; // أضف هذا الاستيراد

function LandRequestsList() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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
      const response = await axios.get('https://shahin-tqay.onrender.com/api/land-requests', {
        headers: { 'Authorization': `Bearer ${token}` },
        params: { ...filters, page: currentPage }
      });
      
      if (response.data.data) {
        setRequests(response.data.data);
        setTotalPages(response.data.pagination?.last_page || 1);
      } else {
        setRequests([]);
        setTotalPages(1);
      }
      setLoading(false);
    } catch (err) {
      setError('حدث خطأ أثناء تحميل البيانات');
      setLoading(false);
      console.error(err);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'region' && { city: '' })
    }));
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    setCurrentPage(1);
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

  const shareRequest = (request, e) => {
    e?.stopPropagation();
    const shareText = `طلب أرض ${getPurposeLabel(request.purpose)} - ${request.region} - ${request.city}`;
    
    if (navigator.share) {
      navigator.share({
        title: `طلب أرض رقم ${request.id}`,
        text: shareText,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
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

  const getStatusLabel = (status) => status === 'open' ? 'مفتوح' : 'مكتمل';
  const getPurposeLabel = (purpose) => purpose === 'sale' ? 'بيع' : 'إيجار';
  const getTypeLabel = (type) => {
    switch (type) {
      case 'residential': return 'سكني';
      case 'commercial': return 'تجاري';
      case 'agricultural': return 'زراعي';
      default: return type;
    }
  };

  const getStatusBadgeClass = (status) => {
    return status === 'open' ? 'shahinStatus_open' : 'shahinStatus_closed';
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const formatPrice = (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  // Filters Component
  const FiltersContent = () => (
    <div className="shahinFilters_content">
      <div className="shahinFilters_row">
        <div className="shahinFilter_group">
          <label>المنطقة</label>
          <select name="region" value={filters.region} onChange={handleFilterChange}>
            <option value="">كل المناطق</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>المدينة</label>
          <select name="city" value={filters.city} onChange={handleFilterChange} disabled={!filters.region}>
            <option value="">كل المدن</option>
            {filters.region && cities[filters.region]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>الغرض</label>
          <select name="purpose" value={filters.purpose} onChange={handleFilterChange}>
            <option value="">الكل</option>
            <option value="sale">بيع</option>
            <option value="rent">إيجار</option>
          </select>
        </div>

        {window.innerWidth >= 768 && (
          <>
            <div className="shahinFilter_group">
              <label>النوع</label>
              <select name="type" value={filters.type} onChange={handleFilterChange}>
                <option value="">الكل</option>
                <option value="residential">سكني</option>
                <option value="commercial">تجاري</option>
                <option value="agricultural">زراعي</option>
              </select>
            </div>

            <div className="shahinFilter_group">
              <label>المساحة من (م²)</label>
              <input
                type="number"
                name="area_min"
                placeholder="الحد الأدنى"
                value={filters.area_min}
                onChange={handleFilterChange}
              />
            </div>

            <div className="shahinFilter_group">
              <label>المساحة إلى (م²)</label>
              <input
                type="number"
                name="area_max"
                placeholder="الحد الأقصى"
                value={filters.area_max}
                onChange={handleFilterChange}
              />
            </div>
          </>
        )}
      </div>

      {window.innerWidth < 768 && (
        <div className="shahinFilters_row">
          <div className="shahinFilter_group">
            <label>النوع</label>
            <select name="type" value={filters.type} onChange={handleFilterChange}>
              <option value="">الكل</option>
              <option value="residential">سكني</option>
              <option value="commercial">تجاري</option>
              <option value="agricultural">زراعي</option>
            </select>
          </div>

          <div className="shahinFilter_group">
            <label>المساحة من (م²)</label>
            <input
              type="number"
              name="area_min"
              placeholder="الحد الأدنى"
              value={filters.area_min}
              onChange={handleFilterChange}
            />
          </div>

          <div className="shahinFilter_group">
            <label>المساحة إلى (م²)</label>
            <input
              type="number"
              name="area_max"
              placeholder="الحد الأقصى"
              value={filters.area_max}
              onChange={handleFilterChange}
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
    <div className="shahinProperties_container">
      {/* Search and Filter Bar */}
      <div className={`shahinSearch_filter ${hideFilterBar ? 'shahinHideFilter' : ''}`} ref={filterBarRef}>
        <div className="shahinSearch_bar">
          <div className="shahinSearch_input">
            <FaSearch className="shahinSearch_icon" />
            <input
              type="text"
              placeholder="البحث في طلبات الأراضي..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
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

       <div className="shahinPage_header">
<div class="form-buttons">
    <Link to="/create-request" className="shahinMarketing_btn">
      <FaPlus /> إنشاء طلب جديد
    </Link>
    <Link to="/marketing-request" className="shahinMarketing_btn">
      <FaBullhorn /> طلب تسويق
    </Link>
  </div>
</div>
      </div>
      
      

      {/* Desktop Filters */}
      {showFilters && window.innerWidth >= 768 && (
        <div className="shahinFilters_container shahinDesktop">
          <FiltersContent />
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
          <FiltersContent />
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
            <button onClick={() => window.location.reload()}>إعادة المحاولة</button>
          </div>
        ) : requests.length === 0 ? (
          <div className="shahinEmpty_state">
            <p>لم يتم العثور على أي طلبات تطابق معايير البحث</p>
            <button onClick={resetFilters}>إعادة تعيين الفلتر</button>
          </div>
        ) : (
          <div className="shahinProperties_grid">
            {requests.map((request) => (
              <div
                key={request.id}
                className="shahinProperty_card"
              >
                <div className="shahinProperty_image">
                  <div className="shahinPlaceholder_image shahinRequest_placeholder">
                    <FaBuilding />
                  </div>
                  <div className={`shahinStatus_badge ${getStatusBadgeClass(request.status)}`}>
                    {getStatusLabel(request.status)}
                  </div>
                  <button
                    className={`shahinFavorite_btn ${favorites.includes(request.id) ? 'shahinActive' : ''}`}
                    onClick={(e) => toggleFavorite(request.id, e)}
                  >
                    <FaHeart />
                  </button>
                </div>

                <div className="shahinProperty_details">
                  <div className="shahinRequest_header">
                    <h3>طلب رقم: {request.id}</h3>
                  </div>

                  <div className="shahinProperty_location">
                    <FaMapMarkerAlt />
                    <span>{request.region} - {request.city}</span>
                  </div>

                  <div className="shahinProperty_specs">
                    <div className="shahinSpec">
                      <FaRulerCombined />
                      <span>{formatPrice(request.area)} م²</span>
                    </div>
                    <div className="shahinSpec">
                      <FaHandshake />
                      <span>{getPurposeLabel(request.purpose)}</span>
                    </div>
                    <div className="shahinSpec">
                      <FaBuilding />
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
                    <p>{request.description}</p>
                  </div>

                  <div className="shahinRequest_date">
                    <FaCalendarAlt />
                    <span>تاريخ الإنشاء: {request.created_at}</span>
                  </div>

                  <div className="shahinProperty_actions">
                    <Link 
                      to={`/requests/${request.id}`} 
                      className="shahinAction_btn shahinDetails_btn"
                    >
                      <FaEye /> تفاصيل
                    </Link>
                    {/* {request.status === 'open' && (
                      <Link 
                        to={`/requests/${request.id}#offer`} 
                        className="shahinAction_btn shahinOffer_btn"
                      >
                        <FaPaperPlane /> تقديم عرض
                      </Link>
                    )} */}
                    <button
                      className="shahinAction_btn shahinShare_btn"
                      onClick={(e) => shareRequest(request, e)}
                    >
                      <FaShare /> مشاركة
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {renderPagination()}
      </div>
    </div>
  );
}

export default LandRequestsList;