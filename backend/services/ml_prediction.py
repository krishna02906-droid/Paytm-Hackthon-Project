import numpy as np
from datetime import datetime, timedelta
from sklearn.linear_model import LinearRegression
from sqlalchemy.orm import Session
from backend.models import Product, Customer, Transaction

def get_demand_forecasts(db: Session):
    products = db.query(Product).all()
    forecast_results = []
    
    # Simulate time-series trend fitting for each product
    days = np.array(range(1, 15)).reshape(-1, 1)

    for p in products:
        # Base daily demand with slight realistic variance
        base_demand = p.avg_daily_demand
        historical_sales = base_demand + np.sin(days.flatten() * 0.5) * 1.5 + np.random.normal(0, 0.4, len(days))
        historical_sales = np.maximum(historical_sales, 0.5)

        # Fit linear model to identify if demand is accelerating
        model = LinearRegression()
        model.fit(days, historical_sales)

        # Predict next 7 days
        future_days = np.array(range(15, 22)).reshape(-1, 1)
        predictions = model.predict(future_days)
        predictions = [max(0.5, round(float(val), 1)) for val in predictions]

        # Calculate stockout ETA
        current_stock = p.stock_quantity
        total_pred_7d = sum(predictions)
        avg_predicted_daily = total_pred_7d / 7.0

        if avg_predicted_daily > 0:
            days_left = round(current_stock / avg_predicted_daily, 1)
        else:
            days_left = 99.0

        is_critical = days_left <= 2.0
        reorder_suggested = current_stock <= p.reorder_point or is_critical

        forecast_results.append({
            "product_id": p.id,
            "sku": p.sku,
            "name": p.name,
            "category": p.category,
            "current_stock": p.stock_quantity,
            "unit": p.unit,
            "reorder_point": p.reorder_point,
            "cost_price": p.cost_price,
            "selling_price": p.selling_price,
            "historical_daily_avg": round(base_demand, 1),
            "predicted_next_7d_total": round(total_pred_7d, 1),
            "days_of_stock_remaining": days_left,
            "stockout_status": "CRITICAL" if days_left <= 1.5 else ("WARNING" if is_critical else "HEALTHY"),
            "reorder_suggested": reorder_suggested,
            "suggested_reorder_qty": max(0, int(avg_predicted_daily * 10 - current_stock)),
            "daily_forecast": predictions
        })

    # Sort so critical stockout items are first
    forecast_results.sort(key=lambda x: x["days_of_stock_remaining"])
    return forecast_results

def get_customer_churn_analysis(db: Session):
    customers = db.query(Customer).all()
    
    # Calculate churn cohorts and recovery potential
    inactive_cohort = [c for c in customers if c.segment == "Inactive 14+ Days"]
    active_cohort = [c for c in customers if c.segment == "Active"]
    vip_cohort = [c for c in customers if c.segment == "High-Value VIP"]

    avg_inactive_spend = (
        sum(c.total_spend for c in inactive_cohort) / len(inactive_cohort)
        if inactive_cohort else 0.0
    )
    potential_recovered_revenue = round(len(inactive_cohort) * (avg_inactive_spend / 4.0), 2)

    return {
        "total_analyzed": len(customers),
        "inactive_count": len(inactive_cohort),
        "active_count": len(active_cohort),
        "vip_count": len(vip_cohort),
        "potential_recovered_revenue": potential_recovered_revenue,
        "recommended_discount_inr": 20,
        "inactive_list": [
            {
                "id": c.id,
                "name": c.name,
                "phone": c.phone,
                "days_inactive": c.days_inactive,
                "total_visits": c.total_visits,
                "total_spend": round(c.total_spend, 2),
                "churn_risk_pct": int(c.churn_risk * 100),
                "preferred_hour": f"{c.preferred_hour:02d}:00"
            }
            for c in sorted(inactive_cohort, key=lambda x: x.days_inactive, reverse=True)[:15]
        ]
    }
