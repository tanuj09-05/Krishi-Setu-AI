# KrishiSetu AI (कृषी सेतू) 🌾🤖
**Smart India Hackathon Problem Statement 26132: "Strengthening market linkages and price discovery for farmers"**

> **Core Recommendation Principle**: Helping farmers determine:  
> **"WHEN + WHERE + TO WHOM should I sell my crop to maximize NET REALIZATION?"**

$$\mathbf{Net\ Realization = Gross\ Offered\ Price - Transport\ Freight - Storage\ Cost - Mandi\ Cess/Brokerage}$$

---

## 🔐 Demo Accounts & Authentication Credentials

| Role | Email / Username | Phone Number | Password | Profile & Description |
|---|---|---|---|---|
| **👨‍🌾 Farmer** | `farmer@demo.krishisetu` | `9823012345` | `Demo@123` | **Rameshwar Patil** (Dindori, Nashik) — Create lots, manage harvests, review AI recommendations, accept buyer bids, track payouts. |
| **🏢 Buyer** | `buyer@demo.krishisetu` | `9823098765` | `Demo@123` | **Reliance Retail Sourcing Hub (Buyer A)** — Post crop demand, view available farmer lots, submit price offers, fund escrow. |
| **🏛️ FPO** | `fpo@demo.krishisetu` | `9823055555` | `Demo@123` | **Sahyadri Farmers Producer Co.** — Aggregate member lots, negotiate bulk corporate contracts, coordinate freight. |
| **🛡️ Admin** | `admin@demo.krishisetu` | `9823000000` | `Demo@123` | **System Administrator** — Manage mandis, calibrate price algorithms, audit escrow settlements, resolve disputes. |

> **Tip**: You can switch roles instantly in 1-click using the **Role Switcher** in the top navigation bar!

---

## 🏗️ Architecture Overview

```
Krishi Setu AI/
├── backend/                    # Python / Django / Django REST Framework
│   ├── config/                 # Settings, API v1 URLs, WSGI, ASGI
│   ├── accounts/               # Custom User model (FARMER, FPO, BUYER, ADMIN), Token & OTP Auth
│   ├── farmers/                # Farmer Profile, Acreage, Harvest Inventory
│   ├── crops/                  # Crop Catalog, Shelf Life, Quality Grades
│   ├── markets/                # APMC Mandis, Historical Modal Prices, Arrival Surges
│   ├── buyers/                 # Verified Institutional Buyers, Active Demand Board
│   ├── lots/                   # Digital Lots, Visual Quality Grading, Live Bids & Offers
│   ├── recommendations/        # Explainable AI Recommendation Engine (Multi-factor Net Scoring)
│   ├── logistics/              # Rural Fleet (Tata Ace, Bolero Maxi, Eicher), Freight Rates
│   ├── transactions/           # Safe Agri-Escrow, Strict Backend Net Realization Calculations
│   ├── core/                   # Seed demo data management commands
│   ├── requirements.txt        # Python backend dependencies
│   └── .env.example            # Environment configuration template
│
└── src/                        # Next.js 14 / TypeScript / Tailwind CSS Frontend (Phase 1)
    ├── app/                    # 11 full screens (Dashboard, Recommendations, Markets, Lots, Buyers, etc.)
    ├── components/             # Reusable UI widgets, Net realization calculators, charts
    ├── lib/api.ts              # API client connecting Next.js to Django backend (/api/v1/)
    └── services/               # Frontend service layer with live API integration & graceful fallback
```

---

## ⚡ Quickstart Setup Guide

### 1. Backend Setup (Django)

```bash
# Navigate to project root
cd "d:/Krishi Setu AI"

# 1. Create and activate virtual environment
python -m venv backend/venv
# Windows:
backend\venv\Scripts\activate
# Linux/macOS:
source backend/venv/bin/activate

# 2. Install backend dependencies
pip install -r backend/requirements.txt

# 3. Create .env from example (configured for SQLite by default, PostgreSQL ready)
cp backend/.env.example backend/.env

# 4. Run database migrations
python backend/manage.py migrate

# 5. Seed realistic Indian agricultural demo data (Nashik-Pune Tomato 500kg scenario)
python backend/manage.py seed_demo_data

# 6. Run automated test suite (16 tests verifying Net Realization & financial formulas)
python backend/manage.py test accounts farmers crops markets buyers lots recommendations logistics transactions

# 7. Start Django development server
python backend/manage.py runserver 8000
```

### 2. Frontend Setup (Next.js)

```bash
# In a separate terminal
npm install
npm run dev
```

Visit:
- **Frontend App**: `http://localhost:3000`
- **Django REST API**: `http://localhost:8000/api/v1/`
- **Django Admin Panel**: `http://localhost:8000/admin/`

---

## 📊 Database Models & Schema Summary

| App / Domain | Model | Key Fields & Formulas |
|---|---|---|
| **accounts** | `User` | `phone_number` (unique index), `name`, `role` (FARMER, FPO, BUYER, ADMIN), `preferred_language` |
| **farmers** | `FarmerProfile` | `user`, `district`, `state`, `farm_size_acres`, `organization_fpo`, `trust_score` (94%), `kyc_verified` |
| **farmers** | `FarmerCrop` | `farmer`, `crop`, `quantity`, `harvest_date`, `expected_price`, `quality_grade` |
| **crops** | `Crop` | `name`, `crop_category`, `unit`, `icon`, `default_shelf_life_days` |
| **markets** | `Market` | `name`, `type` (MANDI, PROCESSOR, BUYER), `distance_km_default`, `market_fee_percent`, `weighment_cost_per_kg` |
| **markets** | `MarketPrice` | `market`, `crop`, `date`, `modal_price`, `arrival_volume`, `arrival_trend` (Indexed on `[crop, market, date]`) |
| **buyers** | `Buyer` | `business_name`, `buyer_type`, `procurement_hub`, `payment_reliability_score`, `payment_terms` |
| **buyers** | `BuyerDemand` | `buyer`, `crop`, `required_quantity`, `offered_price`, `minimum_quality`, `status` |
| **lots** | `DigitalLot` | `lot_number`, `farmer`, `crop`, `quantity`, `quality_grade`, `asking_price`, `status` |
| **lots** | `Offer` | `lot`, `buyer`, `offered_price`, `estimated_transport_per_kg`, `status` (PENDING, ACCEPTED, COUNTERED) |
| **recommendations**| `MarketRecommendation` | `farmer`, `crop`, `expected_price`, `estimated_transport_per_kg`, `estimated_net_realization_per_kg`, `confidence_score`, `explanation` (JSON) |
| **logistics** | `Logistics` | `tracking_number`, `pickup_location`, `destination`, `distance_km`, `estimated_transport_cost`, `cost_per_kg` |
| **transactions** | `Transaction` | $\mathbf{Gross = Price \times Qty}$, $\mathbf{Net = Gross - Transport - Storage - Other}$, `payment_status` (IN_ESCROW, SETTLED) |

---

## 🌐 REST API Endpoints Overview (`/api/v1/`)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register/` | Register new Farmer, FPO, or Buyer |
| `POST` | `/api/v1/auth/login/` | Phone + password / OTP authentication |
| `GET` | `/api/v1/auth/me/` | Authenticated user profile |
| `GET`/`PUT` | `/api/v1/farmer/profile/` | Fetch or update farmer farm details & trust score |
| `GET` | `/api/v1/crops/` | Crop catalog & categories |
| `GET` | `/api/v1/markets/` | Active APMC mandis & collection hubs |
| `GET` | `/api/v1/markets/prices/` | Historical modal prices & arrival volumes |
| `GET` | `/api/v1/markets/compare/` | Side-by-side Net Realization comparison matrix |
| `GET` | `/api/v1/buyers/` | Verified institutional buyer directory |
| `GET` | `/api/v1/buyers/demand/` | Live buyer procurement demand board |
| `GET`/`POST`| `/api/v1/lots/` | List and create digital lots |
| `GET`/`PUT` | `/api/v1/lots/{id}/` | Retrieve or update lot details |
| `POST` | `/api/v1/lots/offers/` | Submit buyer proposal on digital lot |
| `PATCH` | `/api/v1/lots/offers/{id}/` | Accept, Counter-offer, or Reject (triggers deal locking & escrow) |
| `POST`/`GET`| `/api/v1/recommendations/`| On-demand explainable AI sale recommendations |
| `GET` | `/api/v1/recommendations/latest/`| Latest AI recommendation for farmer |
| `GET`/`POST`| `/api/v1/logistics/` | List and book rural transport carriers |
| `GET` | `/api/v1/logistics/vehicles/` | Standard vehicle rates (Tata Ace, Bolero Maxi, Eicher) |
| `GET` | `/api/v1/transactions/` | Settled and in-escrow payment transactions |
| `GET` | `/api/v1/transactions/{id}/` | Transaction timeline and gross vs net receipt |

---

## 🧪 Automated Testing

Run all 16 test suites verifying strict backend formulas and business logic:

```bash
backend\venv\Scripts\python backend/manage.py test accounts farmers crops markets buyers lots recommendations logistics transactions
```

### Key Tested Scenarios:
1. **Financial Formula**: Price = ₹24/kg, Qty = 500kg, Transport = ₹750, Storage = ₹250 $\rightarrow$ Gross = ₹12,000, Net = ₹11,000.
2. **Recommendation Engine**: Option B (Reliance Hub ₹24 gross - ₹1.50 transport = **₹22.50 Net**) is strictly chosen over Option C (Azadpur Delhi ₹26 gross - ₹4 transport = **₹22.00 Net**) and Option A (Local Mandi ₹21 gross - ₹0.50 transport = **₹20.50 Net**).
3. **Offer Acceptance & Deal Locking**: Accepting an offer locks the lot and generates a secure escrow transaction on the backend.
