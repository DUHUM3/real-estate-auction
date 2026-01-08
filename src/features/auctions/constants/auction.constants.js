export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch (e) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  try {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'مساءً' : 'صباحاً';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  } catch (e) {
    return timeString;
  }
};

export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  return `https://core-api-x41.shaheenplus.sa/storage/${imagePath}`;
};

export const getVideoUrl = (videoPath) => {
  if (!videoPath) return null;
  return `https://core-api-x41.shaheenplus.sa/storage/${videoPath}`;
};

export const AUCTION_STATUS = {
  OPEN: 'مفتوح',
  CLOSED: 'مغلق',
};