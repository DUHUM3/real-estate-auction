// pages/Profile.js
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

// استيراد الأيقونات مباشرة
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiEdit2, 
  FiSave, 
  FiX, 
  FiHome, 
  FiClock, 
  FiCheckCircle, 
  FiXCircle, 
  FiDollarSign, 
  FiBriefcase, 
  FiFileText,
  FiTrendingUp,
  FiPackage,
  FiShoppingBag,
  FiAlertCircle,
  FiPercent
} from 'react-icons/fi';
import { MdBusiness, MdPerson, MdAssignment, MdBadge, MdGavel } from 'react-icons/md';

// استيراد API functions
import { 
  fetchProfileData, 
  fetchUserStats, 
  fetchAuctionStats,
  updateProfileData, 
  shouldShowStats 
} from '../api/profileApi';

import ProfileSkeleton from '../Skeleton/ProfileSkeleton';

// تعريف الدوال المساعدة في الأعلى - FIX
const shouldShowLandStats = (userType) => {
  if (!userType) return false;
  
  const cleanUserType = userType.trim();
  const allowedTypes = [
    'مالك أرض',
    'مالك ارض',
    'وكيل شرعي',
    'وسيط عقاري',
    'جهة تجارية',
  ];
  
  return allowedTypes.includes(cleanUserType);
};

// تعريف الدوال المساعدة في الأعلى - FIX
const shouldShowAuctionStats = (userType) => {
  if (!userType) return false;
  
  const cleanUserType = userType.trim();
  return cleanUserType === 'شركة مزادات';
};

