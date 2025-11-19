// src/components/FiltersComponent.js
import React from 'react';
import Icons from '../icons/index';
import { locationService } from '../utils/LocationForFiltters';
import '../styles/PropertyList.css';

const FiltersComponent = ({
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
  const availableRegions = locationService.getRegions();
  const availableCities = locationService.getCitiesByRegion();

  // 🔹 مكوّن اختيار المنطقة + المدينة (يستخدم فقط في الأراضي والطلبات)
  const RegionCity = () => (
    <>
      <div className="shahinFilter_group">
        <label>المنطقة</label>
        <select name="region" value={filters.region} onChange={onFilterChange}>
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
          onChange={onFilterChange}
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
  );

  // ---------------------- الطلبات ----------------------
  const LandRequestsFiltersContent = () => (
    <div className="shahinFilters_content">

      <div className="shahinFilters_row">
        <RegionCity />

        <div className="shahinFilter_group">
          <label>الغرض</label>
          <select name="purpose" value={filters.purpose} onChange={onFilterChange}>
            <option value="">الكل</option>
            <option value="sale">بيع</option>
            <option value="investment">استثمار</option>
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>النوع</label>
          <select name="type" value={filters.type} onChange={onFilterChange}>
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
            onChange={onFilterChange}
          />
        </div>

        <div className="shahinFilter_group">
          <label>المساحة إلى (م²)</label>
          <input
            type="number"
            name="area_max"
            value={filters.area_max}
            onChange={onFilterChange}
          />
        </div>

        {showSearch && (
          <div className="shahinFilter_group">
            <label>بحث</label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={onFilterChange}
              placeholder="ابحث في الطلبات..."
            />
          </div>
        )}
      </div>

      <div className="shahinFilter_actions">
        <button className="shahinApply_btn" onClick={onApplyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // ---------------------- الأراضي ----------------------
  const LandFiltersContent = () => (
    <div className="shahinFilters_content">
      <div className="shahinFilters_row">

        <RegionCity />

        <div className="shahinFilter_group">
          <label>نوع الأرض</label>
          <select name="land_type" value={filters.land_type} onChange={onFilterChange}>
            <option value="">كل الأنواع</option>
            {landTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="shahinFilter_group">
          <label>الغرض</label>
          <select name="purpose" value={filters.purpose} onChange={onFilterChange}>
            <option value="">جميع الأغراض</option>
            {purposes.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {window.innerWidth >= 768 && (
          <>
            <div className="shahinFilter_group">
              <label>المساحة من</label>
              <input type="number" name="min_area" value={filters.min_area} onChange={onFilterChange} />
            </div>

            <div className="shahinFilter_group">
              <label>المساحة إلى</label>
              <input type="number" name="max_area" value={filters.max_area} onChange={onFilterChange} />
            </div>
          </>
        )}
      </div>

      {window.innerWidth < 768 && (
        <div className="shahinFilters_row">

          <div className="shahinFilter_group">
            <label>المساحة من</label>
            <input type="number" name="min_area" value={filters.min_area} onChange={onFilterChange} />
          </div>

          <div className="shahinFilter_group">
            <label>المساحة إلى</label>
            <input type="number" name="max_area" value={filters.max_area} onChange={onFilterChange} />
          </div>

          {filters.purpose !== 'استثمار' && (
            <>
              <div className="shahinFilter_group">
                <label>السعر من</label>
                <input type="number" name="min_price" value={filters.min_price} onChange={onFilterChange} />
              </div>

              <div className="shahinFilter_group">
                <label>السعر إلى</label>
                <input type="number" name="max_price" value={filters.max_price} onChange={onFilterChange} />
              </div>
            </>
          )}
        </div>
      )}

      <div className="shahinFilter_actions">
        <button className="shahinReset_btn" onClick={onResetFilters}>إعادة تعيين</button>
        <button className="shahinApply_btn" onClick={onApplyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // ---------------------- المزادات ----------------------
  const AuctionFiltersContent = () => (
    <div className="shahinFilters_content">
      <div className="shahinFilters_row">
        {/* تم إزالة RegionCity من هنا */}

<RegionCity />

        <div className="shahinFilter_group">
          <label>البحث في المزادات</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={onFilterChange}
            placeholder="عنوان أو وصف المزاد"
          />
        </div>

        {window.innerWidth >= 768 && (
          <>
            <div className="shahinFilter_group">
              <label>اسم الشركة</label>
              <input type="text" name="company" value={filters.company} onChange={onFilterChange} />
            </div>

            <div className="shahinFilter_group">
              <label>العنوان</label>
              <input type="text" name="address" value={filters.address} onChange={onFilterChange} />
            </div>

            <div className="shahinFilter_group">
              <label>من تاريخ</label>
              <input type="date" name="date_from" value={filters.date_from} onChange={onFilterChange} />
            </div>
          </>
        )}
      </div>

      {window.innerWidth < 768 && (
        <div className="shahinFilters_row">
          <div className="shahinFilter_group">
            <label>اسم الشركة</label>
            <input type="text" name="company" value={filters.company} onChange={onFilterChange} />
          </div>

          <div className="shahinFilter_group">
            <label>العنوان</label>
            <input type="text" name="address" value={filters.address} onChange={onFilterChange} />
          </div>

          <div className="shahinFilter_group">
            <label>من تاريخ</label>
            <input type="date" name="date_from" value={filters.date_from} onChange={onFilterChange} />
          </div>

          <div className="shahinFilter_group">
            <label>إلى تاريخ</label>
            <input type="date" name="date_to" value={filters.date_to} onChange={onFilterChange} />
          </div>
        </div>
      )}

      {window.innerWidth >= 768 && (
        <div className="shahinFilters_row">
          <div className="shahinFilter_group">
            <label>إلى تاريخ</label>
            <input type="date" name="date_to" value={filters.date_to} onChange={onFilterChange} />
          </div>

          {/* إضافة فلاتر إضافية للمزادات بدلاً من المنطقة والمدينة */}
          {/* <div className="shahinFilter_group">
            <label>حالة المزاد</label>
            <select name="auction_status" value={filters.auction_status} onChange={onFilterChange}>
              <option value="">جميع الحالات</option>
              <option value="active">مزادات نشطة</option>
              <option value="upcoming">مزادات قادمة</option>
              <option value="ended">مزادات منتهية</option>
            </select>
          </div> */}

          {/* <div className="shahinFilter_group">
            <label>ترتيب حسب</label>
            <select name="sort_by" value={filters.sort_by} onChange={onFilterChange}>
              <option value="">الافتراضي</option>
              <option value="date_asc">الأقدم أولاً</option>
              <option value="date_desc">الأحدث أولاً</option>
              <option value="title_asc">بالاسم (أ-ي)</option>
              <option value="title_desc">بالاسم (ي-أ)</option>
            </select>
          </div> */}
        </div>
      )}

      <div className="shahinFilter_actions">
        <button className="shahinReset_btn" onClick={onResetFilters}>إعادة تعيين</button>
        <button className="shahinApply_btn" onClick={onApplyFilters}>تطبيق الفلتر</button>
      </div>
    </div>
  );

  // اختيار المحتوى حسب التاب
  switch (activeTab) {
    case 'requests':
      return <LandRequestsFiltersContent />;
    case 'lands':
      return <LandFiltersContent />;
    case 'auctions':
      return <AuctionFiltersContent />;
    default:
      return <LandFiltersContent />;
  }
};

export default FiltersComponent;