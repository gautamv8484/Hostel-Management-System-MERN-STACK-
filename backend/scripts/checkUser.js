const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');

const checkUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ MongoDB Connected\n');

    // Get the email you're trying to login with
    const email = 'YOUR_EMAIL_HERE'; // Replace with your email

    const user = await User.findOne({ email });

    if (user) {
      console.log('✅ User found:');
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Role:', user.role);
      console.log('Created:', user.createdAt);
      console.log('Password (hashed):', user.password.substring(0, 20) + '...');
    } else {
      console.log('❌ User NOT found with email:', email);
      
      // Show all users
      console.log('\n📋 All users in database:');
      const allUsers = await User.find({}).select('name email role');
      console.table(allUsers.map(u => ({
        Name: u.name,
        Email: u.email,
        password: u.password,
        Role: u.role
      })));
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
};

checkUser();