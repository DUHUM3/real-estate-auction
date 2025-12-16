import React, { useState, useCallback, useEffect, useMemo } from "react";
import {
  FaEye,
  FaPaperPlane,
  FaChartLine,
  FaHandshake,
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

// ثوابت التطبيق
const CONFIG = {
  AUTO_SLIDE_INTERVAL: 5000, // 5 ثواني
  ANIMATION_DURATION: 300,
};

// بيانات البطاقات
const CARDS_DATA = [
  {
    id: 1,
    title: "القيم الجوهرية",
    titleEn: "Core Values",
    icon: FaHandshake,
    color: "#53a1dd",
    details: [
      "الشفافية: التزام كامل بتقديم معلومات واضحة وإجراءات موثوقة في كل مرحلة",
      "الاحترافية: إدارة جميع الخدمات والعمليات بمعايير عالية وخبرة متخصصة",
      "الابتكار: تطوير حلول وتقنيات عقارية رقمية تعزز التجربة وتدعم اتخاذ القرار",
      "الموثوقية: بناء علاقة ثقة طويلة الأمد مع العملاء والمعلنين وشركات المزادات",
      "حفظ الحقوق: آليات واضحة لضمان حقوق المنصة والمعلنين والمشترين",
      "خدمة العميل: تسهيل الوصول للفرص المناسبة وتقديم دعم متواصل",
      "الشراكة: اعتبار جميع الأطراف شركاء أساسيين في نجاح المنصة",
    ],
  },
  {
    id: 2,
    title: "الأهداف الاستراتيجية",
    titleEn: "Strategic Goals",
    icon: FaChartLine,
    color: "#53a1dd",
    details: [
      "بناء منصة عقارية موثوقة وفعّالة تربط جميع أطراف السوق تحت مظلة واحدة",
      "تسهيل وتسريع عمليات البيع والشراء والاستثمار العقاري عبر خدمات رقمية متكاملة",
      "تمكين شركات المزادات من الوصول لشريحة أكبر من المستثمرين عبر قناة رسمية واحترافية",
      "توفير نظام متطور لإدارة الطلبات يربط العملاء بالمعلنين بطريقة مباشرة وذكية",
      "حماية حقوق وعمولات جميع الأطراف عبر أنظمة واضحة ومؤتمتة داخل المنصة",
      "تطوير خدمات تقنية مبتكرة ترفع من جودة التجربة العقارية وتزيد من فرص إتمام الصفقات",
      "تعزيز الثقة في القطاع العقاري من خلال الشفافية، الدقة، وإدارة العمليات باحترافية عالية",
      "دعم التحول الرقمي للعقار في المملكة بما يتوافق مع رؤية السعودية 2030",
    ],
  },

  {
    id: 3,
    title: "الرسالة",
    titleEn: "Mission",
    description:
      "تقديم حلول عقارية مبتكرة تجمع بين التكنولوجيا، الاحترافية، والشراكات الفعّالة، من خلال منظومة خدمات تشمل عرض الأراضي، إدارة الطلبات، ربط العملاء بشركات المزادات، وتمكين هذه الشركات من عرض مزاداتها داخل المنصة، بما يضمن شفافية التعامل، حماية الحقوق، ورفع كفاءة السوق العقاري في المملكة.",
    icon: FaPaperPlane,
    color: "#53a1dd",
  },
  {
    id: 4,
    title: "الرؤية",
    titleEn: "Vision",
    description:
      "أن تكون شاهين بلس المنصة العقارية الأذكى والأكثر موثوقية في المملكة العربية السعودية، والمرجع الأول الذي يجمع بين تسويق وعرض الأراضي، وتفعيل الطلبات العقارية، وعرض المزادات، ضمن منظومة رقمية متكاملة تحفظ الحقوق وتُسهل إتمام الصفقات بجودة عالية",
    icon: FaEye,
    color: "#53a1dd",
  },
];

// مكون البطاقة في الشاشات الكبيرة
const DesktopCard = ({ card, isActive }) => {
  const IconComponent = card.icon;

  return (
    <div
      className={`bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between shadow-2xl border border-gray-200 relative overflow-hidden transition-all duration-500 ${
        isActive ? "opacity-100" : "opacity-0"
      }`}
      role="tabpanel"
      aria-labelledby={`tab-${card.id}`}
      aria-hidden={!isActive}
    >
      {/* زخرفة خلفية */}
      <div
        className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      ></div>
      <div
        className="absolute bottom-0 right-0 w-96 h-96 bg-gradient-to-tl from-yellow-100/20 to-transparent rounded-full blur-3xl translate-x-1/2 translate-y-1/2"
        aria-hidden="true"
      ></div>

      <div className="flex items-start gap-8 md:gap-10 flex-1 relative z-10">
        {/* الأيقونة */}
        <div
          className="text-4xl md:text-5xl h-24 w-24 md:h-28 md:w-28 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-lg transition-transform duration-300 hover:scale-110"
          style={{ color: card.color }}
          aria-hidden="true"
        >
          <IconComponent />
        </div>

        {/* المحتوى */}
        <div className="flex-1 text-right">
          <h3
            className="text-2xl md:text-3xl font-bold mb-4 md:mb-6"
            style={{ color: card.color }}
          >
            {card.title}
            <span className="text-lg md:text-xl text-gray-500 mr-2">
              ({card.titleEn})
            </span>
          </h3>

          {card.description && (
            <p className="text-gray-700 text-lg md:text-xl leading-relaxed mb-6 md:mb-8 border-r-4 border-yellow-500 pr-4 md:pr-6">
              {card.description}
            </p>
          )}

          {card.details && (
            <div className="text-right">
              <ul className="space-y-3" role="list">
                {card.details.map((detail, index) => (
                  <li
                    key={index}
                    className="text-gray-600 text-base md:text-lg relative pr-8 leading-relaxed transition-all duration-300 hover:text-gray-800 hover:pr-10"
                  >
                    <FaCheck
                      className="text-green-500 absolute right-0 top-1 text-sm md:text-base"
                      aria-hidden="true"
                    />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// مكون البطاقة في الأجهزة المحمولة
const MobileCard = ({ card, isActive }) => {
  const IconComponent = card.icon;

  return (
    <div
      className={`w-full bg-white rounded-xl p-5 md:p-6 shadow-lg mb-6 transition-all duration-500 ${
        isActive ? "block opacity-100 scale-100" : "hidden opacity-0 scale-95"
      }`}
      role="tabpanel"
      aria-labelledby={`mobile-tab-${card.id}`}
      aria-hidden={!isActive}
    >
      {/* الأيقونة */}
      <div
        className="text-3xl h-20 w-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-md transition-transform duration-300 hover:scale-110"
        style={{ color: card.color }}
        aria-hidden="true"
      >
        <IconComponent />
      </div>

      {/* العنوان */}
      <h3
        className="text-xl md:text-2xl font-semibold mb-3 text-center"
        style={{ color: card.color }}
      >
        {card.title}
        <span className="block text-sm md:text-base text-gray-500 mt-1">
          ({card.titleEn})
        </span>
      </h3>

      {/* الوصف */}
      {card.description && (
        <p className="text-gray-600 text-base md:text-lg leading-relaxed mb-4 text-center px-2">
          {card.description}
        </p>
      )}

      {/* التفاصيل */}
      {card.details && (
        <div className="text-right mt-4">
          <ul className="space-y-2" role="list">
            {card.details.map((detail, idx) => (
              <li
                key={idx}
                className="text-gray-600 text-sm md:text-base relative pr-6 leading-relaxed text-right"
              >
                <FaCheck
                  className="text-green-500 absolute right-0 top-0.5 text-xs md:text-sm"
                  aria-hidden="true"
                />
                {detail}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// المكون الرئيسي
const WhyUsSection = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // التنقل للبطاقة التالية
  const nextCard = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveTab((prev) => (prev === CARDS_DATA.length - 1 ? 0 : prev + 1));

    setTimeout(() => setIsTransitioning(false), CONFIG.ANIMATION_DURATION);
  }, [isTransitioning]);

  // التنقل للبطاقة السابقة
  const prevCard = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveTab((prev) => (prev === 0 ? CARDS_DATA.length - 1 : prev - 1));

    setTimeout(() => setIsTransitioning(false), CONFIG.ANIMATION_DURATION);
  }, [isTransitioning]);

  // تغيير البطاقة مباشرة
  const goToCard = useCallback(
    (index) => {
      if (isTransitioning || index === activeTab) return;

      setIsTransitioning(true);
      setActiveTab(index);

      setTimeout(() => setIsTransitioning(false), CONFIG.ANIMATION_DURATION);
    },
    [activeTab, isTransitioning]
  );

  // معالجة لوحة المفاتيح
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        prevCard();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        nextCard();
      }
    },
    [nextCard, prevCard]
  );

  // السلايدر التلقائي
  useEffect(() => {
    if (isPaused || CARDS_DATA.length <= 1) return;

    const interval = setInterval(nextCard, CONFIG.AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [isPaused, nextCard]);

  // البطاقة الحالية
  const currentCard = useMemo(() => CARDS_DATA[activeTab], [activeTab]);

  return (
    <section
      className="bg-white py-12 md:py-20 relative"
      aria-labelledby="why-us-heading"
    >
      <div className="container mx-auto px-4">
        {/* العنوان */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-right"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">
              خدماتنا المميزة
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 leading-tight">
            لماذا تتستخدم شاهين بلس؟
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-l from-blue-600 to-cyan-500 rounded-full"></div>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            نقدّم تجربة عقارية متكاملة تربط العارضين بالمستثمرين عبر حلول رقمية
            موثوقة وفعّالة.
          </p>
        </motion.div>

        {/* الشاشات الكبيرة */}
        <div
          className="hidden lg:block"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          role="tablist"
          aria-label="بطاقات لماذا تستخدم شاهين بلس"
        >
          {/* البطاقات */}
          <div className="relative">
            {CARDS_DATA.map((card, index) => (
              <div
                key={card.id}
                className={`${index === activeTab ? "block" : "hidden"}`}
              >
                <DesktopCard card={card} isActive={index === activeTab} />
              </div>
            ))}
          </div>

          {/* أزرار التحكم والتبويبات */}
          <div className="flex justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-300">
            {/* أزرار التنقل */}
            <div className="flex gap-4">
              <button
                className="bg-[#53a1dd] text-white border-none w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#458bc2] hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={prevCard}
                disabled={isTransitioning}
                aria-label="البطاقة السابقة"
                type="button"
              >
                <FaChevronRight aria-hidden="true" />
              </button>
              <button
                className="bg-[#53a1dd] text-white border-none w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#458bc2] hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={nextCard}
                disabled={isTransitioning}
                aria-label="البطاقة التالية"
                type="button"
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
            </div>

            {/* التبويبات */}
            <div className="flex gap-3 flex-wrap justify-center flex-1">
              {CARDS_DATA.map((card, index) => (
                <button
                  key={card.id}
                  id={`tab-${card.id}`}
                  className={`px-4 py-2 md:px-5 md:py-3 rounded-lg cursor-pointer transition-all duration-300 text-sm font-medium whitespace-nowrap border-2 ${
                    activeTab === index
                      ? "bg-[#53a1dd] border-[#53a1dd] text-white -translate-y-1 shadow-lg"
                      : "bg-white border-gray-300 text-gray-600 hover:border-[#53a1dd] hover:text-[#53a1dd]"
                  } focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50`}
                  onClick={() => goToCard(index)}
                  disabled={isTransitioning}
                  role="tab"
                  aria-selected={activeTab === index}
                  aria-controls={`tabpanel-${card.id}`}
                  type="button"
                >
                  {card.title}
                </button>
              ))}
            </div>
          </div>

          {!isPaused && (
            <div
              key={activeTab} // 👈 هذا هو الحل
              className="mt-6 h-1 bg-gray-200 rounded-full overflow-hidden"
              aria-hidden="true"
            >
              <div
                className="h-full bg-gradient-to-l from-blue-600 to-cyan-500"
                style={{
                  animation: `progress ${CONFIG.AUTO_SLIDE_INTERVAL}ms linear`,
                }}
              />
            </div>
          )}
        </div>

        {/* الأجهزة المحمولة */}
        <div
          className="block lg:hidden"
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          role="tablist"
          aria-label="بطاقات لماذا تستخدم شاهين بلس"
        >
          <div className="w-full relative">
            {CARDS_DATA.map((card, index) => (
              <MobileCard
                key={card.id}
                card={card}
                isActive={activeTab === index}
              />
            ))}

            {/* أزرار التحكم والمؤشرات */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                className="bg-[#53a1dd] text-white border-none rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#458bc2] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50"
                onClick={prevCard}
                disabled={isTransitioning}
                aria-label="البطاقة السابقة"
                type="button"
              >
                <FaChevronRight aria-hidden="true" />
              </button>

              {/* المؤشرات */}
              <div className="flex gap-2" role="tablist">
                {CARDS_DATA.map((card, index) => (
                  <button
                    key={card.id}
                    id={`mobile-tab-${card.id}`}
                    className={`w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300 ${
                      activeTab === index
                        ? "bg-[#53a1dd] scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    } focus:outline-none focus:ring-2 focus:ring-[#d4af37]`}
                    onClick={() => goToCard(index)}
                    disabled={isTransitioning}
                    role="tab"
                    aria-selected={activeTab === index}
                    aria-label={`الانتقال إلى ${card.title}`}
                    type="button"
                  ></button>
                ))}
              </div>

              <button
                className="bg-[#53a1dd] text-white border-none rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#458bc2] focus:outline-none focus:ring-2 focus:ring-[#d4af37] focus:ring-offset-2 disabled:opacity-50"
                onClick={nextCard}
                disabled={isTransitioning}
                aria-label="البطاقة التالية"
                type="button"
              >
                <FaChevronLeft aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  );
};

export default React.memo(WhyUsSection);
