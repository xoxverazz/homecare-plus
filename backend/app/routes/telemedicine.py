"""
HomeCare+ — Telemedicine Routes
GET  /telemedicine/doctors          — list doctors
POST /telemedicine/book             — book a consultation
GET  /telemedicine/consultations    — user's consultations
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

from app.config.database import get_db
from app.models.models import User
from app.middleware.auth import get_current_user

router = APIRouter()

# In-memory doctor registry (production would use DB)
DOCTORS = [
    {"id":1,"name":"Dr. Priya Sharma","specialization":"General Physician","hospital":"Apollo Hospitals",
     "experience":12,"rating":4.9,"fee":500,"languages":["English","Hindi","Marathi"],"status":"available"},
    {"id":2,"name":"Dr. Rahul Mehta","specialization":"Cardiologist","hospital":"Fortis Hospital",
     "experience":18,"rating":4.8,"fee":1200,"languages":["English","Hindi"],"status":"available"},
    {"id":3,"name":"Dr. Anjali Nair","specialization":"Dermatologist","hospital":"Manipal Hospital",
     "experience":9,"rating":4.7,"fee":800,"languages":["English","Malayalam"],"status":"available"},
    {"id":4,"name":"Dr. Vikram Rajan","specialization":"Neurologist","hospital":"NIMHANS",
     "experience":15,"rating":4.9,"fee":1500,"languages":["English","Kannada"],"status":"busy"},
    {"id":5,"name":"Dr. Fatima Khan","specialization":"Gynecologist","hospital":"Lilavati Hospital",
     "experience":14,"rating":4.8,"fee":900,"languages":["English","Hindi","Urdu"],"status":"available"},
    {"id":6,"name":"Dr. Suresh Patil","specialization":"Orthopedic Surgeon","hospital":"Kokilaben Hospital",
     "experience":20,"rating":4.7,"fee":1100,"languages":["English","Marathi"],"status":"available"},
    {"id":7,"name":"Dr. Meera Krishnan","specialization":"Pediatrician","hospital":"Rainbow Children's Hospital",
     "experience":11,"rating":4.9,"fee":700,"languages":["English","Tamil"],"status":"available"},
    {"id":8,"name":"Dr. Arun Gupta","specialization":"Psychiatrist","hospital":"NIMHANS",
     "experience":13,"rating":4.8,"fee":1000,"languages":["English","Hindi"],"status":"offline"},
]


class BookingRequest(BaseModel):
    doctor_id:   int
    slot:        str
    consult_type: str = "video"
    reason:      Optional[str] = ""


@router.get("/doctors")
async def list_doctors(specialization: Optional[str] = None):
    docs = DOCTORS
    if specialization and specialization.lower() != "all":
        docs = [d for d in docs if d["specialization"].lower() == specialization.lower()]
    return {"doctors": docs}


@router.post("/book")
async def book_consultation(
    body: BookingRequest,
    current_user: User = Depends(get_current_user),
):
    doctor = next((d for d in DOCTORS if d["id"] == body.doctor_id), None)
    if not doctor:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Doctor not found.")
    if doctor["status"] == "offline":
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Doctor is currently offline.")

    return {
        "booking_id":    f"BK{datetime.now().strftime('%Y%m%d%H%M%S')}",
        "doctor":        doctor["name"],
        "specialization":doctor["specialization"],
        "slot":          body.slot,
        "type":          body.consult_type,
        "fee":           doctor["fee"],
        "status":        "confirmed",
        "message":       f"Consultation booked with {doctor['name']} at {body.slot}.",
    }
