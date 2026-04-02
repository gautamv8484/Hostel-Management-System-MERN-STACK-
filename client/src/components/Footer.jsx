import React from 'react';
import { Link } from 'react-router-dom';
import { FiZap, FiMail, FiPhone, FiMapPin, FiChevronRight } from 'react-icons/fi';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-glow"></div>
      
      <div className="footer-container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <h3>
              <FiZap /> RUDRAKSHA
            </h3>
            <p>
              Your perfect home away from home. Experience next-generation living 
              with cutting-edge amenities and a vibrant community.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FaFacebookF /></a>
              <a href="#" aria-label="Twitter"><FaTwitter /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
              <a href="#" aria-label="YouTube"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li><Link to="/"><FiChevronRight /> Home</Link></li>
              <li><Link to="/rooms"><FiChevronRight /> Rooms</Link></li>
              <li><Link to="/my-bookings"><FiChevronRight /> My Bookings</Link></li>
              <li><Link to="/register"><FiChevronRight /> Register</Link></li>
            </ul>
          </div>

          {/* Room Types */}
          <div className="footer-column">
            <h4>Room Types</h4>
            <ul>
              <li><Link to="/rooms?sharing=2"><FiChevronRight /> 2-Sharing AC</Link></li>
              <li><Link to="/rooms?sharing=3"><FiChevronRight /> 3-Sharing AC</Link></li>
              <li><Link to="/rooms?sharing=3"><FiChevronRight /> 3-Sharing Non-AC</Link></li>
              <li><Link to="/rooms?sharing=4"><FiChevronRight /> 4-Sharing Non-AC</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h4>Contact Info</h4>
            <ul>
              <li>
                <a href="tel:+919876543210">
                  <FiPhone /> +91 98765 43210
                </a>
              </li>
              <li>
                <a href="mailto:info@rudraksha.com">
                  <FiMail /> info@rudraksha.com
                </a>
              </li>
              <li>
                <a href="#">
                  <FiMapPin /> Mumbai, India
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} RUDRAKSHA. Designed with{' '}
            <span className="heart">❤</span> for the future.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;