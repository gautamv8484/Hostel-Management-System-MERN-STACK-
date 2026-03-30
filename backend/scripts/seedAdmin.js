const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Check if MONGO_URI is loaded
console.log('MONGODB_URI:', process.env.MONGODB_URI ? '✅ Loaded' : '❌ Not Found');



// Import User model directly
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  phone: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

const createAdmin = async () => {
  try {
    // Check if MONGO_URI exists
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGO_URI not found in .env file');
      console.log('\n📝 Please ensure .env file exists in backend folder with:');
      console.log('MONGO_URI=mongodb://localhost:27017/hostel-booking');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'admin@hostel.com' });
    
    if (existingAdmin) {
      console.log('\n⚠️  Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      console.log('Role:', existingAdmin.role);
      
      // Update admin password anyway
      const salt = await bcrypt.genSalt(10);
      existingAdmin.password = await bcrypt.hash('admin123', salt);
      await existingAdmin.save();
      
      console.log('\n✅ Admin password reset to: admin123');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin user
    const admin = await User.create({
      name: 'Admin',
      email: 'admin@hostel.com',
      password: hashedPassword,
      phone: '1234567890',
      role: 'admin',
      isActive: true
    });

    console.log('\n✅ Admin user created successfully!');
    console.log('═══════════════════════════════════');
    console.log('📧 Email: admin@hostel.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Role: admin');
    console.log('═══════════════════════════════════');
    console.log('\n🎉 You can now login with these credentials!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

createAdmin();