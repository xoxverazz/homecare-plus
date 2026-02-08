import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';
import { authAPI, historyAPI } from '../services/api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    phone_number: user?.phone_number || '',
    date_of_birth: user?.date_of_birth || '',
    gender: user?.gender || ''
  });

  useEffect(() => {
    if (activeTab === 'history') {
      fetchMedicalHistory();
    }
  }, [activeTab]);

  const fetchMedicalHistory = async () => {
    setHistoryLoading(true);
    try {
      const response = await historyAPI.get();
      if (response.data.success) {
        setMedicalHistory(response.data.history);
      }
    } catch (error) {
      console.error('Failed to fetch medical history:', error);
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await authAPI.updateProfile(formData);
      
      if (response.data.success) {
        updateUser(response.data.user);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        setIsEditing(false);
      } else {
        setMessage({ type: 'error', text: response.data.message || 'Failed to update profile' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/');
    }
  };

  const handleCancelEdit = () => {
    setFormData({
      full_name: user?.full_name || '',
      phone_number: user?.phone_number || '',
      date_of_birth: user?.date_of_birth || '',
      gender: user?.gender || ''
    });
    setIsEditing(false);
    setMessage({ type: '', text: '' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-avatar">
              {user?.profile_picture ? (
                <img src={user.profile_picture} alt={user.full_name} />
              ) : (
                <div className="avatar-placeholder">
                  {getInitials(user?.full_name)}
                </div>
              )}
            </div>
            <div className="profile-info">
              <h1>{user?.full_name || 'User'}</h1>
              <p className="profile-email">{user?.email}</p>
              <div className="profile-badges">
                <span className="badge">👤 Member</span>
                {user?.last_login && (
                  <span className="badge">
                    🕐 Last login: {formatDate(user.last_login)}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span>🚪</span> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <span>👤</span> Profile Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <span>📋</span> Medical History
          </button>
          <button 
            className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <span>⚙️</span> Settings
          </button>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="profile-section">
              <div className="section-header">
                <h2>Personal Information</h2>
                {!isEditing && (
                  <button className="edit-btn" onClick={() => setIsEditing(true)}>
                    <span>✏️</span> Edit Profile
                  </button>
                )}
              </div>

              {message.text && (
                <div className={`message ${message.type}`}>
                  <span>{message.type === 'success' ? '✓' : '⚠️'}</span>
                  {message.text}
                </div>
              )}

              {isEditing ? (
                <form onSubmit={handleSubmit} className="profile-form">
                  <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      disabled={loading}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone_number">Phone Number</label>
                    <input
                      type="tel"
                      id="phone_number"
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      disabled={loading}
                      placeholder="10-digit phone number"
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label htmlFor="date_of_birth">Date of Birth</label>
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

                    <div className="form-group">
                      <label htmlFor="gender">Gender</label>
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

                  <div className="form-actions">
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={handleCancelEdit}
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="save-btn"
                      disabled={loading}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-label">Email</span>
                    <span className="detail-value">{user?.email}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Phone Number</span>
                    <span className="detail-value">{user?.phone_number || 'Not provided'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Date of Birth</span>
                    <span className="detail-value">
                      {user?.date_of_birth ? formatDate(user.date_of_birth) : 'Not provided'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Gender</span>
                    <span className="detail-value">
                      {user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not provided'}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Account Created</span>
                    <span className="detail-value">{formatDate(user?.created_at)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Medical History Tab */}
          {activeTab === 'history' && (
            <div className="history-section">
              <div className="section-header">
                <h2>Medical Consultation History</h2>
                <span className="history-count">
                  {medicalHistory.length} {medicalHistory.length === 1 ? 'consultation' : 'consultations'}
                </span>
              </div>

              {historyLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Loading your medical history...</p>
                </div>
              ) : medicalHistory.length > 0 ? (
                <div className="history-list">
                  {medicalHistory.map((record) => (
                    <div key={record.history_id} className="history-card">
                      <div className="history-header">
                        <div className="history-date">
                          <span className="date-icon">📅</span>
                          {formatDate(record.consultation_date)}
                        </div>
                        <span className={`confidence-badge confidence-${Math.floor(record.confidence_score / 25)}`}>
                          {record.confidence_score}% Match
                        </span>
                      </div>

                      <div className="history-content">
                        <h3>{record.predicted_disease}</h3>
                        <div className="history-symptoms">
                          <strong>Symptoms:</strong> {record.symptoms}
                        </div>
                        {record.notes && (
                          <div className="history-notes">
                            <strong>Notes:</strong> {record.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📋</div>
                  <h3>No Medical History Yet</h3>
                  <p>Start using our AI diagnosis feature to track your consultations</p>
                  <button 
                    className="cta-btn"
                    onClick={() => navigate('/chat')}
                  >
                    <span>🤖</span> Start AI Diagnosis
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-section">
              <div className="section-header">
                <h2>Account Settings</h2>
              </div>

              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <h3>🔒 Privacy & Security</h3>
                    <p>Manage your password and security settings</p>
                  </div>
                  <button className="setting-action">Manage</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>🔔 Notifications</h3>
                    <p>Configure email and push notifications</p>
                  </div>
                  <button className="setting-action">Configure</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>🌐 Language Preferences</h3>
                    <p>Set your preferred language for the interface</p>
                  </div>
                  <button className="setting-action">Change</button>
                </div>

                <div className="setting-item">
                  <div className="setting-info">
                    <h3>📥 Download Data</h3>
                    <p>Download all your medical data and consultation history</p>
                  </div>
                  <button className="setting-action">Download</button>
                </div>

                <div className="setting-item danger">
                  <div className="setting-info">
                    <h3>🗑️ Delete Account</h3>
                    <p>Permanently delete your account and all data</p>
                  </div>
                  <button className="setting-action danger">Delete</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="action-grid">
            <button className="action-card" onClick={() => navigate('/chat')}>
              <span className="action-icon">🤖</span>
              <span className="action-label">AI Diagnosis</span>
            </button>
            <button className="action-card" onClick={() => navigate('/hospitals')}>
              <span className="action-icon">🏥</span>
              <span className="action-label">Find Hospitals</span>
            </button>
            <button className="action-card" onClick={() => navigate('/emergency')}>
              <span className="action-icon">🚨</span>
              <span className="action-label">Emergency</span>
            </button>
            <button className="action-card" onClick={() => navigate('/organs')}>
              <span className="action-icon">🫀</span>
              <span className="action-label">Browse Diseases</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
