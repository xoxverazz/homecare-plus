import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem('homecare-auth')
    if (stored) {
      const { state } = JSON.parse(stored)
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('homecare-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

// ─── API service methods ───────────────────────────────────────────────────────

export const authService = {
  login:       (data)   => api.post('/auth/login', data),
  register:    (data)   => api.post('/auth/register', data),
  getProfile:  ()       => api.get('/auth/profile'),
  updateProfile:(data)  => api.put('/auth/profile', data),
  changePassword:(data) => api.put('/auth/password', data),
}

export const symptomService = {
  // data = { symptoms: [...], follow_up: {...} } — pass directly, no extra wrapping
  analyze:     (data)     => api.post('/symptoms/analyze', data),
  getSymptoms: ()         => api.get('/symptoms/list'),
  getFollowUp: (data)     => api.post('/symptoms/followup', data),
}

export const diseaseService = {
  getAll:      (params)   => api.get('/diseases', { params }),
  getById:     (id)       => api.get(`/diseases/${id}`),
  getByOrgan:  (organ)    => api.get(`/diseases/organ/${organ}`),
  search:      (q)        => api.get(`/diseases/search?q=${q}`),
  getOrgans:   ()         => api.get('/diseases/organs'),
}

export const chatService = {
  sendMessage: (messages, lang) => api.post('/chat/message', { messages, language: lang }),
  getHistory:  ()               => api.get('/chat/history'),
  clearHistory: ()              => api.delete('/chat/history'),
}

export const healthService = {
  getMetrics:  ()        => api.get('/health/metrics'),
  addMetric:   (data)    => api.post('/health/metrics', data),
  getHistory:  (type)    => api.get(`/health/metrics/${type}`),
  getDashboard:()        => api.get('/health/dashboard'),
}

export const recordsService = {
  getAll:   ()       => api.get('/records'),
  upload:   (form)   => api.post('/records/upload', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  getById:  (id)     => api.get(`/records/${id}`),
  delete:   (id)     => api.delete(`/records/${id}`),
  analyze:  (id)     => api.post(`/records/${id}/analyze`),
}

export const hospitalService = {
  getNearby: (lat, lng, radius) =>
    api.get('/hospitals/nearby', { params: { lat, lng, radius } }),
  search:    (q) => api.get(`/hospitals/search?q=${q}`),
  getById:   (id) => api.get(`/hospitals/${id}`),
}

export const insuranceService = {
  getAll:    ()     => api.get('/insurance'),
  add:       (data) => api.post('/insurance', data),
  update:    (id, data) => api.put(`/insurance/${id}`, data),
  delete:    (id)   => api.delete(`/insurance/${id}`),
}

export const imageAnalysisService = {
  analyze: (form) => api.post('/analysis/image', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  }),
  summarizeReport: (form) => api.post('/analysis/report', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  }),
}

export const telemedicineService = {
  getDoctors: (specialty) => api.get('/telemedicine/doctors', { params: specialty ? { specialization: specialty } : {} }),
  book:       (data)      => api.post('/telemedicine/book', data),
}
