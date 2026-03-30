const Room = require('../models/Room');

exports.getRooms = async (req, res) => {
  try {
    const { sharingType, roomType, available } = req.query;
    
    let query = { isActive: true };
    
    if (sharingType) {
      query.sharingType = parseInt(sharingType);
    }
    
    if (roomType) {
      query.roomType = roomType;
    }

    let rooms = await Room.find(query).sort('roomNumber');
    
    rooms = rooms.map(room => room.toObject());

    if (available === 'true') {
      rooms = rooms.filter(room => room.availableBeds > 0);
    }

    res.json({
      success: true,
      count: rooms.length,
      rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id)
      .populate('beds.occupant', 'name email');

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room: room.toObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.createRoom = async (req, res) => {
  try {
    const { roomNumber, floor, sharingType, roomType, pricePerBed, amenities, description, images, name } = req.body;

    const beds = [];
    for (let i = 1; i <= sharingType; i++) {
      beds.push({
        bedNumber: i,
        isOccupied: false,
        isAvailable: true,
        occupant: null
      });
    }

    const room = await Room.create({
      name: name || `Room ${roomNumber}`,
      roomNumber,
      floor,
      sharingType,
      roomType,
      beds,
      pricePerBed,
      pricePerMonth: pricePerBed,
      amenities: amenities || [
        '24/7 WiFi',
        'Attached Bathroom',
        'Geyser',
        'RO Water',
        'Breakfast',
        'Lunch',
        'Dinner',
        'Laundry'
      ],
      description,
      images: images || []
    });

    res.status(201).json({
      success: true,
      room: room.toObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    res.json({
      success: true,
      room: room.toObject()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }

    const hasOccupants = room.beds.some(bed => bed.isOccupied);
    if (hasOccupants) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete room with occupied beds'
      });
    }

    await room.deleteOne();

    res.json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getRoomStats = async (req, res) => {
  try {
    const rooms = await Room.find({ isActive: true });
    
    let totalBeds = 0;
    let occupiedBeds = 0;
    let acRooms = 0;
    let nonAcRooms = 0;

    rooms.forEach(room => {
      totalBeds += room.beds.length;
      occupiedBeds += room.beds.filter(bed => bed.isOccupied).length;
      if (room.roomType === 'AC') acRooms++;
      else nonAcRooms++;
    });

    res.json({
      success: true,
      stats: {
        totalRooms: rooms.length,
        totalBeds,
        occupiedBeds,
        availableBeds: totalBeds - occupiedBeds,
        occupancyRate: totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(2) : 0,
        acRooms,
        nonAcRooms
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};