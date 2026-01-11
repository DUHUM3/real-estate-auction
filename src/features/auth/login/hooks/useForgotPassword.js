// Custom hook for managing forgot password flow

import { useState } from "react";
import { toast } from "react-toastify";
import { authApi } from "../../services/authApi";
import { VALIDATION_RULES } from "../../register/constants/validation";
import { ERROR_MESSAGES } from "../constants/errorMessages";

export const useForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [generalError, setGeneralError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setFieldErrors({});
    setGeneralError("");
  };

  const validateEmail = () => {
    let errors = {};
    setGeneralError("");

    if (!email.trim()) {
      errors.email = ERROR_MESSAGES.EMAIL_REQUIRED;
    } else if (!VALIDATION_RULES.email(email.trim())) {
      errors.email = ERROR_MESSAGES.EMAIL_INVALID;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail()) return;

    setLoading(true);
    setGeneralError("");

    try {
      const response = await authApi.forgotPassword(email);

      setSuccess(true);

      toast.success(
        response.message ||
          "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
        {
          position: "top-center",
          autoClose: 5000,
        }
      );
    } catch (error) {
      console.error("Forgot password error:", error);

      if (error.status === 404 || error.status === 401) {
        setFieldErrors({
          email: ERROR_MESSAGES.EMAIL_NOT_FOUND,
        });
      } else {
        setGeneralError(error.message || ERROR_MESSAGES.FORGOT_PASSWORD_ERROR);
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setEmail("");
    setFieldErrors({});
    setGeneralError("");
    setSuccess(false);
  };

  return {
    email,
    fieldErrors,
    generalError,
    loading,
    success,
    handleEmailChange,
    handleSubmit,
    reset,
  };
};
