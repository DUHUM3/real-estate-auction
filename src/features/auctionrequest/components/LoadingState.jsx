import React from 'react';

/**
 * Loading spinner component for various states
 */
function LoadingState({ message = 'جاري التحميل...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="w-16 h-16 border-4 border-blue-100 border-t-[#53a1dd] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 text-lg">{message}</p>
    </div>
  );
}

export default LoadingState;