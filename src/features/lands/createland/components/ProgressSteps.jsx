// Step indicator component

import React from "react";
import {
  FaFileAlt,
  FaRulerCombined,
  FaMoneyBillWave,
  FaImage,
  FaCheckCircle,
} from "react-icons/fa";

const STEP_ICONS = {
  1: FaFileAlt,
  2: FaRulerCombined,
  3: FaMoneyBillWave,
  4: FaImage,
};

const STEP_LABELS = {
  1: "المعلومات الأساسية",
  2: "المساحة والموقع",
  3: "التفاصيل المالية",
  4: "الصور والإقرارات",
};

function ProgressSteps({ currentStep }) {
  return (
    <div className="mb-10">
      <div className="relative">
        <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-200 via-gray-200 to-gray-200 rounded-full z-0 transform -translate-y-1/2">
          <div
            className="absolute h-1.5 rounded-full bg-gradient-to-r from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] transition-all duration-700 ease-in-out shadow-md"
            style={{
              width: `${((currentStep - 1) / 3) * 100}%`,
            }}
          />
        </div>

        <div className="relative z-10 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((num) => {
            const Icon = STEP_ICONS[num];
            const label = STEP_LABELS[num];

            return (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`w-14 h-14 md:w-16 md:h-16 rounded-xl flex items-center justify-center mb-2 shadow-lg transition-all duration-500 transform ${
                    currentStep === num
                      ? "bg-gradient-to-br from-[#53a1dd] via-[#478bc5] to-[#3d7ab0] text-white scale-105 shadow-xl ring-3 ring-blue-200 ring-opacity-50"
                      : currentStep > num
                      ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-md"
                      : "bg-white text-gray-400 border-2 border-gray-200"
                  }`}
                >
                  {currentStep > num ? (
                    <FaCheckCircle className="text-lg md:text-xl" />
                  ) : (
                    <Icon className="text-base md:text-lg" />
                  )}
                </div>
                <span
                  className={`text-xs font-bold text-center transition-colors duration-300 leading-tight ${
                    currentStep >= num ? "text-[#53a1dd]" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProgressSteps;