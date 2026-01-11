// لوحة الفلاتر الكاملة
import React from "react";
import { X } from "lucide-react";
import {
  regions,
  cities,
  purposeOptions,
  typeOptions,
} from "../constants/requestsData";

const FiltersPanel = ({
  filters,
  onFilterChange,
  onReset,
  onApply,
  showMobile = false,
  onCloseMobile,
}) => {
  const filtersContent = (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          المنطقة
        </label>
        <select
          name="region"
          value={filters.region}
          onChange={onFilterChange}
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
          onChange={onFilterChange}
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
          onChange={onFilterChange}
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
          onChange={onFilterChange}
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
          onChange={onFilterChange}
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
          onChange={onFilterChange}
          className="w-full py-3 px-4 border border-gray-300 rounded-lg focus:outline-none focus:border-[#53a1dd] focus:ring-2 focus:ring-blue-100 text-sm transition-all bg-white"
          placeholder="أي مساحة"
          min="0"
        />
      </div>
      <div className="md:col-span-2 flex items-end gap-3">
        {/* إعادة تعيين */}
        <button
          onClick={onReset}
          className="flex-1 py-3 border border-gray-300 bg-white text-gray-700 font-bold text-sm rounded-lg transition-all hover:bg-gray-50"
        >
          إعادة تعيين
        </button>

        {/* تطبيق الفلاتر – موبايل فقط */}
        <button
          onClick={onApply}
          className="flex-1 py-3 bg-[#53a1dd] text-white font-bold text-sm rounded-lg transition-all hover:bg-blue-600 md:hidden"
        >
          تطبيق الفلاتر
        </button>
      </div>
    </div>
  );

  // Desktop view
  if (!showMobile) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
        {filtersContent}
      </div>
    );
  }

  // Mobile drawer
  return (
    <>
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300
          ${showMobile ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onCloseMobile}
      ></div>

      <div
        className={`fixed top-10 bottom-0 right-0 w-full max-w-md bg-white z-50 overflow-y-auto transition-all duration-300 shadow-2xl
          ${showMobile ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-l from-[#53a1dd] to-[#53a1dd] text-white">
          <h3 className="text-lg font-bold">فلاتر البحث</h3>
          <button
            className="p-2 rounded-xl hover:bg-blue-600/50 transition-colors"
            onClick={onCloseMobile}
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6">{filtersContent}</div>
      </div>
    </>
  );
};

export default FiltersPanel;
