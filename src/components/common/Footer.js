import React from "react";
import { FaXTwitter } from "react-icons/fa6";
import {
  FaHome,
  FaYoutube,
  FaInstagram,
  FaSnapchatGhost,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaShieldAlt,
  FaFileContract,
  FaChevronLeft,
  FaPaperPlane,
} from "react-icons/fa";
import { FiUser } from "react-icons/fi";

function Footer() {
  const phoneNumber = "+966566065406";
  const formattedPhone = phoneNumber.replace(/\s/g, "");

  const handlePhoneClick = () => {
    window.location.href = `tel:${formattedPhone}`;
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${formattedPhone}`, "_blank");
  };

  const formatPhoneNumber = (number) => {
    if (!number) return "";
    const cleaned = number.replace(/\D/g, "");
    if (cleaned.startsWith("966")) {
      const rest = cleaned.substring(3);
      if (rest.length === 9) {
        return `+966 ${rest.substring(0, 2)} ${rest.substring(
          2,
          5
        )} ${rest.substring(5)}`;
      }
    }
    if (cleaned.length === 10) {
      return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
    } else if (cleaned.length === 9) {
      return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, "$1 $2 $3");
    }
    return number;
  };

  return (
    <footer style={styles.footer}>
      {/* خط أزرق في بداية الفوتر مثل باقي الأقسام */}
      <div
        style={{
          height: "1px",
          backgroundColor: "#d0e8f7",
          marginBottom: "16px",
        }}
      ></div>

      <div style={styles.container}>
        {/* الشعار والوصف */}
        <div style={styles.topSection}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>
              <FaHome style={styles.logoIcon} />
              <span style={styles.logoText}>شاهين بلس</span>
            </div>
            <p style={styles.description}>
              أول منصة متخصصة بعرض وتسويق الأراضي والمزادات العقارية
            </p>
          </div>

          {/* معلومات الاتصال */}
          <div style={styles.contactSection}>
            <div style={styles.contactItem} onClick={handlePhoneClick}>
              <FaPhone style={styles.contactIcon} />
              <span
                style={{
                  ...styles.contactText,
                  direction: "ltr",
                  unicodeBidi: "plaintext",
                }}
              >
                {formatPhoneNumber(phoneNumber)}
              </span>
            </div>
            <div style={styles.contactItem} onClick={handleWhatsAppClick}>
              <FaWhatsapp style={styles.contactIcon} />
              <span style={styles.contactText}>واتساب</span>
            </div>
            <div style={styles.contactItem}>
              <FaEnvelope style={styles.contactIcon} />
              <span style={styles.contactText}>info@shaheenplus.sa</span>
            </div>
          </div>
        </div>

        {/* الشهادات */}
        <div style={styles.certificatesSection}>
          <img
            src="https://www.positivessl.com/images/seals/positivessl_trust_seal_lg_222x54.png"
            alt="SSL Secure"
            style={styles.sslImage}
          />

          <img
            src="/images/saudibusiness.png"
            alt="المركز السعودي للأعمال"
            style={styles.businessImage}
          />
        </div>

        {/* الروابط الاجتماعية */}
        <div style={styles.socialSection}>
          <a
            href="https://x.com/shaheenplus100"
            style={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaXTwitter />
          </a>
          <a
            href="https://www.youtube.com/@shaheenplus100"
            style={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube />
          </a>
          <a
            href="https://www.instagram.com/shaheenplus100/"
            style={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram />
          </a>
          <a
            href="https://snapchat.com/t/TtC1xfDa"
            style={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaSnapchatGhost />
          </a>
          <a
            href="https://t.me/+A1UFtDBKyD1jMDBk"
            style={styles.socialLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaPaperPlane />
          </a>
        </div>

        {/* الروابط السفلية وحقوق النشر */}
        <div style={styles.bottomSection}>
          <div style={styles.bottomLinks}>
            <a href="/privacy-policy" style={styles.bottomLink}>
              <FaShieldAlt style={styles.bottomLinkIcon} />
              سياسة الخصوصية
            </a>
            <a href="/terms-of-service" style={styles.bottomLink}>
              <FaFileContract style={styles.bottomLinkIcon} />
              شروط الاستخدام
            </a>
            <a href="/contact" style={styles.bottomLink}>
              <FiUser style={styles.bottomLinkIcon} />
              اتصل بنا
            </a>
          </div>
          <p style={styles.copyright}>© 2025 شاهين بلس. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#ffffff",
    padding: "24px 16px",
    fontFamily: "Arial, sans-serif",
    direction: "rtl",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  topSection: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: "24px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #d0e8f7",
  },
  logoSection: {
    flex: "1",
    minWidth: "250px",
  },
  logo: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    marginBottom: "12px",
  },
  logoIcon: {
    fontSize: "24px",
    color: "#4a90e2",
  },
  logoText: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#333",
  },
  description: {
    fontSize: "13px",
    color: "#666",
    lineHeight: "1.5",
    margin: 0,
  },
  contactSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  contactItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    cursor: "pointer",
    transition: "color 0.3s",
  },
  contactIcon: {
    fontSize: "16px",
    color: "#4a90e2",
  },
  contactText: {
    fontSize: "13px",
    color: "#555",
  },
  certificatesSection: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "32px",
    padding: "16px 0",
    marginBottom: "20px",
    borderBottom: "1px solid #d0e8f7",
    flexWrap: "wrap",
  },
  certificateLink: {
    display: "block",
    transition: "opacity 0.3s",
  },
  sslImage: {
    height: "40px",
    width: "auto",
  },
  businessImage: {
    height: "50px",
    width: "auto",
  },
  socialSection: {
    display: "flex",
    justifyContent: "center",
    gap: "16px",
    marginBottom: "20px",
    paddingBottom: "20px",
    borderBottom: "1px solid #d0e8f7",
  },
  socialLink: {
    color: "#4a90e2",
    fontSize: "20px",
    transition: "color 0.3s",
    cursor: "pointer",
  },
  bottomSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "12px",
  },
  bottomLinks: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  bottomLink: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
    fontSize: "12px",
    color: "#4a90e2",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  bottomLinkIcon: {
    fontSize: "12px",
  },
  copyright: {
    fontSize: "12px",
    color: "#666",
    margin: 0,
  },
};

export default Footer;
