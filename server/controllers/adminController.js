const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

// ============ HELPER FUNCTION ============

// Helper function to find bed in room consistently
const findBedInRoom = (room, bedId) => {
  if (!room || !room.beds || !Array.isArray(room.beds) || !bedId) {
    return null;
  }
  
  // Try finding by _id.toString() comparison first
  let bed = room.beds.find(b => b._id.toString() === bedId.toString());
  
  // Fallback to mongoose id() method
  if (!bed) {
    try {
      bed = room.beds.id(bedId);
    } catch (err) {
      // Ignore errors from id() method
    }
  }
  
  return bed;
};

// ============ DASHBOARD STATS ============

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalRooms = await Room.countDocuments({ isActive: true });

    const rooms = await Room.find({ isActive: true });
    
    let totalBeds = 0;
    let availableBeds = 0;
    
    rooms.forEach(room => {
      if (room.beds && Array.isArray(room.beds)) {
        totalBeds += room.beds.length;
        availableBeds += room.beds.filter(bed => !bed.isOccupied && bed.isAvailable !== false).length;
      }
    });
    
    const occupiedBeds = totalBeds - availableBeds;

    const totalBookings = await Booking.countDocuments();
    const confirmedBookings = await Booking.countDocuments({ status: 'confirmed' });
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const cancelledBookings = await Booking.countDocuments({ status: 'cancelled' });
    const checkedInBookings = await Booking.countDocuments({ status: 'checked-in' });

    const revenueResult = await Booking.aggregate([
      { $match: { status: { $in: ['confirmed', 'checked-in', 'checked-out'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);
    const totalRevenue = revenueResult[0]?.total || 0;

    const occupancyRate = totalBeds > 0 
      ? Math.round((occupiedBeds / totalBeds) * 100) 
      : 0;

    res.status(200).json({
      success: true,
      totalUsers,
      totalRooms,
      totalBeds,
      availableBeds,
      occupiedBeds,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      cancelledBookings,
      checkedInBookings,
      totalRevenue,
      occupancyRate
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ============ BOOKING MANAGEMENT ============

// @desc    Get recent bookings
// @route   GET /api/admin/bookings/recent
// @access  Admin
exports.getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber floor roomType pricePerBed')
      .sort({ createdAt: -1 })
      .limit(20);

    const bookingsWithBedInfo = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const room = await Room.findById(booking.room?._id);
          let bedInfo = null;
          
          if (room && booking.bed) {
            const bed = findBedInRoom(room, booking.bed);
            if (bed) {
              bedInfo = { bedNumber: bed.bedNumber, _id: bed._id };
            }
          }
          
          return {
            ...booking.toObject(),
            bed: bedInfo || { bedNumber: 'N/A', _id: booking.bed }
          };
        } catch (err) {
          return {
            ...booking.toObject(),
            bed: { bedNumber: 'N/A', _id: booking.bed }
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      count: bookingsWithBedInfo.length,
      bookings: bookingsWithBedInfo
    });
  } catch (error) {
    console.error('Get recent bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/admin/bookings
// @access  Admin
exports.getAllBookings = async (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber floor roomType pricePerBed')
      .sort({ createdAt: -1 });

    const bookingsWithBedInfo = await Promise.all(
      bookings.map(async (booking) => {
        try {
          const room = await Room.findById(booking.room?._id);
          let bedInfo = null;
          
          if (room && booking.bed) {
            const bed = findBedInRoom(room, booking.bed);
            if (bed) {
              bedInfo = { bedNumber: bed.bedNumber, _id: bed._id };
            }
          }
          
          return {
            ...booking.toObject(),
            bed: bedInfo || { bedNumber: 'N/A', _id: booking.bed }
          };
        } catch (err) {
          return {
            ...booking.toObject(),
            bed: { bedNumber: 'N/A', _id: booking.bed }
          };
        }
      })
    );

    res.status(200).json({
      success: true,
      count: bookingsWithBedInfo.length,
      bookings: bookingsWithBedInfo
    });
  } catch (error) {
    console.error('Get all bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/admin/bookings/:bookingId/status
// @access  Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    console.log('Updating booking:', bookingId, 'to status:', status);

    const validStatuses = ['pending', 'confirmed', 'cancelled', 'checked-in', 'checked-out'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    // Get booking first to access bed and room info
    const bookingData = await Booking.findById(bookingId);
    if (!bookingData) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    // Update bed availability if bed and room exist
    if (bookingData.bed && bookingData.room) {
      try {
        const room = await Room.findById(bookingData.room);
        
        if (room) {
          const bed = findBedInRoom(room, bookingData.bed);
          
          if (bed) {
            console.log('Bed found:', bed.bedNumber);
            
            if (status === 'cancelled' || status === 'checked-out') {
              bed.isOccupied = false;
              bed.isAvailable = true;
              bed.occupant = null;
              bed.currentOccupant = null;
              bed.bookingId = null;
              console.log('Bed freed');
            } else if (status === 'confirmed' || status === 'checked-in') {
              bed.isOccupied = true;
              bed.isAvailable = false;
              bed.occupant = bookingData.user;
              bed.currentOccupant = bookingData.user;
              bed.bookingId = bookingData._id;
              console.log('Bed marked as occupied');
            }
            await room.save();
            console.log('Room saved');
          } else {
            console.log('Warning: Bed not found in room, but continuing...');
          }
        }
      } catch (bedError) {
        console.log('Error updating bed (non-critical):', bedError.message);
      }
    }

    // Update booking status
    const updatedBooking = await Booking.findByIdAndUpdate(
      bookingId,
      { status: status },
      { new: true, runValidators: false }
    ).populate('user', 'name email phone')
     .populate('room', 'name roomNumber floor roomType pricePerBed');

    console.log('Booking status updated successfully');

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status',
      error: error.message
    });
  }
};

// ============ USER MANAGEMENT ============

// @desc    Get recent users
// @route   GET /api/admin/users/recent
// @access  Admin
exports.getRecentUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(20);

    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingsCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithBookings.length,
      users: usersWithBookings
    });
  } catch (error) {
    console.error('Get recent users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password')
      .sort({ createdAt: -1 });

    const usersWithBookings = await Promise.all(
      users.map(async (user) => {
        const bookingsCount = await Booking.countDocuments({ user: user._id });
        return {
          ...user.toObject(),
          bookingsCount
        };
      })
    );

    res.status(200).json({
      success: true,
      count: usersWithBookings.length,
      users: usersWithBookings
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:userId
// @access  Admin
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const bookingsCount = await Booking.countDocuments({ user: user._id });

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        bookingsCount
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:userId
// @access  Admin
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    // Cancel active bookings and free up beds
    const activeBookings = await Booking.find({
      user: userId,
      status: { $in: ['pending', 'confirmed', 'checked-in'] }
    });

    for (const booking of activeBookings) {
      if (booking.room && booking.bed) {
        try {
          const room = await Room.findById(booking.room);
          if (room) {
            const bed = findBedInRoom(room, booking.bed);
            if (bed) {
              bed.isOccupied = false;
              bed.isAvailable = true;
              bed.occupant = null;
              bed.currentOccupant = null;
              bed.bookingId = null;
              await room.save();
            }
          }
        } catch (err) {
          console.log('Error freeing bed:', err.message);
        }
      }
      
      // Update booking status using findByIdAndUpdate to avoid validation issues
      await Booking.findByIdAndUpdate(
        booking._id,
        { status: 'cancelled' },
        { runValidators: false }
      );
    }

    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update user role
// @route   PUT /api/admin/users/:userId/role
// @access  Admin
exports.updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.role = role;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'User role updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update user role error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// ============ ROOM MANAGEMENT ============

// @desc    Get all rooms
// @route   GET /api/admin/rooms
// @access  Admin
exports.getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    console.error('Get all rooms error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/admin/rooms/:roomId
// @access  Admin
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.status(200).json({
      success: true,
      room
    });
  } catch (error) {
    console.error('Get room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Create room
// @route   POST /api/admin/rooms
// @access  Admin
exports.createRoom = async (req, res) => {
  try {
    const {
      name,
      roomNumber,
      floor,
      sharingType,
      roomType,
      pricePerBed,
      pricePerMonth,
      amenities,
      images,
      description
    } = req.body;

    // Check if room number exists
    const existingRoom = await Room.findOne({ roomNumber });
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists'
      });
    }

    // Create beds based on sharing type
    const beds = [];
    for (let i = 1; i <= sharingType; i++) {
      beds.push({
        bedNumber: i,
        isOccupied: false,
        isAvailable: true,
        occupant: null,
        currentOccupant: null,
        bookingId: null
      });
    }

    const room = await Room.create({
      name: name || `Room ${roomNumber}`,
      roomNumber,
      floor,
      sharingType,
      roomType,
      beds,
      pricePerBed: pricePerBed || pricePerMonth,
      pricePerMonth: pricePerMonth || pricePerBed,
      amenities: amenities || [],
      images: images || [],
      description: description || `${roomType} room with ${sharingType} sharing`,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      room
    });
  } catch (error) {
    console.error('Create room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/admin/rooms/:roomId
// @access  Admin
exports.updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const updates = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check if changing sharing type with active bookings
    if (updates.sharingType && updates.sharingType !== room.sharingType) {
      const activeBookings = await Booking.countDocuments({
        room: roomId,
        status: { $in: ['pending', 'confirmed', 'checked-in'] }
      });

      if (activeBookings > 0) {
        return res.status(400).json({
          success: false,
          message: 'Cannot change sharing type with active bookings'
        });
      }

      // Recreate beds
      const beds = [];
      for (let i = 1; i <= updates.sharingType; i++) {
        beds.push({
          bedNumber: i,
          isOccupied: false,
          isAvailable: true,
          occupant: null,
          currentOccupant: null,
          bookingId: null
        });
      }
      room.beds = beds;
    }

    // Update fields
    if (updates.name) room.name = updates.name;
    if (updates.roomNumber) room.roomNumber = updates.roomNumber;
    if (updates.floor !== undefined) room.floor = updates.floor;
    if (updates.roomType) room.roomType = updates.roomType;
    if (updates.pricePerBed) {
      room.pricePerBed = updates.pricePerBed;
      room.pricePerMonth = updates.pricePerBed;
    }
    if (updates.pricePerMonth) {
      room.pricePerMonth = updates.pricePerMonth;
      room.pricePerBed = updates.pricePerMonth;
    }
    if (updates.amenities) room.amenities = updates.amenities;
    if (updates.images) room.images = updates.images;
    if (updates.description) room.description = updates.description;
    if (updates.isActive !== undefined) room.isActive = updates.isActive;

    await room.save();

    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      room
    });
  } catch (error) {
    console.error('Update room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/admin/rooms/:roomId
// @access  Admin
exports.deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    // Check for active bookings
    const activeBookings = await Booking.countDocuments({
      room: roomId,
      status: { $in: ['pending', 'confirmed', 'checked-in'] }
    });

    if (activeBookings > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with active bookings'
      });
    }

    await Room.findByIdAndDelete(roomId);

    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    console.error('Delete room error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Toggle room status
// @route   PUT /api/admin/rooms/:roomId/toggle
// @access  Admin
exports.toggleRoomStatus = async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    room.isActive = !room.isActive;
    await room.save();

    res.status(200).json({
      success: true,
      message: `Room ${room.isActive ? 'activated' : 'deactivated'} successfully`,
      room
    });
  } catch (error) {
    console.error('Toggle room status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};