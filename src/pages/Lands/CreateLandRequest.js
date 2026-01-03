import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Icons from "../../icons/index";
import { landApi } from "../../api/landRequestApi";
import { locationService } from "../../utils/LocationForFiltters";
import { motion, AnimatePresence } from "framer-motion";

const convertArabicNumbersToEnglish = (value) => {
  const arabicNumbers = "٠١٢٣٤٥٦٧٨٩";
  const englishNumbers = "0123456789";

  return value.replace(
    /[٠-٩]/g,
    (char) => englishNumbers[arabicNumbers.indexOf(char)]
  );
};

function CreateLandRequest() {
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);

  const [formData, setFormData] = useState({
    title: "",
    region: "",
    city: "",
    purpose: "purchase",
    type: "residential",
    area: "",
    description: "",
    terms_accepted: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState({});
  const [availableCities, setAvailableCities] = useState([]);
  const [formTouched, setFormTouched] = useState(false);
  const [userType, setUserType] = useState(null);
  const [checkingUserType, setCheckingUserType] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);

  // خطوات النموذج مع عناوينها
  const steps = [
    { number: 1, title: "المعلومات الأساسية", icon: Icons.FaInfoCircle },
    { number: 2, title: "تفاصيل الأرض", icon: Icons.FaMapMarkerAlt },
    { number: 3, title: "الوصف والموافقة", icon: Icons.FaCheckCircle },
  ];

  const showApiError = (errorObj) => {
    if (typeof errorObj === "string") {
      toast.error(errorObj);
    } else if (errorObj.message) {
      toast.error(errorObj.message);
    } else if (errorObj.details) {
      toast.error(errorObj.details);
    } else if (errorObj.error) {
      toast.error(errorObj.error);
    } else {
      toast.error("حدث خطأ غير متوقع");
    }
  };

  const showApiSuccess = (message) => {
    toast.success(message);
  };

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
        showApiError(
          "عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق أراضي"
        );
      } else {
        setUserType(storedUserType);
      }

      setCheckingUserType(false);
    } catch (err) {
      console.error("❌ خطأ في التحقق من نوع المستخدم:", err);
      setCheckingUserType(false);
      showApiError("حدث خطأ في التحقق من الصلاحيات");
    }
  };

  useEffect(() => {
    setRegions(locationService.getRegions());
    setCities(locationService.getCitiesByRegion());
  }, []);

  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);

      if (!formData.city && cities[formData.region].length > 0) {
        setFormData((prev) => ({
          ...prev,
          city: cities[formData.region][0],
        }));
      }
    } else {
      setAvailableCities([]);
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  }, [formData.region, cities]);

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      title: "",
      region: "",
      city: "",
      purpose: "purchase",
      type: "residential",
      area: "",
      description: "",
      terms_accepted: false,
    });
    setError(null);
    setResponseData(null);
    setFormTouched(false);
    setCurrentStep(1);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    // ✅ تحويل الأرقام العربية إلى إنجليزية تلقائيًا
    if (name === "area") {
      newValue = convertArabicNumbersToEnglish(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : newValue,
    }));

    setFormTouched(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (userType === "شركة مزادات") {
      showApiError(
        "عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق أراضي"
      );
      return;
    }

    if (
      !formData.title ||
      !formData.region ||
      !formData.city ||
      !formData.area ||
      !formData.description
    ) {
      showApiError("جميع الحقول مطلوبة");
      return;
    }

    if (!formData.terms_accepted) {
      showApiError("يجب الموافقة على الشروط والأحكام");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      showApiError("يجب تسجيل الدخول أولاً");
      openLogin();
      return;
    }

    try {
      setLoading(true);
      showApiSuccess("جاري إنشاء طلب الأرض...");

      const submitData = new FormData();
      submitData.append("title", formData.title);
      submitData.append("region", formData.region);
      submitData.append("city", formData.city);
      submitData.append("purpose", formData.purpose);
      submitData.append("type", formData.type);
      submitData.append("area", formData.area);
      submitData.append("description", formData.description);
      submitData.append("terms_accepted", "true");

      const response = await landApi.submitLandRequest(submitData);
      setResponseData(response);
      showApiSuccess("تم إنشاء طلب الأرض بنجاح!");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ خطأ في إنشاء طلب الأرض:", err);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        const errorMsg = "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى";
        showApiError(errorMsg);
        setError(errorMsg);
        localStorage.removeItem("token");
        localStorage.removeItem("user_type");
        openLogin();
      } else if (err.response.status === 422) {
        const errorMsg =
          "بيانات غير صالحة: " +
          (err.response.data.message || "يرجى التحقق من البيانات المدخلة");
        showApiError(errorMsg);
        setError(errorMsg);
      } else if (err.response.status === 403) {
        const errorMsg = "عذراً، ليس لديك صلاحية لإنشاء طلبات تسويق أراضي";
        showApiError(errorMsg);
        setError(errorMsg);
      } else {
        const errorMsg = err.response.data.message || "حدث خطأ في الخادم";
        showApiError(errorMsg);
        setError(errorMsg);
      }
    } else if (err.request) {
      const errorMsg = "تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت";
      showApiError(errorMsg);
      setError(errorMsg);
    } else {
      const errorMsg = "حدث خطأ غير متوقع";
      showApiError(errorMsg);
      setError(errorMsg);
    }
  };

  const handleBack = () => {
    if (formTouched && !success) {
      if (
        window.confirm(
          "هل أنت متأكد من إلغاء الطلب؟ سيتم فقدان جميع البيانات المدخلة."
        )
      ) {
        navigate(-1);
      }
    } else {
      navigate(-1);
    }
  };

  const handleCreateNew = () => {
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const isUserAllowed = () => {
    return userType !== "شركة مزادات";
  };

  const isFormValid =
    isUserAllowed() &&
    formData.title &&
    formData.region &&
    formData.city &&
    formData.area &&
    formData.description &&
    formData.terms_accepted;

  const isStep1Valid = formData.title && formData.region && formData.city;
  const isStep2Valid = formData.purpose && formData.type && formData.area;
  const isStep3Valid = formData.description && formData.terms_accepted;

  if (checkingUserType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e6f0ff] font-sans">
        <ToastContainer
          position="top-right"
          autoClose={2000}
          closeOnClick
          draggable
          rtl
          pauseOnHover
          theme="light"
          toastClassName="bg-white text-gray-800 rounded-xl shadow-lg px-6 py-4 border border-gray-200"
          bodyClassName="text-sm font-medium text-center"
          closeButton={true}
          className="mt-20 sm:mt-24"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative w-20 h-20 mx-auto mb-6">
            <div className="absolute inset-0 border-4 border-[#a6d4fa] rounded-full animate-ping"></div>
            <div className="relative w-20 h-20 border-4 border-[#53a1dd] border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            جاري التحقق من الصلاحيات
          </h3>
          <p className="text-gray-600">الرجاء الانتظار...</p>
        </motion.div>
      </div>
    );
  }

  if (!isUserAllowed()) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e6f0ff] font-sans">
        <ToastContainer
          position="top-right"
          autoClose={4000}
          closeOnClick
          draggable
          rtl
          pauseOnHover
          theme="light"
          toastClassName="bg-white text-gray-800 rounded-xl shadow-lg px-6 py-4 border border-gray-200"
          bodyClassName="text-sm font-medium text-center"
          closeButton={true}
          className="mt-20 sm:mt-24"
        />

        {/* Content */}
        <div className="max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 pt-8 sm:pt-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="p-8 sm:p-12 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Icons.FaBan className="text-4xl sm:text-5xl text-red-600" />
              </motion.div>

              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                غير مسموح بالدخول
              </h2>

              <p className="text-gray-600 mb-8 text-base sm:text-lg leading-relaxed max-w-md mx-auto">
                عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق أراضي في
                الوقت الحالي.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 max-w-md mx-auto">
                <button
                  onClick={() => navigate("/land-requests")}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  تصفح الطلبات المتاحة
                </button>
                <button
                  onClick={() => navigate("/")}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  العودة للرئيسية
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e6f0ff] font-sans">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        closeOnClick
        draggable
        rtl
        pauseOnHover
        theme="light"
        toastClassName="bg-white text-gray-800 rounded-xl shadow-lg px-6 py-4 border border-gray-200"
        bodyClassName="text-sm font-medium text-center"
        closeButton={true}
        className="mt-20 sm:mt-24"
      />

      {/* Main Content */}
      <div
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 
                pt-24 sm:pt-28 lg:pt-32
                pb-6 sm:pb-8 lg:pb-12"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-12 text-center"
            >
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[#a6d4fa] rounded-full animate-ping"></div>
                <div className="relative w-24 h-24 border-4 border-[#53a1dd] border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                جاري إنشاء الطلب
              </h3>
              <p className="text-gray-600">الرجاء الانتظار...</p>
            </motion.div>
          ) : success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] p-8 text-center text-white">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <Icons.FaCheck className="text-4xl sm:text-5xl text-[#53a1dd]" />
                </motion.div>
                <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                  تم إنشاء الطلب بنجاح!
                </h2>
              </div>

              <div className="p-6 sm:p-8">
                {responseData && (
                  <div className="bg-gradient-to-br from-gray-50 to-[#e8f4ff] rounded-xl p-6 mb-6">
                    <h3 className="font-bold text-gray-900 mb-4 text-center text-lg">
                      تفاصيل الطلب
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <span className="text-gray-500 text-sm block mb-1">
                          رقم الطلب
                        </span>
                        <span className="font-bold text-[#53a1dd] text-lg">
                          #{responseData?.data?.id ?? "--"}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <span className="text-gray-500 text-sm block mb-1">
                          العنوان
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formData.title}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <span className="text-gray-500 text-sm block mb-1">
                          الموقع
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formData.city}, {formData.region}
                        </span>
                      </div>
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <span className="text-gray-500 text-sm block mb-1">
                          المساحة
                        </span>
                        <span className="font-semibold text-gray-900">
                          {formData.area} م²
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleCreateNew}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                  >
                    إنشاء طلب جديد
                  </button>
                  <button
                    onClick={() => navigate("/my-requests")}
                    className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                  >
                    عرض طلباتي
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Progress Steps - محسّن ومُصلح */}
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                {/* الخطوات مع الخطوط */}
                <div className="flex items-center justify-between mb-4">
                  {steps.map((step, index) => (
                    <React.Fragment key={step.number}>
                      <div className="flex flex-col items-center flex-1">
                        {/* الدائرة */}
                        <motion.div
                          initial={{ scale: 0.8 }}
                          animate={{
                            scale: currentStep === step.number ? 1.1 : 1,
                            transition: { type: "spring", stiffness: 300 },
                          }}
                          className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all z-10 ${
                            currentStep >= step.number
                              ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white shadow-lg"
                              : "bg-gray-200 text-gray-500"
                          }`}
                        >
                          {currentStep > step.number ? (
                            <Icons.FaCheck className="text-xl" />
                          ) : (
                            step.number
                          )}
                        </motion.div>

                        {/* العنوان تحت الدائرة مباشرة */}
                        <div className="text-center mt-3 px-2">
                          <span
                            className={`text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                              currentStep === step.number
                                ? "text-[#53a1dd]"
                                : currentStep > step.number
                                ? "text-gray-700"
                                : "text-gray-500"
                            }`}
                          >
                            {step.title}
                          </span>
                        </div>
                      </div>

                      {/* الخط بين الدوائر */}
                      {index < steps.length - 1 && (
                        <div className="flex-1 h-1 mx-2 -mt-12 relative">
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded"></div>
                          <motion.div
                            initial={{ width: "0%" }}
                            animate={{
                              width: currentStep > step.number ? "100%" : "0%",
                              transition: { duration: 0.5, ease: "easeInOut" },
                            }}
                            className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] rounded"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Information */}
                    {currentStep === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            المعلومات الأساسية
                          </h2>
                          <p className="text-gray-600">
                            ابدأ بإدخال المعلومات الأساسية عن الأرض
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            عنوان الطلب <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base"
                            placeholder="مثال: أرض سكنية في الرياض"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              المنطقة <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="region"
                              value={formData.region}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base bg-white"
                              required
                            >
                              <option value="" disabled>
                                اختر المنطقة
                              </option>
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
                              value={formData.city}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
                              disabled={!formData.region}
                              required
                            >
                              <option value="" disabled>
                                اختر المدينة
                              </option>
                              {availableCities.map((city) => (
                                <option key={city} value={city}>
                                  {city}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Land Details */}
                    {currentStep === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            تفاصيل الأرض
                          </h2>
                          <p className="text-gray-600">
                            أضف معلومات تفصيلية عن نوع الأرض ومساحتها
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الغرض من التسويق
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleInputChange({
                                    target: { name: "purpose", value: "sale" },
                                  })
                                }
                                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                                  formData.purpose === "sale"
                                    ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                شراء
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  handleInputChange({
                                    target: {
                                      name: "purpose",
                                      value: "investment",
                                    },
                                  })
                                }
                                className={`px-4 py-3 rounded-xl font-semibold transition-all ${
                                  formData.purpose === "investment"
                                    ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white shadow-lg"
                                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                              >
                                استثمار
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              نوع الأرض
                            </label>
                            <select
                              name="type"
                              value={formData.type}
                              onChange={handleInputChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base bg-white"
                            >
                              <option value="residential">سكني</option>
                              <option value="commercial">تجاري</option>
                              <option value="agricultural">زراعي</option>
                            </select>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            المساحة (متر مربع){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="area"
                            value={formData.area}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base"
                            placeholder="أدخل المساحة بالمتر المربع"
                            min="1"
                            required
                            dir="ltr"
                            style={{ textAlign: "left" }}
                          />
                          <p className="text-xs text-gray-500 mt-1 text-left">
                            أدخل الرقم فقط (مثال: 500)
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Description & Acceptance */}
                    {currentStep === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            الوصف والموافقة
                          </h2>
                          <p className="text-gray-600">
                            أضف وصفاً تفصيلياً للأرض واقرأ الشروط
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            الوصف التفصيلي{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all text-base resize-none"
                            placeholder="اكتب وصفاً تفصيلياً عن الأرض، المميزات، الموقع، والخدمات القريبة..."
                            rows="5"
                            required
                          />
                        </div>

                        <div className="bg-gradient-to-br from-[#e8f4ff] to-[#d4ebff] rounded-xl p-4 border border-[#a6d4fa]">
                          <div className="flex items-start gap-3">
                            <input
                              type="checkbox"
                              name="terms_accepted"
                              checked={formData.terms_accepted}
                              onChange={handleInputChange}
                              className="mt-1 w-5 h-5 text-[#53a1dd] rounded focus:ring-[#53a1dd] cursor-pointer"
                              required
                            />
                            <div>
                              <label className="text-gray-800 font-medium block cursor-pointer">
                                أوافق على{" "}
                                <a
                                  href="https://shaheenplus.sa/terms-of-service"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#53a1dd] underline hover:text-[#2d8bcc]"
                                >
                                  الشروط والأحكام
                                </a>
                              </label>
                              <p className="text-gray-600 text-sm mt-1">
                                أقر بصحة جميع المعلومات المقدمة وأتحمل المسؤولية
                                القانونية عنها
                              </p>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Navigation Buttons */}
                <div className="bg-gray-50 px-6 sm:px-8 py-6 border-t border-gray-200">
                  <div className="flex gap-3">
                    {currentStep > 1 && (
                      <button
                        type="button"
                        onClick={() => setCurrentStep((prev) => prev - 1)}
                        className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                      >
                        السابق
                      </button>
                    )}

                    {currentStep < 3 ? (
                      <button
                        type="button"
                        onClick={() => {
                          if (currentStep === 1 && isStep1Valid)
                            setCurrentStep(2);
                          else if (currentStep === 2 && isStep2Valid)
                            setCurrentStep(3);
                          else {
                            showApiError("يرجى إكمال جميع الحقول المطلوبة");
                          }
                        }}
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                          (currentStep === 1 && isStep1Valid) ||
                          (currentStep === 2 && isStep2Valid)
                            ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white hover:shadow-lg transform hover:-translate-y-0.5"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        التالي
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
                          isFormValid && !loading
                            ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white hover:shadow-lg transform hover:-translate-y-0.5"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                        disabled={loading || !isFormValid}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            جاري الإرسال...
                          </span>
                        ) : (
                          "إرسال الطلب"
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default CreateLandRequest;
