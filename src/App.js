import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Properties from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import Favorites from './pages/Favorites';
import CreateProperty from './pages/CreateProperty';
import Profile from './pages/Profile';
import MyAds from './pages/MyAds';
import AuctionRoom from './pages/AuctionRoom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import './styles/App.css';

function App() {
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const openLogin = () => {
    setShowRegister(false);
    setShowLogin(true);
  };

  const openRegister = () => {
    setShowLogin(false);
    setShowRegister(true);
  };

  const closeModals = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar onLoginClick={openLogin} onRegisterClick={openRegister} />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/properties" element={<Properties />} />
              <Route path="/property/:id" element={<PropertyDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-ads" element={<MyAds />} />
              <Route path="/my-lands" element={<Favorites />} />              
              <Route path="/create-property" element={<CreateProperty />} />
              <Route path="/auction/:id" element={<AuctionRoom />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />

          {/* مودال تسجيل الدخول */}
          {showLogin && (
            <Login onClose={closeModals} onSwitchToRegister={openRegister} />
          )}

          {/* مودال إنشاء الحساب */}
          {showRegister && (
            <Register onClose={closeModals} onSwitchToLogin={openLogin} />
          )}
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
