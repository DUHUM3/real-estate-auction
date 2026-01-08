import React from 'react';
import { FaExpand, FaArrowRight, FaArrowLeft as FaLeft, FaTimes } from 'react-icons/fa';
import { getImageUrl } from '../../constants/auction.constants';

const ImageGallery = ({ 
  data, 
  selectedImage, 
  onSelectImage, 
  showModal, 
  onToggleModal 
}) => {
  const getAllImages = () => {
    if (!data) return [];
    const images = [];
    if (data.cover_image) images.push(data.cover_image);
    if (data.images?.length > 0) {
      images.push(...data.images.map(img => img.image_path));
    }
    return images;
  };

  const images = getAllImages();

  if (images.length === 0) {
    return (
      <div className="w-full h-64 bg-gray-100 rounded-xl flex flex-col items-center justify-center mb-6">
        <div className="text-4xl text-gray-400 mb-3">🏢</div>
        <p className="text-gray-500">لا توجد صور متاحة</p>
      </div>
    );
  }

  return (
    <div className="mb-6 sm:mb-8">
      <div className="relative rounded-xl overflow-hidden mb-3 sm:mb-4">
        <img
          src={getImageUrl(images[selectedImage])}
          alt="Main"
          className="w-full h-64 sm:h-80 md:h-96 object-cover cursor-pointer"
          onClick={() => onToggleModal(true)}
        />
        <button
          className="absolute top-2 left-2 sm:top-3 sm:left-3 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
          onClick={() => onToggleModal(true)}
        >
          <FaExpand className="text-sm sm:text-base" />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="absolute top-1/2 right-2 sm:right-3 transform -translate-y-1/2 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => onSelectImage(selectedImage === 0 ? images.length - 1 : selectedImage - 1)}
            >
              <FaArrowRight className="text-sm sm:text-base" />
            </button>
            <button
              className="absolute top-1/2 left-2 sm:left-3 transform -translate-y-1/2 p-1.5 sm:p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
              onClick={() => onSelectImage((selectedImage + 1) % images.length)}
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
                selectedImage === index ? 'border-blue-500' : 'border-transparent'
              }`}
              onClick={() => onSelectImage(index)}
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
    </div>
  );
};

// Modal Component
ImageGallery.Modal = ({ images, selectedIndex, onClose, onChangeImage }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={getImageUrl(images[selectedIndex])}
          alt="Modal"
          className="w-full h-auto rounded-lg"
        />
        <button
          className="absolute top-2 right-2 sm:top-4 sm:right-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
          onClick={() => onChangeImage(selectedIndex === 0 ? images.length - 1 : selectedIndex - 1)}
        >
          <FaArrowRight />
        </button>
        <button
          className="absolute top-2 left-2 sm:top-4 sm:left-4 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
          onClick={() => onChangeImage((selectedIndex + 1) % images.length)}
        >
          <FaLeft />
        </button>
        <button
          className="absolute top-2 right-12 sm:top-4 sm:right-16 p-2 bg-white bg-opacity-90 rounded-lg hover:bg-opacity-100"
          onClick={onClose}
        >
          <FaTimes />
        </button>
      </div>
    </div>
  );
};

export default ImageGallery;