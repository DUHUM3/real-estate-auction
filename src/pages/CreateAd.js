import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaTimes,
  FaCheck,
  FaHome,
  FaMapMarkerAlt,
  FaFileAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaImage,
  FaPlus,
  FaExclamationTriangle,
  FaChevronRight,
  FaRegClock,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { locationService } from "../utils/LocationForFiltters";

function CreateAd() {
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

  const getApiUrls = () => {
    if (currentUser?.user_type === "شركة مزادات") {
      return {
        base: "https://core-api-x41.shaheenplus.sa/api/user/auctions",
        create: "https://core-api-x41.shaheenplus.sa/api/user/auctions",
      };
    } else {
      return {
        base: "https://core-api-x41.shaheenplus.sa/api/user/properties",
        create: "https://core-api-x41.shaheenplus.sa/api/user/properties",
      };
    }
  };

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
    if (currentUser?.user_type === "شركة مزادات") {
      if (currentStep === 1) {
        return Boolean(adFormData.title && adFormData.description);
      } else if (currentStep === 2) {
        return Boolean(
          adFormData.start_time && adFormData.auction_date && adFormData.address
        );
      } else if (currentStep === 3) {
        return Boolean(adFormData.cover_image);
      }
    } else {
      if (currentStep === 1) {
        return Boolean(
          adFormData.announcement_number &&
            adFormData.region &&
            adFormData.city &&
            adFormData.title
        );
      } else if (currentStep === 2) {
        // التحقق من أن المساحة لا تقل عن 5000 متر مربع
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
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      const maxSteps = currentUser?.user_type === "شركة مزادات" ? 3 : 4;
      if (currentStep < maxSteps) {
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
    // التحقق النهائي من المساحة قبل الإرسال
    const totalArea = parseFloat(adFormData.total_area) || 0;
    if (totalArea < 5000) {
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

      const urls = getApiUrls();
      const formData = new FormData();

      if (currentUser?.user_type === "شركة مزادات") {
        const auctionFields = [
          "title",
          "description",
          "intro_link",
          "start_time",
          "auction_date",
          "address",
          "latitude",
          "longitude",
        ];

        auctionFields.forEach((field) => {
          if (adFormData[field]) {
            formData.append(field, adFormData[field]);
          }
        });

        if (adFormData.cover_image) {
          formData.append("cover_image", adFormData.cover_image);
        }

        if (adFormData.images && adFormData.images.length > 0) {
          adFormData.images.forEach((image, index) => {
            formData.append(`images[${index}]`, image);
          });
        }

        if (adFormData.videos && adFormData.videos.length > 0) {
          adFormData.videos.forEach((video, index) => {
            formData.append(`videos[${index}]`, video);
          });
        }
      } else {
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
          formData.append(
            "investment_duration",
            adFormData.investment_duration
          );
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
      }

      console.log("إرسال البيانات إلى:", urls.create);

      const response = await fetch(urls.create, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();

      console.log("نتيجة الاستجابة:", result);

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
        console.error("خطأ في الإضافة:", errorMessage);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error("خطأ في الإتصال:", error);
      toast.error("حدث خطأ في الإتصال بالخادم. يرجى المحاولة مرة أخرى.");
    } finally {
      setFormLoading(false);
      setFormComplete(false);
    }
  };

  const resetForm = () => {
    if (currentUser?.user_type === "شركة مزادات") {
      setAdFormData({
        title: "",
        description: "",
        intro_link: "",
        start_time: "",
        auction_date: "",
        address: "",
        latitude: "",
        longitude: "",
        cover_image: null,
        images: [],
        videos: [],
      });
    } else {
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
    }
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
      } else if (name === "videos") {
        setAdFormData({
          ...adFormData,
          videos: Array.from(files),
        });
        toast.success(`تم رفع ${files.length} فيديو`);
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
      // التحقق من حقل المساحة أثناء الكتابة
      if (name === "total_area") {
        const areaValue = parseFloat(value);
        if (areaValue < 5000 && areaValue > 0) {
        }
      }
      
      setAdFormData({
        ...adFormData,
        [name]: value,
      });
    }
  };

  const handleBackToAds = () => {
    navigate("/my-ads");
    toast("تم العودة إلى قائمة الإعلانات", { icon: "🏠" });
  };

  const handleCancel = () => {
    toast.error("تم إلغاء عملية الإضافة");
    navigate("/my-ads");
  };

  const renderAdForm = () => {
    if (currentUser?.user_type === "شركة مزادات") {
      return renderAuctionForm();
    } else {
      return renderPropertyForm();
    }
  };

  const renderAuctionForm = () => {
    const maxSteps = 3;

    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          draggable
          rtl
          pauseOnHover
          theme="light"
          // إعدادات مخصصة للتحكم في الموقع - زيادة القيمة لتنزيل الرسائل
          style={{
            top: window.innerWidth < 768 ? "80px" : "80px", // زدناها من 60/20 إلى 80/80
            right: "10px",
            left: "auto",
            width: "auto",
            maxWidth: window.innerWidth < 768 ? "90%" : "400px",
            fontFamily: "'Segoe UI', 'Cairo', sans-serif",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
            zIndex: 999999,
          }}
          toastStyle={{
            borderRadius: "8px",
            padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
            marginBottom: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: window.innerWidth < 768 ? "40px" : "50px",
            direction: "rtl",
            textAlign: "right",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
          }}
          className={window.innerWidth < 768 ? "mobile-toast" : "desktop-toast"}
        />

        <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <button
                  className="flex items-center gap-2 text-gray-600 hover:text-[#53a1dd] p-2 rounded-lg hover:bg-blue-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleBackToAds}
                  disabled={formLoading}
                >
                  <FaArrowRight className="text-lg" />
                  <span className="hidden sm:inline">العودة للإعلانات</span>
                </button>
              </div>

              <h1 className="text-xl font-bold text-gray-800 text-center">
                إضافة مزاد جديد
              </h1>

              <div>
                <button
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleCancel}
                  disabled={formLoading}
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {formLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">جاري إضافة المزاد...</p>
              </div>
            ) : formComplete ? (
              <div className="p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  تم استكمال جميع البيانات
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  يمكنك الآن إضافة المزاد الجديد أو العودة لتعديل البيانات
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                    onClick={handlePrevStep}
                  >
                    <FaArrowRight /> العودة للتعديل
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#53a1dd] text-white rounded-lg hover:bg-[#478bc5] transition-colors font-medium flex items-center justify-center gap-2"
                    onClick={handleAddAd}
                  >
                    <FaPlus /> إضافة المزاد
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      إضافة مزاد جديد
                    </h1>
                    <p className="text-gray-600">
                      املأ النموذج أدناه لإنشاء مزاد جديد
                    </p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-8">
                      {/* الخطوة 1: المعلومات الأساسية */}
                      {currentStep === 1 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaFileAlt className="text-lg" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                المعلومات الأساسية
                              </h3>
                              <p className="text-gray-500 text-sm">
                                أدخل المعلومات الأساسية للمزاد
                              </p>
                            </div>
                          </div>

                          <div className="space-y-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                عنوان المزاد{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={adFormData.title}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="أدخل عنوان المزاد"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                وصف المزاد{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <textarea
                                name="description"
                                value={adFormData.description}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                rows="4"
                                placeholder="أدخل وصفاً مفصلاً عن المزاد"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                رابط التعريف
                              </label>
                              <input
                                type="url"
                                name="intro_link"
                                value={adFormData.intro_link}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="https://example.com/auction-intro"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* الخطوة 2: الموقع والتاريخ */}
                      {currentStep === 2 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaMapMarkerAlt className="text-lg" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                الموقع والتاريخ
                              </h3>
                              <p className="text-gray-500 text-sm">
                                حدد موقع وتاريخ المزاد
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                وقت البدء{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                name="start_time"
                                value={adFormData.start_time}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                تاريخ المزاد{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                name="auction_date"
                                value={adFormData.auction_date}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                العنوان <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="address"
                                value={adFormData.address}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="أدخل عنوان المزاد"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                خط العرض
                              </label>
                              <input
                                type="text"
                                name="latitude"
                                value={adFormData.latitude}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="30.0444"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                خط الطول
                              </label>
                              <input
                                type="text"
                                name="longitude"
                                value={adFormData.longitude}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="31.2357"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* الخطوة 3: الصور والملفات */}
                      {currentStep === 3 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaImage className="text-lg" />
                            </div>
                            <div>
                              <h3 className="text-xl font-bold text-gray-800">
                                الصور والملفات
                              </h3>
                              <p className="text-gray-500 text-sm">
                                قم برفع صور وملفات المزاد
                              </p>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الصورة الرئيسية{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="file"
                                name="cover_image"
                                onChange={handleAdChange}
                                required
                                accept="image/*"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الصور الإضافية
                              </label>
                              <input
                                type="file"
                                name="images"
                                onChange={handleAdChange}
                                multiple
                                accept="image/*"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                              <p className="text-gray-500 text-sm mt-2">
                                يمكنك رفع أكثر من صورة
                              </p>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الفيديوهات
                              </label>
                              <input
                                type="file"
                                name="videos"
                                onChange={handleAdChange}
                                multiple
                                accept="video/*"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                              <p className="text-gray-500 text-sm mt-2">
                                يمكنك رفع فيديوهات عن المزاد
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          {currentStep > 1 && (
                            <button
                              type="button"
                              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto"
                              onClick={handlePrevStep}
                            >
                              رجوع
                            </button>
                          )}

                          <button
                            type="button"
                            className={`px-8 py-3 bg-[#53a1dd] text-white rounded-lg font-medium text-lg transition-colors w-full sm:w-auto
                              ${
                                !validateCurrentStep()
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:bg-[#478bc5] shadow-md hover:shadow-lg"
                              }`}
                            onClick={handleNextStep}
                            disabled={!validateCurrentStep()}
                          >
                            {currentStep === maxSteps ? (
                              <span className="flex items-center justify-center gap-2">
                                <FaCheck /> استكمال البيانات
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                الخطوة التالية <FaArrowLeft />
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>

                {/* خطوات التقدم */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 text-center">
                    خطوات إنشاء المزاد
                  </h3>
                  <div className="flex flex-col md:flex-row items-center justify-between relative">
                    {/* خطوط الاتصال */}
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0"></div>

                    {[1, 2, 3].map((step) => (
                      <React.Fragment key={step}>
                        <div className="relative z-10 flex flex-col items-center mb-8 md:mb-0 bg-white px-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 shadow-md transition-all duration-300
                            ${
                              currentStep >= step
                                ? "bg-[#53a1dd] text-white"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {currentStep > step ? <FaCheck /> : step}
                          </div>
                          <span
                            className={`text-sm font-medium transition-colors
                            ${
                              currentStep >= step
                                ? "text-[#53a1dd]"
                                : "text-gray-400"
                            }`}
                          >
                            {step === 1
                              ? "المعلومات الأساسية"
                              : step === 2
                              ? "الموقع والتاريخ"
                              : "الصور والملفات"}
                          </span>
                        </div>

                        {step < 3 && (
                          <>
                            <div className="hidden md:block">
                              <FaChevronRight className="text-gray-400" />
                            </div>
                            <div className="block md:hidden my-4">
                              <FaChevronRight className="text-gray-400 rotate-90" />
                            </div>
                          </>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    );
  };

  const renderPropertyForm = () => {
    const maxSteps = 4;

    return (
      <div className="min-h-screen bg-gray-50">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          draggable
          rtl
          pauseOnHover
          theme="light"
          // إعدادات مخصصة للتحكم في الموقع - زيادة القيمة لتنزيل الرسائل
          style={{
            top: window.innerWidth < 768 ? "80px" : "80px", // زدناها من 60/20 إلى 80/80
            right: "10px",
            left: "auto",
            width: "auto",
            maxWidth: window.innerWidth < 768 ? "90%" : "400px",
            fontFamily: "'Segoe UI', 'Cairo', sans-serif",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
            zIndex: 999999,
          }}
          toastStyle={{
            borderRadius: "8px",
            padding: window.innerWidth < 768 ? "8px 12px" : "12px 16px",
            marginBottom: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
            minHeight: window.innerWidth < 768 ? "40px" : "50px",
            direction: "rtl",
            textAlign: "right",
            fontSize: window.innerWidth < 768 ? "12px" : "14px",
          }}
          className={window.innerWidth < 768 ? "mobile-toast" : "desktop-toast"}
        />

        <header className="bg-white border-b border-gray-200 sticky top-10 z-50 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {formLoading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 text-lg">جاري إضافة الإعلان...</p>
              </div>
            ) : formComplete ? (
              <div className="p-8 md:p-12 text-center">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FaCheck className="text-3xl" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  تم استكمال جميع البيانات
                </h2>
                <p className="text-gray-600 mb-8 max-w-lg mx-auto">
                  يمكنك الآن إضافة الإعلان الجديد أو العودة لتعديل البيانات
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    type="button"
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center justify-center gap-2"
                    onClick={handlePrevStep}
                  >
                    <FaArrowRight /> العودة للتعديل
                  </button>
                  <button
                    type="button"
                    className="px-6 py-3 bg-[#53a1dd] text-white rounded-lg hover:bg-[#478bc5] transition-colors font-medium flex items-center justify-center gap-2"
                    onClick={handleAddAd}
                  >
                    <FaPlus /> إضافة الإعلان
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="p-8">
                  <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">
                      إضافة أرض جديدة
                    </h1>
                    <p className="text-gray-600">
                      املأ النموذج أدناه لإنشاء إعلان أرض جديد
                    </p>
                  </div>

                  <form onSubmit={(e) => e.preventDefault()}>
                    <div className="space-y-8">
                      {/* الخطوة 1: المعلومات الأساسية */}
                      {currentStep === 1 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaFileAlt className="text-lg" />
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                رقم الإعلان{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="announcement_number"
                                value={adFormData.announcement_number}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="أدخل رقم الإعلان"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                المنطقة <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="region"
                                value={adFormData.region}
                                onChange={handleRegionChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
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
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                المدينة <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="city"
                                value={adFormData.city}
                                onChange={handleCityChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition disabled:bg-gray-50"
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
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                عنوان الإعلان{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="title"
                                value={adFormData.title}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="أدخل عنوان الإعلان"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                نوع الأرض{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="land_type"
                                value={adFormData.land_type}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              >
                                <option value="سكني">سكني</option>
                                <option value="تجاري">تجاري</option>
                                <option value="زراعي">زراعي</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الغرض <span className="text-red-500">*</span>
                              </label>
                              <select
                                name="purpose"
                                value={adFormData.purpose}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              >
                                <option value="بيع">بيع</option>
                                <option value="استثمار">استثمار</option>
                              </select>
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الوصف
                              </label>
                              <textarea
                                name="description"
                                value={adFormData.description}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                rows="3"
                                placeholder="أدخل وصفاً مفصلاً عن الأرض"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* الخطوة 2: المساحة والموقع */}
                      {currentStep === 2 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaRulerCombined className="text-lg" />
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition ${
                                  adFormData.total_area && parseFloat(adFormData.total_area) < 5000
                                    ? "border-red-500 bg-red-50"
                                    : "border-gray-300"
                                }`}
                                placeholder="أدخل المساحة الإجمالية"
                              />
                              {/* ملاحظة: لا يتم قبول أي أرضية أقل من 5000 متر مربع */}
                              <div className="mt-2">
                                {adFormData.total_area && parseFloat(adFormData.total_area) < 5000 ? (
                                  <div className="flex items-center gap-2 text-red-600 text-sm">
                                    <FaExclamationTriangle className="text-xs" />
                                    <span className="font-medium">يجب أن تكون المساحة 5000 متر مربع على الأقل</span>
                                  </div>
                                ) : (
                                  <p className="text-gray-500 text-sm">
                                    <span className="font-medium">ملاحظة:</span> لا يتم قبول أي أرضية أقل من 5000 متر مربع
                                  </p>
                                )}
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                رقم الصك <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="deed_number"
                                value={adFormData.deed_number}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="أدخل رقم الصك"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الطول شمال (م)
                              </label>
                              <input
                                type="number"
                                name="length_north"
                                value={adFormData.length_north}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="الطول شمال"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الطول جنوب (م)
                              </label>
                              <input
                                type="number"
                                name="length_south"
                                value={adFormData.length_south}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="الطول جنوب"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الطول شرق (م)
                              </label>
                              <input
                                type="number"
                                name="length_east"
                                value={adFormData.length_east}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="الطول شرق"
                                step="0.01"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الطول غرب (م)
                              </label>
                              <input
                                type="number"
                                name="length_west"
                                value={adFormData.length_west}
                                onChange={handleAdChange}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="الطول غرب"
                                step="0.01"
                              />
                            </div>

                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الموقع الجغرافي (وصف){" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="geo_location_text"
                                value={adFormData.geo_location_text}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                placeholder="أدخل وصف الموقع الجغرافي"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {/* الخطوة 3: التفاصيل المالية */}
                      {currentStep === 3 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaMoneyBillWave className="text-lg" />
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

                          <div className="space-y-6">
                            {adFormData.purpose === "بيع" ? (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                  سعر المتر المربع (ريال){" "}
                                  <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="price_per_sqm"
                                  value={adFormData.price_per_sqm}
                                  onChange={handleAdChange}
                                  required
                                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                  placeholder="أدخل سعر المتر المربع"
                                />
                                {adFormData.price_per_sqm &&
                                  adFormData.total_area && (
                                    <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                                      <p className="text-blue-700 font-medium">
                                        السعر الإجمالي:{" "}
                                        {adFormData.price_per_sqm &&
                                        adFormData.total_area
                                          ? (
                                              parseFloat(
                                                adFormData.price_per_sqm
                                              ) *
                                              parseFloat(adFormData.total_area)
                                            ).toLocaleString()
                                          : 0}{" "}
                                        ريال
                                      </p>
                                    </div>
                                  )}
                              </div>
                            ) : (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    مدة الاستثمار (شهر){" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    name="investment_duration"
                                    value={adFormData.investment_duration}
                                    onChange={handleAdChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                    placeholder="أدخل مدة الاستثمار بالأشهر"
                                  />
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-2">
                                    القيمة الاستثمارية المتوقعة (ريال){" "}
                                    <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="number"
                                    name="estimated_investment_value"
                                    value={
                                      adFormData.estimated_investment_value
                                    }
                                    onChange={handleAdChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                    placeholder="أدخل القيمة الاستثمارية المتوقعة"
                                  />
                                </div>
                                {currentUser?.user_type === "وكيل شرعي" && (
                                  <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                      رقم الوكالة{" "}
                                      <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                      type="text"
                                      name="agency_number"
                                      value={adFormData.agency_number}
                                      onChange={handleAdChange}
                                      required
                                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                                      placeholder="أدخل رقم الوكالة"
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* الخطوة 4: الصور والإقرارات */}
                      {currentStep === 4 && (
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <div className="flex items-center gap-3 mb-6">
                            <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
                              <FaImage className="text-lg" />
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

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الصورة الرئيسية{" "}
                                <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="file"
                                name="cover_image"
                                onChange={handleAdChange}
                                required
                                accept="image/*"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                الصور الإضافية
                              </label>
                              <input
                                type="file"
                                name="images"
                                onChange={handleAdChange}
                                multiple
                                accept="image/*"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition"
                              />
                              <p className="text-gray-500 text-sm mt-2">
                                يمكنك رفع أكثر من صورة
                              </p>
                            </div>

                            <div className="md:col-span-2">
                              <div className="bg-blue-50 rounded-xl p-6">
                                <div className="flex items-start gap-4">
                                  <input
                                    type="checkbox"
                                    name="legal_declaration"
                                    checked={adFormData.legal_declaration}
                                    onChange={handleAdChange}
                                    required
                                    className="mt-1 w-5 h-5 text-[#53a1dd] rounded focus:ring-[#53a1dd]"
                                  />
                                  <div>
                                    <label className="text-gray-700 block mb-2">
                                      أقر بأن جميع المعلومات المقدمة صحيحة
                                      وأتحمل المسؤولية القانونية
                                    </label>
                                    <p className="text-gray-500 text-sm">
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

                      <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                          {currentStep > 1 && (
                            <button
                              type="button"
                              className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto"
                              onClick={handlePrevStep}
                            >
                              رجوع
                            </button>
                          )}

                          <button
                            type="button"
                            className={`px-8 py-3 bg-[#53a1dd] text-white rounded-lg font-medium text-lg transition-colors w-full sm:w-auto
                              ${
                                !validateCurrentStep()
                                  ? "opacity-60 cursor-not-allowed"
                                  : "hover:bg-[#478bc5] shadow-md hover:shadow-lg"
                              }`}
                            onClick={handleNextStep}
                            disabled={!validateCurrentStep()}
                          >
                            {currentStep === maxSteps ? (
                              <span className="flex items-center justify-center gap-2">
                                <FaCheck /> استكمال البيانات
                              </span>
                            ) : (
                              <span className="flex items-center justify-center gap-2">
                                الخطوة التالية <FaArrowLeft />
                              </span>
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
  };

  return renderAdForm();
}

export default CreateAd;