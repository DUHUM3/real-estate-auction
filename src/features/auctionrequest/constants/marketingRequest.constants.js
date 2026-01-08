
// Form validation messages
export const validationMessages = {
  REQUIRED_FIELD: 'جميع الحقول مطلوبة',
  MIN_IMAGES: 'يجب رفع صورة واحدة على الأقل',
  MAX_IMAGES: 'يمكن رفع حتى 5 صور فقط',
  IMAGE_SIZE: 'حجم الصورة يجب أن لا يتجاوز 5MB',
  IMAGE_TYPE: 'يجب أن تكون الملفات صوراً من نوع JPEG، PNG، أو WebP فقط',
  TERMS_REQUIRED: 'يجب الموافقة على الشروط والأحكام',
  LOGIN_REQUIRED: 'يجب تسجيل الدخول أولاً',
};

// User type restrictions
export const restrictedUserTypes = ['شركة مزادات'];

// File upload configuration
export const fileUploadConfig = {
  maxFiles: 5,
  maxSize: 5 * 1024 * 1024, // 5MB
  acceptedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
};