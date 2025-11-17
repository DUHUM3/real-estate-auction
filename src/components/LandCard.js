import React, { useState, useEffect } from 'react';
import Icons from '../icons/index';

const LandCard = ({
  id,
  img,
  title,
  location,
  price,
  area,
  landType,
  purpose,
  auctionTitle,
  status,
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
      const result = await onToggleFavorite(id, !favorite, 'property');
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
    <div className="land-card" onClick={() => onClick && onClick(id, 'land')}>
      <div className="land-image">
        <img
          src={img || "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"}
          alt={title || "أرض عقارية"}
        />
        <div className="land-tag">{landType}</div>
        {status === "تم البيع" && <div className="sold-badge">تم البيع</div>}
        {auctionTitle && <div className="auction-badge">مزاد</div>}
        {/* <div className="card-actions">
          <button
            className={`action-btn favorite-btn ${favorite ? 'active' : ''} ${isLoading ? 'loading' : ''}`}
            onClick={handleFavoriteClick}
            disabled={isLoading}
          >
            <Icons.FaBookmark />
          </button>
        </div> */}
      </div>
      <div className="land-content">
        <h3>{title}</h3>
        <p className="location">
          <Icons.FaMapMarkerAlt className="location-icon" />
          {location}
        </p>
        <div className="land-details">
          <span><Icons.FaRulerCombined className="details-icon" /> {area} متر²</span>
          <span><Icons.FaTag className="details-icon" /> {purpose}</span>
        </div>
        {auctionTitle && (
          <div className="auction-info">
            <span className="auction-title">{auctionTitle}</span>
          </div>
        )}
        <div className="land-price">
          <Icons.FaMoneyBillWave className="price-icon" /> {price} ريال
        </div>
        <button
          className="view-btn"
          onClick={(e) => {
            e.stopPropagation();
            onClick && onClick(id, 'land');
          }}
        >
          {auctionTitle ? 'المشاركة في المزاد' : 'عرض التفاصيل'}
        </button>
      </div>
    </div>
  );
};

export default LandCard;