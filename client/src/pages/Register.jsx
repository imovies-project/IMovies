import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, User, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      await register({ name, email, phone, password });
      toast.success('Registration successful! Welcome to IMovies.');
      navigate('/');
    } catch (err) {
      console.error('Registration failure:', err);
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '480px' }}>
        <div className="glass-panel p-4 p-md-5">
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center rounded-3 p-3 mb-3 shadow"
              style={{
                background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)',
                boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)',
              }}
            >
              <Film size={28} className="text-white" />
            </div>
            <h2 className="text-white fw-bold brand-font mb-1">Create an Account</h2>
            <p className="text-secondary small">Join IMovies for seamless ticket bookings</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-secondary small fw-medium mb-1">Full Name *</label>
              <div className="position-relative">
                <User
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: '14px' }}
                />
                <input
                  type="text"
                  name="name"
                  className="form-control form-control-dark ps-5"
                  placeholder="e.g. Priya Sharma"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-secondary small fw-medium mb-1">Email Address *</label>
              <div className="position-relative">
                <Mail
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: '14px' }}
                />
                <input
                  type="email"
                  name="email"
                  className="form-control form-control-dark ps-5"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="text-secondary small fw-medium mb-1">Mobile Phone (Optional)</label>
              <div className="position-relative">
                <Phone
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: '14px' }}
                />
                <input
                  type="tel"
                  name="phone"
                  className="form-control form-control-dark ps-5"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row g-2 mb-4">
              <div className="col-sm-6">
                <label className="text-secondary small fw-medium mb-1">Password *</label>
                <div className="position-relative">
                  <Lock
                    size={18}
                    className="position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: '14px' }}
                  />
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-dark ps-5"
                    placeholder="Min 6 chars"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-sm-6">
                <label className="text-secondary small fw-medium mb-1">Confirm Password *</label>
                <div className="position-relative">
                  <Lock
                    size={18}
                    className="position-absolute top-50 translate-middle-y text-muted"
                    style={{ left: '14px' }}
                  />
                  <input
                    type="password"
                    name="confirmPassword"
                    className="form-control form-control-dark ps-5"
                    placeholder="Repeat"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary-purple w-100 py-2 fs-6 mb-3"
            >
              {loading ? (
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="spinner-border spinner-border-sm" role="status"></span>
                  <span>Creating Account...</span>
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="text-center text-secondary small pt-3 border-top border-secondary border-opacity-10">
            Already have an account?{' '}
            <Link to="/login" className="fw-semibold text-decoration-none" style={{ color: '#a78bfa' }}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
