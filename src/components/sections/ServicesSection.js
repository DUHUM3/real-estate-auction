import React, { useState } from "react";
import Icons from "../../icons/index";

const ServicesSection = () => {
  const [activeService, setActiveService] = useState("lands");

  const servicesData = {
    lands: {
      title: "عرض وتسويق الأراضي",
      icon: <Icons.FaLandmark />,
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
      icon: <Icons.FaClipboardList />,
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
      icon: <Icons.FaGavel />,
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
      title: "تمكين شركات المزادات من عرض المزاد ",
      icon: <Icons.FaBullhorn />,
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
  };

  return (
    <section className="py-12 md:py-20 bg-white" dir="rtl">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-800 text-right mb-3">
            استكشفوا خدماتنا
          </h2>
          <div className="w-24 h-1 bg-[#53a1dd] mr-auto"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* القائمة */}
          <div className="lg:w-80">
            <ul className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 pb-2 lg:pb-0">
              {Object.keys(servicesData).map((key) => (
                <li
                  key={key}
                  onClick={() => setActiveService(key)}
                  className={`flex-shrink-0 lg:flex-shrink flex items-center gap-3 p-4 rounded-xl cursor-pointer border transition-all duration-300
                    ${
                      activeService === key
                        ? "bg-gradient-to-l from-[#53a1dd] to-[#6ab0e2] text-white border-[#53a1dd] shadow-md"
                        : "bg-white border-gray-200 hover:border-[#53a1dd] hover:shadow-sm"
                    }`}
                >
                  <span
                    className={`text-xl transition-colors ${
                      activeService === key
                        ? "text-white"
                        : "text-gray-500"
                    }`}
                  >
                    {servicesData[key].icon}
                  </span>
                  <span className="font-medium whitespace-nowrap">
                    {servicesData[key].title}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* التفاصيل */}
          <div className="flex-1 bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-lg transition-all duration-300">
            <div className="flex flex-col sm:flex-row gap-5 mb-8">
              <div className="bg-gradient-to-br from-[#53a1dd] to-[#6ab0e2] w-16 h-16 rounded-xl flex items-center justify-center shadow-md">
                <div className="text-white text-2xl">
                  {servicesData[activeService].icon}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2c3e50] mb-3">
                  {servicesData[activeService].title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                  {servicesData[activeService].description}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-5 pr-2">
                مميزات الخدمة
              </h4>
              <ul className="space-y-4">
                {servicesData[activeService].features.map((feature, idx) => (
                  <li 
                    key={idx} 
                    className="flex gap-3 p-3 hover:bg-white rounded-lg transition-colors duration-200"
                  >
                    <div className="bg-green-100 w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Icons.FaCheck className="text-green-600 text-sm" />
                    </div>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;