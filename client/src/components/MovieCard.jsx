import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Calendar, Ticket } from 'lucide-react';

const FALLBACK_POSTER = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80';

const MovieCard = ({ movie }) => {
  const [imgSrc, setImgSrc] = useState(movie.posterUrl || FALLBACK_POSTER);

  const formatDuration = (mins) => {
    if (!mins) return '120 min';
    const hrs = Math.floor(mins / 60);
    const rem = mins % 60;
    return hrs > 0 ? `${hrs}h ${rem}m` : `${mins}m`;
  };

  const isComingSoon = movie.status === 'coming-soon';

  return (
    <div className="movie-card">
      <Link to={`/movies/${movie._id}`} className="text-decoration-none">
        <div className="movie-poster-wrap">
          <img
            src={imgSrc}
            alt={movie.title}
            className="movie-poster-img"
            onError={() => setImgSrc(FALLBACK_POSTER)}
            loading="lazy"
          />
          {movie.rating > 0 && (
            <div className="movie-rating-badge">
              <Star size={13} className="fill-warning" />
              <span>{movie.rating.toFixed(1)}</span>
            </div>
          )}
          {isComingSoon && (
            <div
              className="position-absolute bottom-0 start-0 end-0 py-1 text-center small fw-bold text-white"
              style={{
                background: 'linear-gradient(to top, rgba(11,12,19,0.95), rgba(11,12,19,0.4))',
              }}
            >
              Coming Soon
            </div>
          )}
        </div>
      </Link>

      <div className="p-3 d-flex flex-column flex-grow-1 justify-content-between">
        <div>
          <div className="d-flex align-items-center justify-content-between text-muted small mb-1">
            <span className="d-flex align-items-center gap-1">
              <Clock size={12} />
              {formatDuration(movie.duration)}
            </span>
            <span>{movie.language || 'English'}</span>
          </div>

          <h5 className="text-white fw-bold mb-2 text-truncate" title={movie.title}>
            <Link to={`/movies/${movie._id}`} className="text-white text-decoration-none">
              {movie.title}
            </Link>
          </h5>

          {/* Genres */}
          <div className="d-flex flex-wrap gap-1 mb-3">
            {movie.genre && movie.genre.slice(0, 2).map((g, idx) => (
              <span key={idx} className="badge-genre">
                {g}
              </span>
            ))}
          </div>
        </div>

        <Link
          to={`/movies/${movie._id}`}
          className={`btn w-100 ${
            isComingSoon ? 'btn-outline-purple' : 'btn-primary-purple'
          } btn-sm py-2`}
        >
          {isComingSoon ? (
            <>
              <Calendar size={15} />
              <span>View Details</span>
            </>
          ) : (
            <>
              <Ticket size={15} />
              <span>Book Tickets</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default MovieCard;
