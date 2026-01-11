import React from 'react';
import { FaHandshake, FaBuilding, FaRulerCombined } from 'react-icons/fa';
import { getPurposeLabel, getTypeLabel, formatPrice } from '../utils/formatters';

/**
 * Grid displaying purpose, type, and area details
 */
const RequestDetailsGrid = ({ request }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-4 sm:mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 pb-2 sm:pb-3 border-b border-gray-200">
        تفاصيل الطلب
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
              <FaHandshake className="text-blue-600 text-sm sm:text-base" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">الغرض</span>
              <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                {getPurposeLabel(request.purpose)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-lg">
              <FaBuilding className="text-purple-600 text-sm sm:text-base" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">النوع</span>
              <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                {getTypeLabel(request.type)}
              </span>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-3 sm:p-4 md:p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
              <FaRulerCombined className="text-green-600 text-sm sm:text-base" />
            </div>
            <div>
              <span className="block text-xs sm:text-sm text-gray-500 mb-1">المساحة المطلوبة</span>
              <span className="font-bold text-gray-800 text-sm sm:text-base md:text-lg">
                {formatPrice(request.area)} م²
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsGrid;