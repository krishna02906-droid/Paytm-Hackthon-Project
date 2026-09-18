# PAYTM SAATHI AI
### AI Business Partner for Every Merchant
**Paytm Hackathon — Track 1: Merchant Growth AI**

> *"From Transactions → Insights → Decisions → Actions → Growth"*  
> *"Saathi doesn't just tell merchants what happened. It helps them decide what to do next."*

---

## 🌟 Pitch Deck Slide Mapping

| Slide | Concept in Pitch Deck | Implementation in Paytm Saathi App |
|---|---|---|
| **Slide 1** | **Title & Vision** | Full-stack platform: Merchant → Mobile → AI → Growth |
| **Slide 2** | **The Problem** | Solves Data Overload, Inventory Uncertainty, Inactive Customer Churn |
| **Slide 3** | **The Solution** | 5-Step Closed Loop: **UNDERSTAND ➔ ANALYSE ➔ PREDICT ➔ RECOMMEND ➔ ACT ➔ VERIFY** |
| **Slide 4** | **Key Features** | Copilot (Hindi/Hinglish/English voice), Sales Intelligence, Scikit-learn Demand Forecast, Customer Cohorts, Soundbox 4.0 Voice Alerts |
| **Slide 5** | **Our USP / Innovation** | Closed loop: AI detects 14% drop ➔ Investigates 5–8 PM & inactive repeat customers ➔ Recommends ₹20 comeback offer ➔ Merchant approves ➔ Dispatches offer & logs ROI |
| **Slide 6** | **AI & Tech Stack** | FastAPI + SQLite + Scikit-Learn + React + Vite + Web Speech STT/TTS |
| **Slide 7** | **System Architecture** | Merchant ➔ Copilot ➔ Specialized AI engines ➔ Human Approval ➔ Controlled Tools |
| **Slide 8** | **Live Demo Flow** | Exact multi-turn conversation in Copilot: *"Meri sales pichle week se kam kyun hai?"* ➔ *"Kya karna chahiye?"* ➔ *"Offer bana do"* ➔ Dispatches & tracks results |
| **Slide 9** | **Impact & Benefits** | Action Center tracks live redemptions and recovered revenue (+₹7,500+) |
| **Slide 10** | **Conclusion** | Proactive, Personalised, Accessible (Hinglish Voice), Action-Oriented, Responsible |

---

## 🏗️ Architecture & File Structure

```
Paytm_Project/
├── backend/
│   ├── main.py                  # FastAPI server with all endpoints
│   ├── database.py              # SQLite + SQLAlchemy connection
│   ├── models.py                # Database schema (Merchants, Products, Customers, Txns, Actions)
│   ├── seed_data.py             # 700+ realistic Paytm transactions, 80 customers, 12 products
│   ├── requirements.txt         # Python dependencies
│   └── services/
│       ├── copilot_service.py   # AI Copilot engine with Hinglish intent parser & action card generator
│       ├── analytics_service.py # Real-time sales analytics, 5–8 PM drop diagnosis & hourly charts
│       ├── ml_prediction.py     # Scikit-learn demand forecasting, stockout ETA & churn scoring
│       └── action_service.py    # Controlled AI execution layer & live ROI verification
├── frontend/
│   ├── index.html               # App entry with Outfit & Inter typography
│   ├── vite.config.js           # Vite dev server with proxy to backend
│   ├── package.json             # React dependencies
│   └── src/
│       ├── App.jsx              # Master dashboard
│       ├── index.css            # Paytm Dark Navy (#002970) + Cyan (#00BAF2) styling
│       ├── services/
│       │   └── api.js           # API communication client
│       └── components/
│           ├── Navbar.jsx       # Header, Soundbox status, Store selector, Language switcher
│           ├── StepperLoop.jsx  # Interactive 6-step loop visualization
│           ├── CopilotChat.jsx  # AI Copilot with Voice Mic (STT), Audio (TTS) & Action Cards
│           ├── SalesIntelligence.jsx # Anomaly banner & hourly comparison chart
│           ├── DemandPrediction.jsx  # Scikit-learn demand forecast & Supplier PO generator
│           ├── CustomerRetention.jsx # Inactive cohort segmentation & Comeback Campaign launcher
│           ├── ActionCenter.jsx # Controlled Action logs & live ROI verification
│           └── SoundboxWidget.jsx    # Interactive Paytm Soundbox 4.0 simulator with audio
├── run_app.bat                  # One-click startup for both Backend & Frontend
└── README.md
```

---

## 🚀 How to Run

### 1. Start Backend & Frontend in 1 Click
Double-click `run_app.bat` in the root folder, or run:

```bash
# Terminal 1: Backend
python -m uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload

# Terminal 2: Frontend
cd frontend
npm.cmd run dev
```

### 2. Access the Application
- **Frontend Dashboard**: [http://localhost:5173](http://localhost:5173)
- **FastAPI Interactive Swagger Docs**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

---

## 🎯 Running the Slide 8 Live Hackathon Demo

1. Open the app at `http://localhost:5173`.
2. In the **AI Merchant Copilot** tab:
   - Click the prompt chip or speak: *"Meri sales pichle week se kam kyun hai?"*
   - Saathi explains the 14% drop, highlights the 5:00 PM – 8:00 PM evening slump, and notes 42 inactive customers.
   - Click or speak: *"Kya karna chahiye?"*
   - Saathi recommends a **₹20 Comeback Offer** and presents an interactive Action Card.
   - Click **[Approve & Launch Offer]** on the card.
   - Confetti triggers, the action is dispatched via controlled AI tools, and the notification is confirmed.
3. Switch to the **Action Center & Verification** tab:
   - Click **[Verify Live Impact]** to see real-time customer redemptions and recovered revenue (+₹7,420+).
4. Test the **Paytm Soundbox 4.0** widget at the bottom:
   - Click *"Play Payment Chime (₹20)"* to hear audible confirmation in Hindi: *"Paytm par bees rupaye prapt hue"*.
