import React, { useRef, useState, useEffect } from "react";
import Icons from "../../../icons/index";

// Theme configuration for the properties feature
export const blueGradients = {
  button: "bg-gradient-to-r from-[#53a1dd] to-[#4285c7]",
  buttonHover: "hover:from-[#53a1dd] hover:to-[#4285c7]",
};

// Search bar component with filters toggle
const SearchBar = ({
  activeTab,
  filters,
  onFilterChange,
  onApplyFilters,
  showFilters,
  onToggleFilters,
  onOpenMobileFilters,
  onTabChange,
  onCreateNew,
  createButtonText,
  onResetFilters,
}) => {
  const filterBarRef = useRef(null);
  const lastScrollTop = useRef(0);
  const [hideFilterBar, setHideFilterBar] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setHideFilterBar(scrollTop > lastScrollTop.current && scrollTop > 100);
      lastScrollTop.current = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
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
            onClick={() => onTabChange("lands")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all shadow-sm hover:shadow-md ${
              activeTab === "lands"
                ? `${blueGradients.button} text-white`
                : "border border-gray-200 text-gray-600 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
            }`}
          >
            الأراضي
          </button>
          <button
            onClick={() => onTabChange("auctions")}
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
          onClick={onOpenMobileFilters}
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
                activeTab === "lands" ? "البحث في الأراضي..." : "البحث في المزادات..."
              }
              name="search"
              value={filters.search}
              onChange={onFilterChange}
              onKeyPress={(e) => e.key === "Enter" && onApplyFilters()}
              className="w-full py-2.5 sm:py-4 px-9 sm:px-12 rounded-lg sm:rounded-xl border border-gray-200 bg-gray-50/70 text-gray-700 text-xs sm:text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 focus:bg-white hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
            />
            {filters.search && (
              <button
                onClick={() => {
                  onFilterChange({ target: { name: "search", value: "" } });
                  onApplyFilters();
                }}
                className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <Icons.FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
            )}
          </div>

          {/* Create button */}
          <button
            className={`flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 text-white rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all min-w-fit shadow-sm hover:shadow-md ${blueGradients.button} ${blueGradients.buttonHover}`}
            onClick={onCreateNew}
            title={createButtonText}
          >
            <Icons.FaPlus className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{createButtonText}</span>
            <span className="sm:hidden">جديد</span>
          </button>

          {/* Filter toggle */}
          <button
            className="flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-3 px-3 sm:px-6 border border-[#53a1dd] text-[#53a1dd] rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-blue-100 min-w-fit shadow-sm hover:shadow-md"
            onClick={onToggleFilters}
            aria-label="فلترة"
          >
            {showFilters ? (
              <Icons.FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
            ) : (
              <Icons.FaFilter className="w-3 h-3 sm:w-4 sm:h-4" />
            )}
            <span className="hidden sm:inline">{showFilters ? "إغلاق" : "فلترة"}</span>
          </button>
        </div>

        {/* Desktop Tabs */}
        <div className="flex gap-1 bg-gray-100/50 p-1 rounded-lg">
          <button
            onClick={() => onTabChange("lands")}
            className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all shadow-sm hover:shadow-md ${
              activeTab === "lands"
                ? `${blueGradients.button} text-white`
                : "text-gray-600 hover:bg-gradient-to-b hover:from-white hover:to-gray-50"
            }`}
          >
            الأراضي
          </button>
          <button
            onClick={() => onTabChange("auctions")}
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
      {(filters.search ||
        Object.keys(filters).some((key) => key !== "search" && key !== "page" && filters[key])) && (
        <div className="flex flex-wrap gap-2 pt-3 mt-3 border-t border-gray-100">
          {filters.search && (
            <span className="text-xs bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-2 py-1 rounded-full">
              البحث: {filters.search}
            </span>
          )}
          <button
            onClick={onResetFilters}
            className="text-xs text-red-600 hover:text-red-800 hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 px-2 py-1 rounded-full transition-all flex items-center gap-1"
          >
            <Icons.FaRedo className="w-3 h-3" />
            مسح الكل
          </button>
        </div>
      )}

      {/* Mobile Search Bar */}
      <div className="sm:hidden mt-3">
        <div className="relative">
          <Icons.FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder={
              activeTab === "lands" ? "البحث في الأراضي..." : "البحث في المزادات..."
            }
            name="search"
            value={filters.search}
            onChange={onFilterChange}
            onKeyPress={(e) => e.key === "Enter" && onApplyFilters()}
            className="w-full py-2.5 px-10 border border-gray-200 rounded-lg bg-gray-50/70 text-gray-700 text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 focus:bg-white hover:bg-gradient-to-b hover:from-white hover:to-blue-50/20"
          />
          {filters.search && (
            <button
              onClick={() => {
                onFilterChange({ target: { name: "search", value: "" } });
                onApplyFilters();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <Icons.FaTimes className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;