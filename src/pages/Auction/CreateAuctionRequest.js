import React, { useContext } from 'react';
import { ModalContext } from '../../App';
import Icons from '../../icons';
import useCreateMarketingRequest from '../../features/auctionrequest/hooks/useCreateMarketingRequest';
import LoadingState from '../../features/auctionrequest/components/LoadingState';
import SuccessState from '../../features/auctionrequest/components/SuccessState';
import BasicInfoSection from '../../features/auctionrequest/components/BasicInfoSection';
import RequestDetailsSection from '../../features/auctionrequest/components/RequestDetailsSection';
import FileUploadSection from '../../features/auctionrequest/components/FileUploadSection';
import TermsSection from '../../features/auctionrequest/components/TermsSection';

/**
 * Main component for creating auction requests
 */
function CreateAuctionRequest() {
  const { openLogin } = useContext(ModalContext);
  const {
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
    handleInputChange,
    handleImageUpload,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeImage,
    handleSubmit,
    handleBack,
    handleCreateNew,
    isUserAllowed,
    isFormValid,
  } = useCreateMarketingRequest(openLogin);

  if (checkingUserType) {
    return <LoadingState message="جاري التحقق من الصلاحيات..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <LoadingState message="جاري إنشاء طلب التسويق..." />
          ) : success ? (
            <SuccessState
              responseData={responseData}
              formData={formData}
              images={images}
              onCreateNew={handleCreateNew}
            />
          ) : (
            <div>
              <div className="p-8">
                <div className="text-center mb-8">
                  <h1 className="text-2xl font-bold text-gray-800 mb-2">
                    طلب تسويق منتج عقاري
                  </h1>
                  <p className="text-gray-600">
                    املأ النموذج أدناه لإنشاء طلب تسويق جديد
                  </p>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="space-y-8">
                    <BasicInfoSection
                      formData={formData}
                      regions={regions}
                      availableCities={availableCities}
                      onInputChange={handleInputChange}
                    />
                    
                    <RequestDetailsSection
                      description={formData.description}
                      onInputChange={handleInputChange}
                    />
                    
                    <FileUploadSection
                      images={images}
                      imagesPreviews={imagesPreviews}
                      dragging={dragging}
                      onImageUpload={handleImageUpload}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onRemoveImage={removeImage}
                    />
                    
                    <TermsSection
                      termsAccepted={formData.terms_accepted}
                      onInputChange={handleInputChange}
                    />
                    
                    {error && (
                      <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icons.FaExclamationTriangle className="text-red-500 flex-shrink-0" />
                          <span className="text-red-700">{error}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-10 pt-8 border-t border-gray-200">
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
                      <button
                        type="button"
                        onClick={handleBack}
                        disabled={loading}
                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        إلغاء
                      </button>

                      <button
                        type="submit"
                        className={`px-8 py-3 bg-[#53a1dd] text-white rounded-lg font-medium text-lg transition-colors w-full sm:w-auto
                          ${!isFormValid || loading
                            ? "opacity-60 cursor-not-allowed"
                            : "hover:bg-[#478bc5] shadow-md hover:shadow-lg"
                          }`}
                        disabled={loading || !isFormValid}
                      >
                        {loading ? (
                          <span className="flex items-center justify-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            جاري الإرسال...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            <Icons.FaCheck />
                            إنشاء طلب التسويق
                          </span>
                        )}
                      </button>
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

export default CreateAuctionRequest;