const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

// دالة لجلب الاهتمامات
export const fetchInterests = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/user/interests/my`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('فشل في جلب بيانات الاهتمامات');
  }

  const data = await response.json();
  return data.data || [];
};

// دالة لمعالجة بيانات الاهتمامات
export const parseInterestsData = (interests) => {
  return interests.map(interest => ({
    id: interest.id,
    property_id: interest.property_id,
    status: interest.status,
    message: interest.message,
    full_name: interest.full_name,
    phone: interest.phone,
    email: interest.email,
    created_at: interest.created_at,
    updated_at: interest.updated_at
  }));
};