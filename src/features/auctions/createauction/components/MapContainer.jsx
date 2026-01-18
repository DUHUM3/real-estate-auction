import React, { useEffect, useState } from "react";
import { MapContainer as LeafletMap, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { MapPin } from "lucide-react";
import "leaflet/dist/leaflet.css";

// أيقونة مخصصة (عشان مشكلة الأيقونة الافتراضية)
const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const LocationPicker = ({ center, zoom = 13, style, onPositionChange }) => {
  const [position, setPosition] = useState(center);

  useEffect(() => {
    setPosition(center);
  }, [center]);

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const newPos = [e.latlng.lat, e.latlng.lng];
        setPosition(newPos);
        onPositionChange?.(newPos);
      },
    });
    return null;
  };

  return (
    <div className="relative rounded-lg overflow-hidden" style={style}>
      <LeafletMap
        center={position}
        zoom={zoom}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={position}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const latlng = e.target.getLatLng();
              const newPos = [latlng.lat, latlng.lng];
              setPosition(newPos);
              onPositionChange?.(newPos);
            },
          }}
        />

        <MapEvents />
      </LeafletMap>

      {/* معلومات أسفل الخريطة */}
      <div className="absolute bottom-4 left-4 bg-white/90 px-3 py-2 rounded-lg shadow-md z-[1000]">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-mono">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </div>
      </div>

      {/* تعليمات */}
      <div className="absolute top-4 right-4 bg-white/90 px-3 py-2 rounded-lg shadow-md z-[1000] max-w-xs">
        <p className="text-xs text-right text-gray-600">
          <span className="font-semibold block">التعليمات:</span>
          • اضغط على الخريطة لتحديد الموقع  
          <br />• اسحب الدبوس لتعديل الموقع
        </p>
      </div>
    </div>
  );
};

export default LocationPicker;
