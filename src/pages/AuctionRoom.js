import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function AuctionRoom() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const [property, setProperty] = useState(null);
  const [bidAmount, setBidAmount] = useState('');
  const [bids, setBids] = useState([]);

  useEffect(() => {
    // بيانات تجريبية
    const sampleProperty = {
      id: 1,
      title: 'فيلا فاخرة في الرياض',
      currentBid: 2500000,
      auctionEnd: '2024-12-31T23:59:59'
    };
    setProperty(sampleProperty);

    const sampleBids = [
      { id: 1, user: 'أحمد', amount: 2450000, time: '2024-12-20T10:30:00' },
      { id: 2, user: 'محمد', amount: 2500000, time: '2024-12-20T11:15:00' }
    ];
    setBids(sampleBids);
  }, [id]);

  const handleBid = (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert('يجب تسجيل الدخول للمشاركة في المزاد');
      return;
    }

    const newBid = {
      id: bids.length + 1,
      user: currentUser.name,
      amount: parseInt(bidAmount),
      time: new Date().toISOString()
    };

    setBids([newBid, ...bids]);
    setProperty({
      ...property,
      currentBid: parseInt(bidAmount)
    });
    setBidAmount('');

    alert('تم تقديم المزايدة بنجاح');
  };

  if (!property) return <div>جاري التحميل...</div>;

  return (
    <div className="auction-room">
      <div className="auction-header">
        <h1>غرفة المزاد - {property.title}</h1>
        <div className="current-bid">
          <h2>السعر الحالي: {property.currentBid.toLocaleString()} ريال</h2>
          <p>ينتهي المزاد: {new Date(property.auctionEnd).toLocaleString('ar-SA')}</p>
        </div>
      </div>

      <div className="auction-content">
        <div className="bid-form-section">
          <form onSubmit={handleBid} className="bid-form">
            <div className="form-group">
              <label>مبلغ المزايدة (ريال)</label>
              <input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                min={property.currentBid + 1000}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              تقديم المزايدة
            </button>
          </form>
        </div>

        <div className="bids-history">
          <h3>سجل المزايدات</h3>
          <div className="bids-list">
            {bids.map(bid => (
              <div key={bid.id} className="bid-item">
                <span className="bidder">{bid.user}</span>
                <span className="bid-amount">{bid.amount.toLocaleString()} ريال</span>
                <span className="bid-time">
                  {new Date(bid.time).toLocaleString('ar-SA')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuctionRoom;