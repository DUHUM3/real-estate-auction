import React from "react";

// Enhanced Info Card Component for small screens
const InfoCard = ({
  icon: Icon,
  title,
  value,
  color = "blue",
  unit = "",
  className = "",
}) => (
  <div
    className={`flex items-start gap-3 p-3 sm:p-4 bg-white border border-gray-200 rounded-lg sm:rounded-xl hover:shadow-sm transition-shadow ${className}`}
  >
    <div
      className={`p-2 rounded-lg ${
        color === "blue"
          ? "bg-blue-50 text-blue-500"
          : color === "green"
          ? "bg-green-50 text-green-500"
          : color === "amber"
          ? "bg-amber-50 text-amber-500"
          : color === "purple"
          ? "bg-purple-50 text-purple-500"
          : "bg-gray-50 text-gray-500"
      }`}
    >
      <Icon className="text-base sm:text-lg" />
    </div>
    <div className="flex-1 min-w-0">
      <span className="block text-xs sm:text-sm text-gray-500 mb-1 truncate">
        {title}
      </span>
      <span className="block font-semibold text-gray-800 text-sm sm:text-lg truncate">
        {value}{" "}
        {unit && (
          <span className="text-xs sm:text-sm text-gray-500">{unit}</span>
        )}
      </span>
    </div>
  </div>
);

export default InfoCard;