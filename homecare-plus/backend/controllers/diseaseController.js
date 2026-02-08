// Disease Controller
const { predictDisease, getDiseaseInfo, getDiseasesByOrgan } = require('../services/aiService');
const { pool } = require('../config/database');

// Predict disease from symptoms
exports.predictFromSymptoms = async (req, res) => {
  try {
    const { symptoms, userId } = req.body;
    
    if (!symptoms) {
      return res.status(400).json({
        success: false,
        message: 'Symptoms are required'
      });
    }
    
    // Get AI prediction
    const prediction = await predictDisease(symptoms);
    
    // Save to medical history if user is logged in
    if (userId && prediction.success && prediction.predictions.length > 0) {
      const topPrediction = prediction.predictions[0];
      await pool.query(
        `INSERT INTO medical_history (user_id, symptoms, predicted_disease, confidence_score, notes) 
         VALUES (?, ?, ?, ?, ?)`,
        [
          userId,
          symptoms,
          topPrediction.diseaseInfo ? topPrediction.diseaseInfo.disease_name : topPrediction.disease,
          topPrediction.confidence,
          `Matched symptoms: ${topPrediction.matchedSymptoms.join(', ')}`
        ]
      );
    }
    
    res.json(prediction);
  } catch (error) {
    console.error('Predict disease error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to predict disease'
    });
  }
};

// Get all organs
exports.getAllOrgans = async (req, res) => {
  try {
    const [organs] = await pool.query(
      'SELECT * FROM organs ORDER BY organ_name'
    );
    
    res.json({
      success: true,
      organs
    });
  } catch (error) {
    console.error('Get organs error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch organs'
    });
  }
};

// Get diseases by organ
exports.getDiseasesByOrgan = async (req, res) => {
  try {
    const { organSystem } = req.params;
    const result = await getDiseasesByOrgan(organSystem);
    res.json(result);
  } catch (error) {
    console.error('Get diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diseases'
    });
  }
};

// Get disease details
exports.getDiseaseDetails = async (req, res) => {
  try {
    const { diseaseId } = req.params;
    
    const [diseases] = await pool.query(
      'SELECT * FROM diseases WHERE disease_id = ?',
      [diseaseId]
    );
    
    if (diseases.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Disease not found'
      });
    }
    
    res.json({
      success: true,
      disease: diseases[0]
    });
  } catch (error) {
    console.error('Get disease details error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disease details'
    });
  }
};

// Get all diseases
exports.getAllDiseases = async (req, res) => {
  try {
    const [diseases] = await pool.query(
      'SELECT disease_id, disease_name, organ_system, severity_level, description FROM diseases ORDER BY disease_name'
    );
    
    res.json({
      success: true,
      diseases,
      count: diseases.length
    });
  } catch (error) {
    console.error('Get all diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch diseases'
    });
  }
};

// Search diseases
exports.searchDiseases = async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }
    
    const [diseases] = await pool.query(
      `SELECT * FROM diseases 
       WHERE disease_name LIKE ? OR symptoms LIKE ? OR organ_system LIKE ?
       ORDER BY disease_name LIMIT 20`,
      [`%${query}%`, `%${query}%`, `%${query}%`]
    );
    
    res.json({
      success: true,
      diseases,
      count: diseases.length
    });
  } catch (error) {
    console.error('Search diseases error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search diseases'
    });
  }
};

// Get user medical history
exports.getMedicalHistory = async (req, res) => {
  try {
    const userId = req.userId;
    
    const [history] = await pool.query(
      `SELECT * FROM medical_history 
       WHERE user_id = ? 
       ORDER BY consultation_date DESC 
       LIMIT 50`,
      [userId]
    );
    
    res.json({
      success: true,
      history
    });
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch medical history'
    });
  }
};
