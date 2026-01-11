import React from 'react';
import { FaArrowRight, FaShare } from 'react-icons/fa';

/**
 * Header component with back button and share action
 */
const RequestHeader = ({ onBack, onShare }) => {
  return (
    <div className="flex justify-between items-center mb-4 sm:mb-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all hover:shadow-sm text-sm sm:text-base"
      >
        <FaArrowRight className="text-sm" />
        <span className="font-medium">العودة</span>
      </button>
      <div className="flex gap-2">
        <button
          className="p-2 sm:p-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:shadow-sm transition-all"
          onClick={onShare}
          title="مشاركة"
        >
          <FaShare className="text-sm sm:text-base" />
        </button>
      </div>
    </div>
  );
};

export default RequestHeader;