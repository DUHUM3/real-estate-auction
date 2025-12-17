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

  // Validation functions
  const validateField = useCallback(
    (name, value) => {
      switch (name) {
        case "full_name":
          return value.trim().length < 2
            ? "الاسم يجب أن يكون أكثر من حرفين"
            : "";
        case "email":
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return !emailRegex.test(value) ? "البريد الإلكتروني غير صحيح" : "";
        case "phone":
          const phoneRegex = /^05[0-9]{8}$/;
          return !phoneRegex.test(value)
            ? "رقم الجوال يجب أن يبدأ بـ 05 ويتكون من 10 أرقام"
            : "";
        case "message":
          return value.trim().length < 10
            ? "الرسالة يجب أن تكون أكثر من 10 أحرف"
            : "";
        case "reason":
          return !value || !allowedReasons.includes(value)
            ? "يرجى اختيار سبب للتواصل"
            : "";
        default:
          return "";
      }
    },
    [allowedReasons]
  );

  const validateFile = useCallback(
    (file) => {
      if (!file) return "";

      if (file.size > 10 * 1024 * 1024) {
        return "حجم الملف يجب أن لا يتجاوز 10MB";
      }

      if (!allowedFileTypes.includes(file.type)) {
        return "نوع الملف غير مدعوم. يرجى اختيار ملف PDF أو Word أو صورة";
      }

      return "";
    },
    [allowedFileTypes]
  );

  const handleInputChange = useCallback(
    (e) => {
      const { name, value } = e.target;

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }

      // Real-time validation for better UX
      const error = validateField(name, value);
      if (error) {
        setErrors((prev) => ({
          ...prev,
          [name]: error,
        }));
      }
    },
    [errors, validateField]
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

      statusRef.current.style.transition = "all 0.3s ease";
      statusRef.current.style.transform = "scale(1.02)";

      setTimeout(() => {
        if (statusRef.current) {
          statusRef.current.style.transform = "scale(1)";
        }
      }, 1000);
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
      submitData.append("message", formData.message.trim());
      submitData.append("full_name", formData.full_name.trim());
      submitData.append("email", formData.email.trim());
      submitData.append("phone", `+966${formData.phone}`);

      if (formData.file) {
        submitData.append("file", formData.file);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      const response = await fetch(
        "https://core-api-x41.shaheenplus.sa/api/contact",
        {
          method: "POST",
          body: submitData,
          signal: controller.signal,
          headers: {
            Accept: "application/json",
          },
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
          message:
            result.message || "تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.",
        });
        resetForm();
      } else {
        setSubmitStatus({
          type: "error",
          message:
            result.message ||
            "حدث خطأ أثناء إرسال الرسالة. يرجى المحاولة مرة أخرى.",
        });
      }

      setTimeout(scrollToStatus, 100);
    } catch (error) {
      console.error("Error submitting form:", error);

      let errorMessage = "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.";

      if (error.name === "AbortError") {
        errorMessage =
          "انتهت مهلة الطلب. يرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.";
      } else if (!navigator.onLine) {
        errorMessage =
          "لا يوجد اتصال بالإنترنت. يرجى التحقق من اتصالك والمحاولة مرة أخرى.";
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
      className="bg-gradient-to-br from-gray-50 to-white py-20 relative overflow-hidden"
      id="contact"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-right mb-16">
          <div className="inline-block">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-800 mb-4 relative">
              تواصل معنا
              <div
                className="absolute -bottom-2 right-0 w-20 h-1 
                      bg-gradient-to-l from-[#53a1dd] to-[#a7d1f5] 
                      rounded-full"
              ></div>
            </h2>
            <p className="text-gray-600 text-lg mt-6">
              نحن هنا لمساعدتك في جميع احتياجاتك العقارية
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 backdrop-blur-sm">
            {/* Status Message */}
            {submitStatus && (
              <div
                ref={statusRef}
                className={`p-6 mb-8 rounded-2xl text-center font-medium transition-all duration-500 transform ${
                  submitStatus.type === "success"
                    ? "bg-gradient-to-r from-green-50 to-emerald-50 text-green-800 border border-green-200 shadow-lg"
                    : "bg-gradient-to-r from-red-50 to-pink-50 text-red-800 border border-red-200 shadow-lg"
                }`}
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  {submitStatus.type === "success" ? (
                    <Check className="w-6 h-6 text-green-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                  <span className="text-lg">{submitStatus.message}</span>
                </div>
              </div>
            )}

            <form className="space-y-8" onSubmit={handleSubmit} noValidate>
              {/* Contact Reason */}
              <div className="space-y-3">
                <label
                  htmlFor="reason"
                  className="block text-right text-gray-700 font-semibold text-lg"
                >
                  سبب التواصل *
                </label>
                <select
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-right bg-white text-lg ${
                    errors.reason
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-describedby={errors.reason ? "reason-error" : undefined}
                >
                  <option value="">اختر سبب التواصل</option>
                  {allowedReasons.map((reason, index) => (
                    <option key={index} value={reason}>
                      {reason}
                    </option>
                  ))}
                </select>
                {errors.reason && (
                  <p
                    id="reason-error"
                    className="text-red-600 text-sm text-right flex items-center justify-end space-x-1 space-x-reverse"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.reason}</span>
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-3">
                <label
                  htmlFor="message"
                  className="block text-right text-gray-700 font-semibold text-lg"
                >
                  كيف يمكننا مساعدتك؟ *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder="اشرح لنا احتياجاتك ونوع الاستشارة التي تبحث عنها..."
                  rows="6"
                  required
                  className={`w-full px-6 py-4 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-right resize-none text-lg leading-relaxed ${
                    errors.message
                      ? "border-red-400"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  aria-describedby={
                    errors.message ? "message-error" : undefined
                  }
                />
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{formData.message.length} / 1000</span>
                  {errors.message && (
                    <p
                      id="message-error"
                      className="text-red-600 flex items-center space-x-1 space-x-reverse"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.message}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* File Upload */}
              <div className="space-y-3">
                <label className="block text-right text-gray-700 font-semibold text-lg">
                  ارفق ملف أو صورة (اختياري)
                </label>
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer ${
                    isDragActive
                      ? "border-blue-400 bg-blue-50"
                      : errors.file
                      ? "border-red-300 bg-red-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
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
                    <div className="space-y-4">
                      <div className="flex items-center justify-center space-x-3 space-x-reverse">
                        <FileText className="w-8 h-8 text-blue-600" />
                        <div className="text-right">
                          <div className="font-medium text-gray-800">
                            {formData.file.name}
                          </div>
                          <div className="text-sm text-gray-500">
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
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload
                        className={`w-12 h-12 mx-auto ${
                          isDragActive ? "text-blue-500" : "text-gray-400"
                        }`}
                      />
                      <div className="space-y-2">
                        <div className="text-gray-700 font-medium text-lg">
                          {isDragActive
                            ? "اترك الملف هنا"
                            : "انقر لرفع الملفات أو اسحب الملف هنا"}
                        </div>
                        <div className="text-gray-500">
                          PDF, Word, JPG, PNG (الحد الأقصى 10MB)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.file && (
                  <p className="text-red-600 text-sm text-right flex items-center justify-end space-x-1 space-x-reverse">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.file}</span>
                  </p>
                )}
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Full Name */}
                <div className="space-y-3">
                  <label
                    htmlFor="full_name"
                    className="block text-right text-gray-700 font-semibold text-lg"
                  >
                    الاسم الكامل *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      placeholder="أدخل اسمك الكامل"
                      required
                      className={`w-full px-6 py-4 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-right text-lg ${
                        errors.full_name
                          ? "border-red-400"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-describedby={
                        errors.full_name ? "name-error" : undefined
                      }
                    />
                    <User className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {errors.full_name && (
                    <p
                      id="name-error"
                      className="text-red-600 text-sm text-right flex items-center justify-end space-x-1 space-x-reverse"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.full_name}</span>
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-3">
                  <label
                    htmlFor="email"
                    className="block text-right text-gray-700 font-semibold text-lg"
                  >
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="example@email.com"
                      required
                      className={`w-full px-6 py-4 pr-12 border-2 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-right text-lg ${
                        errors.email
                          ? "border-red-400"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      aria-describedby={
                        errors.email ? "email-error" : undefined
                      }
                    />
                    <Mail className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-red-600 text-sm text-right flex items-center justify-end space-x-1 space-x-reverse"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-3">
                <label
                  htmlFor="phone"
                  className="block text-right text-gray-700 font-semibold text-lg"
                >
                  رقم الجوال (سعودي) *
                </label>
                <div className="flex">
                  <div className="flex items-center px-6 bg-gray-100 border-2 border-gray-200 border-l-0 rounded-r-xl text-gray-600 font-medium text-lg">
                    <Phone className="w-5 h-5 ml-2" />
                    +966
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="5X XXX XXXX"
                    pattern="05[0-9]{8}"
                    maxLength="10"
                    required
                    className={`flex-1 px-6 py-4 border-2 rounded-l-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-300 text-right border-r-0 text-lg ${
                      errors.phone
                        ? "border-red-400"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                  />
                </div>
                {errors.phone ? (
                  <p
                    id="phone-error"
                    className="text-red-600 text-sm text-right flex items-center justify-end space-x-1 space-x-reverse"
                  >
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phone}</span>
                  </p>
                ) : (
                  <small className="block text-right text-gray-500 text-sm">
                    يجب أن يبدأ الرقم بـ 05 ويتكون من 10 أرقام
                  </small>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className={`w-full py-5 px-8 rounded-xl font-bold text-white text-lg transition-all duration-300 transform ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-[#53a1dd] to-[#3a83f2] hover:from-[#3a83f2] hover:to-[#2f6fd1] hover:shadow-2xl hover:-translate-y-1 focus:ring-4 focus:ring-blue-200"
                  }`}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-3 space-x-reverse">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span>جاري الإرسال...</span>
                    </div>
                  ) : (
                    <span className="flex items-center justify-center space-x-2 space-x-reverse">
                      <span>إرسال الرسالة</span>
                      <Check className="w-5 h-5" />
                    </span>
                  )}
                </button>
              </div>
            </form>

            {/* Additional Info */}
            <div className="mt-12 pt-8 border-t border-gray-200">
              <div className="text-center text-gray-600">
                <p className="text-lg mb-2">أو تواصل معنا مباشرة</p>
                <div className="flex flex-wrap justify-center items-center gap-6 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span
                      className="ltr"
                      style={{ direction: "ltr", unicodeBidi: "embed" }}
                    >
                      +966 56 606 5406
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Mail className="w-4 h-4 text-blue-600" />
                    <span>info@shaheenplus.sa</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
