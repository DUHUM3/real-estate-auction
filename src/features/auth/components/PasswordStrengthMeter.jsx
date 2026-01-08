/**
 * Password strength indicator component
 * Shows password strength and requirements checklist
 */

import React from "react";
import { FiCheck, FiAlertCircle } from "react-icons/fi";
import { PASSWORD_REQUIREMENTS } from "../constants/validation";

const PasswordStrengthMeter = ({ password, passwordStrength }) => {
  if (!password) return null;

  const strengthColors = {
    "قوية جداً": "bg-green-500",
    قوية: "bg-green-400",
    متوسطة: "bg-yellow-500",
    ضعيفة: "bg-orange-500",
    "ضعيفة جداً": "bg-red-500",
  };

  const strengthTextColors = {
    "قوية جداً": "text-green-700",
    قوية: "text-green-600",
    متوسطة: "text-yellow-700",
    ضعيفة: "text-orange-700",
    "ضعيفة جداً": "text-red-700",
  };

  const strength = passwordStrength.strength || "ضعيفة جداً";

  return (
    <div className="mt-2 sm:mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-medium text-gray-700">قوة كلمة المرور:</span>
        <span className={`text-xs font-semibold ${strengthTextColors[strength]}`}>
          {strength}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 sm:h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
        <div
          className={`h-full transition-all duration-300 ${strengthColors[strength]}`}
          style={{
            width: `${(passwordStrength.score / passwordStrength.total) * 100}%`,
          }}
        ></div>
      </div>

      {/* Requirements checklist */}
      <div className="mt-2">
        <p className="text-xs text-gray-600 mb-1">متطلبات كلمة المرور:</p>
        <div className="space-y-1">
          {PASSWORD_REQUIREMENTS.map((req) => {
            const isMet = req.regex.test(password);
            return (
              <div key={req.id} className="flex items-center gap-1.5">
                {isMet ? (
                  <FiCheck className="w-3 h-3 text-green-500 flex-shrink-0" />
                ) : (
                  <FiAlertCircle className="w-3 h-3 text-gray-400 flex-shrink-0" />
                )}
                <span className={`text-xs ${isMet ? "text-green-600" : "text-gray-500"}`}>
                  {req.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PasswordStrengthMeter;