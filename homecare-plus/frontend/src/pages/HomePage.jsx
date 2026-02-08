import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    diseases: '500+',
    users: '10K+',
    predictions: '50K+'
  });

  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Diagnosis',
      description: 'Advanced AI analyzes your symptoms to predict potential diseases with high accuracy',
      color: '#667eea'
    },
    {
      icon: '🗣️',
      title: 'Voice Recognition',
      description: 'Speak your symptoms naturally in multiple languages for instant analysis',
      color: '#f093fb'
    },
    {
      icon: '🏥',
      title: 'Find Nearby Hospitals',
      description: 'Locate the nearest hospitals and medical facilities based on your location',
      color: '#4facfe'
    },
    {
      icon: '🚨',
      title: 'Emergency Services',
      description: 'Quick access to ambulance, police, and fire brigade with one-click calling',
      color: '#ef4444'
    },
    {
      icon: '📚',
      title: 'Disease Database',
      description: 'Comprehensive information about diseases common in India with treatments',
      color: '#10b981'
    },
    {
      icon: '🌍',
      title: 'Multi-Language Support',
      description: 'Use HOMECARE+ in your preferred language with full translation support',
      color: '#f59e0b'
    }
  ];

  const organs = [
    { name: 'Heart', icon: '❤️', system: 'Cardiovascular System' },
    { name: 'Lungs', icon: '🫁', system: 'Respiratory System' },
    { name: 'Brain', icon: '🧠', system: 'Nervous System' },
    { name: 'Liver', icon: '🩸', system: 'Digestive System' },
    { name: 'Kidneys', icon: '🔬', system: 'Urinary System' },
    { name: 'Stomach', icon: '🥘', system: 'Digestive System' }
  ];

  return (
    <div className={styles.homePage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroBackground}>
          <div className={styles.gradientOrb} style={{ top: '10%', left: '10%' }}></div>
          <div className={styles.gradientOrb} style={{ bottom: '20%', right: '15%' }}></div>
          <div className={styles.gradientOrb} style={{ top: '50%', right: '10%' }}></div>
        </div>
        
        <div className="container">
          <motion.div 
            className={styles.heroContent}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              className={styles.badge}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              🏥 AI-Powered Healthcare Assistant
            </motion.div>
            
            <h1 className={styles.heroTitle}>
              Your Personal
              <span className={styles.gradient}> Healthcare </span>
              Companion
            </h1>
            
            <p className={styles.heroSubtitle}>
              Get instant AI-powered disease predictions, find nearby hospitals, 
              and access emergency services - all in one place. Available in multiple languages.
            </p>
            
            <motion.div 
              className={styles.heroButtons}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <button 
                className={styles.primaryButton}
                onClick={() => navigate('/chat')}
              >
                <span>Start Diagnosis</span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              
              <button 
                className={styles.secondaryButton}
                onClick={() => navigate('/organs')}
              >
                <span>Explore Diseases</span>
              </button>
            </motion.div>
            
            <motion.div 
              className={styles.stats}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.diseases}</div>
                <div className={styles.statLabel}>Diseases Covered</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.users}</div>
                <div className={styles.statLabel}>Active Users</div>
              </div>
              <div className={styles.statDivider}></div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.predictions}</div>
                <div className={styles.statLabel}>Predictions Made</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Powerful Features for Better Healthcare</h2>
            <p>Everything you need to manage your health in one comprehensive platform</p>
          </motion.div>
          
          <div className={styles.featuresGrid}>
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10, transition: { duration: 0.3 } }}
              >
                <div 
                  className={styles.featureIcon}
                  style={{ background: `linear-gradient(135deg, ${feature.color}, ${feature.color}99)` }}
                >
                  <span>{feature.icon}</span>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className={styles.howItWorks}>
        <div className="container">
          <motion.div 
            className={styles.sectionHeader}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>How HOMECARE+ Works</h2>
            <p>Simple steps to get your health analysis</p>
          </motion.div>
          
          <div className={styles.stepsGrid}>
            {[
              { number: '1', title: 'Describe Symptoms', description: 'Type or speak your symptoms in your preferred language' },
              { number: '2', title: 'AI Analysis', description: 'Our advanced AI analyzes and predicts potential diseases' },
              { number: '3', title: 'Get Results', description: 'Receive detailed information about possible conditions' },
              { number: '4', title: 'Find Help', description: 'Locate nearby hospitals or contact emergency services' }
            ].map((step, index) => (
              <motion.div
                key={index}
                className={styles.stepCard}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                <div className={styles.stepNumber}>{step.number}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className="container">
          <motion.div 
            className={styles.ctaContent}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2>Ready to Take Control of Your Health?</h2>
            <p>Join thousands of users who trust HOMECARE+ for their healthcare needs</p>
            <button 
              className={styles.ctaButton}
              onClick={() => navigate('/chat')}
            >
              Get Started Now
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
