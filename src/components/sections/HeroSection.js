import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Icons from "../../icons";

const HeroSection = ({ onSellLandClick, onBrowseInvestments }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [firstImageLoaded, setFirstImageLoaded] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();

  // قائمة الصور - يمكن نقلها لملف config
  const slideImages = useMemo(
    () => [
      `${process.env.PUBLIC_URL}/images/slide1.webp`,
      `${process.env.PUBLIC_URL}/images/slide5.webp`,
      `${process.env.PUBLIC_URL}/images/slide3.webp`,
    ],
    []
  );

  // محتوى الشريط المتحرك - يمكن نقله لملف config
  const tickerContent = useMemo(
    () => [
      "نربط الأطراف ونُغلق الصفقات باحترافية تحفظ الحقوق",
      "من عرض الأرض إلى إتمام الصفقة… كل شيء يبدأ من هنا",
      "مصداقية عالية، إدارة ذكية، ونتائج ملموسة",
      "هنا تُصنع الفرص الاستثمارية الكبرى",
      "منصة عقارية احترافية بمعايير السوق السعودي",
      "منظومة ذكية تعيد تعريف الوساطة العقارية",
    ],
    []
  );

  // تحميل الصور مسبقاً
  useEffect(() => {
    const preloadImages = async () => {
      try {
        const imagePromises = slideImages.map((src) => {
          return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(src);
            img.onerror = () => reject(src);
            img.src = src;
          });
        });

        await Promise.race([
          imagePromises[0],
          new Promise((resolve) => setTimeout(resolve, 3000)),
        ]);
        setFirstImageLoaded(true);

        // تحميل باقي الصور في الخلفية
        Promise.all(imagePromises.slice(1)).catch((error) => {
          console.warn("بعض الصور لم يتم تحميلها:", error);
        });
      } catch (error) {
        console.error("خطأ في تحميل الصور:", error);
        setFirstImageLoaded(true);
      }
    };

    preloadImages();
  }, [slideImages]);

  // السلايدر التلقائي
  useEffect(() => {
    if (!firstImageLoaded) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slideImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [firstImageLoaded, slideImages.length]);

  // معالج البحث
  const handleSearch = useCallback(
    async (e) => {
      e.preventDefault();

      const trimmedSearch = searchTerm.trim();

      if (!trimmedSearch) {
        return;
      }

      if (trimmedSearch.length < 2) {
        // يمكنك إضافة رسالة خطأ هنا
        return;
      }

      try {
        setIsSearching(true);

        navigate("/lands-and-auctions-list", {
          state: {
            searchQuery: trimmedSearch,
            searchFromHome: true,
            timestamp: Date.now(),
          },
        });
      } catch (error) {
        console.error("خطأ في التنقل:", error);
      } finally {
        setIsSearching(false);
      }
    },
    [searchTerm, navigate]
  );

  // معالج تغيير البحث
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    // تحديد طول النص المسموح
    if (value.length <= 100) {
      setSearchTerm(value);
    }
  }, []);

  // معالج زر عرض الأرض
  const handleSellLandClick = useCallback(() => {
    if (onSellLandClick && typeof onSellLandClick === "function") {
      onSellLandClick();
    }
  }, [onSellLandClick]);

  // معالج زر البحث عن استثمار
  const handleBrowseInvestmentsClick = useCallback(() => {
    if (onBrowseInvestments && typeof onBrowseInvestments === "function") {
      onBrowseInvestments();
    }
  }, [onBrowseInvestments]);

  return (
    <section className="hero-section" id="home" aria-label="القسم الرئيسي">
      {/* الشريط المتحرك */}
      <div className="client-ticker" role="marquee" aria-label="شريط المزايا">
        <div className="ticker-content">
          {tickerContent.map((text, index) => (
            <div className="ticker-item" key={`ticker-${index}`}>
              <Icons.FaStar className="react-icon" aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
          {/* تكرار المحتوى لضمان استمرارية الحركة */}
          {tickerContent.map((text, index) => (
            <div className="ticker-item" key={`ticker-duplicate-${index}`}>
              <Icons.FaStar className="react-icon" aria-hidden="true" />
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* الخلفية مع تأثير التلاشي */}
      <div className="hero-background-wrapper">
        {firstImageLoaded ? (
          <div
            className={`hero-background slide-${currentSlide}`}
            role="img"
            aria-label={`صورة خلفية ${currentSlide + 1}`}
          />
        ) : (
          <div
            className="hero-background loading-background"
            role="img"
            aria-label="جاري التحميل"
          />
        )}
        <div className="hero-overlay" aria-hidden="true" />
      </div>

      {/* المحتوى الرئيسي */}
      <div className="hero-content container">
        <div className="hero-title-container">
          <h1 className="title-with-decoration7">
            الصفقات الكبرى تبدأ من{" "}
            <span className="land-word" aria-label="هنا">
              هنا
            </span>
            <div className="transparent-box" aria-hidden="true" />
          </h1>
        </div>

        <p className="hero-subtitle">
          حلقة الوصل الذكية بين المستثمرين وملاك الأراضي والفرص العقارية النوعية
        </p>

        {/* نموذج البحث */}
        <div className="search-filter">
          <form
            onSubmit={handleSearch}
            className="filter-form"
            role="search"
            aria-label="نموذج البحث"
          >
            <div className="filter-group">
              <Icons.FaSearch className="search-icon" aria-hidden="true" />
              <label htmlFor="hero-search" className="sr-only">
                ابحث عن أرض، فرصة استثمار، أو مزاد
              </label>
              <input
                id="hero-search"
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="ابحث عن أرض، فرصة استثمار، أو مزاد"
                disabled={isSearching}
                autoComplete="off"
                maxLength={100}
                aria-label="حقل البحث"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching || !searchTerm.trim()}
              aria-label="إرسال البحث"
              className="
    bg-[#3a83f3]
    hover:bg-[#2f72d6]
    text-white
    px-6 py-3
    rounded-lg
    font-semibold
    transition-all
    duration-300
    shadow-sm
    hover:shadow-md
    disabled:opacity-60
    disabled:cursor-not-allowed
  "
            >
              {isSearching ? "جاري البحث..." : "بحث"}
            </button>
          </form>
        </div>

        {/* أزرار الإجراءات */}
        <div className="hero-buttons" role="group" aria-label="أزرار الإجراءات">
          <button
            className="hero-btn primary-btn"
            onClick={handleSellLandClick}
            aria-label="اعرض أرضك للبيع"
            type="button"
          >
            <Icons.FaLandmark className="btn-icon" aria-hidden="true" />
            <span>اعرض أرضك للبيع</span>
          </button>

          <button
            className="hero-btn secondary-btn"
            onClick={handleBrowseInvestmentsClick}
            aria-label="ابحث عن فرصة استثمار"
            type="button"
          >
            <Icons.FaSearchDollar className="btn-icon" aria-hidden="true" />
            <span>ابحث عن فرصة استثمار</span>
          </button>
        </div>
      </div>
    </section>
  );
};

// إضافة PropTypes للتحقق من الأنواع في بيئة التطوير
if (process.env.NODE_ENV !== "production") {
  HeroSection.propTypes = {
    onSellLandClick: function (props, propName, componentName) {
      if (props[propName] && typeof props[propName] !== "function") {
        return new Error(
          `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a function.`
        );
      }
    },
    onBrowseInvestments: function (props, propName, componentName) {
      if (props[propName] && typeof props[propName] !== "function") {
        return new Error(
          `Invalid prop \`${propName}\` supplied to \`${componentName}\`. Expected a function.`
        );
      }
    },
  };
}

export default React.memo(HeroSection);
