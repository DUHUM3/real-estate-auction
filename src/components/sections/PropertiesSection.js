import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../icons/index';
import LandCard from '../LandCard';
import AuctionCard from '../AuctionCard';

const PropertiesSection = ({ onToggleFavorite, onPropertyClick }) => {
  const navigate = useNavigate();
  const [lands, setLands] = useState([]);
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState({
    lands: false,
    auctions: false
  });
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);
  const [filterType, setFilterType] = useState('lands');
  const [filtersApplied, setFiltersApplied] = useState([]);

  const [landFilter, setLandFilter] = useState({
    propertyType: '',
    city: '',
    region: '',
    purpose: '',
    minPrice: '',
    maxPrice: '',
    area: ''
  });

  const [auctionFilter, setAuctionFilter] = useState({
    city: '',
    region: '',
    startDate: '',
    endDate: '',
    maxDaysLeft: ''
  });

  // دوال جلب البيانات
  const fetchLands = async () => {
    setIsLoading(prev => ({ ...prev, lands: true }));
    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/properties/properties/latest');
      const data = await response.json();

      if (data.status && data.data) {
        const formattedLands = data.data.data.map(land => ({
          id: land.id,
          img: land.cover_image && land.cover_image !== 'default_cover.jpg'
            ? `https://shahin-tqay.onrender.com/storage/${land.cover_image}`
            : null,
          title: land.title,
          location: `${land.region}، ${land.city}`,
          price: land.price_per_sqm
            ? `${parseFloat(land.price_per_sqm).toLocaleString('ar-SA')}`
            : land.estimated_investment_value
              ? `${parseFloat(land.estimated_investment_value).toLocaleString('ar-SA')}`
              : 'غير محدد',
          area: parseFloat(land.total_area).toLocaleString('ar-SA'),
          landType: land.land_type,
          purpose: land.purpose,
          status: land.status,
          is_favorite: land.is_favorite || false
        }));
        setLands(formattedLands);
        setFiltersApplied(data.filters_applied || []);
      }
    } catch (error) {
      console.error('Error fetching lands:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, lands: false }));
    }
  };

  const fetchAuctions = async () => {
    setIsLoading(prev => ({ ...prev, auctions: true }));
    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/properties/auctions/latest');
      const data = await response.json();

      if (data.success && data.data) {
        const formattedAuctions = data.data.map(auction => {
          const auctionDate = new Date(auction.auction_date);
          const today = new Date();
          const daysLeft = Math.ceil((auctionDate - today) / (1000 * 60 * 60 * 24));

          return {
            id: auction.id,
            img: auction.cover_image && auction.cover_image !== 'default_cover.jpg'
              ? `https://shahin-tqay.onrender.com/storage/${auction.cover_image}`
              : null,
            title: auction.title,
            location: auction.address,
            area: "غير محدد",
            endDate: auction.auction_date,
            auctionCompany: auction.company?.auction_name || 'شركة المزاد',
            daysLeft: daysLeft > 0 ? daysLeft : 0,
            startTime: auction.start_time,
            auctionDate: auction.auction_date,
            isFavorite: auction.is_favorite || false
          };
        });
        setAuctions(formattedAuctions);
      }
    } catch (error) {
      console.error('Error fetching auctions:', error);
    } finally {
      setIsLoading(prev => ({ ...prev, auctions: false }));
    }
  };

  useEffect(() => {
    fetchLands();
    fetchAuctions();
  }, []);

  const handleLandFilterChange = (field, value) => {
    setLandFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAuctionFilterChange = (field, value) => {
    setAuctionFilter(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    if (filterType === 'lands') {
      fetchLands();
    } else {
      fetchAuctions();
    }
    setShowFilter(false);
  };

  const displayedItems = filterType === 'lands' ? lands : auctions;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = displayedItems.slice(startIndex, endIndex);

  return (
    <section className="properties-section" id="properties">
      <div className="container">
        <div className="section-header">
          {filtersApplied.length > 0 && (
            <div className="filters-applied">
              <span>الفلاتر المطبقة: {filtersApplied.join('، ')}</span>
            </div>
          )}
        </div>

        <div className="properties-header">
          <div className="properties-tabs">
            <button
              className={`tab-button ${filterType === 'lands' ? 'active' : ''}`}
              onClick={() => {
                setFilterType('lands');
                setCurrentPage(0);
                setShowFilter(false);
              }}
            >
              الأراضي
            </button>
            <button
              className={`tab-button ${filterType === 'auctions' ? 'active' : ''}`}
              onClick={() => {
                setFilterType('auctions');
                setCurrentPage(0);
                setShowFilter(false);
              }}
            >
              المزادات
            </button>
          </div>

          <button
            className="filter-toggle-btn"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Icons.FaFilter />
            {showFilter ? 'إخفاء الفلتر' : 'عرض الفلتر'}
          </button>
        </div>

        <div className={`advanced-filter ${showFilter ? 'show' : ''}`}>
          {/* محتوى الفلاتر - يمكن تقسيمه لمزيد من التنظيم */}
          <div className="filter-content">
            {filterType === 'lands' ? (
              <LandFilter 
                filter={landFilter}
                onChange={handleLandFilterChange}
              />
            ) : (
              <AuctionFilter 
                filter={auctionFilter}
                onChange={handleAuctionFilterChange}
              />
            )}
            
            <div className="filter-actions">
              <button className="filter-btn" onClick={applyFilters}>تطبيق الفلتر</button>
              <button
                className="reset-btn"
                onClick={() => {
                  if (filterType === 'lands') {
                    setLandFilter({
                      propertyType: '',
                      city: '',
                      region: '',
                      purpose: '',
                      minPrice: '',
                      maxPrice: '',
                      area: ''
                    });
                  } else {
                    setAuctionFilter({
                      city: '',
                      region: '',
                      startDate: '',
                      endDate: '',
                      maxDaysLeft: ''
                    });
                  }
                }}
              >
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>

        <div className="properties-container">
          {isLoading.lands || isLoading.auctions ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              {filterType === 'lands' ? 'جاري تحميل الأراضي...' : 'جاري تحميل المزادات...'}
            </div>
          ) : (
            <>
              <div className="properties-grid">
                {currentItems.length > 0 ? (
                  currentItems.map(item => (
                    filterType === 'lands' ? (
                      <LandCard
                        key={item.id}
                        {...item}
                        onClick={onPropertyClick}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={item.is_favorite || false}
                      />
                    ) : (
                      <AuctionCard
                        key={item.id}
                        {...item}
                        onClick={onPropertyClick}
                        onToggleFavorite={onToggleFavorite}
                        isFavorite={item.is_favorite || false}
                      />
                    )
                  ))
                ) : (
                  <div className="no-data">
                    <p>لا توجد {filterType === 'lands' ? 'أراضي' : 'مزادات'} متاحة في الوقت الحالي</p>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="view-all">
            <button
              className="view-all-btn"
              onClick={() => {
                if (filterType === 'lands') {
                  navigate('/lands-and-auctions-list');
                } else {
                  navigate('/lands-and-auctions-list', {
                    state: {
                      activeTab: 'auctions'
                    }
                  });
                }
              }}
            >
              عرض الكل
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// مكونات الفلاتر المساعدة
const LandFilter = ({ filter, onChange }) => (
  <div className="filter-section">
    <div className="filter-row">
      <div className="filter-group">
        <select
          value={filter.propertyType}
          onChange={(e) => onChange('propertyType', e.target.value)}
        >
          <option value="">نوع العقار</option>
          <option value="سكني">سكني</option>
          <option value="تجاري">تجاري</option>
          <option value="زراعي">زراعي</option>
          <option value="صناعي">صناعي</option>
          <option value="مختلط">مختلط</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          value={filter.city}
          onChange={(e) => onChange('city', e.target.value)}
        >
          <option value="">المدينة</option>
          <option value="الرياض">الرياض</option>
          <option value="جدة">جدة</option>
          <option value="الدمام">الدمام</option>
          <option value="مكة">مكة المكرمة</option>
          <option value="المدينة">المدينة المنورة</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          value={filter.region}
          onChange={(e) => onChange('region', e.target.value)}
        >
          <option value="">المنطقة</option>
          <option value="الرياض">منطقة الرياض</option>
          <option value="مكة">منطقة مكة المكرمة</option>
          <option value="الشرقية">المنطقة الشرقية</option>
          <option value="عسير">منطقة عسير</option>
          <option value="الجوف">منطقة الجوف</option>
        </select>
      </div>

      <div className="filter-group">
        <select
          value={filter.purpose}
          onChange={(e) => onChange('purpose', e.target.value)}
        >
          <option value="">الغرض من العقار</option>
          <option value="بيع">بيع</option>
          <option value="استثمار">استثمار</option>
        </select>
      </div>

      <div className="filter-group price-inputs">
        <label>نطاق السعر (ريال)</label>
        <div className="price-inputs-row">
          <input
            type="number"
            value={filter.minPrice}
            onChange={(e) => onChange('minPrice', e.target.value)}
            placeholder="الحد الأدنى"
            min="0"
          />
          <span className="price-separator">-</span>
          <input
            type="number"
            value={filter.maxPrice}
            onChange={(e) => onChange('maxPrice', e.target.value)}
            placeholder="الحد الأقصى"
            min="0"
          />
        </div>
      </div>

      <div className="filter-group">
        <select
          value={filter.area}
          onChange={(e) => onChange('area', e.target.value)}
        >
          <option value="">المساحة</option>
          <option value="0-500">حتى 5000 م²</option>
          <option value="500-1000">5000 - 10,000 م²</option>
          <option value="1000-5000">10,000 - 50,000 م²</option>
          <option value="5000+">أكثر من 50,000 م²</option>
        </select>
      </div>
    </div>
  </div>
);

const AuctionFilter = ({ filter, onChange }) => (
  <div className="filter-section">
    <div className="filter-header">
      <h4>فلتر المزادات</h4>
    </div>
    <div className="filter-row">
      <div className="filter-group">
        <label className="filter-label">المدينة</label>
        <select
          value={filter.city}
          onChange={(e) => onChange('city', e.target.value)}
        >
          <option value="">اختر المدينة</option>
          <option value="الرياض">الرياض</option>
          <option value="جدة">جدة</option>
          <option value="الدمام">الدمام</option>
          <option value="مكة">مكة المكرمة</option>
          <option value="المدينة">المدينة المنورة</option>
          <option value="الخبر">الخبر</option>
          <option value="الطائف">الطائف</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">المنطقة</label>
        <select
          value={filter.region}
          onChange={(e) => onChange('region', e.target.value)}
        >
          <option value="">اختر المنطقة</option>
          <option value="الرياض">منطقة الرياض</option>
          <option value="مكة">منطقة مكة المكرمة</option>
          <option value="الشرقية">المنطقة الشرقية</option>
          <option value="المدينة">منطقة المدينة المنورة</option>
          <option value="القصيم">منطقة القصيم</option>
          <option value="عسير">منطقة عسير</option>
          <option value="تبوك">منطقة تبوك</option>
          <option value="حائل">منطقة حائل</option>
          <option value="الحدود الشمالية">الحدود الشمالية</option>
          <option value="جازان">منطقة جازان</option>
          <option value="نجران">منطقة نجران</option>
          <option value="الباحة">منطقة الباحة</option>
          <option value="الجوف">منطقة الجوف</option>
        </select>
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <Icons.FaCalendarAlt className="label-icon" />
          تاريخ بداية المزاد
        </label>
        <input
          type="date"
          value={filter.startDate}
          onChange={(e) => onChange('startDate', e.target.value)}
          className="date-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <Icons.FaCalendarAlt className="label-icon" />
          تاريخ نهاية المزاد
        </label>
        <input
          type="date"
          value={filter.endDate}
          onChange={(e) => onChange('endDate', e.target.value)}
          className="date-input"
        />
      </div>

      <div className="filter-group">
        <label className="filter-label">
          <Icons.FaClock className="label-icon" />
          المدة المتبقية
        </label>
        <select
          value={filter.maxDaysLeft}
          onChange={(e) => onChange('maxDaysLeft', e.target.value)}
        >
          <option value="">جميع المدد</option>
          <option value="1">ينتهي خلال 24 ساعة</option>
          <option value="3">ينتهي خلال 3 أيام</option>
          <option value="7">ينتهي خلال أسبوع</option>
          <option value="15">ينتهي خلال أسبوعين</option>
          <option value="30">ينتهي خلال شهر</option>
        </select>
      </div>
    </div>
  </div>
);

export default PropertiesSection;