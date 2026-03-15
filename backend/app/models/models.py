"""
HomeCare+ — SQLAlchemy ORM Models
All tables use MySQL-compatible types.
"""
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean,
    DateTime, Date, ForeignKey, Enum, JSON, BigInteger, Index
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.config.database import Base
import enum


# ── Enums ──────────────────────────────────────────────────────────────────────

class GenderEnum(str, enum.Enum):
    male          = "male"
    female        = "female"
    other         = "other"
    prefer_not    = "prefer_not"

class SeverityEnum(str, enum.Enum):
    mild          = "mild"
    moderate      = "moderate"
    severe        = "severe"
    critical      = "critical"

class RecordTypeEnum(str, enum.Enum):
    lab_report    = "lab_report"
    prescription  = "prescription"
    scan          = "scan"
    document      = "document"
    xray          = "xray"

class MetricTypeEnum(str, enum.Enum):
    heart_rate    = "heart_rate"
    systolic_bp   = "systolic_bp"
    diastolic_bp  = "diastolic_bp"
    oxygen_level  = "oxygen_level"
    blood_sugar   = "blood_sugar"
    bmi           = "bmi"
    weight        = "weight"
    steps         = "steps"
    temperature   = "temperature"


# ── Users ──────────────────────────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"

    id              = Column(Integer, primary_key=True, index=True, autoincrement=True)
    first_name      = Column(String(100), nullable=False)
    last_name       = Column(String(100), nullable=False)
    email           = Column(String(255), unique=True, nullable=False, index=True)
    phone           = Column(String(20), nullable=True)
    password_hash   = Column(String(255), nullable=False)
    date_of_birth   = Column(Date, nullable=True)
    gender          = Column(String(20), nullable=True)   # 'male','female','other','prefer_not'
    profile_photo   = Column(String(500), nullable=True)
    language        = Column(String(10), default="en")
    is_active       = Column(Boolean, default=True)
    is_verified     = Column(Boolean, default=False)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    health_metrics  = relationship("HealthMetric",  back_populates="user", cascade="all, delete-orphan")
    health_records  = relationship("HealthRecord",  back_populates="user", cascade="all, delete-orphan")
    chat_sessions   = relationship("ChatSession",   back_populates="user", cascade="all, delete-orphan")
    insurance_policies = relationship("InsurancePolicy", back_populates="user", cascade="all, delete-orphan")
    symptom_checks  = relationship("SymptomCheck",  back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (Index("idx_users_email", "email"),)


# ── Organ Systems ──────────────────────────────────────────────────────────────

class OrganSystem(Base):
    __tablename__ = "organ_systems"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    name        = Column(String(150), unique=True, nullable=False)
    slug        = Column(String(150), unique=True, nullable=False)
    icon        = Column(String(10), nullable=True)        # emoji
    description = Column(Text, nullable=True)
    specialist  = Column(String(150), nullable=True)
    diseases    = relationship("Disease", back_populates="organ_system")


# ── Symptoms ───────────────────────────────────────────────────────────────────

class Symptom(Base):
    __tablename__ = "symptoms"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    name        = Column(String(200), unique=True, nullable=False)
    slug        = Column(String(200), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    body_part   = Column(String(100), nullable=True)
    is_common   = Column(Boolean, default=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (Index("idx_symptoms_name", "name"),)


# ── Diseases ───────────────────────────────────────────────────────────────────

class Disease(Base):
    __tablename__ = "diseases"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    name             = Column(String(300), nullable=False, index=True)
    slug             = Column(String(300), unique=True, nullable=False)
    icd_code         = Column(String(20), nullable=True)
    organ_system_id  = Column(Integer, ForeignKey("organ_systems.id"), nullable=True)
    category         = Column(String(100), nullable=True)
    severity         = Column(String(50), nullable=True)       # chronic, acute, etc.
    overview         = Column(Text, nullable=True)
    symptoms         = Column(JSON, nullable=True)             # list of symptom strings
    causes           = Column(JSON, nullable=True)
    risk_factors     = Column(JSON, nullable=True)
    complications    = Column(JSON, nullable=True)
    treatments       = Column(JSON, nullable=True)
    medications      = Column(JSON, nullable=True)
    home_remedies    = Column(JSON, nullable=True)
    prevention       = Column(JSON, nullable=True)
    precautions      = Column(JSON, nullable=True)
    specialist       = Column(String(150), nullable=True)
    specialist_type  = Column(String(100), nullable=True)
    is_dental        = Column(Boolean, default=False)
    created_at       = Column(DateTime(timezone=True), server_default=func.now())
    updated_at       = Column(DateTime(timezone=True), onupdate=func.now())

    organ_system     = relationship("OrganSystem", back_populates="diseases")

    __table_args__ = (
        Index("idx_diseases_name",           "name"),
        Index("idx_diseases_organ_system",   "organ_system_id"),
        Index("idx_diseases_category",       "category"),
    )


# ── Symptom Checks ─────────────────────────────────────────────────────────────

class SymptomCheck(Base):
    __tablename__ = "symptom_checks"

    id            = Column(Integer, primary_key=True, autoincrement=True)
    user_id       = Column(Integer, ForeignKey("users.id"), nullable=True)
    symptoms      = Column(JSON, nullable=False)       # list of symptom strings
    follow_up     = Column(JSON, nullable=True)        # follow-up Q&A dict
    results       = Column(JSON, nullable=True)        # list of predicted diseases
    created_at    = Column(DateTime(timezone=True), server_default=func.now())

    user          = relationship("User", back_populates="symptom_checks")


# ── Health Metrics ─────────────────────────────────────────────────────────────

class HealthMetric(Base):
    __tablename__ = "health_metrics"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    metric_type = Column(String(50), nullable=False)
    value       = Column(Float, nullable=False)
    unit        = Column(String(30), nullable=True)
    notes       = Column(String(500), nullable=True)
    recorded_at = Column(DateTime(timezone=True), server_default=func.now())

    user        = relationship("User", back_populates="health_metrics")

    __table_args__ = (
        Index("idx_metrics_user_type", "user_id", "metric_type"),
        Index("idx_metrics_recorded_at", "recorded_at"),
    )


# ── Health Records ─────────────────────────────────────────────────────────────

class HealthRecord(Base):
    __tablename__ = "health_records"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    name            = Column(String(300), nullable=False)
    record_type     = Column(String(50), nullable=False)
    file_path       = Column(String(500), nullable=True)
    file_size       = Column(BigInteger, nullable=True)         # bytes
    mime_type       = Column(String(100), nullable=True)
    tags            = Column(JSON, nullable=True)
    ai_analysis     = Column(JSON, nullable=True)               # AI analysis result
    is_analyzed     = Column(Boolean, default=False)
    uploaded_at     = Column(DateTime(timezone=True), server_default=func.now())

    user            = relationship("User", back_populates="health_records")

    __table_args__ = (Index("idx_records_user", "user_id"),)


# ── Chat Sessions & Messages ───────────────────────────────────────────────────

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    user_id     = Column(Integer, ForeignKey("users.id"), nullable=False)
    title       = Column(String(300), nullable=True)
    language    = Column(String(10), default="en")
    created_at  = Column(DateTime(timezone=True), server_default=func.now())
    updated_at  = Column(DateTime(timezone=True), onupdate=func.now())

    user        = relationship("User", back_populates="chat_sessions")
    messages    = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    session_id  = Column(Integer, ForeignKey("chat_sessions.id"), nullable=False)
    role        = Column(String(20), nullable=False)      # 'user' | 'assistant'
    content     = Column(Text, nullable=False)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    session     = relationship("ChatSession", back_populates="messages")


# ── Hospitals ──────────────────────────────────────────────────────────────────

class Hospital(Base):
    __tablename__ = "hospitals"

    id          = Column(Integer, primary_key=True, autoincrement=True)
    name        = Column(String(300), nullable=False, index=True)
    type        = Column(String(50), nullable=True)         # hospital, clinic, pharmacy, dental
    address     = Column(String(500), nullable=True)
    city        = Column(String(100), nullable=True)
    state       = Column(String(100), nullable=True)
    pincode     = Column(String(20), nullable=True)
    phone       = Column(String(50), nullable=True)
    email       = Column(String(255), nullable=True)
    website     = Column(String(500), nullable=True)
    latitude    = Column(Float, nullable=True)
    longitude   = Column(Float, nullable=True)
    specialties = Column(JSON, nullable=True)
    rating      = Column(Float, nullable=True)
    is_active   = Column(Boolean, default=True)
    created_at  = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        Index("idx_hospitals_name",  "name"),
        Index("idx_hospitals_city",  "city"),
        Index("idx_hospitals_type",  "type"),
    )


# ── Insurance Policies ─────────────────────────────────────────────────────────

class InsurancePolicy(Base):
    __tablename__ = "insurance_policies"

    id              = Column(Integer, primary_key=True, autoincrement=True)
    user_id         = Column(Integer, ForeignKey("users.id"), nullable=False)
    provider        = Column(String(200), nullable=False)
    policy_number   = Column(String(100), nullable=False)
    policy_type     = Column(String(100), nullable=True)
    coverage        = Column(String(100), nullable=True)
    premium         = Column(String(100), nullable=True)
    renewal_date    = Column(Date, nullable=True)
    status          = Column(String(30), default="active")
    notes           = Column(Text, nullable=True)
    created_at      = Column(DateTime(timezone=True), server_default=func.now())
    updated_at      = Column(DateTime(timezone=True), onupdate=func.now())

    user            = relationship("User", back_populates="insurance_policies")

    __table_args__ = (Index("idx_insurance_user", "user_id"),)
