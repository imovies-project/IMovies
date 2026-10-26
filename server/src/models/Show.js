import mongoose from 'mongoose';

const showSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: [true, 'Movie reference is required'],
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: [true, 'Theatre reference is required'],
    },
    screenNumber: {
      type: Number,
      required: true,
      default: 1,
    },
    screenName: {
      type: String,
      default: 'Audi 1',
    },
    showDateTime: {
      type: Date,
      required: [true, 'Show date and time is required'],
    },
    format: {
      type: String,
      enum: ['2D', '3D', 'IMAX 2D', 'IMAX 3D', '4DX'],
      default: '2D',
    },
    pricing: {
      vip: { type: Number, default: 350 },
      premium: { type: Number, default: 250 },
      standard: { type: Number, default: 180 },
    },
    bookedSeats: {
      type: [String],
      default: [],
    },
    totalSeats: {
      type: Number,
      default: 80,
    },
    status: {
      type: String,
      enum: ['scheduled', 'running', 'completed', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

// Helpful index for fast lookups
showSchema.index({ movie: 1, showDateTime: 1 });
showSchema.index({ theatre: 1, showDateTime: 1 });

export default mongoose.model('Show', showSchema);
