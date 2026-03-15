"""
HomeCare+ — Health Records Routes
POST /records/upload      — upload a medical record
GET  /records             — list user's records
GET  /records/{id}        — get a specific record
DELETE /records/{id}      — delete a record
POST /records/{id}/analyze — trigger AI analysis of a record
"""
import os
import uuid
import shutil
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.settings import settings
from app.models.models import User, HealthRecord
from app.middleware.auth import get_current_user

router = APIRouter()

ALLOWED_TYPES = {
    "application/pdf", "image/jpeg", "image/png",
    "image/webp", "image/bmp",
}
MAX_SIZE = settings.MAX_FILE_SIZE_MB * 1024 * 1024   # bytes


def record_to_dict(r: HealthRecord) -> dict:
    return {
        "id":           r.id,
        "name":         r.name,
        "record_type":  r.record_type,
        "file_path":    r.file_path,
        "file_size":    r.file_size,
        "mime_type":    r.mime_type,
        "tags":         r.tags or [],
        "is_analyzed":  r.is_analyzed,
        "ai_analysis":  r.ai_analysis,
        "uploaded_at":  str(r.uploaded_at),
    }


@router.post("/upload", status_code=status.HTTP_201_CREATED)
async def upload_record(
    file:        UploadFile = File(...),
    name:        str        = Form(...),
    record_type: str        = Form("document"),
    tags:        str        = Form(""),          # comma-separated
    db: Session             = Depends(get_db),
    current_user: User      = Depends(get_current_user),
):
    # Validate mime type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{file.content_type}' not allowed. Use PDF or image files."
        )

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_SIZE:
        raise HTTPException(
            status_code=413,
            detail=f"File too large. Maximum size is {settings.MAX_FILE_SIZE_MB} MB."
        )

    # Save file
    ext       = Path(file.filename).suffix.lower() if file.filename else ".bin"
    filename  = f"{uuid.uuid4().hex}{ext}"
    user_dir  = Path(settings.UPLOAD_DIR) / str(current_user.id)
    user_dir.mkdir(parents=True, exist_ok=True)
    dest      = user_dir / filename
    dest.write_bytes(contents)

    tag_list = [t.strip() for t in tags.split(",") if t.strip()]

    record = HealthRecord(
        user_id     = current_user.id,
        name        = name,
        record_type = record_type,
        file_path   = str(dest),
        file_size   = len(contents),
        mime_type   = file.content_type,
        tags        = tag_list,
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record_to_dict(record)


@router.get("")
async def list_records(
    db: Session  = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    records = (
        db.query(HealthRecord)
        .filter(HealthRecord.user_id == current_user.id)
        .order_by(HealthRecord.uploaded_at.desc())
        .all()
    )
    return {"records": [record_to_dict(r) for r in records]}


@router.get("/{record_id}")
async def get_record(
    record_id: int,
    db: Session  = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(HealthRecord).filter(
        HealthRecord.id == record_id,
        HealthRecord.user_id == current_user.id,
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")
    return record_to_dict(record)


@router.delete("/{record_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_record(
    record_id: int,
    db: Session  = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    record = db.query(HealthRecord).filter(
        HealthRecord.id == record_id,
        HealthRecord.user_id == current_user.id,
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")

    # Remove file from disk
    if record.file_path and Path(record.file_path).exists():
        Path(record.file_path).unlink(missing_ok=True)

    db.delete(record)
    db.commit()


@router.post("/{record_id}/analyze")
async def analyze_record(
    record_id: int,
    db: Session  = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Trigger AI analysis of an uploaded record (image/PDF)."""
    record = db.query(HealthRecord).filter(
        HealthRecord.id == record_id,
        HealthRecord.user_id == current_user.id,
    ).first()
    if not record:
        raise HTTPException(status_code=404, detail="Record not found.")

    # Placeholder — real implementation calls ImageAnalysisService
    from app.services.analysis_service import AnalysisService
    svc    = AnalysisService()
    result = await svc.analyze_file(record.file_path, record.mime_type)

    record.ai_analysis = result
    record.is_analyzed = True
    db.commit()
    db.refresh(record)
    return record_to_dict(record)