function Profile() {
  const { updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const queryClient = useQueryClient();

  // React Query for profile data
  const {
    data: apiData,
    isLoading: profileLoading,
    error: profileError,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfileData,
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  // Get user type from API data
  const userType = apiData?.user?.user_type;

  // React Query for land stats (for land owners, brokers, etc.)
  const {
    data: landStatsData,
    isLoading: landStatsLoading,
    error: landStatsError
  } = useQuery({
    queryKey: ['landStats'],
    queryFn: fetchUserStats,
    enabled: !!userType && shouldShowLandStats(userType), // الآن الدالة معرفة
    retry: 2,
  });

  // React Query for auction stats (for auction companies)
  const {
    data: auctionStatsData,
    isLoading: auctionStatsLoading,
    error: auctionStatsError
  } = useQuery({
    queryKey: ['auctionStats'],
    queryFn: fetchAuctionStats,
    enabled: !!userType && shouldShowAuctionStats(userType), // الآن الدالة معرفة
    retry: 2,
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: updateProfileData,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['profile']);
      updateUser(formData);
      setIsEditing(false);
    },
    onError: (error) => {
      console.error('Error updating profile:', error);
    }
  });

  // Initialize form data when apiData is available
  useEffect(() => {
    if (apiData && !isEditing) {
      const initialFormData = {
        full_name: apiData.user.full_name || '',
        email: apiData.user.email || '',
        phone: apiData.user.phone || '',
        user_type: apiData.user.user_type || 'individual',
      };

      if (apiData.user.details) {
        initialFormData.business_name = apiData.user.details.business_name || '';
        initialFormData.commercial_register = apiData.user.details.commercial_register || '';
        initialFormData.national_id = apiData.user.details.national_id || '';
      }

      setFormData(initialFormData);
    }
  }, [apiData, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const submitData = {
      full_name: formData.full_name,
      email: formData.email,
      phone: formData.phone,
      user_type: formData.user_type
    };

    if (formData.business_name || formData.commercial_register || formData.national_id) {
      submitData.details = {
        business_name: formData.business_name,
        commercial_register: formData.commercial_register,
        national_id: formData.national_id
      };
    }

    updateProfileMutation.mutate(submitData);
  };

  const handleCancel = () => {
    if (apiData) {
      const resetFormData = {
        full_name: apiData.user.full_name || '',
        email: apiData.user.email || '',
        phone: apiData.user.phone || '',
        user_type: apiData.user.user_type || 'individual',
      };

      if (apiData.user.details) {
        resetFormData.business_name = apiData.user.details.business_name || '';
        resetFormData.commercial_register = apiData.user.details.commercial_register || '';
        resetFormData.national_id = apiData.user.details.national_id || '';
      }

      setFormData(resetFormData);
    }
    setIsEditing(false);
  };

  const hasDetails = () => {
    return apiData?.user?.details !== null && apiData?.user?.details !== undefined;
  };

  const isCommercialEntity = () => {
    return apiData?.user?.user_type === 'جهة تجارية' || formData.user_type === 'company' || formData.user_type === 'جهة تجارية';
  };

  const renderUserTypeText = () => {
    const userType = apiData?.user?.user_type;
    
    if (userType === 'individual') {
      return 'فرد';
    } else if (userType === 'company') {
      return 'شركة';
    } else if (userType === 'جهة تجارية') {
      return 'جهة تجارية';
    } else if (userType === 'شركة مزادات') {
      return 'شركة مزادات';
    } else {
      return userType || 'مستخدم';
    }
  };

  const getUserInitial = () => {
    const name = apiData?.user?.full_name || 'م';
    return name.charAt(0);
  };

  // Format numbers with Arabic locale
  const formatNumber = (num) => {
    return num?.toLocaleString('ar-SA') || '0';
  };

  // Parse land stats data
  const parseLandStats = () => {
    const stats = landStatsData?.data;
    if (!stats) return null;

    return {
      total: stats.total || 0,
      under_review: stats.under_review || 0,
      approved: stats.approved || 0,
      rejected: stats.rejected || 0,
      sold: stats.sold || 0,
    };
  };

  // Parse auction stats data
  const parseAuctionStats = () => {
    const stats = auctionStatsData?.data;
    if (!stats) return null;

   return {
  total: stats.total || 0,
  approved: stats.approved || 0,       // بدل stats.open
  under_review: stats.under_review || 0, // جديد
  rejected: stats.rejected || 0,       // بدل stats.suspended
};
  };

  // Show skeleton while loading
  if (profileLoading) {
    return <ProfileSkeleton />;
  }

  // Show error state
  if (profileError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 pt-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <FiXCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ في جلب البيانات</h2>
          <p className="text-gray-600 mb-6">تعذر تحميل بيانات الملف الشخصي</p>
          <button 
            onClick={() => refetchProfile()}
            className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
          >
            إعادة المحاولة
          </button>
        </div>
      </div>
    );
  }

  const landStats = parseLandStats();
  const auctionStats = parseAuctionStats();

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section */}
            <div className="relative">
              <div className="w-20 h-20 bg-[#53a1dd] rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">{getUserInitial()}</span>
              </div>
              <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-white ${
                apiData?.user?.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
              }`} />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {apiData?.user?.full_name || 'المستخدم'}
              </h1>
              <div className="flex flex-wrap gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <MdPerson className="w-4 h-4" />
                  <span className="text-sm">{renderUserTypeText()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiMail className="w-4 h-4" />
                  <span className="text-sm">{apiData?.user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiPhone className="w-4 h-4" />
                  <span className="text-sm">{apiData?.user?.phone || 'تمت إضافة رقم الهاتف ✅'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Land Statistics Section */}
        {shouldShowLandStats(userType) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FiHome className="w-5 h-5 text-[#53a1dd]" />
              إحصائيات الأراضي
            </h3>
            
            {landStatsLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-24"></div>
                  </div>
                ))}
              </div>
            ) : landStatsError ? (
              <div className="text-center py-8 text-gray-500">
                <FiXCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                <span>تعذر تحميل إحصائيات الأراضي</span>
              </div>
            ) : landStats ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                <div className="bg-blue-50 rounded-lg p-4 text-center border border-blue-100">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiHome className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(landStats.total)}</div>
                  <div className="text-xs text-gray-600">الإجمالي</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-4 text-center border border-yellow-100">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiClock className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(landStats.under_review)}</div>
                  <div className="text-xs text-gray-600">قيد المراجعة</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4 text-center border border-green-100">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiCheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(landStats.approved)}</div>
                  <div className="text-xs text-gray-600">مقبولة</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-4 text-center border border-red-100">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiXCircle className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(landStats.rejected)}</div>
                  <div className="text-xs text-gray-600">مرفوضة</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-4 text-center border border-purple-100">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <FiDollarSign className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="text-xl font-bold text-gray-900">{formatNumber(landStats.sold)}</div>
                  <div className="text-xs text-gray-600">تم بيعها</div>
                </div>
              </div>
            ) : null}
          </div>
        )}

      {/* Auction Statistics Section */}
{shouldShowAuctionStats(userType) && (
  <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
    <h3 className="flex items-center gap-2 text-xl font-semibold text-gray-900 mb-6">
      <MdGavel className="w-6 h-6 text-[#53a1dd]" />
      إحصائيات المزادات
    </h3>

    {auctionStatsLoading ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse h-32 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    ) : auctionStatsError ? (
      <div className="text-center py-8 text-gray-500">
        <FiXCircle className="w-14 h-14 mx-auto mb-3 text-red-400" />
        <span className="text-lg">تعذر تحميل إحصائيات المزادات</span>
      </div>
    ) : auctionStats ? (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[
          { label: "إجمالي المزادات", value: auctionStats.total, bg: "blue", icon: <MdGavel className="w-6 h-6 text-blue-600" /> },
          { label: "مفتوحة", value: auctionStats.approved, bg: "green", icon: <FiCheckCircle className="w-6 h-6 text-green-600" /> },
          { label: "مرفوضة", value: auctionStats.rejected, bg: "red", icon: <FiPackage className="w-6 h-6 text-red-600" /> },
          { label: "قيد المراجعة", value: auctionStats.under_review, bg: "amber", icon: <FiAlertCircle className="w-6 h-6 text-amber-600" /> },
        ].map((stat, i) => (
          <div
            key={i}
            className={`bg-${stat.bg}-50 rounded-xl border border-${stat.bg}-100 p-5 flex flex-col items-center justify-center hover:shadow-lg transition-shadow`}
          >
            <div className={`w-16 h-16 bg-${stat.bg}-100 rounded-full flex items-center justify-center mb-3`}>
              {stat.icon}
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{formatNumber(stat.value)}</div>
            <div className="text-sm text-gray-600">{stat.label}</div>
          </div>
        ))}
      </div>
    ) : null}
  </div>
)}


        {/* Business Information */}
        {(hasDetails() || (isEditing && isCommercialEntity())) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <MdBusiness className="w-5 h-5 text-[#53a1dd]" />
              معلومات المنشأة
            </h3>
            
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiBriefcase className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">اسم المنشأة</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="business_name"
                    value={formData.business_name || ''}
                    onChange={handleChange}
                    className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                    placeholder="أدخل اسم المنشأة"
                  />
                ) : (
                  <span className="text-gray-900">
                    {apiData?.user?.details?.business_name || 'غير محدد'}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <FiFileText className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">السجل التجاري</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="commercial_register"
                    value={formData.commercial_register || ''}
                    onChange={handleChange}
                    className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                    placeholder="أدخل رقم السجل التجاري"
                  />
                ) : (
                  <span className="text-gray-900">
                    {apiData?.user?.details?.commercial_register || 'غير محدد'}
                  </span>
                )}
              </div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MdBadge className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">رقم الهوية الوطنية</span>
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="national_id"
                    value={formData.national_id || ''}
                    onChange={handleChange}
                    className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                    placeholder="أدخل رقم الهوية الوطنية"
                  />
                ) : (
                  <span className="text-gray-900">
                    {apiData?.user?.details?.national_id || 'غير محدد'}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Documents Section */}
        {hasDetails() && apiData?.user?.details?.commercial_file && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FiFileText className="w-5 h-5 text-[#53a1dd]" />
              الوثائق والمستندات
            </h3>
            
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiFileText className="w-5 h-5 text-gray-500" />
                  <span className="font-medium text-gray-700">السجل التجاري</span>
                </div>
                <button
                  onClick={() => window.open(apiData.user.details.commercial_file, '_blank')}
                  className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  <FiFileText className="w-4 h-4" />
                  <span>عرض المستند</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;