import React from "react";
import { AlertCircle } from "lucide-react";
import { saudiRegions } from "../../../../Constants/saudiRegions";

const EnhancedSelect = ({
  label,
  value,
  onChange,
  options = [],
  optionsName,
  placeholder = "اختر...",
  error = null,
  required = false,
  icon: Icon = null,
  disabled = false,
}) => {
  
  const getOptions = () => {
    if (optionsName === "regions") {
      return saudiRegions;
    }
    return options;
  };

  const selectOptions = getOptions();

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        {Icon && <Icon className="w-4 h-4" />}
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
          outline-none transition-all hover:border-gray-300 appearance-none bg-white
          ${error ? "border-red-500" : "border-gray-200"}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        `}
      >
        <option value="">{placeholder}</option>
        {selectOptions.map((option) => (
          <option
            key={option.id || option}
            value={typeof option === "object" ? option.name : option}
          >
            {typeof option === "object" ? option.name : option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" /> {error[0]}
        </p>
      )}
    </div>
  );
};

export default EnhancedSelect;