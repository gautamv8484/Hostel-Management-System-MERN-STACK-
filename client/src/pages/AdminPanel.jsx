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
  FiRefreshCw,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiEye,
  FiToggleLeft,
  FiToggleRight,
  FiX,
  FiZap,
  FiActivity,
  FiLayers
} from 'react-icons/fi';
import { IoBedOutline } from 'react-icons/io5';
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
      
      const statsResponse = await api.get('/admin/stats');
      setStats(statsResponse.data);

      const bookingsResponse = await api.get('/admin/bookings/recent');
      setRecentBookings(bookingsResponse.data.bookings || []);

      const usersResponse = await api.get('/admin/users/recent');
      setRecentUsers(usersResponse.data.users || []);

      const roomsResponse = await api.get('/admin/rooms');
      setAllRooms(roomsResponse.data.rooms || []);

    } catch (error) {
      console.error('Fetch error:', error);
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  // Room Handlers
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

  const handleViewRoom = (room) => {
    setViewingRoom(room);
    setShowViewModal(true);
  };

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
      toast.error(error.response?.data?.message || 'Failed to save room');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await api.delete(`/admin/rooms/${roomId}`);
      toast.success('Room deleted successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    }
  };

  const handleToggleRoomStatus = async (roomId) => {
    try {
      await api.put(`/admin/rooms/${roomId}/toggle`);
      toast.success('Room status updated!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to update room status');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/admin/bookings/${bookingId}/status`, { status });
      toast.success(`Booking ${status} successfully!`);
      fetchAdminData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update booking');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success('User deleted successfully!');
      fetchAdminData();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  // Stat Card Component
  const StatCard = ({ icon: Icon, title, value, color, subValue }) => (
    <div className="admin-stat-card">
      <div className={`stat-icon ${color}`}>
        <Icon size={24} />
      </div>
      <div className="stat-details">
        <h3>{value}</h3>
        <p>{title}</p>
        {subValue && <span className="stat-sub">{subValue}</span>}
      </div>
      <div className="stat-glow"></div>
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
    const { color, icon: StatusIcon } = config[status] || config.pending;
    return (
      <span className={`status-badge badge-${color}`}>
        <StatusIcon size={12} /> {status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      {/* Admin Header */}
      <div className="admin-header">
        <div className="header-content">
          <div className="header-icon">
            <FiZap />
          </div>
          <div>
            <h1>Admin Dashboard</h1>
            <p>Manage your hostel operations</p>
          </div>
        </div>
        <button className="btn btn-glass" onClick={fetchAdminData}>
          <FiRefreshCw /> Refresh
        </button>
      </div>

      {/* Stats Grid */}
      <div className="admin-stats-grid">
        <StatCard
          icon={FiUsers}
          title="Total Users"
          value={stats.totalUsers}
          color="cyan"
        />
        <StatCard
          icon={FiHome}
          title="Total Rooms"
          value={stats.totalRooms}
          color="purple"
        />
        <StatCard
          icon={IoBedOutline}
          title="Total Beds"
          value={stats.totalBeds}
          color="pink"
          subValue={`${stats.availableBeds} available`}
        />
        <StatCard
          icon={FiCalendar}
          title="Bookings"
          value={stats.totalBookings}
          color="green"
        />
        <StatCard
          icon={FiDollarSign}
          title="Revenue"
          value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
          color="yellow"
        />
        <StatCard
          icon={FiTrendingUp}
          title="Occupancy"
          value={`${stats.occupancyRate || 0}%`}
          color="cyan"
        />
      </div>

      {/* Tabs */}
      <div className="admin-tabs">
        {[
          { id: 'overview', icon: FiActivity, label: 'Overview' },
          { id: 'rooms', icon: FiHome, label: 'Rooms' },
          { id: 'bookings', icon: FiCalendar, label: 'Bookings' },
          { id: 'users', icon: FiUsers, label: 'Users' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <tab.icon /> {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="admin-content">
        
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="overview-section">
            <div className="overview-grid">
              {/* Booking Summary */}
              <div className="overview-card">
                <h3><FiLayers /> Booking Summary</h3>
                <div className="summary-items">
                  <div className="summary-item">
                    <span className="dot green"></span>
                    <span>Confirmed</span>
                    <strong>{stats.confirmedBookings || 0}</strong>
                  </div>
                  <div className="summary-item">
                    <span className="dot yellow"></span>
                    <span>Pending</span>
                    <strong>{stats.pendingBookings || 0}</strong>
                  </div>
                  <div className="summary-item">
                    <span className="dot red"></span>
                    <span>Cancelled</span>
                    <strong>{stats.cancelledBookings || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Room Summary */}
              <div className="overview-card">
                <h3><IoBedOutline /> Room Summary</h3>
                <div className="summary-items">
                  <div className="summary-item">
                    <span>Total Beds</span>
                    <strong>{stats.totalBeds || 0}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Available</span>
                    <strong className="text-success">{stats.availableBeds || 0}</strong>
                  </div>
                  <div className="summary-item">
                    <span>Occupied</span>
                    <strong className="text-danger">{(stats.totalBeds - stats.availableBeds) || 0}</strong>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="overview-card">
                <h3><FiZap /> Quick Actions</h3>
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

            {/* Recent Bookings */}
            <div className="recent-section">
              <h3><FiClock /> Recent Bookings</h3>
              {recentBookings.length === 0 ? (
                <p className="no-data">No recent bookings</p>
              ) : (
                <div className="recent-list">
                  {recentBookings.slice(0, 5).map((booking) => (
                    <div key={booking._id} className="recent-item">
                      <div className="recent-info">
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

        {/* Rooms Tab */}
        {activeTab === 'rooms' && (
          <div className="rooms-section">
            <div className="section-header">
              <h3><FiHome /> Manage Rooms ({allRooms.length})</h3>
              <button className="btn btn-primary" onClick={handleAddRoom}>
                <FiPlus /> Add Room
              </button>
            </div>

            {allRooms.length === 0 ? (
              <div className="empty-state">
                <IoBedOutline />
                <h3>No Rooms Yet</h3>
                <p>Start by adding your first room</p>
                <button className="btn btn-primary" onClick={handleAddRoom}>
                  <FiPlus /> Add First Room
                </button>
              </div>
            ) : (
              <div className="admin-rooms-grid">
                {allRooms.map((room) => (
                  <div key={room._id} className={`admin-room-card ${!room.isActive ? 'inactive' : ''}`}>
                    <div className="room-image">
                      {room.images?.[0] ? (
                        <img src={room.images[0]} alt={room.name} />
                      ) : (
                        <div className="placeholder-image">
                          <IoBedOutline />
                        </div>
                      )}
                      <div className="room-badges">
                        <span className={`type-badge ${room.roomType === 'AC' ? 'ac' : 'non-ac'}`}>
                          {room.roomType}
                        </span>
                        {!room.isActive && <span className="inactive-badge">Inactive</span>}
                      </div>
                      <span className="price-badge">₹{room.pricePerBed}/bed</span>
                    </div>

                    <div className="room-details">
                      <h4>{room.name}</h4>
                      <p className="room-meta">Room {room.roomNumber} | Floor {room.floor}</p>
                      
                      <div className="room-stats">
                        <span><IoBedOutline /> {room.sharingType} Sharing</span>
                        <span><FiCheckCircle /> {room.availableBeds}/{room.totalBeds}</span>
                      </div>

                      {room.amenities?.length > 0 && (
                        <div className="room-amenities">
                          {room.amenities.slice(0, 3).map((amenity, idx) => (
                            <span key={idx} className="amenity-chip">{amenity}</span>
                          ))}
                          {room.amenities.length > 3 && (
                            <span className="amenity-chip more">+{room.amenities.length - 3}</span>
                          )}
                        </div>
                      )}

                      <div className="room-actions">
                        <button className="action-btn view" onClick={() => handleViewRoom(room)} title="View">
                          <FiEye />
                        </button>
                        <button className="action-btn edit" onClick={() => handleEditRoom(room)} title="Edit">
                          <FiEdit />
                        </button>
                        <button className="action-btn toggle" onClick={() => handleToggleRoomStatus(room._id)} title="Toggle Status">
                          {room.isActive ? <FiToggleRight /> : <FiToggleLeft />}
                        </button>
                        <button className="action-btn delete" onClick={() => handleDeleteRoom(room._id)} title="Delete">
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === 'bookings' && (
          <div className="bookings-section">
            <div className="section-header">
              <h3><FiCalendar /> Recent Bookings ({recentBookings.length})</h3>
            </div>

            {recentBookings.length === 0 ? (
              <div className="empty-state">
                <FiCalendar />
                <h3>No Bookings Yet</h3>
                <p>Bookings will appear here</p>
              </div>
            ) : (
              <div className="table-wrapper">
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
                        <td><code>#{booking._id?.slice(-6)}</code></td>
                        <td>
                          <div className="user-cell">
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
                        <td><span className="amount">₹{booking.totalAmount || 0}</span></td>
                        <td>{getStatusBadge(booking.status)}</td>
                        <td>
                          <div className="table-actions">
                            {booking.status === 'pending' && (
                              <>
                                <button
                                  className="btn-action success"
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'confirmed')}
                                >
                                  <FiCheckCircle /> Confirm
                                </button>
                                <button
                                  className="btn-action danger"
                                  onClick={() => handleUpdateBookingStatus(booking._id, 'cancelled')}
                                >
                                  <FiXCircle /> Cancel
                                </button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <button
                                className="btn-action info"
                                onClick={() => handleUpdateBookingStatus(booking._id, 'checked-in')}
                              >
                                Check In
                              </button>
                            )}
                            {booking.status === 'checked-in' && (
                              <button
                                className="btn-action secondary"
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

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-section">
            <div className="section-header">
              <h3><FiUsers /> Recent Users ({recentUsers.length})</h3>
            </div>

            {recentUsers.length === 0 ? (
              <div className="empty-state">
                <FiUsers />
                <h3>No Users Yet</h3>
                <p>Users will appear here</p>
              </div>
            ) : (
              <div className="table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentUsers.map((user) => (
                      <tr key={user._id}>
                        <td><code>#{user._id?.slice(-6)}</code></td>
                        <td><strong>{user.name}</strong></td>
                        <td>{user.email}</td>
                        <td>{user.phone || 'N/A'}</td>
                        <td>
                          <span className={`status-badge badge-${user.role === 'admin' ? 'danger' : 'info'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          {user.createdAt 
                            ? format(new Date(user.createdAt), 'MMM dd, yyyy')
                            : 'N/A'}
                        </td>
                        <td>
                          {user.role !== 'admin' && (
                            <button
                              className="btn-action danger"
                              onClick={() => handleDeleteUser(user._id)}
                            >
                              <FiTrash2 /> Delete
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

      {/* Add/Edit Room Modal */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingRoom ? '✏️ Edit Room' : '➕ Add New Room'}</h3>
              <button className="modal-close" onClick={() => setShowRoomModal(false)}>
                <FiX />
              </button>
            </div>

            <form onSubmit={handleRoomSubmit} className="room-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Room Name *</label>
                  <input
                    type="text"
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                  className="form-control"
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
                  className="form-control"
                  value={roomForm.amenities}
                  onChange={(e) => setRoomForm({ ...roomForm, amenities: e.target.value })}
                  placeholder="WiFi, AC, TV, Attached Bathroom"
                />
              </div>

              <div className="form-group">
                <label>Image URLs (comma separated)</label>
                <input
                  type="text"
                  className="form-control"
                  value={roomForm.images}
                  onChange={(e) => setRoomForm({ ...roomForm, images: e.target.value })}
                  placeholder="https://example.com/image1.jpg"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                  {formLoading ? 'Saving...' : (editingRoom ? 'Update Room' : 'Add Room')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Room Modal */}
      {showViewModal && viewingRoom && (
        <div className="modal-overlay" onClick={() => setShowViewModal(false)}>
          <div className="modal-content view-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3><FiHome /> Room Details</h3>
              <button className="modal-close" onClick={() => setShowViewModal(false)}>
                <FiX />
              </button>
            </div>

            <div className="view-content">
              {viewingRoom.images?.[0] && (
                <img src={viewingRoom.images[0]} alt={viewingRoom.name} className="view-image" />
              )}

              <div className="view-details">
                <h2>{viewingRoom.name}</h2>
                <p className="view-meta">Room {viewingRoom.roomNumber} | Floor {viewingRoom.floor}</p>
                
                <div className="view-badges">
                  <span className={`type-badge ${viewingRoom.roomType === 'AC' ? 'ac' : 'non-ac'}`}>
                    {viewingRoom.roomType}
                  </span>
                  <span className="sharing-badge">{viewingRoom.sharingType} Sharing</span>
                  <span className="price-tag">₹{viewingRoom.pricePerBed}/bed</span>
                </div>

                {viewingRoom.description && (
                  <div className="view-section">
                    <h4>Description</h4>
                    <p>{viewingRoom.description}</p>
                  </div>
                )}

                <div className="view-section">
                  <h4>Bed Status</h4>
                  <div className="beds-status">
                    {viewingRoom.beds?.map((bed) => (
                      <div key={bed._id} className={`bed-chip ${bed.isOccupied ? 'occupied' : 'available'}`}>
                        Bed {bed.bedNumber}
                        <span>{bed.isOccupied ? '🔴' : '🟢'}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {viewingRoom.amenities?.length > 0 && (
                  <div className="view-section">
                    <h4>Amenities</h4>
                    <div className="amenities-list">
                      {viewingRoom.amenities.map((amenity, idx) => (
                        <span key={idx} className="amenity-chip">{amenity}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-panel {
          padding: 2rem;
          max-width: 1600px;
          margin: 0 auto;
        }

        .admin-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          color: #94A3B8;
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

        .header-content {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .header-icon {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          color: #0A0F1C;
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.4);
        }

        .admin-header h1 {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.75rem;
          color: #F8FAFC;
          margin: 0;
        }

        .admin-header p {
          color: #64748B;
          margin: 0;
        }

        /* Stats Grid */
        .admin-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .admin-stat-card {
          background: rgba(17, 24, 39, 0.8);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(34, 211, 238, 0.15);
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .admin-stat-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 211, 238, 0.4);
          box-shadow: 0 0 30px rgba(34, 211, 238, 0.2);
        }

        .stat-glow {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #22D3EE, #A855F7, #EC4899);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .admin-stat-card:hover .stat-glow {
          opacity: 1;
        }

        .admin-stat-card .stat-icon {
          width: 56px;
          height: 56px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-icon.cyan { background: rgba(34, 211, 238, 0.15); color: #22D3EE; }
        .stat-icon.purple { background: rgba(168, 85, 247, 0.15); color: #A855F7; }
        .stat-icon.pink { background: rgba(236, 72, 153, 0.15); color: #EC4899; }
        .stat-icon.green { background: rgba(16, 185, 129, 0.15); color: #10B981; }
        .stat-icon.yellow { background: rgba(251, 191, 36, 0.15); color: #FBBF24; }

        .stat-details h3 {
          font-family: 'Orbitron', sans-serif;
          font-size: 1.75rem;
          font-weight: 700;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0;
        }

        .stat-details p {
          color: #64748B;
          font-size: 0.9rem;
          margin: 0;
        }

        .stat-sub {
          font-size: 0.75rem;
          color: #10B981;
        }

        /* Tabs */
        .admin-tabs {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          background: rgba(17, 24, 39, 0.6);
          padding: 0.5rem;
          border-radius: 16px;
          border: 1px solid rgba(34, 211, 238, 0.1);
          overflow-x: auto;
        }

        .tab-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.875rem 1.5rem;
          border: none;
          background: transparent;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          color: #64748B;
          white-space: nowrap;
          font-family: inherit;
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          color: #0A0F1C;
          box-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
        }

        .tab-btn:hover:not(.active) {
          background: rgba(34, 211, 238, 0.1);
          color: #22D3EE;
        }

        /* Admin Content */
        .admin-content {
          background: rgba(17, 24, 39, 0.6);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(34, 211, 238, 0.1);
          min-height: 400px;
        }

        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-header h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin: 0;
          color: #F8FAFC;
        }

        .section-header h3 svg {
          color: #22D3EE;
        }

        /* Overview */
        .overview-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .overview-card {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(34, 211, 238, 0.1);
        }

        .overview-card h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-size: 1rem;
          color: #F8FAFC;
        }

        .overview-card h3 svg {
          color: #22D3EE;
        }

        .summary-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .summary-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 0;
          color: #94A3B8;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-right: 0.75rem;
        }

        .dot.green { background: #10B981; }
        .dot.yellow { background: #FBBF24; }
        .dot.red { background: #EF4444; }

        .text-success { color: #10B981 !important; }
        .text-danger { color: #EF4444 !important; }

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
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(34, 211, 238, 0.15);
          border-radius: 10px;
          color: #94A3B8;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .quick-btn:hover {
          background: rgba(34, 211, 238, 0.1);
          border-color: #22D3EE;
          color: #22D3EE;
        }

        /* Recent Section */
        .recent-section {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          padding: 1.5rem;
          border: 1px solid rgba(34, 211, 238, 0.1);
        }

        .recent-section h3 {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          color: #F8FAFC;
        }

        .recent-section h3 svg {
          color: #22D3EE;
        }

        .recent-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .recent-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem 1rem;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 10px;
          border: 1px solid rgba(34, 211, 238, 0.08);
        }

        .recent-info strong {
          color: #F8FAFC;
        }

        .recent-info span {
          color: #64748B;
          margin-left: 0.5rem;
        }

        .no-data {
          color: #64748B;
          text-align: center;
          padding: 2rem;
        }

        /* Rooms Grid */
        .admin-rooms-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.5rem;
        }

        .admin-room-card {
          background: rgba(255, 255, 255, 0.02);
          border-radius: 16px;
          overflow: hidden;
          border: 1px solid rgba(34, 211, 238, 0.1);
          transition: all 0.3s ease;
        }

        .admin-room-card:hover {
          transform: translateY(-5px);
          border-color: rgba(34, 211, 238, 0.3);
          box-shadow: 0 10px 30px rgba(34, 211, 238, 0.15);
        }

        .admin-room-card.inactive {
          opacity: 0.6;
        }

        .room-image {
          height: 180px;
          position: relative;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
        }

        .room-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .placeholder-image {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 4rem;
          color: #0A0F1C;
        }

        .room-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          gap: 0.5rem;
        }

        .type-badge {
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .type-badge.ac {
          background: rgba(34, 211, 238, 0.9);
          color: #0A0F1C;
        }

        .type-badge.non-ac {
          background: rgba(251, 191, 36, 0.9);
          color: #0A0F1C;
        }

        .inactive-badge {
          background: rgba(239, 68, 68, 0.9);
          color: white;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .price-badge {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(10, 15, 28, 0.9);
          color: #22D3EE;
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.9rem;
          border: 1px solid rgba(34, 211, 238, 0.3);
        }

        .room-details {
          padding: 1.25rem;
        }

        .room-details h4 {
          margin: 0 0 0.25rem 0;
          color: #F8FAFC;
          font-size: 1.1rem;
        }

        .room-meta {
          color: #64748B;
          font-size: 0.85rem;
          margin-bottom: 0.75rem;
        }

        .room-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.75rem;
          font-size: 0.85rem;
          color: #94A3B8;
        }

        .room-stats span {
          display: flex;
          align-items: center;
          gap: 0.35rem;
        }

        .room-stats svg {
          color: #22D3EE;
        }

        .room-amenities {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 1rem;
        }

        .amenity-chip {
          background: rgba(34, 211, 238, 0.1);
          color: #22D3EE;
          padding: 0.25rem 0.6rem;
          border-radius: 6px;
          font-size: 0.7rem;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }

        .amenity-chip.more {
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          color: #0A0F1C;
          border: none;
        }

        .room-actions {
          display: flex;
          gap: 0.5rem;
          padding-top: 0.75rem;
          border-top: 1px solid rgba(34, 211, 238, 0.1);
        }

        .action-btn {
          flex: 1;
          padding: 0.6rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .action-btn.view {
          background: rgba(34, 211, 238, 0.15);
          color: #22D3EE;
        }

        .action-btn.edit {
          background: rgba(251, 191, 36, 0.15);
          color: #FBBF24;
        }

        .action-btn.toggle {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
        }

        .action-btn.delete {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        /* Table Styles */
        .table-wrapper {
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
          background: rgba(255, 255, 255, 0.03);
          font-weight: 600;
          color: #94A3B8;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 1px;
          border-bottom: 1px solid rgba(34, 211, 238, 0.1);
        }

        .admin-table td {
          padding: 1rem;
          border-bottom: 1px solid rgba(34, 211, 238, 0.05);
          color: #94A3B8;
        }

        .admin-table tbody tr:hover {
          background: rgba(34, 211, 238, 0.03);
        }

        .user-cell {
          display: flex;
          flex-direction: column;
        }

        .user-cell strong {
          color: #F8FAFC;
        }

        .user-cell small {
          color: #64748B;
          font-size: 0.75rem;
        }

        .admin-table code {
          background: rgba(34, 211, 238, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-family: 'Orbitron', monospace;
          font-size: 0.8rem;
          color: #22D3EE;
        }

        .amount {
          font-family: 'Orbitron', sans-serif;
          font-weight: 700;
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .table-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .btn-action {
          display: flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.4rem 0.75rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.8rem;
          font-weight: 500;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .btn-action.success {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .btn-action.danger {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .btn-action.info {
          background: rgba(34, 211, 238, 0.15);
          color: #22D3EE;
          border: 1px solid rgba(34, 211, 238, 0.3);
        }

        .btn-action.secondary {
          background: rgba(148, 163, 184, 0.15);
          color: #94A3B8;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .btn-action:hover {
          transform: scale(1.05);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(10, 15, 28, 0.9);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          padding: 1rem;
        }

        .modal-content {
          background: #111827;
          border-radius: 20px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow-y: auto;
          border: 1px solid rgba(34, 211, 238, 0.2);
          animation: modalSlideIn 0.3s ease;
        }

        .view-modal {
          max-width: 700px;
        }

        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(34, 211, 238, 0.15);
        }

        .modal-header h3 {
          margin: 0;
          color: #F8FAFC;
          font-size: 1.25rem;
        }

        .modal-close {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(34, 211, 238, 0.2);
          border-radius: 10px;
          padding: 0.5rem;
          font-size: 1.25rem;
          color: #64748B;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .modal-close:hover {
          color: #22D3EE;
          border-color: #22D3EE;
        }

        /* Form Styles */
        .room-form {
          padding: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .form-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .form-actions .btn {
          flex: 1;
        }

        /* View Modal Content */
        .view-content {
          padding: 1.5rem;
        }

        .view-image {
          width: 100%;
          height: 250px;
          object-fit: cover;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          border: 1px solid rgba(34, 211, 238, 0.2);
        }

        .view-details h2 {
          margin: 0 0 0.25rem 0;
          color: #F8FAFC;
        }

        .view-meta {
          color: #64748B;
          margin-bottom: 1rem;
        }

        .view-badges {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
        }

        .sharing-badge {
          background: rgba(168, 85, 247, 0.15);
          color: #A855F7;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          border: 1px solid rgba(168, 85, 247, 0.3);
        }

        .price-tag {
          background: linear-gradient(135deg, #22D3EE, #A855F7);
          color: #0A0F1C;
          padding: 0.35rem 0.75rem;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .view-section {
          margin-bottom: 1.5rem;
        }

        .view-section h4 {
          margin: 0 0 0.75rem 0;
          color: #F8FAFC;
          font-size: 1rem;
        }

        .view-section p {
          color: #94A3B8;
          line-height: 1.6;
        }

        .beds-status {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .bed-chip {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          font-size: 0.85rem;
        }

        .bed-chip.available {
          background: rgba(16, 185, 129, 0.15);
          color: #10B981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .bed-chip.occupied {
          background: rgba(239, 68, 68, 0.15);
          color: #EF4444;
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .amenities-list {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .admin-panel {
            padding: 1rem;
          }

          .admin-header {
            flex-direction: column;
            align-items: flex-start;
          }

          .admin-stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .admin-tabs {
            flex-direction: column;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .admin-rooms-grid {
            grid-template-columns: 1fr;
          }

          .overview-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminPanel;