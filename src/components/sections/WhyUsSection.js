import React, { useState } from 'react';
import Icons from '../../icons/index';

const WhyUsSection = () => {
  const [activeTab, setActiveTab] = useState(0);

  const cardsData = [
    {
      id: 1,
      title: "الريادة في السوق",
      description: "نحن رواد في مجال التسويق العقاري مع أكثر من 15 عاماً من الخبرة والتميز",
      icon: <Icons.FaAward />,
      details: [
        "أكثر من 15 عاماً من الخبرة في السوق العقاري",
        "شبكة واسعة من الشركاء والعملاء",
        "معدل نجاح يتجاوز 95% في صفقاتنا"
      ]
    },
    {
      id: 2,
      title: "جودة لا تضاهى",
      description: "نقدم خدمات عالية الجودة تلبي توقعات عملائنا وتتجاوزها",
      icon: <Icons.FaStar />,
      details: [
        "فريق محترف من الخبراء والمستشارين",
        "مراجعة جودة مستمرة لجميع خدماتنا",
        "تقييمات إيجابية من أكثر من 5000 عميل"
      ]
    },
    {
      id: 3,
      title: "سرعة في الأداء",
      description: "نتعامل بسرعة وكفاءة لتحقيق أفضل النتائج في أقصر وقت ممكن",
      icon: <Icons.FaChartLine />,
      details: [
        "استجابة فورية لاستفسارات العملاء",
        "إتمام الصفقات في وقت قياسي",
        "نظام متابعة وتحديث مستمر"
      ]
    },
    {
      id: 4,
      title: "ثقة العملاء",
      description: "ثقة آلاف العملاء شهادة على نجاحنا وتميزنا في تقديم الخدمات",
      icon: <Icons.FaHandshake />,
      details: [
        "أكثر من 10,000 عميل راضٍ عن خدماتنا",
        "نسبة تجديد عقود تصل إلى 80%",
        "توصيات مباشرة من عملائنا السابقين"
      ]
    },
    {
      id: 5,
      title: "حلول مبتكرة",
      description: "نطور حلولاً مبتكرة تلبي احتياجات السوق المتغيرة",
      icon: <Icons.FaLandmark />,
      details: [
        "منصات رقمية متطورة لتسهيل التعامل",
        "حلول تمويلية مبتكرة تناسب الجميع",
        "استراتيجيات تسويقية حديثة وفعالة"
      ]
    },
    {
      id: 6,
      title: "أمان وموثوقية",
      description: "جميع تعاملاتنا تتم ضمن أعلى معايير الأمان والموثوقية",
      icon: <Icons.FaShieldAlt />,
      details: [
        "أنظمة حماية متطورة للبيانات",
        "شهادات أمان معترف بها عالمياً",
        "ضمانات قانونية كاملة لجميع الصفقات"
      ]
    }
  ];

  const nextCard = () => {
    setActiveTab((prev) => (prev === cardsData.length - 1 ? 0 : prev + 1));
  };

  const prevCard = () => {
    setActiveTab((prev) => (prev === 0 ? cardsData.length - 1 : prev - 1));
  };

  return (
    <section className="why-us-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">
            لماذا تختارنا؟
            <div className="transparent-box"></div>
          </h2>
        </div>

        {/* تصميم الكمبيوتر */}
        <div className="desktop-why-us">
          <div className="full-screen-card">
            <div className="card-content">
              <div className="card-icon">
                {cardsData[activeTab].icon}
              </div>
              <div className="card-main-content">
                <h3>{cardsData[activeTab].title}</h3>
                <p className="card-description">{cardsData[activeTab].description}</p>
                <div className="card-details">
                  <h4>تفاصيل إضافية:</h4>
                  <ul>
                    {cardsData[activeTab].details.map((detail, index) => (
                      <li key={index}>
                        <Icons.FaCheck className="check-icon" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="card-navigation">
              <div className="nav-arrows">
                <button className="nav-arrow prev" onClick={prevCard}>
                  <Icons.FaChevronRight />
                </button>
                <button className="nav-arrow next" onClick={nextCard}>
                  <Icons.FaChevronLeft />
                </button>
              </div>

              <div className="nav-indicators">
                {cardsData.map((card, index) => (
                  <button
                    key={card.id}
                    className={`nav-indicator ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  >
                    {card.title}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* تصميم الهاتف */}
        <div className="mobile-why-us">
          <div className="mobile-cards-wrapper">
            {cardsData.map((card, index) => (
              <div
                key={card.id}
                className={`mobile-why-card ${activeTab === index ? 'active' : ''}`}
                style={{
                  display: activeTab === index ? 'block' : 'none'
                }}
              >
                <div className="card-icon">
                  {card.icon}
                </div>
                <h3>{card.title}</h3>
                <p className="card-description">{card.description}</p>
                <div className="card-details">
                  <h4>تفاصيل إضافية:</h4>
                  <ul>
                    {card.details.map((detail, idx) => (
                      <li key={idx}>
                        <Icons.FaCheck className="check-icon" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}

            {/* التنقل */}
            <div className="mobile-navigation">
              <button className="mobile-nav-arrow prev" onClick={prevCard}>
                <Icons.FaChevronRight />
              </button>

              <div className="mobile-indicators">
                {cardsData.map((_, index) => (
                  <button
                    key={index}
                    className={`mobile-indicator ${activeTab === index ? 'active' : ''}`}
                    onClick={() => setActiveTab(index)}
                  ></button>
                ))}
              </div>

              <button className="mobile-nav-arrow next" onClick={nextCard}>
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