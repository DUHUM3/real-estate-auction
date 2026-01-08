import axios from 'axios';

const API_BASE_URL ='https://core-api-x41.shaheenplus.sa/api';

/**
 * API service for marketing requests
 */
export const marketingApi = {
  /**
   * Submit a new marketing request
   * @param {FormData} formData - The form data including images
   * @returns {Promise} API response
   */
  submitMarketingRequest: async (formData) => {
    const token = localStorage.getItem('token');
    
    const response = await axios.post(
      `${API_BASE_URL}/user/auction-request`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    
    return response.data;
  },

  /**
   * Validate marketing request data
   * @param {Object} data - The data to validate
   * @returns {Promise} Validation result
   */
  validateMarketingRequest: async (data) => {
    const response = await axios.post(
      `${API_BASE_URL}/marketing-requests/validate`,
      data
    );
    
    return response.data;
  },
};

export default marketingApi;