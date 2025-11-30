// api/requestsApi.js
const BASE_URL = 'https://core-api-x41.shaheenplus.sa';

// جلب طلبات الأراضي
export const fetchLandRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/land-requests/my`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching land requests:', error);
    throw error;
  }
};

// جلب طلبات المزادات
export const fetchAuctionRequests = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/user/auction-request`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.requests || [];
  } catch (error) {
    console.error('Error fetching auction requests:', error);
    throw error;
  }
};

// حذف طلب أرض
export const deleteLandRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/land-requests/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting land request:', error);
    throw error;
  }
};

// حذف طلب مزاد
export const deleteAuctionRequest = async (requestId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BASE_URL}/api/user/auction-request/${requestId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting auction request:', error);
    throw error;
  }
};

// معالجة البيانات
export const parseRequestsData = (data, type) => {
  if (type === 'lands') {
    return data.map(request => ({
      id: request.id,
      type: 'land',
      region: request.region,
      city: request.city,
      land_type: request.type,
      purpose: request.purpose,
      area: request.area,
      description: request.description,
      status: request.status,
      status_ar: request.status_ar,
      created_at: request.created_at,
      document_number: request.document_number,
      images: request.images || []
    }));
  } else {
    return data.map(request => ({
      id: request.id,
      type: 'auction',
      region: request.region,
      city: request.city,
      description: request.description,
      status: request.status,
      status_ar: request.status_ar,
      created_at: request.created_at || request.createdAt,
      document_number: request.document_number,
      images: request.images || []
    }));
  }
};