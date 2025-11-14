import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { marketingApi, validationService } from '../../api/auctionRequestApi';
import { formHelpers, successHandler } from '../../utils/formHelpers';
import {locationService} from '../../utils/LocationForFiltters'
function MarketingRequest() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(formHelpers.initialFormData);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const fileInputRef = useRef(null);
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState({});
  const [availableCities, setAvailableCities] = useState([]);

  // Initialize regions and cities
  useEffect(() => {
    setRegions(locationService.getRegions());
    setCities(locationService.getCitiesByRegion());
  }, []);

  // Update available cities when region changes
  useEffect(() => {
    if (formData.region && cities[formData.region]) {
      setAvailableCities(cities[formData.region]);
    } else {
      setAvailableCities([]);
    }
  }, [formData.region, cities]);

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form
    const formErrors = validationService.validateForm(formData, images);
    if (formErrors.length > 0) {
      setError(formErrors[0]);
      return;
    }

    // Check authentication
    const token = localStorage.getItem('token');
    if (!token) {
      setError('يجب تسجيل الدخول أولاً');
      navigate('/login');
      return;
    }

    try {
      setLoading(true);

      // Prepare form data for submission
      const submitData = new FormData();
      submitData.append('region', formData.region);
      submitData.append('city', formData.city);
      submitData.append('description', formData.description);
      submitData.append('document_number', formData.document_number);
      submitData.append('terms_accepted', 'true');

      images.forEach((image) => {
        submitData.append('images[]', image);
      });

      // Submit to API
      const response = await marketingApi.submitMarketingRequest(submitData);
      
      console.log('✅ تم إنشاء طلب التسويق:', response);
      setResponseData(response);
      setSuccess(true);
      
    } catch (err) {
      console.error('❌ خطأ في إنشاء طلب التسويق:', err);
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };

  // API error handler
  const handleApiError = (err) => {
    if (err.response) {
      if (err.response.status === 401) {
        setError('انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (err.response.status === 422) {
        setError('بيانات غير صالحة: ' + (err.response.data.message || 'يرجى التحقق من البيانات المدخلة'));
      } else {
        setError(err.response.data.message || 'حدث خطأ في الخادم');
      }
    } else if (err.request) {
      setError('تعذر الاتصال بالخادم، يرجى التحقق من الاتصال بالإنترنت');
    } else {
      setError('حدث خطأ غير متوقع');
    }
  };

  // Reset form for new submission
  const resetForm = () => {
    setSuccess(false);
    setFormData(formHelpers.initialFormData);
    setImages([]);
    setError(null);
  };

  // Loading component
  if (loading) {
    return (
      <div className="elegantLoading_container">
        <div className="elegantLoader"></div>
        <p className="elegantLoading_text">جاري إنشاء طلب التسويق...</p>
      </div>
    );
  }

  // Success content
  const successContent = successHandler.getSuccessContent(responseData);

  return (
    <div className="elegantCreate_container">
      <header className="elegantCreate_header">
        <button onClick={() => navigate(-1)} className="elegantBack_btn">
          العودة
        </button>
        
        <div className="elegantHeader_title">
          <span>طلب تسويق أرض</span>
        </div>
      </header>

      <main className="elegantCreate_content">
        <div className="elegantCreate_card">
          <div className="elegantCard_title">
            <span className="elegantCard_icon"></span>
            <h2>إنشاء طلب تسويق جديد</h2>
          </div>

          {success ? (
            <SuccessView 
              successContent={successContent} 
              onNavigateHome={() => navigate('/land-requests')}
              onCreateNew={resetForm}
            />
          ) : (
            <FormView
              formData={formData}
              images={images}
              error={error}
              regions={regions}
              availableCities={availableCities}
              fileInputRef={fileInputRef}
              onChange={formHelpers.handleInputChange(formData, setFormData)}
              onImageUpload={formHelpers.handleImageUpload(images, setImages, setError)}
              onRemoveImage={formHelpers.removeImage(images, setImages)}
              onSubmit={handleSubmit}
              onCancel={() => navigate('/land-requests')}
              loading={loading}
            />
          )}
        </div>
      </main>
    </div>
  );
}

