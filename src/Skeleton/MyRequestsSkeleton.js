// Skeleton/MyRequestsSkeleton.jsx
import React from 'react';

function MyRequestsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
              <div className="h-4 bg-gray-300 rounded w-64 animate-pulse"></div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex bg-gray-300 rounded-lg p-1 w-64">
                <div className="h-10 bg-gray-400 rounded w-32"></div>
                <div className="h-10 bg-gray-400 rounded w-32"></div>
              </div>
              <div className="h-10 bg-gray-300 rounded-lg w-40 animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Statistics Skeleton */}
          <div className="mb-6">
            <div className="h-16 bg-gray-300 rounded-lg animate-pulse"></div>
          </div>

          {/* Requests Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden animate-pulse">
                
                {/* Header Skeleton */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-300 rounded-lg"></div>
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                        <div className="h-3 bg-gray-300 rounded w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-300 rounded-full w-24"></div>
                  </div>
                  <div className="h-4 bg-gray-300 rounded w-40"></div>
                </div>

                {/* Content Skeleton */}
                <div className="p-4">
                  <div className="space-y-3">
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-300 rounded"></div>
                        <div className="space-y-1 flex-1">
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                          <div className="h-4 bg-gray-300 rounded w-32"></div>
                        </div>
                      </div>
                    ))}
                    <div className="h-16 bg-gray-300 rounded-lg"></div>
                  </div>

                  {/* Footer Skeleton */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                    <div className="h-3 bg-gray-300 rounded w-24"></div>
                    <div className="w-8 h-8 bg-gray-300 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyRequestsSkeleton;