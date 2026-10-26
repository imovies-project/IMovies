import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Film,
  Sparkles,
  Ticket,
  Play,
  Star,
  Search,
  ShieldCheck,
  Headphones,
  Zap,
  X,
} from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Thriller', 'Animation'];

const Home = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeGenre, setActiveGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [trailerModalUrl, setTrailerModalUrl] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const res = await api.get('/movies');
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load movies:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const nowShowing = movies.filter((m) => m.status === 'now-showing');
  const comingSoon = movies.filter((m) => m.status === 'coming-soon');
  const heroMovie = nowShowing.find((m) => m.featured) || nowShowing[0];

  const filteredNowShowing = nowShowing.filter((m) => {
    const matchesGenre =
      activeGenre === 'All' ||
      (m.genre && m.genre.some((g) => g.toLowerCase() === activeGenre.toLowerCase()));
    const matchesSearch =
      !searchQuery ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.director && m.director.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesGenre && matchesSearch;
  });

  return (
    <div className="pb-5">
      {/* Cinematic Hero Banner */}
      <div className="container">
        {heroMovie ? (
          <div
            className="hero-banner shadow-lg p-4 p-md-5 my-4"
            style={{
              backgroundImage: `url(${heroMovie.backdropUrl || heroMovie.posterUrl})`,
            }}
          >
            <div className="hero-overlay"></div>
            <div className="hero-content">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge bg-danger text-uppercase px-2 py-1 fw-bold small">
                  Now Showing
                </span>
                <span className="badge-format">IMAX & Dolby Atmos</span>
                {heroMovie.rating > 0 && (
                  <span className="d-flex align-items-center gap-1 text-warning fw-bold small">
                    <Star size={14} className="fill-warning" />
                    {heroMovie.rating.toFixed(1)} / 10
                  </span>
                )}
              </div>

              <h1 className="display-4 fw-extrabold text-white mb-3 brand-font">
                {heroMovie.title}
              </h1>

              <p className="text-secondary mb-4 line-clamp-3 fs-6" style={{ maxWidth: '580px' }}>
                {heroMovie.description}
              </p>

              <div className="d-flex flex-wrap align-items-center gap-3">
                <Link
                  to={`/movies/${heroMovie._id}`}
                  className="btn btn-primary-purple btn-lg px-4 py-2"
                >
                  <Ticket size={18} />
                  <span>Book Tickets Now</span>
                </Link>

                {heroMovie.trailerUrl && (
                  <button
                    onClick={() => setTrailerModalUrl(heroMovie.trailerUrl)}
                    className="btn btn-outline-purple btn-lg px-4 py-2"
                  >
                    <Play size={18} />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-5 text-center my-4 glass-panel">
            <h2 className="text-white brand-font">Welcome to IMovies</h2>
            <p className="text-muted">Loading cinema features...</p>
          </div>
        )}

        {/* Quick Search and Filter Bar */}
        <div className="row g-3 align-items-center my-4">
          <div className="col-lg-5 col-md-6">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ left: '14px' }}
              />
              <input
                type="text"
                className="form-control form-control-dark ps-5"
                placeholder="Search movies, directors, actors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="col-lg-7 col-md-6">
            <div className="d-flex flex-wrap gap-2 justify-content-md-end">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setActiveGenre(genre)}
                  className={`btn btn-sm rounded-pill px-3 py-1 ${
                    activeGenre === genre ? 'btn-primary-purple' : 'btn-outline-purple'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Now Showing Grid */}
        <section className="my-5">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="text-uppercase small fw-bold" style={{ color: '#8b5cf6' }}>
                In Theatres
              </span>
              <h2 className="text-white fw-bold mb-0 brand-font">Now Showing</h2>
            </div>
            <Link to="/movies" className="text-decoration-none small" style={{ color: '#a78bfa' }}>
              View All Movies &rarr;
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner text="Fetching movies from theatre systems..." />
          ) : filteredNowShowing.length > 0 ? (
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {filteredNowShowing.map((movie) => (
                <div className="col" key={movie._id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5 glass-panel">
              <Film size={40} className="text-muted mb-2" />
              <p className="text-secondary mb-1">No movies match your search criteria.</p>
              <button
                className="btn btn-outline-purple btn-sm mt-2"
                onClick={() => {
                  setActiveGenre('All');
                  setSearchQuery('');
                }}
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>

        {/* Coming Soon Section */}
        {comingSoon.length > 0 && (
          <section className="my-5">
            <div className="d-flex justify-content-between align-items-end mb-4">
              <div>
                <span className="text-uppercase small fw-bold text-info">Upcoming Releases</span>
                <h2 className="text-white fw-bold mb-0 brand-font">Coming Soon</h2>
              </div>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
              {comingSoon.map((movie) => (
                <div className="col" key={movie._id}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Why Choose IMovies Highlights */}
        <section className="my-5 pt-3">
          <div className="text-center mb-5">
            <span className="text-uppercase small fw-bold" style={{ color: '#8b5cf6' }}>
              Premium Experience
            </span>
            <h2 className="text-white fw-bold brand-font">Why Book with IMovies?</h2>
            <p className="text-muted small mx-auto" style={{ maxWidth: '550px' }}>
              Engineered with modern full-stack web standards for rapid, real-time cinema ticket bookings.
            </p>
          </div>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 rounded-4 glass-panel h-100 text-center">
                <div
                  className="d-inline-flex p-3 rounded-circle mb-3"
                  style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8b5cf6' }}
                >
                  <Zap size={28} />
                </div>
                <h5 className="text-white fw-bold mb-2">Atomic Concurrency</h5>
                <p className="text-muted small mb-0">
                  Zero double-booking risk. State-of-the-art atomic seat updates safeguard your selected seats against race conditions.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 glass-panel h-100 text-center">
                <div
                  className="d-inline-flex p-3 rounded-circle mb-3"
                  style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#06b6d4' }}
                >
                  <Headphones size={28} />
                </div>
                <h5 className="text-white fw-bold mb-2">Dolby Atmos & IMAX</h5>
                <p className="text-muted small mb-0">
                  Select premium show formats tailored for cinematic acoustic fidelity and crystal-clear laser projection.
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="p-4 rounded-4 glass-panel h-100 text-center">
                <div
                  className="d-inline-flex p-3 rounded-circle mb-3"
                  style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}
                >
                  <ShieldCheck size={28} />
                </div>
                <h5 className="text-white fw-bold mb-2">Instant E-Tickets</h5>
                <p className="text-muted small mb-0">
                  Receive unique booking references, digital barcodes, and printable cinema passes directly to your dashboard.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Trailer Modal */}
      {trailerModalUrl && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
          onClick={() => setTrailerModalUrl(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border border-secondary rounded-4 overflow-hidden">
              <div className="modal-header border-secondary border-opacity-25 py-2">
                <h5 className="modal-title text-white small fw-bold">Movie Trailer</h5>
                <button
                  type="button"
                  className="btn text-white p-0 border-0"
                  onClick={() => setTrailerModalUrl(null)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-body p-0" style={{ height: '450px' }}>
                <iframe
                  width="100%"
                  height="100%"
                  src={
                    trailerModalUrl.includes('watch?v=')
                      ? trailerModalUrl.replace('watch?v=', 'embed/')
                      : trailerModalUrl
                  }
                  title="Movie Trailer"
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

export default Home;
