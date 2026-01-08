/**
 * User type selector component
 */

import React from "react";

const UserTypeSelector = ({ value, onChange, disabled }) => {
  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">نوع الحساب</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        <option value={1}>مستخدم عادي</option>
        <option value={2}>مالك أرض</option>
        <option value={3}>وكيل شرعي</option>
        <option value={4}>منشأة تجارية</option>
        <option value={5}>وسيط عقاري</option>
        <option value={6}>شركة مزادات</option>
      </select>
    </div>
  );
};

export default UserTypeSelector;