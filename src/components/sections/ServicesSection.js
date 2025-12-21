import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Landmark, 
  ClipboardList, 
  Gavel, 
  Megaphone, 
  CheckCircle2,
  ChevronLeft,
  Sparkles,
  ChevronRight
} from "lucide-react";

const ServicesSection = () => {
  const [activeService, setActiveService] = useState("lands");
  const [isAnimating, setIsAnimating] = useState(false);

  const servicesData = useMemo(() => ({
    lands: {
      title: "عرض وتسويق الأراضي",
      icon: Landmark,
      color: "from-[#53a1dd] to-[#4a8fc7]",
      accentColor: "[#53a1dd]",
      description:
        "حلول عرض وتسويق متكاملة ترفع قيمة أراضيك وتصل بها للمستثمر المناسب.",
      shortDescription: "عرض احترافي يسوق لأراضيك بشكل مميز",
      features: [
        "تقديم الأرض على منصة تليق بقيمتها الحقيقية",
        "ربط الأرض بالمستثمر الجاد في بيئة آمنة",
        "حفظ خصوصية البيانات وتوفير أقصى درجات الأمان",
        "إبراز الجوهر الفريد لكل قطعة أرض",
        "إدارة عملية البيع بذكاء واحترافية",
      ],
    },
    requests: {
      title: "طلبات الشراء والاستثمار",
      icon: ClipboardList,
      color: "from-[#53a1dd] to-[#4a8fc7]",
      accentColor: "[#53a1dd]",
      description:
        "سجل طلبك العقاري واترك الباقي علينا، سنوفر لك العروض المناسبة دون عناء.",
      shortDescription: "سجل طلبك وابحث عن العقار المناسب بسهولة",
      features: [
        "تسجيل سريع ودقيق للطلب الاستثماري",
        "ربط تلقائي بأفضل العروض المتاحة",
        "توفير الوقت والجهد في البحث",
        "عروض مخصصة تناسب احتياجاتك",
        "متابعة مستمرة حتى إتمام الصفقة",
      ],
    },
    auctionMarketing: {
      title: "تسويق للمزادات العقارية",
      icon: Gavel,
      color: "from-[#53a1dd] to-[#4a8fc7]",
      accentColor: "[#53a1dd]",
      description:
        "ربط عقارك بشركات المزادات المؤهلة لضمان تحقيق أفضل قيمة ممكنة.",
      shortDescription: "تسويق احترافي لعقاراتك عبر شركات المزادات",
      features: [
        "ربط مباشر مع شركات المزادات الموثوقة",
        "إعداد احترافي للعقار قبل العرض",
        "إدارة كاملة لعملية التسويق",
        "توصيات لشركات المزاد المناسبة",
        "متابعة حتى تنفيذ المزاد",
      ],
    },
    auctionEnable: {
      title: "منصة شركات المزادات",
      icon: Megaphone,
      color: "from-[#53a1dd] to-[#4a8fc7]",
      accentColor: "[#53a1dd]",
      description:
        "منصة متكاملة لعرض المزادات والوصول لمستثمرين جادين بكل احترافية.",
      shortDescription: "منصة رقمية لعرض مزاداتكم بشكل احترافي",
      features: [
        "منصة رقمية متكاملة لعرض المزادات",
        "وصول لجمهور استثماري نوعي",
        "أدوات إدارة وتنظيم متقدمة",
        "تغطية واسعة ووصول سريع",
        "رفع مستوى الاحترافية في العرض",
      ],
    },
  }), []);

  const handleServiceChange = useCallback((key) => {
    if (key === activeService || isAnimating) return;
    setIsAnimating(true);
    setActiveService(key);
    setTimeout(() => setIsAnimating(false), 500);
  }, [activeService, isAnimating]);

  const currentService = servicesData[activeService];

  // Mobile navigation buttons
  const serviceKeys = Object.keys(servicesData);
  const currentIndex = serviceKeys.indexOf(activeService);
  const nextService = serviceKeys[(currentIndex + 1) % serviceKeys.length];
  const prevService = serviceKeys[(currentIndex - 1 + serviceKeys.length) % serviceKeys.length];

  return (
    <section className="relative py-12 md:py-20 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden" dir="rtl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header - Improved for mobile */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 md:mb-12 lg:mb-16 text-right"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
            <div>
              <div className="inline-flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-[#53a1dd]" />
                <span className="text-xs md:text-sm font-semibold text-[#53a1dd] uppercase tracking-wider">خدماتنا المميزة</span>
              </div>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-2 leading-tight">
                استكشفوا خدماتنا
              </h2>
              <div className="w-20 md:w-28 h-1 md:h-1.5 bg-gradient-to-l from-[#53a1dd] to-[#4a8fc7] rounded-full"></div>
            </div>
          </div>
          
          <p className="mt-3 md:mt-4 text-sm md:text-lg text-slate-600 max-w-2xl">
            حلول متكاملة ومبتكرة لخدمة قطاع العقارات بأعلى معايير الجودة والاحترافية
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 lg:gap-8">
          {/* Service Navigation - Improved for mobile */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-80 xl:w-96"
          >
            {/* Mobile Navigation Controls - Only visible on small screens */}
            <div className="block md:hidden mb-6">
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-4">
                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleServiceChange(prevService)}
                    disabled={isAnimating}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-medium transition-all duration-300 active:scale-95 disabled:opacity-50"
                  >
                    <ChevronRight className="w-4 h-4" />
                    <span className="text-sm">السابق</span>
                  </button>
                  
                  <div className="flex gap-1">
                    {serviceKeys.map((key, index) => (
                      <button
                        key={key}
                        onClick={() => handleServiceChange(key)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          key === activeService 
                            ? 'bg-[#53a1dd] w-6' 
                            : 'bg-slate-300 hover:bg-slate-400'
                        }`}
                        aria-label={`انتقل للخدمة ${index + 1}`}
                      />
                    ))}
                  </div>
                  
                  <button
                    onClick={() => handleServiceChange(nextService)}
                    disabled={isAnimating}
                    className="flex items-center gap-2 px-4 py-2.5 bg-[#53a1dd] hover:bg-[#4a8fc7] text-white rounded-xl font-medium transition-all duration-300 active:scale-95 disabled:opacity-50"
                  >
                    <span className="text-sm">التالي</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <div className="hidden md:block lg:sticky lg:top-24">
              <nav className="grid grid-cols-1 gap-2 md:gap-3">
                {Object.entries(servicesData).map(([key, service], index) => {
                  const IconComponent = service.icon;
                  const isActive = activeService === key;
                  
                  return (
                    <motion.button
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      onClick={() => handleServiceChange(key)}
                      disabled={isAnimating}
                      className={`
                        group relative flex items-center gap-3 md:gap-4 p-3.5 md:p-4 lg:p-5 rounded-xl md:rounded-2xl
                        transition-all duration-300 border-2
                        ${isActive
                          ? `bg-gradient-to-l ${service.color} text-white border-transparent shadow-lg md:shadow-xl scale-100 md:scale-105`
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-md text-slate-700'
                        }
                      `}
                    >
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : `bg-gradient-to-br ${service.color} text-white group-hover:scale-110`
                        }
                      `}>
                        <IconComponent className="w-5 h-5 md:w-6 md:h-6" strokeWidth={2.5} />
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 text-right min-w-0">
                        <span className="font-bold text-sm md:text-base lg:text-lg block leading-tight">
                          {service.title}
                        </span>
                      </div>

                      {/* Arrow indicator */}
                      {isActive && (
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          className="flex-shrink-0"
                        >
                          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Service Details - Improved for mobile */}
          <div className="flex-1 w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-2xl md:rounded-3xl border border-slate-200 shadow-xl md:shadow-2xl overflow-hidden"
              >
                {/* Mobile Header - Simplified */}
                <div className="block md:hidden">
                  <div className={`bg-gradient-to-l ${currentService.color} p-4`}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="bg-white/20 backdrop-blur-lg w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-white/30 flex-shrink-0">
                        {React.createElement(currentService.icon, {
                          className: "w-5 h-5 text-white",
                          strokeWidth: 2.5
                        })}
                      </div>
                      <h3 className="text-xl font-bold text-white leading-tight text-right flex-1">
                        {currentService.title}
                      </h3>
                    </div>
                    <p className="text-sm text-white/95 leading-relaxed text-right">
                      {currentService.description}
                    </p>
                  </div>
                </div>

                {/* Desktop Header - Kept as is */}
                <div className="hidden md:block">
                  <div className={`bg-gradient-to-l ${currentService.color} p-4 md:p-6 lg:p-8`}>
                    <div className="flex flex-row gap-3 md:gap-5 items-start">
                      <div className="bg-white/20 backdrop-blur-lg w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 border border-white/30">
                        {React.createElement(currentService.icon, {
                          className: "w-6 h-6 md:w-8 md:h-8 text-white",
                          strokeWidth: 2.5
                        })}
                      </div>
                      <div className="flex-1 text-white min-w-0">
                        <h3 className="text-lg md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 leading-tight">
                          {currentService.title}
                        </h3>
                        <p className="text-sm md:text-base lg:text-lg leading-relaxed text-white/95">
                          {currentService.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features Section - Improved for mobile */}
                <div className="p-4 md:p-6 lg:p-8">
                  <div className="flex items-center gap-2 md:gap-3 mb-4 md:mb-6">
                    <div className={`w-1 md:w-1.5 h-6 md:h-8 bg-gradient-to-b ${currentService.color} rounded-full`}></div>
                    <h4 className="text-lg md:text-xl lg:text-2xl font-bold text-slate-900">
                      مميزات الخدمة
                    </h4>
                  </div>

                  {/* Mobile features - Simplified layout */}
                  <div className="block md:hidden space-y-3">
                    {currentService.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="group bg-gradient-to-l from-slate-50 to-white p-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-all duration-300 shadow-sm hover:shadow-md"
                      >
                        <div className="flex gap-3">
                          <div className={`flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-br ${currentService.color} flex items-center justify-center shadow-sm mt-0.5`}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
                          </div>
                          <p className="flex-1 text-slate-700 leading-relaxed text-sm font-medium group-hover:text-slate-900 transition-colors">
                            {feature}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Desktop features - Kept as is */}
                  <div className="hidden md:block space-y-2.5 md:space-y-4">
                    {currentService.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="group flex gap-2.5 md:gap-4 p-3 md:p-4 rounded-lg md:rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className={`flex-shrink-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br ${currentService.color} flex items-center justify-center shadow-sm mt-0.5`}>
                          <CheckCircle2 className="w-3.5 h-3.5 md:w-5 md:h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <p className="flex-1 text-slate-700 leading-relaxed text-sm md:text-base lg:text-lg group-hover:text-slate-900 transition-colors">
                          {feature}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;