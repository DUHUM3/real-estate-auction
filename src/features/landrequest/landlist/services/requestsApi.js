// API service لجلب طلبات الأراضي

const API_BASE_URL = "https://core-api-x41.shaheenplus.sa/api";

export const fetchLandRequests = async (page = 1, filters = {}) => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    per_page: filters.per_page?.toString() || "12",
  });

  // إضافة الفلاتر إلى query params
  if (filters.keyword?.trim()) {
    queryParams.append("keyword", filters.keyword.trim());
  }
  if (filters.region?.trim()) {
    queryParams.append("region", filters.region.trim());
  }
  if (filters.city?.trim()) {
    queryParams.append("city", filters.city.trim());
  }
  if (filters.purpose) {
    queryParams.append("purpose", filters.purpose);
  }
  if (filters.type) {
    queryParams.append("type", filters.type);
  }
  if (filters.area_min) {
    queryParams.append("area_min", filters.area_min);
  }
  if (filters.area_max) {
    queryParams.append("area_max", filters.area_max);
  }

  const response = await fetch(`${API_BASE_URL}/land-requests?${queryParams}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();

  return {
    requests: data.data || [],
    pagination: {
      current_page: data.pagination?.current_page || page,
      last_page: data.pagination?.last_page || 1,
      per_page: data.pagination?.per_page || filters.per_page || 12,
      total: data.pagination?.total || (data.data?.length || 0),
      links: data.pagination?.links || {
        first: null,
        last: null,
        prev: null,
        next: null,
      },
    },
  };
};