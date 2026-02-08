import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { hospitalAPI } from '../services/api';
import 'leaflet/dist/leaflet.css';
import './HospitalMapPage.css';

// Fix for default marker icons in React Leaflet
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

// Component to recenter map when location changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, 13);
    }
  }, [center, map]);
  return null;
}

const HospitalMapPage = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [searchRadius, setSearchRadius] = useState(10);
  const [searchCity, setSearchCity] = useState('');
  const [searchMode, setSearchMode] = useState('nearby'); // 'nearby' or 'city'
  const [locationError, setLocationError] = useState('');
  const [selectedHospital, setSelectedHospital] = useState(null);

  // Default center (India)
  const defaultCenter = [20.5937, 78.9629];
  const mapCenter = userLocation || defaultCenter;

  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    setLoading(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = [position.coords.latitude, position.coords.longitude];
        setUserLocation(location);
        fetchNearbyHospitals(location[0], location[1], searchRadius);
      },
      (error) => {
        console.error('Geolocation error:', error);
        setLocationError('Unable to retrieve your location. Please enable location services or search by city.');
        setLoading(false);
      }
    );
  };

  const fetchNearbyHospitals = async (lat, lng, radius) => {
    setLoading(true);
    try {
      const response = await hospitalAPI.getNearby(lat, lng, radius);
      if (response.data.success) {
        setHospitals(response.data.hospitals);
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
      setLocationError('Failed to fetch hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchHospitalsByCity = async (city) => {
    if (!city.trim()) {
      setLocationError('Please enter a city name');
      return;
    }

    setLoading(true);
    setLocationError('');
    
    try {
      const response = await hospitalAPI.searchByCity(city);
      if (response.data.success) {
        setHospitals(response.data.hospitals);
        
        // Set map center to first hospital if available
        if (response.data.hospitals.length > 0) {
          const firstHospital = response.data.hospitals[0];
          if (firstHospital.latitude && firstHospital.longitude) {
            setUserLocation([firstHospital.latitude, firstHospital.longitude]);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch hospitals:', error);
      setLocationError('Failed to fetch hospitals. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRadiusChange = (newRadius) => {
    setSearchRadius(newRadius);
    if (userLocation && searchMode === 'nearby') {
      fetchNearbyHospitals(userLocation[0], userLocation[1], newRadius);
    }
  };

  const handleCitySearch = (e) => {
    e.preventDefault();
    fetchHospitalsByCity(searchCity);
  };

  const handleCallHospital = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleDirections = (lat, lng) => {
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
  };

  return (
    <div className="hospital-map-page">
      <div className="page-container">
        {/* Header */}
        <div className="page-header">
          <h1>
            <span className="header-icon">🏥</span>
            Find Nearby Hospitals
          </h1>
          <p>Locate medical facilities near you with real-time information</p>
        </div>

        {/* Search Controls */}
        <div className="search-controls">
          <div className="search-mode-toggle">
            <button 
              className={`mode-btn ${searchMode === 'nearby' ? 'active' : ''}`}
              onClick={() => setSearchMode('nearby')}
            >
              <span>📍</span> Near Me
            </button>
            <button 
              className={`mode-btn ${searchMode === 'city' ? 'active' : ''}`}
              onClick={() => setSearchMode('city')}
            >
              <span>🌆</span> By City
            </button>
          </div>

          {searchMode === 'nearby' ? (
            <div className="nearby-controls">
              <button 
                className="locate-btn"
                onClick={getUserLocation}
                disabled={loading}
              >
                <span>📍</span>
                {loading ? 'Locating...' : 'Use My Location'}
              </button>

              <div className="radius-selector">
                <label>Search Radius:</label>
                <div className="radius-buttons">
                  {[5, 10, 20, 50].map((radius) => (
                    <button
                      key={radius}
                      className={`radius-btn ${searchRadius === radius ? 'active' : ''}`}
                      onClick={() => handleRadiusChange(radius)}
                    >
                      {radius} km
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <form className="city-search-form" onSubmit={handleCitySearch}>
              <input
                type="text"
                placeholder="Enter city name (e.g., Mumbai, Delhi, Bangalore)"
                value={searchCity}
                onChange={(e) => setSearchCity(e.target.value)}
                className="city-input"
              />
              <button type="submit" className="search-btn" disabled={loading}>
                <span>🔍</span>
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          )}
        </div>

        {locationError && (
          <div className="error-message">
            <span className="error-icon">⚠️</span>
            {locationError}
          </div>
        )}

        {/* Main Content */}
        <div className="content-grid">
          {/* Map Section */}
          <div className="map-section">
            <div className="map-container">
              <MapContainer 
                center={mapCenter} 
                zoom={13} 
                style={{ height: '100%', width: '100%', borderRadius: '16px' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <RecenterMap center={mapCenter} />
                
                {/* User Location Marker */}
                {userLocation && (
                  <Marker position={userLocation}>
                    <Popup>
                      <div className="popup-content">
                        <strong>📍 Your Location</strong>
                      </div>
                    </Popup>
                  </Marker>
                )}

                {/* Hospital Markers */}
                {hospitals.map((hospital) => (
                  hospital.latitude && hospital.longitude && (
                    <Marker 
                      key={hospital.hospital_id}
                      position={[hospital.latitude, hospital.longitude]}
                    >
                      <Popup>
                        <div className="hospital-popup">
                          <h3>{hospital.hospital_name}</h3>
                          <p className="hospital-address">{hospital.address}</p>
                          {hospital.phone && (
                            <p className="hospital-phone">📞 {hospital.phone}</p>
                          )}
                          {hospital.distance && (
                            <p className="hospital-distance">
                              📏 {hospital.distance.toFixed(2)} km away
                            </p>
                          )}
                          <button 
                            className="popup-btn"
                            onClick={() => setSelectedHospital(hospital)}
                          >
                            View Details
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                  )
                ))}
              </MapContainer>
            </div>

            <div className="map-info">
              <div className="info-item">
                <span className="info-icon">🏥</span>
                <span>{hospitals.length} hospitals found</span>
              </div>
              {userLocation && (
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span>Within {searchRadius} km</span>
                </div>
              )}
            </div>
          </div>

          {/* Hospitals List */}
          <div className="hospitals-list-section">
            <h2>
              <span>🏥</span>
              {searchMode === 'nearby' ? 'Nearby Hospitals' : 'Search Results'}
            </h2>

            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Loading hospitals...</p>
              </div>
            ) : hospitals.length > 0 ? (
              <div className="hospitals-list">
                {hospitals.map((hospital, index) => (
                  <div 
                    key={hospital.hospital_id} 
                    className={`hospital-card ${selectedHospital?.hospital_id === hospital.hospital_id ? 'selected' : ''}`}
                    onClick={() => setSelectedHospital(hospital)}
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <div className="hospital-card-header">
                      <h3>{hospital.hospital_name}</h3>
                      {hospital.emergency_available && (
                        <span className="emergency-badge">🚨 Emergency</span>
                      )}
                    </div>

                    <p className="hospital-address">
                      <span className="address-icon">📍</span>
                      {hospital.address}, {hospital.city}
                    </p>

                    {hospital.distance && (
                      <p className="hospital-distance">
                        <span className="distance-icon">📏</span>
                        {hospital.distance.toFixed(2)} km away
                      </p>
                    )}

                    {hospital.specialties && (
                      <div className="specialties">
                        {hospital.specialties.split(',').slice(0, 3).map((specialty, idx) => (
                          <span key={idx} className="specialty-tag">
                            {specialty.trim()}
                          </span>
                        ))}
                      </div>
                    )}

                    {hospital.rating && (
                      <div className="hospital-rating">
                        <span className="stars">⭐</span>
                        <span className="rating-value">{hospital.rating}/5.0</span>
                      </div>
                    )}

                    <div className="hospital-actions">
                      {hospital.phone && (
                        <button 
                          className="action-btn call-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCallHospital(hospital.phone);
                          }}
                        >
                          <span>📞</span> Call
                        </button>
                      )}
                      {hospital.latitude && hospital.longitude && (
                        <button 
                          className="action-btn directions-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDirections(hospital.latitude, hospital.longitude);
                          }}
                        >
                          <span>🧭</span> Directions
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-results">
                <div className="no-results-icon">🔍</div>
                <h3>No Hospitals Found</h3>
                <p>Try adjusting your search radius or searching a different city.</p>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Info */}
        <div className="emergency-info">
          <div className="emergency-card">
            <span className="emergency-icon">🚨</span>
            <div className="emergency-content">
              <h3>Medical Emergency?</h3>
              <p>Call ambulance immediately</p>
            </div>
            <a href="tel:108" className="emergency-call-btn">
              Call 108
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalMapPage;
