import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaUser, FaBell, FaSignOutAlt, FaHeart, FaCog, FaPlus, FaChartBar, FaMapMarked, FaBriefcase, FaShoppingCart, FaBullhorn, FaListAlt, FaHandshake } from 'react-icons/fa';
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

  // التحقق من نوع المستخدم
  const isGeneralUser = () => {
    return currentUser?.user_type === 'مستخدم عام';
  };

  const isLandOwner = () => {
    return currentUser?.user_type === 'مالك أرض';
  };
   const isPropertyOwner = () => {
    return currentUser?.user_type === 'وكيل عقارات';
  };

  const isInvestor = () => {
    return currentUser?.user_type === 'شركة مزادات';
  };

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
    setShowRequestMenu(false);
    setShowUserMenu(false);
    setShowNotifications(false);
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
      navigate('/land-requests');
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
        {/* الجزء الأيمن: الشعار + القوائم الرئيسية */}
        <div className="nav-right-section">
          {/* الشعار */}
        {/* الشعار */}
<Link to="/" className="nav-logo" onClick={handleCloseMenu}>
  <img 
    src="images/logo3.png" 
    alt="Logo" 
    className="logo-image"
  />
</Link>
<Link to="/" className="nav-logo" onClick={handleCloseMenu}>
  <img 
    src="images/text.png" 
    alt="Logo" 
    className="logo-image"
  />
