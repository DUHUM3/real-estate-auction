// src/api/landRequestApi.js
import axios from 'axios';

const API_BASE_URL = 'https://shahin-tqay.onrender.com/api';

const landApi = {
  submitLandRequest: async (formData) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(`${API_BASE_URL}/land-requests`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  getLandRequests: async () => {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_BASE_URL}/land-requests`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  },

  getLandRequestById: async (id) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.get(`${API_BASE_URL}/land-requests/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  },

  updateLandRequest: async (id, formData) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.put(`${API_BASE_URL}/land-requests/${id}`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    
    return response.data;
  },

  deleteLandRequest: async (id) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.delete(`${API_BASE_URL}/land-requests/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    
    return response.data;
  }
};

export { landApi };