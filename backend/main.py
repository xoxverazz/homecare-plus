"""
HomeCare+ Backend — FastAPI Application Entry Point (Enhanced)
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os

from app.config.database import engine, Base
from app.config.settings import settings
from app.routes import (
    auth, symptoms, diseases, chat, health,
    records, hospitals, insurance, analysis, user, telemedicine
)


# ───────────────── LIFESPAN ─────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    try:
        from app.config.database import SessionLocal
        from app.models.models import Disease, OrganSystem

        db = SessionLocal()

        if db.query(OrganSystem).count() == 0:
            print("Database empty — running disease seeder...")
            import subprocess, sys

            result = subprocess.run(
                [sys.executable, "seed_diseases.py"],
                capture_output=True,
                text=True
            )

            if result.returncode == 0:
                print("Disease database seeded successfully.")
            else:
                print(f"Seeding warning: {result.stderr[:200]}")
        else:
            count = db.query(Disease).count()
            print(f"Database ready: {count} diseases loaded.")

        db.close()

    except Exception as e:
        print(f"Startup seeding skipped: {e}")

    print("HomeCare+ backend started successfully.")
    yield
    print("HomeCare+ backend shutting down.")


# ───────────────── APP ─────────────────
app = FastAPI(
    title="HomeCare+ API",
    description="AI-Powered Digital Healthcare Platform API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)


# ───────────────── CORS FIX (🔥 IMPORTANT) ─────────────────
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:5173",
    "https://homecare-plus-1.onrender.com",  # ✅ YOUR FRONTEND
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,   # 🔥 FIXED
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ───────────────── OTHER MIDDLEWARE ─────────────────
app.add_middleware(GZipMiddleware, minimum_size=1000)


# ───────────────── STATIC FILES ─────────────────
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")


# ───────────────── ROUTES ─────────────────
API = "/api"

app.include_router(auth.router,      prefix=f"{API}/auth",      tags=["Authentication"])
app.include_router(user.router,      prefix=f"{API}/auth",      tags=["User Profile"])
app.include_router(symptoms.router,  prefix=f"{API}/symptoms",  tags=["Symptom Checker"])
app.include_router(diseases.router,  prefix=f"{API}/diseases",  tags=["Disease Library"])
app.include_router(chat.router,      prefix=f"{API}/chat",      tags=["AI Chat"])
app.include_router(health.router,    prefix=f"{API}/health",    tags=["Health Metrics"])
app.include_router(records.router,   prefix=f"{API}/records",   tags=["Health Records"])
app.include_router(hospitals.router, prefix=f"{API}/hospitals", tags=["Hospitals"])
app.include_router(insurance.router, prefix=f"{API}/insurance", tags=["Insurance"])
app.include_router(analysis.router,  prefix=f"{API}/analysis",  tags=["AI Analysis"])
app.include_router(telemedicine.router, prefix=f"{API}/telemedicine", tags=["Telemedicine"])


# ───────────────── HEALTH CHECK ─────────────────
@app.get("/api/health-check", tags=["System"])
async def health_check():
    return {
        "status": "ok",
        "service": "HomeCare+ API",
        "version": "1.0.0"
    }
