const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, admin } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Create booking
router.post('/', bookingController.createBooking);

// Get my bookings
router.get('/my-bookings', bookingController.getMyBookings);

// Get single booking
router.get('/:bookingId', bookingController.getBooking);

// Cancel booking
router.put('/:bookingId/cancel', bookingController.cancelBooking);

module.exports = router;