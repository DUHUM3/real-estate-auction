import { useQuery } from "@tanstack/react-query";
import { propertiesApi } from "../../../api/propertiesApi";
import { auctionsApi } from "../../../api/auctionApi";

// Custom hook for fetching properties and auctions data
export const usePropertiesData = (activeTab, landFilters, auctionFilters, currentPage) => {
  const {
    data: propertiesData,
    isLoading: propertiesLoading,
    error: propertiesError,
  } = useQuery({
    queryKey: ["properties", landFilters, currentPage],
    queryFn: () => propertiesApi.getProperties(landFilters, currentPage),
    enabled: activeTab === "lands",
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      if (data.status && data.data) {
        return {
          properties: data.data.data || [],
          totalPages: data.data.pagination?.last_page || 1,
        };
      }
      return { properties: [], totalPages: 1 };
    },
  });

  const {
    data: auctionsData,
    isLoading: auctionsLoading,
    error: auctionsError,
  } = useQuery({
    queryKey: ["auctions", auctionFilters, currentPage],
    queryFn: () => auctionsApi.getAuctions(auctionFilters, currentPage),
    enabled: activeTab === "auctions",
    keepPreviousData: true,
    staleTime: 1000 * 60 * 5,
    select: (data) => {
      if (data.success && data.data) {
        return {
          auctions: data.data.data || [],
          totalPages: data.data.last_page || 1,
        };
      }
      return { auctions: [], totalPages: 1 };
    },
  });

  const isLoading = activeTab === "lands" ? propertiesLoading : auctionsLoading;
  const error = activeTab === "lands" ? propertiesError : auctionsError;

  const currentItems =
    activeTab === "lands"
      ? propertiesData?.properties || []
      : auctionsData?.auctions || [];

  const totalPages =
    activeTab === "lands"
      ? propertiesData?.totalPages || 1
      : auctionsData?.totalPages || 1;

  return {
    currentItems,
    totalPages,
    isLoading,
    error,
    propertiesData,
    auctionsData,
  };
};