import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FiX, FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../services/api';

const BookingModal = ({ room, selectedBed, onClose, onSuccess }) => {
  const [checkInDate, setCheckInDate] = useState(new Date());
  const [duration, setDuration] = useState(1);
  const [specialRequests, setSpecialRequests] = useState('');
  const [mealPlan, setMealPlan] = useState({
    breakfast: true,
    lunch: true,
    dinner: true
  });
  const [loading, setLoading] = useState(false);

  const calculateCheckoutDate = () => {
    const checkout = new Date(checkInDate);
    checkout.setMonth(checkout.getMonth() + duration);
    return checkout;
  };

  const totalAmount = room.pricePerBed * duration;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/bookings', {
        roomId: room._id,
        bedNumber: selectedBed,
        checkInDate,
        checkOutDate: calculateCheckoutDate(),
        duration,
        mealPlan,
        specialRequests
      });

      toast.success('Booking confirmed successfully!');
      onSuccess();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Complete Your Booking</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ 
            background: 'var(--gray-50)', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginBottom: '1.5rem' 
          }}>
            <p><strong>Room:</strong> {room.roomNumber} ({room.sharingType} Sharing {room.roomType})</p>
            <p><strong>Bed Number:</strong> {selectedBed}</p>
            <p><strong>Price:</strong> ₹{room.pricePerBed.toLocaleString()}/month</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label><FiCalendar /> Check-in Date</label>
              <DatePicker
                selected={checkInDate}
                onChange={date => setCheckInDate(date)}
                minDate={new Date()}
                className="form-control"
                dateFormat="dd/MM/yyyy"
              />
            </div>

            <div className="form-group">
              <label>Duration (Months)</label>
              <select 
                className="form-control"
                value={duration}
                onChange={e => setDuration(parseInt(e.target.value))}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(m => (
                  <option key={m} value={m}>{m} Month{m > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Meal Plan</label>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                {['breakfast', 'lunch', 'dinner'].map(meal => (
                  <label key={meal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={mealPlan[meal]}
                      onChange={e => setMealPlan({ ...mealPlan, [meal]: e.target.checked })}
                    />
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Special Requests (Optional)</label>
              <textarea
                className="form-control"
                rows="3"
                value={specialRequests}
                onChange={e => setSpecialRequests(e.target.value)}
                placeholder="Any special requirements..."
              />
            </div>

            <div style={{ 
              background: 'var(--primary-color)', 
              color: 'white', 
              padding: '1rem', 
              borderRadius: '8px',
              marginTop: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Total Amount:</span>
                <span style={{ fontSize: '1.5rem', fontWeight: '700' }}>
                  ₹{totalAmount.toLocaleString()}
                </span>
              </div>
              <small style={{ opacity: 0.8 }}>
                Check-out: {calculateCheckoutDate().toLocaleDateString()}
              </small>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;