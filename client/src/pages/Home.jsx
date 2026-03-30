import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiUsers, FiStar, FiAward } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
import Amenities from '../components/Amenities';
import RoomCard from '../components/RoomCard';
import api from '../services/api';

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedRooms();
  }, []);

  const fetchFeaturedRooms = async () => {
    try {
      const response = await api.get('/rooms?available=true');
      setFeaturedRooms(response.data.rooms.slice(0, 4));
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-container">
          <div className="hero-content">
            <h1>
              Your Perfect <span>Home Away</span> From Home
            </h1>
            <p>
              Experience comfortable living with modern amenities, nutritious meals, 
              and a vibrant community. Choose from AC and Non-AC rooms with flexible 
              sharing options.
            </p>
            <div className="hero-buttons">
              <Link to="/rooms" className="btn btn-primary btn-lg">
                Browse Rooms <FiArrowRight />
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                Get Started
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Residents</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Rooms Available</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.8</div>
                <div className="stat-label">Star Rating</div>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <div className="hero-card-image">
                <IoBedOutline />
              </div>
              <div className="hero-card-content">
                <h3>Premium 2-Sharing AC Room</h3>
                <p>Starting from ₹8,000/month</p>
              </div>
            </div>
            <div className="floating-badge top-right">
              <div className="floating-badge-icon">
                <FiCheck />
              </div>
              <div>
                <strong>100% Verified</strong>
                <small style={{ display: 'block', color: 'var(--gray-500)' }}>
                  All rooms inspected
                </small>
              </div>
            </div>
            <div className="floating-badge bottom-left">
              <div className="floating-badge-icon">
                <FiStar />
              </div>
              <div>
                <strong>Top Rated</strong>
                <small style={{ display: 'block', color: 'var(--gray-500)' }}>
                  4.8/5 by residents
                </small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <Amenities />

      {/* Room Types Section */}
      <section className="rooms-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Available Room Types</h2>
            <p>Choose the perfect room that fits your needs and budget</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="rooms-grid">
              {featuredRooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/rooms" className="btn btn-primary btn-lg">
              View All Rooms <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ 
        backgroundColor:'#217394',
        padding: '5rem 0',
        color: 'white',
        textAlign: 'center'
      }}>
        <div className="section-container">
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
            Ready to Book Your Stay?
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2rem' }}>
            Join our community of happy residents today!
          </p>
          <Link to="/register" className="btn btn-secondary btn-lg">
            Register Now <FiArrowRight />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;