import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function CreateProperty() {
  const [formData, setFormData] = useState({
    title: '',
    type: 'أرض',
    price: '',
    location: '',
    area: '',
    bedrooms: '',
    bathrooms: '',
    description: '',
    auctionEnd: ''
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // هنا سيتم إضافة منطق إرسال البيانات للخادم
    console.log('Property data:', formData);
    alert('تم إضافة العقار بنجاح وسيتم مراجعته');
    navigate('/properties');
  };

  if (!currentUser) {
    return <div>يجب تسجيل الدخول لإضافة عقار</div>;
  }

  return (
    <div className="create-property-page">
      <h1>إضافة عقار جديد للمزاد</h1>
      
      <form onSubmit={handleSubmit} className="property-form">
        <div className="form-group">
          <label>عنوان العقار</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>نوع العقار</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="أرض">أرض</option>
            <option value="فيلا">فيلا</option>
            <option value="شقة">شقة</option>
            <option value="مكتب">مكتب</option>
          </select>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>السعر الابتدائي (ريال)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>المساحة (م²)</label>
            <input
              type="text"
              name="area"
              value={formData.area}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>عدد غرف النوم</label>
            <input
              type="number"
              name="bedrooms"
              value={formData.bedrooms}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>عدد دورات المياه</label>
            <input
              type="number"
              name="bathrooms"
              value={formData.bathrooms}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-group">
          <label>المكان</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>تاريخ انتهاء المزاد</label>
          <input
            type="datetime-local"
            name="auctionEnd"
            value={formData.auctionEnd}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>وصف العقار</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary">إضافة العقار</button>
      </form>
    </div>
  );
}

export default CreateProperty;