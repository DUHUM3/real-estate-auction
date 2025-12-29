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
  onShare,
  shareUrl
}) => {
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
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col h-[380px] min-h-[380px] max-h-[380px] w-[300px]"
      onClick={handleCardClick}
    >
      {/* قسم الصورة - ارتفاع أقل */}
      <div className="relative h-[160px] min-h-[160px] max-h-[160px] overflow-hidden bg-gradient-to-br from-[#f0f8ff] to-gray-100">
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
              <Icons.FaGavel className="text-4xl mb-2 opacity-70" />
            ) : (
              <Icons.FaHome className="text-4xl mb-2 opacity-70" />
            )}
            <span className="text-xs text-gray-400 font-medium">لا توجد صورة</span>
          </div>
        )}
        
        {/* شارة الحالة */}
        {status && (
          <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold shadow-md ${getStatusColor(status)}`}>
            {status}
          </div>
        )}
      </div>

      {/* محتوى البطاقة - يتمدد في المساحة المتبقية */}
      <div className="p-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {/* العنوان */}
        <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2 leading-tight">
          {title}
        </h3>

        {/* الموقع */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Icons.FaMapMarkerAlt className="text-amber-500 w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1 text-xs">{location}</span>
        </div>

        {/* التفاصيل */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">المساحة:</span>
            <span className="font-bold text-black-600" dir="ltr">
              {(area)} م²
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-gray-600">{auctionTitle ? 'قيمة المزاد:' : 'السعر:'}</span>
            <span className="font-bold text-black-600 inline-flex items-center gap-1" dir="ltr">
              <span>{(price)}</span>
              {!auctionTitle && (
                <img
                  src="/images/rail.svg"
                  alt="ريال سعودي"
                  className="w-3 h-3 inline-block flex-shrink-0"
                  style={{ verticalAlign: "middle" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.insertAdjacentHTML(
                      "afterend",
                      '<span class="text-[10px]">ر.س</span>'
                    );
                  }}
                />
              )}
            </span>
          </div>
        </div>

        {/* العلامات */}
        <div className="flex flex-wrap gap-1 pt-2">
          {landType && (
            <span className={`px-1.5 py-0.5 text-[10px] rounded-full font-medium ${getTypeColor(landType)}`}>
              {landType}
            </span>
          )}
          {purpose && (
            <span className="px-1.5 py-0.5 text-[10px] bg-[#e8f2fc] text-[#2c6aa3] rounded-full font-medium">
              {purpose}
            </span>
          )}
          {auctionTitle && (
            <span className="px-1.5 py-0.5 text-[10px] bg-purple-100 text-purple-800 rounded-full font-medium">
              مزاد
            </span>
          )}
        </div>

        {/* عنوان المزاد */}
        {auctionTitle && (
          <div className="flex items-center gap-1 text-xs font-medium text-gray-700 bg-amber-50 p-1.5 rounded-md mt-1">
            <Icons.FaGavel className="text-amber-500 w-3.5 h-3.5 flex-shrink-0" />
            <span className="line-clamp-1 text-xs">{auctionTitle}</span>
          </div>
        )}

        {/* الأزرار - تبقى في الأسفل */}
        <div className="flex gap-1.5 mt-auto pt-2">
          <button className="flex-1 bg-[#53a1dd] text-white px-3 py-2 rounded-md text-xs font-medium hover:bg-[#4a90c9] transition-colors">
            {auctionTitle ? 'المشاركة في المزاد' : 'عرض التفاصيل'}
          </button>
          <button
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex-shrink-0"
            onClick={handleShareClick}
            aria-label="مشاركة"
          >
            <Icons.FaShare className="w-3.5 h-3.5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandCard;
