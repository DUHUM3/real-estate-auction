// Hook لجلب البيانات وإدارة الـ pagination
import { useState, useCallback } from "react";
import { fetchLandRequests } from "../services/requestsApi";

export const useRequests = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    links: {
      first: null,
      last: null,
      prev: null,
      next: null,
    },
  });

  const loadRequests = useCallback(async (page = 1, filters = {}) => {
    setIsLoading(true);
    try {
      const { requests: data, pagination: paginationData } = await fetchLandRequests(page, filters);
      setRequests(data);
      setPagination(paginationData);
    } catch (error) {
      console.error("خطأ في جلب البيانات:", error);
      setRequests([]);
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: filters.per_page || 12,
        total: 0,
        links: {
          first: null,
          last: null,
          prev: null,
          next: null,
        },
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    requests,
    pagination,
    loadRequests,
  };
};