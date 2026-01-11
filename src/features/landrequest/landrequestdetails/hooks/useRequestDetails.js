import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { landRequestService } from '../services/landRequestService';

/**
 * Custom hook to fetch and manage land request details
 */
export const useRequestDetails = (requestId) => {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        const data = await landRequestService.getRequestDetails(requestId);
        setRequest(data);
        setLoading(false);
      } catch (err) {
        console.error('❌ خطأ في تحميل التفاصيل:', err);

        if (err.response?.status === 404) {
          toast.error('لم يتم العثور على الطلب', {
            position: 'top-right',
            rtl: true,
          });
          setError('لم يتم العثور على الطلب');
        } else {
          toast.error('حدث خطأ أثناء تحميل تفاصيل الطلب', {
            position: 'top-right',
            rtl: true,
          });
          setError('حدث خطأ أثناء تحميل تفاصيل الطلب');
        }
        setLoading(false);
      }
    };

    fetchDetails();
  }, [requestId]);

  return { request, loading, error };
};