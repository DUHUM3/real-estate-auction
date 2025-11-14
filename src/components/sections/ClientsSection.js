import React, { useState, useEffect } from 'react';
import Icons from '../../icons/index';

const ClientsSlider = ({ clients, onClientClick }) => {
  const [activeIndex, setActiveIndex] = useState(1);
  const maxVisibleLogos = 3;

  const nextClient = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % clients.length);
  };

  const prevClient = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + clients.length) % clients.length);
  };

  useEffect(() => {
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
          <h3 className="clients-title">عملاؤنا المميزون</h3>

          {clients.length > 0 ? (
            <div className="clients-slider-container">
              <button className="client-nav-btn prev-btn" onClick={prevClient}>
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
                      <img src={client.logo} alt={client.name} />
                    </div>
                  ))}
                </div>
              </div>

              <button className="client-nav-btn next-btn" onClick={nextClient}>
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
    </section>
  );
};

const ClientsSection = () => {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://shahin-tqay.onrender.com/api/clients/Featured');
      const data = await response.json();

      if (Array.isArray(data)) {
        const formattedClients = data.map(client => ({
          id: client.id,
          name: client.name,
          logo: client.logo,
          website: client.website
        }));
        setClients(formattedClients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleClientClick = (client) => {
    if (client.website) {
      window.open(client.website, '_blank');
    }
  };

  return <ClientsSlider clients={clients} onClientClick={handleClientClick} />;
};

export default ClientsSection;