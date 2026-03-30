import React, { useState, useEffect } from 'react';
import { 
  FiUsers, 
  FiHome, 
  FiGrid,
  FiCalendar, 
  FiDollarSign,
  FiTrendingUp,
  FiCheckCircle,
  FiXCircle,
  FiClock,
  FiAlertCircle,
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiX
} from 'react-icons/fi';
import { format } from 'date-fns';
import api from '../services/api';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  // State Management
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalBeds: 0,
    availableBeds: 0,
    totalBookings: 0,
    totalRevenue: 0,
    occupancyRate: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0
  });
  
  const [recentBookings, setRecentBookings] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [allRooms, setAllRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  
  // Room Modal State
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: '',
    roomNumber: '',
    floor: '',
    sharingType: '',
    roomType: 'Non-AC',
    pricePerBed: '',
    description: '',
    amenities: '',
    images: ''
  });
  const [formLoading, setFormLoading] = useState(false);

  // View Room Modal State
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingRoom, setViewingRoom] = useState(null);

  // Fetch all data on mount
  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data);

      // Fetch recent bookings
      const bookingsResponse = await api.get('/admin/bookings/recent');
      setRecentBookings(bookingsResponse.data.bookings || []);

      // Fetch recent users
      const usersResponse = await api.get('/admin/users/recent');
      setRecentUsers(usersResponse.data.users || []);

      // Fetch all rooms
      const roomsResponse = await api.get('/admin/rooms');
      setAllRooms(roomsResponse.data.rooms || []);

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // ============ ROOM HANDLERS ============

  // Open Add Room Modal
  const handleAddRoom = () => {
    setEditingRoom(null);
    setRoomForm({
      name: '',
      roomNumber: '',
      floor: '',
      sharingType: '',
      roomType: 'Non-AC',
      pricePerBed: '',
      description: '',
      amenities: '',
      images: ''
    });
    setShowRoomModal(true);
  };

  // Open Edit Room Modal
  const handleEditRoom = (room) => {
    setEditingRoom(room);
    setRoomForm({
      name: room.name || '',
      roomNumber: room.roomNumber || '',
      floor: room.floor?.toString() || '',
      sharingType: room.sharingType?.toString() || '',
      roomType: room.roomType || 'Non-AC',
      pricePerBed: room.pricePerBed?.toString() || '',
      description: room.description || '',
      amenities: room.amenities?.join(', ') || '',
      images: room.images?.join(', ') || ''
    });
    setShowRoomModal(true);
  };

  // View Room Details
  const handleViewRoom = (room) => {
    setViewingRoom(room);
    setShowViewModal(true);
  };

  // Submit Room Form (Create/Update)
  const handleRoomSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);

    try {
      const roomData = {
        name: roomForm.name,
        roomNumber: roomForm.roomNumber,
        floor: Number(roomForm.floor),
        sharingType: Number(roomForm.sharingType),
        roomType: roomForm.roomType,
        pricePerBed: Number(roomForm.pricePerBed),
        pricePerMonth: Number(roomForm.pricePerBed),
        description: roomForm.description,
        amenities: roomForm.amenities.split(',').map(a => a.trim()).filter(a => a),
        images: roomForm.images.split(',').map(i => i.trim()).filter(i => i)
      };

      if (editingRoom) {
        await api.put(`/admin/rooms/${editingRoom._id}`, roomData);
        toast.success('Room updated successfully!');
      } else {
        await api.post('/admin/rooms', roomData);
        toast.success('Room created successfully!');
      }

      setShowRoomModal(false);
      fetchAdminData();
    } catch (error) {
      console.error('Room submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save room');
    } finally {
      setFormLoading(false);
    }
  };

  // Delete Room
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      await api.delete(`/admin/rooms/${roomId}`);
      toast.success('Room deleted successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  // Toggle Room Status
  const handleToggleRoomStatus = async (roomId) => {
    try {
      await api.put(`/admin/rooms/${roomId}/toggle`);
      toast.success('Room status updated!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update room status');
    }
  };

  // ============ BOOKING HANDLERS ============

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status} successfully!`);
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  // ============ USER HANDLERS ============

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // ============ HELPER COMPONENTS ============

  const StatCard = ({ icon: Icon, title, value, color, subValue }) => (
    <div className="stat-card">
      <div className="stat-icon" style={{ background: `${color}20`, color }}>
        <Icon size={24} />
      </div>
      <div className="stat-details">
        <h3>{value}</h3>
        <p>{title}</p>
        {subValue && <span className="stat-sub">{subValue}</span>}
      </div>
    </div>
  );

  const getStatusBadge = (status) => {
    const config = {
      confirmed: { color: 'success', icon: FiCheckCircle },
      pending: { color: 'warning', icon: FiClock },
      cancelled: { color: 'danger', icon: FiXCircle },
      'checked-in': { color: 'info', icon: FiCheckCircle },
      'checked-out': { color: 'secondary', icon: FiCheckCircle }
    };
    const { color, icon: Icon } = config[status] || config.pending;
    return (
      <span className={`badge badge-${color}`}>
        <Icon size={12} /> {status}
      </span>
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-container">
        
        {/* Header */}
        <div className="admin-header">
          <div className="header-content">
            <h1>🏨 Admin Dashboard</h1>
            <p>Manage your hostel operations</p>
          </div>
          <button className="btn-refresh" onClick={fetchAdminData}>
            <FiRefreshCw size={18} /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <StatCard
            icon={FiUsers}
            title="Total Users"
            value={stats.totalUsers}
            color="#667eea"
          />
          <StatCard
            icon={FiHome}
            title="Total Rooms"
            value={stats.totalRooms}
            color="#f093fb"
          />
          <StatCard
            icon={FiGrid}
            title="Total Beds"
            value={stats.totalBeds}
            color="#4facfe"
            subValue={`${stats.availableBeds} available`}
          />
          <StatCard
            icon={FiCalendar}
            title="Total Bookings"
            value={stats.totalBookings}
            color="#43e97b"
          />
          <StatCard
            icon={FiDollarSign}
            title="Total Revenue"
            value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
            color="#fa709a"
          />
          <StatCard
            icon={FiTrendingUp}
            title="Occupancy Rate"
            value={`${stats.occupancyRate || 0}%`}
            color="#30cfd0"
          />
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            className={`tab-btn ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => setActiveTab('rooms')}
          >
            🏠 Manage Rooms
          </button>
          <button
            className={`tab-btn ${activeTab === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveTab('bookings')}
          >
            📅 Bookings
          </button>
          <button
            className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            👥 Users
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          
          {/* ============ OVERVIEW TAB ============ */}
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="overview-grid">
                
                {/* Booking Summary */}
                <div className="overview-card">
                  <h3>📊 Booking Summary</h3>
                  <div className="summary-items">
                    <div className="summary-item">
                      <span className="dot confirmed"></span>
                      <span>Confirmed</span>
                      <strong>{stats.confirmedBookings || 0}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="dot pending"></span>
                      <span>Pending</span>
                      <strong>{stats.pendingBookings || 0}</strong>
                    </div>
                    <div className="summary-item">
                      <span className="dot cancelled"></span>
                      <span>Cancelled</span>
                      <strong>{stats.cancelledBookings || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Room Summary */}
                <div className="overview-card">
                  <h3>🛏️ Room Summary</h3>
                  <div className="summary-items">
                    <div className="summary-item">
                      <span>Total Beds</span>
                      <strong>{stats.totalBeds || 0}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Available Beds</span>
                      <strong className="text-success">{stats.availableBeds || 0}</strong>
                    </div>
                    <div className="summary-item">
                      <span>Occupied Beds</span>
                      <strong className="text-danger">{stats.occupiedBeds || 0}</strong>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="overview-card">
                  <h3>⚡ Quick Actions</h3>
                  <div className="quick-actions">
                    <button className="quick-btn" onClick={handleAddRoom}>
                      <FiPlus /> Add Room
                    </button>
                    <button className="quick-btn" onClick={() => setActiveTab('bookings')}>
                      <FiCalendar /> View Bookings
                    </button>
                    <button className="quick-btn" onClick={() => setActiveTab('users')}>
                      <FiUsers /> View Users
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="recent-activity">
                <h3>🕒 Recent Bookings</h3>
                {recentBookings.length === 0 ? (
                  <p className="no-data">No recent bookings</p>
                ) : (
                  <div className="activity-list">
                    {recentBookings.slice(0, 5).map((booking) => (
                      <div key={booking._id} className="activity-item">
                        <div className="activity-info">
                          <strong>{booking.user?.name || 'Unknown'}</strong>
                          <span>booked {booking.room?.name || 'Room'}</span>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ============ ROOMS TAB ============ */}
          {activeTab === 'rooms' && (
            <div className="rooms-section">
              <div className="section-header">
                <h3>🏠 Manage Rooms ({allRooms.length})</h3>
                <button className="btn-add" onClick={handleAddRoom}>
                  <FiPlus size={18} /> Add New Room
                </button>
              </div>

              {allRooms.length === 0 ? (
                <div className="empty-state">
                  <FiHome size={64} />
                  <h3>No Rooms Yet</h3>
                  <p>Start by adding your first room</p>
                  <button className="btn-add" onClick={handleAddRoom}>
                    <FiPlus /> Add First Room
                  </button>
                </div>
              ) : (
                <div className="rooms-grid">
                  {allRooms.map((room) => (
                    <div key={room._id} className={`room-card ${!room.isActive ? 'inactive' : ''}`}>
                      
                      {/* Room Image */}
                      <div className="room-image">
                        <img 
                          src={room.images?.[0] || 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304'} 
                          alt={room.name} 
                        />
                        <div className="room-badges">
                          <span className={`badge-type ${room.roomType === 'AC' ? 'ac' : 'non-ac'}`}>
                            {room.roomType}
                          </span>
                          {!room.isActive && <span className="badge-inactive">Inactive</span>}
                        </div>
                        <span className="room-price">₹{room.pricePerBed}/bed</span>
                      </div>

                      {/* Room Details */}
                      <div className="room-details">
                        <h4>{room.name}</h4>
                        <p className="room-number">Room: {room.roomNumber} | Floor: {room.floor}</p>
                        
                        <div className="room-info">
                          <span>🛏️ {room.sharingType} Sharing</span>
                          <span>✅ {room.availableBeds}/{room.totalBeds} Available</span>
                        </div>

                        {/* Amenities */}
                        {room.amenities?.length > 0 && (
                          <div className="room-amenities">
                            {room.amenities.slice(0, 3).map((amenity, idx) => (
                              <span key={idx} className="amenity-tag">{amenity}</span>
                            ))}
                            {room.amenities.length > 3 && (
                              <span className="amenity-tag more">+{room.amenities.length - 3}</span>
                            )}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="room-actions">
                          <button 
                            className="btn-icon view" 
                            onClick={() => handleViewRoom(room)}
                            title="View Details"
                          >
                            <FiEye size={16} />
                          </button>
                          <button 
                            className="btn-icon edit" 
                            onClick={() => handleEditRoom(room)}
                            title="Edit Room"
                          >
                            <FiEdit size={16} />
                          </button>
                          <button 
                            className="btn-icon toggle"
                            onClick={() => handleToggleRoomStatus(room._id)}
                            title={room.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {room.isActive ? <FiToggleRight size={16} /> : <FiToggleLeft size={16} />}
                          </button>
                          <button 
                            className="btn-icon delete" 
                            onClick={() => handleDeleteRoom(room._id)}
                            title="Delete Room"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ BOOKINGS TAB ============ */}
          {activeTab === 'bookings' && (
            <div className="bookings-section">
              <div className="section-header">
                <h3>📅 Recent Bookings ({recentBookings.length})</h3>
              </div>

              {recentBookings.length === 0 ? (
                <div className="empty-state">
                  <FiCalendar size={64} />
                  <h3>No Bookings Yet</h3>
                  <p>Bookings will appear here once users make reservations</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Room</th>
                        <th>Bed</th>
                        <th>Check-in</th>
                        <th>Check-out</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentBookings.map((booking) => (
                        <tr key={booking._id}>
                          <td><code>{booking._id?.slice(-6)}</code></td>
                          <td>
                            <div className="cell-user">
                              <strong>{booking.user?.name || 'N/A'}</strong>
                              <small>{booking.user?.email}</small>
                            </div>
                          </td>
                          <td>{booking.room?.name || 'N/A'}</td>
                          <td>Bed {booking.bed?.bedNumber || 'N/A'}</td>
                          <td>
                            {booking.checkInDate 
                              ? format(new Date(booking.checkInDate), 'MMM dd, yyyy')
                              : 'N/A'}
                          </td>
                          <td>
                            {booking.checkOutDate 
                              ? format(new Date(booking.checkOutDate), 'MMM dd, yyyy')
                              : 'N/A'}
                          </td>
                          <td><strong>₹{booking.totalAmount || 0}</strong></td>
                          <td>{getStatusBadge(booking.status)}</td>
                          <td>
                            <div className="action-buttons">
                              {booking.status === 'pending' && (
                                <>
                                  <button
                                    className="btn-sm success"
                                    onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                  >
                                    ✓ Confirm
                                  </button>
                                  <button
                                    className="btn-sm danger"
                                    onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                                  >
                                    ✕ Cancel
                                  </button>
                                </>
                              )}
                              {booking.status === 'confirmed' && (
                                <button
                                  className="btn-sm info"
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'checked-in')}
                                >
                                  Check In
                                </button>
                              )}
                              {booking.status === 'checked-in' && (
                                <button
                                  className="btn-sm secondary"
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'checked-out')}
                                >
                                  Check Out
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
          )}

          {/* ============ USERS TAB ============ */}
          {activeTab === 'users' && (
            <div className="users-section">
              <div className="section-header">
                <h3>👥 Recent Users ({recentUsers.length})</h3>
              </div>

              {recentUsers.length === 0 ? (
                <div className="empty-state">
                  <FiUsers size={64} />
                  <h3>No Users Yet</h3>
                  <p>Users will appear here once they register</p>
                </div>
              ) : (
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Joined</th>
                        <th>Bookings</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentUsers.map((user) => (
                        <tr key={user._id}>
                          <td><code>{user._id?.slice(-6)}</code></td>
                          <td><strong>{user.name}</strong></td>
                          <td>{user.email}</td>
                          <td>{user.phone || 'N/A'}</td>
                          <td>
                            <span className={`badge badge-${user.role === 'admin' ? 'danger' : 'primary'}`}>
                              {user.role}
                            </span>
                          </td>
                          <td>
                            {user.createdAt 
                              ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                              : 'N/A'}
                          </td>
                          <td>{user.bookingsCount || 0}</td>
                          <td>
                            {user.role !== 'admin' && (
                              <button
                                className="btn-sm danger"
                                onClick={() => handleDeleteUser(user._id)}
                              >
                                <FiTrash2 size={14} /> Delete
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ============ ADD/EDIT ROOM MODAL ============ */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoom ? '✏️ Edit Room' : '➕ Add New Room'}</h3>
              <button className="modal-close" onClick={() => setShowRoomModal(false)}>
                <FiX size={24} />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="room-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Room Name *</label>
                  <input
                    type="text"
                    value={roomForm.name}
                    onChange={(e) => setRoomForm({ ...roomForm, name: e.target.value })}
                    placeholder="e.g., Deluxe AC Room"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Room Number *</label>
                  <input
                    type="text"
                    value={roomForm.roomNumber}
                    onChange={(e) => setRoomForm({ ...roomForm, roomNumber: e.target.value })}
                    placeholder="e.g., A101"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Floor *</label>
                  <input
                    type="number"
                    value={roomForm.floor}
                    onChange={(e) => setRoomForm({ ...roomForm, floor: e.target.value })}
                    placeholder="e.g., 1"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Sharing Type *</label>
                  <select
                    value={roomForm.sharingType}
                    onChange={(e) => setRoomForm({ ...roomForm, sharingType: e.target.value })}
                    required
                  >
                    <option value="">Select Sharing</option>
                    <option value="2">2 Sharing</option>
                    <option value="3">3 Sharing</option>
                    <option value="4">4 Sharing</option>
                    <option value="5">5 Sharing</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Room Type *</label>
                  <select
                    value={roomForm.roomType}
                    onChange={(e) => setRoomForm({ ...roomForm, roomType: e.target.value })}
                    required
                  >
                    <option value="Non-AC">Non-AC</option>
                    <option value="AC">AC</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Price per Bed (₹) *</label>
                  <input
                    type="number"
                    value={roomForm.pricePerBed}
                    onChange={(e) => setRoomForm({ ...roomForm, pricePerBed: e.target.value })}
                    placeholder="e.g., 5000"
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={roomForm.description}
                  onChange={(e) => setRoomForm({ ...roomForm, description: e.target.value })}
                  placeholder="Enter room description..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Amenities (comma separated)</label>
                <input
                  type="text"
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  placeholder="WiFi, AC, TV, Attached Bathroom, etc."
                />
              </div>

              <div className="form-group">
                <label>Image URLs (comma separated)</label>
                <input
                  type="text"
                  value={roomForm.images}
                  onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-cancel" 
                  onClick={() => setShowRoomModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={formLoading}
                >
                  {formLoading ? 'Saving...' : (editingRoom ? 'Update Room' : 'Add Room')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============ VIEW ROOM MODAL ============ */}
      {showViewModal && viewingRoom && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🏠 Room Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FiX size={24} />
              </button>
            </div>

            <div className="view-content">
              {viewingRoom.images?.[0] && (
                <img 
                  src={viewingRoom.images[0]} 
                  alt={viewingRoom.name}
                  className="view-image"
                />
              )}

              <div className="view-details">
                <h2>{viewingRoom.name}</h2>
                <p className="view-room-number">Room {viewingRoom.roomNumber} | Floor {viewingRoom.floor}</p>
                
                <div className="view-badges">
                  <span className={`badge-type ${viewingRoom.roomType === 'AC' ? 'ac' : 'non-ac'}`}>
                    {viewingRoom.roomType}
                  </span>
                  <span className="badge-sharing">{viewingRoom.sharingType} Sharing</span>
                  <span className="badge-price">₹{viewingRoom.pricePerBed}/bed</span>
                </div>

                <div className="view-section">
                  <h4>Description</h4>
                  <p>{viewingRoom.description || 'No description available'}</p>
                </div>

                <div className="view-section">
                  <h4>Bed Status</h4>
                  <div className="beds-status">
                    {viewingRoom.beds?.map((bed) => (
                      <div 
                        key={bed._id} 
                        className={`bed-item ${bed.isOccupied ? 'occupied' : 'available'}`}
                      >
                        <span>Bed {bed.bedNumber}</span>
                        <span>{bed.isOccupied ? '🔴 Occupied' : '🟢 Available'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {viewingRoom.amenities?.length > 0 && (
                  <div className="view-section">
                    <h4>Amenities</h4>
                    <div className="amenities-list">
                      {viewingRoom.amenities.map((amenity, idx) => (
                        <span key={idx} className="amenity-tag">{amenity}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ STYLES ============ */}
      <style jsx>{`
        .admin-panel {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 2rem 1rem;
        }

        .admin-container {
          max-width: 1400px;
          margin: 0 auto;
        }

        /* Header */
        .admin-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .header-content h1 {
          font-size: 2rem;
          color: white;
          margin: 0;
        }

        .header-content p {
          color: rgba(255,255,255,0.8);
          margin: 0.25rem 0 0 0;
        }

        .btn-refresh {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255,255,255,0.2);
          color: white;
          border: 1px solid rgba(255,255,255,0.3);
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-refresh:hover {
          background: rgba(255,255,255,0.3);
        }

        /* Loading */
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: white;
        }

        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 4px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.25rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          transition: transform 0.3s;
        }

        .stat-card:hover {
          transform: translateY(-3px);
        }

        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-details h3 {
          font-size: 1.5rem;
          margin: 0;
          color: #1a1a2e;
        }

        .stat-details p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .stat-sub {
          font-size: 0.75rem;
          color: #10b981;
        }

        /* Tabs */
        .admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          background: white;
          padding: 0.5rem;
          border-radius: 12px;
          overflow-x: auto;
        }

        .tab-btn {
          flex: 1;
          min-width: fit-content;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          color: #6b7280;
          white-space: nowrap;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .tab-btn:hover:not(.active) {
          background: #f3f4f6;
        }

        /* Tab Content */
        .tab-content {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          min-height: 400px;
        }

        /* Section Header */
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-header h3 {
          margin: 0;
          color: #1a1a2e;
        }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: transform 0.3s;
        }

        .btn-add:hover {
          transform: translateY(-2px);
        }

        /* Empty State */
        .empty-state {
          text-align: center;
          padding: 3rem;
          color: #6b7280;
        }

        .empty-state svg {
          opacity: 0.3;
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: #1a1a2e;
          margin-bottom: 0.5rem;
        }

        /* Overview */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .overview-card {
          background: #f9fafb;
          border-radius: 12px;
          padding: 1.5rem;
        }

        .overview-card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.1rem;
          color: #1a1a2e;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 0.5rem;
        }

        .dot.confirmed { background: #10b981; }
        .dot.pending { background: #f59e0b; }
        .dot.cancelled { background: #ef4444; }

        .text-success { color: #10b981; }
        .text-danger { color: #ef4444; }

        .quick-actions {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quick-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .quick-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }

        /* Recent Activity */
        .recent-activity h3 {
          margin-bottom: 1rem;
          color: #1a1a2e;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .activity-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: #f9fafb;
          border-radius: 8px;
        }

        .activity-info span {
          color: #6b7280;
          margin-left: 0.5rem;
        }

        .no-data {
          color: #6b7280;
          text-align: center;
          padding: 2rem;
        }

        /* Rooms Grid */
        .rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .room-card {
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          transition: all 0.3s;
        }

        .room-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }

        .room-card.inactive {
          opacity: 0.6;
        }

        .room-image {
          position: relative;
          height: 180px;
          overflow: hidden;
        }

        .room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .room-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 0.5rem;
        }

        .badge-type {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-type.ac {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .badge-type.non-ac {
          background: #fef3c7;
          color: #d97706;
        }

        .badge-inactive {
          background: #ef4444;
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
        }

        .room-price {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 600;
        }

        .room-details {
          padding: 1.25rem;
        }

        .room-details h4 {
          margin: 0 0 0.25rem 0;
          color: #1a1a2e;
        }

        .room-number {
          color: #6b7280;
          font-size: 0.875rem;
          margin-bottom: 0.75rem;
        }

        .room-info {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .room-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-bottom: 1rem;
        }

        .amenity-tag {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: #6b7280;
        }

        .amenity-tag.more {
          background: #667eea;
          color: white;
        }

        .room-actions {
          display: flex;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid #e5e7eb;
        }

        .btn-icon {
          flex: 1;
          padding: 0.5rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon.view {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .btn-icon.edit {
          background: #fef3c7;
          color: #d97706;
        }

        .btn-icon.toggle {
          background: #d1fae5;
          color: #059669;
        }

        .btn-icon.delete {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-icon:hover {
          transform: scale(1.1);
        }

        /* Tables */
        .table-container {
          overflow-x: auto;
        }

        .admin-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        .admin-table th {
          text-align: left;
          padding: 1rem;
          background: #f9fafb;
          font-weight: 600;
          color: #1a1a2e;
          border-bottom: 2px solid #e5e7eb;
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .admin-table tr:hover {
          background: #f9fafb;
        }

        .cell-user {
          display: flex;
          flex-direction: column;
        }

        .cell-user small {
          color: #6b7280;
          font-size: 0.75rem;
        }

        code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.8rem;
        }

        .action-buttons {
          display: flex;
          gap: 0.5rem;
        }

        .btn-sm {
          padding: 0.4rem 0.75rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-sm.success {
          background: #d1fae5;
          color: #059669;
        }

        .btn-sm.danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .btn-sm.info {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .btn-sm.secondary {
          background: #e5e7eb;
          color: #4b5563;
        }

        .btn-sm:hover {
          transform: scale(1.05);
        }

        /* Badges */
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 0.25rem;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .badge-success {
          background: #d1fae5;
          color: #059669;
        }

        .badge-warning {
          background: #fef3c7;
          color: #d97706;
        }

        .badge-danger {
          background: #fee2e2;
          color: #dc2626;
        }

        .badge-info {
          background: #dbeafe;
          color: #1d4ed8;
        }

        .badge-secondary {
          background: #e5e7eb;
          color: #4b5563;
        }

        .badge-primary {
          background: #dbeafe;
          color: #1d4ed8;
        }

        /* Modal */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0,0,0,0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .view-modal {
          max-width: 700px;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h3 {
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          cursor: pointer;
          color: #6b7280;
          padding: 0;
        }

        .modal-close:hover {
          color: #1a1a2e;
        }

        /* Room Form */
        .room-form {
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-group {
          margin-bottom: 1rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #1a1a2e;
        }

        .form-group input,
        .form-group select,
        .form-group textarea {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }

        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
          outline: none;
          border-color: #667eea;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1rem;
        }

        .btn-cancel,
        .btn-submit {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s;
        }

        .btn-cancel {
          background: #e5e7eb;
          color: #4b5563;
        }

        .btn-submit {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .btn-submit:hover:not(:disabled) {
          transform: translateY(-2px);
        }

        .btn-submit:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        /* View Modal */
        .view-content {
          padding: 1.5rem;
        }

        .view-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 8px;
          margin-bottom: 1.5rem;
        }

        .view-details h2 {
          margin: 0 0 0.25rem 0;
          color: #1a1a2e;
        }

        .view-room-number {
          color: #6b7280;
          margin-bottom: 1rem;
        }

        .view-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .badge-sharing {
          background: #f3f4f6;
          color: #1a1a2e;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .badge-price {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.875rem;
        }

        .view-section {
          margin-bottom: 1.5rem;
        }

        .view-section h4 {
          margin: 0 0 0.75rem 0;
          color: #1a1a2e;
        }

        .beds-status {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 0.5rem;
        }

        .bed-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          border-radius: 8px;
          font-size: 0.875rem;
        }

        .bed-item.available {
          background: #d1fae5;
        }

        .bed-item.occupied {
          background: #fee2e2;
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .header-content h1 {
            font-size: 1.5rem;
          }

          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-tabs {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .rooms-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;