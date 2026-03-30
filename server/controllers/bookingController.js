// backend/controllers/bookingController.js
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// Helper function to find bed in room
const findBedInRoom = (room, bedId) => {
  if (!room || !room.beds || !Array.isArray(room.beds) || !bedId) {
    return null;
  }
  
  let bed = room.beds.find(b => b._id && b._id.toString() === bedId.toString());
  
  if (!bed) {
    try {
      bed = room.beds.id(bedId);
    } catch (err) {
      // Ignore errors
    }
  }
  
  return bed;
};

// ✅ Helper function to update availableBeds count
const updateAvailableBeds = async (room) => {
  if (!room || !room.beds) return;
  
  const availableCount = room.beds.filter(bed => 
    !bed.isOccupied && bed.isAvailable !== false
  ).length;
  
  room.availableBeds = availableCount;
  await room.save();
  
  console.log(`Room ${room.roomNumber}: availableBeds updated to ${availableCount}`);
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
  try {
    const { roomId, bedId, checkInDate, checkOutDate, specialRequests } = req.body;

    console.log('Creating booking:', { roomId, bedId, checkInDate, checkOutDate });

    // Validate required fields
    if (!roomId) {
      return res.status(400).json({
        success: false,
        message: 'Room ID is required'
      });
    }

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    if (!room.beds || !Array.isArray(room.beds) || room.beds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Room has no beds configured'
      });
    }

    // Find the bed
    let bed = null;
    
    if (bedId) {
      bed = findBedInRoom(room, bedId);
      
      if (!bed) {
        return res.status(404).json({
          success: false,
          message: 'Bed not found in this room'
        });
      }
      
      if (bed.isOccupied || bed.isAvailable === false) {
        return res.status(400).json({
          success: false,
          message: 'This bed is already occupied'
        });
      }
    } else {
      bed = room.beds.find(b => !b.isOccupied && b.isAvailable !== false);
      
      if (!bed) {
        return res.status(400).json({
          success: false,
          message: 'No available beds in this room'
        });
      }
      
      console.log('Auto-assigned bed:', bed.bedNumber);
    }

    // Calculate total amount
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const months = Math.ceil(days / 30) || 1;
    const totalAmount = months * (room.pricePerBed || room.pricePerMonth || 0);

    console.log('Calculated:', { days, months, totalAmount, bedNumber: bed.bedNumber });

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      room: roomId,
      bed: bed._id,
      checkInDate,
      checkOutDate,
      totalAmount,
      specialRequests: specialRequests || '',
      status: 'pending',
      paymentStatus: 'pending'
    });

    console.log('Booking created:', booking._id);

    // Mark bed as occupied
    bed.isOccupied = true;
    bed.isAvailable = false;
    bed.occupant = req.user._id;
    bed.currentOccupant = req.user._id;
    bed.bookingId = booking._id;
    
    // ✅ UPDATE availableBeds count
    await updateAvailableBeds(room);

    console.log('Bed marked as occupied, availableBeds updated');

    // Populate and return booking
    const populatedBooking = await Booking.findById(booking._id)
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber floor roomType pricePerBed');

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      booking: {
        ...populatedBooking.toObject(),
        bed: {
          _id: bed._id,
          bedNumber: bed.bedNumber
        }
      }
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create booking',
      error: error.message
    });
  }
};

// @desc    Get my bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('room', 'name roomNumber floor roomType pricePerBed images')
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
    console.error('Get my bookings error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:bookingId
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId)
      .populate('user', 'name email phone')
      .populate('room', 'name roomNumber floor roomType pricePerBed images amenities');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    let bedInfo = null;
    try {
      const room = await Room.findById(booking.room._id);
      if (room && booking.bed) {
        const bed = findBedInRoom(room, booking.bed);
        if (bed) {
          bedInfo = { bedNumber: bed.bedNumber, _id: bed._id };
        }
      }
    } catch (err) {
      console.log('Error getting bed info:', err.message);
    }

    res.status(200).json({
      success: true,
      booking: {
        ...booking.toObject(),
        bed: bedInfo || { bedNumber: 'N/A', _id: booking.bed }
      }
    });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:bookingId/cancel
// @access  Private
exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled'
      });
    }

    // Free up the bed
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
            
            // ✅ UPDATE availableBeds count
            await updateAvailableBeds(room);
          }
        }
      } catch (err) {
        console.log('Error freeing bed:', err.message);
      }
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      { status: 'cancelled' },
      { new: true, runValidators: false }
    );

    res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully',
      booking: updatedBooking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
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

// @desc    Update booking status (Admin)
// @route   PUT /api/bookings/:bookingId/status
// @access  Private/Admin
exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    const previousStatus = booking.status;
    
    // If changing to cancelled, free up the bed
    if (status === 'cancelled' && previousStatus !== 'cancelled') {
      const room = await Room.findById(booking.room);
      if (room && booking.bed) {
        const bed = findBedInRoom(room, booking.bed);
        if (bed) {
          bed.isOccupied = false;
          bed.isAvailable = true;
          bed.occupant = null;
          bed.currentOccupant = null;
          bed.bookingId = null;
          
          // ✅ UPDATE availableBeds count
          await updateAvailableBeds(room);
        }
      }
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: `Booking ${status} successfully`,
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};