import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaArrowRight, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

// Hooks
import { usePropertyForm } from "../../features/lands/createland/hooks/usePropertyForm";
import { useLocationData } from "../../features/lands/createland/hooks/useLocationData";
import { useImageUpload } from "../../features/lands/createland/hooks/useImageUpload";

// Components
import ProgressSteps from "../../features/lands/createland/components/ProgressSteps";
import LoadingScreen from "../../features/lands/createland/components/LoadingScreen";
import CompletionScreen from "../../features/lands/createland/components/CompletionScreen";
import StepBasicInfo from "../../features/lands/createland/components/StepBasicInfo";
import StepAreaLocation from "../../features/lands/createland/components/StepAreaLocation";
import StepFinancialDetails from "../../features/lands/createland/components/StepFinancialDetails";
import StepImagesDeclaration from "../../features/lands/createland/components/StepImagesDeclaration";

function CreatePropertyAd() {
  const { currentUser } = useAuth();

  // Form state management
  const {
    formData,
    setFormData,
    currentStep,
    formComplete,
    formLoading,
    validateCurrentStep,
    handleNextStep,
    handlePrevStep,
    handleFieldChange,
    handleSubmit,
  } = usePropertyForm(currentUser);

  useEffect(() => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}, [currentStep]);


  // Location data
  const { regions, cities, updateCities } = useLocationData();

  // Image upload handlers
  const {
    coverImagePreview,
    additionalImagesPreview,
    isDragging,
    handleCoverImageChange,
    removeCoverImage,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  } = useImageUpload();

  // Update cities when region changes
  useEffect(() => {
    if (!formData.region) return;

    updateCities(formData.region);

    setFormData((prev) => ({
      ...prev,
      city: "",
    }));
  }, [formData.region]);

  const handleRegionChange = (e) => {
    const region = e.target.value;
    setFormData((prev) => ({
      ...prev,
      region: region,
      city: "",
    }));
  };

  const handleCityChange = (e) => {
    const city = e.target.value;
    setFormData((prev) => ({
      ...prev,
      city: city,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <main className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-6 pt-20 pb-10">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {formLoading ? (
            <LoadingScreen />
          ) : formComplete ? (
            <CompletionScreen onBack={handlePrevStep} onSubmit={handleSubmit} />
          ) : (
            <div>
              <div className="p-5 sm:p-8">
                <ProgressSteps currentStep={currentStep} />

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    {currentStep === 1 && (
                      <StepBasicInfo
                        formData={formData}
                        onChange={handleFieldChange}
                        regions={regions}
                        cities={cities}
                        onRegionChange={handleRegionChange}
                        onCityChange={handleCityChange}
                      />
                    )}

                    {currentStep === 2 && (
                      <StepAreaLocation
                        formData={formData}
                        onChange={handleFieldChange}
                      />
                    )}

                    {currentStep === 3 && (
                      <StepFinancialDetails
                        formData={formData}
                        onChange={handleFieldChange}
                        currentUser={currentUser}
                      />
                    )}

                    {currentStep === 4 && (
                      <StepImagesDeclaration
                        formData={formData}
                        onChange={handleFieldChange}
                        coverImagePreview={coverImagePreview}
                        additionalImagesPreview={additionalImagesPreview}
                        isDragging={isDragging}
                        onCoverImageChange={(file) =>
                          handleCoverImageChange(file, setFormData)
                        }
                        onRemoveCoverImage={() => removeCoverImage(setFormData)}
                        onAdditionalImagesChange={(files) =>
                          handleAdditionalImagesChange(
                            files,
                            formData.images,
                            setFormData
                          )
                        }
                        onRemoveAdditionalImage={(id) =>
                          removeAdditionalImage(id, setFormData)
                        }
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, setFormData)}
                      />
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
