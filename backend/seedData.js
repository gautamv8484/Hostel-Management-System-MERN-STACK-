const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Room = require('./models/Room');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGODB_URI);

const rooms = [
  // 2 Sharing Rooms
  {
    roomNumber: '101',
    floor: 1,
    sharingType: 2,
    roomType: 'AC',
    pricePerBed: 12000,
    description: 'Spacious 2 sharing AC room with attached bathroom and modern amenities.',
    images: ['/images/room-2-ac.jpg']
  },
  {
    roomNumber: '102',
    floor: 1,
    sharingType: 2,
    roomType: 'Non-AC',
    pricePerBed: 8000,
    description: 'Comfortable 2 sharing Non-AC room with attached bathroom.',
    images: ['/images/room-2-nonac.jpg']
  },
  // 3 Sharing Rooms
  {
    roomNumber: '201',
    floor: 2,
    sharingType: 3,
    roomType: 'AC',
    pricePerBed: 10000,
    description: 'Well-ventilated 3 sharing AC room with all amenities.',
    images: ['/images/room-3-ac.jpg']
  },
  {
    roomNumber: '202',
    floor: 2,
    sharingType: 3,
    roomType: 'Non-AC',
    pricePerBed: 7000,
    description: 'Cozy 3 sharing Non-AC room perfect for students.',
    images: ['/images/room-3-nonac.jpg']
  },
  // 4 Sharing Rooms
  {
    roomNumber: '301',
    floor: 3,
    sharingType: 4,
    roomType: 'AC',
    pricePerBed: 8000,
    description: 'Budget-friendly 4 sharing AC room with all basic amenities.',
    images: ['/images/room-4-ac.jpg']
  },
  {
    roomNumber: '302',
    floor: 3,
    sharingType: 4,
    roomType: 'Non-AC',
    pricePerBed: 5500,
    description: 'Economical 4 sharing Non-AC room for budget travelers.',
    images: ['/images/room-4-nonac.jpg']
  },
  // 5 Sharing Rooms
  {
    roomNumber: '401',
    floor: 4,
    sharingType: 5,
    roomType: 'AC',
    pricePerBed: 6500,
    description: 'Most affordable 5 sharing AC room with all essential amenities.',
    images: ['/images/room-5-ac.jpg']
  },
  {
    roomNumber: '402',
    floor: 4,
    sharingType: 5,
    roomType: 'Non-AC',
    pricePerBed: 4500,
    description: 'Budget 5 sharing Non-AC room ideal for students.',
    images: ['/images/room-5-nonac.jpg']
  }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Room.deleteMany();
    console.log('Existing rooms deleted');

    // Create rooms with beds
    for (const roomData of rooms) {
      const beds = [];
      for (let i = 1; i <= roomData.sharingType; i++) {
        beds.push({
          bedNumber: i,
          isOccupied: false,
          occupant: null
        });
      }

      await Room.create({
        ...roomData,
        beds,
        amenities: [
          '24/7 WiFi',
          'Attached Bathroom',
          'Geyser',
          'RO Water',
          'Breakfast',
          'Lunch',
          'Dinner',
          'Laundry',
          'Daily Housekeeping',
          'CCTV Security'
        ]
      });
    }

    console.log('Rooms seeded successfully');

    // Create admin user
    const adminExists = await User.findOne({ email: 'admin@hostel.com' });
    if (!adminExists) {
      await User.create({
        name: 'Admin',
        email: 'admin@hostel.com',
        phone: '9876543210',
        password: 'admin123',
        role: 'admin'
      });
      console.log('Admin user created');
    }

    console.log('Seed data completed!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();