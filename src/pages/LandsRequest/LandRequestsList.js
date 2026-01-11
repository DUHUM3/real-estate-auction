import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRequests } from "../../features/landrequest/landlist/hooks/useRequests";
import { useFilters } from "../../features/landrequest/landlist/hooks/useFilters";
import { Helmet } from "react-helmet-async"; // ✅ إضافة Helmet

import FilterBar from "../../features/landrequest/landlist/components/FilterBar";
import FiltersPanel from "../../features/landrequest/landlist/components/FiltersPanel";
import RequestCard from "../../features/landrequest/landlist/components/RequestCard";
import RequestListSkeleton from "../../features/landrequest/landlist/components/RequestListSkeleton";
import RequestCardSkeleton from "../../features/landrequest/landlist/components/RequestCardSkeleton";
import EmptyState from "../../features/landrequest/landlist/components/EmptyState";
import Pagination from "../../features/landrequest/landlist/components/Pagination";

function LandRequestsList() {
  const navigate = useNavigate();
  const location = useLocation();
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);

  // States
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [hideFilterBar, setHideFilterBar] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Custom Hooks
  const { isLoading, requests, pagination, loadRequests } = useRequests();
  const {
    filters,
    setFilters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    hasActiveFilters,
    searchTimeoutRef,
  } = useFilters();

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // تطبيق state من navigation إذا كان موجودًا
  useEffect(() => {
    if (location.state?.page) {
      setCurrentPage(location.state.page);
      setFilters(location.state.filters || filters);
    }
  }, [location.state]);

  // تطبيق الفلاتر فوراً عند التغيير
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setCurrentPage(1);
      loadRequests(1, filters);
    }, 300);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [
    filters.keyword,
    filters.region,
    filters.city,
    filters.purpose,
    filters.type,
    filters.area_min,
    filters.area_max,
  ]);

  // جلب البيانات عند تغيير الصفحة
  useEffect(() => {
    loadRequests(currentPage, filters);
  }, [currentPage]);

  // Handle scroll for filter bar
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
    };
  }, []);

  // Handlers
  const handleCreateRequest = () => {
    navigate("/create-request");
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      setCurrentPage(1);
      loadRequests(1, filters);
    }
  };

  const handleResetFilters = () => {
    resetFilters();
    setCurrentPage(1);
    setShowMobileFilters(false);
    setShowFilters(false);
  };

  const handleApplyFilters = () => {
    setShowMobileFilters(false);
    setShowFilters(false);
    setCurrentPage(1);
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    loadRequests(1, filters);
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

  const handleToggleFilters = () => {
    if (window.innerWidth < 768) {
      setShowMobileFilters(true);
    } else {
      setShowFilters(!showFilters);
    }
  };

  // Render content
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
        <EmptyState
          onReset={handleResetFilters}
          onCreate={handleCreateRequest}
        />
      );
    }

    return (
      <>
        <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-3 rounded-lg border border-gray-200">
          <span className="font-bold">
            عرض {requests.length} من أصل {pagination.total} طلب
          </span>
          {hasActiveFilters() && (
            <span className="mx-2 text-[#53a1dd]">• مع الفلاتر المطبقة</span>
          )}
        </div>

        {isMobile ? (
          <div className="space-y-3">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                isMobile={true}
                onOpenDetails={openDetails}
                onShare={shareRequest}
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {requests.map((request) => (
              <RequestCard
                key={request.id}
                request={request}
                isMobile={false}
                onOpenDetails={openDetails}
                onShare={shareRequest}
              />
            ))}
          </div>
        )}

        <Pagination
          pagination={pagination}
          currentPage={currentPage}
          onPageChange={paginate}
          onNext={nextPage}
          onPrev={prevPage}
        />
      </>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pb-8 relative pt-20" dir="rtl">
      {/* SEO باستخدام Helmet */}
      <Helmet>
        <title>شاهين بلس | طلبات الشراء </title>
        <meta
          name="description"
          content="تصفح وقدم طلبات شراء الأراضي والمزادات على شاهين بلس بسرعة وسهولة مع متابعة حالة الطلب مباشرة."
        />
      </Helmet>

      <FilterBar
        filters={filters}
        onSearchChange={handleSearchChange}
        onSearchKeyPress={handleSearchKeyPress}
        isLoading={isLoading}
        onCreateRequest={handleCreateRequest}
        onToggleFilters={handleToggleFilters}
        showFilters={showFilters}
        onResetFilters={handleResetFilters}
        hideFilterBar={hideFilterBar}
        filterBarRef={filterBarRef}
      />

      {showFilters && window.innerWidth >= 768 && (
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
        />
      )}

      {showMobileFilters && (
        <FiltersPanel
          filters={filters}
          onFilterChange={handleFilterChange}
          onReset={handleResetFilters}
          onApply={handleApplyFilters}
          showMobile={true}
          onCloseMobile={() => setShowMobileFilters(false)}
        />
      )}

      <div className="py-2">{renderContent()}</div>
    </div>
  );
}

export default LandRequestsList;
