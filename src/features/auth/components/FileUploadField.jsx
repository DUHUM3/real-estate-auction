/**
 * Reusable file upload field component
 * Handles file selection and displays upload status
 */

import React from "react";
import { FiFile } from "react-icons/fi";

const FileUploadField = ({ name, label, uploadedFile, error, onChange, disabled }) => {
  return (
    <div className="mb-3 sm:mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-1">{label}</label>
      <div
        className={`border-2 border-dashed rounded-lg sm:rounded-xl p-2 sm:p-3 text-center transition-all duration-200 ${
          error
            ? "border-red-300 bg-red-50"
            : uploadedFile
            ? "border-green-300 bg-green-50"
            : "border-gray-300 bg-gray-50 hover:border-gray-400"
        }`}
      >
        <input
          type="file"
          name={name}
          id={name}
          onChange={onChange}
          className="hidden"
          disabled={disabled}
          accept=".pdf,.jpg,.jpeg,.png"
        />
        <label htmlFor={name} className="cursor-pointer block">
          {uploadedFile ? (
            <div className="flex items-center justify-center gap-2">
              <FiFile className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
              <div className="text-right">
                <div className="font-medium text-xs sm:text-sm text-green-800 truncate max-w-[120px] sm:max-w-[150px]">
                  {uploadedFile.name}
                </div>
                <div className="text-xs text-green-600">{uploadedFile.size}</div>
              </div>
            </div>
          ) : (
            <div>
              <FiFile className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mx-auto mb-1" />
              <div className="text-xs sm:text-sm text-gray-600">اختر ملفًا أو اسحبه هنا</div>
              <div className="text-xs text-gray-500 mt-0.5 sm:mt-1">
                الصيغ المسموح بها: jpg, jpeg, png, pdf
              </div>
            </div>
          )}
        </label>
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default FileUploadField;