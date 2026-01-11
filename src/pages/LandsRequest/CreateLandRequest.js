// Main page component - orchestrates the entire create land request flow
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ModalContext } from "../../App";
import { useToast } from "../../components/common/ToastProvider";
import { AnimatePresence, motion } from "framer-motion";

// Custom hooks
import { useUserAuth } from "../../features/landrequest/createlandrequest/hooks/useUserAuth";
import { useLocationData } from "../../features/landrequest/createlandrequest/hooks/useLocationData";
import { useLandRequestForm } from "../../features/landrequest/createlandrequest/hooks/useLandRequestForm";

// Components
import { LoadingScreen } from "../../features/landrequest/createlandrequest/components/LoadingScreen";
import { SuccessScreen } from "../../features/landrequest/createlandrequest/components/SuccessScreen";
import { StepProgress } from "../../features/landrequest/createlandrequest/components/StepProgress";
import { BasicInfoForm } from "../../features/landrequest/createlandrequest/components/forms/BasicInfoForm";
import { LandDetailsForm } from "../../features/landrequest/createlandrequest/components/forms/LandDetailsForm";
import { DescriptionForm } from "../../features/landrequest/createlandrequest/components/forms/DescriptionForm";

// Services
import { landRequestService } from "../../features/landrequest/createlandrequest/services/landRequestService";


function CreateLandRequest() {
  const navigate = useNavigate();
  const { openLogin } = useContext(ModalContext);

  const toast = useToast();

  // Custom hooks for data management
  const { userType, checkingUserType, isUserAllowed } = useUserAuth();
  const { regions, getAvailableCities } = useLocationData();
  const [availableCities, setAvailableCities] = React.useState([]);

  const form = useLandRequestForm([], toast, openLogin);
  const {
    formData,
    loading,
    success,
    responseData,
    formTouched,
    currentStep,
    handleInputChange,
    resetForm,
    submitForm,
    setCurrentStep,
    isStep1Valid,
    isStep2Valid,
    isFormValid,
  } = form;

  // مراقبة تغيير المنطقة لتحديث المدن
 const didMountRef = React.useRef(false);

useEffect(() => {
  if (!didMountRef.current) {
    didMountRef.current = true;
    return; // تجاهل التشغيل الأول
  }

  const newCities = formData.region ? getAvailableCities(formData.region) : [];

  setAvailableCities(prev => {
    if (
      prev.length === newCities.length &&
      prev.every((city, i) => city === newCities[i])
    ) {
      return prev;
    }
    return newCities;
  });
}, [formData.region, getAvailableCities]);

  // Event handlers
  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitForm(userType, toast); // بدلاً من openLogin فقط
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

  const handleNextStep = () => {
    if (currentStep === 1 && isStep1Valid) {
      setCurrentStep(2);
    } else if (currentStep === 2 && isStep2Valid) {
      setCurrentStep(3);
    } else {
      toast.error("يرجى إكمال جميع الحقول المطلوبة");
    }
  };

  // Render unauthorized state

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0f4ff] via-white to-[#e6f0ff] font-sans">
      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 sm:pt-40 lg:pt-44 pb-6 sm:pb-8 lg:pb-12">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl p-12"
            >
              <LoadingScreen
                title="جاري إنشاء الطلب"
                subtitle="الرجاء الانتظار..."
              />
            </motion.div>
          ) : success ? (
            <SuccessScreen
              responseData={responseData}
              formData={formData}
              onCreateNew={handleCreateNew}
            />
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <StepProgress currentStep={currentStep} />

              {/* Form */}
              <form
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    {currentStep === 1 && (
                      <BasicInfoForm
                        formData={formData}
                        regions={regions}
                        availableCities={getAvailableCities(formData.region)}
                        onInputChange={handleInputChange}
                      />
                    )}

                    {currentStep === 2 && (
                      <LandDetailsForm
                        formData={formData}
                        onInputChange={handleInputChange}
                      />
                    )}

                    {currentStep === 3 && (
                      <DescriptionForm
                        formData={formData}
                        onInputChange={handleInputChange}
                      />
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
                        onClick={handleNextStep}
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
