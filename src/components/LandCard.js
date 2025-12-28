import React, { useState, useEffect } from 'react';
import Icons from '../icons/index';

const LandCard = ({
  id,
  img,
  title,
  location,
  price,
  area,
  landType,
  purpose,
  auctionTitle,
  status,
  onClick,
  onToggleFavorite,
  isFavorite = false,
  onShare,
  shareUrl
}) => {
  const [favorite, setFavorite] = useState(isFavorite);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  // دالة لتحديد لون الحالة
  const getStatusColor = (status) => {
    switch(status) {
      case 'متاح':
      case 'معروض':
      case 'مفتوح':
        return 'bg-green-500 text-white';
      case 'مباع':
      case 'مغلق':
        return 'bg-red-500 text-white';
      case 'محجوز':
      case 'معلق':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  // دالة لتحديد لون النوع
  const getTypeColor = (type) => {
    switch(type) {
      case 'سكني':
        return 'bg-[#e8f2fc] text-[#2c6aa3]';
      case 'تجاري':
        return 'bg-amber-100 text-amber-800';
      case 'صناعي':
        return 'bg-orange-100 text-orange-800';
      case 'زراعي':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    setFavorite(!favorite);
    if (onToggleFavorite) {
      onToggleFavorite(id, !favorite);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    if (onShare) {
      onShare(id, title);
    }
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick(id, auctionTitle ? 'auction' : 'land');
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col h-full"
      onClick={handleCardClick}
    >
      {/* قسم الصورة */}
      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-[#f0f8ff] to-gray-100">
        {img ? (
          <img
            src={img}
            alt={title || "صورة العقار"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-[#53a1dd]">
            {auctionTitle ? (
              <Icons.FaGavel className="text-6xl mb-2 opacity-70" />
            ) : (
              <Icons.FaHome className="text-6xl mb-2 opacity-70" />
            )}
            <span className="text-sm text-gray-400 font-medium">لا توجد صورة</span>
          </div>
        )}
        
        {/* شارة الحالة */}
        {status && (
          <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-md ${getStatusColor(status)}`}>
            {status}
          </div>
        )}
      </div>

      {/* محتوى البطاقة */}
      <div className="p-4 flex flex-col gap-3 flex-grow">
        {/* العنوان */}
        <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* الموقع */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <Icons.FaMapMarkerAlt className="text-amber-500 w-4 h-4" />
          <span>{location}</span>
        </div>

        {/* التفاصيل */}
        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">المساحة:</span>
            <span className="font-semibold text-black-600" dir="ltr">
              {(area)} م²
            </span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">{auctionTitle ? 'قيمة المزاد:' : 'السعر:'}</span>
            <span className="font-semibold text-black-600 inline-flex items-center gap-1" dir="ltr">
              <span>{(price)}</span>
              {!auctionTitle && (
                <img
                  src="/images/rail.svg"
                  alt="ريال سعودي"
                  className="w-3.5 h-3.5 inline-block"
                  style={{ verticalAlign: "middle" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.insertAdjacentHTML(
                      "afterend",
                      '<span class="text-xs">ر.س</span>'
                    );
                  }}
                />
              )}
            </span>
          </div>
        </div>

        {/* العلامات */}
        <div className="flex flex-wrap gap-2 mb-4">
          {landType && (
            <span className={`px-2 py-1 text-xs rounded-full font-medium ${getTypeColor(landType)}`}>
              {landType}
            </span>
          )}
          {purpose && (
            <span className="px-2 py-1 text-xs bg-[#e8f2fc] text-[#2c6aa3] rounded-full font-medium">
              {purpose}
            </span>
          )}
          {auctionTitle && (
            <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full font-medium">
              مزاد
            </span>
          )}
        </div>

        {/* عنوان المزاد */}
        {auctionTitle && (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-amber-50 p-2 rounded-md">
            <Icons.FaGavel className="text-amber-500 w-4 h-4" />
            <span className="line-clamp-1">{auctionTitle}</span>
          </div>
        )}

        {/* الأزرار */}
        <div className="flex gap-2 mt-auto">
          <button className="flex-1 bg-[#53a1dd] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#4a90c9] transition-colors">
            {auctionTitle ? 'المشاركة في المزاد' : 'عرض التفاصيل'}
          </button>
          <button
            className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            onClick={handleShareClick}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;