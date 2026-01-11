// Skeleton للعرض الأفقي (Mobile)
import React from "react";

const RequestListSkeleton = ({ count = 6 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse"
        >
          <div className="flex gap-4 p-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
            <div className="flex-1 space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="flex gap-2">
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
                <div className="h-3 bg-gray-200 rounded w-16"></div>
              </div>
              <div className="flex gap-2 mt-2">
                <div className="h-8 bg-gray-200 rounded flex-1"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RequestListSkeleton;