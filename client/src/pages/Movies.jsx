import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../services/api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, SlidersHorizontal, Film } from 'lucide-react';

const GENRES = ['All', 'Action', 'Sci-Fi', 'Adventure', 'Drama', 'Thriller', 'Animation', 'Biography', 'Crime'];
const LANGUAGES = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];

const Movies = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialStatus = searchParams.get('status') || 'all';

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState(initialStatus);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        setLoading(true);
        const params = {};
        if (statusFilter !== 'all') params.status = statusFilter;
        if (selectedGenre !== 'All') params.genre = selectedGenre;
        if (selectedLanguage !== 'All') params.language = selectedLanguage;
        if (searchQuery.trim()) params.search = searchQuery.trim();
        if (sortBy) params.sort = sortBy;

        const res = await api.get('/movies', { params });
        if (res.data.success) {
          setMovies(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch movies catalogue:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [statusFilter, selectedGenre, selectedLanguage, searchQuery, sortBy]);

  const handleStatusChange = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      searchParams.delete('status');
    } else {
      searchParams.set('status', status);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="container py-4">
      {/* Page Header */}
      <div className="mb-4">
        <h1 className="text-white fw-bold brand-font mb-1">Movie Catalogue</h1>
        <p className="text-secondary small">
          Explore movies currently showing in theatres and upcoming blockbusters.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 mb-4">
        <div className="row g-3 align-items-center">
          {/* Search Input */}
          <div className="col-lg-4 col-md-6">
            <div className="position-relative">
              <Search
                size={18}
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ left: '14px' }}
              />
              <input
                type="text"
                className="form-control form-control-dark ps-5"
                placeholder="Search by title, director, cast..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="col-lg-3 col-md-6">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'all' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
                onClick={() => handleStatusChange('all')}
              >
                All
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'now-showing' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
                onClick={() => handleStatusChange('now-showing')}
              >
                Now Showing
              </button>
              <button
                type="button"
                className={`btn btn-sm ${statusFilter === 'coming-soon' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
                onClick={() => handleStatusChange('coming-soon')}
              >
                Coming Soon
              </button>
            </div>
          </div>

          {/* Genre Filter */}
          <div className="col-lg-2 col-md-4 col-6">
            <select
              className="form-select form-control-dark"
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
            >
              {GENRES.map((g) => (
                <option key={g} value={g} className="bg-dark text-white">
                  Genre: {g}
                </option>
              ))}
            </select>
          </div>

          {/* Language Filter */}
          <div className="col-lg-2 col-md-4 col-6">
            <select
              className="form-select form-control-dark"
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l} className="bg-dark text-white">
                  Lang: {l}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="col-lg-1 col-md-4 col-12">
            <select
              className="form-select form-control-dark"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              title="Sort By"
            >
              <option value="rating" className="bg-dark text-white">Top Rated</option>
              <option value="releaseDate" className="bg-dark text-white">Release Date</option>
              <option value="title" className="bg-dark text-white">A - Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <LoadingSpinner text="Searching movie catalogue..." />
      ) : movies.length > 0 ? (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {movies.map((movie) => (
            <div className="col" key={movie._id}>
              <MovieCard movie={movie} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 glass-panel">
          <Film size={48} className="text-muted mb-3" />
          <h4 className="text-white fw-bold mb-1">No movies found</h4>
          <p className="text-secondary small mb-3">
            Try adjusting your search query, genre, or status filter.
          </p>
          <button
            className="btn btn-outline-purple btn-sm"
            onClick={() => {
              setSearchQuery('');
              setSelectedGenre('All');
              setSelectedLanguage('All');
              handleStatusChange('all');
            }}
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Movies;
