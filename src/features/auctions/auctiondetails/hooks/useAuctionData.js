import { useState, useEffect } from 'react';
import { getAuctionById } from '../../services/auctions.api';
import { useToast } from "../../../../components/common/ToastProvider"; // ✅ استيراد من جديد

const useAuctionData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showToast } = useToast();

  const fetchAuctionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAuctionById(id);
      
      if (result.success) {
        setData(result.data);
      } else {
        throw new Error('البيانات غير متوفرة');
      }
    } catch (err) {
      setError(err.message);
      showToast('error', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchAuctionData();
    }
  }, [id]);

  return {
    data,
    loading,
    error,
    refetch: fetchAuctionData,
  };
};

export default useAuctionData;