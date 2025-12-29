import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaFileAlt,
  FaMapMarkerAlt,
  FaImage,
  FaPlus,
  FaChevronRight,
  FaVideo,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// إصلاح أيقونات Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// مكون لتحديد الموقع على الخريطة
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
      toast.success("تم تحديد الموقع بنجاح");
    },
  });

  return position === null ? null : <Marker position={position} />;
}

function CreateAuctionAd() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [mapPosition, setMapPosition] = useState([24.7136, 46.6753]); // الرياض كموقع افتراضي
  const [adFormData, setAdFormData] = useState({
    title: "",
    description: "",
    intro_link: "",
    start_time: "",
    auction_date: "",
    address: "",
    latitude: "",
    longitude: "",
    cover_image: null,
    images: [],
    videos: [],
  });

  const validateCurrentStep = () => {
    if (currentStep === 1) {
      return Boolean(adFormData.title && adFormData.description);
    } else if (currentStep === 2) {
      return Boolean(
        adFormData.start_time &&
          adFormData.auction_date &&
          adFormData.address &&
          adFormData.latitude &&
          adFormData.longitude
      );
    } else if (currentStep === 3) {
      return Boolean(adFormData.cover_image);
    }
    return true;
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

  const handleAddAd = async () => {
    setFormLoading(true);
    const loadingToast = toast.loading("جاري إضافة المزاد...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("يرجى تسجيل الدخول أولاً");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      const auctionFields = [
        "title",
        "description",
        "intro_link",
        "start_time",
        "auction_date",
        "address",
        "latitude",
        "longitude",
      ];

      auctionFields.forEach((field) => {
        if (adFormData[field]) {
          formData.append(field, adFormData[field]);
        }
      });

      if (adFormData.cover_image) {
        formData.append("cover_image", adFormData.cover_image);
      }

      if (adFormData.images && adFormData.images.length > 0) {
        adFormData.images.forEach((image, index) => {
          formData.append(`images[${index}]`, image);
        });
      }

      if (adFormData.videos && adFormData.videos.length > 0) {
        adFormData.videos.forEach((video, index) => {
          formData.append(`videos[${index}]`, video);
        });
      }

      const response = await fetch(
        "https://core-api-x41.shaheenplus.sa/api/user/auctions",
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
        toast.success("تم إضافة المزاد بنجاح");
        resetForm();
        setTimeout(() => {
          navigate("/my-ads");
        }, 1500);
      } else {
        toast.dismiss(loadingToast);
        const errorMessage = result.message || "فشل في إضافة المزاد";
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
      title: "",
      description: "",
      intro_link: "",
      start_time: "",
      auction_date: "",
      address: "",
      latitude: "",
      longitude: "",
      cover_image: null,
      images: [],
      videos: [],
    });
    setCurrentStep(1);
    setFormComplete(false);
    setMapPosition([24.7136, 46.6753]);
  };

  const handleAdChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      if (name === "cover_image") {
        setAdFormData({
          ...adFormData,
          cover_image: files[0],
        });
        toast.success("تم رفع الصورة الرئيسية");
      } else if (name === "images") {
        setAdFormData({
          ...adFormData,
          images: Array.from(files),
        });
        toast.success(`تم رفع ${files.length} صورة إضافية`);
      } else if (name === "videos") {
        setAdFormData({
          ...adFormData,
          videos: Array.from(files),
        });
        toast.success(`تم رفع ${files.length} فيديو`);
      }
    } else {
      setAdFormData({
        ...adFormData,
        [name]: value,
      });
    }
  };

  const handleMapPositionChange = (position) => {
    setMapPosition(position);
    setAdFormData({
      ...adFormData,
      latitude: position[0].toString(),
      longitude: position[1].toString(),
    });
  };

  const handleBackToAds = () => {
    navigate("/my-ads");
  };

  const handleCancel = () => {
    toast.error("تم إلغاء عملية الإضافة");
    navigate("/my-ads");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
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

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-[#53a1dd] p-2 rounded-lg hover:bg-blue-50 transition-all"
              onClick={handleBackToAds}
              disabled={formLoading}
            >
              <FaArrowRight className="text-lg" />
              <span className="hidden sm:inline font-medium">
                العودة للمزادات
              </span>
            </button>

            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              إضافة مزاد جديد
            </h1>

            <button
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all font-medium"
              onClick={handleCancel}
              disabled={formLoading}
            >
              إلغاء
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {formLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
              <p className="text-gray-600 text-lg font-medium">
                جاري إضافة المزاد...
              </p>
            </div>
          ) : formComplete ? (
            <div className="p-8 md:p-12 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <FaCheck className="text-4xl" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                تم استكمال جميع البيانات
              </h2>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto text-lg">
                يمكنك الآن إضافة المزاد الجديد أو العودة لتعديل البيانات
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  type="button"
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm hover:shadow"
                  onClick={handlePrevStep}
                >
                  <FaArrowRight /> العودة للتعديل
                </button>
                <button
                  type="button"
                  className="px-8 py-3 bg-gradient-to-r from-[#53a1dd] to-[#478bc5] text-white rounded-xl hover:from-[#478bc5] hover:to-[#3d7ab0] transition-all font-medium flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                  onClick={handleAddAd}
                >
                  <FaPlus /> إضافة المزاد
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="p-6 sm:p-8">
                {/* Form Steps */}
                <div className="mb-8">
                  <div className="flex items-center justify-between relative">
                    <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>

                    {[1, 2, 3].map((step) => (
                      <React.Fragment key={step}>
                        <div className="relative z-10 flex flex-col items-center bg-white px-3">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-md transition-all duration-300 ${
                              currentStep >= step
                                ? "bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white scale-110"
                                : "bg-gray-200 text-gray-400"
                            }`}
                          >
                            {currentStep > step ? (
                              <FaCheck className="text-lg" />
                            ) : (
                              <span className="font-bold">{step}</span>
                            )}
                          </div>
                          <span
                            className={`text-xs sm:text-sm font-medium text-center transition-colors ${
                              currentStep >= step
                                ? "text-[#53a1dd]"
                                : "text-gray-400"
                            }`}
                          >
                            {step === 1
                              ? "المعلومات"
                              : step === 2
                              ? "الموقع والتاريخ"
                              : "الملفات"}
                          </span>
                        </div>

                        {step < 3 && (
                          <div className="hidden md:block">
                            <FaChevronRight
                              className={`text-lg transition-colors ${
                                currentStep > step
                                  ? "text-[#53a1dd]"
                                  : "text-gray-300"
                              }`}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-6">
                    {/* Step 1: المعلومات الأساسية */}
                    {currentStep === 1 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaFileAlt className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              المعلومات الأساسية
                            </h3>
                            <p className="text-gray-500 text-sm">
                              أدخل المعلومات الأساسية للمزاد
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              عنوان المزاد <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="title"
                              value={adFormData.title}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="أدخل عنوان المزاد"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              وصف المزاد <span className="text-red-500">*</span>
                            </label>
                            <textarea
                              name="description"
                              value={adFormData.description}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              rows="5"
                              placeholder="أدخل وصفاً مفصلاً عن المزاد"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              رابط التعريف (اختياري)
                            </label>
                            <input
                              type="url"
                              name="intro_link"
                              value={adFormData.intro_link}
                              onChange={handleAdChange}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="https://example.com/auction-intro"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 2: الموقع والتاريخ */}
                    {currentStep === 2 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaMapMarkerAlt className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              الموقع والتاريخ
                            </h3>
                            <p className="text-gray-500 text-sm">
                              حدد موقع وتاريخ المزاد
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                وقت البدء <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="time"
                                name="start_time"
                                value={adFormData.start_time}
                                onChange={handleAdChange}
                                required
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                تاريخ المزاد <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="date"
                                name="auction_date"
                                value={adFormData.auction_date}
                                onChange={handleAdChange}
                                required
                                min={new Date().toISOString().split("T")[0]}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              العنوان <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="address"
                              value={adFormData.address}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all"
                              placeholder="أدخل عنوان المزاد"
                            />
                          </div>

                          {/* خريطة تحديد الموقع */}
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-3">
                              حدد موقع المزاد على الخريطة{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-md">
                              <MapContainer
                                center={mapPosition}
                                zoom={13}
                                style={{ height: "400px", width: "100%" }}
                                className="z-0"
                              >
                                <TileLayer
                                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <LocationMarker
                                  position={mapPosition}
                                  setPosition={handleMapPositionChange}
                                />
                              </MapContainer>
                            </div>
                            <p className="text-gray-500 text-sm mt-3 bg-blue-50 p-3 rounded-lg">
                              💡 اضغط على الخريطة لتحديد موقع المزاد بدقة
                            </p>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                خط العرض <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="latitude"
                                value={adFormData.latitude || mapPosition[0]}
                                readOnly
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                                placeholder="سيتم التحديد تلقائياً"
                              />
                            </div>

                            <div>
                              <label className="block text-sm font-semibold text-gray-700 mb-2">
                                خط الطول <span className="text-red-500">*</span>
                              </label>
                              <input
                                type="text"
                                name="longitude"
                                value={adFormData.longitude || mapPosition[1]}
                                readOnly
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                                placeholder="سيتم التحديد تلقائياً"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Step 3: الصور والملفات */}
                    {currentStep === 3 && (
                      <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-6 border border-blue-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-md">
                            <FaImage className="text-xl" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">
                              الصور والملفات
                            </h3>
                            <p className="text-gray-500 text-sm">
                              قم برفع صور وملفات المزاد
                            </p>
                          </div>
                        </div>

                        <div className="space-y-5">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              الصورة الرئيسية{" "}
                              <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="file"
                              name="cover_image"
                              onChange={handleAdChange}
                              required
                              accept="image/*"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#53a1dd] file:text-white file:cursor-pointer hover:file:bg-[#478bc5]"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <FaImage /> الصور الإضافية
                            </label>
                            <input
                              type="file"
                              name="images"
                              onChange={handleAdChange}
                              multiple
                              accept="image/*"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-200 file:text-gray-700 file:cursor-pointer hover:file:bg-gray-300"
                            />
                            <p className="text-gray-500 text-xs mt-2">
                              يمكنك رفع أكثر من صورة
                            </p>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <FaVideo /> الفيديوهات
                            </label>
                            <input
                              type="file"
                              name="videos"
                              onChange={handleAdChange}
                              multiple
                              accept="video/*"
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-purple-500 file:text-white file:cursor-pointer hover:file:bg-purple-600"
                            />
                            <p className="text-gray-500 text-xs mt-2">
                              يمكنك رفع فيديوهات عن المزاد
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="mt-8 pt-6 border-t-2 border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-4 justify-between">
                        {currentStep > 1 && (
                          <button
                            type="button"
                            className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm hover:shadow flex items-center justify-center gap-2"
                            onClick={handlePrevStep}
                          >
                            <FaArrowRight /> رجوع
                          </button>
                        )}

                        <button
                          type="button"
                          className={`px-8 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2 ${
                            !validateCurrentStep()
                              ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                              : "bg-gradient-to-r from-[#53a1dd] to-[#478bc5] text-white hover:from-[#478bc5] hover:to-[#3d7ab0] shadow-lg hover:shadow-xl"
                          }`}
                          onClick={handleNextStep}
                          disabled={!validateCurrentStep()}
                        >
                          {currentStep === 3 ? (
                            <>
                              <FaCheck /> استكمال البيانات
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

export default CreateAuctionAd;