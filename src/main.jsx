import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // استدعاء App من ملف منفصل
import './styles/App.css';
import './styles/fonts.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
