import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCheck, FiUsers, FiStar, FiPlay, FiZap, FiShield, FiAward } from 'react-icons/fi';
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
        {/* Animated Orbs */}
        <div className="hero-orbs">
          <div className="orb orb-1"></div>
          <div className="orb orb-2"></div>
          <div className="orb orb-3"></div>
        </div>

        <div className="hero-container">
          <div className="hero-content">
            {/* Badge */}
            <div className="hero-badge">
              <FiZap />
              <span>Premium Hostel Experience</span>
            </div>

            <h1>
              Your Perfect <span>Home Away</span> From Home
            </h1>
            <p>
              Experience next-generation living with cutting-edge amenities, 
              smart room controls, and a vibrant community. Your future home awaits.
            </p>
            <div className="hero-buttons">
              <Link to="/rooms" className="btn btn-primary btn-lg">
                <FiArrowRight /> Explore Rooms
              </Link>
              <Link to="/register" className="btn btn-secondary btn-lg">
                <FiPlay /> Get Started
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">500+</div>
                <div className="stat-label">Happy Residents</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Smart Rooms</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">4.9</div>
                <div className="stat-label">User Rating</div>
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
                <FiShield />
              </div>
              <div>
                <strong>100% Verified</strong>
                <small>All rooms inspected</small>
              </div>
            </div>
            <div className="floating-badge bottom-left">
              <div className="floating-badge-icon">
                <FiStar />
              </div>
              <div>
                <strong>Top Rated</strong>
                <small>4.9/5 by residents</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card-home">
            <div className="stat-card-icon">
              <FiUsers />
            </div>
            <div className="stat-card-number">500+</div>
            <div className="stat-card-label">Happy Residents</div>
          </div>
          <div className="stat-card-home">
            <div className="stat-card-icon">
              <IoBedOutline />
            </div>
            <div className="stat-card-number">50+</div>
            <div className="stat-card-label">Total Rooms</div>
          </div>
          <div className="stat-card-home">
            <div className="stat-card-icon">
              <FiCheck />
            </div>
            <div className="stat-card-number">150+</div>
            <div className="stat-card-label">Available Beds</div>
          </div>
          <div className="stat-card-home">
            <div className="stat-card-icon">
              <FiAward />
            </div>
            <div className="stat-card-number">4.9★</div>
            <div className="stat-card-label">Average Rating</div>
          </div>
        </div>
      </section>

      {/* Amenities Section */}
      <Amenities />

      {/* Room Types Section */}
      <section className="rooms-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-tag">
              <IoBedOutline /> Our Rooms
            </div>
            <h2>Choose Your <span className="gradient-text">Perfect Space</span></h2>
            <p>From budget-friendly to premium suites, find the room that matches your lifestyle</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading rooms...</p>
            </div>
          ) : (
            <div className="rooms-grid">
              {featuredRooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          )}

          <div className="section-footer">
            <Link to="/rooms" className="btn btn-primary btn-lg">
              View All Rooms <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="section-container">
          <div className="cta-card">
            <div className="cta-content">
              <h2>Ready to Experience the Future?</h2>
              <p>Join our community of happy residents and elevate your living experience</p>
              <Link to="/register" className="btn btn-primary btn-lg">
                <FiZap /> Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid #22D3EE;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #22D3EE;
          margin-bottom: 1.5rem;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(34, 211, 238, 0.4); }
          50% { box-shadow: 0 0 0 10px rgba(34, 211, 238, 0); }
        }

        .hero-orbs {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          overflow: hidden;
          pointer-events: none;
        }

        .orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          animation: orbFloat 20s ease-in-out infinite;
        }

        .orb-1 {
          width: 500px;
          height: 500px;
          background: rgba(168, 85, 247, 0.2);
          top: -200px;
          right: -100px;
        }

        .orb-2 {
          width: 400px;
          height: 400px;
          background: rgba(34, 211, 238, 0.15);
          bottom: -150px;
          left: -100px;
          animation-delay: -5s;
        }

        .orb-3 {
          width: 300px;
          height: 300px;
          background: rgba(236, 72, 153, 0.1);
          top: 50%;
          left: 30%;
          animation-delay: -10s;
        }

        @keyframes orbFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 30px) scale(0.9); }
        }

        .section-tag {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(168, 85, 247, 0.1);
          border: 1px solid #A855F7;
          border-radius: 50px;
          font-size: 0.85rem;
          color: #A855F7;
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 2px;
        }

        .section-footer {
          text-align: center;
          margin-top: 3rem;
        }

        /* Stats Section */
        .stats-section {
          padding: 4rem 0;
          background: rgba(17, 24, 39, 0.8);
          backdrop-filter: blur(20px);
          border-top: 1px solid rgba(34, 211, 238, 0.15);
          border-bottom: 1px solid rgba(34, 211, 238, 0.15);
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 2rem;
        }

        .stat-card-home {
          text-align: center;
          padding: 2rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 20px;
          border: 1px solid rgba(34, 211, 238, 0.15);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .stat-card-home::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(135deg, #22D3EE, #A855F7, #EC4899);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .stat-card-home:hover {
          transform: translateY(-8px);
          border-color: #22D3EE;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.3);
        }

        .stat-card-home:hover::before {
          transform: scaleX(1);
        }

        .stat-card-home .stat-card-icon {
          width: 70px;
          height: 70px;
          margin: 0 auto 1.5rem;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          color: #0A0F1C;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.4);
        }

        .stat-card-home .stat-card-number {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          background: linear-gradient(135deg, #22D3EE, #A855F7, #EC4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 0.5rem;
        }

        .stat-card-home .stat-card-label {
          color: #64748B;
          font-size: 0.95rem;
        }

        /* CTA Section */
        .cta-section {
          padding: 8rem 0;
          position: relative;
          overflow: hidden;
        }

        .cta-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 30% 50%, rgba(168, 85, 247, 0.2) 0%, transparent 50%),
            radial-gradient(circle at 70% 50%, rgba(34, 211, 238, 0.2) 0%, transparent 50%);
        }

        .cta-card {
          max-width: 900px;
          margin: 0 auto;
          padding: 4rem;
          background: rgba(17, 24, 39, 0.85);
          border-radius: 32px;
          border: 1px solid rgba(34, 211, 238, 0.2);
          text-align: center;
          position: relative;
          overflow: hidden;
          backdrop-filter: blur(20px);
        }

        .cta-card::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: conic-gradient(from 0deg, transparent, #22D3EE, transparent, #A855F7, transparent);
          animation: rotateBorder 8s linear infinite;
          opacity: 0.1;
        }

        @keyframes rotateBorder {
          100% { transform: rotate(360deg); }
        }

        .cta-content {
          position: relative;
          z-index: 1;
        }

        .cta-content h2 {
          font-family: 'Orbitron', sans-serif;
          font-size: 2.5rem;
          font-weight: 800;
          color: #F8FAFC;
          margin-bottom: 1rem;
        }

        .cta-content p {
          font-size: 1.2rem;
          color: #94A3B8;
          margin-bottom: 2rem;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }

          .cta-card {
            padding: 2.5rem 1.5rem;
          }

          .cta-content h2 {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Home;