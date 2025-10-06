import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    // بيانات تجريبية
    const sampleProperty = {
      id: 1,
      title: 'فيلا فاخرة في الرياض',
      type: 'فيلا',
      price: 2500000,
      location: 'الرياض',
      area: '400 م²',
      bedrooms: 5,
      bathrooms: 4,
      description: 'فيلا فاخرة في حي الرائد، مساحة 400 متر، 5 غرف نوم، 4 دورات مياه، مسبح خاص، حديقة',
      images: ['/images/villa1.jpg', '/images/villa2.jpg'],
      auctionEnd: '2024-12-31',
      currentBid: 2500000
    };
    setProperty(sampleProperty);
  }, [id]);

  if (!property) return <div>جاري التحميل...</div>;

  return (
    <div className="property-detail-page">
      <div className="property-images">
        <img src={property.images[0]} alt={property.title} />
      </div>
      
      <div className="property-details">
        <h1>{property.title}</h1>
        <div className="property-meta">
          <span className="location">{property.location}</span>
          <span className="type">{property.type}</span>
          <span className="area">{property.area}</span>
        </div>

        <div className="property-features">
          <div className="feature">
            <span>غرف النوم:</span>
            <strong>{property.bedrooms}</strong>
          </div>
          <div className="feature">
            <span>دورات المياه:</span>
            <strong>{property.bathrooms}</strong>
          </div>
        </div>

        <div className="price-section">
          <h2>السعر الحالي: {property.currentBid.toLocaleString()} ريال</h2>
          <p>ينتهي المزاد: {property.auctionEnd}</p>
        </div>

        <div className="property-description">
          <h3>الوصف</h3>
          <p>{property.description}</p>
        </div>

        <div className="action-buttons">
          <Link to={`/auction/${property.id}`} className="btn btn-primary">
            دخول غرفة المزاد
          </Link>
          <button className="btn btn-secondary">إضافة إلى المفضلة</button>
        </div>
      </div>
    </div>
  );
}

export default PropertyDetail;