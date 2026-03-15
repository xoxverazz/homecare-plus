"""
HomeCare+ — AI Medical Chat Routes (Groq Powered)

POST /chat/message  — send a message, get AI response
GET  /chat/history  — get recent chat history
DELETE /chat/history — clear chat history
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional

from groq import Groq

from app.config.database import get_db
from app.config.settings import settings
from app.models.models import User, ChatSession, ChatMessage
from app.middleware.auth import get_current_user


router = APIRouter()


SYSTEM_PROMPT = """You are HomeCare+, an expert AI Medical Assistant.

Your role is to provide accurate, helpful health information in a warm and professional manner.

Guidelines:
- Provide clear, evidence-based health information
- Explain medical terms in simple language
- Always recommend consulting a healthcare professional
- Support multilingual input (English, Hindi, Hinglish, Marathi, Kannada, Malayalam, Urdu)
- Never diagnose or prescribe — only educate and guide
- For emergencies direct users to call 108 (India)
- Maintain empathy and compassion
- Keep responses concise (3–5 paragraphs)

End every response with this disclaimer:

⚠️ This is health information for educational purposes only. Please consult a qualified doctor for personal medical advice.
"""


class MessageItem(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    messages: List[MessageItem]
    language: Optional[str] = "en"


def call_groq(messages: List[dict], system: str) -> str:
    """Call Groq LLM."""

    try:

        client = Groq(api_key=settings.OPENAI_API_KEY)

        all_messages = [{"role": "system", "content": system}] + messages

        response = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=all_messages,
            temperature=0.3,
            max_tokens=1024
        )

        return response.choices[0].message.content

    except Exception as e:
        raise RuntimeError(f"Groq API error: {e}")


def rule_based_response(user_message: str) -> str:
    """Offline fallback when no AI API key is configured."""

    msg = user_message.lower()

    if any(w in msg for w in ["headache", "sir dard"]):
        return (
            "Headaches can result from tension, dehydration, lack of sleep, eye strain, or infections.\n\n"
            "Self-care tips:\n• Drink water\n• Rest in a quiet room\n• Apply a cold compress\n"
            "• Paracetamol may help for mild headaches\n\n"
            "See a doctor if the headache is sudden and severe or accompanied by fever, stiff neck, or vision changes.\n\n"
            "⚠️ This is health information for educational purposes only. Please consult a qualified doctor."
        )

    if any(w in msg for w in ["diabetes", "sugar", "madhumeh"]):
        return (
            "Diabetes is a condition affecting blood sugar regulation.\n\n"
            "Common symptoms: frequent urination, excessive thirst, fatigue, blurred vision.\n\n"
            "Management includes healthy diet, exercise, blood sugar monitoring and medication.\n\n"
            "⚠️ This is health information for educational purposes only. Please consult a qualified doctor."
        )

    if any(w in msg for w in ["fever", "bukhar"]):
        return (
            "Fever usually indicates the body is fighting an infection.\n\n"
            "• Drink fluids\n• Rest\n• Take paracetamol if needed\n\n"
            "Seek medical help if fever exceeds 40°C or persists longer than 3 days.\n\n"
            "⚠️ This is health information for educational purposes only. Please consult a qualified doctor."
        )

    return (
        f"Thank you for your question about '{user_message}'.\n\n"
        "For the best guidance you can:\n"
        "• Use the Symptom Checker\n"
        "• Explore the Disease Library\n"
        "• Consult a healthcare professional\n\n"
        "⚠️ This is health information for educational purposes only. Please consult a qualified doctor."
    )


@router.post("/message")
async def send_message(
    body: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    if not body.messages:
        raise HTTPException(status_code=400, detail="Messages cannot be empty.")

    ai_messages = [{"role": m.role, "content": m.content} for m in body.messages]
    user_text = body.messages[-1].content

    session = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .first()
    )

    if not session:
        session = ChatSession(user_id=current_user.id, language=body.language or "en")
        db.add(session)
        db.commit()
        db.refresh(session)

    ai_response = ""

    if settings.OPENAI_API_KEY:
        try:
            ai_response = call_groq(ai_messages, SYSTEM_PROMPT)
        except Exception:
            pass

    if not ai_response:
        ai_response = rule_based_response(user_text)

    user_msg = ChatMessage(
        session_id=session.id,
        role="user",
        content=user_text
    )

    ai_msg = ChatMessage(
        session_id=session.id,
        role="assistant",
        content=ai_response
    )

    db.add_all([user_msg, ai_msg])
    db.commit()

    return {
        "response": ai_response,
        "session_id": session.id
    }


@router.get("/history")
async def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    sessions = (
        db.query(ChatSession)
        .filter(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.updated_at.desc())
        .limit(10)
        .all()
    )

    result = []

    for s in sessions:

        msgs = (
            db.query(ChatMessage)
            .filter(ChatMessage.session_id == s.id)
            .order_by(ChatMessage.created_at)
            .all()
        )

        result.append({
            "session_id": s.id,
            "created_at": str(s.created_at),
            "messages": [
                {
                    "role": m.role,
                    "content": m.content,
                    "timestamp": str(m.created_at)
                }
                for m in msgs
            ],
        })

    return {"sessions": result}


@router.delete("/history")
async def clear_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):

    sessions = db.query(ChatSession).filter(
        ChatSession.user_id == current_user.id
    ).all()

    for s in sessions:
        db.query(ChatMessage).filter(ChatMessage.session_id == s.id).delete()
        db.delete(s)

    db.commit()

    return {"message": "Chat history cleared successfully."}