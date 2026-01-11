import { useState, useContext } from "react";
import { ModalContext } from "../../../../App";
import { useAuth } from "../../../../context/AuthContext";
import { landDetailsApi } from "../services/landDetailsApi";
import { FORM_VALIDATION, USER_TYPES, SUBMISSION_STATES } from "../constants/landDetailsConstants";

// Custom hook for managing interest form logic
export const useInterestForm = (propertyId) => {
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth();

  const [showInterestForm, setShowInterestForm] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);
  const [resultMessage, setResultMessage] = useState("");
  const [resultDetails, setResultDetails] = useState("");

  // Get current user type
  const getCurrentUserType = () => {
    return currentUser?.user_type || localStorage.getItem("user_type");
  };

  // Handle showing interest form
  const handleShowInterestForm = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      openLogin(() => {
        const userType = getCurrentUserType();

        if (userType === USER_TYPES.AUCTION_COMPANY) {
          setSubmitResult(SUBMISSION_STATES.ERROR);
          setResultMessage("غير مسموح لشركات المزادات");
          setResultDetails(
            "عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات"
          );
          return;
        }

        populateUserData();
        setShowInterestForm(true);
      });
      return;
    }

    const userType = getCurrentUserType();

    if (userType === USER_TYPES.AUCTION_COMPANY) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("غير مسموح لشركات المزادات");
      setResultDetails(
        "عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات"
      );
      return;
    }

    populateUserData();
    setShowInterestForm(true);
  };

  // Populate form with user data
  const populateUserData = () => {
    const userData =
      currentUser || JSON.parse(localStorage.getItem("userData") || "{}");
    setFormData((prev) => ({
      ...prev,
      full_name: userData.name || userData.full_name || "",
      phone: userData.phone || "",
      email: userData.email || "",
    }));
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validate form data
  const validateForm = () => {
    const trimmedMessage = formData.message.trim();

    if (trimmedMessage.length < FORM_VALIDATION.MIN_MESSAGE_LENGTH) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("رسالة قصيرة جداً");
      setResultDetails("الرسالة يجب أن تكون أكثر من 10 أحرف");
      return false;
    }

    if (trimmedMessage.length > FORM_VALIDATION.MAX_MESSAGE_LENGTH) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("رسالة طويلة جداً");
      setResultDetails("الرسالة يجب أن تكون أقل من 2000 حرف");
      return false;
    }

    if (!formData.full_name.trim()) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("الاسم مطلوب");
      setResultDetails("يرجى إدخال الاسم الكامل");
      return false;
    }

    if (!formData.phone.trim()) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("رقم الهاتف مطلوب");
      setResultDetails("يرجى إدخال رقم الهاتف");
      return false;
    }

    if (!formData.email.trim()) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("البريد الإلكتروني مطلوب");
      setResultDetails("يرجى إدخال البريد الإلكتروني");
      return false;
    }

    return true;
  };

  // Handle form submission
  const handleSubmitInterest = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const userType = getCurrentUserType();
    if (userType === USER_TYPES.AUCTION_COMPANY) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("غير مسموح لشركات المزادات");
      setResultDetails(
        "عذراً، شركات المزادات غير مسموح لها بتقديم اهتمام على العقارات"
      );
      return;
    }

    setSubmitting(true);
    setSubmitResult(null);

    try {
      await landDetailsApi.submitInterest(propertyId, formData);

      setSubmitResult(SUBMISSION_STATES.SUCCESS);
      setResultMessage("تم تقديم اهتمامك بنجاح ✓");
      setResultDetails("تم تسجيل اهتمامك وسيتم التواصل معك قريباً");

      // Auto close after 3 seconds if not manually closed
      setTimeout(() => {
        if (submitResult === SUBMISSION_STATES.SUCCESS) {
          handleCloseResult();
        }
      }, 3000);
    } catch (error) {
      setSubmitResult(SUBMISSION_STATES.ERROR);
      setResultMessage("فشل في التقديم ❌");
      setResultDetails(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  // Close interest form
  const handleCloseInterestForm = () => {
    setShowInterestForm(false);
    setFormData({
      full_name: "",
      phone: "",
      email: "",
      message: "",
    });
    setSubmitting(false);
  };

  // Close result modal
  const handleCloseResult = () => {
    setSubmitResult(null);
    setResultMessage("");
    setResultDetails("");
    setShowInterestForm(false);
    setFormData({
      full_name: "",
      phone: "",
      email: "",
      message: "",
    });
  };

  return {
    showInterestForm,
    formData,
    submitting,
    submitResult,
    resultMessage,
    resultDetails,
    handleShowInterestForm,
    handleInputChange,
    handleSubmitInterest,
    handleCloseInterestForm,
    handleCloseResult,
  };
};