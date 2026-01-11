import React from "react";
import { RIYAL_ICON_URL } from "../constants/landDetailsConstants";

// Saudi Riyal Icon Component
const SaudiRiyalIcon = ({ className = "w-4 h-4" }) => {
  return (
    <img
      src={RIYAL_ICON_URL}
      alt="ريال سعودي"
      className={`inline-block ${className}`}
      style={{
        verticalAlign: "middle",
      }}
      onError={(e) => {
        console.error("فشل تحميل أيقونة الريال");
        e.target.style.display = "none";
      }}
    />
  );
};

export default SaudiRiyalIcon;