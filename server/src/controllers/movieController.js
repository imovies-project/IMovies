import Movie from '../models/Movie.js';

export const getAllMovies = async (req, res) => {
  try {
    const { genre, search, status, language, sort } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (genre && genre !== 'All') {
      query.genre = { $in: [new RegExp(`^${genre}$`, 'i')] };
    }

    if (language && language !== 'All') {
      query.language = new RegExp(`^${language}$`, 'i');
    }

    if (search && search.trim() !== '') {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: searchRegex },
        { director: searchRegex },
        { cast: searchRegex },
        { genre: searchRegex },
      ];
    }

    let sortOption = { releaseDate: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    if (sort === 'title') sortOption = { title: 1 };
    if (sort === 'duration') sortOption = { duration: 1 };

    const movies = await Movie.find(query).sort(sortOption);

    return res.status(200).json({
      success: true,
      count: movies.length,
      data: movies,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch movies',
      error: error.message,
    });
  }
};

export const getFeaturedMovies = async (req, res) => {
  try {
    const featured = await Movie.find({ status: 'now-showing' })
      .sort({ rating: -1, createdAt: -1 })
      .limit(6);

    return res.status(200).json({
      success: true,
      data: featured,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch featured movies',
      error: error.message,
    });
  }
};

export const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch movie details',
      error: error.message,
    });
  }
};

export const createMovie = async (req, res) => {
  try {
    const {
      title,
      description,
      posterUrl,
      backdropUrl,
      genre,
      language,
      duration,
      releaseDate,
      rating,
      trailerUrl,
      status,
      director,
      cast,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Title and description are required.',
      });
    }

    const movie = await Movie.create({
      title,
      description,
      posterUrl: posterUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
      backdropUrl: backdropUrl || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
      genre: Array.isArray(genre) ? genre : (genre ? genre.split(',').map(s => s.trim()) : ['Action']),
      language: language || 'English',
      duration: Number(duration) || 120,
      releaseDate: releaseDate ? new Date(releaseDate) : new Date(),
      rating: Number(rating) || 8.0,
      trailerUrl: trailerUrl || '',
      status: status || 'now-showing',
      director: director || 'Director',
      cast: Array.isArray(cast) ? cast : (cast ? cast.split(',').map(s => s.trim()) : []),
      featured: Boolean(featured),
    });

    return res.status(201).json({
      success: true,
      message: 'Movie created successfully!',
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create movie',
      error: error.message,
    });
  }
};

export const updateMovie = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (typeof updateData.genre === 'string') {
      updateData.genre = updateData.genre.split(',').map(s => s.trim());
    }
    if (typeof updateData.cast === 'string') {
      updateData.cast = updateData.cast.split(',').map(s => s.trim());
    }

    const movie = await Movie.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie updated successfully!',
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update movie',
      error: error.message,
    });
  }
};

export const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie deleted successfully!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
      error: error.message,
    });
  }
};
