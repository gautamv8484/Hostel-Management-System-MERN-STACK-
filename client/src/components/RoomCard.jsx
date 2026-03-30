import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiWind, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RoomCard = ({ room }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const price = room.pricePerBed || room.pricePerMonth || 0;
  
  const availableBeds = room.availableBeds !== undefined 
    ? room.availableBeds 
    : (room.beds ? room.beds.filter(bed => !bed.isOccupied).length : 0);
  
  const totalBeds = room.totalBeds !== undefined 
    ? room.totalBeds 
    : (room.beds ? room.beds.length : room.sharingType || 0);

  const handleBookClick = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a room');
      navigate('/login', { state: { from: `/rooms/${room._id}` } });
      return;
    }
    
    navigate(`/rooms/${room._id}`);
  };

  return (
    <div className="room-card">
      <div className="room-card-image">
        <img 
          src={room.images && room.images[0] ? room.images[0] : 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=500'} 
          alt={room.name || `Room ${room.roomNumber}`} 
        />
        {room.roomType === 'AC' && <span className="room-badge">AC</span>}
      </div>
      
      <div className="room-card-content">
        <h3>{room.name || `Room ${room.roomNumber}`}</h3>
        
        <div className="room-card-features">
          <span><FiUsers /> {room.sharingType} Sharing</span>
          <span><FiWind /> {room.roomType}</span>
          {room.floor && <span><FiMapPin /> Floor {room.floor}</span>}
        </div>
        
        <div className="room-card-price">
          <span className="price">₹{price.toLocaleString()}</span>
          <span className="per-month">/ bed / month</span>
        </div>
        
        <div className="room-card-availability">
          <span className={availableBeds > 0 ? 'available' : 'full'}>
            {availableBeds > 0 
              ? `${availableBeds} of ${totalBeds} beds available` 
              : 'No beds available'}
          </span>
        </div>
        
        <div className="room-card-actions">
          <Link to={`/rooms/${room._id}`} className="btn btn-secondary">
            View Details
          </Link>
          
          {availableBeds > 0 && (
            <button onClick={handleBookClick} className="btn btn-primary">
              {user ? 'Book Now' : 'Login to Book'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;