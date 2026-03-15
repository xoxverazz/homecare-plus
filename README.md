# HomeCare+ — AI Healthcare Platform

A full-stack AI-powered digital healthcare platform with symptom analysis, health monitoring, medical records, and AI chat.

---

## 🐛 Bugs Fixed in This Release

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `backend/app/middleware/auth.py` | `ValueError: password cannot be longer than 72 bytes` | Changed `bcrypt` → `bcrypt_sha256` |
| 2 | `frontend/src/store/authStore.js` | Registration/Login silently failed | Read `detail` field from FastAPI error responses |
| 3 | `backend/app/middleware/auth.py` | JWT auth redirect loop — `sub` type mismatch | Cast `user_id = int(user_id)` in token decode |
| 4 | `backend/app/middleware/auth.py` | JWT `sub` stored as int, violates JWT spec | `str(user_id)` when creating token |
| 5 | `frontend/src/App.jsx` | JWT header lost on page reload | Call `initializeAuth()` on mount |
| 6 | `frontend/src/pages/HealthRecords.jsx` | Hardcoded mock data, never called backend | Full rewrite with real API + `useEffect` loader |
| 7 | `frontend/src/pages/HealthRecords.jsx` | FormData sent `type` instead of `record_type` | Fixed field name to match backend schema |
| 8 | `frontend/src/pages/Vitals.jsx` | Charts used static mock arrays | Connected to real `/health/metrics/{type}` API |
| 9 | `frontend/src/pages/Dashboard.jsx` | Vitals cards showed hardcoded demo values | Fetches real data from `/health/dashboard` |
| 10 | `frontend/src/pages/Insurance.jsx` | Mock data only, no API calls | Full rewrite with real CRUD API integration |
| 11 | `frontend/src/pages/Hospitals.jsx` | Mock hospital list, no geolocation or search | Uses `navigator.geolocation` + real `/hospitals` API |
| 12 | `frontend/src/pages/Chat.jsx` | `Invalid Date` on chat history load | Fixed: `msg.timestamp \|\| msg.created_at` |
| 13 | `frontend/src/pages/SymptomChecker.jsx` | Silently fell back to mock results on API error | Shows real error toast instead |
| 14 | `frontend/src/pages/ImageAnalysis.jsx` | Silently fell back to mock analysis | Shows real error toast instead |
| 15 | `frontend/src/pages/ReportSummarizer.jsx` | Silently fell back to mock summary | Shows real error toast instead |
| 16 | `backend/app/config/settings.py` | Crashed without MySQL configured | SQLite fallback for local development |
| 17 | `backend/app/config/database.py` | Missing SQLite `check_same_thread` arg | Added conditional engine config |
| 18 | `backend/app/models/models.py` | MySQL-only `Enum` type broke SQLite | Changed gender to `String(20)` |
| 19 | `backend/requirements.txt` | `passlib[bcrypt]` missing sha256 support | Changed to `passlib[bcrypt_sha256]` |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8+ **or** SQLite (auto-used for local dev if no MySQL password set)

---

### 1. Clone / Extract the project

```bash
cd homecare-plus
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
copy .env.example .env
# Edit .env — set DB_PASSWORD if using MySQL, or leave empty for SQLite
```

**If using MySQL:**
```sql
-- In MySQL console:
CREATE DATABASE homecare_plus CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**Start the backend:**
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs at: http://localhost:8000  
API Docs: http://localhost:8000/api/docs

---

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# VITE_API_URL is already set to /api (uses Vite proxy to localhost:8000)

# Start dev server
npm run dev
```

Frontend runs at: http://localhost:3000

---

### 4. Optional: Seed the Database

To populate disease library and symptoms:
```bash
cd backend
python seed_db.py
```

---

## 🔑 Environment Variables

### Backend `.env`

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_PASSWORD` | MySQL password (leave empty for SQLite) | `""` |
| `DB_NAME` | Database name | `homecare_plus` |
| `SECRET_KEY` | JWT signing key (change in production!) | Built-in |
| `ANTHROPIC_API_KEY` | For AI chat & image analysis | Optional |
| `OPENAI_API_KEY` | OpenAI fallback for chat | Optional |

---

## 🧪 Test Registration

1. Open http://localhost:3000/register
2. Fill in your name, email, phone, date of birth, gender
3. Enter **any length password** (bcrypt_sha256 supports >72 chars)
4. Click **Create Account**
5. You'll be redirected to the Dashboard ✅

---

## 📁 Project Structure

```
homecare-plus/
├── backend/
│   ├── app/
│   │   ├── config/          # database.py, settings.py
│   │   ├── middleware/       # auth.py (JWT + password hashing)
│   │   ├── models/           # SQLAlchemy ORM models
│   │   ├── routes/           # All API endpoints
│   │   └── services/         # AI analysis, symptom ML
│   ├── ml/                   # ML models for symptom checker
│   ├── main.py               # FastAPI app entry point
│   ├── requirements.txt
│   └── schema.sql
├── frontend/
│   ├── src/
│   │   ├── pages/            # All React page components
│   │   ├── services/         # api.js (axios)
│   │   ├── store/            # authStore.js (Zustand)
│   │   └── App.jsx
│   ├── package.json
│   └── vite.config.js
└── docker-compose.yml
```

---

## 🐳 Docker (Optional)

```bash
# Copy and edit env files first
cp backend/.env.example backend/.env

# Start everything
docker-compose up --build
```

---

## ⚠️ Production Checklist

- [ ] Change `SECRET_KEY` to a random 64-char string
- [ ] Set `APP_ENV=production` and `DEBUG=False`
- [ ] Use MySQL (not SQLite)
- [ ] Set `DB_PASSWORD` to a strong password
- [ ] Add `ANTHROPIC_API_KEY` for full AI functionality
- [ ] Configure proper `ALLOWED_ORIGINS` for your domain
