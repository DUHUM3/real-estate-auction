// Mock auth token function
const getToken = () => localStorage.getItem("token");

const API_BASE_URL = 'https://core-api-x41.shaheenplus.sa/api';

// Generic POST request with FormData
const postFormData = async (url, formDataObject) => {
  const token = getToken();
  const apiFormData = new FormData();

  // Append all keys dynamically
  Object.keys(formDataObject).forEach((key) => {
    const value = formDataObject[key];

    if (Array.isArray(value)) {
      value.forEach((item) => apiFormData.append(`${key}[]`, item));
    } else if (value !== undefined && value !== null && value !== "") {
      apiFormData.append(key, value);
    }
  });

  return fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/json",
    },
    body: apiFormData,
  });
};

// ---------------------- Auctions ----------------------

// Create Auction
export const createAuction = async (formData) => {
  const preparedData = {
    title: formData.title.trim(),
    start_time: formData.start_time,
    auction_date: formData.auction_date,
    address: formData.address.trim(),
    city: formData.city.trim(),
    region: formData.region.trim(),
    description: formData.description?.trim(),
    intro_link: formData.intro_link?.trim(),
    latitude: formData.latitude ? parseFloat(formData.latitude) : undefined,
    longitude: formData.longitude ? parseFloat(formData.longitude) : undefined,
    cover_image: formData.cover_image[0],
    images: formData.images,
    videos: formData.videos,
  };

  return postFormData(`${API_BASE_URL}/user/auctions`, preparedData);
};

// Get Auction Details by ID
export const getAuctionById = async (id) => {
  try {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/auctions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('فشل في جلب البيانات');
    }

    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'حدث خطأ أثناء جلب البيانات');
  }
};

// Example: Add more API calls here
export const updateAuction = async (id, formData) => {
  const preparedData = {
    title: formData.title?.trim(),
    description: formData.description?.trim(),
    // Add other fields similarly
  };

  return postFormData(`${API_BASE_URL}/user/auctions/${id}`, preparedData);
};
