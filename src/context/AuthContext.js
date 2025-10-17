import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // استرجاع البيانات المخزنة من localStorage
    const user = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (user && token) {
      setCurrentUser({
        ...JSON.parse(user),
        access_token: token
      });
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setCurrentUser(userData);
    
    // تخزين البيانات في localStorage
    localStorage.setItem('user', JSON.stringify({
      id: userData.id,
      full_name: userData.full_name,
      email: userData.email,
      phone: userData.phone,
      user_type: userData.user_type,
      status: userData.status
    }));
    
    // تخزين التوكن بشكل منفصل
    localStorage.setItem('token', userData.access_token);
    localStorage.setItem('token_type', userData.token_type);
    localStorage.setItem('expires_at', userData.expires_at);
  };

  const logout = () => {
    setCurrentUser(null);
    // مسح جميع البيانات المخزنة
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('token_type');
    localStorage.removeItem('expires_at');
  };

  const updateUser = (userData) => {
    const updatedUser = {
      ...currentUser,
      ...userData
    };
    setCurrentUser(updatedUser);
    
    // تحديث البيانات في localStorage
    localStorage.setItem('user', JSON.stringify({
      id: updatedUser.id,
      full_name: updatedUser.full_name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      user_type: updatedUser.user_type,
      status: updatedUser.status
    }));
  };

  // دالة للتحقق من صلاحية التوكن
  const isTokenValid = () => {
    const expiresAt = localStorage.getItem('expires_at');
    if (!expiresAt) return false;
    
    return new Date() < new Date(expiresAt);
  };

  // دالة للحصول على التوكن للمستخدم في الطلبات المستقبلية
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    const tokenType = localStorage.getItem('token_type') || 'Bearer';
    
    if (token && isTokenValid()) {
      return `${tokenType} ${token}`;
    }
    return null;
  };

  const value = {
    currentUser,
    login,
    logout,
    updateUser,
    loading,
    isTokenValid,
    getAuthHeader
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}