import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import styles from '../styles/Navbar.module.css';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowUserMenu(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setShowUserMenu(false);
  };

  const navLinks = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/chat', label: 'AI Diagnosis', icon: '🤖' },
    { path: '/organs', label: 'Diseases', icon: '📚' },
    { path: '/hospitals', label: 'Hospitals', icon: '🏥' },
    { path: '/emergency', label: 'Emergency', icon: '🚨' }
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
  <img
    src="https://raw.githubusercontent.com/xoxverazz/LOGO_HEALTHCARE/main/logo.png.png"
    alt="logo"
    className={styles.logoImg}
  />
</Link>



        {/* Desktop Navigation */}
        <div className={styles.navLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.navLink} ${location.pathname === link.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        {/* Auth Section */}
        <div className={styles.authSection}>
          {isAuthenticated ? (
            <div className={styles.userMenu}>
              <button 
                className={styles.userButton}
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <div className={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className={styles.userName}>{user?.name || 'User'}</span>
                <svg 
                  className={`${styles.chevron} ${showUserMenu ? styles.chevronUp : ''}`}
                  width="16" 
                  height="16" 
                  viewBox="0 0 16 16" 
                  fill="none"
                >
                  <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {showUserMenu && (
                <div className={styles.dropdownMenu}>
                  <Link to="/profile" className={styles.dropdownItem}>
                    <span className={styles.dropdownIcon}>👤</span>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} className={styles.dropdownItem}>
                    <span className={styles.dropdownIcon}>🚪</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className={styles.authButtons}>
              <Link to="/login" className={styles.loginButton}>
                Login
              </Link>
              <Link to="/register" className={styles.registerButton}>
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className={styles.mobileMenuButton}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.hamburger} ${isMobileMenuOpen ? styles.hamburgerOpen : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.mobileNavLinks}>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`${styles.mobileNavLink} ${location.pathname === link.path ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{link.icon}</span>
              <span>{link.label}</span>
            </Link>
          ))}
        </div>

        <div className={styles.mobileAuthSection}>
          {isAuthenticated ? (
            <>
              <Link to="/profile" className={styles.mobileProfileLink}>
                <div className={styles.userAvatar}>
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span>{user?.name || 'User'}</span>
              </Link>
              <button onClick={handleLogout} className={styles.mobileLogoutButton}>
                Logout
              </button>
            </>
          ) : (
            <div className={styles.mobileAuthButtons}>
              <Link to="/login" className={styles.mobileLoginButton}>
                Login
              </Link>
              <Link to="/register" className={styles.mobileRegisterButton}>
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div 
          className={styles.overlay}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </nav>
  );
};

export default Navbar;
