import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  fetchAds, 
  deleteAd, 
  parseAdsData 
} from '../api/adsApi';
import MyAdsSkeleton from '../Skeleton/MyAdsSkeleton';

// استيراد الأيقونات مباشرة
import Icons from '../icons/index';

function MyAds() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeStatus, setActiveStatus] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    show: false,
    adId: null,
    adTitle: ''
  });

  const {
    data: adsData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['ads', currentUser?.user_type, activeStatus],
    queryFn: () => fetchAds(currentUser?.user_type, activeStatus),
    enabled: !!currentUser,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 دقائق
  });

  // React Query لحذف الإعلانات مع الروابط الجديدة
  const deleteMutation = useMutation({
    mutationFn: ({ adId, userType }) => {
      // تحديد رابط الحذف بناءً على نوع المستخدم
      const endpoint = userType === 'شركة مزادات' 
        ? `https://core-api-x41.shaheenplus.sa/api/user/auctions/${adId}`
        : `https://core-api-x41.shaheenplus.sa/api/user/properties/${adId}`;
      
      // استخدام دالة deleteAd مع الرابط المخصص
      return deleteAd(adId, userType, endpoint);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['ads']);
      setConfirmDelete({ show: false, adId: null, adTitle: '' });
    },
    onError: (error) => {
      console.error('Error deleting ad:', error);
      alert('حدث خطأ أثناء حذف الإعلان');
      setConfirmDelete({ show: false, adId: null, adTitle: '' });
    }
  });

  // معالجة حذف الإعلان مع تأكيد
  const handleDeleteAd = (adId, adTitle) => {
    setConfirmDelete({
      show: true,
      adId,
      adTitle: adTitle || 'هذا الإعلان'
    });
  };

  // تأكيد الحذف
  const confirmDeleteAction = () => {
    if (!confirmDelete.adId) return;
    
    deleteMutation.mutate({ 
      adId: confirmDelete.adId, 
      userType: currentUser?.user_type 
    });
  };

  // إلغاء الحذف
  const cancelDelete = () => {
    setConfirmDelete({ show: false, adId: null, adTitle: '' });
  };

  // تحليل البيانات المسترجعة
  const ads = adsData ? parseAdsData(adsData, currentUser?.user_type) : [];

  // الانتقال إلى صفحة إنشاء الإعلان
  const navigateToCreateAd = () => {
    navigate('/create-ad');
  };

  // الانتقال إلى صفحة تعديل الإعلان
  const navigateToEditAd = (adId) => {
    navigate(`/edit-ad/${adId}`);
  };

  // بحث في الإعلانات
  const filteredAds = ads.filter(ad => {
    const searchText = searchTerm.toLowerCase();
    return (
      ad.title?.toLowerCase().includes(searchText) || 
      ad.description?.toLowerCase().includes(searchText) || 
      ad.region?.toLowerCase().includes(searchText) ||
      ad.city?.toLowerCase().includes(searchText) ||
      ad.land_type?.toLowerCase().includes(searchText) ||
      ad.address?.toLowerCase().includes(searchText)
    );
  });

  // تغيير تصفية الحالة
  const handleStatusChange = (status) => {
    setActiveStatus(status);
  };

  // تنسيق الحالة
  const getStatusBadge = (status) => {
    const statusConfig = {
      'قيد المراجعة': { text: 'قيد المراجعة', class: 'bg-yellow-100 text-yellow-800' },
      'مرفوض': { text: 'مرفوض', class: 'bg-red-100 text-red-800' },
      'تم البيع': { text: 'تم البيع', class: 'bg-purple-100 text-purple-800' },
      'مفتوح': { text: 'مفتوح', class: 'bg-green-100 text-green-800' },
      'مغلق': { text: 'مغلق', class: 'bg-gray-100 text-gray-800' },
      'مقبول': { text: 'مقبول', class: 'bg-blue-100 text-blue-800' },
      'منتهي': { text: 'منتهي', class: 'bg-orange-100 text-orange-800' }
    };
    const config = statusConfig[status] || { text: status, class: 'bg-gray-100 text-gray-800' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.class}`}>
        {config.text}
      </span>
    );
  };

  // تصحيح مسار الصورة
  const getImageUrl = (item) => {
    if (!item || !item.cover_image) {
      return 'https://via.placeholder.com/300x150/f8f9fa/6c757d?text=لا+توجد+صورة';
    }
    
    // إذا كان الرابط يحتوي على http فهو رابط كامل
    if (item.cover_image.includes('http')) {
      return item.cover_image;
    }
    
    // إذا كان مساراً نسبياً
    return `https://core-api-x41.shaheenplus.sa/storage/${item.cover_image}`;
  };

  // تنسيق التاريخ
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };

  // تنسيق السعر
  const formatPrice = (price) => {
    if (!price) return 'غير محدد';
    return `${parseFloat(price).toLocaleString('ar-SA')} ريال`;
  };

  // استخدام الـ Skeleton أثناء التحميل
  if (isLoading) {
    return <MyAdsSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      {/* نافذة تأكيد الحذف */}
      {confirmDelete.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Icons.FaExclamationTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">تأكيد الحذف</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                هل أنت متأكد من حذف <span className="font-medium">{confirmDelete.adTitle}</span>؟ هذا الإجراء لا يمكن التراجع عنه.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 py-2.5 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition duration-200 disabled:opacity-50"
                >
                  إلغاء
                </button>
                <button
                  onClick={confirmDeleteAction}
                  disabled={deleteMutation.isLoading}
                  className="flex-1 py-2.5 px-4 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleteMutation.isLoading ? (
                    <>
                      <Icons.FaSpinner className="w-4 h-4 animate-spin" />
                      جاري الحذف...
                    </>
                  ) : (
                    <>
                      <Icons.FaTrash className="w-4 h-4" />
                      حذف
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        
        {/* Combined Search, Filter and Add Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-row items-center justify-between gap-4">
            
            {/* شريط البحث */}
            <div className="flex-1 min-w-0">
              <div className="relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Icons.FaSearch className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder={
                    currentUser?.user_type === 'شركة مزادات' 
                      ? 'ابحث في المزادات...' 
                      : 'ابحث في الإعلانات...'
                  }
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pr-10 pl-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd] transition duration-200"
                />
              </div>
            </div>

            {/* أزرار التصفية والإضافة */}
            <div className="flex items-center gap-3">
              
              {/* زر التصفية - للأراضي فقط */}
              {currentUser?.user_type !== 'شركة مزادات' && (
                <div className="relative">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 border rounded-lg font-medium transition duration-200 ${
                      activeStatus !== 'الكل' || showFilters
                        ? 'bg-[#53a1dd] text-white border-[#53a1dd]'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <Icons.FaFilter className="w-4 h-4" />
                    <span className="hidden sm:inline">التصفية</span>
                    {activeStatus !== 'الكل' && (
                      <span className="w-2 h-2 bg-white rounded-full"></span>
                    )}
                  </button>

                  {/* قائمة التصفية المنبثقة */}
                  {showFilters && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <div className="p-2">
                        <div className="text-xs font-medium text-gray-500 mb-2 px-2">الحالة</div>
                        {['الكل', 'قيد المراجعة', 'مفتوح', 'مرفوض', 'تم البيع'].map((status) => (
                          <button
                            key={status}
                            onClick={() => {
                              handleStatusChange(status);
                              setShowFilters(false);
                            }}
                            className={`flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition duration-200 ${
                              activeStatus === status
                                ? 'bg-[#53a1dd] text-white'
                                : 'text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            <span>{status}</span>
                            {activeStatus === status && (
                              <Icons.FaCheck className="w-3 h-3" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* زر الإضافة */}
              <button 
                onClick={navigateToCreateAd}
                className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2.5 px-4 rounded-lg transition duration-200"
              >
                <Icons.FaPlus className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {currentUser?.user_type === 'شركة مزادات' ? 'مزاد جديد' : 'إعلان جديد'}
                </span>
                <span className="sm:hidden">جديد</span>
              </button>
            </div>
          </div>

          {/* شريط التصفية السريع - يظهر فقط عند التصفية */}
          {currentUser?.user_type !== 'شركة مزادات' && activeStatus !== 'الكل' && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">الحالة المحددة:</span>
                <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
                  <span>{activeStatus}</span>
                  <button
                    onClick={() => handleStatusChange('الكل')}
                    className="hover:text-blue-900 transition duration-200"
                  >
                    <Icons.FaTimes className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* إحصائيات النتائج */}
        <div className="mb-6">
          <p className="text-gray-600 text-sm">
            عرض {filteredAds.length} {currentUser?.user_type === 'شركة مزادات' ? 'مزاد' : 'إعلان'} 
            {searchTerm && ` لنتائج البحث عن: "${searchTerm}"`}
            {activeStatus !== 'الكل' && ` - الحالة: ${activeStatus}`}
          </p>
        </div>

        {/* Content */}
        {error ? (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icons.FaExclamationTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">حدث خطأ</h3>
            <p className="text-gray-600 mb-6">{error.message || 'فشل في جلب الإعلانات'}</p>
            <button 
              onClick={() => refetch()}
              className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              إعادة المحاولة
            </button>
          </div>
        ) : filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAds.map(ad => (
              <div key={ad.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={getImageUrl(ad)}
                    alt={ad.title}
                    className="w-full h-full object-cover transition duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x150/f8f9fa/6c757d?text=لا+توجد+صورة';
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    {getStatusBadge(ad.status)}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                    {ad.title}
                  </h3>
                  
                  {/* Information */}
                  <div className="space-y-2 mb-4">
                    {currentUser?.user_type === 'شركة مزادات' ? (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icons.FaCalendarAlt className="w-4 h-4 text-[#53a1dd]" />
                          <span>{formatDate(ad.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icons.FaMapMarkerAlt className="w-4 h-4 text-[#53a1dd]" />
                          <span className="line-clamp-1">{ad.address || 'لا يوجد عنوان'}</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icons.FaMapMarkerAlt className="w-4 h-4 text-[#53a1dd]" />
                          <span>{ad.region} {ad.city ? `- ${ad.city}` : ''}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Icons.FaTag className="w-4 h-4 text-[#53a1dd]" />
                          <span>{ad.land_type} - {ad.purpose}</span>
                        </div>
                        {ad.price_per_sqm && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Icons.FaMoneyBillWave className="w-4 h-4 text-[#53a1dd]" />
                            <span>سعر المتر: {formatPrice(ad.price_per_sqm)}</span>
                          </div>
                        )}
                        {ad.total_area && (
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>المساحة:</span>
                            <span className="font-medium">{parseFloat(ad.total_area).toLocaleString('ar-SA')} م²</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {formatDate(ad.created_at)}
                    </span>
                    <div className="flex gap-2">
                      {/* <button 
                        onClick={() => navigateToEditAd(ad.id)}
                        className="p-2 text-gray-400 hover:text-[#53a1dd] hover:bg-blue-50 rounded-lg transition duration-200"
                        title="تعديل"
                      >
                        <Icons.FaEdit className="w-4 h-4" />
                      </button> */}
                      <button 
                        onClick={() => handleDeleteAd(ad.id, ad.title)}
                        disabled={deleteMutation.isLoading}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-200 disabled:opacity-50"
                        title="حذف"
                      >
                        {deleteMutation.isLoading && deleteMutation.variables?.adId === ad.id ? (
                          <Icons.FaSpinner className="w-4 h-4 animate-spin" />
                        ) : (
                          <Icons.FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {currentUser?.user_type === 'شركة مزادات' ? (
                <Icons.FaTag className="w-8 h-8 text-gray-400" />
              ) : (
                <Icons.FaClipboardList className="w-8 h-8 text-gray-400" />
              )}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {currentUser?.user_type === 'شركة مزادات' ? 'لا توجد مزادات' : 'لا توجد إعلانات'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || activeStatus !== 'الكل'
                ? 'لا توجد نتائج تطابق بحثك أو التصفية المحددة'
                : currentUser?.user_type === 'شركة مزادات' 
                  ? 'لم تقم بإضافة أي مزادات بعد'
                  : 'لم تقم بإضافة أي إعلانات بعد'
              }
            </p>
            <button 
              onClick={navigateToCreateAd}
              className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              {currentUser?.user_type === 'شركة مزادات' ? 'إضافة مزاد جديد' : 'إضافة إعلان جديد'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}   

export default MyAds;