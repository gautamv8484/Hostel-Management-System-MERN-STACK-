import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { FiCalendar, FiMapPin, FiClock, FiXCircle, FiArrowRight } from 'react-icons/fi';
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'danger';
      case 'checked-in': return 'info';
      default: return 'secondary';
    }
  };

  if (loading) {
    return (
      <div className="loading-container" style={{ minHeight: '60vh' }}>
        <div className="loading-spinner"></div>
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
            <FiCalendar style={{ fontSize: '4rem', color: 'var(--gray-300)' }} />
            <h3>No bookings yet</h3>
            <p>You haven't made any bookings. Start by browsing our rooms!</p>
            <Link to="/rooms" className="btn btn-primary mt-2">
              Browse Rooms <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="bookings-section">
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
                      <div className="room-info">
                        <strong>{booking.room?.name || 'N/A'}</strong>
                        <small className="text-muted">
                          <FiMapPin size={12} /> {booking.room?.location || 'N/A'}
                        </small>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-secondary">
                        Bed {booking.bed?.bedNumber || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <div className="date-info">
                        <FiCalendar size={14} />
                        <span>{format(new Date(booking.checkInDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                    <td>
                      <div className="date-info">
                        <FiCalendar size={14} />
                        <span>{format(new Date(booking.checkOutDate), 'MMM dd, yyyy')}</span>
                      </div>
                    </td>
                    <td>
                      <strong className="text-primary">₹{booking.totalAmount}</strong>
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td>
                      <span className={`badge badge-${booking.paymentStatus === 'completed' ? 'success' : 'warning'}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <Link 
                          to={`/bookings/${booking._id}`} 
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </Link>
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <FiXCircle size={14} /> Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <style jsx>{`
        .dashboard-page {
          padding: 2rem 0;
          min-height: 80vh;
          background: var(--background);
        }

        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .dashboard-header {
          margin-bottom: 2rem;
        }

        .dashboard-header h1 {
          font-size: 2rem;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
        }

        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid var(--gray-200);
          border-top-color: var(--primary);
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin: 1rem 0 0.5rem;
          color: var(--text-primary);
        }

        .empty-state p {
          color: var(--text-secondary);
          margin-bottom: 1.5rem;
        }

        .bookings-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          overflow-x: auto;
        }

        .bookings-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 900px;
        }

        .bookings-table thead {
          background: var(--gray-50);
        }

        .bookings-table th {
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: var(--text-primary);
          border-bottom: 2px solid var(--gray-200);
          font-size: 0.875rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .bookings-table td {
          padding: 1rem;
          border-bottom: 1px solid var(--gray-100);
          vertical-align: middle;
        }

        .bookings-table tbody tr:hover {
          background: var(--gray-50);
        }

        .room-info {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .room-info strong {
          color: var(--text-primary);
          font-size: 0.95rem;
        }

        .room-info small {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.8rem;
        }

        .date-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-secondary);
          font-size: 0.9rem;
        }

        .text-primary {
          color: var(--primary) !important;
        }

        .text-muted {
          color: var(--text-secondary) !important;
        }

        .badge {
          display: inline-block;
          padding: 0.35rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: capitalize;
        }

        .badge-success {
          background: #d4edda;
          color: #155724;
        }

        .badge-warning {
          background: #fff3cd;
          color: #856404;
        }

        .badge-danger {
          background: #f8d7da;
          color: #721c24;
        }

        .badge-info {
          background: #d1ecf1;
          color: #0c5460;
        }

        .badge-secondary {
          background: var(--gray-200);
          color: var(--text-primary);
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          font-size: 0.9rem;
        }

        .btn-sm {
          padding: 0.4rem 0.8rem;
          font-size: 0.85rem;
        }

        .btn-primary {
          background: var(--primary);
          color: white;
        }

        .btn-primary:hover {
          background: var(--primary-dark);
          transform: translateY(-1px);
        }

        .btn-outline-primary {
          background: transparent;
          color: var(--primary);
          border: 1px solid var(--primary);
        }

        .btn-outline-primary:hover {
          background: var(--primary);
          color: white;
        }

        .btn-outline-danger {
          background: transparent;
          color: #dc3545;
          border: 1px solid #dc3545;
        }

        .btn-outline-danger:hover {
          background: #dc3545;
          color: white;
        }

        .mt-2 {
          margin-top: 1rem;
        }

        @media (max-width: 768px) {
          .dashboard-header h1 {
            font-size: 1.5rem;
          }

          .bookings-section {
            padding: 1rem;
          }

          .bookings-table {
            font-size: 0.85rem;
          }

          .bookings-table th,
          .bookings-table td {
            padding: 0.75rem 0.5rem;
          }

          .action-buttons {
            flex-direction: column;
          }

          .btn-sm {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default MyBookings;