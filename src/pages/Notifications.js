  import React, { useEffect, useState } from 'react';
  import { useLocation } from 'react-router-dom';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { fetchAllNotifications, markNotificationAsRead } from '../utils/notificationService';
  import { FaBell, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
  import '../styles/NotificationsPage.css';

  function Notifications() {
    const location = useLocation();
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState('all');
    const [selectedNotification, setSelectedNotification] = useState(null);
    
    // جلب جميع الإشعارات بتنسيق v5
    const { 
      data: notificationsData, 
      isLoading, 
      isError, 
      error 
    } = useQuery({
      queryKey: ['allNotifications'],
      queryFn: fetchAllNotifications
    });

    // استخدام mutation بتنسيق v5
    const markAsReadMutation = useMutation({
      mutationFn: markNotificationAsRead,
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['allNotifications'] });
        queryClient.invalidateQueries({ queryKey: ['latestNotifications'] });
      },
    });

    useEffect(() => {
      // إذا تم تمرير إشعار محدد في state، قم بتحديد هذا الإشعار
      if (location.state?.selectedNotification) {
        setSelectedNotification(location.state.selectedNotification);
        
        // قم بالتمرير إلى الإشعار المحدد
        setTimeout(() => {
          const element = document.getElementById(`notification-${location.state.selectedNotification}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 500);
      }
    }, [location.state, notificationsData]);

    // تصفية الإشعارات حسب التبويب النشط
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
      
      // إذا كان الإشعار غير مقروء، قم بتغيير حالته
      if (!notification.read_at) {
        markAsReadMutation.mutate(notification.id);
      }
    };

    // تنسيق التاريخ بالتنسيق العربي
    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
      });
    };

    const filteredNotifications = filterNotifications();
    const selectedNotificationData = filteredNotifications.find(
      notification => notification.id === selectedNotification
    );

    return (
      <div className="notifications-page">
        <div className="notifications-container">
          <div className="notifications-header">
            <h1><FaBell /> الإشعارات</h1>
            <div className="notification-tabs">
              <button 
                className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                onClick={() => setActiveTab('all')}
              >
               الكل
              </button>
              <button 
                className={`tab ${activeTab === 'unread' ? 'active' : ''}`}
                onClick={() => setActiveTab('unread')}
              >
                غير مقروءة
              </button>
              <button 
                className={`tab ${activeTab === 'read' ? 'active' : ''}`}
                onClick={() => setActiveTab('read')}
              >
                مقروءة
              </button>
            </div>
          </div>

          <div className="notifications-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>جاري تحميل الإشعارات...</p>
              </div>
            ) : isError ? (
              <div className="error-state">
                <FaExclamationCircle className="error-icon" />
                <p>حدث خطأ في تحميل الإشعارات</p>
                <p className="error-details">{error.message}</p>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="empty-state">
                <FaBell className="empty-icon" />
                <p>لا توجد إشعارات {activeTab === 'unread' ? 'غير مقروءة' : activeTab === 'read' ? 'مقروءة' : ''}</p>
              </div>
            ) : (
              <div className="notifications-layout">
                <div className="notifications-list">
                  {filteredNotifications.map(notification => (
                    <div 
                      id={`notification-${notification.id}`}
                      key={notification.id} 
                      className={`notification-item ${notification.read_at ? 'read' : 'unread'} ${selectedNotification === notification.id ? 'selected' : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="notification-item-content">
                        <div className="notification-header">
                          <h3 className="notification-title">{notification.data.title}</h3>
                          {!notification.read_at && <span className="unread-badge"></span>}
                        </div>
                        <p className="notification-preview">{notification.data.body}</p>
                        <span className="notification-time">{formatDate(notification.data.created_at)}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="notification-details">
                  {selectedNotificationData ? (
                    <div className="selected-notification">
                      <div className="selected-notification-header">
                        <h2>{selectedNotificationData.data.title}</h2>
                        {selectedNotificationData.read_at && (
                          <span className="read-status">
                            <FaCheckCircle /> تمت القراءة
                          </span>
                        )}
                      </div>
                      <div className="notification-datetime">
                        <span>{formatDate(selectedNotificationData.data.created_at)}</span>
                      </div>
                      <div className="notification-body">
                        <p>{selectedNotificationData.data.body}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="no-notification-selected">
                      <FaBell className="notification-icon" />
                      <p>اختر إشعارًا لعرض التفاصيل</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  export default Notifications;