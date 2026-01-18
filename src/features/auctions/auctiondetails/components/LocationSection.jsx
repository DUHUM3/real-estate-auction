import React from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import { FaMapMarkerAlt } from "react-icons/fa";
import "leaflet/dist/leaflet.css";

// إصلاح أيقونة Leaflet الافتراضية (مهم للإنتاج)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationSection = ({ latitude, longitude, address }) => {
  const position = [latitude, longitude];

  return (
    <div className="mb-6">
      <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 pb-3 border-b border-gray-200">
        موقع المزاد
      </h3>

      {/* الخريطة */}
      <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <MapContainer
          center={position}
          zoom={14}
          scrollWheelZoom={false}
          className="w-full h-[350px]"
        >
          <TileLayer
            attribution="&copy; OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position} icon={markerIcon} />
        </MapContainer>
      </div>

      {/* معلومات الموقع */}
      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl border border-emerald-200">
        <div className="flex items-start gap-3">
          <FaMapMarkerAlt className="text-emerald-500 text-xl mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-bold text-gray-800 mb-2">العنوان الكامل</h4>
            <p className="text-gray-700 leading-relaxed">{address}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSection;
