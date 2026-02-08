import { useState, useEffect, useRef } from 'react';
import { diseaseAPI } from '../services/api';
import { voiceRecognition, textToSpeech, SUPPORTED_LANGUAGES } from '../services/voiceService';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import './ChatPage.css';

const ChatPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [symptoms, setSymptoms] = useState('');
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en-IN');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    // Setup voice recognition callbacks
    if (voiceRecognition.isSupported()) {
      voiceRecognition.onResult((result) => {
        setSymptoms(prev => {
          const newText = prev ? prev + ' ' + result.transcript : result.transcript;
          return newText;
        });
      });

      voiceRecognition.onEnd(() => {
        setIsListening(false);
      });

      voiceRecognition.onError((error) => {
        console.error('Voice error:', error);
        setIsListening(false);
        setError('Voice recognition error. Please try again or type your symptoms.');
      });
    }
  }, []);

  const handleVoiceInput = () => {
    if (!voiceRecognition.isSupported()) {
      alert('Voice recognition is not supported in your browser. Please use Google Chrome for the best experience.');
      return;
    }

    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
    } else {
      try {
        voiceRecognition.start(selectedLanguage);
        setIsListening(true);
        setError('');
      } catch (error) {
        console.error('Microphone error:', error);
        alert('Please allow microphone access to use voice input.');
      }
    }
  };

  const handlePredict = async () => {
    if (!symptoms.trim()) {
      setError('Please enter or speak your symptoms');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const response = await diseaseAPI.predict(symptoms, user?.userId);
      
      if (response.data.success) {
        setPredictions(response.data);
      } else {
        setError('Failed to predict disease. Please try again.');
      }
    } catch (error) {
      console.error('Prediction error:', error);
      setError('Failed to connect to the server. Please check your connection and try again.');
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
      // Estimate speaking duration
      const duration = text.length * 50; // ~50ms per character
      setTimeout(() => setIsSpeaking(false), duration);
    }
  };

  const handleClear = () => {
    setSymptoms('');
    setPredictions(null);
    setError('');
    if (isListening) {
      voiceRecognition.stop();
      setIsListening(false);
    }
    if (isSpeaking) {
      textToSpeech.stop();
      setIsSpeaking(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handlePredict();
    }
  };

  return (
    <div className="chat-page">
      <div className="container">
        {/* Header */}
        <div className="chat-header">
          <div className="header-content">
            <div className="header-icon">🤖</div>
            <div className="header-text">
              <h1>AI Health Assistant</h1>
              <p>Describe your symptoms and get instant AI-powered disease predictions</p>
            </div>
          </div>
          {user && (
            <div className="user-greeting">
              Welcome back, <strong>{user.full_name}</strong>!
            </div>
          )}
        </div>

        <div className="chat-container">
          {/* Language Selector */}
          <div className="language-selector-section">
            <div className="language-selector">
              <label htmlFor="language-select">
                <span className="label-icon">🌍</span>
                Select Language:
              </label>
              <select 
                id="language-select"
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="language-dropdown"
              >
                {SUPPORTED_LANGUAGES.map(lang => (
                  <option key={lang.code} value={lang.code}>
                    {lang.flag} {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="language-info">
              Voice input and speech output will use the selected language
            </div>
          </div>

          {/* Input Section */}
          <div className="input-section">
            <div className="input-header">
              <h3>Tell us about your symptoms</h3>
              <p>You can type or use voice input</p>
            </div>

            <div className="symptom-input-container">
              <textarea
                ref={textareaRef}
                placeholder="Type or speak your symptoms here... 

Examples:
• I have fever and headache for 2 days
• Stomach pain, nausea, and vomiting
• Persistent cough with chest pain
• High fever with body ache

Press Ctrl+Enter to predict or click the button below"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                onKeyPress={handleKeyPress}
                rows={8}
                className="symptom-textarea"
                disabled={isListening}
              />
              
              {isListening && (
                <div className="listening-indicator">
                  <div className="listening-animation">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                  <p>Listening... Speak now</p>
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                <span className="error-icon">⚠️</span>
                {error}
              </div>
            )}

            <div className="input-controls">
              <button 
                className={`voice-btn ${isListening ? 'listening' : ''}`}
                onClick={handleVoiceInput}
                title="Voice Input"
                disabled={loading}
              >
                <span className="btn-icon">{isListening ? '🔴' : '🎤'}</span>
                <span className="btn-text">{isListening ? 'Stop Recording' : 'Voice Input'}</span>
              </button>
              
              <button 
                className="predict-btn"
                onClick={handlePredict}
                disabled={loading || !symptoms.trim() || isListening}
              >
                <span className="btn-icon">{loading ? '⏳' : '🔍'}</span>
                <span className="btn-text">{loading ? 'Analyzing...' : 'Predict Disease'}</span>
              </button>
              
              <button 
                className="clear-btn"
                onClick={handleClear}
                disabled={loading}
                title="Clear all"
              >
                <span className="btn-icon">🗑️</span>
                <span className="btn-text">Clear</span>
              </button>
            </div>

            <div className="input-hint">
              💡 Tip: Be as specific as possible. Include duration, severity, and any related symptoms.
            </div>
          </div>

          {/* Results Section */}
          {predictions && (
            <div className="results-section">
              <div className="results-header">
                <h2>
                  <span className="results-icon">📊</span>
                  Prediction Results
                </h2>
                {predictions.totalMatches > 0 && (
                  <span className="results-count">
                    {predictions.totalMatches} possible {predictions.totalMatches === 1 ? 'match' : 'matches'} found
                  </span>
                )}
              </div>
              
              {predictions.predictions && predictions.predictions.length > 0 ? (
                <div className="predictions-list">
                  {predictions.predictions.map((pred, index) => (
                    <div key={index} className={`prediction-card rank-${index + 1}`}>
                      <div className="prediction-rank">#{index + 1}</div>
                      
                      <div className="prediction-header">
                        <div className="disease-info">
                          <h3>{pred.diseaseInfo?.disease_name || pred.disease}</h3>
                          {pred.diseaseInfo?.organ_system && (
                            <span className="organ-badge">{pred.diseaseInfo.organ_system}</span>
                          )}
                        </div>
                        <div className="confidence-badge">
                          <div className="confidence-circle">
                            <svg viewBox="0 0 36 36" className="circular-chart">
                              <path
                                className="circle-bg"
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="circle"
                                strokeDasharray={`${pred.confidence}, 100`}
                                d="M18 2.0845
                                  a 15.9155 15.9155 0 0 1 0 31.831
                                  a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            <div className="confidence-text">
                              <span className="percentage">{pred.confidence}%</span>
                              <span className="label">Match</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {pred.diseaseInfo && (
                        <>
                          <div className="disease-description">
                            <p>{pred.diseaseInfo.description}</p>
                          </div>
                          
                          <div className="disease-details">
                            <div className="detail-section">
                              <div className="detail-header">
                                <span className="detail-icon">🎯</span>
                                <h4>Matched Symptoms</h4>
                              </div>
                              <div className="symptoms-tags">
                                {pred.matchedSymptoms.map((symptom, idx) => (
                                  <span key={idx} className="symptom-tag">{symptom}</span>
                                ))}
                              </div>
                            </div>
                            
                            <div className="detail-section">
                              <div className="detail-header">
                                <span className="detail-icon">🦠</span>
                                <h4>Causes</h4>
                              </div>
                              <p>{pred.diseaseInfo.causes}</p>
                            </div>
                            
                            <div className="detail-section">
                              <div className="detail-header">
                                <span className="detail-icon">🛡️</span>
                                <h4>Precautions</h4>
                              </div>
                              <p>{pred.diseaseInfo.precautions}</p>
                            </div>
                            
                            {pred.diseaseInfo.transmission && (
                              <div className="detail-section">
                                <div className="detail-header">
                                  <span className="detail-icon">📡</span>
                                  <h4>How it Spreads</h4>
                                </div>
                                <p>{pred.diseaseInfo.transmission}</p>
                              </div>
                            )}
                            
                            <div className="detail-section">
                              <div className="detail-header">
                                <span className="detail-icon">💊</span>
                                <h4>Treatment</h4>
                              </div>
                              <p>{pred.diseaseInfo.treatment}</p>
                            </div>
                            
                            {pred.diseaseInfo.medicines && (
                              <div className="detail-section">
                                <div className="detail-header">
                                  <span className="detail-icon">💉</span>
                                  <h4>Common Medications</h4>
                                </div>
                                <p>{pred.diseaseInfo.medicines}</p>
                              </div>
                            )}

                            {pred.diseaseInfo.prevalence_in_india && (
                              <div className="detail-section india-context">
                                <div className="detail-header">
                                  <span className="detail-icon">🇮🇳</span>
                                  <h4>Prevalence in India</h4>
                                </div>
                                <p>{pred.diseaseInfo.prevalence_in_india}</p>
                              </div>
                            )}
                          </div>
                          
                          <div className="card-actions">
                            <button 
                              className="speak-btn"
                              onClick={() => speakText(pred.diseaseInfo.description + '. ' + pred.diseaseInfo.treatment)}
                            >
                              <span className="btn-icon">{isSpeaking ? '🔇' : '🔊'}</span>
                              <span className="btn-text">{isSpeaking ? 'Stop Speaking' : 'Listen to Details'}</span>
                            </button>
                            
                            <button 
                              className="hospital-btn"
                              onClick={() => navigate('/hospitals')}
                            >
                              <span className="btn-icon">🏥</span>
                              <span className="btn-text">Find Nearby Hospitals</span>
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>No Matching Diseases Found</h3>
                  <p>We couldn't find any diseases matching your symptoms. This could mean:</p>
                  <ul>
                    <li>Your symptoms are very mild and not serious</li>
                    <li>The symptoms need more detail for accurate prediction</li>
                    <li>It's a rare condition not in our database</li>
                  </ul>
                  <p className="advice">We recommend consulting a healthcare professional for proper diagnosis.</p>
                </div>
              )}
              
              <div className="disclaimer-box">
                <div className="disclaimer-header">
                  <span className="disclaimer-icon">⚠️</span>
                  <strong>Important Medical Disclaimer</strong>
                </div>
                <p>{predictions.disclaimer || 'This is an AI-based prediction for informational purposes only. Please consult a qualified healthcare professional for accurate diagnosis and treatment.'}</p>
                <div className="disclaimer-actions">
                  <button 
                    className="emergency-btn"
                    onClick={() => navigate('/emergency')}
                  >
                    <span>🚨</span> Emergency Services
                  </button>
                  <button 
                    className="consult-btn"
                    onClick={() => navigate('/hospitals')}
                  >
                    <span>👨‍⚕️</span> Find Doctor
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Quick Tips */}
          {!predictions && (
            <div className="quick-tips">
              <h3>
                <span className="tips-icon">💡</span>
                Quick Tips for Better Results
              </h3>
              <div className="tips-grid">
                <div className="tip-card">
                  <span className="tip-number">1</span>
                  <h4>Be Specific</h4>
                  <p>Include details like "high fever for 3 days" instead of just "fever"</p>
                </div>
                <div className="tip-card">
                  <span className="tip-number">2</span>
                  <h4>Multiple Symptoms</h4>
                  <p>List all symptoms you're experiencing, even minor ones</p>
                </div>
                <div className="tip-card">
                  <span className="tip-number">3</span>
                  <h4>Duration Matters</h4>
                  <p>Mention how long you've had the symptoms</p>
                </div>
                <div className="tip-card">
                  <span className="tip-number">4</span>
                  <h4>Use Voice Input</h4>
                  <p>Try voice input for faster and easier symptom entry</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
