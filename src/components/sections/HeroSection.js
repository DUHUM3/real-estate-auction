import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../../icons";

const HeroSection = ({ onSellLandClick, onBrowseInvestments }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const images = [
      "/images/slide1.jpg",
      "/images/slide5.jpg",
      "/images/slide3.jpg",
    ];

    const img = new Image();
    img.src = images[0];
    img.onload = () => setFirstImageLoaded(true);
    img.onerror = () => setFirstImageLoaded(true);

    images.slice(1).forEach((src) => {
      const preload = new Image();
      preload.src = src;
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(
      () => setCurrentSlide((prev) => (prev + 1) % 3),
      5000
    );
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate("/lands-and-auctions-list", {
      state: { searchQuery: searchTerm, searchFromHome: true },
    });
  };

  return (
    <section className="hero-section" id="home">
      {/* الشريط المتحرك */}
      <div className="client-ticker">
        <div className="ticker-content">
          {[
            "نربط الأطراف ونُغلق الصفقات باحترافية تحفظ الحقوق",
            "من عرض الأرض إلى إتمام الصفقة… كل شيء يبدأ من هنا",
            "مصداقية عالية، إدارة ذكية، ونتائج ملموسة",
            "هنا تُصنع الفرص الاستثمارية الكبرى",
            "منصة عقارية احترافية بمعايير السوق السعودي",
            "منظومة ذكية تعيد تعريف الوساطة العقارية",
          ].map((text, index) => (
            <div className="ticker-item" key={index}>
              <Icons.FaStar className="react-icon" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* الخلفية */}
      {firstImageLoaded ? (
        <div className={`hero-background slide-${currentSlide}`} />
      ) : (
        <div className="hero-background loading-background" />
      )}

      {/* المحتوى */}
      <div className="hero-content container">
        <div className="hero-title-container">
          <h1 className="title-with-decoration7">
            الصفقات الكبرى تبدأ من <span className="land-word">هنا</span>
            <div className="transparent-box"></div>
          </h1>
        </div>

        <p className="hero-subtitle">
          حلقة الوصل الذكية بين المستثمرين وملاك الأراضي والفرص العقارية النوعية
        </p>

        {/* البحث */}
        <div className="search-filter">
          <form onSubmit={handleSearch} className="filter-form">
            <div className="filter-group">
              <Icons.FaSearch className="search-icon" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث عن أرض، فرصة استثمار، أو مزاد"
              />
            </div>
            <button type="submit" className="search-submit">
              بحث
            </button>
          </form>
        </div>

        {/* الأزرار */}
        <div className="hero-buttons">
          <button className="hero-btn primary-btn" onClick={onSellLandClick}>
            <Icons.FaLandmark className="btn-icon" />
            <span>اعرض أرضك للبيع</span>
          </button>

          <button
            className="hero-btn secondary-btn"
            onClick={onBrowseInvestments}
          >
            <Icons.FaSearchDollar className="btn-icon" />
            <span>ابحث عن فرصة استثمار</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
