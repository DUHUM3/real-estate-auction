import React, { useState } from 'react';
import Icons from '../../icons/index';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState('large-lands');

  const servicesData = {
    'large-lands': {
      title: 'الأراضي الكبيرة',
      description: 'نقدم هذه الخدمة لملاك الأراضي، الوكلاء الشرعيين، المسوقين العقاريين المعتمدين، والمنشآت. نمكّن الجميع من عرض أراضيهم بطريقة احترافية والوصول إلى الجمهور المناسب سواء للبيع أو للاستثمار، بما يشمل الأراضي السكنية والتجارية والزراعية للمستثمرين الجادين والمطورين المعتمدين. نحول الارض الئ فرصة... والفرصة الئ صفقة.',
      features: [
        'أراضي سكنية وتجارية وزراعية',
        'تسويق لمجموعة مختارة من المستثمرين',
        'خدمة حصرية للملاك والوكلاء المعتمدين',
        'تقييم مهني ودراسة جدوى شاملة'
      ]
    },
    'auction-partnership': {
      title: 'شراكة مميزة مع شركات المزادات',
      description: 'نقوم بتسويق منتجاتكم العقارية ومساعدتكم على بيعها في أسرع وقت ممكن عبر شركات المزادات العقارية. ما يميزنا هو علاقتنا القوية مع مختلف شركات المزادات في المملكة العربية السعودية، مما يضمن عرض عقاراتكم بطريقة احترافية تحقق أفضل العوائد، مع توفير استشارات تسويقية لدعم قراراتكم الاستثمارية.',
      features: [
        'فلل ومنازل وعمائر',
        'أراضي ومزارع ومصانع',
        'جميع أنواع الاراضي والمشاريع',
        'علاقة قوية مع شركات المزادات المعتمدة'
      ]
    }
  };

  return (
    <section className="py-10 md:py-16 bg-white" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        {/* العنوان */}
        <div className="relative mb-8 md:mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-right relative z-10">
            استكشفوا خدماتنا
          </h2>
          <div className="absolute top-1/2 right-0 w-32 h-8 bg-[#53a1dd] bg-opacity-20 rounded-lg -z-10"></div>
        </div>

        {/* مؤشر النقاط للجوال */}
        <div className="flex justify-center mb-6 md:hidden">
          <div className="flex space-x-2 space-x-reverse">
            <span className={`w-3 h-3 rounded-full ${activeService === 'large-lands' ? 'bg-[#53a1dd]' : 'bg-gray-300'}`}></span>
            <span className={`w-3 h-3 rounded-full ${activeService === 'auction-partnership' ? 'bg-[#53a1dd]' : 'bg-gray-300'}`}></span>
          </div>
        </div>

        {/* محتوى الخدمات */}
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 mt-8">
          {/* القائمة الجانبية */}
          <div className="hidden md:block md:w-64 flex-shrink-0">
            <ul className="space-y-3">
              <li
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                  activeService === 'large-lands' 
                    ? 'bg-[#53a1dd] text-white border-[#53a1dd] transform -translate-x-1' 
                    : 'bg-white border-gray-200 hover:border-[#53a1dd] text-gray-700'
                }`}
                onClick={() => setActiveService('large-lands')}
              >
                <Icons.FaLandmark className={`text-lg ${activeService === 'large-lands' ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">الأراضي الكبيرة</span>
              </li>
              <li
                className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-300 border ${
                  activeService === 'auction-partnership' 
                    ? 'bg-[#53a1dd] text-white border-[#53a1dd] transform -translate-x-1' 
                    : 'bg-white border-gray-200 hover:border-[#53a1dd] text-gray-700'
                }`}
                onClick={() => setActiveService('auction-partnership')}
              >
                <Icons.FaGavel className={`text-lg ${activeService === 'auction-partnership' ? 'text-white' : 'text-gray-500'}`} />
                <span className="font-medium">شراكة مميزة مع شركات المزادات</span>
              </li>
            </ul>
          </div>

          {/* تفاصيل الخدمة */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-xl border border-gray-200 shadow-sm">
            {/* رأس الخدمة */}
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6 mb-6">
              <div className="bg-[#53a1dd] w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center flex-shrink-0 self-start">
                {activeService === 'large-lands' ? (
                  <Icons.FaLandmark className="text-white text-xl md:text-2xl" />
                ) : (
                  <Icons.FaGavel className="text-white text-xl md:text-2xl" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl font-bold text-[#53a1dd] mb-2">
                  {servicesData[activeService].title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-justify">
                  {servicesData[activeService].description}
                </p>
              </div>
            </div>

            {/* الميزات */}
            <ul className="space-y-3 mb-8">
              {servicesData[activeService].features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3 text-gray-800">
                  <Icons.FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                  <span className="leading-relaxed">{feature}</span>
                </li>
              ))}
            </ul>

            {/* أزرار التنقل للجوال */}
            <div className="flex md:hidden justify-center mt-8">
              <div className="flex gap-4">
                <button
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeService === 'large-lands' 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#53a1dd] hover:bg-[#4790c9]'
                  } text-white transition-colors duration-300`}
                  onClick={() => setActiveService('large-lands')}
                  disabled={activeService === 'large-lands'}
                >
                  <Icons.FaChevronRight />
                </button>
                <button
                  className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    activeService === 'auction-partnership' 
                      ? 'bg-gray-300 cursor-not-allowed' 
                      : 'bg-[#53a1dd] hover:bg-[#4790c9]'
                  } text-white transition-colors duration-300`}
                  onClick={() => setActiveService('auction-partnership')}
                  disabled={activeService === 'auction-partnership'}
                >
                  <Icons.FaChevronLeft />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;