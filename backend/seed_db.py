"""
HomeCare+ — Database Seeder
Populates MySQL with:
  - Organ systems
  - Common symptoms
  - Disease library (20+ diseases with full details)
  - Sample hospitals
  - Demo user

Run: python backend/seed_db.py
"""
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config.database import SessionLocal, engine, Base
from app.models.models import User, OrganSystem, Symptom, Disease, Hospital
from app.middleware.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()


def seed_organs():
    organs = [
        ("Brain & Nervous System",   "brain",        "🧠", "Neurologist"),
        ("Heart & Cardiovascular",   "heart",        "❤️", "Cardiologist"),
        ("Lungs & Respiratory",      "lungs",        "🫁", "Pulmonologist"),
        ("Liver & Hepatic",          "liver",        "🫀", "Hepatologist"),
        ("Kidneys & Renal",          "kidneys",      "🫘", "Nephrologist"),
        ("Digestive System",         "digestive",    "🫃", "Gastroenterologist"),
        ("Skin & Dermatology",       "skin",         "🧴", "Dermatologist"),
        ("Bones & Musculoskeletal",  "bones",        "🦴", "Orthopedist"),
        ("Endocrine System",         "endocrine",    "⚗️", "Endocrinologist"),
        ("Eyes & Vision",            "eyes",         "👁️", "Ophthalmologist"),
        ("Ears, Nose & Throat",      "ent",          "👂", "ENT Specialist"),
        ("Dental & Oral Health",     "teeth",        "🦷", "Dentist"),
        ("Reproductive System",      "reproductive", "🔬", "Gynecologist / Urologist"),
        ("Blood & Hematology",       "blood",        "🩸", "Hematologist"),
        ("Mental Health",            "mental",       "🧘", "Psychiatrist"),
    ]
    created = []
    for name, slug, icon, specialist in organs:
        if not db.query(OrganSystem).filter(OrganSystem.slug == slug).first():
            o = OrganSystem(name=name, slug=slug, icon=icon, specialist=specialist)
            db.add(o)
            created.append(o)
    db.commit()
    print(f"  Seeded {len(created)} organ systems.")


def seed_symptoms():
    syms = [
        ("Fever",                True),  ("Headache",           True),
        ("Cough",                True),  ("Fatigue",            True),
        ("Nausea",               True),  ("Vomiting",           True),
        ("Chest Pain",           True),  ("Shortness of Breath",True),
        ("Dizziness",            True),  ("Sore Throat",        True),
        ("Body Aches",           True),  ("Runny Nose",         True),
        ("Diarrhea",             True),  ("Abdominal Pain",     True),
        ("Back Pain",            True),  ("Joint Pain",         True),
        ("Skin Rash",            True),  ("Loss of Appetite",   True),
        ("Chills",               True),  ("Sweating",           True),
        ("Wheezing",             False), ("Heartburn",          False),
        ("Frequent Urination",   False), ("Excessive Thirst",   False),
        ("Blurred Vision",       False), ("Numbness",           False),
        ("Swelling",             False), ("Palpitations",       False),
        ("Ear Pain",             False), ("Toothache",          False),
    ]
    created = 0
    for name, common in syms:
        slug = name.lower().replace(" ", "-").replace("/", "-")
        if not db.query(Symptom).filter(Symptom.slug == slug).first():
            db.add(Symptom(name=name, slug=slug, is_common=common))
            created += 1
    db.commit()
    print(f"  Seeded {created} symptoms.")


