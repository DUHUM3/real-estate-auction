import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// استيراد المكونات المنفصلة
import Notification from '../components/Notification';
import HeroSection from '../components/sections/HeroSection';
import ClientsSection from '../components/sections/ClientsSection';
import ServicesSection from '../components/sections/ServicesSection';
import PropertiesSection from '../components/sections/PropertiesSection';
import WhyUsSection from '../components/sections/WhyUsSection';
import ContactSection from '../components/sections/ContactSection';
import Login from './Auth/Login';

function Home({ onLoginClick }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [notification, setNotification] = useState(null);

  // دالة لعرض الإشعارات
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // دالة إضافة/إزالة من المفضلة
  const handleToggleFavorite = async (id, isFavorite, type) => {
    if (!currentUser) {
      setShowLoginModal(true);
      return { success: false };
    }

    try {
      const endpoint = type === 'property'
        ? `/api/favorites/property/${id}`
        : `/api/favorites/auction/${id}`;

      const response = await fetch(`https://shahin-tqay.onrender.com${endpoint}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`فشل في تحديث المفضلة: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        showNotification(result.message, 'success');
        return result;
      } else {
        throw new Error(result.message || 'حدث خطأ ما');
      }
    } catch (error) {
      console.error('❌ Error updating favorite:', error);
      showNotification(error.message || 'فشل في تحديث المفضلة', 'error');
      return { success: false, error: error.message };
    }
  };

  // دالة إغلاق نموذج تسجيل الدخول
  const handleCloseLogin = () => {
    setShowLoginModal(false);
  };

  // دالة للتبديل إلى التسجيل
  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    navigate('/register');
  };

  return (
    <div className="home-page">
      {/* إشعارات */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      {/* الأقسام المنفصلة */}
      <HeroSection 
        onSellLandClick={() => {
          if (currentUser) {
            navigate('/my-ads');
          } else {
            setShowLoginModal(true);
          }
        }}
        onBrowseInvestments={() => navigate('/lands-and-auctions-list')}
      />

      <ClientsSection />

      <ServicesSection />

      <PropertiesSection 
        onToggleFavorite={handleToggleFavorite}
        onPropertyClick={(id, type) => {
          const itemType = type || 'lands';
          if (itemType === 'lands' || itemType === 'land') {
            navigate(`/lands/${id}/land`);
          } else {
            navigate(`/lands/${id}/auction`);
          }
        }}
      />

      <WhyUsSection />

      <ContactSection />

      {showLoginModal && (
        <Login
          onClose={handleCloseLogin}
          onSwitchToRegister={handleSwitchToRegister}
        />
      )}
    </div>
  );
}

export default Home;