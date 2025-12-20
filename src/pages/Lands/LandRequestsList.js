// src/pages/LandRequestsList.js
import React, { useState, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MdClose } from 'react-icons/md';
import Icons from '../../icons/index';
import { propertiesApi, propertiesUtils } from '../../api/propertiesApi';
import { ModalContext } from '../../App';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Skeleton Component
const RequestListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 animate-pulse">
          <div className="p-4 flex flex-col gap-4">
            {/* Header Skeleton */}
            <div className="flex justify-between items-start">
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-5 bg-gray-200 rounded w-10"></div>
            </div>
            
            {/* Location Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-4 bg-gray-200 rounded w-4"></div>
              <div className="h-4 bg-gray-200 rounded w-32"></div>
            </div>
            
            {/* Specs Skeleton */}
            <div className="flex justify-between py-3 border-t border-b border-gray-100">
              <div className="flex flex-col items-center gap-1">
                <div className="h-3 bg-gray-200 rounded w-6"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-3 bg-gray-200 rounded w-6"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="h-3 bg-gray-200 rounded w-6"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </div>
            
            {/* Tags Skeleton */}
            <div className="flex gap-2">
              <div className="h-6 bg-gray-200 rounded w-16"></div>
              <div className="h-6 bg-gray-200 rounded w-16"></div>
            </div>
            
            {/* Description Skeleton */}
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-3/4"></div>
            </div>
            
            {/* Date Skeleton */}
            <div className="flex items-center gap-2">
              <div className="h-3 bg-gray-200 rounded w-3"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>
            
            {/* Actions Skeleton */}
            <div className="flex gap-2.5 mt-4">
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
              <div className="h-10 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

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

