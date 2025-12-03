import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// استبدال notifex بـ React-Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// استيراد المكونات
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

import Home from './pages/Home';
import LandsAndAuctionsList from './pages/LandsAndAuctionsList';
import LandRequestsList from './pages/Lands/LandRequestsList';

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

import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';

import TermsOfService from './pages/Privacy/TermsOfService';
import PrivacyPolicy from './pages/Privacy/PrivacyPolicy';

import './styles/App.css';

// Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// Modal Context
export const ModalContext = React.createContext();

function App() {
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

  const modalContextValue = {
    openLogin,
    openRegister,
    closeModals,
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalContext.Provider value={modalContextValue}>
          <Router>
            <div className="App">

              {/* Toast Container — بديل احترافي عن notifex */}
            <ToastContainer
  position="top-right"
  autoClose={4000}
  closeOnClick
  draggable
  rtl
  pauseOnHover
  theme="light"
  // إعدادات مخصصة للتحكم في الموقع
  style={{
    top: window.innerWidth < 768 ? "60px" : "20px", // ننزلها شوي في الهواتف
    right: "10px",
    left: "auto",
    width: "auto",
    maxWidth: window.innerWidth < 768 ? "90%" : "400px",
    fontFamily: "'Segoe UI', 'Cairo', sans-serif",
    fontSize: window.innerWidth < 768 ? "12px" : "14px", // تصغير الخط في الهاتف
    zIndex: 999999
  }}
  toastStyle={{
    borderRadius: "8px",
    padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
    marginBottom: "8px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    minHeight: window.innerWidth < 768 ? "40px" : "50px", // تصغير الحجم في الهاتف
    direction: "rtl",
    textAlign: "right",
    fontSize: window.innerWidth < 768 ? "12px" : "14px", // تأكيد تصغير الخط
  }}
  // خاصية جديدة للموبايل
  className={window.innerWidth < 768 ? "mobile-toast" : "desktop-toast"}
/>

              <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

              <main>
                <Routes>
                  <Route path="/" element={<Home />} />

                  <Route path="/lands-and-auctions-list" element={<LandsAndAuctionsList />} />
                  <Route path="/lands/:id/:type" element={<LandDetails />} />
                  <Route path="/create-lands" element={<Createland />} />

                  <Route path="/purchase-requests" element={<LandRequestsList />} />
                  <Route path="/requests/:id" element={<LandRequestDetails />} />
                  <Route path="/create-request" element={<CreateLandRequest />} />

                  <Route path="/profile" element={<Profile />} />
                  <Route path="/my-ads" element={<MyAds />} />
                  <Route path="/my-lands" element={<Favorites />} />
                  <Route path="/interests" element={<Interests />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/my-requests" element={<MyRequests />} />
                  <Route path="/create-ad" element={<CreateAd />} />

                  <Route path="/create-marketing-request" element={<CreateAuctionRequest />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                </Routes>
              </main>

              <Footer />

              {showLogin && (
                <Login
                  onClose={closeModals}
                  onSwitchToRegister={openRegister}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}

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
