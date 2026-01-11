// Custom hook for form state management and validation
import { useState, useEffect } from "react";
import { INITIAL_FORM_DATA } from "../constants/formSteps";
import { landRequestService } from "../services/landRequestService";

// Utility function to convert Arabic numbers to English
const convertArabicNumbersToEnglish = (value) => {
  const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
  const englishNumbers = "0123456789";
  return value.replace(/[٠-٩]/g, (char) => englishNumbers[arabicNumbers.indexOf(char)]);
};



export function useLandRequestForm(availableCities, toast) {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [formTouched, setFormTouched] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    let newValue = value;

    // Convert Arabic numbers to English for area field
    if (name === "area") {
      newValue = convertArabicNumbersToEnglish(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));

    setFormTouched(true);
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData(INITIAL_FORM_DATA);
    setError(null);
    setResponseData(null);
    setFormTouched(false);
    setCurrentStep(1);
  };

  

  const submitForm = async (userType, openLogin) => {
    setError(null);

    if (userType === "شركة مزادات") {
      toast.error("عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق أراضي");
      return;
    }

    if (!formData.title || !formData.region || !formData.city || !formData.area || !formData.description) {
      toast.error("جميع الحقول مطلوبة");
      return;
    }

    if (!formData.terms_accepted) {
      toast.error("يجب الموافقة على الشروط والأحكام");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("يجب تسجيل الدخول أولاً");
      openLogin();
      return;
    }

    try {
      setLoading(true);
      toast.info("جاري إنشاء طلب الأرض...");

      const response = await landRequestService.submitRequest(formData);
      setResponseData(response);
      setSuccess(true);
      toast.success("تم إنشاء طلب الأرض بنجاح!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ خطأ في إنشاء طلب الأرض:", err);
      const errorMessage = landRequestService.handleApiError(err, openLogin);
      setError(errorMessage);
      toast.error(errorMessage || "حدث خطأ أثناء إرسال الطلب");
    } finally {
      setLoading(false);
    }
  };

  // Validation helpers
  const isStep1Valid = formData.title && formData.region && formData.city;
  const isStep2Valid = formData.purpose && formData.type && formData.area;
  const isStep3Valid = formData.description && formData.terms_accepted;
  const isFormValid = isStep1Valid && isStep2Valid && isStep3Valid;

  return {
    formData,
    loading,
    error,
    success,
    responseData,
    formTouched,
    currentStep,
    handleInputChange,
    resetForm,
    submitForm,
    setCurrentStep,
    isStep1Valid,
    isStep2Valid,
    isStep3Valid,
    isFormValid
  };
}
