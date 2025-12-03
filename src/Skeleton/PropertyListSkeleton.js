import React from 'react';

const PropertyListSkeleton = ({ count = 6, type = 'lands' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
      {Array(count).fill(0).map((_, index) => (
        <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200 flex flex-col h-full animate-pulse">
          <div className="relative h-44 sm:h-48 md:h-52 bg-gray-200"></div>

          <div className="p-4 flex flex-col gap-3 flex-grow">
            <div className="h-6 bg-gray-200 rounded-md w-5/6"></div>
            
            <div className="h-8 bg-gray-200 rounded-md w-full"></div>

            <div className="flex justify-between py-2 border-t border-b border-dashed border-gray-100">
              <div className="h-5 bg-gray-200 rounded-md w-2/5"></div>
              <div className="h-5 bg-gray-200 rounded-md w-2/5"></div>
            </div>

            {type === 'lands' && (
              <div className="h-10 bg-gray-200 rounded-md w-full"></div>
            )}

            <div className="flex gap-2 mt-2">
              <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded-full w-1/4"></div>
            </div>
            
            {type === 'auctions' && (
              <div className="h-16 bg-gray-200 rounded-md w-full mt-2"></div>
            )}

            <div className="flex gap-2.5 mt-auto pt-3">
              <div className="h-10 bg-gray-200 rounded-md w-1/2"></div>
              <div className="h-10 bg-gray-200 rounded-md w-1/2"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyListSkeleton;