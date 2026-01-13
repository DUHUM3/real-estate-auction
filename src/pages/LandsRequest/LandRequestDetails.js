import React, { useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModalContext } from "../../App";
import { useToast } from "../../components/common/ToastProvider";

import { useRequestDetails } from "../../features/landrequest/landrequestdetails/hooks/useRequestDetails";
import { useOfferSubmission } from "../../features/landrequest/landrequestdetails/hooks/useOfferSubmission";
import { getTypeLabel } from "../../features/landrequest/landrequestdetails/utils/formatters";

import RequestHeader from "../../features/landrequest/landrequestdetails/components/RequestHeader";
import RequestMainInfo from "../../features/landrequest/landrequestdetails/components/RequestMainInfo";
import RequestDetailsGrid from "../../features/landrequest/landrequestdetails/components/RequestDetailsGrid";
import RequestSidebar from "../../features/landrequest/landrequestdetails/components/RequestSidebar";
import OfferFormModal from "../../features/landrequest/landrequestdetails/components/OfferFormModal";

/**
 * Main page component for land request details
 * Displays full information about a land request and allows users to submit offers
 */
const LandRequestDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);
  const toast = useToast(); // تعريف toast هنا لاستخدامه في shareItem

  // Fetch request details
  const { request, loading, error } = useRequestDetails(id);

  // Handle offer submission
  const {
    offerMessage,
    setOfferMessage,
    offerLoading,
    showOfferForm,
    handleShowOfferForm,
    handleCloseOfferForm,
    handleOfferSubmit,
  } = useOfferSubmission(id); // بدون تمرير toast كمعامل

  // Scroll to offer section if hash is present
  useEffect(() => {
    if (window.location.hash === "#offer") {
      setTimeout(() => {
        const offerSection = document.getElementById("offer");
        if (offerSection) offerSection.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, []);

  // Share functionality
  const shareItem = () => {
    const shareData = {
      title:
        request?.title || `طلب أرض - ${request?.region} - ${request?.city}`,
      text:
        request?.title ||
        `طلب أرض ${getTypeLabel(request?.type)} في ${request?.region} - ${
          request?.city
        }`,
      url: window.location.href,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("تم نسخ رابط الطلب"); // بدون الكائن الفارغ {}
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!request) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-700 text-lg mb-4">البيانات غير متوفرة</p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-6 pt-[80px]" dir="rtl">
        <RequestHeader onBack={() => navigate(-1)} onShare={shareItem} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Section: Images and Main Info */}
          <div className="lg:col-span-2">
            <RequestMainInfo request={request} />
            <RequestDetailsGrid request={request} />
          </div>

          {/* Right Section: Sidebar */}
          <RequestSidebar
            request={request}
            onShowOfferForm={() => handleShowOfferForm(openLogin)}
          />
        </div>

        {/* Offer Form Modal */}
        <OfferFormModal
          show={showOfferForm}
          offerMessage={offerMessage}
          setOfferMessage={setOfferMessage}
          offerLoading={offerLoading}
          onClose={handleCloseOfferForm}
          onSubmit={handleOfferSubmit}
        />
      </div>
    </>
  );
};

export default LandRequestDetailsPage;