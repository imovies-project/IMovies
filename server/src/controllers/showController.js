import Show from '../models/Show.js';
import Movie from '../models/Movie.js';
import Theatre from '../models/Theatre.js';

export const getShowsByMovie = async (req, res) => {
  try {
    const { movieId } = req.params;
    const { date } = req.query;

    const query = { movie: movieId, status: { $ne: 'cancelled' } };

    if (date) {
      const selectedDate = new Date(date);
      const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0));
      const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999));
      query.showDateTime = { $gte: startOfDay, $lte: endOfDay };
    } else {
      // Default to from current time onwards or today's beginning
      const now = new Date();
      query.showDateTime = { $gte: new Date(now.setHours(0, 0, 0, 0)) };
    }

    const shows = await Show.find(query)
      .populate('theatre')
      .populate('movie', 'title duration rating posterUrl language')
      .sort({ showDateTime: 1 });

    // Group by theatre for convenient frontend display
    const theatreMap = new Map();

    shows.forEach((show) => {
      if (!show.theatre) return;
      const theatreId = show.theatre._id.toString();

      if (!theatreMap.has(theatreId)) {
        theatreMap.set(theatreId, {
          theatre: show.theatre,
          shows: [],
        });
      }

      theatreMap.get(theatreId).shows.push({
        _id: show._id,
        screenNumber: show.screenNumber,
        screenName: show.screenName,
        showDateTime: show.showDateTime,
        format: show.format,
        pricing: show.pricing,
        bookedSeatsCount: show.bookedSeats.length,
        totalSeats: show.totalSeats,
        availableSeats: Math.max(0, show.totalSeats - show.bookedSeats.length),
      });
    });

    const groupedData = Array.from(theatreMap.values());

    return res.status(200).json({
      success: true,
      count: shows.length,
      theatres: groupedData,
      rawShows: shows,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch shows',
      error: error.message,
    });
  }
};

export const getShowById = async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movie')
      .populate('theatre');

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Showtime not found',
      });
    }

    // Get screen seat layout from the theatre
    const screenInfo = show.theatre?.screens?.find(
      (s) => s.screenNumber === show.screenNumber
    ) || {
      screenNumber: 1,
      name: show.screenName || 'Audi 1',
      seatLayout: {
        rows: 8,
        cols: 10,
        vipRows: ['A', 'B'],
        premiumRows: ['C', 'D', 'E'],
        standardRows: ['F', 'G', 'H'],
      },
    };

    return res.status(200).json({
      success: true,
      data: {
        ...show.toObject(),
        screenLayout: screenInfo.seatLayout,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch show details',
      error: error.message,
    });
  }
};

export const createShow = async (req, res) => {
  try {
    const {
      movieId,
      theatreId,
      screenNumber,
      screenName,
      showDateTime,
      format,
      pricing,
      totalSeats,
    } = req.body;

    if (!movieId || !theatreId || !showDateTime) {
      return res.status(400).json({
        success: false,
        message: 'Movie, Theatre, and Showtime are required.',
      });
    }

    const movie = await Movie.findById(movieId);
    if (!movie) {
      return res.status(404).json({ success: false, message: 'Movie not found' });
    }

    const theatre = await Theatre.findById(theatreId);
    if (!theatre) {
      return res.status(404).json({ success: false, message: 'Theatre not found' });
    }

    const show = await Show.create({
      movie: movieId,
      theatre: theatreId,
      screenNumber: Number(screenNumber) || 1,
      screenName: screenName || `Screen ${screenNumber || 1}`,
      showDateTime: new Date(showDateTime),
      format: format || '2D',
      pricing: pricing || { vip: 350, premium: 250, standard: 180 },
      totalSeats: Number(totalSeats) || 80,
      bookedSeats: [],
    });

    return res.status(201).json({
      success: true,
      message: 'Show created successfully!',
      data: show,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create show',
      error: error.message,
    });
  }
};

export const deleteShow = async (req, res) => {
  try {
    const show = await Show.findByIdAndDelete(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        message: 'Show not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Show deleted successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete show',
      error: error.message,
    });
  }
};
