import React from 'react';
import '../../styles/Footer.css';
import Icons from '../../icons';
import { FaXTwitter } from "react-icons/fa6"; // 🟢 أيقونة X الرسمية

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
            <span className="logo-text">شاهين بلس</span>
          </div>

          <div className="social-links">
            <a href="#" className="social-link" aria-label="X">
              <FaXTwitter />
            </a>
            <a href="#" className="social-link" aria-label="YouTube">
              <Icons.FaYoutube />
            </a>
            <a href="#" className="social-link" aria-label="TikTok">
              <Icons.FaTiktok />
            </a>
            <a href="#" className="social-link" aria-label="Snapchat">
              <Icons.FaSnapchatGhost />
            </a>
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="footer-content">
          <p className="footer-description">
            اول منصة متخصصة في عرض واستثمار الارضي وعرض المزادات .
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
