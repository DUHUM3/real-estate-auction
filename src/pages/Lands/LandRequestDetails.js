import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ModalContext } from "../../App";
import { useAuth } from "../../context/AuthContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaHeart,
  FaShare,
  FaArrowLeft,
  FaCalendarAlt,
  FaBuilding,
  FaExpand,
  FaArrowRight,
  FaArrowRight as FaRight,
  FaTimes,
  FaPaperPlane,
  FaEdit,
  FaHandshake,
  FaCity,
  FaTag,
  FaUser,
  FaPhone,
  FaEnvelope,
} from "react-icons/fa";

const LandRequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);
  const { currentUser } = useAuth();

  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [offerMessage, setOfferMessage] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);

  useEffect(() => {
    fetchRequestDetails();

    if (window.location.hash === "#offer") {
      setTimeout(() => {
        const offerSection = document.getElementById("offer");
        if (offerSection) offerSection.scrollIntoView({ behavior: "smooth" });
      }, 500);
    }
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const response = await fetch(
        `https://core-api-x41.shaheenplus.sa/api/land-requests/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
      }

      const result = await response.json();
      setRequest(result.data);
      setLoading(false);
    } catch (err) {
      console.error("❌ خطأ في تحميل التفاصيل:", err);

      if (err.response?.status === 404) {
        toast.error("لم يتم العثور على الطلب", {
          position: "top-right",
          rtl: true,
        });
        setError("لم يتم العثور على الطلب");
      } else {
        toast.error("حدث خطأ أثناء تحميل تفاصيل الطلب", {
          position: "top-right",
          rtl: true,
        });
        setError("حدث خطأ أثناء تحميل تفاصيل الطلب");
      }
      setLoading(false);
    }
  };

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
      toast.success("تم نسخ رابط الطلب", {
        position: "top-right",
        rtl: true,
        autoClose: 2000,
      });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
  };

  const handleShowOfferForm = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      openLogin(() => {
        setShowOfferForm(true);
      });
      return;
    }

    setShowOfferForm(true);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();

    if (!offerMessage.trim()) {
      toast.warning("الرجاء كتابة تفاصيل العرض", {
        position: "top-right",
        rtl: true,
      });
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
      
      const response = await fetch(
        `https://core-api-x41.shaheenplus.sa/api/land-requests/${id}/offers`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: offerMessage.trim(),
          }),
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        setShowOfferForm(false);
        setOfferMessage("");
        setOfferLoading(false);
        
        toast.success("تم تقديم العرض بنجاح!", {
          position: "top-right",
          rtl: true,
          autoClose: 3000,
        });
      } else {
        const errorMessage = result.message || "حدث خطأ في تقديم العرض";
        toast.error(errorMessage, {
          position: "top-right",
          rtl: true,
          autoClose: 4000,
        });
        setShowOfferForm(false);
        setOfferLoading(false);
      }
    } catch (err) {
      console.error("❌ خطأ في تقديم العرض:", err);
      toast.error("حدث خطأ في تقديم العرض", {
        position: "top-right",
        rtl: true,
        autoClose: 4000,
      });
      setOfferLoading(false);
      setShowOfferForm(false);
    }
  };

  const getPurposeLabel = (purpose) => (purpose === "sale" ? "بيع" : "إيجار");

  const getTypeLabel = (type) => {
    switch (type) {
      case "residential":
        return "سكني";
      case "commercial":
        return "تجاري";
      case "agricultural":
        return "زراعي";
      default:
        return type;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "open":
        return "مفتوح";
      case "closed":
        return "مغلق";
      case "completed":
        return "مكتمل";
      default:
        return status;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "open";
      case "closed":
        return "closed";
      case "completed":
        return "completed";
      default:
        return "default";
    }
  };

  const formatPrice = (price) => {
    if (!price) return "0";
    return parseFloat(price).toLocaleString("ar-SA");
  };

  const getAllImages = () => {
    if (!request || !request.images) return [];
    return request.images.map((img) => img.image_path);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل تفاصيل الطلب...</p>
      </div>
    );
  }

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

  const images = getAllImages();

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-6 pt-[80px]" dir="rtl">
        {/* Header مع زر العودة والأيقونات - محسن للشاشات الصغيرة */}
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all hover:shadow-sm text-sm sm:text-base"
          >
            <FaArrowRight className="text-sm" />
            <span className="font-medium">العودة</span>
          </button>
          <div className="flex gap-2">
            <button
              className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all"
              onClick={shareItem}
              title="مشاركة"
            >
              <FaShare className="text-sm sm:text-base" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* القسم الأيسر: الصور والمعلومات الرئيسية */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            {images.length > 0 && (
              <div className="mb-4 sm:mb-6 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative"></div>
              </div>
            )}

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              {/* العنوان - محسن للشاشات الصغيرة */}
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
                <div className="flex-1">
                  <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
                    {request.title || `طلب أرض ${getTypeLabel(request.type)}`}
                  </h1>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
                    <FaTag className="text-gray-400 text-xs" />
                    <span>طلب #{request.id}</span>
                  </div>
                </div>
                <div
                  className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold ${getStatusClass(
                    request.status
                  )} ${
                    request.status === "open"
                      ? "bg-green-100 text-green-800 border border-green-200"
                      : request.status === "closed"
                      ? "bg-red-100 text-red-800 border border-red-200"
                      : "bg-gray-100 text-gray-800 border border-gray-200"
                  }`}
                >
                  {getStatusLabel(request.status)}
                </div>
              </div>

              {/* الوصف - محسن للشاشات الصغيرة */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
                  <span className="w-1 h-4 sm:h-5 bg-blue-500 rounded-full"></span>
                  الوصف
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm sm:text-base bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
                  {request.description}
                </p>
              </div>

              {/* معلومات الموقع - محسن للشاشات الصغيرة */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-amber-500 text-sm sm:text-base" />
                  الموقع
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-5">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg">
                        <FaMapMarkerAlt className="text-amber-600 text-lg sm:text-xl" />
                      </div>
                      <div>
                        <p className="text-amber-800 font-semibold mb-1 text-sm sm:text-base">
                          المنطقة
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg">{request.region}</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3 sm:p-4 md:p-5">
                    <div className="flex items-start gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <FaCity className="text-blue-600 text-lg sm:text-xl" />
                      </div>
                      <div>
                        <p className="text-blue-800 font-semibold mb-1 text-sm sm:text-base">
                          المدينة
                        </p>
                        <p className="text-gray-700 text-sm sm:text-base md:text-lg">{request.city}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* تفاصيل الطلب - محسن للشاشات الصغيرة */}
              <div className="mb-6 sm:mb-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
                  تفاصيل الطلب
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                        <FaHandshake className="text-blue-600 text-sm sm:text-base" />
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm text-gray-500 mb-1">
                          الغرض
                        </span>
                        <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                          {getPurposeLabel(request.purpose)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
                        <FaBuilding className="text-purple-600 text-sm sm:text-base" />
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm text-gray-500 mb-1">
                          النوع
                        </span>
                        <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                          {getTypeLabel(request.type)}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                        <FaRulerCombined className="text-green-600 text-sm sm:text-base" />
                      </div>
                      <div>
                        <span className="block text-xs sm:text-sm text-gray-500 mb-1">
                          المساحة المطلوبة
                        </span>
                        <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                          {formatPrice(request.area)} م²
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* القسم الأيمن: معلومات إضافية وزر العرض */}
          <div className="lg:col-span-1">
            {/* معلومات إضافية - محسنة للشاشات الصغيرة */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
                معلومات إضافية
              </h3>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 text-sm sm:text-base">تاريخ الإنشاء</span>
                  <span className="font-semibold text-gray-800 text-sm sm:text-base">
                    {formatDate(request.created_at)}
                  </span>
                </div>
              </div>
            </div>

            {/* Offer Button - محسن للشاشات الصغيرة */}
            {request.status === "open" ? (
              <div className="sticky top-4 sm:top-6" id="offer">
                <button
                  className="w-full py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] text-white font-bold rounded-xl hover:from-[#53a1dd] hover:to-[#53a1dd] transition-all text-base sm:text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  onClick={handleShowOfferForm}
                >
                  <FaHandshake className="text-lg sm:text-xl" />
                  تقديم عرض
                </button>
                <p className="text-center text-gray-500 text-xs sm:text-sm mt-2 sm:mt-3">
                  هذا الطلب مفتوح لتلقي العروض حتى تاريخ الإغلاق
                </p>
              </div>
            ) : (
              <div className="text-center py-4 sm:py-6 border border-gray-200 rounded-xl bg-gray-50">
                <div className="text-3xl sm:text-4xl mb-2 sm:mb-3">🔒</div>
                <h4 className="font-bold text-gray-700 mb-1 sm:mb-2 text-sm sm:text-base">
                  هذا الطلب {request.status === "closed" ? "مغلق" : "مكتمل"}
                </h4>
                <p className="text-gray-600 text-xs sm:text-sm">
                  لا يمكن تقديم عروض جديدة على هذا الطلب
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Offer Form Modal - محسن للشاشات الصغيرة */}
        {showOfferForm && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
                    تقديم عرض على الطلب
                  </h3>
                  <button
                    className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    onClick={handleCloseOfferForm}
                    title="إغلاق"
                  >
                    <FaTimes className="text-base sm:text-lg" />
                  </button>
                </div>

                <form onSubmit={handleOfferSubmit}>
                  <div className="mb-4 sm:mb-6">
                    <div className="flex justify-between items-center mb-2 sm:mb-3">
                      <label className="flex items-center gap-2 text-gray-700 font-medium text-sm sm:text-base">
                        <FaEdit className="text-blue-500 text-sm sm:text-base" />
                        <span>تفاصيل العرض</span>
                      </label>
                      <div
                        className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                          offerMessage.trim().length === 0
                            ? "bg-gray-100 text-gray-500"
                            : offerMessage.trim().length < 10
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {offerMessage.trim().length} حرف
                      </div>
                    </div>
                    <textarea
                      name="offerMessage"
                      value={offerMessage}
                      onChange={(e) => {
                        setOfferMessage(e.target.value);
                      }}
                      placeholder="أدخل تفاصيل العرض هنا... مثلاً: لدي أرض تناسب متطلباتك في الموقع المطلوب مع توفر جميع الخدمات..."
                      rows={4}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 resize-none transition-all text-sm sm:text-base"
                      required
                      maxLength={2000}
                    />
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center mt-2 sm:mt-3 gap-1 sm:gap-0">
                      <div className="text-xs text-gray-500">
                        اكتب وصفاً واضحاً ومفصلاً لعرضك
                      </div>
                      <div
                        className={`text-xs font-medium ${
                          offerMessage.trim().length >= 10
                            ? "text-green-500"
                            : "text-amber-500"
                        }`}
                      >
                        {offerMessage.trim().length >= 10
                          ? "✓ جاهز للإرسال"
                          : "اكتب 10 أحرف على الأقل"}
                      </div>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-3 sm:py-4 px-3 sm:px-4 bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] text-white font-bold rounded-xl hover:from-[#53a1dd] hover:to-[#53a1dd] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl text-sm sm:text-base"
                    disabled={offerLoading}
                  >
                    <FaPaperPlane className="text-sm sm:text-base" />
                    {offerLoading ? "جاري الإرسال..." : "إرسال العرض"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Image Modal - محسن للشاشات الصغيرة */}
        {showImageModal && images.length > 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-3 sm:p-4">
            <div className="relative w-full max-w-5xl">
              <button
                className="absolute top-2 sm:top-4 left-2 sm:left-4 p-2 sm:p-3 bg-white bg-opacity-90 rounded-full hover:bg-opacity-100 z-10 shadow-lg hover:shadow-xl transition-all"
                onClick={() => setShowImageModal(false)}
                title="إغلاق"
              >
                <FaTimes className="text-lg sm:text-xl" />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LandRequestDetails;