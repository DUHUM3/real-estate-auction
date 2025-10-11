import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaBell, FaSignOutAlt, FaCog, FaPlus, FaChartBar, FaMapMarked, FaBriefcase, FaShoppingCart, FaBullhorn } from 'react-icons/fa';
import { BsHouseFill } from 'react-icons/bs';
import '../../styles/Navbar.css';

function Navbar({ onLoginClick, onRegisterClick }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequestMenu, setShowRequestMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const requestMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  };

  const isActive = (path) => location.pathname === path;

  // إغلاق القوائم عند النقر خارجها
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
      if (requestMenuRef.current && !requestMenuRef.current.contains(event.target)) {
        setShowRequestMenu(false);
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setShowUserMenu(false);
        setShowNotifications(false);
        setShowRequestMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleCreateRequest = (type) => {
    if (!currentUser) {
      onLoginClick();
      return;
    }
    
    if (type === 'buy-land') {
      navigate('/create-buy-request');
    } else if (type === 'market-property') {
      navigate('/create-marketing-request');
    } else if (type === 'market-land') {
      navigate('/create-land-marketing');
    }
    setIsMobileMenuOpen(false);
    setShowRequestMenu(false);
  };

  // بيانات تجريبية للإشعارات
  const notifications = [
    { id: 1, title: 'طلب شراء جديد', message: 'لديك طلب شراء جديد يحتاج المراجعة', time: 'منذ 5 دقائق', read: false },
    { id: 2, title: 'مزاد جديد', message: 'تم إضافة عقار جديد للمزاد', time: 'منذ ساعة', read: false },
    { id: 3, title: 'عرض مكتمل', message: 'تم بيع العقار في المزاد', time: 'منذ يوم', read: true }
  ];

  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* الجزء الأيمن: الشعار + جميع الأزرار بترتيب معكوس */}
        <div className="nav-right-section">
          {/* الشعار */}
          <Link to="/" className="nav-logo" onClick={handleCloseMenu}>
            <span className="logo-text">LOGO</span>
          </Link>

          {/* جميع الأزرار بجانب الشعار بترتيب معكوس */}
          <div className="nav-buttons-group">
            {/* الرئيسية */}
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`} 
              onClick={handleCloseMenu}
            >
              <BsHouseFill className="link-icon" />
              الرئيسية
            </Link>

            {/* العقارات والمزادات */}
            <Link 
              to="/properties" 
              className={`nav-link ${isActive('/properties') ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaMapMarked className="link-icon" />
              العقارات والمزادات
            </Link>

            {/* قائمة طلب شراء/تسويق */}
            <div className="nav-dropdown" ref={requestMenuRef}>
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => setShowRequestMenu(!showRequestMenu)}
              >
                <FaPlus className="link-icon" />
                طلب شراء / تسويق
              </button>
              
              {showRequestMenu && (
                <div className="dropdown-menu">
                  <button 
                    className="dropdown-item"
                    onClick={() => handleCreateRequest('buy-land')}
                  >
                    <FaShoppingCart className="dropdown-icon" />
                    طلب شراء أرض
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleCreateRequest('market-property')}
                  >
                    <FaBullhorn className="dropdown-icon" />
                    طلب تسويق عقار
                  </button>
                  <button 
                    className="dropdown-item"
                    onClick={() => handleCreateRequest('market-land')}
                  >
                    <FaBullhorn className="dropdown-icon" />
                    طلب تسويق أرض
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* الجزء الأيسر: أزرار المستخدم أو التسجيل والدخول فقط */}
        <div className="nav-left-section">
          <div 
            className={`nav-menu ${isMobileMenuOpen ? 'active' : ''}`}
            ref={mobileMenuRef}
          >
            {isMobileMenuOpen && (
              <button 
                className="close-btn" 
                onClick={handleCloseMenu}
                aria-label="إغلاق القائمة"
              >
                ✕
              </button>
            )}

            {/* قسم المستخدم والإشعارات */}
            <div className="nav-user-group">
              {currentUser ? (
                <>
                  {/* أيقونة الإشعارات */}
                  <div className="notifications-container" ref={notificationsRef}>
                    <button 
                      className="notification-btn"
                      onClick={() => setShowNotifications(!showNotifications)}
                    >
                      <FaBell className="notification-icon" />
                      {unreadNotifications > 0 && (
                        <span className="notification-badge">{unreadNotifications}</span>
                      )}
                    </button>
                    
                    {showNotifications && (
                      <div className="notifications-dropdown">
                        <div className="notifications-header">
                          <h3>الإشعارات</h3>
                          <span className="notifications-count">{unreadNotifications} غير مقروء</span>
                        </div>
                        <div className="notifications-list hide-scrollbar">
                          {notifications.map(notification => (
                            <div 
                              key={notification.id} 
                              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
                            >
                              <div className="notification-content">
                                <h4>{notification.title}</h4>
                                <p>{notification.message}</p>
                                <span className="notification-time">{notification.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <Link 
                          to="/notifications" 
                          className="view-all-notifications"
                          onClick={() => setShowNotifications(false)}
                        >
                          عرض جميع الإشعارات
                        </Link>
                      </div>
                    )}
                  </div>

                  {/* قائمة المستخدم */}
                  <div className="user-menu-container" ref={userMenuRef}>
                    <button 
                      className="user-profile-btn"
                      onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                      <span className="user-avatar">
                        <FaUser className="avatar-icon" />
                      </span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="user-dropdown">
                        <Link 
                          to="profile" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaUser className="dropdown-icon" />
                          الملف الشخصي
                        </Link>
                        {/* <Link 
                          to="/dashboard" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaChartBar className="dropdown-icon" />
                          لوحة التحكم
                        </Link> */}
                        {/* <Link 
                          to="/my-lands" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaMapMarked className="dropdown-icon" />
                          أراضي
                        </Link> */}
                        <Link 
                          to="/my-ads" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaBriefcase className="dropdown-icon" />
                  أعلاناتي
                        </Link>
                        <Link 
                          to="/settings" 
                          className="dropdown-item"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <FaCog className="dropdown-icon" />
                          الإعدادات
                        </Link>
                        <hr className="dropdown-divider" />
                        <button 
                          onClick={handleLogout} 
                          className="dropdown-item logout-item"
                        >
                          <FaSignOutAlt className="dropdown-icon" />
                          تسجيل خروج
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* أزرار تسجيل الدخول والتسجيل الجديد */}
                  <div className="auth-buttons">
                    <button 
                      className="nav-link register-btn"
                      onClick={() => {
                        handleCloseMenu();
                        if (typeof onRegisterClick === 'function') onRegisterClick();
                      }}
                    >
                      <FaUser className="register-icon" />
                      <span className="register-text">تسجيل جديد</span>
                    </button>
                    
                    <button 
                      className="nav-link login-btn"
                      onClick={() => {
                        handleCloseMenu();
                        if (typeof onLoginClick === 'function') onLoginClick();
                      }}
                    >
                      <FaUser className="login-icon" />
                      <span className="login-text">تسجيل الدخول</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <button 
            className="mobile-menu-btn" 
            onClick={handleMobileMenuToggle}
            aria-label="فتح القائمة"
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;