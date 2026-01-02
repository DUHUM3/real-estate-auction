import React, { useState, useRef, useCallback, useMemo } from "react";
import {
  FileText,
  Upload,
  Check,
  X,
  AlertCircle,
  Loader2,
  Phone,
  Mail,
  User,
  MapPin,
  Send,
  MessageSquare,
} from "lucide-react";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    reason: "",
    message: "",
    full_name: "",
    email: "",
    phone: "",
    file: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [isDragActive, setIsDragActive] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const statusRef = useRef(null);
  const fileInputRef = useRef(null);

  const allowedReasons = useMemo(
    () => [
      "استشارة عقارية",
      "استفسار عن خدمة",
      "شكوى أو اقتراح",
      "طلب شراء",
      "طلب بيع",
      "تعاون تجاري",
      "أخرى",
    ],
    []
  );

  const allowedFileTypes = useMemo(
    () => [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ],
    []
  );

  const MAX_FILE_SIZE = 5 * 1024 * 1024;
  const MAX_MESSAGE_LENGTH = 1000;
  const MIN_MESSAGE_LENGTH = 10;

  const sanitizeInput = (value) => {
  return value
    .replace(/<script.*?>.*?<\/script>/gi, '') // منع سكربت
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
};


  const validateField = useCallback(
    (name, value) => {
      const sanitized = sanitizeInput(value);

      switch (name) {
        case "full_name":
          if (sanitized.length < 2) return "الاسم يجب أن يكون حرفين على الأقل";
          if (sanitized.length > 100) return "الاسم طويل جداً";
          if (!/^[\u0600-\u06FFa-zA-Z\s]+$/.test(sanitized))
            return "الاسم يحتوي على أحرف غير صالحة";
          return "";
        case "email":
          const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
          if (!emailRegex.test(sanitized)) return "البريد الإلكتروني غير صحيح";
          if (sanitized.length > 254) return "البريد الإلكتروني طويل جداً";
          return "";
        case "phone":
          const phoneRegex = /^05[0-9]{8}$/;
          if (!phoneRegex.test(sanitized))
            return "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام";
          return "";
        case "message":
          if (sanitized.length < MIN_MESSAGE_LENGTH)
            return `الرسالة يجب أن تكون ${MIN_MESSAGE_LENGTH} أحرف على الأقل`;
          if (sanitized.length > MAX_MESSAGE_LENGTH)
            return `الرسالة يجب ألا تتجاوز ${MAX_MESSAGE_LENGTH} حرف`;
          return "";
        case "reason":
          if (!value || !allowedReasons.includes(value))
            return "يرجى اختيار سبب صالح للتواصل";
          return "";
        default:
          return "";
      }
    },
    [allowedReasons, sanitizeInput]
  );

  const validateFile = useCallback(
    (file) => {
      if (!file) return "";

      if (file.size > MAX_FILE_SIZE) {
        return "حجم الملف يجب ألا يتجاوز 5MB";
      }

      if (!allowedFileTypes.includes(file.type)) {
        return "نوع الملف غير مدعوم";
      }

      const fileName = file.name;
      if (fileName.length > 255) return "اسم الملف طويل جداً";
      if (!/^[\w\-. ]+$/.test(fileName.replace(/\.[^.]+$/, "")))
        return "اسم الملف يحتوي على أحرف غير صالحة";

      return "";
    },
    [allowedFileTypes]
  );

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;
      const sanitized = sanitizeInput(value);

      setFormData((prev) => ({
        ...prev,
        [name]: sanitized,
      }));

      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    },
    [errors, sanitizeInput]
  );

  const handleFileChange = useCallback(
    (file) => {
      if (!file) return;

      const fileError = validateFile(file);
      if (fileError) {
        setErrors((prev) => ({
          ...prev,
          file: fileError,
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        file: file,
      }));

      setErrors((prev) => ({
        ...prev,
        file: "",
      }));
    },
    [validateFile]
  );

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragActive(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFileChange(files[0]);
      }
    },
    [handleFileChange]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragActive(false);
  }, []);

  const scrollToStatus = useCallback(() => {
    if (statusRef.current) {
      statusRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, []);

  const validateForm = useCallback(() => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (key !== "file") {
        const error = validateField(key, formData[key]);
        if (error) newErrors[key] = error;
      }
    });

    if (formData.file) {
      const fileError = validateFile(formData.file);
      if (fileError) newErrors.file = fileError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, validateField, validateFile]);

  const resetForm = useCallback(() => {
    setFormData({
      reason: "",
      message: "",
      full_name: "",
      email: "",
      phone: "",
      file: null,
    });
    setErrors({});
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setSubmitStatus({
        type: "error",
        message: "يرجى تصحيح الأخطاء في النموذج",
      });
      setTimeout(scrollToStatus, 100);
      return;
    }

    setIsLoading(true);
    setSubmitStatus(null);

    try {
      const submitData = new FormData();
      submitData.append("reason", formData.reason);
      submitData.append("message", formData.message);
      submitData.append("full_name", formData.full_name);
      submitData.append("email", formData.email);
      submitData.append("phone", formData.phone);

      if (formData.file) {
        submitData.append("file", formData.file);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(
        "https://core-api-x41.shaheenplus.sa/api/contact",
        {
          method: "POST",
          body: submitData,
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
          credentials: "same-origin",
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        setSubmitStatus({
          type: "success",
          message: result.message || "تم إرسال رسالتك بنجاح!",
        });
        resetForm();
      } else {
        setSubmitStatus({
          type: "error",
          message: result.message || "حدث خطأ أثناء إرسال الرسالة.",
        });
      }

      setTimeout(scrollToStatus, 100);
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";

      if (error.name === "AbortError") {
        errorMessage = "انتهت مهلة الطلب. يرجى المحاولة مرة أخرى.";
      } else if (!navigator.onLine) {
        errorMessage = "لا يوجد اتصال بالإنترنت.";
      }

      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });

      setTimeout(scrollToStatus, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <section
      className="relative bg-white py-8 md:py-12 lg:py-16 overflow-hidden"
      id="contact"
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header Section - تحسين للموبايل */}
        <div className="text-center mb-8 md:mb-12 lg:mb-16">
          <div className="inline-flex items-center justify-center p-2 md:p-3 bg-[#e8f3fc] rounded-full mb-3 md:mb-4">
            <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-[#53a1dd]" />
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4">
            تواصل معنا
          </h2>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto px-2 md:px-0">
            نحن هنا لمساعدتك في جميع استفساراتك العقارية. تواصل معنا وسنرد عليك
            في أقرب وقت ممكن
          </p>
          <div className="flex justify-center mt-4 md:mt-6">
            <div className="w-20 md:w-24 h-0.5 md:h-1 bg-gradient-to-r from-[#53a1dd] via-[#4a8fc7] to-[#53a1dd] rounded-full"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
          {/* Contact Info Cards - تحسين للموبايل */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Phone Card */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] rounded-lg md:rounded-xl flex items-center justify-center shadow-md md:shadow-lg">
                  <Phone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                    اتصل بنا
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                    نحن متاحون للرد على استفساراتك
                  </p>
                  <a
                    href="tel:+966566065406"
                    className="text-[#53a1dd] hover:text-[#4a8fc7] font-semibold text-sm md:text-base inline-flex items-center gap-1 md:gap-2 transition-colors"
                    style={{ direction: "ltr", unicodeBidi: "bidi-override" }}
                  >
                    +966 56 606 5406
                  </a>
                </div>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] rounded-lg md:rounded-xl flex items-center justify-center shadow-md md:shadow-lg">
                  <Mail className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                    راسلنا
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 mb-2 md:mb-3">
                    أرسل لنا رسالة عبر البريد الإلكتروني
                  </p>
                  <a
                    href="mailto:info@shaheenplus.sa"
                    className="text-[#53a1dd] hover:text-[#4a8fc7] font-semibold text-sm md:text-base inline-flex items-center gap-1 md:gap-2 transition-colors truncate"
                  >
                    <span className="truncate">info@shaheenplus.sa</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] rounded-lg md:rounded-xl flex items-center justify-center shadow-md md:shadow-lg">
                  <MapPin className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div className="flex-1 text-right">
                  <h3 className="text-base md:text-lg font-bold text-gray-900 mb-1 md:mb-2">
                    موقعنا
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                    المملكة العربية السعودية
                    <br />
                    نخدم جميع مناطق المملكة
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form - تحسين كامل للموبايل */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl md:rounded-2xl lg:rounded-3xl p-4 md:p-6 lg:p-8 shadow-lg md:shadow-xl border border-gray-100">
              {/* Status Message */}
              {submitStatus && (
                <div
                  ref={statusRef}
                  className={`mb-4 md:mb-6 p-4 md:p-5 rounded-lg md:rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-500 ${
                    submitStatus.type === "success"
                      ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200"
                      : "bg-gradient-to-r from-red-50 to-rose-50 text-red-800 border border-red-200"
                  }`}
                  role="alert"
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center ${
                      submitStatus.type === "success"
                        ? "bg-green-100"
                        : "bg-red-100"
                    }`}
                  >
                    {submitStatus.type === "success" ? (
                      <Check className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </div>
                  <span className="flex-1 font-semibold text-right text-sm md:text-base">
                    {submitStatus.message}
                  </span>
                </div>
              )}

              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit} noValidate>
                {/* Reason Select */}
                <div className="group">
                  <label
                    htmlFor="reason"
                    className="block text-right text-gray-800 font-bold mb-2 text-xs md:text-sm"
                  >
                    سبب التواصل <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <select
                      id="reason"
                      name="reason"
                      value={formData.reason}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("reason")}
                      onBlur={() => setFocusedField(null)}
                      required
                      className={`w-full px-3 md:px-4 py-3 md:py-4 pr-10 md:pr-12 border rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-[#e8f3fc] focus:border-[#53a1dd] transition-all duration-300 text-right bg-white appearance-none cursor-pointer font-medium text-sm md:text-base ${
                        errors.reason
                          ? "border-red-400 bg-red-50"
                          : focusedField === "reason"
                          ? "border-[#53a1dd] shadow-md"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <option value="" className="text-gray-400">
                        اختر سبب التواصل
                      </option>
                      {allowedReasons.map((reason, index) => (
                        <option
                          key={index}
                          value={reason}
                          className="text-gray-900"
                        >
                          {reason}
                        </option>
                      ))}
                    </select>
                    <MessageSquare
                      className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 pointer-events-none transition-colors ${
                        focusedField === "reason"
                          ? "text-[#53a1dd]"
                          : "text-gray-400"
                      }`}
                    />
                    <div className="absolute left-3 md:left-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                      <svg
                        className="w-3 h-3 md:w-4 md:h-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                  {errors.reason && (
                    <p className="text-red-600 text-xs md:text-sm text-right mt-1 md:mt-2 flex items-center justify-end gap-1 md:gap-2 animate-in slide-in-from-top-2">
                      <span>{errors.reason}</span>
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                    </p>
                  )}
                </div>

                {/* Name and Email Grid */}
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  {/* Name */}
                  <div className="group">
                    <label
                      htmlFor="full_name"
                      className="block text-right text-gray-800 font-bold mb-2 text-xs md:text-sm"
                    >
                      الاسم الكامل <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("full_name")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="أدخل اسمك الكامل"
                        maxLength="100"
                        required
                        className={`w-full px-3 md:px-4 py-3 md:py-4 pr-10 md:pr-12 border rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-[#e8f3fc] focus:border-[#53a1dd] transition-all duration-300 text-right font-medium text-sm md:text-base ${
                          errors.full_name
                            ? "border-red-400 bg-red-50"
                            : focusedField === "full_name"
                            ? "border-[#53a1dd] shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <User
                        className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 transition-colors ${
                          focusedField === "full_name"
                            ? "text-[#53a1dd]"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    {errors.full_name && (
                      <p className="text-red-600 text-xs md:text-sm text-right mt-1 md:mt-2 flex items-center justify-end gap-1 md:gap-2 animate-in slide-in-from-top-2">
                        <span>{errors.full_name}</span>
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block text-right text-gray-800 font-bold mb-2 text-xs md:text-sm"
                    >
                      البريد الإلكتروني <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        onFocus={() => setFocusedField("email")}
                        onBlur={() => setFocusedField(null)}
                        placeholder="example@email.com"
                        maxLength="254"
                        required
                        className={`w-full px-3 md:px-4 py-3 md:py-4 pr-10 md:pr-12 border rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-[#e8f3fc] focus:border-[#53a1dd] transition-all duration-300 text-right font-medium text-sm md:text-base ${
                          errors.email
                            ? "border-red-400 bg-red-50"
                            : focusedField === "email"
                            ? "border-[#53a1dd] shadow-md"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      />
                      <Mail
                        className={`absolute right-3 md:right-4 top-1/2 transform -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 transition-colors ${
                          focusedField === "email"
                            ? "text-[#53a1dd]"
                            : "text-gray-400"
                        }`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-600 text-xs md:text-sm text-right mt-1 md:mt-2 flex items-center justify-end gap-1 md:gap-2 animate-in slide-in-from-top-2">
                        <span>{errors.email}</span>
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      </p>
                    )}
                  </div>
                </div>

                {/* Phone */}
                <div className="group">
                  <label
                    htmlFor="phone"
                    className="block text-right text-gray-800 font-bold mb-2 text-xs md:text-sm"
                  >
                    رقم الجوال <span className="text-red-500">*</span>
                  </label>
                  <div className="flex rounded-lg md:rounded-xl overflow-hidden shadow-sm">
                    <div
                      className={`flex items-center px-3 md:px-4 bg-gradient-to-br from-gray-50 to-gray-100 border border-l-0 text-gray-700 font-bold text-sm md:text-base transition-colors ${
                        focusedField === "phone"
                          ? "border-[#53a1dd]"
                          : "border-gray-200"
                      }`}
                    >
                      <Phone className="w-3 h-3 md:w-4 md:h-4 ml-1 md:ml-2 text-gray-500" />
                      <span dir="ltr">+966</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      onFocus={() => setFocusedField("phone")}
                      onBlur={() => setFocusedField(null)}
                      placeholder="5X XXX XXXX"
                      pattern="05[0-9]{8}"
                      maxLength="10"
                      required
                      dir="ltr"
                      className={`flex-1 px-3 md:px-4 py-3 md:py-4 border border-r-0 focus:ring-2 md:focus:ring-4 focus:ring-[#e8f3fc] focus:border-[#53a1dd] transition-all duration-300 text-left font-medium text-sm md:text-base ${
                        errors.phone
                          ? "border-red-400 bg-red-50"
                          : focusedField === "phone"
                          ? "border-[#53a1dd]"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-red-600 text-xs md:text-sm text-right mt-1 md:mt-2 flex items-center justify-end gap-1 md:gap-2 animate-in slide-in-from-top-2">
                      <span>{errors.phone}</span>
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                    </p>
                  )}
                </div>

                {/* Message */}
                <div className="group">
                  <label
                    htmlFor="message"
                    className="block text-right text-gray-800 font-bold mb-2 text-xs md:text-sm"
                  >
                    رسالتك <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    onFocus={() => setFocusedField("message")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="اكتب رسالتك هنا..."
                    rows="4"
                    maxLength={MAX_MESSAGE_LENGTH}
                    required
                    className={`w-full px-3 md:px-4 py-3 md:py-4 border rounded-lg md:rounded-xl focus:ring-2 md:focus:ring-4 focus:ring-[#e8f3fc] focus:border-[#53a1dd] transition-all duration-300 text-right resize-none font-medium leading-relaxed text-sm md:text-base ${
                      errors.message
                        ? "border-red-400 bg-red-50"
                        : focusedField === "message"
                        ? "border-[#53a1dd] shadow-md"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  />
                  <div className="flex justify-between items-center mt-2 text-xs md:text-sm">
                    <span
                      className={`transition-colors ${
                        formData.message.length > MAX_MESSAGE_LENGTH * 0.9
                          ? "text-orange-600 font-semibold"
                          : "text-gray-500"
                      }`}
                    >
                      {formData.message.length} / {MAX_MESSAGE_LENGTH}
                    </span>
                    {errors.message && (
                      <p className="text-red-600 flex items-center gap-1 md:gap-2 animate-in slide-in-from-top-2">
                        <span>{errors.message}</span>
                        <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                      </p>
                    )}
                  </div>
                </div>

                {/* File Upload */}
                <div className="group">
                  <label className="block text-right text-gray-800 font-bold mb-2 text-xs md:text-sm">
                    مرفق{" "}
                    <span className="text-gray-400 text-xs md:text-sm font-normal">
                      (اختياري)
                    </span>
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-lg md:rounded-xl p-4 md:p-6 text-center transition-all duration-300 cursor-pointer overflow-hidden ${
                      isDragActive
                        ? "border-[#53a1dd] bg-[#e8f3fc] md:scale-105 shadow-md"
                        : errors.file
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300 hover:border-[#53a1dd] hover:bg-gray-50"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileChange(e.target.files[0])}
                    />

                    {formData.file ? (
                      <div className="flex items-center justify-center gap-3 md:gap-4 animate-in fade-in zoom-in duration-300">
                        <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-[#53a1dd] to-[#4a8fc7] rounded-lg md:rounded-xl flex items-center justify-center shadow-md">
                          <FileText className="w-5 h-5 md:w-6 md:h-6 text-white" />
                        </div>
                        <div className="flex-1 text-right min-w-0">
                          <div className="font-bold text-gray-900 text-xs md:text-sm truncate">
                            {formData.file.name}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5 md:mt-1">
                            {formatFileSize(formData.file.size)}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFormData((prev) => ({ ...prev, file: null }));
                            fileInputRef.current.value = "";
                          }}
                          className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-red-100 hover:bg-red-200 text-red-600 flex items-center justify-center transition-colors"
                        >
                          <X className="w-4 h-4 md:w-5 md:h-5" />
                        </button>
                      </div>
                    ) : (
                      <div className="animate-in fade-in duration-300">
                        <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 bg-gradient-to-br from-[#e8f3fc] to-[#c8e2f9] rounded-lg md:rounded-xl flex items-center justify-center">
                          <Upload className="w-5 h-5 md:w-6 md:h-6 text-[#53a1dd]" />
                        </div>
                        <div className="font-bold text-gray-800 text-sm md:text-base mb-1 md:mb-2">
                          اسحب الملف هنا أو انقر للتحميل
                        </div>
                        <div className="text-xs md:text-sm text-gray-500">
                          PDF, Word, صور (حد أقصى 5MB)
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.file && (
                    <p className="text-red-600 text-xs md:text-sm text-right mt-1 md:mt-2 flex items-center justify-end gap-1 md:gap-2 animate-in slide-in-from-top-2">
                      <span>{errors.file}</span>
                      <AlertCircle className="w-3 h-3 md:w-4 md:h-4" />
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className={`w-full py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl font-bold text-white text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95 ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#53a1dd] via-[#4a8fc7] to-[#3d7db3] hover:from-[#4a8fc7] hover:via-[#3d7db3] hover:to-[#306a9f]"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2 md:gap-3">
                      <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
                      <span className="text-sm md:text-base">جاري الإرسال...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center gap-2 md:gap-3">
                      <span className="text-sm md:text-base">إرسال الرسالة</span>
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    </span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;