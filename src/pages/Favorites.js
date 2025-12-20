import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  fetchFavorites, 
  removeFavorite,
  parseFavoritesData 
} from '../api/favoritesApi';
import FavoritesSkeleton from '../Skeleton/FavoritesSkeleton';

// استيراد الأيقونات
import { 
  FaHeart,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaFileAlt,
  FaTrash,
  FaExclamationTriangle,
  FaClock,
  FaHome,
  FaGavel,
  FaEye
} from 'react-icons/fa';

function Favorites() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('all');
  const [removingId, setRemovingId] = useState(null);

  // React Query لجلب المفضلة
  const { 
    data: favoritesData = [], 
    isLoading,
    error 
  } = useQuery({
    queryKey: ['favorites'],
    queryFn: fetchFavorites,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  // طفرة إزالة المفضلة
  const removeFavoriteMutation = useMutation({
    mutationFn: removeFavorite,
    onMutate: async (favorite) => {
      setRemovingId(favorite.id);
      
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(['favorites']);

      // Snapshot the previous value
      const previousFavorites = queryClient.getQueryData(['favorites']);

      // Optimistically update to the new value
      queryClient.setQueryData(['favorites'], (old) => 
        old.filter(fav => fav.id !== favorite.id)
      );

      // Update localStorage
      if (favorite.favoritable_type === 'App\\Models\\Property') {
        const propertyFavorites = JSON.parse(localStorage.getItem('propertyFavorites') || '[]');
        const updatedPropertyFavorites = propertyFavorites.filter(id => id !== favorite.favoritable_id);
        localStorage.setItem('propertyFavorites', JSON.stringify(updatedPropertyFavorites));
      } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
        const auctionFavorites = JSON.parse(localStorage.getItem('auctionFavorites') || '[]');
        const updatedAuctionFavorites = auctionFavorites.filter(id => id !== favorite.favoritable_id);
        localStorage.setItem('auctionFavorites', JSON.stringify(updatedAuctionFavorites));
      }

      return { previousFavorites };
    },
    onError: (error, favorite, context) => {
      // Rollback to the previous value on error
      queryClient.setQueryData(['favorites'], context.previousFavorites);
      console.error('Error removing favorite:', error);
      alert('حدث خطأ أثناء إزالة العنصر من المفضلة');
    },
    onSettled: () => {
      setRemovingId(null);
      // Ensure we refetch to stay in sync with server
      queryClient.invalidateQueries(['favorites']);
    },
  });

  // معالجة البيانات
  const favorites = parseFavoritesData(favoritesData);

  // دالة للتعامل مع إزالة المفضلة
  const handleRemoveFavorite = async (favorite, e) => {
    if (e) {
      e.stopPropagation();
    }
    
    // if (!window.confirm('هل أنت متأكد من إزالة هذا العنصر من المفضلة؟')) return;
    
    removeFavoriteMutation.mutate(favorite);
  };

  // دالة للانتقال إلى صفحة تفاصيل العنصر
  const handleViewItem = (id, type = null) => {
    let itemType = type;
    if (!itemType) {
      const favoriteItem = favorites.find(fav => fav.favoritable_id === id);
      if (favoriteItem) {
        if (favoriteItem.favoritable_type === 'App\\Models\\Property') {
          itemType = 'land';
        } else if (favoriteItem.favoritable_type === 'App\\Models\\Auction') {
          itemType = 'auction';
        }
      }
    }
    
    if (itemType === 'lands' || itemType === 'land') {
      navigate(`/lands/${id}/land`);
    } else {
      navigate(`/lands/${id}/auction`);
    }
  };

  // تصفية العناصر حسب النوع
  const filteredFavorites = favorites.filter(favorite => {
    if (activeTab === 'all') return true;
    if (activeTab === 'lands') return favorite.favoritable_type === 'App\\Models\\Property';
    if (activeTab === 'auctions') return favorite.favoritable_type === 'App\\Models\\Auction';
    return true;
  });

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
    if (!price) return '0';
    return parseFloat(price).toLocaleString('ar-SA');
  };

  // الحصول على أيقونة النوع
  const getTypeIcon = (type) => {
    if (type === 'App\\Models\\Property') {
      return <FaHome className="w-5 h-5 text-[#53a1dd]" />;
    } else if (type === 'App\\Models\\Auction') {
      return <FaGavel className="w-5 h-5 text-[#53a1dd]" />;
    }
    return <FaHeart className="w-5 h-5 text-[#53a1dd]" />;
  };

  // الحصول على نوع العنصر كنص
  const getItemType = (type) => {
    if (type === 'App\\Models\\Property') {
      return 'أرض';
    } else if (type === 'App\\Models\\Auction') {
      return 'مزاد';
    }
    return 'عنصر';
  };

  // الحصول على عنوان العنصر
  const getItemTitle = (favorite) => {
    if (favorite.favoritable_type === 'App\\Models\\Property') {
      return favorite.favoritable.title || `أرض ${favorite.favoritable.land_type || ''}`;
    } else if (favorite.favoritable_type === 'App\\Models\\Auction') {
      return favorite.favoritable.title || 'مزاد';
    }
    return 'عنصر';
  };

  // حساب السعر الإجمالي للأرض
  const calculateTotalPrice = (property) => {
    if (property.total_area && property.price_per_sqm) {
      return parseFloat(property.total_area) * parseFloat(property.price_per_sqm);
    }
    return 0;
  };

  // استخدام الـ Skeleton أثناء التحميل
  if (isLoading) {
    return <FavoritesSkeleton />;
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaExclamationTriangle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">حدث خطأ</h3>
            <p className="text-gray-600 mb-6">{error.message || 'فشل في جلب بيانات المفضلة'}</p>
            <button 
              onClick={() => queryClient.refetchQueries(['favorites'])}
              className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 mb-6">
          <div className="flex flex-col gap-4">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">المفضلة</h1>
              <p className="text-sm sm:text-base text-gray-600">
                العناصر التي قمت بإضافتها إلى المفضلة
              </p>
            </div>

            {/* Tabs - محسّن للموبايل */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setActiveTab('all')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md font-medium transition duration-200 ${
                  activeTab === 'all'
                    ? 'bg-[#53a1dd] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <FaHeart className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">الكل</span>
                {favorites.length > 0 && (
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                    activeTab === 'all' ? 'bg-white text-[#53a1dd]' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {favorites.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('lands')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md font-medium transition duration-200 ${
                  activeTab === 'lands'
                    ? 'bg-[#53a1dd] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <FaHome className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">الأراضي</span>
                {favorites.filter(fav => fav.favoritable_type === 'App\\Models\\Property').length > 0 && (
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                    activeTab === 'lands' ? 'bg-white text-[#53a1dd]' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {favorites.filter(fav => fav.favoritable_type === 'App\\Models\\Property').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('auctions')}
                className={`flex-1 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-md font-medium transition duration-200 ${
                  activeTab === 'auctions'
                    ? 'bg-[#53a1dd] text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900'
                }`}
              >
                <FaGavel className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm">المزادات</span>
                {favorites.filter(fav => fav.favoritable_type === 'App\\Models\\Auction').length > 0 && (
                  <span className={`px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold ${
                    activeTab === 'auctions' ? 'bg-white text-[#53a1dd]' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {favorites.filter(fav => fav.favoritable_type === 'App\\Models\\Auction').length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6">
          {/* Statistics */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
              <p className="text-blue-700 font-medium text-center text-sm sm:text-base">
                عرض {filteredFavorites.length} عنصر في المفضلة
              </p>
            </div>
          </div>

          {/* Favorites Grid */}
          {filteredFavorites.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {filteredFavorites.map((favorite) => (
                <div 
                  key={favorite.id} 
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => handleViewItem(favorite.favoritable_id)}
                >
                  
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          {getTypeIcon(favorite.favoritable_type)}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {getItemTitle(favorite)}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {getItemType(favorite.favoritable_type)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 px-3 py-1 rounded-full border bg-green-50 text-green-700 border-green-200">
                        <FaHeart className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium hidden sm:inline">في المفضلة</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <FaCalendarAlt className="w-3 h-3 sm:w-4 sm:h-4 text-[#53a1dd]" />
                      <span>تم الإضافة: {formatDate(favorite.created_at)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* الموقع */}
                      {(favorite.favoritable.region || favorite.favoritable.address) && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                            <FaMapMarkerAlt className="w-4 h-4 text-[#53a1dd]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">الموقع</p>
                            <p className="font-medium text-gray-900">
                              {favorite.favoritable.region || favorite.favoritable.address}
                              {favorite.favoritable.city ? ` - ${favorite.favoritable.city}` : ''}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* المساحة (لطلبات الأراضي فقط) */}
                      {favorite.favoritable_type === 'App\\Models\\Property' && favorite.favoritable.total_area && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                            <FaFileAlt className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">المساحة</p>
                            <p className="font-medium text-gray-900">
                              {formatPrice(favorite.favoritable.total_area)} م²
                            </p>
                          </div>
                        </div>
                      )}

                      {/* سعر المتر (لطلبات الأراضي فقط) */}
                      {favorite.favoritable_type === 'App\\Models\\Property' && favorite.favoritable.price_per_sqm && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                            <FaTag className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">سعر المتر</p>
                            <p className="font-medium text-gray-900">
                              {formatPrice(favorite.favoritable.price_per_sqm)} ر.س
                            </p>
                          </div>
                        </div>
                      )}

                      {/* السعر الإجمالي (لطلبات الأراضي فقط) */}
                      {favorite.favoritable_type === 'App\\Models\\Property' && 
                       favorite.favoritable.total_area && 
                       favorite.favoritable.price_per_sqm && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                            <FaTag className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">السعر الإجمالي</p>
                            <p className="font-medium text-gray-900">
                              {formatPrice(calculateTotalPrice(favorite.favoritable))} ر.س
                            </p>
                          </div>
                        </div>
                      )}

                      {/* تاريخ المزاد (للمزادات فقط) */}
                      {favorite.favoritable_type === 'App\\Models\\Auction' && favorite.favoritable.auction_date && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                            <FaCalendarAlt className="w-4 h-4 text-[#53a1dd]" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">تاريخ المزاد</p>
                            <p className="font-medium text-gray-900">
                              {formatDate(favorite.favoritable.auction_date)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* وقت البدء (للمزادات فقط) */}
                      {favorite.favoritable_type === 'App\\Models\\Auction' && favorite.favoritable.start_time && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-yellow-50 rounded flex items-center justify-center">
                            <FaClock className="w-4 h-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">وقت البدء</p>
                            <p className="font-medium text-gray-900">
                              {favorite.favoritable.start_time.substring(0, 5)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* الوصف */}
                      {favorite.favoritable.description && favorite.favoritable.description !== 'لا وصف' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">الوصف:</p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {favorite.favoritable.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewItem(favorite.favoritable_id);
                        }}
                        className="flex items-center gap-2 text-[#53a1dd] hover:text-[#4689c0] font-medium transition duration-200 text-sm sm:text-base"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>عرض التفاصيل</span>
                      </button>
                      
                      <button 
                        onClick={(e) => handleRemoveFavorite(favorite, e)}
                        disabled={removingId === favorite.id}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-200 disabled:opacity-50"
                        title="إزالة من المفضلة"
                      >
                        {removingId === favorite.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaHeart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد عناصر في المفضلة
              </h3>
              <p className="text-gray-600 mb-6">
                لم تقم بإضافة أي عناصر إلى المفضلة حتى الآن
              </p>
              <button 
                onClick={() => navigate('/lands-and-auctions-list')}
                className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                تصفح العناصر
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Favorites;