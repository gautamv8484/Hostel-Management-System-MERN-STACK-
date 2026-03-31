// const express = require('express');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const connectDB = require('./config/db');

// // Load env vars
// dotenv.config();

// // Connect to database
// connectDB();

// const app = express();


// // 1. IMPROVED CORS CONFIGURATION
// // Place this BEFORE any other middleware
// const allowedOrigins = [
//   'http://localhost:3000',
//   'http://127.0.0.1:3000',
//   'https://your-app.vercel.app',
//   process.env.FRONTEND_URL,
// ].filter(Boolean); // Cleanly removes undefined/null values



// app.use(cors({
//   origin: function (origin, callback) {
//     // Allow requests with no origin (like mobile apps or curl)
//     if (!origin) return callback(null, true);
    
//     if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
//       return callback(null, true);
//     } else {
//       // Don't throw a hard Error object here; just deny the origin
//       return callback(new Error('CORS Policy Blocked'), false);
//     }
//   },
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));



// // Body parser
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Enable CORS - Production Ready
// // const allowedOrigins = [
// //   'http://localhost:3000',
// //   'http://127.0.0.1:3000',
// //   'https://your-app.vercel.app',
// //   process.env.FRONTEND_URL, // Will be set in production
// // ];

// // Remove undefined/null values
// // const filteredOrigins = allowedOrigins.filter(origin => origin);

// // app.use(cors({
// //   origin: function (origin, callback) {
// //     // Allow requests with no origin (like mobile apps or curl requests)
// //     if (!origin) return callback(null, true);
    
// //     if (filteredOrigins.indexOf(origin) === -1) {
// //       const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
// //       return callback(new Error(msg), false);
// //     }
// //     return callback(null, true);
// //   },
// //   credentials: true,
// //   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// // }));

// // Security Headers
// app.use((req, res, next) => {
//   res.setHeader('X-Content-Type-Options', 'nosniff');
//   res.setHeader('X-Frame-Options', 'DENY');
//   res.setHeader('X-XSS-Protection', '1; mode=block');
//   next();
// });

// // Request logging (only in development)
// if (process.env.NODE_ENV === 'development') {
//   app.use((req, res, next) => {
//     console.log(`${req.method} ${req.path}`);
//     next();
//   });
// }

// // Root route
// app.get('/', (req, res) => {
//   res.json({ 
//     message: 'Hostel Management API',
//     version: '1.0.0',
//     status: 'Active',
//     endpoints: {
//       health: '/api/health',
//       auth: '/api/auth',
//       rooms: '/api/rooms',
//       bookings: '/api/bookings',
//       admin: '/api/admin'
//     }
//   });
// });

// // Health check
// app.get('/api/health', (req, res) => {
//   res.json({ 
//     status: 'OK', 
//     message: 'Hostel Booking API is running',
//     environment: process.env.NODE_ENV || 'development',
//     timestamp: new Date().toISOString()
//   });
// });

// // API Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/rooms', require('./routes/rooms'));
// app.use('/api/bookings', require('./routes/bookings'));
// app.use('/api/admin', require('./routes/admin'));

// // 404 Handler - Must be after all routes
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found',
//     path: req.originalUrl
//   });
// });

// // Global Error Handler - Must be last
// app.use((err, req, res, next) => {
//   console.error('Error:', err.stack);
  
//   // Mongoose validation error
//   if (err.name === 'ValidationError') {
//     const errors = Object.values(err.errors).map(e => e.message);
//     return res.status(400).json({
//       success: false,
//       message: 'Validation Error',
//       errors
//     });
//   }
  
//   // Mongoose duplicate key error
//   if (err.code === 11000) {
//     const field = Object.keys(err.keyValue)[0];
//     return res.status(400).json({
//       success: false,
//       message: `${field} already exists`
//     });
//   }
  
//   // JWT errors
//   if (err.name === 'JsonWebTokenError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Invalid token'
//     });
//   }
  
//   if (err.name === 'TokenExpiredError') {
//     return res.status(401).json({
//       success: false,
//       message: 'Token expired'
//     });
//   }
  
//   // Default error
//   res.status(err.status || 500).json({
//     success: false,
//     message: process.env.NODE_ENV === 'production' 
//       ? 'Server Error' 
//       : err.message,
//     ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
//   });
// });



// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err) => {
//   console.log('❌ UNHANDLED REJECTION! Shutting down...');
//   console.error(err);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log('❌ UNCAUGHT EXCEPTION! Shutting down...');
//   console.error(err);
//   process.exit(1);
// });

// // Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('👋 SIGTERM received. Shutting down gracefully...');
//   server.close(() => {
//     console.log('💤 Process terminated!');
//   });
// });/


const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// 1. DYNAMIC CORS CONFIGURATION
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  // Your specific Vercel URL from the screenshot
  'https://hostel-management-system-mern-stack-922sk9qvk.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is in our list
    const isAllowed = allowedOrigins.some(allowedOrigin => {
        // This handles exact matches or minor trailing slash differences
        return origin.trim().replace(/\/$/, "") === allowedOrigin.trim().replace(/\/$/, "");
    });

    if (isAllowed || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    } else {
      console.error(`🚫 CORS Blocked for origin: ${origin}`);
      return callback(null, false); // Return false instead of Error to avoid crashing the server
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

// 2. BODY PARSERS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. SECURITY HEADERS (Updated for cross-origin compatibility)
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 4. REQUEST LOGGING (Check your Render logs to see these!)
app.use((req, res, next) => {
  console.log(`${req.method} request to ${req.path} from ${req.headers.origin}`);
  next();
});

// 5. API ROUTES
app.get('/', (req, res) => {
  res.json({ message: 'Hostel Management API Active', status: 'Online' });
});

// Health check for Render/Uptime monitoring
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/rooms', require('./routes/rooms'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

// 6. 404 HANDLER
app.use('*', (req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// 7. GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  // CRITICAL: Check your Render logs for this output
  console.error('SERVER ERROR STACK:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Handle Rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});