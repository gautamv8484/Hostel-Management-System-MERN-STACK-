const mongoose = require('mongoose');

const bedSchema = new mongoose.Schema({
  bedNumber: {
    type: Number,
    required: true
  },
  isOccupied: {
    type: Boolean,
    default: false
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  occupant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  currentOccupant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    default: null
  }
});

const roomSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a room name']
  },
  roomNumber: {
    type: String,
    required: [true, 'Please add a room number'],
    unique: true
  },
  floor: {
    type: Number,
    required: true
  },
  sharingType: {
    type: Number,
    enum: [2, 3, 4, 5],
    required: [true, 'Please specify sharing type']
  },
  roomType: {
    type: String,
    enum: ['AC', 'Non-AC'],
    required: [true, 'Please specify room type']
  },
  beds: {
    type: [bedSchema],
    default: []  // Add default empty array
  },
  pricePerBed: {
    type: Number,
    required: [true, 'Please add price per bed']
  },
  pricePerMonth: {
    type: Number
  },
  amenities: {
    type: [String],
    default: []
  },
  images: {
    type: [String],
    default: []
  },
  description: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for available beds count - WITH SAFETY CHECK
roomSchema.virtual('availableBeds').get(function() {
  if (!this.beds || !Array.isArray(this.beds)) {
    return 0;
  }
  return this.beds.filter(bed => !bed.isOccupied && bed.isAvailable !== false).length;
});

// Virtual for total beds - WITH SAFETY CHECK
roomSchema.virtual('totalBeds').get(function() {
  if (!this.beds || !Array.isArray(this.beds)) {
    return 0;
  }
  return this.beds.length;
});

// Ensure virtuals are included in JSON
roomSchema.set('toJSON', { virtuals: true });
roomSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Room', roomSchema);