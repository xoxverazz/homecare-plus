from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # ── Application Settings ─────────────────────────────────────
    APP_NAME: str = "HomeCare+"
    APP_ENV: str = "development"
    DEBUG: bool = True

    # ── Database Settings (MySQL) ────────────────────────────────
    DB_HOST: str = "localhost"
    DB_PORT: int = 3306
    DB_USER: str = "root"
    DB_PASSWORD: str = ""
    DB_NAME: str = "homecare_plus"

    @property
    def DATABASE_URL(self) -> str:
        """
        Always use MySQL database connection.
        Prevents accidental fallback to SQLite.
        """
        return (
            f"mysql+pymysql://{self.DB_USER}:{self.DB_PASSWORD}"
            f"@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"
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

    # ── AI / LLM API Keys (Optional) ─────────────────────────────
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