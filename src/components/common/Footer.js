import React from 'react';
import '../../styles/Footer.css';
import Icons from '../../icons';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* الشعار والروابط الاجتماعية */}
        <div className="footer-top">
          <div className="footer-logo">
            <div className="logo-icon">
              <Icons.FaHome />
            </div>
            <span className="logo-text">شاهين بلاس</span>
          </div>
          <div className="social-links">
            <a href="#" className="social-link" aria-label="Facebook">
              <Icons.FaFacebookF />
            </a>
            <a href="#" className="social-link" aria-label="Twitter">
              <Icons.FaTwitter />
            </a>
            <a href="#" className="social-link" aria-label="Instagram">
              <Icons.FaInstagram />
            </a>
            <a href="#" className="social-link" aria-label="LinkedIn">
              <Icons.FaLinkedinIn />
            </a>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="footer-content">
          <p className="footer-description">
            منصة مزادات الاراضي الرائدة في المملكة العربية السعودية.
          </p>

          {/* معلومات الاتصال مضغوطة */}
          <div className="contact-info-compact">
            <div className="contact-row">
              <Icons.FaPhone className="contact-icon" />
              <span>+966 123 456 789</span>
            </div>
            <div className="contact-row">
              <Icons.FaEnvelope className="contact-icon" />
              <span>info@shaheenplus.com</span>
            </div>
          </div>
        </div>

        {/* الجزء السفلي */}
        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 شاهين بلاس</p>
          <div className="footer-bottom-links">
            <a href="/privacy-policy" className="bottom-link">
              <Icons.FaShieldAlt className="link-icon" />
              سياسة الخصوصية
            </a>
            <a href="/terms-of-service" className="bottom-link">
              <Icons.FaFileContract className="link-icon" />
              شروط الاستخدام
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;