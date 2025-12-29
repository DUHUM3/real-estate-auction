import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  Plus,
  MapPin,
  Calendar,
  Building,
  Target,
  Ruler,
  Eye,
  Share2,
  RefreshCw,
  Home,
  X,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Skeleton Components
const RequestListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="flex gap-4 p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const RequestCardSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse p-5"
        >
          <div className="space-y-3">
            <div className="h-6 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="grid grid-cols-2 gap-2">
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
              <div className="h-20 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

function LandRequestsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);
  const searchTimeoutRef = useRef(null);

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hideFilterBar, setHideFilterBar] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    links: {
      first: null,
      last: null,
      prev: null,
      next: null,
    }
  });

  const [filters, setFilters] = useState({
    keyword: "",
    region: "",
    city: "",
    purpose: "",
    type: "",
    area_min: "",
    area_max: "",
    per_page: 12,
  });

  // Constants
  const regions = [
    "منطقة الرياض",
    "منطقة مكة المكرمة",
    "منطقة المدينة المنورة",
    "منطقة القصيم",
    "المنطقة الشرقية",
    "منطقة عسير",
    "منطقة تبوك",
    "منطقة حائل",
    "منطقة الحدود الشمالية",
    "منطقة جازان",
    "منطقة نجران",
    "منطقة الباحة",
    "منطقة الجوف",
  ];

  const cities = {
    "منطقة الرياض": ["الرياض", "الخرج", "الدرعية", "المزاحمية", "القويعية"],
    "منطقة مكة المكرمة": ["مكة المكرمة", "جدة", "الطائف", "القنفذة", "رابغ"],
    "منطقة المدينة المنورة": ["المدينة المنورة", "ينبع", "العلا", "المهد"],
  };

  const purposeOptions = [
    { value: "", label: "جميع الأغراض" },
    { value: "sale", label: "شراء" },
    { value: "investment", label: "استثمار" },
  ];

  const typeOptions = [
    { value: "", label: "جميع الأنواع" },
    { value: "agricultural", label: "زراعي" },
    { value: "commercial", label: "تجاري" },
    { value: "residential", label: "سكني" },
  ];

  // Helper Functions
  const getStatusLabel = (status) => {
    const statusLabels = {
      open: "مفتوح",
      completed: "مكتمل",
    };
    return statusLabels[status] || status;
  };

  const getPurposeLabel = (purpose) => {
    const purposeLabels = {
      sale: "شراء",
      investment: "استثمار",
      بيع: "شراء",
      استثمار: "استثمار",
    };
    return purposeLabels[purpose] || purpose;
  };

  const getTypeLabel = (type) => {
    const typeLabels = {
      residential: "سكني",
      commercial: "تجاري",
      agricultural: "زراعي",
    };
    return typeLabels[type] || type;
  };

  const getStatusBadgeClass = (status) => {
    const statusClasses = {
      open: "bg-green-100 text-green-700 border border-green-200",
      completed: "bg-blue-100 text-blue-700 border border-blue-200",
    };
    return statusClasses[status] || "bg-gray-100 text-gray-700 border border-gray-200";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-SA").format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  const blueGradients = {
    primary: "bg-gradient-to-r from-[#53a1dd] to-[#3a8ed0]",
    hover: "bg-gradient-to-r from-[#3a8ed0] to-[#2a7ec0]",
    light: "bg-gradient-to-r from-[#e8f3ff] to-[#d4e8ff]",
    button: "bg-gradient-to-r from-[#53a1dd] via-[#4a96d4] to-[#3a8ed0]",
    buttonHover: "bg-gradient-to-r from-[#3a8ed0] via-[#3284c8] to-[#2a7ec0]",
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (location.state?.page) {
      setCurrentPage(location.state.page);
      setFilters(location.state.filters || filters);
    }
  }, [location.state]);

  const fetchRequests = useCallback(
    async (page = 1, currentFilters = filters) => {
      setIsLoading(true);
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          per_page: currentFilters.per_page.toString(),
        });

        if (currentFilters.keyword && currentFilters.keyword.trim() !== "") {
          queryParams.append("keyword", currentFilters.keyword.trim());
        }

        if (currentFilters.region && currentFilters.region.trim() !== "") {
          queryParams.append("region", currentFilters.region.trim());
        }

        if (currentFilters.city && currentFilters.city.trim() !== "") {
          queryParams.append("city", currentFilters.city.trim());
        }

        if (currentFilters.purpose && currentFilters.purpose !== "") {
          queryParams.append("purpose", currentFilters.purpose);
        }

        if (currentFilters.type && currentFilters.type !== "") {
          queryParams.append("type", currentFilters.type);
        }

        if (currentFilters.area_min && currentFilters.area_min !== "") {
          queryParams.append("area_min", currentFilters.area_min);
        }

        if (currentFilters.area_max && currentFilters.area_max !== "") {
          queryParams.append("area_max", currentFilters.area_max);
        }

        try {
          const response = await fetch(
            `https://core-api-x41.shaheenplus.sa/api/land-requests?${queryParams}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();

          if (data.data && Array.isArray(data.data)) {
            setRequests(data.data);
            setPagination({
              current_page: data.pagination?.current_page || page,
              last_page: data.pagination?.last_page || 1,
              per_page: data.pagination?.per_page || currentFilters.per_page,
              total: data.pagination?.total || data.data.length,
              links: data.pagination?.links || {
                first: null,
                last: null,
                prev: null,
                next: null,
              }
            });
          } else {
            setRequests([]);
            setPagination({
              current_page: 1,
              last_page: 1,
              per_page: currentFilters.per_page,
              total: 0,
              links: {
                first: null,
                last: null,
                prev: null,
                next: null,
              }
            });
          }
        } catch (error) {
          console.error("Error fetching requests:", error);
          setRequests([]);
          setPagination({
            current_page: 1,
            last_page: 1,
            per_page: currentFilters.per_page,
            total: 0,
            links: {
              first: null,
              last: null,
              prev: null,
              next: null,
            }
          });
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // تطبيق الفلاتر فوراً عند التغيير
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      fetchRequests(1, filters);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [filters.keyword, filters.region, filters.city, filters.purpose, filters.type, filters.area_min, filters.area_max]);

  useEffect(() => {
    fetchRequests(currentPage, filters);
  }, [currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setHideFilterBar(scrollTop > lastScrollTop.current && scrollTop > 100);
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleCreateRequest = () => {
    navigate("/create-request");
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: value,
        ...(name === "region" && { city: "" }),
      };
      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      keyword: value,
    }));
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setCurrentPage(1);
      fetchRequests(1, filters);
    }
  };

  const resetFilters = () => {
    const resetFiltersObj = {
      keyword: "",
      region: "",
      city: "",
      purpose: "",
      type: "",
      area_min: "",
      area_max: "",
      per_page: 12,
    };

    setFilters(resetFiltersObj);
    setCurrentPage(1);
    setShowMobileFilters(false);
    setShowFilters(false);
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    setShowFilters(false);
    setCurrentPage(1);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    fetchRequests(1, filters);
  };

  const shareRequest = async (request, e) => {
    e?.stopPropagation();

    try {
      const shareText = `${request.title} - ${request.region} - ${request.city}`;

      if (navigator.share) {
        await navigator.share({
          title: request.title,
          text: shareText,
          url: `${window.location.origin}/requests/${request.id}`,
        });
      } else {
        await navigator.clipboard.writeText(
          shareText + " " + `${window.location.origin}/requests/${request.id}`
        );
        alert("تم نسخ الرابط للمشاركة!");
      }
    } catch (error) {
      console.error("خطأ في المشاركة:", error);
    }
  };

  const openDetails = (requestId) => {
    navigate(`/requests/${requestId}`, {
      state: { page: currentPage, filters },
    });
  };

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const nextPage = () => {
    if (currentPage < pagination.last_page && pagination.links.next) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevPage = () => {
    if (currentPage > 1 && pagination.links.prev) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const renderPagination = () => {
    if (pagination.last_page <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 flex-wrap mt-8 mb-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1 || !pagination.links.prev}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-[#53a1dd] transition-all hover:bg-blue-50 hover:border-[#53a1dd] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowRight size={18} />
        </button>

        {Array.from({ length: pagination.last_page }, (_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === pagination.last_page ||
            [currentPage - 1, currentPage, currentPage + 1].includes(pageNum)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-sm font-semibold
                  ${
                    currentPage === pageNum
                      ? `${blueGradients.primary} text-white border-[#53a1dd] shadow-md`
                      : `border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-[#53a1dd] hover:text-[#53a1dd]`
                  }`}
              >
                {pageNum}
              </button>
            );
          } else if ([currentPage - 2, currentPage + 2].includes(pageNum)) {
            return (
              <span key={pageNum} className="text-gray-400 px-2">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          onClick={nextPage}
          disabled={currentPage === pagination.last_page || !pagination.links.next}
          className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-[#53a1dd] transition-all hover:bg-blue-50 hover:border-[#53a1dd] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={18} />
        </button>
      </div>
    );
  };

  // تصميم البطاقة الأفقية للشاشات الصغيرة (ListView)
  const renderMobileRequestCard = (request) => (
    <div
      key={request.id}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#53a1dd] cursor-pointer"
      onClick={() => openDetails(request.id)}
    >
      <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
        {/* أيقونة الطلب */}
        <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-blue-200">
          <Home className="text-[#53a1dd] w-8 h-8 sm:w-12 sm:h-12" />
        </div>

        {/* المحتوى */}
        <div className="flex-1 min-w-0 flex flex-col justify-between">
          {/* القسم العلوي */}
          <div className="space-y-1 sm:space-y-2">
            {/* العنوان والحالة */}
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 flex-1">
                {request.title}
              </h3>
              <span
                className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadgeClass(
                  request.status
                )}`}
              >
                {getStatusLabel(request.status)}
              </span>
            </div>

            {/* الموقع */}
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#53a1dd] flex-shrink-0" />
              <span className="text-xs sm:text-sm font-medium line-clamp-1">
                {request.region} - {request.city}
              </span>
            </div>

            {/* المواصفات */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                <Ruler className="w-3 h-3 text-[#53a1dd]" />
                <span className="font-semibold text-gray-700">{formatPrice(request.area)} م²</span>
              </div>
              <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100">
                <Target className="w-3 h-3 text-green-600" />
                <span className="font-semibold text-gray-700">{getPurposeLabel(request.purpose)}</span>
              </div>
              <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded border border-purple-100">
                <Building className="w-3 h-3 text-purple-600" />
                <span className="font-semibold text-gray-700">{getTypeLabel(request.type)}</span>
              </div>
            </div>

            {/* التاريخ - للشاشات الكبيرة فقط */}
            <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(request.created_at)}</span>
            </div>
          </div>

          {/* الأزرار */}
          <div className="flex gap-2 mt-2 sm:mt-3">
            <button
              className={`flex-1 py-2 px-3 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-1 ${blueGradients.button} hover:${blueGradients.buttonHover}`}
              onClick={(e) => {
                e.stopPropagation();
                openDetails(request.id);
              }}
            >
              <Eye size={14} />
              <span>التفاصيل</span>
            </button>
            <button
              className="py-2 px-3 border border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm rounded-lg transition-all hover:bg-gray-50 flex items-center justify-center gap-1"
              onClick={(e) => shareRequest(request, e)}
            >
              <Share2 size={14} />
              <span className="hidden sm:inline">مشاركة</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // تصميم البطاقة العمودية للشاشات الكبيرة (Card View) - بدون صورة
  const renderDesktopRequestCard = (request) => (
    <div
      key={request.id}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#53a1dd] cursor-pointer group"
      onClick={() => openDetails(request.id)}
    >
      {/* الهيدر مع العنوان والحالة */}
      <div className="p-5 border-b border-gray-100 bg-gradient-to-l from-blue-50/50 to-white">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#53a1dd] transition-colors">
              {request.title}
            </h3>
          </div>
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${getStatusBadgeClass(
              request.status
            )}`}
          >
            {getStatusLabel(request.status)}
          </span>
        </div>

        {/* الموقع */}
        <div className="flex items-center gap-2 text-gray-600 mb-2">
          <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
            <MapPin className="w-3.5 h-3.5 text-[#53a1dd]" />
          </div>
          <span className="text-sm font-medium">
            {request.region} - {request.city}
          </span>
        </div>
      </div>

      {/* محتوى البطاقة */}
      <div className="p-5">
        {/* المواصفات */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-gradient-to-br from-blue-50 to-blue-25 border border-blue-100 rounded-xl p-3 group/item hover:bg-blue-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-sm">
                <Ruler className="w-4 h-4 text-[#53a1dd]" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">المساحة</div>
                <div className="text-base font-bold text-gray-800">{formatPrice(request.area)} م²</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-25 border border-green-100 rounded-xl p-3 group/item hover:bg-green-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg border border-green-200 shadow-sm">
                <Target className="w-4 h-4 text-green-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">الغرض</div>
                <div className="text-base font-bold text-gray-800">{getPurposeLabel(request.purpose)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-25 border border-purple-100 rounded-xl p-3 group/item hover:bg-purple-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg border border-purple-200 shadow-sm">
                <Building className="w-4 h-4 text-purple-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">النوع</div>
                <div className="text-base font-bold text-gray-800">{getTypeLabel(request.type)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-amber-25 border border-amber-100 rounded-xl p-3 group/item hover:bg-amber-50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
                <Calendar className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-xs text-gray-500 font-medium">التاريخ</div>
                <div className="text-base font-bold text-gray-800">{formatDate(request.created_at)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* الأزرار */}
        <div className="flex gap-3">
          <button
            className={`flex-1 py-3 text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${blueGradients.button} hover:${blueGradients.buttonHover} shadow-sm hover:shadow`}
            onClick={(e) => {
              e.stopPropagation();
              openDetails(request.id);
            }}
          >
            <Eye size={16} />
            عرض التفاصيل
          </button>
          
          <button
            className="py-3 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg transition-all hover:bg-gray-50 hover:border-[#53a1dd] hover:text-[#53a1dd] flex items-center justify-center gap-2 shadow-sm hover:shadow"
            onClick={(e) => shareRequest(request, e)}
          >
            <Share2 size={16} />
            <span className="text-sm font-medium">مشاركة</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return isMobile ? (
        <RequestListSkeleton count={6} />
      ) : (
        <RequestCardSkeleton count={6} />
      );
    }

    if (requests.length === 0) {
      return (
        <div className="py-16 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-200 my-8">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
                <Home className="text-[#53a1dd]/60" size={40} />
              </div>
              <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-red-50 border-4 border-white flex items-center justify-center">
                <X className="text-red-400" size={20} />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-3">
            لا توجد طلبات أراضي
          </h3>
          <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
            لم يتم العثور على أي طلبات أراضي تطابق معايير البحث. جرب تعديل
            الفلاتر أو البحث بعبارة أخرى.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetFilters}
              className={`py-3 px-6 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${blueGradients.button} hover:${blueGradients.buttonHover}`}
            >
              <RefreshCw size={16} />
              إعادة تعيين الفلاتر
            </button>

            <button
              onClick={handleCreateRequest}
              className="py-3 px-6 bg-white text-[#53a1dd] border border-[#53a1dd] font-bold text-sm rounded-xl transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
            >
              <Plus size={16} />
              كن أول من ينشئ طلب
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="font-bold">
            عرض {requests.length} من أصل {pagination.total} طلب
          </span>
          {(filters.keyword ||
            filters.region ||
            filters.city ||
            filters.purpose ||
            filters.type ||
            filters.area_min ||
            filters.area_max) && (
            <span className="mx-2 text-[#53a1dd]">• مع الفلاتر المطبقة</span>
          )}
        </div>

        {/* عرض متجاوب بناءً على حجم الشاشة */}
        {isMobile ? (
          <div className="space-y-3">
            {requests.map(renderMobileRequestCard)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {requests.map(renderDesktopRequestCard)}
          </div>
        )}

        {renderPagination()}
      </>
    );
  };

  const renderFilters = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المنطقة
          </label>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
          >
            <option value="">جميع المناطق</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المدينة
          </label>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
            disabled={!filters.region}
          >
            <option value="">جميع المدن</option>
            {filters.region &&
              cities[filters.region]?.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            الغرض
          </label>
          <select
            name="purpose"
            value={filters.purpose}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
          >
            {purposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            النوع
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المساحة الأدنى (م²)
          </label>
          <input
            type="number"
            name="area_min"
            value={filters.area_min}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
            placeholder="0"
            min="0"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المساحة القصوى (م²)
          </label>
          <input
            type="number"
            name="area_max"
            value={filters.area_max}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
            placeholder="أي مساحة"
            min="0"
          />
        </div>

        <div className="md:col-span-2 flex items-end gap-3">
          <button
            onClick={resetFilters}
            className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 font-bold text-sm rounded-lg transition-all hover:bg-gray-50"
          >
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="max-w-7xl mx-auto px-4 pb-8 relative pt-20"
      dir="rtl"
    >
      {/* Search and Filter Bar */}
      <div
        className={`bg-white p-4 rounded-xl shadow-sm sticky z-30 my-6 transition-all duration-300 border border-gray-200
        ${hideFilterBar ? "-translate-y-full" : "translate-y-0"}`}
        style={{ top: "1rem" }}
        ref={filterBarRef}
      >
        <div className="flex gap-2 w-full items-stretch mb-3">
          <div className="relative flex-grow">
            <Search
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="البحث في العنوان، الوصف، المنطقة، المدينة..."
              name="keyword"
              value={filters.keyword}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="w-full py-3 px-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100"
            />
            {isLoading && filters.keyword && (
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#53a1dd] border-t-transparent"></div>
              </div>
            )}
          </div>

          <button
            className={`flex items-center justify-center gap-2 py-3 px-4 sm:px-6 text-white rounded-lg font-bold text-sm transition-all ${blueGradients.button} hover:${blueGradients.buttonHover}`}
            onClick={handleCreateRequest}
          >
            <Plus size={18} />
            <span className="hidden sm:inline">إنشاء طلب</span>
          </button>

          <button
            className="flex items-center justify-center gap-2 py-3 px-4 sm:px-6 border border-[#53a1dd] text-[#53a1dd] rounded-lg font-bold text-sm transition-all hover:bg-blue-50"
            onClick={() =>
              window.innerWidth < 768
                ? setShowMobileFilters(true)
                : setShowFilters(!showFilters)
            }
          >
            {showFilters ? <X size={18} /> : <Filter size={18} />}
            <span className="hidden sm:inline">
              {showFilters ? "إغلاق" : "فلترة"}
            </span>
          </button>
        </div>

        {(filters.keyword ||
          filters.region ||
          filters.city ||
          filters.purpose ||
          filters.type ||
          filters.area_min ||
          filters.area_max) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
            {filters.keyword && (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                البحث: {filters.keyword}
              </span>
            )}
            {filters.region && (
              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                المنطقة: {filters.region}
              </span>
            )}
            {filters.city && (
              <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                المدينة: {filters.city}
              </span>
            )}
            {filters.purpose && (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                الغرض: {getPurposeLabel(filters.purpose)}
              </span>
            )}
            {filters.type && (
              <span className="text-xs bg-pink-100 text-pink-800 px-2 py-1 rounded-full">
                النوع: {getTypeLabel(filters.type)}
              </span>
            )}
            {(filters.area_min || filters.area_max) && (
              <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                المساحة: {filters.area_min || "0"} - {filters.area_max || "∞"} م²
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-full transition-all"
            >
              مسح الكل
            </button>
          </div>
        )}
      </div>

      {showFilters && window.innerWidth >= 768 && renderFilters()}

      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300
          ${showMobileFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setShowMobileFilters(false)}
      ></div>

      <div
        className={`fixed top-0 bottom-0 right-0 w-full max-w-md bg-white z-50 overflow-y-auto transition-all duration-300 shadow-2xl
          ${showMobileFilters ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-l from-[#53a1dd] to-blue-500 text-white">
          <h3 className="text-lg font-bold">فلاتر البحث</h3>
          <button
            className="p-2 rounded-xl hover:bg-blue-600/50 transition-colors"
            onClick={() => setShowMobileFilters(false)}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{renderFilters()}</div>
      </div>

      <div className="py-2">
        {renderContent()}
      </div>
    </div>
  );
}

export default LandRequestsList;