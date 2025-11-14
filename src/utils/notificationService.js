// api/notificationService.js
import axios from 'axios';

const API_URL = 'https://shahin-tqay.onrender.com/api';

// جلب آخر الإشعارات
export const fetchLatestNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications/latest`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'فشل في جلب الإشعارات');
  }
};

// جلب جميع الإشعارات
export const fetchAllNotifications = async () => {
  try {
    const response = await axios.get(`${API_URL}/notifications`, {
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