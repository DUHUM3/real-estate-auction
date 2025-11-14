import React from 'react';

const Notification = ({ message, type = 'success', onClose }) => (
  <div className={`notification ${type}`}>
    <div className="notification-content">
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>×</button>
    </div>
  </div>
);

export default Notification;