// AI Service for Disease Prediction
// This uses a rule-based system with symptom matching
// For production, you can integrate with Hugging Face or other AI APIs

const { pool } = require('../config/database');

// Symptom-to-disease mapping with confidence scores
const symptomDatabase = {
  // Dengue
  'dengue': {
    keywords: ['high fever', 'headache', 'pain behind eyes', 'joint pain', 'muscle pain', 'rash', 'bleeding'],
    weight: { 'high fever': 3, 'pain behind eyes': 3, 'joint pain': 2, 'rash': 2 }
  },
  // Tuberculosis
  'tuberculosis': {
    keywords: ['persistent cough', 'cough', 'blood in cough', 'chest pain', 'night sweats', 'weight loss', 'fever'],
    weight: { 'persistent cough': 3, 'blood in cough': 4, 'night sweats': 2, 'weight loss': 2 }
  },
  // Typhoid
  'typhoid': {
    keywords: ['prolonged fever', 'weakness', 'stomach pain', 'headache', 'loss of appetite'],
    weight: { 'prolonged fever': 3, 'stomach pain': 2, 'weakness': 2 }
  },
  // Malaria
  'malaria': {
    keywords: ['cyclic fever', 'chills', 'sweating', 'headache', 'nausea', 'vomiting', 'muscle pain'],
    weight: { 'cyclic fever': 4, 'chills': 3, 'sweating': 2 }
  },
  // Diabetes
  'diabetes': {
    keywords: ['increased thirst', 'frequent urination', 'weight loss', 'fatigue', 'blurred vision', 'slow healing'],
    weight: { 'increased thirst': 3, 'frequent urination': 3, 'blurred vision': 2 }
  },
  // Hypertension
  'hypertension': {
    keywords: ['headache', 'dizziness', 'nosebleed', 'chest pain'],
    weight: { 'severe headache': 2, 'dizziness': 2, 'nosebleed': 2 }
  },
  // Hepatitis
  'hepatitis': {
    keywords: ['jaundice', 'yellow eyes', 'yellow skin', 'dark urine', 'pale stools', 'fever', 'fatigue'],
    weight: { 'jaundice': 4, 'yellow eyes': 4, 'dark urine': 3 }
  },
  // Asthma
  'asthma': {
    keywords: ['wheezing', 'shortness of breath', 'chest tightness', 'coughing at night', 'difficulty breathing'],
    weight: { 'wheezing': 4, 'shortness of breath': 3, 'chest tightness': 2 }
  },
  // Pneumonia
  'pneumonia': {
    keywords: ['fever', 'cough with phlegm', 'chest pain', 'shortness of breath', 'chills'],
    weight: { 'cough with phlegm': 3, 'chest pain': 3, 'fever': 2 }
  },
  // Gastroenteritis
  'gastroenteritis': {
    keywords: ['diarrhea', 'vomiting', 'stomach cramps', 'nausea', 'fever', 'dehydration'],
    weight: { 'diarrhea': 3, 'vomiting': 3, 'stomach cramps': 2 }
  },
  // Cholera
  'cholera': {
    keywords: ['severe diarrhea', 'watery diarrhea', 'rice water stools', 'vomiting', 'dehydration', 'leg cramps'],
    weight: { 'severe diarrhea': 4, 'watery diarrhea': 4, 'dehydration': 3 }
  },
  // Chikungunya
  'chikungunya': {
    keywords: ['high fever', 'severe joint pain', 'muscle pain', 'headache', 'rash', 'fatigue'],
    weight: { 'severe joint pain': 4, 'high fever': 3, 'rash': 2 }
  },
  // Common Cold/Flu
  'common cold': {
    keywords: ['runny nose', 'sneezing', 'sore throat', 'mild fever', 'cough', 'congestion'],
    weight: { 'runny nose': 2, 'sneezing': 2, 'sore throat': 2 }
  }
};

// Predict disease based on symptoms
const predictDisease = async (symptoms) => {
  try {
    // Convert symptoms to lowercase for matching
    const symptomText = symptoms.toLowerCase();
    const predictions = [];

    // Analyze symptoms against database
    for (const [disease, data] of Object.entries(symptomDatabase)) {
      let score = 0;
      let matchedSymptoms = [];

      // Check each keyword
      for (const keyword of data.keywords) {
        if (symptomText.includes(keyword)) {
          const weight = data.weight[keyword] || 1;
          score += weight;
          matchedSymptoms.push(keyword);
        }
      }

      if (score > 0) {
        // Calculate confidence percentage
        const maxScore = Object.values(data.weight).reduce((a, b) => a + b, 0);
        const confidence = Math.min((score / maxScore) * 100, 95);

        predictions.push({
          disease: disease,
          confidence: Math.round(confidence),
          matchedSymptoms: matchedSymptoms,
          score: score
        });
      }
    }

    // Sort by score
    predictions.sort((a, b) => b.score - a.score);

    // Get detailed disease information from database
    const topPredictions = predictions.slice(0, 3);
    const results = [];

    for (const prediction of topPredictions) {
      const [diseases] = await pool.query(
        'SELECT * FROM diseases WHERE LOWER(disease_name) LIKE ?',
        [`%${prediction.disease}%`]
      );

      if (diseases.length > 0) {
        results.push({
          ...prediction,
          diseaseInfo: diseases[0]
        });
      }
    }

    return {
      success: true,
      predictions: results,
      totalMatches: predictions.length,
      disclaimer: 'This is an AI-based prediction. Please consult a healthcare professional for accurate diagnosis.'
    };

  } catch (error) {
    console.error('Disease prediction error:', error);
    return {
      success: false,
      error: 'Failed to predict disease',
      predictions: []
    };
  }
};

// Get disease information by name
const getDiseaseInfo = async (diseaseName) => {
  try {
    const [diseases] = await pool.query(
      'SELECT * FROM diseases WHERE disease_name = ?',
      [diseaseName]
    );

    if (diseases.length > 0) {
      return {
        success: true,
        disease: diseases[0]
      };
    } else {
      return {
        success: false,
        message: 'Disease not found'
      };
    }
  } catch (error) {
    console.error('Get disease info error:', error);
    return {
      success: false,
      error: 'Failed to fetch disease information'
    };
  }
};

// Get diseases by organ
const getDiseasesByOrgan = async (organSystem) => {
  try {
    const [diseases] = await pool.query(
      'SELECT * FROM diseases WHERE organ_system = ? ORDER BY disease_name',
      [organSystem]
    );

    return {
      success: true,
      diseases: diseases,
      count: diseases.length
    };
  } catch (error) {
    console.error('Get diseases by organ error:', error);
    return {
      success: false,
      error: 'Failed to fetch diseases'
    };
  }
};

// Multi-language support for symptoms
const translateSymptoms = (symptoms, targetLanguage = 'en') => {
  // Basic translation mapping (can be extended with proper translation API)
  const translations = {
    'hi': { // Hindi
      'बुखार': 'fever',
      'सिरदर्द': 'headache',
      'खांसी': 'cough',
      'दर्द': 'pain',
      'उल्टी': 'vomiting',
      'दस्त': 'diarrhea'
    },
    'mr': { // Marathi
      'ताप': 'fever',
      'डोकेदुखी': 'headache',
      'खोकला': 'cough'
    },
    'bn': { // Bengali
      'জ্বর': 'fever',
      'মাথাব্যথা': 'headache',
      'কাশি': 'cough'
    }
  };

  // For now, return as-is. In production, integrate with Google Translate API or similar
  return symptoms;
};

module.exports = {
  predictDisease,
  getDiseaseInfo,
  getDiseasesByOrgan,
  translateSymptoms
};
