import { useState, useEffect } from "react";
import { landDetailsApi } from "../services/landDetailsApi";

// Custom hook for managing land details data
export const useLandDetails = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const propertyData = await landDetailsApi.getProperty(id);
      setData(propertyData);
    } catch (error) {
      setError(error.message || "فشل في جلب البيانات");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Helper function to get all images
  const getAllImages = () => {
    if (!data) return [];
    const images = [];
    if (data.cover_image) images.push(data.cover_image);
    if (data.images && data.images.length > 0) {
      images.push(...data.images.map((img) => img.image_path));
    }
    return images;
  };

  // Helper function to get image URL
  const getImageUrl = (imagePath) => {
    return imagePath
      ? `https://core-api-x41.shaheenplus.sa/storage/${imagePath}`
      : null;
  };

  // Helper function to check if property has dimensions
  const hasDimensions = () => {
    return (
      data &&
      (data.length_north ||
        data.length_south ||
        data.length_east ||
        data.length_west)
    );
  };

  // Helper function to calculate total price for sale properties
  const calculateTotalPrice = () => {
    if (!data || data.purpose !== "بيع") return null;
    if (!data.total_area || !data.price_per_sqm) return null;

    const totalArea = parseFloat(data.total_area);
    const pricePerSqm = parseFloat(data.price_per_sqm);

    if (isNaN(totalArea) || isNaN(pricePerSqm)) return null;
    return totalArea * pricePerSqm;
  };

  return {
    data,
    loading,
    error,
    fetchData,
    getAllImages,
    getImageUrl,
    hasDimensions,
    calculateTotalPrice,
  };
};