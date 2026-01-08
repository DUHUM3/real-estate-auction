// src/pages/Auction/CreateAuctionAd.jsx
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Check, Plus, ArrowLeft, ArrowRight } from "lucide-react";
import { useToast } from "../../components/common/ToastProvider"; // ✅ استيراد من جديد

// استيراد المكونات من features
import StepIndicator from "../../features/auctions/createauction/components/StepIndicator";
import Step1BasicInfo from "../../features/auctions/createauction/components/Step1BasicInfo";
import Step2Location from "../../features/auctions/createauction/components/Step2Location";
import Step3Files from "../../features/auctions/createauction/components/Step3Files";
import useCreateAuctionForm from "../../features/auctions/createauction/hooks/useCreateAuctionForm";




function CreateAuctionAd() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  // إذا كنت تستخدم useToast مخصص، استبدله بـ toast مباشرة
  const {
    currentStep,
    formComplete,
    formLoading,
    formData,
    apiErrors,
    validateCurrentStep,
    handleNextStep,
    handlePrevStep,
    handleFormChange,
    handleFileChange,
    handleMapPositionChange,
    handleRegionChange,
    handleCityChange,
    selectedRegion,
    selectedCity,
    citiesList,
    mapPosition,
    handleAddAd,
    goToStep,
    resetForm,
  } = useCreateAuctionForm(token, toast, navigate);

   useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [formComplete, currentStep]);


  const steps = [
    {
      id: 1,
      title: "المعلومات",
      icon: "FileText",
      description: "المعلومات الأساسية للمزاد",
    },
    {
      id: 2,
      title: "الموقع والتاريخ",
      icon: "MapPin",
      description: "تحديد مكان وزمان المزاد",
    },
    {
      id: 3,
      title: "الملفات",
      icon: "Image",
      description: "رفع الصور والفيديوهات",
    },
  ];

  const handleCancel = () => {
    toast.error("تم إلغاء عملية الإضافة");
    navigate("/my-ads");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {formLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-[#53a1dd] rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-t-[#53a1dd] rounded-full animate-spin absolute top-0"></div>
              </div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg font-medium mt-4"
              >
                جاري إضافة المزاد...
              </motion.p>
            </motion.div>
          ) : formComplete ? (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Check className="text-4xl" />
              </motion.div>

              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                تم استكمال جميع البيانات
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 max-w-lg mx-auto text-lg"
              >
                يمكنك الآن إضافة المزاد الجديد أو العودة لتعديل البيانات
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm"
                  onClick={() => goToStep(3)}
                >
                  <ArrowRight className="w-4 h-4" /> العودة للتعديل
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="px-8 py-3 bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] text-white rounded-xl hover:from-[#53a1dd] hover:to-[#53a1dd] transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
                  onClick={handleAddAd}
                >
                  <Plus className="w-4 h-4" /> إضافة المزاد
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="p-6 sm:p-8">
              <StepIndicator steps={steps} currentStep={currentStep} />

              <form onSubmit={(e) => e.preventDefault()}>
                <div className="mt-8">
                  {currentStep === 1 && (
                    <Step1BasicInfo
                      formData={formData}
                      apiErrors={apiErrors}
                      handleFormChange={handleFormChange}
                    />
                  )}

                  {currentStep === 2 && (
                    <Step2Location
                      formData={formData}
                      apiErrors={apiErrors}
                      handleFormChange={handleFormChange}
                      handleRegionChange={handleRegionChange}
                      handleCityChange={handleCityChange}
                      selectedRegion={selectedRegion}
                      selectedCity={selectedCity}
                      citiesList={citiesList}
                      mapPosition={mapPosition}
                      handleMapPositionChange={handleMapPositionChange}
                    />
                  )}

                  {currentStep === 3 && (
                    <Step3Files
                      formData={formData}
                      apiErrors={apiErrors}
                      handleFileChange={handleFileChange}
                    />
                  )}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t-2 border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {currentStep > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm flex items-center justify-center gap-2"
                        onClick={handlePrevStep}
                      >
                        <ArrowRight className="w-4 h-4" /> رجوع
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={validateCurrentStep() ? { scale: 1.02 } : {}}
                      whileTap={validateCurrentStep() ? { scale: 0.98 } : {}}
                      type="button"
                      className={`
                        px-8 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
                        ${
                          !validateCurrentStep()
                            ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                            : "bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] text-white hover:from-[#53a1dd] hover:to-[#53a1dd] shadow-lg hover:shadow-xl"
                        }
                      `}
                      onClick={handleNextStep}
                      disabled={!validateCurrentStep()}
                    >
                      {currentStep === 3 ? (
                        <>
                          <Check className="w-4 h-4" /> استكمال البيانات
                        </>
                      ) : (
                        <>
                          الخطوة التالية <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </form>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default CreateAuctionAd;
