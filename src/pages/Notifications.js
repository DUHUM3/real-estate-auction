import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../utils/notificationService';
import { FaBell, FaCheckCircle, FaExclamationCircle, FaSync, FaEye, FaEyeSlash, FaChevronRight, FaTimes, FaBars, FaFilter, FaArrowRight, FaCircle } from 'react-icons/fa';

function Notifications() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list');
  
  const { 
    data: notificationsData, 
    isLoading, 
    isError, 
    error,
    refetch
  } = useQuery({
    queryKey: ['allNotifications', currentPage],
    queryFn: () => fetchAllNotifications(currentPage)
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
      queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
    },
  });

  useEffect(() => {
    if (location.state?.selectedNotification) {
      setSelectedNotification(location.state.selectedNotification);
      if (window.innerWidth < 1024) {
        setViewMode('detail');
      }
      
      setTimeout(() => {
        const element = document.getElementById(`notification-${location.state.selectedNotification}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [location.state, notificationsData]);

  useEffect(() => {
    // في الهواتف، نعرض القائمة افتراضياً
    if (window.innerWidth < 1024) {
      setViewMode('list');
    }
  }, []);

  const filterNotifications = () => {
    if (!notificationsData?.data) return [];
    
    const notifications = notificationsData.data;
    
    switch (activeTab) {
      case 'unread':
        return notifications.filter(notification => !notification.read_at);
      case 'read':
        return notifications.filter(notification => notification.read_at);
      case 'all':
      default:
        return notifications;
    }
  };

  const handleNotificationClick = (notification) => {
    setSelectedNotification(notification.id);
    
    if (!notification.read_at) {
      markAsReadMutation.mutate(notification.id);
    }
    
    // في الهواتف، ننتقل إلى عرض التفاصيل
    if (window.innerWidth < 1024) {
      setViewMode('detail');
      setIsSidebarOpen(false);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleLoadMore = () => {
    if (notificationsData?.next_page_url) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ar-SA', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `قبل ${diffMins} دقيقة`;
    } else if (diffHours < 24) {
      return `قبل ${diffHours} ساعة`;
    } else if (diffDays < 7) {
      return `قبل ${diffDays} يوم`;
    } else {
      return date.toLocaleDateString('ar-SA');
    }
  };

  const filteredNotifications = filterNotifications();
  const selectedNotificationData = filteredNotifications.find(
    notification => notification.id === selectedNotification
  );

  const unreadCount = notificationsData?.data?.filter(n => !n.read_at).length || 0;

  return (

    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header ثابت مع padding مناسب */}
      <header className="fixed top-12 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-20">
        <div className="h-full flex flex-col justify-between px-4 pt-5 pb-3">
          {/* التبويبات */}
          <div className="tabs-container">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button 
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'all' 
                    ? 'bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('all')}
              >
                <span>الكل</span>
                {notificationsData?.data && (
                  <span className={`mr-2 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'all' 
                      ? 'bg-white/30' 
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {notificationsData.data.length}
                  </span>
                )}
              </button>
              
              <button 
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'unread' 
                    ? 'bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('unread')}
              >
                <span>غير مقروءة</span>
                {unreadCount > 0 && (
                  <span className={`mr-2 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'unread' 
                      ? 'bg-white/30' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {unreadCount}
                  </span>
                )}
              </button>
              
              <button 
                className={`flex items-center px-4 py-2 rounded-xl transition-all duration-200 flex-shrink-0 ${
                  activeTab === 'read' 
                    ? 'bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white shadow-md' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('read')}
              >
                <span>مقروءة</span>
                {notificationsData?.data && (
                  <span className={`mr-2 text-xs px-2 py-0.5 rounded-full ${
                    activeTab === 'read' 
                      ? 'bg-white/30' 
                      : 'bg-gray-300 text-gray-700'
                  }`}>
                    {notificationsData.data.filter(n => n.read_at).length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* المحتوى الرئيسي مع margin-top لعدم التداخل مع الهيدر */}
      <main className="mt-40 px-4 pb-6">
        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="flex min-h-[calc(100vh-200px)]">
                {/* قائمة الإشعارات */}
                <div className="w-2/5 border-r border-gray-200 flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <button 
                      className="w-full px-4 py-3 bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-200 hover:scale-[1.02]"
                      onClick={handleMarkAllAsRead}
                      disabled={markAllAsReadMutation.isLoading}
                    >
                      <FaCheckCircle className="ml-2" />
                      تحديد الكل كمقروء
                    </button>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto">
                    {renderNotificationsList()}
                  </div>
                </div>
                
                {/* تفاصيل الإشعار */}
                <div className="w-3/5 flex flex-col">
                  <div className="flex-1 overflow-y-auto">
                    {renderNotificationDetails()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Mobile View */}
        <div className="lg:hidden">
          {/* زر تحديد الكل كمقروء في الهواتف */}
          <div className="mb-4">
            <button 
              className="w-full px-4 py-3 bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white rounded-xl flex items-center justify-center hover:shadow-lg transition-all duration-200"
              onClick={handleMarkAllAsRead}
              disabled={markAllAsReadMutation.isLoading}
            >
              <FaCheckCircle className="ml-2" />
              تحديد جميع الإشعارات كمقروءة
            </button>
          </div>
          
          {/* عرض حسب النمط المحدد */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden min-h-[calc(100vh-220px)]">
            {viewMode === 'list' ? renderNotificationsList() : renderNotificationDetails()}
          </div>
        </div>
      </main>
    </div>
  );

  // دالة لعرض قائمة الإشعارات
  function renderNotificationsList() {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px]">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-[#53a1dd] border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="mt-4 text-gray-600">جاري تحميل الإشعارات...</p>
        </div>
      );
    }

    if (isError) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <FaExclamationCircle className="text-red-500 text-3xl" />
          </div>
          <p className="text-red-600 font-medium mb-2 text-center">حدث خطأ في تحميل الإشعارات</p>
          <p className="text-gray-500 text-sm text-center mb-4">{error.message}</p>
          <button 
            className="px-5 py-2.5 bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white rounded-xl hover:shadow-md transition-all duration-200"
            onClick={handleRefresh}
          >
            إعادة المحاولة
          </button>
        </div>
      );
    }

    if (filteredNotifications.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] p-6">
          <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mb-4">
            <FaBell className="text-gray-400 text-3xl" />
          </div>
          <h3 className="text-gray-600 font-medium mb-1 text-center">لا توجد إشعارات</h3>
          <p className="text-gray-400 text-sm text-center mb-6">
            {activeTab === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 
             activeTab === 'read' ? 'لا توجد إشعارات مقروءة' : 
             'سيظهر هنا جميع إشعاراتك'}
          </p>
          {/* <button 
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200"
            onClick={handleRefresh}
          >
            تحديث القائمة
          </button> */}
        </div>
      );
    }

    return (
      <div className="divide-y divide-gray-100">
        {filteredNotifications.map(notification => (
          <div 
            id={`notification-${notification.id}`}
            key={notification.id} 
            className={`p-4 cursor-pointer transition-all duration-200 group ${
              selectedNotification === notification.id 
                ? 'bg-gradient-to-r from-blue-50 to-white' 
                : 'hover:bg-gray-50'
            } ${!notification.read_at ? 'bg-gray-50/50' : ''}`}
            onClick={() => handleNotificationClick(notification)}
          >
            <div className="flex items-start gap-3">
              {/* أيقونة الحالة */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                !notification.read_at 
                  ? 'bg-gradient-to-br from-[#53a1dd] to-[#6ab0e5]' 
                  : 'bg-gray-100'
              }`}>
                {!notification.read_at ? (
                  <FaEyeSlash className="text-white" />
                ) : (
                  <FaEye className="text-gray-500" />
                )}
              </div>
              
              {/* محتوى الإشعار */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h3 className={`font-medium truncate ${!notification.read_at ? 'text-gray-900 font-semibold' : 'text-gray-700'}`}>
                    {notification.data.title}
                  </h3>
                  {window.innerWidth < 1024 && (
                    <FaArrowRight className="text-gray-300 group-hover:text-gray-400 transition-colors flex-shrink-0 mt-1" />
                  )}
                </div>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
                  {notification.data.body}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    {window.innerWidth < 1024 
                      ? formatShortDate(notification.data.created_at)
                      : formatDate(notification.data.created_at)
                    }
                  </span>
                  
                  <div className="flex items-center gap-2">
                    {!notification.read_at && (
                      <span className="flex items-center gap-1 text-xs text-[#53a1dd] font-medium">
                        <FaCircle className="text-xs" />
                        جديد
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {notificationsData?.next_page_url && (
          <div className="p-4 text-center">
            <button 
              className="px-6 py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-xl hover:shadow-md hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 w-full max-w-xs border border-gray-200"
              onClick={handleLoadMore}
              disabled={isLoading}
            >
              {isLoading ? 'جاري التحميل...' : 'تحميل المزيد'}
            </button>
          </div>
        )}
      </div>
    );
  }

  // دالة لعرض تفاصيل الإشعار
  function renderNotificationDetails() {
    if (!selectedNotificationData) {
      return (
        <div className="flex flex-col items-center justify-center h-full min-h-[500px] p-6">
          <div className="w-32 h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-full flex items-center justify-center mb-6">
            <FaBell className="text-gray-300 text-5xl" />
          </div>
          <h3 className="text-gray-500 font-medium text-lg mb-2 text-center">لم يتم اختيار إشعار</h3>
          <p className="text-gray-400 text-sm text-center mb-6 max-w-sm">
            اضغط على أي إشعار من القائمة لرؤية تفاصيله الكاملة هنا
          </p>
          {window.innerWidth < 1024 && (
            <button 
              onClick={() => setViewMode('list')}
              className="px-6 py-3 bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              عرض قائمة الإشعارات
            </button>
          )}
        </div>
      );
    }

    return (
      <div className="h-full flex flex-col">
        {/* شريط العنوان */}
        <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
          {window.innerWidth < 1024 && (
            <button 
              onClick={() => setViewMode('list')}
              className="flex items-center text-gray-600 hover:text-gray-800 mb-3 transition-colors"
            >
              <FaChevronRight className="ml-1" />
              <span>رجوع للقائمة</span>
            </button>
          )}
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{selectedNotificationData.data.title}</h2>
              <div className="flex items-center gap-3 mt-2">
                <span className="text-sm text-gray-500">
                  {formatDate(selectedNotificationData.data.created_at)}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  selectedNotificationData.read_at 
                    ? 'bg-green-100 text-green-800 border border-green-200' 
                    : 'bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white'
                }`}>
                  {selectedNotificationData.read_at ? 'تمت القراءة' : 'غير مقروء'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* محتوى الإشعار */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="bg-gradient-to-br from-gray-50 to-white p-6 rounded-2xl mb-6 border border-gray-100">
            <p className="text-gray-700 leading-relaxed text-lg whitespace-pre-line">
              {selectedNotificationData.data.body}
            </p>
          </div>
          
          {/* معلومات إضافية */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaCircle className="text-xs ml-2 text-[#53a1dd]" />
                حالة الإشعار
              </h4>
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  selectedNotificationData.read_at ? 'bg-green-500' : 'bg-[#53a1dd]'
                }`}></div>
                <span className="text-gray-600">
                  {selectedNotificationData.read_at ? 'تمت القراءة' : 'غير مقروء'}
                </span>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-medium text-gray-700 mb-2 flex items-center">
                <FaCircle className="text-xs ml-2 text-[#53a1dd]" />
                وقت الإرسال
              </h4>
              <p className="text-gray-600">{formatDate(selectedNotificationData.data.created_at)}</p>
            </div>
          </div>
          
          {/* الأزرار */}
          <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t border-gray-200">
            {window.innerWidth < 1024 && (
              <button 
                className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 flex-1"
                onClick={() => setViewMode('list')}
              >
                رجوع للقائمة
              </button>
            )}
            
            <button 
              className={`px-5 py-2.5 rounded-xl transition-all duration-200 flex-1 ${
                selectedNotificationData.read_at 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-gradient-to-r from-[#53a1dd] to-[#6ab0e5] text-white hover:shadow-md'
              }`}
              onClick={() => {
                if (!selectedNotificationData.read_at) {
                  markAsReadMutation.mutate(selectedNotificationData.id);
                }
              }}
              disabled={markAsReadMutation.isLoading}
            >
              {selectedNotificationData.read_at 
                ? 'تمت القراءة ✓' 
                : markAsReadMutation.isLoading 
                  ? 'جاري التحديد...' 
                  : 'تعيين كمقروء'}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Notifications;