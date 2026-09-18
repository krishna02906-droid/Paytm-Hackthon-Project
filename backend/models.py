from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, Boolean
from sqlalchemy.orm import relationship
from backend.database import Base

class Merchant(Base):
    __tablename__ = "merchants"

    id = Column(Integer, primary_key=True, index=True)
    business_name = Column(String(120), default="Sharma Kirana & General Store")
    owner_name = Column(String(80), default="Ramesh Sharma")
    upi_vpa = Column(String(80), default="sharmakirana@paytm")
    phone = Column(String(20), default="+91 98765 43210")
    category = Column(String(80), default="Grocery & Daily Essentials")
    city = Column(String(80), default="Chandni Chowk, Delhi")
    soundbox_device_id = Column(String(50), default="SB4-DEL-98214")
    soundbox_status = Column(String(30), default="ONLINE_4G")
    language_preference = Column(String(20), default="hinglish")

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(50), unique=True, index=True)
    name = Column(String(120), index=True)
    category = Column(String(60))
    stock_quantity = Column(Integer, default=0)
    reorder_point = Column(Integer, default=10)
    cost_price = Column(Float, default=0.0)
    selling_price = Column(Float, default=0.0)
    avg_daily_demand = Column(Float, default=5.0)
    unit = Column(String(20), default="pkt")

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(80))
    phone = Column(String(20), index=True)
    segment = Column(String(40), default="Active") # Active, Inactive 14+ Days, High-Value VIP
    first_visit = Column(DateTime, default=datetime.utcnow)
    last_visit = Column(DateTime, default=datetime.utcnow)
    days_inactive = Column(Integer, default=0)
    total_visits = Column(Integer, default=1)
    total_spend = Column(Float, default=0.0)
    churn_risk = Column(Float, default=0.1)
    preferred_hour = Column(Integer, default=18)

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(String(60), unique=True, index=True)
    customer_id = Column(Integer, ForeignKey("customers.id"), nullable=True)
    customer_name = Column(String(80), default="Walk-in Customer")
    amount = Column(Float, nullable=False)
    payment_method = Column(String(50), default="Paytm Soundbox QR") # Paytm Soundbox QR, Paytm Card POS, Paytm UPI
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    items_json = Column(Text, default="[]")
    status = Column(String(20), default="SUCCESS")

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50)) # SALES_ANOMALY, INACTIVE_CUSTOMERS, INVENTORY_STOCKOUT, PEAK_HOUR_PROMO
    title = Column(String(150))
    trigger_reason = Column(Text)
    suggested_action = Column(Text)
    action_type = Column(String(50)) # DISCOUNT_CAMPAIGN, RESTOCK_PO, HAPPY_HOUR_OFFER
    action_payload_json = Column(Text, default="{}")
    potential_gain = Column(String(100))
    status = Column(String(20), default="PENDING") # PENDING, APPROVED, REJECTED, EXECUTED
    created_at = Column(DateTime, default=datetime.utcnow)

class ControlledAction(Base):
    __tablename__ = "controlled_actions"

    id = Column(Integer, primary_key=True, index=True)
    action_type = Column(String(50))
    title = Column(String(150))
    description = Column(Text)
    target_audience = Column(String(100))
    discount_code = Column(String(40), nullable=True)
    status = Column(String(20), default="ACTIVE") # ACTIVE, VERIFIED, COMPLETED
    approved_by = Column(String(50), default="Merchant")
    created_at = Column(DateTime, default=datetime.utcnow)
    reach_count = Column(Integer, default=0)
    redemptions_count = Column(Integer, default=0)
    revenue_lift = Column(Float, default=0.0)
    verification_notes = Column(Text, default="")

class CopilotChatLog(Base):
    __tablename__ = "copilot_chat_logs"

    id = Column(Integer, primary_key=True, index=True)
    role = Column(String(20)) # user, assistant
    message = Column(Text)
    language = Column(String(20), default="hinglish")
    action_card_json = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
