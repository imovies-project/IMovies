import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Movie title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Movie description is required'],
    },
    posterUrl: {
      type: String,
      required: [true, 'Poster image URL is required'],
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80',
    },
    backdropUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=1600&q=80',
    },
    genre: {
      type: [String],
      required: true,
      default: ['Action'],
    },
    language: {
      type: String,
      default: 'English',
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required'],
      default: 120,
    },
    releaseDate: {
      type: Date,
      default: Date.now,
    },
    rating: {
      type: Number,
      min: 0,
      max: 10,
      default: 8.0,
    },
    trailerUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['now-showing', 'coming-soon'],
      default: 'now-showing',
    },
    director: {
      type: String,
      default: 'Director Name',
    },
    cast: {
      type: [String],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Movie', movieSchema);
