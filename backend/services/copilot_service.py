import json
from datetime import datetime
from sqlalchemy.orm import Session
from backend.models import CopilotChatLog, Product, Customer, Transaction, Recommendation, ControlledAction
from backend.services.analytics_service import get_overview_analytics
from backend.services.action_service import create_and_execute_action

def process_copilot_message(user_message: str, db: Session, language: str = "hinglish"):
    msg = user_message.lower().strip()
    now = datetime.now()

    # Save user message to log
    db.add(CopilotChatLog(
        role="user",
        message=user_message,
        language=language,
        timestamp=now
    ))
    db.commit()

    analytics = get_overview_analytics(db)
    weekly = analytics["weekly_comparison"]
    drop_pct = abs(weekly["revenue_change_pct"])
    evening_drop = abs(weekly["evening_drop_pct"])
    today_rev = analytics["today"]["revenue"]
    today_orders = analytics["today"]["orders"]
    inactive_count = analytics["customer_summary"]["inactive_14_days"]

    response_text = ""
    action_card = None
    suggested_chips = []

    # Scenario 1: "Meri sales pichle week se kam kyun hai?" / "Why are sales down?"
    if any(phrase in msg for phrase in ["pichle week", "kam kyun", "sales down", "drop", "ghati", "kya hua"]):
        response_text = (
            f"Aapki sales pichle hafte ki tulna mein lagbhag {drop_pct:.0f}% kam rahi hai.\n\n"
            f"🔍 Saathi Deep Analysis:\n"
            f"1. Sabse bada decline shaam 5:00 PM se 8:00 PM ke beech hua hai ({evening_drop:.0f}% ki giraavat).\n"
            f"2. Pichle 14 dino mein {inactive_count} repeat customers ne visit nahi kiya hai.\n"
            f"3. Dopehar 12 se 4 baje ki sales normal hai, samasya shaam ke peak hours mein hai."
        )
        suggested_chips = ["Kya karna chahiye?", "Konsa stock khatam ho raha hai?", "Offer details dikhao"]

    # Scenario 2: "Kya karna chahiye?" / "What should I do?" / Recommendations
    elif any(phrase in msg for phrase in ["kya karna chahiye", "kya karun", "what to do", "solution", "upay", "recommend"]):
        response_text = (
            f"Maine aapke data ko analyse karke ek Next-Best Action taiyaar kiya hai:\n\n"
            f"💡 Recommendation: Inactive {inactive_count} repeat customers ke liye ₹20 ka 'Comeback Offer' chalaayein, "
            f"jo shaam 5 se 8 baje ke beech ₹150+ ke order par valid ho.\n\n"
            f"📊 Anumanit Labh (Projected Gain): Lagbhag ₹7,500 – ₹10,000 ki atirikt sales recover ho sakti hai."
        )
        action_card = {
            "type": "ACTION_PROPOSAL",
            "action_type": "DISCOUNT_CAMPAIGN",
            "title": "₹20 Comeback Offer (5–8 PM)",
            "description": f"Send ₹20 instant voucher to {inactive_count} inactive repeat customers via Paytm SMS/WhatsApp.",
            "discount_amount": 20,
            "min_order": 150,
            "target_count": inactive_count,
            "coupon_code": "COMEBACK20",
            "potential_gain": "+₹7,500 to ₹10,000 recovered weekly sales",
            "button_label": "Approve & Launch Offer"
        }
        suggested_chips = ["Offer bana do", "Stock status batao", "Nahi, baad mein karenge"]

    # Scenario 3: "Offer bana do" / "Approve" / Action execution
    elif any(phrase in msg for phrase in ["offer bana do", "approve", "bana do", "launch", "shuru karo", "activate"]):
        # Execute the controlled action
        exec_result = create_and_execute_action(
            action_type="DISCOUNT_CAMPAIGN",
            title="₹20 Comeback Offer (5–8 PM)",
            description=f"Automated ₹20 discount voucher sent to {inactive_count} inactive customers for orders above ₹150.",
            target_audience="Inactive 14+ Days Customers",
            payload={"coupon_code": "COMEBACK20", "discount_amount": 20, "target_count": inactive_count},
            approved_by="Merchant (Ramesh Sharma)",
            db=db
        )
        response_text = (
            f"✅ Shandar! Aapke anurodh par '₹20 Comeback Offer' safaltapoorvak activate kar diya gaya hai.\n\n"
            f"🚀 Dispatched: {inactive_count} inactive customers ko SMS & Paytm notification bhej diya gaya hai (Coupon: COMEBACK20).\n"
            f"🔊 Soundbox Sync: Shaam 5 se 8 baje ke liye Soundbox 4.0 par voice reminder schedule ho gaya hai.\n\n"
            f"Aap 'Action Center' tab mein iska real-time redemption aur revenue lift dekh sakte hain."
        )
        action_card = {
            "type": "ACTION_EXECUTED",
            "action_id": exec_result["action_id"],
            "title": "₹20 Comeback Offer Live",
            "status": "ACTIVE",
            "coupon_code": "COMEBACK20",
            "reach_count": inactive_count,
            "verification_ready": True
        }
        suggested_chips = ["Result verify karo", "Meri sales aaj kaisi rahi?", "Inventory status"]

    # Scenario 4: "Meri sales aaj kaisi rahi?" / "Today's sales"
    elif any(phrase in msg for phrase in ["aaj kaisi rahi", "today", "aaj ki sales", "today sales", "bikri"]):
        response_text = (
            f"Aaj ka hisaab (Sharma Kirana Store):\n\n"
            f"💰 Kul Sales: ₹{today_rev:,.2f}\n"
            f"🧾 Kul Orders: {today_orders} transactions\n"
            f"💳 Avg Basket Size: ₹{analytics['today']['avg_ticket']:.2f}\n\n"
            f"Top 3 Best Sellers: Amul Taaza Milk, Aashirvaad Atta, Tata Salt.\n"
            f"📢 Reminder: Shaam 5 baje se peak hour suru hone wala hai!"
        )
        suggested_chips = ["Meri sales pichle week se kam kyun hai?", "Stock kab khatam hoga?", "Kya karna chahiye?"]

    # Scenario 5: "Stock kab khatam hoga?" / "Inventory check"
    elif any(phrase in msg for phrase in ["stock", "khatam", "inventory", "maal", "amul milk", "atta"]):
        response_text = (
            f"⚠️ Urgent Inventory Alert:\n\n"
            f"1. Amul Taaza Milk 500ml: Kewal 12 packets bache hain! (Agley 12 ghante mein khatam ho sakta hai).\n"
            f"2. Aashirvaad Atta 5kg: Kewal 6 bags bache hain! (1.3 din ka stock bacha hai).\n\n"
            f"Kya aap chahte hain ki main Amul aur ITC distributor ke liye Supplier Purchase Order (PO) draft kar doon?"
        )
        action_card = {
            "type": "ACTION_PROPOSAL",
            "action_type": "RESTOCK_PO",
            "title": "Supplier Purchase Order (PO-AMUL-DEL-091)",
            "description": "Auto-order 50 pkts Amul Milk + 15 bags Aashirvaad Atta from Metro Wholesalers.",
            "estimated_cost": 4600,
            "potential_gain": "Bachat: ₹4,200 ke lost sales se suraksha",
            "button_label": "Approve & Send PO to Supplier"
        }
        suggested_chips = ["PO approve karo", "Meri sales aaj kaisi rahi?", "Kya karna chahiye?"]

    # Default fallback
    else:
        response_text = (
            f"Ji Ramesh ji, main aapki business sahayata ke liye taiyaar hoon. "
            f"Aap mujhse pooch sakte hain:\n"
            f"• 'Meri sales pichle week se kam kyun hai?'\n"
            f"• 'Kya karna chahiye?'\n"
            f"• 'Meri sales aaj kaisi rahi?'\n"
            f"• 'Stock kab khatam hoga?'"
        )
        suggested_chips = ["Meri sales pichle week se kam kyun hai?", "Kya karna chahiye?", "Meri sales aaj kaisi rahi?"]

    # Save assistant response to log
    assistant_log = CopilotChatLog(
        role="assistant",
        message=response_text,
        language=language,
        action_card_json=json.dumps(action_card) if action_card else None,
        timestamp=datetime.now()
    )
    db.add(assistant_log)
    db.commit()

    return {
        "reply": response_text,
        "action_card": action_card,
        "suggested_chips": suggested_chips,
        "timestamp": assistant_log.timestamp.strftime("%I:%M %p")
    }

def get_recent_chat_history(db: Session, limit: int = 20):
    logs = db.query(CopilotChatLog).order_by(CopilotChatLog.id.asc()).limit(limit).all()
    history = []
    for l in logs:
        action_card = None
        if l.action_card_json:
            try:
                action_card = json.loads(l.action_card_json)
            except Exception:
                pass
        history.append({
            "id": l.id,
            "role": l.role,
            "message": l.message,
            "action_card": action_card,
            "timestamp": l.timestamp.strftime("%I:%M %p")
        })
    return history
