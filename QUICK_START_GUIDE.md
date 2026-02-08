# HOMECARE+ Quick Start Guide & Complete Page Templates

## 🚀 Quick Start (5 Minutes)

### 1. Database Setup (2 minutes)
```bash
# Start MySQL
mysql -u root -p

# Run in MySQL:
CREATE DATABASE homecare_plus;
exit;

# Load schema
mysql -u root -p homecare_plus < database/schema.sql
```

### 2. Backend Setup (1 minute)
```bash
cd backend
npm install
cp .env.example .env
# Edit .env - add your MySQL password
npm start
```

### 3. Frontend Setup (2 minutes)
```bash
cd frontend
npm install
# Add logo.png to /public/ folder
npm run dev
```

### 4. Open Browser
```
http://localhost:5173
```

---

## 📄 ALL REMAINING PAGE TEMPLATES

Copy these complete pages into your frontend/src/pages/ folder:

### ChatPage.jsx - AI Chat with Voice
```jsx
import { useState, useEffect, useRef } from 'react';
import { diseaseAPI } from '../services/api';
import { voiceRecognition, textToSpeech, SUPPORTED_LANGUAGES } from '../services/voiceService';
import { useAuth } from '../utils/AuthContext';
import './ChatPage.css';

const ChatPage = () => {
  const { user } = useAuth();
  const [symptoms, setSymptoms] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    // Setup voice recognition callbacks
    voiceRecognition.onResult((result) => {
      setSymptoms(prev => prev + ' ' + result.transcript);
    });

    voiceRecognition.onEnd(() => {
      setIsListening(false);
    });

    voiceRecognition.onError((error) => {
      console.error('Voice error:', error);
      setIsListening(false);
      alert('Voice recognition error. Please try again.');
    });
  }, []);

  const handleVoiceInput = () => {
    if (!voiceRecognition.isSupported()) {
      alert('Voice recognition is not supported in your browser. Please use Chrome.');
      return;
    }

    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
    } else {
      try {
        voiceRecognition.start(selectedLanguage);
        setIsListening(true);
      } catch (error) {
        alert('Please allow microphone access');
      }
    }
  };

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      alert('Please enter or speak your symptoms');
      return;
    }

    setLoading(true);
    try {
      const response = await diseaseAPI.predict(symptoms, user?.userId);
      setPredictions(response.data);
    } catch (error) {
      console.error('Prediction error:', error);
      alert('Failed to predict disease. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!textToSpeech.isSupported()) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      textToSpeech.stop();
      setIsSpeaking(false);
    } else {
      textToSpeech.speak(text, selectedLanguage);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), text.length * 50);
    }
  };

  return (
    <div className="chat-page">
      <div className="container">
        <div className="chat-header">
          <h1>🤖 AI Health Assistant</h1>
          <p>Describe your symptoms and get instant AI-powered predictions</p>
        </div>

        <div className="chat-container">
          <div className="input-section">
            <div className="language-selector">
              <label>Language:</label>
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="symptom-input">
              <textarea
                ref={textareaRef}
                placeholder="Type or speak your symptoms here... e.g., fever, headache, cough"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={6}
              />
              
              <div className="input-controls">
                <button 
                  className={`voice-btn ${isListening ? 'listening' : ''}`}
                  onClick={handleVoiceInput}
                  title="Voice Input"
                >
                  {isListening ? '🔴 Stop' : '🎤 Speak'}
                </button>
                
                <button 
                  className="predict-btn"
                  onClick={handlePredict}
                  disabled={loading || !symptoms.trim()}
                >
                  {loading ? '⏳ Analyzing...' : '🔍 Predict Disease'}
                </button>
                
                <button 
                  className="clear-btn"
                  onClick={() => { setSymptoms(''); setPredictions(null); }}
                >
                  Clear
                </button>
              </div>
            </div>
          </div>

          {predictions && (
            <div className="results-section">
              <h2>Prediction Results</h2>
              
              {predictions.predictions && predictions.predictions.length > 0 ? (
                <div className="predictions-list">
                  {predictions.predictions.map((pred, index) => (
                    <div key={index} className="prediction-card">
                      <div className="prediction-header">
                        <h3>{pred.diseaseInfo?.disease_name || pred.disease}</h3>
                        <span className="confidence">{pred.confidence}% Match</span>
                      </div>
                      
                      {pred.diseaseInfo && (
                        <>
                          <p className="description">{pred.diseaseInfo.description}</p>
                          
                          <div className="disease-details">
                            <div className="detail-section">
                              <h4>Symptoms Matched:</h4>
                              <p>{pred.matchedSymptoms.join(', ')}</p>
                            </div>
                            
                            <div className="detail-section">
                              <h4>Causes:</h4>
                              <p>{pred.diseaseInfo.causes}</p>
                            </div>
                            
                            <div className="detail-section">
                              <h4>Precautions:</h4>
                              <p>{pred.diseaseInfo.precautions}</p>
                            </div>
                            
                            <div className="detail-section">
                              <h4>Treatment:</h4>
                              <p>{pred.diseaseInfo.treatment}</p>
                            </div>
                          </div>
                          
                          <button 
                            className="speak-btn"
                            onClick={() => speakText(pred.diseaseInfo.description)}
                          >
                            {isSpeaking ? '🔇 Stop' : '🔊 Listen'}
                          </button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-results">No matching diseases found. Try different symptoms.</p>
              )}
              
              <div className="disclaimer">
                ⚠️ {predictions.disclaimer}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
```

### OrgansPage.jsx - Organ Systems & Diseases
```jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { organAPI } from '../services/api';
import './OrgansPage.css';

const OrgansPage = () => {
  const [organs, setOrgans] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const organIcons = {
    'Heart': '❤️',
    'Lungs': '🫁',
    'Liver': '🩸',
    'Kidneys': '💧',
    'Brain': '🧠',
    'Stomach': '🥘',
    'Pancreas': '🔬',
    'Intestines': '🌀',
    'Skin': '🤚',
    'Eyes': '👁️'
  };

  useEffect(() => {
    fetchOrgans();
  }, []);

  const fetchOrgans = async () => {
    try {
      const response = await organAPI.getAll();
      setOrgans(response.data.organs);
    } catch (error) {
      console.error('Failed to fetch organs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrganClick = async (organ) => {
    try {
      const response = await organAPI.getDiseases(organ.organ_system);
      // Navigate to a disease list page or show modal
      navigate(`/organs/${organ.organ_system}`, { 
        state: { diseases: response.data.diseases, organ } 
      });
    } catch (error) {
      console.error('Failed to fetch diseases:', error);
    }
  };

  if (loading) {
    return <div className="loading"><div className="spinner"></div></div>;
  }

  return (
    <div className="organs-page">
      <div className="container">
        <div className="organs-header">
          <h1>Explore Organ Systems</h1>
          <p>Learn about different organs and their associated diseases</p>
        </div>

        <div className="organs-grid">
          {organs.map(organ => (
            <div 
              key={organ.organ_id} 
              className="organ-card"
              onClick={() => handleOrganClick(organ)}
            >
              <div className="organ-icon">
                {organIcons[organ.organ_name] || '🏥'}
              </div>
              <h3>{organ.organ_name}</h3>
              <p>{organ.organ_system}</p>
              <div className="organ-overlay">
                <span>View Diseases →</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrgansPage;
```

### EmergencyPage.jsx - Emergency Services
```jsx
import { useState } from 'react';
import './EmergencyPage.css';

const EmergencyPage = () => {
  const [calling, setCalling] = useState(null);

  const emergencyNumbers = [
    {
      id: 'ambulance',
      name: 'Ambulance',
      number: '108',
      alternate: '102',
      icon: '🚑',
      color: '#ef4444',
      description: 'Medical emergencies, accidents, health crises'
    },
    {
      id: 'police',
      name: 'Police',
      number: '100',
      icon: '👮',
      color: '#3b82f6',
      description: 'Crime, theft, safety threats, law enforcement'
    },
    {
      id: 'fire',
      name: 'Fire Brigade',
      number: '101',
      icon: '🚒',
      color: '#f59e0b',
      description: 'Fire emergencies, gas leaks, building hazards'
    }
  ];

  const handleCall = (service) => {
    setCalling(service.id);
    window.location.href = `tel:${service.number}`;
    setTimeout(() => setCalling(null), 2000);
  };

  return (
    <div className="emergency-page">
      <div className="container">
        <div className="emergency-header">
          <h1 className="pulse">🚨 Emergency Services</h1>
          <p>Quick access to essential emergency numbers in India</p>
          <div className="warning">
            Only use these services for genuine emergencies
          </div>
        </div>

        <div className="emergency-grid">
          {emergencyNumbers.map(service => (
            <div 
              key={service.id}
              className="emergency-card"
              style={{ borderColor: service.color }}
            >
              <div className="emergency-icon" style={{ background: service.color }}>
                {service.icon}
              </div>
              
              <h2>{service.name}</h2>
              <p className="description">{service.description}</p>
              
              <div className="numbers">
                <div className="main-number">{service.number}</div>
                {service.alternate && (
                  <div className="alt-number">or {service.alternate}</div>
                )}
              </div>
              
              <button 
                className="call-btn"
                style={{ background: service.color }}
                onClick={() => handleCall(service)}
                disabled={calling === service.id}
              >
                {calling === service.id ? '📞 Calling...' : `Call ${service.name}`}
              </button>
            </div>
          ))}
        </div>

        <div className="additional-info">
          <h3>Additional Emergency Numbers</h3>
          <div className="info-grid">
            <div className="info-item">
              <strong>Women Helpline:</strong> 1091
            </div>
            <div className="info-item">
              <strong>Child Helpline:</strong> 1098
            </div>
            <div className="info-item">
              <strong>Senior Citizen Helpline:</strong> 1291 / 1253
            </div>
            <div className="info-item">
              <strong>Disaster Management:</strong> 1078
            </div>
            <div className="info-item">
              <strong>Road Accident:</strong> 1073
            </div>
            <div className="info-item">
              <strong>Railway Accident:</strong> 1072
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyPage;
```

### LoginPage.jsx & RegisterPage.jsx
```jsx
// LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import './AuthPages.css';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Welcome Back</h2>
        <p>Login to access your health dashboard</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
        
        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
```

---

## 🎨 CSS Files

Create these CSS files in /frontend/src/pages/:

- ChatPage.css
- OrgansPage.css
- EmergencyPage.css
- AuthPages.css
- HomePage.module.css

Basic template for each:
```css
.page-name {
  min-height: 100vh;
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Add your specific styles */
```

---

## ✅ Final Checklist

- [ ] Database created and schema loaded
- [ ] Backend .env configured
- [ ] Backend running on port 5000
- [ ] Frontend dependencies installed
- [ ] Logo added to /public/logo.png
- [ ] All components created
- [ ] All pages created
- [ ] All CSS files created
- [ ] Frontend running on port 5173
- [ ] Test registration
- [ ] Test login
- [ ] Test AI prediction
- [ ] Test voice recognition
- [ ] Test emergency calls
- [ ] Test hospital search

---

## 🎊 You're Done!

Your HOMECARE+ application is now complete and ready to use!

Visit http://localhost:5173 and enjoy your AI-powered healthcare assistant!
