import { useState, useEffect } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { initialLandFilters, initialAuctionFilters } from "../constants/filterOptions";

// Custom hook for managing filters state
export const useFilters = () => {
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "lands";
  });

  const [landFilters, setLandFilters] = useState(initialLandFilters);
  const [auctionFilters, setAuctionFilters] = useState(initialAuctionFilters);

  useEffect(() => {
    const tabFromUrl = searchParams.get("tab");
    if (tabFromUrl && (tabFromUrl === "lands" || tabFromUrl === "auctions")) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  useEffect(() => {
    if (location.state?.activeTab) {
      const tabFromState = location.state.activeTab;
      setActiveTab(tabFromState);
      setSearchParams({ tab: tabFromState });
      window.history.replaceState({}, document.title);
    }
  }, [location.state, setSearchParams]);

  useEffect(() => {
    if (location.state?.searchFromHome && location.state?.searchQuery) {
      const searchQuery = location.state.searchQuery;
      const updateFilter = activeTab === "lands" ? setLandFilters : setAuctionFilters;
      updateFilter((prev) => ({ ...prev, search: searchQuery }));
      window.history.replaceState({}, document.title);
    }
  }, [location.state, activeTab]);

  const handleLandFilterChange = (e) => {
    const { name, value } = e.target;
    setLandFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuctionFilterChange = (e) => {
    const { name, value } = e.target;
    setAuctionFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    if (activeTab === "lands") {
      setLandFilters(initialLandFilters);
    } else {
      setAuctionFilters(initialAuctionFilters);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
    setSearchParams({ tab: newTab });
  };

  const getCurrentFilters = () => (activeTab === "lands" ? landFilters : auctionFilters);
  const getCurrentFilterHandler = () =>
    activeTab === "lands" ? handleLandFilterChange : handleAuctionFilterChange;

  return {
    activeTab,
    landFilters,
    auctionFilters,
    handleLandFilterChange,
    handleAuctionFilterChange,
    resetFilters,
    handleTabChange,
    getCurrentFilters,
    getCurrentFilterHandler,
  };
};