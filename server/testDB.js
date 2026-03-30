const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected!');
    console.log('Database:', mongoose.connection.name);
    process.exit(0);
  })
  .catch((err) => {
    console.log('❌ Connection Failed:', err.message);
    process.exit(1);
  });