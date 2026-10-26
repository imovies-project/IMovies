import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  CreditCard,
  QrCode,
  Building,
  ShieldCheck,
  AlertTriangle,
  ChevronLeft,
  Lock,
  Film,
  MapPin,
  Clock,
  Ticket,
} from 'lucide-react';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [bookingData, setBookingData] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('UPI (Mock Test Mode)');
  const [upiId, setUpiId] = useState('demo@upi');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('imovies_current_booking');
    if (!raw) {
      toast.warning('No active booking found. Please select a show and seats first.');
      navigate('/movies');
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setBookingData(parsed);
    } catch {
      navigate('/movies');
    }
  }, [navigate]);

  if (!bookingData) {
    return null;
  }

  const { movie, theatre, screenName, showDateTime, format, seats, subtotal, showId } = bookingData;

  const convenienceFee = seats.length * 25;
  const tax = Math.round((subtotal + convenienceFee) * 0.18);
  const grandTotal = subtotal + convenienceFee + tax;

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setConflictError(null);

    try {
      const payload = {
        showId,
        seats,
        paymentMethod,
      };

      const res = await api.post('/bookings', payload);

      if (res.data.success) {
        toast.success('Payment verified! Your booking is confirmed.');
        sessionStorage.removeItem('imovies_current_booking');
        navigate(`/booking/confirmation/${res.data.booking._id}`, {
          state: { booking: res.data.booking },
        });
      }
    } catch (err) {
      console.error('Booking confirmation failed:', err);
      const msg = err.message || 'Booking processing failed';
      setConflictError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const formatShowDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  return (
    <div className="container py-4">
      {/* Top Header */}
      <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-10">
        <Link
          to={`/shows/${showId}/seats`}
          className="text-decoration-none small d-flex align-items-center gap-1 mb-1"
          style={{ color: '#a78bfa' }}
        >
          <ChevronLeft size={16} />
          Change Seats
        </Link>
        <h2 className="text-white fw-bold brand-font mb-0">Checkout & Payment</h2>
        <p className="text-secondary small mb-0">
          Review your cinema tickets and complete simulated payment.
        </p>
      </div>

      {conflictError && (
        <div className="alert alert-danger d-flex align-items-center gap-2 mb-4" role="alert">
          <AlertTriangle size={20} className="flex-shrink-0" />
          <div className="flex-grow-1">
            <strong>Seat Conflict: </strong>
            {conflictError}
          </div>
          <button
            onClick={() => navigate(`/shows/${showId}/seats`)}
            className="btn btn-sm btn-danger px-3"
          >
            Reselect Seats
          </button>
        </div>
      )}

      <div className="row g-4">
        {/* Left Column: Payment Method Selection */}
        <div className="col-lg-7">
          <div className="glass-panel p-4 mb-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="text-white fw-bold mb-0">Select Payment Method</h5>
              <span className="badge bg-success-subtle text-success small d-flex align-items-center gap-1">
                <Lock size={12} />
                256-bit Encrypted Mock Gateway
              </span>
            </div>

            {/* Test Mode Notification */}
            <div
              className="p-3 rounded-3 mb-4"
              style={{
                background: 'rgba(139, 92, 246, 0.1)',
                border: '1px solid rgba(139, 92, 246, 0.3)',
              }}
            >
              <div className="d-flex align-items-start gap-2">
                <ShieldCheck size={20} className="text-primary mt-1 flex-shrink-0" />
                <div className="small">
                  <div className="text-white fw-semibold mb-1">Simulated Educational Payment</div>
                  <div className="text-secondary">
                    This is a demonstrative academic project. No real bank transaction, credit card debit, or financial transfer takes place.
                  </div>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmBooking}>
              {/* Payment Method Radio Options */}
              <div className="d-flex flex-column gap-3 mb-4">
                {/* Option 1: UPI */}
                <label
                  className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                    paymentMethod === 'UPI (Mock Test Mode)'
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-secondary border-opacity-25'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input mt-0"
                      checked={paymentMethod === 'UPI (Mock Test Mode)'}
                      onChange={() => setPaymentMethod('UPI (Mock Test Mode)')}
                    />
                    <div className="d-flex align-items-center gap-2">
                      <QrCode size={20} className="text-success" />
                      <div>
                        <div className="text-white fw-semibold small">Instant UPI / QR Code</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Google Pay, PhonePe, Paytm, BHIM UPI
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-success text-uppercase" style={{ fontSize: '0.65rem' }}>
                    Instant
                  </span>
                </label>

                {/* Option 2: Credit/Debit Card */}
                <label
                  className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                    paymentMethod === 'Card (Mock Test Mode)'
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-secondary border-opacity-25'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input mt-0"
                      checked={paymentMethod === 'Card (Mock Test Mode)'}
                      onChange={() => setPaymentMethod('Card (Mock Test Mode)')}
                    />
                    <div className="d-flex align-items-center gap-2">
                      <CreditCard size={20} className="text-primary" />
                      <div>
                        <div className="text-white fw-semibold small">Credit / Debit Card</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          Visa, Mastercard, RuPay, Amex
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>
                    Mock
                  </span>
                </label>

                {/* Option 3: Net Banking */}
                <label
                  className={`p-3 rounded-3 border d-flex align-items-center justify-content-between cursor-pointer ${
                    paymentMethod === 'Net Banking (Mock Test Mode)'
                      ? 'border-primary bg-primary bg-opacity-10'
                      : 'border-secondary border-opacity-25'
                  }`}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="radio"
                      name="paymentMethod"
                      className="form-check-input mt-0"
                      checked={paymentMethod === 'Net Banking (Mock Test Mode)'}
                      onChange={() => setPaymentMethod('Net Banking (Mock Test Mode)')}
                    />
                    <div className="d-flex align-items-center gap-2">
                      <Building size={20} className="text-warning" />
                      <div>
                        <div className="text-white fw-semibold small">Net Banking</div>
                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                          HDFC, ICICI, SBI, Axis, Kotak
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="badge bg-secondary text-uppercase" style={{ fontSize: '0.65rem' }}>
                    Mock
                  </span>
                </label>
              </div>

              {/* Mock Input Fields based on Selection */}
              {paymentMethod === 'UPI (Mock Test Mode)' && (
                <div className="mb-4">
                  <label className="text-secondary small mb-1">Mock UPI Virtual Payment Address (VPA)</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="username@bank"
                    required
                  />
                  <div className="text-muted" style={{ fontSize: '0.75rem', marginTop: '4px' }}>
                    Pre-filled with test VPA. Any format is accepted in test mode.
                  </div>
                </div>
              )}

              {paymentMethod === 'Card (Mock Test Mode)' && (
                <div className="row g-3 mb-4">
                  <div className="col-12">
                    <label className="text-secondary small mb-1">Card Number (Mock)</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="text-secondary small mb-1">Valid Thru</label>
                    <input type="text" className="form-control form-control-dark" defaultValue="12/28" />
                  </div>
                  <div className="col-6">
                    <label className="text-secondary small mb-1">CVV</label>
                    <input type="password" className="form-control form-control-dark" defaultValue="777" maxLength="3" />
                  </div>
                </div>
              )}

              {/* User Billing Details Info */}
              <div className="p-3 rounded-3 glass-panel mb-4">
                <div className="text-white fw-semibold small mb-1">E-Ticket Recipient</div>
                <div className="text-secondary small">
                  Name: <strong className="text-white">{user?.name}</strong> • Email: <strong className="text-white">{user?.email}</strong>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn btn-primary-purple w-100 py-3 fs-5"
              >
                {submitting ? (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                    <span>Securing Seats & Confirming...</span>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <Ticket size={20} />
                    <span>Pay ₹{grandTotal} & Confirm Booking</span>
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Order Summary Card */}
        <div className="col-lg-5">
          <div className="glass-panel p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="text-white fw-bold mb-3 brand-font">Order Summary</h5>

            {/* Movie Poster & Meta */}
            <div className="d-flex gap-3 pb-3 border-bottom border-secondary border-opacity-10 mb-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3"
                style={{ width: '70px', height: '96px', objectFit: 'cover' }}
              />
              <div>
                <h5 className="text-white fw-bold mb-1">{movie.title}</h5>
                <div className="text-secondary small mb-1">{theatre.name}</div>
                <div className="d-flex align-items-center gap-2 mb-1">
                  <span className="badge-format">{format}</span>
                  <span className="text-muted small">{screenName}</span>
                </div>
                <div className="text-white small fw-medium">{formatShowDate(showDateTime)}</div>
              </div>
            </div>

            {/* Seat breakdown */}
            <div className="mb-3">
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Selected Seats:</span>
                <span className="text-white fw-bold">
                  {seats.map((s) => s.seatNumber).join(', ')}
                </span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {seats.map((s) => (
                  <span
                    key={s.seatNumber}
                    className="badge bg-dark border border-secondary text-secondary small"
                  >
                    {s.seatNumber} ({s.type}) - ₹{s.price}
                  </span>
                ))}
              </div>
            </div>

            {/* Price Calculations */}
            <div className="border-top border-secondary border-opacity-10 pt-3 mb-3">
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Tickets Subtotal</span>
                <span className="text-white fw-semibold">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Convenience Fee (₹25/ticket)</span>
                <span className="text-white">₹{convenienceFee}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-3">
                <span>GST (18%)</span>
                <span className="text-white">₹{tax}</span>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                <span className="text-white fw-bold fs-6">Grand Total</span>
                <span className="fs-3 fw-extrabold" style={{ color: '#a78bfa' }}>
                  ₹{grandTotal}
                </span>
              </div>
            </div>

            <div className="small text-muted text-center pt-2">
              Cancellation is supported up to 2 hours prior to showtime from your account.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
