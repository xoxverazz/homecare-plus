"""
HomeCare+ — Insurance Policy Routes
GET    /insurance           — list user's policies
POST   /insurance           — add a policy
PUT    /insurance/{id}      — update a policy
DELETE /insurance/{id}      — delete a policy
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.config.database import get_db
from app.models.models import User, InsurancePolicy
from app.middleware.auth import get_current_user

router = APIRouter()


class PolicyCreate(BaseModel):
    provider:      str
    policyNumber:  str
    type:          Optional[str] = "Individual"
    coverage:      Optional[str] = None
    premium:       Optional[str] = None
    renewalDate:   Optional[date] = None
    notes:         Optional[str] = None


class PolicyUpdate(BaseModel):
    provider:     Optional[str]  = None
    policyNumber: Optional[str]  = None
    type:         Optional[str]  = None
    coverage:     Optional[str]  = None
    premium:      Optional[str]  = None
    renewalDate:  Optional[date] = None
    status:       Optional[str]  = None
    notes:        Optional[str]  = None


def policy_dict(p: InsurancePolicy) -> dict:
    return {
        "id":           p.id,
        "provider":     p.provider,
        "policyNumber": p.policy_number,
        "type":         p.policy_type,
        "coverage":     p.coverage,
        "premium":      p.premium,
        "renewalDate":  str(p.renewal_date) if p.renewal_date else None,
        "status":       p.status,
        "notes":        p.notes,
        "createdAt":    str(p.created_at),
    }


@router.get("")
async def list_policies(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    policies = (
        db.query(InsurancePolicy)
        .filter(InsurancePolicy.user_id == current_user.id)
        .order_by(InsurancePolicy.created_at.desc())
        .all()
    )
    return {"policies": [policy_dict(p) for p in policies]}


@router.post("", status_code=status.HTTP_201_CREATED)
async def add_policy(
    body: PolicyCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    policy = InsurancePolicy(
        user_id       = current_user.id,
        provider      = body.provider,
        policy_number = body.policyNumber,
        policy_type   = body.type,
        coverage      = body.coverage,
        premium       = body.premium,
        renewal_date  = body.renewalDate,
        notes         = body.notes,
    )
    db.add(policy)
    db.commit()
    db.refresh(policy)
    return policy_dict(policy)


@router.put("/{policy_id}")
async def update_policy(
    policy_id: int,
    body: PolicyUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    policy = db.query(InsurancePolicy).filter(
        InsurancePolicy.id == policy_id,
        InsurancePolicy.user_id == current_user.id,
    ).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found.")

    if body.provider     is not None: policy.provider      = body.provider
    if body.policyNumber is not None: policy.policy_number = body.policyNumber
    if body.type         is not None: policy.policy_type   = body.type
    if body.coverage     is not None: policy.coverage      = body.coverage
    if body.premium      is not None: policy.premium       = body.premium
    if body.renewalDate  is not None: policy.renewal_date  = body.renewalDate
    if body.status       is not None: policy.status        = body.status
    if body.notes        is not None: policy.notes         = body.notes

    db.commit()
    db.refresh(policy)
    return policy_dict(policy)


@router.delete("/{policy_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_policy(
    policy_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    policy = db.query(InsurancePolicy).filter(
        InsurancePolicy.id == policy_id,
        InsurancePolicy.user_id == current_user.id,
    ).first()
    if not policy:
        raise HTTPException(status_code=404, detail="Policy not found.")
    db.delete(policy)
    db.commit()
