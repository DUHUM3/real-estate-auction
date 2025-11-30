// services/profileApi.js

const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

// دالة مساعدة للطلبات
const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${url}`, config);
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
};

// جلب بيانات الملف الشخصي
export const fetchProfileData = async () => {
  return fetchWithAuth('/profile');
};

// جلب إحصائيات المستخدم
export const fetchUserStats = async () => {
  return fetchWithAuth('/user/properties/stats');
};

// تحديث بيانات الملف الشخصي
export const updateProfileData = async (data) => {
  return fetchWithAuth('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

// دالة مساعدة للتحقق من عرض الإحصائيات
export const shouldShowStats = (data) => {
  if (!data) return false;
  const userType = data.user.user_type;
  return userType !== 'مستخدم عام' && userType !== 'شركة مزادات';
};