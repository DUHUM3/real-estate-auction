import React, { useState, useEffect } from 'react';
import Icons from '../icons/index';

const AuctionCard = ({
  id,
  img,
  title,
  location,
  startPrice,
  currentBid,
  area,
  endDate,
  auctionCompany,
  bidders,
  daysLeft,
  onClick,
  onToggleFavorite,
  isFavorite = false
}) => {
  const [favorite, setFavorite] = useState(isFavorite);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFavorite(isFavorite);
  }, [isFavorite]);

  const handleFavoriteClick = async (e) => {
    e.stopPropagation();
    if (isLoading) return;

    setIsLoading(true);
    try {
      const result = await onToggleFavorite(id, !favorite, 'auction');
      if (result && result.success) {
        setFavorite(result.is_favorite);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      setFavorite(favorite);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auction-card" onClick={() => onClick && onClick(id, 'auction')}>
      <div className="auction-header">
        <span className="auction-company">{auctionCompany}</span>
      </div>
      <div className="auction-image">
        <img
          src={img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
          alt={title || "أرض عقارية"}
        />
        <div className="auction-timer">
          <Icons.FaCalendarAlt className="timer-icon" /> {daysLeft} يوم متبقي
        </div>
        <div className="card-actions">
          <button
            className={`action-btn favorite-btn ${favorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            <Icons.FaBookmark />
          </button>
        </div>
      </div>
      <div className="auction-content">
        <h3>{title}</h3>
        <p className="location">
          <Icons.FaMapMarkerAlt className="location-icon" />
          {location}
        </p>
        <div className="auction-details">
          <span><Icons.FaRulerCombined className="details-icon" /> {area} متر²</span>
          <span><Icons.FaUsers className="details-icon" /> {bidders} مزايد</span>
        </div>
        <div className="auction-actions">
          <button
            className="details-btn"
            onClick={(e) => {
              e.stopPropagation();
              onClick && onClick(id, 'auction');
            }}
          >
            تفاصيل المزاد
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuctionCard;