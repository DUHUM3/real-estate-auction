import { useState, useEffect } from "react";
import { propertiesApi } from "../../../api/propertiesApi";
import { auctionsApi } from "../../../api/auctionApi";

// Custom hook for managing favorites (properties and auctions)
export const useFavorites = (openLogin) => {
  const [favorites, setFavorites] = useState({ properties: [], auctions: [] });

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = () => {
    try {
      const savedPropertyFavorites = localStorage.getItem("propertyFavorites");
      const savedAuctionFavorites = localStorage.getItem("auctionFavorites");
      setFavorites({
        properties: savedPropertyFavorites ? JSON.parse(savedPropertyFavorites) : [],
        auctions: savedAuctionFavorites ? JSON.parse(savedAuctionFavorites) : [],
      });
    } catch (error) {
      console.error("فشل في جلب المفضلات:", error);
    }
  };

  const toggleFavorite = async (type, id, e) => {
    e?.stopPropagation();

    const token = localStorage.getItem("token");

    if (!token) {
      openLogin(() => {
        window.location.reload();
      });
      return;
    }

    const api = type === "properties" ? propertiesApi : auctionsApi;
    const storageKey = type === "properties" ? "propertyFavorites" : "auctionFavorites";

    try {
      const data = await api.toggleFavorite(id, token);

      if (data.success) {
        const action = data.action;
        const currentFavorites = favorites[type] || [];
        let newFavorites;

        if (action === "added") {
          newFavorites = [...currentFavorites, id];
        } else {
          newFavorites = currentFavorites.filter((favId) => favId !== id);
        }

        setFavorites((prev) => ({ ...prev, [type]: newFavorites }));
        localStorage.setItem(storageKey, JSON.stringify(newFavorites));
      }
    } catch (error) {
      console.error("خطأ في تحديث المفضلة:", error);
    }
  };

  const handleLocalFavorite = (type, id) => {
    const storageKey = type === "properties" ? "propertyFavorites" : "auctionFavorites";
    const currentFavorites = favorites[type] || [];
    const isFavorite = currentFavorites.includes(id);

    const newFavorites = isFavorite
      ? currentFavorites.filter((favId) => favId !== id)
      : [...currentFavorites, id];

    setFavorites((prev) => ({ ...prev, [type]: newFavorites }));
    localStorage.setItem(storageKey, JSON.stringify(newFavorites));
  };

  return {
    favorites,
    toggleFavorite,
    handleLocalFavorite,
  };
};
