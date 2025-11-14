import React from 'react';
import { Link } from 'react-router-dom';
import { BsHouseFill } from 'react-icons/bs';
import Icons from '../../icons';
import '../../styles/Navbar.css';

/**
 * مكون الشريط التنقل - الجزء المرئي فقط
 */
const NavbarUI = ({
  // الحالات
  currentUser,
  isMobileMenuOpen,
  isScrolled,
  showUserMenu,
  showNotifications,
  notifications,
  notificationsLoading,
  notificationsError,
  unreadNotifications,
  
  // المراجع
  mobileMenuRef,
  userMenuRef,
  notificationsRef,
  
  // الدوال
  handleNotificationClick,
  handleLogout,
  isActive,
  isGeneralUser,
  isLandOwner,
  isPropertyOwner,
  isInvestor,
  handleCloseMenu,
  handleMobileMenuToggle,
  handleCreateRequest,
  setShowNotifications,
  setShowUserMenu,
  
  // الدوال المورودة
  onLoginClick,
  onRegisterClick
}) => {
  
  /**
   * مكون الإشعارات
   */
  const renderNotifications = () => (
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
  );

  /**
   * قائمة المستخدم المنسدلة
   */
  const renderUserDropdown = () => (
    <div className="user-dropdown">
      <Link 
        to="/profile" 
        className="dropdown-item"
        onClick={() => setShowUserMenu(false)}
      >
        <Icons.FaUser className="dropdown-icon" />
        الملف الشخصي
      </Link>
      
      {isGeneralUser() ? (
        <Link 
          to="/interests" 
          className="dropdown-item"
          onClick={() => setShowUserMenu(false)}
        >
          <Icons.FaListAlt className="dropdown-icon" />
          اهتماماتي
        </Link>
      ) : (
        <Link 
          to="/my-ads" 
          className="dropdown-item"
          onClick={() => setShowUserMenu(false)}
        >
          <Icons.FaBriefcase className="dropdown-icon" />
          إعلاناتي
        </Link>
      )}
      
      {(isLandOwner() || isInvestor() || isPropertyOwner()) && (
        <Link 
          to="/interests" 
          className="dropdown-item"
          onClick={() => setShowUserMenu(false)}
        >
          <Icons.FaHandshake className="dropdown-icon" />
          عروضي
        </Link>
      )}
      
      <Link 
        to="/my-lands" 
        className="dropdown-item"
        onClick={() => setShowUserMenu(false)}
      >
        <Icons.FaUser className="dropdown-icon" />
        المفضلة
      </Link>
      
      <hr className="dropdown-divider" />
      
      <button 
        onClick={handleLogout} 
        className="dropdown-item logout-item"
      >
        <Icons.FaUser className="dropdown-icon" />
        تسجيل خروج
      </button>
    </div>
  );

  /**
   * روابط التنقل الرئيسية
   */
  const renderNavLinks = () => (
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
        to="/lands-and-auctions-list" 
        className={`nav-link ${isActive('/lands-and-auctions-list') ? 'active' : ''}`}
        onClick={handleCloseMenu}
      >
        <Icons.FaMapMarked className="link-icon" />
        الاراضي والمزادات
      </Link>

      <button 
        className="nav-link"
        onClick={handleCreateRequest}
      >
        <Icons.FaUser className="link-icon" />
        طلب شراء / تسويق
      </button>
      
      <button 
        className="nav-link"
        onClick={handleCreateRequest}
      >
        <Icons.FaUser className="link-icon" />
        طلب تسويق منتج عقاري عبر شركات المزادات
      </button>
    </div>
  );

  /**
   * قسم المستخدم المسجل
   */
  const renderUserControls = () => (
    <div className="user-controls">
      <div className="notifications-container" ref={notificationsRef}>
        <button 
          className="notification-btn"
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Icons.FaBell className="notification-icon" />
          {unreadNotifications > 0 && (
            <span className="notification-badge">{unreadNotifications}</span>
          )}
        </button>
        
        {showNotifications && renderNotifications()}
      </div>

      <div className="user-menu-container" ref={userMenuRef}>
        <button 
          className="user-profile-btn"
          onClick={() => setShowUserMenu(!showUserMenu)}
        >
          <span className="user-avatar">
            <Icons.FaUser className="avatar-icon" />
          </span>
        </button>
        
        {showUserMenu && renderUserDropdown()}
      </div>
    </div>
  );

  /**
   * أزرار التسجيل والدخول
   */
  const renderAuthButtons = () => (
    <div className="auth-buttons">
      <button 
        className="nav-link register-btn"
        onClick={() => {
          if (typeof onRegisterClick === 'function') onRegisterClick();
        }}
      >
        <Icons.FaUser className="register-icon" />
        <span className="register-text">تسجيل جديد</span>
      </button>
      
      <button 
        className="nav-link login-btn"
        onClick={() => {
          if (typeof onLoginClick === 'function') onLoginClick();
        }}
      >
        <Icons.FaUser className="login-icon" />
        <span className="login-text">تسجيل الدخول</span>
      </button>
    </div>
  );

  /**
   * قسم المستخدم في القائمة الجانبية
   */
  const renderMobileUserSection = () => (
    <div className="mobile-user-section">
      <Link to="/profile" className="mobile-nav-link" onClick={handleCloseMenu}>
        <Icons.FaUser className="link-icon" />
        الملف الشخصي
      </Link>

      {isGeneralUser() ? (
        <Link to="/interests" className="mobile-nav-link" onClick={handleCloseMenu}>
          <Icons.FaListAlt className="link-icon" />
          اهتماماتي
        </Link>
      ) : (
        <Link to="/my-ads" className="mobile-nav-link" onClick={handleCloseMenu}>
          <Icons.FaBriefcase className="link-icon" />
          إعلاناتي
        </Link>
      )}

      {(isLandOwner() || isInvestor() || isPropertyOwner()) && (
        <Link to="/interests" className="mobile-nav-link" onClick={handleCloseMenu}>
          <Icons.FaHandshake className="link-icon" />
          عروضي
        </Link>
      )}

      <Link to="/my-lands" className="mobile-nav-link" onClick={handleCloseMenu}>
        <Icons.FaUser className="link-icon" />
        المفضلة
      </Link>

      <Link to="/notifications" className="mobile-nav-link" onClick={handleCloseMenu}>
        <Icons.FaBell className="link-icon" />
        الإشعارات
        {unreadNotifications > 0 && (
          <span className="mobile-notification-badge">{unreadNotifications}</span>
        )}
      </Link>

      <button onClick={handleLogout} className="mobile-nav-link logout-btn">
        <Icons.FaUser className="link-icon" />
        تسجيل خروج
      </button>
    </div>
  );

  /**
   * قسم المصادقة في القائمة الجانبية
   */
  const renderMobileAuthSection = () => (
    <div className="mobile-auth-section">
      <button 
        className="mobile-nav-link login-btn"
        onClick={() => {
          handleCloseMenu();
          if (typeof onLoginClick === 'function') onLoginClick();
        }}
      >
        <Icons.FaUser className="link-icon" />
        تسجيل الدخول
      </button>
      
      <button 
        className="mobile-nav-link register-btn"
        onClick={() => {
          handleCloseMenu();
          if (typeof onRegisterClick === 'function') onRegisterClick();
        }}
      >
        <Icons.FaUser className="link-icon" />
        تسجيل جديد
      </button>
    </div>
  );

  /**
   * القائمة الجانبية للهاتف
   */
  const renderMobileSidebar = () => (
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
            to="/lands-and-auctions-list" 
            className={`mobile-nav-link ${isActive('/lands-and-auctions-list') ? 'active' : ''}`}
            onClick={handleCloseMenu}
          >
            <Icons.FaMapMarked className="link-icon" />
            الاراضي والمزادات
          </Link>

          <button 
            className="mobile-nav-link"
            onClick={handleCreateRequest}
          >
            <Icons.FaUser className="link-icon" />
            طلب شراء / تسويق
          </button>
          
          <button 
            className="mobile-nav-link"
            onClick={handleCreateRequest}
          >
            <Icons.FaUser className="link-icon" />
            طلب تسويق منتج عقاري عبر شركات المزادات
          </button>
        </div>

        {currentUser && renderMobileUserSection()}
        {!currentUser && renderMobileAuthSection()}
      </div>
    </div>
  );

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* الشعار */}
        <div className="logo-section">
          <Link to="/" className="nav-logo" onClick={handleCloseMenu}>
            <img src="images/logo3.png" alt="Logo" className="logo-image" />
            <img src="images/text.png" alt="Logo" className="logo-image" />
          </Link>
        </div>

        {/* القوائم الرئيسية - للكمبيوتر */}
        <div className="nav-menu-section">
          {renderNavLinks()}
        </div>

        {/* الأقسام الجانبية - للكمبيوتر */}
        <div className="nav-controls-section">
          {currentUser ? renderUserControls() : renderAuthButtons()}

          {/* أيقونة القائمة الجانبية - للهاتف */}
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
        {renderMobileSidebar()}

        {/* طبقة التعتيم للهاتف */}
        {isMobileMenuOpen && (
          <div className="mobile-overlay" onClick={handleCloseMenu}></div>
        )}
      </div>
    </nav>
  );
};

// تصدير افتراضي
export default NavbarUI;