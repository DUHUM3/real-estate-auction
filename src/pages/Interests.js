import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { 
  fetchInterests,
  parseInterestsData 
} from '../api/interestsApi';
import InterestsSkeleton from '../Skeleton/InterestsSkeleton';

// استيراد الأيقونات
import { 
  FaHeart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileAlt,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUser,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

function Interests() {
  const navigate = useNavigate();

  // React Query لجلب الاهتمامات
  const { 
    data: interestsData = [], 
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['interests'],
    queryFn: fetchInterests,
    retry: 2,
    staleTime: 2 * 60 * 1000, // 2 دقائق
  });

  // معالجة البيانات
  const interests = parseInterestsData(interestsData);

  // دالة للانتقال إلى صفحة تفاصيل الأرض
  const handleViewProperty = (propertyId) => {
    navigate(`/lands/${propertyId}/land`);
  };

  // دالة للحصول على لون الحالة
  const getStatusClass = (status) => {
    switch (status) {
      case 'قيد المراجعة':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      case 'مقبول':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'مرفوض':
        return 'bg-red-50 text-red-700 border-red-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  // دالة للحصول على أيقونة الحالة
  const getStatusIcon = (status) => {
    switch (status) {
      case 'قيد المراجعة':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'مقبول':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'مرفوض':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
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

  // استخدام الـ Skeleton أثناء التحميل
  if (isLoading) {
    return <InterestsSkeleton />;
  }

  // عرض الخطأ
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaTimesCircle className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">حدث خطأ</h3>
            <p className="text-gray-600 mb-6">{error.message || 'فشل في جلب بيانات الاهتمامات'}</p>
            <button 
              onClick={() => refetch()}
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
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">اهتماماتي</h1>
              <p className="text-gray-600">
                عقارات قمت بالتعبير عن اهتمامك بها
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/lands-and-auctions-list"
                className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                <FaEye className="w-4 h-4" />
                <span>تصفح الأراضي</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Statistics */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-700 font-medium text-center">
                عرض {interests.length} اهتمام
              </p>
            </div>
          </div>

          {/* Interests Grid */}
          {interests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {interests.map((interest) => (
                <div 
                  key={interest.id} 
                  className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-200 cursor-pointer"
                  onClick={() => handleViewProperty(interest.property_id)}
                >
                  
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                          <FaHeart className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            الأرض رقم #{interest.property_id}
                          </h3>
                          <p className="text-sm text-gray-500">رقم الطلب: {interest.id}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusClass(interest.status)}`}>
                        {getStatusIcon(interest.status)}
                        <span className="text-sm font-medium">
                          {interest.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 text-[#53a1dd]" />
                      <span>تاريخ التقديم: {formatDate(interest.created_at)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* الرسالة */}
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center mt-1">
                          <FaFileAlt className="w-4 h-4 text-[#53a1dd]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-600 mb-1">الرسالة</p>
                          <p className="text-gray-900 text-sm leading-relaxed">
                            {interest.message || 'لا توجد رسالة'}
                          </p>
                        </div>
                      </div>

                      {/* المعلومات الشخصية */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                            <FaUser className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">الاسم</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {interest.full_name}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                            <FaPhone className="w-4 h-4 text-purple-600" />
                          </div>
                          {/* <div>
                            <p className="text-sm text-gray-600">الهاتف</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {interest.phone}
                            </p>
                          </div> */}
                        </div>

                        <div className="flex items-center gap-3">
                          {/* <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                            <FaEnvelope className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">البريد الإلكتروني</p>
                            <p className="font-medium text-gray-900 text-sm">
                              {interest.email}
                            </p>
                          </div> */}
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaMapMarkerAlt className="w-4 h-4" />
                        <span>انقر لعرض الأرض</span>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewProperty(interest.property_id);
                        }}
                        className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                      >
                        <FaEye className="w-4 h-4" />
                        <span>عرض الأرض</span>
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
              <h3 className="text-lg font-semibold text-gray-900 mb-2">لا توجد اهتمامات</h3>
              <p className="text-gray-600 mb-6">
                لم تقم بالتعبير عن اهتمامك بأي عقار حتى الآن
              </p>
              <Link 
                to="/lands-and-auctions-list"
                className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200 inline-block"
              >
                تصفح الأراضي
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Interests;