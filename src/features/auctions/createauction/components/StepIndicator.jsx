import React from "react";
import { motion } from "framer-motion";
import { Check, FileText, MapPin, Image } from "lucide-react";

const StepIndicator = ({ steps, currentStep }) => {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "FileText": return FileText;
      case "MapPin": return MapPin;
      case "Image": return Image;
      default: return FileText;
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between relative">
        <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            className="h-full bg-gradient-to-r from-[#53a1dd] to-[#53a1dd] rounded-full"
            transition={{ duration: 0.5 }}
          />
        </div>

        {steps.map((step) => {
          const StepIcon = getIcon(step.icon);
          const isActive = currentStep >= step.id;
          const isCurrent = currentStep === step.id;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center bg-white px-3"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className={`
                  w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-br from-[#53a1dd] to-[#53a1dd] text-white"
                      : "bg-gray-100 text-gray-400"
                  }
                  ${isCurrent ? "ring-4 ring-white scale-110" : ""}
                `}
              >
                {currentStep > step.id ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <StepIcon className="w-5 h-5" />
                )}
              </motion.div>

              <div className="text-center">
                <span
                  className={`
                    text-sm font-medium transition-colors block
                    ${isActive ? "text-black" : "text-gray-400"}
                  `}
                >
                  {step.title}
                </span>
                <span className="text-xs text-gray-400 hidden sm:block max-w-24 leading-tight">
                  {step.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;