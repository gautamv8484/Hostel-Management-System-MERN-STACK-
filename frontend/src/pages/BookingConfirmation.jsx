import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiCheckCircle, FiCalendar, FiHome, FiUser, FiDollarSign, FiArrowLeft } from 'react-icons/fi';
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
      console.error('Fetch booking error:', error);
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
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading booking details...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="error-container">
        <h2>Booking not found</h2>
        <Link to="/my-bookings">Go to My Bookings</Link>
      </div>
    );
  }

  return (
    <div className="booking-confirmation-page">
      <div className="confirmation-container">
        
        {/* Success Header */}
        <div className="success-header">
          <div className="success-icon">
            <FiCheckCircle size={64} />
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
            <div className="info-row">
              <span className="label">Booking ID:</span>
              <span className="value">
                <code>#{booking._id?.slice(-8).toUpperCase()}</code>
              </span>
            </div>

            {/* Room Details */}
            <div className="info-section">
              <h3><FiHome /> Room Information</h3>
              <div className="info-row">
                <span className="label">Room Name:</span>
                <span className="value">{booking.room?.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Room Number:</span>
                <span className="value">{booking.room?.roomNumber}</span>
              </div>
              <div className="info-row">
                <span className="label">Floor:</span>
                <span className="value">Floor {booking.room?.floor}</span>
              </div>
              <div className="info-row">
                <span className="label">Room Type:</span>
                <span className="value">{booking.room?.roomType}</span>
              </div>
              <div className="info-row">
                <span className="label">Bed Number:</span>
                <span className="value">Bed {booking.bed?.bedNumber || 'N/A'}</span>
              </div>
            </div>

            {/* Stay Details */}
            <div className="info-section">
              <h3><FiCalendar /> Stay Details</h3>
              <div className="info-row">
                <span className="label">Check-in Date:</span>
                <span className="value">
                  {booking.checkInDate 
                    ? format(new Date(booking.checkInDate), 'MMMM dd, yyyy')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Check-out Date:</span>
                <span className="value">
                  {booking.checkOutDate 
                    ? format(new Date(booking.checkOutDate), 'MMMM dd, yyyy')
                    : 'N/A'}
                </span>
              </div>
              <div className="info-row">
                <span className="label">Duration:</span>
                <span className="value">
                  {booking.checkInDate && booking.checkOutDate
                    ? `${Math.ceil((new Date(booking.checkOutDate) - new Date(booking.checkInDate)) / (1000 * 60 * 60 * 24))} days`
                    : 'N/A'}
                </span>
              </div>
            </div>

            {/* Guest Details */}
            <div className="info-section">
              <h3><FiUser /> Guest Information</h3>
              <div className="info-row">
                <span className="label">Name:</span>
                <span className="value">{booking.user?.name}</span>
              </div>
              <div className="info-row">
                <span className="label">Email:</span>
                <span className="value">{booking.user?.email}</span>
              </div>
              {booking.user?.phone && (
                <div className="info-row">
                  <span className="label">Phone:</span>
                  <span className="value">{booking.user.phone}</span>
                </div>
              )}
            </div>

            {/* Payment Details */}
            <div className="info-section">
              <h3><FiDollarSign /> Payment Information</h3>
              <div className="info-row">
                <span className="label">Total Amount:</span>
                <span className="value total-amount">₹{booking.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="info-row">
                <span className="label">Payment Status:</span>
                <span className={`payment-badge ${booking.paymentStatus}`}>
                  {booking.paymentStatus}
                </span>
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="info-section">
                <h3>Special Requests</h3>
                <p className="special-requests">{booking.specialRequests}</p>
              </div>
            )}

            {/* Amenities */}
            {booking.room?.amenities && booking.room.amenities.length > 0 && (
              <div className="info-section">
                <h3>Room Amenities</h3>
                <div className="amenities-list">
                  {booking.room.amenities.map((amenity, index) => (
                    <span key={index} className="amenity-tag">
                      ✓ {amenity}
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
          <h3>Important Information</h3>
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
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
        }

        .confirmation-container {
          max-width: 800px;
          margin: 0 auto;
        }

        .loading-container,
        .error-container {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 16px;
          margin-top: 2rem;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid #e5e7eb;
          border-top-color: #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .success-header {
          text-align: center;
          color: white;
          margin-bottom: 2rem;
        }

        .success-icon {
          width: 100px;
          height: 100px;
          background: rgba(255,255,255,0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1rem;
        }

        .success-header h1 {
          font-size: 2rem;
          margin: 1rem 0 0.5rem;
        }

        .success-header p {
          opacity: 0.9;
        }

        .booking-card {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 10px 40px rgba(0,0,0,0.2);
          margin-bottom: 1.5rem;
        }

        .booking-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 2px solid #e5e7eb;
        }

        .booking-header h2 {
          margin: 0;
          color: #1a1a2e;
        }

        .status-badge {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
          font-size: 0.875rem;
          text-transform: capitalize;
        }

        .status-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .status-badge.confirmed {
          background: #d4edda;
          color: #155724;
        }

        .status-badge.cancelled {
          background: #f8d7da;
          color: #721c24;
        }

        .booking-info {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .info-section {
          padding: 1rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .info-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0 0 1rem 0;
          color: #1a1a2e;
          font-size: 1.1rem;
        }

        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .info-row:last-child {
          border-bottom: none;
        }

        .label {
          color: #6b7280;
          font-weight: 500;
        }

        .value {
          color: #1a1a2e;
          font-weight: 600;
          text-align: right;
        }

        .total-amount {
          color: #667eea;
          font-size: 1.25rem;
        }

        code {
          background: #e5e7eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
        }

        .payment-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 12px;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .payment-badge.pending {
          background: #fff3cd;
          color: #856404;
        }

        .payment-badge.completed {
          background: #d4edda;
          color: #155724;
        }

        .special-requests {
          padding: 1rem;
          background: white;
          border-radius: 6px;
          margin: 0;
          color: #6b7280;
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .amenity-tag {
          background: white;
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-size: 0.875rem;
          color: #667eea;
        }

        .booking-actions {
          display: flex;
          gap: 1rem;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 2px solid #e5e7eb;
        }

        .btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 1rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          text-decoration: none;
        }

        .btn-secondary {
          background: #e5e7eb;
          color: #1a1a2e;
        }

        .btn-secondary:hover {
          background: #d1d5db;
        }

        .btn-danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-danger:hover {
          background: #dc2626;
          color: white;
        }

        .info-box {
          background: white;
          border-radius: 16px;
          padding: 2rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .info-box h3 {
          margin: 0 0 1rem 0;
          color: #1a1a2e;
        }

        .info-box ul {
          margin: 0;
          padding-left: 1.5rem;
          color: #6b7280;
        }

        .info-box li {
          margin-bottom: 0.5rem;
        }

        @media (max-width: 768px) {
          .booking-confirmation-page {
            padding: 1rem;
          }

          .success-header h1 {
            font-size: 1.5rem;
          }

          .booking-card {
            padding: 1.5rem;
          }

          .booking-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .info-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .value {
            text-align: left;
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