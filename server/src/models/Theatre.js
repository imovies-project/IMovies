import mongoose from 'mongoose';

const screenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    default: 'Screen 1',
  },
  seatingCapacity: {
    type: Number,
    default: 80,
  },
  seatLayout: {
    rows: { type: Number, default: 8 },
    cols: { type: Number, default: 10 },
    vipRows: { type: [String], default: ['A', 'B'] },
    premiumRows: { type: [String], default: ['C', 'D', 'E'] },
    standardRows: { type: [String], default: ['F', 'G', 'H'] },
  },
});

const theatreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Theatre name is required'],
      trim: true,
    },
    location: {
      type: String,
      required: [true, 'Theatre location is required'],
    },
    city: {
      type: String,
      required: [true, 'City is required'],
      default: 'Metro City',
    },
    amenities: {
      type: [String],
      default: ['Dolby Atmos', '4K Projection', 'Recliner Seats', 'Cafeteria'],
    },
    totalScreens: {
      type: Number,
      default: 3,
    },
    screens: [screenSchema],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Theatre', theatreSchema);
