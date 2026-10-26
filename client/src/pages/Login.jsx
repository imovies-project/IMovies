import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, Lock, Mail, UserCheck, ShieldAlert } from 'lucide-react';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
      toast.success('Welcome back!');
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login failure:', err);
      toast.error(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  // Quick autofill buttons for evaluation
  const fillDemoAdmin = () => {
    setEmail('admin@imovies.com');
    setPassword('Admin@12345');
    toast.info('Filled Admin credentials');
  };

  const fillDemoUser = () => {
    setEmail('priya@example.com');
    setPassword('User@12345');
    toast.info('Filled Demo User credentials');
  };

  return (
    <div className="container py-5">
      <div className="mx-auto" style={{ maxWidth: '440px' }}>
        <div className="glass-panel p-4 p-md-5">
          {/* Logo & Header */}
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
            <h2 className="text-white fw-bold brand-font mb-1">Welcome Back</h2>
            <p className="text-secondary small">Sign in to book tickets and manage reservations</p>
          </div>

          {/* Quick Demo Credentials Banner */}
          <div
            className="p-3 rounded-3 mb-4 text-center"
            style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
            }}
          >
            <div className="text-muted small fw-semibold mb-2">Quick Demo Autofill:</div>
            <div className="d-flex justify-content-center gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="btn btn-outline-warning btn-sm"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={fillDemoUser}
                className="btn btn-outline-purple btn-sm"
              >
                User Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="text-secondary small fw-medium mb-1">Email Address</label>
              <div className="position-relative">
                <Mail
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: '14px' }}
                />
                <input
                  type="email"
                  className="form-control form-control-dark ps-5"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="text-secondary small fw-medium mb-1">Password</label>
              <div className="position-relative">
                <Lock
                  size={18}
                  className="position-absolute top-50 translate-middle-y text-muted"
                  style={{ left: '14px' }}
                />
                <input
                  type="password"
                  className="form-control form-control-dark ps-5"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
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
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="text-center text-secondary small pt-3 border-top border-secondary border-opacity-10">
            Don't have an account yet?{' '}
            <Link to="/register" className="fw-semibold text-decoration-none" style={{ color: '#a78bfa' }}>
              Create an Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
