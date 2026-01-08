import React, { useState, useEffect } from 'react';
import Icons from '../icons/index';
import { useNavigate } from 'react-router-dom';

const AuctionCard = ({
  id,
  img,
  title,
  location,
  startPrice,
  currentBid,
  auction_date,
  onClick,
  onToggleFavorite,
  isFavorite = false,
  auctionTitle,
  city,
  region
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [auctionStatus, setAuctionStatus] = useState('مغلق');
  const [auctionStatusDetails, setAuctionStatusDetails] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  // دالة لتحديد لون الحالة
  const getStatusColor = (status) => {
    switch(status) {
      case 'اليوم':
      case 'مفتوح':
        return 'bg-green-500 text-white';
      case 'مغلق':
        return 'bg-red-500 text-white';
      case 'قريباً':
        return 'bg-blue-500 text-white';
      case 'قادم':
        return 'bg-indigo-500 text-white';
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

  // دالة للتحقق من حالة المزاد
  const checkAuctionStatus = (auctionDate) => {
    if (!auctionDate) return { status: 'مغلق', isToday: false, daysDiff: null };

    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const auctionStart = new Date(auctionDate);
    const auctionStartDateOnly = new Date(auctionStart);
    auctionStartDateOnly.setHours(0, 0, 0, 0);
    
    const diffTime = auctionStartDateOnly - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    const auctionEnd = new Date(auctionStart);
    auctionEnd.setDate(auctionEnd.getDate() + 1);
    
    if (diffDays === 0) {
      return { status: 'اليوم', isToday: true, daysDiff: 0 };
    } else if (now < auctionStart) {
      if (diffDays <= 7) {
        return { status: 'قريباً', isToday: false, daysDiff: diffDays };
      } else {
        return { status: 'قادم', isToday: false, daysDiff: diffDays };
      }
    } else if (now >= auctionStart && now <= auctionEnd) {
      return { status: 'مفتوح', isToday: false, daysDiff: null };
    } else {
      return { status: 'مغلق', isToday: false, daysDiff: null };
    }
  };

  useEffect(() => {
    if (auction_date) {
      const statusInfo = checkAuctionStatus(auction_date);
      setAuctionStatus(statusInfo.status);
      setAuctionStatusDetails(statusInfo);
    }
  }, [auction_date]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isLoading || !onToggleFavorite) return;

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

  const handleCardClick = () => {
    if (onClick) {
      onClick(id, 'auction');
    } else {
      navigate(`/auctions/${id}/auction`);
    }
  };

  // دالة لتنسيق التاريخ
  const formatAuctionDate = (dateString) => {
    if (!dateString) return 'غير محدد';
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('ar-SA-u-ca-gregory', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch {
      return 'غير محدد';
    }
  };

  // دالة لعرض نص الحالة
  const getStatusText = (status, details) => {
    switch(status) {
      case 'اليوم':
        return 'يبدأ اليوم';
      case 'قريباً':
        return `خلال ${details.daysDiff} يوم`;
      case 'مفتوح':
        return 'مفتوح الآن';
      case 'مغلق':
        return 'منتهي';
      case 'قادم':
        return `بعد ${details.daysDiff} يوم`;
      default:
        return status;
    }
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col h-[380px] min-h-[380px] max-h-[380px] w-[300px]"
      onClick={handleCardClick}
    >
      {/* قسم الصورة - ارتفاع ثابت */}
      <div className="relative h-[160px] min-h-[160px] max-h-[160px] overflow-hidden bg-gradient-to-br from-[#f0f8ff] to-gray-100">
        {img ? (
          <img
            src={img}
            alt={title || "صورة المزاد"}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center text-[#53a1dd]">
            <Icons.FaGavel className="text-4xl mb-2 opacity-70" />
            <span className="text-xs text-gray-400 font-medium">لا توجد صورة</span>
          </div>
        )}
        
        {/* شارة الحالة */}
        <div className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold shadow-md ${getStatusColor(auctionStatus)}`}>
          {getStatusText(auctionStatus, auctionStatusDetails)}
        </div>
      </div>

      {/* محتوى البطاقة - ارتفاع ثابت */}
      <div className="p-3 flex flex-col gap-2 flex-1 min-h-0 overflow-hidden">
        {/* العنوان */}
        <h3 className="font-bold text-base text-gray-900 mb-1 line-clamp-2 leading-tight">
          {title || "مزاد عقاري"}
        </h3>

        {/* الموقع */}
        <div className="flex items-center gap-1 text-sm text-gray-600">
          <Icons.FaMapMarkerAlt className="text-amber-500 w-3.5 h-3.5 flex-shrink-0" />
          <span className="line-clamp-1 text-xs">{location || "غير محدد"}</span>
        </div>

        {/* التفاصيل */}
        <div className="space-y-1 pt-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-600">تاريخ المزاد:</span>
            <span className="font-bold text-black-600">
              {formatAuctionDate(auction_date)}
            </span>
          </div>

          {/* المدينة والمنطقة مع أيقونات صفراء */}
          <div className="space-y-1 mt-2">
            <div className="flex items-center gap-2 text-xs">
              {/* استخدام أيقونات بديلة إذا كانت FaCity غير متوفرة */}
              {Icons.FaCity ? (
                <Icons.FaCity className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
              ) : Icons.FaBuilding ? (
                <Icons.FaBuilding className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <Icons.FaMapMarkerAlt className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="text-gray-600">المدينة:</span>
              <span className="font-bold text-black-600 line-clamp-1 flex-1 text-left">
                {city || "غير محدد"}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-xs">
              {/* استخدام أيقونات بديلة إذا كانت FaGlobeAsia غير متوفرة */}
              {Icons.FaGlobeAsia ? (
                <Icons.FaGlobeAsia className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
              ) : Icons.FaGlobe ? (
                <Icons.FaGlobe className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
              ) : (
                <Icons.FaMap className="text-yellow-500 w-3.5 h-3.5 flex-shrink-0" />
              )}
              <span className="text-gray-600">المنطقة:</span>
              <span className="font-bold text-black-600 line-clamp-1 flex-1 text-left">
                {region || "غير محدد"}
              </span>
            </div>
          </div>

          {(startPrice || currentBid) && (
            <div className="flex justify-between text-xs mt-2">
              <span className="text-gray-600">
                {auctionStatus === 'مفتوح' || auctionStatus === 'اليوم' ? 'السعر الحالي:' : 'السعر الابتدائي:'}
              </span>
              <span className="font-bold text-black-600 inline-flex items-center gap-1" dir="ltr">
                <span>{currentBid || startPrice || 'غير محدد'}</span>
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
              </span>
            </div>
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
          <button 
            className={`flex-1 px-3 py-2 rounded-md text-xs font-medium transition-colors ${
              auctionStatus === 'مغلق' 
                ? 'bg-gray-400 text-white cursor-not-allowed' 
                : 'bg-[#53a1dd] text-white hover:bg-[#4a90c9]'
            }`}
            disabled={auctionStatus === 'مغلق'}
          >
            {auctionStatus === 'مغلق' ? 'انتهى المزاد' : 'المشاركة في المزاد'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;