const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

// دالة لجلب المفضلة
export const fetchFavorites = async () => {
  const token = localStorage.getItem('token');
  
  const response = await fetch(`${API_BASE_URL}/favorites`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('فشل في جلب بيانات المفضلة');
  }

  const data = await response.json();
  return data.favorites || [];
};

// دالة لإزالة عنصر من المفضلة
export const removeFavorite = async (favorite) => {
  const token = localStorage.getItem('token');
  
  let url = '';
  if (favorite.favoritable_type === 'App\\Models\\Property') {
    url = `${API_BASE_URL}/favorites/property/${favorite.favoritable_id}`;
  } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
    url = `${API_BASE_URL}/favorites/auction/${favorite.favoritable_id}`;
  } else {
    throw new Error('نوع العنصر غير معروف');
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('فشل في إزالة العنصر من المفضلة');
  }

  return response.json();
};

// دالة لمعالجة بيانات المفضلة
export const parseFavoritesData = (favorites) => {
  return favorites.map(favorite => ({
    id: favorite.id,
    favoritable_id: favorite.favoritable_id,
    favoritable_type: favorite.favoritable_type,
    created_at: favorite.created_at,
    favoritable: favorite.favoritable || {}
  }));
};