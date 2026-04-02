import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiHome, 
  FiGrid, 
  FiUser, 
  FiLogOut, 
  FiMenu, 
  FiX,
  FiSettings,
  FiCalendar,
  FiZap
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <FiZap className="logo-icon" />
          <span>RUDRAKSHA</span>
        </Link>

        <div className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
          <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
          <NavLink to="/rooms" onClick={closeMobileMenu}>Rooms</NavLink>
          {isAuthenticated && (
            <NavLink to="/my-bookings" onClick={closeMobileMenu}>My Bookings</NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" onClick={closeMobileMenu}>Admin</NavLink>
          )}
        </div>

        <div className="navbar-auth">
          {isAuthenticated && user ? (
            <div className="navbar-user">
              <div className="navbar-avatar">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="user-name">{user.name || 'User'}</span>
              <div className="navbar-dropdown">
                <Link to="/my-bookings" onClick={closeMobileMenu}>
                  <FiCalendar /> My Bookings
                </Link>
                {isAdmin && (
                  <Link to="/admin" onClick={closeMobileMenu}>
                    <FiSettings /> Admin Panel
                  </Link>
                )}
                <button onClick={handleLogout}>
                  <FiLogOut /> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary" onClick={closeMobileMenu}>
                Login
              </Link>
              <Link to="/register" className="btn btn-primary" onClick={closeMobileMenu}>
                <FiZap /> Register
              </Link>
            </>
          )}
        </div>

        <button 
          className="mobile-menu-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      <style jsx>{`
        .logo-icon {
          font-size: 1.75rem;
          color: #22D3EE;
          filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.5));
          animation: logoGlow 3s ease-in-out infinite;
        }

        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 10px rgba(34, 211, 238, 0.5)); }
          50% { filter: drop-shadow(0 0 20px rgba(168, 85, 247, 0.6)); }
        }

        .user-name {
          color: #F8FAFC;
          font-weight: 500;
        }

        @media (max-width: 768px) {
          .user-name {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;