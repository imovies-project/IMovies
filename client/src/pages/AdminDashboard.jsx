import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldCheck,
  Film,
  Calendar,
  Ticket,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  MapPin,
  Clock,
  Eye,
  CheckCircle,
  X,
  Search,
} from 'lucide-react';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'movies' | 'shows' | 'bookings' | 'theatres'
  const [stats, setStats] = useState(null);
  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [shows, setShows] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Movie Form State
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [movieForm, setMovieForm] = useState({
    title: '',
    description: '',
    posterUrl: '',
    backdropUrl: '',
    genre: 'Action, Sci-Fi',
    language: 'English',
    duration: 130,
    rating: 8.5,
    trailerUrl: '',
    status: 'now-showing',
    director: '',
    cast: '',
  });

  // Show Form State
  const [showShowModal, setShowShowModal] = useState(false);
  const [showForm, setShowForm] = useState({
    movieId: '',
    theatreId: '',
    screenNumber: 1,
    screenName: 'Audi 1',
    showDateTime: '',
    format: '2D',
    pricing: { standard: 180, premium: 250, vip: 350 },
  });

  // Theatre Form State
  const [showTheatreModal, setShowTheatreModal] = useState(false);
  const [theatreForm, setTheatreForm] = useState({
    name: '',
    location: '',
    city: 'Mumbai',
    amenities: 'Dolby Atmos, 4K Projection, Recliner Seats',
  });

  const [bookingSearch, setBookingSearch] = useState('');

  // Fetch all admin data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, moviesRes, theatresRes, bookingsRes] = await Promise.all([
        api.get('/admin/stats').catch(() => ({ data: { stats: {} } })),
        api.get('/movies'),
        api.get('/theatres'),
        api.get('/bookings/all').catch(() => ({ data: { data: [] } })),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (moviesRes.data.success) {
        setMovies(moviesRes.data.data);
      }
      if (theatresRes.data.success) {
        setTheatres(theatresRes.data.data);
      }
      if (bookingsRes.data.success) {
        setBookings(bookingsRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err.message);
      toast.error('Failed to load admin statistics and records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle Movie Creation
  const handleSaveMovie = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/movies', movieForm);
      if (res.data.success) {
        toast.success('Movie created successfully!');
        setShowMovieModal(false);
        setMovieForm({
          title: '',
          description: '',
          posterUrl: '',
          backdropUrl: '',
          genre: 'Action, Sci-Fi',
          language: 'English',
          duration: 130,
          rating: 8.5,
          trailerUrl: '',
          status: 'now-showing',
          director: '',
          cast: '',
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to save movie');
    }
  };

  // Handle Movie Deletion
  const handleDeleteMovie = async (id, title) => {
    if (!window.confirm(`Delete movie "${title}" from catalogue?`)) return;
    try {
      const res = await api.delete(`/movies/${id}`);
      if (res.data.success) {
        toast.success('Movie deleted successfully');
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to delete movie');
    }
  };

  // Handle Show Creation
  const handleSaveShow = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/shows', showForm);
      if (res.data.success) {
        toast.success('Showtime scheduled successfully!');
        setShowShowModal(false);
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to schedule show');
    }
  };

  // Handle Theatre Creation
  const handleSaveTheatre = async (e) => {
    e.preventDefault();
    try {
      const amenitiesArr = theatreForm.amenities.split(',').map((s) => s.trim());
      const res = await api.post('/theatres', {
        ...theatreForm,
        amenities: amenitiesArr,
      });
      if (res.data.success) {
        toast.success('Theatre added successfully!');
        setShowTheatreModal(false);
        setTheatreForm({
          name: '',
          location: '',
          city: 'Mumbai',
          amenities: 'Dolby Atmos, 4K Projection, Recliner Seats',
        });
        fetchData();
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add theatre');
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (!bookingSearch) return true;
    const term = bookingSearch.toLowerCase();
    return (
      b.bookingReference?.toLowerCase().includes(term) ||
      b.user?.name?.toLowerCase().includes(term) ||
      b.movie?.title?.toLowerCase().includes(term)
    );
  });

  if (loading) {
    return <LoadingSpinner text="Loading Administrator Operations Console..." />;
  }

  return (
    <div className="container py-4">
      {/* Admin Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-secondary border-opacity-10">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <span className="badge bg-warning text-dark text-uppercase fw-bold">Admin Portal</span>
            <span className="text-secondary small">Server Protected Endpoints</span>
          </div>
          <h1 className="text-white fw-bold brand-font mb-0">Management Console</h1>
        </div>

        {/* Action Button depending on tab */}
        <div className="d-flex gap-2">
          <button
            onClick={() => setShowMovieModal(true)}
            className="btn btn-primary-purple btn-sm px-3"
          >
            <Plus size={16} />
            <span>Add Movie</span>
          </button>
          <button
            onClick={() => setShowShowModal(true)}
            className="btn btn-outline-purple btn-sm px-3"
          >
            <Calendar size={16} />
            <span>Schedule Show</span>
          </button>
        </div>
      </div>

      {/* Nav Tabs */}
      <ul className="nav nav-pills gap-2 mb-4">
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'overview' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
            onClick={() => setActiveTab('overview')}
          >
            Dashboard Overview
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'movies' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
            onClick={() => setActiveTab('movies')}
          >
            Movies ({movies.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'theatres' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
            onClick={() => setActiveTab('theatres')}
          >
            Theatres ({theatres.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`btn btn-sm ${activeTab === 'bookings' ? 'btn-primary-purple' : 'btn-outline-purple'}`}
            onClick={() => setActiveTab('bookings')}
          >
            All Bookings ({bookings.length})
          </button>
        </li>
      </ul>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div>
          {/* Key Metric Stats Cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-6 col-lg-3">
              <div className="p-4 rounded-4 glass-panel">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-medium">Total Revenue</span>
                  <div className="p-2 rounded-3 bg-success bg-opacity-10 text-success">
                    <DollarSign size={20} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white">
                  ₹{stats?.totalRevenue?.toLocaleString() || 0}
                </div>
                <div className="text-success small mt-1">Confirmed ticket sales</div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="p-4 rounded-4 glass-panel">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-medium">Confirmed Bookings</span>
                  <div className="p-2 rounded-3 bg-primary bg-opacity-10 text-primary">
                    <Ticket size={20} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white">
                  {stats?.totalBookings || bookings.length}
                </div>
                <div className="text-secondary small mt-1">
                  {stats?.totalTicketsSold || 0} seats reserved
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="p-4 rounded-4 glass-panel">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-medium">Catalogue Movies</span>
                  <div className="p-2 rounded-3 bg-warning bg-opacity-10 text-warning">
                    <Film size={20} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white">{movies.length}</div>
                <div className="text-secondary small mt-1">
                  {movies.filter((m) => m.status === 'now-showing').length} now showing
                </div>
              </div>
            </div>

            <div className="col-sm-6 col-lg-3">
              <div className="p-4 rounded-4 glass-panel">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="text-muted small fw-medium">Cinema Theatres</span>
                  <div className="p-2 rounded-3 bg-info bg-opacity-10 text-info">
                    <MapPin size={20} />
                  </div>
                </div>
                <div className="fs-3 fw-bold text-white">{theatres.length}</div>
                <div className="text-secondary small mt-1">Multiplex locations</div>
              </div>
            </div>
          </div>

          {/* Recent Bookings Overview Table */}
          <div className="glass-panel p-4 mb-4">
            <h5 className="text-white fw-bold mb-3 brand-font">Recent Platform Bookings</h5>
            <div className="table-responsive">
              <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
                <thead>
                  <tr className="text-muted small border-secondary">
                    <th>Ref Code</th>
                    <th>Customer</th>
                    <th>Movie</th>
                    <th>Seats</th>
                    <th>Amount</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b._id} className="border-secondary align-middle">
                      <td className="fw-mono text-warning small">{b.bookingReference}</td>
                      <td className="text-white small">{b.user?.name || 'Customer'}</td>
                      <td className="text-white small">{b.movie?.title}</td>
                      <td className="text-secondary small">
                        {b.seats?.map((s) => s.seatNumber).join(', ')}
                      </td>
                      <td className="text-success fw-bold small">₹{b.totalAmount}</td>
                      <td>
                        <span
                          className={`badge ${
                            b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'
                          } text-uppercase`}
                          style={{ fontSize: '0.65rem' }}
                        >
                          {b.bookingStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-3">
                        No bookings recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MOVIES MANAGEMENT */}
      {activeTab === 'movies' && (
        <div className="glass-panel p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white fw-bold brand-font mb-0">Movie Catalogue Operations</h5>
            <button
              onClick={() => setShowMovieModal(true)}
              className="btn btn-primary-purple btn-sm"
            >
              <Plus size={16} /> Add New Movie
            </button>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="text-muted small border-secondary">
                  <th>Poster</th>
                  <th>Title</th>
                  <th>Genre</th>
                  <th>Status</th>
                  <th>Rating</th>
                  <th>Duration</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {movies.map((m) => (
                  <tr key={m._id} className="border-secondary align-middle">
                    <td>
                      <img
                        src={m.posterUrl}
                        alt={m.title}
                        className="rounded"
                        style={{ width: '40px', height: '56px', objectFit: 'cover' }}
                      />
                    </td>
                    <td className="text-white fw-semibold small">{m.title}</td>
                    <td className="text-secondary small">{m.genre?.join(', ')}</td>
                    <td>
                      <span
                        className={`badge ${
                          m.status === 'now-showing' ? 'bg-danger' : 'bg-info text-dark'
                        } text-uppercase`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {m.status}
                      </span>
                    </td>
                    <td className="text-warning fw-bold small">{m.rating}</td>
                    <td className="text-secondary small">{m.duration}m</td>
                    <td>
                      <button
                        onClick={() => handleDeleteMovie(m._id, m.title)}
                        className="btn btn-sm btn-outline-danger p-1"
                        title="Delete movie"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: THEATRES MANAGEMENT */}
      {activeTab === 'theatres' && (
        <div className="glass-panel p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="text-white fw-bold brand-font mb-0">Theatre Locations</h5>
            <button
              onClick={() => setShowTheatreModal(true)}
              className="btn btn-primary-purple btn-sm"
            >
              <Plus size={16} /> Add Theatre
            </button>
          </div>

          <div className="row g-3">
            {theatres.map((t) => (
              <div key={t._id} className="col-md-6">
                <div className="p-3 rounded-3 border border-secondary border-opacity-25 h-100">
                  <h6 className="text-white fw-bold mb-1">{t.name}</h6>
                  <p className="text-secondary small mb-2">{t.location}, {t.city}</p>
                  <div className="d-flex flex-wrap gap-1 mb-2">
                    {t.amenities?.map((a, idx) => (
                      <span key={idx} className="badge bg-dark border border-secondary text-secondary small">
                        {a}
                      </span>
                    ))}
                  </div>
                  <div className="text-muted small">Screens: {t.screens?.length || t.totalScreens}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: ALL BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="glass-panel p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
            <h5 className="text-white fw-bold brand-font mb-0">Platform Bookings Ledger</h5>
            <div className="position-relative" style={{ maxWidth: '300px' }}>
              <Search
                size={16}
                className="position-absolute top-50 translate-middle-y text-muted"
                style={{ left: '12px' }}
              />
              <input
                type="text"
                className="form-control form-control-dark ps-5 py-1 small"
                placeholder="Search reference or user..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="table-responsive">
            <table className="table table-dark table-hover mb-0" style={{ background: 'transparent' }}>
              <thead>
                <tr className="text-muted small border-secondary">
                  <th>Ref Code</th>
                  <th>Customer</th>
                  <th>Movie</th>
                  <th>Theatre</th>
                  <th>Seats</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => (
                  <tr key={b._id} className="border-secondary align-middle small">
                    <td className="fw-mono text-warning fw-bold">{b.bookingReference}</td>
                    <td className="text-white">{b.user?.name || 'Customer'}</td>
                    <td className="text-white">{b.movie?.title}</td>
                    <td className="text-secondary">{b.theatre?.name}</td>
                    <td className="text-white fw-semibold">
                      {b.seats?.map((s) => s.seatNumber).join(', ')}
                    </td>
                    <td className="text-success fw-bold">₹{b.totalAmount}</td>
                    <td className="text-muted">{b.paymentMethod}</td>
                    <td>
                      <span
                        className={`badge ${
                          b.bookingStatus === 'confirmed' ? 'bg-success' : 'bg-danger'
                        } text-uppercase`}
                        style={{ fontSize: '0.65rem' }}
                      >
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: ADD MOVIE */}
      {showMovieModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
          onClick={() => setShowMovieModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border border-secondary rounded-4 p-3">
              <div className="modal-header border-secondary border-opacity-25 pb-2">
                <h5 className="modal-title text-white fw-bold">Add New Movie</h5>
                <button
                  type="button"
                  className="btn text-white p-0 border-0"
                  onClick={() => setShowMovieModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveMovie} className="modal-body">
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="text-secondary small mb-1">Movie Title *</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={movieForm.title}
                      onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="text-secondary small mb-1">Status</label>
                    <select
                      className="form-select form-control-dark"
                      value={movieForm.status}
                      onChange={(e) => setMovieForm({ ...movieForm, status: e.target.value })}
                    >
                      <option value="now-showing" className="bg-dark text-white">Now Showing</option>
                      <option value="coming-soon" className="bg-dark text-white">Coming Soon</option>
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="text-secondary small mb-1">Description / Synopsis *</label>
                    <textarea
                      rows="3"
                      className="form-control form-control-dark"
                      value={movieForm.description}
                      onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                      required
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="text-secondary small mb-1">Poster Image URL *</label>
                    <input
                      type="url"
                      className="form-control form-control-dark"
                      value={movieForm.posterUrl}
                      onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                      required
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="text-secondary small mb-1">Backdrop Image URL</label>
                    <input
                      type="url"
                      className="form-control form-control-dark"
                      value={movieForm.backdropUrl}
                      onChange={(e) => setMovieForm({ ...movieForm, backdropUrl: e.target.value })}
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="text-secondary small mb-1">Genres (comma separated)</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={movieForm.genre}
                      onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    />
                  </div>

                  <div className="col-md-4">
                    <label className="text-secondary small mb-1">Language</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={movieForm.language}
                      onChange={(e) => setMovieForm({ ...movieForm, language: e.target.value })}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="text-secondary small mb-1">Duration (min)</label>
                    <input
                      type="number"
                      className="form-control form-control-dark"
                      value={movieForm.duration}
                      onChange={(e) => setMovieForm({ ...movieForm, duration: e.target.value })}
                    />
                  </div>

                  <div className="col-md-2">
                    <label className="text-secondary small mb-1">Rating (0-10)</label>
                    <input
                      type="number"
                      step="0.1"
                      className="form-control form-control-dark"
                      value={movieForm.rating}
                      onChange={(e) => setMovieForm({ ...movieForm, rating: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="text-secondary small mb-1">Director</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={movieForm.director}
                      onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="text-secondary small mb-1">Cast (comma separated)</label>
                    <input
                      type="text"
                      className="form-control form-control-dark"
                      value={movieForm.cast}
                      onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                    />
                  </div>
                </div>

                <div className="mt-4 text-end">
                  <button
                    type="button"
                    onClick={() => setShowMovieModal(false)}
                    className="btn btn-outline-secondary me-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-purple px-4">
                    Create Movie
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: SCHEDULE SHOW */}
      {showShowModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
          onClick={() => setShowShowModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border border-secondary rounded-4 p-3">
              <div className="modal-header border-secondary border-opacity-25 pb-2">
                <h5 className="modal-title text-white fw-bold">Schedule Showtime</h5>
                <button
                  type="button"
                  className="btn text-white p-0 border-0"
                  onClick={() => setShowShowModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveShow} className="modal-body">
                <div className="mb-3">
                  <label className="text-secondary small mb-1">Select Movie *</label>
                  <select
                    className="form-select form-control-dark"
                    value={showForm.movieId}
                    onChange={(e) => setShowForm({ ...showForm, movieId: e.target.value })}
                    required
                  >
                    <option value="" className="bg-dark text-white">-- Select Movie --</option>
                    {movies.map((m) => (
                      <option key={m._id} value={m._id} className="bg-dark text-white">
                        {m.title} ({m.status})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="text-secondary small mb-1">Select Theatre *</label>
                  <select
                    className="form-select form-control-dark"
                    value={showForm.theatreId}
                    onChange={(e) => setShowForm({ ...showForm, theatreId: e.target.value })}
                    required
                  >
                    <option value="" className="bg-dark text-white">-- Select Theatre --</option>
                    {theatres.map((t) => (
                      <option key={t._id} value={t._id} className="bg-dark text-white">
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="row g-2 mb-3">
                  <div className="col-6">
                    <label className="text-secondary small mb-1">Show Date & Time *</label>
                    <input
                      type="datetime-local"
                      className="form-control form-control-dark"
                      value={showForm.showDateTime}
                      onChange={(e) => setShowForm({ ...showForm, showDateTime: e.target.value })}
                      required
                    />
                  </div>
                  <div className="col-6">
                    <label className="text-secondary small mb-1">Format</label>
                    <select
                      className="form-select form-control-dark"
                      value={showForm.format}
                      onChange={(e) => setShowForm({ ...showForm, format: e.target.value })}
                    >
                      <option value="2D" className="bg-dark text-white">2D</option>
                      <option value="3D" className="bg-dark text-white">3D</option>
                      <option value="IMAX 2D" className="bg-dark text-white">IMAX 2D</option>
                      <option value="IMAX 3D" className="bg-dark text-white">IMAX 3D</option>
                      <option value="4DX" className="bg-dark text-white">4DX</option>
                    </select>
                  </div>
                </div>

                <div className="row g-2 mb-4">
                  <div className="col-4">
                    <label className="text-secondary small mb-1">Standard (₹)</label>
                    <input
                      type="number"
                      className="form-control form-control-dark"
                      value={showForm.pricing.standard}
                      onChange={(e) =>
                        setShowForm({
                          ...showForm,
                          pricing: { ...showForm.pricing, standard: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="col-4">
                    <label className="text-secondary small mb-1">Premium (₹)</label>
                    <input
                      type="number"
                      className="form-control form-control-dark"
                      value={showForm.pricing.premium}
                      onChange={(e) =>
                        setShowForm({
                          ...showForm,
                          pricing: { ...showForm.pricing, premium: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                  <div className="col-4">
                    <label className="text-secondary small mb-1">VIP (₹)</label>
                    <input
                      type="number"
                      className="form-control form-control-dark"
                      value={showForm.pricing.vip}
                      onChange={(e) =>
                        setShowForm({
                          ...showForm,
                          pricing: { ...showForm.pricing, vip: Number(e.target.value) },
                        })
                      }
                    />
                  </div>
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    onClick={() => setShowShowModal(false)}
                    className="btn btn-outline-secondary me-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-purple px-4">
                    Schedule Showtime
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD THEATRE */}
      {showTheatreModal && (
        <div
          className="modal d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1060 }}
          onClick={() => setShowTheatreModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content bg-dark border border-secondary rounded-4 p-3">
              <div className="modal-header border-secondary border-opacity-25 pb-2">
                <h5 className="modal-title text-white fw-bold">Add Cinema Theatre</h5>
                <button
                  type="button"
                  className="btn text-white p-0 border-0"
                  onClick={() => setShowTheatreModal(false)}
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveTheatre} className="modal-body">
                <div className="mb-3">
                  <label className="text-secondary small mb-1">Theatre Name *</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={theatreForm.name}
                    onChange={(e) => setTheatreForm({ ...theatreForm, name: e.target.value })}
                    placeholder="e.g. IMovies Cinema Luxe - Phoenix"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="text-secondary small mb-1">Location / Mall *</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={theatreForm.location}
                    onChange={(e) => setTheatreForm({ ...theatreForm, location: e.target.value })}
                    placeholder="e.g. Level 4, Grand Mall, MG Road"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="text-secondary small mb-1">City *</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={theatreForm.city}
                    onChange={(e) => setTheatreForm({ ...theatreForm, city: e.target.value })}
                    placeholder="e.g. Mumbai, Bangalore, Delhi"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="text-secondary small mb-1">Amenities (comma separated)</label>
                  <input
                    type="text"
                    className="form-control form-control-dark"
                    value={theatreForm.amenities}
                    onChange={(e) => setTheatreForm({ ...theatreForm, amenities: e.target.value })}
                  />
                </div>

                <div className="text-end">
                  <button
                    type="button"
                    onClick={() => setShowTheatreModal(false)}
                    className="btn btn-outline-secondary me-2"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-purple px-4">
                    Add Theatre
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
