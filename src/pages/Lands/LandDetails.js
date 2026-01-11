import React from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaShare,
  FaArrowLeft,
  FaCalendarAlt,
  FaInfoCircle,
  FaTag,
  FaCheckCircle,
  FaDollarSign,
  FaChartLine,
  FaCalendarDay,
} from "react-icons/fa";

// Components
import InfoCard from "../../features/lands/landsdetail/components/InfoCard";
import DimensionCard from "../../features/lands/landsdetail/components/DimensionCard";
import ImageGallery from "../../features/lands/landsdetail/components/ImageGallery";
import InterestForm from "../../features/lands/landsdetail/components/InterestForm";
import InterestResultCard from "../../features/lands/landsdetail/components/InterestResultCard";
import SaudiRiyalIcon from "../../features/lands/landsdetail/components/SaudiRiyalIcon";

// Hooks
import { useLandDetails } from "../../features/lands/landsdetail/hooks/useLandDetails";
import { useInterestForm } from "../../features/lands/landsdetail/hooks/useInterestForm";

// Constants
import { PROPERTY_PURPOSES } from "../../features/lands/landsdetail/constants/landDetailsConstants";

// Utility functions for price formatting
const formatPriceWithIcon = (price) => {
  if (!price)
    return (
      <span className="inline-flex items-center gap-1">
        <span>0</span>
        <SaudiRiyalIcon className="w-4 h-4" />
      </span>
    );

  const formattedPrice = parseFloat(price).toLocaleString("ar-SA");
  return (
    <span className="inline-flex items-center gap-1">
      <span>{formattedPrice}</span>
      <SaudiRiyalIcon className="w-4 h-4" />
    </span>
  );
};

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(date);
  } catch (e) {
    return dateString;
  }
};

