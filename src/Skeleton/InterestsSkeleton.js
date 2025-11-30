import React from 'react';

function InterestsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="h-8 bg-gray-200 rounded w-1/4 mb-4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Statistics Skeleton */}
          <div className="mb-6">
            <div className="bg-gray-100 rounded-lg p-4 border border-gray-200 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                {/* Header Skeleton */}
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
                      <div>
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2 animate-pulse"></div>
                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-40 animate-pulse"></div>
                </div>

                {/* Content Skeleton */}
                <div className="p-4">
                  <div className="space-y-3">
                    {/* Message Skeleton */}
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded mt-1 animate-pulse"></div>
                      <div className="flex-1">
                        <div className="h-3 bg-gray-200 rounded w-1/4 mb-1 animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                      </div>
                    </div>

                    {/* Personal Info Skeleton */}
                    {[...Array(3)].map((_, j) => (
                      <div key={j} className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                        <div className="flex-1">
                          <div className="h-3 bg-gray-200 rounded w-1/4 mb-1 animate-pulse"></div>
                          <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Footer Skeleton */}
                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                    <div className="w-24 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
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

export default InterestsSkeleton;