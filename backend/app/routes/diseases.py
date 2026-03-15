"""
HomeCare+ — Disease Library Routes
GET /diseases              — paginated list with filters
GET /diseases/search       — full-text search
GET /diseases/organs       — list all organ systems
GET /diseases/organ/{slug} — diseases by organ
GET /diseases/{id}         — disease detail
"""
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional, List

from app.config.database import get_db
from app.models.models import Disease, OrganSystem

router = APIRouter()

def _maybe_seed(db):
    """Auto-seed diseases on first request if DB is empty."""
    try:
        from app.models.models import Disease
        if db.query(Disease).count() == 0:
            import subprocess, sys, os
            seed_path = os.path.join(os.path.dirname(__file__), '..', '..', '..', 'seed_diseases.py')
            if os.path.exists(seed_path):
                subprocess.run([sys.executable, seed_path], capture_output=True, cwd=os.path.dirname(seed_path))
    except Exception:
        pass


def disease_summary(d: Disease) -> dict:
    return {
        "id":         d.id,
        "name":       d.name,
        "slug":       d.slug,
        "icd_code":   d.icd_code,
        "category":   d.category,
        "severity":   d.severity,
        "specialist": d.specialist,
        "symptoms":   d.symptoms or [],
        "organ":      d.organ_system.name if d.organ_system else None,
        "overview":   (d.overview or "")[:300],
    }


def disease_detail(d: Disease) -> dict:
    return {
        "id":              d.id,
        "name":            d.name,
        "slug":            d.slug,
        "icd_code":        d.icd_code,
        "category":        d.category,
        "severity":        d.severity,
        "overview":        d.overview,
        "symptoms":        d.symptoms        or [],
        "causes":          d.causes          or [],
        "risk_factors":    d.risk_factors    or [],
        "complications":   d.complications   or [],
        "treatments":      d.treatments      or [],
        "medications":     d.medications     or [],
        "home_remedies":   d.home_remedies   or [],
        "prevention":      d.prevention      or [],
        "precautions":     d.precautions     or [],
        "specialist":      d.specialist,
        "specialist_type": d.specialist_type,
        "organ":           d.organ_system.name if d.organ_system else None,
        "is_dental":       d.is_dental,
    }


@router.get("")
async def list_diseases(
    page:     int = Query(1, ge=1),
    per_page: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    organ:    Optional[str] = None,
    db: Session = Depends(get_db),
):
    q = db.query(Disease)
    if category:
        q = q.filter(Disease.category.ilike(f"%{category}%"))
    if organ:
        q = q.join(OrganSystem).filter(OrganSystem.slug == organ)

    total  = q.count()
    items  = q.offset((page - 1) * per_page).limit(per_page).all()
    return {
        "total": total,
        "page":  page,
        "per_page": per_page,
        "diseases": [disease_summary(d) for d in items],
    }


@router.get("/search")
async def search_diseases(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
):
    results = (
        db.query(Disease)
        .filter(
            or_(
                Disease.name.ilike(f"%{q}%"),
                Disease.overview.ilike(f"%{q}%"),
                Disease.icd_code.ilike(f"%{q}%"),
            )
        )
        .limit(20)
        .all()
    )
    return {"results": [disease_summary(d) for d in results], "query": q}


@router.get("/organs")
async def list_organs(db: Session = Depends(get_db)):
    organs = db.query(OrganSystem).order_by(OrganSystem.name).all()
    return {
        "organs": [
            {
                "id":          o.id,
                "name":        o.name,
                "slug":        o.slug,
                "icon":        o.icon,
                "specialist":  o.specialist,
                "description": o.description,
                "count":       len(o.diseases),
            }
            for o in organs
        ]
    }


@router.get("/organ/{slug}")
async def diseases_by_organ(slug: str, db: Session = Depends(get_db)):
    organ = db.query(OrganSystem).filter(OrganSystem.slug == slug).first()
    if not organ:
        raise HTTPException(status_code=404, detail="Organ system not found.")
    return {
        "organ":    {"id": organ.id, "name": organ.name, "slug": organ.slug},
        "diseases": [disease_summary(d) for d in organ.diseases],
    }


@router.get("/{disease_id}")
async def get_disease(disease_id: int, db: Session = Depends(get_db)):
    disease = db.query(Disease).filter(Disease.id == disease_id).first()
    if not disease:
        raise HTTPException(status_code=404, detail="Disease not found.")
    return disease_detail(disease)
