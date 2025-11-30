import React from 'react';
import { useQuery } from '@tanstack/react-query';
import Icons from '../../icons/index';
import ClientsSkeleton from '../../Skeleton/ClientsSkeleton';

const ClientsSlider = ({ clients, onClientClick }) => {
  const [activeIndex, setActiveIndex] = React.useState(1);
  const maxVisibleLogos = 3;

  const nextClient = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % clients.length);
  };

  const prevClient = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + clients.length) % clients.length);
  };

  React.useEffect(() => {
    if (clients.length > 0) {
      const interval = setInterval(nextClient, 3000);
      return () => clearInterval(interval);
    }
  }, [clients]);

  const getVisibleLogos = () => {
    if (clients.length === 0) return [];

    let visibleLogos = [];

    for (let i = 0; i < maxVisibleLogos; i++) {
      const index = (activeIndex + i) % clients.length;
      visibleLogos.push({
        ...clients[index],
        isActive: i === 1
      });
    }

    return visibleLogos;
  };

  return (
    <section className="clients-section">
      <div className="container">
        <div className="clients-box">
          <h3 className="clients-title">
            عملاؤنا المميزون
          </h3>

          {clients.length > 0 ? (
            <div className="clients-slider-container">
              <button 
                className="client-nav-btn prev-btn"
                onClick={prevClient}
              >
                <Icons.FaChevronRight />
              </button>

              <div className="clients-slider">
                <div className="clients-track">
                  {getVisibleLogos().map((client) => (
                    <div
                      key={client.id}
                      className={`client-logo ${client.isActive ? 'active' : 'inactive'}`}
                      onClick={() => onClientClick && onClientClick(client)}
                    >
                      <img 
                        src={client.logo} 
                        alt={client.name} 
                        className="client-logo-img"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                className="client-nav-btn next-btn"
                onClick={nextClient}
              >
                <Icons.FaChevronLeft />
              </button>
            </div>
          ) : (
            <div className="no-clients">
              <p>لا توجد بيانات للعملاء في الوقت الحالي</p>
            </div>
          )}

          <p className="clients-subtitle">
            نفتخر بشراكتنا مع أكبر الشركات العقارية في المملكة
          </p>
        </div>
      </div>

      <style jsx>{`
        /* ===== قسم العملاء ===== */
        .clients-section {
          position: relative;
          margin-top: -70px;
          margin-bottom: 30px;
          z-index: 10;
        }

        .clients-box {
          background-color: white;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
          padding: 30px;
          text-align: center;
          max-width: 90%;
          margin: 0 auto;
          border-top: 4px solid #1e4a76;
        }

        .clients-title {
          color: #1e4a76;
          font-size: 1.5rem;
          margin-bottom: 20px;
          font-weight: 700;
          position: relative;
          display: inline-block;
        }

        .clients-title::after {
          content: '';
          position: absolute;
          width: 60px;
          height: 3px;
          background-color: #d4af37;
          bottom: -8px;
          right: 50%;
          transform: translateX(50%);
        }

        .clients-slider-container {
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 30px 0;
          gap: 15px;
        }

        .clients-slider {
          overflow: hidden;
          position: relative;
          width: 70%;
          max-width: 600px;
        }

        .clients-track {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          transition: transform 0.5s ease-in-out;
        }

        .client-logo {
          flex: 0 0 150px;
          height: 80px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.5s, opacity 0.5s;
        }

        .client-logo.inactive {
          opacity: 0.3;
        }

        .client-logo.active {
          transform: scale(1.2);
          opacity: 1;
        }

        .client-logo-img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
          pointer-events: none;
        }

        .client-nav-btn {
          background-color: #1e4a76;
          color: white;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .client-nav-btn:hover {
          background-color: #0f2d44;
          transform: scale(1.1);
        }

        .clients-subtitle {
          color: #666;
          margin-top: 20px;
        }

        /* ===== وضع الهاتف (نحيف) ===== */
        @media (max-width: 768px) {
          .clients-section {
            margin-top: -30px;
            margin-bottom: 10px;
          }

          .clients-box {
            padding: 15px 10px;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
          }

          .clients-title {
            font-size: 1rem;
            margin-bottom: 10px;
          }

          .clients-title::after {
            width: 35px;
            height: 2px;
            bottom: -5px;
          }

          .clients-slider-container {
            margin: 10px 0;
            gap: 8px;
          }

          .clients-slider {
            width: 95%;
          }

          .clients-track {
            gap: 6px;
          }

          .client-logo {
            flex: 0 0 auto;
            width: 70px;
            height: 40px;
          }

          .client-logo.active {
            transform: scale(1.05);
          }

          .client-nav-btn {
            width: 25px;
            height: 25px;
            font-size: 10px;
          }

          .clients-subtitle {
            font-size: 0.8rem;
            margin-top: 10px;
          }
        }

        /* ===== هواتف صغيرة جداً ===== */
        @media (max-width: 480px) {
          .clients-box {
            padding: 12px 8px;
            max-width: 95%;
          }

          .clients-title {
            font-size: 0.9rem;
          }

          .client-logo {
            width: 60px;
            height: 35px;
          }

          .clients-track {
            gap: 4px;
          }

          .client-nav-btn {
            width: 22px;
            height: 22px;
          }
        }
      `}</style>
    </section>
  );
};

// دالة لجلب البيانات من API
const fetchClients = async () => {
  const response = await fetch('https://core-api-x41.shaheenplus.sa/api/clients/featured');
  const data = await response.json();

  if (data.success && Array.isArray(data.data)) {
    return data.data.map(client => ({
      id: client.id,
      name: client.name,
      logo: client.logo,
      website: client.website
    }));
  }
  throw new Error('Failed to fetch clients');
};

const ClientsSection = () => {
  const { data: clients = [], isLoading, error } = useQuery({
    queryKey: ['featuredClients'],
    queryFn: fetchClients,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 دقائق
  });

  const handleClientClick = (client) => {
    // تم تعطيل فتح الرابط
  };

  if (isLoading) {
    return <ClientsSkeleton />;
  }

  if (error) {
    return (
      <section className="clients-section">
        <div className="container">
          <div className="clients-box" style={{ borderTopColor: '#ef4444' }}>
            <div style={{ color: '#ef4444' }}>
              <p>حدث خطأ في تحميل بيانات العملاء</p>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  marginTop: '16px',
                  backgroundColor: '#1e4a76',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                إعادة المحاولة
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return <ClientsSlider clients={clients} onClientClick={handleClientClick} />;
};

export default ClientsSection;