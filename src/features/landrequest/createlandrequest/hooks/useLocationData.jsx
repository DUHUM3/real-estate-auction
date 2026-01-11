// src/features/landrequest/hooks/useLocationData.js
import { useState, useEffect } from "react";
import { saudiRegions } from "../../../../Constants/saudiRegions"; // استدعاء الملف الجديد

export function useLocationData() {
  const [regions, setRegions] = useState([]);
  const [citiesMap, setCitiesMap] = useState({});

  // تحميل البيانات عند البداية
  useEffect(() => {
    const regionNames = saudiRegions.map((r) => r.name.trim()); // ناخذ أسماء المناطق
    const map = {};
    saudiRegions.forEach((r) => {
      map[r.name.trim()] = r.cities; // الخرائط المدن لكل منطقة
    });

    setRegions(regionNames);
    setCitiesMap(map);
  }, []);

  // دالة للحصول على المدن المتاحة عند اختيار منطقة
  const getAvailableCities = (selectedRegion) => {
    if (selectedRegion && citiesMap[selectedRegion]) {
      return citiesMap[selectedRegion];
    }
    return [];
  };

  return {
    regions,
    citiesMap,
    getAvailableCities,
  };
}
