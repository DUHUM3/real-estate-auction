import React, { useState, useEffect } from 'react';
import Icons from '../icons/index';
import { useNavigate } from 'react-router-dom'; // أضف هذا الاستيراد

const AuctionCard = ({
  id,
  img,
  title,
  location,
  startPrice,
  currentBid,
  area,
  endDate,
  auctionCompany,
  bidders,
  daysLeft,
  onClick,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // أضف هذا السطر

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await onToggleFavorite(id, !favorite, 'auction');
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

  // دالة جديدة للتعامل مع النقر على البطاقة أو الزر
  const handleCardClick = (e, fromButton = false) => {
    if (fromButton) {
      e.stopPropagation();
    }
    // استخدم navigate للانتقال إلى صفحة تفاصيل المزاد
    navigate(`/auctions/${id}/auction`);
  };
  

  return (
    <div 
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100"
      onClick={handleCardClick} // استبدل هنا
    >
      
      {/* الصورة */}
      <div className="relative overflow-hidden">
        <img
          src={img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
          alt={title || "أرض عقارية"}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
        
        {/* العداد */}
        {/* <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center">
          <Icons.FaCalendarAlt className="ml-2" />
          {daysLeft} يوم متبقي
        </div> */}
        
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
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-gray-700 text-sm">
            <Icons.FaRulerCombined className="ml-2 text-gray-400" />
            {area} متر²
          </div>
          <div className="flex items-center text-gray-700 text-sm">
            <Icons.FaUsers className="ml-2 text-gray-400" />
            {bidders} مزايد
          </div>
        </div>
        
        {/* الزر */}
        <button
          className="w-full bg-gray-100 text-blue-400 py-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 font-semibold text-base"
          onClick={(e) => handleCardClick(e, true)} // استبدل هنا
        >
          تفاصيل المزاد
        </button>
      </div>
    </div>
  );
};

export default AuctionCard;