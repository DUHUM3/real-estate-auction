import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaFileAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaImage,
  FaPlus,
  FaExclamationTriangle,
  FaChevronRight,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { locationService } from "../utils/LocationForFiltters";

function CreatePropertyAd() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [adFormData, setAdFormData] = useState({
    announcement_number: "",
    region: "",
    city: "",
    title: "",
    land_type: "سكني",
    purpose: "بيع",
    geo_location_text: "",
    total_area: "",
    length_north: "",
    length_south: "",
    length_east: "",
    length_west: "",
    description: "",
    deed_number: "",
    price_per_sqm: "",
    investment_duration: "",
    estimated_investment_value: "",
    agency_number: "",
    legal_declaration: false,
    cover_image: null,
    images: [],
  });

  useEffect(() => {
    const allRegions = locationService.getRegions();
    setRegions(allRegions);
  }, []);

  useEffect(() => {
    if (adFormData.region) {
      const citiesObject = locationService.getCitiesByRegion();
      const regionCities = citiesObject[adFormData.region] || [];
      setCities(regionCities);

      if (!regionCities.includes(adFormData.city)) {
        setAdFormData((prev) => ({
          ...prev,
          city: "",
        }));
      }
    } else {
      setCities([]);
    }
  }, [adFormData.region, adFormData.city]);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setAdFormData((prev) => ({
      ...prev,
      region: region,
      city: "",
    }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setAdFormData((prev) => ({
      ...prev,
      city: city,
    }));
  };

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return Boolean(
        adFormData.announcement_number &&
          adFormData.region &&
          adFormData.city &&
          adFormData.title
      );
    } else if (currentStep === 2) {
      const totalArea = parseFloat(adFormData.total_area) || 0;
      if (totalArea < 5000) {
        return false;
      }
      return Boolean(
        adFormData.total_area &&
          adFormData.geo_location_text &&
          adFormData.deed_number
      );
    } else if (currentStep === 3) {
      if (adFormData.purpose === "بيع") {
        return Boolean(adFormData.price_per_sqm);
      } else if (adFormData.purpose === "استثمار") {
        const investmentFieldsValid = Boolean(
          adFormData.investment_duration &&
            adFormData.estimated_investment_value
        );

        if (currentUser?.user_type === "وكيل شرعي") {
          return investmentFieldsValid && Boolean(adFormData.agency_number);
        }

        return investmentFieldsValid;
      }
      return true;
    } else if (currentStep === 4) {
      return Boolean(adFormData.cover_image && adFormData.legal_declaration);
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        setFormComplete(true);
        toast.success("تم استكمال جميع البيانات بنجاح!");
      }
    } else {
      toast.error(
        "يرجى إكمال جميع الحقول المطلوبة قبل الانتقال للخطوة التالية"
      );
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddAd = async () => {
    const totalArea = parseFloat(adFormData.total_area) || 0;
    if (totalArea < 5000) {
      toast.error("يجب أن تكون المساحة 5000 متر مربع على الأقل");
      setCurrentStep(2);
      return;
    }

    setFormLoading(true);
    const loadingToast = toast.loading("جاري إضافة الإعلان...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      const commonFields = [
        "announcement_number",
        "region",
        "city",
        "title",
        "land_type",
        "purpose",
        "geo_location_text",
        "total_area",
        "length_north",
        "length_south",
        "length_east",
        "length_west",
        "description",
        "deed_number",
        "legal_declaration",
      ];

      commonFields.forEach((field) => {
        if (typeof adFormData[field] === "boolean") {
          formData.append(field, adFormData[field] ? "true" : "false");
        } else if (
          adFormData[field] !== null &&
          adFormData[field] !== undefined
        ) {
          formData.append(field, adFormData[field]);
        }
      });

      if (adFormData.purpose === "بيع") {
        formData.append("price_per_sqm", adFormData.price_per_sqm);
      } else if (adFormData.purpose === "استثمار") {
        formData.append("investment_duration", adFormData.investment_duration);
        formData.append(
          "estimated_investment_value",
          adFormData.estimated_investment_value
        );

        if (
          currentUser?.user_type === "وكيل شرعي" &&
          adFormData.agency_number
        ) {
          formData.append("agency_number", adFormData.agency_number);
        }
      }

      if (adFormData.cover_image) {
        formData.append("cover_image", adFormData.cover_image);
      }

      if (adFormData.images && adFormData.images.length > 0) {
        adFormData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      const response = await fetch(
        "https://core-api-x41.shaheenplus.sa/api/user/properties",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const result = await response.json();

      if (response.ok && result.status) {
        toast.dismiss(loadingToast);
        toast.success("تم إضافة الإعلان بنجاح");
        resetForm();
        setTimeout(() => {
          navigate("/my-ads");
        }, 1500);
      } else {
        toast.dismiss(loadingToast);
        const errorMessage = result.message || "فشل في إضافة الإعلان";
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("حدث خطأ في الإتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setFormLoading(false);
      setFormComplete(false);
    }
  };

  const resetForm = () => {
    setAdFormData({
      announcement_number: "",
      region: "",
      city: "",
      title: "",
      land_type: "سكني",
      purpose: "بيع",
      geo_location_text: "",
      total_area: "",
      length_north: "",
      length_south: "",
      length_east: "",
      length_west: "",
      description: "",
      deed_number: "",
      price_per_sqm: "",
      investment_duration: "",
      estimated_investment_value: "",
      agency_number: "",
      legal_declaration: false,
      cover_image: null,
      images: [],
    });
    setCurrentStep(1);
    setFormComplete(false);
  };

  const handleAdChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (name === "cover_image") {
        setAdFormData({
          ...adFormData,
          cover_image: files[0],
        });
      } else if (name === "images") {
        setAdFormData({
          ...adFormData,
          images: Array.from(files),
        });
        toast.success(`تم رفع ${files.length} صورة إضافية`);
      }
    } else if (type === "checkbox") {
      setAdFormData({
        ...adFormData,
        [name]: checked,
      });
      if (name === "legal_declaration" && checked) {
        toast.success("تم الموافقة على الإقرار القانوني");
      }
    } else {
      setAdFormData({
        ...adFormData,
        [name]: value,
      });
    }
  };

  const handleBackToAds = () => {
    navigate("/my-ads");
  };

  const handleCancel = () => {
    toast.error("تم إلغاء عملية الإضافة");
    navigate("/my-ads");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        draggable
        rtl
        pauseOnHover
        theme="light"
        style={{
          top: "80px",
          right: "10px",
          zIndex: 999999,
        }}
      />

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {formLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">
                جاري إضافة الإعلان...
              </p>
            </div>
          ) : formComplete ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaCheck className="text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                تم استكمال جميع البيانات
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
                يمكنك الآن إضافة الإعلان الجديد أو العودة لتعديل البيانات
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow"
                  onClick={handlePrevStep}
                >
                  <FaArrowRight /> العودة للتعديل
                </button>
                <button
                  type="button"
                  className="px-8 py-3 bg-gradient-to-r from-[#53a1dd] to-[#478bc5] text-white rounded-xl hover:from-[#478bc5] hover:to-[#3d7ab0] transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  onClick={handleAddAd}
                >
                  <FaPlus /> إضافة الإعلان
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-6 sm:p-8">
                {/* Form Steps */}
                <div className="mb-8">
                  {" "}
                  {/* أضفت mt-8 */}
                  <div className="flex items-center justify-between relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                    {[1, 2, 3, 4].map((step) => (
                      <React.Fragment key={step}>
                        <div className="relative z-10 flex flex-col items-center bg-white px-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300 ${
                              currentStep >= step
                                ? "bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white scale-110"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {currentStep > step ? (
                              <FaCheck className="text-lg" />
                            ) : (
                              <span className="font-bold">{step}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium text-center transition-colors ${
                              currentStep >= step
                                ? "text-[#53a1dd]"
                                : "text-gray-400"
                            }`}
                          >
                            {step === 1
                              ? "المعلومات"
                              : step === 2
                              ? "المساحة"
                              : step === 3
                              ? "المالية"
                              : "الصور"}
                          </span>
                        </div>

                        {step < 4 && (
                          <div className="hidden md:block">
                            <FaChevronRight
                              className={`text-lg transition-colors ${
                                currentStep > step
                                  ? "text-[#53a1dd]"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    {/* Step 1 */}
                    {currentStep === 1 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaFileAlt className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              المعلومات الأساسية
                            </h3>
                            <p className="text-gray-500 text-sm">
                              أدخل المعلومات الأساسية للأرض
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              رقم الإعلان{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="announcement_number"
                              value={adFormData.announcement_number}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="أدخل رقم الإعلان"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              المنطقة <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="region"
                              value={adFormData.region}
                              onChange={handleRegionChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                            >
                              <option value="">اختر المنطقة</option>
                              {regions.map((region) => (
                                <option key={region} value={region}>
                                  {region}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              المدينة <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="city"
                              value={adFormData.city}
                              onChange={handleCityChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all disabled:bg-gray-100"
                              disabled={!adFormData.region}
                            >
                              <option value="">اختر المدينة</option>
                              {cities.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              عنوان الإعلان{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={adFormData.title}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="أدخل عنوان الإعلان"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              نوع الأرض <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="land_type"
                              value={adFormData.land_type}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                            >
                              <option value="سكني">سكني</option>
                              <option value="تجاري">تجاري</option>
                              <option value="زراعي">زراعي</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الغرض <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="purpose"
                              value={adFormData.purpose}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                            >
                              <option value="بيع">بيع</option>
                              <option value="استثمار">استثمار</option>
                            </select>
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الوصف
                            </label>
                            <textarea
                              name="description"
                              value={adFormData.description}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              rows="4"
                              placeholder="أدخل وصفاً مفصلاً عن الأرض"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaRulerCombined className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              المساحة والموقع
                            </h3>
                            <p className="text-gray-500 text-sm">
                              أدخل تفاصيل المساحة والموقع
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              المساحة الإجمالية (م²){" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="total_area"
                              value={adFormData.total_area}
                              onChange={handleAdChange}
                              required
                              min="5000"
                              step="0.01"
                              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all ${
                                adFormData.total_area &&
                                parseFloat(adFormData.total_area) < 5000
                                  ? "border-red-500 bg-red-50"
                                  : "border-gray-200"
                              }`}
                              placeholder="أدخل المساحة الإجمالية"
                            />
                            <div className="mt-2">
                              {adFormData.total_area &&
                              parseFloat(adFormData.total_area) < 5000 ? (
                                <div className="flex items-center gap-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                                  <FaExclamationTriangle />
                                  <span className="font-medium">
                                    يجب أن تكون المساحة 5000 م² على الأقل
                                  </span>
                                </div>
                              ) : (
                                <p className="text-gray-500 text-sm">
                                  <span className="font-medium">ملاحظة:</span>{" "}
                                  الحد الأدنى 5000 م²
                                </p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              رقم الصك <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="deed_number"
                              value={adFormData.deed_number}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="أدخل رقم الصك"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الطول شمال (م)
                            </label>
                            <input
                              type="number"
                              name="length_north"
                              value={adFormData.length_north}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="الطول شمال"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الطول جنوب (م)
                            </label>
                            <input
                              type="number"
                              name="length_south"
                              value={adFormData.length_south}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="الطول جنوب"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الطول شرق (م)
                            </label>
                            <input
                              type="number"
                              name="length_east"
                              value={adFormData.length_east}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="الطول شرق"
                              step="0.01"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الطول غرب (م)
                            </label>
                            <input
                              type="number"
                              name="length_west"
                              value={adFormData.length_west}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="الطول غرب"
                              step="0.01"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الموقع الجغرافي (وصف){" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="geo_location_text"
                              value={adFormData.geo_location_text}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="أدخل وصف الموقع الجغرافي"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaMoneyBillWave className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              التفاصيل المالية
                            </h3>
                            <p className="text-gray-500 text-sm">
                              أدخل التفاصيل المالية للإعلان
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          {adFormData.purpose === "بيع" ? (
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                سعر المتر المربع (ريال){" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                name="price_per_sqm"
                                value={adFormData.price_per_sqm}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                                placeholder="أدخل سعر المتر المربع"
                              />
                              {adFormData.price_per_sqm &&
                                adFormData.total_area && (
                                  <div className="mt-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                                    <p className="text-blue-700 font-bold text-lg">
                                      السعر الإجمالي:{" "}
                                      <span className="text-2xl">
                                        {(
                                          parseFloat(adFormData.price_per_sqm) *
                                          parseFloat(adFormData.total_area)
                                        ).toLocaleString()}
                                      </span>{" "}
                                      ريال
                                    </p>
                                  </div>
                                )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  مدة الاستثمار (شهر){" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="investment_duration"
                                  value={adFormData.investment_duration}
                                  onChange={handleAdChange}
                                  required
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                                  placeholder="أدخل مدة الاستثمار بالأشهر"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                  القيمة الاستثمارية المتوقعة (ريال){" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="estimated_investment_value"
                                  value={adFormData.estimated_investment_value}
                                  onChange={handleAdChange}
                                  required
                                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                                  placeholder="أدخل القيمة الاستثمارية المتوقعة"
                                />
                              </div>
                              {currentUser?.user_type === "وكيل شرعي" && (
                                <div className="md:col-span-2">
                                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    رقم الوكالة{" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="agency_number"
                                    value={adFormData.agency_number}
                                    onChange={handleAdChange}
                                    required
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                                    placeholder="أدخل رقم الوكالة"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 4 */}
                    {currentStep === 4 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaImage className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              الصور والإقرارات
                            </h3>
                            <p className="text-gray-500 text-sm">
                              قم برفع صور وأقر بالموافقات
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الصورة الرئيسية{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="file"
                              name="cover_image"
                              onChange={handleAdChange}
                              required
                              accept="image/*"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#53a1dd] file:text-white file:cursor-pointer hover:file:bg-[#478bc5]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الصور الإضافية
                            </label>
                            <input
                              type="file"
                              name="images"
                              onChange={handleAdChange}
                              multiple
                              accept="image/*"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-300"
                            />
                            <p className="text-gray-500 text-xs mt-2">
                              يمكنك رفع أكثر من صورة
                            </p>
                          </div>

                          <div className="md:col-span-2">
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border-2 border-blue-200">
                              <div className="flex items-start gap-4">
                                <input
                                  type="checkbox"
                                  name="legal_declaration"
                                  checked={adFormData.legal_declaration}
                                  onChange={handleAdChange}
                                  required
                                  className="mt-1 w-5 h-5 text-[#53a1dd] rounded focus:ring-[#53a1dd] cursor-pointer"
                                />
                                <div>
                                  <label className="text-gray-800 font-semibold block mb-2 cursor-pointer">
                                    أقر بأن جميع المعلومات المقدمة صحيحة وأتحمل
                                    المسؤولية القانونية
                                  </label>
                                  <p className="text-gray-600 text-sm">
                                    قرأت وفهمت الشروط والأحكام وأوافق عليها
                                    بالكامل
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
                            onClick={handlePrevStep}
                          >
                            <FaArrowRight /> رجوع
                          </button>
                        )}

                        <button
                          type="button"
                          className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                            !validateCurrentStep()
                              ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                              : "bg-gradient-to-r from-[#53a1dd] to-[#478bc5] text-white hover:from-[#478bc5] hover:to-[#3d7ab0] shadow-lg hover:shadow-xl"
                          }`}
                          onClick={handleNextStep}
                          disabled={!validateCurrentStep()}
                        >
                          {currentStep === 4 ? (
                            <>
                              <FaCheck /> استكمال البيانات
                            </>
                          ) : (
                            <>
                              الخطوة التالية <FaArrowLeft />
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default CreatePropertyAd;
