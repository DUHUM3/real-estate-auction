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
  AlertCircle,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// Skeleton Component
const RequestListSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100 animate-pulse"
        >
          <div className="p-3 sm:p-6 flex flex-col gap-2 sm:gap-4">
            <div className="flex justify-between items-start">
              <div className="h-5 sm:h-7 bg-gray-200 rounded-lg w-24 sm:w-40"></div>
              <div className="h-5 sm:h-6 bg-gray-200 rounded-full w-12 sm:w-16"></div>
            </div>

            <div className="h-4 sm:h-5 bg-gray-200 rounded w-3/4"></div>

            <div className="flex items-center gap-2">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3 sm:w-4"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-20 sm:w-32"></div>
            </div>

            <div className="flex justify-between py-2 sm:py-4 border-t border-b border-gray-50">
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-4 sm:w-6"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-16"></div>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-4 sm:w-6"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-16"></div>
              </div>
              <div className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-4 sm:w-6"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-10 sm:w-16"></div>
              </div>
            </div>

            <div className="space-y-2 hidden sm:block">
              <div className="h-3 bg-gray-200 rounded w-full"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>

            <div className="flex items-center gap-2 hidden sm:flex">
              <div className="h-3 bg-gray-200 rounded w-3"></div>
              <div className="h-3 bg-gray-200 rounded w-24"></div>
            </div>

            <div className="flex gap-2 sm:gap-3 mt-2 sm:mt-4">
              <div className="h-9 sm:h-11 bg-gray-200 rounded-lg sm:rounded-xl flex-1"></div>
              <div className="h-9 sm:h-11 bg-gray-200 rounded-lg sm:rounded-xl flex-1"></div>
            </div>
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
  const [favorites, setFavorites] = useState([]);
  const [requests, setRequests] = useState([]);
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

  // Updated filters to match backend API
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

  // Purpose options as per backend enum (English values)
  const purposeOptions = [
    { value: "", label: "جميع الأغراض" },
    { value: "sale", label: "شراء" },
    { value: "investment", label: "استثمار" },
  ];

  // Type options for allRequests as per backend (English values)
  const typeOptions = [
    { value: "", label: "جميع الأنواع" },
    { value: "agricultural", label: "زراعي" },
    { value: "commercial", label: "تجاري" },
    { value: "residential", label: "سكني" },
    // إضافة القيم العربية التي يدعمها الباكند
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
      open: "bg-gradient-to-r from-green-50 to-green-100 text-green-700 border border-green-200",
      completed:
        "bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 border border-blue-200",
    };
    return (
      statusClasses[status] ||
      "bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 border border-gray-200"
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ar-SA").format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ar-SA");
  };

  // Color gradients based on #53a1dd
  const blueGradients = {
    primary: "bg-gradient-to-r from-[#53a1dd] to-[#3a8ed0]",
    hover: "bg-gradient-to-r from-[#3a8ed0] to-[#2a7ec0]",
    light: "bg-gradient-to-r from-[#e8f3ff] to-[#d4e8ff]",
    button: "bg-gradient-to-r from-[#53a1dd] via-[#4a96d4] to-[#3a8ed0]",
    buttonHover: "bg-gradient-to-r from-[#3a8ed0] via-[#3284c8] to-[#2a7ec0]",
  };

  // إصلاح مشكلة الباجينيشن - إعادة تعيين الصفحة عند العودة
  useEffect(() => {
    if (location.state?.page) {
      setCurrentPage(location.state.page);
      setFilters(location.state.filters || filters);
    }
  }, [location.state]);

  // Fetch data from API with proper filters
  const fetchRequests = useCallback(
    async (page = 1, currentFilters = filters) => {
      setIsLoading(true);
      try {
        // Build query parameters according to backend API
        const queryParams = new URLSearchParams({
          page: page.toString(),
          per_page: currentFilters.per_page.toString(),
        });

        // Add filters only if they have values (matching backend field names)
        // لا تستخدم trim() على الأرقام
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

        console.log("Fetching with filters:", currentFilters);
        console.log("Query params:", queryParams.toString());

        try {
          const response = await fetch(
            `https://core-api-x41.shaheenplus.sa/api/land-requests?${queryParams}`
          );

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log("API Response:", data);

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

          // Fallback: set empty data
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

  // Debounced search function
  const debouncedFetchRequests = useCallback(
    (page = 1, currentFilters = filters) => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchTimeoutRef.current = setTimeout(
        () => {
          fetchRequests(page, currentFilters);
        },
        currentFilters.keyword ? 300 : 0
      ); // Debounce search, immediate for other filters
    },
    [fetchRequests]
  );
  // Effect to fetch data when page changes
  useEffect(() => {
  fetchRequests(currentPage, filters);
}, [currentPage]);

  // Effect for scroll handling
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

  // Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: value,
        // Reset city when region changes
        ...(name === "region" && { city: "" }),
      };

      console.log("Filter changed:", name, "=", value);
      return newFilters;
    });
  };

  // Search handler - updated for keyword
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      keyword: value,
    }));
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      // Clear any pending debounced calls and fetch immediately
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
    // Clear any pending debounced calls and fetch immediately
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    fetchRequests(1, filters);
  };

  const toggleFavorite = (requestId, e) => {
    e?.stopPropagation();
    const newFavorites = favorites.includes(requestId)
      ? favorites.filter((id) => id !== requestId)
      : [...favorites, requestId];

    setFavorites(newFavorites);
    console.log("المفضلة محدثة:", newFavorites);
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

  // Pagination handlers - استخدام الروابط من الباكند
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
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

  // Render Functions
  const renderPagination = () => {
    if (pagination.last_page <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 sm:gap-3 flex-wrap mt-6 sm:mt-10 mb-6 sm:mb-8">
        <button
          onClick={prevPage}
          disabled={currentPage === 1 || !pagination.links.prev}
          className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-[#53a1dd] transition-all hover:${blueGradients.light} hover:border-[#53a1dd] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
        >
          <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px]" />
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
                className={`w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl flex items-center justify-center transition-all text-xs sm:text-sm font-semibold shadow-sm hover:shadow-md border
                  ${
                    currentPage === pageNum
                      ? `${blueGradients.primary} text-white border-[#53a1dd] shadow-md shadow-blue-200/50 hover:${blueGradients.hover}`
                      : `border-gray-200 bg-white text-gray-700 hover:${blueGradients.light} hover:border-[#53a1dd] hover:text-[#53a1dd]`
                  }`}
              >
                {pageNum}
              </button>
            );
          } else if ([currentPage - 2, currentPage + 2].includes(pageNum)) {
            return (
              <span
                key={pageNum}
                className="text-gray-400 flex items-center px-1 sm:px-2"
              >
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          onClick={nextPage}
          disabled={currentPage === pagination.last_page || !pagination.links.next}
          className={`flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl border border-gray-200 bg-white text-[#53a1dd] transition-all hover:${blueGradients.light} hover:border-[#53a1dd] disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md`}
        >
          <ArrowLeft size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>
      </div>
    );
  };

  const renderRequestCard = (request) => (
    <div
      key={request.id}
      className="bg-white rounded-xl sm:rounded-2xl shadow-sm overflow-hidden border border-gray-100 transition-all duration-300 hover:-translate-y-1 sm:hover:-translate-y-2 hover:shadow-lg sm:hover:shadow-xl hover:shadow-blue-100/50 sm:hover:border-[#53a1dd]/30 cursor-pointer flex flex-col h-full group"
      onClick={() => openDetails(request.id)}
    >
      <div className="p-3 sm:p-6 flex flex-col gap-2 sm:gap-4 flex-grow">
        {/* Header with Title and Status */}
        <div className="flex justify-between items-start gap-2">
          <h3
            style={{
              fontFamily: "'Tajawal', sans-serif",
              fontWeight: 700,
              color: "#111827",
            }}
            className="text-sm sm:text-xl line-clamp-2 leading-snug sm:leading-relaxed"
          >
            {request.title}
          </h3>

          <span
            className={`text-[10px] sm:text-xs font-bold py-1 px-2 sm:py-2 sm:px-4 rounded-full whitespace-nowrap shadow-sm ${getStatusBadgeClass(
              request.status
            )}`}
          >
            {getStatusLabel(request.status)}
          </span>
        </div>

        {/* Location - Hidden on small screens */}
        <div className="hidden sm:flex items-center gap-2.5 text-sm text-gray-700 bg-gradient-to-r from-gray-50 to-blue-50/30 p-3.5 rounded-xl border border-gray-100">
          <MapPin className="text-[#53a1dd] min-w-4" size={17} />
          <span className="font-semibold">
            {request.region} - {request.city}
          </span>
        </div>

        {/* Location for mobile - Compact */}
        <div className="flex sm:hidden items-center gap-1.5 text-xs text-gray-600">
          <MapPin className="text-[#53a1dd] min-w-3" size={12} />
          <span className="font-semibold line-clamp-1">{request.city}</span>
        </div>

        {/* Specifications */}
        <div className="flex justify-between py-2 sm:py-5 border-t border-b border-gray-100/80 bg-gradient-to-b from-transparent to-gray-50/30">
          <div className="flex flex-col items-center gap-1 sm:gap-2.5 text-center">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
              <Ruler className="text-[#53a1dd]" size={14} />
            </div>
            <span className="text-[10px] sm:text-sm font-bold text-gray-800">
              {formatPrice(request.area)} م²
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2.5 text-center">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
              <Target className="text-emerald-600" size={14} />
            </div>
            <span className="text-[10px] sm:text-sm font-bold text-gray-800">
              {getPurposeLabel(request.purpose)}
            </span>
          </div>
          <div className="flex flex-col items-center gap-1 sm:gap-2.5 text-center">
            <div className="w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 flex items-center justify-center">
              <Building className="text-purple-600" size={14} />
            </div>
            <span className="text-[10px] sm:text-sm font-bold text-gray-800">
              {getTypeLabel(request.type)}
            </span>
          </div>
        </div>

        {/* Tags - Hidden on mobile */}
        <div className="hidden sm:flex gap-2 flex-wrap">
          <span className="text-xs font-bold py-2 px-4 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-[#53a1dd] border border-blue-200/50 shadow-sm">
            {getTypeLabel(request.type)}
          </span>
          <span className="text-xs font-bold py-2 px-4 rounded-full bg-gradient-to-r from-emerald-50 to-emerald-100 text-emerald-600 border border-emerald-200/50 shadow-sm">
            {getPurposeLabel(request.purpose)}
          </span>
        </div>

        {/* Description - Hidden on mobile */}
        <div className="hidden sm:block text-sm text-gray-700 line-clamp-3 leading-relaxed bg-gradient-to-br from-gray-50 to-blue-50/20 p-4 rounded-xl border border-gray-100">
          {request.description || "لا يوجد وصف متوفر لهذا الطلب"}
        </div>

        {/* Date - Hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-500 bg-gray-50/50 p-2.5 rounded-lg">
          <Calendar size={13} className="text-gray-400" />
          <span className="font-medium">
            أنشئ في: {formatDate(request.created_at)}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-1.5 sm:gap-2.5 mt-auto pt-2 sm:pt-3">
          <button
            className={`flex-1 py-2 sm:py-2.5 px-2 sm:px-4 border-2 border-[#53a1dd] text-white font-bold text-[10px] sm:text-sm rounded-lg sm:rounded-xl transition-all hover:shadow-lg hover:shadow-blue-200/50 flex items-center justify-center gap-1 sm:gap-2 ${blueGradients.button} hover:${blueGradients.buttonHover}`}
            onClick={(e) => {
              e.stopPropagation();
              openDetails(request.id);
            }}
          >
            <Eye size={12} className="sm:w-4 sm:h-4" />
            <span>تفاصيل</span>
          </button>
          <button
            className="flex-1 py-2 sm:py-2.5 px-2 sm:px-4 border-2 border-gray-200 bg-white text-gray-700 font-bold text-[10px] sm:text-sm rounded-lg sm:rounded-xl transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:border-gray-300 hover:shadow-md flex items-center justify-center gap-1 sm:gap-2"
            onClick={(e) => shareRequest(request, e)}
            aria-label="مشاركة"
          >
            <Share2 size={12} className="sm:w-4 sm:h-4" />
            <span>مشاركة</span>
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (isLoading) {
      return <RequestListSkeleton count={6} />;
    }

    if (requests.length === 0) {
      return (
        <div className="py-16 sm:py-32 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100 my-8">
          <div className="flex justify-center items-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
                <Home className="text-[#53a1dd]/60" size={32} />
              </div>
              <div className="absolute -top-1 -left-1 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-red-50 border-4 border-white flex items-center justify-center">
                <X className="text-red-400" size={16} />
              </div>
            </div>
          </div>

          <h3 className="text-lg sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            لا توجد طلبات أراضي
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto leading-relaxed">
            لم يتم العثور على أي طلبات أراضي تطابق معايير البحث. جرب تعديل
            الفلاتر أو البحث بعبارة أخرى.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <button
              onClick={resetFilters}
              className={`py-2.5 sm:py-3 px-6 sm:px-8 text-white font-bold text-sm rounded-xl transition-all hover:shadow-md flex items-center justify-center gap-2 shadow-sm ${blueGradients.button} hover:${blueGradients.buttonHover}`}
            >
              <RefreshCw size={16} className="sm:w-[18px] sm:h-[18px]" />
              إعادة تعيين الفلاتر
            </button>

            <button
              onClick={handleCreateRequest}
              className="py-2.5 sm:py-3 px-6 sm:px-8 bg-white text-[#53a1dd] border border-[#53a1dd] font-bold text-sm rounded-xl transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
            >
              <Plus size={16} className="sm:w-[18px] sm:h-[18px]" />
              كن أول من ينشئ طلب
            </button>
          </div>
        </div>
      );
    }

    return (
      <>
        <div className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 bg-gradient-to-r from-gray-50 to-blue-50/30 p-3 sm:p-4 rounded-xl border border-gray-100">
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

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {requests.map(renderRequestCard)}
        </div>
        
        {/* إضافة أزرار التنقل هنا */}
        {renderPagination()}
      </>
    );
  };

  const renderFilters = () => (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Region */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المنطقة
          </label>
          <select
            name="region"
            value={filters.region}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-gray-50/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
          >
            <option value="">جميع المناطق</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </div>

        {/* City */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المدينة
          </label>
          <select
            name="city"
            value={filters.city}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-gray-50/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
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

        {/* Purpose - Updated to match backend enum (English values) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            الغرض
          </label>
          <select
            name="purpose"
            value={filters.purpose}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-gray-50/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
          >
            {purposeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Type - Updated for allRequests (English values) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            النوع
          </label>
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-gray-50/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
          >
            {typeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Area Min */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المساحة الأدنى (م²)
          </label>
          <input
            type="number"
            name="area_min"
            value={filters.area_min}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-gray-50/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
            placeholder="0"
            min="0"
          />
        </div>

        {/* Area Max */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            المساحة القصوى (م²)
          </label>
          <input
            type="number"
            name="area_max"
            value={filters.area_max}
            onChange={handleFilterChange}
            className="w-full py-3 px-4 border border-gray-200 rounded-xl focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-gray-50/50 hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
            placeholder="أي مساحة"
            min="0"
          />
        </div>
        {/* Actions */}
        <div className="md:col-span-2 flex items-end gap-3">
          <button
            onClick={applyFilters}
            className={`flex-1 py-3 text-white font-bold text-sm rounded-xl transition-all hover:shadow-md shadow-sm ${blueGradients.button} hover:${blueGradients.buttonHover}`}
          >
            تطبيق الفلاتر
          </button>
          <button
            onClick={resetFilters}
            className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 font-bold text-sm rounded-xl transition-all hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 hover:shadow-md shadow-sm"
          >
            إعادة تعيين
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8 relative pt-16 sm:pt-20"
      dir="rtl"
    >
      {/* Search and Filter Bar */}
      <div
        className={`bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm sticky z-30 my-4 sm:my-6 transition-all duration-300 border border-gray-100
        ${hideFilterBar ? "-translate-y-full" : "translate-y-0"}`}
        style={{ top: "1rem" }}
        ref={filterBarRef}
      >
        <div className="flex gap-2 sm:gap-3 w-full items-stretch mb-3 sm:mb-4">
          <div className="relative flex-grow">
            <Search
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="البحث في العنوان، الوصف، المنطقة، المدينة..."
              name="keyword"
              value={filters.keyword}
              onChange={handleSearchChange}
              onKeyPress={handleSearchKeyPress}
              className="w-full py-2.5 sm:py-4 px-9 sm:px-12 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50/70 text-gray-700 text-xs sm:text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 focus:bg-white hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
            />
            {isLoading && filters.keyword && (
              <div className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#53a1dd] border-t-transparent"></div>
              </div>
            )}
          </div>

          <button
            className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all min-w-fit shadow-sm hover:shadow-md ${blueGradients.button} hover:${blueGradients.buttonHover}`}
            onClick={handleCreateRequest}
            title="إنشاء طلب جديد"
          >
            <Plus size={14} className="sm:w-[18px] sm:h-[18px]" />
            <span className="hidden sm:inline">إنشاء طلب</span>
          </button>

          <button
            className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 border border-[#53a1dd] text-[#53a1dd] rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 min-w-fit shadow-sm hover:shadow-md"
            onClick={() =>
              window.innerWidth < 768
                ? setShowMobileFilters(true)
                : setShowFilters(!showFilters)
            }
            aria-label="فلترة"
          >
            {showFilters ? <X size={14} /> : <Filter size={14} />}
            <span className="hidden sm:inline">
              {showFilters ? "إغلاق" : "فلترة"}
            </span>
          </button>
        </div>

        {/* Active filters indicator */}
        {(filters.keyword ||
          filters.region ||
          filters.city ||
          filters.purpose ||
          filters.type ||
          filters.area_min ||
          filters.area_max) && (
          <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
            {filters.keyword && (
              <span className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-2 py-1 rounded-full">
                البحث: {filters.keyword}
              </span>
            )}
            {filters.region && (
              <span className="text-xs bg-gradient-to-r from-green-50 to-green-100 text-green-800 px-2 py-1 rounded-full">
                المنطقة: {filters.region}
              </span>
            )}
            {filters.city && (
              <span className="text-xs bg-gradient-to-r from-purple-50 to-purple-100 text-purple-800 px-2 py-1 rounded-full">
                المدينة: {filters.city}
              </span>
            )}
            {filters.purpose && (
              <span className="text-xs bg-gradient-to-r from-orange-50 to-orange-100 text-orange-800 px-2 py-1 rounded-full">
                الغرض: {getPurposeLabel(filters.purpose)}
              </span>
            )}
            {filters.type && (
              <span className="text-xs bg-gradient-to-r from-pink-50 to-pink-100 text-pink-800 px-2 py-1 rounded-full">
                النوع: {getTypeLabel(filters.type)}
              </span>
            )}
            {(filters.area_min || filters.area_max) && (
              <span className="text-xs bg-gradient-to-r from-indigo-50 to-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
                المساحة: {filters.area_min || "0"} - {filters.area_max || "∞"}{" "}
                م²
              </span>
            )}
            {filters.per_page && filters.per_page !== 12 && (
              <span className="text-xs bg-gradient-to-r from-teal-50 to-teal-100 text-teal-800 px-2 py-1 rounded-full">
                النتائج: {filters.per_page} لكل صفحة
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-xs text-red-600 hover:text-red-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 px-2 py-1 rounded-full transition-all"
            >
              مسح الكل
            </button>
          </div>
        )}
      </div>

      {/* Desktop Filters */}
      {showFilters && window.innerWidth >= 768 && renderFilters()}

      {/* Mobile Filter Sidebar */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300
          ${showMobileFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setShowMobileFilters(false)}
      ></div>

      <div
        className={`fixed top-11 bottom-0 right-0 w-[90%] max-w-md bg-white z-50 overflow-y-auto transition-all duration-300 shadow-2xl flex flex-col rounded-l-2xl
          ${showMobileFilters ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-l from-[#53a1dd] to-blue-500 text-white">
          <h3 className="text-lg font-bold">🔍 فلاتر البحث</h3>
          <button
            className="p-2 rounded-xl hover:bg-blue-600/50 transition-colors"
            onClick={() => setShowMobileFilters(false)}
            aria-label="إغلاق"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{renderFilters()}</div>
      </div>

      {/* Main Content */}
      <div className="py-2">
        {renderContent()}
      </div>
    </div>
  );
}

export default LandRequestsList;