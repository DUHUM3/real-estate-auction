import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "@vuer-ai/react-helmet-async";
import Icons from "../icons/index";
import { ModalContext } from "../App";
import { useAuth } from "../context/AuthContext";
import PropertyListSkeleton from "../Skeleton/PropertyListSkeleton";
import FiltersComponent from "../utils/FiltersComponent";

// Import custom hooks
import { useFavorites } from "../features/propertyandauctions/hooks/useFavorites";
import { useFilters } from "../features/propertyandauctions/hooks/useFilters";
import { usePropertiesData } from "../features/propertyandauctions/hooks/usePropertiesData";

// Import components
import SearchBar from "../features/propertyandauctions/components/SearchBar";
import FiltersSidebar from "../features/propertyandauctions/components/FiltersSidebar";
import PropertyCard from "../features/propertyandauctions/components/PropertyCard";
import AuctionCard from "../features/propertyandauctions/components/AuctionCard";
import Pagination from "../features/propertyandauctions/components/Pagination";
import ResultsSummary from "../features/propertyandauctions/components/ResultsSummary";
import EmptyState from "../features/propertyandauctions/components/EmptyState";

// Import services and constants
import { shareItem } from "../features/propertyandauctions/services/shareService";
import { useToast } from "../components/common/ToastProvider";
import {
  regions,
  landTypes,
  purposes,
  auctionStatuses,
} from "../features/propertyandauctions/constants/filterOptions";

