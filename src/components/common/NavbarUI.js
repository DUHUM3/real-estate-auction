import React from 'react';
import { Link } from 'react-router-dom';
import { BsHouseFill } from 'react-icons/bs';
import Icons from '../../icons';

const NavbarUI = ({
  currentUser,
  isMobileMenuOpen,
  isScrolled,
  showUserMenu,
  showNotifications,
  notifications,
  notificationsLoading,
  notificationsError,
  unreadNotifications,
  mobileMenuRef,
  userMenuRef,
  notificationsRef,
  handleNotificationClick,
  handleLogout,
  isActive,
  isGeneralUser,
  isLandOwner,
  isPropertyOwner,
  isCommercialEntity,
  isInvestor,
  handleCloseMenu,
  handleMobileMenuToggle,
  setShowNotifications,
  setShowUserMenu,
  onLoginClick,
  onRegisterClick
}) => {
  // اللون الأساسي للعلامة التجارية
  const brandColor = '#53a1dd';
  
  const isLegalAgent = () => currentUser?.user_type === 'وكيل شرعي';

  // مكون الإشعارات
  const renderNotifications = () => (
    <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-l from-gray-50 to-white">
        <h3 className="text-base font-semibold mb-1" style={{ color: brandColor }}>الإشعارات</h3>
        <span className="text-xs text-gray-500">{unreadNotifications} غير مقروء</span>
      </div>
      <div className="max-h-96 overflow-y-auto custom-scrollbar">
        {notificationsLoading ? (
          <div className="p-6 text-center text-gray-500">
            <div className="inline-block w-6 h-6 border-2 border-gray-300 border-t-current rounded-full animate-spin mb-2" style={{ borderTopColor: brandColor }}></div>
            <p>جاري التحميل...</p>
          </div>
        ) : notificationsError ? (
          <div className="p-6 text-center text-red-500">
            <Icons.FaUser className="text-2xl mb-2 mx-auto opacity-50" />
            <p>حدث خطأ في تحميل الإشعارات</p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <Icons.FaBell className="text-3xl mb-2 mx-auto opacity-30" />
            <p>لا توجد إشعارات</p>
          </div>
        ) : (
          notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
                !notification.read_at ? 'bg-blue-50/50 border-r-4' : ''
              }`}
              style={{ borderRightColor: !notification.read_at ? brandColor : 'transparent' }}
              onClick={() => handleNotificationClick(notification)}
            >
              <h4 className="text-sm font-medium text-gray-800 mb-1 leading-relaxed">{notification.data.title}</h4>
              <p className="text-xs text-gray-600 mb-2 leading-relaxed">{notification.data.body}</p>
              <span className="text-xs text-gray-400">
                {new Date(notification.data.created_at).toLocaleString('ar-SA', {
                  year: 'numeric',
                  month: 'numeric',
                  day: 'numeric',
                  hour: 'numeric',
                  minute: 'numeric'
                })}
              </span>
            </div>
          ))
        )}
      </div>
      <Link
        to="/notifications"
        className="block text-center p-3 text-sm font-medium transition-all duration-200 hover:bg-blue-50 border-t border-gray-100"
        style={{ color: brandColor }}
        onClick={() => setShowNotifications(false)}
      >
        عرض جميع الإشعارات
      </Link>
    </div>
  );

  // قائمة المستخدم المنسدلة
  const renderUserDropdown = () => (
    <div className="absolute top-full left-0 mt-2 min-w-64 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-gradient-to-l from-gray-50 to-white">
        <p className="text-sm font-semibold text-gray-800">مرحباً بك</p>
        <p className="text-xs text-gray-500 mt-1">{currentUser?.full_name || 'المستخدم'}</p>
      </div>
      
      <div className="py-2">
        <Link
          to="/profile"
          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
          onClick={() => setShowUserMenu(false)}
        >
          <Icons.FaUser className="ml-3 text-base text-gray-400 group-hover:text-current transition-colors" style={{ '--tw-text-opacity': 1 }} />
          <span className="group-hover:translate-x-1 transition-transform" style={{ color: 'inherit' }}>الملف الشخصي</span>
        </Link>

        {isGeneralUser() ? (
          <Link
            to="/interests"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
            onClick={() => setShowUserMenu(false)}
          >
            <Icons.FaListAlt className="ml-3 text-base text-gray-400 group-hover:text-current transition-colors" />
            <span className="group-hover:translate-x-1 transition-transform">اهتماماتي بالاراضي</span>
          </Link>
        ) : (
          <Link
            to="/my-ads"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
            onClick={() => setShowUserMenu(false)}
          >
            <Icons.FaBriefcase className="ml-3 text-base text-gray-400 group-hover:text-current transition-colors" />
            <span className="group-hover:translate-x-1 transition-transform">{isInvestor() ? "مزاداتي" : "إعلاناتي"}</span>
          </Link>
        )}

        {!isInvestor() && (
          <Link
            to="/my-requests"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
            onClick={() => setShowUserMenu(false)}
          >
            <Icons.FaList className="ml-3 text-base text-gray-400 group-hover:text-current transition-colors" />
            <span className="group-hover:translate-x-1 transition-transform">طلباتي</span>
          </Link>
        )}

        {(isLandOwner() || isPropertyOwner() || isLegalAgent() || isCommercialEntity()) && (
          <Link
            to="/interests"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
            onClick={() => setShowUserMenu(false)}
          >
            <Icons.FaHandshake className="ml-3 text-base text-gray-400 group-hover:text-current transition-colors" />
            <span className="group-hover:translate-x-1 transition-transform">اهتماماتي بالاراضي</span>
          </Link>
        )}

        <Link
          to="/my-lands"
          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 group"
          onClick={() => setShowUserMenu(false)}
        >
          <Icons.FaUser className="ml-3 text-base text-gray-400 group-hover:text-current transition-colors" />
          <span className="group-hover:translate-x-1 transition-transform">المفضلة</span>
        </Link>
      </div>

      <div className="border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-red-600 transition-all duration-200 hover:bg-red-50 group"
        >
          <Icons.FaUser className="ml-3 text-base opacity-70 group-hover:opacity-100 transition-opacity" />
          <span className="group-hover:translate-x-1 transition-transform">تسجيل خروج</span>
        </button>
      </div>
    </div>
  );

  // روابط التنقل الرئيسية
  const renderNavLinks = () => (
    <div className="hidden xl:flex items-center gap-2">
      <Link
        to="/"
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${
          isActive('/') 
            ? 'font-semibold bg-blue-50' 
            : 'hover:bg-blue-50/50'
        }`}
        style={{ color: brandColor }}
        onClick={handleCloseMenu}
      >
        <BsHouseFill className="ml-2 text-base" />
        الرئيسية
      </Link>

      <Link
        to="/lands-and-auctions-list"
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${
          isActive('/lands-and-auctions-list')
            ? 'font-semibold bg-blue-50'
            : 'hover:bg-blue-50/50'
        }`}
        style={{ color: brandColor }}
        onClick={handleCloseMenu}
      >
        <Icons.FaMapMarked className="ml-2 text-base" />
        الاراضي والمزادات
      </Link>

      <Link
        to="/purchase-requests"
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${
          isActive('/purchase-requests')
            ? 'font-semibold bg-blue-50'
            : 'hover:bg-blue-50/50'
        }`}
        style={{ color: brandColor }}
        onClick={handleCloseMenu}
      >
        <Icons.FaUser className="ml-2 text-base" />
        طلبات الشراء و الاستثمار
      </Link>

      <Link
        to={currentUser ? "/create-marketing-request" : "#"}
        className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 no-underline ${
          isActive('/create-marketing-request')
            ? 'font-semibold bg-blue-50'
            : 'hover:bg-blue-50/50'
        }`}
        style={{ color: brandColor }}
        onClick={(e) => {
          if (!currentUser) {
            e.preventDefault();
            onLoginClick();
          }
          handleCloseMenu();
        }}
      >
        <Icons.FaBullhorn className="ml-2 text-base" />
        طلب تسويق منتج عقاري عبر شركات المزادات
      </Link>
    </div>
  );

  // قسم المستخدم المسجل - مخفي في الشاشات الصغيرة
  const renderUserControls = () => (
    <div className="hidden md:flex items-center gap-3">
      {/* أيقونة الإشعارات */}
      <div className="relative" ref={notificationsRef}>
        <button
          className="relative p-2.5 rounded-full transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ '--tw-ring-color': brandColor }}
          onClick={() => setShowNotifications(!showNotifications)}
          aria-label="الإشعارات"
        >
          <Icons.FaBell className="text-xl" style={{ color: brandColor }} />
          {unreadNotifications > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-5 h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full shadow-lg animate-pulse">
              {unreadNotifications > 9 ? "9+" : unreadNotifications}
            </span>
          )}
        </button>
        {showNotifications && renderNotifications()}
      </div>

      {/* أيقونة المستخدم */}
      <div className="relative" ref={userMenuRef}>
        <button
          className="flex items-center p-1 rounded-full transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
          style={{ '--tw-ring-color': brandColor }}
          onClick={() => setShowUserMenu(!showUserMenu)}
          aria-label="قائمة المستخدم"
        >
          <span 
            className="flex items-center justify-center w-10 h-10 rounded-full font-bold text-white shadow-md transition-transform duration-200 hover:scale-105"
            style={{ backgroundColor: brandColor }}
          >
            <Icons.FaUser className="text-base" />
          </span>
        </button>
        {showUserMenu && renderUserDropdown()}
      </div>
    </div>
  );

  // أزرار التسجيل والدخول
  const renderAuthButtons = () => (
    <div className="hidden xl:flex items-center gap-3">
      <button
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-full border-2 transition-all duration-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ 
          color: brandColor, 
          borderColor: brandColor,
          '--tw-ring-color': brandColor 
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = brandColor;
          e.currentTarget.style.color = 'white';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent';
          e.currentTarget.style.color = brandColor;
        }}
        onClick={onRegisterClick}
      >
        <Icons.FaUser className="text-sm" />
        إنشاء حساب جديد
      </button>

      <button
        className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white rounded-full border-2 shadow-md transition-all duration-200 hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
        style={{ 
          backgroundColor: brandColor, 
          borderColor: brandColor,
          '--tw-ring-color': brandColor 
        }}
        onClick={onLoginClick}
      >
        <Icons.FaUser className="text-sm" />
        تسجيل الدخول
      </button>
    </div>
  );

  // قسم المستخدم في القائمة الجانبية
  const renderMobileUserSection = () => (
    <div className="px-4 space-y-1">
      <Link
        to="/profile"
        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
        style={{ '--hover-color': brandColor }}
        onClick={handleCloseMenu}
      >
        <Icons.FaUser className="ml-3 text-base text-gray-400 group-hover:text-current" style={{ color: 'inherit' }} />
        <span className="group-hover:text-current" style={{ '--tw-text-opacity': 1 }}>الملف الشخصي</span>
      </Link>

      {isGeneralUser() ? (
        <Link
          to="/interests"
          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
          onClick={handleCloseMenu}
        >
          <Icons.FaListAlt className="ml-3 text-base text-gray-400" />
          اهتماماتي بالاراضي
        </Link>
      ) : (
        <Link
          to="/my-ads"
          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
          onClick={handleCloseMenu}
        >
          <Icons.FaBriefcase className="ml-3 text-base text-gray-400" />
          {isInvestor() ? "مزاداتي" : "إعلاناتي"}
        </Link>
      )}

      {!isInvestor() && (
        <Link
          to="/my-requests"
          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
          onClick={handleCloseMenu}
        >
          <Icons.FaList className="ml-3 text-base text-gray-400" />
          طلباتي
        </Link>
      )}

      {(isLandOwner() || isPropertyOwner() || isLegalAgent() || isCommercialEntity()) && (
        <Link
          to="/interests"
          className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
          onClick={handleCloseMenu}
        >
          <Icons.FaHandshake className="ml-3 text-base text-gray-400" />
          اهتماماتي بالاراضي
        </Link>
      )}

      <Link
        to="/my-lands"
        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
        onClick={handleCloseMenu}
      >
        <Icons.FaUser className="ml-3 text-base text-gray-400" />
        المفضلة
      </Link>

      <Link
        to="/notifications"
        className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 hover:bg-gray-50 rounded-lg group"
        onClick={handleCloseMenu}
      >
        <Icons.FaBell className="ml-3 text-base text-gray-400" />
        الإشعارات
        {unreadNotifications > 0 && (
          <span className="mr-auto flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
            {unreadNotifications}
          </span>
        )}
      </Link>

      <button
        onClick={handleLogout}
        className="flex items-center w-full px-4 py-3 text-red-600 transition-all duration-200 hover:bg-red-50 rounded-lg group"
      >
        <Icons.FaUser className="ml-3 text-base opacity-70" />
        تسجيل خروج
      </button>
    </div>
  );

  // قسم المصادقة في القائمة الجانبية
  const renderMobileAuthSection = () => (
    <div className="px-4 space-y-3">
      <button
        className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-semibold text-white rounded-xl transition-all duration-200 shadow-md hover:shadow-lg hover:opacity-90"
        style={{ backgroundColor: brandColor }}
        onClick={() => {
          handleCloseMenu();
          onLoginClick();
        }}
      >
        <Icons.FaUser className="ml-2 text-base" />
        تسجيل الدخول
      </button>

      <button
        className="flex items-center justify-center w-full px-4 py-3.5 text-sm font-semibold bg-white border-2 rounded-xl transition-all duration-200 hover:bg-blue-50"
        style={{ color: brandColor, borderColor: brandColor }}
        onClick={() => {
          handleCloseMenu();
          onRegisterClick();
        }}
      >
        <Icons.FaUser className="ml-2 text-base" />
        إنشاء حساب جديد
      </button>
    </div>
  );

  // القائمة الجانبية للهاتف - تنزلق من اليمين (RTL)
  const renderMobileSidebar = () => (
    <div
      className={`fixed top-0 right-0 h-screen w-80 max-w-full bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out ${
        isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
      ref={mobileMenuRef}
      dir="rtl"
    >
      {/* رأس القائمة الجانبية */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-l from-gray-50 to-white">
        <h3 className="text-lg font-bold text-gray-800">القائمة الرئيسية</h3>
        <button
          className="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 hover:bg-red-50 hover:text-red-500 focus:outline-none focus:ring-2 focus:ring-red-200"
          style={{ color: brandColor }}
          onClick={handleCloseMenu}
          aria-label="إغلاق القائمة"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* محتوى القائمة */}
      <div className="overflow-y-auto h-full pb-32 custom-scrollbar">
        {/* روابط التنقل الرئيسية */}
        <div className="py-4">
          <Link
            to="/"
            className={`flex items-center px-6 py-3.5 text-base font-medium transition-all duration-200 border-r-4 ${
              isActive('/') 
                ? 'bg-blue-50 border-current' 
                : 'text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200'
            }`}
            style={{ color: isActive('/') ? brandColor : undefined, borderColor: isActive('/') ? brandColor : undefined }}
            onClick={handleCloseMenu}
          >
            <BsHouseFill className="ml-3 text-lg" />
            الرئيسية
          </Link>

          <Link
            to="/lands-and-auctions-list"
            className={`flex items-center px-6 py-3.5 text-base font-medium transition-all duration-200 border-r-4 ${
              isActive('/lands-and-auctions-list') 
                ? 'bg-blue-50 border-current' 
                : 'text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200'
            }`}
            style={{ color: isActive('/lands-and-auctions-list') ? brandColor : undefined, borderColor: isActive('/lands-and-auctions-list') ? brandColor : undefined }}
            onClick={handleCloseMenu}
          >
            <Icons.FaMapMarked className="ml-3 text-lg" />
            الاراضي والمزادات
          </Link>

          <Link
            to="/purchase-requests"
            className={`flex items-center px-6 py-3.5 text-base font-medium transition-all duration-200 border-r-4 ${
              isActive('/purchase-requests') 
                ? 'bg-blue-50 border-current' 
                : 'text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200'
            }`}
            style={{ color: isActive('/purchase-requests') ? brandColor : undefined, borderColor: isActive('/purchase-requests') ? brandColor : undefined }}
            onClick={handleCloseMenu}
          >
            <Icons.FaUser className="ml-3 text-lg" />
            طلبات الشراء و الاستثمار
          </Link>

          <Link
            to={currentUser ? "/create-marketing-request" : "#"}
            className={`flex items-center px-6 py-3.5 text-base font-medium transition-all duration-200 border-r-4 ${
              isActive('/create-marketing-request') 
                ? 'bg-blue-50 border-current' 
                : 'text-gray-700 border-transparent hover:bg-gray-50 hover:border-gray-200'
            }`}
            style={{ color: isActive('/create-marketing-request') ? brandColor : undefined, borderColor: isActive('/create-marketing-request') ? brandColor : undefined }}
            onClick={(e) => {
              if (!currentUser) {
                e.preventDefault();
                onLoginClick();
              }
              handleCloseMenu();
            }}
          >
            <Icons.FaBullhorn className="ml-3 text-lg" />
            طلب تسويق منتج عقاري لشركات المزاد
          </Link>
        </div>

        {/* قسم المستخدم */}
        {currentUser && (
          <div className="border-t border-gray-100 pt-4">
            <p className="px-6 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">حسابي</p>
            {renderMobileUserSection()}
          </div>
        )}

        {/* قسم المصادقة */}
        {!currentUser && (
          <div className="border-t border-gray-100 pt-6">
            {renderMobileAuthSection()}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* شريط التنقل الرئيسي - دائماً أبيض */}
      <nav
        className="fixed top-0 left-0 w-full z-40 bg-white shadow-md transition-shadow duration-300"
        style={{ 
          padding: '0.75rem 1.5rem',
          boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}
        dir="rtl"
      >
        <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
          {/* الشعار - دائماً باللون الأزرق */}
          <Link 
            to="/" 
            className="flex items-center gap-3 transition-all duration-200 hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg"
            style={{ '--tw-ring-color': brandColor }}
            onClick={handleCloseMenu}
          >
            <img
              src="/images/logo3.webp"
              alt="Logo"
              className="h-8 w-auto"
              style={{ 
                filter: 'brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(450%) hue-rotate(166deg) brightness(92%) contrast(89%)'
              }}
            />
            <img
              src="/images/text.webp"
              alt="Logo Text"
  className="w-auto h-8 sm:h-8 md:h-10"
              style={{ 
                filter: 'brightness(0) saturate(100%) invert(58%) sepia(52%) saturate(450%) hue-rotate(166deg) brightness(92%) contrast(89%)'
              }}
            />
          </Link>

          {/* القوائم الرئيسية - للكمبيوتر */}
          {renderNavLinks()}

          {/* الأقسام الجانبية */}
          <div className="flex items-center gap-3">
            {currentUser ? renderUserControls() : renderAuthButtons()}

            {/* أيقونة القائمة الجانبية - تظهر في xl وأصغر */}
            <button
              className="xl:hidden flex flex-col justify-center items-center w-10 h-10 rounded-lg transition-all duration-200 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ '--tw-ring-color': brandColor }}
              onClick={handleMobileMenuToggle}
              aria-label="فتح القائمة"
              aria-expanded={isMobileMenuOpen}
            >
              <span 
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}
                style={{ backgroundColor: brandColor }}
              ></span>
              <span 
                className={`block w-5 h-0.5 rounded-full my-1 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-0' : ''}`}
                style={{ backgroundColor: brandColor }}
              ></span>
              <span 
                className={`block w-5 h-0.5 rounded-full transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}
                style={{ backgroundColor: brandColor }}
              ></span>
            </button>
          </div>
        </div>
      </nav>

      {/* القائمة الجانبية */}
      {renderMobileSidebar()}

      {/* طبقة التعتيم - تظهر من اليمين */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleCloseMenu}
        aria-hidden="true"
      />

      {/* الأنماط المخصصة */}
      <style jsx>{`
        .no-underline {
          text-decoration: none !important;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(83, 161, 221, 0.2);
          border-radius: 3px;
          transition: background 0.3s ease;
        }
        
        .custom-scrollbar:hover::-webkit-scrollbar-thumb {
          background: rgba(83, 161, 221, 0.4);
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(83, 161, 221, 0.6);
        }
        
        /* Firefox scrollbar */
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(83, 161, 221, 0.2) transparent;
        }
        
        .custom-scrollbar:hover {
          scrollbar-color: rgba(83, 161, 221, 0.4) transparent;
        }

        /* تحسينات الوصول */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </>
  );
};

export default NavbarUI;