import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Redirect to home page or previous page
        navigate('/');
      } else {
        setError(result.message || 'Login failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth integration would go here
    alert('Google Sign-In coming soon! For now, please use email/password registration.');
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-content">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="brand-content">
              <div className="brand-icon">🏥</div>
              <h1>HOMECARE<span className="brand-plus">+</span></h1>
              <p className="brand-tagline">Your AI-Powered Healthcare Companion</p>
              
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>AI Disease Prediction</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Multi-Language Support</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Find Nearby Hospitals</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Emergency Services</span>
                </div>
              </div>

              <div className="testimonial">
                <p>"HOMECARE+ helped me understand my symptoms and find the right doctor quickly!"</p>
                <span className="testimonial-author">- Priya S., Mumbai</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2>Welcome Back</h2>
                <p>Sign in to access your health dashboard</p>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form">
                <div className="form-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📧</span>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <span className="input-icon">🔒</span>
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <div className="form-options">
                  <label className="remember-me">
                    <input type="checkbox" />
                    <span>Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="forgot-password">
                    Forgot password?
                  </Link>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Signing in...
                    </>
                  ) : (
                    <>
                      <span>Sign In</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="divider">
                <span>or continue with</span>
              </div>

              <button 
                type="button"
                className="google-btn"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link to="/register" className="auth-link">
                    Sign up for free
                  </Link>
                </p>
              </div>

              <div className="guest-access">
                <p>or</p>
                <Link to="/" className="guest-link">
                  Continue as Guest
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
