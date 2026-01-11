// Hook لإدارة حالة الفلاتر
import { useState, useRef, useEffect } from "react";

export const useFilters = () => {
  const [filters, setFilters] = useState({
    keyword: "",
    region: "",
    city: "",
    purpose: "",
    type: "",
    area_min: "",
    area_max: "",
    per_page: 12,
  });

  const searchTimeoutRef = useRef(null);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((prev) => {
      const newFilters = {
        ...prev,
        [name]: value,
        ...(name === "region" && { city: "" }), // reset city when region changes
      };
      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters((prev) => ({
      ...prev,
      keyword: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      keyword: "",
      region: "",
      city: "",
      purpose: "",
      type: "",
      area_min: "",
      area_max: "",
      per_page: 12,
    });
  };

  const hasActiveFilters = () => {
    return !!(
      filters.keyword ||
      filters.region ||
      filters.city ||
      filters.purpose ||
      filters.type ||
      filters.area_min ||
      filters.area_max
    );
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    filters,
    setFilters,
    handleFilterChange,
    handleSearchChange,
    resetFilters,
    hasActiveFilters,
    searchTimeoutRef,
  };
};