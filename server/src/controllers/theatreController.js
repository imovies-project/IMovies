import Theatre from '../models/Theatre.js';

export const getAllTheatres = async (req, res) => {
  try {
    const { city } = req.query;
    const query = {};
    if (city && city !== 'All') {
      query.city = new RegExp(`^${city}$`, 'i');
    }

    const theatres = await Theatre.find(query).sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: theatres.length,
      data: theatres,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch theatres',
      error: error.message,
    });
  }
};

export const getTheatreById = async (req, res) => {
  try {
    const theatre = await Theatre.findById(req.params.id);
    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: theatre,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch theatre',
      error: error.message,
    });
  }
};

export const createTheatre = async (req, res) => {
  try {
    const { name, location, city, amenities, screens, totalScreens } = req.body;

    if (!name || !location) {
      return res.status(400).json({
        success: false,
        message: 'Name and location are required.',
      });
    }

    const theatre = await Theatre.create({
      name,
      location,
      city: city || 'Metro City',
      amenities: amenities || ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'Cafeteria'],
      totalScreens: totalScreens || 3,
      screens: screens && screens.length ? screens : [
        {
          screenNumber: 1,
          name: 'Audi 1 (Dolby Atmos)',
          seatingCapacity: 80,
          seatLayout: {
            rows: 8,
            cols: 10,
            vipRows: ['A', 'B'],
            premiumRows: ['C', 'D', 'E'],
            standardRows: ['F', 'G', 'H'],
          },
        },
      ],
    });

    return res.status(201).json({
      success: true,
      message: 'Theatre added successfully!',
      data: theatre,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create theatre',
      error: error.message,
    });
  }
};

export const updateTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Theatre updated successfully!',
      data: theatre,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update theatre',
      error: error.message,
    });
  }
};

export const deleteTheatre = async (req, res) => {
  try {
    const theatre = await Theatre.findByIdAndDelete(req.params.id);

    if (!theatre) {
      return res.status(404).json({
        success: false,
        message: 'Theatre not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Theatre deleted successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete theatre',
      error: error.message,
    });
  }
};
