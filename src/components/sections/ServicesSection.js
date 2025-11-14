import React, { useState } from 'react';
import Icons from '../../icons/index';

const ServicesSection = () => {
  const [activeService, setActiveService] = useState('large-lands');

  const servicesData = {
    'large-lands': {
      title: 'الأراضي الكبيرة',
      description: 'نقدم هذه الخدمة لملاك الأراضي، الوكلاء الشرعيين، المسوقين العقاريين المعتمدين، والمنشآت. نمكّن الجميع من عرض أراضيهم بطريقة احترافية والوصول إلى الجمهور المناسب سواء للبيع أو للاستثمار، بما يشمل الأراضي السكنية والتجارية والزراعية للمستثمرين الجادين والمطورين المعتمدين.',
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
    <section className="services-section">
      <div className="container">
        <h2 className="section-title">
          استكشفوا خدماتنا
          <div className="transparent-box"></div>
        </h2>

        <div className="mobile-service-indicator">
          <div className="indicator-dots">
            <span className={activeService === 'large-lands' ? 'active' : ''}></span>
            <span className={activeService === 'auction-partnership' ? 'active' : ''}></span>
          </div>
        </div>

        <div className="services-content">
          <div className="services-list">
            <ul>
              <li
                className={activeService === 'large-lands' ? 'active' : ''}
                onClick={() => setActiveService('large-lands')}
              >
                <Icons.FaLandmark className="service-icon" />
                الأراضي الكبيرة
              </li>
              <li
                className={activeService === 'auction-partnership' ? 'active' : ''}
                onClick={() => setActiveService('auction-partnership')}
              >
                <Icons.FaGavel className="service-icon" />
                شراكة مميزة مع شركات المزادات
              </li>
            </ul>
          </div>

          <div className="service-details">
            <div className="service-header">
              <div className="service-icon-container">
                {activeService === 'large-lands' ?
                  <Icons.FaLandmark className="main-service-icon" /> :
                  <Icons.FaGavel className="main-service-icon" />
                }
              </div>
              <h3>{servicesData[activeService].title}</h3>
            </div>

            <p>{servicesData[activeService].description}</p>

            <ul className="sub-services">
              {servicesData[activeService].features.map((feature, index) => (
                <li key={index}>
                  <Icons.FaCheck className="check-icon" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <div className="service-actions">
              <div className="mobile-nav">
                <button
                  className="mobile-nav-btn prev"
                  onClick={() => setActiveService('large-lands')}
                  disabled={activeService === 'large-lands'}
                >
                  <Icons.FaChevronRight />
                </button>
                <button
                  className="mobile-nav-btn next"
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