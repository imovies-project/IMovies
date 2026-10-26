import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Film,
  Sparkles,
  Play,
  Share2,
  ChevronRight,
  X,
  Info,
} from 'lucide-react';
import { toast } from 'react-toastify';

const MovieDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [theatres, setTheatres] = useState([]);
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [loadingShows, setLoadingShows] = useState(true);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [trailerOpen, setTrailerOpen] = useState(false);

  // Generate 3 consecutive booking dates: Today, Tomorrow, Day 3
  const dateOptions = [0, 1, 2].map((offset) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return {
      dateObj: d,
      dateString: d.toISOString().split('T')[0],
      dayName: offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
      formattedDate: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    };
  });

  const selectedDate = dateOptions[selectedDateIndex];

  // Fetch movie details
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoadingMovie(true);
        const res = await api.get(`/movies/${id}`);
        if (res.data.success) {
          setMovie(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load movie details:', err.message);
        toast.error('Movie not found');
        navigate('/movies');
      } finally {
        setLoadingMovie(false);
      }
    };

    fetchMovie();
  }, [id, navigate]);

  // Fetch shows for the selected movie and date
  useEffect(() => {
    const fetchShows = async () => {
      try {
        setLoadingShows(true);
        const res = await api.get(`/shows/movie/${id}?date=${selectedDate.dateString}`);
        if (res.data.success) {
          setTheatres(res.data.theatres || []);
        }
      } catch (err) {
        console.error('Failed to load shows:', err.message);
      } finally {
        setLoadingShows(false);
      }
    };

    if (movie && movie.status === 'now-showing') {
      fetchShows();
    } else {
      setLoadingShows(false);
    }
  }, [id, movie, selectedDateIndex, selectedDate.dateString]);

  const formatDuration = (mins) => {
    if (!mins) return '120 min';
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${mins}m`;
  };

  const formatShowTime = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Movie link copied to clipboard!');
    }
  };

  if (loadingMovie) {
    return <LoadingSpinner text="Loading movie information..." />;
  }

  if (!movie) {
    return null;
  }

  const isComingSoon = movie.status === 'coming-soon';

  return (
    <div>
      {/* Movie Details Backdrop Header */}
      <div
        className="position-relative py-5"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(11,12,19,0.85) 0%, rgba(11,12,19,0.98) 100%), url(${
            movie.backdropUrl || movie.posterUrl
          })`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="container">
          <div className="row g-4 align-items-center">
            {/* Poster Column */}
            <div className="col-md-4 col-lg-3 text-center text-md-start">
              <div
                className="rounded-4 overflow-hidden shadow-lg mx-auto"
                style={{
                  maxWidth: '260px',
                  border: '2px solid rgba(139, 92, 246, 0.4)',
                  boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                }}
              >
                <img
                  src={movie.posterUrl}
                  alt={movie.title}
                  className="img-fluid w-100"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            </div>

            {/* Movie Info Column */}
            <div className="col-md-8 col-lg-9">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <span
                  className={`badge ${
                    isComingSoon ? 'bg-info text-dark' : 'bg-danger'
                  } text-uppercase px-2 py-1 fw-bold small`}
                >
                  {isComingSoon ? 'Coming Soon' : 'Now Showing'}
                </span>
                <span className="badge-genre">{movie.language}</span>
                <span className="badge-format">Dolby Atmos & IMAX</span>
              </div>

              <h1 className="display-5 fw-extrabold text-white brand-font mb-2">
                {movie.title}
              </h1>

              <div className="d-flex flex-wrap align-items-center gap-3 text-secondary small mb-3">
                {movie.rating > 0 && (
                  <div className="d-flex align-items-center gap-1 text-warning fw-bold">
                    <Star size={16} className="fill-warning" />
                    <span>{movie.rating.toFixed(1)} / 10 IMovies Score</span>
                  </div>
                )}
                <span>•</span>
                <div className="d-flex align-items-center gap-1">
                  <Clock size={15} />
                  <span>{formatDuration(movie.duration)}</span>
                </div>
                <span>•</span>
                <div className="d-flex align-items-center gap-1">
                  <Calendar size={15} />
                  <span>{new Date(movie.releaseDate).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                {movie.genre &&
                  movie.genre.map((g, idx) => (
                    <span key={idx} className="badge-genre py-1 px-3">
                      {g}
                    </span>
                  ))}
              </div>

              {/* Action Buttons */}
              <div className="d-flex flex-wrap gap-3 mb-4">
                {!isComingSoon ? (
                  <a href="#showtimes-section" className="btn btn-primary-purple btn-lg px-4">
                    Book Tickets
                  </a>
                ) : (
                  <button className="btn btn-secondary btn-lg px-4" disabled>
                    Advance Booking Opening Soon
                  </button>
                )}

                {movie.trailerUrl && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="btn btn-outline-purple btn-lg px-4"
                  >
                    <Play size={18} />
                    <span>Trailer</span>
                  </button>
                )}

                <button
                  onClick={handleShare}
                  className="btn btn-outline-secondary btn-lg px-3"
                  title="Share movie"
                >
                  <Share2 size={18} />
                </button>
              </div>

              {/* Synopsis & Cast */}
              <div className="pt-2">
                <h6 className="text-white fw-bold mb-1">About the Movie</h6>
                <p className="text-secondary small mb-3" style={{ maxWidth: '780px' }}>
                  {movie.description}
                </p>

                <div className="row g-2 text-secondary small">
                  <div className="col-sm-6">
                    <span className="text-muted">Director: </span>
                    <span className="text-white fw-medium">{movie.director}</span>
                  </div>
                  <div className="col-sm-6">
                    <span className="text-muted">Cast: </span>
                    <span className="text-white fw-medium">
                      {movie.cast && movie.cast.length > 0 ? movie.cast.join(', ') : 'Not Specified'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Showtimes & Theatres Section */}
      {!isComingSoon ? (
        <div className="container py-5" id="showtimes-section">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
            <div>
              <span className="text-uppercase small fw-bold" style={{ color: '#8b5cf6' }}>
                Select Date & Experience
              </span>
              <h2 className="text-white fw-bold brand-font mb-0">Theatres & Showtimes</h2>
            </div>

            {/* Date Selector Pills */}
            <div className="d-flex gap-2 overflow-auto pb-2 pb-md-0">
              {dateOptions.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDateIndex(idx)}
                  className={`btn px-3 py-2 text-center rounded-3 ${
                    selectedDateIndex === idx
                      ? 'btn-primary-purple'
                      : 'btn-outline-purple'
                  }`}
                  style={{ minWidth: '95px' }}
                >
                  <div className="small fw-bold">{opt.dayName}</div>
                  <div className="fs-6">{opt.formattedDate}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Theatres & Available Shows */}
          {loadingShows ? (
            <LoadingSpinner text="Fetching available theatres and seat schedules..." />
          ) : theatres.length > 0 ? (
            <div className="d-flex flex-column gap-4">
              {theatres.map((item) => (
                <div key={item.theatre._id} className="glass-panel p-4">
                  <div className="row g-3 align-items-center">
                    {/* Theatre Meta */}
                    <div className="col-lg-4">
                      <div className="d-flex align-items-start gap-2">
                        <MapPin size={20} className="text-danger mt-1 flex-shrink-0" />
                        <div>
                          <h5 className="text-white fw-bold mb-1">{item.theatre.name}</h5>
                          <p className="text-muted small mb-2">{item.theatre.location}, {item.theatre.city}</p>
                          <div className="d-flex flex-wrap gap-1">
                            {item.theatre.amenities &&
                              item.theatre.amenities.map((am, aIdx) => (
                                <span
                                  key={aIdx}
                                  className="badge bg-dark border border-secondary text-secondary"
                                  style={{ fontSize: '0.7rem' }}
                                >
                                  {am}
                                </span>
                              ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Showtimes Buttons */}
                    <div className="col-lg-8">
                      <div className="d-flex flex-wrap gap-3 justify-content-lg-end">
                        {item.shows.map((show) => (
                          <div
                            key={show._id}
                            className="p-3 rounded-3 text-center border border-secondary border-opacity-25"
                            style={{
                              background: '#161828',
                              minWidth: '135px',
                              cursor: 'pointer',
                              transition: 'all 0.2s',
                            }}
                            onClick={() => navigate(`/shows/${show._id}/seats`)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor = '#8b5cf6';
                              e.currentTarget.style.transform = 'translateY(-3px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            <div className="fw-bold text-white fs-5">
                              {formatShowTime(show.showDateTime)}
                            </div>
                            <div className="badge-format my-1">{show.format}</div>
                            <div className="text-success small fw-semibold">
                              ₹{show.pricing.standard} onwards
                            </div>
                            <div className="text-muted" style={{ fontSize: '0.7rem' }}>
                              {show.availableSeats} seats left
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 glass-panel">
              <Film size={40} className="text-muted mb-2" />
              <h5 className="text-white fw-bold">No shows scheduled for {selectedDate.dayName}</h5>
              <p className="text-secondary small mb-3">
                Shows for this date are being scheduled by cinema management. Please pick another date above.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="container py-5 text-center">
          <div className="p-5 glass-panel mx-auto" style={{ maxWidth: '600px' }}>
            <Info size={40} className="text-info mb-3" />
            <h4 className="text-white fw-bold mb-2">Advance Booking Opening Soon</h4>
            <p className="text-secondary small mb-3">
              This movie is scheduled for theatrical release on {new Date(movie.releaseDate).toLocaleDateString()}.
              Ticket sales will commence approximately 4 days prior to release.
            </p>
            <Link to="/movies" className="btn btn-outline-purple btn-sm">
              Explore Now Showing Movies
            </Link>
          </div>
        </div>
      )}

      {/* Trailer Modal */}
      {trailerOpen && movie.trailerUrl && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
          onClick={() => setTrailerOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border border-secondary rounded-4 overflow-hidden">
              <div className="modal-header border-secondary border-opacity-25 py-2">
                <h5 className="modal-title text-white small fw-bold">{movie.title} - Official Trailer</h5>
                <button
                  type="button"
                  className="btn text-white p-0 border-0"
                  onClick={() => setTrailerOpen(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body p-0" style={{ height: '450px' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={
                    movie.trailerUrl.includes('watch?v=')
                      ? movie.trailerUrl.replace('watch?v=', 'embed/')
                      : movie.trailerUrl
                  }
                  title={movie.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
