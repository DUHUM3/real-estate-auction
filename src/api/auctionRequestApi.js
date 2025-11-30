import axios from 'axios';

const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

// Create axios instance with common config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add request interceptor for auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const marketingApi = {
  // Submit marketing request
  submitMarketingRequest: async (formData) => {
    try {
      const response = await apiClient.post('/user/auction-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


// Form validation service
export const validationService = {
  validateForm: (formData, images) => {
    const errors = [];

    if (!formData.region || !formData.city || !formData.description || !formData.document_number) {
      errors.push('يرجى ملء جميع الحقول المطلوبة');
    }

    // if (!formData.terms_accepted) {
    //   errors.push('يجب الموافقة على الشروط والأحكام');
    // }

    if (images.length === 0) {
      errors.push('يرجى رفع صورة واحدة على الأقل');
    }

    return errors;
  },

  validateImage: (file, existingImagesCount = 0) => {
    const errors = [];

    if (!file.type.startsWith('image/')) {
      errors.push('يجب أن تكون الملفات صور فقط');
    }

    if (file.size > 5 * 1024 * 1024) {
      errors.push('حجم الصورة يجب أن يكون أقل من 5MB');
    }

    if (existingImagesCount >= 5) {
      errors.push('يمكنك رفع最多 5 صور فقط');
    }

    return errors;
  },
};