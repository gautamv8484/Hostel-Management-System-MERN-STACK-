import React from 'react';
import { Link } from 'react-router-dom';
import { 
  FiFacebook, 
  FiTwitter, 
  FiInstagram, 
  FiMail, 
  FiPhone, 
  FiMapPin 
} from 'react-icons/fi';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>StayEase Hostel</h3>
            <p>
              Experience comfortable and affordable accommodation with modern 
              amenities. Perfect for students and young professionals.
            </p>
            <div className="footer-social">
              <a href="#"><FiFacebook /></a>
              <a href="#"><FiTwitter /></a>
              <a href="#"><FiInstagram /></a>
            </div>
          </div>

          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/rooms">Rooms</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/login">Login</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Room Types</h4>
            <ul>
              <li><Link to="/rooms?sharing=2">2 Sharing</Link></li>
              <li><Link to="/rooms?sharing=3">3 Sharing</Link></li>
              <li><Link to="/rooms?sharing=4">4 Sharing</Link></li>
              <li><Link to="/rooms?sharing=5">5 Sharing</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h4>Contact Us</h4>
            <ul>
              <li>
                <FiMapPin style={{ marginRight: '0.5rem' }} />
                123 Hostel Street, City
              </li>
              <li>
                <FiPhone style={{ marginRight: '0.5rem' }} />
                +91 98765 43210
              </li>
              <li>
                <FiMail style={{ marginRight: '0.5rem' }} />
                info@stayease.com
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2024 StayEase Hostel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;