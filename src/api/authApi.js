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
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء تسجيل الدخول');
    }

    return data;
  },

  // التسجيل
  register: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    const data = await response.json();
    
    if (!response.ok) {
      let errorMessage = data.message || 'حدث خطأ أثناء إنشاء الحساب';
      if (data.errors) {
        const errorKeys = Object.keys(data.errors);
        if (errorKeys.length > 0) {
          const firstError = data.errors[errorKeys[0]];
          if (Array.isArray(firstError) && firstError.length > 0) {
            errorMessage = firstError[0];
          }
        }
      }
      throw new Error(errorMessage);
    }

    return data;
  },

  // التحقق من البريد الإلكتروني
    verifyEmail: async (email, code) => {
    const response = await fetch(`${API_BASE_URL}/email/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email, code })
    });

    const data = await response.json();
    
    // تحسين معالجة الأخطاء
    if (!response.ok) {
      // تحديد رسالة الخطأ بناءً على error_code
      let errorMessage = data.message || 'رمز التحقق غير صحيح';
      
      if (data.error_code) {
        switch (data.error_code) {
          case 'RATE_LIMIT_EXCEEDED':
            errorMessage = 'لقد تجاوزت الحد المسموح من المحاولات. يرجى المحاولة مرة أخرى بعد دقيقة.';
            break;
          case 'EXPIRED_VERIFICATION_CODE':
            errorMessage = 'رمز التحقق منتهي الصلاحية. يرجى طلب رمز جديد.';
            break;
          case 'EMAIL_ALREADY_VERIFIED':
            errorMessage = 'البريد الإلكتروني مؤكد بالفعل. يمكنك تسجيل الدخول.';
            break;
          case 'INVALID_VERIFICATION_CODE':
            errorMessage = 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.';
            break;
        }
      }
      
      throw new Error(errorMessage);
    }

    // التحقق من وجود مفتاح verified
    if (data.verified !== true) {
      throw new Error('فشل في عملية التحقق. يرجى المحاولة مرة أخرى.');
    }

    return data;
  },

  // إعادة إرسال رمز التحقق
  resendVerificationCode: async (email) => {
    const response = await fetch(`${API_BASE_URL}/email/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء إعادة إرسال الرمز');
    }

    return data;
  },

  // نسيان كلمة المرور
  forgotPassword: async (email) => {
    const response = await fetch(`${API_BASE_URL}/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء إرسال رابط إعادة التعيين');
    }

    return data;
  },
};

export default authApi;
