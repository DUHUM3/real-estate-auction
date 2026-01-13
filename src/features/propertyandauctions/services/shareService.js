import { auctionsUtils } from "../../../api/auctionApi";
import { toast } from "react-toastify";

// Helper to show toast notifications
export const showToast = (type, message, duration = 3000) => {
  const isMobile = window.innerWidth < 768;

  const options = {
    position: "top-right",
    autoClose: duration,
    rtl: true,
    theme: "light",
    style: {
      fontSize: isMobile ? "12px" : "14px",
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      borderRadius: isMobile ? "6px" : "8px",
      minHeight: isMobile ? "40px" : "50px",
      padding: isMobile ? "8px 10px" : "12px 14px",
      marginTop: isMobile ? "10px" : "0",
    },
    bodyStyle: {
      fontFamily: "'Segoe UI', 'Cairo', sans-serif",
      fontSize: isMobile ? "12px" : "14px",
      textAlign: "right",
      direction: "rtl",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast.info(message, options);
      break;
    case "warning":
      toast.warning(message, options);
      break;
    default:
      toast(message, options);
  }
};

// Share item functionality
export const shareItem = async (item, type, e) => {
  e?.stopPropagation();

  try {
    let shareText = "";
    if (type === "properties") {
      shareText = `أرض ${item.land_type} - ${item.region} - ${item.city}`;
    } else {
      shareText = `مزاد: ${auctionsUtils.cleanText(item.title)} - ${auctionsUtils.cleanText(item.description)}`;
    }

    const shareUrl =
      type === "properties"
        ? `${window.location.origin}/lands/${item.id}/land`
        : `${window.location.origin}/lands/${item.id}/auction`;

    if (navigator.share) {
      await navigator.share({
        title: type === "properties" ? `أرض رقم ${item.id}` : `مزاد رقم ${item.id}`,
        text: shareText,
        url: shareUrl,
      });
    } else {
      await navigator.clipboard.writeText(shareText + " " + shareUrl);
      showToast("success", "تم نسخ الرابط للمشاركة!");
    }
  } catch (error) {
    console.error("Error sharing:", error);

    let shareText = "";
    if (type === "properties") {
      shareText = `أرض ${item.land_type} - ${item.region} - ${item.city}`;
    } else {
      shareText = `مزاد: ${auctionsUtils.cleanText(item.title)} - ${auctionsUtils.cleanText(item.description)}`;
    }

    const shareUrl =
      type === "properties"
        ? `${window.location.origin}/lands/${item.id}/land`
        : `${window.location.origin}/lands/${item.id}/auction`;

    try {
      await navigator.clipboard.writeText(shareText + " " + shareUrl);
      showToast("success", "تم نسخ الرابط للمشاركة!");
    } catch (err) {
      console.error("فشل نسخ النص: ", err);
      showToast("error", "فشل نسخ الرابط", 5000);
    }
  }
};