import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Icons from "../../icons/index";
import ClientsSkeleton from "../../Skeleton/ClientsSkeleton";

// ثوابت التطبيق
const CONFIG = {
  API_URL: "https://core-api-x41.shaheenplus.sa/api/clients/featured",
  MAX_VISIBLE_LOGOS: 3,
  AUTO_SLIDE_INTERVAL: 3000,
  STALE_TIME: 5 * 60 * 1000, // 5 دقائق
  RETRY_COUNT: 2,
};

// مكون السلايدر
const ClientsSlider = ({ clients, onClientClick }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // التنقل للعميل التالي
  const nextClient = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex((prevIndex) => (prevIndex + 1) % clients.length);

    setTimeout(() => setIsTransitioning(false), 300);
  }, [clients.length, isTransitioning]);

  // التنقل للعميل السابق
  const prevClient = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setActiveIndex(
      (prevIndex) => (prevIndex - 1 + clients.length) % clients.length
    );

    setTimeout(() => setIsTransitioning(false), 300);
  }, [clients.length, isTransitioning]);

  // إيقاف/تشغيل السلايدر التلقائي
  const handleMouseEnter = useCallback(() => setIsPaused(true), []);
  const handleMouseLeave = useCallback(() => setIsPaused(false), []);

  // السلايدر التلقائي
  useEffect(() => {
    if (clients.length <= 1 || isPaused) return;

    const interval = setInterval(nextClient, CONFIG.AUTO_SLIDE_INTERVAL);
    return () => clearInterval(interval);
  }, [clients.length, isPaused, nextClient]);

  // الحصول على الشعارات المرئية
  const visibleLogos = useMemo(() => {
    if (clients.length === 0) return [];

    const logos = [];
    for (
      let i = 0;
      i < Math.min(CONFIG.MAX_VISIBLE_LOGOS, clients.length);
      i++
    ) {
      const index = (activeIndex + i) % clients.length;
      logos.push({
        ...clients[index],
        isActive: i === 1,
        position: i,
      });
    }
    return logos;
  }, [activeIndex, clients]);

  // معالج النقر على العميل
  const handleClientClick = useCallback(
    (client) => {
      if (
        client.isActive &&
        onClientClick &&
        typeof onClientClick === "function"
      ) {
        onClientClick(client);
      }
    },
    [onClientClick]
  );

  // معالج الأخطاء في تحميل الصور
  const handleImageError = useCallback((e) => {
    e.target.src = "/images/placeholder-logo.png"; // صورة بديلة
    e.target.onerror = null; // منع التكرار اللانهائي
  }, []);

  if (clients.length === 0) {
    return (
      <section className="relative mt-[-70px] mb-[30px] z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl py-8 px-6 md:px-8 lg:px-10 max-w-[90%] mx-auto border-t-4 border-[#1E3A8A] text-center">
            <h3 className="text-[#1E3A8A] text-xl md:text-2xl lg:text-3xl font-bold mb-5 md:mb-6 relative inline-block">
              عملاؤنا المميزون
              <span
                className="absolute bottom-[-8px] right-1/2 translate-x-1/2 w-12 md:w-16 h-1 bg-[#D4AF37]"
                aria-hidden="true"
              ></span>
            </h3>
            <div className="my-8 md:my-10">
              <Icons.FaBuilding
                className="mx-auto text-gray-300 text-5xl mb-4"
                aria-hidden="true"
              />
              <p className="text-gray-600 text-sm md:text-base">
                لا توجد بيانات للعملاء في الوقت الحالي
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative mt-[-70px] mb-[30px] z-10"
      aria-label="قسم العملاء المميزون"
    >
      <div className="container mx-auto px-4">
        <div className="bg-[#ffffff] rounded-3xl shadow-2xl py-10 px-8 md:px-10 lg:px-12 max-w-[90%] mx-auto border-t-4 border-[#3783f1] text-center transition-transform transform hover:scale-105">
          {/* العنوان */}
          <h3 className="text-[#000000] text-xl md:text-2xl lg:text-3xl font-bold mb-5 md:mb-6 relative inline-block">
            عملاؤنا المميزون
            <span
              className="absolute bottom-[-10px] right-1/2 translate-x-1/2 w-20 md:w-32 h-1.5 
             bg-gradient-to-r from-[#1E3A8A] via-[#2d86e4] to-[#64b5f6] 
             rounded-full shadow-lg 
             animate-pulseGlow"
              aria-hidden="true"
            ></span>
          </h3>

          {/* منطقة السلايدر */}
          <div
            className="flex items-center justify-center my-8 md:my-10 gap-4 md:gap-6"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            role="region"
            aria-label="عرض شعارات العملاء"
            aria-live="polite"
          >
            {/* زر السابق (اليسار) */}
            <button
              className="bg-[#3783f1] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#0F2A66] hover:scale-110 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={prevClient}
              disabled={isTransitioning || clients.length <= 1}
              aria-label="العميل السابق"
              type="button"
            >
              <Icons.FaChevronRight
                className="text-lg md:text-xl"
                aria-hidden="true"
              />
            </button>

            {/* منطقة الشعارات */}
            <div className="w-full max-w-[600px] overflow-hidden">
              <div className="flex items-center justify-center gap-4 md:gap-8 transition-all duration-500">
                {visibleLogos.map((client) => (
                  <div
                    key={`${client.id}-${client.position}`}
                    className={`flex items-center justify-center transition-all duration-500 ${
                      client.isActive
                        ? "scale-110 md:scale-125 opacity-100 cursor-pointer"
                        : "opacity-30 scale-95 cursor-default"
                    }`}
                    style={{ flex: "0 0 150px", height: "80px" }}
                    onClick={() => handleClientClick(client)}
                    role="img"
                    aria-label={
                      client.isActive
                        ? `شعار ${client.name} - نشط`
                        : `شعار ${client.name}`
                    }
                    tabIndex={client.isActive ? 0 : -1}
                    onKeyDown={(e) => {
                      if (
                        client.isActive &&
                        (e.key === "Enter" || e.key === " ")
                      ) {
                        e.preventDefault();
                        handleClientClick(client);
                      }
                    }}
                  >
                    <img
                      src={client.logo}
                      alt={`شعار ${client.name}`}
                      className="max-h-full max-w-full object-contain"
                      loading="lazy"
                      onError={handleImageError}
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* زر التالي (اليمين) */}
            <button
              className="bg-[#3783f1] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#0F2A66] hover:scale-110 transition-all duration-300 shadow-md focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={nextClient}
              disabled={isTransitioning || clients.length <= 1}
              aria-label="العميل التالي"
              type="button"
            >
              <Icons.FaChevronLeft
                className="text-lg md:text-xl"
                aria-hidden="true"
              />
            </button>
          </div>

          {/* مؤشرات السلايدر */}
          {clients.length > 1 && (
            <div
              className="flex justify-center gap-2 mb-6"
              role="tablist"
              aria-label="مؤشرات العملاء"
            >
              {clients.map((_, index) => (
                <button
                  key={`indicator-${index}`}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === activeIndex
                      ? "bg-[#D4AF37] w-8"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                  onClick={() => !isTransitioning && setActiveIndex(index)}
                  disabled={isTransitioning}
                  aria-label={`الانتقال للعميل ${index + 1}`}
                  aria-current={index === activeIndex ? "true" : "false"}
                  role="tab"
                  type="button"
                />
              ))}
            </div>
          )}

          {/* العنوان الفرعي */}
          <p className="text-gray-600 mt-6 md:mt-8 text-sm md:text-base lg:text-lg">
            نفتخر بشراكتنا مع أكبر الشركات العقارية في المملكة
          </p>
        </div>
      </div>
    </section>
  );
};

// دالة جلب البيانات من API
const fetchClients = async () => {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // مهلة 10 ثواني

    const response = await fetch(CONFIG.API_URL, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success || !Array.isArray(data.data)) {
      throw new Error("صيغة البيانات غير صحيحة");
    }

    // التحقق من صحة البيانات وتنظيفها
    const validClients = data.data
      .filter((client) => client && client.id && client.name && client.logo)
      .map((client) => ({
        id: client.id,
        name: client.name.trim(),
        logo: client.logo,
        website: client.website || null,
      }));

    return validClients;
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("انتهت مهلة الطلب");
    }
    console.error("خطأ في جلب بيانات العملاء:", error);
    throw error;
  }
};

// المكون الرئيسي
const ClientsSection = () => {
  const {
    data: clients = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["featuredClients"],
    queryFn: fetchClients,
    refetchOnWindowFocus: false,
    retry: CONFIG.RETRY_COUNT,
    staleTime: CONFIG.STALE_TIME,
    gcTime: CONFIG.STALE_TIME * 2, // الاحتفاظ بالبيانات المخزنة مؤقتاً
    onError: (error) => {
      console.error("فشل تحميل بيانات العملاء:", error);
    },
  });

  const handleClientClick = useCallback((client) => {
    // يمكن إضافة منطق هنا في المستقبل
    console.log("تم النقر على العميل:", client.name);
  }, []);

  const handleRetry = useCallback(() => {
    refetch();
  }, [refetch]);

  // حالة التحميل
  if (isLoading) {
    return <ClientsSkeleton />;
  }

  // حالة الخطأ
  if (error) {
    return (
      <section className="relative mt-[-70px] mb-[30px] z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl py-8 px-6 border-t-4 border-red-500 text-center max-w-[90%] mx-auto">
            <div className="text-red-500">
              <Icons.FaExclamationTriangle
                className="mx-auto text-5xl mb-4"
                aria-hidden="true"
              />
              <h3 className="text-xl font-bold mb-2">
                حدث خطأ في تحميل بيانات العملاء
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                {error.message || "يرجى المحاولة مرة أخرى"}
              </p>
              <button
                onClick={handleRetry}
                className="mt-4 bg-[#1E3A8A] text-white py-2 px-6 rounded-lg hover:bg-[#0F2A66] transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
                type="button"
                aria-label="إعادة تحميل بيانات العملاء"
              >
                <Icons.FaRedo
                  className="inline-block ml-2"
                  aria-hidden="true"
                />
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <ClientsSlider clients={clients} onClientClick={handleClientClick} />;
};

// PropTypes للتطوير
if (process.env.NODE_ENV !== "production") {
  ClientsSlider.propTypes = {
    clients: function (props, propName) {
      const value = props[propName];
      if (!Array.isArray(value)) {
        return new Error("clients must be an array");
      }
      if (value.some((client) => !client.id || !client.name || !client.logo)) {
        return new Error("Each client must have id, name, and logo");
      }
    },
    onClientClick: function (props, propName) {
      const value = props[propName];
      if (value && typeof value !== "function") {
        return new Error("onClientClick must be a function");
      }
    },
  };
}

export default React.memo(ClientsSection);