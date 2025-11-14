import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLatestNotifications, markNotificationAsRead } from '../../utils/notificationService';

/**
 * Custom hook للتعامل مع حالة الشريط التنقل والتفاعلات
 */
export const useNavbarLogic = (onLoginClick, onRegisterClick) => {
  const { currentUser, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  // حالات المكون
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // مراجع DOM
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);

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
    refetchInterval: 60000, // إعادة الجلب كل دقيقة
  });

  // Mutation لتحديد الإشعار كمقروء
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });

  /**
   * معالجة النقر على الإشعار
   */
  const handleNotificationClick = (notification) => {
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }
    
    navigate('/notifications', { state: { selectedNotification: notification.id } });
    setShowNotifications(false);
  };

 /**
 * تسجيل خروج المستخدم والتوجيه إلى الصفحة الرئيسية
 */
const handleLogout = async () => {
  try {
    await logout();
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowNotifications(false);
    
    // التوجيه إلى الصفحة الرئيسية بعد تسجيل الخروج
    navigate('/');
  } catch (error) {
    console.error('Error during logout:', error);
    // حتى في حالة الخطأ، نوجه إلى الصفحة الرئيسية
    navigate('/');
  }
};

  /**
   * التحقق من المسار النشط
   */
  const isActive = (path) => location.pathname === path;

  /**
   * التحقق من نوع المستخدم
   */
  const userTypeCheckers = {
    isGeneralUser: () => currentUser?.user_type === 'مستخدم عام',
    isLandOwner: () => currentUser?.user_type === 'مالك أرض',
    isPropertyOwner: () => currentUser?.user_type === 'وكيل عقارات',
    isInvestor: () => currentUser?.user_type === 'شركة مزادات',
  };

  /**
   * إغلاق جميع القوائم
   */
  const handleCloseMenu = () => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
    setShowNotifications(false);
  };

  /**
   * تبديل القائمة الجانبية للهاتف
   */
  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  /**
   * معالجة إنشاء طلب جديد
   */
  const handleCreateRequest = () => {
    if (!currentUser) {
      onLoginClick();
      return;
    }
    navigate('/land-requests');
    setIsMobileMenuOpen(false);
  };

  // حساب عدد الإشعارات غير المقروءة
  const notifications = notificationsData?.data || [];
  const unreadNotifications = notifications.filter(notif => !notif.read_at).length;

  // تأثيرات للتعامل مع النقر خارج القوائم ومفاتيح الإدخال
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
    };

    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        handleCloseMenu();
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

  // تأثير للكشف عن التمرير
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return {
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
    ...userTypeCheckers,
    handleCloseMenu,
    handleMobileMenuToggle,
    handleCreateRequest,
    setShowNotifications,
    setShowUserMenu,
    
    // الدوال المورودة
    onLoginClick,
    onRegisterClick
  };
};

// تصدير افتراضي للتوافق
export default useNavbarLogic;