</Link>
          {/* القوائم الرئيسية - تظهر في الشريط العلوي */}
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
                className={`nav-link dropdown-toggle ${showRequestMenu ? 'active' : ''}`}
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
                </div>
              )}
            </div>
          </div>
        </div>

        {/* الجزء الأيسر: أزرار المستخدم أو التسجيل والدخول */}
        <div className="nav-left-section">
          {/* عناصر الشريط العلوي - تظهر في جميع الأجهزة */}
          {currentUser ? (
            <div className="top-bar-controls">
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
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaUser className="dropdown-icon" />
                      الملف الشخصي
                    </Link>
                    
                    {/* إذا كان المستخدم عام يعرض "طلباتي"، وإلا يعرض "إعلاناتي" */}
                    {isGeneralUser() ? (
                      <Link 
                        to="/my-requests" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaListAlt className="dropdown-icon" />
                        طلباتي
                      </Link>
                    ) : (
                      <Link 
                        to="/my-ads" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaBriefcase className="dropdown-icon" />
                        إعلاناتي
                      </Link>
                    )}
                    
                    {/* إذا كان مالك أرض أو مستثمر يعرض "عروضي" */}
                    {(isLandOwner() || isInvestor() || isPropertyOwner()) && (
                      <Link 
                        to="/my-offers" 
                        className="dropdown-item"
                        onClick={() => setShowUserMenu(false)}
                      >
                        <FaHandshake className="dropdown-icon" />
                        عروضي
                      </Link>
                    )}
                    
                    <Link 
                      to="/my-lands" 
                      className="dropdown-item"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <FaHeart className="dropdown-icon" />
                      المفضلة
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
            </div>
          ) : (
            /* أزرار التسجيل والدخول للشريط العلوي */
            <div className="top-auth-buttons">
              <button 
                className="nav-link register-btn"
                onClick={() => {
                  if (typeof onRegisterClick === 'function') onRegisterClick();
                }}
              >
                <FaUser className="register-icon" />
                <span className="register-text">تسجيل جديد</span>
              </button>
              
              <button 
                className="nav-link login-btn"
                onClick={() => {
                  if (typeof onLoginClick === 'function') onLoginClick();
                }}
              >
                <FaUser className="login-icon" />
                <span className="login-text">تسجيل الدخول</span>
              </button>
            </div>
          )}

          {/* زر القائمة الجانبية للهاتف */}
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

        {/* القائمة الجانبية للهاتف */}
        <div 
          className={`mobile-sidebar ${isMobileMenuOpen ? 'active' : ''}`}
          ref={mobileMenuRef}
        >
          <div className="mobile-sidebar-header">
            <button 
              className="close-btn" 
              onClick={handleCloseMenu}
              aria-label="إغلاق القائمة"
            >
              ✕
            </button>
            <h3>القائمة الرئيسية</h3>
          </div>

          <div className="mobile-sidebar-content">
            {/* القوائم الأساسية */}
            <div className="mobile-nav-section">
              <Link 
                to="/" 
                className={`mobile-nav-link ${isActive('/') ? 'active' : ''}`}
                onClick={handleCloseMenu}
              >
                <BsHouseFill className="link-icon" />
                الرئيسية
              </Link>

              <Link 
                to="/properties" 
                className={`mobile-nav-link ${isActive('/properties') ? 'active' : ''}`}
                onClick={handleCloseMenu}
              >
                <FaMapMarked className="link-icon" />
                العقارات والمزادات
              </Link>

              {/* قائمة الطلبات في الجانبية */}
              <div className="mobile-nav-dropdown">
                <button 
                  className={`mobile-nav-link dropdown-toggle ${showRequestMenu ? 'active' : ''}`}
                  onClick={() => setShowRequestMenu(!showRequestMenu)}
                >
                  <FaPlus className="link-icon" />
                  طلب شراء / تسويق
                </button>
                
                {showRequestMenu && (
                  <div className="mobile-dropdown-menu">
                    <button 
                      className="mobile-dropdown-item"
                      onClick={() => handleCreateRequest('buy-land')}
                    >
                      <FaShoppingCart className="dropdown-icon" />
                      طلب شراء أرض
                    </button>
                    <button 
                      className="mobile-dropdown-item"
                      onClick={() => handleCreateRequest('market-property')}
                    >
                      <FaBullhorn className="dropdown-icon" />
                      طلب تسويق عقار
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* قسم المستخدم في القائمة الجانبية - للمسجلين فقط */}
            {currentUser && (
              <div className="mobile-user-section">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    <FaUser className="avatar-icon" />
                  </div>
                  <span className="mobile-user-name">
                    مرحباً، {currentUser.full_name || currentUser.email?.split('@')[0]}
                  </span>
                  <span className="mobile-user-type">({currentUser.user_type})</span>
                </div>

                <Link 
                  to="/profile" 
                  className="mobile-nav-link"
                  onClick={handleCloseMenu}
                >
                  <FaUser className="link-icon" />
                  الملف الشخصي
                </Link>

                {/* إذا كان المستخدم عام يعرض "طلباتي"، وإلا يعرض "إعلاناتي" */}
                {isGeneralUser() ? (
                  <Link 
                    to="/my-requests" 
                    className="mobile-nav-link"
                    onClick={handleCloseMenu}
                  >
                    <FaListAlt className="link-icon" />
                    طلباتي
                  </Link>
                ) : (
                  <Link 
                    to="/my-ads" 
                    className="mobile-nav-link"
                    onClick={handleCloseMenu}
                  >
                    <FaBriefcase className="link-icon" />
                    إعلاناتي
                  </Link>
                )}

                {/* إذا كان مالك أرض أو مستثمر يعرض "عروضي" */}
                {(isLandOwner() || isInvestor() || isPropertyOwner()) && (
                  <Link 
                    to="/my-offers" 
                    className="mobile-nav-link"
                    onClick={handleCloseMenu}
                  >
                    <FaHandshake className="link-icon" />
                    عروضي
                  </Link>
                )}

                <Link 
                  to="/my-lands" 
                  className="mobile-nav-link"
                  onClick={handleCloseMenu}
                >
                  <FaHeart className="link-icon" />
                  المفضلة
                </Link>

                <Link 
                  to="/settings" 
                  className="mobile-nav-link"
                  onClick={handleCloseMenu}
                >
                  <FaCog className="link-icon" />
                  الإعدادات
                </Link>

                <Link 
                  to="/notifications" 
                  className="mobile-nav-link"
                  onClick={handleCloseMenu}
                >
                  <FaBell className="link-icon" />
                  الإشعارات
                  {unreadNotifications > 0 && (
                    <span className="mobile-notification-badge">{unreadNotifications}</span>
                  )}
                </Link>

                <button 
                  onClick={handleLogout} 
                  className="mobile-nav-link logout-btn"
                >
                  <FaSignOutAlt className="link-icon" />
                  تسجيل خروج
                </button>
              </div>
            )}

            {/* قسم التسجيل للغير مسجلين */}
            {!currentUser && (
              <div className="mobile-auth-section">
                <button 
                  className="mobile-nav-link login-btn"
                  onClick={() => {
                    handleCloseMenu();
                    if (typeof onLoginClick === 'function') onLoginClick();
                  }}
                >
                  <FaUser className="link-icon" />
                  تسجيل الدخول
                </button>
                
                <button 
                  className="mobile-nav-link register-btn"
                  onClick={() => {
                    handleCloseMenu();
                    if (typeof onRegisterClick === 'function') onRegisterClick();
                  }}
                >
                  <FaUser className="link-icon" />
                  تسجيل جديد
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Overlay للقائمة الجانبية */}
        {isMobileMenuOpen && (
          <div 
            className="mobile-overlay"
            onClick={handleCloseMenu}
          ></div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;