def seed_diseases():
    organ_map = {o.slug: o.id for o in db.query(OrganSystem).all()}

    diseases = [
        {
            "name": "Type 2 Diabetes", "slug": "type-2-diabetes", "icd_code": "E11",
            "organ_slug": "endocrine", "category": "Metabolic", "severity": "chronic",
            "specialist": "Endocrinologist", "specialist_type": "endocrinology",
            "overview": "Type 2 diabetes is a chronic metabolic condition where the body resists insulin or does not produce enough, resulting in elevated blood sugar levels.",
            "symptoms": ["Frequent urination", "Excessive thirst", "Unexplained weight loss", "Fatigue", "Blurred vision", "Slow-healing sores", "Frequent infections"],
            "causes": ["Insulin resistance", "Obesity", "Physical inactivity", "Family history", "Age over 45"],
            "risk_factors": ["Obesity", "Physical inactivity", "Family history", "Age over 45", "Prediabetes", "Gestational diabetes history"],
            "complications": ["Heart disease", "Nerve damage", "Kidney damage", "Eye damage", "Foot complications"],
            "treatments": ["Blood sugar monitoring", "Metformin and other medications", "Insulin therapy", "Healthy diet", "Regular exercise", "Weight management"],
            "medications": ["Metformin", "Sulfonylureas", "DPP-4 inhibitors", "SGLT2 inhibitors", "GLP-1 receptor agonists", "Insulin"],
            "home_remedies": ["High-fiber diet", "Reduce refined carbohydrates", "Drink more water", "Regular exercise", "Manage stress", "Monitor blood sugar at home"],
            "prevention": ["Maintain healthy weight", "Regular exercise", "Healthy diet", "Regular health checkups"],
            "precautions": ["Never skip medications", "Monitor blood sugar regularly", "Inspect feet daily", "Carry fast-acting sugar for hypoglycemia"],
        },
        {
            "name": "Hypertension", "slug": "hypertension", "icd_code": "I10",
            "organ_slug": "heart", "category": "Cardiovascular", "severity": "chronic",
            "specialist": "Cardiologist", "specialist_type": "cardiology",
            "overview": "Hypertension (high blood pressure) is a condition where blood pressure in the arteries is persistently elevated, increasing risk of heart disease and stroke.",
            "symptoms": ["Often no symptoms", "Severe headaches", "Nosebleed", "Dizziness", "Chest pain", "Shortness of breath"],
            "causes": ["Primary hypertension (unknown cause)", "Kidney disease", "Thyroid disorders", "Obstructive sleep apnea", "Medications", "Adrenal gland tumors"],
            "risk_factors": ["Age over 65", "Family history", "Obesity", "Inactivity", "High sodium diet", "Excessive alcohol", "Smoking"],
            "complications": ["Heart attack", "Stroke", "Heart failure", "Kidney disease", "Vision loss", "Metabolic syndrome"],
            "treatments": ["Lifestyle modification", "ACE inhibitors", "Beta-blockers", "Calcium channel blockers", "Diuretics", "DASH diet"],
            "medications": ["Lisinopril", "Atenolol", "Amlodipine", "Hydrochlorothiazide", "Losartan", "Metoprolol"],
            "home_remedies": ["DASH diet", "Reduce sodium", "Regular aerobic exercise", "Limit alcohol", "Quit smoking", "Reduce stress"],
            "prevention": ["Healthy diet", "Regular exercise", "Healthy weight", "Limit alcohol and sodium", "No smoking", "Regular BP checks"],
            "precautions": ["Take medications as prescribed", "Monitor BP daily", "Never stop medications abruptly", "Avoid NSAIDs without doctor guidance"],
        },
        {
            "name": "Asthma", "slug": "asthma", "icd_code": "J45",
            "organ_slug": "lungs", "category": "Respiratory", "severity": "chronic",
            "specialist": "Pulmonologist", "specialist_type": "pulmonology",
            "overview": "Asthma is a chronic condition causing airway inflammation and narrowing, resulting in recurrent episodes of wheezing, breathlessness, chest tightness, and coughing.",
            "symptoms": ["Wheezing", "Shortness of breath", "Chest tightness", "Coughing, especially at night"],
            "causes": ["Airway inflammation", "Allergic triggers", "Respiratory infections", "Exercise", "Air pollutants", "Strong emotions"],
            "risk_factors": ["Family history", "Allergies", "Obesity", "Smoking exposure", "Occupational exposures", "Low birth weight"],
            "complications": ["Severe asthma attacks", "Permanent airway remodeling", "Medication side effects", "Sleep disruption"],
            "treatments": ["Inhaled corticosteroids", "Long-acting beta agonists", "Short-acting bronchodilators", "Leukotriene modifiers", "Biologics for severe asthma"],
            "medications": ["Salbutamol (rescue inhaler)", "Budesonide", "Salmeterol", "Montelukast", "Omalizumab"],
            "home_remedies": ["Identify and avoid triggers", "Use air purifiers", "Keep living spaces clean", "Yoga and breathing exercises", "Maintain healthy weight"],
            "prevention": ["Avoid allergens and irritants", "Quit smoking", "Get vaccinated", "Maintain healthy weight", "Use medications as directed"],
            "precautions": ["Always carry rescue inhaler", "Know your asthma action plan", "Avoid known triggers", "Monitor peak flow regularly"],
        },
        {
            "name": "Migraine", "slug": "migraine", "icd_code": "G43",
            "organ_slug": "brain", "category": "Neurological", "severity": "episodic",
            "specialist": "Neurologist", "specialist_type": "neurology",
            "overview": "Migraine is a neurological disorder causing recurrent, severe headaches often accompanied by nausea, vomiting, and sensitivity to light and sound.",
            "symptoms": ["Severe throbbing headache", "Nausea", "Vomiting", "Light sensitivity", "Sound sensitivity", "Visual aura"],
            "causes": ["Neurological changes", "Hormonal changes", "Stress", "Sleep changes", "Dietary triggers", "Sensory stimuli"],
            "risk_factors": ["Family history", "Age 25–55", "Female sex", "Hormonal changes", "Anxiety", "Depression"],
            "complications": ["Chronic migraine", "Medication overuse headache", "Status migrainosus", "Persistent aura without infarction"],
            "treatments": ["Triptans", "Anti-nausea medications", "Preventive medications", "Lifestyle modifications", "Botox injections"],
            "medications": ["Sumatriptan", "Rizatriptan", "Topiramate", "Propranolol", "Amitriptyline", "CGRP monoclonal antibodies"],
            "home_remedies": ["Rest in quiet dark room", "Cold or warm compress", "Stay hydrated", "Avoid known triggers", "Regular sleep schedule"],
            "prevention": ["Keep headache diary", "Avoid triggers", "Regular sleep", "Limit alcohol and caffeine", "Manage stress"],
            "precautions": ["Take medications at onset", "Do not overuse pain medications", "Avoid bright screens during attack", "Stay hydrated"],
        },
        {
            "name": "Dental Caries", "slug": "dental-caries", "icd_code": "K02",
            "organ_slug": "teeth", "category": "Dental", "severity": "progressive",
            "specialist": "Dentist", "specialist_type": "dentistry",
            "overview": "Dental caries (tooth decay) is damage to a tooth's enamel caused by bacteria producing acid from sugars, creating holes (cavities) in the teeth.",
            "symptoms": ["Toothache", "Sensitivity to hot/cold/sweet", "Visible holes or pits", "Tooth staining", "Pain when biting"],
            "causes": ["Oral bacteria", "Frequent sugar intake", "Poor oral hygiene", "Dry mouth", "Acidic foods and drinks"],
            "risk_factors": ["Poor oral hygiene", "High sugar diet", "Dry mouth", "Tooth location", "Inadequate fluoride", "Age (children and elderly)"],
            "complications": ["Severe toothache", "Tooth abscess", "Tooth loss", "Spread of infection"],
            "treatments": ["Fluoride treatments", "Fillings (composite or amalgam)", "Crowns", "Root canal treatment", "Tooth extraction if severe"],
            "medications": ["Fluoride varnish", "Antimicrobial rinses", "Antibiotics for abscess"],
            "home_remedies": ["Brush twice daily with fluoride toothpaste", "Floss daily", "Limit sugary foods", "Rinse with fluoride mouthwash"],
            "prevention": ["Regular brushing and flossing", "Dental checkups every 6 months", "Fluoride treatments", "Dental sealants for children", "Limit sugar"],
            "precautions": ["Never ignore toothache", "See dentist immediately for abscess symptoms", "Do not share toothbrushes"],
            "is_dental": True,
        },
    ]

    created = 0
    for d in diseases:
        if not db.query(Disease).filter(Disease.slug == d["slug"]).first():
            is_dental = d.pop("is_dental", False)
            organ_slug = d.pop("organ_slug")
            organ_id   = organ_map.get(organ_slug)
            disease = Disease(
                organ_system_id = organ_id,
                is_dental       = is_dental,
                **d,
            )
            db.add(disease)
            created += 1
    db.commit()
    print(f"  Seeded {created} diseases.")


