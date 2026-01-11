// API service for land request operations
const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

export const landRequestService = {
  /**
   * Fetch land request details by ID
   */
  async getRequestDetails(requestId) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_BASE_URL}/land-requests/${requestId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json();
    return result.data;
  },

  /**
   * Submit an offer for a land request
   */
  async submitOffer(requestId, message) {
    const token = localStorage.getItem('token');

    if (!token) {
      throw new Error('No authentication token');
    }

    const response = await fetch(`${API_BASE_URL}/land-requests/${requestId}/offers`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: message.trim() }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.message || 'حدث خطأ في تقديم العرض');
    }

    return result;
  },
};