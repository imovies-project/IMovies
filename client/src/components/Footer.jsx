import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Heart, Shield, Sparkles } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="mt-auto pt-5 pb-4 border-top border-secondary border-opacity-10" style={{ background: '#08090e' }}>
      <div className="container">
        <div className="row g-4 pb-4">
          <div className="col-lg-4 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex align-items-center justify-content-center rounded-3 p-2"
                style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}
              >
                <Film size={20} className="text-white" />
              </div>
              <span className="brand-font fs-4 fw-bold text-white">
                I<span style={{ color: '#a78bfa' }}>Movies</span>
              </span>
            </div>
            <p className="text-muted small pe-lg-3">
              Movie Ticket Booking Made Simple. Experience seamless cinema seat selection, instant confirmations, and premium cinematic entertainment.
            </p>
            <div className="d-flex gap-2">
              <span className="badge bg-dark border border-secondary text-secondary small py-2 px-3">
                MERN Stack MVP
              </span>
              <span className="badge bg-dark border border-secondary text-secondary small py-2 px-3">
                React + Vite
              </span>
            </div>
          </div>

          <div className="col-lg-2 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Explore</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
              <li><Link to="/" className="text-decoration-none text-secondary">Home</Link></li>
              <li><Link to="/movies" className="text-decoration-none text-secondary">Now Showing</Link></li>
              <li><Link to="/movies?status=coming-soon" className="text-decoration-none text-secondary">Coming Soon</Link></li>
              <li><Link to="/my-bookings" className="text-decoration-none text-secondary">My Bookings</Link></li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-3 col-6">
            <h6 className="text-white fw-bold mb-3">Cinema Experience</h6>
            <ul className="list-unstyled small text-muted d-flex flex-column gap-2">
              <li className="d-flex align-items-center gap-2">
                <Sparkles size={14} className="text-warning" />
                <span>IMAX with Laser</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Sparkles size={14} className="text-primary" />
                <span>Dolby Atmos 7.1</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Sparkles size={14} className="text-danger" />
                <span>4DX Motion Seats</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <Shield size={14} className="text-success" />
                <span>Instant E-Ticket Delivery</span>
              </li>
            </ul>
          </div>

          <div className="col-lg-3 col-md-12">
            <div className="p-3 rounded-4 glass-panel">
              <h6 className="text-white fw-bold mb-2 small">Project Information</h6>
              <p className="text-muted small mb-2">
                College Project MVP demonstrating full-stack cinema booking with atomic seat reservation conflict prevention.
              </p>
              <div className="small text-secondary">
                Mock Payment Gateway: <span className="text-success fw-bold">Active (Test Mode)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-top border-secondary border-opacity-10 d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 small text-muted">
          <div>
            &copy; {new Date().getFullYear()} IMovies Cinema Platform. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Built with <Heart size={14} className="text-danger fill-danger" /> for academic demonstration.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
