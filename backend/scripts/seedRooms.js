const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load .env from backend folder (parent of scripts folder)
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const Room = require('../models/Room');

// Check if MONGO_URI is loaded
console.log('MONGO_URI:', process.env.MONGO_URI ? '✅ Loaded' : '❌ Not Found');

const sampleRooms = [
  {
    name: 'Deluxe AC Room A1',
    roomNumber: 'A101',
    floor: 1,
    sharingType: 2,
    roomType: 'AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 8000,
    pricePerMonth: 8000,
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'TV'],
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af',
      'https://images.unsplash.com/photo-1540518614846-7eded433c457'
    ],
    description: 'Spacious AC room with 2 sharing, perfect for students',
    isActive: true
  },
  {
    name: 'Economy Non-AC Room B1',
    roomNumber: 'B101',
    floor: 1,
    sharingType: 4,
    roomType: 'Non-AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 3, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 4, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 4500,
    pricePerMonth: 4500,
    amenities: ['WiFi', 'Fan', 'Common Bathroom', 'Study Table', 'Locker'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf'
    ],
    description: 'Budget-friendly 4 sharing room with basic amenities',
    isActive: true
  },
  {
    name: 'Premium AC Room A2',
    roomNumber: 'A201',
    floor: 2,
    sharingType: 3,
    roomType: 'AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 3, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 6500,
    pricePerMonth: 6500,
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'Smart TV', 'Mini Fridge'],
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85',
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c'
    ],
    description: 'Premium 3 sharing AC room with modern facilities',
    isActive: true
  },
  {
    name: 'Standard Non-AC Room C1',
    roomNumber: 'C101',
    floor: 1,
    sharingType: 3,
    roomType: 'Non-AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 3, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 5000,
    pricePerMonth: 5000,
    amenities: ['WiFi', 'Fan', 'Attached Bathroom', 'Study Table', 'Wardrobe'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
      'https://images.unsplash.com/photo-1556020685-ae41abfc9365'
    ],
    description: 'Comfortable 3 sharing room with good ventilation',
    isActive: true
  },
  {
    name: 'Deluxe AC Room B2',
    roomNumber: 'B201',
    floor: 2,
    sharingType: 2,
    roomType: 'AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 7500,
    pricePerMonth: 7500,
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'TV', 'Geyser'],
    images: [
      'https://images.unsplash.com/photo-1631049035182-249067d7618e',
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0'
    ],
    description: 'Luxury 2 sharing AC room with premium amenities',
    isActive: true
  },
  {
    name: 'Budget Dormitory D1',
    roomNumber: 'D101',
    floor: 1,
    sharingType: 5,
    roomType: 'Non-AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 3, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 4, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 5, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 3500,
    pricePerMonth: 3500,
    amenities: ['WiFi', 'Fan', 'Common Bathroom', 'Locker', 'Common Study Area'],
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427'
    ],
    description: 'Affordable 5 sharing dormitory for budget travelers',
    isActive: true
  },
  {
    name: 'Executive AC Room A3',
    roomNumber: 'A301',
    floor: 3,
    sharingType: 2,
    roomType: 'AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 9000,
    pricePerMonth: 9000,
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Study Table', 'Wardrobe', 'Smart TV', 'Mini Fridge', 'Balcony'],
    images: [
      'https://images.unsplash.com/photo-1566665797739-1674de7a421a',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b'
    ],
    description: 'Executive 2 sharing room with balcony and premium facilities',
    isActive: true
  },
  {
    name: 'Standard AC Room C2',
    roomNumber: 'C201',
    floor: 2,
    sharingType: 4,
    roomType: 'AC',
    beds: [
      { bedNumber: 1, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 2, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 3, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null },
      { bedNumber: 4, isOccupied: false, isAvailable: true, occupant: null, currentOccupant: null, bookingId: null }
    ],
    pricePerBed: 5500,
    pricePerMonth: 5500,
    amenities: ['WiFi', 'AC', 'Attached Bathroom', 'Study Table', 'Wardrobe'],
    images: [
      'https://images.unsplash.com/photo-1631049307264-da0ec9d70304',
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6'
    ],
    description: 'Comfortable 4 sharing AC room at affordable price',
    isActive: true
  }
];

const seedRooms = async () => {
  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGO_URI) {
      console.error('❌ MONGO_URI not found in .env file');
      console.log('\n📝 Please create a .env file in your backend folder with:');
      console.log('MONGO_URI=mongodb://localhost:27017/hostel-booking');
      console.log('\nOr for MongoDB Atlas:');
      console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/hostel-booking');
      process.exit(1);
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Clear existing rooms
    await Room.deleteMany({});
    console.log('🗑️  Cleared existing rooms');

    // Insert sample rooms
    const rooms = await Room.insertMany(sampleRooms);
    console.log(`✅ ${rooms.length} rooms created successfully!`);

    // Display summary
    console.log('\n📊 Rooms Summary:');
    console.log('─────────────────────────────────────────────────');
    rooms.forEach(room => {
      console.log(`${room.name} (${room.roomNumber})`);
      console.log(`  Floor: ${room.floor} | Type: ${room.roomType} | Sharing: ${room.sharingType}`);
      console.log(`  Price: ₹${room.pricePerBed}/bed | Beds: ${room.beds.length}`);
      console.log('─────────────────────────────────────────────────');
    });

    // Calculate totals
    const totalRooms = rooms.length;
    const totalBeds = rooms.reduce((sum, room) => sum + room.beds.length, 0);
    const acRooms = rooms.filter(r => r.roomType === 'AC').length;
    const nonAcRooms = rooms.filter(r => r.roomType === 'Non-AC').length;

    console.log('\n📈 Statistics:');
    console.log(`Total Rooms: ${totalRooms}`);
    console.log(`Total Beds: ${totalBeds}`);
    console.log(`AC Rooms: ${acRooms}`);
    console.log(`Non-AC Rooms: ${nonAcRooms}`);
    console.log('\n✨ Database seeded successfully!');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    process.exit(1);
  }
};

seedRooms();