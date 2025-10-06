import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function PropertyList() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // بيانات تجريبية
    const sampleProperties = [
      {
        id: 1,
        title: 'فيلا فاخرة في الرياض',
        type: 'فيلا',
        price: 2500000,
        location: 'الرياض',
        image: '/images/villa1.jpg',
        auctionEnd: '2024-12-31'
      },
      {
        id: 2,
        title: 'أرض سكنية في جدة',
        type: 'أرض',
        price: 1500000,
        location: 'جدة',
        image: '/images/land1.jpg',
        auctionEnd: '2024-12-25'
      }
    ];
    setProperties(sampleProperties);
  }, []);

  const filteredProperties = properties.filter(property => {
    if (filter === 'all') return true;
    return property.type === filter;
  });

  return (
    <div className="property-list-page">
      <div className="page-header">
        <h1>العقارات المتاحة</h1>
        <div className="filters">
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">جميع العقارات</option>
            <option value="فيلا">فيلا</option>
            <option value="أرض">أرض</option>
            <option value="شقة">شقة</option>
          </select>
        </div>
      </div>

      <div className="properties-grid">
        {filteredProperties.map(property => (
          <div key={property.id} className="property-card">
            <img src={property.image} alt={property.title} />
            <div className="property-info">
              <h3>{property.title}</h3>
              <p className="location">{property.location}</p>
              <p className="price">{property.price.toLocaleString()} ريال</p>
              <p className="auction-end">ينتهي المزاد: {property.auctionEnd}</p>
              <div className="property-actions">
                <Link to={`/property/${property.id}`} className="btn btn-primary">
                  عرض التفاصيل
                </Link>
                <Link to={`/auction/${property.id}`} className="btn btn-secondary">
                  دخول المزاد
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PropertyList;