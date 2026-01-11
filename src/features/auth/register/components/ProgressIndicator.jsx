/**
 * Step progress indicator component
 */

import React from "react";

const ProgressIndicator = ({ currentStep, maxSteps, title }) => {
  return (
    <div className="mb-4 sm:mb-5">
      <h3 className="text-sm sm:text-base font-semibold text-gray-900 text-center mb-2 sm:mb-3">
        {title}
      </h3>
      <div className="flex items-center justify-between mb-1">
        <div className="flex space-x-1 ml-1">
          {[...Array(maxSteps)].map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full transition-all duration-300 ${
                currentStep > index + 1
                  ? "bg-green-500"
                  : currentStep === index + 1
                  ? "bg-blue-600"
                  : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>
        <span className="text-xs text-gray-600">
          الخطوة {currentStep} من {maxSteps}
        </span>
      </div>
    </div>
  );
};

export default ProgressIndicator;