function LandRequestsList() {
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);
  const { openLogin } = useContext(ModalContext);
  const navigate = useNavigate();

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hideFilterBar, setHideFilterBar] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    region: '',
    city: '',
    purpose: '',
    type: '',
    area_min: '',
    area_max: '',
  });

  // Constants
  const regions = [
    'منطقة الرياض', 'منطقة مكة المكرمة', 'منطقة المدينة المنورة', 
    'منطقة القصيم', 'المنطقة الشرقية', 'منطقة عسير', 'منطقة تبوك',
    'منطقة حائل', 'منطقة الحدود الشمالية', 'منطقة جازان', 
    'منطقة نجران', 'منطقة الباحة', 'منطقة الجوف'
  ];
  
  const cities = {
    'منطقة الرياض': ['الرياض', 'الخرج', 'الدرعية', 'المزاحمية', 'القويعية'],
    'منطقة مكة المكرمة': ['مكة المكرمة', 'جدة', 'الطائف', 'القنفذة', 'رابغ'],
    'منطقة المدينة المنورة': ['المدينة المنورة', 'ينبع', 'العلا', 'المهد'],
  };

  // Fetch Requests with React Query
  const { 
    data: requestsData, 
    isLoading, 
    error,
    refetch 
  } = useQuery({
    queryKey: ['landRequests', filters, currentPage],
    queryFn: () => {
      const token = localStorage.getItem('token');
      return propertiesApi.getLandRequests(filters, currentPage, token);
    },
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5, // 5 minutes
    select: (data) => {
      if (data && data.data) {
        return {
          requests: data.data || [],
          pagination: data.pagination || data.meta || {
            current_page: 1,
            last_page: 1,
            per_page: 12,
            total: data.data?.length || 0
          },
        };
      }
      return { requests: [], pagination: null };
    },
  });

  // Get current items and total pages
  const currentItems = requestsData?.requests || [];
  const pagination = requestsData?.pagination;
  const totalPages = pagination?.last_page || 1;
  const totalItems = pagination?.total || 0;
  const perPage = pagination?.per_page || 12;

  // Effects
  React.useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHideFilterBar(scrollTop > lastScrollTop.current && scrollTop > 100);
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  React.useEffect(() => {
    loadFavorites();
  }, []);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Helper Functions
  const loadFavorites = () => {
    const savedFavorites = localStorage.getItem('landRequestFavorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  };

  const saveFavorites = (newFavorites) => {
    localStorage.setItem('landRequestFavorites', JSON.stringify(newFavorites));
  };

  const getStatusLabel = (status) => propertiesUtils.getStatusLabel(status);
  const getPurposeLabel = (purpose) => propertiesUtils.getPurposeLabel(purpose);
  const getTypeLabel = (type) => propertiesUtils.getTypeLabel(type);

  const getStatusBadgeClass = (status) => {
    return status === 'open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  };

  // دالة التحقق من التسجيل وإنشاء طلب جديد
  const handleCreateRequest = () => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      // إذا لم يكن المستخدم مسجل الدخول، افتح نافذة تسجيل الدخول
      openLogin(() => {
        // هذه الدالة ستنفذ بعد تسجيل الدخول بنجاح
        navigate('/create-request');
      });
      return;
    }
    
    // إذا كان مسجل الدخول، انتقل مباشرة لصفحة إنشاء الطلب
    navigate('/create-request');
  };

  // Filter Handlers
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

  // Favorite Handlers
  const toggleFavorite = (requestId, e) => {
    e?.stopPropagation();
    const newFavorites = favorites.includes(requestId) 
      ? favorites.filter(id => id !== requestId)
      : [...favorites, requestId];
    
    setFavorites(newFavorites);
    saveFavorites(newFavorites);
    
    if (newFavorites.includes(requestId)) {
      showToast('success', 'تمت الإضافة إلى المفضلة');
    } else {
      showToast('info', 'تمت الإزالة من المفضلة');
    }
  };

  // Share Handlers
  const shareRequest = async (request, e) => {
    e?.stopPropagation();
    
    try {
      const shareText = `طلب أرض ${propertiesUtils.getPurposeLabel(request.purpose)} - ${request.region} - ${request.city}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `طلب أرض رقم ${request.id}`,
          text: shareText,
          url: `${window.location.origin}/requests/${request.id}`,
        });
      } else {
        // Fallback إلى نسخ النص
        await navigator.clipboard.writeText(shareText + " " + `${window.location.origin}/requests/${request.id}`);
        showToast('success', 'تم نسخ الرابط للمشاركة!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      // Fallback في حالة فشل المشاركة
      const shareText = `طلب أرض ${propertiesUtils.getPurposeLabel(request.purpose)} - ${request.region} - ${request.city}`;
      await navigator.clipboard.writeText(shareText + " " + `${window.location.origin}/requests/${request.id}`);
      showToast('success', 'تم نسخ الرابط للمشاركة!');
    }
  };

  // Navigation Handlers
  const openDetails = (requestId) => {
    navigate(`/requests/${requestId}`);
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

  const renderRequestCard = (request) => (
    <div 
      key={request.id} 
      className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 transition-all hover:-translate-y-1 hover:shadow-md hover:border-blue-100 cursor-pointer flex flex-col h-full"
      onClick={() => openDetails(request.id)}
    >
      <div className="p-4 flex flex-col gap-3 flex-grow">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-bold text-blue-500">
            طلب أرض #{request.id}
          </h3>
          <span className={`text-xs font-bold py-1 px-2.5 rounded-full ${getStatusBadgeClass(request.status)}`}>
            {getStatusLabel(request.status)}
          </span>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 bg-opacity-50 p-2 rounded-md">
          <Icons.FaMapMarkerAlt className="text-amber-500 min-w-4" />
          <span>{request.region} - {request.city}</span>
        </div>

        <div className="flex justify-between py-2 border-t border-b border-dashed border-gray-100">
          <div className="flex flex-col items-center gap-1 text-center">
            <Icons.FaRulerCombined className="text-amber-500 text-sm" />
            <span className="text-sm font-semibold text-blue-500">
              {propertiesUtils.formatPrice(request.area)} م²
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Icons.FaHandshake className="text-amber-500 text-sm" />
            <span className="text-sm font-semibold text-blue-500">
              {getPurposeLabel(request.purpose)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 text-center">
            <Icons.FaBuilding className="text-amber-500 text-sm" />
            <span className="text-sm font-semibold text-blue-500">
              {getTypeLabel(request.type)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mt-1">
          <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
            {getTypeLabel(request.type)}
          </span>
          <span className="text-xs font-bold py-1 px-2.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
            {getPurposeLabel(request.purpose)}
          </span>
        </div>

        <div className="text-sm text-gray-600 line-clamp-3 leading-relaxed bg-gray-50 bg-opacity-30 p-2 rounded-md mt-2">
          {request.description || 'لا يوجد وصف متوفر لهذا الطلب'}
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
          <Icons.FaCalendarAlt className="text-gray-400 text-xs" />
          <span>أنشئ في: {propertiesUtils.formatDate(request.created_at)}</span>
        </div>

        <div className="flex gap-2.5 mt-auto pt-3">
          <button 
            className="flex-1 py-2.5 px-4 border border-blue-500 bg-white text-blue-500 font-bold text-sm rounded-md transition-all hover:bg-blue-50 flex items-center justify-center gap-1.5"
            onClick={(e) => {
              e.stopPropagation();
              openDetails(request.id);
            }}
          >
            <Icons.FaEye className="text-xs" /> تفاصيل
          </button>
          <button 
            className="flex-1 py-2.5 px-4 border border-gray-200 bg-white text-gray-700 font-bold text-sm rounded-md transition-all hover:bg-gray-50 flex items-center justify-center gap-1.5"
            onClick={(e) => shareRequest(request, e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="text-xs" /> مشاركة
          </button>
        </div>
      </div>
    </div>
  );

 // في دالة renderContent عند عدم وجود نتائج:
const renderContent = () => {
  if (isLoading) {
    return <RequestListSkeleton count={6} />;
  }

  if (error) {
    return (
      <div className="py-20 px-4 text-center bg-white rounded-xl shadow-sm border border-gray-200 my-5">
        {/* أيقونة الخطأ في المنتصف */}
        <div className="flex justify-center mb-5">
          <Icons.FaExclamationCircle className="text-red-500 text-5xl" />
        </div>
        <p className="text-red-500 mb-5">حدث خطأ أثناء تحميل البيانات</p>
        <button 
          onClick={() => refetch()} 
          className="py-2.5 px-6 bg-white text-blue-500 border border-blue-500 font-bold rounded-md transition-all hover:bg-blue-50 flex items-center justify-center gap-2 mx-auto"
        >
          <Icons.FaRedo className="text-sm" />
          إعادة المحاولة
        </button>
      </div>
    );
  }

  if (currentItems.length === 0) {
    return (
      <div className="py-24 px-4 text-center bg-white rounded-xl shadow-sm border border-dashed border-gray-200 my-5">
        {/* الأيقونة في المنتصف مع التصميم الجديد */}
        <div className="flex justify-center items-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
              <Icons.FaHome className="text-blue-400 text-5xl opacity-70" />
            </div>
            {/* أيقونة صغيرة تدل على عدم التواجد */}
            <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-red-50 border-4 border-white flex items-center justify-center">
              <Icons.FaTimes className="text-red-400 text-lg" />
            </div>
          </div>
        </div>
        
        <h3 className="text-xl font-bold text-gray-700 mb-3">
          لا توجد طلبات أراضي
        </h3>
        <p className="text-gray-500 mb-5 max-w-md mx-auto">
          لم يتم العثور على أي طلبات أراضي تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بعبارة أخرى.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button 
            onClick={resetFilters} 
            className="py-3 px-8 bg-blue-500 text-white font-bold rounded-md transition-all hover:bg-blue-600 flex items-center justify-center gap-2"
          >
            <Icons.FaRedo className="text-sm" />
            إعادة تعيين الفلاتر
          </button>
          
          <button 
            onClick={handleCreateRequest} 
            className="py-3 px-8 bg-white text-blue-500 border border-blue-500 font-bold rounded-md transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
          >
            <Icons.FaPlus className="text-sm" />
            كن أول من ينشئ طلب
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-md">
        <span>عرض {currentItems.length} من أصل {totalItems} طلب</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
        {currentItems.map(renderRequestCard)}
      </div>
    </>
  );
};

  // Filters Component (Simplified for this file)
  const renderFilters = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-5">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">بحث</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
            placeholder="ابحث في الطلبات..."
          />
        </div> */}

        {/* Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المنطقة</label>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
          >
            <option value="">جميع المناطق</option>
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المدينة</label>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
            disabled={!filters.region}
          >
            <option value="">جميع المدن</option>
            {filters.region && cities[filters.region]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
        </div>

        {/* Purpose */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">الغرض</label>
          <select
            name="purpose"
            value={filters.purpose}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
          >
            <option value="">جميع الأغراض</option>
            <option value="بيع">بيع</option>
            <option value="استثمار">استثمار</option>
          </select>
        </div>

        {/* Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">النوع</label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
          >
            <option value="">جميع الأنواع</option>
            <option value="سكني">سكني</option>
            <option value="تجاري">تجاري</option>
            <option value="صناعي">صناعي</option>
            <option value="زراعي">زراعي</option>
          </select>
        </div>

        {/* Area Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المساحة الأدنى (م²)</label>
          <input
            type="number"
            name="area_min"
            value={filters.area_min}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Area Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">المساحة القصوى (م²)</label>
          <input
            type="number"
            name="area_max"
            value={filters.area_max}
            onChange={handleFilterChange}
            className="w-full py-2 px-3 border border-gray-200 rounded-md focus:outline-none focus:border-blue-400 text-sm"
            placeholder="أي مساحة"
            min="0"
          />
        </div>

        {/* Actions */}
        <div className="flex items-end gap-2">
          <button
            onClick={applyFilters}
            className="flex-1 py-2.5 bg-blue-500 text-white font-bold text-sm rounded-md transition-all hover:bg-blue-600"
          >
            تطبيق
          </button>
          <button
            onClick={resetFilters}
            className="flex-1 py-2.5 border border-gray-300 bg-white text-gray-700 font-bold text-sm rounded-md transition-all hover:bg-gray-50"
          >
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 pb-6 relative pt-16 md:pt-20" dir="rtl">
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
              placeholder="البحث في طلبات الأراضي..."
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
              className="w-full py-3 px-10 rounded-md border border-gray-200 bg-gray-50 text-gray-700 text-sm transition-all focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:bg-white"
            />
          </div>
          
          <button
            className="flex items-center justify-center gap-1.5 py-2.5 px-4 bg-blue-500 text-white rounded-md font-semibold text-sm transition-all hover:bg-blue-600 min-w-[46px]"
            onClick={handleCreateRequest}
            title="إنشاء طلب جديد"
          >
            <Icons.FaPlus className="text-sm" />
            <span className="hidden sm:inline">إنشاء طلب</span>
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
      </div>

      {/* Desktop Filters */}
      {showFilters && window.innerWidth >= 768 && renderFilters()}

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
        <div className="p-4">
          {renderFilters()}
        </div>
      </div>

      {/* Main Content */}
      <div className="py-2">
        {renderContent()}
        {renderPagination()}
      </div>
    </div>
  );
}

export default LandRequestsList;