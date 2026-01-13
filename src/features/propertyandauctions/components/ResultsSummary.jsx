import React from "react";

// Component to display results count summary
const ResultsSummary = ({ isLoading, error, currentItemsCount, totalCount }) => {
  if (isLoading || error || currentItemsCount === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-gray-600 text-sm">
        عرض {currentItemsCount} من أصل {totalCount} نتيجة
      </p>
    </div>
  );
};

export default ResultsSummary;