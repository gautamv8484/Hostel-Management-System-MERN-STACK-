import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { 
  FiUsers, 
  FiWind, 
  FiMapPin, 
  FiCalendar, 
  FiCheck,
  FiArrowLeft,
  FiHome,
  FiZap
} from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [bookingData, setBookingData] = useState({
    checkInDate: '',
    checkOutDate: '',
    specialRequests: ''
  });

  useEffect(() => {
    fetchRoomDetails();
  }, [id]);

  const fetchRoomDetails = async () => {
    try {
      const response = await api.get(`/rooms/${id}`);
      
      if (response.data.success) {
        setRoom(response.data.room);
      } else if (response.data.room) {
        setRoom(response.data.room);
      } else {
        setRoom(response.data);
      }
    } catch (error) {
      console.error('Error fetching room:', error);
      toast.error('Room not found');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const getPrice = () => {
    if (!room) return 0;
    return room.pricePerBed || room.pricePerMonth || room.pricePerPerson || room.price || room.rent || 0;
  };

  const getAvailableBeds = () => {
    if (!room) return [];
    if (room.beds && Array.isArray(room.beds)) {
      return room.beds.filter(bed => !bed.isOccupied && bed.isAvailable !== false);
    }
    return [];
  };

  const getTotalBeds = () => {
    if (!room) return 0;
    if (room.beds && Array.isArray(room.beds)) {
      return room.beds.length;
    }
    return room.totalBeds || room.capacity || room.sharingType || 0;
  };

  const getAvailableBedsCount = () => {
    if (!room) return 0;
    if (room.beds && Array.isArray(room.beds)) {
      return room.beds.filter(bed => !bed.isOccupied && bed.isAvailable !== false).length;
    }
    return room.availableBeds ?? 0;
  };

  const handleBookNowClick = () => {
    if (!user) {
      toast.error('Please login to book this room');
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }
    setBooking(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to book');
      navigate('/login', { state: { from: `/rooms/${id}` } });
      return;
    }

    if (!bookingData.checkInDate || !bookingData.checkOutDate) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    try {
      const response = await api.post('/bookings', {
        roomId: id,
        bedId: selectedBed,
        checkInDate: bookingData.checkInDate,
        checkOutDate: bookingData.checkOutDate,
        specialRequests: bookingData.specialRequests
      });
      
      if (response.data.success) {
        toast.success('Booking successful!');
        navigate(`/bookings/${response.data.booking._id}`);
      } else {
        toast.error(response.data.message || 'Booking failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  const calculateTotal = () => {
    if (!bookingData.checkInDate || !bookingData.checkOutDate) return 0;
    
    const checkIn = new Date(bookingData.checkInDate);
    const checkOut = new Date(bookingData.checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const months = Math.ceil(days / 30) || 1;
    
    return getPrice() * months;
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
        <p>Loading room details...</p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="error-container" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <IoBedOutline style={{ fontSize: '4rem', color: '#64748B', marginBottom: '1rem' }} />
        <h2>Room not found</h2>
        <button onClick={() => navigate('/rooms')} className="btn btn-primary mt-2">
          Back to Rooms
        </button>
      </div>
    );
  }

  const price = getPrice();
  const availableBeds = getAvailableBeds();
  const availableBedsCount = getAvailableBedsCount();
  const totalBeds = getTotalBeds();

  return (
    <div className="room-details-page">
      <div className="section-container">
        <button 
          onClick={() => navigate('/rooms')} 
          className="btn btn-glass mb-2"
        >
          <FiArrowLeft /> Back to Rooms
        </button>

        <div className="room-details-grid">
          {/* Room Images */}
          <div className="room-images">
            <div className="main-image-container">
              {room.images?.[0] ? (
                <img 
                  src={room.images[0]} 
                  alt={room.name || `Room ${room.roomNumber}`}
                  className="main-image"
                />
              ) : (
                <div className="main-image placeholder">
                  <IoBedOutline />
                </div>
              )}
            </div>
            {room.images?.length > 1 && (
              <div className="thumbnail-grid">
                {room.images.slice(1, 4).map((img, index) => (
                  <img key={index} src={img} alt={`Room ${index + 2}`} />
                ))}
              </div>
            )}
          </div>

          {/* Room Info */}
          <div className="room-info">
            <h1>{room.name || `Room ${room.roomNumber}`}</h1>
            
            <div className="room-features">
              <div className="feature">
                <FiUsers />
                <span>{room.sharingType || totalBeds} Sharing</span>
              </div>
              <div className="feature">
                <FiWind />
                <span>{room.roomType || 'Non-AC'}</span>
              </div>
              {room.floor && (
                <div className="feature">
                  <FiMapPin />
                  <span>Floor {room.floor}</span>
                </div>
              )}
              <div className="feature">
                <FiHome />
                <span>Room {room.roomNumber}</span>
              </div>
            </div>

            {/* Price */}
            <div className="room-price-box">
              {price > 0 ? (
                <>
                  <span className="price">₹{price.toLocaleString()}</span>
                  <span className="period">/ bed / month</span>
                </>
              ) : (
                <span className="price">Contact for price</span>
              )}
            </div>

            {/* Availability */}
            <div className="availability-status">
              {availableBedsCount > 0 ? (
                <span className="available">
                  <FiCheck /> {availableBedsCount} of {totalBeds} beds available
                </span>
              ) : (
                <span className="not-available">No beds available</span>
              )}
            </div>

            {/* Amenities */}
            {room.amenities?.length > 0 && (
              <div className="room-amenities">
                <h3>Amenities</h3>
                <ul>
                  {room.amenities.map((amenity, index) => (
                    <li key={index}><FiCheck /> {amenity}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Description */}
            {room.description && (
              <div className="room-description">
                <h3>Description</h3>
                <p>{room.description}</p>
              </div>
            )}

            {/* Available Beds */}
            {availableBeds.length > 0 && (
              <div className="available-beds-section">
                <h3>Select Your Bed</h3>
                <div className="beds-grid">
                  {availableBeds.map((bed) => (
                    <div 
                      key={bed._id} 
                      className={`bed-item ${selectedBed === bed._id ? 'selected' : ''}`}
                      onClick={() => setSelectedBed(bed._id)}
                    >
                      <span>Bed {bed.bedNumber}</span>
                      {selectedBed === bed._id && <FiCheck />}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Booking Section */}
            {availableBedsCount > 0 && (
              <div className="booking-section">
                {!booking ? (
                  <button 
                    onClick={handleBookNowClick}
                    className="btn btn-primary btn-lg btn-block"
                  >
                    <FiZap /> 
                    {user ? 'Book Now' : 'Login to Book'}
                  </button>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="booking-form">
                    <h3>Complete Your Booking</h3>
                    
                    {selectedBed && (
                      <div className="selected-bed-info">
                        <p>Selected: Bed {availableBeds.find(b => b._id === selectedBed)?.bedNumber}</p>
                      </div>
                    )}
                    
                    <div className="form-group">
                      <label><FiCalendar /> Check-in Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={bookingData.checkInDate}
                        onChange={(e) => setBookingData({
                          ...bookingData, 
                          checkInDate: e.target.value
                        })}
                        min={new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label><FiCalendar /> Check-out Date</label>
                      <input
                        type="date"
                        className="form-control"
                        value={bookingData.checkOutDate}
                        onChange={(e) => setBookingData({
                          ...bookingData, 
                          checkOutDate: e.target.value
                        })}
                        min={bookingData.checkInDate || new Date().toISOString().split('T')[0]}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Special Requests (Optional)</label>
                      <textarea
                        className="form-control"
                        value={bookingData.specialRequests}
                        onChange={(e) => setBookingData({
                          ...bookingData, 
                          specialRequests: e.target.value
                        })}
                        placeholder="Any special requests..."
                        rows="3"
                      />
                    </div>

                    <div className="booking-summary">
                      <div className="summary-row">
                        <span>Price per month</span>
                        <span>₹{price.toLocaleString()}</span>
                      </div>
                      <div className="summary-row total">
                        <span><strong>Total Amount</strong></span>
                        <span><strong>₹{calculateTotal().toLocaleString()}</strong></span>
                      </div>
                    </div>

                    <div className="booking-actions">
                      <button 
                        type="button" 
                        onClick={() => setBooking(false)}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <FiZap /> Confirm Booking
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {!user && availableBedsCount > 0 && (
              <div className="login-prompt">
                <p>
                  Already have an account?{' '}
                  <a 
                    href="/login" 
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login', { state: { from: `/rooms/${id}` } });
                    }}
                  >
                    Login here
                  </a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-image-container {
          position: relative;
          overflow: hidden;
          border-radius: 20px;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }

        .main-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          display: block;
        }

        .main-image.placeholder {
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 5rem;
          color: #0A0F1C;
        }
      `}</style>
    </div>
  );
};

export default RoomDetail;