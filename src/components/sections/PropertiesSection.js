import React, { useState, memo, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Icons from "../../icons/index";
import LandCard from "../LandCard";
import AuctionCard from "../AuctionCard";
import FiltersComponent from "../../utils/FiltersComponent";
import PropertiesSkeleton from "../../Skeleton/PropertiesSkeleton";

// متغيرات البيئة - يجب إعدادها في ملف .env
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL ||
  "https://core-api-x41.shaheenplus.sa/api";
const STORAGE_BASE_URL =
  process.env.REACT_APP_STORAGE_BASE_URL ||
  "https://core-api-x41.shaheenplus.sa/storage";

// إعدادات التطبيق مع اللون الجديد
const CONFIG = {
  ITEMS_PER_PAGE: 7,
  LANDS_ENDPOINT: "/properties/properties/latest",
  AUCTIONS_ENDPOINT: "/properties/auctions/latest",
  HORIZONTAL_SCROLL_CONFIG: {
    MOBILE_COLUMNS: "min-w-[calc(100%/7)] flex-shrink-0",
    TABLET_COLUMNS: "min-w-[calc(100%/7)] flex-shrink-0",
    DESKTOP_COLUMNS: "min-w-[calc(100%/7)] flex-shrink-0",
  },
  COLORS: {
    primary: "#53a1dd",
    primaryHover: "#4a8fc7",
    primaryLight: "#e6f2ff",
    border: "#53a1dd",
    text: "#53a1dd",
  },
};

const PropertiesSection = memo(({ onToggleFavorite, onPropertyClick }) => {
  const navigate = useNavigate();

  // الحالات المحلية
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [filterType, setFilterType] = useState("lands");

  // حالة موحدة للفلاتر مع قيم افتراضية محسنة
  const [filters, setFilters] = useState({
    // فلتر الأراضي
    propertyType: "",
    city: "",
    region: "",
    purpose: "",
    minPrice: "",
    maxPrice: "",
    area: "",
    land_type: "",
    min_area: "",
    max_area: "",

    // فلتر المزادات
    startDate: "",
    endDate: "",
    maxDaysLeft: "",
    search: "",
    company: "",
    address: "",
    date_from: "",
    date_to: "",
  });

  // دالة محسنة لبناء query parameters مع error handling
  const buildQueryParams = useCallback((filterParams, type) => {
    const queryParams = new URLSearchParams();

    try {
      if (type === "lands") {
        const landFilters = {
          region: filterParams.region,
          city: filterParams.city,
          land_type: filterParams.land_type,
          purpose: filterParams.purpose,
          min_area: filterParams.min_area,
          max_area: filterParams.max_area,
          min_price: filterParams.minPrice,
          max_price: filterParams.maxPrice,
        };

        Object.entries(landFilters).forEach(([key, value]) => {
          if (value && value.toString().trim()) {
            queryParams.append(key, value.toString().trim());
          }
        });
      } else {
        const auctionFilters = {
          region: filterParams.region,
          city: filterParams.city,
          search: filterParams.search,
          company: filterParams.company,
          address: filterParams.address,
          date_from: filterParams.date_from,
          date_to: filterParams.date_to,
        };

        Object.entries(auctionFilters).forEach(([key, value]) => {
          if (value && value.toString().trim()) {
            queryParams.append(key, value.toString().trim());
          }
        });
      }
    } catch (error) {
      console.error("Error building query parameters:", error);
    }

    return queryParams.toString();
  }, []);

  // دالة محسنة لمعالجة الصور مع حجم ثابت للصور
  const processImageUrl = useCallback((coverImage) => {
    if (
      !coverImage ||
      coverImage === "default_cover.jpg" ||
      coverImage === ""
    ) {
      return null;
    }

    // التحقق من كونها URL كاملة
    if (coverImage.startsWith("http")) {
      return coverImage;
    }

    return `${STORAGE_BASE_URL}/${coverImage}`;
  }, []);

  // دالة محسنة لمعالجة بيانات الأراضي
  const processLandsData = useCallback(
    (data) => {
      if (!data?.status || !data?.data?.data) {
        throw new Error("Invalid lands data format");
      }

      return {
        lands: data.data.data.map((land) => {
          const price = land.price_per_sqm
            ? parseFloat(land.price_per_sqm).toLocaleString("ar-SA")
            : land.estimated_investment_value
            ? parseFloat(land.estimated_investment_value).toLocaleString(
                "ar-SA"
              )
            : "غير محدد";

          const area = land.total_area
            ? parseFloat(land.total_area).toLocaleString("ar-SA")
            : "غير محدد";

          return {
            id: land.id,
            img: processImageUrl(land.cover_image),
            title: land.title || "عنوان غير متوفر",
            location: `${land.region || "منطقة غير محددة"}، ${
              land.city || "مدينة غير محددة"
            }`,
            price,
            area,
            landType: land.land_type || "غير محدد",
            purpose: land.purpose || "غير محدد",
            status: land.status || "active",
            is_favorite: Boolean(land.is_favorite),
          };
        }),
        filtersApplied: data.filters_applied || [],
      };
    },
    [processImageUrl]
  );

  // دالة محسنة لمعالجة بيانات المزادات مع تحسينات
  const processAuctionsData = useCallback(
    (data) => {
      if (!data?.success || !data?.data) {
        throw new Error("Invalid auctions data format");
      }

      return {
        auctions: data.data.map((auction) => {
          let daysLeft = 0;
          try {
            if (auction.auction_date) {
              const auctionDate = new Date(auction.auction_date);
              const today = new Date();
              daysLeft = Math.ceil(
                (auctionDate - today) / (1000 * 60 * 60 * 24)
              );
              daysLeft = daysLeft > 0 ? daysLeft : 0;
            }
          } catch (error) {
            console.error("Error calculating days left:", error);
          }

          // معالجة الصور لتتضمن معلومات الحجم الثابت
          const img = processImageUrl(auction.cover_image);

          return {
            id: auction.id,
            img,
            title: auction.title || "عنوان غير متوفر",
            location: auction.address || "عنوان غير متوفر",
            endDate: auction.auction_date,
            auctionCompany: auction.company?.auction_name || "شركة المزاد",
            daysLeft,
            startTime: auction.start_time,
            auctionDate: auction.auction_date,
            isFavorite: Boolean(auction.is_favorite),
            city: auction.city || "غير محدد",
            region: auction.region || "غير محدد",
            hasImage: !!img,
            imageUrl: img,
          };
        }),
      };
    },
    [processImageUrl]
  );

  // استخدام React Query لجلب بيانات الأراضي مع error handling محسن
  const {
    data: landsData,
    isLoading: landsLoading,
    error: landsError,
    refetch: refetchLands,
    isFetching: landsFetching,
  } = useQuery({
    queryKey: ["lands", filters],
    queryFn: async () => {
      try {
        const queryParams = buildQueryParams(filters, "lands");
        const url = `${API_BASE_URL}${CONFIG.LANDS_ENDPOINT}${
          queryParams ? `?${queryParams}` : ""
        }`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          // إضافة timeout للـ production
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return processLandsData(data);
      } catch (error) {
        console.error("Error fetching lands:", error);
        throw error;
      }
    },
    enabled: filterType === "lands",
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // استخدام React Query لجلب بيانات المزادات مع error handling محسن
  const {
    data: auctionsData,
    isLoading: auctionsLoading,
    error: auctionsError,
    refetch: refetchAuctions,
    isFetching: auctionsFetching,
  } = useQuery({
    queryKey: ["auctions", filters],
    queryFn: async () => {
      try {
        const queryParams = buildQueryParams(filters, "auctions");
        const url = `${API_BASE_URL}${CONFIG.AUCTIONS_ENDPOINT}${
          queryParams ? `?${queryParams}` : ""
        }`;

        const response = await fetch(url, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(10000),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return processAuctionsData(data);
      } catch (error) {
        console.error("Error fetching auctions:", error);
        throw error;
      }
    },
    enabled: filterType === "auctions",
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // معالج تغيير الفلاتر مع debouncing
  const handleFilterChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  // تطبيق الفلاتر
  const applyFilters = useCallback(() => {
    try {
      if (filterType === "lands") {
        refetchLands();
      } else {
        refetchAuctions();
      }
      setShowFilter(false);
      setCurrentPage(0);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  }, [filterType, refetchLands, refetchAuctions]);

  // إعادة تعيين الفلاتر
  const resetFilters = useCallback(() => {
    const initialFilters = {
      propertyType: "",
      city: "",
      region: "",
      purpose: "",
      minPrice: "",
      maxPrice: "",
      area: "",
      land_type: "",
      min_area: "",
      max_area: "",
      startDate: "",
      endDate: "",
      maxDaysLeft: "",
      search: "",
      company: "",
      address: "",
      date_from: "",
      date_to: "",
    };

    setFilters(initialFilters);
    setCurrentPage(0);

    setTimeout(() => {
      if (filterType === "lands") {
        refetchLands();
      } else {
        refetchAuctions();
      }
    }, 100);
  }, [filterType, refetchLands, refetchAuctions]);

  // معالج تغيير نوع الفلتر
  const handleFilterTypeChange = useCallback((type) => {
    setFilterType(type);
    setCurrentPage(0);
    setShowFilter(false);
  }, []);

  // معالج التنقل لعرض الكل
  const handleViewAll = useCallback(() => {
    if (filterType === "lands") {
      navigate("/lands-and-auctions-list");
    } else {
      navigate("/lands-and-auctions-list", {
        state: {
          activeTab: "auctions",
        },
      });
    }
  }, [filterType, navigate]);

  // حساب البيانات المعروضة
  const computedData = useMemo(() => {
    const lands = landsData?.lands || [];
    const auctions = auctionsData?.auctions || [];
    const displayedItems = filterType === "lands" ? lands : auctions;
    const startIndex = currentPage * CONFIG.ITEMS_PER_PAGE;
    const endIndex = startIndex + CONFIG.ITEMS_PER_PAGE;
    const currentItems = displayedItems.slice(startIndex, endIndex);

    return {
      lands,
      auctions,
      displayedItems,
      currentItems,
      hasMore: endIndex < displayedItems.length,
      totalItems: displayedItems.length,
    };
  }, [landsData, auctionsData, filterType, currentPage]);

  const isLoading = filterType === "lands" ? landsLoading : auctionsLoading;
  const isFetching = filterType === "lands" ? landsFetching : auctionsFetching;

  // بيانات ثابتة للفلاتر
  const filterOptions = useMemo(
    () => ({
      landTypes: ["سكني", "تجاري", "زراعي"],
      purposes: ["بيع", "استثمار"],
    }),
    []
  );

  return (
    <section className="py-20 bg-gray-50" id="properties">
      <div className="container mx-auto px-4">
        {/* مؤشر التحميل العلوي */}
        {isFetching && (
          <div className="fixed top-0 left-0 w-full h-1 bg-blue-200 z-50">
            <div className="h-full bg-[#53a1dd] animate-pulse"></div>
          </div>
        )}

        {/* الفلاتر المطبقة */}
        {landsData?.filtersApplied && landsData.filtersApplied.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 mb-6">
            <span className="text-[#53a1dd] text-sm font-medium">
              الفلاتر المطبقة: {landsData.filtersApplied.join("، ")}
            </span>
          </div>
        )}

        {/* الهيدر */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* التبويبات */}
          <div className="flex border-b border-gray-200 w-full sm:w-auto">
            <button
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-all duration-200 relative ${
                filterType === "lands"
                  ? "border-[#53a1dd] text-[#53a1dd]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleFilterTypeChange("lands")}
              disabled={isFetching}
            >
              الأراضي
            </button>
            <button
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-all duration-200 relative ${
                filterType === "auctions"
                  ? "border-[#53a1dd] text-[#53a1dd]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => handleFilterTypeChange("auctions")}
              disabled={isFetching}
            >
              المزادات
            </button>
          </div>

          {/* زر الفلتر */}
          <button
            className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4a8fc7] text-white px-6 py-3 rounded-lg disabled:bg-gray-400 transition-colors duration-200 font-medium w-full sm:w-auto justify-center sm:justify-start"
            onClick={() => setShowFilter(!showFilter)}
            disabled={isFetching}
          >
            <Icons.FaFilter className="text-sm" />
            {showFilter ? "إخفاء الفلتر" : "عرض الفلتر"}
          </button>
        </div>

        {/* الفلتر المتقدم مع إضافة scrollbar */}
        <div
          className={`bg-white rounded-xl shadow-sm mb-8 overflow-hidden transition-all duration-400 ${
            showFilter
              ? "max-h-[80vh] p-6 border border-gray-200"
              : "max-h-0 border-0"
          }`}
        >
          {showFilter && (
            <div className="max-h-[calc(80vh-3rem)] overflow-y-auto pr-2 custom-scrollbar">
              <FiltersComponent
                activeTab={filterType === "lands" ? "lands" : "auctions"}
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={resetFilters}
                onApplyFilters={applyFilters}
                landTypes={filterOptions.landTypes}
                purposes={filterOptions.purposes}
                showSearch={true}
                isLoading={isFetching}
              />
            </div>
          )}
        </div>

        {/* عرض الأخطاء */}
        {(landsError || auctionsError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Icons.FaExclamationTriangle className="text-red-500" />
              <span className="text-red-700 font-medium">
                حدث خطأ في تحميل البيانات. يرجى المحاولة مرة أخرى.
              </span>
            </div>
            <button
              className="mt-2 text-red-600 underline hover:no-underline"
              onClick={() =>
                filterType === "lands" ? refetchLands() : refetchAuctions()
              }
            >
              إعادة المحاولة
            </button>
          </div>
        )}

        {/* البطاقات - العرض الأفقي دائماً */}
        <div className="properties-container">
          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto pb-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="min-w-80 flex-shrink-0">
                  <PropertiesSkeleton type={filterType} />
                </div>
              ))}
            </div>
          ) : (
            <>
              {computedData.currentItems.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
                  {computedData.currentItems.map((item) => (
                    <div
                      key={item.id}
                      className={`${CONFIG.HORIZONTAL_SCROLL_CONFIG.MOBILE_COLUMNS} sm:${CONFIG.HORIZONTAL_SCROLL_CONFIG.TABLET_COLUMNS} lg:${CONFIG.HORIZONTAL_SCROLL_CONFIG.DESKTOP_COLUMNS} snap-start`}
                    >
                      {filterType === "lands" ? (
                        <LandCard
                          {...item}
                          onClick={onPropertyClick}
                          onToggleFavorite={onToggleFavorite}
                          isFavorite={item.is_favorite}
                        />
                      ) : (
                        <AuctionCard
                          id={item.id}
                          img={item.img} // أو item.cover_image حسب معالج البيانات
                          title={item.title}
                          city={item.city}
                          region={item.region}
                          location={item.location || item.address}
                          auction_date={item.auctionDate || item.auction_date}
                          status={item.status}
                          currentBid={item.currentBid || item.current_bid}
                          startPrice={item.startPrice || item.start_price}
                          bidders={item.bidders || 0}
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="bg-white rounded-xl shadow-sm p-8 mx-auto max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">
                      {filterType === "lands" ? "🏞️" : "🏛️"}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">
                      لا توجد نتائج
                    </h3>
                    <p className="text-gray-500 text-lg">
                      لا توجد {filterType === "lands" ? "أراضي" : "مزادات"}{" "}
                      متاحة حسب المعايير المحددة
                    </p>
                    {Object.values(filters).some((filter) => filter) && (
                      <button
                        className="mt-4 text-[#53a1dd] hover:text-[#4a8fc7] underline"
                        onClick={resetFilters}
                      >
                        مسح جميع الفلاتر
                      </button>
                    )}
                  </div>
                </div>
              )}
            </>
          )}

          {/* زر عرض الكل */}
          {computedData.totalItems > CONFIG.ITEMS_PER_PAGE && (
            <div className="text-center mt-8">
              <button
                className="border-2 border-[#53a1dd] text-[#53a1dd] px-8 py-3 rounded-lg hover:bg-[#53a1dd] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-semibold"
                onClick={handleViewAll}
                disabled={isFetching}
              >
                عرض الكل ({computedData.totalItems})
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
});

PropertiesSection.displayName = "PropertiesSection";

export default PropertiesSection;
