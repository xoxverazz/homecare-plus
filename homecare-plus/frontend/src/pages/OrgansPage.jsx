import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { organAPI, diseaseAPI } from '../services/api';
import './OrgansPage.css';

const OrgansPage = () => {
  const [organs, setOrgans] = useState([]);
  const [selectedOrgan, setSelectedOrgan] = useState(null);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiseases, setLoadingDiseases] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [allDiseases, setAllDiseases] = useState([]);
  const [viewMode, setViewMode] = useState('organs'); // 'organs' or 'all-diseases'
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
    'Eyes': '👁️',
    'Cardiovascular System': '❤️',
    'Respiratory System': '🫁',
    'Digestive System': '🥘',
    'Nervous System': '🧠',
    'Urinary System': '💧',
    'Endocrine System': '🔬',
    'Integumentary System': '🤚',
    'Sensory System': '👁️',
    'Blood': '🩸',
    'Joints': '🦴'
  };

  useEffect(() => {
    fetchOrgans();
    fetchAllDiseases();
  }, []);

  const fetchOrgans = async () => {
    try {
      const response = await organAPI.getAll();
      if (response.data.success) {
        setOrgans(response.data.organs);
      }
    } catch (error) {
      console.error('Failed to fetch organs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllDiseases = async () => {
    try {
      const response = await diseaseAPI.getAll();
      if (response.data.success) {
        setAllDiseases(response.data.diseases);
      }
    } catch (error) {
      console.error('Failed to fetch diseases:', error);
    }
  };

  const handleOrganClick = async (organ) => {
    setSelectedOrgan(organ);
    setLoadingDiseases(true);
    setSearchTerm('');
    
    try {
      const response = await organAPI.getDiseases(organ.organ_system);
      if (response.data.success) {
        setDiseases(response.data.diseases);
      }
    } catch (error) {
      console.error('Failed to fetch diseases:', error);
      setDiseases([]);
    } finally {
      setLoadingDiseases(false);
    }
  };

  const handleDiseaseClick = (disease) => {
    navigate(`/disease/${disease.disease_id}`, { state: { disease } });
  };

  const handleBackToOrgans = () => {
    setSelectedOrgan(null);
    setDiseases([]);
    setSearchTerm('');
  };

  const filteredDiseases = searchTerm
    ? allDiseases.filter(disease =>
        disease.disease_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.organ_system.toLowerCase().includes(searchTerm.toLowerCase()) ||
        disease.symptoms.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : diseases;

  const displayDiseases = viewMode === 'all-diseases' 
    ? (searchTerm ? filteredDiseases : allDiseases)
    : filteredDiseases;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading organ systems...</p>
      </div>
    );
  }

  return (
    <div className="organs-page">
      <div className="container">
        {/* Header */}
        <div className="organs-header">
          <div className="header-content">
            <h1>
              <span className="header-icon">🫀</span>
              Explore Human Body Systems
            </h1>
            <p>Learn about different organs and their associated diseases</p>
          </div>

          {/* View Mode Toggle */}
          <div className="view-toggle">
            <button 
              className={`toggle-btn ${viewMode === 'organs' ? 'active' : ''}`}
              onClick={() => {
                setViewMode('organs');
                setSelectedOrgan(null);
                setSearchTerm('');
              }}
            >
              <span>🫀</span> By Organ System
            </button>
            <button 
              className={`toggle-btn ${viewMode === 'all-diseases' ? 'active' : ''}`}
              onClick={() => setViewMode('all-diseases')}
            >
              <span>📋</span> All Diseases
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="search-section">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder={viewMode === 'all-diseases' 
                ? "Search diseases by name, organ, or symptoms..."
                : selectedOrgan 
                  ? `Search diseases in ${selectedOrgan.organ_system}...`
                  : "Search all diseases..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button 
                className="clear-search"
                onClick={() => setSearchTerm('')}
              >
                ✕
              </button>
            )}
          </div>
          {searchTerm && (
            <div className="search-results-count">
              Found {displayDiseases.length} {displayDiseases.length === 1 ? 'result' : 'results'}
            </div>
          )}
        </div>

        {/* Main Content */}
        {viewMode === 'organs' && !selectedOrgan ? (
          // Organs Grid View
          <>
            <div className="section-title">
              <h2>Select an Organ System</h2>
              <p>Click on any organ to view associated diseases</p>
            </div>

            <div className="organs-grid">
              {organs.map((organ, index) => (
                <div 
                  key={organ.organ_id} 
                  className="organ-card"
                  onClick={() => handleOrganClick(organ)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="organ-icon">
                    {organIcons[organ.organ_name] || organIcons[organ.organ_system] || '🏥'}
                  </div>
                  <h3>{organ.organ_name}</h3>
                  <p className="organ-system">{organ.organ_system}</p>
                  {organ.description && (
                    <p className="organ-description">{organ.description}</p>
                  )}
                  <div className="organ-overlay">
                    <span>View Diseases →</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Section */}
            <div className="stats-section">
              <div className="stat-card">
                <div className="stat-number">{organs.length}</div>
                <div className="stat-label">Organ Systems</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">{allDiseases.length}+</div>
                <div className="stat-label">Diseases Covered</div>
              </div>
              <div className="stat-card">
                <div className="stat-number">🇮🇳</div>
                <div className="stat-label">Indian Context</div>
              </div>
            </div>
          </>
        ) : (
          // Diseases List View
          <div className="diseases-section">
            {selectedOrgan && (
              <div className="selected-organ-header">
                <button className="back-btn" onClick={handleBackToOrgans}>
                  ← Back to Organs
                </button>
                <div className="selected-organ-info">
                  <div className="selected-icon">
                    {organIcons[selectedOrgan.organ_name] || organIcons[selectedOrgan.organ_system] || '🏥'}
                  </div>
                  <div>
                    <h2>{selectedOrgan.organ_name}</h2>
                    <p>{selectedOrgan.organ_system}</p>
                  </div>
                </div>
              </div>
            )}

            {viewMode === 'all-diseases' && (
              <div className="all-diseases-header">
                <h2>All Diseases Database</h2>
                <p>Complete list of diseases with Indian medical context</p>
              </div>
            )}

            {loadingDiseases ? (
              <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading diseases...</p>
              </div>
            ) : displayDiseases.length > 0 ? (
              <div className="diseases-grid">
                {displayDiseases.map((disease, index) => (
                  <div 
                    key={disease.disease_id} 
                    className={`disease-card severity-${disease.severity_level}`}
                    onClick={() => handleDiseaseClick(disease)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="disease-header">
                      <h3>{disease.disease_name}</h3>
                      <span className={`severity-badge ${disease.severity_level}`}>
                        {disease.severity_level || 'moderate'}
                      </span>
                    </div>
                    
                    <div className="disease-organ-badge">
                      <span className="badge-icon">
                        {organIcons[disease.organ_system] || '🏥'}
                      </span>
                      {disease.organ_system}
                    </div>

                    <p className="disease-description">
                      {disease.description.length > 120 
                        ? disease.description.substring(0, 120) + '...'
                        : disease.description}
                    </p>

                    <div className="disease-footer">
                      <button className="view-details-btn">
                        View Details →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-diseases">
                <div className="no-diseases-icon">🔍</div>
                <h3>No Diseases Found</h3>
                <p>
                  {searchTerm 
                    ? `No diseases match "${searchTerm}". Try different keywords.`
                    : 'No diseases available for this organ system.'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Info Section */}
        <div className="info-section">
          <div className="info-card">
            <h3>📚 Comprehensive Database</h3>
            <p>Our database includes diseases with detailed information about symptoms, causes, treatments, and Indian prevalence data.</p>
          </div>
          <div className="info-card">
            <h3>🇮🇳 Indian Context</h3>
            <p>All diseases include information specific to India, including prevalence rates and locally available treatments.</p>
          </div>
          <div className="info-card">
            <h3>⚕️ Medical Accuracy</h3>
            <p>Information compiled from reliable medical sources and updated regularly for accuracy.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrgansPage;
