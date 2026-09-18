import json
import random
from datetime import datetime, timedelta
from backend.database import SessionLocal, engine, Base
from backend.models import (
    Merchant, Product, Customer, Transaction, Recommendation, ControlledAction, CopilotChatLog
)

def seed_database():
    # Recreate tables
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        # 1. Merchant Profile
        merchant = Merchant(
            business_name="Sharma Kirana & Superstore",
            owner_name="Ramesh Sharma",
            upi_vpa="sharmakirana@paytm",
            phone="+91 98765 43210",
            category="Grocery & Daily Essentials",
            city="Chandni Chowk, Delhi",
            soundbox_device_id="SB4-DEL-98214",
            soundbox_status="ONLINE_4G",
            language_preference="hinglish"
        )
        db.add(merchant)
        db.commit()

        # 2. Products
        products_data = [
            ("SKU-MILK-500", "Amul Taaza Milk 500ml", "Dairy", 12, 35, 26.0, 29.0, 24.0, "pkt"),
            ("SKU-ATTA-5KG", "Aashirvaad Shudh Chakki Atta 5kg", "Flour & Grains", 6, 20, 220.0, 265.0, 7.5, "bag"),
            ("SKU-OIL-1L", "Fortune Sunlite Sunflower Oil 1L", "Edible Oils", 24, 15, 125.0, 148.0, 5.0, "bottle"),
            ("SKU-SALT-1KG", "Tata Salt Vacuum Evaporated 1kg", "Spices & Salt", 48, 20, 21.0, 28.0, 8.0, "pkt"),
            ("SKU-MAGGI-4PK", "Maggi 2-Minute Masala Noodles 280g", "Snacks", 32, 18, 50.0, 60.0, 11.0, "pack"),
            ("SKU-PARLE-1KG", "Parle-G Gold Biscuits 1kg Family Pack", "Snacks", 15, 12, 85.0, 102.0, 6.0, "pack"),
            ("SKU-MDH-100G", "MDH Deggi Mirch Red Chilli Powder 100g", "Spices & Salt", 14, 10, 74.0, 92.0, 3.5, "box"),
            ("SKU-BUTTER-100G", "Amul Pasteurized Butter 100g", "Dairy", 8, 25, 48.0, 58.0, 9.0, "pkt"),
            ("SKU-TEA-250G", "Tata Tea Premium Desh Ki Chai 250g", "Beverages", 19, 12, 115.0, 140.0, 4.0, "box"),
            ("SKU-SURF-1KG", "Surf Excel Easy Wash Detergent Powder 1kg", "Household", 18, 10, 118.0, 142.0, 3.0, "bag"),
            ("SKU-SUGAR-1KG", "Madhur Pure & Hygienic Sugar 1kg", "Grocery", 30, 20, 42.0, 49.0, 9.0, "kg"),
            ("SKU-RICE-5KG", "India Gate Basmati Rice Feast Rozzana 5kg", "Flour & Grains", 10, 12, 380.0, 460.0, 3.0, "bag")
        ]

        products = []
        for sku, name, cat, stock, reorder, cp, sp, demand, unit in products_data:
            p = Product(
                sku=sku, name=name, category=cat, stock_quantity=stock,
                reorder_point=reorder, cost_price=cp, selling_price=sp,
                avg_daily_demand=demand, unit=unit
            )
            db.add(p)
            products.append(p)
        db.commit()

        # 3. Customers (80 customers: 25 Active, 42 Inactive 14+ days, 13 High-Value VIP)
        first_names = [
            "Aarav", "Amit", "Pooja", "Rajesh", "Sunita", "Vikram", "Neha", "Rahul",
            "Anjali", "Sanjay", "Deepak", "Meena", "Rohan", "Priya", "Manish", "Kavita",
            "Suresh", "Geeta", "Arun", "Shweta", "Ajay", "Kiran", "Nitin", "Bhavna",
            "Gaurav", "Preeti", "Alok", "Divya", "Kamal", "Ritu", "Harish", "Asha",
            "Vikas", "Suman", "Manoj", "Reena", "Ashok", "Pinki", "Dinesh", "Usha"
        ]
        last_names = ["Sharma", "Gupta", "Verma", "Singh", "Kumar", "Agrawal", "Mishra", "Jain", "Bansal", "Yadav"]

        customers = []
        now = datetime.now()

        # 42 Inactive customers (last visit 14-30 days ago) - exact match to Slide 5 & 8
        for i in range(42):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            name = f"{fname} {lname}"
            days_ago = random.randint(14, 28)
            last_visit = now - timedelta(days=days_ago, hours=random.randint(2, 8))
            first_visit = last_visit - timedelta(days=random.randint(30, 90))
            visits = random.randint(4, 12)
            spend = round(visits * random.uniform(220, 580), 2)
            c = Customer(
                name=name,
                phone=f"+91 98{random.randint(10000000, 99999999)}",
                segment="Inactive 14+ Days",
                first_visit=first_visit,
                last_visit=last_visit,
                days_inactive=days_ago,
                total_visits=visits,
                total_spend=spend,
                churn_risk=round(random.uniform(0.72, 0.94), 2),
                preferred_hour=random.choice([17, 18, 19, 20])
            )
            db.add(c)
            customers.append(c)

        # 25 Active customers (last visit 0-3 days ago)
        for i in range(25):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            name = f"{fname} {lname}"
            days_ago = random.randint(0, 3)
            last_visit = now - timedelta(days=days_ago, hours=random.randint(1, 10))
            first_visit = last_visit - timedelta(days=random.randint(20, 120))
            visits = random.randint(8, 26)
            spend = round(visits * random.uniform(180, 480), 2)
            c = Customer(
                name=name,
                phone=f"+91 97{random.randint(10000000, 99999999)}",
                segment="Active",
                first_visit=first_visit,
                last_visit=last_visit,
                days_inactive=days_ago,
                total_visits=visits,
                total_spend=spend,
                churn_risk=round(random.uniform(0.08, 0.28), 2),
                preferred_hour=random.choice([9, 10, 11, 12, 17, 18, 20])
            )
            db.add(c)
            customers.append(c)

        # 13 High-Value VIP customers
        for i in range(13):
            fname = random.choice(first_names)
            lname = random.choice(last_names)
            name = f"{fname} {lname}"
            days_ago = random.randint(0, 5)
            last_visit = now - timedelta(days=days_ago, hours=random.randint(1, 6))
            first_visit = last_visit - timedelta(days=random.randint(90, 240))
            visits = random.randint(28, 65)
            spend = round(visits * random.uniform(450, 950), 2)
            c = Customer(
                name=name,
                phone=f"+91 99{random.randint(10000000, 99999999)}",
                segment="High-Value VIP",
                first_visit=first_visit,
                last_visit=last_visit,
                days_inactive=days_ago,
                total_visits=visits,
                total_spend=spend,
                churn_risk=round(random.uniform(0.04, 0.18), 2),
                preferred_hour=random.choice([18, 19, 20])
            )
            db.add(c)
            customers.append(c)

        db.commit()

        # 4. Generate 600+ Transactions over 30 days
        # Previous 3 weeks: average daily revenue ~₹18,500
        # Current week: average daily revenue ~₹15,910 (exactly ~14.0% drop!)
        # The decline is concentrated in evening hours (5-8 PM / 17:00-20:00) where repeat customers dropped!
        payment_methods = ["Paytm Soundbox QR", "Paytm Soundbox QR", "Paytm Soundbox QR", "Paytm Card POS", "Paytm UPI"]
        
        all_customers = db.query(Customer).all()
        all_products = db.query(Product).all()

        txn_count = 0
        for day_offset in range(29, -1, -1):
            day_date = now - timedelta(days=day_offset)
            is_current_week = (day_offset < 7)

            # Normal target transactions per day: 22-28; current week: 18-23
            txns_in_day = random.randint(18, 23) if is_current_week else random.randint(23, 29)

            for t_idx in range(txns_in_day):
                # Choose hour
                if is_current_week:
                    # In current week, fewer transactions between 17 and 20 (5-8 PM)
                    hour_weights = [1, 1, 1, 1, 2, 4, 8, 12, 14, 15, 12, 10, 8, 8, 9, 10, 11, 6, 7, 7, 10, 8, 4, 1]
                else:
                    # Normal pattern: strong evening rush at 5-8 PM (17:00-20:00)
                    hour_weights = [1, 1, 1, 1, 2, 4, 8, 12, 14, 15, 12, 10, 8, 8, 9, 10, 11, 16, 18, 17, 12, 8, 4, 1]
                
                chosen_hour = random.choices(range(24), weights=hour_weights, k=1)[0]
                minute = random.randint(0, 59)
                second = random.randint(0, 59)
                txn_time = day_date.replace(hour=chosen_hour, minute=minute, second=second)

                # Select customer (or walk-in)
                if random.random() < 0.70:
                    cust = random.choice(all_customers)
                    cust_id = cust.id
                    cust_name = cust.name
                else:
                    cust_id = None
                    cust_name = "Walk-in Customer"

                # Pick 1 to 4 items
                cart_items = random.sample(all_products, k=random.randint(1, 3))
                amount = 0.0
                items_summary = []
                for p in cart_items:
                    qty = random.randint(1, 2)
                    item_total = p.selling_price * qty
                    amount += item_total
                    items_summary.append({"name": p.name, "qty": qty, "price": p.selling_price})
                
                amount = round(amount, 2)
                method = random.choice(payment_methods)

                order_code = f"PTM-{txn_time.strftime('%Y%m%d')}-{day_offset:02d}{t_idx:02d}-{txn_count:04d}"
                txn = Transaction(
                    order_id=order_code,
                    customer_id=cust_id,
                    customer_name=cust_name,
                    amount=amount,
                    payment_method=method,
                    timestamp=txn_time,
                    items_json=json.dumps(items_summary),
                    status="SUCCESS"
                )
                db.add(txn)
                txn_count += 1

        db.commit()

        # 5. Core Recommendations matching Hackathon Pitch Deck
        r1 = Recommendation(
            category="INACTIVE_CUSTOMERS",
            title="₹20 Comeback Offer for Inactive Customers",
            trigger_reason="42 repeat customers have been inactive for 14+ days, driving the 14% revenue decline during 5–8 PM.",
            suggested_action="Create and blast a ₹20 Instant Discount Voucher valid on orders above ₹150 for 5–8 PM visits.",
            action_type="DISCOUNT_CAMPAIGN",
            action_payload_json=json.dumps({
                "coupon_code": "COMEBACK20",
                "discount_amount": 20,
                "min_order_value": 150,
                "valid_window": "5:00 PM - 8:00 PM",
                "target_count": 42,
                "channel": "Paytm SMS & WhatsApp Notification"
            }),
            potential_gain="+₹7,500 to ₹10,000 projected recovered weekly sales",
            status="PENDING",
            created_at=now
        )
        db.add(r1)

        r2 = Recommendation(
            category="INVENTORY_STOCKOUT",
            title="Critical Stockout Alert: Amul Milk 500ml & Aashirvaad Atta",
            trigger_reason="Amul Taaza Milk has only 12 packets remaining (depletes in 12 hours) and Atta has only 6 bags remaining.",
            suggested_action="Auto-generate and dispatch supplier Purchase Order (PO) to Amul Delhi Depot & ITC Distributor.",
            action_type="RESTOCK_PO",
            action_payload_json=json.dumps({
                "po_number": "PO-AMUL-2026-091",
                "items": [
                    {"name": "Amul Taaza Milk 500ml", "reorder_qty": 50, "cost": 1300},
                    {"name": "Aashirvaad Shudh Chakki Atta 5kg", "reorder_qty": 15, "cost": 3300}
                ],
                "total_estimated_cost": 4600,
                "supplier": "Metro Wholesalers North Delhi"
            }),
            potential_gain="Prevents ~₹4,200 lost sales and customer walk-aways",
            status="PENDING",
            created_at=now - timedelta(hours=3)
        )
        db.add(r2)

        r3 = Recommendation(
            category="PEAK_HOUR_PROMO",
            title="Evening Rush Soundbox Announcement",
            trigger_reason="Broadcast voice alert on Paytm Soundbox 4.0 announcing today's evening specials between 5–8 PM.",
            suggested_action="Activate Soundbox Audio Broadcast: 'Aaj sham payiye Kirana Store par vishesh chhoot!'",
            action_type="SOUNDBOX_ANNOUNCEMENT",
            action_payload_json=json.dumps({
                "broadcast_text": "Paytm Saathi Alert: Sharma Kirana par aaj shaam 5 se 8 baje paayen ₹20 tak ki chhoot!",
                "audio_language": "Hindi",
                "soundbox_id": "SB4-DEL-98214"
            }),
            potential_gain="+18% walk-in footfall during evening hours",
            status="PENDING",
            created_at=now - timedelta(hours=6)
        )
        db.add(r3)

        # 6. Pre-existing Verified Controlled Action (to show Track Record in Action Center)
        past_action = ControlledAction(
            action_type="DISCOUNT_CAMPAIGN",
            title="Weekend Morning Tea & Biscuit Combo Offer",
            description="Broadcasted ₹10 off on Parle-G + Tata Tea combo via SMS to 35 morning shoppers.",
            target_audience="Morning Shoppers (8 AM - 11 AM)",
            discount_code="CHAI10",
            status="VERIFIED",
            approved_by="Ramesh Sharma",
            created_at=now - timedelta(days=5),
            reach_count=35,
            redemptions_count=21,
            revenue_lift=3850.0,
            verification_notes="Verified via Paytm Soundbox logs: 21 redemptions recorded, +₹3,850 additional basket revenue."
        )
        db.add(past_action)

        # 7. Initial Copilot Welcome Logs
        welcome_user = CopilotChatLog(
            role="assistant",
            message="Namaste Ramesh ji! 🙏 Main aapka Paytm Saathi AI hoon. Pichle hafte se aapki sales 14% kam hui hai, khaaskar shaam 5 se 8 baje ke dauraan. Aap mujhse pooch sakte hain: 'Meri sales pichle week se kam kyun hai?' ya 'Kya karna chahiye?'",
            language="hinglish",
            timestamp=now - timedelta(minutes=10)
        )
        db.add(welcome_user)

        db.commit()
        print(f"Database seeded successfully! Created {txn_count} transactions, {len(products)} products, {len(customers)} customers.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
