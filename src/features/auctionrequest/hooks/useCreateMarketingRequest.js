import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../components/common/ToastProvider";
import {
  validationMessages,
  fileUploadConfig,
} from "../constants/marketingRequest.constants";
import { marketingApi } from "../services/marketingRequests.api";
import { saudiRegions } from "../../../Constants/saudiRegions";

/**
 * Custom hook containing all business logic for creating marketing requests
 */
function useCreateMarketingRequest(openLogin) {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInputRef = useRef(null);

  // Form state - أضف الحقول الجديدة هنا
  const [formData, setFormData] = useState({
    // الحقول الجديدة
    name: "",
    id_number: "",
    property_role: "owner", // قيمة افتراضية
    document_number: "",
    agency_number: "",
    
    // الحقول السابقة
    region: "",
    city: "",
    description: "",
    terms_accepted: false,
  });

  // UI state
  const [images, setImages] = useState([]);
  const [imagesPreviews, setImagesPreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [formTouched, setFormTouched] = useState(false);
  const [dragging, setDragging] = useState(false);

  // User/auth state
  const [userType, setUserType] = useState(null);
  const [checkingUserType, setCheckingUserType] = useState(true);

  // Location data (بيانات مباشرة)
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  // Initialize
  useEffect(() => {
    checkUserType();
    loadLocationData();
    loadUserData();
  }, []);

  useEffect(() => {
    updateAvailableCities();
  }, [formData.region, cities]);

  useEffect(() => {
    generateImagePreviews();
  }, [images]);

  // دالة جديدة لجلب بيانات المستخدم
  const loadUserData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        // هنا يمكنك جلب بيانات المستخدم من API إذا كانت متاحة
        // أو استخدام البيانات المحفوظة في localStorage
        const storedUser = localStorage.getItem("user_data");
        if (storedUser) {
          const user = JSON.parse(storedUser);
          setFormData(prev => ({
            ...prev,
            name: user.full_name || "",
            // يمكنك إضافة حقول أخرى إذا كانت متوفرة
          }));
        }
      }
    } catch (err) {
      console.error("❌ خطأ في تحميل بيانات المستخدم:", err);
    }
  };

  const checkUserType = () => {
    try {
      setCheckingUserType(true);
      const storedUserType = localStorage.getItem("user_type");
      const token = localStorage.getItem("token");

      if (!token) {
        setUserType(null);
      } else if (storedUserType === "شركة مزادات") {
        setUserType("شركة مزادات");
        toast.error(
          "عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية"
        );
      } else {
        setUserType(storedUserType);
      }
    } catch (err) {
      console.error("❌ خطأ في التحقق من نوع المستخدم:", err);
      toast.error("حدث خطأ في التحقق من الصلاحيات");
    } finally {
      setCheckingUserType(false);
    }
  };

  const loadLocationData = () => {
    const regionsList = saudiRegions.map((region) => region.name); // قائمة الأسماء فقط
    const citiesMap = {};

    saudiRegions.forEach((region) => {
      citiesMap[region.name] = region.cities;
    });

    setRegions(regionsList);
    setCities(citiesMap);
  };

  const updateAvailableCities = () => {
    if (formData.region && cities[formData.region]) {
      const citiesList = cities[formData.region];
      setAvailableCities(citiesList);

      if (!formData.city && citiesList.length > 0) {
        setFormData((prev) => ({
          ...prev,
          city: citiesList[0],
        }));
      }
    } else {
      setAvailableCities([]);
      setFormData((prev) => ({
        ...prev,
        city: "",
      }));
    }
  };

  const generateImagePreviews = () => {
    if (images.length === 0) {
      setImagesPreviews([]);
      return;
    }

    const previews = [];
    let processedCount = 0;

    images.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews[index] = {
          file,
          preview: e.target.result,
        };
        processedCount++;

        if (processedCount === images.length) {
          setImagesPreviews(previews.filter(Boolean));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const resetForm = () => {
    setSuccess(false);
    setFormData({
      // الحقول الجديدة
      name: "",
      id_number: "",
      property_role: "owner",
      document_number: "",
      agency_number: "",
      
      // الحقول السابقة
      region: "",
      city: "",
      description: "",
      terms_accepted: false,
    });
    setImages([]);
    setImagesPreviews([]);
    setError(null);
    setResponseData(null);
    setFormTouched(false);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormTouched(true);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    processSelectedImages(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files);
      processSelectedImages(files);
    }
  };

  const validateImage = (file) => {
    const isValidType = fileUploadConfig.acceptedTypes.includes(
      file.type.toLowerCase()
    );
    if (!isValidType) {
      toast.error(validationMessages.IMAGE_TYPE);
      return false;
    }

    if (file.size > fileUploadConfig.maxSize) {
      toast.error(validationMessages.IMAGE_SIZE);
      return false;
    }

    return true;
  };

  const processSelectedImages = (files) => {
    const totalImages = images.length + files.length;

    if (totalImages > fileUploadConfig.maxFiles) {
      toast.error(validationMessages.MAX_IMAGES);
      return;
    }

    const validFiles = files.filter((file) => validateImage(file));

    if (validFiles.length > 0) {
      setImages((prev) => [...prev, ...validFiles]);
      setError(null);
      setFormTouched(true);
      toast.success(`تم إضافة ${validFiles.length} صورة بنجاح`);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagesPreviews((prev) => prev.filter((_, i) => i !== index));
    setFormTouched(true);
    toast.success("تم حذف الصورة بنجاح");
  };

  const validateForm = () => {
    if (userType === "شركة مزادات") {
      toast.error(
        "عذراً، شركات المزادات غير مسموح لها بإنشاء طلبات تسويق منتجات عقارية"
      );
      return false;
    }

    // التحقق من الحقول الجديدة
    if (!formData.name || !formData.id_number || !formData.document_number) {
      toast.error("يرجى ملء جميع الحقول الأساسية");
      return false;
    }

    // التحقق من الحقول السابقة
    if (
      !formData.region ||
      !formData.city ||
      !formData.description
    ) {
      toast.error(validationMessages.REQUIRED_FIELD);
      return false;
    }

    // التحقق من رقم الوكالة إذا كان وكيل شرعي
    if (formData.property_role === "legal_agent" && !formData.agency_number) {
      toast.error("رقم الوكالة مطلوب عند اختيار صفة وكيل شرعي");
      return false;
    }

    if (images.length === 0) {
      toast.error(validationMessages.MIN_IMAGES);
      return false;
    }

    if (!formData.terms_accepted) {
      toast.error(validationMessages.TERMS_REQUIRED);
      return false;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error(validationMessages.LOGIN_REQUIRED);
      if (openLogin) openLogin();
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    const loadingToastId = toast.loading("جاري إنشاء طلب التسويق...");

    try {
      setLoading(true);

      // إعداد البيانات للإرسال
      const submitData = new FormData();
      
      // إضافة الحقول الجديدة
      submitData.append("name", formData.name);
      submitData.append("id_number", formData.id_number);
      submitData.append("property_role", formData.property_role);
      submitData.append("document_number", formData.document_number);
      
      // إضافة رقم الوكالة فقط إذا كان وكيل شرعي
      if (formData.property_role === "legal_agent") {
        submitData.append("agency_number", formData.agency_number);
      }
      
      // إضافة الحقول السابقة
      submitData.append("region", formData.region);
      submitData.append("city", formData.city);
      submitData.append("description", formData.description);
      submitData.append("terms_accepted", "true");

      // إضافة الصور
      images.forEach((image) => {
        submitData.append("images[]", image);
      });

      // عرض البيانات المرسلة للتصحيح
      console.log("📤 البيانات المرسلة إلى الخادم:");
      console.log("- الاسم:", formData.name);
      console.log("- رقم الهوية:", formData.id_number);
      console.log("- الصفة:", formData.property_role);
      console.log("- رقم الصك:", formData.document_number);
      if (formData.property_role === "legal_agent") {
        console.log("- رقم الوكالة:", formData.agency_number);
      }
      console.log("- المنطقة:", formData.region);
      console.log("- المدينة:", formData.city);
      console.log("- عدد الصور:", images.length);

      const response = await marketingApi.submitMarketingRequest(submitData);

      setResponseData(response);
      setSuccess(true);

      toast.dismiss(loadingToastId);
      toast.success("تم إنشاء طلب التسويق بنجاح!");

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("❌ خطأ في إنشاء طلب التسويق:", err);
      console.error("❌ تفاصيل الخطأ:", err.response?.data);
      
      toast.dismiss(loadingToastId);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApiError = (err) => {
    let errorMsg = "حدث خطأ غير متوقع";

    if (err.response) {
      console.error("❌ استجابة الخطأ:", err.response.data);
      
      switch (err.response.status) {
        case 401:
          errorMsg = "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى";
          localStorage.removeItem("token");
          localStorage.removeItem("user_type");
          if (openLogin) openLogin();
          break;
        case 422:
          // عرض أخطاء التحقق بشكل مفصل
          const validationErrors = err.response.data.errors;
          if (validationErrors) {
            errorMsg = "بيانات غير صالحة:\n";
            Object.keys(validationErrors).forEach(key => {
              errorMsg += `- ${validationErrors[key].join(', ')}\n`;
            });
          } else {
            errorMsg = err.response.data.message || "يرجى التحقق من البيانات المدخلة";
          }
          break;
        case 403:
          errorMsg = "عذراً، ليس لديك صلاحية لإنشاء طلبات تسويق منتجات عقارية";
          break;
        default:
          errorMsg = err.response.data.message || "حدث خطأ في الخادم";
      }
    } else if (err.request) {
      errorMsg = "تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت";
    }

    toast.error(errorMsg);
    setError(errorMsg);
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
    formData.name &&
    formData.id_number &&
    formData.document_number &&
    formData.region &&
    formData.city &&
    formData.description &&
    images.length > 0 &&
    formData.terms_accepted &&
    // التحقق من رقم الوكالة إذا كان وكيل شرعي
    (formData.property_role !== "legal_agent" || formData.agency_number);

  return {
    // State
    userType,
    checkingUserType,
    loading,
    success,
    error,
    responseData,
    formData,
    images,
    imagesPreviews,
    regions,
    availableCities,
    formTouched,
    dragging,
    fileInputRef,

    // Handlers
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    handleSubmit,
    handleBack,
    handleCreateNew,

    // Computed values
    isUserAllowed,
    isFormValid,
  };
}

export default useCreateMarketingRequest;