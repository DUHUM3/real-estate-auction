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
  FaLayerGroup,
  FaChevronDown,
  FaAngleLeft,
  FaAngleRight,
} from 'react-icons/fa';
import '../styles/PropertyList.css';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showSidebarFilter, setShowSidebarFilter] = useState(false);
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
  const [expandedFilterSection, setExpandedFilterSection] = useState(null);
  const [mobileDetailView, setMobileDetailView] = useState(false);
  
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
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6',
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
        image: 'https://images.unsplash.com/photo-1628624747186-a941c476b7ef',
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
        image: 'https://images.unsplash.com/photo-1631193816258-28b828b5a786',
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
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
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
        image: 'https://images.unsplash.com/photo-1582407947304-fd86f028f716',
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
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
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
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
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
        image: 'https://images.unsplash.com/photo-1617850687395-620757abd1ac',
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
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
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
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef',
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
        image: 'https://images.unsplash.com/photo-1448630360428-65456885c650',
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
      },
        {
        id: 13,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 14,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 15,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 16,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 17,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 18,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 19,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
        id: 20,
        title: 'أرض سكنية في حي الياسمين',
        type: 'أرض',
        purpose: 'سكني',
        price: 850000,
        region: 'الرياض',
        city: 'الرياض',
        area: 450,
        image: 'https://images.unsplash.com/photo-1618845072389-17ed0a939399',
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
    ];
    setProperties(sampleProperties);
    // تحديد أول عقار كافتراضي
    setSelectedProperty(sampleProperties[0]);

    // تعديل حالة الفلتر الجانبي بناءً على حجم الشاشة
    const handleResize = () => {
      if (window.innerWidth > 992) {
        setShowSidebarFilter(false);
        setMobileDetailView(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    
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

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo(0, 0);
  };

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
      window.scrollTo(0, 0);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const toggleFilterSection = (section) => {
    if (expandedFilterSection === section) {
      setExpandedFilterSection(null);
    } else {
      setExpandedFilterSection(section);
    }
  };

  // الحصول على قائمة المناطق الفريدة
  const uniqueRegions = [...new Set(properties.map(property => property.region))];

  // الحصول على قائمة المدن الفريدة حسب المنطقة المختارة
  const getUniqueCities = (region) => {
    if (!region) return [...new Set(properties.map(property => property.city))];
    return [...new Set(properties.filter(property => property.region === region).map(property => property.city))];
  };

  // التبديل بين وضع التفاصيل للجوال
  const toggleMobileDetailView = (property = null) => {
    setSelectedProperty(property);
    setMobileDetailView(!!property);
  };

  return (
    <div className="real-estate-app">
      {/* شريط البحث */}
      <div className="search-bar">
        <div className="search-container">
          <div className="search-field">
            <input
              type="text"
              placeholder="ابحث عن أرض، موقع، مزاد..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <button className="filter-toggle" onClick={() => setShowSidebarFilter(!showSidebarFilter)}>
            <FaFilter />
            <span>الفلتر</span>
          </button>
        </div>
      </div>

      <div className="content-container">
        {/* لوحة الفلتر */}
        <div className={`filter-panel ${showSidebarFilter ? 'active' : ''}`}>
          <div className="filter-header">
            <div className="filter-title">
              <FaSlidersH />
              <h3>تصفية البحث</h3>
            </div>
            <button className="close-filter" onClick={() => setShowSidebarFilter(false)}>
              <FaTimes />
            </button>
          </div>
          
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filterType === 'lands' ? 'active' : ''}`} 
              onClick={() => switchFilterType('lands')}
            >
              <FaLandmark />
              <span>الأراضي</span>
            </button>
            <button 
              className={`filter-tab ${filterType === 'auctions' ? 'active' : ''}`} 
              onClick={() => switchFilterType('auctions')}
            >
              <FaGavel />
              <span>المزادات</span>
            </button>
          </div>
          
          <div className="filter-body">
            {filterType === 'lands' ? (
              /* فلترات الأراضي */
              <div className="filter-sections">
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('region')}
                  >
                    <div className="filter-section-title">
                      <FaMapMarkerAlt />
                      <span>المنطقة والمدينة</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'region' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'region' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>المنطقة</label>
                        <select
                          value={filters.lands.region}
                          onChange={(e) => handleFilterChange('lands', 'region', e.target.value)}
                        >
                          <option value="">جميع المناطق</option>
                          {uniqueRegions.map((region, index) => (
                            <option key={index} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                      <div className="filter-input">
                        <label>المدينة</label>
                        <select
                          value={filters.lands.city}
                          onChange={(e) => handleFilterChange('lands', 'city', e.target.value)}
                        >
                          <option value="">جميع المدن</option>
                          {getUniqueCities(filters.lands.region).map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('priceArea')}
                  >
                    <div className="filter-section-title">
                      <FaMoneyBillWave />
                      <span>السعر والمساحة</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'priceArea' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'priceArea' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>نطاق السعر (ريال)</label>
                        <div className="range-inputs">
                          <input
                            type="number"
                            placeholder="الحد الأدنى"
                            value={filters.lands.priceRange.min}
                            onChange={(e) => handleRangeChange('lands', 'priceRange', parseInt(e.target.value) || 0, filters.lands.priceRange.max)}
                          />
                          <span className="range-separator">إلى</span>
                          <input
                            type="number"
                            placeholder="الحد الأقصى"
                            value={filters.lands.priceRange.max}
                            onChange={(e) => handleRangeChange('lands', 'priceRange', filters.lands.priceRange.min, parseInt(e.target.value) || 10000000)}
                          />
                        </div>
                      </div>
                      <div className="filter-input">
                        <label>المساحة (م²)</label>
                        <div className="range-inputs">
                          <input
                            type="number"
                            placeholder="الحد الأدنى"
                            value={filters.lands.area.min}
                            onChange={(e) => handleRangeChange('lands', 'area', parseInt(e.target.value) || 0, filters.lands.area.max)}
                          />
                          <span className="range-separator">إلى</span>
                          <input
                            type="number"
                            placeholder="الحد الأقصى"
                            value={filters.lands.area.max}
                            onChange={(e) => handleRangeChange('lands', 'area', filters.lands.area.min, parseInt(e.target.value) || 5000)}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('purpose')}
                  >
                    <div className="filter-section-title">
                      <FaCity />
                      <span>الغرض</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'purpose' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'purpose' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="radio-options">
                        {[
                          { value: 'all', label: 'جميع الأغراض' },
                          { value: 'سكني', label: 'سكني' },
                          { value: 'تجاري', label: 'تجاري' },
                          { value: 'زراعي', label: 'زراعي' },
                          { value: 'صناعي', label: 'صناعي' },
                          { value: 'مختلط', label: 'مختلط' }
                        ].map(option => (
                          <label key={option.value} className="radio-option">
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
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('developed')}
                  >
                    <div className="filter-section-title">
                      <FaLayerGroup />
                      <span>حالة التطوير واتجاه الأرض</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'developed' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'developed' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>حالة التطوير</label>
                        <div className="radio-options">
                          {[
                            { value: 'all', label: 'الكل' },
                            { value: 'yes', label: 'مطورة' },
                            { value: 'no', label: 'غير مطورة' }
                          ].map(option => (
                            <label key={option.value} className="radio-option">
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
                      
                      <div className="filter-input">
                        <label>اتجاه الأرض</label>
                        <div className="radio-options">
                          {[
                            { value: 'all', label: 'جميع الاتجاهات' },
                            { value: 'شمالي', label: 'شمالي' },
                            { value: 'جنوبي', label: 'جنوبي' },
                            { value: 'شرقي', label: 'شرقي' },
                            { value: 'غربي', label: 'غربي' }
                          ].map(option => (
                            <label key={option.value} className="radio-option">
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
                    </div>
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('date')}
                  >
                    <div className="filter-section-title">
                      <FaCalendarAlt />
                      <span>تاريخ النشر</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'date' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'date' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="radio-options">
                        {[
                          { value: 'all', label: 'جميع التواريخ' },
                          { value: 'today', label: 'اليوم' },
                          { value: 'thisWeek', label: 'هذا الأسبوع' },
                          { value: 'thisMonth', label: 'هذا الشهر' }
                        ].map(option => (
                          <label key={option.value} className="radio-option">
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
                  )}
                </div>
              </div>
            ) : (
              /* فلترات المزادات */
              <div className="filter-sections">
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('auctionRegion')}
                  >
                    <div className="filter-section-title">
                      <FaMapMarkerAlt />
                      <span>المنطقة والمدينة</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'auctionRegion' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'auctionRegion' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>المنطقة</label>
                        <select
                          value={filters.auctions.region}
                          onChange={(e) => handleFilterChange('auctions', 'region', e.target.value)}
                        >
                          <option value="">جميع المناطق</option>
                          {uniqueRegions.map((region, index) => (
                            <option key={index} value={region}>{region}</option>
                          ))}
                        </select>
                      </div>
                      <div className="filter-input">
                        <label>المدينة</label>
                        <select
                          value={filters.auctions.city}
                          onChange={(e) => handleFilterChange('auctions', 'city', e.target.value)}
                        >
                          <option value="">جميع المدن</option>
                          {getUniqueCities(filters.auctions.region).map((city, index) => (
                            <option key={index} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('auctionDate')}
                  >
                    <div className="filter-section-title">
                      <FaCalendarAlt />
                      <span>تاريخ المزاد</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'auctionDate' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'auctionDate' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>من تاريخ</label>
                        <input
                          type="date"
                          value={filters.auctions.dateRange.from}
                          onChange={(e) => handleDateRangeChange('auctions', 'dateRange', e.target.value, filters.auctions.dateRange.to)}
                        />
                      </div>
                      <div className="filter-input">
                        <label>إلى تاريخ</label>
                        <input
                          type="date"
                          value={filters.auctions.dateRange.to}
                          onChange={(e) => handleDateRangeChange('auctions', 'dateRange', filters.auctions.dateRange.from, e.target.value)}
                        />
                      </div>
                      <div className="filter-input">
                        <label>الأيام المتبقية (كحد أقصى)</label>
                        <input
                          type="number"
                          placeholder="عدد الأيام"
                          value={filters.auctions.daysRemaining}
                          onChange={(e) => handleFilterChange('auctions', 'daysRemaining', parseInt(e.target.value) || 30)}
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('auctionStatus')}
                  >
                    <div className="filter-section-title">
                      <FaGavel />
                      <span>حالة ونوع المزاد</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'auctionStatus' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'auctionStatus' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>حالة المزاد</label>
                        <div className="radio-options">
                          {[
                            { value: 'all', label: 'الكل' },
                            { value: 'active', label: 'نشط' },
                            { value: 'upcoming', label: 'قادم' },
                            { value: 'completed', label: 'منتهي' }
                          ].map(option => (
                            <label key={option.value} className="radio-option">
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
                      
                      <div className="filter-input">
                        <label>نوع العقار</label>
                        <div className="radio-options">
                          {[
                            { value: 'all', label: 'جميع الأنواع' },
                            { value: 'lands', label: 'أراضي' },
                            { value: 'buildings', label: 'مباني' }
                          ].map(option => (
                            <label key={option.value} className="radio-option">
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
                    </div>
                  )}
                </div>
                
                <div className="filter-section">
                  <div 
                    className="filter-section-header" 
                    onClick={() => toggleFilterSection('auctionBid')}
                  >
                    <div className="filter-section-title">
                      <FaMoneyBillWave />
                      <span>المزايدة والغرض</span>
                    </div>
                    <FaChevronDown className={expandedFilterSection === 'auctionBid' ? 'rotate' : ''} />
                  </div>
                  {(expandedFilterSection === 'auctionBid' || expandedFilterSection === null) && (
                    <div className="filter-section-content">
                      <div className="filter-input">
                        <label>الحد الأدنى للمزايدة</label>
                        <input
                          type="number"
                          placeholder="الحد الأدنى للمزايدة"
                          value={filters.auctions.minBidIncrement}
                          onChange={(e) => handleFilterChange('auctions', 'minBidIncrement', parseInt(e.target.value) || 0)}
                        />
                      </div>
                      
                      <div className="filter-input">
                        <label>الغرض من العقار</label>
                        <div className="radio-options">
                          {[
                            { value: 'all', label: 'جميع الأغراض' },
                            { value: 'استثمار', label: 'استثمار' },
                            { value: 'شراء', label: 'شراء' }
                          ].map(option => (
                            <label key={option.value} className="radio-option">
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
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="filter-actions">
              <button className="btn-apply" onClick={() => {
                setCurrentPage(1);
                setShowSidebarFilter(false);
              }}>
                تطبيق الفلتر
              </button>
              <button className="btn-reset" onClick={() => {
                resetFilters();
                setShowSidebarFilter(false);
              }}>
                إعادة تعيين
              </button>
            </div>
          </div>
        </div>
        
        {/* القائمة الرئيسية */}
        <div className={`main-content ${mobileDetailView ? 'hide-on-mobile' : ''}`}>
          <div className="result-header">
            <h2>{filterType === 'lands' ? 'الأراضي المتاحة' : 'المزادات العقارية'}</h2>
            <span className="result-count">{filteredProperties.length} عنصر</span>
          </div>
          
          {currentProperties.length > 0 ? (
            <div className="property-grid">
              {currentProperties.map(property => (
                <div 
                  key={property.id} 
                  className={`property-card ${selectedProperty?.id === property.id ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedProperty(property);
                    if (window.innerWidth <= 768) {
                      toggleMobileDetailView(property);
                    }
                  }}
                >
                  <div className="property-image">
                    <img src={property.image} alt={property.title} onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E";
                    }} />
                    {property.isAuction ? (
                      <div className="property-badge auction">
                        <FaGavel />
                        <span>مزاد</span>
                      </div>
                    ) : (
                      <div className="property-badge">
                        <span>{property.type}</span>
                      </div>
                    )}
                    <button className="favorite-btn" onClick={(e) => {
                      e.stopPropagation();
                    }}>
                      <FaHeart />
                    </button>
                    {property.isAuction && (
                      <div className="auction-timer">
                        <FaClock />
                        <span>{property.auctionEnd}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="property-info">
                    <h3 className="property-title">{property.title}</h3>
                    <div className="property-location">
                      <FaMapMarkerAlt />
                      <span>{property.city}، {property.region}</span>
                    </div>
                    <div className="property-specs">
                      <div className="spec">
                        <FaRulerCombined />
                        <span>{property.area} م²</span>
                      </div>
                      <div className="spec">
                        <FaLayerGroup />
                        <span>{property.purpose}</span>
                      </div>
                    </div>
                    {property.isAuction ? (
                      <div className="property-price auction">
                        <small>المزايدة الحالية</small>
                        <strong>{property.currentBid.toLocaleString()} ريال</strong>
                        <div className="bidders">
                          <FaGavel />
                          <span>{property.bidders} مزايد</span>
                        </div>
                      </div>
                    ) : (
                      <div className="property-price">
                        <strong>{property.price.toLocaleString()} ريال</strong>
                      </div>
                    )}
                    <div className="property-actions">
                      <Link to={`/property/${property.id}`} className="btn-details">
                        التفاصيل
                      </Link>
                      {property.isAuction ? (
                        <Link to={`/auction/${property.id}`} className="btn-contact">
                          المزايدة
                        </Link>
                      ) : (
                        <Link to={`/contact/${property.id}`} className="btn-contact">
                          اتصال
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-results">
              <FaHome className="icon" />
              <h3>لا توجد نتائج مطابقة</h3>
              <p>يرجى تعديل معايير البحث للحصول على المزيد من النتائج</p>
              <button className="btn-reset" onClick={resetFilters}>
                إعادة تعيين الفلتر
              </button>
            </div>
          )}
          
          {/* ترقيم الصفحات */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="pagination-arrow" 
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                <FaAngleRight />
              </button>
              
              <div className="pagination-numbers">
                {getPaginationGroup(currentPage, totalPages).map((num) => (
                  <button
                    key={num}
                    className={`pagination-number ${currentPage === num ? 'active' : ''}`}
                    onClick={() => paginate(num)}
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <button 
                className="pagination-arrow" 
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                <FaAngleLeft />
              </button>
            </div>
          )}
        </div>
        
        {/* تفاصيل العقار */}
        <div className={`property-details ${mobileDetailView ? 'show-on-mobile' : ''}`}>
          {selectedProperty ? (
            <>
              <div className="details-header mobile-only">
                <button className="back-btn" onClick={() => toggleMobileDetailView(null)}>
                  <FaChevronRight />
                  <span>العودة للقائمة</span>
                </button>
              </div>
              <div className="details-content">
                <div className="details-image">
                  <img src={selectedProperty.image} alt={selectedProperty.title} onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23cccccc' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='9' cy='9' r='2'%3E%3C/circle%3E%3Cpath d='M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21'%3E%3C/path%3E%3C/svg%3E";
                  }} />
                  {selectedProperty.isAuction && (
                    <div className="details-badge">
                      <FaGavel />
                      <span>مزاد عقاري</span>
                    </div>
                  )}
                </div>
                
                <div className="details-header">
                  <h2>{selectedProperty.title}</h2>
                  <div className="details-location">
                    <FaMapMarkerAlt />
                    <span>{selectedProperty.city}، {selectedProperty.region}</span>
                  </div>
                </div>
                
                {selectedProperty.isAuction ? (
                  <div className="details-auction-price">
                    <div className="auction-price-info">
                      <span className="label">المزايدة الحالية</span>
                      <span className="value">{selectedProperty.currentBid.toLocaleString()} ريال</span>
                    </div>
                    <div className="auction-meta">
                      <div className="auction-increment">
                        <FaMoneyBillWave />
                        <span>الحد الأدنى للمزايدة: {selectedProperty.minBidIncrement.toLocaleString()} ريال</span>
                      </div>
                      <div className="auction-bidders">
                        <FaGavel />
                        <span>{selectedProperty.bidders} مزايد</span>
                      </div>
                      <div className="auction-end">
                        <FaClock />
                        <span>ينتهي في: {selectedProperty.auctionEnd}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="details-price">
                    <span>{selectedProperty.price.toLocaleString()} ريال</span>
                  </div>
                )}
                
                <div className="details-specs">
                  <div className="spec-item">
                    <FaRulerCombined className="spec-icon" />
                    <div>
                      <small>المساحة</small>
                      <strong>{selectedProperty.area} م²</strong>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaCity className="spec-icon" />
                    <div>
                      <small>الغرض</small>
                      <strong>{selectedProperty.purpose}</strong>
                    </div>
                  </div>
                  <div className="spec-item">
                    <FaRegSun className="spec-icon" />
                    <div>
                      <small>الاتجاه</small>
                      <strong>{selectedProperty.facing}</strong>
                    </div>
                  </div>
                </div>
                
                <div className="details-section">
                  <h3>الوصف</h3>
                  <p>{selectedProperty.description}</p>
                </div>
                
                <div className="details-section">
                  <h3>المميزات</h3>
                  <div className="features-list">
                    {selectedProperty.features.map((feature, index) => (
                      <span key={index} className="feature-tag">{feature}</span>
                    ))}
                  </div>
                </div>
                
                <div className="details-actions">
                  <Link to={`/property/${selectedProperty.id}`} className="btn-full btn-primary">
                    عرض التفاصيل الكاملة
                  </Link>
                  {selectedProperty.isAuction ? (
                    <Link to={`/auction/${selectedProperty.id}`} className="btn-full btn-secondary">
                      الدخول للمزايدة
                    </Link>
                  ) : (
                    <Link to={`/contact/${selectedProperty.id}`} className="btn-full btn-secondary">
                      تواصل مع المالك
                    </Link>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="details-placeholder">
              <FaHome className="icon" />
              <h3>اختر عقاراً لعرض التفاصيل</h3>
              <p>انقر على أحد العقارات من القائمة لعرض المزيد من المعلومات</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Overlay */}
      {showSidebarFilter && <div className="overlay" onClick={() => setShowSidebarFilter(false)}></div>}
      {mobileDetailView && <div className="overlay mobile-only" onClick={() => toggleMobileDetailView(null)}></div>}
    </div>
  );
}

// وظيفة مساعدة لإنشاء مجموعة أرقام الصفحات
function getPaginationGroup(currentPage, totalPages) {
  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4 && totalPages > 4) {
    startPage = Math.max(1, endPage - 4);
  }
  
  return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
}

export default PropertyList;