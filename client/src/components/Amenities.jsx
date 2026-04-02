import React from 'react';
import { 
  FiWifi, 
  FiShield, 
  FiCoffee, 
  FiTruck,
  FiStar,
  FiDroplet,
  FiMonitor,
  FiSun
} from 'react-icons/fi';
import { IoSnowOutline } from 'react-icons/io5';

const Amenities = () => {
  const amenities = [
    {
      icon: <FiWifi />,
      title: 'High-Speed WiFi',
      description: 'Lightning-fast 1Gbps internet throughout the premises with zero downtime'
    },
    {
      icon: <IoSnowOutline />,
      title: 'Smart AC Control',
      description: 'Climate-controlled rooms with app-based temperature management'
    },
    {
      icon: <FiCoffee />,
      title: 'Gourmet Meals',
      description: 'Chef-prepared nutritious meals served three times daily'
    },
    {
      icon: <FiShield />,
      title: '24/7 Security',
      description: 'AI-powered surveillance with biometric access control'
    },
    {
      icon: <FiStar />,
      title: 'Modern Gym',
      description: 'State-of-the-art fitness center with personal trainers'
    },
    {
      icon: <FiDroplet />,
      title: 'Laundry Service',
      description: 'Professional laundry with same-day delivery options'
    },
    {
      icon: <FiTruck />,
      title: 'Smart Parking',
      description: 'Automated parking system with reserved spots'
    },
    {
      icon: <FiMonitor />,
      title: 'Gaming Zone',
      description: 'Recreation room with gaming consoles and entertainment'
    }
  ];

  return (
    <section className="amenities-section">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">
            <FiStar /> Premium Features
          </div>
          <h2>
            <span className="gradient-text">World-Class</span> Amenities
          </h2>
          <p>Experience luxury living with our carefully curated amenities designed for your comfort</p>
        </div>

        <div className="amenities-grid">
          {amenities.map((amenity, index) => (
            <div key={index} className="amenity-card">
              <div className="amenity-icon">
                {amenity.icon}
              </div>
              <h3>{amenity.title}</h3>
              <p>{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid #A855F7;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #A855F7;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
      `}</style>
    </section>
  );
};

export default Amenities;