import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchLatestNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../../utils/notificationService';

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
  const [notificationPage, setNotificationPage] = useState(1);
  
  // مراجع DOM
  const mobileMenuRef = useRef(null);
  const userMenuRef = useRef(null);
  const notificationsRef = useRef(null);
  const notificationSoundRef = useRef(null);

  // تهيئة صوت الإشعار
  useEffect(() => {
    notificationSoundRef.current = new Audio('/sounds/notification.mp3');
    notificationSoundRef.current.volume = 0.3; // ضبط مستوى الصوت
  }, []);

  // جلب الإشعارات باستخدام React Query v5 مع الباجينيشين
  const {
    data: notificationsData,
    isLoading: notificationsLoading,
    isError: notificationsError,
    refetch: refetchNotifications
  } = useQuery({
    queryKey: ['latestNotifications', notificationPage],
    queryFn: () => fetchLatestNotifications(notificationPage),
    enabled: !!currentUser,
    refetchInterval: 30000, // إعادة الجلب كل 30 ثانية
  });

  // Mutation لتحديد الإشعار كمقروء
  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });

  // Mutation لتحديد جميع الإشعارات كمقروءة
  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
    },
  });

  // تشغيل صوت الإشعار عند وصول إشعار جديد
  useEffect(() => {
    if (notificationsData?.data && notificationsData.data.length > 0) {
      const hasNewNotification = notificationsData.data.some(notif => 
        !notif.read_at && 
        new Date(notif.created_at) > new Date(Date.now() - 30000) // إشعارات في آخر 30 ثانية
      );
      
      if (hasNewNotification && notificationSoundRef.current) {
        notificationSoundRef.current.play().catch(error => {
          console.log('تعذر تشغيل صوت الإشعار:', error);
        });
      }
    }
  }, [notificationsData]);

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
   * تحديد جميع الإشعارات كمقروءة
   */
  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  /**
   * تحميل المزيد من الإشعارات
   */
  const handleLoadMoreNotifications = () => {
    if (notificationsData?.next_page_url) {
      setNotificationPage(prev => prev + 1);
    }
  };

  /**
   * تحديث الإشعارات
   */
  const handleRefreshNotifications = () => {
    refetchNotifications();
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
    notificationPage,
    
    // المراجع
    mobileMenuRef,
    userMenuRef,
    notificationsRef,
    
    // الدوال
    handleNotificationClick,
    handleMarkAllAsRead,
    handleLoadMoreNotifications,
    handleRefreshNotifications,
    handleLogout,
    isActive,
    ...userTypeCheckers,
    handleCloseMenu,
    handleMobileMenuToggle,
    handleCreateRequest,
    setShowNotifications,
    setShowUserMenu,
    setNotificationPage,
    
    // الدوال المورودة
    onLoginClick,
    onRegisterClick
  };
};

export default useNavbarLogic;