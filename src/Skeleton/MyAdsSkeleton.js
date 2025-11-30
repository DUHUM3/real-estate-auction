// MyAdsSkeleton.jsx
import React from 'react';

function MyAdsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Combined Search, Filter and Add Bar Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-row items-center justify-between gap-4">
            
            {/* Search Bar Skeleton */}
            <div className="flex-1 min-w-0">
              <div className="h-10 bg-gray-300 rounded-lg animate-pulse"></div>
            </div>

            {/* Filter and Add Buttons Skeleton */}
            <div className="flex items-center gap-3">
              
              {/* Filter Button Skeleton */}
              <div className="h-10 bg-gray-300 rounded-lg w-20 animate-pulse"></div>

              {/* Add Button Skeleton */}
              <div className="h-10 bg-gray-300 rounded-lg w-24 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Statistics Skeleton */}
        <div className="mb-6">
          <div className="h-4 bg-gray-300 rounded w-48 animate-pulse"></div>
        </div>

        {/* Ads Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
              {/* Image Skeleton */}
              <div className="h-48 bg-gray-300"></div>
              
              {/* Content Skeleton */}
              <div className="p-6">
                <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
                
                {/* Information Skeleton */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-40"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-300 rounded"></div>
                    <div className="h-4 bg-gray-300 rounded w-36"></div>
                  </div>
                </div>

                {/* Footer Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="h-4 bg-gray-300 rounded w-24"></div>
                  <div className="flex gap-2">
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyAdsSkeleton;