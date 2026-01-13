import React from "react";
import Icons from "../../../icons/index";

// Pagination component for navigating through pages
const Pagination = ({ currentPage, totalPages, onPageChange, onNext, onPrev }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap mt-8 mb-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.FaArrowRight className="text-sm" />
      </button>

      {Array.from({ length: totalPages }, (_, i) => {
        const pageNum = i + 1;
        if (
          pageNum === 1 ||
          pageNum === totalPages ||
          [currentPage - 1, currentPage, currentPage + 1].includes(pageNum)
        ) {
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-md flex items-center justify-center transition-all text-sm font-medium
                ${
                  currentPage === pageNum
                    ? "bg-[#53a1dd] text-white"
                    : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                }`}
            >
              {pageNum}
            </button>
          );
        } else if ([currentPage - 2, currentPage + 2].includes(pageNum)) {
          return (
            <span key={pageNum} className="text-gray-400 flex items-center">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="flex items-center justify-center w-10 h-10 rounded-md border border-gray-300 bg-white text-gray-700 transition-all hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icons.FaArrowLeft className="text-sm" />
      </button>
    </div>
  );
};

export default Pagination;