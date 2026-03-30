import React, { useState } from 'react';
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
  FiCalendar 
} from 'react-icons/fi';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <FiHome />
          <span>StayEase</span>
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
              <span>{user.name || 'User'}</span>
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
                Register
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
    </nav>
  );
};

export default Navbar;