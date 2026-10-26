import express from 'express';
import {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getAllBookings,
} from '../controllers/bookingController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.post('/', verifyToken, createBooking);
router.get('/my-bookings', verifyToken, getMyBookings);
router.get('/all', verifyToken, requireAdmin, getAllBookings);
router.get('/:id', verifyToken, getBookingById);
router.patch('/:id/cancel', verifyToken, cancelBooking);

export default router;
