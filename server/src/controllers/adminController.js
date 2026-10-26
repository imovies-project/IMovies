import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';
import Show from '../models/Show.js';
import Booking from '../models/Booking.js';
import User from '../models/User.js';

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalMovies,
      totalTheatres,
      totalShows,
      totalUsers,
      allBookings,
    ] = await Promise.all([
      Movie.countDocuments(),
      Theatre.countDocuments(),
      Show.countDocuments(),
      User.countDocuments({ role: 'user' }),
      Booking.find({ bookingStatus: 'confirmed' }),
    ]);

    const totalRevenue = allBookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    const totalTicketsSold = allBookings.reduce((sum, b) => sum + (b.seats ? b.seats.length : 0), 0);

    const recentBookings = await Booking.find()
      .populate('movie', 'title posterUrl')
      .populate('theatre', 'name')
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      stats: {
        totalMovies,
        totalTheatres,
        totalShows,
        totalUsers,
        totalBookings: allBookings.length,
        totalRevenue,
        totalTicketsSold,
      },
      recentBookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve dashboard statistics',
      error: error.message,
    });
  }
};
