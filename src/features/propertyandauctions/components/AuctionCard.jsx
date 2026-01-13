import React from "react";
import Icons from "../../../icons/index";
import { auctionsUtils } from "../../../api/auctionApi";

// Auction card component - handles display for auctions
const AuctionCard = ({ auction, favorites, onToggleFavorite, onShare, onOpenDetails }) => {
  return (
    <div
      className="bg-white rounded-lg overflow-hidden border border-gray-200 transition-all duration-200 hover:shadow-md cursor-pointer
                 md:flex md:flex-col md:shadow-md md:hover:shadow-lg md:hover:-translate-y-1"
      onClick={() => onOpenDetails(auction, "auction")}
    >
      {/* Mobile Layout - Horizontal */}
      <div className="md:hidden flex gap-3 p-3">
        <div className="relative w-28 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          {auctionsUtils.getAuctionImageUrl(auction) ? (
            <img
              src={auctionsUtils.getAuctionImageUrl(auction)}
              alt={auctionsUtils.cleanText(auction.title) || "صورة المزاد"}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-blue-300">
              <Icons.FaGavel className="text-3xl opacity-70" />
            </div>
          )}

          <div
            className={`absolute top-1 right-1 px-1.5 py-0.5 rounded text-xs font-semibold
              ${
                auction.status === "مفتوح"
                  ? "bg-green-500 text-white"
                  : auction.status === "مغلق"
                  ? "bg-gray-500 text-white"
                  : auction.status === "معلق"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
          >
            {auction.status}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <h3 className="font-bold text-base text-gray-900 line-clamp-2 leading-snug">
            {auctionsUtils.cleanText(auction.title)}
          </h3>

          {auction.company && (
            <div className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-800 px-2 py-1 rounded font-medium">
              <Icons.FaBuilding className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{auction.company.auction_name}</span>
            </div>
          )}

          <div className="flex items-center gap-1.5 text-xs text-gray-600">
            <Icons.FaMapMarkerAlt className="text-gray-400 w-3 h-3 flex-shrink-0" />
            <span className="truncate">{auctionsUtils.cleanText(auction.address)}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-600 mt-auto">
            <div className="flex items-center gap-1">
              <Icons.FaCalendarDay className="text-gray-400 w-3 h-3" />
              <span>{auctionsUtils.formatDate(auction.auction_date)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Icons.FaClock className="text-gray-400 w-3 h-3" />
              <span>{auctionsUtils.formatTime(auction.start_time)}</span>
            </div>
          </div>

          <div className="flex gap-1 mt-1">
            <button
              className={`p-1.5 rounded-full transition-all
                ${favorites?.includes(auction.id) ? "text-red-500 bg-red-50" : "text-gray-400 bg-gray-50"}`}
              onClick={(e) => onToggleFavorite("auctions", auction.id, e)}
              aria-label="إضافة إلى المفضلة"
            >
              <Icons.FaHeart
                className="w-3.5 h-3.5"
                fill={favorites?.includes(auction.id) ? "currentColor" : "#6b7280"}
              />
            </button>
            <button
              className="p-1.5 rounded-full bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all"
              onClick={(e) => onShare(auction, "auctions", e)}
              aria-label="مشاركة"
            >
              <Icons.FaShare className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Desktop/Tablet Layout - Vertical (Grid) */}
      <div className="hidden md:flex md:flex-col md:h-full">
        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-blue-50 to-gray-100">
          {auctionsUtils.getAuctionImageUrl(auction) ? (
            <img
              src={auctionsUtils.getAuctionImageUrl(auction)}
              alt={auctionsUtils.cleanText(auction.title) || "صورة المزاد"}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-center items-center text-blue-400">
              <Icons.FaGavel className="text-6xl mb-2 opacity-70" />
              <span className="text-sm text-gray-400 font-medium">لا توجد صورة</span>
            </div>
          )}

          <div
            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold shadow-md
              ${
                auction.status === "مفتوح"
                  ? "bg-green-500 text-white"
                  : auction.status === "مغلق"
                  ? "bg-gray-500 text-white"
                  : auction.status === "معلق"
                  ? "bg-yellow-500 text-white"
                  : "bg-gray-500 text-white"
              }`}
          >
            {auction.status}
          </div>

          <button
            className={`absolute top-3 left-3 p-2 rounded-full bg-white shadow-md transition-all hover:scale-110 z-10
              ${favorites?.includes(auction.id) ? "text-red-500 bg-red-50" : "text-gray-400 bg-gray-50"}`}
            onClick={(e) => onToggleFavorite("auctions", auction.id, e)}
            aria-label="إضافة إلى المفضلة"
          >
            <Icons.FaHeart
              className="w-4 h-4"
              fill={favorites?.includes(auction.id) ? "currentColor" : "#6b7280"}
            />
          </button>
        </div>

        <div className="p-4 flex flex-col gap-3 flex-grow">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2 leading-tight">
            {auctionsUtils.cleanText(auction.title)}
          </h3>

          {auction.company && (
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700 bg-[#53a1dd]/10 p-2 rounded-md">
              <Icons.FaBuilding className="text-[#53a1dd] w-4 h-4" />
              <span>{auction.company.auction_name}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
            <Icons.FaMapMarkerAlt className="text-[#53a1dd] w-4 h-4" />
            <span>{auctionsUtils.cleanText(auction.address)}</span>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icons.FaCalendarDay className="text-[#53a1dd] w-4 h-4" />
              <span>{auctionsUtils.formatDate(auction.auction_date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icons.FaClock className="text-[#53a1dd] w-4 h-4" />
              <span>{auctionsUtils.formatTime(auction.start_time)}</span>
            </div>
          </div>

          <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-4">
            {auctionsUtils.cleanText(auction.description)}
          </p>

          <div className="flex gap-2 mt-auto">
            <button className="flex-1 bg-[#53a1dd] text-white px-4 py-2.5 rounded-md text-sm font-medium hover:bg-[#4285c7] transition-colors">
              عرض التفاصيل
            </button>
            <button
              className="p-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              onClick={(e) => onShare(auction, "auctions", e)}
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

export default AuctionCard;