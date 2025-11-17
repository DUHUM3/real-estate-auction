import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../icons/index';
import LandCard from '../LandCard';
import AuctionCard from '../AuctionCard';
import FiltersComponent from '../../utils/FiltersComponent'; // استيراد مكون الفلاتر

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

  // حالة موحدة للفلاتر
  const [filters, setFilters] = useState({
    // فلتر الأراضي
    propertyType: '',
    city: '',
    region: '',
    purpose: '',
    minPrice: '',
    maxPrice: '',
    area: '',
    land_type: '',
    min_area: '',
    max_area: '',
    
    // فلتر المزادات
    startDate: '',
    endDate: '',
    maxDaysLeft: '',
    search: '',
    company: '',
    address: '',
    date_from: '',
    date_to: ''
  });

  // دوال جلب البيانات
  const fetchLands = async (filterParams = {}) => {
    setIsLoading(prev => ({ ...prev, lands: true }));
    try {
      // بناء query parameters بناءً على الفلاتر
      const queryParams = new URLSearchParams();
      
      if (filterParams.region) queryParams.append('region', filterParams.region);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.land_type) queryParams.append('land_type', filterParams.land_type);
      if (filterParams.purpose) queryParams.append('purpose', filterParams.purpose);
      if (filterParams.min_area) queryParams.append('min_area', filterParams.min_area);
      if (filterParams.max_area) queryParams.append('max_area', filterParams.max_area);
      if (filterParams.minPrice) queryParams.append('min_price', filterParams.minPrice);
      if (filterParams.maxPrice) queryParams.append('max_price', filterParams.maxPrice);
      
      const url = `https://shahin-tqay.onrender.com/api/properties/properties/latest${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
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

  const fetchAuctions = async (filterParams = {}) => {
    setIsLoading(prev => ({ ...prev, auctions: true }));
    try {
      // بناء query parameters بناءً على الفلاتر
      const queryParams = new URLSearchParams();
      
      if (filterParams.region) queryParams.append('region', filterParams.region);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.search) queryParams.append('search', filterParams.search);
      if (filterParams.company) queryParams.append('company', filterParams.company);
      if (filterParams.address) queryParams.append('address', filterParams.address);
      if (filterParams.date_from) queryParams.append('date_from', filterParams.date_from);
      if (filterParams.date_to) queryParams.append('date_to', filterParams.date_to);
      
      const url = `https://shahin-tqay.onrender.com/api/properties/auctions/latest${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
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

  // معالج تغيير الفلاتر
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // تطبيق الفلاتر
  const applyFilters = () => {
    if (filterType === 'lands') {
      fetchLands(filters);
    } else {
      fetchAuctions(filters);
    }
    setShowFilter(false);
  };

  // إعادة تعيين الفلاتر
  const resetFilters = () => {
    setFilters({
      propertyType: '',
      city: '',
      region: '',
      purpose: '',
      minPrice: '',
      maxPrice: '',
      area: '',
      land_type: '',
      min_area: '',
      max_area: '',
      startDate: '',
      endDate: '',
      maxDaysLeft: '',
      search: '',
      company: '',
      address: '',
      date_from: '',
      date_to: ''
    });
    
    // إعادة تحميل البيانات بدون فلاتر
    if (filterType === 'lands') {
      fetchLands();
    } else {
      fetchAuctions();
    }
  };

  const displayedItems = filterType === 'lands' ? lands : auctions;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = displayedItems.slice(startIndex, endIndex);

  // بيانات للفلاتر
  const landTypes = ['سكني', 'تجاري', 'زراعي', 'صناعي', 'مختلط'];
  const purposes = ['بيع', 'استثمار'];

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
          {/* استخدام مكون الفلاتر الموحد */}
          <FiltersComponent
            activeTab={filterType === 'lands' ? 'lands' : 'auctions'}
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilters={resetFilters}
            onApplyFilters={applyFilters}
            landTypes={landTypes}
            purposes={purposes}
            showSearch={true}
          />
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

export default PropertiesSection;