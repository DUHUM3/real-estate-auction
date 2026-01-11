// Loading state component

import React from "react";
import { FaCloudUploadAlt } from "react-icons/fa";

function LoadingScreen() {
  return (
    <div className="flex flex-col items-center justify-center py-28">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <FaCloudUploadAlt className="text-2xl text-[#53a1dd] animate-pulse" />
        </div>
      </div>
      <p className="text-gray-700 text-lg font-semibold mt-5 animate-pulse">
        جاري إضافة الإعلان...
      </p>
      <p className="text-gray-500 text-xs mt-2">
        يرجى الانتظار حتى يتم رفع جميع البيانات
      </p>
    </div>
  );
}

export default LoadingScreen;