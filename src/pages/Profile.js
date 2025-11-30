// pages/Profile.js
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';

// استيراد الأيقونات مباشرة
import { FiUser, FiMail, FiPhone, FiEdit2, FiSave, FiX, FiHome, FiClock, FiCheckCircle, FiXCircle, FiDollarSign, FiBriefcase, FiFileText } from 'react-icons/fi';
import { MdBusiness, MdPerson, MdAssignment, MdBadge } from 'react-icons/md';

// استيراد API functions
import { 
  fetchProfileData, 
  fetchUserStats, 
  updateProfileData, 
  shouldShowStats 
} from '../api/profileApi';

import ProfileSkeleton from '../Skeleton/ProfileSkeleton';

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

  // React Query for stats
  const {
    data: statsData,
    isLoading: statsLoading,
    error: statsError
  } = useQuery({
    queryKey: ['userStats'],
    queryFn: fetchUserStats,
    enabled: !!apiData && shouldShowStats(apiData),
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
  React.useEffect(() => {
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
    } else {
      return userType || 'مستخدم';
    }
  };

  const getUserInitial = () => {
    const name = apiData?.user?.full_name || 'م';
    return name.charAt(0);
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

  const stats = statsData?.data;

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar Section - تم التعديل هنا */}
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
                  <span className="text-sm">{apiData?.user?.phone || 'لم يتم إضافة رقم الجوال'}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* <div className="flex gap-3">
              {!isEditing ? (
                <button 
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                >
                  <FiEdit2 className="w-4 h-4" />
                  <span>تعديل</span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={handleSubmit}
                    disabled={updateProfileMutation.isLoading}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
                  >
                    <FiSave className="w-4 h-4" />
                    <span>{updateProfileMutation.isLoading ? 'جاري الحفظ...' : 'حفظ'}</span>
                  </button>
                  <button 
                    onClick={handleCancel}
                    className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                  >
                    <FiX className="w-4 h-4" />
                    <span>إلغاء</span>
                  </button>
                </div>
              )}
            </div> */}
          </div>
        </div>

        {/* Statistics Section - تم التعديل هنا */}
        {shouldShowStats(apiData) && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
              <FiHome className="w-5 h-5 text-[#53a1dd]" />
              إحصائيات الاراضي
            </h3>
            
            {statsLoading ? (
              <div className="grid grid-cols-5 gap-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 rounded-lg h-16"></div>
                  </div>
                ))}
              </div>
            ) : statsError ? (
              <div className="text-center py-8 text-gray-500">
                <FiXCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
                <span>تعذر تحميل الإحصائيات</span>
              </div>
            ) : stats ? (
              <div className="grid grid-cols-5 gap-2">
                <div className="bg-blue-50 rounded-lg p-3 text-center">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <FiHome className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.total}</div>
                  <div className="text-xs text-gray-600">الإجمالي</div>
                </div>
                
                <div className="bg-yellow-50 rounded-lg p-3 text-center">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <FiClock className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.under_review}</div>
                  <div className="text-xs text-gray-600">قيد المراجعة</div>
                </div>
                
                <div className="bg-green-50 rounded-lg p-3 text-center">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <FiCheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.approved}</div>
                  <div className="text-xs text-gray-600">معتمدة</div>
                </div>
                
                <div className="bg-red-50 rounded-lg p-3 text-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <FiXCircle className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.rejected}</div>
                  <div className="text-xs text-gray-600">مرفوضة</div>
                </div>
                
                <div className="bg-purple-50 rounded-lg p-3 text-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-1">
                    <FiDollarSign className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="text-lg font-bold text-gray-900">{stats.sold}</div>
                  <div className="text-xs text-gray-600">تم بيعها</div>
                </div>
              </div>
            ) : null}
          </div>
        )}

        {/* Personal Information */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900 mb-4">
            <FiUser className="w-5 h-5 text-[#53a1dd]" />
            المعلومات الشخصية
          </h3>
          
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiUser className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">الاسم الثلاثي</span>
              </div>
              {isEditing ? (
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                  className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                  placeholder="أدخل اسمك الثلاثي"
                />
              ) : (
                <span className="text-gray-900">{apiData?.user?.full_name || 'غير محدد'}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiMail className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">البريد الإلكتروني</span>
              </div>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ''}
                  onChange={handleChange}
                  className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              ) : (
                <span className="text-gray-900">{apiData?.user?.email || 'غير محدد'}</span>
              )}
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiPhone className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-700">رقم الجوال</span>
              </div>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                  className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                  placeholder="أدخل رقم جوالك"
                />
              ) : (
                <span className="text-gray-900">{apiData?.user?.phone || 'غير محدد'}</span>
              )}
            </div>

            {isEditing && (
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <MdAssignment className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700">نوع الحساب</span>
                </div>
                <select 
                  name="user_type"
                  value={formData.user_type || 'individual'}
                  onChange={handleChange}
                  className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#53a1dd] focus:border-[#53a1dd]"
                >
                  <option value="individual">فرد</option>
                  <option value="company">شركة</option>
                  <option value="جهة تجارية">جهة تجارية</option>
                </select>
              </div>
            )}
          </div>
        </div>

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