def seed_hospitals():
    hospitals = [
        {"name": "City Medical Center",    "type": "hospital", "city": "Pune", "state": "Maharashtra", "phone": "+91-20-1234-5678", "lat": 18.5204, "lng": 73.8567, "specialties": ["Cardiology", "Neurology", "Orthopedics", "General Medicine"], "rating": 4.5},
        {"name": "Apollo Hospital Pune",   "type": "hospital", "city": "Pune", "state": "Maharashtra", "phone": "+91-20-2345-6789", "lat": 18.5122, "lng": 73.8456, "specialties": ["Oncology", "Cardiac Surgery", "Neurosurgery"], "rating": 4.8},
        {"name": "Ruby Hall Clinic",       "type": "hospital", "city": "Pune", "state": "Maharashtra", "phone": "+91-20-3456-7890", "lat": 18.5308, "lng": 73.8741, "specialties": ["Multi-specialty", "Emergency Care", "ICU"], "rating": 4.6},
        {"name": "Green Valley Clinic",    "type": "clinic",   "city": "Pune", "state": "Maharashtra", "phone": "+91-20-4567-8901", "lat": 18.5180, "lng": 73.8540, "specialties": ["General Medicine", "Pediatrics", "Dermatology"], "rating": 4.3},
        {"name": "MedPlus Pharmacy",       "type": "pharmacy", "city": "Pune", "state": "Maharashtra", "phone": "+91-20-5678-9012", "lat": 18.5190, "lng": 73.8550, "specialties": ["Pharmacy", "Health Products"], "rating": 4.2},
        {"name": "Smile Dental Clinic",    "type": "dental",   "city": "Pune", "state": "Maharashtra", "phone": "+91-20-6789-0123", "lat": 18.5240, "lng": 73.8620, "specialties": ["Dentistry", "Orthodontics", "Oral Surgery"], "rating": 4.6},
    ]
    created = 0
    for h in hospitals:
        if not db.query(Hospital).filter(Hospital.name == h["name"]).first():
            db.add(Hospital(
                name        = h["name"],
                type        = h["type"],
                city        = h["city"],
                state       = h["state"],
                phone       = h["phone"],
                latitude    = h["lat"],
                longitude   = h["lng"],
                specialties = h["specialties"],
                rating      = h["rating"],
                is_active   = True,
            ))
            created += 1
    db.commit()
    print(f"  Seeded {created} hospitals.")


def seed_demo_user():
    if not db.query(User).filter(User.email == "demo@homecare.plus").first():
        user = User(
            first_name    = "Demo",
            last_name     = "User",
            email         = "demo@homecare.plus",
            password_hash = hash_password("Demo@1234"),
            is_active     = True,
            is_verified   = True,
        )
        db.add(user)
        db.commit()
        print("  Demo user created: demo@homecare.plus / Demo@1234")
    else:
        print("  Demo user already exists.")


if __name__ == "__main__":
    print("\nHomeCare+ Database Seeder")
    print("=" * 40)
    print("Seeding organ systems...")
    seed_organs()
    print("Seeding symptoms...")
    seed_symptoms()
    print("Seeding diseases...")
    seed_diseases()
    print("Seeding hospitals...")
    seed_hospitals()
    print("Seeding demo user...")
    seed_demo_user()
    print("\nDatabase seeding complete!")
    db.close()
