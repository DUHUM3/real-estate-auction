import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Image, Video, Upload, X } from "lucide-react";
import { useToast } from "../../../../components/common/ToastProvider";

const FileUploadZone = ({
  accept,
  multiple = false,
  onFilesChange,
  files = [],
  type = "image",
  maxSize = 10,
  required = false,
}) => {
  const toast = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(
          `حجم الملف ${file.name} كبير جداً. الحد الأقصى ${maxSize}MB`
        );
        return false;
      }
      return true;
    });

    if (multiple) {
      const updatedFiles = [...files, ...validFiles];
      onFilesChange(updatedFiles);

      validFiles.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewFiles((prev) => [
              ...prev,
              { file, preview: e.target.result },
            ]);
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      onFilesChange(validFiles);

      if (validFiles[0] && validFiles[0].type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewFiles([{ file: validFiles[0], preview: e.target.result }]);
        };
        reader.readAsDataURL(validFiles[0]);
      }
    }
  };

  const removeFile = (index) => {
    if (multiple) {
      const updatedFiles = files.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
      setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
    } else {
      onFilesChange([]);
      setPreviewFiles([]);
    }
  };

  const getIcon = () => {
    switch (type) {
      case "video":
        return Video;
      case "image":
        return Image;
      default:
        return Upload;
    }
  };

  const Icon = getIcon();

  return (
    <div className="space-y-4">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${
            isDragOver
              ? "border-blue-500 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"
          }
          ${required && files.length === 0 ? "border-red-300 bg-red-50" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => document.getElementById(`file-input-${type}`).click()}
      >
        <input
          id={`file-input-${type}`}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />

        <motion.div
          animate={{ scale: isDragOver ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div
            className={`
            w-16 h-16 mx-auto rounded-full flex items-center justify-center
            ${
              isDragOver
                ? "bg-blue-500 text-white"
                : "bg-blue-100 text-blue-600"
            }
          `}
          >
            <Icon className="w-8 h-8" />
          </div>

          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {isDragOver ? "اتركها هنا" : "اسحب الملفات هنا"}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              أو اضغط للاختيار {multiple ? "(متعدد)" : ""}
            </p>
            <p className="text-xs text-gray-400">
              الحد الأقصى: {maxSize}MB • {accept}
            </p>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              الملفات المختارة ({files.length})
            </h4>

            <div
              className={`grid gap-4 ${
                multiple ? "grid-cols-2 md:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {files.map((file, index) => {
                const preview = previewFiles.find((p) => p.file === file);

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all"
                  >
                    {preview && (
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <img
                          src={preview.preview}
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <p
                        className="font-medium text-sm text-gray-800 truncate"
                        title={file.name}
                      >
                        {file.name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="capitalize">
                          {file.type.split("/")[0]}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FileUploadZone;