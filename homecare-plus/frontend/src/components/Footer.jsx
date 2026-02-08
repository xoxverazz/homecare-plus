import { Link } from 'react-router-dom';
import styles from '../styles/Footer.module.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { label: 'AI Diagnosis', path: '/chat' },
      { label: 'Disease Database', path: '/organs' },
      { label: 'Find Hospitals', path: '/hospitals' },
      { label: 'Emergency Services', path: '/emergency' }
    ],
    company: [
      { label: 'About Us', path: '/about' },
      { label: 'How It Works', path: '/#how-it-works' },
      { label: 'Privacy Policy', path: '/privacy' },
      { label: 'Terms of Service', path: '/terms' }
    ],
    support: [
      { label: 'Help Center', path: '/help' },
      { label: 'Contact Us', path: '/contact' },
      { label: 'FAQ', path: '/faq' },
      { label: 'Feedback', path: '/feedback' }
    ]
  };

  const socialLinks = [
    { name: 'Twitter', icon: '𝕏', url: '#' },
    { name: 'Facebook', icon: '📘', url: '#' },
    { name: 'Instagram', icon: '📷', url: '#' },
    { name: 'LinkedIn', icon: '💼', url: '#' }
  ];

  const emergencyNumbers = [
    { name: 'Ambulance', number: '108', icon: '🚑' },
    { name: 'Police', number: '100', icon: '👮' },
    { name: 'Fire', number: '101', icon: '🚒' }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className="container">
          {/* Top Section */}
          <div className={styles.footerTop}>
            <div className={styles.footerBrand}>
              <div className={styles.brandLogo}>
                <span className={styles.logoIcon}>🏥</span>
                <span className={styles.logoText}>HOMECARE<span className={styles.logoPlus}>+</span></span>
              </div>
              <p className={styles.brandDescription}>
                Your trusted AI-powered healthcare companion. Get instant disease predictions, 
                find nearby hospitals, and access emergency services - all in one place.
              </p>
              <div className={styles.socialLinks}>
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.url}
                    className={styles.socialLink}
                    aria-label={social.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span>{social.icon}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className={styles.footerLinks}>
              <div className={styles.linkColumn}>
                <h4>Product</h4>
                <ul>
                  {footerLinks.product.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.linkColumn}>
                <h4>Company</h4>
                <ul>
                  {footerLinks.company.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.linkColumn}>
                <h4>Support</h4>
                <ul>
                  {footerLinks.support.map((link) => (
                    <li key={link.path}>
                      <Link to={link.path}>{link.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className={styles.emergencySection}>
              <h4>Emergency Numbers</h4>
              <div className={styles.emergencyNumbers}>
                {emergencyNumbers.map((emergency) => (
                  <a
                    key={emergency.number}
                    href={`tel:${emergency.number}`}
                    className={styles.emergencyCard}
                  >
                    <span className={styles.emergencyIcon}>{emergency.icon}</span>
                    <div className={styles.emergencyInfo}>
                      <span className={styles.emergencyName}>{emergency.name}</span>
                      <span className={styles.emergencyNumber}>{emergency.number}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className={styles.disclaimer}>
            <div className={styles.disclaimerIcon}>⚠️</div>
            <p>
              <strong>Medical Disclaimer:</strong> HOMECARE+ is an AI-powered healthcare information tool 
              and should not be used as a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult with a qualified healthcare provider for medical concerns. In case of emergency, 
              call your local emergency services immediately.
            </p>
          </div>

          {/* Bottom Section */}
          <div className={styles.footerBottom}>
            <p className={styles.copyright}>
              © {currentYear} HOMECARE+. All rights reserved.
            </p>
            <div className={styles.bottomLinks}>
              <Link to="/privacy">Privacy Policy</Link>
              <span className={styles.divider}>•</span>
              <Link to="/terms">Terms of Service</Link>
              <span className={styles.divider}>•</span>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
