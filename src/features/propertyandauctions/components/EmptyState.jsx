import React from "react";
import Icons from "../../../icons/index";

// Empty state component when no results found
const EmptyState = ({ activeTab, onReset, onCreate, createButtonText }) => {
  return (
    <div className="py-24 px-4 text-center bg-white rounded-lg shadow-sm border border-dashed border-gray-200 my-5">
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center">
            {activeTab === "lands" ? (
              <Icons.FaHome className="text-blue-400 text-5xl opacity-70" />
            ) : (
              <Icons.FaGavel className="text-blue-400 text-5xl opacity-70" />
            )}
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {activeTab === "lands" ? "لا توجد أراضي" : "لا توجد مزادات"}
      </h3>
      <p className="text-gray-600 mb-5 max-w-md mx-auto">
        {activeTab === "lands"
          ? "لم يتم العثور على أي أراضي تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بعبارة أخرى."
          : "لم يتم العثور على أي مزادات تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بعبارة أخرى."}
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-[#53a1dd] text-white font-medium rounded-md hover:bg-[#4285c7] transition-colors flex items-center justify-center gap-2"
        >
          <Icons.FaRedo className="text-sm" />
          إعادة تعيين الفلاتر
        </button>

        <button
          onClick={onCreate}
          className="px-6 py-3 bg-white text-[#53a1dd] border border-[#53a1dd] font-medium rounded-md hover:bg-[#53a1dd]/10 transition-colors flex items-center justify-center gap-2"
        >
          <Icons.FaPlus className="text-sm" />
          {createButtonText}
        </button>
      </div>
    </div>
  );
};

export default EmptyState;