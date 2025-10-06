import React from 'react';
import { Link } from 'react-router-dom';

function About() {
  return (
    <div className="about-page">
      <div className="page-header">
        <div className="container">
          <h1>عن منصة عقاركم</h1>
          <p>الريادة في عالم المزادات العقارية الإلكترونية</p>
        </div>
      </div>

      <section className="about-content">
        <div className="container">
          <div className="about-grid">
            <div className="about-text">
              <h2>قصتنا</h2>
              <p>
                تأسست منصة "عقاركم" في عام 2024 بهدف إحداث ثورة في مجال المزادات العقارية 
                في العالم العربي. نؤمن بأن شراء وبيع العقارات يجب أن يكون عملية شفافة، 
                عادلة، ومتاحة للجميع.
              </p>
              <p>
                من خلال تكنولوجيا متطورة وفريق من الخبراء، نوفر بيئة آمنة وموثوقة 
                لإجراء المزادات العقارية الإلكترونية، مما يضمن أفضل النتائج للبائعين 
                والمشترين على حد سواء.
              </p>
              
              <h3>رؤيتنا</h3>
              <p>
                أن نكون المنصة الرائدة في المزادات العقارية الإلكترونية في الشرق الأوسط، 
                وأن نسهل عملية تداول العقارات بكل شفافية وكفاءة.
              </p>

              <h3>رسالتنا</h3>
              <p>
                تقديم حلول مبتكرة وآمنة لتداول العقارات عبر المزادات الإلكترونية، 
                مع الحفاظ على أعلى معايير الجودة والموثوقية.
              </p>
            </div>
            
            <div className="about-image">
              <div className="image-placeholder">
                🏢
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>فريقنا</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">👨‍💼</div>
              <h4>محمد أحمد</h4>
              <p>المدير التنفيذي</p>
            </div>
            <div className="team-member">
              <div className="member-image">👩‍💻</div>
              <h4>سارة الخالد</h4>
              <p>مديرة التقنية</p>
            </div>
            <div className="team-member">
              <div className="member-image">👨‍💼</div>
              <h4>خالد السعد</h4>
              <p>مدير العمليات</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;