import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ClientsSlider = ({ clients, onClientClick }) => {
  const [activeIndex, setActiveIndex] = React.useState(0);

  const nextClient = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % clients.length);
  };

  const prevClient = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + clients.length) % clients.length);
  };

  React.useEffect(() => {
    if (clients.length > 0) {
      const interval = setInterval(nextClient, 3000);
      return () => clearInterval(interval);
    }
  }, [clients]);

  // للشاشات الصغيرة: عرض شعار واحد فقط
  // للشاشات المتوسطة والكبيرة: عرض 3 شعارات
  const getVisibleLogos = () => {
    if (clients.length === 0) return [];

    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // للجوال: عرض شعار واحد فقط
      return [{
        ...clients[activeIndex],
        isActive: true
      }];
    } else {
      // للشاشات الكبيرة: عرض 3 شعارات
      let visibleLogos = [];
      const maxVisibleLogos = 3;
      const startIndex = activeIndex;

      for (let i = 0; i < maxVisibleLogos; i++) {
        const index = (startIndex + i) % clients.length;
        visibleLogos.push({
          ...clients[index],
          isActive: i === 1
        });
      }
      return visibleLogos;
    }
  };

  return (
    <section className="relative mt-[-70px] mb-[30px] z-10">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10 max-w-[95%] sm:max-w-[90%] mx-auto border-t-4 border-[#53a1dd] text-center">
          
          {/* العنوان */}
          <h3 className="text-[#000000] text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 relative inline-block">
            عملاؤنا المميزون
            <span className="absolute bottom-[-8px] right-1/2 translate-x-1/2 w-10 sm:w-12 md:w-16 h-1 bg-[#53a1dd]"></span>
          </h3>

          {clients.length > 0 ? (
            <>
              {/* للشاشات الصغيرة */}
              <div className="block md:hidden">
                {/* منطقة الشعار للجوال */}
                <div className="flex items-center justify-center my-6 sm:my-8">
                  <div className="bg-white rounded-xl p-6 w-full max-w-xs shadow-sm">
                    <div className="h-20 sm:h-24 flex items-center justify-center mb-3">
                      <img 
                        src={clients[activeIndex].logo} 
                        alt={clients[activeIndex].name} 
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700 truncate">
                      {clients[activeIndex].name}
                    </p>
                  </div>
                </div>

                {/* أزرار التنقل للجوال */}
                <div className="flex items-center justify-center gap-3 mb-4">
                  <button 
                    className="bg-[#53a1dd] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#0f2d44] transition-all duration-300 shadow-md active:scale-95"
                    onClick={prevClient}
                    aria-label="السابق"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>

                  {/* مؤشرات النقاط */}
                  <div className="flex gap-2">
                    {clients.map((_, index) => (
                      <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === activeIndex 
                            ? 'bg-[#53a1dd] w-6' 
                            : 'bg-gray-300'
                        }`}
                        onClick={() => setActiveIndex(index)}
                        aria-label={`انتقل للعميل ${index + 1}`}
                      />
                    ))}
                  </div>

                  <button 
                    className="bg-[#53a1dd] text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-[#0f2d44] transition-all duration-300 shadow-md active:scale-95"
                    onClick={nextClient}
                    aria-label="التالي"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* للشاشات الكبيرة */}
              <div className="hidden md:flex items-center justify-center my-8 md:my-10 gap-4 md:gap-6">
                {/* زر السابق */}
                <button 
                  className="bg-[#53a1dd] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#0f2d44] hover:scale-110 transition-all duration-300 shadow-md"
                  onClick={prevClient}
                  aria-label="السابق"
                >
                  <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                </button>

                {/* منطقة الشرائح */}
                <div className="w-full max-w-[600px] overflow-hidden">
                  <div className="flex items-center justify-center gap-4 md:gap-8 transition-all duration-500">
                    {getVisibleLogos().map((client) => (
                      <div
                        key={client.id}
                        className={`flex items-center justify-center transition-all duration-500 cursor-pointer ${
                          client.isActive 
                            ? 'scale-110 md:scale-125 opacity-100' 
                            : 'opacity-30 scale-95'
                        }`}
                        style={{ flex: '0 0 150px', height: '80px' }}
                        onClick={() => onClientClick && onClientClick(client)}
                      >
                        <img 
                          src={client.logo} 
                          alt={client.name} 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* زر التالي */}
                <button 
                  className="bg-[#53a1dd] text-white w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center hover:bg-[#0f2d44] hover:scale-110 transition-all duration-300 shadow-md"
                  onClick={nextClient}
                  aria-label="التالي"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </button>
              </div>
            </>
          ) : (
            <div className="my-6 sm:my-8 md:my-10">
              <p className="text-gray-600">لا توجد بيانات للعملاء في الوقت الحالي</p>
            </div>
          )}

          {/* العنوان الفرعي */}
          <p className="text-gray-600 mt-4 sm:mt-6 md:mt-8 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed px-2">
            نفتخر بشراكتنا مع أكبر الشركات العقارية في المملكة
          </p>
        </div>
      </div>
    </section>
  );
};

// كومبونينت Skeleton محسّن
const ClientsSkeleton = () => (
  <section className="relative mt-[-70px] mb-[30px] z-10">
    <div className="container mx-auto px-4">
      <div className="bg-white rounded-2xl shadow-xl py-6 sm:py-8 px-4 sm:px-6 md:px-8 lg:px-10 max-w-[95%] sm:max-w-[90%] mx-auto border-t-4 border-gray-300">
        {/* عنوان Skeleton */}
        <div className="h-6 sm:h-7 md:h-8 bg-gray-300 rounded-lg w-40 sm:w-48 mx-auto mb-4 sm:mb-6 animate-pulse"></div>
        
        {/* محتوى Skeleton للجوال */}
        <div className="block md:hidden">
          <div className="bg-white rounded-xl p-6 w-full max-w-xs mx-auto mb-6">
            <div className="h-20 sm:h-24 bg-gray-300 rounded-lg mb-3 animate-pulse"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto animate-pulse"></div>
          </div>
          <div className="flex justify-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
            <div className="flex gap-2 items-center">
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
              <div className="w-6 h-2 bg-gray-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            <div className="w-10 h-10 bg-gray-300 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* محتوى Skeleton للشاشات الكبيرة */}
        <div className="hidden md:flex items-center justify-center my-10 gap-6">
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
          <div className="flex gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-36 h-20 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="w-12 h-12 bg-gray-300 rounded-full animate-pulse"></div>
        </div>

        <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mt-6 animate-pulse"></div>
      </div>
    </div>
  </section>
);

// دالة لجلب البيانات من API
const fetchClients = async () => {
  const response = await fetch('https://core-api-x41.shaheenplus.sa/api/clients/featured');
  const data = await response.json();

  if (data.success && Array.isArray(data.data)) {
    return data.data.map(client => ({
      id: client.id,
      name: client.name,
      logo: client.logo,
      website: client.website
    }));
  }
  throw new Error('Failed to fetch clients');
};

const ClientsSection = () => {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['featuredClients'],
    queryFn: fetchClients,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  const handleClientClick = (client) => {
    // تم تعطيل فتح الرابط
  };

  if (isLoading) {
    return <ClientsSkeleton />;
  }

  if (error) {
    return (
      <section className="relative mt-[-70px] mb-[30px] z-10">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl py-6 sm:py-8 px-4 sm:px-6 border-t-4 border-red-500 text-center max-w-[95%] sm:max-w-[90%] mx-auto">
            <div className="text-red-500">
              <p className="text-sm sm:text-base">حدث خطأ في تحميل بيانات العملاء</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-[#1e4a76] text-white py-2 px-4 rounded-lg hover:bg-[#0f2d44] transition-colors duration-300 text-sm sm:text-base"
              >
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

export default ClientsSection;