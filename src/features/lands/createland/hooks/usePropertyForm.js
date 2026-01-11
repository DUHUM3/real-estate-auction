// Main form state and validation logic

import { useState } from "react";
import { useToast } from "../../../../components/common/ToastProvider"; 
import { useNavigate } from "react-router-dom";
import { INITIAL_FORM_DATA, VALIDATION_RULES } from "../constants/formConfig";
import { propertyService } from "../services/propertyService";

export function usePropertyForm(currentUser) {
  const navigate = useNavigate();
  const toast = useToast();
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return Boolean(
        formData.announcement_number &&
          formData.region &&
          formData.city &&
          formData.title
      );
    } else if (currentStep === 2) {
      const totalArea = parseFloat(formData.total_area) || 0;
      if (totalArea < VALIDATION_RULES.MIN_AREA) {
        return false;
      }
      return Boolean(
        formData.total_area &&
          formData.geo_location_text &&
          formData.deed_number
      );
    } else if (currentStep === 3) {
      if (formData.purpose === "بيع") {
        return Boolean(formData.price_per_sqm);
      } else if (formData.purpose === "استثمار") {
        const investmentFieldsValid = Boolean(
          formData.investment_duration && formData.estimated_investment_value
        );

        if (currentUser?.user_type === "وكيل شرعي") {
          return investmentFieldsValid && Boolean(formData.agency_number);
        }

        return investmentFieldsValid;
      }
      return true;
    } else if (currentStep === 4) {
      return Boolean(formData.cover_image && formData.legal_declaration);
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setFormComplete(true);
      }
    } else {
      toast.error("يرجى إكمال جميع الحقول المطلوبة قبل الانتقال للخطوة التالية");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFieldChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      });
      if (name === "legal_declaration" && checked) {
        toast.success("تم الموافقة على الإقرار القانوني");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async () => {
    const totalArea = parseFloat(formData.total_area) || 0;
    if (totalArea < VALIDATION_RULES.MIN_AREA) {
      toast.error("يجب أن تكون المساحة 5000 متر مربع على الأقل");
      setCurrentStep(2);
      return;
    }

    setFormLoading(true);
    const loadingToast = toast.loading("جاري إضافة الإعلان...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً");
        navigate("/login");
        return;
      }

      const preparedFormData = propertyService.prepareFormData(
        formData,
        currentUser
      );

      await propertyService.createProperty(preparedFormData, token);

      toast.dismiss(loadingToast);
      toast.success("تم إضافة الإعلان بنجاح");
      resetForm();
      setTimeout(() => {
        navigate("/my-ads");
      }, 1500);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.message || "حدث خطأ في الإتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setFormLoading(false);
      setFormComplete(false);
    }
  };

  const resetForm = () => {
    setFormData(INITIAL_FORM_DATA);
    setCurrentStep(1);
    setFormComplete(false);
  };

  return {
    formData,
    setFormData,
    currentStep,
    formComplete,
    formLoading,
    validateCurrentStep,
    handleNextStep,
    handlePrevStep,
    handleFieldChange,
    handleSubmit,
    resetForm,
  };
}