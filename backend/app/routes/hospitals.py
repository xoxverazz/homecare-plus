"""
HomeCare+ — Hospital Routes
GET /hospitals/nearby     — find nearby hospitals (lat, lng, radius)
GET /hospitals/search     — search by name / specialty
GET /hospitals/{id}       — hospital detail
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional
import math

from app.config.database import get_db
from app.models.models import Hospital

router = APIRouter()


def haversine(lat1, lon1, lat2, lon2) -> float:
    """Returns distance in km between two coordinates."""
    R = 6371
    d_lat = math.radians(lat2 - lat1)
    d_lon = math.radians(lon2 - lon1)
    a = (math.sin(d_lat / 2) ** 2
         + math.cos(math.radians(lat1))
         * math.cos(math.radians(lat2))
         * math.sin(d_lon / 2) ** 2)
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def hospital_dict(h: Hospital, distance_km: Optional[float] = None) -> dict:
    return {
        "id":          h.id,
        "name":        h.name,
        "type":        h.type,
        "address":     h.address,
        "city":        h.city,
        "phone":       h.phone,
        "website":     h.website,
        "latitude":    h.latitude,
        "longitude":   h.longitude,
        "specialties": h.specialties or [],
        "rating":      h.rating,
        "distance_km": round(distance_km, 2) if distance_km is not None else None,
    }


@router.get("/nearby")
async def get_nearby(
    lat:    float = Query(..., description="User latitude"),
    lng:    float = Query(..., description="User longitude"),
    radius: float = Query(10.0, description="Search radius in km"),
    type:   Optional[str] = None,
    db: Session = Depends(get_db),
):
    query = db.query(Hospital).filter(Hospital.is_active == True)
    if type:
        query = query.filter(Hospital.type == type)

    hospitals = query.all()
    nearby = []
    for h in hospitals:
        if h.latitude and h.longitude:
            dist = haversine(lat, lng, h.latitude, h.longitude)
            if dist <= radius:
                nearby.append((h, dist))

    nearby.sort(key=lambda x: x[1])
    return {"hospitals": [hospital_dict(h, d) for h, d in nearby], "radius_km": radius}


@router.get("/search")
async def search_hospitals(
    q: str = Query(..., min_length=2),
    db: Session = Depends(get_db),
):
    results = (
        db.query(Hospital)
        .filter(
            Hospital.is_active == True,
            Hospital.name.ilike(f"%{q}%"),
        )
        .limit(20)
        .all()
    )
    return {"results": [hospital_dict(h) for h in results]}


@router.get("/{hospital_id}")
async def get_hospital(hospital_id: int, db: Session = Depends(get_db)):
    h = db.query(Hospital).filter(Hospital.id == hospital_id, Hospital.is_active == True).first()
    if not h:
        raise HTTPException(status_code=404, detail="Hospital not found.")
    return hospital_dict(h)
