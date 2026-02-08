import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles/global.css';

// Pages
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import OrgansPage from './pages/OrgansPage';
import DiseasePage from './pages/DiseasePage';
import HospitalMapPage from './pages/HospitalMapPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import EmergencyPage from './pages/EmergencyPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Context
import { AuthProvider } from './utils/AuthContext';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div className="spinner" style={{ 
            margin: '0 auto 1rem',
            borderColor: 'rgba(255,255,255,0.2)',
            borderTopColor: 'white'
          }}></div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', marginBottom: '0.5rem' }}>
            HOMECARE+
          </h2>
          <p style={{ opacity: 0.9 }}>Loading your healthcare companion...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/chat" element={<ChatPage />} />
            <Route path="/organs" element={<OrgansPage />} />
            <Route path="/disease/:diseaseId" element={<DiseasePage />} />
            <Route path="/hospitals" element={<HospitalMapPage />} />
            <Route path="/emergency" element={<EmergencyPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
          </Routes>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
