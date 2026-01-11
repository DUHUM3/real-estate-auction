// Custom hook for managing login form state and logic

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../context/AuthContext";
import { authApi } from "../../services/authApi";
import { VALIDATION_RULES } from "../../register/constants/validation";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const useLoginForm = (onClose) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const [generalError, setGeneralError] = useState("");
  const [accountStatusError, setAccountStatusError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFieldErrors({
      ...fieldErrors,
      [name]: "",
    });
    setGeneralError("");
    setAccountStatusError("");
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validateFields = () => {
    let errors = {};
    setGeneralError("");
    setAccountStatusError("");

    if (!formData.email.trim()) {
      errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!VALIDATION_RULES.email(formData.email.trim())) {
      errors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    if (!formData.password.trim()) {
      errors.password = ERROR_MESSAGES.PASSWORD_REQUIRED;
    } else if (formData.password.length < 8) {
      errors.password = ERROR_MESSAGES.PASSWORD_MIN_LENGTH;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateFields()) return;

    setLoading(true);
    setGeneralError("");
    setAccountStatusError("");
    setFieldErrors({
      email: "",
      password: "",
    });

    try {
      const data = await authApi.login(formData.email, formData.password);

      const userData = {
        id: data.user.id,
        full_name: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone,
        user_type: data.user.user_type,
        status: data.user.status,
        access_token: data.access_token,
        token_type: data.token_type,
        expires_at: data.expires_at,
      };

      login(userData);

      if (onClose) onClose();

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error);

      // حالة 429 - Too Many Requests
      if (error.status === 429 || error.status === 429) {
        setGeneralError(error.message || ERROR_MESSAGES.TOO_MANY_REQUESTS);
        return;
      }

      // حالة 401 - بيانات الدخول غير صحيحة
      if (error.status === 401) {
        setFieldErrors({
          email: ERROR_MESSAGES.CREDENTIALS_INVALID,
          password: ERROR_MESSAGES.CREDENTIALS_INVALID,
        });
        return;
      }

      // حالة 403 - حساب غير مفعل أو قيد المراجعة
      if (error.status === 403) {
        const errorMessage = error.message || "";

        // الحساب غير مفعل (البريد غير موثق)
        if (
          errorMessage.includes("يرجى التحقق من بريدك الإلكتروني أولاً") ||
          errorMessage.includes("email") ||
          errorMessage.includes("تحقق") ||
          errorMessage.includes("verify")
        ) {
          setAccountStatusError("unverified");
        }
        // الحساب قيد المراجعة
        else if (
          errorMessage.includes("الحساب قيد المراجعة") ||
          errorMessage.includes("pending") ||
          errorMessage.includes("مراجعة")
        ) {
          setAccountStatusError("pending");
        }
        // حالات 403 أخرى
        else {
          setGeneralError(
            errorMessage || "الحساب غير مفعل. يرجى التواصل مع الدعم الفني."
          );
        }
        return;
      }

      // أخطاء الشبكة أو أخطاء غير متوقعة
      if (
        error.message?.toLowerCase().includes("network") ||
        error.message?.toLowerCase().includes("timeout")
      ) {
        setGeneralError(ERROR_MESSAGES.NETWORK_ERROR);
      } else {
        setGeneralError(error.message || ERROR_MESSAGES.GENERIC_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    fieldErrors,
    generalError,
    accountStatusError,
    loading,
    showPassword,
    handleChange,
    togglePasswordVisibility,
    handleSubmit,
  };
};
