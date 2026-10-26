import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle,
  Printer,
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  Download,
  Share2,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';

const BookingConfirmation = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);

  useEffect(() => {
    if (!booking) {
      const fetchBooking = async () => {
        try {
          setLoading(true);
          const res = await api.get(`/bookings/${id}`);
          if (res.data.success) {
            setBooking(res.data.data);
          }
        } catch (err) {
          console.error('Failed to load booking:', err.message);
          toast.error('Booking not found');
          navigate('/my-bookings');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [id, booking, navigate]);

  if (loading) {
    return <LoadingSpinner text="Retrieving your confirmed ticket..." />;
  }

  if (!booking) {
    return null;
  }

  const {
    bookingReference,
    movie,
    theatre,
    show,
    seats = [],
    totalAmount,
    paymentMethod,
    createdAt,
  } = booking;

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`Booked tickets for ${movie?.title} at IMovies! Ref: ${bookingReference}`);
      toast.success('Booking reference copied to clipboard!');
    }
  };

  const formatShowDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return `${d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })}, ${d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}`;
  };

  return (
    <div className="container py-5">
      {/* Success Notification Bar */}
      <div className="text-center mb-5 no-print">
        <div
          className="d-inline-flex p-3 rounded-circle mb-3 shadow"
          style={{
            background: 'rgba(16, 185, 129, 0.15)',
            color: '#10b981',
            boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
          }}
        >
          <CheckCircle size={52} />
        </div>
        <h1 className="text-white fw-bold brand-font mb-2">Booking Confirmed!</h1>
        <p className="text-secondary small mx-auto" style={{ maxWidth: '500px' }}>
          Your tickets have been reserved in the theatre system. An SMS and email receipt with your barcode pass has been issued.
        </p>

        <div className="d-flex justify-content-center gap-3 mt-4">
          <button onClick={handlePrint} className="btn btn-outline-purple px-4 py-2">
            <Printer size={16} />
            <span>Print E-Ticket</span>
          </button>
          <button onClick={handleShare} className="btn btn-outline-secondary px-3 py-2">
            <Share2 size={16} />
            <span>Share Pass</span>
          </button>
          <Link to="/my-bookings" className="btn btn-primary-purple px-4 py-2">
            <Ticket size={16} />
            <span>View in My Bookings</span>
          </Link>
        </div>
      </div>

      {/* Cinematic E-Ticket Card (Printable) */}
      <div className="mx-auto" style={{ maxWidth: '720px' }}>
        <div className="ticket-wrapper p-4 p-md-5">
          <div className="ticket-notch-left"></div>
          <div className="ticket-notch-right"></div>

          {/* Ticket Header */}
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 pb-4 border-bottom border-secondary border-opacity-25 mb-4">
            <div className="d-flex align-items-center gap-2">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 p-2"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
              >
                <Film size={22} className="text-white" />
              </div>
              <div>
                <span className="brand-font fs-4 fw-bold text-white tracking-wide">
                  I<span style={{ color: '#a78bfa' }}>Movies</span>
                </span>
                <div className="text-muted" style={{ fontSize: '0.72rem' }}>
                  Cinema Admission E-Ticket
                </div>
              </div>
            </div>

            <div className="text-end">
              <span className="badge bg-success text-uppercase mb-1">Confirmed</span>
              <div className="text-muted small">Reference:</div>
              <div className="text-white fw-mono fw-bold fs-5 tracking-wider" style={{ color: '#c4b5fd' }}>
                {bookingReference}
              </div>
            </div>
          </div>

          {/* Ticket Body: Movie & Theatre */}
          <div className="row g-4 align-items-center mb-4">
            <div className="col-sm-4 text-center">
              <img
                src={movie?.posterUrl}
                alt={movie?.title}
                className="rounded-3 shadow"
                style={{ width: '130px', height: '185px', objectFit: 'cover' }}
              />
            </div>

            <div className="col-sm-8">
              <h3 className="text-white fw-bold brand-font mb-2">{movie?.title}</h3>
              <div className="d-flex flex-wrap gap-2 mb-3">
                <span className="badge-genre">{movie?.language || 'English'}</span>
                <span className="badge-format">{show?.format || '2D'}</span>
                <span className="badge bg-dark border border-secondary text-secondary">
                  {show?.screenName || 'Audi 1'}
                </span>
              </div>

              <div className="d-flex flex-column gap-2 text-secondary small">
                <div className="d-flex align-items-center gap-2">
                  <MapPin size={16} className="text-danger flex-shrink-0" />
                  <span className="text-white">{theatre?.name} ({theatre?.city})</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <Calendar size={16} className="text-primary flex-shrink-0" />
                  <span className="text-white fw-semibold">
                    {formatShowDate(show?.showDateTime)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Seats and Pricing Section */}
          <div
            className="p-3 rounded-3 mb-4"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px dashed rgba(255,255,255,0.15)',
            }}
          >
            <div className="row g-3 text-center">
              <div className="col-4 border-end border-secondary border-opacity-25">
                <div className="text-muted small">Total Seats</div>
                <div className="text-white fw-bold fs-4">{seats.length}</div>
              </div>
              <div className="col-4 border-end border-secondary border-opacity-25">
                <div className="text-muted small">Seat Numbers</div>
                <div className="text-white fw-bold fs-5 text-truncate" title={seats.map((s) => s.seatNumber).join(', ')}>
                  {seats.map((s) => s.seatNumber).join(', ')}
                </div>
              </div>
              <div className="col-4">
                <div className="text-muted small">Amount Paid</div>
                <div className="fw-bold fs-4" style={{ color: '#10b981' }}>
                  ₹{totalAmount}
                </div>
              </div>
            </div>
          </div>

          {/* Barcode & Verification Footer */}
          <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center gap-3 pt-3 border-top border-secondary border-opacity-25">
            <div className="small text-secondary">
              <div>Payment Mode: <strong className="text-white">{paymentMethod}</strong></div>
              <div>Booked At: {new Date(createdAt).toLocaleString()}</div>
            </div>

            {/* Mock Barcode Graphic */}
            <div className="text-center">
              <div
                className="p-2 rounded bg-white d-inline-block"
                style={{ width: '170px', height: '42px', overflow: 'hidden' }}
              >
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background:
                      'repeating-linear-gradient(90deg, #000, #000 2px, #fff 2px, #fff 4px, #000 4px, #000 7px, #fff 7px, #fff 8px, #000 8px, #000 12px, #fff 12px, #fff 14px)',
                  }}
                ></div>
              </div>
              <div className="text-muted" style={{ fontSize: '0.65rem', letterSpacing: '0.15em' }}>
                SCAN AT ENTRY GATE
              </div>
            </div>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-4 no-print">
          <Link to="/movies" className="text-decoration-none small" style={{ color: '#a78bfa' }}>
            Book Tickets for Another Movie &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
