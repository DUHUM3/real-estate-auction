import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaBuilding, 
  FaInfoCircle, 
  FaCalendarAlt, 
  FaClock,
  FaLink,
  FaGlobe,
  FaCity
} from 'react-icons/fa';
import { formatDate, formatTime } from '../../constants/auction.constants';

const AuctionInfo = ({ data }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
      {/* عنوان المزاد */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <div
            className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold ${
              data.status === 'مفتوح'
                ? 'bg-green-100 text-green-800 border border-green-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}
          >
            {data.status}
          </div>
        </div>

        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3">
          {data.title}
        </h1>

        {/* معلومات الموقع - المنطقة والمدينة */}
        {(data.region || data.city) && (
          <div className="mb-3">
            <div className="flex flex-col sm:flex-row gap-2 mb-2">
              {data.region && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                  <FaGlobe className="text-blue-500 text-sm" />
                  <span className="text-gray-700 font-medium">المنطقة:</span>
                  <span className="text-gray-800 font-semibold">{data.region}</span>
                </div>
              )}
              
              {data.city && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100">
                  <FaCity className="text-emerald-500 text-sm" />
                  <span className="text-gray-700 font-medium">المدينة:</span>
                  <span className="text-gray-800 font-semibold">{data.city}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* العنوان والمعلومات الأساسية */}
        <div className="flex flex-col gap-3 text-gray-600">
          {data.address && (
            <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
              <FaMapMarkerAlt className="text-amber-500 mt-1 flex-shrink-0" />
              <div>
                <span className="text-gray-700 font-medium block mb-1 text-sm">العنوان:</span>
                <span className="text-gray-800 text-sm sm:text-base">{data.address}</span>
              </div>
            </div>
          )}
          
          {data.company?.auction_name && (
            <div className="flex items-center gap-2">
              <FaBuilding className="text-blue-500" />
              <span className="text-sm sm:text-base">
                {data.company.auction_name}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* الوصف */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center gap-2 mb-3">
          <FaInfoCircle className="text-blue-500 text-lg" />
          <h3 className="font-bold text-gray-800 text-lg">عن المزاد</h3>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
          {data.description}
        </p>
      </div>

      {/* معلومات المزاد */}
      <div className="mb-6">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
          تفاصيل المزاد
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-amber-500" />
              <span className="text-gray-700 font-medium">تاريخ المزاد</span>
            </div>
            <p className="text-gray-900 font-bold text-lg">
              {formatDate(data.auction_date)}
            </p>
          </div>

          <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div className="flex items-center gap-2 mb-2">
              <FaClock className="text-blue-500" />
              <span className="text-gray-700 font-medium">وقت البدء</span>
            </div>
            <p className="text-gray-900 font-bold text-lg">
              {formatTime(data.start_time)}
            </p>
          </div>
        </div>
      </div>

      {/* رابط التعريف */}
      {data.intro_link && (
        <div className="mb-6">
          <a
            href={data.intro_link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold rounded-xl hover:from-purple-600 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg"
          >
            <FaLink className="text-lg" />
            <span>رابط التعريف بالمزاد</span>
          </a>
        </div>
      )}

      {/* معلومات إضافية */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <FaCalendarAlt className="text-gray-500" />
              <span className="text-gray-700 font-medium">تاريخ الإنشاء</span>
            </div>
            <p className="text-gray-800 font-semibold">
              {formatDate(data.created_at)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuctionInfo;