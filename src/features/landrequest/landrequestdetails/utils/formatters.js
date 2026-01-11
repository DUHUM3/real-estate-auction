// Utility functions for formatting data

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const formatPrice = (price) => {
  if (!price) return '0';
  return parseFloat(price).toLocaleString('ar-SA');
};

export const getPurposeLabel = (purpose) => (purpose === 'sale' ? 'بيع' : 'إيجار');

export const getTypeLabel = (type) => {
  switch (type) {
    case 'residential':
      return 'سكني';
    case 'commercial':
      return 'تجاري';
    case 'agricultural':
      return 'زراعي';
    default:
      return type;
  }
};

export const getStatusLabel = (status) => {
  switch (status) {
    case 'open':
      return 'مفتوح';
    case 'closed':
      return 'مغلق';
    case 'completed':
      return 'مكتمل';
    default:
      return status;
  }
};

export const getAllImages = (request) => {
  if (!request || !request.images) return [];
  return request.images.map((img) => img.image_path);
};