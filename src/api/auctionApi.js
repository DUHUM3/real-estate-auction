// api/auctionsApi.js
const API_BASE_URL = 'https://shahin-tqay.onrender.com/api';

export const auctionsApi = {
  // جلب المزادات مع الفلاتر
  getAuctions: async (filters = {}, page = 1) => {
    try {
      const queryParams = new URLSearchParams();
      
      // إضافة فلاتر المزادات
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      // إضافة الباجينيشن
      queryParams.append('page', page);

      const url = `${API_BASE_URL}/auctions?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('فشل في جلب بيانات المزادات');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching auctions:', error);
      throw error;
    }
  },

  // جلب مزاد محدد
  getAuctionById: async (auctionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}`);
      if (!response.ok) throw new Error('فشل في جلب بيانات المزاد');
      return await response.json();
    } catch (error) {
      console.error('Error fetching auction:', error);
      throw error;
    }
  },

  // إضافة/إزالة من المفضلة
  toggleFavorite: async (auctionId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/auction/${auctionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('فشل في تحديث المفضلة');
      return await response.json();
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // مشاركة المزاد
  shareAuction: async (auctionId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auctions/${auctionId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) throw new Error('فشل في مشاركة المزاد');
      return await response.json();
    } catch (error) {
      console.error('Error sharing auction:', error);
      throw error;
    }
  }
};

// دوال المساعدة للمزادات
export const auctionsUtils = {
  // الحصول على صورة المزاد
  getAuctionImageUrl: (auction) => {
    if (auction.cover_image) {
      return `https://shahin-tqay.onrender.com/storage/${auction.cover_image}`;
    }
    return null;
  },

  // تنسيق التاريخ
  formatDate: (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  },

  // تنسيق الوقت
  formatTime: (timeString) => {
    try {
      const [hours, minutes] = timeString.split(':');
      return `${hours}:${minutes}`;
    } catch (e) {
      return timeString;
    }
  },

  // تنظيف النص من الاقتباسات
  cleanText: (text) => {
    if (typeof text === 'string') {
      return text.replace(/"/g, '');
    }
    return text || '';
  },

  // الحصول على كلاس حالة المزاد
  getStatusBadgeClass: (status) => {
    switch(status) {
      case 'مفتوح': return 'shahinStatus_open';
      case 'تم البيع': return 'shahinStatus_sold';
      case 'محجوز': return 'shahinStatus_reserved';
      case 'مغلق': return 'shahinStatus_closed';
      case 'معلق': return 'shahinStatus_pending';
      default: return 'shahinStatus_unknown';
    }
  }
};