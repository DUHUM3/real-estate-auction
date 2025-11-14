// Form data management utilities
export const formHelpers = {
  // Initialize form data
  initialFormData: {
    region: '',
    city: '',
    description: '',
    document_number: '',
    terms_accepted: false
  },

  // Handle form input changes
  handleInputChange: (formData, setFormData) => (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
      ...(name === 'region' && { city: '' }) // Reset city when region changes
    }));
  },

  // Handle image upload
  handleImageUpload: (images, setImages, setError) => (e) => {
    const files = Array.from(e.target.files);
    const newErrors = [];

    if (images.length + files.length > 5) {
      newErrors.push('يمكنك رفع最多 5 صور فقط');
    }

    const validFiles = files.filter(file => {
      const fileErrors = []; // You can import validationService here if needed
      return fileErrors.length === 0;
    });

    if (newErrors.length > 0) {
      setError(newErrors[0]);
      return;
    }

    setImages(prev => [...prev, ...validFiles]);
    e.target.value = '';
  },

  // Remove image
  removeImage: (images, setImages) => (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  },
};

// Success response handler
export const successHandler = {
  getSuccessContent: (responseData) => {
    if (!responseData?.auction_request) return null;

    const request = responseData.auction_request;
    return {
      title: "تم إنشاء طلب التسويق بنجاح!",
      message: responseData?.message || 'سيتم مراجعة طلبك من قبل الإدارة',
      summary: {
        id: request.id,
        region: request.region,
        city: request.city,
        document_number: request.document_number,
        status: request.status,
        status_ar: request.status_ar
      }
    };
  }
};