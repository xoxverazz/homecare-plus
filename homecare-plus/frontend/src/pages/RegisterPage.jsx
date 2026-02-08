import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './AuthPages.css';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    date_of_birth: '',
    gender: '',
    agreeToTerms: false
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    setError(''); // Clear error when user types
  };

  const validateForm = () => {
    // Full name validation
    if (!formData.full_name.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (formData.full_name.trim().length < 3) {
      setError('Name must be at least 3 characters long');
      return false;
    }

    // Email validation
    if (!formData.email) {
      setError('Please enter your email address');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }

    // Phone number validation (optional but if provided, validate)
    if (formData.phone_number) {
      const phoneRegex = /^[0-9]{10}$/;
      if (!phoneRegex.test(formData.phone_number.replace(/\D/g, ''))) {
        setError('Please enter a valid 10-digit phone number');
        return false;
      }
    }

    // Terms agreement
    if (!formData.agreeToTerms) {
      setError('Please accept the Terms and Conditions');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Prepare data for API
      const userData = {
        email: formData.email,
        password: formData.password,
        full_name: formData.full_name,
        phone_number: formData.phone_number || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null
      };

      const result = await register(userData);
      
      if (result.success) {
        // Redirect to home page after successful registration
        navigate('/');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    // Google OAuth integration would go here
    alert('Google Sign-Up coming soon! For now, please use email/password registration.');
  };

  return (
    <div className="auth-page">
      <div className="auth-background">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
      </div>

      <div className="auth-container">
        <div className="auth-content register-content">
          {/* Left Side - Branding */}
          <div className="auth-branding">
            <div className="brand-content">
              <div className="brand-icon">🏥</div>
              <h1>HOMECARE<span className="brand-plus">+</span></h1>
              <p className="brand-tagline">Join thousands using AI for better health</p>
              
              <div className="brand-features">
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Free AI Health Assistant</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Save Medical History</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>Track Your Symptoms</span>
                </div>
                <div className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>24/7 Emergency Access</span>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Active Users</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Diseases</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">12+</div>
                  <div className="stat-label">Languages</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Register Form */}
          <div className="auth-form-section">
            <div className="auth-form-container">
              <div className="auth-header">
                <h2>Create Account</h2>
                <p>Start your health journey with us today</p>
              </div>

              {error && (
                <div className="error-message">
                  <span className="error-icon">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="auth-form register-form">
                <div className="form-group">
                  <label htmlFor="full_name"> &nbsp; &nbsp; Full Name *</label>
                  <div className="input-wrapper">
                    <span className="input-icon">👤</span>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      placeholder="Enter your full name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="name"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
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

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="password">Password *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="new-password"
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

                  <div className="form-group">
                    <label htmlFor="confirmPassword">Confirm Password *</label>
                    <div className="input-wrapper">
                      <span className="input-icon">🔒</span>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        disabled={loading}
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="toggle-password"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="phone_number">Phone Number (Optional)</label>
                  <div className="input-wrapper">
                    <span className="input-icon">📱</span>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      placeholder="Enter 10-digit phone number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      disabled={loading}
                      autoComplete="tel"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="date_of_birth">Date of Birth (Optional)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">📅</span>
                      <input
                        type="date"
                        id="date_of_birth"
                        name="date_of_birth"
                        value={formData.date_of_birth}
                        onChange={handleChange}
                        disabled={loading}
                        max={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="gender">Gender (Optional)</label>
                    <div className="input-wrapper">
                      <span className="input-icon">⚧️</span>
                      <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        disabled={loading}
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group checkbox-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleChange}
                      disabled={loading}
                    />
                    <span>
                      I agree to the{' '}
                      <Link to="/terms" target="_blank">Terms and Conditions</Link>
                      {' '}and{' '}
                      <Link to="/privacy" target="_blank">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-small"></span>
                      Creating account...
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <span className="btn-arrow">→</span>
                    </>
                  )}
                </button>
              </form>

              <div className="divider">
                <span>or sign up with</span>
              </div>

              <button 
                type="button"
                className="google-btn"
                onClick={handleGoogleSignup}
                disabled={loading}
              >
                <svg viewBox="0 0 24 24" width="20" height="20">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Sign up with Google</span>
              </button>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link to="/login" className="auth-link">
                    Sign in
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

export default RegisterPage;
