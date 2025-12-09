import React from 'react';
import '../../styles/Footer.css';
import Icons from '../../icons';
import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  const phoneNumber = "+966 56 606 5406";
  const formattedPhone = phoneNumber.replace(/\s/g, "");

  const handlePhoneClick = () => {
    window.location.href = `tel:${formattedPhone}`;
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

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
            {/* الروابط الأساسية المؤكدة وجودها */}
            <a href="https://x.com/shaheenplus100" className="social-link" aria-label="X" target="_blank" rel="noopener noreferrer">
              <FaXTwitter />
            </a>
            <a href="https://www.youtube.com/@shaheenplus100" className="social-link" aria-label="YouTube" target="_blank" rel="noopener noreferrer">
              <Icons.FaYoutube />
            </a>
            <a href="https://www.tiktok.com/@shaheenplus100" className="social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
              <Icons.FaTiktok />
            </a>
            <a href="https://snapchat.com/t/TtC1xfDa" className="social-link" aria-label="Snapchat" target="_blank" rel="noopener noreferrer">
              <Icons.FaSnapchatGhost />
            </a>
            
            {/* الروابط الأخرى مع أيقونات بديلة */}
            <a href="https://www.instagram.com/shaheenplus100/" className="social-link" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <Icons.FaInstagram />
            </a>
            <a href="https://t.me/+A1UFtDBKyD1jMDBk" className="social-link" aria-label="Telegram" target="_blank" rel="noopener noreferrer">
              <Icons.FaPaperPlane />
            </a>
            {/* <a href="https://whatsapp.com/channel/0029VbBSvScCcW4wJJH4Rb41" className="social-link" aria-label="WhatsApp" target="_blank" rel="noopener noreferrer">
              <Icons.FiPhone />
            </a> */}
          </div>
        </div>

        {/* المحتوى الرئيسي */}
        <div className="footer-content">
          <p className="footer-description">
اول منصه متخصصه بعرض وتسويق الأرضي و المزادات العقارية وتلبية الرغبات العقارية
          </p>

          <div className="contact-info-compact">
            <div className="contact-row clickable" onClick={handlePhoneClick}>
              <Icons.FaPhone className="contact-icon" />
              <span>{phoneNumber}</span>
              <Icons.FaChevronLeft className="contact-action-icon" />
            </div>
            
            <div className="contact-row clickable" onClick={handleWhatsAppClick}>
              <Icons.FaWhatsapp className="contact-icon" />
              <span>واتساب مباشر</span>
              <Icons.FaChevronLeft className="contact-action-icon" />
            </div>
            
            <div className="contact-row">
              <Icons.FaEnvelope className="contact-icon" />
              <span>info@shaheenplus.com</span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">&copy; 2025 شاهين بلس. جميع الحقوق محفوظة.</p>
          <div className="footer-bottom-links">
            <a href="/privacy-policy" className="bottom-link">
              <Icons.FaShieldAlt className="link-icon" />
              سياسة الخصوصية
            </a>
            <a href="/terms-of-service" className="bottom-link">
              <Icons.FaFileContract className="link-icon" />
              شروط الاستخدام
            </a>
            <a href="/contact" className="bottom-link">
              <Icons.FiUser className="link-icon" />
              اتصل بنا
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;