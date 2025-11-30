import React from 'react';

const ClientsSkeleton = () => {
  return (
    <section className="relative mt-[-70px] mb-[30px] z-10">
      <div className="container">
        <div className="bg-white rounded-[16px] shadow-[0_10px_30px_rgba(0,0,0,0.1)] p-[30px] text-center max-w-[90%] mx-auto border-t-4 border-gray-200">
          {/* عنوان Skeleton */}
          <div className="inline-block mb-[20px]">
            <div className="h-[28px] w-[200px] bg-gray-200 rounded-full mx-auto mb-[12px] animate-pulse"></div>
            <div className="h-[3px] w-[60px] bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>

          {/* سلايدر Skeleton */}
          <div className="flex items-center justify-center my-[30px] gap-[15px]">
            {/* زر السابق */}
            <div className="w-[40px] h-[40px] bg-gray-200 rounded-full animate-pulse"></div>

            {/* Logos Skeleton */}
            <div className="overflow-hidden relative w-[70%] max-w-[600px]">
              <div className="flex items-center justify-center gap-[20px]">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className={`flex-shrink-0 w-[150px] h-[80px] flex items-center justify-center bg-gray-200 rounded-lg animate-pulse ${
                      item === 2 ? 'scale-110' : 'opacity-50'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            {/* زر التالي */}
            <div className="w-[40px] h-[40px] bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* النص الفرعي Skeleton */}
          <div className="mt-[20px]">
            <div className="h-[20px] w-[300px] bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClientsSkeleton;