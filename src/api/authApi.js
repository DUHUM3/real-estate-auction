const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

export const authApi = {
  // تسجيل الدخول
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        password: password
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء تسجيل الدخول');
    }

    return data;
  },

  // التسجيل - معدل
  register: async (formData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: formData
      });

      const data = await response.json();
      
      if (!response.ok) {
        // تحسين رسائل الخطأ
        let errorMessage = data.message || 'حدث خطأ أثناء إنشاء الحساب';
        
        // تحقق من وجود أخطاء مفصلة
        if (data.errors) {
          const errorKeys = Object.keys(data.errors);
          if (errorKeys.length > 0) {
            // عرض أول خطأ
            const firstError = data.errors[errorKeys[0]];
            if (Array.isArray(firstError) && firstError.length > 0) {
              errorMessage = firstError[0];
            }
          }
        }
        
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
  
  // التحقق من البريد الإلكتروني
  verifyEmail: async (email, code) => {
    const response = await fetch(`${API_BASE_URL}/email/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email,
        code: code
      })
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      if (data.success === false) {
        throw new Error(data.message || 'رمز التحقق غير صحيح');
      }
      throw new Error(data.message || 'حدث خطأ أثناء التحقق من البريد الإلكتروني');
    }

    return data;
  },
};

export default authApi;