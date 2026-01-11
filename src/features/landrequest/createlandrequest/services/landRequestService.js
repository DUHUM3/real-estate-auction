// API service for land requests with error handling
import { landApi } from "../../../../api/landRequestApi";

export const landRequestService = {
  async submitRequest(formData) {
    const submitData = new FormData();
    submitData.append("title", formData.title);
    submitData.append("region", formData.region);
    submitData.append("city", formData.city);
    submitData.append("purpose", formData.purpose);
    submitData.append("type", formData.type);
    submitData.append("area", formData.area);
    submitData.append("description", formData.description);
    submitData.append("terms_accepted", "true");

    return await landApi.submitLandRequest(submitData);
  },

 showError(errorObj) { 
  if (typeof errorObj === "string") return errorObj;
  if (errorObj.message) return errorObj.message;
  if (errorObj.details) return errorObj.details;
  if (errorObj.error) return errorObj.error;
  return "حدث خطأ غير متوقع";
},

handleApiError(err, openLogin) {
  if (err.response) {
    if (err.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user_type");
      openLogin?.();
      return "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى";
    }
    return err.response.data.message || "حدث خطأ في الخادم";
  } else if (err.request) {
    return "تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت";
  } else {
    return "حدث خطأ غير متوقع";
  }
}
};