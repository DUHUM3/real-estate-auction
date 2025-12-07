import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { 
  fetchLandRequests, 
  fetchAuctionRequests, 
  deleteLandRequest,
  deleteAuctionRequest,
  parseRequestsData 
} from '../api/requestsApi';
import MyRequestsSkeleton from '../Skeleton/MyRequestsSkeleton';

// استيراد الأيقونات
import { 
  FaPlus,
  FaHome,
  FaGavel,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaTag,
  FaFileAlt,
  FaTrash,
  FaExclamationTriangle,
  FaClock,
  FaCheckCircle,
  FaTimesCircle
} from 'react-icons/fa';

function MyRequests() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [activeTab, setActiveTab] = useState('lands');

  // React Query لجلب طلبات الأراضي
  const { 
    data: landRequestsData, 
    isLoading: landsLoading,
    error: landsError 
  } = useQuery({
    queryKey: ['landRequests'],
    queryFn: fetchLandRequests,
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });

  // React Query لجلب طلبات المزادات
  const { 
    data: auctionRequestsData, 
    isLoading: auctionsLoading,
    error: auctionsError 
  } = useQuery({
    queryKey: ['auctionRequests'],
    queryFn: fetchAuctionRequests,
    retry: 2,
    staleTime: 2 * 60 * 1000,
  });

  // طفرات الحذف
  const deleteLandMutation = useMutation({
    mutationFn: deleteLandRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['landRequests']);
    },
    onError: (error) => {
      console.error('Error deleting land request:', error);
      alert('حدث خطأ أثناء حذف طلب الأرض');
    }
  });

  const deleteAuctionMutation = useMutation({
    mutationFn: deleteAuctionRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(['auctionRequests']);
    },
    onError: (error) => {
      console.error('Error deleting auction request:', error);
      alert('حدث خطأ أثناء حذف طلب المزاد');
    }
  });

  // معالجة البيانات
  const landRequests = landRequestsData ? parseRequestsData(landRequestsData, 'lands') : [];
  const auctionRequests = auctionRequestsData ? parseRequestsData(auctionRequestsData, 'auctions') : [];

  const isLoading = landsLoading || auctionsLoading;
  const error = landsError || auctionsError;

  // معالجة الحذف
  const handleDeleteRequest = async (requestId, type) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الطلب؟')) return;
    
    if (type === 'land') {
      deleteLandMutation.mutate(requestId);
    } else {
      deleteAuctionMutation.mutate(requestId);
    }
  };

  // الانتقال إلى إنشاء طلب جديد
  const navigateToCreateRequest = () => {
    navigate(activeTab === 'lands' ? '/add-land-request' : '/add-auction-request');
  };

  const currentRequests = activeTab === 'lands' ? landRequests : auctionRequests;

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

  // الحصول على أيقونة الحالة
  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
      case 'under_review':
      case 'pending':
        return <FaClock className="w-4 h-4 text-yellow-500" />;
      case 'approved':
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case 'rejected':
        return <FaTimesCircle className="w-4 h-4 text-red-500" />;
      default:
        return <FaClock className="w-4 h-4 text-gray-500" />;
    }
  };

  // الحصول على نص الحالة
  const getStatusText = (status, statusAr = '') => {
    if (statusAr) return statusAr;
    
    const statusMap = {
      'open': 'مفتوح',
      'under_review': 'قيد المراجعة',
      'approved': 'مقبول',
      'rejected': 'مرفوض',
      'pending': 'قيد الانتظار'
    };
    return statusMap[status] || status;
  };

  // الحصول على كلاس الحالة
  const getStatusClass = (status) => {
    const statusConfig = {
      'open': 'bg-blue-50 text-blue-700 border-blue-200',
      'under_review': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'pending': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'approved': 'bg-green-50 text-green-700 border-green-200',
      'rejected': 'bg-red-50 text-red-700 border-red-200'
    };
    return statusConfig[status] || 'bg-gray-50 text-gray-700 border-gray-200';
  };

  // الحصول على نوع الأرض
  const getLandType = (type) => {
    const types = {
      'residential': 'سكني',
      'commercial': 'تجاري',
      'agricultural': 'زراعي',
      'industrial': 'صناعي'
    };
    return types[type] || type;
  };

  // الحصول على الغرض
  const getPurpose = (purpose) => {
    const purposes = {
      'sale': 'بيع',
      'rent': 'إيجار',
      'investment': 'استثمار'
    };
    return purposes[purpose] || purpose;
  };

  // استخدام الـ Skeleton أثناء التحميل
  if (isLoading) {
    return <MyRequestsSkeleton />;
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
            <p className="text-gray-600 mb-6">{error.message || 'فشل في جلب الطلبات'}</p>
            <button 
              onClick={() => window.location.reload()}
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
              <h1 className="text-2xl font-bold text-gray-900 mb-2">طلباتي</h1>
              <p className="text-gray-600">
                إدارة طلبات الأراضي والمزادات المقدمة منك ومتابعة حالتها
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Tabs */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('lands')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition duration-200 ${
                    activeTab === 'lands'
                      ? 'bg-[#53a1dd] text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <FaHome className="w-4 h-4" />
                  <span>طلبات الأراضي</span>
                  {landRequests.length > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === 'lands' ? 'bg-white text-[#53a1dd]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {landRequests.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab('auctions')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition duration-200 ${
                    activeTab === 'auctions'
                      ? 'bg-[#53a1dd] text-white shadow-sm'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  <FaGavel className="w-4 h-4" />
                  <span>طلبات التسويق</span>
                  {auctionRequests.length > 0 && (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      activeTab === 'auctions' ? 'bg-white text-[#53a1dd]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {auctionRequests.length}
                    </span>
                  )}
                </button>
              </div>

              {/* Add Button */}
              {/* <button 
                onClick={navigateToCreateRequest}
                className="flex items-center gap-2 bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-4 rounded-lg transition duration-200"
              >
                <FaPlus className="w-4 h-4" />
                <span>{activeTab === 'lands' ? 'طلب أرض جديد' : 'طلب مزاد جديد'}</span>
              </button> */}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          {/* Statistics */}
          <div className="mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-700 font-medium text-center">
                عرض {currentRequests.length} {activeTab === 'lands' ? 'طلب أرض' : 'طلب تسويق'}
              </p>
            </div>
          </div>

          {/* Requests Grid */}
          {currentRequests.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {currentRequests.map((request) => (
                <div key={request.id} className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition duration-200">
                  
                  {/* Header */}
                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        {request.type === 'land' ? (
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FaHome className="w-5 h-5 text-[#53a1dd]" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <FaGavel className="w-5 h-5 text-[#53a1dd]" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {request.type === 'land' ? 'طلب أرض' : 'طلب مزاد'}
                          </h3>
                          <p className="text-sm text-gray-500">#{request.id}</p>
                        </div>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusClass(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="text-sm font-medium">
                          {getStatusText(request.status, request.status_ar)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FaCalendarAlt className="w-4 h-4 text-[#53a1dd]" />
                      <span>تم الإنشاء: {formatDate(request.created_at)}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <div className="space-y-3">
                      {/* الموقع */}
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                          <FaMapMarkerAlt className="w-4 h-4 text-[#53a1dd]" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">الموقع</p>
                          <p className="font-medium text-gray-900">
                            {request.region} {request.city ? `- ${request.city}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* نوع الأرض (لطلبات الأراضي فقط) */}
                      {request.type === 'land' && request.land_type && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                            <FaTag className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">نوع الأرض</p>
                            <p className="font-medium text-gray-900">
                              {getLandType(request.land_type)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* الغرض (لطلبات الأراضي فقط) */}
                      {request.type === 'land' && request.purpose && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-purple-50 rounded flex items-center justify-center">
                            <FaTag className="w-4 h-4 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">الغرض</p>
                            <p className="font-medium text-gray-900">
                              {getPurpose(request.purpose)}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* المساحة (لطلبات الأراضي فقط) */}
                      {request.type === 'land' && request.area && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-orange-50 rounded flex items-center justify-center">
                            <FaFileAlt className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">المساحة</p>
                            <p className="font-medium text-gray-900">
                              {parseFloat(request.area).toLocaleString('ar-SA')} م²
                            </p>
                          </div>
                        </div>
                      )}

                      {/* رقم المستند */}
                      {request.document_number && (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gray-50 rounded flex items-center justify-center">
                            <FaFileAlt className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">رقم المستند</p>
                            <p className="font-medium text-gray-900">
                              {request.document_number}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* الوصف */}
                      {request.description && request.description !== 'لا وصف' && (
                        <div className="bg-gray-50 rounded-lg p-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">الوصف:</p>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {request.description}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        آخر تحديث: {formatDate(request.created_at)}
                      </div>
                      {/* <button 
                        onClick={() => handleDeleteRequest(request.id, request.type)}
                        disabled={deleteLandMutation.isLoading || deleteAuctionMutation.isLoading}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition duration-200 disabled:opacity-50"
                        title="حذف الطلب"
                      >
                        <FaTrash className="w-4 h-4" />
                      </button> */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaFileAlt className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'lands' ? 'لا توجد طلبات أراضي' : 'لا توجد طلبات تسويق'}
              </h3>
              <p className="text-gray-600 mb-6">
                {activeTab === 'lands' 
                  ? 'لم تقم بتقديم أي طلبات أراضي حتى الآن' 
                  : 'لم تقم بتقديم أي طلبات تسويق حتى الآن'
                }
              </p>
              {/* <button 
                onClick={navigateToCreateRequest}
                className="bg-[#53a1dd] hover:bg-[#4689c0] text-white font-medium py-2 px-6 rounded-lg transition duration-200"
              >
                {activeTab === 'lands' ? 'تقديم طلب أرض جديد' : 'تقديم طلب مزاد جديد'}
              </button> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyRequests;