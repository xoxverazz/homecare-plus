import axios from "axios"

/* ─────────────────────────────────────────────────────────────
   API BASE URL
   Priority:
   1. VITE_API_URL from .env
   2. Render backend
   3. Local backend (development)
───────────────────────────────────────────────────────────── */

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://homecare-plus-back.onrender.com" ||
  "http://localhost:8000"

/* ─────────────────────────────────────────────────────────────
   AXIOS INSTANCE
───────────────────────────────────────────────────────────── */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

/* ─────────────────────────────────────────────────────────────
   REQUEST INTERCEPTOR
   Automatically attach JWT token
───────────────────────────────────────────────────────────── */

api.interceptors.request.use(
  (config) => {
    try {
      const stored = localStorage.getItem("homecare-auth")

      if (stored) {
        const parsed = JSON.parse(stored)
        const token = parsed?.state?.token

        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
      }
    } catch (err) {
      console.warn("Auth parsing failed:", err)
    }

    return config
  },
  (error) => Promise.reject(error)
)

/* ─────────────────────────────────────────────────────────────
   RESPONSE INTERCEPTOR
   Handle auth errors globally
───────────────────────────────────────────────────────────── */

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status

    if (status === 401) {
      localStorage.removeItem("homecare-auth")

      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }

    if (status === 500) {
      console.error("Server error:", error.response?.data)
    }

    return Promise.reject(error)
  }
)

export default api

/* ─────────────────────────────────────────────────────────────
   AUTH SERVICES
───────────────────────────────────────────────────────────── */

export const authService = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
  changePassword: (data) => api.put("/auth/password", data),
}

/* ─────────────────────────────────────────────────────────────
   SYMPTOM ANALYSIS
───────────────────────────────────────────────────────────── */

export const symptomService = {
  analyze: (data) => api.post("/symptoms/analyze", data),
  getSymptoms: () => api.get("/symptoms/list"),
  getFollowUp: (data) => api.post("/symptoms/followup", data),
}

/* ─────────────────────────────────────────────────────────────
   DISEASE INFORMATION
───────────────────────────────────────────────────────────── */

export const diseaseService = {
  getAll: (params) => api.get("/diseases", { params }),
  getById: (id) => api.get(`/diseases/${id}`),
  getByOrgan: (organ) => api.get(`/diseases/organ/${organ}`),
  search: (q) => api.get(`/diseases/search?q=${q}`),
  getOrgans: () => api.get("/diseases/organs"),
}

/* ─────────────────────────────────────────────────────────────
   AI CHATBOT
───────────────────────────────────────────────────────────── */

export const chatService = {
  sendMessage: (messages, lang) =>
    api.post("/chat/message", {
      messages,
      language: lang,
    }),
  getHistory: () => api.get("/chat/history"),
  clearHistory: () => api.delete("/chat/history"),
}

/* ─────────────────────────────────────────────────────────────
   HEALTH METRICS
───────────────────────────────────────────────────────────── */

export const healthService = {
  getMetrics: () => api.get("/health/metrics"),
  addMetric: (data) => api.post("/health/metrics", data),
  getHistory: (type) => api.get(`/health/metrics/${type}`),
  getDashboard: () => api.get("/health/dashboard"),
}

/* ─────────────────────────────────────────────────────────────
   MEDICAL RECORDS
───────────────────────────────────────────────────────────── */

export const recordsService = {
  getAll: () => api.get("/records"),

  upload: (form) =>
    api.post("/records/upload", form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }),

  getById: (id) => api.get(`/records/${id}`),
  delete: (id) => api.delete(`/records/${id}`),
  analyze: (id) => api.post(`/records/${id}/analyze`),
}

/* ─────────────────────────────────────────────────────────────
   HOSPITAL SEARCH
───────────────────────────────────────────────────────────── */

export const hospitalService = {
  getNearby: (lat, lng, radius) =>
    api.get("/hospitals/nearby", {
      params: { lat, lng, radius },
    }),

  search: (q) => api.get(`/hospitals/search?q=${q}`),
  getById: (id) => api.get(`/hospitals/${id}`),
}

/* ─────────────────────────────────────────────────────────────
   INSURANCE MANAGEMENT
───────────────────────────────────────────────────────────── */

export const insuranceService = {
  getAll: () => api.get("/insurance"),
  add: (data) => api.post("/insurance", data),
  update: (id, data) => api.put(`/insurance/${id}`, data),
  delete: (id) => api.delete(`/insurance/${id}`),
}

/* ─────────────────────────────────────────────────────────────
   AI IMAGE ANALYSIS
───────────────────────────────────────────────────────────── */

export const imageAnalysisService = {
  analyze: (form) =>
    api.post("/analysis/image", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),

  summarizeReport: (form) =>
    api.post("/analysis/report", form, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 60000,
    }),
}

/* ─────────────────────────────────────────────────────────────
   TELEMEDICINE
───────────────────────────────────────────────────────────── */

export const telemedicineService = {
  getDoctors: (specialty) =>
    api.get("/telemedicine/doctors", {
      params: specialty ? { specialization: specialty } : {},
    }),

  book: (data) => api.post("/telemedicine/book", data),
}
