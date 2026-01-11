import React, { useState } from "react";
import {
  FaExpand,
  FaArrowRight,
  FaArrowLeft as FaLeft,
  FaTimes,
  FaBuilding,
} from "react-icons/fa";

// Image Gallery Component
const ImageGallery = ({ images, getImageUrl }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="w-full h-48 sm:h-60 bg-gray-100 rounded-xl flex flex-col items-center justify-center">
        <FaBuilding className="text-3xl sm:text-4xl text-gray-400 mb-3" />
        <p className="text-gray-500 text-sm sm:text-base">
          لا توجد صور متاحة
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="relative rounded-xl overflow-hidden mb-3 sm:mb-4">
        <img
          src={getImageUrl(images[selectedImage])}
          alt="Main"
          className="w-full h-48 sm:h-64 md:h-80 object-cover cursor-pointer"
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

      {/* Image Modal */}
      {showImageModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="relative w-full max-w-4xl"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={getImageUrl(images[selectedImage])}
              alt="Modal"
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() =>
                setSelectedImage((prev) =>
                  prev === 0 ? images.length - 1 : prev - 1
                )
              }
            >
              <FaArrowRight className="text-sm sm:text-base" />
            </button>
            <button
              className="absolute top-2 left-2 sm:top-4 sm:left-4 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() =>
                setSelectedImage((prev) => (prev + 1) % images.length)
              }
            >
              <FaLeft className="text-sm sm:text-base" />
            </button>
            <button
              className="absolute top-2 right-10 sm:top-4 sm:right-16 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => setShowImageModal(false)}
            >
              <FaTimes className="text-lg sm:text-xl" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageGallery;