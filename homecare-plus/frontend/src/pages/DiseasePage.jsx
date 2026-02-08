import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { diseaseAPI } from '../services/api';
import { textToSpeech } from '../services/voiceService';
import './DiseasePage.css';

const DiseasePage = () => {
  const { diseaseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [disease, setDisease] = useState(location.state?.disease || null);
  const [loading, setLoading] = useState(!disease);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    if (!disease) {
      fetchDiseaseDetails();
    }
  }, [diseaseId]);

  const fetchDiseaseDetails = async () => {
    try {
      const response = await diseaseAPI.getDetails(diseaseId);
      if (response.data.success) {
        setDisease(response.data.disease);
      }
    } catch (error) {
      console.error('Failed to fetch disease details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text) => {
    if (!textToSpeech.isSupported()) {
      alert('Text-to-speech is not supported in your browser.');
      return;
    }

    if (isSpeaking) {
      textToSpeech.stop();
      setIsSpeaking(false);
    } else {
      const fullText = `${disease.disease_name}. ${text}`;
      textToSpeech.speak(fullText);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), fullText.length * 50);
    }
  };

  const handleFindHospitals = () => {
    navigate('/hospitals');
  };

  const getSeverityColor = (severity) => {
    const colors = {
      low: '#10b981',
      moderate: '#f59e0b',
      high: '#ef4444',
      critical: '#dc2626'
    };
    return colors[severity] || colors.moderate;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading disease information...</p>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="error-container">
        <div className="error-icon">⚠️</div>
        <h2>Disease Not Found</h2>
        <p>The disease you're looking for doesn't exist.</p>
        <button onClick={() => navigate('/organs')}>Browse All Diseases</button>
      </div>
    );
  }

  return (
    <div className="disease-page">
      <div className="container">
        {/* Back Button */}
        <button className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        {/* Disease Header */}
        <div className="disease-header">
          <div className="header-content">
            <div className="disease-title-section">
              <h1>{disease.disease_name}</h1>
              <div className="disease-meta">
                <span className="organ-badge">
                  <span className="badge-icon">🫀</span>
                  {disease.organ_system}
                </span>
                <span 
                  className="severity-badge"
                  style={{ 
                    background: `${getSeverityColor(disease.severity_level)}20`,
                    color: getSeverityColor(disease.severity_level)
                  }}
                >
                  {(disease.severity_level || 'moderate').toUpperCase()}
                </span>
              </div>
            </div>
            <button 
              className="speak-btn-header"
              onClick={() => handleSpeak(disease.description)}
            >
              <span>{isSpeaking ? '🔇' : '🔊'}</span>
              {isSpeaking ? 'Stop' : 'Listen'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="disease-content">
          {/* Description */}
          <section className="content-section description-section">
            <div className="section-header">
              <h2>
                <span className="section-icon">📋</span>
                What is {disease.disease_name}?
              </h2>
            </div>
            <p className="description-text">{disease.description}</p>
          </section>

          {/* Two Column Layout */}
          <div className="two-column-layout">
            {/* Left Column */}
            <div className="left-column">
              {/* Symptoms */}
              <section className="content-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">🩺</span>
                    Symptoms
                  </h2>
                </div>
                <div className="symptom-list">
                  {disease.symptoms.split(',').map((symptom, index) => (
                    <div key={index} className="symptom-item">
                      <span className="symptom-bullet">•</span>
                      {symptom.trim()}
                    </div>
                  ))}
                </div>
              </section>

              {/* Causes */}
              <section className="content-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">🦠</span>
                    Causes
                  </h2>
                </div>
                <p>{disease.causes}</p>
              </section>

              {/* Transmission */}
              {disease.transmission && (
                <section className="content-section">
                  <div className="section-header">
                    <h2>
                      <span className="section-icon">📡</span>
                      How it Spreads
                    </h2>
                  </div>
                  <div className="transmission-box">
                    <p>{disease.transmission}</p>
                  </div>
                </section>
              )}
            </div>

            {/* Right Column */}
            <div className="right-column">
              {/* Precautions */}
              <section className="content-section precautions-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">🛡️</span>
                    Precautions
                  </h2>
                </div>
                <div className="precaution-list">
                  {disease.precautions.split(',').map((precaution, index) => (
                    <div key={index} className="precaution-item">
                      <span className="check-icon">✓</span>
                      {precaution.trim()}
                    </div>
                  ))}
                </div>
              </section>

              {/* Treatment */}
              <section className="content-section treatment-section">
                <div className="section-header">
                  <h2>
                    <span className="section-icon">💊</span>
                    Treatment
                  </h2>
                </div>
                <p>{disease.treatment}</p>
              </section>

              {/* Medicines */}
              {disease.medicines && (
                <section className="content-section medicines-section">
                  <div className="section-header">
                    <h2>
                      <span className="section-icon">💉</span>
                      Common Medications
                    </h2>
                  </div>
                  <div className="medicine-list">
                    {disease.medicines.split(',').map((medicine, index) => (
                      <span key={index} className="medicine-tag">
                        {medicine.trim()}
                      </span>
                    ))}
                  </div>
                  <div className="medicine-disclaimer">
                    ⚠️ Always consult a healthcare professional before taking any medication
                  </div>
                </section>
              )}
            </div>
          </div>

          {/* India Context */}
          {disease.prevalence_in_india && (
            <section className="content-section india-section">
              <div className="section-header">
                <h2>
                  <span className="section-icon">🇮🇳</span>
                  Prevalence in India
                </h2>
              </div>
              <div className="india-content">
                <p>{disease.prevalence_in_india}</p>
              </div>
            </section>
          )}

          {/* Action Buttons */}
          <div className="action-section">
            <button 
              className="primary-action-btn"
              onClick={handleFindHospitals}
            >
              <span className="btn-icon">🏥</span>
              <div className="btn-content">
                <span className="btn-title">Find Nearby Hospitals</span>
                <span className="btn-subtitle">Get treatment from qualified doctors</span>
              </div>
            </button>

            <button 
              className="secondary-action-btn"
              onClick={() => navigate('/emergency')}
            >
              <span className="btn-icon">🚨</span>
              <div className="btn-content">
                <span className="btn-title">Emergency Services</span>
                <span className="btn-subtitle">Quick access to ambulance & emergency</span>
              </div>
            </button>

            <button 
              className="secondary-action-btn"
              onClick={() => navigate('/chat')}
            >
              <span className="btn-icon">🤖</span>
              <div className="btn-content">
                <span className="btn-title">AI Diagnosis</span>
                <span className="btn-subtitle">Check other symptoms</span>
              </div>
            </button>
          </div>

          {/* Disclaimer */}
          <div className="disclaimer-section">
            <div className="disclaimer-icon">⚠️</div>
            <div className="disclaimer-content">
              <strong>Medical Disclaimer</strong>
              <p>
                This information is for educational purposes only and should not be used as a 
                substitute for professional medical advice, diagnosis, or treatment. Always seek 
                the advice of your physician or other qualified health provider with any questions 
                you may have regarding a medical condition.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiseasePage;
