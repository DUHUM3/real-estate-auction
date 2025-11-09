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
  FaFileContract
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* الشعار والروابط الاجتماعية في صف واحد */}
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-icon">
              <FaHome />
            </div>
            <span className="logo-text">شاهين بلاس</span>
          </div>
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

        {/* المحتوى الرئيسي في عمود واحد */}
        <div className="footer-content">
          <p className="footer-description">
            منصة مزادات الاراضي الرائدة في المملكة العربية السعودية.
          </p>
          
          {/* روابط سريعة في صف أفقي */}
          <div className="quick-links">
            <Link to="/" className="quick-link">الرئيسية</Link>
            <Link to="/properties" className="quick-link">الاراضي</Link>
            <Link to="/about" className="quick-link">عن المنصة</Link>
            <Link to="/contact" className="quick-link">اتصل بنا</Link>
          </div>

          {/* معلومات الاتصال مضغوطة */}
          <div className="contact-info-compact">
            <div className="contact-row">
              <FaPhone className="contact-icon" />
              <span>+966 123 456 789</span>
            </div>
            <div className="contact-row">
              <FaEnvelope className="contact-icon" />
              <span>info@shaheenplus.com</span>
            </div>
          </div>
        </div>

        {/* الجزء السفلي - مضغوط جداً */}
        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 شاهين بلاس</p>
          <div className="footer-bottom-links">
            <a href="/privacy-policy" className="bottom-link">
              <FaShieldAlt className="link-icon" />
              سياسة الخصوصية
            </a>
            <a href="/terms-of-service" className="bottom-link">
              <FaFileContract className="link-icon" />
              شروط الاستخدام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;