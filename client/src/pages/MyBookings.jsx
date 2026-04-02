import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin, FiXCircle, FiArrowRight, FiEye, FiZap } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import api from '../services/api';
import toast from 'react-hot-toast';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      setBookings(response.data.bookings);
    } catch (error) {
      toast.error('Failed to fetch bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }

    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      toast.success('Booking cancelled successfully');
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: 'badge-success',
      pending: 'badge-warning',
      cancelled: 'badge-danger',
      'checked-in': 'badge-info'
    };
    return config[status] || 'badge-secondary';
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
        <p>Loading your bookings...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>My Bookings</h1>
        </div>

        {bookings.length === 0 ? (
          <div className="empty-state">
            <IoBedOutline />
            <h3>No bookings yet</h3>
            <p>You haven't made any bookings. Start by browsing our rooms!</p>
            <Link to="/rooms" className="btn btn-primary mt-2">
              <FiZap /> Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="bookings-section">
            <div className="bookings-table-wrapper">
              <table className="bookings-table">
                <thead>
                  <tr>
                    <th>Room</th>
                    <th>Bed</th>
                    <th>Check-in</th>
                    <th>Check-out</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map(booking => (
                    <tr key={booking._id}>
                      <td>
                        <div className="room-cell">
                          <strong>{booking.room?.name || 'N/A'}</strong>
                          <small>
                            <FiMapPin /> {booking.room?.location || 'N/A'}
                          </small>
                        </div>
                      </td>
                      <td>
                        <span className="badge-secondary">
                          Bed {booking.bed?.bedNumber || 'N/A'}
                        </span>
                      </td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar />
                          {format(new Date(booking.checkInDate), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td>
                        <div className="date-cell">
                          <FiCalendar />
                          {format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}
                        </div>
                      </td>
                      <td>
                        <span className="amount">₹{booking.totalAmount?.toLocaleString()}</span>
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadge(booking.status)}`}>
                          {booking.status}
                        </span>
                      </td>
                      <td>
                        <span className={`status-badge ${booking.paymentStatus === 'completed' ? 'badge-success' : 'badge-warning'}`}>
                          {booking.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Link 
                            to={`/bookings/${booking._id}`} 
                            className="btn btn-glass btn-sm"
                            title="View Details"
                          >
                            <FiEye />
                          </Link>
                          {(booking.status === 'confirmed' || booking.status === 'pending') && (
                            <button
                              onClick={() => handleCancelBooking(booking._id)}
                              className="btn btn-danger btn-sm"
                              title="Cancel Booking"
                            >
                              <FiXCircle />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bookings-table-wrapper {
          overflow-x: auto;
        }

        .room-cell {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .room-cell strong {
          color: #F8FAFC;
        }

        .room-cell small {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          color: #64748B;
          font-size: 0.8rem;
        }

        .date-cell {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #94A3B8;
          font-size: 0.9rem;
        }

        .date-cell svg {
          color: #22D3EE;
        }

        .amount {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.5rem 0.75rem;
        }
      `}</style>
    </div>
  );
};

export default MyBookings;