import express from 'express';
import {
  createBooking,
  getUserBookings,
  getAllBookings,
  updateBookingStatus,
} from '../controllers/bookingController.js';
import { protect, adminOnly } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Create a booking (user)
router.post('/', protect, createBooking);

// Get all bookings of logged-in user
router.get('/my', protect, getUserBookings);

// Admin: Get all bookings
router.get('/', protect,    adminOnly, getAllBookings);

// Admin: Update booking status
router.put('/:id/status', protect, adminOnly, updateBookingStatus);

export default router;
