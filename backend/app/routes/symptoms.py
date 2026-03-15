"""
HomeCare+ — Symptom Checker Routes
POST /symptoms/analyze    — analyze symptoms via ML model
GET  /symptoms/list       — list all known symptoms
POST /symptoms/followup   — get follow-up questions
"""
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel, field_validator
from typing import List, Optional, Dict, Any
import logging

from app.config.database import get_db
from app.models.models import User, SymptomCheck, Symptom
from app.middleware.auth import get_optional_user
from app.services.symptom_service import SymptomAnalyzer

logger = logging.getLogger(__name__)
router  = APIRouter()
analyzer = SymptomAnalyzer()


class AnalyzeRequest(BaseModel):
    symptoms:  List[str]
    follow_up: Optional[Dict[str, Any]] = {}

    @field_validator("symptoms")
    @classmethod
    def symptoms_not_empty(cls, v):
        if not v:
            raise ValueError("At least one symptom is required.")
        cleaned = [s.strip() for s in v if s and s.strip()]
        if not cleaned:
            raise ValueError("Symptoms must be non-empty strings.")
        return cleaned[:15]  # cap at 15


class FollowUpRequest(BaseModel):
    symptoms:  List[str]
    step:      int = 0


@router.post("/analyze")
async def analyze_symptoms(
    body: AnalyzeRequest,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
):
    try:
        results = analyzer.predict(body.symptoms, body.follow_up or {})
    except Exception as e:
        logger.error(f"Symptom analysis error: {e}")
        raise HTTPException(status_code=500, detail="Analysis service error. Please try again.")

    # Build enriched response matching frontend expectations
    enriched = []
    for r in results:
        enriched.append({
            "name":          r.get("name", "Unknown"),
            "icd_code":      r.get("icd_code", ""),
            "probability":   r.get("probability", 0),
            "severity":      r.get("severity", 0),
            "severity_level":r.get("severity_level", "Unknown"),
            "specialist":    r.get("specialist", "General Physician"),
            "precautions":   r.get("precautions", []),
            "home_remedies": r.get("home_remedies", []),
            "medications":   r.get("medications", []),
            "recommendations":r.get("recommendations", []),
            "description":   r.get("description", ""),
        })

    # Persist (anonymized if not logged in)
    try:
        check = SymptomCheck(
            user_id   = current_user.id if current_user else None,
            symptoms  = body.symptoms,
            follow_up = body.follow_up,
            results   = enriched,
        )
        db.add(check)
        db.commit()
    except Exception as e:
        logger.warning(f"Failed to persist symptom check: {e}")
        db.rollback()

    return {
        "analyzed_symptoms": body.symptoms,
        "possible_diseases": enriched,
        "disclaimer": (
            "This AI-generated analysis is for informational purposes only and does not "
            "constitute medical advice. Always consult a qualified healthcare professional "
            "for accurate diagnosis and treatment."
        ),
    }


@router.get("/list")
async def list_symptoms(db: Session = Depends(get_db)):
    symptoms = db.query(Symptom).order_by(Symptom.name).all()
    if not symptoms:
        return {"symptoms": [{"name": s, "is_common": True} for s in analyzer.all_symptoms]}
    return {"symptoms": [{"id": s.id, "name": s.name, "is_common": s.is_common} for s in symptoms]}


@router.post("/followup")
async def get_followup_questions(body: FollowUpRequest):
    return {"questions": [
        {"id": "duration",  "question": "How long have you had these symptoms?",
         "options": ["Less than 24 hours", "1-3 days", "4-7 days", "More than a week"]},
        {"id": "severity",  "question": "How severe are your symptoms?",
         "options": ["Mild - slightly uncomfortable", "Moderate - affects daily activities",
                     "Severe - very uncomfortable", "Critical - need immediate help"]},
        {"id": "age_group", "question": "What is your age group?",
         "options": ["Under 18", "18-35", "36-60", "Over 60"]},
        {"id": "chronic",   "question": "Do you have any chronic conditions?",
         "options": ["None", "Diabetes", "Hypertension", "Heart disease", "Other"]},
    ]}
