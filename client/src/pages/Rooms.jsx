import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import RoomCard from '../components/RoomCard';
import api from '../services/api';
import { FiFilter, FiRefreshCw } from 'react-icons/fi';

const Rooms = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
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
    try {
      const params = new URLSearchParams();
      if (filters.sharingType) params.append('sharingType', filters.sharingType);
      if (filters.roomType) params.append('roomType', filters.roomType);
      if (filters.available) params.append('available', filters.available);

      const response = await api.get(`/rooms?${params.toString()}`);
      setRooms(response.data.rooms);
    } catch (error) {
      console.error('Error fetching rooms:', error);
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
    <div className="rooms-page" style={{ padding: '2rem 0' }}>
      <div className="section-container">
        <div className="section-header">
          <h2>Our Rooms</h2>
          <p>Find your perfect accommodation from our wide range of options</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <div className="filters-grid">
            <div className="filter-group">
              <label><FiFilter /> Sharing Type:</label>
              <select
                value={filters.sharingType}
                onChange={(e) => handleFilterChange('sharingType', e.target.value)}
              >
                <option value="">All Types</option>
                <option value="2">2 Sharing</option>
                <option value="3">3 Sharing</option>
                <option value="4">4 Sharing</option>
                <option value="5">5 Sharing</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Room Type:</label>
              <select
                value={filters.roomType}
                onChange={(e) => handleFilterChange('roomType', e.target.value)}
              >
                <option value="">All</option>
                <option value="AC">AC</option>
                <option value="Non-AC">Non-AC</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Availability:</label>
              <select
                value={filters.available}
                onChange={(e) => handleFilterChange('available', e.target.value)}
              >
                <option value="true">Available Only</option>
                <option value="">Show All</option>
              </select>
            </div>

            <button className="btn btn-secondary btn-sm" onClick={resetFilters}>
              <FiRefreshCw /> Reset
            </button>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="empty-state">
            <FiFilter style={{ fontSize: '4rem', color: 'var(--gray-300)' }} />
            <h3>No rooms found</h3>
            <p>Try adjusting your filters to find available rooms</p>
            <button className="btn btn-primary mt-2" onClick={resetFilters}>
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            <p className="text-muted mb-2">
              Found {rooms.length} room{rooms.length !== 1 ? 's' : ''}
            </p>
            <div className="rooms-grid">
              {rooms.map(room => (
                <RoomCard key={room._id} room={room} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Rooms;