import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import api from '../services/api';
import { FiFilter, FiRefreshCw, FiSearch, FiGrid } from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';

const Rooms = () => {
  const [searchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    sharingType: searchParams.get('sharing') || '',
    roomType: '',
    available: 'true'
  });

  useEffect(() => {
    fetchRooms();
  }, [filters]);

  const fetchRooms = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams();
      if (filters.sharingType) params.append('sharingType', filters.sharingType);
      if (filters.roomType) params.append('roomType', filters.roomType);
      if (filters.available) params.append('available', filters.available);

      const response = await api.get(`/rooms?${params.toString()}`);
      
      let roomsData = [];
      
      if (response.data.success && response.data.rooms) {
        roomsData = response.data.rooms;
      } else if (response.data.rooms) {
        roomsData = response.data.rooms;
      } else if (Array.isArray(response.data)) {
        roomsData = response.data;
      }
      
      setRooms(roomsData);
    } catch (err) {
      setError('Failed to load rooms');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setFilters({
      sharingType: '',
      roomType: '',
      available: 'true'
    });
  };

  return (
    <div className="rooms-page">
      <div className="section-container">
        <div className="section-header">
          <div className="section-tag">
            <IoBedOutline /> Browse Rooms
          </div>
          <h2>Find Your <span className="gradient-text">Perfect Space</span></h2>
          <p>Explore our wide range of rooms designed for your comfort</p>
        </div>

        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label><FiFilter /> Sharing Type</label>
              <select
                value={filters.sharingType}
                onChange={(e) => handleFilterChange('sharingType', e.target.value)}
                className="form-control"
              >
                <option value="">All Types</option>
                <option value="2">2 Sharing</option>
                <option value="3">3 Sharing</option>
                <option value="4">4 Sharing</option>
                <option value="5">5 Sharing</option>
              </select>
            </div>

            <div className="filter-group">
              <label><FiGrid /> Room Type</label>
              <select
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
                className="form-control"
              >
                <option value="">All</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>

            <div className="filter-group">
              <label><FiSearch /> Availability</label>
              <select
                value={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.value)}
                className="form-control"
              >
                <option value="true">Available Only</option>
                <option value="">Show All</option>
              </select>
            </div>

            <button className="btn btn-secondary" onClick={resetFilters}>
              <FiRefreshCw /> Reset
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading rooms...</p>
          </div>
        ) : error ? (
          <div className="empty-state">
            <FiFilter />
            <h3>{error}</h3>
            <button className="btn btn-primary mt-2" onClick={fetchRooms}>
              <FiRefreshCw /> Try Again
            </button>
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <IoBedOutline />
            <h3>No rooms found</h3>
            <p>Try adjusting your filters to find available rooms</p>
            <button className="btn btn-primary mt-2" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <div className="results-info">
              <p>Found <span className="gradient-text">{rooms.length}</span> room{rooms.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="rooms-grid">
              {rooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>

      <style jsx>{`
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

        .results-info {
          margin-bottom: 1.5rem;
        }

        .results-info p {
          color: #94A3B8;
          font-size: 1rem;
        }

        .results-info .gradient-text {
          font-weight: 700;
          font-size: 1.25rem;
        }
      `}</style>
    </div>
  );
};

export default Rooms;