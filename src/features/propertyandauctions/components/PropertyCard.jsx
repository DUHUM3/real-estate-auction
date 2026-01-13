import React from "react";
import Icons from "../../../icons/index";
import { propertiesUtils } from "../../../api/propertiesApi";

// Property card component - handles display for lands
const PropertyCard = ({ property, favorites, onToggleFavorite, onShare, onOpenDetails }) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer
                 md:flex md:flex-col md:shadow-md md:hover:shadow-lg md:hover:-translate-y-1"
      onClick={() => onOpenDetails(property, "land")}
    >
      {/* Mobile Layout - Horizontal */}
      <div className="md:hidden flex gap-3 p-3">
        {/* Image - Left Side on Mobile */}
        <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          {propertiesUtils.getPropertyImageUrl(property) ? (
            <img
              src={propertiesUtils.getPropertyImageUrl(property)}
              alt={property.title || "صورة العقار"}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-300">
              <Icons.FaHome className="text-3xl opacity-70" />
            </div>
          )}

          <div
            className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-semibold
              ${
                property.status === "مفتوح" || property.status === "متاح"
                  ? "bg-green-500 text-white"
                  : property.status === "مباع"
                  ? "bg-red-500 text-white"
                  : property.status === "محجوز"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
          >
            {property.status}
          </div>
        </div>

        {/* Content - Right Side on Mobile */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Icons.FaMapMarkerAlt className="text-gray-400 w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {property.region} - {property.city}
            </span>
          </div>

          <div className="mt-auto flex items-center gap-3 text-lg font-bold text-black" dir="ltr">
            {property.purpose === "بيع" ? (
              <span className="inline-flex items-center gap-1">
                {propertiesUtils.formatPrice(property.price_per_sqm)}
                <img
                  src="/images/rail.svg"
                  alt="ريال سعودي"
                  className="w-3.5 h-3.5 inline-block"
                  style={{ verticalAlign: "middle" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.insertAdjacentHTML(
                      "afterend",
                      '<span class="text-xs font-normal text-gray-600">ر.س/م²</span>'
                    );
                  }}
                />
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                {propertiesUtils.formatPrice(property.estimated_investment_value)}
                <img
                  src="/images/rail.svg"
                  alt="ريال سعودي"
                  className="w-3.5 h-3.5 inline-block"
                  style={{ verticalAlign: "middle" }}
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.insertAdjacentHTML(
                      "afterend",
                      '<span class="text-xs font-normal text-gray-600">ر.س</span>'
                    );
                  }}
                />
              </span>
            )}

            <span className="text-sm font-medium text-black-700">
              {propertiesUtils.formatPrice(property.total_area)} م²
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-1">
            <div className="flex gap-1.5">
              <span
                className={`px-2 py-0.5 text-xs rounded-full font-medium
                  ${
                    property.land_type === "سكني"
                      ? "bg-blue-100 text-blue-800"
                      : property.land_type === "تجاري"
                      ? "bg-amber-100 text-amber-800"
                      : property.land_type === "صناعي"
                      ? "bg-orange-100 text-orange-800"
                      : property.land_type === "زراعي"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
              >
                {property.land_type}
              </span>

              <span className="px-2 py-0.5 text-xs bg-[#53a1dd]/10 text-[#53a1dd] rounded-full font-medium">
                {property.purpose}
              </span>
            </div>

            <div className="flex gap-1">
              <button
                className={`p-1.5 rounded-full transition-all
                  ${
                    favorites?.includes(property.id)
                      ? "text-red-500 bg-red-50"
                      : "text-gray-400 bg-gray-50"
                  }`}
                onClick={(e) => onToggleFavorite("properties", property.id, e)}
                aria-label="إضافة إلى المفضلة"
              >
                <Icons.FaHeart className="w-3.5 h-3.5" fill="currentColor" />
              </button>
              <button
                className="p-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
                onClick={(e) => onShare(property, "properties", e)}
                aria-label="مشاركة"
              >
                <Icons.FaShare className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Layout - Vertical (Grid) */}
      <div className="hidden md:flex md:flex-col md:h-full">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          {propertiesUtils.getPropertyImageUrl(property) ? (
            <img
              src={propertiesUtils.getPropertyImageUrl(property)}
              alt={property.title || "صورة العقار"}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center text-blue-400">
              <Icons.FaHome className="text-6xl mb-2 opacity-70" />
              <span className="text-sm text-gray-400 font-medium">لا توجد صورة</span>
            </div>
          )}

          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-md
              ${
                property.status === "مفتوح" || property.status === "متاح"
                  ? "bg-green-500 text-white"
                  : property.status === "مباع"
                  ? "bg-red-500 text-white"
                  : property.status === "محجوز"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
          >
            {property.status}
          </div>

          <button
            className={`absolute top-3 left-3 p-2 rounded-full bg-white shadow-md transition-all hover:scale-110 z-10
              ${favorites?.includes(property.id) ? "text-red-500" : "text-black"}`}
            onClick={(e) => onToggleFavorite("properties", property.id, e)}
            aria-label="إضافة إلى المفضلة"
          >
            <Icons.FaHeart
              className="w-4 h-4"
              fill={favorites?.includes(property.id) ? "currentColor" : "#6b7280"}
            />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-grow">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
            {property.title}
          </h3>

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Icons.FaMapMarkerAlt className="text-[#53a1dd] w-4 h-4" />
            <span>
              {property.region} - {property.city}
            </span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">المساحة:</span>
              <span className="font-semibold text-black" dir="ltr">
                {propertiesUtils.formatPrice(property.total_area)} م²
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-gray-600">
                {property.purpose === "بيع" ? "السعر/م²:" : "قيمة الاستثمار:"}
              </span>
              <span className="font-semibold text-black inline-flex items-center gap-1" dir="ltr">
                {property.purpose === "بيع" ? (
                  <>
                    <span>{propertiesUtils.formatPrice(property.price_per_sqm)}</span>
                    <img
                      src="/images/rail.svg"
                      alt="ريال سعودي"
                      className="w-3.5 h-3.5 inline-block"
                      style={{ verticalAlign: "middle" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.insertAdjacentHTML("afterend", '<span class="text-xs">ر.س</span>');
                      }}
                    />
                  </>
                ) : (
                  <>
                    <span>{propertiesUtils.formatPrice(property.estimated_investment_value)}</span>
                    <img
                      src="/images/rail.svg"
                      alt="ريال سعودي"
                      className="w-3.5 h-3.5 inline-block"
                      style={{ verticalAlign: "middle" }}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.insertAdjacentHTML("afterend", '<span class="text-xs">ر.س</span>');
                      }}
                    />
                  </>
                )}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span
              className={`px-2 py-1 text-xs rounded-full font-medium
                ${
                  property.land_type === "سكني"
                    ? "bg-blue-100 text-blue-800"
                    : property.land_type === "تجاري"
                    ? "bg-amber-100 text-amber-800"
                    : property.land_type === "صناعي"
                    ? "bg-orange-100 text-orange-800"
                    : property.land_type === "زراعي"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
            >
              {property.land_type}
            </span>
            <span className="px-2 py-1 text-xs bg-[#53a1dd]/10 text-[#53a1dd] rounded-full font-medium">
              {property.purpose}
            </span>
          </div>

          <div className="flex gap-2 mt-auto">
            <button className="flex-1 bg-[#53a1dd] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#4285c7] transition-colors">
              عرض التفاصيل
            </button>
            <button
              className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={(e) => onShare(property, "properties", e)}
              aria-label="مشاركة"
            >
              <Icons.FaShare className="w-4 h-4 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;