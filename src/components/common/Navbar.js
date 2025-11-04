import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FaUser, FaBell, FaSignOutAlt, FaHeart, FaCog, FaPlus, FaChartBar, FaMapMarked, FaBriefcase, FaShoppingCart, FaBullhorn, FaListAlt, FaHandshake } from 'react-icons/fa';
import { BsHouseFill } from 'react-icons/bs';
import { fetchLatestNotifications, markNotificationAsRead } from '../../services/notificationService';
import '../../styles/Navbar.css';

function Navbar({ onLoginClick, onRegisterClick }) {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRequestMenu, setShowRequestMenu] = useState(false);
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const requestMenuRef = useRef(null);

  // جلب الإشعارات باستخدام React Query v5
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    isError: notificationsError,
    refetch: refetchNotifications
  } = useQuery({
    queryKey: ['latestNotifications'],
    queryFn: fetchLatestNotifications,
    enabled: !!currentUser,
    refetchInterval: 60000,
  });

  // استخدام mutation بتنسيق v5
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });

  // معالجة النقر على الإشعار
  const handleNotificationClick = (notification) => {
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }
    
    navigate('/notifications', { state: { selectedNotification: notification.id } });
    setShowNotifications(false);
  };
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

  // حساب عدد الإشعارات غير المقروءة
  const notifications = notificationsData?.data || [];
  const unreadNotifications = notifications.filter(notif => !notif.read_at).length;

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* الشعار - يظهر في الكمبيوتر على اليمين وفي الهاتف على اليسار */}
        <div className="logo-section">
          <Link to="/" className="nav-logo" onClick={handleCloseMenu}>
            <img src="images/logo3.png" alt="Logo" className="logo-image" />
            <img src="images/text.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        {/* القوائم الرئيسية - تظهر في الكمبيوتر فقط */}
        <div className="nav-menu-section">
          <div className="nav-buttons-group">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`} 
              onClick={handleCloseMenu}
            >
              <BsHouseFill className="link-icon" />
              الرئيسية
            </Link>

            <Link 
              to="/properties" 
              className={`nav-link ${isActive('/properties') ? 'active' : ''}`}
              onClick={handleCloseMenu}
            >
              <FaMapMarked className="link-icon" />
              العقارات والمزادات
            </Link>

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

        {/* الأقسام الجانبية - تظهر في الكمبيوتر فقط */}
        <div className="nav-controls-section">
          {currentUser ? (
            <div className="user-controls">
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
                      {notificationsLoading ? (
                        <div className="loading-notifications">جاري التحميل...</div>
                      ) : notificationsError ? (
                        <div className="error-notifications">حدث خطأ في تحميل الإشعارات</div>
                      ) : notifications.length === 0 ? (
                        <div className="empty-notifications">لا توجد إشعارات</div>
                      ) : (
                        notifications.map(notification => (
                          <div 
                            key={notification.id} 
                            className={`notification-item ${notification.read_at ? 'read' : 'unread'}`}
                            onClick={() => handleNotificationClick(notification)}
                          >
                            <div className="notification-content">
                              <h4>{notification.data.title}</h4>
                              <p>{notification.data.body}</p>
                              <span className="notification-time">
                                {new Date(notification.data.created_at).toLocaleString('ar-SA', {
                                  year: 'numeric',
                                  month: 'numeric',
                                  day: 'numeric',
                                  hour: 'numeric',
                                  minute: 'numeric'
                                })}
                              </span>
                            </div>
                          </div>
                        ))
                      )}
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
            <div className="auth-buttons">
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

          {/* أيقونة القائمة الجانبية - تظهر في الهاتف فقط على اليمين */}
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

            {currentUser && (
              <div className="mobile-user-section">
                <Link to="/profile" className="mobile-nav-link" onClick={handleCloseMenu}>
                  <FaUser className="link-icon" />
                  الملف الشخصي
                </Link>

                {isGeneralUser() ? (
                  <Link to="/my-requests" className="mobile-nav-link" onClick={handleCloseMenu}>
                    <FaListAlt className="link-icon" />
                    طلباتي
                  </Link>
                ) : (
                  <Link to="/my-ads" className="mobile-nav-link" onClick={handleCloseMenu}>
                    <FaBriefcase className="link-icon" />
                    إعلاناتي
                  </Link>
                )}

                {(isLandOwner() || isInvestor() || isPropertyOwner()) && (
                  <Link to="/my-offers" className="mobile-nav-link" onClick={handleCloseMenu}>
                    <FaHandshake className="link-icon" />
                    عروضي
                  </Link>
                )}

                <Link to="/my-lands" className="mobile-nav-link" onClick={handleCloseMenu}>
                  <FaHeart className="link-icon" />
                  المفضلة
                </Link>

                <Link to="/settings" className="mobile-nav-link" onClick={handleCloseMenu}>
                  <FaCog className="link-icon" />
                  الإعدادات
                </Link>

                <Link to="/notifications" className="mobile-nav-link" onClick={handleCloseMenu}>
                  <FaBell className="link-icon" />
                  الإشعارات
                  {unreadNotifications > 0 && (
                    <span className="mobile-notification-badge">{unreadNotifications}</span>
                  )}
                </Link>

                <button onClick={handleLogout} className="mobile-nav-link logout-btn">
                  <FaSignOutAlt className="link-icon" />
                  تسجيل خروج
                </button>
              </div>
            )}

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

        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={handleCloseMenu}></div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;