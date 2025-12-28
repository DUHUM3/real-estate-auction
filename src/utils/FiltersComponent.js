import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import Icons from '../icons/index';
import { locationService } from '../utils/LocationForFiltters';

const FiltersComponent = memo(({
  activeTab,
  filters,
  onFilterChange,
  onResetFilters,
  onApplyFilters,
  landTypes = [],
  purposes = [],
  auctionStatuses = [],
  showSearch = true
}) => {
  const [isMobile, setIsMobile] = useState(false);
  
  // الكشف عن حجم الشاشة
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // ❗ اعتماد تام على locationService
  const availableRegions = useMemo(() => locationService.getRegions(), []);
  const availableCities = useMemo(() => locationService.getCitiesByRegion(), []);

  // 🔹 حفظ الدوال لمنع إعادة الإنشاء
  const handleFilterChange = useCallback((e) => {
    onFilterChange(e);
  }, [onFilterChange]);

  const handleResetFilters = useCallback(() => {
    onResetFilters();
  }, [onResetFilters]);

  const handleApplyFilters = useCallback(() => {
    onApplyFilters();
  }, [onApplyFilters]);

  // 🔹 مكوّن اختيار المنطقة + المدينة
  const RegionCity = useMemo(() => () => (
    <>
      <div className="mb-4 md:mb-0 md:w-1/4 px-2">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المنطقة</label>
        <select 
          name="region" 
          value={filters.region} 
          onChange={handleFilterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
        >
          <option value="">كل المناطق</option>
          {availableRegions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="mb-4 md:mb-0 md:w-1/4 px-2">
        <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المدينة</label>
        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          disabled={!filters.region}
          className={`w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white ${
            !filters.region ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <option value="">كل المدن</option>
          {filters.region &&
            availableCities[filters.region]?.map(city => (
              <option key={city} value={city}>{city}</option>
            ))}
        </select>
      </div>
    </>
  ), [filters.region, filters.city, availableRegions, availableCities, handleFilterChange]);

  // ---------------------- الطلبات ----------------------
  const LandRequestsFiltersContent = useMemo(() => () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap -mx-2 mb-4">
        {RegionCity()}

        <div className="mb-4 md:mb-0 md:w-1/4 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الغرض</label>
          <select 
            name="purpose" 
            value={filters.purpose} 
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
          >
            <option value="">الكل</option>
            <option value="sale">بيع</option>
            <option value="investment">استثمار</option>
          </select>
        </div>

        <div className="mb-4 md:mb-0 md:w-1/4 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">النوع</label>
          <select 
            name="type" 
            value={filters.type} 
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
          >
            <option value="">الكل</option>
            <option value="residential">سكني</option>
            <option value="commercial">تجاري</option>
            <option value="agricultural">زراعي</option>
          </select>
        </div>
      </div>

      <div className="flex flex-wrap -mx-2 mb-4">
        <div className="mb-4 md:mb-0 md:w-1/4 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المساحة من (م²)</label>
          <input
            type="number"
            name="area_min"
            value={filters.area_min}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
            placeholder="0"
          />
        </div>

        <div className="mb-4 md:mb-0 md:w-1/4 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المساحة إلى (م²)</label>
          <input
            type="number"
            name="area_max"
            value={filters.area_max}
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
            placeholder="أقصى مساحة"
          />
        </div>

        {showSearch && (
          <div className="mb-4 md:mb-0 md:w-1/2 px-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">بحث</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="ابحث في الطلبات..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
            />
          </div>
        )}
      </div>

      <div className="flex justify-end pt-4 border-t border-gray-200">
        <button 
          className="px-6 py-2 bg-[#53a1dd] text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleApplyFilters}
        >
          تطبيق الفلتر
        </button>
      </div>
    </div>
  ), [RegionCity, filters, showSearch, handleFilterChange, handleApplyFilters]);

  // ---------------------- الأراضي ----------------------
  const LandFiltersContent = useMemo(() => () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap -mx-2 mb-4">
        {RegionCity()}

        <div className="mb-4 md:mb-0 md:w-1/4 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">نوع الأرض</label>
          <select 
            name="land_type" 
            value={filters.land_type} 
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
          >
            <option value="">كل الأنواع</option>
            {landTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="mb-4 md:mb-0 md:w-1/4 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">الغرض</label>
          <select 
            name="purpose" 
            value={filters.purpose} 
            onChange={handleFilterChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
          >
            <option value="">جميع الأغراض</option>
            {purposes.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {!isMobile && (
          <>
            <div className="mb-4 md:mb-0 md:w-1/4 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المساحة من</label>
              <input 
                type="number" 
                name="min_area" 
                value={filters.min_area} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                placeholder="0"
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/4 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المساحة إلى</label>
              <input 
                type="number" 
                name="max_area" 
                value={filters.max_area} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                placeholder="أقصى مساحة"
              />
            </div>
          </>
        )}
      </div>

      {isMobile && (
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="mb-4 md:mb-0 md:w-1/2 px-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المساحة من</label>
            <input 
              type="number" 
              name="min_area" 
              value={filters.min_area} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              placeholder="0"
            />
          </div>

          <div className="mb-4 md:mb-0 md:w-1/2 px-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">المساحة إلى</label>
            <input 
              type="number" 
              name="max_area" 
              value={filters.max_area} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              placeholder="أقصى مساحة"
            />
          </div>

          {filters.purpose !== 'استثمار' && (
            <>
              <div className="mb-4 md:mb-0 md:w-1/2 px-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">السعر من</label>
                <input 
                  type="number" 
                  name="min_price" 
                  value={filters.min_price} 
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                  placeholder="0"
                />
              </div>

              <div className="mb-4 md:mb-0 md:w-1/2 px-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">السعر إلى</label>
                <input 
                  type="number" 
                  name="max_price" 
                  value={filters.max_price} 
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                  placeholder="أقصى سعر"
                />
              </div>
            </>
          )}
        </div>
      )}

      {!isMobile && filters.purpose !== 'استثمار' && (
        <div className="flex flex-wrap -mx-2 mb-4">
          <div className="mb-4 md:mb-0 md:w-1/4 px-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">السعر من</label>
            <input 
              type="number" 
              name="min_price" 
              value={filters.min_price} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              placeholder="0"
            />
          </div>

          <div className="mb-4 md:mb-0 md:w-1/4 px-2">
            <label className="block text-sm font-medium text-gray-700 mb-1 text-right">السعر إلى</label>
            <input 
              type="number" 
              name="max_price" 
              value={filters.max_price} 
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              placeholder="أقصى سعر"
            />
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button 
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
          onClick={handleResetFilters}
        >
          إعادة تعيين
        </button>
        <button 
          className="px-6 py-2 bg-[#53a1dd] text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleApplyFilters}
        >
          تطبيق الفلتر
        </button>
      </div>
    </div>
  ), [RegionCity, filters, landTypes, purposes, isMobile, handleFilterChange, handleResetFilters, handleApplyFilters]);

  // ---------------------- المزادات ----------------------
  const AuctionFiltersContent = useMemo(() => () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex flex-wrap -mx-2 mb-4">
        {RegionCity()}

        <div className="mb-4 md:mb-0 md:w-1/2 px-2">
          <label className="block text-sm font-medium text-gray-700 mb-1 text-right">البحث في المزادات</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            placeholder="عنوان أو وصف المزاد"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
          />
        </div>

        {!isMobile && (
          <>
            <div className="mb-4 md:mb-0 md:w-1/4 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اسم الشركة</label>
              <input 
                type="text" 
                name="company" 
                value={filters.company} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                placeholder="اسم الشركة"
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/4 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">العنوان</label>
              <input 
                type="text" 
                name="address" 
                value={filters.address} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                placeholder="العنوان"
              />
            </div>
          </>
        )}
      </div>

      <div className="flex flex-wrap -mx-2 mb-4">
        {!isMobile && (
          <>
            <div className="mb-4 md:mb-0 md:w-1/4 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">من تاريخ</label>
              <input 
                type="date" 
                name="date_from" 
                value={filters.date_from} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/4 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">إلى تاريخ</label>
              <input 
                type="date" 
                name="date_to" 
                value={filters.date_to} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              />
            </div>

            {auctionStatuses.length > 0 && (
              <div className="mb-4 md:mb-0 md:w-1/4 px-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">حالة المزاد</label>
                <select 
                  name="auction_status" 
                  value={filters.auction_status} 
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
                >
                  <option value="">جميع الحالات</option>
                  {auctionStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}

        {isMobile && (
          <>
            <div className="mb-4 md:mb-0 md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">اسم الشركة</label>
              <input 
                type="text" 
                name="company" 
                value={filters.company} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                placeholder="اسم الشركة"
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">العنوان</label>
              <input 
                type="text" 
                name="address" 
                value={filters.address} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
                placeholder="العنوان"
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">من تاريخ</label>
              <input 
                type="date" 
                name="date_from" 
                value={filters.date_from} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              />
            </div>

            <div className="mb-4 md:mb-0 md:w-1/2 px-2">
              <label className="block text-sm font-medium text-gray-700 mb-1 text-right">إلى تاريخ</label>
              <input 
                type="date" 
                name="date_to" 
                value={filters.date_to} 
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right"
              />
            </div>

            {auctionStatuses.length > 0 && (
              <div className="mb-4 md:mb-0 md:w-full px-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 text-right">حالة المزاد</label>
                <select 
                  name="auction_status" 
                  value={filters.auction_status} 
                  onChange={handleFilterChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all rtl text-right bg-white"
                >
                  <option value="">جميع الحالات</option>
                  {auctionStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-between pt-4 border-t border-gray-200">
        <button 
          className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm"
          onClick={handleResetFilters}
        >
          إعادة تعيين
        </button>
        <button 
          className="px-6 py-2 bg-[#53a1dd] text-white font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md"
          onClick={handleApplyFilters}
        >
          تطبيق الفلتر
        </button>
      </div>
    </div>
  ), [RegionCity, filters, auctionStatuses, isMobile, handleFilterChange, handleResetFilters, handleApplyFilters]);

  // اختيار المحتوى حسب التاب
  switch (activeTab) {
    case 'requests':
      return LandRequestsFiltersContent();
    case 'lands':
      return LandFiltersContent();
    case 'auctions':
      return AuctionFiltersContent();
    default:
      return LandFiltersContent();
  }
});

FiltersComponent.displayName = 'FiltersComponent';

export default FiltersComponent;