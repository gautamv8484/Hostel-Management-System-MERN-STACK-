const express = require('express');
const router = express.Router();
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getRoomStats
} = require('../controllers/roomController');
const { protect, authorize } = require('../middleware/auth');

router.get('/stats', protect, authorize('admin'), getRoomStats);
router.route('/')
  .get(getRooms)
  .post(protect, authorize('admin'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, authorize('admin'), updateRoom)
  .delete(protect, authorize('admin'), deleteRoom);

module.exports = router;