// Success View Component
const SuccessView = ({ successContent, onNavigateHome, onCreateNew }) => (
  <div className="elegantSuccess_message">
    <div className="elegantSuccess_icon"></div>
    <div className="elegantSuccess_content">
      <h3 className="elegantSuccess_title">{successContent?.title}</h3>
      <p className="elegantSuccess_text">{successContent?.message}</p>
      
      {successContent?.summary && (
        <div className="elegantRequest_summary">
          <h4>تفاصيل الطلب:</h4>
          <div className="elegantSummary_grid">
            <div className="elegantSummary_item">
              <strong>رقم الطلب:</strong>
              <span>#{successContent.summary.id}</span>
            </div>
            <div className="elegantSummary_item">
              <strong>المنطقة:</strong>
              <span>{successContent.summary.region}</span>
            </div>
            <div className="elegantSummary_item">
              <strong>المدينة:</strong>
              <span>{successContent.summary.city}</span>
            </div>
            <div className="elegantSummary_item">
              <strong>رقم الوثيقة:</strong>
              <span>{successContent.summary.document_number}</span>
            </div>
            <div className="elegantSummary_item">
              <strong>الحالة:</strong>
              <span className={`elegantStatus_badge ${successContent.summary.status === 'under_review' ? 'elegantStatus_review' : ''}`}>
                {successContent.summary.status_ar}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
    <div className="elegantSuccess_actions">
      <button onClick={onNavigateHome} className="elegantCancel_btn">
        العودة للقائمة الرئيسية
      </button>
      <button onClick={onCreateNew} className="elegantSubmit_btn">
        إنشاء طلب جديد
      </button>
    </div>
  </div>
);

// Form View Component
const FormView = ({
  formData,
  images,
  error,
  regions,
  availableCities,
  fileInputRef,
  onChange,
  onImageUpload,
  onRemoveImage,
  onSubmit,
  onCancel,
  loading
}) => (
  <form onSubmit={onSubmit} className="elegantCreate_form">
    <div className="elegantForm_rows">
      <div className="elegantForm_row">
        <FormSelect
          id="region"
          name="region"
          label="المنطقة:"
          value={formData.region}
          onChange={onChange}
          options={regions}
          placeholder="اختر المنطقة"
          required
        />
        
        <FormSelect
          id="city"
          name="city"
          label="المدينة:"
          value={formData.city}
          onChange={onChange}
          options={availableCities}
          placeholder="اختر المدينة"
          disabled={!formData.region}
          required
        />

        <FormInput
          id="document_number"
          name="document_number"
          type="text"
          label="رقم الوثيقة:"
          value={formData.document_number}
          onChange={onChange}
          placeholder="أدخل رقم وثيقة الأرض"
          required
        />
      </div>

      <div className="elegantForm_row">
        <FormTextarea
          id="description"
          name="description"
          label="الوصف:"
          value={formData.description}
          onChange={onChange}
          placeholder="أدخل وصف مفصل للأرض... (الموقع، المساحة، الخدمات المتاحة، إلخ)"
          rows="5"
          required
        />
      </div>

      <div className="elegantForm_row">
        <ImageUploadSection
          images={images}
          fileInputRef={fileInputRef}
          onImageUpload={onImageUpload}
          onRemoveImage={onRemoveImage}
        />
      </div>
    </div>

    {error && (
      <div className="elegantError_message">
        <span className="elegantError_icon">⚠️</span>
        {error}
      </div>
    )}

    <div className="elegantForm_actions">
      <button type="submit" className="elegantSubmit_btn" disabled={loading}>
        {loading ? 'جاري الإرسال...' : 'إنشاء طلب التسويق'}
      </button>
      <button type="button" className="elegantCancel_btn" onClick={onCancel}>
        إلغاء
      </button>
    </div>
  </form>
);

// Reusable Form Components
const FormSelect = ({ id, name, label, value, onChange, options, placeholder, disabled, required }) => (
  <div className="elegantForm_group">
    <label htmlFor={id} className="elegantForm_label">
      <span className="elegantForm_label_icon"></span>
      {label}
    </label>
    <select 
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="elegantForm_select"
      disabled={disabled}
      required={required}
    >
      <option value="">{placeholder}</option>
      {options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
  </div>
);

const FormInput = ({ id, name, type, label, value, onChange, placeholder, required }) => (
  <div className="elegantForm_group">
    <label htmlFor={id} className="elegantForm_label">
      <span className="elegantForm_label_icon"></span>
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="elegantForm_input"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const FormTextarea = ({ id, name, label, value, onChange, placeholder, rows, required }) => (
  <div className="elegantForm_group elegantForm_fullRow">
    <label htmlFor={id} className="elegantForm_label">
      <span className="elegantForm_label_icon"></span>
      {label}
    </label>
    <textarea
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      className="elegantForm_textarea"
      placeholder={placeholder}
      rows={rows}
      required={required}
    />
  </div>
);

const ImageUploadSection = ({ images, fileInputRef, onImageUpload, onRemoveImage }) => (
  <div className="elegantForm_group elegantForm_fullRow">
    <label className="elegantForm_label">
      <span className="elegantForm_label_icon"></span>
      الصور:
    </label>
    
    <div className="elegantUpload_section">
      <input
        type="file"
        ref={fileInputRef}
        onChange={onImageUpload}
        multiple
        accept="image/*"
        className="elegantFile_input"
        id="imageUpload"
      />
      <label htmlFor="imageUpload" className="elegantUpload_btn">
        <span>اختر الصور</span>
      </label>
      <span className="elegantUpload_hint">(يمكن رفع حتى 5 صور، الحجم الأقصى 5MB لكل صورة)</span>
    </div>

    {images.length > 0 && (
      <div className="elegantFiles_list">
        <h4>الصور المرفوعة ({images.length}/5):</h4>
        {images.map((image, index) => (
          <div key={index} className="elegantFile_item">
            <div className="elegantFile_info">
              <span className="elegantFile_icon">🖼️</span>
              <span className="elegantFile_name">{image.name}</span>
            </div>
            <button
              type="button"
              className="elegantRemove_file"
              onClick={() => onRemoveImage(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default MarketingRequest;