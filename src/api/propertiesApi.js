// api/propertiesApi.js
const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

export const propertiesApi = {
  // جلب العقارات مع الفلاتر
  getProperties: async (filters = {}, page = 1) => {
    try {
      const queryParams = new URLSearchParams();
      
      // إضافة الفلاتر
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams.append(key, filters[key]);
        }
      });
      
      // إضافة الباجينيشن
      queryParams.append('page', page);

      const url = `${API_BASE_URL}/properties?${queryParams}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('فشل في جلب البيانات');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw error;
    }
  },

  // جلب عقار محدد
  getPropertyById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${id}`);
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات العقار');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching property:', error);
      throw error;
    }
  },

  // جلب طلبات الأراضي مع الفلاتر
  getLandRequests: async (filters = {}, page = 1, token = null) => {
    try {
      const queryParams = new URLSearchParams();
      
      // إضافة الفلاتر
      Object.keys(filters).forEach(key => {
        if (filters[key] && filters[key] !== '') {
          queryParams.append(key, filters[key]);
        }
      });
      
      // إضافة الباجينيشن
      queryParams.append('page', page);

      const url = `${API_BASE_URL}/land-requests?${queryParams}`;
      
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        headers: headers
      });

      if (!response.ok) {
        throw new Error('فشل في جلب طلبات الأراضي');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching land requests:', error);
      throw error;
    }
  },

  // جلب طلب أرض محدد
  getLandRequestById: async (id, token = null) => {
    try {
      const headers = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/land-requests/${id}`, {
        headers: headers
      });
      
      if (!response.ok) {
        throw new Error('فشل في جلب بيانات طلب الأرض');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching land request:', error);
      throw error;
    }
  },

  // إنشاء طلب أرض جديد
  createLandRequest: async (requestData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/land-requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('فشل في إنشاء طلب الأرض');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating land request:', error);
      throw error;
    }
  },

  // تحديث طلب أرض
  updateLandRequest: async (id, requestData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/land-requests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث طلب الأرض');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating land request:', error);
      throw error;
    }
  },

  // حذف طلب أرض
  deleteLandRequest: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/land-requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('فشل في حذف طلب الأرض');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error deleting land request:', error);
      throw error;
    }
  },

  // إضافة/إزالة من المفضلة
  toggleFavorite: async (propertyId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/favorites/property/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
      });

      if (!response.ok) {
        throw new Error('فشل في تحديث المفضلة');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      throw error;
    }
  },

  // مشاركة العقار
  shareProperty: async (propertyId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/properties/${propertyId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('فشل في مشاركة العقار');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error sharing property:', error);
      throw error;
    }
  }
};

// دوال المساعدة للعقارات وطلبات الأراضي
export const propertiesUtils = {
  // الحصول على صورة العقار
  getPropertyImageUrl: (property) => {
    if (property.cover_image) {
      return `https://core-api-x41.shaheenplus.sa/storage/${property.cover_image}`;
    }
    return null;
  },

  // حساب السعر الإجمالي
  calculateTotalPrice: (property) => {
    if (property.price_per_sqm && property.total_area) {
      return (parseFloat(property.price_per_sqm) * parseFloat(property.total_area)).toFixed(2);
    }
    return '0';
  },

  // تنسيق السعر
  formatPrice: (price) => {
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
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

  // الحصول على كلاس حالة العقار
  getStatusBadgeClass: (status) => {
    switch(status) {
      case 'مفتوح': return 'shahinStatus_open';
      case 'تم البيع': return 'shahinStatus_sold';
      case 'محجوز': return 'shahinStatus_reserved';
      case 'مغلق': return 'shahinStatus_closed';
      case 'معلق': return 'shahinStatus_pending';
      case 'open': return 'shahinStatus_open';
      case 'completed': return 'shahinStatus_closed';
      default: return 'shahinStatus_unknown';
    }
  },

  // الحصول على تسمية الغرض
  getPurposeLabel: (purpose) => {
    switch(purpose) {
      case 'sale': return 'بيع';
      case 'rent': return 'إيجار';
      default: return purpose;
    }
  },

  // الحصول على تسمية النوع
  getTypeLabel: (type) => {
    switch (type) {
      case 'residential': return 'سكني';
      case 'commercial': return 'تجاري';
      case 'agricultural': return 'زراعي';
      case 'industrial': return 'صناعي';
      default: return type;
    }
  },

  // الحصول على تسمية الحالة
  getStatusLabel: (status) => {
    switch(status) {
      case 'open': return 'مفتوح';
      case 'completed': return 'مكتمل';
      case 'pending': return 'قيد المراجعة';
      case 'cancelled': return 'ملغي';
      default: return status;
    }
  }
};