// API Service
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============ Auth APIs ============
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  verifyToken: () => api.get('/auth/verify')
};

// ============ Disease APIs ============
export const diseaseAPI = {
  predict: (symptoms, userId = null) => 
    api.post('/diseases/predict', { symptoms, userId }),
  getAll: () => api.get('/diseases'),
  search: (query) => api.get(`/diseases/search?query=${query}`),
  getDetails: (diseaseId) => api.get(`/diseases/${diseaseId}`)
};

// ============ Organ APIs ============
export const organAPI = {
  getAll: () => api.get('/organs'),
  getDiseases: (organSystem) => api.get(`/organs/${organSystem}/diseases`)
};

// ============ Hospital APIs ============
export const hospitalAPI = {
  getNearby: (latitude, longitude, radius = 10) => 
    api.get(`/hospitals/nearby?latitude=${latitude}&longitude=${longitude}&radius=${radius}`),
  searchByCity: (city) => api.get(`/hospitals/search?city=${city}`),
  getDetails: (hospitalId) => api.get(`/hospitals/${hospitalId}`),
  addSample: () => api.post('/hospitals/sample')
};

// ============ Medical History APIs ============
export const historyAPI = {
  get: () => api.get('/medical-history')
};

export default api;
