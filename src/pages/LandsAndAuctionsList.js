import React, { useState, useEffect, useRef, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icons from '../icons/index';
import { MdClose } from 'react-icons/md';
import { propertiesApi, propertiesUtils } from '../api/propertiesApi';
import { auctionsApi, auctionsUtils } from '../api/auctionApi';
import FiltersComponent from '../utils/FiltersComponent';
import { ModalContext } from '../App';
import { toast, Toaster } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import '../styles/PropertyList.css';

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth();

  // States
  const [state, setState] = useState({
    properties: [],
    auctions: [],
    loading: true,
    error: null,
    currentPage: 1,
    totalPages: 1,
    activeTab: 'lands',
    showFilters: false,
    showMobileFilters: false,
    hideFilterBar: false,
    favorites: { properties: [], auctions: [] }
  });

  const [landFilters, setLandFilters] = useState({
    search: '', region: '', city: '', land_type: '', purpose: '',
    min_area: '', max_area: '', min_price: '', max_price: '',
    min_investment: '', max_investment: ''
  });

  const [auctionFilters, setAuctionFilters] = useState({
    search: '', status: '', date_from: '', date_to: '', company: '', address: ''
  });

  // Constants
  const regions = [];
  const landTypes = ['سكني', 'تجاري', 'صناعي', 'زراعي'];
  const purposes = ['بيع', 'استثمار'];
  const auctionStatuses = ['مفتوح', 'مغلق', 'معلق'];

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setState(prev => ({ ...prev, hideFilterBar: scrollTop > lastScrollTop.current && scrollTop > 100 }));
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.searchFromHome && location.state?.searchQuery) {
      const searchQuery = location.state.searchQuery;
      const updateFilter = state.activeTab === 'lands' ? setLandFilters : setAuctionFilters;
      updateFilter(prev => ({ ...prev, search: searchQuery }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state, state.activeTab]);

  useEffect(() => { fetchFavorites(); }, []);

  useEffect(() => {
    state.activeTab === 'lands' ? fetchProperties() : fetchAuctions();
  }, [state.activeTab, state.currentPage, landFilters, auctionFilters]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setState(prev => ({ ...prev, activeTab: location.state.activeTab }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Helper Functions
  const updateState = (updates) => setState(prev => ({ ...prev, ...updates }));

  const getCurrentFilters = () => state.activeTab === 'lands' ? landFilters : auctionFilters;
  const getCurrentFilterHandler = () => state.activeTab === 'lands' ? handleLandFilterChange : handleAuctionFilterChange;
  const getFilterOptions = () => state.activeTab === 'lands' ? { regions, landTypes, purposes } : { auctionStatuses };

  /**
   * دالة الحصول على نوع المستخدم الحالي من AuthContext
   */
  const getCurrentUserType = () => {
    return currentUser?.user_type || localStorage.getItem('user_type');
  };

  /**
   * دالة التحقق من صلاحية المستخدم للإنشاء
   */
  const isUserAuthorized = (userType) => {
    // الأنواع المسموح لها بالإنشاء
    const authorizedTypes = ['مالك أرض', 'وكيل عقارات', 'شركة مزادات'];
    return authorizedTypes.includes(userType);
  };

  /**
   * دالة الحصول على نص زر الإنشاء
   */
  const getCreateButtonText = () => {
    const userType = getCurrentUserType();
    switch(userType) {
      case 'مالك أرض':
        return 'إنشاء أرض';
      case 'وكيل عقارات':
        return 'إنشاء أرض';
      case 'شركة مزادات':
        return 'إنشاء مزاد';
      default:
        return 'انضم الآن';
    }
  };

  /**
   * دالة التحقق إذا كان المستخدم مسجل دخول
   */
  const isUserLoggedIn = () => {
    return !!currentUser || !!localStorage.getItem('token');
  };

  /**
   * دالة إنشاء جديد حسب نوع المستخدم
   */
  const handleCreateNew = () => {
    const userType = getCurrentUserType();

    // إذا لم يكن مسجل دخول
    if (!isUserLoggedIn()) {
      openLogin(() => {
        // بعد تسجيل الدخول، المتابعة في الإنشاء
        const newUserType = getCurrentUserType();
        proceedWithCreation(newUserType);
      });
      return;
    }

    // التحقق من الصلاحية - إذا كان نوع المستخدم غير مصرح له
    if (!isUserAuthorized(userType)) {
      toast.error('عذراً، هذه الخدمة متاحة فقط لأصحاب الأراضي ووكلاء العقارات وشركات المزادات');
      return;
    }

    // إذا كان مسجل دخول وله صلاحية، المتابعة في الإنشاء مباشرة
    proceedWithCreation(userType);
  };

  /**
   * المتابعة في عملية الإنشاء
   */
  const proceedWithCreation = (userType) => {
    // التحقق مرة أخرى من الصلاحية قبل المتابعة
    if (!isUserAuthorized(userType)) {
      toast.error('عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة');
      return;
    }

    switch(userType) {
      case 'مالك أرض':
      case 'وكيل عقارات':
      case 'شركة مزادات':
        navigate('/create-ad');
        break;
      default:
        // للمستخدمين الآخرين، افترض إنشاء طلب شراء
        navigate('/');
        break;
    }
  };

  // API Functions
  const fetchFavorites = async () => {
    try {
      const savedPropertyFavorites = localStorage.getItem('propertyFavorites');
      const savedAuctionFavorites = localStorage.getItem('auctionFavorites');
      updateState({
        favorites: {
          properties: savedPropertyFavorites ? JSON.parse(savedPropertyFavorites) : [],
          auctions: savedAuctionFavorites ? JSON.parse(savedAuctionFavorites) : []
        }
      });
    } catch (error) {
      console.error("فشل في جلب المفضلات:", error);
    }
  };

  const fetchProperties = async () => {
    try {
      updateState({ loading: true });
      const data = await propertiesApi.getProperties(landFilters, state.currentPage);
      
      if (data.status && data.data) {
        updateState({ 
          properties: data.data.data || [],
          totalPages: data.data.pagination?.last_page || 1,
          loading: false 
        });
      } else {
        updateState({ properties: [], totalPages: 1, loading: false });
      }
    } catch (error) {
      updateState({ error: error.message, loading: false });
    }
  };

  const fetchAuctions = async () => {
    try {
      updateState({ loading: true });
      const data = await auctionsApi.getAuctions(auctionFilters, state.currentPage);
      
      if (data.success && data.data) {
        updateState({ 
          auctions: data.data.data || [],
          totalPages: data.data.last_page || 1,
          loading: false 
        });
      } else {
        updateState({ auctions: [], totalPages: 1, loading: false });
      }
    } catch (error) {
      updateState({ error: error.message, loading: false });
    }
  };

  // Filter Handlers
  const handleLandFilterChange = (e) => {
    const { name, value } = e.target;
    setLandFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleAuctionFilterChange = (e) => {
    const { name, value } = e.target;
    setAuctionFilters(prev => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    if (state.activeTab === 'lands') {
      setLandFilters({
        search: '', region: '', city: '', land_type: '', purpose: '',
        min_area: '', max_area: '', min_price: '', max_price: '',
        min_investment: '', max_investment: ''
      });
    } else {
      setAuctionFilters({
        search: '', status: '', date_from: '', date_to: '', company: '', address: ''
      });
    }
    updateState({ currentPage: 1 });
  };

  const applyFilters = () => {
    updateState({ showMobileFilters: false, currentPage: 1 });
  };

  // Favorite Handlers
  const toggleFavorite = async (type, id, e) => {
    e?.stopPropagation();
    const token = localStorage.getItem('token');
    const api = type === 'properties' ? propertiesApi : auctionsApi;
    const storageKey = type === 'properties' ? 'propertyFavorites' : 'auctionFavorites';
    
    try {
      const data = await api.toggleFavorite(id, token);
      
      if (data.success) {
        const action = data.action;
        const currentFavorites = state.favorites[type] || [];
        let newFavorites;

        if (action === 'added') {
          newFavorites = [...currentFavorites, id];
        } else {
          newFavorites = currentFavorites.filter(favId => favId !== id);
        }

        updateState({ favorites: { ...state.favorites, [type]: newFavorites } });
        localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
      handleLocalFavorite(type, id);
    }
  };

  const handleLocalFavorite = (type, id) => {
    const storageKey = type === 'properties' ? 'propertyFavorites' : 'auctionFavorites';
    const currentFavorites = state.favorites[type] || [];
    const isFavorite = currentFavorites.includes(id);
    
    const newFavorites = isFavorite 
      ? currentFavorites.filter(favId => favId !== id)
      : [...currentFavorites, id];

    updateState({ favorites: { ...state.favorites, [type]: newFavorites } });
    localStorage.setItem(storageKey, JSON.stringify(newFavorites));
  };

  // Share Handlers
  const shareItem = async (item, type, e) => {
    e?.stopPropagation();
    
    try {
      // إنشاء نص المشاركة بناءً على النوع
      let shareText = '';
      if (type === 'properties') {
        shareText = `أرض ${item.land_type} - ${item.region} - ${item.city}`;
      } else {
        shareText = `مزاد: ${auctionsUtils.cleanText(item.title)} - ${auctionsUtils.cleanText(item.description)}`;
      }
      
      // إنشاء رابط المشاركة الصحيح
      const shareUrl = type === 'properties' 
        ? `${window.location.origin}/lands/${item.id}/land`
        : `${window.location.origin}/lands/${item.id}/auction`;
      
      // استخدام Web Share API إذا متاح
      if (navigator.share) {
        await navigator.share({
          title: type === 'properties' ? `أرض رقم ${item.id}` : `مزاد رقم ${item.id}`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        // Fallback إلى نسخ النص
        navigator.clipboard.writeText(shareText + " " + shareUrl)
          .then(() => toast.success("تم نسخ الرابط للمشاركة!"))
          .catch(err => console.error('فشل نسخ النص: ', err));
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback في حالة فشل المشاركة
      let shareText = '';
      if (type === 'properties') {
        shareText = `أرض ${item.land_type} - ${item.region} - ${item.city}`;
      } else {
        shareText = `مزاد: ${auctionsUtils.cleanText(item.title)} - ${auctionsUtils.cleanText(item.description)}`;
      }
      
      const shareUrl = type === 'properties' 
        ? `${window.location.origin}/lands/${item.id}/land`
        : `${window.location.origin}/lands/${item.id}/auction`;
      
      navigator.clipboard.writeText(shareText + " " + shareUrl)
        .then(() => toast.success("تم نسخ الرابط للمشاركة!"))
        .catch(err => console.error('فشل نسخ النص: ', err));
    }
  };

  // Navigation Handlers
  const openDetails = (item, itemType) => {
    if (itemType === 'land') {
      navigate(`/lands/${item.id}/land`);
    } else if (itemType === 'auction') {
      navigate(`/lands/${item.id}/auction`);
    }
  };

  // Pagination Handlers
  const paginate = (pageNumber) => updateState({ currentPage: pageNumber });
  const nextPage = () => state.currentPage < state.totalPages && updateState({ currentPage: state.currentPage + 1 });
  const prevPage = () => state.currentPage > 1 && updateState({ currentPage: state.currentPage - 1 });

  // Render Functions
  const renderPagination = () => {
    if (state.totalPages <= 1) return null;

    return (
      <div className="shahinPagination">
        <button onClick={prevPage} disabled={state.currentPage === 1} className="shahinPage_arrow">
          <Icons.FaArrowRight />
        </button>

        {Array.from({ length: state.totalPages }, (_, i) => {
          const pageNum = i + 1;
          if (pageNum === 1 || pageNum === state.totalPages || 
              [state.currentPage - 1, state.currentPage, state.currentPage + 1].includes(pageNum)) {
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={state.currentPage === pageNum ? 'shahinActive' : ''}
              >
                {pageNum}
              </button>
            );
          } else if ([state.currentPage - 2, state.currentPage + 2].includes(pageNum)) {
            return <span key={pageNum} className="shahinEllipsis">...</span>;
          }
          return null;
        })}

        <button onClick={nextPage} disabled={state.currentPage === state.totalPages} className="shahinPage_arrow">
          <Icons.FaArrowLeft />
        </button>
      </div>
    );
  };

  const renderPropertyCard = (property) => (
    <div key={property.id} className="shahinProperty_card" onClick={() => openDetails(property, 'land')}>
      <div className="shahinProperty_image">
        {propertiesUtils.getPropertyImageUrl(property) ? (
          <img src={propertiesUtils.getPropertyImageUrl(property)} alt={property.title || "صورة العقار"} loading="lazy" />
        ) : (
          <div className="shahinPlaceholder_image"><Icons.FaHome /></div>
        )}
        <div className={`shahinStatus_badge ${propertiesUtils.getStatusBadgeClass(property.status)}`}>
          {property.status}
        </div>
        <button
          className={`shahinFavorite_btn ${state.favorites.properties?.includes(property.id) ? 'shahinActive' : ''}`}
          onClick={(e) => toggleFavorite('properties', property.id, e)}
          aria-label="إضافة إلى المفضلة"
        >
          <Icons.FaHeart />
        </button>
      </div>

      <div className="shahinProperty_details">
        <h3 className="shahinCard_title">{property.title}</h3>
        <div className="shahinProperty_location">
          <Icons.FaMapMarkerAlt />
          <span>{property.region} - {property.city}</span>
          {property.geo_location_text && <span className="shahinLocation_detail">({property.geo_location_text})</span>}
        </div>

        <div className="shahinProperty_specs">
          <div className="shahinSpec">
            <Icons.FaRulerCombined />
            <span>{propertiesUtils.formatPrice(property.total_area)} م²</span>
          </div>
          <div className="shahinSpec">
            <Icons.FaMoneyBillWave />
            <span>
              {property.purpose === 'بيع'
                ? `${propertiesUtils.formatPrice(property.price_per_sqm)} ر.س/م²`
                : `${propertiesUtils.formatPrice(property.estimated_investment_value)} ر.س`}
            </span>
          </div>
        </div>

        {property.purpose === 'بيع' && property.price_per_sqm && property.total_area && (
          <div className="shahinTotal_price">
            <strong>السعر الإجمالي: {propertiesUtils.formatPrice(propertiesUtils.calculateTotalPrice(property))} ر.س</strong>
          </div>
        )}

        <div className="shahinProperty_type">
          <span className={`shahinTag ${property.land_type?.toLowerCase()}`}>{property.land_type}</span>
          <span className={`shahinTag shahinPurpose ${property.purpose?.toLowerCase()}`}>{property.purpose}</span>
        </div>

        <div className="shahinProperty_actions">
          <button className="shahinAction_btn shahinDetails_btn">تفاصيل</button>
          <button 
            className="shahinAction_btn shahinShare_btn" 
            onClick={(e) => shareItem(property, 'properties', e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare /> مشاركة
          </button>
        </div>
      </div>
    </div>
  );

  const renderAuctionCard = (auction) => (
    <div key={auction.id} className="shahinAuction_card" onClick={() => openDetails(auction, 'auction')}>
      <div className="shahinAuction_image">
        {auctionsUtils.getAuctionImageUrl(auction) ? (
          <img 
            src={auctionsUtils.getAuctionImageUrl(auction)} 
            alt={auctionsUtils.cleanText(auction.title) || "صورة المزاد"}
            loading="lazy"
          />
        ) : (
          <div className="shahinPlaceholder_image"><Icons.FaImage /></div>
        )}
        <div className={`shahinStatus_badge ${auctionsUtils.getStatusBadgeClass(auction.status)}`}>
          {auction.status}
        </div>
        <button
          className={`shahinFavorite_btn ${state.favorites.auctions?.includes(auction.id) ? 'shahinActive' : ''}`}
          onClick={(e) => toggleFavorite('auctions', auction.id, e)}
          aria-label="إضافة إلى المفضلة"
        >
          <Icons.FaHeart />
        </button>
      </div>

      <div className="shahinAuction_details">
        <h3 className="shahinCard_title">{auctionsUtils.cleanText(auction.title)}</h3>
        {auction.company && (
          <div className="shahinAuction_company">
            <Icons.FaBuilding />
            <span>{auction.company.auction_name}</span>
          </div>
        )}

        <div className="shahinAuction_location">
          <Icons.FaMapMarkerAlt />
          <span>{auctionsUtils.cleanText(auction.address)}</span>
        </div>

        <div className="shahinAuction_schedule">
          <div className="shahinSchedule_item">
            <Icons.FaCalendarDay />
            <span>{auctionsUtils.formatDate(auction.auction_date)}</span>
          </div>
          <div className="shahinSchedule_item">
            <Icons.FaClock />
            <span>{auctionsUtils.formatTime(auction.start_time)}</span>
          </div>
        </div>

        <p className="shahinAuction_description">{auctionsUtils.cleanText(auction.description)}</p>

        <div className="shahinAuction_actions">
          <button className="shahinAction_btn shahinDetails_btn">تفاصيل</button>
          <button 
            className="shahinAction_btn shahinShare_btn" 
            onClick={(e) => shareItem(auction, 'auctions', e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare /> مشاركة
          </button>
        </div>
      </div>
    </div>
  );

  const renderFloatingCreateButton = () => (
    <button 
      className="shahinFloating_create" 
      onClick={handleCreateNew} 
      aria-label={getCreateButtonText()}
    >
      <Icons.FaPlus />
      <span className="shahinCreateBtn_text">{getCreateButtonText()}</span>
    </button>
  );

  const renderContent = () => {
    if (state.loading) {
      return (
        <div className="shahinLoading_container">
          <div className="shahinLoader"></div>
          <p>جاري تحميل {state.activeTab === 'lands' ? 'الأراضي' : 'المزادات'}...</p>
        </div>
      );
    }

    if (state.error) {
      return (
        <div className="shahinError_container">
          <p>حدث خطأ: {state.error}</p>
          <button onClick={() => window.location.reload()} className="shahinRetry_btn">إعادة المحاولة</button>
        </div>
      );
    }

    const items = state.activeTab === 'lands' ? state.properties : state.auctions;
    if (items.length === 0) {
      return (
        <div className="shahinEmpty_state">
          <div className="shahinEmpty_icon">
            {state.activeTab === 'lands' ? <Icons.FaHome size={36} /> : <Icons.FaGavel size={36} />}
          </div>
          <p>لم يتم العثور على أي {state.activeTab === 'lands' ? 'أراضٍ' : 'مزادات'} تطابق معايير البحث</p>
          <button onClick={resetFilters} className="shahinReset_filters_btn">إعادة تعيين الفلتر</button>
        </div>
      );
    }

    return (
      <div className={`shahin${state.activeTab === 'lands' ? 'Properties' : 'Auctions'}_grid`}>
        {state.activeTab === 'lands' ? state.properties.map(renderPropertyCard) : state.auctions.map(renderAuctionCard)}
      </div>
    );
  };

  return (
    <div className="shahinProperties_container">
      {/* إضافة Toaster للإشعارات */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#000',
            direction: 'rtl',
            fontFamily: 'Tajawal, Cairo, Arial, sans-serif',
            border: '1px solid #e0e0e0',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 999999,
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />

      {/* Search and Filter Bar */}
      <div className={`shahinSearch_filter ${state.hideFilterBar ? 'shahinHideFilter' : ''}`} ref={filterBarRef}>
        <div className="shahinSearch_bar">
          <div className="shahinSearch_input">
            <Icons.FaSearch className="shahinSearch_icon" />
            <input
              type="text"
              placeholder={state.activeTab === 'lands' ? "البحث عن أراضي..." : "البحث عن مزادات..."}
              name="search"
              value={getCurrentFilters().search}
              onChange={getCurrentFilterHandler()}
            />
          </div>
          
          <button
            className="shahinFilter_toggle shahinCreate_btn"
            onClick={handleCreateNew}
            title={getCreateButtonText()}
          >
            <Icons.FaPlus className="shahinCreate_icon" />
            <span className="shahinBtnText">{getCreateButtonText()}</span>
          </button>

          <button
            className="shahinFilter_toggle"
            onClick={() => window.innerWidth < 768 ? 
              updateState({ showMobileFilters: true }) : 
              updateState({ showFilters: !state.showFilters })
            }
            aria-label="فلترة"
          >
            {state.showFilters ? <MdClose /> : <Icons.FaFilter />}
            <span className="shahinBtnText">{state.showFilters ? 'إغلاق' : 'فلترة'}</span>
          </button>
        </div>

        <div className="shahinTabs">
          <button
            className={`shahinTab_btn ${state.activeTab === 'lands' ? 'shahinActive' : ''}`}
            onClick={() => updateState({ activeTab: 'lands', currentPage: 1 })}
          >
            <Icons.FaHome className="shahinTab_icon" /> الأراضي
          </button>
          <button
            className={`shahinTab_btn ${state.activeTab === 'auctions' ? 'shahinActive' : ''}`}
            onClick={() => updateState({ activeTab: 'auctions', currentPage: 1 })}
          >
            <Icons.FaGavel className="shahinTab_icon" /> المزادات
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      {state.showFilters && window.innerWidth >= 768 && (
        <div className="shahinFilters_container shahinDesktop">
          <FiltersComponent
            activeTab={state.activeTab}
            filters={getCurrentFilters()}
            onFilterChange={getCurrentFilterHandler()}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
            {...getFilterOptions()}
          />
        </div>
      )}

      {/* Mobile Filter Sidebar */}
      <div className={`shahinOverlay ${state.showMobileFilters ? 'shahinActive' : ''}`} 
           onClick={() => updateState({ showMobileFilters: false })}></div>
      <div className={`shahinMobileFilter_sidebar ${state.showMobileFilters ? 'shahinActive' : ''}`}>
        <div className="shahinSidebar_header">
          <h3>🔍 فلاتر البحث</h3>
          <button 
            className="shahinClose_sidebar" 
            onClick={() => updateState({ showMobileFilters: false })}
            aria-label="إغلاق"
          >
            <Icons.FaTimes />
          </button>
        </div>
        <FiltersComponent
          activeTab={state.activeTab}
          filters={getCurrentFilters()}
          onFilterChange={getCurrentFilterHandler()}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
          {...getFilterOptions()}
        />
      </div>

      {/* Main Content */}
      <div className="shahinContent_area">
        {renderContent()}
        {renderPagination()}
      </div>

      {/* Floating Create Button - للهواتف فقط */}
      {window.innerWidth < 768 && renderFloatingCreateButton()}
    </div>
  );
};

export default PropertiesPage;  