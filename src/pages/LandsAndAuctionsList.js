import React, { useState, useRef, useContext, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Icons from '../icons/index';
import { MdClose } from 'react-icons/md';
import { propertiesApi, propertiesUtils } from '../api/propertiesApi';
import { auctionsApi, auctionsUtils } from '../api/auctionApi';
import FiltersComponent from '../utils/FiltersComponent';
import { ModalContext } from '../App';
// استبدال react-hot-toast بـ react-toastify
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../context/AuthContext';
import PropertyListSkeleton from '../Skeleton/PropertyListSkeleton';

// دالة مساعدة لعرض الرسائل
const showToast = (type, message, duration = 3000) => {
  const isMobile = window.innerWidth < 768;
  
  const options = {
    position: "top-right",
    autoClose: duration,
    rtl: true,
    theme: "light",
    style: {
      fontSize: isMobile ? "12px" : "14px",
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      borderRadius: isMobile ? "6px" : "8px",
      minHeight: isMobile ? "40px" : "50px",
      padding: isMobile ? "8px 10px" : "12px 14px",
      marginTop: isMobile ? "10px" : "0",
    },
    bodyStyle: {
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      fontSize: isMobile ? "12px" : "14px",
      textAlign: "right",
      direction: "rtl",
    },
  };

  switch(type) {
    case 'success':
      toast.success(message, options);
      break;
    case 'error':
      toast.error(message, options);
      break;
    case 'info':
      toast.info(message, options);
      break;
    case 'warning':
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};

const PropertiesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();

  // States
  const [activeTab, setActiveTab] = useState('lands');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hideFilterBar, setHideFilterBar] = useState(false);
  const [favorites, setFavorites] = useState({ properties: [], auctions: [] });

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

  // Fetch Properties with React Query
  const { 
    data: propertiesData, 
    isLoading: propertiesLoading, 
    error: propertiesError 
  } = useQuery({
    queryKey: ['properties', landFilters, currentPage],
    queryFn: () => propertiesApi.getProperties(landFilters, currentPage),
    enabled: activeTab === 'lands',
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (data.status && data.data) {
        return {
          properties: data.data.data || [],
          totalPages: data.data.pagination?.last_page || 1,
        };
      }
      return { properties: [], totalPages: 1 };
    },
  });

  // Fetch Auctions with React Query
  const { 
    data: auctionsData, 
    isLoading: auctionsLoading, 
    error: auctionsError 
  } = useQuery({
    queryKey: ['auctions', auctionFilters, currentPage],
    queryFn: () => auctionsApi.getAuctions(auctionFilters, currentPage),
    enabled: activeTab === 'auctions',
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (data.success && data.data) {
        return {
          auctions: data.data.data || [],
          totalPages: data.data.last_page || 1,
        };
      }
      return { auctions: [], totalPages: 1 };
    },
  });

  // Combined loading state
  const isLoading = activeTab === 'lands' ? propertiesLoading : auctionsLoading;
  const error = activeTab === 'lands' ? propertiesError : auctionsError;
  
  // Get current items and total pages
  const currentItems = activeTab === 'lands' 
    ? propertiesData?.properties || [] 
    : auctionsData?.auctions || [];
  
  const totalPages = activeTab === 'lands'
    ? propertiesData?.totalPages || 1
    : auctionsData?.totalPages || 1;

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHideFilterBar(scrollTop > lastScrollTop.current && scrollTop > 100);
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.searchFromHome && location.state?.searchQuery) {
      const searchQuery = location.state.searchQuery;
      const updateFilter = activeTab === 'lands' ? setLandFilters : setAuctionFilters;
      updateFilter(prev => ({ ...prev, search: searchQuery }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state, activeTab]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Reset page when tab or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, landFilters, auctionFilters]);

  // Helper Functions
  const getCurrentFilters = () => activeTab === 'lands' ? landFilters : auctionFilters;
  const getCurrentFilterHandler = () => activeTab === 'lands' ? handleLandFilterChange : handleAuctionFilterChange;
  const getFilterOptions = () => activeTab === 'lands' ? { regions, landTypes, purposes } : { auctionStatuses };

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
    const authorizedTypes = ['مالك أرض', 'وكيل عقارات', 'وسيط عقاري', 'شركة مزادات'];
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
      case 'وسيط عقاري':
        return 'إنشاء أرض';  
      case 'شركة مزادات':
        return 'إنشاء مزاد';
      default:
        return 'إنشاء الآن';
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
      showToast('error', 'عذراً، هذه الخدمة متاحة فقط لأصحاب الأراضي ووكلاء العقارات وشركات المزادات', 5000);
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
      showToast('error', 'عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة', 5000);
      return;
    }

    switch(userType) {
      case 'مالك أرض':
      case 'وكيل عقارات':
      case 'وسيط عقاري':  
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
      setFavorites({
        properties: savedPropertyFavorites ? JSON.parse(savedPropertyFavorites) : [],
        auctions: savedAuctionFavorites ? JSON.parse(savedAuctionFavorites) : []
      });
    } catch (error) {
      console.error("فشل في جلب المفضلات:", error);
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
    if (activeTab === 'lands') {
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
    setCurrentPage(1);
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    setCurrentPage(1);
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
        const currentFavorites = favorites[type] || [];
        let newFavorites;

        if (action === 'added') {
          newFavorites = [...currentFavorites, id];
          showToast('success', 'تمت الإضافة إلى المفضلة بنجاح');
        } else {
          newFavorites = currentFavorites.filter(favId => favId !== id);
          showToast('info', 'تمت الإزالة من المفضلة');
        }

        setFavorites(prev => ({ ...prev, [type]: newFavorites }));
        localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error('خطأ في تحديث المفضلة:', error);
      handleLocalFavorite(type, id);
    }
  };

  const handleLocalFavorite = (type, id) => {
    const storageKey = type === 'properties' ? 'propertyFavorites' : 'auctionFavorites';
    const currentFavorites = favorites[type] || [];
    const isFavorite = currentFavorites.includes(id);
    
    const newFavorites = isFavorite 
      ? currentFavorites.filter(favId => favId !== id)
      : [...currentFavorites, id];

    setFavorites(prev => ({ ...prev, [type]: newFavorites }));
    localStorage.setItem(storageKey, JSON.stringify(newFavorites));
    
    if (isFavorite) {
      showToast('info', 'تمت الإزالة من المفضلة');
    } else {
      showToast('success', 'تمت الإضافة إلى المفضلة بنجاح');
    }
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
          .then(() => {
            showToast('success', 'تم نسخ الرابط للمشاركة!');
          })
          .catch(err => {
            console.error('فشل نسخ النص: ', err);
            showToast('error', 'فشل نسخ الرابط', 5000);
          });
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
        .then(() => {
          showToast('success', 'تم نسخ الرابط للمشاركة!');
        })
        .catch(err => {
          console.error('فشل نسخ النص: ', err);
          showToast('error', 'فشل نسخ الرابط', 5000);
        });
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
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Render Functions
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 flex-wrap mt-8 mb-6">
        <button 
          onClick={prevPage} 
          disabled={currentPage === 1} 
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-600 transition-all hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.FaArrowRight className="text-sm" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          if (pageNum === 1 || pageNum === totalPages || 
              [currentPage - 1, currentPage, currentPage + 1].includes(pageNum)) {
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-all text-sm
                  ${currentPage === pageNum 
                    ? 'bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200' 
                    : 'border border-gray-200 bg-white text-gray-700 hover:bg-blue-50'}`}
              >
                {pageNum}
              </button>
            );
          } else if ([currentPage - 2, currentPage + 2].includes(pageNum)) {
            return <span key={pageNum} className="text-gray-400 flex items-center">...</span>;
          }
          return null;
        })}

        <button 
          onClick={nextPage} 
          disabled={currentPage === totalPages} 
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-200 bg-white text-gray-600 transition-all hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.FaArrowLeft className="text-sm" />
        </button>
      </div>
    );
  };

  const renderPropertyCard = (property) => (
    <div 
      key={property.id} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-100 cursor-pointer flex flex-col h-full"
      onClick={() => openDetails(property, 'land')}
    >
      <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden bg-gray-100">
        {propertiesUtils.getPropertyImageUrl(property) ? (
          <img 
            src={propertiesUtils.getPropertyImageUrl(property)} 
            alt={property.title || "صورة العقار"} 
            loading="lazy" 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 text-blue-400">
            <Icons.FaHome className="text-5xl" />
          </div>
        )}
        <div className={`absolute top-3 right-3 py-1 px-3 rounded-full text-xs font-bold shadow-md z-10
          ${property.status === 'معروض' ? 'bg-green-500 text-white' :
            property.status === 'مباع' ? 'bg-red-500 text-white' :
            property.status === 'محجوز' ? 'bg-amber-500 text-white' :
            'bg-gray-500 text-white'
          }`}
        >
          {property.status}
        </div>
        <button
          className={`absolute top-3 left-3 bg-white bg-opacity-95 rounded-full w-9 h-9 flex justify-center items-center transition-all hover:scale-110 shadow-md z-10
            ${favorites.properties?.includes(property.id) ? 'text-red-500' : 'text-gray-400'}`}
          onClick={(e) => toggleFavorite('properties', property.id, e)}
          aria-label="إضافة إلى المفضلة"
        >
          <Icons.FaHeart />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-grow">
        <h3 className="text-lg font-bold text-blue-500 line-clamp-2 leading-tight">{property.title}</h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 bg-opacity-50 p-2 rounded-md flex-wrap">
          <Icons.FaMapMarkerAlt className="text-amber-500 min-w-4" />
          <span>{property.region} - {property.city}</span>
          {property.geo_location_text && <span className="text-xs text-gray-500 opacity-85 block w-full mr-6">({property.geo_location_text})</span>}
        </div>

        <div className="flex justify-between py-2 border-t border-b border-dashed border-gray-100">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-500">
            <Icons.FaRulerCombined className="text-amber-500" />
            <span dir="ltr">{propertiesUtils.formatPrice(property.total_area)} م²</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-500">
            <Icons.FaMoneyBillWave className="text-amber-500" />
            <span dir="ltr">
              {property.purpose === 'بيع'
                ? `${propertiesUtils.formatPrice(property.price_per_sqm)} ر.س/م²`
                : `${propertiesUtils.formatPrice(property.estimated_investment_value)} ر.س`}
            </span>
          </div>
        </div>

        {property.purpose === 'بيع' && property.price_per_sqm && property.total_area && (
          <div className="font-bold text-amber-600 text-center bg-amber-50 p-2 rounded-md border border-dashed border-amber-200">
            السعر الإجمالي: {propertiesUtils.formatPrice(propertiesUtils.calculateTotalPrice(property))} ر.س
          </div>
        )}

        <div className="flex gap-2 flex-wrap mt-1.5">
          <span className={`text-xs font-bold py-1 px-2.5 rounded-full 
            ${property.land_type === 'سكني' ? 'bg-blue-50 text-blue-600' :
              property.land_type === 'تجاري' ? 'bg-amber-50 text-amber-600' :
              property.land_type === 'صناعي' ? 'bg-orange-50 text-orange-600' :
              property.land_type === 'زراعي' ? 'bg-green-50 text-green-600' :
              'bg-gray-50 text-gray-600'
            }`}
          >
            {property.land_type}
          </span>
          <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-white border border-blue-500 text-blue-600">
            {property.purpose}
          </span>
        </div>

        <div className="flex gap-2.5 mt-auto pt-3">
          <button className="flex-1 py-2.5 px-4 border border-blue-500 bg-white text-blue-500 font-bold text-sm rounded-md transition-all hover:bg-blue-50">
            تفاصيل
          </button>
          <button 
            className="flex-1 py-2.5 px-4 border border-gray-200 bg-white text-gray-700 font-bold text-sm rounded-md transition-all hover:bg-gray-50 flex items-center justify-center gap-1.5"
            onClick={(e) => shareItem(property, 'properties', e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="text-xs" /> مشاركة
          </button>
        </div>
      </div>
    </div>
  );

  const renderAuctionCard = (auction) => (
    <div 
      key={auction.id} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-100 cursor-pointer flex flex-col h-full"
      onClick={() => openDetails(auction, 'auction')}
    >
      <div className="relative h-44 sm:h-48 md:h-52 overflow-hidden bg-gray-100">
        {auctionsUtils.getAuctionImageUrl(auction) ? (
          <img 
            src={auctionsUtils.getAuctionImageUrl(auction)} 
            alt={auctionsUtils.cleanText(auction.title) || "صورة المزاد"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-200 text-blue-400">
            <Icons.FaImage className="text-5xl" />
          </div>
        )}
        <div className={`absolute top-3 right-3 py-1 px-3 rounded-full text-xs font-bold shadow-md z-10
          ${auction.status === 'مفتوح' ? 'bg-green-500 text-white' :
            auction.status === 'مغلق' ? 'bg-gray-500 text-white' :
            auction.status === 'معلق' ? 'bg-amber-500 text-white' :
            'bg-gray-500 text-white'
          }`}
        >
          {auction.status}
        </div>
        <button
          className={`absolute top-3 left-3 bg-white bg-opacity-95 rounded-full w-9 h-9 flex justify-center items-center transition-all hover:scale-110 shadow-md z-10
            ${favorites.auctions?.includes(auction.id) ? 'text-red-500' : 'text-gray-400'}`}
          onClick={(e) => toggleFavorite('auctions', auction.id, e)}
          aria-label="إضافة إلى المفضلة"
        >
          <Icons.FaHeart />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-grow">
        <h3 className="text-lg font-bold text-blue-500 line-clamp-2 leading-tight">
          {auctionsUtils.cleanText(auction.title)}
        </h3>
        
        {auction.company && (
          <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 bg-amber-50 p-2 rounded-md">
            <Icons.FaBuilding className="text-amber-500" />
            <span>{auction.company.auction_name}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 bg-opacity-50 p-2 rounded-md">
          <Icons.FaMapMarkerAlt className="text-amber-500" />
          <span>{auctionsUtils.cleanText(auction.address)}</span>
        </div>

        <div className="flex justify-between py-2 border-t border-b border-dashed border-gray-100 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 bg-gray-50 bg-opacity-50 py-1 px-2 rounded-md">
            <Icons.FaCalendarDay className="text-amber-500 text-xs" />
            <span>{auctionsUtils.formatDate(auction.auction_date)}</span>
          </div>
          <div className="flex items-center gap-1.5 text-sm font-semibold text-blue-500 bg-gray-50 bg-opacity-50 py-1 px-2 rounded-md">
            <Icons.FaClock className="text-amber-500 text-xs" />
            <span>{auctionsUtils.formatTime(auction.start_time)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed bg-gray-50 bg-opacity-30 p-2 rounded-md">
          {auctionsUtils.cleanText(auction.description)}
        </p>

        <div className="flex gap-2.5 mt-auto pt-3">
          <button className="flex-1 py-2.5 px-4 border border-blue-500 bg-white text-blue-500 font-bold text-sm rounded-md transition-all hover:bg-blue-50">
            تفاصيل
          </button>
          <button 
            className="flex-1 py-2.5 px-4 border border-gray-200 bg-white text-gray-700 font-bold text-sm rounded-md transition-all hover:bg-gray-50 flex items-center justify-center gap-1.5"
            onClick={(e) => shareItem(auction, 'auctions', e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="text-xs" /> مشاركة
          </button>
        </div>
      </div>
    </div>
  );

  const renderFloatingCreateButton = () => (
    <button 
      className="fixed bottom-5 left-5 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center z-20 transition-all hover:bg-blue-600 hover:scale-105 group"
      onClick={handleCreateNew} 
      aria-label={getCreateButtonText()}
    >
      <Icons.FaPlus className="text-lg" />
      <span className="hidden group-hover:inline whitespace-nowrap overflow-hidden absolute left-14 bg-blue-600 py-2 px-3 rounded-md text-sm font-bold shadow-md">
        {getCreateButtonText()}
      </span>
    </button>
  );

  const renderContent = () => {
    if (isLoading) {
      return <PropertyListSkeleton count={6} type={activeTab} />;
    }

    if (error) {
      return (
        <div className="py-20 px-4 text-center bg-white rounded-xl shadow-sm border border-gray-200 my-5">
          <p className="text-red-500 mb-5">حدث خطأ: {error.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="py-2.5 px-6 bg-white text-blue-500 border border-blue-500 font-bold rounded-md transition-all hover:bg-blue-50"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    if (currentItems.length === 0) {
      return (
        <div className="py-16 px-4 text-center bg-white rounded-xl shadow-sm border border-dashed border-gray-200 my-5">
          <div className="text-blue-100 mb-5">
            {activeTab === 'lands' ? <Icons.FaHome size={36} /> : <Icons.FaGavel size={36} />}
          </div>
          <p className="text-gray-500 mb-5">لم يتم العثور على أي {activeTab === 'lands' ? 'أراضٍ' : 'مزادات'} تطابق معايير البحث</p>
          <button 
            onClick={resetFilters} 
            className="py-2.5 px-6 bg-white text-blue-500 border border-blue-500 font-bold rounded-md transition-all hover:bg-blue-50"
          >
            إعادة تعيين الفلتر
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {activeTab === 'lands' 
          ? currentItems.map(renderPropertyCard) 
          : currentItems.map(renderAuctionCard)
        }
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-6 relative pt-16 md:pt-20" dir="rtl">
      {/* تم إزالة Toaster حيث أن ToastContainer موجود في App.js */}

      {/* Search and Filter Bar */}
      <div className={`bg-white p-3.5 sm:p-4 rounded-xl shadow-sm sticky z-30 my-4 sm:my-5 transition-all duration-300 
        ${hideFilterBar ? '-translate-y-full' : 'translate-y-0'}`} 
        style={{ top: '1rem' }}
        ref={filterBarRef}
      >
        <div className="flex gap-2 w-full items-stretch mb-3">
          <div className="relative flex-grow">
            <Icons.FaSearch className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder={activeTab === 'lands' ? "البحث عن أراضي..." : "البحث عن مزادات..."}
              name="search"
              value={getCurrentFilters().search}
              onChange={getCurrentFilterHandler()}
              className="w-full py-3 px-10 rounded-md border border-gray-200 bg-gray-50 text-gray-700 text-sm transition-all focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
            />
          </div>
          
          <button
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-500 text-white rounded-md font-semibold text-sm transition-all hover:bg-blue-600 min-w-[46px]"
            onClick={handleCreateNew}
            title={getCreateButtonText()}
          >
            <Icons.FaPlus className="text-sm" />
            <span className="hidden sm:inline">{getCreateButtonText()}</span>
          </button>

          <button
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 border border-blue-500 text-blue-500 rounded-md font-semibold text-sm transition-all hover:bg-blue-50 min-w-[46px]"
            onClick={() => window.innerWidth < 768 ? 
              setShowMobileFilters(true) : 
              setShowFilters(!showFilters)
            }
            aria-label="فلترة"
          >
            {showFilters ? <MdClose /> : <Icons.FaFilter />}
            <span className="hidden sm:inline">{showFilters ? 'إغلاق' : 'فلترة'}</span>
          </button>
        </div>

        <div className="flex gap-2.5 w-full">
          <button
            className={`flex-1 py-3 px-1.5 rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 transition-all
              ${activeTab === 'lands' 
                ? 'bg-white text-blue-500 border border-blue-100 shadow-sm' 
                : 'bg-gray-50 text-gray-700 hover:bg-amber-50'}`}
            onClick={() => setActiveTab('lands')}
          >
            <Icons.FaHome className="text-sm" /> الأراضي
          </button>
          <button
            className={`flex-1 py-3 px-1.5 rounded-md font-semibold text-sm flex items-center justify-center gap-1.5 transition-all
              ${activeTab === 'auctions' 
                ? 'bg-white text-blue-500 border border-blue-100 shadow-sm' 
                : 'bg-gray-50 text-gray-700 hover:bg-amber-50'}`}
            onClick={() => setActiveTab('auctions')}
          >
            <Icons.FaGavel className="text-sm" /> المزادات
          </button>
        </div>
      </div>

      {/* Desktop Filters */}
      {showFilters && window.innerWidth >= 768 && (
        <div className="bg-white rounded-xl shadow-sm mb-5 border border-gray-200 overflow-hidden">
          <FiltersComponent
            activeTab={activeTab}
            filters={getCurrentFilters()}
            onFilterChange={getCurrentFilterHandler()}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
            {...getFilterOptions()}
          />
        </div>
      )}

      {/* Mobile Filter Sidebar */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-[2px] z-40 transition-opacity duration-300
          ${showMobileFilters ? 'opacity-100 visible' : 'opacity-0 invisible'}`} 
        onClick={() => setShowMobileFilters(false)}
      ></div>
      
      <div 
        className={`fixed top-0 bottom-0 right-0 w-[90%] max-w-md bg-white z-50 overflow-y-auto transition-all duration-300 shadow-xl flex flex-col rounded-l-2xl
          ${showMobileFilters ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-l from-blue-600 to-blue-500 text-white">
          <h3 className="text-lg font-bold">🔍 فلاتر البحث</h3>
          <button 
            className="p-1.5 rounded-md hover:bg-blue-600/50"
            onClick={() => setShowMobileFilters(false)}
            aria-label="إغلاق"
          >
            <Icons.FaTimes className="text-xl" />
          </button>
        </div>
        <FiltersComponent
          activeTab={activeTab}
          filters={getCurrentFilters()}
          onFilterChange={getCurrentFilterHandler()}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
          {...getFilterOptions()}
        />
      </div>

      {/* Main Content */}
      <div className="py-2">
        {renderContent()}
        {renderPagination()}
      </div>

      {/* Floating Create Button - للهواتف فقط */}
      {window.innerWidth < 768 && renderFloatingCreateButton()}
    </div>
  );
};

export default PropertiesPage;