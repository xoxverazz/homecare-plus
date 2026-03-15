from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Application Settings ─────────────────────────────────────
    APP_NAME: str = "HomeCare+"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # ── Database Settings (PostgreSQL - Render) ──────────────────
    DATABASE_URL: str = (
        "postgresql+psycopg2://homecare:MaLr0xKC9v6h4EmmVXRqK5JTVLkWd6Ku"
        "@dpg-d6rc0nsr85hc73fabb50-a.oregon-postgres.render.com:5432/homecare_db_g2eo"
    )

    # ── JWT Authentication ───────────────────────────────────────
    SECRET_KEY: str = "homecare-super-secret-key-change-in-production-min-32chars"
    JWT_ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    # ── CORS Configuration ───────────────────────────────────────
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://homecare.plus",
    ]

    # ── File Upload Settings ─────────────────────────────────────
    UPLOAD_DIR: str = "uploads"
    MAX_FILE_SIZE_MB: int = 20

    # ── AI / LLM API Keys ────────────────────────────────────────
    ANTHROPIC_API_KEY: str = ""
    OPENAI_API_KEY: str = ""

    # ── Google Maps API ──────────────────────────────────────────
    GOOGLE_MAPS_API_KEY: str = ""

    # ── Pydantic Configuration ───────────────────────────────────
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


# Global settings instance
settings = Settings()
