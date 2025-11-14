// api/authApi.js

const API_BASE_URL = 'https://shahin-tqay.onrender.com/api';

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

  // التسجيل
  register: async (userData, userTypeId) => {
    const config = {
      headers: {
        'Accept': 'application/json'
      }
    };

    // إعداد البيانات بناءً على نوع المستخدم
    let apiData = userData;
    
    if (userTypeId === 6) {
      // استخدام FormData لرفع الملفات
      const formData = new FormData();
      Object.keys(userData).forEach(key => {
        if (userData[key] !== null && userData[key] !== undefined) {
          formData.append(key, userData[key]);
        }
      });
      apiData = formData;
      config.headers['Content-Type'] = 'multipart/form-data';
    } else {
      config.headers['Content-Type'] = 'application/json';
    }

    const response = await fetch(`${API_BASE_URL}/register`, {
      method: 'POST',
      ...config,
      body: userTypeId === 6 ? apiData : JSON.stringify(apiData)
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'حدث خطأ أثناء إنشاء الحساب');
    }

    return data;
  },

  // استعادة كلمة المرور (للاستخدام المستقبلي)
//   forgotPassword: async (email) => {
//     const response = await fetch(`${API_BASE_URL}/forgot-password`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({ email })
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'حدث خطأ أثناء استعادة كلمة المرور');
//     }

//     return data;
//   },

  // التحقق من البريد الإلكتروني (للاستخدام المستقبلي)
//   verifyEmail: async (token) => {
//     const response = await fetch(`${API_BASE_URL}/verify-email`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//       body: JSON.stringify({ token })
//     });

//     const data = await response.json();
    
//     if (!response.ok) {
//       throw new Error(data.message || 'فشل في التحقق من البريد الإلكتروني');
//     }

//     return data;
//   }
};

export default authApi;