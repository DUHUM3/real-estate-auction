// Step 3: Financial Details Form

import React from "react";
import { FaMoneyBillWave } from "react-icons/fa";
import SaudiRiyalIcon from "../../../../features/lands/landsdetail/components/SaudiRiyalIcon"; 

function StepFinancialDetails({ formData, onChange, currentUser }) {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50 rounded-2xl p-5 md:p-7 border-2 border-blue-100 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-[#53a1dd] to-[#478bc5] text-white rounded-xl flex items-center justify-center shadow-lg">
          <FaMoneyBillWave className="text-xl" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-900">التفاصيل المالية</h3>
          <p className="text-gray-600 text-xs mt-1">
            حدد السعر والشروط المالية
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {formData.purpose === "بيع" ? (
          <div className="group">
            <label className="block text-sm font-bold text-gray-800 mb-2">
              سعر المتر المربع (ريال) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="price_per_sqm"
              value={formData.price_per_sqm}
              onChange={onChange}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
              placeholder="مثال: 1500"
              step="0.01"
            />
            {formData.price_per_sqm && formData.total_area && (
              <div className="mt-4 p-5 bg-gradient-to-r from-green-50 via-blue-50 to-green-50 rounded-xl border-2 border-green-200 shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 font-semibold text-base">
                    السعر الإجمالي المتوقع:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-bold text-2xl">
                      {(
                        parseFloat(formData.price_per_sqm) *
                        parseFloat(formData.total_area)
                      ).toLocaleString("ar-SA")}
                    </span>
                    <SaudiRiyalIcon className="w-6 h-6 text-green-700" />
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                مدة الاستثمار (شهر) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="investment_duration"
                value={formData.investment_duration}
                onChange={onChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                placeholder="مثال: 24"
              />
            </div>
            <div className="group">
              <label className="block text-sm font-bold text-gray-800 mb-2">
                القيمة الاستثمارية المتوقعة (ريال){" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="estimated_investment_value"
                value={formData.estimated_investment_value}
                onChange={onChange}
                required
                className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                placeholder="مثال: 5000000"
                step="0.01"
              />
            </div>
            {currentUser?.user_type === "وكيل شرعي" && (
              <div className="md:col-span-2 group">
                <label className="block text-sm font-bold text-gray-800 mb-2">
                  رقم الوكالة <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="agency_number"
                  value={formData.agency_number}
                  onChange={onChange}
                  required
                  className="w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:ring-4 focus:ring-[#53a1dd]/20 focus:border-[#53a1dd] outline-none transition-all duration-300 text-gray-800 font-medium group-hover:border-gray-400 text-sm"
                  placeholder="مثال: AGN-2024-001"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default StepFinancialDetails;
