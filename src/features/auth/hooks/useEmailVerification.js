/**
 * Custom hook for email verification logic
 */

import { useState, useCallback } from "react";
import { authApi } from "../../../api/authApi";
import { toast } from "react-toastify";
import { VALIDATION_RULES } from "../constants/validation";

export const useEmailVerification = () => {
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userEmail, setUserEmail] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const handleResendCode = useCallback(async () => {
    if (!userEmail) return;
    setVerifyLoading(true);
    setVerificationError("");

    try {
      await fetch("https://core-api-x41.shaheenplus.sa/api/email/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: userEmail }),
      });
      toast.success("تم إعادة إرسال الرمز إلى بريدك الإلكتروني");
    } catch (error) {
      setVerificationError("فشل إعادة إرسال الرمز. حاول مرة أخرى");
    } finally {
      setVerifyLoading(false);
    }
  }, [userEmail]);

  const handleVerifyEmail = useCallback(
    async (password, login, onClose, onSwitchToLogin) => {
      if (!verificationCode.trim()) {
        setVerificationError("الرجاء إدخال رمز التحقق");
        return;
      }

      if (!VALIDATION_RULES.verificationCode(verificationCode)) {
        setVerificationError("الرجاء إدخال رمز مكون من 6 أرقام");
        return;
      }

      setVerifyLoading(true);
      setVerificationError("");

      try {
        const response = await authApi.verifyEmail(userEmail, verificationCode);

        if (response.verified) {
          setVerificationSuccess(true);
          setVerificationError("");

          // Auto-login after 1 second
          setTimeout(async () => {
            try {
              const loginResponse = await authApi.login(userEmail, password);

              if (loginResponse.token) {
                login(loginResponse);

                setTimeout(() => {
                  onClose();
                }, 1500);
              }
            } catch {
              setTimeout(() => {
                onSwitchToLogin();
              }, 1500);
            }
          }, 1000);
        } else {
          setVerificationError("فشل في عملية التحقق");
        }
      } catch (error) {
        setVerificationError(error.message || "حدث خطأ أثناء التحقق");
        console.error("Email verification error:", error);
      } finally {
        setVerifyLoading(false);
      }
    },
    [userEmail, verificationCode]
  );

  const startVerification = useCallback((userId, email) => {
    setUserId(userId);
    setUserEmail(email);
    setVerificationStep(true);
  }, []);

  const resetVerification = useCallback(() => {
    setVerificationStep(false);
    setVerificationCode("");
    setUserId(null);
    setUserEmail("");
    setVerificationError("");
    setVerificationSuccess(false);
  }, []);

  return {
    verificationStep,
    verificationCode,
    setVerificationCode,
    verifyLoading,
    userId,
    userEmail,
    verificationError,
    setVerificationError,
    verificationSuccess,
    handleResendCode,
    handleVerifyEmail,
    startVerification,
    resetVerification,
  };
};