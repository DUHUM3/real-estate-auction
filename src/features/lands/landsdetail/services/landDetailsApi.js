// API service for Land Details operations
const API_BASE_URL = "https://core-api-x41.shaheenplus.sa/api";

export const landDetailsApi = {
  // Fetch property details by ID
  async getProperty(id) {
    const url = `${API_BASE_URL}/properties/${id}`;
    const headers = { "Content-Type": "application/json" };
    
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }

    const result = await response.json();
    
    if (!result.status) {
      throw new Error("البيانات غير متوفرة");
    }

    return result.data;
  },

  // Submit interest for a property
  async submitInterest(propertyId, formData) {
    const requestData = {
      full_name: formData.full_name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    };

    const headers = { "Content-Type": "application/json" };
    
    const token = localStorage.getItem("token");
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(
      `${API_BASE_URL}/properties/${propertyId}/interest`,
      {
        method: "POST",
        headers: headers,
        body: JSON.stringify(requestData),
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      const errorMessage = result.message || result.error || "حدث خطأ أثناء إرسال الطلب";
      throw new Error(errorMessage);
    }

    return result;
  }
};