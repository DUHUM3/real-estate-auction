import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { currentUser, logout } = useAuth();

  if (!currentUser) {
    return <div>يجب تسجيل الدخول</div>;
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>مرحبا، {currentUser.name}</h1>
        <button onClick={logout} className="btn btn-secondary">تسجيل الخروج</button>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card">
          <h3>المزايدات النشطة</h3>
          <p className="stat-number">5</p>
        </div>
        <div className="stat-card">
          <h3>الاراضي المضافة</h3>
          <p className="stat-number">3</p>
        </div>
        <div className="stat-card">
          <h3>المزايدات الفائزة</h3>
          <p className="stat-number">2</p>
        </div>
      </div>

      <div className="dashboard-actions">
        <Link to="/create-property" className="action-card">
          <h3>إضافة عقار جديد</h3>
          <p>أضف عقارك للمزاد</p>
        </Link>
        
        <Link to="/properties" className="action-card">
          <h3>استعرض الاراضي</h3>
          <p>اشترك في المزايدات</p>
        </Link>
        
        <div className="action-card">
          <h3>إدارة عقاراتي</h3>
          <p>عرض وتعديل عقاراتك</p>
        </div>
        
        <div className="action-card">
          <h3>سجل المزايدات</h3>
          <p>عرض جميع مزايداتك</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;