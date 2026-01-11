import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { landRequestService } from '../services/landRequestService';

/**
 * Custom hook to handle offer submission logic
 */
export const useOfferSubmission = (requestId) => {
  const [offerMessage, setOfferMessage] = useState('');
  const [offerLoading, setOfferLoading] = useState(false);
  const [showOfferForm, setShowOfferForm] = useState(false);
  const navigate = useNavigate();

  const handleShowOfferForm = (openLogin) => {
    const token = localStorage.getItem('token');

    if (!token) {
      openLogin(() => {
        setShowOfferForm(true);
      });
      return;
    }

    setShowOfferForm(true);
  };

  const handleCloseOfferForm = () => {
    setShowOfferForm(false);
  };

  const handleOfferSubmit = async (e) => {
    e.preventDefault();

    if (!offerMessage.trim()) {
      toast.warning('الرجاء كتابة تفاصيل العرض', {
        position: 'top-right',
        rtl: true,
      });
      return;
    }

    try {
      setOfferLoading(true);

      const token = localStorage.getItem('token');

      if (!token) {
        setOfferLoading(false);
        setShowOfferForm(false);
        navigate('/login');
        return;
      }

      await landRequestService.submitOffer(requestId, offerMessage);

      setShowOfferForm(false);
      setOfferMessage('');
      setOfferLoading(false);

      toast.success('تم تقديم العرض بنجاح!', {
        position: 'top-right',
        rtl: true,
        autoClose: 3000,
      });
    } catch (err) {
      console.error('❌ خطأ في تقديم العرض:', err);
      toast.error(err.message || 'حدث خطأ في تقديم العرض', {
        position: 'top-right',
        rtl: true,
        autoClose: 4000,
      });
      setOfferLoading(false);
      setShowOfferForm(false);
    }
  };

  return {
    offerMessage,
    setOfferMessage,
    offerLoading,
    showOfferForm,
    handleShowOfferForm,
    handleCloseOfferForm,
    handleOfferSubmit,
  };
};