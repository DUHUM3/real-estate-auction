/**
 * Custom hook for registration form state and validation
 */

import { useState, useCallback, useMemo } from "react";
import { VALIDATION_RULES, PASSWORD_REQUIREMENTS } from "../constants/validation";

const INITIAL_FORM_DATA = {
  full_name: "",
  email: "",
  password: "",
  password_confirmation: "",
  phone: "",
  national_id: "",
  user_type_id: 1,
  agency_number: "",
  entity_name: "",
  business_name: "",
  commercial_register: "",
  commercial_file: null,
  license_number: "",
  license_file: null,
  auction_name: "",
};

export const useRegisterForm = (initialUserType = 1) => {
  const [userTypeId, setUserTypeId] = useState(initialUserType);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    ...INITIAL_FORM_DATA,
    user_type_id: initialUserType,
  });
  const [fieldErrors, setFieldErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});

  // Calculate password strength
  const passwordStrength = useMemo(() => {
    if (!formData.password) return { score: 0, feedback: "" };

    let score = 0;
    const feedback = [];

    PASSWORD_REQUIREMENTS.forEach((req) => {
      if (req.regex.test(formData.password)) {
        score += 1;
      } else {
        feedback.push(req.label);
      }
    });

    let strength = "";
    if (score === 5) strength = "قوية جداً";
    else if (score >= 4) strength = "قوية";
    else if (score >= 3) strength = "متوسطة";
    else if (score >= 2) strength = "ضعيفة";
    else strength = "ضعيفة جداً";

    return {
      score,
      total: PASSWORD_REQUIREMENTS.length,
      feedback:
        feedback.length > 0
          ? `مطلوب: ${feedback.join(", ")}`
          : `ممتاز! كلمة المرور ${strength}`,
      strength,
      isStrong: score >= 4,
      isValidForRegistration: score >= 3,
    };
  }, [formData.password]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, files } = e.target;

    if (type === "file") {
      const file = files[0];
      setFormData((prev) => ({ ...prev, [name]: file }));

      if (file) {
        setUploadedFiles((prev) => ({
          ...prev,
          [name]: {
            name: file.name,
            size: (file.size / 1024).toFixed(1) + " كيلوبايت",
            type: file.type,
          },
        }));
      } else {
        setUploadedFiles((prev) => ({ ...prev, [name]: null }));
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  // Validate current step
  const validateCurrentStep = useCallback(() => {
    let errors = {};
    let isValid = true;

    if (currentStep === 1) {
      // Personal info validation
      if (!formData.full_name.trim()) {
        errors.full_name = "الرجاء إدخال الاسم الكامل";
        isValid = false;
      } else if (formData.full_name.trim().split(" ").length < 2) {
        errors.full_name = "الرجاء إدخال الاسم الكامل (الاسم الأول والاسم الأخير على الأقل)";
        isValid = false;
      }

      if (!formData.phone.trim()) {
        errors.phone = "الرجاء إدخال رقم الجوال";
        isValid = false;
      } else if (!VALIDATION_RULES.phone(formData.phone.trim())) {
        errors.phone = "رقم الجوال يجب أن يبدأ بـ 05 ويحتوي على 10 أرقام";
        isValid = false;
      }

      if ([2, 3, 4, 5, 6].includes(userTypeId)) {
        if (!formData.national_id.trim()) {
          errors.national_id = "الرجاء إدخال رقم الهوية";
          isValid = false;
        } else if (!VALIDATION_RULES.nationalId(formData.national_id.trim())) {
          errors.national_id = "رقم الهوية يجب أن يحتوي على 10 أرقام";
          isValid = false;
        }
      }

      if (userTypeId === 3 && !formData.agency_number.trim()) {
        errors.agency_number = "الرجاء إدخال رقم الوكالة";
        isValid = false;
      }
    } else if (currentStep === 2) {
      // Business info validation
      if (userTypeId === 4) {
        if (!formData.business_name.trim()) {
          errors.business_name = "الرجاء إدخال اسم المنشأة";
          isValid = false;
        }
        if (!formData.commercial_register.trim()) {
          errors.commercial_register = "الرجاء إدخال رقم السجل التجاري";
          isValid = false;
        }
        if (!formData.commercial_file) {
          errors.commercial_file = "الرجاء رفع ملف السجل التجاري";
          isValid = false;
        }
      } else if (userTypeId === 5) {
        if (!formData.license_number.trim()) {
          errors.license_number = "الرجاء إدخال رقم الترخيص العقاري";
          isValid = false;
        }
        if (!formData.license_file) {
          errors.license_file = "الرجاء رفع ملف الترخيص العقاري";
          isValid = false;
        }
      } else if (userTypeId === 6) {
        if (!formData.auction_name.trim()) {
          errors.auction_name = "الرجاء إدخال اسم شركة المزادات";
          isValid = false;
        }
        if (!formData.entity_name.trim()) {
          errors.entity_name = "الرجاء إدخال اسم الكيان";
          isValid = false;
        }
        if (!formData.commercial_register.trim()) {
          errors.commercial_register = "الرجاء إدخال رقم السجل التجاري";
          isValid = false;
        }
        if (!formData.commercial_file) {
          errors.commercial_file = "الرجاء رفع ملف السجل التجاري";
          isValid = false;
        }
        if (!formData.license_number.trim()) {
          errors.license_number = "الرجاء إدخال رقم الترخيص";
          isValid = false;
        }
        if (!formData.license_file) {
          errors.license_file = "الرجاء رفع ملف الترخيص";
          isValid = false;
        }
      }
    } else if (currentStep === 3 || (currentStep === 2 && ![4, 5, 6].includes(userTypeId))) {
      // Login credentials validation
      if (!formData.email.trim()) {
        errors.email = "الرجاء إدخال البريد الإلكتروني";
        isValid = false;
      } else if (!VALIDATION_RULES.email(formData.email.trim())) {
        errors.email = "صيغة البريد الإلكتروني غير صحيحة";
        isValid = false;
      }

      if (!formData.password.trim()) {
        errors.password = "الرجاء إدخال كلمة المرور";
        isValid = false;
      } else if (passwordStrength.score < 3) {
        errors.password = "كلمة المرور ضعيفة جداً، الرجاء اختيار كلمة مرور أقوى";
        isValid = false;
      }

      if (!formData.password_confirmation.trim()) {
        errors.password_confirmation = "الرجاء تأكيد كلمة المرور";
        isValid = false;
      } else if (formData.password !== formData.password_confirmation) {
        errors.password_confirmation = "كلمات المرور غير متطابقة";
        isValid = false;
      }
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return isValid;
  }, [currentStep, formData, userTypeId, passwordStrength]);

  // Handle user type change
  const handleUserTypeChange = useCallback((typeId) => {
    const numericTypeId = parseInt(typeId);
    setUserTypeId(numericTypeId);
    setCurrentStep(1);
    setFormData({
      ...INITIAL_FORM_DATA,
      user_type_id: numericTypeId,
    });
    setFieldErrors({});
    setUploadedFiles({});
  }, []);

  // Navigation
  const nextStep = useCallback(() => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => prev + 1);
      return true;
    }
    return false;
  }, [validateCurrentStep]);

  const prevStep = useCallback(() => {
    setCurrentStep((prev) => prev - 1);
  }, []);

  const getMaxSteps = useCallback(() => {
    return [4, 5, 6].includes(userTypeId) ? 3 : 2;
  }, [userTypeId]);

  return {
    userTypeId,
    currentStep,
    formData,
    fieldErrors,
    uploadedFiles,
    passwordStrength,
    handleChange,
    handleUserTypeChange,
    validateCurrentStep,
    nextStep,
    prevStep,
    getMaxSteps,
    setFieldErrors,
    setCurrentStep,
  };
};