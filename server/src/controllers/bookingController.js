import Booking from '../models/Booking.js';
import Show from '../models/Show.js';

export const createBooking = async (req, res) => {
  try {
    const { showId, seats, paymentMethod } = req.body;
    const userId = req.user._id;

    if (!showId || !seats || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid booking data. Please select at least one seat.',
      });
    }

    const show = await Show.findById(showId).populate('movie').populate('theatre');
    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found or no longer available.',
      });
    }

    // Extract seat identifiers (e.g. ["A1", "A2"])
    const requestedSeatNumbers = seats.map((s) => s.seatNumber);

    // CRITICAL CONCURRENCY CONTROL:
    // Atomic seat conflict prevention using MongoDB findOneAndUpdate with $nin and $push $each.
    // If ANY of the requested seats are already in `bookedSeats`, the query condition fails,
    // and no update happens, completely preventing double-booking race conditions!
    const updatedShow = await Show.findOneAndUpdate(
      {
        _id: showId,
        bookedSeats: { $nin: requestedSeatNumbers },
      },
      {
        $push: { bookedSeats: { $each: requestedSeatNumbers } },
      },
      { new: true }
    );

    if (!updatedShow) {
      return res.status(409).json({
        success: false,
        message:
          'One or more of the selected seats were just booked by another customer. Please choose different seats.',
      });
    }

    // Calculate subtotal, convenience fee, taxes, and total amount
    const subtotal = seats.reduce((acc, curr) => acc + (Number(curr.price) || 0), 0);
    const convenienceFee = Math.round(seats.length * 25);
    const tax = Math.round((subtotal + convenienceFee) * 0.18);
    const totalAmount = subtotal + convenienceFee + tax;

    // Generate unique human-readable booking reference
    const randomSuffix = Math.random().toString(36).substring(2, 7).toUpperCase();
    const datePrefix = Date.now().toString(36).slice(-4).toUpperCase();
    const bookingReference = `IMV-${datePrefix}-${randomSuffix}`;

    const booking = await Booking.create({
      bookingReference,
      user: userId,
      show: show._id,
      movie: show.movie._id,
      theatre: show.theatre._id,
      seats: seats.map((s) => ({
        seatNumber: s.seatNumber,
        row: s.row || s.seatNumber.charAt(0),
        col: Number(s.col) || parseInt(s.seatNumber.slice(1), 10) || 1,
        type: s.type || 'standard',
        price: Number(s.price) || 200,
      })),
      subtotal,
      convenienceFee,
      tax,
      totalAmount,
      paymentStatus: 'completed',
      paymentMethod: paymentMethod || 'Mock Payment Gateway (Test Mode)',
      bookingStatus: 'confirmed',
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('user', 'name email phone');

    return res.status(201).json({
      success: true,
      message: 'Tickets booked successfully! Booking confirmed.',
      booking: populatedBooking,
    });
  } catch (error) {
    console.error('Booking error:', error);
    return res.status(500).json({
      success: false,
      message: 'Booking processing failed',
      error: error.message,
    });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch your bookings',
      error: error.message,
    });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('movie')
      .populate('theatre')
      .populate('show')
      .populate('user', 'name email phone');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Ensure user owns this booking or is admin
    if (
      req.user.role !== 'admin' &&
      booking.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to view this booking',
      });
    }

    return res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details',
      error: error.message,
    });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });
    }

    if (
      req.user.role !== 'admin' &&
      booking.user.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to cancel this booking',
      });
    }

    if (booking.bookingStatus === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'This booking is already cancelled.',
      });
    }

    // Release seats from the show atomically
    const seatNumbers = booking.seats.map((s) => s.seatNumber);
    await Show.findByIdAndUpdate(booking.show, {
      $pull: { bookedSeats: { $in: seatNumbers } },
    });

    booking.bookingStatus = 'cancelled';
    booking.paymentStatus = 'refunded';
    await booking.save();

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled successfully. Seats have been released.',
      data: booking,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to cancel booking',
      error: error.message,
    });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name city')
      .populate('user', 'name email phone')
      .populate('show', 'showDateTime format')
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch bookings',
      error: error.message,
    });
  }
};
