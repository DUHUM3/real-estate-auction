import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Calendar, AlertCircle } from "lucide-react";
import EnhancedSelect from "./EnhancedSelect";
import MapContainer from "./MapContainer";

const Step2Location = ({
  formData,
  apiErrors,
  handleFormChange,
  handleRegionChange,
  handleCityChange,
  selectedRegion,
  selectedCity,
  citiesList,
  mapPosition,
  handleMapPositionChange
}) => {
  return (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-[#53a1dd] text-white rounded-xl flex items-center justify-center shadow-lg">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">
            الموقع والتاريخ
          </h3>
          <p className="text-gray-500 text-sm">
            حدد موقع وتاريخ المزاد
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              وقت البدء <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              name="start_time"
              value={formData.start_time}
              onChange={handleFormChange}
              required
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 ${
                apiErrors.start_time
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
            {apiErrors.start_time && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{" "}
                {apiErrors.start_time[0]}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              تاريخ المزاد{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="auction_date"
              value={formData.auction_date}
              onChange={handleFormChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 ${
                apiErrors.auction_date
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            />
            {apiErrors.auction_date && (
              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />{" "}
                {apiErrors.auction_date[0]}
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            العنوان الخاص بالمزاد <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleFormChange}
            required
            className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 ${
              apiErrors.address
                ? "border-red-500"
                : "border-gray-200"
            }`}
            placeholder="أدخل موقع المزاد"
          />
          {apiErrors.address && (
            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />{" "}
              {apiErrors.address[0]}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <EnhancedSelect
              label="المنطقة"
              value={selectedRegion}
              onChange={handleRegionChange}
              optionsName="regions"
              placeholder="اختر المنطقة"
              error={apiErrors.region}
              required={true}
              icon={MapPin}
            />
          </div>

          <div>
            <EnhancedSelect
              label="المدينة"
              value={selectedCity}
              onChange={handleCityChange}
              options={citiesList}
              placeholder={
                selectedRegion
                  ? "اختر المدينة"
                  : "اختر المنطقة أولاً"
              }
              error={apiErrors.city}
              required={true}
              icon={MapPin}
              disabled={!selectedRegion}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            حدد موقع المزاد على الخريطة
          </label>
          <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden shadow-lg">
            <MapContainer
              center={mapPosition}
              zoom={13}
              style={{ height: "300px", width: "100%" }}
              onPositionChange={handleMapPositionChange}
            />
          </div>
          <div className="mt-3 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              اضغط على الخريطة أو اسحب الدبوس لتحديد موقع المزاد
              بدقة
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              خط العرض
            </label>
            <input
              type="text"
              name="latitude"
              value={formData.latitude || mapPosition[0]}
              readOnly
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="سيتم التحديد تلقائياً"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              خط الطول
            </label>
            <input
              type="text"
              name="longitude"
              value={formData.longitude || mapPosition[1]}
              readOnly
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
              placeholder="سيتم التحديد تلقائياً"
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Step2Location;