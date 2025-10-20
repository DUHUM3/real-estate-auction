// // src/context/PropertiesContext.js
// import React, { createContext, useState, useContext, useEffect } from 'react';

// const PropertiesContext = createContext();

// export const PropertiesProvider = ({ children }) => {
//   // بيانات الأراضي والمزادات
//   const [properties, setProperties] = useState([]);
//   const [auctions, setAuctions] = useState([]);
//   const [totalPagesProperties, setTotalPagesProperties] = useState(1);
//   const [totalPagesAuctions, setTotalPagesAuctions] = useState(1);
  
//   // حفظ معلومات الفلترة
//   const [landFilters, setLandFilters] = useState({
//     search: '',
//     region: '',
//     city: '',
//     land_type: '',
//     purpose: '',
//     min_area: '',
//     max_area: '',
//     min_price: '',
//     max_price: '',
//     min_investment: '',
//     max_investment: ''
//   });
  
//   const [auctionFilters, setAuctionFilters] = useState({
//     search: '',
//     status: '',
//     date_from: '',
//     date_to: '',
//     company: '',
//     address: ''
//   });
  
//   // الصفحة الحالية
//   const [currentPropertiesPage, setCurrentPropertiesPage] = useState(1);
//   const [currentAuctionsPage, setCurrentAuctionsPage] = useState(1);
  
//   // حالة التحميل
//   const [propertiesLoading, setPropertiesLoading] = useState(false);
//   const [auctionsLoading, setAuctionsLoading] = useState(false);
//   const [error, setError] = useState(null);
  
//   // التاب النشط
//   const [activeTab, setActiveTab] = useState('lands');
  
//   // جلب الأراضي
//   const fetchProperties = async (page = currentPropertiesPage, filters = landFilters) => {
//     try {
//       setPropertiesLoading(true);
      
//       const queryParams = new URLSearchParams();
      
//       if (filters.region) queryParams.append('region', filters.region);
//       if (filters.purpose) queryParams.append('purpose', filters.purpose);
//       if (filters.search) queryParams.append('search', filters.search);
//       if (filters.city) queryParams.append('city', filters.city);
//       if (filters.land_type) queryParams.append('land_type', filters.land_type);
      
//       queryParams.append('page', page);

//       const url = `https://shahin-tqay.onrender.com/api/properties?${queryParams}`;
//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error('فشل في جلب البيانات');
//       }

//       const data = await response.json();

//       if (data.status && data.data) {
//         setProperties(data.data.data || []);
//         setTotalPagesProperties(data.data.pagination?.last_page || 1);
//       } else {
//         setProperties([]);
//         setTotalPagesProperties(1);
//       }

//       setPropertiesLoading(false);
//     } catch (error) {
//       setError(error.message);
//       setPropertiesLoading(false);
//     }
//   };

//   // جلب المزادات
//   const fetchAuctions = async (page = currentAuctionsPage, filters = auctionFilters) => {
//     try {
//       setAuctionsLoading(true);
      
//       const queryParams = new URLSearchParams();
      
//       if (filters.search) queryParams.append('keyword', filters.search);
//       if (filters.status) queryParams.append('status', filters.status);
      
//       queryParams.append('page', page);

//       const url = `https://shahin-tqay.onrender.com/api/auctions?${queryParams}`;
//       const response = await fetch(url);

//       if (!response.ok) {
//         throw new Error('فشل في جلب بيانات المزادات');
//       }

//       const data = await response.json();

//       if (data.success && data.data) {
//         setAuctions(data.data.data || []);
//         setTotalPagesAuctions(data.data.last_page || 1);
//       } else {
//         setAuctions([]);
//         setTotalPagesAuctions(1);
//       }

//       setAuctionsLoading(false);
//     } catch (error) {
//       setError(error.message);
//       setAuctionsLoading(false);
//     }
//   };

//   // تغيير فلاتر الأراضي
//   const updateLandFilters = (newFilters) => {
//     setLandFilters(newFilters);
//     setCurrentPropertiesPage(1); // إعادة تعيين رقم الصفحة
//   };

//   // تغيير فلاتر المزادات
//   const updateAuctionFilters = (newFilters) => {
//     setAuctionFilters(newFilters);
//     setCurrentAuctionsPage(1); // إعادة تعيين رقم الصفحة
//   };

//   // تغيير الصفحة الحالية
//   const changePropertiesPage = (newPage) => {
//     setCurrentPropertiesPage(newPage);
//   };

//   const changeAuctionsPage = (newPage) => {
//     setCurrentAuctionsPage(newPage);
//   };

//   // إعادة تعيين الفلاتر
//   const resetFilters = () => {
//     if (activeTab === 'lands') {
//       setLandFilters({
//         search: '',
//         region: '',
//         city: '',
//         land_type: '',
//         purpose: '',
//         min_area: '',
//         max_area: '',
//         min_price: '',
//         max_price: '',
//         min_investment: '',
//         max_investment: ''
//       });
//       setCurrentPropertiesPage(1);
//     } else {
//       setAuctionFilters({
//         search: '',
//         status: '',
//         date_from: '',
//         date_to: '',
//         company: '',
//         address: ''
//       });
//       setCurrentAuctionsPage(1);
//     }
//   };

//   // تغيير التاب النشط
//   const changeActiveTab = (newTab) => {
//     setActiveTab(newTab);
//   };

//   return (
//     <PropertiesContext.Provider
//       value={{
//         // بيانات
//         properties,
//         auctions,
//         totalPagesProperties,
//         totalPagesAuctions,
//         propertiesLoading,
//         auctionsLoading,
//         error,
        
//         // فلاتر
//         landFilters,
//         auctionFilters,
        
//         // الصفحات الحالية
//         currentPropertiesPage,
//         currentAuctionsPage,
        
//         // التاب النشط
//         activeTab,
        
//         // وظائف
//         fetchProperties,
//         fetchAuctions,
//         updateLandFilters,
//         updateAuctionFilters,
//         changePropertiesPage,
//         changeAuctionsPage,
//         resetFilters,
//         changeActiveTab,
        
//         // تعيين مباشر للبيانات (إذا كنت تحتاج لها)
//         setProperties,
//         setAuctions,
//         setLandFilters,
//         setAuctionFilters
//       }}
//     >
//       {children}
//     </PropertiesContext.Provider>
//   );
// };

// // هوك مختصر للوصول للسياق
// export const useProperties = () => useContext(PropertiesContext);