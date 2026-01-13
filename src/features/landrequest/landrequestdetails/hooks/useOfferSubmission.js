import { useState } from "react";
import { useToast } from "../../../../components/common/ToastProvider"; // تأكد من المسار
import { useNavigate } from "react-router-dom";
import { landRequestService } from "../services/landRequestService";

/**
 * Custom hook to handle offer submission logic
 */
export const useOfferSubmission = (requestId) => {
  const [offerMessage, setOfferMessage] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const navigate = useNavigate();
  const toast = useToast(); // احصل على toast هنا بدلاً من تمريره كمعامل

  const handleShowOfferForm = (openLogin) => {
    const token = localStorage.getItem("token");

    if (!token) {
      openLogin(() => {
        setShowOfferForm(true);
      });
      return;
    }

    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();

    if (!offerMessage.trim()) {
      toast.info("الرجاء كتابة تفاصيل العرض");
      return;
    }

    try {
      setOfferLoading(true);

      const token = localStorage.getItem("token");

      if (!token) {
        setOfferLoading(false);
        setShowOfferForm(false);
        navigate("/login");
        return;
      }

      const result = await landRequestService.submitOffer(
        requestId,
        offerMessage
      );

      setShowOfferForm(false);
      setOfferMessage("");
      setOfferLoading(false);
      toast.success(result.message || "تم تقديم العرض بنجاح!"); // <-- الآن سيظهر باللون الأخضر
    } catch (err) {
      toast.error(err.message || "حدث خطأ في تقديم العرض"); // <-- رسائل الخطأ من السيرفر
      toast.error(err.message || "حدث خطأ في تقديم العرض");
      setOfferLoading(false);
      setShowOfferForm(false);
    }
  };

  return {
    offerMessage,
    setOfferMessage,
    offerLoading,
    showOfferForm,
    handleShowOfferForm,
    handleCloseOfferForm,
    handleOfferSubmit,
  };
};
