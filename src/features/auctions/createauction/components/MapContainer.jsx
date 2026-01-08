import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

const MapContainer = ({ center, zoom, style, onPositionChange }) => {
  const [position, setPosition] = useState(center);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    setPosition(center);
  }, [center]);

  const handleContainerClick = (e) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newLat = position[0] + (y - rect.height / 2) / 1000;
    const newLng = position[1] + (x - rect.width / 2) / 1000;

    const newPosition = [
      parseFloat(newLat.toFixed(6)),
      parseFloat(newLng.toFixed(6)),
    ];

    setPosition(newPosition);

    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  const handlePinDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);

    if (e.type === "touchstart") {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - window.innerWidth / 2,
        y: touch.clientY - window.innerHeight / 2,
      });
    } else {
      setDragOffset({
        x: e.clientX - window.innerWidth / 2,
        y: e.clientY - window.innerHeight / 2,
      });
    }
  };

  const handlePinDrag = (e) => {
    if (!isDragging || !containerRef.current) return;

    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;

    if (e.type === "touchmove") {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const relativeX = Math.max(
      0,
      Math.min(1, (clientX - rect.left) / rect.width)
    );
    const relativeY = Math.max(
      0,
      Math.min(1, (clientY - rect.top) / rect.height)
    );

    const newLat = position[0] + (0.5 - relativeY) * 0.01;
    const newLng = position[1] + (relativeX - 0.5) * 0.01;

    const newPosition = [
      parseFloat(newLat.toFixed(6)),
      parseFloat(newLng.toFixed(6)),
    ];
    setPosition(newPosition);

    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };

  const handlePinDragEnd = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  useEffect(() => {
    const handleMouseMove = (e) => handlePinDrag(e);
    const handleTouchMove = (e) => handlePinDrag(e);
    const handleMouseUp = () => handlePinDragEnd();
    const handleTouchEnd = () => handlePinDragEnd();

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("touchmove", handleTouchMove, {
        passive: false,
      });
      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center cursor-crosshair relative overflow-hidden"
      style={style}
      onClick={handleContainerClick}
    >
      <div className="absolute inset-0 opacity-30">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="text-center text-blue-700 z-10 relative">
        <MapPin className="w-12 h-12 mx-auto mb-2" />
        <p className="font-medium">اضغط لتحديد الموقع</p>
        <p className="text-sm opacity-70">
          Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
        </p>
      </div>

      <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move z-20"
        onMouseDown={handlePinDragStart}
        onTouchStart={handlePinDragStart}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) translate(-50%, -50%)`,
          transition: isDragging ? "none" : "transform 0.3s ease",
        }}
      >
        <motion.div
          animate={{
            scale: isDragging ? 1.2 : 1,
            y: isDragging ? 0 : [-3, 0, -3],
          }}
          transition={
            isDragging
              ? { duration: 0.1 }
              : {
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "loop",
                }
          }
        >
          <MapPin
            className="w-10 h-10 text-red-500 drop-shadow-lg"
            fill="#ef4444"
          />
        </motion.div>

        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-black/20 blur-sm rounded-full"></div>
      </div>

      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-mono text-gray-700">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </div>
      </div>

      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 max-w-xs">
        <p className="text-xs text-gray-600 text-right">
          <span className="font-semibold block">التعليمات:</span>
          • اضغط على الخريطة لنقل الدبوس
          <br />• اسحب الدبوس لتحديد الموقع بدقة
        </p>
      </div>

      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10">
        <div className="text-lg">N</div>
      </div>
    </div>
  );
};

export default MapContainer;