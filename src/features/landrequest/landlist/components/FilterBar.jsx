// شريط البحث والفلاتر العلوي
import React, { useContext } from "react";
import { Search, Filter, Plus, X } from "lucide-react";
import { blueGradients, getPurposeLabel, getTypeLabel } from "../constants/requestsData";
import { ModalContext } from "../../../../App"; // Context فتح تسجيل الدخول
import { useNavigate } from "react-router-dom";

const FilterBar = ({
  filters,
  onSearchChange,
  onSearchKeyPress,
  isLoading,
  showFilters,
  onToggleFilters,
  onResetFilters,
  hideFilterBar,
  filterBarRef,
}) => {
  const hasActiveFilters = !!(
    filters.keyword ||
    filters.region ||
    filters.city ||
    filters.purpose ||
    filters.type ||
    filters.area_min ||
    filters.area_max
  );

  const { openLogin } = useContext(ModalContext);
  const navigate = useNavigate();

  // الهاندلر الجديد للزر
 const handleCreateRequest = React.useCallback(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    openLogin(() => {
      // نستخدم setTimeout لضمان عدم التحديث أثناء رندر
      setTimeout(() => {
        navigate("/create-request");
      }, 0);
    });
  } else {
    navigate("/create-request");
  }
}, [openLogin, navigate]);


  return (
    <div
      className={`bg-white p-4 rounded-xl shadow-sm sticky top-24 z-30 mt-6 mb-6 transition-all duration-300 border border-gray-200
        ${hideFilterBar ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"}`}
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
            onChange={onSearchChange}
            onKeyPress={onSearchKeyPress}
            className="w-full py-3 px-10 rounded-lg border border-gray-300 bg-white text-gray-700 text-sm transition-all focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100"
          />
          {isLoading && filters.keyword && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#53a1dd] border-t-transparent"></div>
            </div>
          )}
        </div>

        {/* زر إنشاء الطلب مع تحقق تسجيل الدخول */}
        <button
          className={`flex items-center justify-center gap-2 py-3 px-4 sm:px-6 text-white rounded-lg font-bold text-sm transition-all ${blueGradients.button} hover:${blueGradients.buttonHover}`}
          onClick={handleCreateRequest}
        >
          <Plus size={18} />
          <span className="hidden sm:inline">إنشاء طلب</span>
        </button>

        <button
          className="flex items-center justify-center gap-2 py-3 px-4 sm:px-6 border border-[#53a1dd] text-[#53a1dd] rounded-lg font-bold text-sm transition-all hover:bg-blue-50"
          onClick={onToggleFilters}
        >
          {showFilters ? <X size={18} /> : <Filter size={18} />}
          <span className="hidden sm:inline">{showFilters ? "إغلاق" : "فلترة"}</span>
        </button>
      </div>

      {hasActiveFilters && (
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
            onClick={onResetFilters}
            className="text-xs text-red-600 hover:text-red-800 hover:bg-red-50 px-2 py-1 rounded-full transition-all"
          >
            مسح الكل
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar;
