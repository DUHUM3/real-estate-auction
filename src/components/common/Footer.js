import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-icon">🏠</span>
            <span className="logo-text">عقاركم</span>
          </div>
          <p className="footer-description">
            منصة مزادات العقارات الرائدة في العالم العربي. نوفر لكم تجربة آمنة وموثوقة لشراء وبيع العقارات عبر المزادات الإلكترونية.
          </p>
          <div className="social-links">
            <a href="#" className="social-link">📘</a>
            <a href="#" className="social-link">🐦</a>
            <a href="#" className="social-link">📷</a>
            <a href="#" className="social-link">💼</a>
          </div>
        </div>

        <div className="footer-section">
          <h3>روابط سريعة</h3>
          <ul className="footer-links">
            <li><Link to="/">الرئيسية</Link></li>
            <li><Link to="/properties">العقارات</Link></li>
            <li><Link to="/about">عن المنصة</Link></li>
            <li><Link to="/contact">اتصل بنا</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>خدماتنا</h3>
          <ul className="footer-links">
            <li><a href="#">مزادات العقارات</a></li>
            <li><a href="#">مزادات الأراضي</a></li>
            <li><a href="#">التقييم العقاري</a></li>
            <li><a href="#">الاستشارات</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>معلومات الاتصال</h3>
          <div className="contact-info">
            <p>📞 +966 123 456 789</p>
            <p>✉️ info@aqarkom.com</p>
            <p>📍 الرياض، المملكة العربية السعودية</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p>&copy; 2024 عقاركم. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links">
            <a href="#">سياسة الخصوصية</a>
            <a href="#">شروط الاستخدام</a>
            <a href="#">سياسة الاسترجاع</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;