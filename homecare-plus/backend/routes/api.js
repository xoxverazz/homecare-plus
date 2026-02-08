// API Routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const diseaseController = require('../controllers/diseaseController');
const hospitalController = require('../controllers/hospitalController');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

// ============ Authentication Routes ============
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticateToken, authController.getProfile);
router.put('/auth/profile', authenticateToken, authController.updateProfile);
router.get('/auth/verify', authenticateToken, authController.verifyToken);

// ============ Disease Routes ============
router.post('/diseases/predict', optionalAuth, diseaseController.predictFromSymptoms);
router.get('/diseases', diseaseController.getAllDiseases);
router.get('/diseases/search', diseaseController.searchDiseases);
router.get('/diseases/:diseaseId', diseaseController.getDiseaseDetails);

// ============ Organ Routes ============
router.get('/organs', diseaseController.getAllOrgans);
router.get('/organs/:organSystem/diseases', diseaseController.getDiseasesByOrgan);

// ============ Medical History Routes ============
router.get('/medical-history', authenticateToken, diseaseController.getMedicalHistory);

// ============ Hospital Routes ============
router.get('/hospitals/nearby', hospitalController.getNearbyHospitals);
router.get('/hospitals/search', hospitalController.searchHospitalsByCity);
router.get('/hospitals/:hospitalId', hospitalController.getHospitalById);
router.post('/hospitals/sample', hospitalController.addSampleHospitals); // For initial setup

// ============ Health Check Route ============
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'HOMECARE+ API is running',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
