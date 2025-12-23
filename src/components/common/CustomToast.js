import React from 'react';
import { ToastContainer } from 'react-toastify';

const CustomToast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={4000}
      closeOnClick
      draggable
      rtl
      pauseOnHover
      theme="light"
      style={{
        top: window.innerWidth < 768 ? "80px" : "80px",
        right: "10px",
        left: "auto",
        width: "auto",
        maxWidth: window.innerWidth < 768 ? "90%" : "400px",
        fontFamily: "'Segoe UI', 'Cairo', sans-serif",
        fontSize: window.innerWidth < 768 ? "12px" : "14px",
        zIndex: 999999
      }}
      toastStyle={{
        borderRadius: "8px",
        padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
        marginBottom: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        minHeight: window.innerWidth < 768 ? "40px" : "50px",
        direction: "rtl",
        textAlign: "right",
        fontSize: window.innerWidth < 768 ? "12px" : "14px",
      }}
    />
  );
};

export default CustomToast;