// مكون حالة عدم وجود نتائج
import React from "react";
import { Home, X, RefreshCw, Plus } from "lucide-react";
import { blueGradients } from "../constants/requestsData";

const EmptyState = ({ onReset, onCreate }) => {
  return (
    <div className="py-16 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-200 my-8">
      <div className="flex justify-center items-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-gray-50 flex items-center justify-center">
            <Home className="text-[#53a1dd]/60" size={40} />
          </div>
          <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-red-50 border-4 border-white flex items-center justify-center">
            <X className="text-red-400" size={20} />
          </div>
        </div>
      </div>

      <h3 className="text-xl font-bold text-gray-800 mb-3">
        لا توجد طلبات أراضي
      </h3>
      <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
        لم يتم العثور على أي طلبات أراضي تطابق معايير البحث. جرب تعديل الفلاتر أو البحث بعبارة أخرى.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className={`py-3 px-6 text-white font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2 ${blueGradients.button} hover:${blueGradients.buttonHover}`}
        >
          <RefreshCw size={16} />
          إعادة تعيين الفلاتر
        </button>

        <button
          onClick={onCreate}
          className="py-3 px-6 bg-white text-[#53a1dd] border border-[#53a1dd] font-bold text-sm rounded-xl transition-all hover:bg-blue-50 flex items-center justify-center gap-2"
        >
          <Plus size={16} />
          كن أول من ينشئ طلب
        </button>
      </div>
    </div>
  );
};

export default EmptyState;