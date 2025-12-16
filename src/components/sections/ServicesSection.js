import React, { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Landmark, 
  ClipboardList, 
  Gavel, 
  Megaphone, 
  CheckCircle2,
  ChevronLeft,
  Sparkles
} from "lucide-react";

const ServicesSection = () => {
  const [activeService, setActiveService] = useState("lands");
  const [isAnimating, setIsAnimating] = useState(false);

 const servicesData = useMemo(() => ({
  lands: {
    title: "عرض وتسويق الأراضي",
    icon: Landmark,
    color: "from-blue-500 to-cyan-600",  // نفس لون requests
    accentColor: "blue",                  // نفس accentColor لـ requests
    description:
      "نقدّم حلول عرض وتسويق للأراضي ترتقي بقيمتها الحقيقية، وتربطها بالمستثمر الجاد ضمن بيئة احترافية تحفظ الخصوصية وتُحسن فرص إتمام الصفقة.",
    features: [
      "نقدّم للأرض منصة تليق بقيمتها… ونصنع لها الطريق نحو المستثمر الجاد.",
      "هنا لا نعرض الأرض فقط… بل نُبرز جوهرها ونتيحها لمن يستحقها.",
      "نُسوق باحتراف، نحجب بياناتك بثقة، ونُغلق الصفقة بذكاء.",
      "من أول نقرة… يبدأ مشوار البيع باحترافية لا تشبه أحدًا.",
      "الأرض تُعرض… ونحن نصنع الفرصة.",
    ],
  },
  requests: {
    title: "نظام طلبات الشراء والاستثمار",
    icon: ClipboardList,
    color: "from-blue-500 to-cyan-600",
    accentColor: "blue",
    description:
      "نظام ذكي يمكّنك من تسجيل طلبك الاستثماري بدقة، ليصل إليك العرض المناسب دون عناء البحث، وبآلية احترافية تختصر الوقت وترفع جودة القرار.",
    features: [
      "وضّح رغبتك… ودع الفرص العقارية تتحرك نحوك.",
      "طلب واحد منك… يكشف لك أفضل ما لدى الملاك والمسوقين.",
      "نحوّل الطلب إلى عرض… والعرض إلى صفقة متقنة.",
      "هنا لا تبحث… هنا يجدك العقار المناسب.",
      "نربط احتياجك بالعقار الصحيح… في اللحظة الصحيحة.",
    ],
  },
  auctionMarketing: {
    title: "تسويق العقارات لشركات المزادات",
    icon: Gavel,
    color: "from-blue-500 to-cyan-600", // تم التغيير
    accentColor: "blue",
    description:
      "نربط عقارك بشركات المزادات المؤهلة، ونهيّئ له مسارًا احترافيًا من العرض وحتى التنفيذ، لضمان أفضل قيمة وأعلى كفاءة.",
    features: [
      "نُمهّد طريقك نحو شركات المزادات… ونمنح عقارك منصة ترتفع بقيمته.",
      "من رفع العقار… إلى باب شركة المزاد. نحن نديرها باحتراف.",
      "نوصلك بالمزاد المناسب… ونترك الخبراء يرفعون قيمة عقارك.",
      "نُسوق عقارك بدقة… لتصل إليه يد المزاد القادرة على استثماره.",
      "عقار يُعرض باحتراف… ومزاد يُنفّذ بثقة.",
    ],
  },
  auctionEnable: {
    title: "تمكين شركات المزادات من عرض المزاد",
    icon: Megaphone,
    color: "from-blue-500 to-cyan-600", // تم التغيير
    accentColor: "blue",
    description:
      "نوفّر لشركات المزادات منصة رقمية متكاملة لعرض مزاداتها والوصول إلى جمهور استثماري نوعي، ضمن بيئة احترافية تعزز الحضور وتوسّع نطاق التأثير.",
    features: [
      "منصة واحدة… تفتح لشركات المزادات أبواب الوصول إلى جمهور استثماري واسع.",
      "نمنح مزاداتكم منصة لا تُشبه غيرها… حضور، وصول، واحتراف.",
      "هنا ترتقي المزادات… وهنا يجدها المستثمر الذي تبحث عنه.",
      "مزاد يُعرض بوضوح… ويصل بقوة… ويُتابعه جمهور نوعي.",
      "نُسهّل العرض… ونُضاعف الوصول… ونرفع قيمة الحدث.",
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

  return (
    <section className="relative py-16 md:py-24 lg:py-32 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden" dir="rtl">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12 md:mb-16 text-right"
        >
          <div className="inline-flex items-center gap-3 mb-4">
            <Sparkles className="w-6 h-6 text-blue-500" />
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider">خدماتنا المميزة</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-3 leading-tight">
            استكشفوا خدماتنا
          </h2>
          <div className="w-28 h-1.5 bg-gradient-to-l from-blue-600 to-cyan-500 rounded-full"></div>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl">
            حلول متكاملة ومبتكرة لخدمة قطاع العقارات بأعلى معايير الجودة والاحترافية
          </p>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Service Navigation */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-96"
          >
            <div className="lg:sticky lg:top-24">
              <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-3 pb-2 lg:pb-0 scrollbar-hide">
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
                        group relative flex-shrink-0 lg:flex-shrink flex items-center gap-4 p-5 rounded-2xl
                        transition-all duration-300 border-2 min-w-max lg:min-w-0
                        ${isActive
                          ? `bg-gradient-to-l ${service.color} text-white border-transparent shadow-xl shadow-${service.accentColor}-500/30 scale-105`
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-lg text-slate-700'
                        }
                      `}
                    >
                      {/* Icon */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                        transition-all duration-300
                        ${isActive 
                          ? 'bg-white/20 backdrop-blur-sm' 
                          : `bg-gradient-to-br ${service.color} text-white group-hover:scale-110`
                        }
                      `}>
                        <IconComponent className="w-6 h-6" strokeWidth={2.5} />
                      </div>
                      
                      {/* Text */}
                      <div className="flex-1 text-right">
                        <span className="font-bold text-base md:text-lg block leading-tight">
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
                          <ChevronLeft className="w-5 h-5" />
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </div>
          </motion.div>

          {/* Service Details */}
          <div className="flex-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeService}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden"
              >
                {/* Header Section */}
                <div className={`bg-gradient-to-l ${currentService.color} p-6 md:p-8`}>
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    <div className="bg-white/20 backdrop-blur-lg w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0 border border-white/30">
                      {React.createElement(currentService.icon, {
                        className: "w-8 h-8 text-white",
                        strokeWidth: 2.5
                      })}
                    </div>
                    <div className="flex-1 text-white">
                      <h3 className="text-2xl md:text-3xl font-bold mb-3 leading-tight">
                        {currentService.title}
                      </h3>
                      <p className="text-base md:text-lg leading-relaxed text-white/95">
                        {currentService.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Features Section */}
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-3 mb-6">
                    <div className={`w-1.5 h-8 bg-gradient-to-b ${currentService.color} rounded-full`}></div>
                    <h4 className="text-xl md:text-2xl font-bold text-slate-900">
                      مميزات الخدمة
                    </h4>
                  </div>

                  <div className="space-y-4">
                    {currentService.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: idx * 0.1 }}
                        className="group flex gap-4 p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300"
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br ${currentService.color} flex items-center justify-center shadow-sm mt-1`}>
                          <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                        </div>
                        <p className="flex-1 text-slate-700 leading-relaxed text-base md:text-lg group-hover:text-slate-900 transition-colors">
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