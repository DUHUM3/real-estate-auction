// services/adsApi.js

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

// جلب الإعلانات بناءً على نوع المستخدم
export const fetchAds = async (userType, status = 'الكل') => {
  if (userType === 'شركة مزادات') {
    return fetchWithAuth('/user/auctions');
  } else {
    if (status !== 'الكل') {
      return fetchWithAuth(`/user/properties/status/${status}`);
    }
    return fetchWithAuth('/user/properties/my');
  }
};

// حذف إعلان
export const deleteAd = async (adId, userType) => {
  if (userType === 'شركة مزادات') {
    return fetchWithAuth(`/user/auctions/${adId}`, {
      method: 'DELETE',
    });
  } else {
    // الرابط المصحح لحذف الأراضي
    return fetchWithAuth(`/user/properties/${adId}`, {
      method: 'DELETE',
    });
  }
};

// دالة مساعدة لتحليل البيانات بناءً على نوع المستخدم
export const parseAdsData = (data, userType) => {
  if (userType === 'شركة مزادات') {
    return data.data?.data || [];
  } else {
    return data.data || [];
  }
};