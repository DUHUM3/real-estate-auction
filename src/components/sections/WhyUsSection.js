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
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Target, Rocket, Shield, Zap } from "lucide-react";

// ثوابت التطبيق
const CONFIG = {
  AUTO_SLIDE_INTERVAL: 6000,
  ANIMATION_DURATION: 400,
  COLORS: {
    primary: "#53a1dd",
    primaryLight: "#e6f2ff",
    primaryDark: "#4a8fc7",
    accent: "#ffd700",
    textDark: "#1a202c",
    textLight: "#4a5568",
  },
};

// بيانات البطاقات - مُحسّنة مع أقسام وأيقونات
const CARDS_DATA = [
  {
    id: 1,
    title: "القيم الجوهرية",
    titleEn: "Core Values",
    icon: Shield,
    color: CONFIG.COLORS.primary,
    sections: [
      {
        title: "الشفافية والوضوح",
        items: ["معلومات واضحة وإجراءات موثوقة في كل مرحلة", "تقارير شفافة للعملاء والمستثمرين"],
      },
      {
        title: "الاحترافية والتميز",
        items: ["معايير عالية في كل عملية", "خبرة متخصصة في كل تفصيل"],
      },
      {
        title: "الابتكار والتطوير",
        items: ["حلول وتقنيات عقارية رقمية متطورة", "تجارب مستخدم محسنة باستمرار"],
      },
      {
        title: "الموثوقية والثقة",
        items: ["بناء علاقات طويلة الأمد", "التزام بالوعود والاتفاقيات"],
      },
    ],
  },
  {
    id: 2,
    title: "الأهداف الاستراتيجية",
    titleEn: "Strategic Goals",
    icon: Target,
    color: CONFIG.COLORS.primary,
    sections: [
      {
        title: "بناء منصة موثوقة",
        items: ["ربط جميع أطراف السوق العقاري", "توفير بيئة آمنة وفعّالة"],
      },
      {
        title: "تسهيل العمليات",
        items: ["تسريع عمليات البيع والشراء", "خدمات رقمية متكاملة"],
      },
      {
        title: "تمكين شركات المزادات",
        items: ["الوصول لشريحة أكبر من المستثمرين", "قنوات احترافية وعالية الجودة"],
      },
      {
        title: "إدارة الطلبات الذكية",
        items: ["ربط العملاء بالمعلنين مباشرة", "أنظمة مطابقة ذكية"],
      },
    ],
  },
  {
    id: 3,
    title: "الرسالة",
    titleEn: "Mission",
    icon: Rocket,
    color: CONFIG.COLORS.primary,
    description:
      "تقديم حلول عقارية مبتكرة تجمع بين التكنولوجيا، الاحترافية، والشراكات الفعّالة، من خلال منظومة خدمات تشمل عرض الأراضي، إدارة الطلبات، ربط العملاء بشركات المزادات، وتمكين هذه الشركات من عرض مزاداتها داخل المنصة، بما يضمن شفافية التعامل، حماية الحقوق، ورفع كفاءة السوق العقاري في المملكة.",
    highlights: [
      "حلول عقارية مبتكرة",
      "تكنولوجيا متطورة",
      "شراكات فعالة",
      "خدمات متكاملة",
      "شفافية كاملة",
      "حماية الحقوق",
      "كفاءة عالية",
    ],
  },
  {
    id: 4,
    title: "الرؤية",
    titleEn: "Vision",
    icon: Zap,
    color: CONFIG.COLORS.primary,
    description:
      "أن تكون شاهين بلس المنصة العقارية الأذكى والأكثر موثوقية في المملكة العربية السعودية، والمرجع الأول الذي يجمع بين تسويق وعرض الأراضي، وتفعيل الطلبات العقارية، وعرض المزادات، ضمن منظومة رقمية متكاملة تحفظ الحقوق وتُسهل إتمام الصفقات بجودة عالية",
    visionPoints: [
      "المنصة الأذكى في المملكة",
      "الأكثر موثوقية وثقة",
      "المرجع الأول للعقار",
      "منظومة رقمية متكاملة",
      "حفظ الحقوق والالتزامات",
      "إتمام صفقات بجودة عالية",
    ],
  },
];

