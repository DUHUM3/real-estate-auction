// مكون الترقيم (Pagination)
import React from "react";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { blueGradients } from "../constants/requestsData";

const Pagination = ({ pagination, currentPage, onPageChange, onNext, onPrev }) => {
  if (pagination.last_page <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 flex-wrap mt-8 mb-6">
      <button
        onClick={onPrev}
        disabled={currentPage === 1 || !pagination.links.prev}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-[#53a1dd] transition-all hover:bg-blue-50 hover:border-[#53a1dd] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowRight size={18} />
      </button>

      {Array.from({ length: pagination.last_page }, (_, i) => {
        const pageNum = i + 1;
        if (
          pageNum === 1 ||
          pageNum === pagination.last_page ||
          [currentPage - 1, currentPage, currentPage + 1].includes(pageNum)
        ) {
          return (
            <button
              key={pageNum}
              onClick={() => onPageChange(pageNum)}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all text-sm font-semibold
                ${
                  currentPage === pageNum
                    ? `${blueGradients.primary} text-white border-[#53a1dd] shadow-md`
                    : `border border-gray-300 bg-white text-gray-700 hover:bg-blue-50 hover:border-[#53a1dd] hover:text-[#53a1dd]`
                }`}
            >
              {pageNum}
            </button>
          );
        } else if ([currentPage - 2, currentPage + 2].includes(pageNum)) {
          return (
            <span key={pageNum} className="text-gray-400 px-2">
              ...
            </span>
          );
        }
        return null;
      })}

      <button
        onClick={onNext}
        disabled={currentPage === pagination.last_page || !pagination.links.next}
        className="flex items-center justify-center w-10 h-10 rounded-lg border border-gray-300 bg-white text-[#53a1dd] transition-all hover:bg-blue-50 hover:border-[#53a1dd] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ArrowLeft size={18} />
      </button>
    </div>
  );
};

export default Pagination;