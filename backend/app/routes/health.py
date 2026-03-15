"""
HomeCare+ — Health Metrics Routes
"""
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel
from typing import Optional, Dict
from datetime import datetime, timedelta, timezone
import logging

from app.config.database import get_db
from app.models.models import User, HealthMetric
from app.middleware.auth import get_current_user

logger = logging.getLogger(__name__)
router = APIRouter()

METRIC_UNITS = {
    "heart_rate":   "bpm",
    "systolic_bp":  "mmHg",
    "diastolic_bp": "mmHg",
    "oxygen_level": "%",
    "blood_sugar":  "mg/dL",
    "bmi":          "",
    "weight":       "kg",
    "steps":        "",
    "temperature":  "°C",
}

NORMAL_RANGES = {
    "heart_rate":   (60,   100),
    "systolic_bp":  (90,   120),
    "diastolic_bp": (60,    80),
    "oxygen_level": (95,   100),
    "blood_sugar":  (70,   100),
    "bmi":          (18.5, 24.9),
    "temperature":  (36.1, 37.2),
}


def get_status(metric_type: str, value: float) -> str:
    if metric_type not in NORMAL_RANGES:
        return "unknown"
    lo, hi = NORMAL_RANGES[metric_type]
    if value < lo:
        return "low"
    if value > hi:
        return "high"
    return "normal"


class MetricLogRequest(BaseModel):
    heart_rate:   Optional[float] = None
    systolic_bp:  Optional[float] = None
    diastolic_bp: Optional[float] = None
    oxygen_level: Optional[float] = None
    blood_sugar:  Optional[float] = None
    bmi:          Optional[float] = None
    weight:       Optional[float] = None
    steps:        Optional[float] = None
    temperature:  Optional[float] = None
    notes:        Optional[str]   = None


@router.post("/metrics")
async def log_metrics(
    body: MetricLogRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    saved = []
    payload = body.model_dump(exclude={"notes"}, exclude_none=True)

    if not payload:
        raise HTTPException(status_code=400, detail="At least one metric value is required.")

    try:
        for metric_type, value in payload.items():
            if metric_type not in METRIC_UNITS:
                continue
            m = HealthMetric(
                user_id     = current_user.id,
                metric_type = metric_type,
                value       = float(value),
                unit        = METRIC_UNITS.get(metric_type, ""),
                notes       = body.notes,
            )
            db.add(m)
            saved.append({
                "type":   metric_type,
                "value":  value,
                "unit":   METRIC_UNITS.get(metric_type, ""),
                "status": get_status(metric_type, value),
            })
        db.commit()
        logger.info(f"Saved {len(saved)} metrics for user {current_user.id}")
    except Exception as e:
        db.rollback()
        logger.error(f"Error saving metrics: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to save metrics: {str(e)}")

    return {"saved": saved, "count": len(saved), "message": "Vitals saved successfully"}


@router.get("/metrics")
async def get_latest_metrics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    results = {}
    for mt in METRIC_UNITS.keys():
        try:
            latest = (
                db.query(HealthMetric)
                .filter(HealthMetric.user_id == current_user.id, HealthMetric.metric_type == mt)
                .order_by(desc(HealthMetric.recorded_at))
                .first()
            )
            if latest:
                results[mt] = {
                    "value":       latest.value,
                    "unit":        latest.unit,
                    "status":      get_status(mt, latest.value),
                    "recorded_at": str(latest.recorded_at),
                }
        except Exception as e:
            logger.error(f"Error fetching metric {mt}: {e}")
    return {"metrics": results}


@router.get("/metrics/{metric_type}")
async def get_metric_history(
    metric_type: str,
    days: int = Query(7, ge=1, le=90),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if metric_type not in METRIC_UNITS:
        raise HTTPException(status_code=400, detail=f"Unknown metric type: {metric_type}")
    since = datetime.now(timezone.utc) - timedelta(days=days)
    try:
        readings = (
            db.query(HealthMetric)
            .filter(
                HealthMetric.user_id     == current_user.id,
                HealthMetric.metric_type == metric_type,
                HealthMetric.recorded_at >= since,
            )
            .order_by(HealthMetric.recorded_at)
            .all()
        )
    except Exception as e:
        logger.error(f"Error fetching history: {e}")
        readings = []
    return {
        "metric_type": metric_type,
        "unit":        METRIC_UNITS.get(metric_type, ""),
        "days":        days,
        "readings": [
            {
                "value":       r.value,
                "status":      get_status(metric_type, r.value),
                "recorded_at": str(r.recorded_at),
                "notes":       r.notes,
            }
            for r in readings
        ],
    }


@router.get("/dashboard")
async def get_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    since_week = datetime.now(timezone.utc) - timedelta(days=7)
    latest: Dict[str, dict] = {}
    for mt in METRIC_UNITS.keys():
        try:
            row = (
                db.query(HealthMetric)
                .filter(HealthMetric.user_id == current_user.id, HealthMetric.metric_type == mt)
                .order_by(desc(HealthMetric.recorded_at))
                .first()
            )
            if row:
                latest[mt] = {
                    "value":  row.value,
                    "unit":   row.unit,
                    "status": get_status(mt, row.value),
                }
        except Exception as e:
            logger.error(f"Dashboard metric error {mt}: {e}")

    try:
        hr_trend = (
            db.query(HealthMetric.value, HealthMetric.recorded_at)
            .filter(
                HealthMetric.user_id == current_user.id,
                HealthMetric.metric_type == "heart_rate",
                HealthMetric.recorded_at >= since_week,
            )
            .order_by(HealthMetric.recorded_at)
            .all()
        )
    except Exception:
        hr_trend = []

    def compute_score(metrics):
        if not metrics:
            return 0
        normal = sum(1 for m in metrics.values() if m.get("status") == "normal")
        return round((normal / len(metrics)) * 100)

    return {
        "latest_vitals":    latest,
        "heart_rate_trend": [{"value": r.value, "date": str(r.recorded_at)} for r in hr_trend],
        "health_score":     compute_score(latest),
    }
