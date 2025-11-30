import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Icons from '../../icons/index';
import LandCard from '../LandCard';
import AuctionCard from '../AuctionCard';
import FiltersComponent from '../../utils/FiltersComponent';
import PropertiesSkeleton from '../../Skeleton/PropertiesSkeleton';

const PropertiesSection = ({ onToggleFavorite, onPropertyClick }) => {
  const navigate = useNavigate();
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(6);
  const [filterType, setFilterType] = useState('lands');
  
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

  // دالة لبناء query parameters
  const buildQueryParams = (filterParams, type) => {
    const queryParams = new URLSearchParams();
    
    if (type === 'lands') {
      if (filterParams.region) queryParams.append('region', filterParams.region);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.land_type) queryParams.append('land_type', filterParams.land_type);
      if (filterParams.purpose) queryParams.append('purpose', filterParams.purpose);
      if (filterParams.min_area) queryParams.append('min_area', filterParams.min_area);
      if (filterParams.max_area) queryParams.append('max_area', filterParams.max_area);
      if (filterParams.minPrice) queryParams.append('min_price', filterParams.minPrice);
      if (filterParams.maxPrice) queryParams.append('max_price', filterParams.maxPrice);
    } else {
      if (filterParams.region) queryParams.append('region', filterParams.region);
      if (filterParams.city) queryParams.append('city', filterParams.city);
      if (filterParams.search) queryParams.append('search', filterParams.search);
      if (filterParams.company) queryParams.append('company', filterParams.company);
      if (filterParams.address) queryParams.append('address', filterParams.address);
      if (filterParams.date_from) queryParams.append('date_from', filterParams.date_from);
      if (filterParams.date_to) queryParams.append('date_to', filterParams.date_to);
    }
    
    return queryParams.toString();
  };

  // استخدام React Query لجلب بيانات الأراضي
  const { 
    data: landsData, 
    isLoading: landsLoading, 
    error: landsError,
    refetch: refetchLands 
  } = useQuery({
    queryKey: ['lands', filters],
    queryFn: async () => {
      const queryParams = buildQueryParams(filters, 'lands');
      const url = `https://core-api-x41.shaheenplus.sa/api/properties/properties/latest${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.status && data.data) {
        return {
          lands: data.data.data.map(land => ({
            id: land.id,
            img: land.cover_image && land.cover_image !== 'default_cover.jpg'
              ? `https://core-api-x41.shaheenplus.sa/storage/${land.cover_image}`
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
          })),
          filtersApplied: data.filters_applied || []
        };
      }
      throw new Error('Failed to fetch lands');
    },
    enabled: filterType === 'lands'
  });

  // استخدام React Query لجلب بيانات المزادات
  const { 
    data: auctionsData, 
    isLoading: auctionsLoading, 
    error: auctionsError,
    refetch: refetchAuctions 
  } = useQuery({
    queryKey: ['auctions', filters],
    queryFn: async () => {
      const queryParams = buildQueryParams(filters, 'auctions');
      const url = `https://core-api-x41.shaheenplus.sa/api/properties/auctions/latest${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      const data = await response.json();

      if (data.success && data.data) {
        return {
          auctions: data.data.map(auction => {
            const auctionDate = new Date(auction.auction_date);
            const today = new Date();
            const daysLeft = Math.ceil((auctionDate - today) / (1000 * 60 * 60 * 24));

            return {
              id: auction.id,
              img: auction.cover_image && auction.cover_image !== 'default_cover.jpg'
                ? `https://core-api-x41.shaheenplus.sa/storage/${auction.cover_image}`
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
          })
        };
      }
      throw new Error('Failed to fetch auctions');
    },
    enabled: filterType === 'auctions'
  });

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
      refetchLands();
    } else {
      refetchAuctions();
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
    setTimeout(() => {
      if (filterType === 'lands') {
        refetchLands();
      } else {
        refetchAuctions();
      }
    }, 100);
  };

  const lands = landsData?.lands || [];
  const auctions = auctionsData?.auctions || [];
  const displayedItems = filterType === 'lands' ? lands : auctions;
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = displayedItems.slice(startIndex, endIndex);

  const isLoading = filterType === 'lands' ? landsLoading : auctionsLoading;

  // بيانات للفلاتر
  const landTypes = ['سكني', 'تجاري', 'زراعي', 'صناعي', 'مختلط'];
  const purposes = ['بيع', 'استثمار'];

  return (
    <section className="py-20 bg-gray-50" id="properties">
      <div className="container mx-auto px-4">
        {/* الفلاتر المطبقة */}
        <div className="mb-6">
          {landsData?.filtersApplied && landsData.filtersApplied.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
              <span className="text-blue-400 text-sm">
                الفلاتر المطبقة: {landsData.filtersApplied.join('، ')}
              </span>
            </div>
          )}
        </div>

        {/* الهيدر */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* التبويبات */}
          <div className="flex border-b border-gray-200">
            <button
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${
                filterType === 'lands' 
                  ? 'border-blue-400 text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setFilterType('lands');
                setCurrentPage(0);
                setShowFilter(false);
              }}
            >
              الأراضي
            </button>
            <button
              className={`px-6 py-3 font-medium text-lg border-b-2 transition-colors duration-200 ${
                filterType === 'auctions' 
                  ? 'border-blue-400 text-blue-400' 
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => {
                setFilterType('auctions');
                setCurrentPage(0);
                setShowFilter(false);
              }}
            >
              المزادات
            </button>
          </div>

          {/* زر الفلتر */}
          <button
            className="flex items-center gap-2 bg-blue-400 text-white px-6 py-3 rounded-lg hover:bg-blue-400 transition-colors duration-200 font-medium"
            onClick={() => setShowFilter(!showFilter)}
          >
            <Icons.FaFilter className="text-sm" />
            {showFilter ? 'إخفاء الفلتر' : 'عرض الفلتر'}
          </button>
        </div>

        {/* الفلتر المتقدم */}
        <div className={`bg-white rounded-xl shadow-sm mb-8 overflow-hidden transition-all duration-400 ${
          showFilter ? 'max-h-[500px] p-6 border border-gray-200' : 'max-h-0 border-0'
        }`}>
          {showFilter && (
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
          )}
        </div>

        {/* البطاقات */}
        <div className="properties-container">
          {isLoading ? (
            <PropertiesSkeleton type={filterType} />
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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
                  <div className="col-span-full text-center py-12">
                    <div className="bg-white rounded-xl shadow-sm p-8">
                      <p className="text-gray-500 text-lg">
                        لا توجد {filterType === 'lands' ? 'أراضي' : 'مزادات'} متاحة في الوقت الحالي
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* زر عرض الكل */}
          <div className="text-center">
            <button
              className="border-2 border-blue-400 text-blue-400 px-8 py-3 rounded-lg hover:bg-blue-400 hover:text-white transition-all duration-200 font-semibold"
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