import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast'; // ✅ تم إضافة Toaster

// استيراد المكونات
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// الصفحات الرئيسية والعامة
import Home from './pages/Home';
import LandsAndAuctionsList from './pages/LandsAndAuctionsList';
import LandRequestsList from './pages/Lands/LandRequestsList';

// صفحات الملف الشخصي والإدارة
import Profile from './pages/Profile';
import MyAds from './pages/MyAds';
import Favorites from './pages/Favorites';
import Interests from './pages/Interests';
import Notifications from './pages/Notifications';
import MyRequests from './pages/MyRequests';

import Createland from './pages/Lands/CreateLand';
import LandRequestDetails from './pages/Lands/LandRequestDetails';
import CreateLandRequest from './pages/Lands/CreateLandRequest';
import CreateAuctionRequest from './pages/Auction/CreateAuctionRequest';
import LandDetails from './pages/Lands/LandDetails';
import CreateAd from './pages/CreateAd';
// صفحات المصادقة
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

import TermsOfService from './pages/Privacy/TermsOfService';
import PrivacyPolicy from './pages/Privacy/PrivacyPolicy';

import './styles/App.css';

// تكوين React Query Client لإدارة حالة الخادم
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, 
      retry: 1, 
      staleTime: 30000, 
    },
  },
});

// إنشاء Context لإدارة نوافذ تسجيل الدخول والتسجيل
export const ModalContext = React.createContext();

function App() {
  // حالة التحكم في عرض نوافذ التسجيل والدخول
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [afterLoginCallback, setAfterLoginCallback] = useState(null);

  const openLogin = (callback = null) => {
    setShowRegister(false);
    setShowLogin(true);
    setAfterLoginCallback(() => callback);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
    setAfterLoginCallback(null);
  };

  const handleLoginSuccess = () => {
    if (afterLoginCallback) {
      afterLoginCallback();
    }
    closeModals();
  };

  // قيمة Context التي ستتشارك بين المكونات
  const modalContextValue = {
    openLogin,
    openRegister,
    closeModals
  };

  return (
    // ✅ تم نقل Toaster إلى المكان الصحيح داخل return
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalContext.Provider value={modalContextValue}>
          <Router>
            <div className="App">
              {/* ✅ إضافة Toaster هنا */}
              <Toaster position="top-center" />
              
              {/* شريط التنقل الرئيسي */}
              <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
              
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  
                  {/* صفحات العقارات والأراضي */}
                  <Route path="/lands-and-auctions-list" element={<LandsAndAuctionsList />} />
                  <Route path="/lands/:id/:type" element={<LandDetails />} />
                  <Route path="/create-lands" element={<Createland />} />
                  
                  {/* صفحات طلبات الأراضي */}
                  <Route path="/purchase-requests" element={<LandRequestsList />} />
                  <Route path="/requests/:id" element={<LandRequestDetails />} />
                  <Route path="/create-request" element={<CreateLandRequest />} />
                  
                  {/* صفحات المستخدم */}
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-ads" element={<MyAds />} />
                  <Route path="/my-lands" element={<Favorites />} />
                  <Route path="/interests" element={<Interests />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/my-requests" element={<MyRequests />} />  
                  <Route path="/create-ad" element={<CreateAd />} />

                  {/* صفحات أخرى */}
                  <Route path="/create-marketing-request" element={<CreateAuctionRequest />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                </Routes>
              </main>
              
              {/* تذييل الصفحة */}
              <Footer />

              {/* نافذة تسجيل الدخول */}
              {showLogin && (
                <Login 
                  onClose={closeModals} 
                  onSwitchToRegister={openRegister}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}

              {/* نافذة إنشاء حساب جديد */}
              {showRegister && (
                <Register onClose={closeModals} onSwitchToLogin={openLogin} />
              )}
            </div>
          </Router>
        </ModalContext.Provider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;