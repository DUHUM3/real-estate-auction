import React from 'react';
import { FaTag, FaMapMarkerAlt, FaCity } from 'react-icons/fa';
import { getStatusLabel, getTypeLabel } from '../utils/formatters';

/**
 * Main information component: title, description, location
 */
const RequestMainInfo = ({ request }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
      {/* Title and Status */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex-1">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800 mb-2">
            {request.title || `طلب أرض ${getTypeLabel(request.type)}`}
          </h1>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <FaTag className="text-gray-400 text-xs" />
            <span>طلب #{request.id}</span>
          </div>
        </div>
        <div
          className={`inline-flex w-fit whitespace-nowrap px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold
            ${
              request.status === 'open'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : request.status === 'closed'
                ? 'bg-red-100 text-red-800 border border-red-200'
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}
        >
          {getStatusLabel(request.status)}
        </div>
      </div>

      {/* Description */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center gap-2">
          <span className="w-1 h-4 sm:h-5 bg-blue-500 rounded-full"></span>
          الوصف
        </h3>
        <p className="text-gray-600 leading-relaxed text-sm sm:text-base bg-gray-50 p-3 sm:p-4 rounded-lg border border-gray-100">
          {request.description}
        </p>
      </div>

      {/* Location */}
      <div className="mb-6 sm:mb-8">
        <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
          <FaMapMarkerAlt className="text-amber-500 text-sm sm:text-base" />
          الموقع
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gradient-to-r from-amber-50 to-amber-100 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-amber-100 rounded-lg">
                <FaMapMarkerAlt className="text-amber-600 text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-amber-800 font-semibold mb-1 text-sm sm:text-base">المنطقة</p>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg">{request.region}</p>
              </div>
            </div>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-3 sm:p-4 md:p-5">
            <div className="flex items-start gap-2 sm:gap-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                <FaCity className="text-blue-600 text-lg sm:text-xl" />
              </div>
              <div>
                <p className="text-blue-800 font-semibold mb-1 text-sm sm:text-base">المدينة</p>
                <p className="text-gray-700 text-sm sm:text-base md:text-lg">{request.city}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestMainInfo;