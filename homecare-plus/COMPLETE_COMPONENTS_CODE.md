# Complete Component Code for HOMECARE+

Copy and paste these complete component files into your project.

## 1. Navbar Component
**File: `/frontend/src/components/Navbar.jsx`**

```jsx
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="logo">
            <img src="/logo.png" alt="HOMECARE+" className="logo-img" onError={(e) => e.target.style.display = 'none'} />
            <span className="logo-text">HOMECARE<span className="logo-plus">+</span></span>
          </Link>
          
          <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
            <Link to="/chat" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">🤖</span> AI Diagnosis
            </Link>
            <Link to="/organs" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">🫀</span> Diseases
            </Link>
            <Link to="/hospitals" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">🏥</span> Hospitals
            </Link>
            <Link to="/emergency" className="emergency-link" onClick={() => setMenuOpen(false)}>
              <span className="nav-icon">🚨</span> Emergency
            </Link>
            
            {isAuthenticated ? (
              <>
                <Link to="/profile" onClick={() => setMenuOpen(false)}>
                  <span className="nav-icon">👤</span> Profile
                </Link>
                <button onClick={handleLogout} className="logout-btn">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="register-btn" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            )}
          </div>
          
          <button className="menu-btn" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
```

**File: `/frontend/src/components/Navbar.css`**

```css
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 900;
  color: var(--gray-900);
  text-decoration: none;
  transition: transform 0.3s;
}

.logo:hover {
  transform: scale(1.05);
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.logo-plus {
  color: var(--primary);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--gray-700);
  font-weight: 500;
  text-decoration: none;
  transition: color 0.3s;
  padding: 0.5rem;
}

.nav-links a:hover {
  color: var(--primary);
}

.nav-icon {
  font-size: 1.2rem;
}

.emergency-link {
  color: var(--danger) !important;
  font-weight: 600;
  animation: pulse 2s infinite;
}

.logout-btn,
.register-btn {
  padding: 0.5rem 1.5rem;
  border-radius: 2rem;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
  cursor: pointer;
  background: var(--primary);
  color: white;
}

.logout-btn:hover,
.register-btn:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--gray-700);
}

@media (max-width: 768px) {
  .menu-btn {
    display: block;
  }
  
  .nav-links {
    position: fixed;
    top: 70px;
    right: -100%;
    width: 250px;
    height: calc(100vh - 70px);
    background: white;
    flex-direction: column;
    align-items: flex-start;
    padding: 2rem;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    transition: right 0.3s;
  }
  
  .nav-links.active {
    right: 0;
  }
}
```

---

## 2. Footer Component
**File: `/frontend/src/components/Footer.jsx`**

```jsx
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>HOMECARE<span className="footer-plus">+</span></h3>
            <p>Your trusted AI-powered healthcare companion for disease prediction and medical assistance.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <Link to="/chat">AI Diagnosis</Link>
            <Link to="/organs">Diseases</Link>
            <Link to="/hospitals">Find Hospitals</Link>
            <Link to="/emergency">Emergency</Link>
          </div>
          
          <div className="footer-section">
            <h4>Account</h4>
            <Link to="/login">Login</Link>
            <Link to="/register">Sign Up</Link>
            <Link to="/profile">Profile</Link>
          </div>
          
          <div className="footer-section">
            <h4>Disclaimer</h4>
            <p className="disclaimer">
              HOMECARE+ provides AI-based predictions for informational purposes only. 
              Always consult a qualified healthcare professional for medical advice.
            </p>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} HOMECARE+. All rights reserved.</p>
          <p>Made with ❤️ for better healthcare accessibility</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
```

**File: `/frontend/src/components/Footer.css`**

```css
.footer {
  background: var(--gray-900);
  color: white;
  padding: 3rem 0 1rem;
  margin-top: 4rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section h3 {
  font-family: var(--font-display);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: white;
}

.footer-plus {
  color: var(--primary);
}

.footer-section h4 {
  color: white;
  margin-bottom: 1rem;
}

.footer-section a {
  display: block;
  color: var(--gray-300);
  margin-bottom: 0.5rem;
  transition: color 0.3s;
}

.footer-section a:hover {
  color: var(--primary);
}

.disclaimer {
  font-size: 0.875rem;
  color: var(--gray-400);
  line-height: 1.6;
}

.footer-bottom {
  border-top: 1px solid var(--gray-700);
  padding-top: 2rem;
  text-align: center;
  color: var(--gray-400);
}

.footer-bottom p {
  margin: 0.5rem 0;
}
```

---

## 3. ProtectedRoute Component
**File: `/frontend/src/components/ProtectedRoute.jsx`**

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh' 
      }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
```
