import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import styles from '../styles/EmergencyPage.module.css';

const EmergencyPage = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const emergencyServices = [
    {
      name: 'Ambulance',
      number: '108',
      icon: '🚑',
      color: '#ef4444',
      description: 'Emergency medical services',
      type: 'medical'
    },
    {
      name: 'Police',
      number: '100',
      icon: '👮',
      color: '#2563eb',
      description: 'Law enforcement emergency',
      type: 'police'
    },
    {
      name: 'Fire Brigade',
      number: '101',
      icon: '🚒',
      color: '#f59e0b',
      description: 'Fire emergency services',
      type: 'fire'
    },
    {
      name: 'Disaster Management',
      number: '108',
      icon: '🆘',
      color: '#8b5cf6',
      description: 'Natural disaster helpline',
      type: 'disaster'
    },
    {
      name: 'Women Helpline',
      number: '1091',
      icon: '👩',
      color: '#ec4899',
      description: 'Women in distress',
      type: 'women'
    },
    {
      name: 'Child Helpline',
      number: '1098',
      icon: '👶',
      color: '#10b981',
      description: 'Child emergency services',
      type: 'child'
    }
  ];

  const quickActions = [
    {
      title: 'Share Location',
      icon: '📍',
      description: 'Send your current location to emergency services',
      action: 'location'
    },
    {
      title: 'Medical Info',
      icon: '📋',
      description: 'Share your medical history with responders',
      action: 'medical'
    },
    {
      title: 'Emergency Contacts',
      icon: '📞',
      description: 'Call your saved emergency contacts',
      action: 'contacts'
    },
    {
      title: 'First Aid',
      icon: '🏥',
      description: 'Access quick first aid instructions',
      action: 'firstaid'
    }
  ];

  const firstAidTips = [
    {
      title: 'Heart Attack',
      icon: '❤️',
      steps: [
        'Call 108 immediately',
        'Help the person sit down and rest',
        'Give aspirin if available (chew it)',
        'Loosen tight clothing',
        'Stay calm and reassure the person'
      ]
    },
    {
      title: 'Choking',
      icon: '😮',
      steps: [
        'Encourage coughing',
        'Give 5 back blows between shoulder blades',
        'Perform 5 abdominal thrusts (Heimlich)',
        'Repeat until object is dislodged',
        'Call 108 if unsuccessful'
      ]
    },
    {
      title: 'Severe Bleeding',
      icon: '🩹',
      steps: [
        'Apply direct pressure to wound',
        'Keep pressure for at least 5 minutes',
        'Elevate the injured area above heart',
        'Use clean cloth or bandage',
        'Call 108 if bleeding doesn\'t stop'
      ]
    },
    {
      title: 'Burns',
      icon: '🔥',
      steps: [
        'Run cool water over burn for 10 minutes',
        'Remove jewelry/tight items',
        'Cover with sterile bandage',
        'Don\'t apply ice or break blisters',
        'Seek medical help for severe burns'
      ]
    }
  ];

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    setLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setLoading(false);
        },
        (error) => {
          setError('Unable to get your location. Please enable location services.');
          setLoading(false);
        }
      );
    } else {
      setError('Geolocation is not supported by your browser.');
      setLoading(false);
    }
  };

  const handleEmergencyCall = (number, name) => {
    if (confirm(`Are you sure you want to call ${name} (${number})?`)) {
      window.location.href = `tel:${number}`;
    }
  };

  const handleQuickAction = (action) => {
    switch(action) {
      case 'location':
        if (location) {
          const message = `Emergency! My location: https://maps.google.com/?q=${location.latitude},${location.longitude}`;
          if (navigator.share) {
            navigator.share({
              title: 'Emergency Location',
              text: message
            });
          } else {
            navigator.clipboard.writeText(message);
            alert('Location copied to clipboard!');
          }
        } else {
          getCurrentLocation();
        }
        break;
      case 'medical':
        alert('Medical information feature - Connect to your profile data');
        break;
      case 'contacts':
        alert('Emergency contacts feature - Save contacts in your profile');
        break;
      case 'firstaid':
        document.getElementById('first-aid-section').scrollIntoView({ behavior: 'smooth' });
        break;
    }
  };

  return (
    <div className={styles.emergencyPage}>
      {/* Hero Section with Alert */}
      <section className={styles.hero}>
        <div className={styles.alertBanner}>
          <motion.div 
            className={styles.alertIcon}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🚨
          </motion.div>
          <div>
            <h1>Emergency Services</h1>
            <p>Quick access to emergency helplines and first aid information</p>
          </div>
        </div>
      </section>

      {/* Location Status */}
      <section className={styles.locationSection}>
        <div className="container">
          <motion.div 
            className={styles.locationCard}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className={styles.locationIcon}>📍</div>
            <div className={styles.locationInfo}>
              {loading && (
                <>
                  <h3>Getting your location...</h3>
                  <div className="spinner"></div>
                </>
              )}
              {location && !loading && (
                <>
                  <h3>Location Detected</h3>
                  <p>Lat: {location.latitude.toFixed(4)}, Long: {location.longitude.toFixed(4)}</p>
                  <button 
                    className={styles.refreshButton}
                    onClick={getCurrentLocation}
                  >
                    Refresh Location
                  </button>
                </>
              )}
              {error && !loading && (
                <>
                  <h3>Location Unavailable</h3>
                  <p>{error}</p>
                  <button 
                    className={styles.refreshButton}
                    onClick={getCurrentLocation}
                  >
                    Try Again
                  </button>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Emergency Services Grid */}
      <section className={styles.servicesSection}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Emergency Helplines</h2>
            <p>Tap to call emergency services instantly</p>
          </motion.div>

          <div className={styles.servicesGrid}>
            {emergencyServices.map((service, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                onClick={() => handleEmergencyCall(service.number, service.name)}
              >
                <div 
                  className={styles.serviceIcon}
                  style={{ background: `linear-gradient(135deg, ${service.color}, ${service.color}dd)` }}
                >
                  <span>{service.icon}</span>
                </div>
                <h3>{service.name}</h3>
                <div className={styles.serviceNumber}>{service.number}</div>
                <p>{service.description}</p>
                <button 
                  className={styles.callButton}
                  style={{ backgroundColor: service.color }}
                >
                  <span>📞</span> Call Now
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActionsSection}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Quick Actions</h2>
            <p>Essential tools for emergency situations</p>
          </motion.div>

          <div className={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <motion.div
                key={index}
                className={styles.actionCard}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                onClick={() => handleQuickAction(action.action)}
              >
                <div className={styles.actionIcon}>{action.icon}</div>
                <div className={styles.actionContent}>
                  <h4>{action.title}</h4>
                  <p>{action.description}</p>
                </div>
                <div className={styles.actionArrow}>→</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* First Aid Guide */}
      <section className={styles.firstAidSection} id="first-aid-section">
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>First Aid Guide</h2>
            <p>Quick reference for common emergencies</p>
          </motion.div>

          <div className={styles.firstAidGrid}>
            {firstAidTips.map((tip, index) => (
              <motion.div
                key={index}
                className={styles.firstAidCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <div className={styles.firstAidHeader}>
                  <span className={styles.firstAidIcon}>{tip.icon}</span>
                  <h3>{tip.title}</h3>
                </div>
                <ol className={styles.firstAidSteps}>
                  {tip.steps.map((step, stepIndex) => (
                    <li key={stepIndex}>{step}</li>
                  ))}
                </ol>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Important Notice */}
      <section className={styles.noticeSection}>
        <div className="container">
          <motion.div 
            className={styles.noticeCard}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className={styles.noticeIcon}>⚠️</div>
            <div className={styles.noticeContent}>
              <h3>Important Notice</h3>
              <p>
                This page provides quick access to emergency services and basic first aid information. 
                In case of a real emergency, always call the appropriate emergency number immediately. 
                The information provided here is for reference only and should not replace professional 
                medical advice or emergency services.
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default EmergencyPage;
