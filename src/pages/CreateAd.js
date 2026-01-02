import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaChevronLeft,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaFileAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaImage,
  FaPlus,
  FaExclamationTriangle,
  FaTimes,
  FaCloudUploadAlt,
  FaTrashAlt,
  FaCheckCircle,
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
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
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
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setFormComplete(true);
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
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
          adFormData[field] !== undefined &&
          adFormData[field] !== ""
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
    setCoverImagePreview(null);
    setAdditionalImagesPreview([]);
    setCurrentStep(1);
    setFormComplete(false);
  };

  const handleAdChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
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

  // Handle Cover Image
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("يرجى اختيار ملف صورة صحيح");
        return;
      }

      setAdFormData(prev => ({ ...prev, cover_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
        toast.success("تم رفع الصورة الرئيسية بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCoverImage = () => {
    setAdFormData(prev => ({ ...prev, cover_image: null }));
    setCoverImagePreview(null);
    toast.info("تم حذف الصورة الرئيسية");
  };

  // Handle Additional Images
  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files || []);
    
    const validFiles = files.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`حجم الصورة ${file.name} أكبر من 5 ميجابايت`);
        return false;
      }
      if (!file.type.startsWith('image/')) {
        toast.error(`الملف ${file.name} ليس صورة`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const currentImages = adFormData.images || [];
    const newImages = [...currentImages, ...validFiles];
    
    if (newImages.length > 10) {
      toast.error("الحد الأقصى 10 صور إضافية");
      return;
    }

    setAdFormData(prev => ({ ...prev, images: newImages }));

    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagesPreview(prev => [...prev, {
          id: Date.now() + Math.random(),
          preview: reader.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`تم رفع ${validFiles.length} صورة إضافية`);
  };

  const removeAdditionalImage = (imageId) => {
    setAdditionalImagesPreview(prev => {
      const filtered = prev.filter(img => img.id !== imageId);
      const newImages = filtered.map(img => img.file);
      setAdFormData(prevData => ({ ...prevData, images: newImages }));
      return filtered;
    });
    toast.info("تم حذف الصورة");
  };

  // Drag and Drop for Cover Image
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error("يرجى اختيار ملف صورة صحيح");
        return;
      }

      setAdFormData(prev => ({ ...prev, cover_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
        toast.success("تم رفع الصورة الرئيسية بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
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

      <main className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pt-16 pb-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {formLoading ? (
            <div className="flex flex-col items-center justify-center py-28">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <FaCloudUploadAlt className="text-2xl text-[#53a1dd] animate-pulse" />
                </div>
              </div>
              <p className="text-gray-700 text-lg font-semibold mt-5 animate-pulse">
                جاري إضافة الإعلان...
              </p>
              <p className="text-gray-500 text-xs mt-2">
                يرجى الانتظار حتى يتم رفع جميع البيانات
              </p>
            </div>
          ) : formComplete ? (
            <div className="p-6 md:p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-green-500 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl animate-bounce">
                <FaCheckCircle className="text-4xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">
                تم استكمال جميع البيانات
              </h2>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-sm leading-relaxed">
                تم التحقق من جميع المعلومات بنجاح. يمكنك الآن إضافة الإعلان إلى المنصة أو العودة لمراجعة البيانات
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  className="px-8 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  onClick={handlePrevStep}
                >
                  <FaArrowRight /> العودة للتعديل
                </button>
                <button
                  type="button"
                  className="px-8 py-3.5 bg-gradient-to-r from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] text-white rounded-xl hover:from-[#478bc5] hover:via-[#3d7ab0] hover:to-[#326a9a] transition-all duration-300 font-semibold flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  onClick={handleAddAd}
                >
                  <FaPlus /> إضافة الإعلان
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-5 sm:p-8">
                {/* Progress Steps */}
                <div className="mb-10">
                  <div className="relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 rounded-full z-0 transform -translate-y-1/2">
                      <div
                        className="absolute h-1.5 rounded-full bg-gradient-to-r from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] transition-all duration-700 ease-in-out shadow-md"
                        style={{
                          width: `${((currentStep - 1) / 3) * 100}%`,
                        }}
                      />
                    </div>

                    <div className="relative z-10 grid grid-cols-4 gap-2">
                      {[
                        { num: 1, icon: FaFileAlt, label: "المعلومات الأساسية" },
                        { num: 2, icon: FaRulerCombined, label: "المساحة والموقع" },
                        { num: 3, icon: FaMoneyBillWave, label: "التفاصيل المالية" },
                        { num: 4, icon: FaImage, label: "الصور والإقرارات" },
                      ].map(({ num, icon: Icon, label }) => (
                        <div key={num} className="flex flex-col items-center">
                          <div
                            className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 shadow-lg transition-all duration-500 transform ${
                              currentStep === num
                                ? "bg-gradient-to-br from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] text-white scale-105 shadow-xl ring-3 ring-blue-200 ring-opacity-50"
                                : currentStep > num
                                ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md"
                                : "bg-white text-gray-400 border-2 border-gray-200"
                            }`}
                          >
                            {currentStep > num ? (
                              <FaCheckCircle className="text-lg md:text-xl" />
                            ) : (
                              <Icon className="text-base md:text-lg" />
                            )}
                          </div>
                          <span
                            className={`text-xs font-bold text-center transition-colors duration-300 leading-tight ${
                              currentStep >= num ? "text-[#53a1dd]" : "text-gray-400"
                            }`}
                          >
                            {label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    {/* Step 1 */}
                    {currentStep === 1 && (
                      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaFileAlt className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              المعلومات الأساسية
                            </h3>
                            <p className="text-gray-600 text-xs mt-1">
                              أدخل البيانات الأساسية للعقار
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              رقم الإعلان <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="announcement_number"
                              value={adFormData.announcement_number}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: AD-2024-001"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              المنطقة <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="region"
                              value={adFormData.region}
                              onChange={handleRegionChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 bg-white cursor-pointer text-sm"
                            >
                              <option value="">اختر المنطقة</option>
                              {regions.map((region) => (
                                <option key={region} value={region}>
                                  {region}
                                </option>
                              ))}
                            </select>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              المدينة <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="city"
                              value={adFormData.city}
                              onChange={handleCityChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white cursor-pointer text-sm"
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

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              عنوان الإعلان <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={adFormData.title}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: أرض سكنية في موقع مميز"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              نوع الأرض <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="land_type"
                              value={adFormData.land_type}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 bg-white cursor-pointer text-sm"
                            >
                              <option value="سكني">سكني</option>
                              <option value="تجاري">تجاري</option>
                              <option value="زراعي">زراعي</option>
                            </select>
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الغرض <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="purpose"
                              value={adFormData.purpose}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 bg-white cursor-pointer text-sm"
                            >
                              <option value="بيع">بيع</option>
                              <option value="استثمار">استثمار</option>
                            </select>
                          </div>

                          <div className="md:col-span-2 group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الوصف
                            </label>
                            <textarea
                              name="description"
                              value={adFormData.description}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 resize-none text-sm"
                              rows="4"
                              placeholder="اكتب وصفاً تفصيلياً يجذب المهتمين..."
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2 */}
                    {currentStep === 2 && (
                      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaRulerCombined className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              المساحة والموقع
                            </h3>
                            <p className="text-gray-600 text-xs mt-1">
                              حدد مساحة العقار وموقعه بدقة
                            </p>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              المساحة الإجمالية (م²) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="total_area"
                              value={adFormData.total_area}
                              onChange={handleAdChange}
                              required
                              min="5000"
                              step="0.01"
                              className={`w-full px-4 py-3.5 border-2 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium text-sm ${
                                adFormData.total_area &&
                                parseFloat(adFormData.total_area) < 5000
                                  ? "border-red-500 bg-red-50 focus:ring-red-200"
                                  : "border-gray-300 group-hover:border-gray-400"
                              }`}
                              placeholder="مثال: 10000"
                            />
                            {adFormData.total_area &&
                            parseFloat(adFormData.total_area) < 5000 ? (
                              <div className="flex items-center gap-2 text-red-600 text-xs bg-red-50 p-3 rounded-lg mt-2 border border-red-200">
                                <FaExclamationTriangle className="flex-shrink-0 text-base" />
                                <span className="font-semibold">
                                  يجب أن تكون المساحة 5000 م² على الأقل
                                </span>
                              </div>
                            ) : (
                              <p className="text-gray-500 text-xs mt-2 flex items-center gap-2">
                                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                                الحد الأدنى للمساحة: 5000 م²
                              </p>
                            )}
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              رقم الصك <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="deed_number"
                              value={adFormData.deed_number}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: 123456789"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الطول شمال (م)
                            </label>
                            <input
                              type="number"
                              name="length_north"
                              value={adFormData.length_north}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: 100"
                              step="0.01"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الطول جنوب (م)
                            </label>
                            <input
                              type="number"
                              name="length_south"
                              value={adFormData.length_south}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: 100"
                              step="0.01"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الطول شرق (م)
                            </label>
                            <input
                              type="number"
                              name="length_east"
                              value={adFormData.length_east}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: 50"
                              step="0.01"
                            />
                          </div>

                          <div className="group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الطول غرب (م)
                            </label>
                            <input
                              type="number"
                              name="length_west"
                              value={adFormData.length_west}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: 50"
                              step="0.01"
                            />
                          </div>

                          <div className="md:col-span-2 group">
                            <label className="block text-sm font-bold text-gray-800 mb-2">
                              الموقع الجغرافي (وصف) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="geo_location_text"
                              value={adFormData.geo_location_text}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                              placeholder="مثال: شمال الرياض، حي النرجس، بالقرب من شارع الملك فهد"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3 */}
                    {currentStep === 3 && (
                      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaMoneyBillWave className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              التفاصيل المالية
                            </h3>
                            <p className="text-gray-600 text-xs mt-1">
                              حدد السعر والشروط المالية
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {adFormData.purpose === "بيع" ? (
                            <div className="group">
                              <label className="block text-sm font-bold text-gray-800 mb-2">
                                سعر المتر المربع (ريال) <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="number"
                                name="price_per_sqm"
                                value={adFormData.price_per_sqm}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                                placeholder="مثال: 1500"
                                step="0.01"
                              />
                              {adFormData.price_per_sqm && adFormData.total_area && (
                                <div className="mt-4 p-5 bg-gradient-to-r from-green-50 via-blue-50 to-green-50 rounded-xl border-2 border-green-200 shadow-md">
                                  <div className="flex items-center justify-between">
                                    <span className="text-gray-700 font-semibold text-base">
                                      السعر الإجمالي المتوقع:
                                    </span>
                                    <span className="text-green-700 font-bold text-2xl">
                                      {(
                                        parseFloat(adFormData.price_per_sqm) *
                                        parseFloat(adFormData.total_area)
                                      ).toLocaleString('ar-SA')}
                                      <span className="text-lg mr-2">ريال</span>
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                              <div className="group">
                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                  مدة الاستثمار (شهر) <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="investment_duration"
                                  value={adFormData.investment_duration}
                                  onChange={handleAdChange}
                                  required
                                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                                  placeholder="مثال: 24"
                                />
                              </div>
                              <div className="group">
                                <label className="block text-sm font-bold text-gray-800 mb-2">
                                  القيمة الاستثمارية المتوقعة (ريال) <span className="text-red-500">*</span>
                                </label>
                                <input
                                  type="number"
                                  name="estimated_investment_value"
                                  value={adFormData.estimated_investment_value}
                                  onChange={handleAdChange}
                                  required
                                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                                  placeholder="مثال: 5000000"
                                  step="0.01"
                                />
                              </div>
                              {currentUser?.user_type === "وكيل شرعي" && (
                                <div className="md:col-span-2 group">
                                  <label className="block text-sm font-bold text-gray-800 mb-2">
                                    رقم الوكالة <span className="text-red-500">*</span>
                                  </label>
                                  <input
                                    type="text"
                                    name="agency_number"
                                    value={adFormData.agency_number}
                                    onChange={handleAdChange}
                                    required
                                    className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                                    placeholder="مثال: AGN-2024-001"
                                  />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Step 4 - Modern Image Upload */}
                    {currentStep === 4 && (
                      <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
                            <FaImage className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">
                              الصور والإقرارات
                            </h3>
                            <p className="text-gray-600 text-xs mt-1">
                              أضف صوراً عالية الجودة للعقار
                            </p>
                          </div>
                        </div>

                        <div className="space-y-6">
                          {/* Cover Image Upload */}
                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                              الصورة الرئيسية <span className="text-red-500">*</span>
                            </label>
                            
                            {!coverImagePreview ? (
                              <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`relative border-2 border-dashed rounded-2xl p-6 md:p-10 text-center cursor-pointer transition-all duration-300 ${
                                  isDragging
                                    ? "border-[#53a1dd] bg-blue-50"
                                    : "border-gray-300 bg-white hover:border-[#53a1dd] hover:bg-blue-50"
                                }`}
                              >
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleCoverImageChange}
                                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                  id="cover-image-input"
                                />
                                <label
                                  htmlFor="cover-image-input"
                                  className="flex flex-col items-center cursor-pointer"
                                >
                                  <div className="w-16 h-16 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center mb-3 shadow-lg">
                                    <FaCloudUploadAlt className="text-3xl" />
                                  </div>
                                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                                    اسحب الصورة هنا أو انقر للاختيار
                                  </h4>
                                  <p className="text-gray-500 text-xs mb-3">
                                    الحد الأقصى: 5 ميجابايت • الصيغ المدعومة: JPG, PNG, WEBP
                                  </p>
                                  <div className="px-5 py-2.5 bg-gradient-to-r from-[#53a1dd] to-[#478bc5] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300">
                                    اختر الصورة
                                  </div>
                                </label>
                              </div>
                            ) : (
                              <div className="relative rounded-2xl overflow-hidden shadow-xl group">
                                <img
                                  src={coverImagePreview}
                                  alt="Cover Preview"
                                  className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                                  <button
                                    type="button"
                                    onClick={removeCoverImage}
                                    className="opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 px-5 py-2.5 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600 flex items-center gap-2"
                                  >
                                    <FaTrashAlt /> حذف الصورة
                                  </button>
                                </div>
                                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1.5 rounded-lg font-semibold shadow-md flex items-center gap-2 text-sm">
                                  <FaCheckCircle /> تم الرفع
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Additional Images Upload */}
                          <div>
                            <label className="block text-sm font-bold text-gray-800 mb-3">
                              الصور الإضافية <span className="text-gray-500 font-normal">(اختياري - حتى 10 صور)</span>
                            </label>

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-5 bg-white hover:border-[#53a1dd] hover:bg-blue-50 transition-all duration-300 cursor-pointer">
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleAdditionalImagesChange}
                                className="hidden"
                                id="additional-images"
                              />
                              <label
                                htmlFor="additional-images"
                                className="flex flex-col items-center cursor-pointer"
                              >
                                <div className="w-14 h-14 bg-gray-200 text-gray-600 rounded-xl flex items-center justify-center mb-3">
                                  <FaPlus className="text-xl" />
                                </div>
                                <h4 className="text-base font-bold text-gray-800 mb-1">
                                  إضافة صور إضافية
                                </h4>
                                <p className="text-gray-500 text-xs">
                                  اختر صوراً متعددة لإضافتها
                                </p>
                              </label>
                            </div>

                            {/* Additional Images Preview Grid */}
                            {additionalImagesPreview.length > 0 && (
                              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-5">
                                {additionalImagesPreview.map((img) => (
                                  <div
                                    key={img.id}
                                    className="relative rounded-xl overflow-hidden shadow-lg group aspect-square"
                                  >
                                    <img
                                      src={img.preview}
                                      alt="Additional"
                                      className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center">
                                      <button
                                        type="button"
                                        onClick={() => removeAdditionalImage(img.id)}
                                        className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 w-9 h-9 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 flex items-center justify-center"
                                      >
                                        <FaTimes className="text-base" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {additionalImagesPreview.length > 0 && (
                              <p className="text-gray-600 text-xs mt-3 text-center">
                                تم رفع <span className="font-bold text-[#53a1dd]">{additionalImagesPreview.length}</span> صورة إضافية
                              </p>
                            )}
                          </div>

                          {/* Legal Declaration */}
                          <div className="bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100 rounded-2xl p-5 border-2 border-blue-300 shadow-md">
                            <div className="flex items-start gap-4">
                              <input
                                type="checkbox"
                                name="legal_declaration"
                                checked={adFormData.legal_declaration}
                                onChange={handleAdChange}
                                required
                                className="mt-1 w-5 h-5 text-[#53a1dd] rounded-lg focus:ring-4 focus:ring-[#53a1dd]/20 cursor-pointer border-2 border-gray-400"
                                id="legal_declaration"
                              />
                              <label htmlFor="legal_declaration" className="cursor-pointer flex-1">
                                <div className="text-gray-900 font-bold text-base mb-2 flex items-center gap-2">
                                  <FaCheckCircle className="text-[#53a1dd]" />
                                  الإقرار القانوني
                                </div>
                                <p className="text-gray-700 text-sm leading-relaxed">
                                  أقر بأن جميع المعلومات والبيانات المقدمة في هذا النموذج صحيحة ودقيقة، وأنني أتحمل كامل المسؤولية القانونية عن أي معلومات خاطئة أو مضللة. كما أوافق على الشروط والأحكام الخاصة بالمنصة.
                                </p>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-3 justify-between">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            className="px-6 py-3.5 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-semibold shadow-md hover:shadow-lg flex items-center justify-center gap-3 transform hover:-translate-y-0.5 text-sm"
                            onClick={handlePrevStep}
                          >
                            <FaArrowRight /> الخطوة السابقة
                          </button>
                        )}

                        <button
                          type="button"
                          className={`flex-1 sm:flex-initial px-6 py-3.5 rounded-xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 shadow-lg transform ${
                            !validateCurrentStep()
                              ? "opacity-60 cursor-not-allowed bg-gray-300 text-gray-500"
                              : "bg-gradient-to-r from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] text-white hover:from-[#478bc5] hover:via-[#3d7ab0] hover:to-[#326a9a] hover:shadow-xl hover:-translate-y-0.5"
                          }`}
                          onClick={handleNextStep}
                          disabled={!validateCurrentStep()}
                        >
                          {currentStep === 4 ? (
                            <>
                              <FaCheckCircle /> إتمام البيانات
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