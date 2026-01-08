import React from "react";
import { motion } from "framer-motion";
import { Image, Video, AlertCircle } from "lucide-react";
import FileUploadZone from "./FileUploadZone";

const Step3Files = ({ formData, apiErrors, handleFileChange }) => {
  return (
    <motion.div
      key="step3"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-[#53a1dd] text-white rounded-xl flex items-center justify-center shadow-lg">
          <Image className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            الصور والملفات
          </h3>
          <p className="text-gray-500 text-sm">
            قم برفع صور وملفات المزاد
          </p>
        </div>
      </div>

      <div className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Image className="w-4 h-4" />
            الصورة الرئيسية{" "}
            <span className="text-red-500">*</span>
          </label>
          <FileUploadZone
            accept="image/*"
            multiple={false}
            files={formData.cover_image}
            onFilesChange={(files) =>
              handleFileChange("cover_image", files)
            }
            type="cover"
            required={true}
          />
          {apiErrors.cover_image && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{" "}
              {apiErrors.cover_image[0]}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Image className="w-4 h-4" />
            الصور الإضافية{" "}
            <span className="text-red-500">*</span>{" "}
            <span className="text-xs text-gray-500">
              (صورة واحدة على الأقل)
            </span>
          </label>
          <FileUploadZone
            accept="image/*"
            multiple={true}
            files={formData.images}
            onFilesChange={(files) =>
              handleFileChange("images", files)
            }
            type="image"
          />
          {apiErrors.images && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{" "}
              {apiErrors.images[0]}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Video className="w-4 h-4" />
            الفيديوهات{" "}
            <span className="text-xs text-gray-500">
              (اختياري)
            </span>
          </label>
          <FileUploadZone
            accept="video/*"
            multiple={true}
            files={formData.videos}
            onFilesChange={(files) =>
              handleFileChange("videos", files)
            }
            type="video"
            maxSize={100}
          />
          {apiErrors.videos && (
            <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{" "}
              {apiErrors.videos[0]}
            </p>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step3Files;