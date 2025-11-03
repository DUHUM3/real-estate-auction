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
      {/* الموج في الأعلى */}
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="shape-fill"></path>
        </svg>
      </div>

      <div className="footer-container">
        {/* القسم الأول: الشعار والوصف */}
        <div className="footer-section">
          <div className="footer-logo">
            <div className="logo-icon">
              <FaHome />
            </div>
            <span className="logo-text">شاهين بلاس</span>
          </div>
          <p className="footer-description">
            منصة مزادات العقارات الرائدة في المملكة العربية السعودية. نوفر لكم تجربة آمنة وموثوقة لشراء وبيع الاراضي.
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

        {/* القسم الثالث: معلومات الاتصال */}
        <div className="footer-section">
          <h3 className="footer-title">معلومات الاتصال</h3>
          <div className="contact-info">
            <div className="contact-item">
              <FaPhone className="contact-icon" />
              <span>+966 123 456 789</span>
            </div>
            <div className="contact-item">
              <FaEnvelope className="contact-icon" />
              <span>info@shahinplace.com</span>
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
          <p className="copyright">&copy; 2025 شاهين بلاس. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links">
            <a href="#" className="bottom-link">
              <FaShieldAlt className="link-icon" />
              سياسة الخصوصية
            </a>
            <a href="#" className="bottom-link">
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