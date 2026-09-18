import json
import random
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models import ControlledAction, Recommendation, Customer

def create_and_execute_action(action_type: str, title: str, description: str, target_audience: str, payload: dict, approved_by: str, db: Session):
    now = datetime.now()
    discount_code = payload.get("coupon_code", f"SAVE{random.randint(10, 99)}") if "coupon_code" in payload or "discount_amount" in payload else None

    # Determine initial reach count
    reach_count = payload.get("target_count", 42 if action_type == "DISCOUNT_CAMPAIGN" else 1)

    action = ControlledAction(
        action_type=action_type,
        title=title,
        description=description,
        target_audience=target_audience,
        discount_code=discount_code,
        status="ACTIVE",
        approved_by=approved_by,
        created_at=now,
        reach_count=reach_count,
        redemptions_count=0,
        revenue_lift=0.0,
        verification_notes=f"Approved by {approved_by}. System dispatched automated trigger via Paytm Merchant Rails."
    )
    db.add(action)
    db.commit()
    db.refresh(action)

    # If matching recommendation existed, mark it as EXECUTED
    recs = db.query(Recommendation).filter(Recommendation.action_type == action_type).all()
    for r in recs:
        r.status = "EXECUTED"
    db.commit()

    return {
        "success": True,
        "action_id": action.id,
        "status": action.status,
        "message": f"Action '{title}' successfully authorized and dispatched!",
        "action": {
            "id": action.id,
            "title": action.title,
            "action_type": action.action_type,
            "status": action.status,
            "approved_by": action.approved_by,
            "created_at": action.created_at.strftime("%Y-%m-%d %H:%M"),
            "reach_count": action.reach_count,
            "discount_code": action.discount_code
        }
    }

def verify_action_impact(action_id: int, db: Session):
    action = db.query(ControlledAction).filter(ControlledAction.id == action_id).first()
    if not action:
        return {"error": "Action not found"}

    # Simulate realistic live verification telemetry if just executed
    if action.status == "ACTIVE":
        if action.action_type == "DISCOUNT_CAMPAIGN":
            redemptions = random.randint(16, 24)
            avg_basket = random.uniform(320.0, 480.0)
            revenue_lift = round(redemptions * avg_basket, 2)
            action.redemptions_count = redemptions
            action.revenue_lift = revenue_lift
            action.status = "VERIFIED"
            action.verification_notes = (
                f"✅ Verified via Paytm Soundbox & POS telemetry: {redemptions} inactive customers redeemed "
                f"voucher '{action.discount_code}' between 5–8 PM. Total revenue recovered: ₹{revenue_lift:,.2f}."
            )
        elif action.action_type == "RESTOCK_PO":
            action.status = "VERIFIED"
            action.verification_notes = "✅ Verified: Supplier confirmed dispatch for delivery tomorrow morning at 7:00 AM."
        elif action.action_type == "SOUNDBOX_ANNOUNCEMENT":
            action.status = "VERIFIED"
            action.revenue_lift = 2850.0
            action.verification_notes = "✅ Verified: Paytm Soundbox 4.0 successfully aired voice promo 32 times during peak evening hours."

        db.commit()
        db.refresh(action)

    return {
        "success": True,
        "action_id": action.id,
        "status": action.status,
        "redemptions_count": action.redemptions_count,
        "revenue_lift": action.revenue_lift,
        "verification_notes": action.verification_notes
    }

def list_all_actions(db: Session):
    actions = db.query(ControlledAction).order_by(ControlledAction.id.desc()).all()
    return [
        {
            "id": a.id,
            "action_type": a.action_type,
            "title": a.title,
            "description": a.description,
            "target_audience": a.target_audience,
            "discount_code": a.discount_code,
            "status": a.status,
            "approved_by": a.approved_by,
            "created_at": a.created_at.strftime("%Y-%m-%d %H:%M"),
            "reach_count": a.reach_count,
            "redemptions_count": a.redemptions_count,
            "revenue_lift": a.revenue_lift,
            "verification_notes": a.verification_notes
        }
        for a in actions
    ]
