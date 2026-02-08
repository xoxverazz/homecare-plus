-- HOMECARE+ Database Schema
-- Create Database
CREATE DATABASE IF NOT EXISTS homecare_plus;
USE homecare_plus;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    gender ENUM('male', 'female', 'other'),
    google_id VARCHAR(255) UNIQUE,
    profile_picture VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_google_id (google_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Medical History Table
CREATE TABLE IF NOT EXISTS medical_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    symptoms TEXT,
    predicted_disease VARCHAR(255),
    confidence_score DECIMAL(5,2),
    consultation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_consultation_date (consultation_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Diseases Database (Indian Context)
CREATE TABLE IF NOT EXISTS diseases (
    disease_id INT AUTO_INCREMENT PRIMARY KEY,
    disease_name VARCHAR(255) NOT NULL,
    organ_system VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    causes TEXT NOT NULL,
    precautions TEXT NOT NULL,
    transmission TEXT,
    treatment TEXT NOT NULL,
    medicines TEXT,
    prevalence_in_india TEXT,
    severity_level ENUM('low', 'moderate', 'high', 'critical') DEFAULT 'moderate',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_organ_system (organ_system),
    INDEX idx_disease_name (disease_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Organs Table
CREATE TABLE IF NOT EXISTS organs (
    organ_id INT AUTO_INCREMENT PRIMARY KEY,
    organ_name VARCHAR(100) NOT NULL UNIQUE,
    organ_system VARCHAR(100) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Emergency Contacts Table
CREATE TABLE IF NOT EXISTS emergency_contacts (
    contact_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    contact_name VARCHAR(255) NOT NULL,
    contact_phone VARCHAR(20) NOT NULL,
    relationship VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Hospitals Table
CREATE TABLE IF NOT EXISTS hospitals (
    hospital_id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_name VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(10),
    phone VARCHAR(20),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    specialties TEXT,
    emergency_available BOOLEAN DEFAULT TRUE,
    rating DECIMAL(2,1),
    INDEX idx_city (city),
    INDEX idx_location (latitude, longitude)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert Sample Organs
INSERT INTO organs (organ_name, organ_system, description) VALUES
('Heart', 'Cardiovascular System', 'The heart is a muscular organ that pumps blood throughout the body'),
('Lungs', 'Respiratory System', 'The lungs are responsible for gas exchange, providing oxygen and removing carbon dioxide'),
('Liver', 'Digestive System', 'The liver is the largest internal organ, responsible for detoxification and metabolism'),
('Kidneys', 'Urinary System', 'The kidneys filter blood and remove waste products through urine'),
('Brain', 'Nervous System', 'The brain controls all body functions and processes sensory information'),
('Stomach', 'Digestive System', 'The stomach digests food using acids and enzymes'),
('Pancreas', 'Endocrine System', 'The pancreas produces insulin and digestive enzymes'),
('Intestines', 'Digestive System', 'The intestines absorb nutrients and water from digested food'),
('Skin', 'Integumentary System', 'The skin is the body''s largest organ, providing protection'),
('Eyes', 'Sensory System', 'The eyes are organs of vision');

-- Insert Sample Diseases (Indian Context)
INSERT INTO diseases (disease_name, organ_system, description, symptoms, causes, precautions, transmission, treatment, medicines, prevalence_in_india, severity_level) VALUES
('Dengue Fever', 'Blood', 'A mosquito-borne viral infection common in India during monsoon season', 'High fever, severe headache, pain behind eyes, joint and muscle pain, rash, mild bleeding', 'Aedes mosquito bite carrying dengue virus', 'Use mosquito repellents, wear full-sleeve clothes, eliminate standing water, use mosquito nets', 'Transmitted through infected Aedes mosquitoes', 'Rest, fluid intake, fever management. Severe cases require hospitalization', 'Paracetamol for fever (avoid aspirin), IV fluids in severe cases', 'Very common, especially during monsoon. Over 1 lakh cases reported annually', 'moderate'),

('Tuberculosis (TB)', 'Lungs', 'A bacterial infection that primarily affects the lungs, highly prevalent in India', 'Persistent cough (>3 weeks), coughing up blood, chest pain, fever, night sweats, weight loss, fatigue', 'Mycobacterium tuberculosis bacteria spread through airborne droplets', 'BCG vaccination, avoid close contact with TB patients, maintain good hygiene, proper ventilation', 'Airborne transmission through coughing or sneezing', 'DOTS therapy (Directly Observed Treatment Short-course) for 6-9 months', 'Rifampicin, Isoniazid, Pyrazinamide, Ethambutol - combination therapy', 'India has the highest TB burden globally with ~2.6 million cases annually', 'high'),

('Typhoid', 'Digestive System', 'A bacterial infection caused by contaminated food and water, common in India', 'Prolonged high fever, weakness, stomach pain, headache, loss of appetite, rose-colored spots on chest', 'Salmonella typhi bacteria from contaminated food or water', 'Drink boiled/filtered water, eat freshly cooked food, maintain hand hygiene, typhoid vaccination', 'Fecal-oral route through contaminated food/water', 'Antibiotic therapy, fluid management, rest', 'Azithromycin, Ceftriaxone, Ciprofloxacin (based on sensitivity)', 'Common in India, especially in areas with poor sanitation', 'moderate'),

('Malaria', 'Blood', 'A parasitic infection transmitted by mosquitoes, endemic in many parts of India', 'Cyclic fever with chills, sweating, headache, nausea, vomiting, muscle pain, anemia', 'Plasmodium parasites transmitted by female Anopheles mosquito', 'Use mosquito nets (especially at night), take antimalarial prophylaxis in endemic areas, eliminate breeding sites', 'Transmitted through infected Anopheles mosquitoes', 'Antimalarial medications based on parasite type and drug resistance', 'Chloroquine, Artemisinin-based combinations, Primaquine', 'Endemic in many states; ~6 million cases annually, declining with control programs', 'high'),

('Diabetes Type 2', 'Pancreas', 'A metabolic disorder where the body cannot properly use insulin, very common in India', 'Increased thirst, frequent urination, unexplained weight loss, fatigue, blurred vision, slow healing wounds', 'Insulin resistance due to genetics, obesity, sedentary lifestyle, poor diet', 'Maintain healthy weight, regular exercise, balanced diet, regular health checkups', 'Not transmissible - genetic and lifestyle factors', 'Lifestyle modification, oral antidiabetic drugs, insulin therapy if needed', 'Metformin, Glimepiride, Insulin (various types)', 'India is the diabetes capital with ~77 million diabetics. 1 in 6 diabetics worldwide is Indian', 'moderate'),

('Hypertension', 'Heart', 'High blood pressure that can lead to heart disease and stroke, very prevalent in India', 'Often asymptomatic, may have headaches, dizziness, nosebleeds in severe cases', 'Genetics, high salt intake, stress, obesity, lack of exercise, alcohol consumption', 'Reduce salt intake, maintain healthy weight, regular exercise, stress management, limit alcohol', 'Not transmissible - genetic and lifestyle factors', 'Lifestyle changes, antihypertensive medications', 'Amlodipine, Telmisartan, Atenolol, Hydrochlorothiazide', 'Affects ~30% of adult Indian population, under-diagnosed and under-treated', 'moderate'),

('Hepatitis A', 'Liver', 'A viral liver infection common in areas with poor sanitation', 'Fever, fatigue, loss of appetite, nausea, jaundice (yellow skin and eyes), dark urine, clay-colored stools', 'Hepatitis A virus through contaminated food or water', 'Vaccination, drink safe water, maintain hand hygiene, eat properly cooked food', 'Fecal-oral route through contaminated food/water', 'Supportive care, rest, adequate nutrition, avoid alcohol', 'No specific antiviral treatment - supportive care only', 'Common in India due to poor sanitation in many areas', 'moderate'),

('Coronary Artery Disease', 'Heart', 'Narrowing of coronary arteries leading to reduced blood flow to heart', 'Chest pain (angina), shortness of breath, heart attack, fatigue', 'Atherosclerosis due to high cholesterol, smoking, diabetes, hypertension, sedentary lifestyle', 'Healthy diet, regular exercise, quit smoking, control diabetes and BP, manage stress', 'Not transmissible - lifestyle and genetic factors', 'Medications, lifestyle changes, angioplasty, bypass surgery in severe cases', 'Aspirin, Statins, Beta-blockers, ACE inhibitors', 'Leading cause of death in India, rapidly increasing in young adults', 'high'),

('Chronic Kidney Disease', 'Kidneys', 'Progressive loss of kidney function over time', 'Fatigue, swelling in ankles and feet, decreased urine output, nausea, loss of appetite, confusion', 'Diabetes, hypertension, glomerulonephritis, polycystic kidney disease', 'Control diabetes and BP, avoid NSAIDs overuse, stay hydrated, regular checkups', 'Not transmissible - caused by underlying conditions', 'Treat underlying cause, medications, dialysis, kidney transplant in end-stage', 'BP medications, erythropoietin, phosphate binders', 'Increasing prevalence in India, often undiagnosed until advanced stages', 'high'),

('Asthma', 'Lungs', 'Chronic inflammatory disease of airways causing breathing difficulty', 'Wheezing, shortness of breath, chest tightness, coughing (especially at night)', 'Genetic factors, allergies, air pollution, respiratory infections, exercise', 'Avoid triggers (dust, smoke, pollen), use air purifiers, take medications regularly', 'Not transmissible - allergic and genetic factors', 'Inhaled bronchodilators and corticosteroids, oral medications for severe cases', 'Salbutamol, Budesonide, Montelukast, Theophylline', 'Affects 15-20 million Indians, increasing due to air pollution', 'moderate'),

('Chikungunya', 'Joints', 'A viral infection transmitted by mosquitoes causing severe joint pain', 'High fever, severe joint pain, muscle pain, headache, rash, fatigue', 'Chikungunya virus transmitted by Aedes mosquitoes', 'Same as dengue prevention - mosquito control measures', 'Transmitted through infected Aedes mosquitoes', 'Supportive care, pain management, rest', 'Paracetamol for fever and pain, NSAIDs for joint pain (with caution)', 'Periodic outbreaks in India, joint pain can persist for months', 'moderate'),

('Gastroenteritis', 'Stomach', 'Inflammation of stomach and intestines causing diarrhea and vomiting', 'Diarrhea, vomiting, stomach cramps, nausea, fever, dehydration', 'Viral (Rotavirus, Norovirus) or bacterial infections from contaminated food/water', 'Hand hygiene, safe drinking water, proper food handling, rotavirus vaccination', 'Fecal-oral route through contaminated food/water or person-to-person', 'Oral rehydration therapy (ORS), zinc supplements, antibiotics if bacterial', 'ORS packets, Zinc tablets, Antibiotics only if bacterial cause confirmed', 'Very common, especially in children, major cause of child mortality', 'moderate'),

('Cholera', 'Intestines', 'Severe diarrheal disease caused by bacteria, can be life-threatening', 'Profuse watery diarrhea (rice-water stools), vomiting, rapid dehydration, leg cramps', 'Vibrio cholerae bacteria from contaminated water', 'Drink safe water, maintain sanitation, hand hygiene, oral cholera vaccine', 'Fecal-oral route through contaminated water and food', 'Rapid rehydration with ORS or IV fluids, antibiotics', 'ORS, IV fluids, Doxycycline or Azithromycin', 'Sporadic outbreaks in India, especially during floods and in areas with poor sanitation', 'critical'),

('Pneumonia', 'Lungs', 'Infection of the lungs causing inflammation of air sacs', 'Fever, chills, cough with phlegm, chest pain, shortness of breath, fatigue', 'Bacteria (Streptococcus pneumoniae), viruses, or fungi', 'Vaccination (pneumococcal vaccine), avoid smoking, practice good hygiene', 'Respiratory droplets or aspiration', 'Antibiotics for bacterial pneumonia, supportive care, oxygen therapy if needed', 'Amoxicillin, Azithromycin, Ceftriaxone depending on severity', 'Common cause of death in children and elderly in India', 'high'),

('Jaundice (Hepatitis)', 'Liver', 'Yellowing of skin and eyes due to liver dysfunction', 'Yellow skin and eyes, dark urine, pale stools, fatigue, abdominal pain, nausea', 'Viral hepatitis (A, B, C, E), liver diseases, bile duct obstruction', 'Hepatitis vaccination, avoid contaminated food/water, safe blood transfusion practices', 'Varies by type - fecal-oral (A, E), blood/body fluids (B, C)', 'Treatment depends on cause - antivirals for hepatitis B/C, supportive care for A/E', 'Depends on type - antivirals for chronic hepatitis, supportive care', 'Hepatitis A and E common in India due to waterborne transmission', 'moderate');
