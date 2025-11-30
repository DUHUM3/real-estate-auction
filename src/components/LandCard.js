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
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await onToggleFavorite(id, !favorite, 'property');
      if (result && result.success) {
        setFavorite(result.is_favorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorite(favorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100"
      onClick={() => onClick && onClick(id, 'land')}
    >
      {/* الصورة */}
      <div className="relative overflow-hidden">
        <img
          src={img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
          alt={title || "أرض عقارية"}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* شارة نوع الأرض */}
        <div className="absolute top-4 right-4 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
          {landType}
        </div>
        
        {/* حالة البيع */}
        {status === "تم البيع" && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            تم البيع
          </div>
        )}
        
        {/* شارة المزاد */}
        {auctionTitle && (
          <div className="absolute top-14 left-4 bg-orange-500 text-white px-3 py-1 rounded-lg text-sm font-medium">
            مزاد
          </div>
        )}
      </div>
      
      {/* المحتوى */}
      <div className="p-6">
        {/* العنوان */}
        <h3 className="text-gray-800 text-lg font-semibold mb-3 line-clamp-2 min-h-[3rem]">
          {title}
        </h3>
        
        {/* الموقع */}
        <div className="flex items-center text-gray-600 text-sm mb-4">
          <Icons.FaMapMarkerAlt className="ml-2 text-amber-500" />
          {location}
        </div>
        
        {/* التفاصيل */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-gray-700 text-sm">
            <Icons.FaRulerCombined className="ml-2 text-gray-400" />
            {area} متر²
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Icons.FaTag className="ml-2 text-gray-400" />
            {purpose}
          </div>
        </div>
        
        {/* معلومات المزاد */}
        {auctionTitle && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <span className="text-amber-700 text-sm font-semibold">
              {auctionTitle}
            </span>
          </div>
        )}
        
        {/* السعر */}
        <div className="flex items-center text-blue-400 text-xl font-bold mb-6">
          <Icons.FaMoneyBillWave className="ml-2 text-amber-500 text-lg" />
          {price} ريال
        </div>
        
        {/* الزر */}
        <button
          className="w-full bg-blue-400 text-white py-3 rounded-lg hover:bg-blue-400 transition-colors duration-200 font-semibold text-base"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(id, 'land');
          }}
        >
          {auctionTitle ? 'المشاركة في المزاد' : 'عرض التفاصيل'}
        </button>
      </div>
    </div>
  );
};

export default LandCard;