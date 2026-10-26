import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Film,
  MapPin,
  Clock,
  Calendar,
  Ticket,
  ChevronLeft,
  AlertCircle,
  Check,
} from 'lucide-react';
import { toast } from 'react-toastify';

const SeatSelection = () => {
  const { id } = useParams(); // show ID
  const navigate = useNavigate();
  const { user } = useAuth();

  const [show, setShow] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]); // array of seat objects: { seatNumber, row, col, type, price }

  const MAX_SEATS = 8;

  useEffect(() => {
    const fetchShow = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/shows/${id}`);
        if (res.data.success) {
          setShow(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load show:', err.message);
        toast.error('Show not found or unavailable');
        navigate('/movies');
      } finally {
        setLoading(false);
      }
    };

    fetchShow();
  }, [id, navigate]);

  if (loading) {
    return <LoadingSpinner text="Generating cinema seating layout..." />;
  }

  if (!show) {
    return null;
  }

  const { movie, theatre, screenLayout, bookedSeats = [], pricing } = show;

  // Determine row labels: e.g. ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const rowCount = screenLayout?.rows || 8;
  const colCount = screenLayout?.cols || 10;
  const rowLetters = Array.from({ length: rowCount }, (_, i) => String.fromCharCode(65 + i));

  const vipRows = screenLayout?.vipRows || ['A', 'B'];
  const premiumRows = screenLayout?.premiumRows || ['C', 'D', 'E'];
  const standardRows = screenLayout?.standardRows || ['F', 'G', 'H'];

  const getSeatTier = (row) => {
    if (vipRows.includes(row)) return 'vip';
    if (premiumRows.includes(row)) return 'premium';
    return 'standard';
  };

  const getSeatPrice = (tier) => {
    if (tier === 'vip') return pricing?.vip || 350;
    if (tier === 'premium') return pricing?.premium || 250;
    return pricing?.standard || 180;
  };

  const handleSeatClick = (seatNumber, row, col) => {
    if (bookedSeats.includes(seatNumber)) {
      return; // already booked
    }

    const isSelected = selectedSeats.some((s) => s.seatNumber === seatNumber);

    if (isSelected) {
      // Remove seat
      setSelectedSeats(selectedSeats.filter((s) => s.seatNumber !== seatNumber));
    } else {
      if (selectedSeats.length >= MAX_SEATS) {
        toast.warning(`You can select a maximum of ${MAX_SEATS} seats per transaction.`);
        return;
      }
      const tier = getSeatTier(row);
      const price = getSeatPrice(tier);
      setSelectedSeats([...selectedSeats, { seatNumber, row, col, type: tier, price }]);
    }
  };

  const subtotal = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  const handleProceed = () => {
    if (selectedSeats.length === 0) {
      toast.error('Please select at least one seat to proceed.');
      return;
    }

    // Save selection to session storage for smooth checkout flow
    const bookingPayload = {
      showId: show._id,
      movie: {
        _id: movie._id,
        title: movie.title,
        posterUrl: movie.posterUrl,
        duration: movie.duration,
        language: movie.language,
      },
      theatre: {
        _id: theatre._id,
        name: theatre.name,
        location: theatre.location,
        city: theatre.city,
      },
      screenName: show.screenName,
      showDateTime: show.showDateTime,
      format: show.format,
      seats: selectedSeats,
      subtotal,
    };

    sessionStorage.setItem('imovies_current_booking', JSON.stringify(bookingPayload));

    if (!user) {
      toast.info('Please sign in or create an account to complete your booking.');
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
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
      {/* Top Breadcrumb and Show Meta Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
        <div>
          <Link
            to={`/movies/${movie._id}`}
            className="text-decoration-none small d-flex align-items-center gap-1 mb-1"
            style={{ color: '#a78bfa' }}
          >
            <ChevronLeft size={16} />
            Back to Movie Details
          </Link>
          <h2 className="text-white fw-bold brand-font mb-1">{movie.title}</h2>
          <div className="d-flex flex-wrap align-items-center gap-2 text-secondary small">
            <span className="text-white fw-medium">{theatre.name}</span>
            <span>•</span>
            <span>{show.screenName}</span>
            <span>•</span>
            <span className="badge-format">{show.format}</span>
            <span>•</span>
            <span className="text-white">{formatShowDate(show.showDateTime)}</span>
          </div>
        </div>

        <div className="d-flex align-items-center gap-2">
          <span className="badge bg-dark border border-secondary text-secondary small px-3 py-2">
            Selected: <strong className="text-white">{selectedSeats.length}</strong> / {MAX_SEATS} seats
          </span>
        </div>
      </div>

      <div className="row g-4">
        {/* Main Seat Layout Map */}
        <div className="col-lg-8">
          <div className="glass-panel p-4 text-center">
            {/* Screen Direction Visualizer */}
            <div className="screen-curve"></div>
            <div className="screen-label mb-5">All Eyes This Way &bull; Cinema Screen</div>

            {/* Seating Grid by Tier */}
            <div className="d-flex flex-column gap-4 align-items-center overflow-auto pb-3">
              {/* VIP Section */}
              <div className="w-100">
                <div className="d-flex align-items-center justify-content-between mb-2 px-3">
                  <span className="badge" style={{ background: 'rgba(236,72,153,0.2)', color: '#f472b6' }}>
                    VIP - ₹{pricing.vip}
                  </span>
                  <span className="text-muted small">Top View Recliner Rows</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {rowLetters
                    .filter((r) => vipRows.includes(r))
                    .map((row) => (
                      <div key={row} className="d-flex align-items-center justify-content-center gap-2">
                        <span className="text-muted fw-bold small" style={{ width: '20px' }}>
                          {row}
                        </span>
                        <div className="d-flex gap-1 gap-sm-2">
                          {Array.from({ length: colCount }, (_, i) => i + 1).map((col) => {
                            const seatNumber = `${row}${col}`;
                            const isBooked = bookedSeats.includes(seatNumber);
                            const isSelected = selectedSeats.some((s) => s.seatNumber === seatNumber);

                            return (
                              <button
                                key={seatNumber}
                                type="button"
                                disabled={isBooked}
                                onClick={() => handleSeatClick(seatNumber, row, col)}
                                className={`seat-btn ${
                                  isBooked
                                    ? 'seat-booked'
                                    : isSelected
                                    ? 'seat-selected'
                                    : 'seat-available-vip'
                                }`}
                                title={
                                  isBooked
                                    ? `Seat ${seatNumber} is already booked`
                                    : `Seat ${seatNumber} (VIP) - ₹${pricing.vip}`
                                }
                              >
                                {isSelected ? <Check size={14} /> : col}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-muted fw-bold small" style={{ width: '20px' }}>
                          {row}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Premium Section */}
              <div className="w-100">
                <div className="d-flex align-items-center justify-content-between mb-2 px-3">
                  <span className="badge" style={{ background: 'rgba(139,92,246,0.2)', color: '#c4b5fd' }}>
                    Premium - ₹{pricing.premium}
                  </span>
                  <span className="text-muted small">Prime Acoustic Rows</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {rowLetters
                    .filter((r) => premiumRows.includes(r))
                    .map((row) => (
                      <div key={row} className="d-flex align-items-center justify-content-center gap-2">
                        <span className="text-muted fw-bold small" style={{ width: '20px' }}>
                          {row}
                        </span>
                        <div className="d-flex gap-1 gap-sm-2">
                          {Array.from({ length: colCount }, (_, i) => i + 1).map((col) => {
                            const seatNumber = `${row}${col}`;
                            const isBooked = bookedSeats.includes(seatNumber);
                            const isSelected = selectedSeats.some((s) => s.seatNumber === seatNumber);

                            return (
                              <button
                                key={seatNumber}
                                type="button"
                                disabled={isBooked}
                                onClick={() => handleSeatClick(seatNumber, row, col)}
                                className={`seat-btn ${
                                  isBooked
                                    ? 'seat-booked'
                                    : isSelected
                                    ? 'seat-selected'
                                    : 'seat-available-premium'
                                }`}
                                title={
                                  isBooked
                                    ? `Seat ${seatNumber} is booked`
                                    : `Seat ${seatNumber} (Premium) - ₹${pricing.premium}`
                                }
                              >
                                {isSelected ? <Check size={14} /> : col}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-muted fw-bold small" style={{ width: '20px' }}>
                          {row}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Standard Section */}
              <div className="w-100">
                <div className="d-flex align-items-center justify-content-between mb-2 px-3">
                  <span className="badge" style={{ background: 'rgba(59,130,246,0.2)', color: '#93c5fd' }}>
                    Standard - ₹{pricing.standard}
                  </span>
                  <span className="text-muted small">Front Orchestra Rows</span>
                </div>
                <div className="d-flex flex-column gap-2">
                  {rowLetters
                    .filter((r) => standardRows.includes(r))
                    .map((row) => (
                      <div key={row} className="d-flex align-items-center justify-content-center gap-2">
                        <span className="text-muted fw-bold small" style={{ width: '20px' }}>
                          {row}
                        </span>
                        <div className="d-flex gap-1 gap-sm-2">
                          {Array.from({ length: colCount }, (_, i) => i + 1).map((col) => {
                            const seatNumber = `${row}${col}`;
                            const isBooked = bookedSeats.includes(seatNumber);
                            const isSelected = selectedSeats.some((s) => s.seatNumber === seatNumber);

                            return (
                              <button
                                key={seatNumber}
                                type="button"
                                disabled={isBooked}
                                onClick={() => handleSeatClick(seatNumber, row, col)}
                                className={`seat-btn ${
                                  isBooked
                                    ? 'seat-booked'
                                    : isSelected
                                    ? 'seat-selected'
                                    : 'seat-available-standard'
                                }`}
                                title={
                                  isBooked
                                    ? `Seat ${seatNumber} is booked`
                                    : `Seat ${seatNumber} (Standard) - ₹${pricing.standard}`
                                }
                              >
                                {isSelected ? <Check size={14} /> : col}
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-muted fw-bold small" style={{ width: '20px' }}>
                          {row}
                        </span>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* Seat Map Legend */}
            <div className="d-flex flex-wrap justify-content-center gap-4 mt-5 pt-3 border-top border-secondary border-opacity-10 small">
              <div className="d-flex align-items-center gap-2">
                <div className="seat-btn seat-available-standard" style={{ width: '18px', height: '18px' }}></div>
                <span className="text-secondary">Standard (₹{pricing.standard})</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat-btn seat-available-premium" style={{ width: '18px', height: '18px' }}></div>
                <span className="text-secondary">Premium (₹{pricing.premium})</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat-btn seat-available-vip" style={{ width: '18px', height: '18px' }}></div>
                <span className="text-secondary">VIP (₹{pricing.vip})</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat-btn seat-selected" style={{ width: '18px', height: '18px' }}></div>
                <span className="text-white fw-bold">Selected</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div className="seat-btn seat-booked" style={{ width: '18px', height: '18px' }}></div>
                <span className="text-muted">Sold Out</span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Seats and Order Summary Sidebar */}
        <div className="col-lg-4">
          <div className="glass-panel p-4 sticky-top" style={{ top: '90px' }}>
            <h5 className="text-white fw-bold mb-3 brand-font">Booking Summary</h5>

            <div className="d-flex gap-3 pb-3 border-bottom border-secondary border-opacity-10 mb-3">
              <img
                src={movie.posterUrl}
                alt={movie.title}
                className="rounded-3"
                style={{ width: '64px', height: '88px', objectFit: 'cover' }}
              />
              <div>
                <h6 className="text-white fw-bold mb-1">{movie.title}</h6>
                <div className="text-secondary small mb-1">{theatre.name}</div>
                <div className="badge-format mb-1">{show.format}</div>
                <div className="text-muted small">{show.screenName}</div>
              </div>
            </div>

            {/* Selected Seats Tags */}
            <div className="mb-3">
              <label className="text-muted small fw-semibold mb-2">Selected Seats:</label>
              {selectedSeats.length > 0 ? (
                <div className="d-flex flex-wrap gap-2">
                  {selectedSeats.map((s) => (
                    <span
                      key={s.seatNumber}
                      className="badge bg-success-subtle text-success border border-success border-opacity-50 px-2 py-1 small"
                    >
                      {s.seatNumber} ({s.type.toUpperCase()}) - ₹{s.price}
                    </span>
                  ))}
                </div>
              ) : (
                <div className="text-muted small fst-italic">
                  Please tap any available seat on the grid to add to your order.
                </div>
              )}
            </div>

            {/* Price Calculations */}
            <div className="border-top border-secondary border-opacity-10 pt-3 mb-4">
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Tickets Subtotal ({selectedSeats.length} seats)</span>
                <span className="text-white fw-semibold">₹{subtotal}</span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-2">
                <span>Convenience Fee</span>
                <span className="text-white">
                  ₹{selectedSeats.length > 0 ? selectedSeats.length * 25 : 0}
                </span>
              </div>
              <div className="d-flex justify-content-between text-secondary small mb-3">
                <span>GST (18%)</span>
                <span className="text-white">
                  ₹{selectedSeats.length > 0 ? Math.round((subtotal + selectedSeats.length * 25) * 0.18) : 0}
                </span>
              </div>
              <div className="d-flex justify-content-between align-items-center pt-2 border-top border-secondary border-opacity-25">
                <span className="text-white fw-bold">Estimated Total</span>
                <span className="fs-4 fw-extrabold" style={{ color: '#a78bfa' }}>
                  ₹
                  {selectedSeats.length > 0
                    ? subtotal +
                      selectedSeats.length * 25 +
                      Math.round((subtotal + selectedSeats.length * 25) * 0.18)
                    : 0}
                </span>
              </div>
            </div>

            {/* Proceed CTA */}
            <button
              onClick={handleProceed}
              disabled={selectedSeats.length === 0}
              className="btn btn-primary-purple w-100 py-3 fs-6"
            >
              <Ticket size={18} />
              <span>Proceed to Checkout</span>
            </button>

            <div className="d-flex align-items-center gap-2 mt-3 text-muted small">
              <AlertCircle size={14} className="text-warning flex-shrink-0" />
              <span>Seats are reserved upon successful checkout confirmation.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
