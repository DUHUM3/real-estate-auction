import React, { useState, useRef, useEffect } from "react";
import { MapPin, Clock, Calendar, FileText, Image, Video, Check, ChevronRight, Upload, X, Plus, ArrowLeft, ArrowRight, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Mock auth context - replace with your actual auth context
const useAuth = () => ({ currentUser: { id: 1, name: "User" } });
const useNavigate = () => (path) => console.log("Navigate to:", path);

// Enhanced MapContainer component with touch support
const MapContainer = ({ center, zoom, style, onPositionChange }) => {
  const [position, setPosition] = useState(center);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  
  // Update position when center prop changes
  useEffect(() => {
    setPosition(center);
  }, [center]);
  
  const handleContainerClick = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Calculate new position based on click location
    const newLat = position[0] + ((y - rect.height / 2) / 1000);
    const newLng = position[1] + ((x - rect.width / 2) / 1000);
    
    const newPosition = [parseFloat(newLat.toFixed(6)), parseFloat(newLng.toFixed(6))];
    
    setPosition(newPosition);
    
    // Call the callback if provided
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };
  
  const handlePinDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
    
    if (e.type === 'touchstart') {
      const touch = e.touches[0];
      setDragOffset({
        x: touch.clientX - (window.innerWidth / 2),
        y: touch.clientY - (window.innerHeight / 2)
      });
    } else {
      setDragOffset({
        x: e.clientX - (window.innerWidth / 2),
        y: e.clientY - (window.innerHeight / 2)
      });
    }
  };
  
  const handlePinDrag = (e) => {
    if (!isDragging || !containerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = containerRef.current.getBoundingClientRect();
    let clientX, clientY;
    
    if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Calculate relative position within container
    const relativeX = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const relativeY = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    
    // Convert to latitude/longitude changes
    const newLat = position[0] + ((0.5 - relativeY) * 0.01);
    const newLng = position[1] + ((relativeX - 0.5) * 0.01);
    
    const newPosition = [parseFloat(newLat.toFixed(6)), parseFloat(newLng.toFixed(6))];
    setPosition(newPosition);
    
    if (onPositionChange) {
      onPositionChange(newPosition);
    }
  };
  
  const handlePinDragEnd = () => {
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };
  
  // Add event listeners for mouse/touch events
  useEffect(() => {
    const handleMouseMove = (e) => handlePinDrag(e);
    const handleTouchMove = (e) => handlePinDrag(e);
    const handleMouseUp = () => handlePinDragEnd();
    const handleTouchEnd = () => handlePinDragEnd();
    
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleTouchEnd);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging]);
  
  return (
    <div 
      ref={containerRef}
      className="bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center cursor-crosshair relative overflow-hidden"
      style={style}
      onClick={handleContainerClick}
    >
      {/* Grid pattern for map background */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>
      
      <div className="text-center text-blue-700 z-10 relative">
        <MapPin className="w-12 h-12 mx-auto mb-2" />
        <p className="font-medium">اضغط لتحديد الموقع</p>
        <p className="text-sm opacity-70">Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}</p>
      </div>
      
      {/* Interactive Pin */}
      <div 
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-move z-20"
        onMouseDown={handlePinDragStart}
        onTouchStart={handlePinDragStart}
        style={{
          transform: `translate(${dragOffset.x}px, ${dragOffset.y}px) translate(-50%, -50%)`,
          transition: isDragging ? 'none' : 'transform 0.3s ease'
        }}
      >
        <motion.div
          animate={{ 
            scale: isDragging ? 1.2 : 1,
            y: isDragging ? 0 : [-3, 0, -3]
          }}
          transition={isDragging ? { duration: 0.1 } : { 
            duration: 2, 
            repeat: Infinity,
            repeatType: "loop"
          }}
        >
          <MapPin className="w-10 h-10 text-red-500 drop-shadow-lg" fill="#ef4444" />
        </motion.div>
        
        {/* Pin shadow effect */}
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-8 h-3 bg-black/20 blur-sm rounded-full"></div>
      </div>
      
      {/* Coordinates display */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="w-4 h-4 text-blue-600" />
          <span className="font-mono text-gray-700">
            {position[0].toFixed(6)}, {position[1].toFixed(6)}
          </span>
        </div>
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-md z-10 max-w-xs">
        <p className="text-xs text-gray-600 text-right">
          <span className="font-semibold block">التعليمات:</span>
          • اضغط على الخريطة لنقل الدبوس
          <br />
          • اسحب الدبوس لتحديد الموقع بدقة
        </p>
      </div>
      
      {/* Compass */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex items-center justify-center shadow-md z-10">
        <div className="text-lg">N</div>
      </div>
    </div>
  );
};

// Enhanced File Upload Component
const FileUploadZone = ({ 
  accept, 
  multiple = false, 
  onFilesChange, 
  files = [], 
  type = "image", 
  maxSize = 10,
  required = false 
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };

  const handleFiles = (newFiles) => {
    const validFiles = newFiles.filter(file => {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`حجم الملف ${file.name} كبير جداً. الحد الأقصى ${maxSize}MB`);
        return false;
      }
      return true;
    });

    if (multiple) {
      const updatedFiles = [...files, ...validFiles];
      onFilesChange(updatedFiles);
      
      // Create previews for new files
      validFiles.forEach(file => {
        if (file.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewFiles(prev => [...prev, { file, preview: e.target.result }]);
          };
          reader.readAsDataURL(file);
        }
      });
    } else {
      onFilesChange(validFiles);
      
      // Create preview for single file
      if (validFiles[0] && validFiles[0].type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setPreviewFiles([{ file: validFiles[0], preview: e.target.result }]);
        };
        reader.readAsDataURL(validFiles[0]);
      }
    }
  };

  const removeFile = (index) => {
    if (multiple) {
      const updatedFiles = files.filter((_, i) => i !== index);
      onFilesChange(updatedFiles);
      setPreviewFiles(prev => prev.filter((_, i) => i !== index));
    } else {
      onFilesChange([]);
      setPreviewFiles([]);
    }
  };

  const getIcon = () => {
    switch(type) {
      case 'video': return Video;
      case 'image': return Image;
      default: return Upload;
    }
  };

  const Icon = getIcon();

  return (
    <div className="space-y-4">
      {/* Upload Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer
          ${isDragOver 
            ? 'border-blue-500 bg-blue-50 scale-105' 
            : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
          }
          ${required && files.length === 0 ? 'border-red-300 bg-red-50' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => document.getElementById(`file-input-${type}`).click()}
      >
        <input
          id={`file-input-${type}`}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <motion.div
          animate={{ scale: isDragOver ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
          className="space-y-4"
        >
          <div className={`
            w-16 h-16 mx-auto rounded-full flex items-center justify-center
            ${isDragOver ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-600'}
          `}>
            <Icon className="w-8 h-8" />
          </div>
          
          <div>
            <p className="text-lg font-semibold text-gray-700 mb-2">
              {isDragOver ? 'اتركها هنا' : 'اسحب الملفات هنا'}
            </p>
            <p className="text-sm text-gray-500 mb-3">
              أو اضغط للاختيار {multiple ? '(متعدد)' : ''}
            </p>
            <p className="text-xs text-gray-400">
              الحد الأقصى: {maxSize}MB • {accept}
            </p>
          </div>
        </motion.div>
      </div>

      {/* File Previews */}
      <AnimatePresence>
        {files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3"
          >
            <h4 className="font-medium text-gray-700 flex items-center gap-2">
              <Icon className="w-4 h-4" />
              الملفات المختارة ({files.length})
            </h4>
            
            <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
              {files.map((file, index) => {
                const preview = previewFiles.find(p => p.file === file);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="relative group bg-white border-2 border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-all"
                  >
                    {/* Preview Image */}
                    {preview && (
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-gray-100">
                        <img 
                          src={preview.preview} 
                          alt={file.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    
                    {/* File Info */}
                    <div className="space-y-2">
                      <p className="font-medium text-sm text-gray-800 truncate" title={file.name}>
                        {file.name}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <span className="capitalize">{file.type.split('/')[0]}</span>
                      </div>
                    </div>
                    
                    {/* Remove Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFile(index);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Enhanced Toast Component
const toast = {
  success: (message) => console.log("Success:", message),
  error: (message) => console.log("Error:", message),
  loading: (message) => console.log("Loading:", message),
  dismiss: () => console.log("Toast dismissed")
};

function CreateAuctionAd() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [formLoading, setFormLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formComplete, setFormComplete] = useState(false);
  const [mapPosition, setMapPosition] = useState([24.7136, 46.6753]);
  const [adFormData, setAdFormData] = useState({
    title: "",
    description: "",
    intro_link: "",
    start_time: "",
    auction_date: "",
    address: "",
    latitude: "",
    longitude: "",
    cover_image: [],
    images: [],
    videos: [],
  });

  const steps = [
    { id: 1, title: "المعلومات", icon: FileText, description: "المعلومات الأساسية للمزاد" },
    { id: 2, title: "الموقع والتاريخ", icon: MapPin, description: "تحديد مكان وزمان المزاد" },
    { id: 3, title: "الملفات", icon: Image, description: "رفع الصور والفيديوهات" }
  ];

  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return adFormData.title.trim() && adFormData.description.trim();
      case 2:
        return adFormData.start_time && adFormData.auction_date && adFormData.address.trim() && 
               adFormData.latitude && adFormData.longitude;
      case 3:
        return adFormData.cover_image.length > 0;
      default:
        return true;
    }
  };

  const handleNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1);
      } else {
        setFormComplete(true);
        toast.success("تم استكمال جميع البيانات بنجاح!");
      }
    } else {
      toast.error("يرجى إكمال جميع الحقول المطلوبة قبل الانتقال للخطوة التالية");
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleAddAd = async () => {
    setFormLoading(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("تم إضافة المزاد بنجاح");
      setFormLoading(false);
      resetForm();
      navigate("/my-ads");
    }, 2000);
  };

  const resetForm = () => {
    setAdFormData({
      title: "",
      description: "",
      intro_link: "",
      start_time: "",
      auction_date: "",
      address: "",
      latitude: "",
      longitude: "",
      cover_image: [],
      images: [],
      videos: [],
    });
    setCurrentStep(1);
    setFormComplete(false);
    setMapPosition([24.7136, 46.6753]);
  };

  const handleAdChange = (e) => {
    const { name, value } = e.target;
    setAdFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMapPositionChange = (position) => {
    setMapPosition(position);
    setAdFormData(prev => ({
      ...prev,
      latitude: position[0].toString(),
      longitude: position[1].toString(),
    }));
  };

  const handleBackToAds = () => navigate("/my-ads");
  const handleCancel = () => {
    toast.error("تم إلغاء عملية الإضافة");
    navigate("/my-ads");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-8">

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden"
        >
          {formLoading ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20"
            >
              <div className="relative">
                <div className="w-16 h-16 border-4 border-blue-100 rounded-full animate-spin"></div>
                <div className="w-16 h-16 border-4 border-t-blue-500 rounded-full animate-spin absolute top-0"></div>
              </div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-gray-600 text-lg font-medium mt-4"
              >
                جاري إضافة المزاد...
              </motion.p>
            </motion.div>
          ) : formComplete ? (
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="p-8 md:p-12 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
              >
                <Check className="text-4xl" />
              </motion.div>
              
              <motion.h2 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-gray-800 mb-4"
              >
                تم استكمال جميع البيانات
              </motion.h2>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-gray-600 mb-8 max-w-lg mx-auto text-lg"
              >
                يمكنك الآن إضافة المزاد الجديد أو العودة لتعديل البيانات
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium flex items-center justify-center gap-2 shadow-sm"
                  onClick={handlePrevStep}
                >
                  <ArrowRight className="w-4 h-4" /> العودة للتعديل
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all font-medium flex items-center justify-center gap-2 shadow-lg"
                  onClick={handleAddAd}
                >
                  <Plus className="w-4 h-4" /> إضافة المزاد
                </motion.button>
              </motion.div>
            </motion.div>
          ) : (
            <div className="p-6 sm:p-8">
              {/* Enhanced Progress Steps */}
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  {/* Progress Line */}
                  <div className="hidden md:block absolute top-6 left-0 right-0 h-1 bg-gray-200 rounded-full">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                      className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                      transition={{ duration: 0.5 }}
                    />
                  </div>

                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = currentStep >= step.id;
                    const isCurrent = currentStep === step.id;
                    
                    return (
                      <div key={step.id} className="relative z-10 flex flex-col items-center bg-white px-3">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className={`
                            w-12 h-12 rounded-xl flex items-center justify-center mb-3 shadow-lg transition-all duration-300
                            ${isActive 
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white' 
                              : 'bg-gray-100 text-gray-400'
                            }
                            ${isCurrent ? 'ring-4 ring-blue-200 scale-110' : ''}
                          `}
                        >
                          {currentStep > step.id ? (
                            <Check className="w-5 h-5" />
                          ) : (
                            <StepIcon className="w-5 h-5" />
                          )}
                        </motion.div>
                        
                        <div className="text-center">
                          <span className={`
                            text-sm font-medium transition-colors block
                            ${isActive ? 'text-blue-600' : 'text-gray-400'}
                          `}>
                            {step.title}
                          </span>
                          <span className="text-xs text-gray-400 hidden sm:block max-w-24 leading-tight">
                            {step.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <form onSubmit={(e) => e.preventDefault()}>
                <AnimatePresence mode="wait">
                  {/* Step 1: Basic Information */}
                  {currentStep === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                          <FileText className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">المعلومات الأساسية</h3>
                          <p className="text-gray-500 text-sm">أدخل المعلومات الأساسية للمزاد</p>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            عنوان المزاد <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            value={adFormData.title}
                            onChange={handleAdChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                            placeholder="أدخل عنوان المزاد"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            وصف المزاد <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            value={adFormData.description}
                            onChange={handleAdChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300 resize-none"
                            rows="5"
                            placeholder="أدخل وصفاً مفصلاً عن المزاد"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            رابط التعريف (اختياري)
                          </label>
                          <input
                            type="url"
                            name="intro_link"
                            value={adFormData.intro_link}
                            onChange={handleAdChange}
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                            placeholder="https://example.com/auction-intro"
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 2: Location and Date */}
                  {currentStep === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                          <MapPin className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">الموقع والتاريخ</h3>
                          <p className="text-gray-500 text-sm">حدد موقع وتاريخ المزاد</p>
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
                              value={adFormData.start_time}
                              onChange={handleAdChange}
                              required
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <Calendar className="w-4 h-4" />
                              تاريخ المزاد <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="date"
                              name="auction_date"
                              value={adFormData.auction_date}
                              onChange={handleAdChange}
                              required
                              min={new Date().toISOString().split("T")[0]}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                            />
                          </div>
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            العنوان <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="address"
                            value={adFormData.address}
                            onChange={handleAdChange}
                            required
                            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all hover:border-gray-300"
                            placeholder="أدخل عنوان المزاد"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3">
                            حدد موقع المزاد على الخريطة <span className="text-red-500">*</span>
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
                              اضغط على الخريطة أو اسحب الدبوس لتحديد موقع المزاد بدقة
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
                              خط العرض <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="latitude"
                              value={adFormData.latitude || mapPosition[0]}
                              readOnly
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                              placeholder="سيتم التحديد تلقائياً"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              خط الطول <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              name="longitude"
                              value={adFormData.longitude || mapPosition[1]}
                              readOnly
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-600 cursor-not-allowed"
                              placeholder="سيتم التحديد تلقائياً"
                            />
                          </div>
                        </motion.div>
                      </div>
                    </motion.div>
                  )}

                  {/* Step 3: Enhanced Files Upload */}
                  {currentStep === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      className="bg-gradient-to-br from-blue-50/50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100/50 backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl flex items-center justify-center shadow-lg">
                          <Image className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-800">الصور والملفات</h3>
                          <p className="text-gray-500 text-sm">قم برفع صور وملفات المزاد</p>
                        </div>
                      </div>

                      <div className="space-y-8">
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            الصورة الرئيسية <span className="text-red-500">*</span>
                          </label>
                          <FileUploadZone
                            accept="image/*"
                            multiple={false}
                            files={adFormData.cover_image}
                            onFilesChange={(files) => setAdFormData(prev => ({ ...prev, cover_image: files }))}
                            type="cover"
                            required={true}
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            الصور الإضافية
                          </label>
                          <FileUploadZone
                            accept="image/*"
                            multiple={true}
                            files={adFormData.images}
                            onFilesChange={(files) => setAdFormData(prev => ({ ...prev, images: files }))}
                            type="image"
                          />
                        </motion.div>

                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <Video className="w-4 h-4" />
                            الفيديوهات
                          </label>
                          <FileUploadZone
                            accept="video/*"
                            multiple={true}
                            files={adFormData.videos}
                            onFilesChange={(files) => setAdFormData(prev => ({ ...prev, videos: files }))}
                            type="video"
                            maxSize={100}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Enhanced Navigation Buttons */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-8 pt-6 border-t-2 border-gray-100"
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    {currentStep > 1 && (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="button"
                        className="px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium shadow-sm flex items-center justify-center gap-2"
                        onClick={handlePrevStep}
                      >
                        <ArrowRight className="w-4 h-4" /> رجوع
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={validateCurrentStep() ? { scale: 1.02 } : {}}
                      whileTap={validateCurrentStep() ? { scale: 0.98 } : {}}
                      type="button"
                      className={`
                        px-8 py-3 rounded-xl font-semibold text-lg transition-all flex items-center justify-center gap-2
                        ${!validateCurrentStep()
                          ? "opacity-50 cursor-not-allowed bg-gray-300 text-gray-500"
                          : "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl"
                        }
                      `}
                      onClick={handleNextStep}
                      disabled={!validateCurrentStep()}
                    >
                      {currentStep === 3 ? (
                        <>
                          <Check className="w-4 h-4" /> استكمال البيانات
                        </>
                      ) : (
                        <>
                          الخطوة التالية <ArrowLeft className="w-4 h-4" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              </form>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}

export default CreateAuctionAd;