import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, User, LogOut, ShieldCheck, Ticket, Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar navbar-expand-lg glass-nav sticky-top py-3">
      <div className="container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2" onClick={closeMenu}>
          <div
            className="d-flex align-items-center justify-content-center rounded-3 p-2"
            style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
              boxShadow: '0 0 15px rgba(139, 92, 246, 0.5)',
            }}
          >
            <Film size={22} className="text-white" />
          </div>
          <span className="brand-font fs-4 fw-bold text-white tracking-wide">
            I<span style={{ color: '#a78bfa' }}>Movies</span>
          </span>
        </Link>

        {/* Mobile Toggle Button */}
        <button
          className="navbar-toggler border-0 text-white"
          type="button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation"
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

        {/* Desktop & Mobile Menu */}
        <div className={`collapse navbar-collapse ${mobileMenuOpen ? 'show' : ''}`} id="mainNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4 gap-lg-2">
            <li className="nav-item">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white active fw-semibold' : 'text-secondary'}`
                }
                onClick={closeMenu}
              >
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/movies"
                className={({ isActive }) =>
                  `nav-link px-3 py-2 fw-medium ${isActive ? 'text-white active fw-semibold' : 'text-secondary'}`
                }
                onClick={closeMenu}
              >
                Movies
              </NavLink>
            </li>
            {user && (
              <li className="nav-item">
                <NavLink
                  to="/my-bookings"
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 fw-medium d-flex align-items-center gap-1 ${
                      isActive ? 'text-white active fw-semibold' : 'text-secondary'
                    }`
                  }
                  onClick={closeMenu}
                >
                  <Ticket size={16} />
                  My Bookings
                </NavLink>
              </li>
            )}
            {isAdmin && (
              <li className="nav-item">
                <NavLink
                  to="/admin"
                  className={({ isActive }) =>
                    `nav-link px-3 py-2 fw-medium d-flex align-items-center gap-1 ${
                      isActive ? 'text-warning active fw-semibold' : 'text-warning-emphasis'
                    }`
                  }
                  onClick={closeMenu}
                >
                  <ShieldCheck size={16} className="text-warning" />
                  Admin Dashboard
                </NavLink>
              </li>
            )}
          </ul>

          {/* Right Action Items */}
          <div className="d-flex align-items-center gap-3">
            {user ? (
              <div className="d-flex align-items-center gap-2">
                <div
                  className="d-flex align-items-center gap-2 px-3 py-1 rounded-pill"
                  style={{
                    background: 'rgba(139, 92, 246, 0.15)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                  }}
                >
                  <User size={16} className="text-white" />
                  <span className="text-white small fw-semibold">{user.name}</span>
                  {isAdmin && (
                    <span className="badge bg-warning text-dark text-uppercase" style={{ fontSize: '0.65rem' }}>
                      Admin
                    </span>
                  )}
                </div>
                <button
                  onClick={() => {
                    closeMenu();
                    handleLogout();
                  }}
                  className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1 rounded-pill px-3"
                  title="Sign out"
                >
                  <LogOut size={14} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="d-flex align-items-center gap-2">
                <Link
                  to="/login"
                  className="btn btn-outline-purple btn-sm px-3"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="btn btn-primary-purple btn-sm px-3"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
