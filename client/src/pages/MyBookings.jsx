import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  Film,
  AlertCircle,
  Eye,
  XCircle,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'react-toastify';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await api.get('/bookings/my-bookings');
      if (res.data.success) {
        setBookings(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load user bookings:', err.message);
      toast.error('Failed to load your bookings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (id, ref) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${ref}? Your seats will be released immediately.`)) {
      return;
    }

    try {
      setCancellingId(id);
      const res = await api.patch(`/bookings/${id}/cancel`);
      if (res.data.success) {
        toast.success('Booking cancelled successfully. Seats have been released.');
        // Refresh bookings
        fetchBookings();
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      toast.error(err.message || 'Failed to cancel booking');
    } finally {
      setCancellingId(null);
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

  if (loading) {
    return <LoadingSpinner text="Loading your cinema booking history..." />;
  }

  return (
    <div className="container py-4">
      {/* Header */}
      <div className="mb-4 pb-3 border-bottom border-secondary border-opacity-10">
        <h1 className="text-white fw-bold brand-font mb-1">My Bookings</h1>
        <p className="text-secondary small mb-0">
          Review all confirmed cinema tickets, view digital passes, or manage cancellations.
        </p>
      </div>

      {bookings.length > 0 ? (
        <div className="d-flex flex-column gap-3">
          {bookings.map((booking) => {
            const isCancelled = booking.bookingStatus === 'cancelled';

            return (
              <div
                key={booking._id}
                className="glass-panel p-4"
                style={{
                  borderLeft: isCancelled
                    ? '4px solid #ef4444'
                    : '4px solid #10b981',
                }}
              >
                <div className="row g-3 align-items-center">
                  {/* Poster */}
                  <div className="col-sm-2 col-3 text-center">
                    <img
                      src={booking.movie?.posterUrl}
                      alt={booking.movie?.title}
                      className="rounded-3 shadow"
                      style={{ width: '80px', height: '115px', objectFit: 'cover' }}
                    />
                  </div>

                  {/* Booking Details */}
                  <div className="col-sm-6 col-9">
                    <div className="d-flex align-items-center gap-2 mb-1">
                      <span
                        className={`badge ${
                          isCancelled ? 'bg-danger text-white' : 'bg-success'
                        } text-uppercase`}
                        style={{ fontSize: '0.68rem' }}
                      >
                        {booking.bookingStatus}
                      </span>
                      <span className="text-muted small">Ref:</span>
                      <span className="text-white fw-mono fw-bold small">
                        {booking.bookingReference}
                      </span>
                    </div>

                    <h4 className="text-white fw-bold brand-font mb-1">
                      {booking.movie?.title || 'Movie'}
                    </h4>

                    <div className="d-flex flex-column gap-1 text-secondary small mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <MapPin size={14} className="text-danger flex-shrink-0" />
                        <span className="text-white">
                          {booking.theatre?.name} ({booking.theatre?.city})
                        </span>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        <Calendar size={14} className="text-primary flex-shrink-0" />
                        <span>{formatShowDate(booking.show?.showDateTime)}</span>
                        <span>•</span>
                        <span className="badge-format">{booking.show?.format || '2D'}</span>
                      </div>
                    </div>

                    <div className="text-secondary small">
                      Seats:{' '}
                      <strong className="text-white">
                        {booking.seats?.map((s) => s.seatNumber).join(', ')}
                      </strong>{' '}
                      ({booking.seats?.length} tickets)
                    </div>
                  </div>

                  {/* Price & Actions */}
                  <div className="col-sm-4 text-sm-end text-start border-top border-sm-top-0 border-secondary border-opacity-10 pt-3 pt-sm-0">
                    <div className="text-muted small">Total Paid</div>
                    <div className="fs-4 fw-extrabold mb-3" style={{ color: '#a78bfa' }}>
                      ₹{booking.totalAmount}
                    </div>

                    <div className="d-flex flex-wrap gap-2 justify-content-sm-end">
                      <Link
                        to={`/booking/confirmation/${booking._id}`}
                        state={{ booking }}
                        className="btn btn-outline-purple btn-sm px-3"
                      >
                        <Eye size={14} />
                        <span>View Ticket</span>
                      </Link>

                      {!isCancelled && (
                        <button
                          onClick={() => handleCancelBooking(booking._id, booking.bookingReference)}
                          disabled={cancellingId === booking._id}
                          className="btn btn-outline-danger btn-sm px-3"
                        >
                          <XCircle size={14} />
                          <span>{cancellingId === booking._id ? 'Cancelling...' : 'Cancel'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel">
          <Ticket size={48} className="text-muted mb-3" />
          <h4 className="text-white fw-bold mb-1">No bookings found</h4>
          <p className="text-secondary small mb-3">
            You haven't booked any movie tickets yet. Check out the latest movies now showing!
          </p>
          <Link to="/movies" className="btn btn-primary-purple btn-sm px-4">
            Browse Movies
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