// Main PropertiesPage component
const PropertiesPage = () => {
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth();
  const toast = useToast();

  // Custom hooks
  const {
    activeTab,
    landFilters,
    auctionFilters,
    resetFilters,
    handleTabChange,
    getCurrentFilters,
    getCurrentFilterHandler,
  } = useFilters();

  const { favorites, toggleFavorite } = useFavorites(openLogin);

  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Data fetching
  const { currentItems, totalPages, isLoading, error } = usePropertiesData(
    activeTab,
    landFilters,
    auctionFilters,
    currentPage
  );

  // Reset page when tab or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, landFilters, auctionFilters]);

  // Scroll to top on page/tab change
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, [currentPage, activeTab]);

  // Helper functions
  const getCurrentUserType = () => {
    if (currentUser?.user_type) {
      return currentUser.user_type;
    }
    const storedType = localStorage.getItem("user_type");
    if (storedType) {
      return storedType;
    }
    return null;
  };

  const isUserAuthorized = (userType) => {
    if (!userType) return false;
    const authorizedTypes = [
      "مالك أرض",
      "وكيل شرعي",
      "وسيط عقاري",
      "جهة تجارية",
      "شركة مزادات",
    ];
    return authorizedTypes.includes(userType.trim());
  };

  const getCreateButtonText = () => {
    const userType = getCurrentUserType();
    switch (userType) {
      case "مالك أرض":
      case "وكيل شرعي":
      case "وسيط عقاري":
      case "جهة تجارية":
        return "إنشاء أرض";
      case "شركة مزادات":
        return "إنشاء مزاد";
      default:
        return "إنشاء أرض";
    }
  };

  const isUserLoggedIn = () => {
    return !!currentUser || !!localStorage.getItem("token");
  };

  const proceedWithCreation = (userType) => {
    if (!userType || !isUserAuthorized(userType)) {
      toast.error("error", "عذراً، ليس لديك صلاحية للوصول إلى هذه الصفحة", 5000);
      return;
    }

    switch (userType) {
      case "شركة مزادات":
        navigate("/create-auction");
        break;
      case "مالك أرض":
      case "وكيل شرعي":
      case "وسيط عقاري":
      case "جهة تجارية":
        navigate("/create-ad");
        break;
      default:
        navigate("/");
        break;
    }
  };

  const handleCreateNew = () => {
    if (!isUserLoggedIn()) {
      openLogin(() => {
        setTimeout(() => {
          const userType = getCurrentUserType();
          if (!isUserAuthorized(userType)) {
            toast.error(
              "عذراً، هذه الخدمة متاحة فقط لأصحاب الأراضي ووكلاء العقارات والجهات التجارية والوكلاء الشرعيين",
            );
          } else {
            proceedWithCreation(userType);
          }
        }, 500);
      });
      return;
    }

    const userType = getCurrentUserType();
    if (!isUserAuthorized(userType)) {
      toast.error(
        "عذراً، هذه الخدمة متاحة فقط لأصحاب الأراضي ووكلاء العقارات والجهات التجارية والوكلاء الشرعيين",
      );
      return;
    }

    proceedWithCreation(userType);
  };

  const openDetails = (item, itemType) => {
    if (itemType === "land") {
      navigate(`/lands/${item.id}/land`);
    } else if (itemType === "auction") {
      navigate(`/auctions/${item.id}/auction`);
    }
  };

  const applyFilters = () => {
    setShowMobileFilters(false);
    setCurrentPage(1);
  };

  // Pagination handlers
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  const getFilterOptions = () =>
    activeTab === "lands"
      ? { regions, landTypes, purposes }
      : { auctionStatuses };

  // Render helpers
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
        <EmptyState
          activeTab={activeTab}
          onReset={resetFilters}
          onCreate={handleCreateNew}
          createButtonText={getCreateButtonText()}
        />
      );
    }

    return (
      <div className="property-list-container">
        {/* Mobile View - List (Vertical) */}
        <div className="md:hidden flex flex-col gap-3">
          {activeTab === "lands"
            ? currentItems.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  favorites={favorites.properties}
                  onToggleFavorite={toggleFavorite}
                  onShare={shareItem}
                  onOpenDetails={openDetails}
                />
              ))
            : currentItems.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  favorites={favorites.auctions}
                  onToggleFavorite={toggleFavorite}
                  onShare={shareItem}
                  onOpenDetails={openDetails}
                />
              ))}
        </div>

        {/* Desktop and Tablet View - Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeTab === "lands"
            ? currentItems.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  favorites={favorites.properties}
                  onToggleFavorite={toggleFavorite}
                  onShare={shareItem}
                  onOpenDetails={openDetails}
                />
              ))
            : currentItems.map((auction) => (
                <AuctionCard
                  key={auction.id}
                  auction={auction}
                  favorites={favorites.auctions}
                  onToggleFavorite={toggleFavorite}
                  onShare={shareItem}
                  onOpenDetails={openDetails}
                />
              ))}
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 pb-6 pt-20" dir="rtl">
      {/* SEO */}
      <Helmet>
        <title> شاهين بلس | عقارات وأراضي للبيع والاستثمار </title>
        <meta
          name="description"
          content="تصفح أحدث العقارات والأراضي والمزادات المتاحة للبيع والاستثمار. منصة شاهين بلس تقدم لك أفضل الفرص العقارية في السعودية بأسعار تنافسية."
        />
        <meta
          name="keywords"
          content="عقارات للبيع, أراضي, مزادات, استثمار عقاري, منصة عقارية, السعودية"
        />
        <meta
          property="og:title"
          content="عقارات وأراضي للبيع والاستثمار | منصة شاهين بلس"
        />
        <meta
          property="og:description"
          content="تصفح أحدث العقارات والأراضي والمزادات المتاحة للبيع والاستثمار على منصة شاهين بلس"
        />
        <meta property="og:type" content="website" />
        <link
          rel="canonical"
          href="https://shaheenplus.sa/lands-and-auctions-list"
        />
      </Helmet>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Search Bar */}
        <SearchBar
          activeTab={activeTab}
          filters={getCurrentFilters()}
          onFilterChange={getCurrentFilterHandler()}
          onApplyFilters={applyFilters}
          showFilters={showFilters}
          onToggleFilters={() =>
            window.innerWidth < 768
              ? setShowMobileFilters(true)
              : setShowFilters(!showFilters)
          }
          onOpenMobileFilters={() => setShowMobileFilters(true)}
          onTabChange={handleTabChange}
          onCreateNew={handleCreateNew}
          createButtonText={getCreateButtonText()}
          onResetFilters={resetFilters}
        />

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

        {/* Mobile Filter Sidebar */}
        <FiltersSidebar
          show={showMobileFilters}
          onClose={() => setShowMobileFilters(false)}
          activeTab={activeTab}
          filters={getCurrentFilters()}
          onFilterChange={getCurrentFilterHandler()}
          onResetFilters={resetFilters}
          onApplyFilters={applyFilters}
          filterOptions={getFilterOptions()}
        />

        {/* Results Summary */}
        <ResultsSummary
          isLoading={isLoading}
          error={error}
          currentItemsCount={currentItems.length}
          totalCount={currentItems.length}
        />

        {/* Main Content */}
        <div className="py-2">
          {renderContent()}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={paginate}
            onNext={nextPage}
            onPrev={prevPage}
          />
        </div>

        {/* Floating Create Button - للهواتف فقط */}
        <div className="sm:hidden">{renderFloatingCreateButton()}</div>
      </div>
    </div>
  );
};

export default PropertiesPage;
