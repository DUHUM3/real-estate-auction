import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaFilter, 
  FaSlidersH, 
  FaTimes, 
  FaMapMarkerAlt, 
  FaBed, 
  FaBath, 
  FaArrowsAlt, 
  FaClock, 
  FaHeart,
  FaChevronRight,
  FaChevronLeft,
  FaHome,
  FaRulerCombined,
  FaMoneyBillWave,
  FaBuilding,
  FaGavel,
  FaLandmark,
  FaCity,
  FaCalendarAlt,
  FaRegSun,
  FaLayerGroup
} from 'react-icons/fa';
import '../styles/PropertyList.css';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showSidebarFilter, setShowSidebarFilter] = useState(window.innerWidth > 768);
  const [currentPage, setCurrentPage] = useState(1);
  const [propertiesPerPage] = useState(6);
  const [filterType, setFilterType] = useState('lands'); // 'lands' or 'auctions'
  const [filters, setFilters] = useState({
    lands: {
      location: '',
      priceRange: { min: 0, max: 10000000 },
      area: { min: 0, max: 5000 },
      purpose: 'all', // residential, commercial, agricultural
      developed: 'all', // yes, no, all
      propertyFacing: 'all' // north, south, east, west, all
    },
    auctions: {
      location: '',
      status: 'all', // active, upcoming, completed
      type: 'all', // lands, buildings
      minBidIncrement: 0,
      endingSoon: false
    }
  });

  useEffect(() => {
    // بيانات تجريبية
    const sampleProperties = [
      {
        id: 1,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        location: 'الرياض',
        area: 450,
        image: '/images/land1.jpg',
        isAuction: false,
        facing: 'شمالي',
        developed: true,
        description: 'أرض سكنية مطورة في حي الياسمين، موقع مميز مع خدمات متكاملة وقريبة من المرافق الحيوية. مساحتها 450 متر مربع وتتميز بواجهة شمالية. مناسبة لبناء فلل سكنية فاخرة.',
        features: ['واجهة شمالية', 'شوارع مسفلتة', 'أرصفة', 'إنارة', 'قريبة من الخدمات', 'مخطط معتمد'],
        owner: 'شركة العقارية المتميزة',
        createdAt: '2024-01-15',
        status: 'active',
        contact: '+966500000001'
      },
      {
        id: 2,
        title: 'أرض تجارية على طريق الملك فهد',
        type: 'أرض',
        purpose: 'تجاري',
        price: 4500000,
        location: 'جدة',
        area: 1200,
        image: '/images/land2.jpg',
        isAuction: true,
        auctionEnd: '2024-12-25',
        currentBid: 4500000,
        minBidIncrement: 50000,
        bidders: 8,
        auctionStatus: 'active',
        facing: 'جنوبي',
        developed: true,
        description: 'أرض تجارية على طريق الملك فهد مباشرة، موقع استراتيجي للمشاريع التجارية. مساحة 1200 متر مربع، مناسبة لإنشاء مركز تجاري أو مبنى مكتبي.',
        features: ['موقع استراتيجي', 'واجهة تجارية', 'قريبة من المراكز التجارية', 'تصريح تجاري'],
        owner: 'مجموعة الأعمال التجارية',
        createdAt: '2024-01-12',
        status: 'active',
        contact: '+966500000006'
      },
      {
        id: 3,
        title: 'أرض زراعية في وادي الدواسر',
        type: 'أرض',
        purpose: 'زراعي',
        price: 1200000,
        location: 'وادي الدواسر',
        area: 10000,
        image: '/images/land3.jpg',
        isAuction: true,
        auctionEnd: '2024-11-20',
        currentBid: 1200000,
        minBidIncrement: 20000,
        bidders: 5,
        auctionStatus: 'active',
        facing: 'شرقي',
        developed: false,
        description: 'أرض زراعية خصبة في منطقة وادي الدواسر، مساحة 10000 متر مربع، تربة خصبة صالحة للزراعة مع توفر مصادر المياه. مناسبة للمشاريع الزراعية.',
        features: ['تربة خصبة', 'مصادر مياه', 'مناخ مناسب للزراعة', 'شوارع مؤدية'],
        owner: 'مؤسسة الأراضي الزراعية',
        createdAt: '2024-02-05',
        status: 'active',
        contact: '+966500000007'
      },
      {
        id: 4,
        title: 'قطعة أرض سكنية في حي النرجس',
        type: 'أرض',
        purpose: 'سكني',
        price: 760000,
        location: 'الرياض',
        area: 400,
        image: '/images/land4.jpg',
        isAuction: false,
        facing: 'غربي',
        developed: true,
        description: 'أرض سكنية في حي النرجس، قريبة من المدارس والمرافق العامة. مساحتها 400 متر مربع بواجهة غربية. مخطط معتمد وجاهز للبناء الفوري.',
        features: ['مخطط معتمد', 'خدمات متكاملة', 'واجهة غربية', 'قريبة من المدارس'],
        owner: 'مكتب الأراضي الذهبية',
        createdAt: '2024-03-10',
        status: 'active',
        contact: '+966500000008'
      },
      {
        id: 5,
        title: 'أرض سكنية مطلة على بحيرة',
        type: 'أرض',
        purpose: 'سكني',
        price: 3500000,
        location: 'الدمام',
        area: 600,
        image: '/images/land5.jpg',
        isAuction: true,
        auctionEnd: '2024-12-05',
        currentBid: 3500000,
        minBidIncrement: 100000,
        bidders: 12,
        auctionStatus: 'active',
        facing: 'جنوبي',
        developed: true,
        description: 'أرض سكنية مميزة مطلة على بحيرة اصطناعية في مشروع سكني راقي. تبلغ مساحتها 600 متر مربع مع إطلالة خلابة. موقع فريد يجمع بين الخصوصية والرفاهية.',
        features: ['إطلالة على بحيرة', 'مجتمع سكني راقي', 'خدمات متكاملة', 'أمن على مدار الساعة'],
        owner: 'شركة التطوير العقاري المتحدة',
        createdAt: '2024-02-20',
        status: 'active',
        contact: '+966500000009'
      },
      {
        id: 6,
        title: 'مزاد أراضي مخطط الفروسية',
        type: 'أرض',
        purpose: 'سكني',
        isAuction: true,
        auctionEnd: '2024-10-30',
        location: 'الرياض',
        area: 750,
        image: '/images/land6.jpg',
        currentBid: 1800000,
        minBidIncrement: 25000,
        bidders: 18,
        auctionStatus: 'upcoming',
        facing: 'شمالي',
        developed: true,
        description: 'مزاد علني على مجموعة أراضٍ مميزة في مخطط الفروسية. تبدأ المزايدة من 1,800,000 ريال. أراضي مطورة بالكامل ومخططة بشكل متميز في موقع حيوي.',
        features: ['مخطط معتمد', 'بنية تحتية متكاملة', 'مزاد تنافسي', 'موقع استراتيجي'],
        owner: 'الهيئة العامة للعقار',
        createdAt: '2024-03-15',
        status: 'active',
        contact: '+966500000010'
      }
    ];
    setProperties(sampleProperties);
    // تحديد أول عقار كافتراضي
    setSelectedProperty(sampleProperties[0]);

    // إضافة مستمع حجم النافذة للتصميم المتجاوب
    const handleResize = () => {
      setShowSidebarFilter(window.innerWidth > 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // تنقية العقارات بناءً على الفلاتر المطبقة
  const filteredProperties = properties.filter(property => {
    // تنقية بناء على مصطلح البحث
    if (searchTerm && !property.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.location.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !property.description.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }

    // تصفية بناءً على نوع الفلتر (الأراضي أو المزادات)
    if (filterType === 'lands' && property.isAuction) {
      return false;
    }

    if (filterType === 'auctions' && !property.isAuction) {
      return false;
    }

    // فلاتر الأراضي
    if (filterType === 'lands') {
      const landFilters = filters.lands;

      if (landFilters.location && !property.location.includes(landFilters.location)) {
        return false;
      }

      if (!property.isAuction && (property.price < landFilters.priceRange.min || property.price > landFilters.priceRange.max)) {
        return false;
      }

      if (property.area < landFilters.area.min || property.area > landFilters.area.max) {
        return false;
      }

      if (landFilters.purpose !== 'all' && property.purpose !== landFilters.purpose) {
        return false;
      }

      if (landFilters.developed !== 'all') {
        const isDeveloped = landFilters.developed === 'yes';
        if (property.developed !== isDeveloped) {
          return false;
        }
      }

      if (landFilters.propertyFacing !== 'all' && property.facing !== landFilters.propertyFacing) {
        return false;
      }
    }

    // فلاتر المزادات
    if (filterType === 'auctions') {
      const auctionFilters = filters.auctions;

      if (auctionFilters.location && !property.location.includes(auctionFilters.location)) {
        return false;
      }

      if (auctionFilters.status !== 'all' && property.auctionStatus !== auctionFilters.status) {
        return false;
      }

      if (auctionFilters.type !== 'all') {
        if (auctionFilters.type === 'lands' && property.type !== 'أرض') {
          return false;
        } else if (auctionFilters.type === 'buildings' && property.type === 'أرض') {
          return false;
        }
      }

      if (auctionFilters.minBidIncrement > 0 && property.minBidIncrement < auctionFilters.minBidIncrement) {
        return false;
      }

      if (auctionFilters.endingSoon) {
        const today = new Date();
        const auctionEndDate = new Date(property.auctionEnd);
        const daysDifference = Math.ceil((auctionEndDate - today) / (1000 * 60 * 60 * 24));
        if (daysDifference > 7) {
          return false;
        }
      }
    }

    return true;
  });

  // نظام الصفحات
  const indexOfLastProperty = currentPage * propertiesPerPage;
  const indexOfFirstProperty = indexOfLastProperty - propertiesPerPage;
  const currentProperties = filteredProperties.slice(indexOfFirstProperty, indexOfLastProperty);
  const totalPages = Math.ceil(filteredProperties.length / propertiesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const resetFilters = () => {
    setFilters({
      lands: {
        location: '',
        priceRange: { min: 0, max: 10000000 },
        area: { min: 0, max: 5000 },
        purpose: 'all',
        developed: 'all',
        propertyFacing: 'all'
      },
      auctions: {
        location: '',
        status: 'all',
        type: 'all',
        minBidIncrement: 0,
        endingSoon: false
      }
    });
    setSearchTerm('');
    setCurrentPage(1);
  };

  const handleFilterChange = (filterGroup, key, value) => {
    setFilters(prev => ({
      ...prev,
      [filterGroup]: {
        ...prev[filterGroup],
        [key]: value
      }
    }));
  };

  const handleRangeChange = (filterGroup, rangeKey, min, max) => {
    setFilters(prev => ({
      ...prev,
      [filterGroup]: {
        ...prev[filterGroup],
        [rangeKey]: { min, max }
      }
    }));
  };

  const switchFilterType = (type) => {
    setFilterType(type);
    setCurrentPage(1);
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="property-list-container">
      {/* شريط البحث */}
      <div className="search-bar">
        <div className="search-content">
          <div className="search-box">
            <input
              type="text"
              placeholder="ابحث عن أرض، موقع، مزاد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>

          <button 
            className="filter-toggle-btn"
            onClick={() => setShowSidebarFilter(!showSidebarFilter)}
          >
            <FaFilter />
            <span className="filter-text">{showSidebarFilter ? 'إخفاء الفلتر' : 'إظهار الفلتر'}</span>
          </button>
        </div>
      </div>

      {/* المحتوى الرئيسي */}
      <div className="main-layout">
        {/* العمود الأيمن - الفلتر */}
        <div className={`filter-sidebar ${showSidebarFilter ? 'active' : ''}`}>
          <div className="filter-header">
            <h3>
              <FaSlidersH />
              تصفية النتائج
            </h3>
            <button className="filter-close-btn mobile-only" onClick={() => setShowSidebarFilter(false)}>
              <FaTimes />
            </button>
          </div>

          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterType === 'lands' ? 'active' : ''}`}
              onClick={() => switchFilterType('lands')}
            >
              <FaLandmark />
              الأراضي
            </button>
            <button 
              className={`filter-tab ${filterType === 'auctions' ? 'active' : ''}`}
              onClick={() => switchFilterType('auctions')}
            >
              <FaGavel />
              المزادات
            </button>
          </div>

          <div className="filter-content">
            {filterType === 'lands' ? (
              // فلتر الأراضي
              <>
                {/* الموقع */}
                <div className="filter-section">
                  <h4>
                    <FaMapMarkerAlt />
                    الموقع
                  </h4>
                  <select 
                    value={filters.lands.location} 
                    onChange={(e) => handleFilterChange('lands', 'location', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">جميع المواقع</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                    <option value="المدينة">المدينة</option>
                    <option value="وادي الدواسر">وادي الدواسر</option>
                  </select>
                </div>

                {/* نطاق السعر */}
                <div className="filter-section">
                  <h4>
                    <FaMoneyBillWave />
                    نطاق السعر
                  </h4>
                  <div className="price-range">
                    <div className="range-inputs">
                      <input
                        type="number"
                        placeholder="الحد الأدنى"
                        value={filters.lands.priceRange.min}
                        onChange={(e) => handleRangeChange('lands', 'priceRange', parseInt(e.target.value) || 0, filters.lands.priceRange.max)}
                      />
                      <span>إلى</span>
                      <input
                        type="number"
                        placeholder="الحد الأقصى"
                        value={filters.lands.priceRange.max}
                        onChange={(e) => handleRangeChange('lands', 'priceRange', filters.lands.priceRange.min, parseInt(e.target.value) || 10000000)}
                      />
                    </div>
                  </div>
                </div>

                {/* المساحة */}
                <div className="filter-section">
                  <h4>
                    <FaRulerCombined />
                    المساحة (م²)
                  </h4>
                  <div className="range-inputs">
                    <input
                      type="number"
                      placeholder="الحد الأدنى"
                      value={filters.lands.area.min}
                      onChange={(e) => handleRangeChange('lands', 'area', parseInt(e.target.value) || 0, filters.lands.area.max)}
                    />
                    <span>إلى</span>
                    <input
                      type="number"
                      placeholder="الحد الأقصى"
                      value={filters.lands.area.max}
                      onChange={(e) => handleRangeChange('lands', 'area', filters.lands.area.min, parseInt(e.target.value) || 5000)}
                    />
                  </div>
                </div>

                {/* الغرض */}
                <div className="filter-section">
                  <h4>
                    <FaCity />
                    الغرض
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'جميع الأغراض' },
                      { value: 'سكني', label: 'سكني' },
                      { value: 'تجاري', label: 'تجاري' },
                      { value: 'زراعي', label: 'زراعي' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="landPurpose"
                          value={option.value}
                          checked={filters.lands.purpose === option.value}
                          onChange={(e) => handleFilterChange('lands', 'purpose', e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* حالة التطوير */}
                <div className="filter-section">
                  <h4>
                    <FaLayerGroup />
                    حالة التطوير
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'الكل' },
                      { value: 'yes', label: 'مطورة' },
                      { value: 'no', label: 'غير مطورة' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="developed"
                          value={option.value}
                          checked={filters.lands.developed === option.value}
                          onChange={(e) => handleFilterChange('lands', 'developed', e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* اتجاه الأرض */}
                <div className="filter-section">
                  <h4>
                    <FaRegSun />
                    اتجاه الأرض
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'جميع الاتجاهات' },
                      { value: 'شمالي', label: 'شمالي' },
                      { value: 'جنوبي', label: 'جنوبي' },
                      { value: 'شرقي', label: 'شرقي' },
                      { value: 'غربي', label: 'غربي' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="propertyFacing"
                          value={option.value}
                          checked={filters.lands.propertyFacing === option.value}
                          onChange={(e) => handleFilterChange('lands', 'propertyFacing', e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // فلتر المزادات
              <>
                {/* الموقع */}
                <div className="filter-section">
                  <h4>
                    <FaMapMarkerAlt />
                    الموقع
                  </h4>
                  <select 
                    value={filters.auctions.location} 
                    onChange={(e) => handleFilterChange('auctions', 'location', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">جميع المواقع</option>
                    <option value="الرياض">الرياض</option>
                    <option value="جدة">جدة</option>
                    <option value="الدمام">الدمام</option>
                    <option value="مكة">مكة</option>
                    <option value="المدينة">المدينة</option>
                    <option value="وادي الدواسر">وادي الدواسر</option>
                  </select>
                </div>

                {/* حالة المزاد */}
                <div className="filter-section">
                  <h4>
                    <FaCalendarAlt />
                    حالة المزاد
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'الكل' },
                      { value: 'active', label: 'نشط' },
                      { value: 'upcoming', label: 'قادم' },
                      { value: 'completed', label: 'منتهي' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="auctionStatus"
                          value={option.value}
                          checked={filters.auctions.status === option.value}
                          onChange={(e) => handleFilterChange('auctions', 'status', e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* نوع العقار */}
                <div className="filter-section">
                  <h4>
                    <FaBuilding />
                    نوع العقار
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'جميع الأنواع' },
                      { value: 'lands', label: 'أراضي' },
                      { value: 'buildings', label: 'مباني' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="auctionType"
                          value={option.value}
                          checked={filters.auctions.type === option.value}
                          onChange={(e) => handleFilterChange('auctions', 'type', e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* الحد الأدنى للمزايدة */}
                <div className="filter-section">
                  <h4>
                    <FaMoneyBillWave />
                    الحد الأدنى للمزايدة
                  </h4>
                  <div className="range-inputs single-input">
                    <input
                      type="number"
                      placeholder="الحد الأدنى للمزايدة"
                      value={filters.auctions.minBidIncrement}
                      onChange={(e) => handleFilterChange('auctions', 'minBidIncrement', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                {/* تنتهي قريباً */}
                <div className="filter-section">
                  <label className="checkbox-container">
                    <input
                      type="checkbox"
                      checked={filters.auctions.endingSoon}
                      onChange={(e) => handleFilterChange('auctions', 'endingSoon', e.target.checked)}
                    />
                    <span className="checkbox-label">
                      <FaClock />
                      تنتهي خلال 7 أيام
                    </span>
                  </label>
                </div>
              </>
            )}

            {/* أزرار الفلتر */}
            <div className="filter-actions">
              <button className="apply-filters" onClick={() => setCurrentPage(1)}>
                تطبيق الفلتر
              </button>
              <button className="reset-filters" onClick={resetFilters}>
                إعادة التعيين
              </button>
            </div>
          </div>
        </div>

        {/* العمود الأوسط - قائمة العقارات */}
        <div className="property-list-main">
          <div className="property-list-header">
            <h2>
              {filterType === 'lands' ? 'الأراضي المتاحة' : 'المزادات النشطة'}
            </h2>
            <div className="property-results-count">
              <span>{filteredProperties.length} {filterType === 'lands' ? 'أرض' : 'مزاد'} متاح</span>
            </div>
          </div>

          {/* شبكة العقارات */}
          <div className="property-grid">
            {currentProperties.length > 0 ? (
              currentProperties.map(property => (
                <div 
                  key={property.id} 
                  className={`property-card ${selectedProperty?.id === property.id ? 'property-card-active' : ''}`}
                  onClick={() => setSelectedProperty(property)}
                >
                  <div className="property-card-image">
                    <img src={property.image} alt={property.title} />
                    <div className={`property-card-badge ${property.isAuction ? 'auction-badge' : ''}`}>
                      {property.isAuction ? 'مزاد' : property.type}
                    </div>
                    <button className="property-favorite-btn">
                      <FaHeart />
                    </button>
                    {property.isAuction && (
                      <div className="property-auction-timer">
                        <FaClock />
                        <span>{property.auctionEnd}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="property-card-content">
                    <h3 className="property-card-title">{property.title}</h3>
                    
                    <div className="property-card-location">
                      <FaMapMarkerAlt />
                      <span>{property.location}</span>
                    </div>

                    <div className="property-card-features">
                      <div className="property-feature">
                        <FaRulerCombined />
                        <span>{property.area} م²</span>
                      </div>
                      {property.purpose && (
                        <div className="property-feature">
                          <FaLayerGroup />
                          <span>{property.purpose}</span>
                        </div>
                      )}
                    </div>

                    {property.isAuction ? (
                      <div className="property-card-price auction-price">
                        <span className="price-label">المزايدة الحالية</span>
                        <span className="price-value">{property.currentBid.toLocaleString()} ريال</span>
                        <span className="bidders-count">
                          <FaGavel />
                          {property.bidders} مزايد
                        </span>
                      </div>
                    ) : (
                      <div className="property-card-price">
                        <span className="price-value">{property.price.toLocaleString()} ريال</span>
                      </div>
                    )}

                    <div className="property-card-actions">
                      <Link to={`/property/${property.id}`} className="property-btn property-btn-primary">
                        عرض التفاصيل
                      </Link>
                      {property.isAuction ? (
                        <Link to={`/auction/${property.id}`} className="property-btn property-btn-secondary">
                          المزايدة الآن
                        </Link>
                      ) : (
                        <Link to={`/contact/${property.id}`} className="property-btn property-btn-secondary">
                          تواصل مع المالك
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="property-no-results">
                <FaHome />
                <h3>لا توجد عقارات مطابقة للبحث</h3>
                <p>جرب تعديل فلتر البحث للحصول على نتائج أكثر</p>
              </div>
            )}
          </div>

          {/* التصفح بين الصفحات */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-btn pagination-prev"
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <FaChevronRight />
                السابق
              </button>
              
              <div className="pagination-numbers">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNumber;
                  if (totalPages <= 5) {
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNumber = totalPages - 4 + i;
                  } else {
                    pageNumber = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={i}
                      className={`pagination-number ${currentPage === pageNumber ? 'pagination-active' : ''}`}
                      onClick={() => paginate(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
                {totalPages > 5 && currentPage < totalPages - 2 && (
                  <>
                    <span className="pagination-ellipsis">...</span>
                    <button 
                      className="pagination-number"
                      onClick={() => paginate(totalPages)}
                    >
                      {totalPages}
                    </button>
                  </>
                )}
              </div>
              
              <button 
                className="pagination-btn pagination-next"
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                التالي
                <FaChevronLeft />
              </button>
            </div>
          )}
        </div>

        {/* العمود الأيسر - تفاصيل العقار */}
        <div className="property-details-sidebar">
          {selectedProperty ? (
            <>
              <div className="property-details-header">
                <h3>{selectedProperty.isAuction ? 'تفاصيل المزاد' : 'تفاصيل الأرض'}</h3>
              </div>

              <div className="property-details-content">
                <div className="property-details-image">
                  <img src={selectedProperty.image} alt={selectedProperty.title} />
                  {selectedProperty.isAuction && (
                    <div className="property-auction-badge">
                      <FaGavel />
                      مزاد
                    </div>
                  )}
                </div>

                <div className="property-details-info">
                  <h2 className="property-details-title">{selectedProperty.title}</h2>
                  
                  <div className="property-details-location">
                    <FaMapMarkerAlt />
                    <span>{selectedProperty.location}</span>
                  </div>

                  <div className={`property-details-price ${selectedProperty.isAuction ? 'auction-details-price' : ''}`}>
                    {selectedProperty.isAuction ? (
                      <>
                        <span className="auction-current-bid-label">المزايدة الحالية</span>
                        <span className="property-details-price-value">{selectedProperty.currentBid.toLocaleString()} ريال</span>
                        <div className="auction-details-meta">
                          <span className="auction-min-increment">
                            <FaMoneyBillWave />
                            الحد الأدنى للمزايدة: {selectedProperty.minBidIncrement.toLocaleString()} ريال
                          </span>
                          <span className="auction-bidders">
                            <FaGavel />
                            {selectedProperty.bidders} مزايد
                          </span>
                        </div>
                      </>
                    ) : (
                      <span className="property-details-price-value">{selectedProperty.price.toLocaleString()} ريال</span>
                    )}
                  </div>

                  <div className="property-details-features">
                    <div className="property-detail-feature">
                      <FaRulerCombined />
                      <div>
                        <span className="feature-label">المساحة</span>
                        <span className="feature-value">{selectedProperty.area} م²</span>
                      </div>
                    </div>

                    <div className="property-detail-feature">
                      <FaCity />
                      <div>
                        <span className="feature-label">الغرض</span>
                        <span className="feature-value">{selectedProperty.purpose}</span>
                      </div>
                    </div>

                    <div className="property-detail-feature">
                      <FaRegSun />
                      <div>
                        <span className="feature-label">الاتجاه</span>
                        <span className="feature-value">{selectedProperty.facing}</span>
                      </div>
                    </div>
                  </div>

                  <div className="property-details-description">
                    <h4>الوصف</h4>
                    <p>{selectedProperty.description}</p>
                  </div>

                  <div className="property-details-features-list">
                    <h4>المميزات</h4>
                    <div className="property-features-grid">
                      {selectedProperty.features?.map((feature, index) => (
                        <span key={index} className="property-feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {selectedProperty.isAuction && (
                    <div className="property-details-auction">
                      <h4>معلومات المزاد</h4>
                      <div className="property-auction-details">
                        <div className="auction-info-item">
                          <FaClock />
                          <span>ينتهي المزاد: {selectedProperty.auctionEnd}</span>
                        </div>
                        <div className="auction-info-item">
                          <FaBuilding />
                          <span>المالك: {selectedProperty.owner}</span>
                        </div>
                        <div className="auction-info-item">
                          <span>الاتصال: {selectedProperty.contact}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="property-details-actions">
                    <Link to={`/property/${selectedProperty.id}`} className="property-btn property-btn-primary property-btn-full">
                      عرض التفاصيل الكاملة
                    </Link>
                    {selectedProperty.isAuction ? (
                      <Link to={`/auction/${selectedProperty.id}`} className="property-btn property-btn-secondary property-btn-full">
                        الدخول للمزايدة
                      </Link>
                    ) : (
                      <Link to={`/contact/${selectedProperty.id}`} className="property-btn property-btn-secondary property-btn-full">
                        تواصل مع المالك
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="property-no-selection">
              <FaHome />
              <h3>اختر عقاراً لعرض التفاصيل</h3>
              <p>انقر على أي عقار في القائمة لعرض التفاصيل الكاملة هنا</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PropertyList;