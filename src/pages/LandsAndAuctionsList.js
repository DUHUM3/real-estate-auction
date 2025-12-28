import React, { useState, useRef, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Icons from "../icons/index";
import { MdClose } from "react-icons/md";
import { propertiesApi, propertiesUtils } from "../api/propertiesApi";
import { auctionsApi, auctionsUtils } from "../api/auctionApi";
import FiltersComponent from "../utils/FiltersComponent";
import { ModalContext } from "../App";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import PropertyListSkeleton from "../Skeleton/PropertyListSkeleton";

// ====== Theme Gradients (Global for this file) ======
const blueGradients = {
  button: "bg-gradient-to-r from-[#53a1dd] to-[#4285c7]",
  buttonHover: "hover:from-[#53a1dd] hover:to-[#4285c7]",
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

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
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
  const [activeTab, setActiveTab] = useState("lands");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hideFilterBar, setHideFilterBar] = useState(false);
  const [favorites, setFavorites] = useState({ properties: [], auctions: [] });

  const [landFilters, setLandFilters] = useState({
    search: "",
    region: "",
    city: "",
    land_type: "",
    purpose: "",
    min_area: "",
    max_area: "",
    min_price: "",
    max_price: "",
    min_investment: "",
    max_investment: "",
  });

  const [auctionFilters, setAuctionFilters] = useState({
    search: "",
    status: "",
    date_from: "",
    date_to: "",
    company: "",
    address: "",
  });

  // Constants
  const regions = [];
  const landTypes = ["سكني", "تجاري", "صناعي", "زراعي"];
  const purposes = ["بيع", "استثمار"];
  const auctionStatuses = ["مفتوح", "مغلق", "معلق"];

  // Fetch Properties with React Query
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useQuery({
    queryKey: ["properties", landFilters, currentPage],
    queryFn: () => propertiesApi.getProperties(landFilters, currentPage),
    enabled: activeTab === "lands",
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
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
    error: auctionsError,
  } = useQuery({
    queryKey: ["auctions", auctionFilters, currentPage],
    queryFn: () => auctionsApi.getAuctions(auctionFilters, currentPage),
    enabled: activeTab === "auctions",
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
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
  const isLoading = activeTab === "lands" ? propertiesLoading : auctionsLoading;
  const error = activeTab === "lands" ? propertiesError : auctionsError;

  // Get current items and total pages
  const currentItems =
    activeTab === "lands"
      ? propertiesData?.properties || []
      : auctionsData?.auctions || [];

  const totalPages =
    activeTab === "lands"
      ? propertiesData?.totalPages || 1
      : auctionsData?.totalPages || 1;

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      setHideFilterBar(scrollTop > lastScrollTop.current && scrollTop > 100);
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.state?.searchFromHome && location.state?.searchQuery) {
      const searchQuery = location.state.searchQuery;
      const updateFilter =
        activeTab === "lands" ? setLandFilters : setAuctionFilters;
      updateFilter((prev) => ({ ...prev, search: searchQuery }));
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
  const getCurrentFilters = () =>
    activeTab === "lands" ? landFilters : auctionFilters;
  const getCurrentFilterHandler = () =>
    activeTab === "lands" ? handleLandFilterChange : handleAuctionFilterChange;
  const getFilterOptions = () =>
    activeTab === "lands"
      ? { regions, landTypes, purposes }
      : { auctionStatuses };

  const getCurrentUserType = () => {
    return currentUser?.user_type || localStorage.getItem("user_type");
  };

  const isUserAuthorized = (userType) => {
    const authorizedTypes = [
      "مالك أرض",
      "وكيل شرعي",
      "وسيط عقاري",
      "شركة مزادات",
    ];
    return authorizedTypes.includes(userType);
  };

  const getCreateButtonText = () => {
    const userType = getCurrentUserType();
    switch (userType) {
      case "مالك أرض":
        return "إنشاء أرض";
      case "وكيل شرعي":
        return "إنشاء أرض";
      case "وسيط عقاري":
        return "إنشاء أرض";
      case "شركة مزادات":
        return "إنشاء مزاد";
      default:
        return "إنشاء الآن";
    }
  };

  const isUserLoggedIn = () => {
    return !!currentUser || !!localStorage.getItem("token");
  };

  const handleCreateNew = () => {
    const userType = getCurrentUserType();

    if (!isUserLoggedIn()) {
      openLogin(() => {
        const newUserType = getCurrentUserType();
        proceedWithCreation(newUserType);
      });
      return;
    }

    if (!isUserAuthorized(userType)) {
      showToast(
        "error",
        "عذراً، هذه الخدمة متاحة فقط لأصحاب الأراضي ووكلاء العقارات وشركات المزادات",
        5000
      );
      return;
    }

    proceedWithCreation(userType);
  };

  const proceedWithCreation = (userType) => {
    if (!isUserAuthorized(userType)) {
      showToast("error", "عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة", 5000);
      return;
    }

    switch (userType) {
      case "مالك أرض":
      case "وكيل شرعي":
      case "وسيط عقاري":
      case "شركة مزادات":
        navigate("/create-ad");
        break;
      default:
        navigate("/");
        break;
    }
  };

  // API Functions
  const fetchFavorites = async () => {
    try {
      const savedPropertyFavorites = localStorage.getItem("propertyFavorites");
      const savedAuctionFavorites = localStorage.getItem("auctionFavorites");
      setFavorites({
        properties: savedPropertyFavorites
          ? JSON.parse(savedPropertyFavorites)
          : [],
        auctions: savedAuctionFavorites
          ? JSON.parse(savedAuctionFavorites)
          : [],
      });
    } catch (error) {
      console.error("فشل في جلب المفضلات:", error);
    }
  };

  // Filter Handlers
  const handleLandFilterChange = (e) => {
    const { name, value } = e.target;
    setLandFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuctionFilterChange = (e) => {
    const { name, value } = e.target;
    setAuctionFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    if (activeTab === "lands") {
      setLandFilters({
        search: "",
        region: "",
        city: "",
        land_type: "",
        purpose: "",
        min_area: "",
        max_area: "",
        min_price: "",
        max_price: "",
        min_investment: "",
        max_investment: "",
      });
    } else {
      setAuctionFilters({
        search: "",
        status: "",
        date_from: "",
        date_to: "",
        company: "",
        address: "",
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

    const token = localStorage.getItem("token");

    if (!token) {
      openLogin(() => {
        window.location.reload();
      });
      return;
    }

    const api = type === "properties" ? propertiesApi : auctionsApi;
    const storageKey =
      type === "properties" ? "propertyFavorites" : "auctionFavorites";

    try {
      const data = await api.toggleFavorite(id, token);

      if (data.success) {
        const action = data.action;
        const currentFavorites = favorites[type] || [];
        let newFavorites;

        if (action === "added") {
          newFavorites = [...currentFavorites, id];
          showToast("success", "تمت الإضافة إلى المفضلة بنجاح");
        } else {
          newFavorites = currentFavorites.filter((favId) => favId !== id);
          showToast("info", "تمت الإزالة من المفضلة");
        }

        setFavorites((prev) => ({ ...prev, [type]: newFavorites }));
        localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error("خطأ في تحديث المفضلة:", error);
      showToast("error", "حدث خطأ في تحديث المفضلة");
    }
  };

  const handleLocalFavorite = (type, id) => {
    const storageKey =
      type === "properties" ? "propertyFavorites" : "auctionFavorites";
    const currentFavorites = favorites[type] || [];
    const isFavorite = currentFavorites.includes(id);

    const newFavorites = isFavorite
      ? currentFavorites.filter((favId) => favId !== id)
      : [...currentFavorites, id];

    setFavorites((prev) => ({ ...prev, [type]: newFavorites }));
    localStorage.setItem(storageKey, JSON.stringify(newFavorites));

    if (isFavorite) {
      showToast("info", "تمت الإزالة من المفضلة");
    } else {
      showToast("success", "تمت الإضافة إلى المفضلة بنجاح");
    }
  };


  // Share Handlers
  const shareItem = async (item, type, e) => {
    e?.stopPropagation();

    try {
      let shareText = "";
      if (type === "properties") {
        shareText = `أرض ${item.land_type} - ${item.region} - ${item.city}`;
      } else {
        shareText = `مزاد: ${auctionsUtils.cleanText(
          item.title
        )} - ${auctionsUtils.cleanText(item.description)}`;
      }

      const shareUrl =
        type === "properties"
          ? `${window.location.origin}/lands/${item.id}/land`
          : `${window.location.origin}/lands/${item.id}/auction`;

      if (navigator.share) {
        await navigator.share({
          title:
            type === "properties"
              ? `أرض رقم ${item.id}`
              : `مزاد رقم ${item.id}`,
          text: shareText,
          url: shareUrl,
        });
      } else {
        navigator.clipboard
          .writeText(shareText + " " + shareUrl)
          .then(() => {
            showToast("success", "تم نسخ الرابط للمشاركة!");
          })
          .catch((err) => {
            console.error("فشل نسخ النص: ", err);
            showToast("error", "فشل نسخ الرابط", 5000);
          });
      }
    } catch (error) {
      console.error("Error sharing:", error);

      let shareText = "";
      if (type === "properties") {
        shareText = `أرض ${item.land_type} - ${item.region} - ${item.city}`;
      } else {
        shareText = `مزاد: ${auctionsUtils.cleanText(
          item.title
        )} - ${auctionsUtils.cleanText(item.description)}`;
      }

      const shareUrl =
        type === "properties"
          ? `${window.location.origin}/lands/${item.id}/land`
          : `${window.location.origin}/lands/${item.id}/auction`;

      navigator.clipboard
        .writeText(shareText + " " + shareUrl)
        .then(() => {
          showToast("success", "تم نسخ الرابط للمشاركة!");
        })
        .catch((err) => {
          console.error("فشل نسخ النص: ", err);
          showToast("error", "فشل نسخ الرابط", 5000);
        });
    }
  };

  // Navigation Handlers
  const openDetails = (item, itemType) => {
    if (itemType === "land") {
      navigate(`/lands/${item.id}/land`);
    } else if (itemType === "auction") {
      navigate(`/lands/${item.id}/auction`);
    }
  };

  // Pagination Handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // Render Functions
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 flex-wrap mt-8 mb-6">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.FaArrowRight className="text-sm" />
        </button>

        {Array.from({ length: totalPages }, (_, i) => {
          const pageNum = i + 1;
          if (
            pageNum === 1 ||
            pageNum === totalPages ||
            [currentPage - 1, currentPage, currentPage + 1].includes(pageNum)
          ) {
            return (
              <button
                key={pageNum}
                onClick={() => paginate(pageNum)}
                className={`w-10 h-10 rounded-md flex items-center justify-center transition-all text-sm font-medium
                  ${
                    currentPage === pageNum
                      ? "bg-[#53a1dd] text-white"
                      : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
              >
                {pageNum}
              </button>
            );
          } else if ([currentPage - 2, currentPage + 2].includes(pageNum)) {
            return (
              <span key={pageNum} className="text-gray-400 flex items-center">
                ...
              </span>
            );
          }
          return null;
        })}

        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Icons.FaArrowLeft className="text-sm" />
        </button>
      </div>
    );
  };

  const renderPropertyCard = (property) => (
    <div
      key={property.id}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col h-full"
      onClick={() => openDetails(property, "land")}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
        {propertiesUtils.getPropertyImageUrl(property) ? (
          <img
            src={propertiesUtils.getPropertyImageUrl(property)}
            alt={property.title || "صورة العقار"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-blue-400">
            <Icons.FaHome className="text-6xl mb-2 opacity-70" />
            <span className="text-sm text-gray-400 font-medium">
              لا توجد صورة
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-md
          ${
            property.status === "مفتوح" || property.status === "متاح"
              ? "bg-green-500 text-white"
              : property.status === "مباع"
              ? "bg-red-500 text-white"
              : property.status === "محجوز"
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {property.status}
        </div>

        {/* Favorite Button */}
        <button
          className={`absolute top-3 left-3 p-2 rounded-full bg-white shadow-md transition-all hover:scale-110 z-10
    ${
      favorites.properties?.includes(property.id)
        ? "text-red-500"
        : "text-black"
    }`}
          onClick={(e) => toggleFavorite("properties", property.id, e)}
          aria-label="إضافة إلى المفضلة"
        >
          <Icons.FaHeart
            className="w-4 h-4"
            fill={
              favorites.properties?.includes(property.id)
                ? "currentColor"
                : "#6b7280"
            }
          />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {property.title}
        </h3>

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Icons.FaMapMarkerAlt className="text-[#53a1dd] w-4 h-4" />
          <span>
            {property.region} - {property.city}
          </span>
          {property.geo_location_text && (
            <span className="text-xs text-gray-500 opacity-85 block w-full mr-6">
              ({property.geo_location_text})
            </span>
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">المساحة:</span>
            <span className="font-semibold text-black" dir="ltr">
              {propertiesUtils.formatPrice(property.total_area)} م²
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              {property.purpose === "بيع" ? "السعر/م²:" : "قيمة الاستثمار:"}
            </span>
            <span
              className="font-semibold text-black inline-flex items-center gap-1"
              dir="ltr"
            >
              {property.purpose === "بيع" ? (
                <>
                  <span>
                    {propertiesUtils.formatPrice(property.price_per_sqm)}
                  </span>
                  <img
                    src="/images/rail.svg"
                    alt="ريال سعودي"
                    className="w-3.5 h-3.5 inline-block"
                    style={{ verticalAlign: "middle" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.insertAdjacentHTML(
                        "afterend",
                        '<span class="text-xs">ر.س</span>'
                      );
                    }}
                  />
                </>
              ) : (
                <>
                  <span>
                    {propertiesUtils.formatPrice(
                      property.estimated_investment_value
                    )}
                  </span>
                  <img
                    src="/images/rail.svg"
                    alt="ريال سعودي"
                    className="w-3.5 h-3.5 inline-block"
                    style={{ verticalAlign: "middle" }}
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.insertAdjacentHTML(
                        "afterend",
                        '<span class="text-xs">ر.س</span>'
                      );
                    }}
                  />
                </>
              )}
            </span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span
            className={`px-2 py-1 text-xs rounded-full font-medium
            ${
              property.land_type === "سكني"
                ? "bg-blue-100 text-blue-800"
                : property.land_type === "تجاري"
                ? "bg-amber-100 text-amber-800"
                : property.land_type === "صناعي"
                ? "bg-orange-100 text-orange-800"
                : property.land_type === "زراعي"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {property.land_type}
          </span>
          <span className="px-2 py-1 text-xs bg-[#53a1dd]/10 text-[#53a1dd] rounded-full font-medium">
            {property.purpose}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 bg-[#53a1dd] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#4285c7] transition-colors">
            عرض التفاصيل
          </button>
          <button
            className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={(e) => shareItem(property, "properties", e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderAuctionCard = (auction) => (
    <div
      key={auction.id}
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col h-full"
      onClick={() => openDetails(auction, "auction")}
    >
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
        {auctionsUtils.getAuctionImageUrl(auction) ? (
          <img
            src={auctionsUtils.getAuctionImageUrl(auction)}
            alt={auctionsUtils.cleanText(auction.title) || "صورة المزاد"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-blue-400">
            <Icons.FaGavel className="text-6xl mb-2 opacity-70" />
            <span className="text-sm text-gray-400 font-medium">
              لا توجد صورة
            </span>
          </div>
        )}

        {/* Status Badge */}
        <div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-md
          ${
            auction.status === "مفتوح"
              ? "bg-green-500 text-white"
              : auction.status === "مغلق"
              ? "bg-gray-500 text-white"
              : auction.status === "معلق"
              ? "bg-yellow-500 text-white"
              : "bg-gray-500 text-white"
          }`}
        >
          {auction.status}
        </div>

        {/* Favorite Button */}
        <button
          className={`absolute top-3 left-3 p-2 rounded-full bg-white shadow-md transition-all hover:scale-110 z-10
            ${
              favorites.auctions?.includes(auction.id)
                ? "text-red-500"
                : "text-gray-400"
            }`}
          onClick={(e) => toggleFavorite("auctions", auction.id, e)}
          aria-label="إضافة إلى المفضلة"
        >
          <Icons.FaHeart
            className="w-4 h-4"
            fill={
              favorites.auctions?.includes(auction.id) ? "currentColor" : "none"
            }
          />
        </button>
      </div>

      <div className="p-4 flex flex-col gap-3 flex-grow">
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {auctionsUtils.cleanText(auction.title)}
        </h3>

        {auction.company && (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-[#53a1dd]/10 p-2 rounded-md">
            <Icons.FaBuilding className="text-[#53a1dd] w-4 h-4" />
            <span>{auction.company.auction_name}</span>
          </div>
        )}

        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Icons.FaMapMarkerAlt className="text-[#53a1dd] w-4 h-4" />
          <span>{auctionsUtils.cleanText(auction.address)}</span>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icons.FaCalendarDay className="text-[#53a1dd] w-4 h-4" />
            <span>{auctionsUtils.formatDate(auction.auction_date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Icons.FaClock className="text-[#53a1dd] w-4 h-4" />
            <span>{auctionsUtils.formatTime(auction.start_time)}</span>
          </div>
        </div>

        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
          {auctionsUtils.cleanText(auction.description)}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 bg-[#53a1dd] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#4285c7] transition-colors">
            عرض التفاصيل
          </button>
          <button
            className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={(e) => shareItem(auction, "auctions", e)}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderFloatingCreateButton = () => (
    <button
      className="fixed bottom-5 left-5 w-14 h-14 rounded-full bg-[#53a1dd] text-white shadow-lg flex items-center justify-center z-20 transition-all hover:bg-[#4285c7] hover:scale-105"
      onClick={handleCreateNew}
      aria-label={getCreateButtonText()}
    >
      <Icons.FaPlus className="text-lg" />
    </button>
  );

  const renderContent = () => {
    if (isLoading) {
      return <PropertyListSkeleton count={6} type={activeTab} />;
    }

    if (error) {
      return (
        <div className="py-20 px-4 text-center bg-white rounded-lg shadow-sm border border-gray-200 my-5">
          <div className="flex justify-center mb-5">
            <Icons.FaExclamationCircle className="text-red-500 text-5xl" />
          </div>
          <p className="text-red-500 mb-5">حدث خطأ: {error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-[#53a1dd] text-white rounded-md hover:bg-[#4285c7] transition-colors font-medium"
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    if (currentItems.length === 0) {
      return (
        <div className="py-24 px-4 text-center bg-white rounded-lg shadow-sm border border-dashed border-gray-200 my-5">
          <div className="flex justify-center items-center mb-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
                {activeTab === "lands" ? (
                  <Icons.FaHome className="text-blue-400 text-5xl opacity-70" />
                ) : (
                  <Icons.FaGavel className="text-blue-400 text-5xl opacity-70" />
                )}
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {activeTab === "lands" ? "لا توجد أراضي" : "لا توجد مزادات"}
          </h3>
          <p className="text-gray-600 mb-5 max-w-md mx-auto">
            {activeTab === "lands"
              ? "لم يتم العثور على أي أراضي تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بعبارة أخرى."
              : "لم يتم العثور على أي مزادات تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بعبارة أخرى."}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={resetFilters}
              className="px-6 py-3 bg-[#53a1dd] text-white font-medium rounded-md hover:bg-[#4285c7] transition-colors flex items-center justify-center gap-2"
            >
              <Icons.FaRedo className="text-sm" />
              إعادة تعيين الفلاتر
            </button>

            <button
              onClick={handleCreateNew}
              className="px-6 py-3 bg-white text-[#53a1dd] border border-[#53a1dd] font-medium rounded-md hover:bg-[#53a1dd]/10 transition-colors flex items-center justify-center gap-2"
            >
              <Icons.FaPlus className="text-sm" />
              {getCreateButtonText()}
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="property-list-container">
        {/* Desktop and Tablet View - Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "lands"
            ? currentItems.map(renderPropertyCard)
            : currentItems.map(renderAuctionCard)}
        </div>

        {/* Mobile View - Horizontal Scroll */}
        <div className="md:hidden">
          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex space-x-4 space-x-reverse min-w-max">
              {activeTab === "lands"
                ? currentItems.map((property) => (
                    <div key={property.id} className="w-80 flex-shrink-0">
                      {renderPropertyCard(property)}
                    </div>
                  ))
                : currentItems.map((auction) => (
                    <div key={auction.id} className="w-80 flex-shrink-0">
                      {renderAuctionCard(auction)}
                    </div>
                  ))}
            </div>
          </div>

          {/* Scroll Indicator for Mobile */}
          <div className="flex justify-center mt-4">
            <div className="flex space-x-2 space-x-reverse">
              {currentItems
                .slice(0, Math.min(5, currentItems.length))
                .map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      index === 0 ? "bg-[#53a1dd]" : "bg-gray-300"
                    }`}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Results Summary
  const renderResultsSummary = () => {
    if (isLoading || error || currentItems.length === 0) return null;

    return (
      <div className="mb-4">
        <p className="text-gray-600">
          عرض {currentItems.length} من أصل{" "}
          {activeTab === "lands"
            ? propertiesData?.properties?.length || 0
            : auctionsData?.auctions?.length || 0}{" "}
          نتيجة
        </p>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-6 pt-[80px]" dir="rtl">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
       {/* Search and Controls */}
<div
  className={`bg-white p-3 sm:p-4 rounded-xl sm:rounded-2xl shadow-sm sticky z-30 my-4 sm:my-6 transition-all duration-300 border border-gray-100
    ${hideFilterBar ? "-translate-y-full" : "translate-y-0"}`}
  style={{ top: "1rem" }}
  ref={filterBarRef}
>
  {/* Mobile Header with Tabs */}
  <div className="sm:hidden flex items-center justify-between mb-3">
    <div className="flex gap-2">
      <button
        onClick={() => setActiveTab("lands")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm hover:shadow-md ${
          activeTab === "lands"
            ? `${blueGradients.button} text-white`
            : "border border-gray-200 text-gray-600 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
        }`}
      >
        الأراضي
      </button>
      <button
        onClick={() => setActiveTab("auctions")}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm hover:shadow-md ${
          activeTab === "auctions"
            ? `${blueGradients.button} text-white`
            : "border border-gray-200 text-gray-600 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
        }`}
      >
        المزادات
      </button>
    </div>
    
    <button
      onClick={() => setShowMobileFilters(true)}
      className="flex items-center justify-center gap-1 py-2 px-3 border border-[#53a1dd] text-[#53a1dd] rounded-lg font-bold text-xs transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 shadow-sm hover:shadow-md"
      aria-label="فلترة"
    >
      <Icons.FaFilter className="w-3 h-3" />
      <span>فلترة</span>
    </button>
  </div>

  {/* Desktop Controls */}
  <div className="hidden sm:flex flex-col gap-4">
    <div className="flex gap-2 sm:gap-3 w-full items-stretch">
      {/* Search input */}
      <div className="relative flex-grow">
        <Icons.FaSearch className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5" />
        <input
          type="text"
          placeholder={
            activeTab === "lands"
              ? "البحث في الأراضي..."
              : "البحث في المزادات..."
          }
          name="search"
          value={getCurrentFilters().search}
          onChange={getCurrentFilterHandler()}
          onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
          className="w-full py-2.5 sm:py-4 px-9 sm:px-12 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50/70 text-gray-700 text-xs sm:text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 focus:bg-white hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
        />
        {getCurrentFilters().search && (
          <button
            onClick={() => {
              getCurrentFilterHandler()({ target: { name: 'search', value: '' } });
              applyFilters();
            }}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <Icons.FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        )}
      </div>

      {/* Create button */}
      <button
        className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all min-w-fit shadow-sm hover:shadow-md ${blueGradients.button} hover:${blueGradients.buttonHover}`}
        onClick={handleCreateNew}
        title={getCreateButtonText()}
      >
        <Icons.FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">{getCreateButtonText()}</span>
        <span className="sm:hidden">جديد</span>
      </button>

      {/* Filter toggle */}
      <button
        className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 border border-[#53a1dd] text-[#53a1dd] rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 min-w-fit shadow-sm hover:shadow-md"
        onClick={() =>
          window.innerWidth < 768
            ? setShowMobileFilters(true)
            : setShowFilters(!showFilters)
        }
        aria-label="فلترة"
      >
        {showFilters ? <Icons.FaTimes className="w-3 h-3 sm:w-4 sm:h-4" /> : <Icons.FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />}
        <span className="hidden sm:inline">
          {showFilters ? "إغلاق" : "فلترة"}
        </span>
      </button>
    </div>

    {/* Desktop Tabs */}
    <div className="flex gap-1 bg-gray-100/50 p-1 rounded-lg">
      <button
        onClick={() => setActiveTab("lands")}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md ${
          activeTab === "lands"
            ? `${blueGradients.button} text-white`
            : "text-gray-600 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
        }`}
      >
        الأراضي
      </button>
      <button
        onClick={() => setActiveTab("auctions")}
        className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md ${
          activeTab === "auctions"
            ? `${blueGradients.button} text-white`
            : "text-gray-600 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
        }`}
      >
        المزادات
      </button>
    </div>
  </div>

  {/* Active filters indicator */}
  {(getCurrentFilters().search || Object.keys(getCurrentFilters()).some(key => 
    key !== 'search' && key !== 'page' && getCurrentFilters()[key]
  )) && (
    <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-gray-100">
      {getCurrentFilters().search && (
        <span className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-2 py-1 rounded-full">
          البحث: {getCurrentFilters().search}
        </span>
      )}
      {/* يمكنك إضافة فلاتر نشطة أخرى هنا حسب الحاجة */}
      <button
        onClick={resetFilters}
        className="text-xs text-red-600 hover:text-red-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 px-2 py-1 rounded-full transition-all flex items-center gap-1"
      >
        <Icons.FaRedo className="w-3 h-3" />
        مسح الكل
      </button>
    </div>
  )}
</div>

{/* Desktop Filters */}
{showFilters && window.innerWidth >= 768 && (
  <div className="hidden sm:block bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm mb-6 border border-gray-100 overflow-hidden">
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-l from-[#53a1dd] to-blue-500 bg-clip-text text-transparent">
        🔍 فلاتر البحث
      </h3>
      <div className="flex gap-2">
        <button
          onClick={resetFilters}
          className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg sm:rounded-xl transition-all"
        >
          <Icons.FaRedo className="w-3 h-3 sm:w-4 sm:h-4" />
          إعادة تعيين
        </button>
        <button
          onClick={() => setShowFilters(false)}
          className="p-1.5 sm:p-2 hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 rounded-lg sm:rounded-xl transition-all"
        >
          <Icons.FaTimes className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
        </button>
      </div>
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
)}

{/* Mobile Search Bar - Shown when tabs are active */}
<div className="sm:hidden mb-4">
  <div className="relative">
    <Icons.FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
    <input
      type="text"
      placeholder={
        activeTab === "lands"
          ? "البحث في الأراضي..."
          : "البحث في المزادات..."
      }
      name="search"
      value={getCurrentFilters().search}
      onChange={getCurrentFilterHandler()}
      onKeyPress={(e) => e.key === 'Enter' && applyFilters()}
      className="w-full py-2.5 px-10 border border-gray-200 rounded-lg bg-gray-50/70 text-gray-700 text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 focus:bg-white hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
    />
    {getCurrentFilters().search && (
      <button
        onClick={() => {
          getCurrentFilterHandler()({ target: { name: 'search', value: '' } });
          applyFilters();
        }}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
      >
        <Icons.FaTimes className="w-3 h-3" />
      </button>
    )}
  </div>
</div>

{/* Mobile Filter Sidebar */}
<div
  className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300
    ${showMobileFilters ? "opacity-100 visible" : "opacity-0 invisible"}`}
  onClick={() => setShowMobileFilters(false)}
></div>

{/* Mobile Filters Panel */}
<div
  className={`fixed top-13 bottom-0 right-0 w-[90%] max-w-md bg-white z-50 overflow-y-auto transition-all duration-300 shadow-2xl flex flex-col rounded-l-2xl
    ${showMobileFilters ? "translate-x-0" : "translate-x-full"}`}
>
  {/* Header */}
  <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-l from-[#53a1dd] to-blue-500 text-white">
    <h3 className="text-lg font-bold">🔍 فلاتر البحث</h3>
    <button
      className="p-2 rounded-xl hover:bg-blue-600/50 transition-colors"
      onClick={() => setShowMobileFilters(false)}
      aria-label="إغلاق"
    >
      <Icons.FaTimes className="w-5 h-5" />
    </button>
  </div>

  {/* Filters Content */}
  <div className="p-6 flex-grow">
    <FiltersComponent
      activeTab={activeTab}
      filters={getCurrentFilters()}
      onFilterChange={getCurrentFilterHandler()}
      onResetFilters={resetFilters}
      onApplyFilters={applyFilters}
      {...getFilterOptions()}
    />
  </div>

  {/* Bottom Actions */}
  <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white">
  </div>
</div>

{/* Results Summary */}
<div className="mb-4 sm:mb-6">
  {renderResultsSummary()}
</div>

{/* Main Content */}
<div className="py-2">
  {renderContent()}
  {renderPagination()}
</div>

{/* Floating Create Button - للهواتف فقط */}
<div className="sm:hidden">
  {renderFloatingCreateButton()}
</div>
      </div>
    </div>
  );
}

export default PropertiesPage;