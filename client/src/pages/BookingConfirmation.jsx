import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiHome, FiUser, FiDollarSign, FiArrowLeft, FiZap } from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';

const BookingConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookingDetails();
  }, [id]);

  const fetchBookingDetails = async () => {
    try {
      const response = await api.get(`/bookings/${id}`);
      if (response.data.success) {
        setBooking(response.data.booking);
      }
    } catch (error) {
      toast.error('Failed to load booking details');
      navigate('/my-bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(`/bookings/${id}/cancel`);
      toast.success('Booking cancelled successfully');
      navigate('/my-bookings');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) {
    return (
      <div className="booking-confirmation-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="booking-confirmation-page">
        <div className="error-container">
          <h2>Booking not found</h2>
          <Link to="/my-bookings" className="btn btn-primary">Go to My Bookings</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="booking-confirmation-page">
      <div className="confirmation-container">
        
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FiCheckCircle />
          </div>
          <h1>Booking Confirmed!</h1>
          <p>Your booking has been successfully created</p>
        </div>

        {/* Booking Details Card */}
        <div className="booking-card">
          <div className="booking-header">
            <h2>Booking Details</h2>
            <span className={`status-badge ${booking.status}`}>
              {booking.status}
            </span>
          </div>

          <div className="booking-info">
            {/* Booking ID */}
            <div className="info-row highlight">
              <span className="label">Booking ID</span>
              <span className="value">
                <code>#{booking._id?.slice(-8).toUpperCase()}</code>
              </span>
            </div>

            {/* Room Details */}
            <div className="info-section">
              <h3><FiHome /> Room Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Room Name</span>
                  <span className="value">{booking.room?.name}</span>
                </div>
                <div className="info-item">
                  <span className="label">Room Number</span>
                  <span className="value">{booking.room?.roomNumber}</span>
                </div>
                <div className="info-item">
                  <span className="label">Floor</span>
                  <span className="value">Floor {booking.room?.floor}</span>
                </div>
                <div className="info-item">
                  <span className="label">Bed Number</span>
                  <span className="value">Bed {booking.bed?.bedNumber || 'N/A'}</span>
                </div>
              </div>
            </div>

            {/* Stay Details */}
            <div className="info-section">
              <h3><FiCalendar /> Stay Details</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Check-in</span>
                  <span className="value">
                    {booking.checkInDate 
                      ? format(new Date(booking.checkInDate), 'MMMM dd, yyyy')
                      : 'N/A'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="label">Check-out</span>
                  <span className="value">
                    {booking.checkOutDate 
                      ? format(new Date(booking.checkOutDate), 'MMMM dd, yyyy')
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="info-section">
              <h3><FiDollarSign /> Payment Information</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="label">Total Amount</span>
                  <span className="value amount">₹{booking.totalAmount?.toLocaleString()}</span>
                </div>
                <div className="info-item">
                  <span className="label">Payment Status</span>
                  <span className={`status-badge ${booking.paymentStatus}`}>
                    {booking.paymentStatus}
                  </span>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {booking.room?.amenities && booking.room.amenities.length > 0 && (
              <div className="info-section">
                <h3><FiZap /> Room Amenities</h3>
                <div className="amenities-list">
                  {booking.room.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      <FiCheckCircle /> {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="booking-actions">
            <Link to="/my-bookings" className="btn btn-secondary">
              <FiArrowLeft /> View All Bookings
            </Link>
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <button onClick={handleCancelBooking} className="btn btn-danger">
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {/* Important Information */}
        <div className="info-box">
          <h3><FiZap /> Important Information</h3>
          <ul>
            <li>Please arrive during check-in hours (2:00 PM - 10:00 PM)</li>
            <li>Carry a valid government-issued ID for verification</li>
            <li>Cancellation policy: Free cancellation up to 24 hours before check-in</li>
            <li>Please review hostel rules upon arrival</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        .booking-confirmation-page {
          min-height: 100vh;
          padding: 2rem 1rem;
          position: relative;
        }

        .booking-confirmation-page::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(168, 85, 247, 0.1) 0%, transparent 50%);
          z-index: -1;
        }

        .confirmation-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .success-header {
          text-align: center;
          margin-bottom: 2rem;
        }

        .success-icon {
          width: 100px;
          height: 100px;
          background: linear-gradient(135deg, #10B981, #34D399);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          font-size: 3rem;
          color: #0A0F1C;
          box-shadow: 0 0 50px rgba(16, 185, 129, 0.5);
          animation: successPulse 2s ease-in-out infinite;
        }

        @keyframes successPulse {
          0%, 100% { box-shadow: 0 0 30px rgba(16, 185, 129, 0.5); }
          50% { box-shadow: 0 0 60px rgba(16, 185, 129, 0.7); }
        }

        .success-header h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 2rem;
          color: #F8FAFC;
          margin-bottom: 0.5rem;
        }

        .success-header p {
          color: #94A3B8;
        }

        .booking-card {
          background: rgba(17, 24, 39, 0.85);
          border-radius: 24px;
          padding: 2rem;
          border: 1px solid rgba(34, 211, 238, 0.2);
          backdrop-filter: blur(20px);
          margin-bottom: 1.5rem;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(34, 211, 238, 0.15);
        }

        .booking-header h2 {
          margin: 0;
          color: #F8FAFC;
        }

        .booking-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 1rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 12px;
          border: 1px solid rgba(34, 211, 238, 0.1);
        }

        .info-row.highlight {
          border-color: #22D3EE;
        }

        .info-section {
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          border: 1px solid rgba(34, 211, 238, 0.1);
        }

        .info-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #F8FAFC;
          font-size: 1.1rem;
        }

        .info-section h3 svg {
          color: #22D3EE;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .label {
          color: #64748B;
          font-size: 0.85rem;
        }

        .value {
          color: #F8FAFC;
          font-weight: 600;
        }

        .value.amount {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.25rem;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        code {
          background: rgba(34, 211, 238, 0.1);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-family: 'Orbitron', monospace;
          color: #22D3EE;
          border: 1px solid rgba(34, 211, 238, 0.3);
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .amenity-tag {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          background: rgba(34, 211, 238, 0.1);
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
          color: #22D3EE;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }

        .booking-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(34, 211, 238, 0.15);
        }

        .booking-actions .btn {
          flex: 1;
        }

        .info-box {
          background: rgba(17, 24, 39, 0.85);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(168, 85, 247, 0.2);
        }

        .info-box h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #F8FAFC;
        }

        .info-box h3 svg {
          color: #A855F7;
        }

        .info-box ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #94A3B8;
        }

        .info-box li {
          margin-bottom: 0.5rem;
        }

        .status-badge.pending {
          background: rgba(251, 191, 36, 0.15);
          color: #FBBF24;
          border: 1px solid #FBBF24;
        }

        .status-badge.confirmed {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid #10B981;
        }

        .status-badge.cancelled {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid #EF4444;
        }

        @media (max-width: 768px) {
          .booking-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .info-grid {
            grid-template-columns: 1fr;
          }

          .booking-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingConfirmation;