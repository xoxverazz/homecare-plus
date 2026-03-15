from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config.settings import settings

# ── Database Engine ─────────────────────────────────────────────
# Uses MySQL connection from settings.DATABASE_URL
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,     # Checks connection health automatically
    pool_recycle=3600,      # Prevents MySQL timeout disconnects
    pool_size=10,           # Number of persistent connections
    max_overflow=20,        # Extra connections if pool is full
    echo=settings.DEBUG,    # Shows SQL queries in development
    future=True
)

# ── Session Factory ─────────────────────────────────────────────
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# ── Base Model for ORM ──────────────────────────────────────────
Base = declarative_base()


# ── FastAPI Dependency ──────────────────────────────────────────
def get_db():
    """
    FastAPI dependency that provides a database session
    and ensures it closes after the request.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()