// Main Land Details Page Component
const LandDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Custom hooks for data and form management
  const {
    data,
    loading,
    error,
    getAllImages,
    getImageUrl,
    hasDimensions,
    calculateTotalPrice,
  } = useLandDetails(id);

  const {
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
  } = useInterestForm(id);

  // Share functionality
  const shareItem = () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: data.title,
      text: `أرض ${data.land_type} في ${data.region} - ${data.city}`,
      url: currentUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(currentUrl);
    }
  };

  // Back navigation functionality
  const handleBack = () => {
    const lastActiveTab =
      localStorage.getItem("lastActiveTab") || location.state?.fromTab;

    if (lastActiveTab) {
      navigate("/lands", { state: { activeTab: lastActiveTab } });
    } else {
      navigate(-1);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل التفاصيل...</p>
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
            onClick={handleBack}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <p className="text-yellow-700 text-lg mb-4">البيانات غير متوفرة</p>
          <button
            onClick={handleBack}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const images = getAllImages();
  const totalPrice = calculateTotalPrice();
  const isForSale = data.purpose === PROPERTY_PURPOSES.SALE;
  const isForInvestment = data.purpose === PROPERTY_PURPOSES.INVESTMENT;

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-6 pt-[80px]" dir="rtl">
      {/* Header with back button and share */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base"
        >
          <FaArrowLeft className="text-sm" />
          <span>رجوع</span>
        </button>
        <div className="flex gap-2">
          <button
            className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={shareItem}
          >
            <FaShare className="text-sm sm:text-base" />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-6 sm:mb-8">
        <ImageGallery images={images} getImageUrl={getImageUrl} />
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* Property Header */}
        <div className="flex flex-col items-start mb-4 sm:mb-6">
          <div className="w-full mb-3">
            <div className="flex flex-wrap gap-2 mb-2">
              <div
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                  data.status === "مفتوح" || data.status === "معروض"
                    ? "bg-green-100 text-green-800 border border-green-200"
                    : data.status === "مباع" || data.status === "مغلق"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : data.status === "محجوز"
                    ? "bg-amber-100 text-amber-800 border border-amber-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {data.status}
              </div>

              <div
                className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                  isForSale
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : isForInvestment
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : "bg-gray-100 text-gray-800 border border-gray-200"
                }`}
              >
                {data.purpose}
              </div>
            </div>

            <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
              {data.title}
            </h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-gray-600 text-sm">
              <div className="flex items-center gap-1">
                <FaMapMarkerAlt className="text-amber-500 text-sm" />
                <span>
                  {data.region} - {data.city}
                </span>
              </div>
              {data.geo_location_text && (
                <div className="text-xs bg-gray-100 px-2 py-1 rounded truncate">
                  {data.geo_location_text}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6 sm:mb-8 p-3 sm:p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2 mb-2 sm:mb-3">
            <FaInfoCircle className="text-blue-500 text-sm" />
            <h3 className="font-bold text-gray-700 text-sm sm:text-base">
              الوصف
            </h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-right text-sm sm:text-base">
            {data.description || "لا يوجد وصف"}
          </p>
        </div>

        {/* Basic Property Information */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200">
            معلومات العقار الأساسية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
            <InfoCard
              icon={FaTag}
              title="نوع العقار"
              value={data.land_type}
              color="blue"
            />

            <InfoCard
              icon={FaCalendarAlt}
              title="رقم الإعلان"
              value={data.announcement_number || "غير محدد"}
              color="amber"
            />

            {data.legal_declaration && (
              <InfoCard
                icon={FaCheckCircle}
                title="الإقرار القانوني"
                value={data.legal_declaration}
                color={data.legal_declaration === "نعم" ? "green" : "amber"}
              />
            )}
          </div>
        </div>

        {/* Sale Details */}
        {isForSale && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200">
              تفاصيل البيع
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <InfoCard
                icon={FaRulerCombined}
                title="المساحة الكلية"
                value={data.total_area}
                unit="م²"
                color="blue"
              />

              <InfoCard
                icon={FaMoneyBillWave}
                title="سعر المتر المربع"
                value={formatPriceWithIcon(data.price_per_sqm)}
                color="green"
              />

              {totalPrice && (
                <InfoCard
                  icon={FaDollarSign}
                  title="السعر الإجمالي"
                  value={formatPriceWithIcon(totalPrice)}
                  color="green"
                  className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
                />
              )}
            </div>
          </div>
        )}

        {/* Investment Details */}
        {isForInvestment && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200">
              تفاصيل الاستثمار
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
              <InfoCard
                icon={FaRulerCombined}
                title="المساحة الكلية"
                value={data.total_area}
                unit="م²"
                color="blue"
              />

              <InfoCard
                icon={FaChartLine}
                title="القيمة الاستثمارية المقدرة"
                value={formatPriceWithIcon(data.estimated_investment_value)}
                color="purple"
              />

              <InfoCard
                icon={FaCalendarDay}
                title="مدة الاستثمار"
                value={data.investment_duration}
                unit="سنة"
                color="amber"
              />
            </div>
          </div>
        )}

        {/* Dimensions */}
        {hasDimensions() && (
          <div className="mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200">
              أبعاد الأرض
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3">
              {data.length_north && (
                <DimensionCard title="الطول شمالاً" value={data.length_north} />
              )}
              {data.length_south && (
                <DimensionCard title="الطول جنوباً" value={data.length_south} />
              )}
              {data.length_east && (
                <DimensionCard title="الطول شرقاً" value={data.length_east} />
              )}
              {data.length_west && (
                <DimensionCard title="الطول غرباً" value={data.length_west} />
              )}
            </div>
          </div>
        )}

        {/* Additional Information */}
        <div className="mb-6 sm:mb-8">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 pb-2 sm:pb-3 border-b border-gray-200">
            معلومات إضافية
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <FaCalendarAlt className="text-gray-500 text-sm" />
                <span className="text-gray-700 font-medium text-sm sm:text-base">
                  تاريخ الإنشاء
                </span>
              </div>
              <p className="text-gray-800 font-semibold text-sm sm:text-base">
                {formatDate(data.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Interest Button */}
        <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
          <button
            className="w-full py-3.5 sm:py-4 px-4 sm:px-6 
bg-gradient-to-r from-[#6ab3e6] to-[#3a8fcd] 
text-white font-bold rounded-xl 
hover:from-[#5aa7de] hover:to-[#2f82c3] 
transition-all text-base sm:text-lg 
shadow-md hover:shadow-lg"
            onClick={handleShowInterestForm}
          >
            {isForSale
              ? "تقديم اهتمام بالشراء"
              : isForInvestment
              ? "تقديم اهتمام بالاستثمار"
              : "تقديم اهتمام"}
          </button>

          <p className="text-center text-gray-500 mt-2 sm:mt-3 text-xs sm:text-sm">
            {isForSale
              ? "للتقديم على شراء هذا العقار، يرجى تعبئة النموذج"
              : isForInvestment
              ? "للتقديم على الاستثمار في هذا العقار، يرجى تعبئة النموذج"
              : "لتقديم اهتمامك بهذا العقار، يرجى تعبئة النموذج"}
          </p>
        </div>
      </div>

      {/* Interest Form Modal */}
      {showInterestForm && !submitResult && (
        <InterestForm
          onSubmit={handleSubmitInterest}
          onClose={handleCloseInterestForm}
          formData={formData}
          onChange={handleInputChange}
          submitting={submitting}
          isForSale={isForSale}
          isForInvestment={isForInvestment}
        />
      )}

      {/* Interest Result Modal */}
      {submitResult && (
        <InterestResultCard
          type={submitResult}
          message={resultMessage}
          details={resultDetails}
          onClose={handleCloseResult}
          isForSale={isForSale}
          isForInvestment={isForInvestment}
        />
      )}
    </div>
  );
};

export default LandDetailsPage;