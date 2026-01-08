// src/features/auctions/hooks/useCreateAuctionForm.js
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createAuction } from "../../services/auctions.api";
import { saudiRegions } from "../../../../Constants/saudiRegions";

const useCreateAuctionForm = (token, toast, navigate) => {
  // بدأ مباشرة بالمستقبلات بدون useAuth أو useToast
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState([24.7136, 46.6753]);
  const [apiErrors, setApiErrors] = useState({});
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [citiesList, setCitiesList] = useState([]);

  const goToStep = (step) => {
  setFormComplete(false);
  setCurrentStep(step);
};


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    intro_link: "",
    start_time: "",
    auction_date: "",
    address: "",
    city: "",
    region: "",
    latitude: "",
    longitude: "",
    cover_image: [],
    images: [],
    videos: [],
  });

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return formData.title.trim() && formData.description.trim();
      case 2:
        return (
          formData.start_time &&
          formData.auction_date &&
          formData.address.trim() &&
          formData.city.trim() &&
          formData.region.trim() &&
          formData.latitude &&
          formData.longitude
        );
      case 3:
        return (
          formData.cover_image.length > 0 && formData.images.length > 0
        );
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // مسح خطأ الحقل عند التعديل
    if (apiErrors[name]) {
      setApiErrors((prev) => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleFileChange = (fieldName, files) => {
    setFormData((prev) => ({ ...prev, [fieldName]: files }));
    
    // مسح خطأ الحقل عند التعديل
    if (apiErrors[fieldName]) {
      setApiErrors((prev) => {
        const updated = { ...prev };
        delete updated[fieldName];
        return updated;
      });
    }
  };

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setSelectedRegion(region);

    // Find selected region object and update cities list
    const regionObj = saudiRegions.find((r) => r.name === region);
    if (regionObj) {
      setCitiesList(regionObj.cities);
      setSelectedCity("");

      // Update form data
      setFormData((prev) => ({
        ...prev,
        region: region,
        city: "",
      }));
    } else {
      setCitiesList([]);
      setSelectedCity("");
    }

    // Clear errors
    if (apiErrors.region) {
      setApiErrors((prev) => {
        const updated = { ...prev };
        delete updated.region;
        return updated;
      });
    }
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setSelectedCity(city);

    // Update form data
    setFormData((prev) => ({
      ...prev,
      city: city,
    }));

    // Clear errors
    if (apiErrors.city) {
      setApiErrors((prev) => {
        const updated = { ...prev };
        delete updated.city;
        return updated;
      });
    }
  };

  const handleMapPositionChange = (position) => {
    setMapPosition(position);
    setFormData((prev) => ({
      ...prev,
      latitude: position[0].toString(),
      longitude: position[1].toString(),
    }));
  };

  const handleAddAd = async () => {
    setFormLoading(true);
    setApiErrors({});
    toast.loading("جاري إضافة المزاد...");

    try {
      const response = await createAuction(formData, token);
      
      if (!response.ok) {
        const responseData = await response.json();
        
        if (response.status === 422) {
          setApiErrors(responseData.errors || {});
          toast.error("يوجد أخطاء في البيانات المدخلة. يرجى التحقق من الحقول.");
        } else if (response.status === 429) {
          toast.error(
            "لقد تجاوزت الحد المسموح من الطلبات. يرجى المحاولة لاحقاً."
          );
        } else if (response.status === 401) {
          toast.error("يجب تسجيل الدخول أولاً.");
        } else {
          toast.error(
            responseData.message ||
              "حدث خطأ أثناء إضافة المزاد. يرجى المحاولة مرة أخرى."
          );
        }
        setFormLoading(false);
        return;
      }

      const responseData = await response.json();
      toast.success(responseData.message || "تم إضافة المزاد بنجاح");

      // إعادة تعيين النموذج
      resetForm();

      // الانتقال إلى صفحة الإعلانات
      setTimeout(() => {
        navigate("/my-ads");
      }, 1500);
    } catch (error) {
      console.error("Error creating auction:", error);
      toast.error("فشل الاتصال بالخادم. يرجى التحقق من اتصالك بالإنترنت.");
    } finally {
      setFormLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      intro_link: "",
      start_time: "",
      auction_date: "",
      address: "",
      city: "",
      region: "",
      latitude: "",
      longitude: "",
      cover_image: [],
      images: [],
      videos: [],
    });
    setSelectedRegion("");
    setSelectedCity("");
    setCitiesList([]);
    setCurrentStep(1);
    setFormComplete(false);
    setMapPosition([24.7136, 46.6753]);
    setApiErrors({});
  };

    return {
    currentStep,
    formComplete,
    formLoading,
    formData,
    apiErrors,
    selectedRegion,
    selectedCity,
    citiesList,
    mapPosition,
    validateCurrentStep,
    handleNextStep,
    handlePrevStep,
    handleFormChange,
    handleFileChange,
    handleRegionChange,
    handleCityChange,
    handleMapPositionChange,
    handleAddAd,
    goToStep,
    resetForm
  };
};

export default useCreateAuctionForm;