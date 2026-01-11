/**
 * Step 3: Login credentials (email and password)
 */

import React, { useState } from "react";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import PasswordStrengthMeter from "./PasswordStrengthMeter";

const Step3LoginCredentials = ({ formData, fieldErrors, passwordStrength, onChange, disabled }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-3 sm:space-y-4">
      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
        <div className="relative">
          <FiMail className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
          <input
            type="email"
            name="email"
            placeholder="example@gmail.com"
            value={formData.email}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.email ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            dir="ltr"
          />
        </div>
        {fieldErrors.email && <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">كلمة المرور</label>
        <div className="relative">
          <FiLock className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.password ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={disabled}
            className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showPassword ? (
              <FiEyeOff size={14} className="sm:size-4" />
            ) : (
              <FiEye size={14} className="sm:size-4" />
            )}
          </button>
        </div>
        <PasswordStrengthMeter password={formData.password} passwordStrength={passwordStrength} />
        {fieldErrors.password && <p className="mt-1 text-xs text-red-600">{fieldErrors.password}</p>}
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-700 mb-1">تأكيد كلمة المرور</label>
        <div className="relative">
          <FiLock className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs sm:text-sm" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="password_confirmation"
            placeholder="••••••••"
            value={formData.password_confirmation}
            onChange={onChange}
            disabled={disabled}
            className={`w-full px-2 sm:px-3 py-1.5 sm:py-2 pr-7 sm:pr-8 text-xs sm:text-sm border rounded-lg focus:ring-1 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
              fieldErrors.password_confirmation ? "border-red-500 bg-red-50" : "border-gray-300"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            dir="ltr"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={disabled}
            className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            {showConfirmPassword ? (
              <FiEyeOff size={14} className="sm:size-4" />
            ) : (
              <FiEye size={14} className="sm:size-4" />
            )}
          </button>
        </div>
        {fieldErrors.password_confirmation && (
          <p className="mt-1 text-xs text-red-600">{fieldErrors.password_confirmation}</p>
        )}
      </div>
    </div>
  );
};

export default Step3LoginCredentials;