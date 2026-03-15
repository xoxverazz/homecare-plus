"""
HomeCare+ — Authentication Routes
POST /auth/register
POST /auth/login
GET  /auth/profile
PUT  /auth/profile
PUT  /auth/password
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date

from app.config.database import get_db
from app.models.models import User
from app.middleware.auth import (
    hash_password, verify_password, create_access_token, get_current_user
)

router = APIRouter()


# ── Schemas ────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    firstName:   str
    lastName:    str
    email:       EmailStr
    phone:       Optional[str] = None
    dateOfBirth: Optional[date] = None
    gender:      Optional[str] = None
    password:    str

    @field_validator("password")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


class LoginRequest(BaseModel):
    email:    EmailStr
    password: str


class ProfileUpdate(BaseModel):
    firstName:   Optional[str] = None
    lastName:    Optional[str] = None
    phone:       Optional[str] = None
    dateOfBirth: Optional[date] = None
    gender:      Optional[str] = None
    language:    Optional[str] = None


class PasswordChange(BaseModel):
    currentPassword: str
    newPassword:     str

    @field_validator("newPassword")
    @classmethod
    def password_strength(cls, v):
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        return v


def user_to_dict(user: User) -> dict:
    return {
        "id":          user.id,
        "firstName":   user.first_name,
        "lastName":    user.last_name,
        "email":       user.email,
        "phone":       user.phone,
        "dateOfBirth": str(user.date_of_birth) if user.date_of_birth else None,
        "gender":      user.gender,
        "language":    user.language,
        "createdAt":   str(user.created_at) if user.created_at else None,
    }


# ── Endpoints ──────────────────────────────────────────────────────────────────

@router.post("/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == body.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists."
        )
    user = User(
        first_name    = body.firstName,
        last_name     = body.lastName,
        email         = body.email,
        phone         = body.phone,
        date_of_birth = body.dateOfBirth,
        gender        = body.gender,
        password_hash = hash_password(body.password),
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return {"user": user_to_dict(user), "token": token}


@router.post("/login")
async def login(body: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == body.email, User.is_active == True).first()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )
    token = create_access_token({"sub": user.id})
    return {"user": user_to_dict(user), "token": token}


@router.get("/profile")
async def get_profile(current_user: User = Depends(get_current_user)):
    return {"user": user_to_dict(current_user)}


@router.put("/profile")
async def update_profile(
    body: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if body.firstName   is not None: current_user.first_name    = body.firstName
    if body.lastName    is not None: current_user.last_name     = body.lastName
    if body.phone       is not None: current_user.phone         = body.phone
    if body.dateOfBirth is not None: current_user.date_of_birth = body.dateOfBirth
    if body.gender      is not None: current_user.gender        = body.gender
    if body.language    is not None: current_user.language      = body.language
    db.commit()
    db.refresh(current_user)
    return {"user": user_to_dict(current_user)}


@router.put("/password")
async def change_password(
    body: PasswordChange,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(body.currentPassword, current_user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Current password is incorrect."
        )
    current_user.password_hash = hash_password(body.newPassword)
    db.commit()
    return {"message": "Password updated successfully."}
