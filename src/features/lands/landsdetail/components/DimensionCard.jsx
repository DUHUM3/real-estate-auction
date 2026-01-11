import React from "react";

// Format price utility function
const formatPrice = (price) => {
  if (!price) return "0";
  return parseFloat(price).toLocaleString("ar-SA");
};

// Enhanced Dimension Card Component for small screens
const DimensionCard = ({ title, value, unit = "م" }) => (
  <div className="p-2 sm:p-3 bg-gray-50 rounded-lg text-center">
    <span className="block text-xs sm:text-sm text-gray-500 mb-1 truncate">
      {title}
    </span>
    <span className="block font-bold text-gray-700 text-sm sm:text-base">
      {formatPrice(value)} {unit}
    </span>
  </div>
);

export default DimensionCard;