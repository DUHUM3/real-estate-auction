// src/App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./components/common/ScrollToTop";

// ✅ استيراد ToastProvider الجديد بدلاً من react-toastify
import { ToastProvider } from "./components/common/ToastProvider";

// ✅ استيراد HelmetProvider لتجنب مشاكل react-helmet-async
import { HelmetProvider } from "react-helmet-async";

// استيراد المكونات
import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

import Home from "./pages/Home";
import LandsAndAuctionsList from "./pages/LandsAndAuctionsList";
import LandRequestsList from "./pages/LandsRequest/LandRequestsList";

import Profile from "./pages/Profile";
import MyAds from "./pages/MyAds";
import Favorites from "./pages/Favorites";
import Interests from "./pages/Interests";
import Notifications from "./pages/Notifications";
import MyRequests from "./pages/MyRequests";

import LandRequestDetails from "./pages/LandsRequest/LandRequestDetails";
import CreateLandRequest from "./pages/LandsRequest/CreateLandRequest";
import CreateAuctionRequest from "./pages/Auction/CreateAuctionRequest";
import LandDetails from "./pages/Lands/LandDetails";
import AuctionDetails from "./pages/Auction/AuctionDetails";
import CreateAd from "./pages/Lands/CreateLand";
import CreateAuctionAd from "./pages/Auction/CreateAuctionAd";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

import TermsOfService from "./pages/Privacy/TermsOfService";
import PrivacyPolicy from "./pages/Privacy/PrivacyPolicy";

import "./styles/App.css";

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
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          {/* ✅ إضافة ToastProvider هنا لتغطية جميع المكونات */}
          <ToastProvider>
            <ModalContext.Provider value={modalContextValue}>
              <Router>
                {/* ✅ Scroll To Top عند تغيير المسار */}
                <ScrollToTop />

                <div className="App">
                  {/* ✅ تمت إزالة ToastContainer القديم */}
                  
                  <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />

                  <main>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route
                        path="/lands-and-auctions-list"
                        element={<LandsAndAuctionsList />}
                      />
                      <Route path="/lands/:id/:type" element={<LandDetails />} />
                      <Route
                        path="/auctions/:id/:type"
                        element={<AuctionDetails />}
                      />
                      <Route path="/create-auction" element={<CreateAuctionAd />} />
                      <Route
                        path="/purchase-requests"
                        element={<LandRequestsList />}
                      />
                      <Route
                        path="/requests/:id"
                        element={<LandRequestDetails />}
                      />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/my-ads" element={<MyAds />} />
                      <Route path="/my-lands" element={<Favorites />} />
                      <Route path="/interests" element={<Interests />} />
                      <Route path="/notifications" element={<Notifications />} />
                      <Route path="/my-requests" element={<MyRequests />} />
                      <Route path="/create-ad" element={<CreateAd />} />
                      <Route
                        path="/create-marketing-request"
                        element={<CreateAuctionRequest />}
                      />
                      <Route
                        path="/terms-of-service"
                        element={<TermsOfService />}
                      />
                      <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                      <Route path="/forgot-password" element={<ForgotPassword />} />
                      <Route path="/reset-password" element={<ResetPassword />} />
                      <Route path="/create-request" element={<CreateLandRequest />} />
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
          </ToastProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
