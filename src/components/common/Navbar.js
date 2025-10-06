import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../../styles/hero.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* الشعار في أقصى اليسار */}
        <Link to="/" className="nav-logo" onClick={() => setIsMobileMenuOpen(false)}>
          {/* <span className="logo-icon">🏠</span> */}
          <span className="logo-text">LOGO</span>
        </Link>

        <div className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}>
          {isMobileMenuOpen && (
            <button className="close-btn" onClick={() => setIsMobileMenuOpen(false)}>
              ✕
            </button>
          )}

          {/* الروابط في أقصى اليمين */}
          <div className="nav-links-group">
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              الرئيسية
            </Link>
            <Link to="/properties" className={`nav-link ${isActive('/properties') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              العقارات
            </Link>
            <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              عنا
            </Link>
            <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
              اتصل بنا
            </Link>
          </div>

          {/* قسم المستخدم */}
          <div className="nav-user-group">
            {currentUser ? (
              <>
                <span className="user-welcome">مرحباً، {currentUser.name}</span>
                <Link to="/dashboard" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  لوحة التحكم
                </Link>
                <Link to="/create-property" className="nav-link btn-outline" onClick={() => setIsMobileMenuOpen(false)}>
                  أضف عقار
                </Link>
                <button onClick={handleLogout} className="btn-logout">
                  تسجيل خروج
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link" onClick={() => setIsMobileMenuOpen(false)}>
                  تسجيل الدخول
                </Link>
                <Link to="/register" className="nav-link btn-primary" onClick={() => setIsMobileMenuOpen(false)}>
                  إنشاء حساب
                </Link>
              </>
            )}
          </div>
        </div>

        <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;