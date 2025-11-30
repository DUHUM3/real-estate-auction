// api/notificationService.js
import axios from 'axios';

const API_URL = 'https://core-api-x41.shaheenplus.sa/api';

// جلب آخر الإشعارات مع الباجينيشين
export const fetchLatestNotifications = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/notifications?page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'فشل في جلب الإشعارات');
  }
};

// جلب جميع الإشعارات مع الباجينيشين
export const fetchAllNotifications = async (page = 1) => {
  try {
    const response = await axios.get(`${API_URL}/notifications?page=${page}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'فشل في جلب الإشعارات');
  }
};

// تغيير حالة قراءة الإشعار
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/${notificationId}/read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'فشل في تحديث حالة الإشعار');
  }
};

// وضع علامة على جميع الإشعارات كمقروءة
export const markAllNotificationsAsRead = async () => {
  try {
    const response = await axios.post(
      `${API_URL}/notifications/mark-all-read`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'فشل في تحديث حالة الإشعارات');
  }
};