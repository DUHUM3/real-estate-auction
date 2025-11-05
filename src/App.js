import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/PropertyList';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import Favorites from './pages/Favorites';
import LandRequestsList from './pages/LandRequestsList';
import Interests from './pages/Interests';
import LandRequestDetails from './pages/LandRequestDetails';
import CreateLandRequest from './pages/CreateLandRequest';
import MarketingRequest from './pages/AuctionRequest';
import CreateProperty from './pages/CreateProperty';
import Profile from './pages/Profile';
import MyAds from './pages/MyAds';
import AuctionRoom from './pages/AuctionRoom';
import Dashboard from './pages/Dashboard';
import Notifications from './pages/Notifications';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/App.css';

// إنشاء مثيل جديد لـ QueryClient
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000,
    },
  },
});

// إنشاء Context لإدارة نافذة تسجيل الدخول
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

  // دالة يتم استدعاؤها بعد تسجيل الدخول بنجاح
  const handleLoginSuccess = () => {
    if (afterLoginCallback) {
      afterLoginCallback();
    }
    closeModals();
  };

  const modalContextValue = {
    openLogin,
    openRegister,
    closeModals
  };

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ModalContext.Provider value={modalContextValue}>
          <Router>
            <div className="App">
              <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
              <main>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/property/:id/:type" element={<PropertyDetailsPage />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/land-requests" element={<LandRequestsList />} />
                  <Route path="/requests/:id" element={<LandRequestDetails />} />
                  <Route path="/create-request" element={<CreateLandRequest />} />
                  <Route path="/marketing-request" element={<MarketingRequest />} />
                  <Route path="/interests" element={<Interests />} />
                  <Route path="/my-ads" element={<MyAds />} />
                  <Route path="/my-lands" element={<Favorites />} />
                  <Route path="/create-property" element={<CreateProperty />} />
                  <Route path="/auction/:id" element={<AuctionRoom />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/notifications" element={<Notifications />} />
                </Routes>
              </main>
              <Footer />

              {/* مودال تسجيل الدخول */}
              {showLogin && (
                <Login 
                  onClose={closeModals} 
                  onSwitchToRegister={openRegister}
                  onLoginSuccess={handleLoginSuccess}
                />
              )}

              {/* مودال إنشاء الحساب */}
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