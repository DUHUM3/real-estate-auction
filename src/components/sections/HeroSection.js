import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../icons/index';

const HeroSection = ({ onSellLandClick, onBrowseInvestments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const navigate = useNavigate();

  // تحميل الصورة الأولى فوراً ثم باقي الصور
  useEffect(() => {
    const imageUrls = [
      '/images/slide1.jpg',
      '/images/slide5.jpg', 
      '/images/slide3.jpg'
    ];

    // تحميل الصورة الأولى بشكل منفصل وفوري
    const loadFirstImage = () => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = imageUrls[0];
        img.onload = () => {
          setFirstImageLoaded(true);
          resolve();
        };
        img.onerror = () => {
          setFirstImageLoaded(true); // استمر حتى لو فشلت الصورة
          resolve();
        };
      });
    };

    // تحميل باقي الصور في الخلفية
    const loadRemainingImages = () => {
      const promises = imageUrls.slice(1).map(url => {
        return new Promise((resolve) => {
          const img = new Image();
          img.src = url;
          img.onload = resolve;
          img.onerror = resolve; // تجاهل الأخطاء للصور الأخرى
        });
      });

      Promise.all(promises)
        .then(() => {
          setImagesLoaded(true);
        })
        .catch(() => {
          setImagesLoaded(true);
        });
    };

    // بدء تحميل الصورة الأولى ثم الباقي
    loadFirstImage().then(loadRemainingImages);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate('/lands-and-auctions-list', {
      state: {
        searchQuery: searchTerm,
        searchFromHome: true
      }
    });
  };

  return (
    <section className="hero-section" id="home">
      <div className="client-ticker">
        <div className="ticker-content">
          <div className="ticker-item">
            <Icons.FaReact className="react-icon" />
            <span>عملاؤنا مستمرون في الثقة بخدماتنا منذ أكثر من 15 عاماً</span>
          </div>
          <div className="ticker-item">
            <Icons.FaReact className="react-icon" />
            <span>أكثر من 5000 عميل راضٍ عن خدماتنا العقارية المتميزة</span>
          </div>
          <div className="ticker-item">
            <Icons.FaReact className="react-icon" />
            <span>شركاء النجاح مع أكبر شركات التطوير العقاري في المملكة العربية السعودية</span>
          </div>
          <div className="ticker-item">
            <Icons.FaReact className="react-icon" />
            <span>نفخر بتقديم خدمات عقارية متكاملة بمعايير عالمية</span>
          </div>
        </div>
      </div>

      {/* عرض الخلفية فور تحميل الصورة الأولى */}
      {firstImageLoaded && (
        <div className={`hero-background slide-${currentSlide}`}></div>
      )}

      {/* خلفية بديلة أثناء التحميل */}
      {!firstImageLoaded && (
        <div className="hero-background loading-background"></div>
      )}

      <div className="hero-content container">
        <div className="hero-title-container">
          <div className="title-with-decoration7">
              الصفقات الكبيرة تبدأ من<span className="land-word">هنا</span>
            <div className="transparent-box"></div>
          </div>
        </div>

        <p>حلقة الوصل الذكية بين الرغبين بالشراء والمستثمرين وملاك الأراضي</p>

        <div className="search-filter">
          <form onSubmit={handleSearch} className="filter-form">
            <div className="filter-group">
              <Icons.FaSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder=""
              />
              <div className="typing-placeholder"></div>
            </div>
            <button type="submit" className="search-submit">بحث</button>
          </form>
        </div>

        <div className="hero-buttons">
          <button
            className="hero-btn primary-btn"
            onClick={onSellLandClick}
          >
            <Icons.FaSearch className="btn-icon" />
            <span className="btn-text">اعرض أرضك للبيع</span>
          </button>

          <button
            className="hero-btn secondary-btn"
            onClick={onBrowseInvestments}
          >
            <Icons.FaSearchDollar className="btn-icon" />
            <span className="btn-text">ابحث عن استثمار</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;