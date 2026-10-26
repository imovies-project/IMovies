import mongoose from 'mongoose';

const bookedSeatItemSchema = new mongoose.Schema({
  seatNumber: { type: String, required: true },
  row: { type: String, required: true },
  col: { type: Number, required: true },
  type: {
    type: String,
    enum: ['vip', 'premium', 'standard'],
    default: 'standard',
  },
  price: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    bookingReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    show: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Show',
      required: true,
    },
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true,
    },
    theatre: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Theatre',
      required: true,
    },
    seats: [bookedSeatItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    convenienceFee: {
      type: Number,
      default: 30,
    },
    tax: {
      type: Number,
      default: 18,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ['completed', 'failed', 'refunded'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      default: 'UPI (Mock)',
    },
    bookingStatus: {
      type: String,
      enum: ['confirmed', 'cancelled'],
      default: 'confirmed',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Booking', bookingSchema);
