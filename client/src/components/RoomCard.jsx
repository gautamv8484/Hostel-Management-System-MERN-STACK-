// src/components/RoomCard.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUsers, FiWind, FiMapPin } from 'react-icons/fi';
import toast from 'react-hot-toast';

const RoomCard = ({ room }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // ✅ Handle multiple possible price field names
  const getPrice = () => {
    return room.pricePerBed || 
           room.pricePerMonth || 
           room.pricePerPerson || 
           room.price || 
           0;
  };

  // ✅ Handle multiple possible available beds field names
  const getAvailableBeds = () => {
    // If room has beds array, count available ones
    if (room.beds && Array.isArray(room.beds)) {
      return room.beds.filter(bed => !bed.isOccupied && bed.isAvailable !== false).length;
    }
    // Otherwise use availableBeds field
    return room.availableBeds || 0;
  };

  // ✅ Get total beds
  const getTotalBeds = () => {
    if (room.beds && Array.isArray(room.beds)) {
      return room.beds.length;
    }
    return room.totalBeds || room.capacity || room.sharingType || 0;
  };

  const handleBookClick = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book a room');
      navigate('/login', { state: { from: `/rooms/${room._id}` } });
      return;
    }
    
    navigate(`/rooms/${room._id}`);
  };

  const price = getPrice();
  const availableBeds = getAvailableBeds();
  const totalBeds = getTotalBeds();

  return (
    <div className="room-card">
      <div className="room-card-image">
        <img 
          src={room.images?.[0] || '/placeholder-room.jpg'} 
          alt={room.name || `Room ${room.roomNumber}`} 
        />
        {room.roomType === 'AC' && <span className="room-badge">AC</span>}
      </div>
      
      <div className="room-card-content">
        <h3>{room.name || `Room ${room.roomNumber}`}</h3>
        
        <div className="room-card-features">
          <span>
            <FiUsers /> {room.sharingType || totalBeds} Sharing
          </span>
          <span>
            <FiWind /> {room.roomType || 'Non-AC'}
          </span>
          {room.floor && (
            <span>
              <FiMapPin /> Floor {room.floor}
            </span>
          )}
        </div>
        
        {/* ✅ FIXED: Price Display */}
        <div className="room-card-price">
          {price > 0 ? (
            <>
              <span className="price">₹{price.toLocaleString()}</span>
              <span className="per-month">/ bed / month</span>
            </>
          ) : (
            <span className="price">Contact for price</span>
          )}
        </div>
        
        {/* ✅ FIXED: Availability Display */}
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
            <button 
              onClick={handleBookClick} 
              className="btn btn-primary"
            >
              {user ? 'Book Now' : 'Login to Book'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomCard;