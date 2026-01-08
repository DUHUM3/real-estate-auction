import React from 'react';
import { FaArrowLeft, FaShare } from 'react-icons/fa';

const AuctionHeader = ({ onBack, onShare }) => {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm sm:text-base"
      >
        <FaArrowLeft className="text-sm" />
        <span>رجوع</span>
      </button>
      <button
        className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
        onClick={onShare}
      >
        <FaShare className="text-sm sm:text-base" />
      </button>
    </div>
  );
};

export default AuctionHeader;