// Step progress indicator component
import React from "react";
import { motion } from "framer-motion";
import { FORM_STEPS } from "../constants/formSteps";
import Icons from "../../../../icons/index";

export function StepProgress({ currentStep }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        {FORM_STEPS.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              {/* Circle */}
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{
                  scale: currentStep === step.number ? 1.1 : 1,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all z-10 ${
                  currentStep >= step.number
                    ? "bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] text-white shadow-lg"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {currentStep > step.number ? (
                  <Icons.FaCheck className="text-xl" />
                ) : (
                  step.number
                )}
              </motion.div>

              {/* Title */}
              <div className="text-center mt-3 px-2">
                <span
                  className={`text-xs sm:text-sm font-semibold transition-colors whitespace-nowrap ${
                    currentStep === step.number
                      ? "text-[#53a1dd]"
                      : currentStep > step.number
                      ? "text-gray-700"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
              </div>
            </div>

            {/* Connection line */}
            {index < FORM_STEPS.length - 1 && (
              <div className="flex-1 h-1 mx-2 -mt-12 relative">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gray-200 rounded"></div>
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{
                    width: currentStep > step.number ? "100%" : "0%",
                    transition: { duration: 0.5, ease: "easeInOut" },
                  }}
                  className="absolute top-0 left-0 h-1 bg-gradient-to-r from-[#53a1dd] to-[#2d8bcc] rounded"
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}