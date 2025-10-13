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
  const [propertiesPerPage] = useState(9);
  const [filterType, setFilterType] = useState('lands'); // 'lands' or 'auctions'
  const [filters, setFilters] = useState({
    lands: {
      region: '',
      city: '',
      priceRange: { min: 0, max: 10000000 },
      area: { min: 0, max: 5000 },
      purpose: 'all', // residential, commercial, agricultural, industrial, mixed
      developed: 'all', // yes, no, all
      propertyFacing: 'all', // north, south, east, west, all
      publishDate: 'all' // today, thisWeek, thisMonth, all
    },
    auctions: {
      region: '',
      city: '',
      dateRange: { from: '', to: '' },
      daysRemaining: 30,
      status: 'all', // active, upcoming, completed
      type: 'all', // lands, buildings
      minBidIncrement: 0,
      purpose: 'all' // investment, purchase, all
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
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: '/images/land1.jpg',
        isAuction: false,
        facing: 'شمالي',
        developed: true,
        description: 'أرض سكنية مطورة في حي الياسمين، موقع مميز مع خدمات متكاملة وقريبة من المرافق الحيوية. مساحتها 450 متر مربع وتتميز بواجهة شمالية. مناسبة لبناء فلل سكنية فاخرة.',
        features: ['واجهة شمالية', 'شوارع مسفلتة', 'أرصفة', 'إنارة', 'قريبة من الخدمات', 'مخطط معتمد'],
        owner: 'شركة العقارية المتميزة',
        createdAt: '2025-10-01',
        status: 'active',
        contact: '+966500000001'
      },
      {
        id: 2,
        title: 'أرض تجارية على طريق الملك فهد',
        type: 'أرض',
        purpose: 'تجاري',
        price: 4500000,
        region: 'مكة المكرمة',
        city: 'جدة',
        area: 1200,
        image: '/images/land2.jpg',
        isAuction: true,
        auctionEnd: '2025-12-25',
        currentBid: 4500000,
        minBidIncrement: 50000,
        bidders: 8,
        auctionStatus: 'active',
        facing: 'جنوبي',
        developed: true,
        description: 'أرض تجارية على طريق الملك فهد مباشرة، موقع استراتيجي للمشاريع التجارية. مساحة 1200 متر مربع، مناسبة لإنشاء مركز تجاري أو مبنى مكتبي.',
        features: ['موقع استراتيجي', 'واجهة تجارية', 'قريبة من المراكز التجارية', 'تصريح تجاري'],
        owner: 'مجموعة الأعمال التجارية',
        createdAt: '2025-10-08',
        status: 'active',
        contact: '+966500000006'
      },
      {
        id: 3,
        title: 'أرض زراعية في وادي الدواسر',
        type: 'أرض',
        purpose: 'زراعي',
        price: 1200000,
        region: 'الرياض',
        city: 'وادي الدواسر',
        area: 10000,
        image: '/images/land3.jpg',
        isAuction: true,
        auctionEnd: '2025-11-20',
        currentBid: 1200000,
        minBidIncrement: 20000,
        bidders: 5,
        auctionStatus: 'active',
        facing: 'شرقي',
        developed: false,
        description: 'أرض زراعية خصبة في منطقة وادي الدواسر، مساحة 10000 متر مربع، تربة خصبة صالحة للزراعة مع توفر مصادر المياه. مناسبة للمشاريع الزراعية.',
        features: ['تربة خصبة', 'مصادر مياه', 'مناخ مناسب للزراعة', 'شوارع مؤدية'],
        owner: 'مؤسسة الأراضي الزراعية',
        createdAt: '2025-09-25',
        status: 'active',
        contact: '+966500000007'
      },
      {
        id: 4,
        title: 'قطعة أرض سكنية في حي النرجس',
        type: 'أرض',
        purpose: 'سكني',
        price: 760000,
        region: 'الرياض',
        city: 'الرياض',
        area: 400,
        image: '/images/land4.jpg',
        isAuction: false,
        facing: 'غربي',
        developed: true,
        description: 'أرض سكنية في حي النرجس، قريبة من المدارس والمرافق العامة. مساحتها 400 متر مربع بواجهة غربية. مخطط معتمد وجاهز للبناء الفوري.',
        features: ['مخطط معتمد', 'خدمات متكاملة', 'واجهة غربية', 'قريبة من المدارس'],
        owner: 'مكتب الأراضي الذهبية',
        createdAt: '2025-10-05',
        status: 'active',
        contact: '+966500000008'
      },
      {
        id: 5,
        title: 'أرض سكنية مطلة على بحيرة',
        type: 'أرض',
        purpose: 'سكني',
        price: 3500000,
        region: 'المنطقة الشرقية',
        city: 'الدمام',
        area: 600,
        image: '/images/land5.jpg',
        isAuction: true,
        auctionEnd: '2025-12-05',
        currentBid: 3500000,
        minBidIncrement: 100000,
        bidders: 12,
        auctionStatus: 'active',
        facing: 'جنوبي',
        developed: true,
        description: 'أرض سكنية مميزة مطلة على بحيرة اصطناعية في مشروع سكني راقي. تبلغ مساحتها 600 متر مربع مع إطلالة خلابة. موقع فريد يجمع بين الخصوصية والرفاهية.',
        features: ['إطلالة على بحيرة', 'مجتمع سكني راقي', 'خدمات متكاملة', 'أمن على مدار الساعة'],
        owner: 'شركة التطوير العقاري المتحدة',
        createdAt: '2025-09-15',
        status: 'active',
        contact: '+966500000009'
      },
      {
        id: 6,
        title: 'مزاد أراضي مخطط الفروسية',
        type: 'أرض',
        purpose: 'سكني',
        isAuction: true,
        auctionEnd: '2025-10-30',
        region: 'الرياض',
        city: 'الرياض',
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
        createdAt: '2025-10-10',
        status: 'active',
        contact: '+966500000010'
      },
      {
        id: 7,
        title: 'أرض صناعية في المدينة الصناعية',
        type: 'أرض',
        purpose: 'صناعي',
        price: 5800000,
        region: 'المنطقة الشرقية',
        city: 'الدمام',
        area: 3000,
        image: '/images/land7.jpg',
        isAuction: false,
        facing: 'شرقي',
        developed: true,
        description: 'أرض صناعية مطورة بالكامل في المدينة الصناعية بالدمام. مساحة 3000 متر مربع، مناسبة لإقامة مشاريع صناعية متوسطة. تتميز بموقع استراتيجي وقربها من الطرق الرئيسية.',
        features: ['تصريح صناعي', 'شبكات مرافق', 'قريبة من الطرق السريعة', 'منطقة صناعية معتمدة'],
        owner: 'شركة المدن الصناعية',
        createdAt: '2025-10-07',
        status: 'active',
        contact: '+966500000011'
      },
      {
        id: 8,
        title: 'أرض استثمارية متعددة الاستخدامات',
        type: 'أرض',
        purpose: 'مختلط',
        price: 8200000,
        region: 'مكة المكرمة',
        city: 'جدة',
        area: 2200,
        image: '/images/land8.jpg',
        isAuction: false,
        facing: 'جنوبي',
        developed: true,
        description: 'أرض استثمارية بتصريح متعدد الاستخدامات في منطقة حيوية بجدة. مساحة 2200 متر مربع، مناسبة للمشاريع التجارية والسكنية المشتركة. موقع متميز بالقرب من المناطق الحيوية.',
        features: ['تصريح متعدد الاستخدامات', 'موقع حيوي', 'كثافة سكانية عالية', 'قربها من مراكز التسوق'],
        owner: 'مؤسسة التطوير العقاري',
        createdAt: '2025-09-20',
        status: 'active',
        contact: '+966500000012'
      },
      {
        id: 9,
        title: 'أرض تجارية على الدائري الشرقي',
        type: 'أرض',
        purpose: 'تجاري',
        price: 6300000,
        region: 'الرياض',
        city: 'الرياض',
        area: 1500,
        image: '/images/land9.jpg',
        isAuction: false,
        facing: 'شمالي',
        developed: true,
        description: 'أرض تجارية على طريق الدائري الشرقي في الرياض. مساحة 1500 متر مربع، واجهة شمالية، مناسبة لإقامة مجمع تجاري أو مبنى إداري. فرصة استثمارية مميزة.',
        features: ['موقع استراتيجي', 'واجهة تجارية', 'كثافة مرورية عالية', 'قريبة من المراكز التجارية'],
        owner: 'شركة الاستثمار العقاري',
        createdAt: '2025-10-02',
        status: 'active',
        contact: '+966500000013'
      },
      {
        id: 10,
        title: 'مزاد على أراضي سكنية وتجارية',
        type: 'أرض',
        purpose: 'مختلط',
        isAuction: true,
        auctionEnd: '2025-11-15',
        region: 'المنطقة الشرقية',
        city: 'الخبر',
        area: 1000,
        image: '/images/land10.jpg',
        currentBid: 3200000,
        minBidIncrement: 50000,
        bidders: 14,
        auctionStatus: 'active',
        facing: 'غربي',
        developed: true,
        description: 'مزاد على مجموعة أراضي سكنية وتجارية في مخطط جديد بالخبر. المزاد يشمل أراضي بمساحات متنوعة ومواقع مميزة. فرصة استثمارية للمستثمرين والأفراد.',
        features: ['مخطط جديد', 'تنوع الاستخدامات', 'مواقع استراتيجية', 'فرصة استثمارية'],
        owner: 'هيئة تطوير المدن',
        createdAt: '2025-09-28',
        status: 'active',
        contact: '+966500000014'
      },
      {
        id: 11,
        title: 'أرض زراعية في القصيم',
        type: 'أرض',
        purpose: 'زراعي',
        price: 950000,
        region: 'القصيم',
        city: 'بريدة',
        area: 15000,
        image: '/images/land11.jpg',
        isAuction: false,
        facing: 'شرقي',
        developed: false,
        description: 'أرض زراعية خصبة في منطقة القصيم. مساحة 15000 متر مربع، تربة ممتازة للزراعة، مع توفر مصادر مياه. مناسبة لمشاريع الزراعة المتنوعة.',
        features: ['تربة خصبة', 'مصادر مياه متوفرة', 'منطقة زراعية معروفة', 'قريبة من الأسواق المركزية'],
        owner: 'مؤسسة الأراضي الزراعية',
        createdAt: '2025-09-18',
        status: 'active',
        contact: '+966500000015'
      },
      {
        id: 12,
        title: 'مزاد على أراضي في ضاحية الملك فهد',
        type: 'أرض',
        purpose: 'سكني',
        isAuction: true,
        auctionEnd: '2025-12-15',
        region: 'الرياض',
        city: 'الرياض',
        area: 500,
        image: '/images/land12.jpg',
        currentBid: 920000,
        minBidIncrement: 20000,
        bidders: 22,
        auctionStatus: 'active',
        facing: 'شمالي',
        developed: true,
        description: 'مزاد على مجموعة أراضي سكنية في ضاحية الملك فهد. أراضي مخططة بمساحات متنوعة ومواقع مميزة. البنية التحتية مكتملة والخدمات متوفرة.',
        features: ['ضاحية راقية', 'بنية تحتية متكاملة', 'قريبة من المرافق العامة', 'مخطط معتمد'],
        owner: 'وزارة الإسكان',
        createdAt: '2025-10-09',
        status: 'active',
        contact: '+966500000016'
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
      !property.city.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !property.region.toLowerCase().includes(searchTerm.toLowerCase()) &&
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

      // تصفية حسب المنطقة
      if (landFilters.region && property.region !== landFilters.region) {
        return false;
      }

      // تصفية حسب المدينة
      if (landFilters.city && property.city !== landFilters.city) {
        return false;
      }

      // تصفية حسب السعر
      if (!property.isAuction && (property.price < landFilters.priceRange.min || property.price > landFilters.priceRange.max)) {
        return false;
      }

      // تصفية حسب المساحة
      if (property.area < landFilters.area.min || property.area > landFilters.area.max) {
        return false;
      }

      // تصفية حسب الغرض
      if (landFilters.purpose !== 'all' && property.purpose !== landFilters.purpose) {
        return false;
      }

      // تصفية حسب حالة التطوير
      if (landFilters.developed !== 'all') {
        const isDeveloped = landFilters.developed === 'yes';
        if (property.developed !== isDeveloped) {
          return false;
        }
      }

      // تصفية حسب اتجاه الأرض
      if (landFilters.propertyFacing !== 'all' && property.facing !== landFilters.propertyFacing) {
        return false;
      }

      // تصفية حسب تاريخ النشر
      if (landFilters.publishDate !== 'all') {
        const today = new Date();
        const publishDate = new Date(property.createdAt);
        const daysDifference = Math.ceil((today - publishDate) / (1000 * 60 * 60 * 24));

        if (landFilters.publishDate === 'today' && daysDifference > 1) {
          return false;
        } else if (landFilters.publishDate === 'thisWeek' && daysDifference > 7) {
          return false;
        } else if (landFilters.publishDate === 'thisMonth' && daysDifference > 30) {
          return false;
        }
      }
    }

    // فلاتر المزادات
    if (filterType === 'auctions') {
      const auctionFilters = filters.auctions;

      // تصفية حسب المنطقة
      if (auctionFilters.region && property.region !== auctionFilters.region) {
        return false;
      }

      // تصفية حسب المدينة
      if (auctionFilters.city && property.city !== auctionFilters.city) {
        return false;
      }

      // تصفية حسب تاريخ المزاد (من - إلى)
      if (auctionFilters.dateRange.from || auctionFilters.dateRange.to) {
        const auctionDate = new Date(property.auctionEnd);
        
        if (auctionFilters.dateRange.from) {
          const fromDate = new Date(auctionFilters.dateRange.from);
          if (auctionDate < fromDate) {
            return false;
          }
        }
        
        if (auctionFilters.dateRange.to) {
          const toDate = new Date(auctionFilters.dateRange.to);
          if (auctionDate > toDate) {
            return false;
          }
        }
      }

      // تصفية حسب الأيام المتبقية
      if (auctionFilters.daysRemaining > 0) {
        const today = new Date();
        const auctionEndDate = new Date(property.auctionEnd);
        const daysDifference = Math.ceil((auctionEndDate - today) / (1000 * 60 * 60 * 24));
        if (daysDifference > auctionFilters.daysRemaining) {
          return false;
        }
      }

      // تصفية حسب حالة المزاد
      if (auctionFilters.status !== 'all' && property.auctionStatus !== auctionFilters.status) {
        return false;
      }

      // تصفية حسب نوع العقار
      if (auctionFilters.type !== 'all') {
        if (auctionFilters.type === 'lands' && property.type !== 'أرض') {
          return false;
        } else if (auctionFilters.type === 'buildings' && property.type === 'أرض') {
          return false;
        }
      }

      // تصفية حسب الحد الأدنى للمزايدة
      if (auctionFilters.minBidIncrement > 0 && property.minBidIncrement < auctionFilters.minBidIncrement) {
        return false;
      }
      
      // تصفية حسب الغرض
      if (auctionFilters.purpose !== 'all' && property.purpose !== auctionFilters.purpose) {
        return false;
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
        region: '',
        city: '',
        priceRange: { min: 0, max: 10000000 },
        area: { min: 0, max: 5000 },
        purpose: 'all',
        developed: 'all',
        propertyFacing: 'all',
        publishDate: 'all'
      },
      auctions: {
        region: '',
        city: '',
        dateRange: { from: '', to: '' },
        daysRemaining: 30,
        status: 'all',
        type: 'all',
        minBidIncrement: 0,
        purpose: 'all'
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

  const handleDateRangeChange = (filterGroup, rangeKey, from, to) => {
    setFilters(prev => ({
      ...prev,
      [filterGroup]: {
        ...prev[filterGroup],
        [rangeKey]: { from, to }
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

  // الحصول على قائمة المناطق الفريدة
  const uniqueRegions = [...new Set(properties.map(property => property.region))];
  
  // الحصول على قائمة المدن الفريدة حسب المنطقة المختارة
  const getUniqueCities = (region) => {
    if (!region) return [...new Set(properties.map(property => property.city))];
    return [...new Set(properties.filter(property => property.region === region).map(property => property.city))];
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

          <div className="filter-content2">
            {filterType === 'lands' ? (
              // فلتر الأراضي
              <>
                {/* المنطقة */}
                <div className="filter-section">
                  <h4>
                    <FaMapMarkerAlt />
                    المنطقة
                  </h4>
                  <select
                    value={filters.lands.region}
                    onChange={(e) => handleFilterChange('lands', 'region', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">جميع المناطق</option>
                    {uniqueRegions.map((region, index) => (
                      <option key={index} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* المدينة */}
                <div className="filter-section">
                  <h4>
                    <FaCity />
                    المدينة
                  </h4>
                  <select
                    value={filters.lands.city}
                    onChange={(e) => handleFilterChange('lands', 'city', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">جميع المدن</option>
                    {getUniqueCities(filters.lands.region).map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
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
                      { value: 'زراعي', label: 'زراعي' },
                      { value: 'صناعي', label: 'صناعي' },
                      { value: 'مختلط', label: 'مختلط' }
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

                {/* تاريخ النشر */}
                <div className="filter-section">
                  <h4>
                    <FaCalendarAlt />
                    تاريخ النشر
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'جميع التواريخ' },
                      { value: 'today', label: 'اليوم' },
                      { value: 'thisWeek', label: 'هذا الأسبوع' },
                      { value: 'thisMonth', label: 'هذا الشهر' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="publishDate"
                          value={option.value}
                          checked={filters.lands.publishDate === option.value}
                          onChange={(e) => handleFilterChange('lands', 'publishDate', e.target.value)}
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
                {/* المنطقة */}
                <div className="filter-section">
                  <h4>
                    <FaMapMarkerAlt />
                    المنطقة
                  </h4>
                  <select
                    value={filters.auctions.region}
                    onChange={(e) => handleFilterChange('auctions', 'region', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">جميع المناطق</option>
                    {uniqueRegions.map((region, index) => (
                      <option key={index} value={region}>{region}</option>
                    ))}
                  </select>
                </div>

                {/* المدينة */}
                <div className="filter-section">
                  <h4>
                    <FaCity />
                    المدينة
                  </h4>
                  <select
                    value={filters.auctions.city}
                    onChange={(e) => handleFilterChange('auctions', 'city', e.target.value)}
                    className="filter-select"
                  >
                    <option value="">جميع المدن</option>
                    {getUniqueCities(filters.auctions.region).map((city, index) => (
                      <option key={index} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                {/* تاريخ المزاد (من) */}
                <div className="filter-section">
                  <h4>
                    <FaCalendarAlt />
                    تاريخ المزاد من
                  </h4>
                  <div className="range-inputs single-input">
                    <input
                      type="date"
                      value={filters.auctions.dateRange.from}
                      onChange={(e) => handleDateRangeChange('auctions', 'dateRange', e.target.value, filters.auctions.dateRange.to)}
                    />
                  </div>
                </div>

                {/* تاريخ المزاد (إلى) */}
                <div className="filter-section">
                  <h4>
                    <FaCalendarAlt />
                    تاريخ المزاد إلى
                  </h4>
                  <div className="range-inputs single-input">
                    <input
                      type="date"
                      value={filters.auctions.dateRange.to}
                      onChange={(e) => handleDateRangeChange('auctions', 'dateRange', filters.auctions.dateRange.from, e.target.value)}
                    />
                  </div>
                </div>

                {/* الأيام المتبقية */}
                <div className="filter-section">
                  <h4>
                    <FaClock />
                    الأيام المتبقية (كحد أقصى)
                  </h4>
                  <div className="range-inputs single-input">
                    <input
                      type="number"
                      placeholder="الأيام المتبقية"
                      value={filters.auctions.daysRemaining}
                      onChange={(e) => handleFilterChange('auctions', 'daysRemaining', parseInt(e.target.value) || 30)}
                    />
                  </div>
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
                
                {/* الغرض من العقار */}
                <div className="filter-section">
                  <h4>
                    <FaCity />
                    الغرض من العقار
                  </h4>
                  <div className="filter-options">
                    {[
                      { value: 'all', label: 'جميع الأغراض' },
                      { value: 'استثمار', label: 'استثمار' },
                      { value: 'شراء', label: 'شراء' }
                    ].map(option => (
                      <label key={option.value} className="filter-option">
                        <input
                          type="radio"
                          name="auctionPurpose"
                          value={option.value}
                          checked={filters.auctions.purpose === option.value}
                          onChange={(e) => handleFilterChange('auctions', 'purpose', e.target.value)}
                        />
                        <span>{option.label}</span>
                      </label>
                    ))}
                  </div>
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
                      <span>{property.city}، {property.region}</span>
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
                    <span>{selectedProperty.city}، {selectedProperty.region}</span>
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