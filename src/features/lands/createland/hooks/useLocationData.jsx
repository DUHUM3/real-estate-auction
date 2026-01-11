// Hook for managing region and city data

import { useState, useEffect } from "react";
import { saudiRegions } from "../../../../Constants/saudiRegions";

export function useLocationData() {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  // تحميل المناطق مرة واحدة
  useEffect(() => {
    const allRegions = saudiRegions.map(region =>
      region.name.trim()
    );
    setRegions(allRegions);
  }, []);

  // تحديث المدن بناءً على المنطقة فقط
  const updateCities = (selectedRegionName) => {
    if (!selectedRegionName) {
      setCities([]);
      return;
    }

    const selectedRegion = saudiRegions.find(
      r => r.name.trim() === selectedRegionName
    );

    setCities(selectedRegion?.cities || []);
  };

  return { regions, cities, updateCities };
}
