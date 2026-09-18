import json
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session

from backend.database import get_db, Base, engine
from backend.models import Merchant, Recommendation, ControlledAction
from backend.services.analytics_service import get_overview_analytics
from backend.services.ml_prediction import get_demand_forecasts, get_customer_churn_analysis
from backend.services.copilot_service import process_copilot_message, get_recent_chat_history
from backend.services.action_service import (
    create_and_execute_action, verify_action_impact, list_all_actions
)

app = FastAPI(
    title="Paytm Saathi AI Backend",
    description="AI Business Partner for Every Merchant — Track 1: Merchant Growth AI",
    version="1.0.0"
)

# Enable CORS for frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic Schemas
class ChatMessageRequest(BaseModel):
    message: str
    language: Optional[str] = "hinglish"

class ActionExecuteRequest(BaseModel):
    action_type: str
    title: str
    description: str
    target_audience: Optional[str] = "Inactive Customers"
    payload: Optional[Dict[str, Any]] = {}
    approved_by: Optional[str] = "Merchant"

class SoundboxTriggerRequest(BaseModel):
    sound_type: str # "PAYMENT_RECEIVED", "PROMO_ANNOUNCEMENT", "STOCK_ALERT"
    amount: Optional[float] = 20.0
    text: Optional[str] = "Paytm par bees rupaye prapt hue"

@app.get("/")
def root():
    return {
        "status": "online",
        "service": "Paytm Saathi AI",
        "track": "Track 1 — Merchant Growth AI",
        "tagline": "From Transactions → Insights → Decisions → Actions"
    }

@app.get("/api/merchant/profile")
def get_merchant_profile(db: Session = Depends(get_db)):
    merchant = db.query(Merchant).first()
    if not merchant:
        raise HTTPException(status_code=404, detail="Merchant profile not found")
    return {
        "id": merchant.id,
        "business_name": merchant.business_name,
        "owner_name": merchant.owner_name,
        "upi_vpa": merchant.upi_vpa,
        "phone": merchant.phone,
        "category": merchant.category,
        "city": merchant.city,
        "soundbox_device_id": merchant.soundbox_device_id,
        "soundbox_status": merchant.soundbox_status,
        "language_preference": merchant.language_preference
    }

@app.get("/api/analytics/overview")
def get_analytics(db: Session = Depends(get_db)):
    return get_overview_analytics(db)

@app.get("/api/predictions/demand")
def get_predictions(db: Session = Depends(get_db)):
    return get_demand_forecasts(db)

@app.get("/api/predictions/customers")
def get_customer_intelligence(db: Session = Depends(get_db)):
    return get_customer_churn_analysis(db)

@app.get("/api/recommendations")
def get_recommendations(db: Session = Depends(get_db)):
    recs = db.query(Recommendation).order_by(Recommendation.id.desc()).all()
    results = []
    for r in recs:
        payload = {}
        try:
            payload = json.loads(r.action_payload_json) if r.action_payload_json else {}
        except Exception:
            pass
        results.append({
            "id": r.id,
            "category": r.category,
            "title": r.title,
            "trigger_reason": r.trigger_reason,
            "suggested_action": r.suggested_action,
            "action_type": r.action_type,
            "potential_gain": r.potential_gain,
            "status": r.status,
            "action_payload": payload,
            "created_at": r.created_at.strftime("%Y-%m-%d %H:%M")
        })
    return results

@app.post("/api/copilot/chat")
def copilot_chat(req: ChatMessageRequest, db: Session = Depends(get_db)):
    return process_copilot_message(req.message, db, req.language)

@app.get("/api/copilot/history")
def copilot_history(db: Session = Depends(get_db)):
    return get_recent_chat_history(db)

@app.get("/api/actions")
def get_actions(db: Session = Depends(get_db)):
    return list_all_actions(db)

@app.post("/api/actions/execute")
def execute_action(req: ActionExecuteRequest, db: Session = Depends(get_db)):
    return create_and_execute_action(
        action_type=req.action_type,
        title=req.title,
        description=req.description,
        target_audience=req.target_audience,
        payload=req.payload,
        approved_by=req.approved_by,
        db=db
    )

@app.post("/api/actions/verify/{action_id}")
def verify_action(action_id: int, db: Session = Depends(get_db)):
    result = verify_action_impact(action_id, db)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result

@app.post("/api/soundbox/trigger-sound")
def trigger_soundbox(req: SoundboxTriggerRequest):
    # Returns announcement details for client-side Web Audio / speech synth or Soundbox chime
    return {
        "device_id": "SB4-DEL-98214",
        "battery_pct": 92,
        "signal_strength": "4G Excellent",
        "sound_type": req.sound_type,
        "spoken_text": req.text,
        "amount": req.amount,
        "timestamp": "Just now"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
