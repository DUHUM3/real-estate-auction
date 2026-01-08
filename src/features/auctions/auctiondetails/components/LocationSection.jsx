import React from 'react';
import { FaDirections, FaMapMarkerAlt } from 'react-icons/fa';

const LocationSection = ({ latitude, longitude, address, title }) => {
  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
        موقع المزاد
      </h3>

      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-6 shadow-lg">
        <button
          onClick={openInGoogleMaps}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-xl transform hover:scale-[1.02] duration-200"
        >
          <FaDirections className="text-blue-500 text-2xl" />
          <span className="font-bold text-gray-800 text-lg">
            فتح الموقع في خرائط جوجل
          </span>
        </button>
      </div>

      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-emerald-500 text-xl mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-2">العنوان الكامل</h4>
            <p className="text-gray-700 leading-relaxed">{address}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
              <span className="px-2 py-1 bg-white rounded-md">
                خط الطول: {longitude}
              </span>
              <span className="px-2 py-1 bg-white rounded-md">
                خط العرض: {latitude}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;