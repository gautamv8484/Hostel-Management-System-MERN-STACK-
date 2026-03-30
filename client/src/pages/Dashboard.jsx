import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiCalendar, FiUser, FiMail, FiPhone, FiArrowRight } from 'react-icons/fi';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Welcome, {user.name}!</h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          {/* Profile Card */}
          <div className="bookings-section">
            <div className="bookings-header">
              <h2><FiUser /> Profile Information</h2>
            </div>
            <div style={{ padding: '1rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>Name</label>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.name}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                  <FiMail /> Email
                </label>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.email}</p>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                  <FiPhone /> Phone
                </label>
                <p style={{ fontSize: '1.1rem', fontWeight: '500' }}>{user.phone}</p>
              </div>
              <div>
                <label style={{ color: 'var(--gray-500)', fontSize: '0.85rem' }}>
                  Account Type
                </label>
                <p style={{ fontSize: '1.1rem', fontWeight: '500', textTransform: 'capitalize' }}>
                  {user.role}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bookings-section">
            <div className="bookings-header">
              <h2>Quick Actions</h2>
            </div>
            <div style={{ padding: '1rem' }}>
              <Link 
                to="/rooms" 
                className="btn btn-primary" 
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Browse Rooms <FiArrowRight />
              </Link>
              <Link 
                to="/my-bookings" 
                className="btn btn-secondary" 
                style={{ width: '100%' }}
              >
                <FiCalendar /> View My Bookings
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;