// مكون البطاقة في الشاشات الكبيرة - تصميم مصغّر
const DesktopCard = ({ card, isActive }) => {
  const IconComponent = card.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className={`bg-white rounded-2xl p-6 min-h-[450px] flex flex-col shadow-xl border border-gray-100 relative overflow-hidden ${
        isActive ? "block" : "hidden"
      }`}
    >
      {/* الشريط العلوي الملون */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#53a1dd] to-[#4a8fc7] rounded-t-2xl"></div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* العنوان والأيقونة */}
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] p-3 rounded-xl shadow-md flex-shrink-0">
            <IconComponent className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1 text-right">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {card.title}
            </h3>
            <p className="text-[#53a1dd] text-base font-medium">
              {card.titleEn}
            </p>
          </div>
        </div>

        {/* الوصف المختصر */}
        {card.description && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 text-base leading-relaxed mb-6 bg-blue-50 p-4 rounded-xl border border-blue-100 text-right"
          >
            {card.description}
          </motion.p>
        )}

        {/* محتوى تفصيلي */}
        <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
          {card.sections ? (
            <div className="space-y-4">
              {card.sections.map((section, sectionIndex) => (
                <motion.div
                  key={sectionIndex}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: sectionIndex * 0.08 }}
                  className="bg-white rounded-lg p-4 border border-gray-100 shadow-sm hover:shadow transition-shadow duration-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-1.5 h-6 bg-gradient-to-b from-[#53a1dd] to-[#4a8fc7] rounded-full"></div>
                    <h4 className="text-lg font-bold text-gray-800">
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-1.5 pr-5">
                    {section.items.map((item, itemIndex) => (
                      <motion.li
                        key={itemIndex}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: (sectionIndex * 0.08) + (itemIndex * 0.04) }}
                        className="text-gray-600 text-sm flex items-start gap-2 text-right"
                      >
                        <FaCheck className="text-[#53a1dd] mt-0.5 flex-shrink-0 text-xs" />
                        <span className="flex-1">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          ) : card.highlights ? (
            <div className="grid grid-cols-2 gap-3">
              {card.highlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.08 }}
                  className="bg-gradient-to-r from-blue-50 to-white p-3 rounded-lg border border-blue-100 text-center"
                >
                  <span className="text-[#53a1dd] font-semibold text-sm">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>
          ) : card.visionPoints ? (
            <div className="space-y-3">
              {card.visionPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center gap-2 p-3 bg-gradient-to-l from-blue-50 to-transparent rounded-lg text-right"
                >
                  <div className="w-2 h-2 bg-[#53a1dd] rounded-full flex-shrink-0"></div>
                  <span className="text-gray-700 text-sm flex-1">{point}</span>
                </motion.div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

// مكون البطاقة في الأجهزة المحمولة - بدون تغيير
const MobileCard = ({ card, isActive }) => {
  const IconComponent = card.icon;

  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-xl mb-6 border border-gray-100 relative overflow-hidden"
    >
      {/* شريط علوي ملون */}
      <div className="absolute top-0 right-0 left-0 h-1.5 bg-gradient-to-r from-[#53a1dd] to-[#4a8fc7] rounded-t-2xl"></div>

      {/* العنوان والأيقونة */}
      <div className="flex items-center gap-4 mb-6">
        <div className="bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] p-3 rounded-xl">
          <IconComponent className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1 text-right">
          <h3 className="text-xl font-bold text-gray-900">{card.title}</h3>
          <p className="text-[#53a1dd] text-sm">{card.titleEn}</p>
        </div>
      </div>

      {/* الوصف */}
      {card.description && (
        <p className="text-gray-600 text-sm leading-relaxed mb-6 bg-blue-50 p-4 rounded-xl">
          {card.description}
        </p>
      )}

      {/* المحتوى */}
      <div className="space-y-4">
        {card.sections ? (
          card.sections.slice(0, 3).map((section, sectionIndex) => (
            <div key={sectionIndex} className="border border-gray-100 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-6 bg-[#53a1dd] rounded-full"></div>
                <h4 className="text-sm font-bold text-gray-800">{section.title}</h4>
              </div>
              <ul className="space-y-1 pr-4">
                {section.items.slice(0, 2).map((item, itemIndex) => (
                  <li key={itemIndex} className="text-xs text-gray-600 flex items-start gap-1">
                    <FaCheck className="text-[#53a1dd] mt-0.5 flex-shrink-0 text-xs" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))
        ) : card.highlights ? (
          <div className="flex flex-wrap gap-2">
            {card.highlights.slice(0, 4).map((highlight, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-blue-50 text-[#53a1dd] text-xs font-medium rounded-full border border-blue-100"
              >
                {highlight}
              </span>
            ))}
          </div>
        ) : card.visionPoints ? (
          <div className="space-y-2">
            {card.visionPoints.slice(0, 4).map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#53a1dd] rounded-full"></div>
                <span className="text-sm text-gray-700">{point}</span>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

// المؤشرات
const Indicators = ({ count, activeIndex, onClick }) => (
  <div className="flex justify-center gap-2">
    {Array.from({ length: count }).map((_, index) => (
      <button
        key={index}
        onClick={() => onClick(index)}
        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
          index === activeIndex
            ? 'bg-[#53a1dd] w-6'
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
        aria-label={`الانتقال إلى البطاقة ${index + 1}`}
      />
    ))}
  </div>
);

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
      if (e.key === "ArrowRight") {
        e.preventDefault();
        prevCard();
      } else if (e.key === "ArrowLeft") {
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

  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      {/* عناصر زخرفية أصغر */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

      <div className="container mx-auto px-4 relative z-10">
        {/* العنوان الرئيسي - مصغّر */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-[#53a1dd] to-[#4a8fc7] rounded-full text-white mb-4 text-xs">
            <Sparkles className="w-3 h-3" />
            <span className="font-medium">لماذا شاهين بلس؟</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 leading-tight">
            قيمنا و <span className="text-[#53a1dd]">أهدافنا</span>
          </h2>
          
          <div className="w-20 h-1 bg-gradient-to-r from-[#53a1dd] to-[#4a8fc7] rounded-full mx-auto mb-4"></div>
          
          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto">
            نؤمن أن نجاحك العقاري يبدأ من فهم واضح لقيمنا وطموحنا المشترك
          </p>
        </motion.div>

        {/* الشاشات الكبيرة - مصغّر */}
        <div 
          className="hidden lg:block"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          {/* تبويبات مصغرة في الأعلى */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            {CARDS_DATA.map((card, index) => (
              <button
                key={card.id}
                onClick={() => goToCard(index)}
                disabled={isTransitioning}
                className={`p-4 rounded-xl text-right transition-all duration-300 ${
                  activeTab === index
                    ? 'bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] text-white shadow-lg transform scale-102'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md hover:shadow-lg'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    activeTab === index ? 'bg-white/20' : 'bg-blue-50'
                  }`}>
                    <card.icon className={`w-5 h-5 ${
                      activeTab === index ? 'text-white' : 'text-[#53a1dd]'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-0.5">{card.title}</h3>
                    <p className={`text-xs ${
                      activeTab === index ? 'text-white/90' : 'text-gray-500'
                    }`}>{card.titleEn}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* البطاقة الرئيسية */}
          <div className="mb-8">
            <AnimatePresence mode="wait">
              <DesktopCard 
                key={activeTab}
                card={CARDS_DATA[activeTab]} 
                isActive={true} 
              />
            </AnimatePresence>
          </div>

          {/* أزرار التنقل المصغّرة */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={prevCard}
                disabled={isTransitioning}
                className="w-12 h-12 rounded-full bg-white border border-[#53a1dd] text-[#53a1dd] flex items-center justify-center hover:bg-[#53a1dd] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                aria-label="البطاقة السابقة"
              >
                <FaChevronRight className="text-sm" />
              </button>
              
              <Indicators 
                count={CARDS_DATA.length} 
                activeIndex={activeTab} 
                onClick={goToCard}
              />
              
              <button
                onClick={nextCard}
                disabled={isTransitioning}
                className="w-12 h-12 rounded-full bg-white border border-[#53a1dd] text-[#53a1dd] flex items-center justify-center hover:bg-[#53a1dd] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
                aria-label="البطاقة التالية"
              >
                <FaChevronLeft className="text-sm" />
              </button>
            </div>

            {/* مؤشر التلقائي */}
            {!isPaused && (
              <div className="w-40 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  key={activeTab}
                  className="h-full bg-gradient-to-r from-[#53a1dd] to-[#4a8fc7]"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: CONFIG.AUTO_SLIDE_INTERVAL / 1000, ease: "linear" }}
                />
              </div>
            )}

            {/* عداد البطاقات */}
            <div className="text-sm text-gray-600 font-medium">
              <span className="text-[#53a1dd] font-bold">{activeTab + 1}</span>
              <span className="mx-1">/</span>
              <span>{CARDS_DATA.length}</span>
            </div>
          </div>
        </div>

        {/* الأجهزة المحمولة - بدون تغيير */}
        <div className="lg:hidden">
          <div className="mb-6">
            <Indicators 
              count={CARDS_DATA.length} 
              activeIndex={activeTab} 
              onClick={goToCard}
            />
          </div>

          <AnimatePresence mode="wait">
            <MobileCard 
              key={activeTab}
              card={CARDS_DATA[activeTab]} 
              isActive={true} 
            />
          </AnimatePresence>

          {/* أزرار التنقل للجوال */}
          <div className="flex items-center justify-center gap-6 mt-6">
            <button
              onClick={prevCard}
              disabled={isTransitioning}
              className="w-10 h-10 rounded-full bg-white border border-[#53a1dd] text-[#53a1dd] flex items-center justify-center hover:bg-[#53a1dd] hover:text-white transition-all duration-300 shadow-md disabled:opacity-50"
              aria-label="البطاقة السابقة"
            >
              <FaChevronRight className="text-xs" />
            </button>
            
            <div className="text-center">
              <span className="text-xs font-medium text-gray-600">البطاقة</span>
              <p className="text-lg font-bold text-[#53a1dd]">
                {activeTab + 1} / {CARDS_DATA.length}
              </p>
            </div>
            
            <button
              onClick={nextCard}
              disabled={isTransitioning}
              className="w-10 h-10 rounded-full bg-white border border-[#53a1dd] text-[#53a1dd] flex items-center justify-center hover:bg-[#53a1dd] hover:text-white transition-all duration-300 shadow-md disabled:opacity-50"
              aria-label="البطاقة التالية"
            >
              <FaChevronLeft className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default React.memo(WhyUsSection);