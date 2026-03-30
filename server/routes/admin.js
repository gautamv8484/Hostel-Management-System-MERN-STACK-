const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// All routes require authentication and admin role
router.use(protect);
router.use(admin);

// Dashboard Stats
router.get('/stats', adminController.getStats);

// Bookings Management
router.get('/bookings/recent', adminController.getRecentBookings);
router.put('/bookings/:bookingId/status', adminController.updateBookingStatus);

// Users Management
router.get('/users/recent', adminController.getRecentUsers);
router.delete('/users/:userId', adminController.deleteUser);

// Rooms Management
router.get('/rooms', adminController.getAllRooms);
router.get('/rooms/:roomId', adminController.getRoom);
router.post('/rooms', adminController.createRoom);
router.put('/rooms/:roomId', adminController.updateRoom);
router.put('/rooms/:roomId/toggle', adminController.toggleRoomStatus);
router.delete('/rooms/:roomId', adminController.deleteRoom);

module.exports = router;