// Hook for handling image upload and preview logic

import { useState } from "react";
import { useToast } from "../../../../components/common/ToastProvider";
import { VALIDATION_RULES } from "../constants/formConfig";

export function useImageUpload() {
  const [coverImagePreview, setCoverImagePreview] = useState(null);
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

    const toast = useToast();

  const validateImageFile = (file) => {
    if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
      toast.error("حجم الصورة يجب أن يكون أقل من 5 ميجابايت");
      return false;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("يرجى اختيار ملف صورة صحيح");
      return false;
    }

    return true;
  };

  const handleCoverImageChange = (file, setFormData) => {
    if (!file || !validateImageFile(file)) return;

    setFormData((prev) => ({ ...prev, cover_image: file }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverImagePreview(reader.result);
      toast.success("تم رفع الصورة الرئيسية بنجاح");
    };
    reader.readAsDataURL(file);
  };

  const removeCoverImage = (setFormData) => {
    setFormData((prev) => ({ ...prev, cover_image: null }));
    setCoverImagePreview(null);
    toast.info("تم حذف الصورة الرئيسية");
  };

  const handleAdditionalImagesChange = (files, currentImages, setFormData) => {
    const filesArray = Array.from(files || []);

    const validFiles = filesArray.filter((file) => {
      if (file.size > VALIDATION_RULES.MAX_IMAGE_SIZE) {
        toast.error(`حجم الصورة ${file.name} أكبر من 5 ميجابايت`);
        return false;
      }
      if (!file.type.startsWith("image/")) {
        toast.error(`الملف ${file.name} ليس صورة`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const newImages = [...currentImages, ...validFiles];

    if (newImages.length > VALIDATION_RULES.MAX_ADDITIONAL_IMAGES) {
      toast.error("الحد الأقصى 10 صور إضافية");
      return;
    }

    setFormData((prev) => ({ ...prev, images: newImages }));

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdditionalImagesPreview((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            preview: reader.result,
            file: file,
          },
        ]);
      };
      reader.readAsDataURL(file);
    });

    toast.success(`تم رفع ${validFiles.length} صورة إضافية`);
  };

  const removeAdditionalImage = (imageId, setFormData) => {
    setAdditionalImagesPreview((prev) => {
      const filtered = prev.filter((img) => img.id !== imageId);
      const newImages = filtered.map((img) => img.file);
      setFormData((prevData) => ({ ...prevData, images: newImages }));
      return filtered;
    });
    toast.info("تم حذف الصورة");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e, setFormData) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleCoverImageChange(file, setFormData);
    }
  };

  return {
    coverImagePreview,
    additionalImagesPreview,
    isDragging,
    handleCoverImageChange,
    removeCoverImage,
    handleAdditionalImagesChange,
    removeAdditionalImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
  };
}