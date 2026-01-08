import React, { useRef } from 'react';
import Icons from '../../../icons';

/**
 * File upload section of the form
 */
function FileUploadSection({
  images,
  imagesPreviews,
  dragging,
  onImageUpload,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveImage,
}) {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[#53a1dd] text-white rounded-lg flex items-center justify-center">
            <Icons.FaImage className="text-lg" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-800">
              المرفقات
            </h3>
            <p className="text-gray-500 text-sm">
              قم برفع صور للمنتج العقاري
            </p>
          </div>
        </div>
        <span className="px-3 py-1 bg-[#53a1dd] text-white rounded-full text-sm font-medium">
          {images.length}/5
        </span>
      </div>

      <div
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors cursor-pointer
          ${dragging
            ? 'border-[#53a1dd] bg-blue-50'
            : 'border-gray-300 hover:border-[#53a1dd] hover:bg-blue-50'
          }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={onImageUpload}
          multiple
          accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
          className="hidden"
        />

        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-blue-100 text-[#53a1dd] rounded-full flex items-center justify-center">
            <Icons.FaUpload className="text-3xl" />
          </div>
          <div>
            <p className="text-gray-700 font-medium mb-2">
              اسحب الصور وأفلتها هنا، أو انقر للاختيار
            </p>
            <p className="text-gray-500 text-sm">
              الحد الأقصى: 5 صور، حجم كل صورة لا يتجاوز 5MB
            </p>
          </div>
        </div>
      </div>

      {imagesPreviews.length > 0 && (
        <div className="mt-8">
          <h4 className="text-lg font-bold text-gray-800 mb-4">
            الصور المرفوعة
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {imagesPreviews.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden shadow-sm border border-gray-200">
                  <img
                    src={image.preview}
                    alt={`صورة ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity"></div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-lg"
                >
                  <Icons.FaTimes />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white p-2 text-xs">
                  <div className="truncate">
                    {image.file.name.length > 15
                      ? image.file.name.substring(0, 12) +
                        '...' +
                        image.file.name.substring(
                          image.file.name.lastIndexOf('.')
                        )
                      : image.file.name}
                  </div>
                  <div className="text-gray-300">
                    {(image.file.size / (1024 * 1024)).toFixed(2)} MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default FileUploadSection;