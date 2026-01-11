// مكون بطاقة عرض الطلب - responsive (mobile + desktop)
import React from "react";
import {
  MapPin,
  Calendar,
  Building,
  Target,
  Ruler,
  Eye,
  Share2,
  Home,
} from "lucide-react";
import {
  getStatusLabel,
  getPurposeLabel,
  getTypeLabel,
  getStatusBadgeClass,
  formatPrice,
  formatDate,
  blueGradients,
} from "../constants/requestsData";

// البطاقة الأفقية (Mobile)
const MobileRequestCard = ({ request, onOpenDetails, onShare }) => (
  <div
    className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-200 hover:shadow-lg hover:border-[#53a1dd] cursor-pointer"
    onClick={() => onOpenDetails(request.id)}
  >
    <div className="flex gap-3 sm:gap-4 p-3 sm:p-4">
      <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex-shrink-0 flex items-center justify-center border border-blue-200">
        <Home className="text-[#53a1dd] w-8 h-8 sm:w-12 sm:h-12" />
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div className="space-y-1 sm:space-y-2">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-1 flex-1">
              {request.title}
            </h3>
            <span
              className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${getStatusBadgeClass(
                request.status
              )}`}
            >
              {getStatusLabel(request.status)}
            </span>
          </div>

          <div className="flex items-center gap-1 text-gray-600">
            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 text-[#53a1dd] flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium line-clamp-1">
              {request.region} - {request.city}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1 bg-blue-50 px-2 py-1 rounded border border-blue-100">
              <Ruler className="w-3 h-3 text-[#53a1dd]" />
              <span className="font-semibold text-gray-700">
                {formatPrice(request.area)} م²
              </span>
            </div>
            <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded border border-green-100">
              <Target className="w-3 h-3 text-green-600" />
              <span className="font-semibold text-gray-700">
                {getPurposeLabel(request.purpose)}
              </span>
            </div>
            <div className="flex items-center gap-1 bg-purple-50 px-2 py-1 rounded border border-purple-100">
              <Building className="w-3 h-3 text-purple-600" />
              <span className="font-semibold text-gray-700">
                {getTypeLabel(request.type)}
              </span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(request.created_at)}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-2 sm:mt-3">
          <button
            className={`flex-1 py-2 px-3 text-white font-semibold text-xs sm:text-sm rounded-lg transition-all flex items-center justify-center gap-1 ${blueGradients.button} hover:${blueGradients.buttonHover}`}
            onClick={(e) => {
              e.stopPropagation();
              onOpenDetails(request.id);
            }}
          >
            <Eye size={14} />
            <span>التفاصيل</span>
          </button>
          <button
            className="py-2 px-3 border border-gray-300 bg-white text-gray-700 font-semibold text-xs sm:text-sm rounded-lg transition-all hover:bg-gray-50 flex items-center justify-center gap-1"
            onClick={(e) => onShare(request, e)}
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">مشاركة</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

// البطاقة العمودية (Desktop)
const DesktopRequestCard = ({ request, onOpenDetails, onShare }) => (
  <div
    className="bg-white rounded-xl border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-[#53a1dd] cursor-pointer group"
    onClick={() => onOpenDetails(request.id)}
  >
    <div className="p-5 border-b border-gray-100 bg-gradient-to-l from-blue-50/50 to-white">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-[#53a1dd] transition-colors">
            {request.title}
          </h3>
        </div>
        <span
          className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 ${getStatusBadgeClass(
            request.status
          )}`}
        >
          {getStatusLabel(request.status)}
        </span>
      </div>

      <div className="flex items-center gap-2 text-gray-600 mb-2">
        <div className="p-1.5 bg-blue-50 rounded-lg border border-blue-100">
          <MapPin className="w-3.5 h-3.5 text-[#53a1dd]" />
        </div>
        <span className="text-sm font-medium">
          {request.region} - {request.city}
        </span>
      </div>
    </div>

    <div className="p-5">
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-gradient-to-br from-blue-50 to-blue-25 border border-blue-100 rounded-xl p-3 group/item hover:bg-blue-50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg border border-blue-200 shadow-sm">
              <Ruler className="w-4 h-4 text-[#53a1dd]" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">المساحة</div>
              <div className="text-base font-bold text-gray-800">
                {formatPrice(request.area)} م²
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-25 border border-green-100 rounded-xl p-3 group/item hover:bg-green-50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg border border-green-200 shadow-sm">
              <Target className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">الغرض</div>
              <div className="text-base font-bold text-gray-800">
                {getPurposeLabel(request.purpose)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-purple-25 border border-purple-100 rounded-xl p-3 group/item hover:bg-purple-50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg border border-purple-200 shadow-sm">
              <Building className="w-4 h-4 text-purple-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">النوع</div>
              <div className="text-base font-bold text-gray-800">
                {getTypeLabel(request.type)}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-amber-25 border border-amber-100 rounded-xl p-3 group/item hover:bg-amber-50 transition-colors">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-lg border border-amber-200 shadow-sm">
              <Calendar className="w-4 h-4 text-amber-600" />
            </div>
            <div>
              <div className="text-xs text-gray-500 font-medium">التاريخ</div>
              <div className="text-base font-bold text-gray-800">
                {formatDate(request.created_at)}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          className={`flex-1 py-3 text-white font-bold text-sm rounded-lg transition-all flex items-center justify-center gap-2 ${blueGradients.button} hover:${blueGradients.buttonHover} shadow-sm hover:shadow`}
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(request.id);
          }}
        >
          <Eye size={16} />
          عرض التفاصيل
        </button>

        <button
          className="py-3 px-4 border border-gray-300 bg-white text-gray-700 rounded-lg transition-all hover:bg-gray-50 hover:border-[#53a1dd] hover:text-[#53a1dd] flex items-center justify-center gap-2 shadow-sm hover:shadow"
          onClick={(e) => onShare(request, e)}
        >
          <Share2 size={16} />
          <span className="text-sm font-medium">مشاركة</span>
        </button>
      </div>
    </div>
  </div>
);

const RequestCard = ({ request, isMobile, onOpenDetails, onShare }) => {
  return isMobile ? (
    <MobileRequestCard
      request={request}
      onOpenDetails={onOpenDetails}
      onShare={onShare}
    />
  ) : (
    <DesktopRequestCard
      request={request}
      onOpenDetails={onOpenDetails}
      onShare={onShare}
    />
  );
};

export default RequestCard;