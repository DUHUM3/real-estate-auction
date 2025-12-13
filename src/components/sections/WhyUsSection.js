import React, { useState } from "react";
import Icons from "../../icons/index";

const WhyUsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const cardsData = [
    {
      id: 1,
      title: "الرؤية (Vision)",
      description:
        "أن تكون شاهين بلس المنصة العقارية الأذكى والأكثر موثوقية في المملكة العربية السعودية ، والمرجع الأول الذي يجمع بين تسويق وعرض الأراضي، وتفعيل الطلبات العقارية، وعرض المزادات، ضمن منظومة رقمية متكاملة تحفظ الحقوق وتُسهل إتمام الصفقات بجودة عالية",
      icon: <Icons.FaEye/>,
    },
    {
      id: 2,
      title: " الرسالة (Mission)",
      description:
        "تقديم حلول عقارية مبتكرة تجمع بين التكنولوجيا، الاحترافية، والشراكات الفعّالة، من خلال منظومة خدمات تشمل عرض الأراضي، إدارة الطلبات، ربط العملاء بشركات المزادات، وتمكين هذه الشركات من عرض مزاداتها داخل المنصة، بما يضمن شفافية التعامل، حماية الحقوق، ورفع كفاءة السوق العقاري في المملكة.",
      icon: <Icons.FaPaperPlane/>,
    },
    {
      id: 3,
      title: "الأهداف الاستراتيجية (Strategic Goals)",
      icon: <Icons.FaChartLine/>,
      details: [
        "بناء منصة عقارية موثوقة وفعّالة تربط جميع أطراف السوق تحت مظلة واحدة.",
        "تسهيل وتسريع عمليات البيع والشراء والاستثمار العقاري عبر خدمات رقمية متكاملة.",
        "تمكين شركات المزادات من الوصول لشريحة أكبر من المستثمرين عبر قناة رسمية واحترافية.",
        "توفير نظام متطور لإدارة الطلبات يربط العملاء بالمعلنين بطريقة مباشرة وذكية.",
        "حماية حقوق وعمولات جميع الأطراف عبر أنظمة واضحة ومؤتمتة داخل المنصة.",
        "تطوير خدمات تقنية مبتكرة ترفع من جودة التجربة العقارية وتزيد من فرص إتمام الصفقات.",
        "تعزيز الثقة في القطاع العقاري من خلال الشفافية، الدقة، وإدارة العمليات باحترافية عالية.",
        "دعم التحول الرقمي للعقار في المملكة بما يتوافق مع رؤية السعودية 2030.",
      ],
    },
    {
      id: 4,
      title: "القيم الجوهرية (Core Values)",
      icon: <Icons.FaHandshake/>,
      details: [
        "الشفافية التزام كامل بتقديم معلومات واضحة وإجراءات موثوقة في كل مرحلة.",
        "الاحترافية إدارة جميع الخدمات والعمليات بمعايير عالية وخبرة متخصصة لحماية مصالح الأطراف.",
        "الابتكار تطوير حلول وتقنيات عقارية رقمية تعزز التجربة وتدعم اتخاذ القرار.",
        "الموثوقية بناء علاقة ثقة طويلة الأمد مع العملاء، المعلنين، وشركات المزادات.",
        "حفظ الحقوق آليات واضحة لضمان حقوق المنصة والمعلنين والمشترين، مع حماية العمولة وتنظيم العمليات.",
        "خدمة العميل تسهيل الوصول للفرص المناسبة وتقديم دعم متواصل ليحصل العميل على أفضل النتائج.",
        "الشراكة اعتبار العملاء، المستخدمين، و المسوقين، المستثمرين، وشركات المزادات شركاء أساسيين في نجاح المنصة.",
      ],
    },
  ];

  const nextCard = () => {
    setActiveTab((prev) => (prev === cardsData.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setActiveTab((prev) => (prev === 0 ? cardsData.length - 1 : prev - 1));
  };

  return (
    <section className="bg-white py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-right mb-12">
          <h2 className="text-1xl md:text-4xl font-bold text-[#343838] relative inline-block">
            لماذا تستخدم شاهين بلس
            <div className="absolute inset-0 bg-transparent opacity-20"></div>
          </h2>
        </div>

        <div className="hidden lg:block">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 md:p-12 min-h-[500px] flex flex-col justify-between shadow-2xl border border-gray-200 relative overflow-hidden">
            <div className="flex items-start gap-8 md:gap-10 flex-1">
              <div className="text-4xl md:text-5xl h-24 w-24 md:h-28 md:w-28 bg-white text-[#53a1dd] rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                {cardsData[activeTab].icon}
              </div>

              <div className="flex-1 text-right">
                <h3 className="text-2xl md:text-3xl font-bold text-[#53a1dd] mb-4 md:mb-6">
                  {cardsData[activeTab].title}
                </h3>
                <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6 md:mb-8 border-r-4 border-yellow-500 pr-4 md:pr-6">
                  {cardsData[activeTab].description}
                </p>

                {cardsData[activeTab].details && (
                  <div className="text-right">
                    <ul className="space-y-3">
                      {cardsData[activeTab].details.map((detail, index) => (
                        <li
                          key={index}
                          className="text-gray-500 text-base md:text-lg relative pr-8 leading-relaxed"
                        >
                          <Icons.FaCheck className="text-green-500 absolute right-0 top-1 text-sm md:text-base" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-center mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-300">
              <div className="flex gap-4">
                <button
                  className="bg-[#53a1dd] text-white border-none w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#458bc2] hover:-translate-y-1 hover:shadow-xl"
                  onClick={prevCard}
                >
                  <Icons.FaChevronRight />
                </button>
                <button
                  className="bg-[#53a1dd] text-white border-none w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 shadow-lg hover:bg-[#458bc2] hover:-translate-y-1 hover:shadow-xl"
                  onClick={nextCard}
                >
                  <Icons.FaChevronLeft />
                </button>
              </div>

              <div className="flex gap-3 flex-wrap justify-center flex-1">
                {cardsData.map((card, index) => (
                  <button
                    key={card.id}
                    className={`px-4 py-2 md:px-5 md:py-3 rounded-lg cursor-pointer transition-all duration-300 text-sm font-medium whitespace-nowrap border-2 ${
                      activeTab === index
                        ? "bg-[#53a1dd] border-[#53a1dd] text-white -translate-y-1 shadow-lg"
                        : "bg-white border-gray-300 text-gray-600 hover:border-[#53a1dd] hover:text-[#53a1dd]"
                    }`}
                    onClick={() => setActiveTab(index)}
                  >
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="block lg:hidden">
          <div className="w-full relative">
            {cardsData.map((card, index) => (
              <div
                key={card.id}
                className={`w-full bg-white rounded-xl p-5 md:p-6 shadow-lg mb-6 ${
                  activeTab === index
                    ? "block opacity-100 visible"
                    : "hidden opacity-0 invisible"
                }`}
              >
                <div className="text-3xl h-20 w-20 bg-white text-[#53a1dd] rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                  {card.icon}
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-[#53a1dd] mb-3 text-center">
                  {card.title}
                </h3>

                <p className="text-gray-500 text-base md:text-lg leading-relaxed mb-4 text-center px-2">
                  {card.description}
                </p>

                {card.details && (
                  <div className="text-right mt-4">
                    <ul className="space-y-2">
                      {card.details.map((detail, idx) => (
                        <li
                          key={idx}
                          className="text-gray-500 text-sm md:text-base relative pr-6 leading-relaxed text-right"
                        >
                          <Icons.FaCheck className="text-green-500 absolute right-0 top-0.5 text-xs md:text-sm" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}

            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                className="bg-[#53a1dd] text-white border-none rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#458bc2]"
                onClick={prevCard}
              >
                <Icons.FaChevronRight />
              </button>

              <div className="flex gap-2">
                {cardsData.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full border-none cursor-pointer transition-all duration-300 ${
                      activeTab === index
                        ? "bg-[#53a1dd] scale-125"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setActiveTab(index)}
                  ></button>
                ))}
              </div>

              <button
                className="bg-[#53a1dd] text-white border-none rounded-full w-10 h-10 md:w-12 md:h-12 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-md hover:bg-[#458bc2]"
                onClick={nextCard}
              >
                <Icons.FaChevronLeft />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUsSection;
