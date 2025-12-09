// src/components/FiltersComponent.js
import React, { memo, useMemo, useCallback } from 'react';
import Icons from '../icons/index';
import { locationService } from '../utils/LocationForFiltters';
import '../styles/PropertyList.css';

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

  // 🔹 مكوّن اختيار المنطقة + المدينة (ميمويز لمنع إعادة التصيير)
  const RegionCity = useMemo(() => () => (
    <>
      <div className="shahinFilter_group">
        <label>المنطقة</label>
        <select name="region" value={filters.region} onChange={handleFilterChange}>
          <option value="">كل المناطق</option>
          {availableRegions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>

      <div className="shahinFilter_group">
        <label>المدينة</label>
        <select
          name="city"
          value={filters.city}
          onChange={handleFilterChange}
          disabled={!filters.region}
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
    <div className="shahinFilters_content">
      <div className="shahinFilters_row">
        {RegionCity()}

        <div className="shahinFilter_group">
          <label>الغرض</label>
          <select name="purpose" value={filters.purpose} onChange={handleFilterChange}>
            <option value="">الكل</option>
            <option value="sale">بيع</option>
            <option value="investment">استثمار</option>
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>النوع</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">الكل</option>
            <option value="residential">سكني</option>
            <option value="commercial">تجاري</option>
            <option value="agricultural">زراعي</option>
          </select>
        </div>
      </div>

      <div className="shahinFilters_row">
        <div className="shahinFilter_group">
          <label>المساحة من (م²)</label>
          <input
            type="number"
            name="area_min"
            value={filters.area_min}
            onChange={handleFilterChange}
          />
        </div>

        <div className="shahinFilter_group">
          <label>المساحة إلى (م²)</label>
          <input
            type="number"
            name="area_max"
            value={filters.area_max}
            onChange={handleFilterChange}
          />
        </div>

        {showSearch && (
          <div className="shahinFilter_group">
            <label>بحث</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="ابحث في الطلبات..."
            />
          </div>
        )}
      </div>

      <div className="shahinFilter_actions">
        <button className="shahinApply_btn" onClick={handleApplyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  ), [RegionCity, filters, showSearch, handleFilterChange, handleApplyFilters]);

  // ---------------------- الأراضي ----------------------
  const LandFiltersContent = useMemo(() => () => {
    const isMobile = window.innerWidth < 768;
    
    return (
      <div className="shahinFilters_content">
        <div className="shahinFilters_row">
          {RegionCity()}

          <div className="shahinFilter_group">
            <label>نوع الأرض</label>
            <select name="land_type" value={filters.land_type} onChange={handleFilterChange}>
              <option value="">كل الأنواع</option>
              {landTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="shahinFilter_group">
            <label>الغرض</label>
            <select name="purpose" value={filters.purpose} onChange={handleFilterChange}>
              <option value="">جميع الأغراض</option>
              {purposes.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {!isMobile && (
            <>
              <div className="shahinFilter_group">
                <label>المساحة من</label>
                <input 
                  type="number" 
                  name="min_area" 
                  value={filters.min_area} 
                  onChange={handleFilterChange} 
                />
              </div>

              <div className="shahinFilter_group">
                <label>المساحة إلى</label>
                <input 
                  type="number" 
                  name="max_area" 
                  value={filters.max_area} 
                  onChange={handleFilterChange} 
                />
              </div>
            </>
          )}
        </div>

        {isMobile && (
          <div className="shahinFilters_row">
            <div className="shahinFilter_group">
              <label>المساحة من</label>
              <input 
                type="number" 
                name="min_area" 
                value={filters.min_area} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="shahinFilter_group">
              <label>المساحة إلى</label>
              <input 
                type="number" 
                name="max_area" 
                value={filters.max_area} 
                onChange={handleFilterChange} 
              />
            </div>

            {filters.purpose !== 'استثمار' && (
              <>
                <div className="shahinFilter_group">
                  <label>السعر من</label>
                  <input 
                    type="number" 
                    name="min_price" 
                    value={filters.min_price} 
                    onChange={handleFilterChange} 
                  />
                </div>

                <div className="shahinFilter_group">
                  <label>السعر إلى</label>
                  <input 
                    type="number" 
                    name="max_price" 
                    value={filters.max_price} 
                    onChange={handleFilterChange} 
                  />
                </div>
              </>
            )}
          </div>
        )}

        <div className="shahinFilter_actions">
          <button className="shahinReset_btn" onClick={handleResetFilters}>إعادة تعيين</button>
          <button className="shahinApply_btn" onClick={handleApplyFilters}>تطبيق الفلتر</button>
        </div>
      </div>
    );
  }, [RegionCity, filters, landTypes, purposes, handleFilterChange, handleResetFilters, handleApplyFilters]);

  // ---------------------- المزادات ----------------------
  const AuctionFiltersContent = useMemo(() => () => {
    const isMobile = window.innerWidth < 768;
    
    return (
      <div className="shahinFilters_content">
        <div className="shahinFilters_row">
          {RegionCity()}

          <div className="shahinFilter_group">
            <label>البحث في المزادات</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="عنوان أو وصف المزاد"
            />
          </div>

          {!isMobile && (
            <>
              <div className="shahinFilter_group">
                <label>اسم الشركة</label>
                <input 
                  type="text" 
                  name="company" 
                  value={filters.company} 
                  onChange={handleFilterChange} 
                />
              </div>

              <div className="shahinFilter_group">
                <label>العنوان</label>
                <input 
                  type="text" 
                  name="address" 
                  value={filters.address} 
                  onChange={handleFilterChange} 
                />
              </div>

              <div className="shahinFilter_group">
                <label>من تاريخ</label>
                <input 
                  type="date" 
                  name="date_from" 
                  value={filters.date_from} 
                  onChange={handleFilterChange} 
                />
              </div>
            </>
          )}
        </div>

        {isMobile && (
          <div className="shahinFilters_row">
            <div className="shahinFilter_group">
              <label>اسم الشركة</label>
              <input 
                type="text" 
                name="company" 
                value={filters.company} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="shahinFilter_group">
              <label>العنوان</label>
              <input 
                type="text" 
                name="address" 
                value={filters.address} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="shahinFilter_group">
              <label>من تاريخ</label>
              <input 
                type="date" 
                name="date_from" 
                value={filters.date_from} 
                onChange={handleFilterChange} 
              />
            </div>

            <div className="shahinFilter_group">
              <label>إلى تاريخ</label>
              <input 
                type="date" 
                name="date_to" 
                value={filters.date_to} 
                onChange={handleFilterChange} 
              />
            </div>
          </div>
        )}

        {!isMobile && (
          <div className="shahinFilters_row">
            <div className="shahinFilter_group">
              <label>إلى تاريخ</label>
              <input 
                type="date" 
                name="date_to" 
                value={filters.date_to} 
                onChange={handleFilterChange} 
              />
            </div>

            {auctionStatuses.length > 0 && (
              <div className="shahinFilter_group">
                <label>حالة المزاد</label>
                <select name="auction_status" value={filters.auction_status} onChange={handleFilterChange}>
                  <option value="">جميع الحالات</option>
                  {auctionStatuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        <div className="shahinFilter_actions">
          <button className="shahinReset_btn" onClick={handleResetFilters}>إعادة تعيين</button>
          <button className="shahinApply_btn" onClick={handleApplyFilters}>تطبيق الفلتر</button>
        </div>
      </div>
    );
  }, [RegionCity, filters, auctionStatuses, handleFilterChange, handleResetFilters, handleApplyFilters]);

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