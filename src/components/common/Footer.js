import React from 'react';
import '../../styles/Footer.css';
import { Link } from 'react-router-dom';
import { 
  FaHome, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn,
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaShieldAlt,
  FaFileContract,
  FaUndo
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* القسم الأول: الشعار والوصف */}
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">
              <FaHome />
            </div>
            <span className="logo-text">عقاركم</span>
          </div>
          <p className="footer-description">
            منصة مزادات العقارات الرائدة في العالم العربي. نوفر لكم تجربة آمنة وموثوقة لشراء وبيع العقارات عبر المزادات الإلكترونية.
          </p>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* القسم الثاني: روابط سريعة */}
        <div className="footer-section">
          <h3 className="footer-title">روابط سريعة</h3>
          <ul className="footer-links">
            <li><Link to="/" className="footer-link">الرئيسية</Link></li>
            <li><Link to="/properties" className="footer-link">العقارات</Link></li>
            <li><Link to="/about" className="footer-link">عن المنصة</Link></li>
            <li><Link to="/contact" className="footer-link">اتصل بنا</Link></li>
          </ul>
        </div>

        {/* القسم الثالث: خدماتنا */}
        <div className="footer-section">
          <h3 className="footer-title">خدماتنا</h3>
          <ul className="footer-links">
            <li><a href="#" className="footer-link">مزادات العقارات</a></li>
            <li><a href="#" className="footer-link">مزادات الأراضي</a></li>
            <li><a href="#" className="footer-link">التقييم العقاري</a></li>
            <li><a href="#" className="footer-link">الاستشارات</a></li>
          </ul>
        </div>

        {/* القسم الرابع: معلومات الاتصال */}
        <div className="footer-section">
          <h3 className="footer-title">معلومات الاتصال</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+966 123 456 789</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>info@aqarkom.com</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt className="contact-icon" />
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
          </div>
        </div>
      </div>

      {/* الجزء السفلي من الفوتر */}
      <div className="footer-bottom">
        <div className="footer-bottom-container">
          <p className="copyright">&copy; 2025 عقاركم. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links">
            <a href="#" className="bottom-link">
              <FaShieldAlt className="link-icon" />
              سياسة الخصوصية
            </a>
            <a href="#" className="bottom-link">
              <FaFileContract className="link-icon" />
              شروط الاستخدام
            </a>
            {/* <a href="#" className="bottom-link">
              <FaUndo className="link-icon" />
              سياسة الاسترجاع
            </a> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;