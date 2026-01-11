// Custom hook for user authentication and authorization
import { useState, useEffect } from "react";
import { landRequestService } from "../services/landRequestService";

export function useUserAuth() {
  const [userType, setUserType] = useState(null);
  const [checkingUserType, setCheckingUserType] = useState(true);

  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = () => {
    try {
      setCheckingUserType(true);
      const storedUserType = localStorage.getItem("user_type");
      const token = localStorage.getItem("token");

      if (!token) {
        setUserType(null);
        setCheckingUserType(false);
        return;
      }

      if (storedUserType === "شركة مزادات") {
        setUserType("شركة مزادات");
        landRequestService.showError(
          "عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق أراضي"
        );
      } else {
        setUserType(storedUserType);
      }

      setCheckingUserType(false);
    } catch (err) {
      console.error("❌ خطأ في التحقق من نوع المستخدم:", err);
      setCheckingUserType(false);
      landRequestService.showError("حدث خطأ في التحقق من الصلاحيات");
    }
  };

  const isUserAllowed = () => {
    return userType !== "شركة مزادات";
  };

  return {
    userType,
    checkingUserType,
    isUserAllowed
  };
}