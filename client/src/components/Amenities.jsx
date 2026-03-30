import React from 'react';
import { 
  FiWifi, 
  FiDroplet, 
  FiSun, 
  FiCoffee,
  FiHome,
  FiShield,
  FiTruck,
  FiClock
} from 'react-icons/fi';

const amenitiesData = [
  {
    icon: <FiWifi />,
    title: '24/7 High-Speed WiFi',
    description: 'Stay connected with unlimited high-speed internet access'
  },
  {
    icon: <FiCoffee />,
    title: '3 Meals Daily',
    description: 'Nutritious breakfast, lunch, and dinner included'
  },
  {
    icon: <FiDroplet />,
    title: 'RO Purified Water',
    description: 'Clean and safe drinking water available 24/7'
  },
  {
    icon: <FiSun />,
    title: 'Hot Water Geyser',
    description: 'Instant hot water in all bathrooms'
  },
  {
    icon: <FiHome />,
    title: 'Attached Bathroom',
    description: 'Private bathroom with modern fittings'
  },
  {
    icon: <FiTruck />,
    title: 'Laundry Service',
    description: 'Weekly laundry and ironing service'
  },
  {
    icon: <FiShield />,
    title: '24/7 Security',
    description: 'CCTV surveillance and security guards'
  },
  {
    icon: <FiClock />,
    title: 'Daily Housekeeping',
    description: 'Regular cleaning and maintenance'
  }
];

const Amenities = () => {
  return (
    <section className="amenities-section">
      <div className="section-container">
        <div className="section-header">
          <h2>World-Class Amenities</h2>
          <p>Everything you need for a comfortable and hassle-free stay</p>
        </div>
        
        <div className="amenities-grid">
          {amenitiesData.map((amenity, index) => (
            <div key={index} className="amenity-card">
              <div className="amenity-icon">{amenity.icon}</div>
              <h3>{amenity.title}</h3>
              <p>{amenity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Amenities;