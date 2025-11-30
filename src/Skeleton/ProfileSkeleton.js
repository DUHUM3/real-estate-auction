// ProfileSkeleton.jsx
import React from 'react';

function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 bg-gray-300 rounded-full animate-pulse"></div>
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="h-8 bg-gray-300 rounded w-48 animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-40 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-36 animate-pulse"></div>
              </div>
            </div>

            {/* <div className="h-10 bg-gray-300 rounded w-24 animate-pulse"></div> */}
          </div>
        </div>

        {/* Stats Skeleton - تم التعديل هنا */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
          <div className="grid grid-cols-5 gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-300 rounded-lg h-16"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Info Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Business Info Skeleton */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="h-6 bg-gray-300 rounded w-40 mb-4 animate-pulse"></div>
          <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-gray-300 rounded animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded w-24 animate-pulse"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-32 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSkeleton;