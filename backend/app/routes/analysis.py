"""
HomeCare+ — AI Image & Report Analysis Routes
POST /analysis/image   — analyze uploaded medical image / scan
POST /analysis/report  — summarize medical report
"""
import os
import uuid
from pathlib import Path
from typing import Optional

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.config.database import get_db
from app.config.settings import settings
from app.models.models import User
from app.middleware.auth import get_current_user
from app.services.analysis_service import AnalysisService

router  = APIRouter()
service = AnalysisService()

ALLOWED = {"application/pdf", "image/jpeg", "image/png", "image/webp", "image/bmp"}


@router.post("/image")
async def analyze_image(
    file:          UploadFile = File(...),
    type:          str        = Form("xray"),
    current_user:  User       = Depends(get_current_user),
):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large.")

    # Save temp file
    tmp_path = Path(settings.UPLOAD_DIR) / f"tmp_{uuid.uuid4().hex}"
    tmp_path.write_bytes(contents)

    try:
        result = await service.analyze_file(str(tmp_path), file.content_type, analysis_type=type)
    finally:
        tmp_path.unlink(missing_ok=True)

    return result


@router.post("/report")
async def summarize_report(
    file:         UploadFile = File(...),
    current_user: User       = Depends(get_current_user),
):
    if file.content_type not in ALLOWED:
        raise HTTPException(status_code=400, detail="Unsupported file type.")

    contents = await file.read()
    if len(contents) > settings.MAX_FILE_SIZE_MB * 1024 * 1024:
        raise HTTPException(status_code=413, detail="File too large.")

    tmp_path = Path(settings.UPLOAD_DIR) / f"tmp_{uuid.uuid4().hex}"
    tmp_path.write_bytes(contents)

    try:
        result = await service.summarize_report(str(tmp_path), file.content_type)
    finally:
        tmp_path.unlink(missing_ok=True)

    return result
