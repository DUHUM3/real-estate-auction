import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FaMapMarkerAlt,
  FaShare,
  FaArrowLeft,
  FaCalendarAlt,
  FaClock,
  FaExpand,
  FaArrowRight,
  FaArrowLeft as FaLeft,
  FaTimes,
  FaInfoCircle,
  FaBuilding,
  FaPlay,
  FaPause,
  FaLink,
  FaDirections,
} from "react-icons/fa";

const showToast = (type, message, duration = 3000) => {
  const isMobile = window.innerWidth < 768;
  const options = {
    position: isMobile ? "top-center" : "top-right",
    autoClose: duration,
    rtl: true,
    theme: "light",
    style: {
      fontSize: isMobile ? "12px" : "14px",
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      borderRadius: isMobile ? "6px" : "8px",
      minHeight: isMobile ? "40px" : "50px",
      padding: isMobile ? "8px 10px" : "12px 14px",
      marginTop: isMobile ? "60px" : "0",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    default:
      toast(message, options);
  }
};

const AuctionDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    fetchAuctionData();
  }, [id]);

  /* 
  // تحميل Google Maps API - معطل مؤقتاً
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&language=ar`;
      script.async = true;
      script.defer = true;
      script.onload = () => setMapLoaded(true);
      document.head.appendChild(script);
    } else {
      setMapLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (mapLoaded && data && data.latitude && data.longitude) {
      initMap();
    }
  }, [mapLoaded, data]);

  const initMap = () => {
    const mapElement = document.getElementById("map");
    if (!mapElement || !window.google) return;

    const position = {
      lat: parseFloat(data.latitude),
      lng: parseFloat(data.longitude),
    };

    const map = new window.google.maps.Map(mapElement, {
      center: position,
      zoom: 15,
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
      styles: [
        {
          featureType: "poi",
          elementType: "labels",
          stylers: [{ visibility: "on" }],
        },
      ],
    });

    const marker = new window.google.maps.Marker({
      position: position,
      map: map,
      title: data.title,
      animation: window.google.maps.Animation.DROP,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: "#3B82F6",
        fillOpacity: 1,
        strokeColor: "#ffffff",
        strokeWeight: 3,
      },
    });

    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="font-family: 'Cairo', sans-serif; padding: 8px; text-align: right; direction: rtl;">
          <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: bold;">${data.title}</h3>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">${data.address}</p>
        </div>
      `,
    });

    marker.addListener("click", () => {
      infoWindow.open(map, marker);
    });
  };
  */

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://core-api-x41.shaheenplus.sa/api/auctions/${id}`
      );

      if (!response.ok) {
        throw new Error("فشل في جلب البيانات");
      }

      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        throw new Error("البيانات غير متوفرة");
      }

      setLoading(false);
    } catch (error) {
      setError(error.message);
      showToast("error", error.message);
      setLoading(false);
    }
  };

  const shareAuction = () => {
    const currentUrl = window.location.href;
    const shareData = {
      title: data.title,
      text: `مزاد: ${data.title}`,
      url: currentUrl,
    };

    if (navigator.share) {
      navigator.share(shareData).catch(console.error);
    } else {
      navigator.clipboard.writeText(currentUrl);
      showToast("success", "تم نسخ الرابط للمشاركة!");
    }
  };

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`;
    window.open(url, "_blank");
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("ar-SA", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (timeString) => {
    if (!timeString) return "";
    try {
      const [hours, minutes] = timeString.split(":");
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? "مساءً" : "صباحاً";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeString;
    }
  };

  const getImageUrl = (imagePath) => {
    return imagePath
      ? `https://core-api-x41.shaheenplus.sa/storage/${imagePath}`
      : null;
  };

  const getVideoUrl = (videoPath) => {
    return videoPath
      ? `https://core-api-x41.shaheenplus.sa/storage/${videoPath}`
      : null;
  };

  const getAllImages = () => {
    if (!data) return [];
    const images = [];
    if (data.cover_image) images.push(data.cover_image);
    if (data.images && data.images.length > 0) {
      images.push(...data.images.map((img) => img.image_path));
    }
    return images;
  };

  const openVideoModal = (video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل تفاصيل المزاد...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-600 text-lg mb-4">
            {error || "البيانات غير متوفرة"}
          </p>
          <button
            onClick={handleBack}
            className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
          >
            العودة
          </button>
        </div>
      </div>
    );
  }

  const images = getAllImages();

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 pb-6 pt-[80px]" dir="rtl">
      <ToastContainer
        position="top-center"
        autoClose={4000}
        closeOnClick
        draggable
        rtl
        pauseOnHover
        theme="light"
        style={{
          top: "80px",
          right: "10px",
          left: "10px",
          width: "auto",
          maxWidth: "100%",
          fontFamily: "'Segoe UI', 'Cairo', sans-serif",
          fontSize: "14px",
          zIndex: 999999,
        }}
      />

      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base"
        >
          <FaArrowLeft className="text-sm" />
          <span>رجوع</span>
        </button>
        <button
          className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
          onClick={shareAuction}
        >
          <FaShare className="text-sm sm:text-base" />
        </button>
      </div>

      {/* Image Gallery */}
      <div className="mb-6 sm:mb-8">
        {images.length > 0 ? (
          <>
            <div className="relative rounded-xl overflow-hidden mb-3 sm:mb-4">
              <img
                src={getImageUrl(images[selectedImage])}
                alt="Main"
                className="w-full h-64 sm:h-80 md:h-96 object-cover cursor-pointer"
                onClick={() => setShowImageModal(true)}
              />
              <button
                className="absolute top-2 left-2 sm:top-3 sm:left-3 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
                onClick={() => setShowImageModal(true)}
              >
                <FaExpand className="text-sm sm:text-base" />
              </button>

              {images.length > 1 && (
                <>
                  <button
                    className="absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
                    onClick={() =>
                      setSelectedImage((prev) =>
                        prev === 0 ? images.length - 1 : prev - 1
                      )
                    }
                  >
                    <FaArrowRight className="text-sm sm:text-base" />
                  </button>
                  <button
                    className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
                    onClick={() =>
                      setSelectedImage((prev) => (prev + 1) % images.length)
                    }
                  >
                    <FaLeft className="text-sm sm:text-base" />
                  </button>

                  <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 px-2 py-1 bg-black bg-opacity-60 text-white text-xs rounded">
                    {selectedImage + 1} / {images.length}
                  </div>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden cursor-pointer border-2 ${
                      selectedImage === index
                        ? "border-blue-500"
                        : "border-transparent"
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img
                      src={getImageUrl(image)}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
            <FaBuilding className="text-4xl text-gray-400 mb-3" />
            <p className="text-gray-500">لا توجد صور متاحة</p>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
        {/* عنوان المزاد */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <div
              className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                data.status === "مفتوح"
                  ? "bg-green-100 text-green-800 border border-green-200"
                  : "bg-red-100 text-red-800 border border-red-200"
              }`}
            >
              {data.status}
            </div>
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3">
            {data.title}
          </h1>

          <div className="flex flex-col gap-2 text-gray-600">
            <div className="flex items-center gap-2">
              <FaMapMarkerAlt className="text-amber-500" />
              <span className="text-sm sm:text-base">{data.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              <span className="text-sm sm:text-base">
                {data.company?.auction_name}
              </span>
            </div>
          </div>
        </div>

        {/* الوصف */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <div className="flex items-center gap-2 mb-3">
            <FaInfoCircle className="text-blue-500 text-lg" />
            <h3 className="font-bold text-gray-800 text-lg">عن المزاد</h3>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
            {data.description}
          </p>
        </div>

        {/* معلومات المزاد */}
        <div className="mb-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
            تفاصيل المزاد
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-amber-500" />
                <span className="text-gray-700 font-medium">تاريخ المزاد</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">
                {formatDate(data.auction_date)}
              </p>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="text-blue-500" />
                <span className="text-gray-700 font-medium">وقت البدء</span>
              </div>
              <p className="text-gray-900 font-bold text-lg">
                {formatTime(data.start_time)}
              </p>
            </div>
          </div>
        </div>

        {/* موقع المزاد - معدل */}
        {data.latitude && data.longitude && (
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
              موقع المزاد
            </h3>

            {/* 
            <div className="relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg">
              <div id="map" className="w-full h-64 sm:h-80 md:h-96"></div>

              <div className="absolute bottom-4 right-4 left-4 sm:left-auto">
                <button
                  onClick={openInGoogleMaps}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 bg-white shadow-lg rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
                >
                  <FaDirections className="text-blue-500 text-lg" />
                  <span className="font-semibold text-gray-800">
                    فتح في خرائط جوجل
                  </span>
                </button>
              </div>
            </div>
            */}

            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg">
              <button
                onClick={openInGoogleMaps}
                className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] duration-200"
              >
                <FaDirections className="text-blue-500 text-2xl" />
                <span className="font-bold text-gray-800 text-lg">
                  فتح الموقع في خرائط جوجل
                </span>
              </button>
            </div>

            <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
              <div className="flex items-start gap-3">
                <FaMapMarkerAlt className="text-emerald-500 text-xl mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-bold text-gray-800 mb-2">
                    العنوان الكامل
                  </h4>
                  <p className="text-gray-700 leading-relaxed">
                    {data.address}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                    <span className="px-2 py-1 bg-white rounded-md">
                      خط الطول: {data.longitude}
                    </span>
                    <span className="px-2 py-1 bg-white rounded-md">
                      خط العرض: {data.latitude}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* رابط التعريف */}
        {data.intro_link && (
          <div className="mb-6">
            <a
              href={data.intro_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
            >
              <FaLink className="text-lg" />
              <span>رابط التعريف بالمزاد</span>
            </a>
          </div>
        )}

        {/* الفيديوهات */}
        {data.videos && data.videos.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
              فيديوهات المزاد
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.videos.map((video, index) => (
                <div
                  key={video.id}
                  className="relative rounded-xl overflow-hidden cursor-pointer group border-2 border-gray-200 hover:border-blue-500 transition-all"
                  onClick={() => openVideoModal(video)}
                >
                  <video
                    src={getVideoUrl(video.video_path)}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all">
                    <div className="p-4 bg-white bg-opacity-90 rounded-full">
                      <FaPlay className="text-blue-500 text-2xl" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 px-3 py-1 bg-black bg-opacity-70 text-white text-xs rounded">
                    فيديو {index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* معلومات إضافية */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-gray-500" />
                <span className="text-gray-700 font-medium">تاريخ الإنشاء</span>
              </div>
              <p className="text-gray-800 font-semibold">
                {formatDate(data.created_at)}
              </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl">
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(images[selectedImage])}
              alt="Modal"
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <FaArrowRight />
            </button>
            <button
              className="absolute top-2 left-2 sm:top-4 sm:left-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() =>
                setSelectedImage((prev) => (prev + 1) % images.length)
              }
            >
              <FaLeft />
            </button>
            <button
              className="absolute top-2 right-12 sm:top-4 sm:right-16 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

      {/* Video Modal */}
      {showVideoModal && selectedVideo && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => {
            setShowVideoModal(false);
            setSelectedVideo(null);
          }}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              src={getVideoUrl(selectedVideo.video_path)}
              controls
              autoPlay
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-2 right-2 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => {
                setShowVideoModal(false);
                setSelectedVideo(null);
              }}
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetailsPage;