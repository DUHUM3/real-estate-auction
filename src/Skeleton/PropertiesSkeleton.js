// PropertiesSkeleton.jsx
import React from 'react';

const PropertiesSkeleton = ({ type = 'lands' }) => {
  const LandSkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
      {/* الصورة */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 relative">
        {/* شارة نوع الأرض */}
        <div className="absolute top-4 right-4 w-20 h-7 bg-gray-400 rounded-full"></div>
        {/* حالة البيع */}
        <div className="absolute top-16 right-4 w-16 h-6 bg-gray-400 rounded-md"></div>
        {/* زر المفضلة */}
        <div className="absolute top-4 left-4 w-9 h-9 bg-gray-400 rounded-full"></div>
      </div>

      {/* المحتوى */}
      <div className="p-6">
        {/* العنوان */}
        <div className="h-6 bg-gray-300 rounded w-4/5 mb-4"></div>
        
        {/* الموقع */}
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 bg-gray-300 rounded-full ml-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>

        {/* التفاصيل */}
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>

        {/* معلومات المزاد */}
        <div className="mb-4">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
        </div>

        {/* السعر */}
        <div className="flex items-center mb-6">
          <div className="w-6 h-6 bg-gray-300 rounded-full ml-2"></div>
          <div className="h-6 bg-gray-300 rounded w-32"></div>
        </div>

        {/* الزر */}
        <div className="h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );

  const AuctionSkeletonCard = () => (
    <div className="animate-pulse bg-white rounded-xl overflow-hidden shadow-lg border border-gray-100">
      {/* هيدر الشركة */}
      <div className="bg-gradient-to-r from-gray-200 to-gray-300 px-5 py-3">
        <div className="w-36 h-6 bg-gray-400 rounded"></div>
      </div>

      {/* الصورة */}
      <div className="h-48 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 relative">
        {/* العداد */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center bg-gray-400 px-4 py-2 rounded-lg">
            <div className="w-5 h-5 bg-gray-300 rounded-full ml-2"></div>
            <div className="w-20 h-5 bg-gray-300 rounded"></div>
          </div>
        </div>

        {/* زر المفضلة */}
        <div className="absolute top-4 left-4 w-9 h-9 bg-gray-400 rounded-full"></div>
      </div>

      {/* المحتوى */}
      <div className="p-6">
        {/* العنوان */}
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-4"></div>
        
        {/* الموقع */}
        <div className="flex items-center mb-4">
          <div className="w-5 h-5 bg-gray-300 rounded-full ml-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>

        {/* التفاصيل */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-24"></div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
            <div className="h-4 bg-gray-300 rounded w-20"></div>
          </div>
        </div>

        {/* الزر */}
        <div className="h-12 bg-gray-300 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(3)].map((_, index) => (
        type === 'lands' ? 
          <LandSkeletonCard key={index} /> : 
          <AuctionSkeletonCard key={index} />
      ))}
    </div>
  );
};

export default PropertiesSkeleton;