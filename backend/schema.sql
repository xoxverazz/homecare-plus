-- ============================================================
-- HomeCare+ MySQL Database Schema
-- Run this SQL in your MySQL instance before starting the app
-- ============================================================

CREATE DATABASE IF NOT EXISTS homecare_plus
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE homecare_plus;

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    first_name      VARCHAR(100)  NOT NULL,
    last_name       VARCHAR(100)  NOT NULL,
    email           VARCHAR(255)  NOT NULL UNIQUE,
    phone           VARCHAR(20),
    password_hash   VARCHAR(255)  NOT NULL,
    date_of_birth   DATE,
    gender          ENUM('male','female','other','prefer_not'),
    profile_photo   VARCHAR(500),
    language        VARCHAR(10)   DEFAULT 'en',
    is_active       TINYINT(1)    DEFAULT 1,
    is_verified     TINYINT(1)    DEFAULT 0,
    created_at      DATETIME      DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME      ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ── Organ Systems ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS organ_systems (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150) NOT NULL UNIQUE,
    slug        VARCHAR(150) NOT NULL UNIQUE,
    icon        VARCHAR(10),
    description TEXT,
    specialist  VARCHAR(150)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Symptoms ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS symptoms (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(200) NOT NULL UNIQUE,
    slug        VARCHAR(200) NOT NULL UNIQUE,
    description TEXT,
    body_part   VARCHAR(100),
    is_common   TINYINT(1)   DEFAULT 0,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_symptoms_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Diseases ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS diseases (
    id               INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name             VARCHAR(300) NOT NULL,
    slug             VARCHAR(300) NOT NULL UNIQUE,
    icd_code         VARCHAR(20),
    organ_system_id  INT UNSIGNED,
    category         VARCHAR(100),
    severity         VARCHAR(50),
    overview         TEXT,
    symptoms         JSON,
    causes           JSON,
    risk_factors     JSON,
    complications    JSON,
    treatments       JSON,
    medications      JSON,
    home_remedies    JSON,
    prevention       JSON,
    precautions      JSON,
    specialist       VARCHAR(150),
    specialist_type  VARCHAR(100),
    is_dental        TINYINT(1)   DEFAULT 0,
    created_at       DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (organ_system_id) REFERENCES organ_systems(id) ON DELETE SET NULL,
    INDEX idx_diseases_name         (name),
    INDEX idx_diseases_organ_system (organ_system_id),
    INDEX idx_diseases_category     (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Symptom Checks ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS symptom_checks (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED,
    symptoms    JSON NOT NULL,
    follow_up   JSON,
    results     JSON,
    created_at  DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Health Metrics ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_metrics (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    metric_type VARCHAR(50)  NOT NULL,
    value       FLOAT        NOT NULL,
    unit        VARCHAR(30),
    notes       VARCHAR(500),
    recorded_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_metrics_user_type    (user_id, metric_type),
    INDEX idx_metrics_recorded_at  (recorded_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Health Records ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS health_records (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    name        VARCHAR(300) NOT NULL,
    record_type VARCHAR(50)  NOT NULL,
    file_path   VARCHAR(500),
    file_size   BIGINT,
    mime_type   VARCHAR(100),
    tags        JSON,
    ai_analysis JSON,
    is_analyzed TINYINT(1)   DEFAULT 0,
    uploaded_at DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_records_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Chat Sessions ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chat_sessions (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     INT UNSIGNED NOT NULL,
    title       VARCHAR(300),
    language    VARCHAR(10)  DEFAULT 'en',
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at  DATETIME     ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS chat_messages (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    session_id  INT UNSIGNED NOT NULL,
    role        VARCHAR(20)  NOT NULL,
    content     TEXT         NOT NULL,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Hospitals ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS hospitals (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(300) NOT NULL,
    type        VARCHAR(50),
    address     VARCHAR(500),
    city        VARCHAR(100),
    state       VARCHAR(100),
    pincode     VARCHAR(20),
    phone       VARCHAR(50),
    email       VARCHAR(255),
    website     VARCHAR(500),
    latitude    FLOAT,
    longitude   FLOAT,
    specialties JSON,
    rating      FLOAT,
    is_active   TINYINT(1)   DEFAULT 1,
    created_at  DATETIME     DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_hospitals_name (name),
    INDEX idx_hospitals_city (city),
    INDEX idx_hospitals_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Insurance Policies ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS insurance_policies (
    id              INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED NOT NULL,
    provider        VARCHAR(200) NOT NULL,
    policy_number   VARCHAR(100) NOT NULL,
    policy_type     VARCHAR(100),
    coverage        VARCHAR(100),
    premium         VARCHAR(100),
    renewal_date    DATE,
    status          VARCHAR(30)  DEFAULT 'active',
    notes           TEXT,
    created_at      DATETIME     DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_insurance_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ── Sample data ───────────────────────────────────────────────
INSERT IGNORE INTO organ_systems (name, slug, icon, specialist) VALUES
  ('Brain & Nervous System', 'brain',        '🧠', 'Neurologist'),
  ('Heart & Cardiovascular', 'heart',        '❤️', 'Cardiologist'),
  ('Lungs & Respiratory',    'lungs',        '🫁', 'Pulmonologist'),
  ('Kidneys & Renal',        'kidneys',      '🫘', 'Nephrologist'),
  ('Digestive System',       'digestive',    '🫃', 'Gastroenterologist'),
  ('Skin & Dermatology',     'skin',         '🧴', 'Dermatologist'),
  ('Bones & Musculoskeletal','bones',        '🦴', 'Orthopedist'),
  ('Endocrine System',       'endocrine',    '⚗️', 'Endocrinologist'),
  ('Eyes & Vision',          'eyes',         '👁️', 'Ophthalmologist'),
  ('Ears, Nose & Throat',    'ent',          '👂', 'ENT Specialist'),
  ('Dental & Oral Health',   'teeth',        '🦷', 'Dentist'),
  ('Blood & Hematology',     'blood',        '🩸', 'Hematologist'),
  ('Mental Health',          'mental',       '🧘', 'Psychiatrist');

-- Demo user (password: Demo@1234)
INSERT IGNORE INTO users (first_name, last_name, email, password_hash, is_active, is_verified)
VALUES ('Demo', 'User', 'demo@homecare.plus',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBNuCWrHlXBrIi', 1, 1);
