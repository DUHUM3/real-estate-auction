import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icons from '../../icons/index';

const HeroSection = ({ onSellLandClick, onBrowseInvestments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

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
            <span>شركاء النجاح مع أكبر شركات التطوير العقاري في المملكة</span>
          </div>
          <div className="ticker-item">
            <Icons.FaReact className="react-icon" />
            <span>نفخر بتقديم خدمات عقارية متكاملة بمعايير عالمية</span>
          </div>
        </div>
      </div>

      <div className={`hero-background slide-${currentSlide}`}></div>

      <div className="hero-content container">
        <div className="hero-title-container">
          <div className="title-with-decoration7">
            استثمر في أفضل <span className="land-word">الأراضي</span>
            <div className="transparent-box"></div>
          </div>
        </div>

        <p>منصة متكاملة لشراء وبيع الأراضي والاراضي عبر مزادات إلكترونية آمنة وموثوقة</p>

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