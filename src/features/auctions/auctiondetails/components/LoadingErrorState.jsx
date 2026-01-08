import React from 'react';

const LoadingErrorState = ({ loading, error, onRetry, onBack }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600 text-lg">جاري تحميل تفاصيل المزاد...</p>
      </div>
    );
  }

  if (error || !loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8 text-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
          <p className="text-red-600 text-lg mb-4">
            {error || 'البيانات غير متوفرة'}
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onRetry}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
            >
              إعادة المحاولة
            </button>
            <button
              onClick={onBack}
              className="px-6 py-2.5 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-all"
            >
              العودة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default LoadingErrorState;