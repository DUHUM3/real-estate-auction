import React from "react";
import Icons from "../../../icons/index";
import FiltersComponent from "../../../utils/FiltersComponent";

// Mobile filters sidebar component
const FiltersSidebar = ({
  show,
  onClose,
  activeTab,
  filters,
  onFilterChange,
  onResetFilters,
  onApplyFilters,
  filterOptions,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 transition-opacity duration-300
          ${show ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-13 bottom-0 right-0 w-full max-w-md bg-white z-50 overflow-y-auto transition-all duration-300 shadow-2xl flex flex-col rounded-l-2xl
          ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-l from-[#53a1dd] to-blue-500 text-white">
          <h3 className="text-lg font-bold">🔍 فلاتر البحث</h3>
          <button
            className="p-2 rounded-xl hover:bg-blue-600/50 transition-colors"
            onClick={onClose}
            aria-label="إغلاق"
          >
            <Icons.FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-6 flex-grow">
          <FiltersComponent
            activeTab={activeTab}
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
            onApplyFilters={onApplyFilters}
            {...filterOptions}
          />
        </div>

        {/* Bottom Actions */}
        <div className="sticky bottom-0 p-4 border-t border-gray-200 bg-white"></div>
      </div>
    </>
  );
};

export default FiltersSidebar;